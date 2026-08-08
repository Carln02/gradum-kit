import {ClickMode, InputDevice} from "../gradumEventManager/gradumEventManager.types";
import {Point} from "../../gradumComponents/datatypes/point/point";
import {GradumMap} from "../../gradumComponents/datatypes/map/map";
import {GradumEventManager} from "../gradumEventManager/gradumEventManager";
import {GradumEventNameEntry} from "../../types/eventNaming.types";

/**
 * @group Event Handling
 * @category Enums
 */
enum ClosestOrigin {
    target = "target",
    position = "position",
}

/**
 * @group Event Handling
 * @category GradumEvents
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
 * @group Event Handling
 * @category GradumEvents
 */
type GradumEventProperties = GradumRawEventProperties & {
    position?: Point,
};

/**
 * @group Event Handling
 * @category GradumEvents
 */
type GradumDragEventProperties = GradumRawEventProperties & {
    origins?: GradumMap<number, Point>,
    previousPositions?: GradumMap<number, Point>,
    positions?: GradumMap<number, Point>,
}

/**
 * @group Event Handling
 * @category GradumEvents
 */
type GradumKeyEventProperties = GradumRawEventProperties & {
    keyPressed?: string,
    keyReleased?: string
};

/**
 * @group Event Handling
 * @category GradumEvents
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