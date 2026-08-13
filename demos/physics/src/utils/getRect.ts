import {Coordinate, GradumRect, Point} from "../../../../build/gradum-kit.esm";

/**
 * @description Read a coordinate-ish value as a Point. Accepts a Point, anything with numeric `x` and `y`, or
 * a single number standing for both axes.
 */
function toPoint(value: any): Point {
    if (value instanceof Point) return value;
    if (typeof value === "number") return new Point(value, value);
    if (value && typeof value.x === "number" && typeof value.y === "number") return new Point(value as Coordinate);
    return undefined;
}

/**
 * @description Where an object is and which way it faces, as an oriented rect.
 *
 * Asks the object for its own bounding box first, and takes it as-is when it hands back a {@link GradumRect},
 * since that already carries an angle. Otherwise it builds one from `position`, `size`, `rotation` and
 * `centerAnchor` — which is also what keeps this reactive: those are signals, so reading them inside an
 * `@effect` subscribes it, where a bare `getBoundingClientRect()` on a plain element would not. Anything with
 * neither gets its painted box back, treated as unrotated.
 *
 * @param {object} el - The element or object to measure.
 * @returns {GradumRect} The rect, or `undefined` for something with no position or no area.
 */
export function getRect(el: any): GradumRect {
    if (!el || typeof el !== "object") return undefined;

    const rect = typeof el.getBoundingClientRect === "function" ? el.getBoundingClientRect() : undefined;
    if (rect instanceof GradumRect) return rect;

    const size = toPoint(el.size) ?? toPoint({x: el.width, y: el.height});
    const position = toPoint(el.position);

    if (size?.x && size.y && position) return new GradumRect({
        x: position.x - (el.centerAnchor ? size.x / 2 : 0),
        y: position.y - (el.centerAnchor ? size.y / 2 : 0),
        width: size.x,
        height: size.y,
        angleRad: typeof el.rotation === "number" ? el.rotation : 0
    });

    if (!rect?.width || !rect.height) return undefined;
    return new GradumRect({x: rect.x, y: rect.y, width: rect.width, height: rect.height});
}
