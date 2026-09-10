import {GradumWheelEventProperties} from "./gradumEvent.types";
import {GradumEvent} from "./gradumEvent";
import {Point} from "../../gradumComponents/datatypes/point/point";

/**
 * @class GradumWheelEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description The event fired for `gradum-scroll` and `gradum-pinch`. It carries where the wheel was
 * turned in {@link GradumEvent.position}, and how far in {@link GradumWheelEvent.delta}.
 */
class GradumWheelEvent extends GradumEvent {
    /**
     * @description How far the wheel or trackpad moved on each axis since the last event.
     */
    public readonly delta: Point;

    /**
     * @constructor
     * @description Create a wheel event.
     * @param {GradumWheelEventProperties} properties - The scroll delta, the position, and the input context.
     */
    constructor(properties: GradumWheelEventProperties) {
        super(properties);
        this.delta = properties.delta;
    }
}

export {GradumWheelEvent};