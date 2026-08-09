import {Coordinate} from "../../types/basic.types";
import {trim} from "../computations/misc";
import {Point} from "../../gradumComponents/datatypes/point/point";
import {Side} from "../../types/enums.types";

/**
 * @function closestPointOnEdge
 * @group Utilities
 * @category Geometry
 *
 * @description Find the point on a rectangle's outline nearest to a given point. Unlike
 * {@link closestPointOnAabb}, a point inside the rectangle is pushed out to the nearest edge rather than
 * returned as-is, so the result always sits on the border.
 * @param {Coordinate} pointer - The point to measure from.
 * @param {DOMRect} rect - The rectangle to measure against.
 * @returns {Point} A new point on the rectangle's outline; neither argument is modified.
 */
function closestPointOnEdge(pointer: Coordinate, rect: DOMRect): Point {
    const closestPoint = {
        x:  trim(pointer.x, rect.right, rect.left),
        y: trim(pointer.y, rect.bottom, rect.top)
    };

   const axisFromSide = (side: Side) => {
        if (side === Side.top || side === Side.bottom) return "y";
        if (side === Side.left || side === Side.right) return "x";
    };

    let closestSide = Side.top;
    Object.values(Side).forEach(side => {
        if (Math.abs(closestPoint[axisFromSide(side)] - rect[side])
            < Math.abs(closestPoint[axisFromSide(closestSide)] - rect[closestSide])) closestSide = side;
    });

    closestPoint[axisFromSide(closestSide)] = rect[closestSide];
    return new Point(closestPoint);
}

/**
 * @function pointInsideRect
 * @group Utilities
 * @category Geometry
 *
 * @description Check whether a point falls within a rectangle, with a tolerance band so a near miss still
 * counts — useful for hit-testing against a pointer, which rarely lands exactly on target.
 * @param {Coordinate} point - The point to test.
 * @param {DOMRect} rect - The rectangle to test against.
 * @param {number} [margin=5] - How far outside the rectangle still counts as inside, in pixels.
 * @returns {boolean} `true` if the point is inside the rectangle grown by `margin`.
 */
function pointInsideRect(point: Coordinate, rect: DOMRect, margin: number = 5): boolean {
    return (point.x < rect.right + margin && point.x > rect.left - margin)
        && (point.y < rect.bottom + margin && point.y > rect.top - margin);
}

export {closestPointOnEdge, pointInsideRect};