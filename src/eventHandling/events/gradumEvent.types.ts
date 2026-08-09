import {ClickMode, InputDevice} from "../gradumEventManager/gradumEventManager.types";
import {Point} from "../../gradumComponents/datatypes/point/point";
import {GradumMap} from "../../gradumComponents/datatypes/map/map";
import {GradumEventManager} from "../gradumEventManager/gradumEventManager";
import {GradumEventNameEntry} from "../../types/eventNaming.types";

/**
 * @enum {ClosestOrigin}
 * @group Event Handling
 * @category Event Modes
 *
 * @description Where {@link GradumEvent.closest} starts searching from when looking for a matching
 * ancestor.
 * @property {ClosestOrigin.target} target - Start from the event's target and walk up its ancestors.
 * @property {ClosestOrigin.position} position - Start from the elements under the event position, which
 * also reaches elements the target overlaps but does not descend from.
 */
enum ClosestOrigin {
    target = "target",
    position = "position",
}

/**
 * @type {GradumRawEventProperties}
 * @group Event Handling
 * @category GradumEvents
 *
 * @description The fields every Gradum event is built from. The concrete property types
 * ({@link GradumEventProperties}, {@link GradumDragEventProperties}, ...) extend this with whatever
 * positional data their event carries.
 * @property {ClickMode} [clickMode] - The pointer button or input mode the event belongs to. Defaults to
 * the manager's current click mode.
 * @property {InputDevice} [inputDevice] - The device that produced the event. Defaults to
 * `InputDevice.unknown`.
 * @property {string[]} [keys] - Keys held when the event fired. Defaults to the manager's current keys.
 * @property {GradumEventNameEntry} [eventName] - The name the event is dispatched under.
 * @property {GradumEventManager} [eventManager] - The manager firing the event. Defaults to
 * {@link GradumEventManager.instance}.
 * @property {string} [toolName] - The tool the event is attributed to, if any.
 * @property {boolean | (() => boolean)} [authorizeScaling=true] - Whether scaled positions are computed.
 * Pass a callback to decide per read.
 * @property {(position: Point) => Point} [scalePosition] - Converts a screen position into document
 * space. Defaults to returning the position unchanged.
 * @property {EventInit} [eventInitDict] - Native event options, merged over the defaults of `bubbles`
 * and `cancelable` set to `true`.
 */
type GradumRawEventProperties = {
    clickMode?: ClickMode,
    inputDevice?: InputDevice,
    keys?: string[],
    eventName?: GradumEventNameEntry,
    eventManager?: GradumEventManager,
    toolName?: string,
    authorizeScaling?: boolean | (() => boolean),
    scalePosition?: (position: Point) => Point,
    eventInitDict?: EventInit
};

/**
 * @type {GradumEventProperties}
 * @group Event Handling
 * @category GradumEvents
 *
 * @description Properties used to construct a {@link GradumEvent}. Extends
 * {@link GradumRawEventProperties} with the single point the event happened at.
 * @property {Point} [position] - The screen position the event was fired from.
 */
type GradumEventProperties = GradumRawEventProperties & {
    position?: Point,
};

/**
 * @type {GradumDragEventProperties}
 * @group Event Handling
 * @category GradumEvents
 *
 * @description Properties used to construct a {@link GradumDragEvent}. Each map is keyed by pointer id,
 * so a multi-touch drag carries one entry per finger.
 * @property {GradumMap<number, Point>} [origins] - Where each pointer started its drag.
 * @property {GradumMap<number, Point>} [previousPositions] - Where each pointer was on the previous event.
 * @property {GradumMap<number, Point>} [positions] - Where each pointer is now. Its first entry becomes
 * the event's `position`.
 */
type GradumDragEventProperties = GradumRawEventProperties & {
    origins?: GradumMap<number, Point>,
    previousPositions?: GradumMap<number, Point>,
    positions?: GradumMap<number, Point>,
}

/**
 * @type {GradumKeyEventProperties}
 * @group Event Handling
 * @category GradumEvents
 *
 * @description Properties used to construct a {@link GradumKeyEvent}. Exactly one of the two keys is set,
 * depending on whether the event is a press or a release.
 * @property {string} [keyPressed] - The key that was pressed.
 * @property {string} [keyReleased] - The key that was released.
 */
type GradumKeyEventProperties = GradumRawEventProperties & {
    keyPressed?: string,
    keyReleased?: string
};

/**
 * @type {GradumWheelEventProperties}
 * @group Event Handling
 * @category GradumEvents
 *
 * @description Properties used to construct a {@link GradumWheelEvent}.
 * @property {Point} [delta] - How far the wheel or trackpad scrolled, per axis.
 */
type GradumWheelEventProperties = GradumRawEventProperties & {
    delta?: Point
};

export {
    ClosestOrigin,
    GradumRawEventProperties,
    GradumEventProperties,
    GradumDragEventProperties,
    GradumKeyEventProperties,
    GradumWheelEventProperties
};