import {Point} from "../point/point";
import {AnchorPoint} from "../anchorPoint/anchorPoint";
import {Anchor} from "../../../types/enums.types";
import {GradumRectProperties} from "./rect.types";
import {trim} from "../../../utils/computations/misc";
import {polygonsIntersect, segmentIntersectsPolygon} from "../../../utils/geometry/polygon";
import {closestPointOnSegment} from "../../../utils/geometry/segment";
import {aabbCorners, closestPointOnAabb} from "../../../utils/geometry/aabb";
import {element} from "../../../elementCreation/element";
import {css} from "../../../utils/styling/css";

/**
 * @class GradumRect
 * @group Components
 * @category Data Structures
 *
 * @extends DOMRect
 * @description A rectangle that can be rotated, unlike the axis-aligned
 * [DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) it extends. Its geometry helpers
 * ({@link GradumRect.closestPoint}, {@link GradumRect.distanceTo}, {@link GradumRect.overlaps}) all
 * account for the rotation, and accept a point, a segment, or another rect.
 */
class GradumRect extends DOMRect {
    /**
     * @description The rectangle's rotation in radians, about its {@link GradumRect.anchor}.
     */
    public angleRad: number = 0;

    /**
     * @description The point of the rectangle that `x` and `y` give the position of, and that it turns
     * about. Defaults to `Anchor.TopLeft`, which is what makes an unrotated rectangle read exactly like the
     * `DOMRect` it extends.
     *
     * *Note: the `left`, `top`, `right` and `bottom` inherited from `DOMRect` are derived from `x`, `y`,
     * `width` and `height` alone, so they describe the box only while it is unrotated and anchored to its
     * top-left. Use {@link GradumRect.points} or {@link GradumRect.center} otherwise.*
     */
    public anchor: AnchorPoint;

    /**
     * @constructor
     * @description Create a rectangle. Give either `angleRad` or `angleDeg` to rotate it; omitting both
     * leaves it axis-aligned.
     * @param {GradumRectProperties} [properties={}] - The rectangle's position, size, rotation, and anchor.
     */
    constructor(properties: GradumRectProperties = {}) {
        super(properties.x ?? 0, properties.y ?? 0, properties.width ?? 0, properties.height ?? 0);
        if (properties.angleRad !== undefined) this.angleRad = properties.angleRad;
        else if (properties.angleDeg !== undefined) this.angleDeg = properties.angleDeg;
        this.anchor = properties.anchor instanceof AnchorPoint
            ? properties.anchor : new AnchorPoint(properties.anchor ?? Anchor.TopLeft);
    }

    /**
     * @function fromSegment
     * @static
     * @description Build a rectangle covering the segment between two points: centred on the segment,
     * as long as it, and rotated to match its direction.
     * @param {Point} a - The segment's start.
     * @param {Point} b - The segment's end.
     * @param {number} [thickness=1] - The rectangle's height, across the segment.
     * @param {GradumRectProperties} [properties={}] - Extra properties. The computed rotation wins over
     * any angle given here.
     * @returns {GradumRect} The rectangle covering the segment.
     */
    public static fromSegment(a: Point, b: Point, thickness: number = 1, properties: GradumRectProperties = {}): GradumRect {
        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const length = Math.hypot(dx, dy);
        const angleRad = Math.atan2(dy, dx);
        const mid = new Point((a.x + b.x) / 2, (a.y + b.y) / 2);

        //Anchored and turned about the segment's midpoint, which is what keeps it lying along the segment.
        return new GradumRect({
            x: mid.x, y: mid.y, width: length, height: thickness,
            anchor: Anchor.Center, ...properties, angleRad
        });
    }

    /**
     * @function fromDOMRect
     * @static
     * @description Build a rectangle from a plain `DOMRect`, such as one returned by
     * `getBoundingClientRect()`.
     * @param {DOMRect} rect - The rect to copy position and size from.
     * @param {GradumRectProperties} [properties={}] - Extra properties, such as a rotation to apply.
     * @returns {GradumRect} The converted rectangle.
     */
    public static fromDOMRect(rect: DOMRect, properties: GradumRectProperties = {}): GradumRect {
        return new GradumRect({x: rect.x, y: rect.y, width: rect.width, height: rect.height, ...properties});
    }

