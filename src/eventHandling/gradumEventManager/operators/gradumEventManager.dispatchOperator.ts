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
 * @description Dispatches Gradum events along the composed path. It runs two sequential passes over that
 * same path: a capture pass from the outermost entry down to the event target, then a bubble pass back up.
 * The capture pass reaches only listeners bound with `capture: true`. The bubble pass reaches every other
 * listener — `@listener` methods and those bound with `gradum(el).on()` — and is the only pass that runs
 * tool `@behavior` methods. Each pass stops early when a handler returns anything other than
 * `Propagation.propagate`.
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

    /**
     * @private
     * @function expandPath
     * @description Splice the objects reported by any {@link GradumSelector.hitResolver} in the path into the
     * path itself, so things an element merely paints — shapes on a canvas — are dispatched to like children
     * of it. Hits land at lower indices than the element that reported them, which is what gives them the
     * right position in both passes: capture descends into them last, bubble reaches them first.
     *
     * Each hit is given the reporting element as its {@link GradumSelector.hitParent} unless it already names
     * one, so climbing back out works without the scene having to track parentage.
     * @param {EventTarget[]} path - The path to expand, from {@link Event.composedPath} or a z-stack.
     * @param {Event} event - The event being dispatched, passed on to the resolvers.
     * @returns {object} The expanded path, and the set of entries that were contributed. Returns `path`
     * itself when no resolver contributed anything, so dispatch is untouched for everyone not using this.
     */
    private expandPath(path: readonly EventTarget[], event: Event): {path: readonly object[], hits: object[]} {
        const position = event instanceof GradumEvent ? event.position : undefined;
        if (!position) return {path, hits: []};

        let expanded: object[];
        const hits: object[] = [];

        //A drag stays with what it grabbed. The hits were resolved once at the drag origin, so re-running the
        //resolver at the current pointer would hand the drag to whatever is underneath now. Move events are
        //deliberately excluded: hovering wants what is under the cursor, not what was grabbed.
        const sticky = event instanceof GradumDragEvent
            && event.eventName !== GradumMoveEventName.move
            && this.model.lastOriginHits?.size > 0;

        for (let i = 0; i < path.length; i++) {
            const entry = path[i];
            const resolver = entry instanceof Node ? gradum(entry).hitResolver : undefined;
            const resolved = !resolver ? []
                : sticky && this.model.lastOriginHits.has(entry as Node) ? this.model.lastOriginHits.get(entry as Node)
                    : resolver(position, event) ?? [];

            if (resolved.length === 0) {
                expanded?.push(entry);
                continue;
            }
            //First contribution: catch the output up to everything skipped so far.
            expanded ??= path.slice(0, i);

            for (const hit of resolved) {
                if (!hit || typeof hit !== "object") continue;
                //Wrapped raw: gradum() otherwise unwraps any object carrying an `element` field, which is
                //right for an MVC piece but would silently bind a scene object's parentage to whatever it
                //happens to keep under that name.
                if (!gradum(hit, true).hitParent) gradum(hit, true).hitParent = entry;
                hits.push(hit);
                expanded.push(hit);
            }
            expanded.push(entry);
        }

        return {path: expanded ?? path, hits};
    }

    private getToolHandlingCallback(type: string, e: Event) {
        const toolName = this.element.getCurrentToolName(this.model.currentClick);

        // For move events, composedPath() is the drag-origin's ancestor chain and never
        // includes non-topmost components at the current cursor (e.g. Playback behind
        // ClipRenderer). Use the full z-stack at the cursor instead, dispatching topmost-first
        // and stopping at the first handler that returns non-propagate.
        if (type === GradumMoveEventName.move && e instanceof GradumDragEvent && e.position) {
            const {x, y} = e.position;
            const stack = this.expandPath(document.elementsFromPoint?.(x, y) ?? [], e);
            this.recordHits(e, stack);
            for (const el of stack.path) {
                if (!this.isDispatchable(el, stack)) continue;
                const propagate = gradum(el as Node).executeAction(type, toolName, e, undefined, this.element);
                if (propagate !== Propagation.propagate) break;
            }
            return;
        }

        const expanded = this.expandPath(e.composedPath?.() || [], e);
        this.recordHits(e, expanded);
        const path = expanded.path;

        for (let i = path.length - 1; i >= 0; i--) {
            if (!this.isDispatchable(path[i], expanded)) continue;
            const propagate = gradum(path[i] as Node).executeAction(type, toolName, e, {capture: true}, this.element);
            if (propagate !== Propagation.propagate) {
                e.stopPropagation();
                break;
            }
        }

        for (let i = 0; i < path.length; i++) {
            if (!this.isDispatchable(path[i], expanded)) continue;
            const propagate = gradum(path[i] as Node).executeAction(type, toolName, e, undefined, this.element);
            if (propagate !== Propagation.propagate) {
                e.stopPropagation();
                break;
            }
        }
    }

    /**
     * @private
     * @description Whether a path entry should be dispatched to. Nodes always are; anything else only when a
     * hit resolver contributed it, which keeps `Window` — in every composed path, and not a Node — out.
     */
    private isDispatchable(entry: object, expanded: {hits: object[]}): boolean {
        return entry instanceof Node || expanded.hits.includes(entry);
    }

    /**
     * @private
     * @description Hand the expansion to the event, so handlers and {@link GradumEvent.closest} can read what
     * was hit without resolving anything again.
     */
    private recordHits(e: Event, expanded: {path: readonly object[], hits: object[]}) {
        if (!(e instanceof GradumEvent)) return;
        e.dispatchPath = expanded.path;
        e.hits = expanded.hits;
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
