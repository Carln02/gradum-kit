import {GradumElement} from "../../../gradumElement/gradumElement";
import {Point} from "../../datatypes/point/point";
import {Coordinate} from "../../../types/basic.types";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {auto} from "../../../decorators/auto/auto";
import {define} from "../../../decorators/define/define";
import {effect, signal} from "../../../decorators/reactivity/reactivity";

/**
 * @class GradumMovable
 * @group Components
 * @category GradumMovable
 *
 * @extends GradumElement
 * @description Positioning wrapper that places arbitrary content via pure CSS transforms.
 * Set {@link translation} (alias {@link position}) and {@link rotation} to move/rotate the
 * wrapper without touching the content's own fields — useful for previews (feedforwards),
 * ghosts, overlays, or any element that must be positioned independently of how its content
 * renders itself.
 *
 * @example
 * ```ts
 * const movable = GradumMovable.create({content: myElement});
 * movable.translation = new Point(120, 40);
 * movable.rotation = Math.PI / 6;
 * movable.translateBy(new Point(5, 0));
 * ```
 */
class GradumMovable<ContentType extends Element = Element> extends GradumElement {
    /** @description The translation applied to the wrapper, in pixels. */
    @signal public translation: Point = new Point();

    /** @description The rotation applied to the wrapper, in radians. */
    @signal public rotation: number = 0;

    /** @description When true, the wrapper is offset by -50% so translation refers to its center. */
    @signal public centerAnchor: boolean = false;

    /** @description The content element wrapped by this movable. Assigning it appends it as a child. */
    @auto() public set content(value: ContentType) {
        if (value) gradum(this).addChild(value);
    }

    protected setupUILayout(): void {
        super.setupUILayout();
        gradum(this).setStyles({display: "inline-block", position: "absolute", left: "0", top: "0"});
    }

    @effect protected updateTransform() {
        const offset = this.centerAnchor ? " - 50%" : "";
        // Instant so per-pointer-event positioning isn't deferred a frame behind by the
        // rAF-batched style queue.
        gradum(this).setStyle("transform", `translate3d(
            calc(${this.translation.x}px${offset}),
            calc(${this.translation.y}px${offset}),
            0) rotate(${this.rotation}rad)`, true);
    }

    /** @description Add the given delta to the current translation. */
    public translateBy(delta: Point) {
        this.translation = this.translation.add(delta);
    }

    /** @description Add the given angle (radians) to the current rotation. */
    public rotateBy(angle: number) {
        this.rotation += angle;
    }

    /**
     * @description Alias of {@link translation}, so code that positions elements through a
     * `position` field (e.g. constrainer solvers) works on the wrapper as-is.
     */
    public get position(): Point {
        return this.translation;
    }

    public set position(value: Point | Coordinate) {
        if (!value) return;
        this.translation = value instanceof Point ? value : new Point(value);
    }
}

define(GradumMovable, "gradum-movable");
export {GradumMovable};