    /**
     * @function render
     * @description Create a translucent red `div` matching this rectangle's position, size, and rotation.
     * Meant for debugging geometry — append the result to the document to see where the rect actually is.
     * @returns {HTMLElement} The generated element. It is not attached to the document.
     */
    public render() {
        //Positioned by the untilted box around the centre and turned about that centre, which reproduces the
        //same quadrilateral whatever the anchor is — the anchor has already been accounted for in `center`.
        const corner = this.topLeft;
        return element({tag: "div", style: css`position: absolute; 
                width: ${this.width}px; height: ${this.height}px; 
                top: ${corner.y}px; left: ${corner.x}px; background-color: red; pointer-events: none; opacity: 0.4;
                transform: rotate(${this.angleRad}rad)`}) as HTMLElement;
    }

    /**
     * @description The rectangle's rotation in degrees. Reads and writes the same rotation as
     * {@link GradumRect.angleRad}, converted.
     */
    public get angleDeg(): number {
        return (this.angleRad * 180) / Math.PI;
    }

    public set angleDeg(value: number) {
        this.angleRad = (value * Math.PI) / 180;
    }

    /**
     * @readonly
     * @description The rectangle's centre point, wherever its anchor has put it. `x` and `y` give the
     * anchor's position and the rectangle turns about that anchor, so the centre swings around it as the
     * rotation changes — for the default top-left anchor and no rotation this is the familiar
     * `x + width / 2, y + height / 2`.
     */
    public get center(): Point {
        return this.origin.sub(this.anchor.offsetIn(this.size, this.angleRad));
    }

    /**
     * @readonly
     * @description Where the rectangle's anchor sits: its `x` and `y`, as a point.
     */
    public get origin(): Point {
        return new Point(this.x, this.y);
    }

    /**
     * @readonly
     * @description The rectangle's width and height, as a point.
     */
    public get size(): Point {
        return new Point(this.width, this.height);
    }

    /**
     * @function pointAt
     * @description Where one of the rectangle's anchors sits, in the same coordinates as `x` and `y`. Follows
     * the rotation, so it reports where that part of the rectangle actually is rather than where it would sit
     * unrotated.
     * @param {Anchor | Point | AnchorPoint} anchor - The anchor to locate.
     * @returns {Point} Its position.
     *
     * @example
     * ```ts
     * //A rect anchored at its centre still knows where its corner is.
     * const rect = new GradumRect({x: 400, y: 300, width: 100, height: 80, anchor: Anchor.Center});
     * rect.pointAt(Anchor.TopLeft); //(350, 260)
     * ```
     */
    public pointAt(anchor: Anchor | Point | AnchorPoint): Point {
        const point = anchor instanceof AnchorPoint ? anchor : new AnchorPoint(anchor);
        return this.center.add(point.offsetIn(this.size, this.angleRad));
    }

    /**
     * @readonly
     * @description The unit vector along the rectangle's own x axis, pointing along its width once rotated.
     */
    public get xAxis(): Point {
        return new Point(Math.cos(this.angleRad), Math.sin(this.angleRad));
    }

    /**
     * @readonly
     * @description The unit vector along the rectangle's own y axis, pointing along its height once rotated.
     */
    public get yAxis(): Point {
        return new Point(-Math.sin(this.angleRad), Math.cos(this.angleRad));
    }

    /**
     * @readonly
     * @description Half the rectangle's width and height, as a point.
     */
    public get half(): Point {
        return new Point(this.width / 2, this.height / 2);
    }

    /**
     * @readonly
     * @description The corner to lay the rectangle out from: the top-left of the untilted box sitting at
     * {@link GradumRect.center}. Rotating that box about its own middle reproduces this rectangle, whatever
     * it is anchored to — which is what makes it the value a `translate(...) rotate(...)` transform, or a
     * canvas `drawImage`, wants.
     *
     * *Note: not the same as the rectangle's actual top-left corner once it is rotated. For that, ask for
     * {@link GradumRect.points}`[0]` or {@link GradumRect.pointAt}`(Anchor.TopLeft)`.*
     *
     * @example
     * ```ts
     * gradum(el).setStyle("transform", `translate(${rect.topLeft.x}px, ${rect.topLeft.y}px)
     *     rotate(${rect.angleRad}rad)`);
     * ```
     */
    public get topLeft(): Point {
        return this.center.sub(this.half);
    }

