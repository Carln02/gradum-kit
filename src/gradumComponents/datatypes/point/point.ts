import {Coordinate} from "../../../types/basic.types";
import {trim} from "../../../utils/computations/misc";

/**
 * @group Components
 * @category Data Structures
 */
class Point {
    /**
     * @readonly
     * @description The point's x coordinate. Points are immutable — the arithmetic methods return new
     * points rather than changing this one.
     */
    public readonly x: number;
    /**
     * @readonly
     * @description The point's y coordinate.
     */
    public readonly y: number;

    /**
     * @description Create a point with coordinates (0, 0)
     */
    constructor()
    /**
     * @description Create a point with coordinates (n, n)
     * @param {number} n - The input value
     */
    constructor(n: number)
    /**
     * @description Create a point with coordinates (x, y)
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     */
    constructor(x: number, y: number)
    /**
     * @description Create a point with the clientX/clientY values. Useful for events.
     * @param {{clientX: number, clientY: number}} e - The coordinates
     */
    constructor(e: { clientX: number, clientY: number })
    /**
     * @description Create a point with the provided coordinates
     * @param {Coordinate} p - The coordinates (or Point)
     */
    constructor(p: Coordinate)
    /**
     * @description Create a point with the provided [x, y] values.
     * @param {[number, number]} arr - The array of size 2.
     */
    constructor(arr: [number, number])
    constructor(x: number | Coordinate | { clientX: number, clientY: number } | [number, number])
    constructor(x: number | Coordinate | { clientX: number, clientY: number } | [number, number] = 0,
                y: number = typeof x == "number" ? x : 0) {
        if (typeof x == "number") {
            this.x = x;
            this.y = y;
        } else if ("clientX" in x) {
            this.x = x.clientX;
            this.y = x.clientY;
        } else if ("x" in x) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x[0];
            this.y = x[1];
        }
    }

    // Static methods

    /**
     * @description Calculate the distance between two Position2D points.
     * @param {Point} p1 - First point
     * @param {Point} p2 - Second point
     */
    public static dist(p1: Coordinate, p2: Coordinate): number {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    /**
     * @description Calculate the mid-point from the provided points
     * @param {Point[]} arr - Undetermined number of point parameters
     */
    public static midPoint(...arr: Coordinate[]): Point {
        const points = arr.filter(p => p != null);
        if (points.length == 0) return null;
        const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
        return new Point(x, y);
    }

    /**
     * @description Calculate the max on both x and y from the provided points
     * @param {Point[]} arr - Undetermined number of point parameters
     */
    public static max(...arr: Coordinate[]): Point {
        const points = arr.filter(p => p != null);
        if (points.length == 0) return null;
        const x = points.reduce((max, p) => Math.max(max, p.x), -Infinity);
        const y = points.reduce((max, p) => Math.max(max, p.y), -Infinity);
        return new Point(x, y);
    }

    /**
     * @description Calculate the min on both x and y from the provided points
     * @param {Point[]} arr - Undetermined number of point parameters
     */
    public static min(...arr: Coordinate[]): Point {
        const points = arr.filter(p => p != null);
        if (points.length == 0) return null;
        const x = points.reduce((min, p) => Math.min(min, p.x), Infinity);
        const y = points.reduce((min, p) => Math.min(min, p.y), Infinity);
        return new Point(x, y);
    }

    // Instance methods

    /**
     * @readonly
     * @description This point as a plain `{x, y}` object, detached from this instance.
     */
    public get object(): Coordinate {
        return {x: this.x, y: this.y};
    }

    /**
     * @description Determine whether this point is equal to the given coordinates.
     * @param {Coordinate} p - The coordinates to compare against.
     * @returns {boolean} Whether both coordinates match.
     */
    public equals(p: Coordinate): boolean
    /**
     * @description Determine whether this point is equal to the given coordinates.
     * @param {number} x - The x coordinate to compare against.
     * @param {number} y - The y coordinate to compare against.
     * @returns {boolean} Whether both coordinates match.
     */
    public equals(x: number, y: number): boolean
    public equals(x: number | Coordinate, y: number = 0): boolean {
        if (typeof x == "number") return this.x == x && this.y == y;
        return this.x == x.x && this.y == x.y;
    }

    /**
     * @function boundX
     * @description Clamp this point's x coordinate to a range.
     * @param {number} x1 - The lower bound.
     * @param {number} x2 - The upper bound.
     * @returns {number} The clamped x coordinate. This point is left unchanged.
     */
    public boundX(x1: number, x2: number): number {
        return this.x < x1 ? x1
            : this.x > x2 ? x2
                : this.x;
    }

    /**
     * @function boundY
     * @description Clamp this point's y coordinate to a range.
     * @param {number} y1 - The lower bound.
     * @param {number} y2 - The upper bound.
     * @returns {number} The clamped y coordinate. This point is left unchanged.
     */
    public boundY(y1: number, y2: number): number {
        return this.y < y1 ? y1
            : this.y > y2 ? y2
                : this.y;
    }

    /**
     * @function bound
     * @description Clamp both coordinates to the same range.
     * @param {number} n1 - The lower bound for both axes.
     * @param {number} n2 - The upper bound for both axes.
     * @returns {Point} A new clamped point. This point is left unchanged.
     */
    public bound(n1: number, n2: number): Point

    /**
     * @function bound
     * @description Clamp each coordinate to its own range.
     * @param {number} x1 - The lower bound for x.
     * @param {number} x2 - The upper bound for x.
     * @param {number} [y1=x1] - The lower bound for y. Defaults to the x bound.
     * @param {number} [y2=x2] - The upper bound for y. Defaults to the x bound.
     * @returns {Point} A new clamped point. This point is left unchanged.
     */
    public bound(x1: number, x2: number, y1?: number, y2?: number): Point
    public bound(x1: number, x2: number, y1: number = x1, y2: number = x2): Point {
        return new Point(this.boundX(x1, x2), this.boundY(y1, y2));
    }

    /**
     * @description Add coordinates to this point
     * @param {number} n - The value to add to both x and y
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public add(n: number): Point
    /**
     * @description Add coordinates to this point
     * @param {number} x - The value to add to the x coordinate
     * @param {number} y - The value to add to the y coordinate
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public add(x: number, y: number): Point
    /**
     * @description Add coordinates to this point
     * @param {Coordinate} p - The coordinates to add
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public add(p: Coordinate): Point
    public add(x: number | Coordinate, y?: number): Point {
        if (typeof x == "number") return new Point(this.x + x, this.y + (y || y == 0 ? y : x));
        return new Point(this.x + x.x, this.y + x.y);
    }

    /**
     * @description Subtract coordinates from this point
     * @param {number} n - The value to subtract from both x and y
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public sub(n: number): Point
    /**
     * @description Subtract coordinates from this point
     * @param {number} x - The value to subtract from the x coordinate
     * @param {number} y - The value to subtract from the y coordinate
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public sub(x: number, y: number): Point
    /**
     * @description Subtract coordinates from this point
     * @param {Coordinate} p - The coordinates to subtract
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public sub(p: Coordinate): Point
    public sub(x: number | Coordinate, y?: number): Point {
        if (typeof x == "number") return new Point(this.x - x, this.y - (y || y == 0 ? y : x));
        return new Point(this.x - x.x, this.y - x.y);
    }

    /**
     * @description Multiply coordinates of this point
     * @param {number} n - The value to multiply both x and y
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public mul(n: number): Point
    /**
     * @description Multiply coordinates of this point
     * @param {number} x - The value to multiply the x coordinate
     * @param {number} y - The value to multiply the y coordinate
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public mul(x: number, y: number): Point
    /**
     * @description Multiply coordinates of this point
     * @param {Coordinate} p - The coordinates to multiply
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public mul(p: Coordinate): Point
    public mul(x: number | Coordinate, y?: number): Point {
        if (typeof x == "number") return new Point(this.x * x, this.y * (y || y == 0 ? y : x));
        return new Point(this.x * x.x, this.y * x.y);
    }

    /**
     * @description Divide coordinates of this point
     * @param {number} n - The value to divide both x and y
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public div(n: number): Point
    /**
     * @description Divide coordinates of this point
     * @param {number} x - The value to divide the x coordinate
     * @param {number} y - The value to divide the y coordinate
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public div(x: number, y: number): Point
    /**
     * @description Divide coordinates of this point
     * @param {Coordinate} p - The coordinates to divide with
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public div(p: Coordinate): Point
    public div(x: number | Coordinate, y?: number): Point {
        if (typeof x == "number") return new Point(this.x / x, this.y / (y || y == 0 ? y : x));
        return new Point(this.x / x.x, this.y / x.y);
    }

    /**
     * @description Mod coordinates of this point
     * @param {number} n - The value to mod both x and y
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public mod(n: number): Point
    /**
     * @description Mod coordinates of this point
     * @param {number} x - The value to mod the x coordinate
     * @param {number} y - The value to mod the y coordinate
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public mod(x: number, y: number): Point
    /**
     * @description Mod coordinates of this point
     * @param {Coordinate} p - The coordinates to mod with
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    public mod(p: Coordinate): Point
    public mod(x: number | Coordinate, y?: number): Point {
        const modDiv = typeof x == "number" ?
            {x: x, y: (y || y == 0 ? y : x)} : {x: x.x, y: x.y};
        const temp = this.object;

        while (temp.x < 0) temp.x += modDiv.x;
        while (temp.x >= modDiv.x) temp.x -= modDiv.x;

        while (temp.y < 0) temp.y += modDiv.y;
        while (temp.y >= modDiv.y) temp.y -= modDiv.y;

        return new Point(temp);
    }

    /**
     * @description Calculate the absolute value of the coordinates
     * @returns {Point} A new point with both coordinates made positive. This point is left unchanged.
     */
    public get abs(): Point {
        return new Point(Math.abs(this.x), Math.abs(this.y));
    }

    /**
     * @description Get the maximum value between x and y coordinates
     * @returns {number} The larger of the two coordinates.
     */
    public get max(): number {
        return Math.max(this.x, this.y);
    }

    /**
     * @description Get the minimum value between x and y coordinates
     * @returns {number} The smaller of the two coordinates.
     */
    public get min(): number {
        return Math.min(this.x, this.y);
    }

    /**
     * @readonly
     * @description The squared distance from the origin to this point. Cheaper than {@link Point.length}
     * since it skips the square root — use it when comparing magnitudes.
     */
    public get length2(): number {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * @readonly
     * @description The distance from the origin to this point.
     */
    public get length(): number {
        return Math.sqrt(this.length2)
    }

    /**
     * @function dot
     * @description Compute the dot product of this point and another, treating both as vectors.
     * @param {Point} p - The other vector.
     * @returns {number} The dot product. Zero means the two are perpendicular.
     */
    public dot(p: Point): number {
        return this.x * p.x + this.y * p.y;
    }

    /**
     * @description Create a copy of the current point
     * @returns {Point} A new point with the same coordinates.
     */
    public copy(): Point {
        return new Point(this.x, this.y);
    }

    /**
     * @description Get the coordinates as an array
     * @returns {number[]} A two-element array, `[x, y]`.
     */
    public arr(): number[] {
        return [this.x, this.y];
    }

    /**
     * @function positionOnSegment
     * @description Find how far along a segment this point projects, as a fraction from its start to its
     * end. Useful for snapping a position onto a line.
     * @param {Point} start - The segment's start.
     * @param {Point} end - The segment's end.
     * @returns {number} A value from `0` (at the start) to `1` (at the end), clamped to that range.
     * Returns `0` for a zero-length segment.
     */
    public positionOnSegment(start: Point, end: Point): number {
        const shiftedEnd = end.sub(start);
        const shiftedLength2 = shiftedEnd.length2;
        if (shiftedLength2 < 1e-9) return 0;
        return trim((this.sub(start).dot(shiftedEnd)) / shiftedLength2, 1);
    }

    /**
     * @function linearInterpolation
     * @static
     * @description Interpolate between two points.
     * @param {Point} start - The point at `t = 0`.
     * @param {Point} end - The point at `t = 1`.
     * @param {number} t - The interpolation fraction. Values outside `0`–`1` extrapolate past the ends.
     * @returns {Point} The interpolated point.
     */
    public static linearInterpolation(start: Point, end: Point, t: number): Point {
        return start.add(end.sub(start).mul(t));
    }

    /**
     * @function toString
     * @description Serialize this point to a JSON string, in the form {@link Point.fromString} reads.
     * @returns {string} The serialized point, e.g. `'{"x":1,"y":2}'`.
     */
    public toString(): string {
        return JSON.stringify({x: this.x, y: this.y});
    }

    /**
     * @function from
     * @static
     * @description Parse a point from a JSON string produced by {@link Point.toString}.
     * @param {string} value - The string to parse.
     * @returns {Point} The parsed point, or `undefined` if the string is not valid JSON holding numeric
     * `x` and `y` fields.
     */
    public static from(value: string): Point {
        try {
            const parsed = JSON.parse(value);
            if (typeof parsed.x === "number" && typeof parsed.y === "number")
                return new Point(parsed.x, parsed.y);
        } catch { /* fall through to undefined */ }
        return undefined;
    }

    /**
     * @function fromString
     * @description Parse a point from a JSON string produced by {@link Point.toString}. Delegates to
     * {@link Point.from}; it exists as an instance method because {@link GradumInput} discovers a value's
     * parser by looking for `fromString` on the value itself, which a static member would not satisfy.
     * @param {string} value - The string to parse.
     * @returns {Point} The parsed point, or `undefined` if the string is not valid JSON holding numeric
     * `x` and `y` fields.
     */
    public fromString(value: string): Point {
        return Point.from(value);
    }
}

export {Point};
