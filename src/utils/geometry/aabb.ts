import {Point} from "../../gradumComponents/datatypes/point/point";

/**
 * @function aabbCorners
 * @group Utilities
 * @category Geometry
 *
 * @description List the four corners of an axis-aligned rectangle, in clockwise order starting top-left.
 * Use it to feed a `DOMRect` into the polygon helpers, which expect point lists.
 * @param {DOMRect} r - The rectangle to read.
 * @returns {[Point, Point, Point, Point]} The corners: top-left, top-right, bottom-right, bottom-left.
 */
function aabbCorners(r: DOMRect): [Point, Point, Point, Point] {
    const x0 = r.x, y0 = r.y;
    const x1 = r.x + r.width, y1 = r.y + r.height;
    return [new Point(x0, y0), new Point(x1, y0), new Point(x1, y1), new Point(x0, y1)];
}

/**
 * @function closestPointOnAabb
 * @group Utilities
 * @category Geometry
 *
 * @description Find the point of an axis-aligned rectangle nearest to a given point. A point already inside
 * the rectangle is returned unchanged, so the result is the point itself rather than a point on the border —
 * use {@link closestPointOnEdge} when you always want a point on the outline.
 * @param {Point} p - The point to measure from.
 * @param {DOMRect} r - The rectangle to measure against.
 * @returns {Point} A new point; neither argument is modified.
 */
function closestPointOnAabb(p: Point, r: DOMRect): Point {
    const x0 = r.x, y0 = r.y;
    const x1 = r.x + r.width, y1 = r.y + r.height;
    const x = Math.max(x0, Math.min(x1, p.x));
    const y = Math.max(y0, Math.min(y1, p.y));
    return new Point(x, y);
}

export {aabbCorners, closestPointOnAabb}