import {Anchor, gradum, GradumRect, Point} from "../../../build/gradum-kit.esm";

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

export function atLeastZero(value: number) {
    return Math.max(Number.isFinite(value) ? value : 0, 0);
}

export function formatPrice(value: number) {
    return `$${(value ?? 0).toFixed(2)}`;
}

/**
 * @type {DropTarget}
 * @description Something a dragged card can be let go of over. A drop target says so with the `dropTarget`
 * metadata flag and decides for itself what taking the card means — the canvas lays it down where it was
 * dropped, a cart puts it in its list.
 * @property {(item: object, position: Point) => void} acceptDrop - Take the card, dropped at this point.
 */
export type DropTarget = {
    acceptDrop(item: object, position: Point): void,
};

/**
 * @description Find what a card dropped at this point should be handed to: the innermost thing under the
 * pointer that says it takes drops. Looked up by where the pointer is rather than by what the drag started
 * on, since the two are the whole point of a drag.
 * @param {Point} position - Where the card was let go of.
 * @returns {DropTarget} The target, or `undefined` if nothing under the pointer takes drops.
 */
export function findDropTarget(position: Point): DropTarget {
    let node = document.elementFromPoint(position.x, position.y);
    while (node) {
        const target = node as unknown as DropTarget;
        if (gradum(node).metadata?.get("dropTarget") && typeof target.acceptDrop === "function") return target;
        node = node.parentElement;
    }
    return undefined;
}
