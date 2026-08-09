import {GradumEventManager} from "../gradumEventManager";
import {GradumEventManagerModel} from "../gradumEventManager.model";
import {InputDevice} from "../gradumEventManager.types";
import {GradumWheelEvent} from "../../events/gradumWheelEvent";
import {GradumOperator} from "../../../mvc/operator/operator";
import {Point} from "../../../gradumComponents/datatypes/point/point";
import {GradumEventName, GradumEventNameEntry} from "../../../types/eventNaming.types";

/**
 * @internal
 * @class GradumEventManagerWheelOperator
 * @extends GradumOperator
 * @description Translates native wheel input into {@link GradumWheelEvent}s, choosing between a scroll
 * and a pinch and inferring whether the input came from a mouse or a trackpad.
 */
export class GradumEventManagerWheelOperator extends GradumOperator<GradumEventManager, any, GradumEventManagerModel> {
    public keyName: string = "wheel";

    public wheel = (e: WheelEvent) => {
        if (!this.element.enabled) return;
        //Prevent default scroll behavior
        if (this.element.preventDefaultWheel) e.preventDefault();

        //Most likely trackpad
        if (Math.abs(e.deltaY) <= 40 || e.deltaX != 0) this.model.inputDevice = InputDevice.trackpad;
        //Set input device to mouse if it wasn't trackpad recently
        if (!this.model.wasRecentlyTrackpad) this.model.inputDevice = InputDevice.mouse;

        //Reset trackpad timer
        this.model.utils.clearTimer("recentlyTrackpadTimer");
        //Set timer to clear recently trackpad boolean after a delay
        this.model.utils.setTimer("recentlyTrackpadTimer", () => {
            if (this.model.inputDevice == InputDevice.trackpad) this.model.wasRecentlyTrackpad = false;
        }, 800);

        //Get name of event according to input type
        //Pinching (for trackpad, Ctrl key is marked as pressed in the WheelEvent)
        const eventName: GradumEventNameEntry = (this.model.inputDevice == InputDevice.trackpad && e.ctrlKey)
            ? GradumEventName.pinch
            : GradumEventName.scroll;

        const target = document.elementFromPoint?.(e.clientX, e.clientY) || document;
        this.emitter.fire("dispatchEvent", target, GradumWheelEvent, {delta: new Point(e.deltaX, e.deltaY), eventName: eventName});
    };
}
