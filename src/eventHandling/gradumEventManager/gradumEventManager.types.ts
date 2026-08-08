import {Point} from "../../gradumComponents/datatypes/point/point";
import {GradumHeadlessProperties} from "../../gradumElement/gradumHeadlessElement/gradumHeadlessElement.types";
import {GradumEventManagerModel} from "./gradumEventManager.model";

/**
 * @group Event Handling
 * @category GradumEventManager
 */
type GradumEventManagerStateProperties = {
    enabled?: boolean,
    preventDefaultWheel?: boolean,
    preventDefaultMouse?: boolean,
    preventDefaultTouch?: boolean,
}

/**
 * @group Event Handling
 * @category GradumEventManager
 */
type EnabledGradumEventTypes = {
    keyEventsEnabled?: boolean,
    wheelEventsEnabled?: boolean,
    mouseEventsEnabled?: boolean,
    touchEventsEnabled?: boolean,

    clickEventsEnabled?: boolean,
    dragEventsEnabled?: boolean,
    moveEventsEnabled?: boolean,
}

/**
 * @group Event Handling
 * @category GradumEventManager
 */
type GradumEventManagerProperties<
    ModelType extends GradumEventManagerModel = GradumEventManagerModel
> = GradumHeadlessProperties<any, any, ModelType>
    & GradumEventManagerStateProperties & EnabledGradumEventTypes & {
    moveThreshold?: number,
    longPressDuration?: number,

    authorizeEventScaling?: boolean | (() => boolean),
    scaleEventPosition?: (position: Point) => Point,
}

/**
 * @group Event Handling
 * @category GradumEventManager
 */
type GradumEventManagerLockStateProperties = GradumEventManagerStateProperties & {
    lockOrigin?: Node,
}

/**
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description Object representing options passed to the ToolManager's setTool() function.
 * @property select - Indicate whether to visually select the tool on all toolbars, defaults to true
 * @property activate - Indicate whether to fire activation on the tool when setting it, defaults to true
 * @property setAsNoAction - Indicate whether the tool will also be set as the tool for ClickMode == none, defaults
 * to true if the click mode is left.
 */
type SetToolOptions = {
    select?: boolean,
    activate?: boolean,
    setAsNoAction?: boolean,
};

/**
 * @group Event Handling
 * @category Enums
 */
enum ActionMode {
    none,
    click,
    longPress,
    drag
}

/**
 * @group Event Handling
 * @category Enums
 */
enum ClickMode {
    none,
    left,
    right,
    middle,
    other,
    key
}

/**
 * @group Event Handling
 * @category Enums
 */
enum InputDevice {
    unknown,
    mouse,
    trackpad,
    touch
}

export {
    GradumEventManagerProperties,
    EnabledGradumEventTypes,
    GradumEventManagerStateProperties,
    GradumEventManagerLockStateProperties,
    ActionMode,
    ClickMode,
    InputDevice,
    SetToolOptions,
};