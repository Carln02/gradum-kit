import {GradumOperator} from "../../../mvc/operator/operator";
import {GradumEventManager} from "../gradumEventManager";
import {GradumEventManagerModel} from "../gradumEventManager.model";
import {ActionMode, ClickMode, InputDevice} from "../gradumEventManager.types";
import {Point} from "../../../gradumComponents/datatypes/point/point";
import {GradumMap} from "../../../gradumComponents/datatypes/map/map";
import {GradumEvent} from "../../events/gradumEvent";
import {GradumDragEvent} from "../../events/gradumDragEvent";
import {GradumWheelEvent} from "../../events/gradumWheelEvent";
import {clearCache} from "../../../decorators/cache/cache";
import {GradumEventName, GradumEventNameEntry} from "../../../types/eventNaming.types";

export class GradumEventManagerPointerOperator extends GradumOperator<GradumEventManager, any, GradumEventManagerModel> {
    public keyName = "pointer";

    public pointerDown = (e: PointerEvent) => this.pointerDownFn(e);
    public pointerMove = (e: PointerEvent) => this.pointerMoveFn(e);
    public pointerUp = (e: PointerEvent) => this.pointerUpFn(e);
    public pointerCancel = (e: PointerEvent) => this.pointerCancelFn(e);
    public lostPointerCapture = (e: PointerEvent) => this.lostPointerCaptureFn(e);

    protected pointerDownFn(e: PointerEvent) {
        if (!e.composedPath().includes(this.model.lockState.lockOrigin)) {
            (document.activeElement as HTMLElement)?.blur?.();
            this.element.unlock();
        }
        if (!this.element.enabled) return;

        //Check if it's touch
        const isTouch = e.pointerType === "touch";

        //Prevent default actions (especially useful for touch events on iOS and iPadOS)
        if (this.element.preventDefaultMouse && !isTouch) e.preventDefault();
        if (isTouch && (this.element.preventDefaultTouch || this.element.wheelEventsEnabled)) e.preventDefault();

        //Update input device
        if (isTouch) this.model.inputDevice = InputDevice.touch;
        else if (this.model.inputDevice === InputDevice.unknown || this.model.inputDevice === InputDevice.touch)
            this.model.inputDevice = InputDevice.mouse;

        //Initialize origin & previous position using pointerId
        const id = e.pointerId;
        const position = new Point(e.clientX, e.clientY);
        this.model.origins.set(id, position);
        this.model.previousPositions.set(id, position);

        //Capture this pointer so we keep receiving move/up even if the pointer leaves the element
        const target = document.elementFromPoint(position.x, position.y) as Element;
        if (target) target.setPointerCapture?.(e.pointerId);

        //Update click mode
        this.model.activePointers.add(id);
        this.model.utils.setClickMode(isTouch ? this.model.activePointers.size : e.button, isTouch);

        //Return if click events are disabled
        if (!this.element.clickEventsEnabled) return;

        // Fire click start
        this.fireClick(this.model.origins.first, GradumEventName.clickStart);
        this.model.currentAction = ActionMode.click;

        // Long-press timer
        this.model.utils.setTimer(GradumEventName.longPress, () => {
            if (this.model.currentAction !== ActionMode.click) return;
            this.model.currentAction = ActionMode.longPress;
            this.fireClick(this.model.origins.first, GradumEventName.longPress);
        }, this.model.longPressDuration);
    }

    protected pointerMoveFn(e: PointerEvent) {
        if (!this.element.enabled) return;

        //Check if is touch
        const isTouch = e.pointerType === "touch";

        if (!this.element.moveEventsEnabled && !this.element.dragEventsEnabled
            && !(isTouch && this.element.wheelEventsEnabled)) return;

        //Prevent default actions
        if (this.element.preventDefaultMouse && !isTouch) e.preventDefault();
        if (isTouch && (this.element.preventDefaultTouch || this.element.wheelEventsEnabled)) e.preventDefault();

        //New positions map
        this.model.positions = new GradumMap<number, Point>();

        // Only update the current pointer's position (others remain tracked from prior moves)
        this.model.positions.set(e.pointerId, new Point(e.clientX, e.clientY));

        // Clear cached target origin if not dragging
        if (this.model.currentAction !== ActionMode.drag) this.model.lastTargetOrigin = null;

        //Fire touch scroll/pinch events (2-finger only)
        if (isTouch && this.element.wheelEventsEnabled) {
            const currentPos = new Point(e.clientX, e.clientY);
            const prevPos = this.model.previousPositions.get(e.pointerId);

            if (this.model.activePointers.size === 2 && prevPos) {
                const otherId = [...this.model.activePointers].find(id => id !== e.pointerId);
                const otherPos = this.model.previousPositions.get(otherId);
                if (otherPos) {
                    const prevCenter = Point.midPoint(prevPos, otherPos);
                    const currentCenter = Point.midPoint(currentPos, otherPos);
                    const scrollDelta = currentCenter.sub(prevCenter);
                    const pinchDelta = Point.dist(currentPos, otherPos) - Point.dist(prevPos, otherPos);
                    const centerTarget = document.elementFromPoint(currentCenter.x, currentCenter.y) || document;
                    if (scrollDelta.x !== 0 || scrollDelta.y !== 0)
                        this.emitter.fire("dispatchEvent", centerTarget, GradumWheelEvent, {delta: scrollDelta, eventName: GradumEventName.scroll});
                    if (pinchDelta !== 0)
                        this.emitter.fire("dispatchEvent", centerTarget, GradumWheelEvent, {delta: new Point(0, pinchDelta), eventName: GradumEventName.pinch});
                }
            }
        }

        //Fire move event if enabled
        if (this.element.moveEventsEnabled) this.fireDrag(this.model.positions, GradumEventName.move);

        //If drag events are enabled and user is interacting
        if (this.model.currentAction !== ActionMode.none && this.element.dragEventsEnabled) {
            //Initialize drag
            if (this.model.currentAction !== ActionMode.drag) {
                //Check if any tracked origin moved beyond threshold
                if (!Array.from(this.model.origins.entries()).some(([key, origin]) => {
                    const p = (key === e.pointerId)
                        ? this.model.positions.get(key)
                        : this.model.previousPositions.get(key);
                    return p && Point.dist(p, origin) > this.model.moveThreshold;
                })) {
                    this.model.previousPositions.set(e.pointerId, this.model.positions.get(e.pointerId)!);
                    return;
                }
                //If didn't return --> fire drag start and set action to drag
                clearCache(this);
                this.fireDrag(this.model.origins, GradumEventName.dragStart);
                this.model.currentAction = ActionMode.drag;
            }

            //Fire drag step
            this.fireDrag(this.model.positions);
        }

        //Update previous positions for the moved pointer
        this.model.previousPositions.set(e.pointerId, this.model.positions.get(e.pointerId)!);
    }

