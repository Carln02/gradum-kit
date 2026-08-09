import {GradumEvent} from "../../eventHandling/events/gradumEvent";
import {Point} from "../../gradumComponents/datatypes/point/point";

/**
 * @function getEventPosition
 * @group Utilities
 * @category Event
 *
 * @description Read the pointer position out of an event, whichever kind it is. A {@link GradumEvent} yields
 * its scaled position, so the result already accounts for a panned or zoomed canvas; a native pointer event
 * yields raw client coordinates.
 * @param {Event} e - The event to read.
 * @returns {Point} The pointer position, or `undefined` for an event that carries none.
 */
function getEventPosition(e: Event): Point {
    if (e instanceof GradumEvent) return e.scaledPosition;
    if (e instanceof PointerEvent) return new Point(e.clientX, e.clientY);
    return;
}

export {getEventPosition};