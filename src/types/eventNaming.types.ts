
/**
 * @group Types
 * @category Event Names
 *
 * @description The key event names dispatched by {@link GradumEventManager}. Listen for these to receive
 * the manager's normalized key events rather than the raw DOM ones.
 * @property {string} keyPressed - Fired while a key is held down.
 * @property {string} keyReleased - Fired when a key is let go.
 */
const GradumKeyEventName = {
    keyPressed: "gradum-key-pressed",
    keyReleased: "gradum-key-released"
} as const;

/**
 * @group Types
 * @category Event Names
 *
 * @description The key events components listen for out of the box. Both map to their native DOM
 * equivalents, since the platform already provides them.
 * @property {string} keyPressed - `keydown`.
 * @property {string} keyReleased - `keyup`.
 */
const DefaultKeyEventName = {
    keyPressed: "keydown",
    keyReleased: "keyup",
} as const;

/**
 * @group Types
 * @category Event Names
 *
 * @description The click event names dispatched by {@link GradumEventManager}. These are pointer-type
 * agnostic — a mouse, a touch, and a pen all produce the same names.
 * @property {string} click - Fired on a completed click.
 * @property {string} clickStart - Fired when the pointer goes down.
 * @property {string} clickEnd - Fired when the pointer comes back up.
 * @property {string} longPress - Fired when the pointer is held past the manager's long-press duration.
 */
const GradumClickEventName = {
    click: "gradum-click",
    clickStart: "gradum-click-start",
    clickEnd: "gradum-click-end",

    longPress: "gradum-long-press"
} as const;

/**
 * @group Types
 * @category Event Names
 *
 * @description The click events components listen for out of the box. `click`, `clickStart`, and `clickEnd`
 * map to their native DOM equivalents; `longPress` keeps the Gradum name, because the platform has no
 * equivalent and only {@link GradumEventManager} can produce it.
 * @property {string} click - `click`.
 * @property {string} clickStart - `mousedown`.
 * @property {string} clickEnd - `mouseup`.
 * @property {string} longPress - The Gradum long-press name.
 */
const DefaultClickEventName = {
    click: "click",
    clickStart: "mousedown",
    clickEnd: "mouseup",

    longPress: GradumClickEventName.longPress
} as const;

/**
 * @group Types
 * @category Event Names
 *
 * @description The pointer-move event name dispatched by {@link GradumEventManager}.
 * @property {string} move - Fired as the pointer moves.
 */
const GradumMoveEventName = {
    move: "gradum-move"
} as const;

/**
 * @group Types
 * @category Event Names
 *
 * @description The move event components listen for out of the box, mapped to its native DOM equivalent.
 * @property {string} move - `mousemove`.
 */
const DefaultMoveEventName = {
    move: "mousemove"
} as const;

/**
 * @group Types
 * @category Event Names
 *
 * @description The drag event names dispatched by {@link GradumEventManager}. A drag begins once the pointer
 * travels past the manager's move threshold while held.
 * @property {string} drag - Fired repeatedly as the pointer moves during a drag.
 * @property {string} dragStart - Fired once, when the drag begins.
 * @property {string} dragEnd - Fired once, when the pointer is released.
 */
const GradumDragEventName = {
    drag: "gradum-drag",
    dragStart: "gradum-drag-start",
    dragEnd: "gradum-drag-end"
} as const;

/**
 * @group Types
 * @category Event Names
 *
 * @description The drag events components listen for out of the box. All three keep their Gradum names —
 * the native HTML drag-and-drop events are a separate mechanism, so {@link GradumEventManager} is the only
 * source of these.
 * @property {string} drag - The Gradum drag name.
 * @property {string} dragStart - The Gradum drag-start name.
 * @property {string} dragEnd - The Gradum drag-end name.
 */
const DefaultDragEventName = {
    drag: GradumDragEventName.drag,
    dragStart: GradumDragEventName.dragStart,
    dragEnd: GradumDragEventName.dragEnd,
} as const;

/**
 * @group Types
 * @category Event Names
 *
 * @description The wheel event names dispatched by {@link GradumEventManager}, which separates a plain
 * wheel turn from a pinch gesture.
 * @property {string} scroll - Fired on a wheel turn without a modifier.
 * @property {string} pinch - Fired on a trackpad pinch, which the browser reports as a modified wheel event.
 */
const GradumWheelEventName = {
    scroll: "gradum-scroll",
    pinch: "gradum-pinch",
} as const;

/**
 * @group Types
 * @category Event Names
 *
 * @description The wheel events components listen for out of the box. Both map to the native `wheel` event,
 * since the browser reports scrolling and pinching through the same one — it is the manager that tells them
 * apart and fires the distinct {@link GradumWheelEventName} names.
 * @property {string} scroll - `wheel`.
 * @property {string} pinch - `wheel`.
 */
const DefaultWheelEventName = {
    scroll: "wheel",
    pinch: "wheel",
} as const;

/**
 * @group Types
 * @category Event Names
 *
 * @description Every event name {@link GradumEventManager} can dispatch, combining the key, click, move,
 * drag, and wheel families with the select-input event.
 * @property {string} selectInput - Fired when a selection component's value changes.
 */
const GradumEventName = {
    ...GradumClickEventName,
    ...GradumKeyEventName,
    ...GradumMoveEventName,
    ...GradumDragEventName,
    ...GradumWheelEventName,

    selectInput: "gradum-select-input",
} as const;

/**
 * @group Types
 * @category Event Names
 *
 * @description Object containing the names of events fired by default by the gradumComponents. Modifying it (prior to
 * setting up new gradum components) will subsequently alter the events that the instantiated components will listen for.
 */
const DefaultEventName = {
    ...DefaultKeyEventName,
    ...DefaultClickEventName,
    ...DefaultMoveEventName,
    ...DefaultDragEventName,
    ...DefaultWheelEventName,
    wheel: "wheel",
    scroll: "scroll",

    input: "input",
    change: "change",

    focus: "focus",
    focusIn: "focusin",
    focusOut: "focusout",
    blur: "blur",

    resize: "resize",

    compositionStart: "compositionstart",
    compositionEnd: "compositionend",
};

/**
 * @group Types
 * @category Event Names
 *
 * @description The name of any event in {@link DefaultEventName}, such as `"clickStart"` or `"focusIn"`.
 */
type DefaultEventNameKey = keyof typeof DefaultEventName;
/**
 * @group Types
 * @category Event Names
 *
 * @description The event-name string of any entry in {@link DefaultEventName}, such as `"mousedown"`.
 * This is what you pass to {@link GradumSelector.on}.
 */
type DefaultEventNameEntry = typeof DefaultEventName[DefaultEventNameKey];
/**
 * @group Types
 * @category Event Names
 *
 * @description The name of any event in {@link GradumEventName}, such as `"dragStart"`.
 */
type GradumEventNameKey = keyof typeof GradumEventName;
/**
 * @group Types
 * @category Event Names
 *
 * @description The event-name string of any entry in {@link GradumEventName}, such as `"gradum-drag-start"`.
 */
type GradumEventNameEntry = typeof GradumEventName[GradumEventNameKey];

export {
    DefaultKeyEventName,
    DefaultMoveEventName,
    DefaultWheelEventName,
    DefaultClickEventName,
    DefaultDragEventName,
    GradumKeyEventName,
    GradumClickEventName,
    GradumMoveEventName,
    GradumDragEventName,
    GradumWheelEventName,
    DefaultEventName,
    DefaultEventNameEntry,
    GradumEventName,
    GradumEventNameEntry,
    DefaultEventNameKey,
    GradumEventNameKey
};