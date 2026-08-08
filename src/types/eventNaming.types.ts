
/**
 * @group Types
 * @category Event Names
 */
const GradumKeyEventName = {
    keyPressed: "gradum-key-pressed",
    keyReleased: "gradum-key-released"
} as const;

/**
 * @group Types
 * @category Event Names
 */
const DefaultKeyEventName = {
    keyPressed: "keydown",
    keyReleased: "keyup",
} as const;

/**
 * @group Types
 * @category Event Names
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
 */
const GradumMoveEventName = {
    move: "gradum-move"
} as const;

/**
 * @group Types
 * @category Event Names
 */
const DefaultMoveEventName = {
    move: "mousemove"
} as const;

/**
 * @group Types
 * @category Event Names
 */
const GradumDragEventName = {
    drag: "gradum-drag",
    dragStart: "gradum-drag-start",
    dragEnd: "gradum-drag-end"
} as const;

/**
 * @group Types
 * @category Event Names
 */
const DefaultDragEventName = {
    drag: GradumDragEventName.drag,
    dragStart: GradumDragEventName.dragStart,
    dragEnd: GradumDragEventName.dragEnd,
} as const;

/**
 * @group Types
 * @category Event Names
 */
const GradumWheelEventName = {
    scroll: "gradum-scroll",
    pinch: "gradum-pinch",
} as const;

/**
 * @group Types
 * @category Event Names
 */
const DefaultWheelEventName = {
    scroll: "wheel",
    pinch: "wheel",
} as const;

/**
 * @group Types
 * @category Event Names
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
 */
type DefaultEventNameKey = keyof typeof DefaultEventName;
/**
 * @group Types
 * @category Event Names
 */
type DefaultEventNameEntry = typeof DefaultEventName[DefaultEventNameKey];
/**
 * @group Types
 * @category Event Names
 */
type GradumEventNameKey = keyof typeof GradumEventName;
/**
 * @group Types
 * @category Event Names
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