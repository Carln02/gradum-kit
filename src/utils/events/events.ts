import {GradumEvent} from "../../eventHandling/events/gradumEvent";
import {Point} from "../../gradumComponents/datatypes/point/point";

/**
 * @group Utilities
 * @category Event
 * @param e
 */
function getEventPosition(e: Event): Point {
    if (e instanceof GradumEvent) return e.scaledPosition;
    if (e instanceof PointerEvent) return new Point(e.clientX, e.clientY);
    return;
}

export {getEventPosition};