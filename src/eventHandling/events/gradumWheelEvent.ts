import {GradumWheelEventProperties} from "./gradumEvent.types";
import {GradumEvent} from "./gradumEvent";
import {Point} from "../../gradumComponents/datatypes/point/point";

/**
 * @class GradumWheelEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description Custom wheel event
 */
class GradumWheelEvent extends GradumEvent {
    /**
     * @description The delta amount of scrolling
     */
    public readonly delta: Point;

    constructor(properties: GradumWheelEventProperties) {
        super({...properties, position: null});
        this.delta = properties.delta;
    }
}

export {GradumWheelEvent};