    /**
     * @readonly
     * @description The rectangle's four corners in screen coordinates, clockwise from the top-left,
     * with the rotation applied.
     */
    public get points(): [Point, Point, Point, Point] {
        const c = this.center;
        const ux = this.xAxis;
        const uy = this.yAxis;
        const half = this.half;

        const ex = new Point(ux.x * half.x, ux.y * half.x);
        const ey = new Point(uy.x * half.y, uy.y * half.y);

        return [c.sub(ex).sub(ey), c.add(ex).sub(ey), c.add(ex).add(ey), c.sub(ex).add(ey)];
    }

    /**
     * @function closestPoint
     * @description Find the point on this rectangle nearest to the given point. Points inside the
     * rectangle return themselves.
     * @param {Point} point - The point to measure to.
     * @returns {Point} The nearest point on this rectangle.
     */
    public closestPoint(point: Point): Point;

    /**
     * @function closestPoint
     * @description Find the point on this rectangle nearest to the segment between two points. Returns
     * the intersection if the segment crosses the rectangle.
     * @param {Point} point1 - The segment's start.
     * @param {Point} point2 - The segment's end.
     * @returns {Point} The nearest point on this rectangle.
     */
    public closestPoint(point1: Point, point2: Point): Point;

    /**
     * @function closestPoint
     * @description Find the point on this rectangle nearest to another rectangle. Accepts a plain
     * `DOMRect` or a rotated {@link GradumRect}.
     * @param {DOMRect} rect - The rectangle to measure to.
     * @returns {Point} The nearest point on this rectangle.
     */
    public closestPoint(rect: DOMRect): Point;
    public closestPoint(...args: any[]): Point {
        // (1) Point -> Closest point ON THIS rect to that point
        if (args.length === 1 && args[0] instanceof Point) {
            const point = args[0] as Point;
            const c = this.center;
            const ux = this.xAxis;
            const uy = this.yAxis;

            const d = point.sub(c);
            const lx = d.x * ux.x + d.y * ux.y;
            const ly = d.x * uy.x + d.y * uy.y;

            const cx = trim(lx, this.width / 2, -this.width / 2);
            const cy = trim(ly, this.height / 2, -this.height / 2);

            return c.add(new Point(ux.x * cx, ux.y * cx)).add(new Point(uy.x * cy, uy.y * cy));
        }

        // (2) Segment AB -> Closest point ON THIS rect to segment AB
        if (args.length === 2 && args[0] instanceof Point && args[1] instanceof Point) {
            const a = args[0] as Point;
            const b = args[1] as Point;

            const thisPoly = this.points;

            // If segment intersects this rect, distance is 0.
            const hit = segmentIntersectsPolygon(a, b, thisPoly);
            if (hit) return hit;

            // Candidates on THIS rect:
            // - closest points to endpoints
            // - corners of this rect
            let best = this.closestPoint(a);
            let bestDist = Point.dist(best, a);

            const pb = this.closestPoint(b);
            const db = Point.dist(pb, b);
            if (db < bestDist) {
                bestDist = db;
                best = pb;
            }

            for (const corner of thisPoly) {
                const q = closestPointOnSegment(corner, a, b);
                const d = Point.dist(corner, q);
                if (d < bestDist) {
                    bestDist = d;
                    best = corner;
                }
            }

            return best;
        }

        // (3) Rect (AABB DOMRect or GradumRect)
        if (args.length === 1 && (args[0] instanceof DOMRect || args[0] instanceof GradumRect)) {
            const other = args[0] as DOMRect;
            const thisPoly = this.points;
            const otherPoly: Point[] = other instanceof GradumRect ? other.points : aabbCorners(other);

            // If intersects, any point with distance 0 is fine
            if (polygonsIntersect(thisPoly, otherPoly)) {
                const oc = other instanceof GradumRect ? other.center
                    : new Point(other.x + other.width / 2, other.y + other.height / 2);
                return this.closestPoint(oc);
            }

            // Otherwise pick the point ON THIS rect that minimizes distance to the other shape
            let best = thisPoly[0];
            let bestDist = Infinity;

            // distance from a point p to the other rect
            const distToOther = (p: Point): number => {
                const q = other instanceof GradumRect ? other.closestPoint(p) : closestPointOnAabb(p, other);
                return Point.dist(p, q);
            };

            // 1) corners of THIS rect
            for (const p of thisPoly) {
                const d = distToOther(p);
                if (d < bestDist) {
                    bestDist = d;
                    best = p;
                }
            }

            // 2) closest points on THIS rect to corners of OTHER rect
            for (const p of otherPoly) {
                const q = this.closestPoint(p); // ON THIS rect
                const d = distToOther(q);
                if (d < bestDist) {
                    bestDist = d;
                    best = q;
                }
            }

            return best;
        }

        return;
    }

