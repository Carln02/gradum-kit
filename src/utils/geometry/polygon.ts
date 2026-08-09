import {Point} from "../../gradumComponents/datatypes/point/point";
import {intersectSegments} from "./segment";

/**
 * @function isPointInConvexPolygon
 * @group Utilities
 * @category Geometry
 *
 * @description Check whether a point lies inside a convex polygon, borders included.
 * *Note: the polygon must be convex; a concave one gives wrong answers.*
 * @param {Point} p - The point to test.
 * @param {Point[]} poly - The polygon's vertices, in order around its outline.
 * @returns {boolean} `true` if the point is inside or on the border.
 */
function isPointInConvexPolygon(p: Point, poly: Point[]): boolean {
    let sign = 0;
    for (let i = 0; i < poly.length; i++) {
        const a = poly[i];
        const b = poly[(i + 1) % poly.length];
        const ab = b.sub(a);
        const ap = p.sub(a);
        const z = ab.x * ap.y - ab.y * ap.x;
        if (Math.abs(z) < 1e-12) continue;
        const s = z > 0 ? 1 : -1;
        if (sign === 0) sign = s;
        else if (sign !== s) return false;
    }
    return true;
}

/**
 * @function segmentIntersectsPolygon
 * @group Utilities
 * @category Geometry
 *
 * @description Find where a line segment first meets a polygon. A segment lying wholly inside the polygon
 * crosses no edge, so one of its endpoints is returned instead — meaning a non-null result means "touches",
 * not strictly "crosses an edge".
 * @param {Point} a - Start of the segment.
 * @param {Point} b - End of the segment.
 * @param {Point[]} poly - The polygon's vertices, in order around its outline.
 * @returns {Point | null} The meeting point, or `null` if the segment misses the polygon entirely.
 */
function segmentIntersectsPolygon(a: Point, b: Point, poly: Point[]): Point | null {
    for (let i = 0; i < poly.length; i++) {
        const c = poly[i];
        const d = poly[(i + 1) % poly.length];
        const hit = intersectSegments(a, b, c, d);
        if (hit) return hit;
    }
    if (isPointInConvexPolygon(a, poly)) return a;
    if (isPointInConvexPolygon(b, poly)) return b;
    return null;
}

/**
 * @function projectPolygonOntoAxis
 * @group Utilities
 * @category Geometry
 *
 * @description Flatten a polygon onto an axis and return the span it covers there. This is the building block
 * of the separating-axis test in {@link hasSeparatingAxisForPolygons}.
 * @param {Point[]} points - The polygon's vertices.
 * @param {Point} axis - The axis to project onto. Need not be normalized.
 * @returns {[number, number]} The minimum and maximum positions along the axis.
 */
function projectPolygonOntoAxis(points: Point[], axis: Point): [number, number] {
    const len = Math.hypot(axis.x, axis.y) || 1;
    const ux = axis.x / len, uy = axis.y / len;

    let min = Infinity, max = -Infinity;
    for (const p of points) {
        const v = p.x * ux + p.y * uy;
        if (v < min) min = v;
        if (v > max) max = v;
    }
    return [min, max];
}

/**
 * @function hasSeparatingAxisForPolygons
 * @group Utilities
 * @category Geometry
 *
 * @description Check whether any edge of the first polygon yields an axis that separates the two, proving
 * they cannot overlap. This is one half of the test — it must be run both ways round, which is what
 * {@link polygonsIntersect} does.
 * @param {Point[]} polyA - The polygon whose edges supply the candidate axes.
 * @param {Point[]} polyB - The polygon to test against.
 * @returns {boolean} `true` if a separating axis exists, meaning the polygons are apart.
 */
function hasSeparatingAxisForPolygons(polyA: Point[], polyB: Point[]): boolean {
    for (let i = 0; i < polyA.length; i++) {
        const p1 = polyA[i];
        const p2 = polyA[(i + 1) % polyA.length];
        const edge = p2.sub(p1);
        const axis = new Point(-edge.y, edge.x);

        const [aMin, aMax] = projectPolygonOntoAxis(polyA, axis);
        const [bMin, bMax] = projectPolygonOntoAxis(polyB, axis);

        if (aMax < bMin || bMax < aMin) return true;
    }
    return false;
}

/**
 * @function polygonsIntersect
 * @group Utilities
 * @category Geometry
 *
 * @description Check whether two convex polygons overlap, using the separating-axis test in both directions.
 * *Note: both polygons must be convex.*
 * @param {Point[]} a - The first polygon's vertices.
 * @param {Point[]} b - The second polygon's vertices.
 * @returns {boolean} `true` if the polygons overlap.
 */
function polygonsIntersect(a: Point[], b: Point[]): boolean {
    return !hasSeparatingAxisForPolygons(a, b) && !hasSeparatingAxisForPolygons(b, a);
}

export {isPointInConvexPolygon, segmentIntersectsPolygon, projectPolygonOntoAxis, hasSeparatingAxisForPolygons, polygonsIntersect};
