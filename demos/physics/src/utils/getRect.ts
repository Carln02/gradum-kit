import {Anchor, AnchorPoint, GradumRect, Point} from "../../../../build/gradum-kit.esm";

/**
 * @description Where an object is and which way it faces, as an oriented rect.
 *
 * Asks the object for its own bounding box first, and takes it as-is when it hands back a {@link GradumRect},
 * since that already carries an angle. Otherwise it builds one from `position`, `size`, `rotation` and
 * `anchor` — which is also what keeps this reactive: those are signals, so reading them inside an
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

    const size = Point.from(el.size) ?? Point.from({x: el.width, y: el.height});
    const position = Point.from(el.position);

    if (size?.x && size.y && position) return new GradumRect({
        //The rect understands anchors, so `position` goes in as the origin and it works the rest out.
        x: position.x,
        y: position.y,
        anchor: el.anchor ?? Anchor.TopLeft,
        width: size.x,
        height: size.y,
        angleRad: typeof el.rotation === "number" ? el.rotation : 0
    });

    if (!rect?.width || !rect.height) return undefined;
    return new GradumRect({x: rect.x, y: rect.y, width: rect.width, height: rect.height});
}