    /**
     * @function distanceTo
     * @description Measure the shortest distance from this rectangle to a point.
     * @param {Point} point - The point to measure to.
     * @returns {number} The distance, or `0` if the point is inside this rectangle.
     */
    public distanceTo(point: Point): number;

    /**
     * @function distanceTo
     * @description Measure the shortest distance from this rectangle to the segment between two points.
     * @param {Point} point1 - The segment's start.
     * @param {Point} point2 - The segment's end.
     * @returns {number} The distance, or `0` if the segment crosses this rectangle.
     */
    public distanceTo(point1: Point, point2: Point): number;

    /**
     * @function distanceTo
     * @description Measure the shortest distance from this rectangle to another rectangle.
     * @param {DOMRect} rect - The rectangle to measure to.
     * @returns {number} The distance, or `0` if the two overlap.
     */
    public distanceTo(rect: DOMRect): number;
    public distanceTo(...args: any[]): number {
        // Point
        if (args.length === 1 && args[0] instanceof Point) {
            const p = args[0] as Point;
            const q = this.closestPoint(p);
            return Point.dist(p, q);
        }

        // Segment AB
        if (args.length === 2 && args[0] instanceof Point && args[1] instanceof Point) {
            const a = args[0] as Point;
            const b = args[1] as Point;
            const pr = this.closestPoint(a, b);
            const ps = closestPointOnSegment(pr, a, b);
            return Point.dist(pr, ps);
        }

        // Rect
        if (args.length === 1 && (args[0] instanceof DOMRect || args[0] instanceof GradumRect)) {
            const other = args[0] as DOMRect;
            const pr = this.closestPoint(other);
            const po = other instanceof GradumRect ? other.closestPoint(pr) : closestPointOnAabb(pr, other);
            return Point.dist(pr, po);
        }

        return NaN;
    }

    /**
     * @function overlaps
     * @description Test whether this rectangle overlaps another. Accepts a plain `DOMRect` or a rotated
     * {@link GradumRect}.
     * @param {DOMRect} other - The rectangle to test against.
     * @returns {boolean} Whether the two overlap.
     */
    public overlaps(other: DOMRect): boolean;

    /**
     * @function overlaps
     * @description Test whether a point lies on or inside this rectangle.
     * @param {Point} point - The point to test.
     * @returns {boolean} Whether the point is contained.
     */
    public overlaps(point: Point): boolean;

    /**
     * @function overlaps
     * @description Test whether the segment between two points crosses this rectangle.
     * @param {Point} a - The segment's start.
     * @param {Point} b - The segment's end.
     * @returns {boolean} Whether the segment intersects this rectangle.
     */
    public overlaps(a: Point, b: Point): boolean;
    public overlaps(...args: any[]): boolean {
        // (1) Point
        if (args.length === 1 && args[0] instanceof Point) {
            const p = args[0] as Point;
            const q = this.closestPoint(p);
            return Point.dist(p, q) <= 1e-6;
        }

        // (2) Segment AB
        if (args.length === 2 && args[0] instanceof Point && args[1] instanceof Point) {
            const a = args[0] as Point;
            const b = args[1] as Point;
            return segmentIntersectsPolygon(a, b, this.points) !== null;
        }

        // (3) Rect (DOMRect or GradumRect)
        if (args.length === 1 && (args[0] instanceof GradumRect || args[0] instanceof DOMRect)) {
            const other = args[0] as (DOMRect | GradumRect);
            const polyA = this.points;
            const polyB: Point[] = other instanceof GradumRect ? other.points : aabbCorners(other);
            return polygonsIntersect(polyA, polyB);
        }

        return false;
    }

}

export {GradumRect};