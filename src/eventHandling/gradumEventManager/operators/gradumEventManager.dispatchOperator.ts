import {GradumEventManagerModel} from "../gradumEventManager.model";
import {GradumEventManager} from "../gradumEventManager";
import {ClickMode} from "../gradumEventManager.types";
import {GradumEvent} from "../../events/gradumEvent";
import {GradumRawEventProperties} from "../../events/gradumEvent.types";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {GradumOperator} from "../../../mvc/operator/operator";
import {GradumKeyEventName, GradumMoveEventName} from "../../../types/eventNaming.types";
import {GradumDragEvent} from "../../events/gradumDragEvent";
import {Propagation} from "../../../gradumFunctions/event/event.types";

/**
 * @internal
 * @class GradumEventManagerDispatchOperator
 * @extends GradumOperator
 * @description Dispatches Gradum events along the composed path. It runs two sequential passes: a
 * capture pass from the document down to the target, which invokes tool `@behavior` methods, then a
 * bubble pass back up, which invokes interactor `@listener` methods and `gradum(el).on()` listeners.
 * Each pass stops early when a handler returns anything other than `Propagation.propagate`.
 *
 * *Note: move events are the exception. Their composed path is the drag origin's ancestor chain, which
 * omits elements merely sitting under the cursor, so they are dispatched in a single pass over the
 * z-stack at the pointer instead — topmost first, stopping at the first handler that does not
 * propagate. A move handler therefore sees neither a capture pass nor a bubble pass.*
 */
export class GradumEventManagerDispatchOperator extends GradumOperator<GradumEventManager, any, GradumEventManagerModel> {
    public keyName: string = "dispatch";

    private boundHooks: Map<string, (e: Event) => void> = new Map();

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        this.emitter.add("dispatchEvent", this.dispatchEvent);
    }

    protected dispatchEvent = <
        EventType extends GradumEvent = GradumEvent,
        PropertiesType extends GradumRawEventProperties = GradumRawEventProperties
    >(target: Node, eventType: new (properties: PropertiesType) => EventType, properties: Partial<PropertiesType>) => {
        if (!target) return;
        properties.keys = this.model.currentKeys;
        properties.toolName = this.element.getCurrentToolName(this.model.currentClick) as string;
        properties.clickMode = this.model.currentClick;
        properties.inputDevice = this.model.inputDevice;
        properties.eventManager = this.element;
        properties.eventInitDict = {bubbles: true, cancelable: true, composed: true};

        properties.authorizeScaling = this.element.authorizeEventScaling;
        properties.scalePosition = this.element.scaleEventPosition;

        if (properties.eventName === GradumKeyEventName.keyPressed) this.element.setToolByKey(properties["keyPressed"]);
        else if (properties.eventName === GradumKeyEventName.keyReleased) this.element.setTool(undefined, ClickMode.key, {select: false});

        target.dispatchEvent(new eventType(properties as PropertiesType));
    }

    private getToolHandlingCallback(type: string, e: Event) {
        const toolName = this.element.getCurrentToolName(this.model.currentClick);

        // For move events, composedPath() is the drag-origin's ancestor chain and never
        // includes non-topmost components at the current cursor (e.g. Playback behind
        // ClipRenderer). Use the full z-stack at the cursor instead, dispatching topmost-first
        // and stopping at the first handler that returns non-propagate.
        if (type === GradumMoveEventName.move && e instanceof GradumDragEvent && e.position) {
            const {x, y} = e.position;
            const stack = document.elementsFromPoint?.(x, y) ?? [];
            for (const el of stack) {
                if (!(el instanceof Node)) continue;
                const propagate = gradum(el as Node).executeAction(type, toolName, e, undefined, this.element);
                if (propagate !== Propagation.propagate) break;
            }
            return;
        }

        const path = e.composedPath?.() || [];

        for (let i = path.length - 1; i >= 0; i--) {
            if (!(path[i] instanceof Node)) continue;
            const propagate = gradum(path[i] as Node).executeAction(type, toolName, e, {capture: true}, this.element);
            if (propagate !== Propagation.propagate) {
                e.stopPropagation();
                break;
            }
        }

        for (let i = 0; i < path.length; i++) {
            if (!(path[i] instanceof Node)) continue;
            const propagate = gradum(path[i] as Node).executeAction(type, toolName, e, undefined, this.element);
            if (propagate !== Propagation.propagate) {
                e.stopPropagation();
                break;
            }
        }
    }

    public setupCustomDispatcher(type: string): void {
        if (this.boundHooks.has(type)) return;
        const hook = (e: Event) => this.getToolHandlingCallback(type, e);
        this.boundHooks.set(type, hook);
        document.addEventListener(type, hook, {capture: true});
    }

    public removeCustomDispatcher(type: string): void {
        const hook = this.boundHooks.get(type);
        if (!hook) return;
        document.removeEventListener(type, hook, {capture: true});
        this.boundHooks.delete(type);
    }
}