    protected pointerUpFn(e: PointerEvent) {
        if (!this.element.enabled) return;

        //Check if is touch
        const isTouch = e.pointerType === "touch";

        //Prevent default actions
        if (this.element.preventDefaultMouse && !isTouch) e.preventDefault();
        if (isTouch && (this.element.preventDefaultTouch || this.element.wheelEventsEnabled)) e.preventDefault();

        //Clear any timer set
        this.model.utils.clearTimer(GradumEventName.longPress);

        //Initialize a new positions map
        this.model.positions = new GradumMap<number, Point>();
        this.model.positions.set(e.pointerId, new Point(e.clientX, e.clientY));

        //If action was drag --> fire drag end
        if (this.model.currentAction === ActionMode.drag && this.element.dragEventsEnabled) {
            this.fireDrag(this.model.positions, GradumEventName.dragEnd);
        }

        //If click events are enabled
        if (this.element.clickEventsEnabled) {
            //If action is click --> fire click
            if (this.model.currentAction === ActionMode.click) {
                this.fireClick(this.model.positions.first, GradumEventName.click);
            }
            //Fire click end
            this.fireClick(this.model.origins.first, GradumEventName.clickEnd);
        }

        //Cleanup for this pointerId only
        this.model.origins.delete(e.pointerId);
        this.model.previousPositions.delete(e.pointerId);
        this.model.activePointers.delete(e.pointerId);

        //If no more active pointers, reset modes
        if (this.model.activePointers.size === 0) {
            this.model.currentAction = ActionMode.none;
            this.model.currentClick = ClickMode.none;
        }
    }

    protected pointerCancelFn(e: PointerEvent) {
        if (!this.model.activePointers.has(e.pointerId)) return;

        this.model.utils.clearTimer(GradumEventName.longPress);

        this.model.positions = new GradumMap<number, Point>();
        this.model.positions.set(e.pointerId, new Point(e.clientX, e.clientY));

        if (this.model.currentAction === ActionMode.drag && this.element.dragEventsEnabled)
            this.fireDrag(this.model.positions, GradumEventName.dragEnd);
        if (this.element.clickEventsEnabled)
            this.fireClick(this.model.origins.first, GradumEventName.clickEnd);

        this.model.origins.delete(e.pointerId);
        this.model.previousPositions.delete(e.pointerId);
        this.model.activePointers.delete(e.pointerId);

        if (this.model.activePointers.size === 0) {
            this.model.currentAction = ActionMode.none;
            this.model.currentClick = ClickMode.none;
        }
    }

    protected lostPointerCaptureFn(e: PointerEvent) {
        // lostpointercapture fires after pointercancel too; guard avoids double-cleanup
        if (this.model.activePointers.has(e.pointerId)) this.pointerCancelFn(e);
    }

    /**
     * @description Fires a custom Gradum click event at the click target with the click position
     * @param p
     * @param eventName
     * @private
     */
    private fireClick(p: Point, eventName: GradumEventNameEntry = GradumEventName.click) {
        if (!p) return;
        const target = document.elementFromPoint(p.x, p.y) as Element || document;
        this.emitter.fire("dispatchEvent", target, GradumEvent, {position: p, eventName: eventName});
    }

    /**
     * @description Fires a custom Gradum drag event at the target with the origin of the drag, the last drag position, and the current position
     * @param positions
     * @param eventName
     * @private
     */
    private fireDrag(positions: GradumMap<number, Point>, eventName: GradumEventNameEntry = GradumEventName.drag) {
        if (!positions) return;
        this.emitter.fire("dispatchEvent", this.getFireOrigin(positions), GradumDragEvent, {
            positions: positions,
            previousPositions: this.model.previousPositions,
            origins: this.model.origins,
            eventName: eventName
        });
    }

    private getFireOrigin(positions?: GradumMap<number, Point>, reload: boolean = false): Node {
        if (!this.model.lastTargetOrigin || reload) {
            const origin = this.model.origins.first ? this.model.origins.first : positions.first;
            this.model.lastTargetOrigin = document.elementFromPoint(origin.x, origin.y) as Node;
        }
        return this.model.lastTargetOrigin;
    }
}
