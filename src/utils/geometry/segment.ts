import {Point} from "../../gradumComponents/datatypes/point/point";

/**
 * @function closestPointOnSegment
 * @group Utilities
 * @category Geometry
 *
 * @description Find the point of a line segment nearest to a given point. The result is clamped to the
 * segment, so it never lands on the infinite line beyond the endpoints.
 * @param {Point} p - The point to measure from.
 * @param {Point} a - Start of the segment.
 * @param {Point} b - End of the segment.
 * @returns {Point} A new point on the segment; the arguments are left unchanged. A zero-length segment
 * returns `a` itself.
 */
function closestPointOnSegment(p: Point, a: Point, b: Point): Point {
    const ab = b.sub(a);
    const ap = p.sub(a);
    const abLen2 = ab.x * ab.x + ab.y * ab.y;
    if (abLen2 <= 1e-12) return a;
    let t = (ap.x * ab.x + ap.y * ab.y) / abLen2;
    t = Math.max(0, Math.min(1, t));
    return new Point(a.x + ab.x * t, a.y + ab.y * t);
}

/**
 * @function intersectSegments
 * @group Utilities
 * @category Geometry
 *
 * @description Find where two line segments cross, if they do. Only a crossing within both segments counts;
 * an intersection that would fall beyond either one is not reported.
 * @param {Point} a - Start of the first segment.
 * @param {Point} b - End of the first segment.
 * @param {Point} c - Start of the second segment.
 * @param {Point} d - End of the second segment.
 * @returns {Point} A new point at the crossing, or `null` if the segments do not cross. Parallel segments
 * always return `null`, including collinear ones that overlap.
 */
function intersectSegments(a: Point, b: Point, c: Point, d: Point): Point {
    const r = b.sub(a);
    const s = d.sub(c);
    const rxs = r.x * s.y - r.y * s.x;
    if (Math.abs(rxs) < 1e-12) return null; // parallel (ignore collinear)

    const q_p = c.sub(a);
    const t = (q_p.x * s.y - q_p.y * s.x) / rxs;
    const u = (q_p.x * r.y - q_p.y * r.x) / rxs;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return new Point(a.x + t * r.x, a.y + t * r.y);
    return null;
}

export {closestPointOnSegment, intersectSegments}