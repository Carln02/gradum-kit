import {Point} from "../point/point";
import {Coordinate} from "../../../types/basic.types";
import {Anchor} from "../../../types/enums.types";
import {auto} from "../../../decorators/auto/auto";

/**
 * @class AnchorPoint
 * @group Components
 * @category Data Structures
 *
 * @description A position within a box, expressed either as one of the nine named {@link Anchor} values
 * or as a free {@link Point} in percentages from `-100` to `100`. The two forms are interchangeable —
 * assign whichever is convenient and read back whichever you need.
 */
class AnchorPoint {
    /**
     * @constructor
     * @description Create an anchor point.
     * @param {Point | Anchor} [anchor] - The starting position, as a named anchor or a point.
     */
    public constructor(anchor?: Point | Anchor) {
        this.value = anchor;
    }

    /**
     * @description The anchor's position as a point. Assigning a named {@link Anchor} converts it; assigning
     * anything unrecognized leaves the current value untouched.
     */
    @auto({
        preprocessValue: function (value) {
            if (typeof value === "object" && value instanceof Point) return value;
            if (Object.values(Anchor).includes(value)) return AnchorPoint.enumToPoint(value);
            return (this as any)._value;
        }
    }) public set value(value: Point | Anchor) {}
    public get value(): Point {return;}

    /**
     * @readonly
     * @description This position as a fraction of the box, from `-0.5` at the left or top edge through `0`
     * at the centre to `+0.5` at the right or bottom. The same value as {@link AnchorPoint.value}, which is
     * a percentage, scaled into the form that multiplies a size directly.
     *
     * @example
     * ```ts
     * //Where a box's anchor sits, measured from its middle.
     * const offset = new AnchorPoint(Anchor.TopLeft).fraction.mul(size); //(-w/2, -h/2)
     * ```
     */
    public get fraction(): Point {
        return this.value.div(200);
    }

    /**
     * @function offsetIn
     * @description The vector from the middle of a box out to this anchor. Turned by `rotation`, so it
     * points where the anchor actually is on a box that has been rotated about its middle, rather than
     * where it would sit on an upright one.
     * @param {Coordinate} size - The box's width and height.
     * @param {number} [rotation=0] - The box's rotation in radians.
     * @returns {Point} The offset from the middle of the box.
     *
     * @example
     * ```ts
     * //The screen position of a rotated box's top-left corner.
     * const corner = middle.add(new AnchorPoint(Anchor.TopLeft).offsetIn(size, angleRad));
     * ```
     */
    public offsetIn(size: Coordinate, rotation: number = 0): Point {
        return this.fraction.mul(size).rotate(rotation);
    }

    /**
     * @readonly
     * @description The named {@link Anchor} nearest this position, snapping each axis to its closest edge
     * or centre.
     */
    public get enum(): Anchor {
        return AnchorPoint.pointToEnum(this.value);
    }

    /**
     * @function pointToEnum
     * @static
     * @description Snap a point to the nearest named anchor. Each axis rounds to the closest of its two
     * edges or its centre.
     * @param {Point} value - The point to convert.
     * @returns {Anchor} The nearest named anchor. Defaults to `Anchor.Center` for a missing point.
     */
    public static pointToEnum(value: Point): Anchor {
        if (!value) return Anchor.Center;

        const snapAxis = (n: number): -100 | 0 | 100 => n < -50 ? -100 : n > 50 ? 100 : 0;
        const x = snapAxis(value.x);
        const y = snapAxis(value.y);

        if (y === -100) {
            if (x === -100) return Anchor.TopLeft;
            if (x === 0) return Anchor.TopMiddle;
            return Anchor.TopRight;
        }

        if (y === 0) {
            if (x === -100) return Anchor.CenterLeft;
            if (x === 0) return Anchor.Center;
            return Anchor.CenterRight;
        }

        if (x === -100) return Anchor.BottomLeft;
        if (x === 0) return Anchor.BottomMiddle;
        return Anchor.BottomRight;
    }

    /**
     * @function enumToPoint
     * @static
     * @description Convert a named anchor to its point, in percentages from `-100` to `100`.
     * @param {Anchor} value - The anchor to convert.
     * @returns {Point} The corresponding point. Returns the origin for a missing anchor.
     */
    public static enumToPoint(value: Anchor): Point {
        if (!value) return new Point();
        switch (value) {
            case Anchor.TopLeft:
                return new Point(-100, -100);
            case Anchor.TopMiddle:
                return new Point(0, -100);
            case Anchor.TopRight:
                return new Point(100, -100);
            case Anchor.CenterLeft:
                return new Point(-100, 0);
            case Anchor.Center:
                return new Point(0, 0);
            case Anchor.CenterRight:
                return new Point(100, 0);
            case Anchor.BottomLeft:
                return new Point(-100, 100);
            case Anchor.BottomMiddle:
                return new Point(0, 100);
            case Anchor.BottomRight:
                return new Point(100, 100);
        }
    }
}

export {AnchorPoint};