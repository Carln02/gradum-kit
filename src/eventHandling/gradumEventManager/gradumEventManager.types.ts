import {Point} from "../../gradumComponents/datatypes/point/point";
import {GradumHeadlessProperties} from "../../gradumElement/gradumHeadlessElement/gradumHeadlessElement.types";
import {GradumEventManagerModel} from "./gradumEventManager.model";

/**
 * @type {GradumEventManagerStateProperties}
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description Whether a {@link GradumEventManager} is running, and which native default actions it
 * suppresses while it does.
 * @property {boolean} [enabled=true] - Whether the manager processes input at all. Set it to `false` to
 * silence every Gradum event without tearing the manager down.
 * @property {boolean} [preventDefaultWheel=false] - Whether to call `preventDefault` on wheel input,
 * suppressing native page zoom and scroll.
 * @property {boolean} [preventDefaultMouse=false] - Whether to call `preventDefault` on mouse input.
 * @property {boolean} [preventDefaultTouch=false] - Whether to call `preventDefault` on touch input,
 * suppressing native scrolling and pinch-zoom.
 */
type GradumEventManagerStateProperties = {
    enabled?: boolean,
    preventDefaultWheel?: boolean,
    preventDefaultMouse?: boolean,
    preventDefaultTouch?: boolean,
}

/**
 * @type {EnabledGradumEventTypes}
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description Which families of Gradum events a manager fires. The first four switch off input
 * *sources*; the last three switch off *interpretations* the manager derives from them, so you can keep
 * pointer input while dropping, say, drag events. All default to `true`.
 * @property {boolean} [keyEventsEnabled=true] - Whether keyboard input produces {@link GradumKeyEvent}s.
 * @property {boolean} [wheelEventsEnabled=true] - Whether wheel input produces {@link GradumWheelEvent}s.
 * @property {boolean} [mouseEventsEnabled=true] - Whether mouse input is processed.
 * @property {boolean} [touchEventsEnabled=true] - Whether touch input is processed.
 * @property {boolean} [clickEventsEnabled=true] - Whether click, long-press, and click start/end events fire.
 * @property {boolean} [dragEventsEnabled=true] - Whether drag and drag start/end events fire.
 * @property {boolean} [moveEventsEnabled=true] - Whether move events fire.
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
 * @type {GradumEventManagerProperties}
 * @group Event Handling
 * @category GradumEventManager
 *
 * @template {GradumEventManagerModel} ModelType - The manager's model type.
 * @description Properties used to construct a {@link GradumEventManager}. Combines the MVC properties of
 * a headless element with {@link GradumEventManagerStateProperties}, {@link EnabledGradumEventTypes}, and
 * the thresholds below.
 * @property {number} [moveThreshold=10] - How far, in pixels, a pointer must travel before the manager
 * treats the interaction as a drag rather than a click.
 * @property {number} [longPressDuration=500] - How long, in milliseconds, a pointer must be held still
 * before a long press fires.
 * @property {boolean | (() => boolean)} [authorizeEventScaling] - Whether fired events compute scaled
 * positions. Pass a callback to decide per event.
 * @property {(position: Point) => Point} [scaleEventPosition] - Converts a screen position into document
 * space for every event this manager fires. Set it to make events aware of a panned or zoomed canvas.
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
 * @type {GradumEventManagerLockStateProperties}
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description A {@link GradumEventManagerStateProperties} override held for the duration of one
 * interaction, together with the node that asked for it. Locking lets an element impose its own
 * prevent-default and enabled settings mid-gesture, then hand them back.
 * @property {Node} [lockOrigin] - The node that established the lock, and the only one that can lift it.
 */
type GradumEventManagerLockStateProperties = GradumEventManagerStateProperties & {
    lockOrigin?: Node,
}

/**
 * @type {SetToolOptions}
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description Options for {@link GradumEventManager.setTool}, controlling the side effects of making a
 * tool current beyond the assignment itself.
 * @property {boolean} [select=true] - Whether to visually select the tool on every toolbar showing it.
 * @property {boolean} [activate=true] - Whether to fire the tool's activation callback.
 * @property {boolean} [setAsNoAction] - Whether the tool also becomes the one used for
 * `ClickMode.none`. Defaults to `true` when the click mode is `ClickMode.left`.
 */
type SetToolOptions = {
    select?: boolean,
    activate?: boolean,
    setAsNoAction?: boolean,
};

/**
 * @enum {ActionMode}
 * @group Event Handling
 * @category Event Modes
 *
 * @description What the manager has decided the current interaction is. A press starts as `click` and
 * becomes `longPress` or `drag` once it outlasts `longPressDuration` or travels past `moveThreshold`.
 * @property {ActionMode.none} none - No interaction in progress.
 * @property {ActionMode.click} click - A press that has neither moved far nor been held long.
 * @property {ActionMode.longPress} longPress - A press held in place past the long-press duration.
 * @property {ActionMode.drag} drag - A press that has moved past the move threshold.
 */
enum ActionMode {
    none,
    click,
    longPress,
    drag
}

/**
 * @enum {ClickMode}
 * @group Event Handling
 * @category Event Modes
 *
 * @description Which pointer button or input mode an interaction belongs to. The manager holds one
 * current tool per mode, so a different tool can be bound to each button.
 * @property {ClickMode.none} none - No button held.
 * @property {ClickMode.left} left - Primary button.
 * @property {ClickMode.right} right - Secondary button.
 * @property {ClickMode.middle} middle - Middle button.
 * @property {ClickMode.other} other - Any further button.
 * @property {ClickMode.key} key - Interaction driven by a mapped keyboard key rather than a button.
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
 * @enum {InputDevice}
 * @group Event Handling
 * @category Event Modes
 *
 * @description The device the manager believes is driving input. *Note: this is inferred from event
 * shape and is not fully reliable, particularly between `mouse` and `trackpad`.*
 * @property {InputDevice.unknown} unknown - Not yet identified.
 * @property {InputDevice.mouse} mouse - A mouse.
 * @property {InputDevice.trackpad} trackpad - A trackpad.
 * @property {InputDevice.touch} touch - A touchscreen.
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