/**
 * @enum {Direction}
 * @group Core Types
 * @category Enums
 *
 * @description The axis a component lays out, scrolls, or moves along.
 * @property {Direction.vertical} vertical - Along the y axis.
 * @property {Direction.horizontal} horizontal - Along the x axis.
 */
enum Direction {
    vertical = "vertical",
    horizontal = "horizontal",
}

/**
 * @enum {SideH}
 * @group Core Types
 * @category Enums
 *
 * @description One of the two horizontal sides. Use {@link Side} when vertical sides are also valid.
 * @property {SideH.left} left - The left side.
 * @property {SideH.right} right - The right side.
 */
enum SideH {
    left = "left",
    right = "right",
}

/**
 * @enum {SideV}
 * @group Core Types
 * @category Enums
 *
 * @description One of the two vertical sides. Use {@link Side} when horizontal sides are also valid.
 * @property {SideV.top} top - The top side.
 * @property {SideV.bottom} bottom - The bottom side.
 */
enum SideV {
    top = "top",
    bottom = "bottom",
}

/**
 * @enum {Side}
 * @group Core Types
 * @category Enums
 *
 * @description Any one of the four sides of a rectangle or element — which edge a
 * {@link GradumDrawer} slides from, for instance.
 * @property {Side.top} top - The top side.
 * @property {Side.bottom} bottom - The bottom side.
 * @property {Side.left} left - The left side.
 * @property {Side.right} right - The right side.
 */
enum Side {
    top = "top",
    bottom = "bottom",
    left = "left",
    right = "right",
}

/**
 * @enum {InOut}
 * @group Core Types
 * @category Enums
 *
 * @description Whether a motion travels toward a centre or away from it, such as the direction of a
 * {@link GradumMarkingMenu} gesture.
 * @property {InOut.in} in - Inward, toward the centre.
 * @property {InOut.out} out - Outward, away from the centre.
 */
enum InOut {
    in = "in",
    out = "out",
}

/**
 * @enum {OnOff}
 * @group Core Types
 * @category Enums
 *
 * @description A two-state toggle, for states better named on/off than `true`/`false`.
 * @property {OnOff.on} on - Enabled.
 * @property {OnOff.off} off - Disabled.
 */
enum OnOff {
    on = "on",
    off = "off"
}

/**
 * @enum {Open}
 * @group Core Types
 * @category Enums
 *
 * @description Whether a container currently exposes its content.
 * @property {Open.open} open - Content is exposed.
 * @property {Open.closed} closed - Content is collapsed away.
 */
enum Open {
    open = "open",
    closed = "closed"
}

/**
 * @enum {Shown}
 * @group Core Types
 * @category Enums
 *
 * @description Whether an element is displayed. Used as the pair of states a reifect transitions
 * between, and by {@link GradumContentSwitch} to pick the active child.
 * @property {Shown.visible} visible - Displayed.
 * @property {Shown.hidden} hidden - Not displayed.
 */
enum Shown {
    visible = "visible",
    hidden = "hidden",
}

/**
 * @enum {AccessLevel}
 * @group Core Types
 * @category Enums
 *
 * @description How widely a member is exposed, mirroring the TypeScript access modifiers.
 * @property {AccessLevel.public} public - Reachable from anywhere.
 * @property {AccessLevel.protected} protected - Reachable from the declaring class and its subclasses.
 * @property {AccessLevel.private} private - Reachable only from the declaring class.
 */
enum AccessLevel {
    public = "public",
    protected = "protected",
    private = "private",
}

/**
 * @enum {Range}
 * @group Core Types
 * @category Enums
 *
 * @description Which end of a bounded range a value refers to.
 * @property {Range.min} min - The lower bound.
 * @property {Range.max} max - The upper bound.
 */
enum Range {
    min = "min",
    max = "max",
}

/**
 * @enum {Anchor}
 * @group Core Types
 * @category Enums
 *
 * @description A reference point on a rectangle — the nine combinations of a vertical and a horizontal
 * position. Used to anchor a {@link GradumRect} or an {@link AnchorPoint}.
 * @property {Anchor.TopLeft} TopLeft - Top-left corner.
 * @property {Anchor.TopMiddle} TopMiddle - Centre of the top edge.
 * @property {Anchor.TopRight} TopRight - Top-right corner.
 * @property {Anchor.CenterLeft} CenterLeft - Centre of the left edge.
 * @property {Anchor.Center} Center - Centre of the rectangle.
 * @property {Anchor.CenterRight} CenterRight - Centre of the right edge.
 * @property {Anchor.BottomLeft} BottomLeft - Bottom-left corner.
 * @property {Anchor.BottomMiddle} BottomMiddle - Centre of the bottom edge.
 * @property {Anchor.BottomRight} BottomRight - Bottom-right corner.
 */
enum Anchor {
    TopLeft = "topLeft",
    TopRight = "topRight",
    TopMiddle = "topMiddle",
    BottomLeft = "bottomLeft",
    BottomMiddle = "bottomMiddle",
    BottomRight = "bottomRight",
    Center = "center",
    CenterLeft = "centerLeft",
    CenterRight = "centerRight",
}

export {Direction, Side, SideV, SideH, InOut, OnOff, Open, Shown, AccessLevel, Range, Anchor};