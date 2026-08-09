import {GradumWheelEventProperties} from "./gradumEvent.types";
import {GradumEvent} from "./gradumEvent";
import {Point} from "../../gradumComponents/datatypes/point/point";

/**
 * @class GradumWheelEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description The event fired for `gradum-scroll` and `gradum-pinch`. Wheel events carry no pointer
 * position, so {@link GradumEvent.position} is `null` — read {@link GradumWheelEvent.delta} instead.
 */
class GradumWheelEvent extends GradumEvent {
    /**
     * @description How far the wheel or trackpad moved on each axis since the last event.
     */
    public readonly delta: Point;

    /**
     * @constructor
     * @description Create a wheel event. Its position is always `null`.
     * @param {GradumWheelEventProperties} properties - The scroll delta and the input context.
     */
    constructor(properties: GradumWheelEventProperties) {
        super({...properties, position: null});
        this.delta = properties.delta;
    }
}

export {GradumWheelEvent};