import {
    behavior, GradumEvent, GradumTool, gradum, Point, Propagation
} from "../../../../build/gradum-kit.esm";
import {Cart} from "../cart/cart";

//A drag that ends up smaller than this is taken as a misclick rather than as a cart nobody could use.
const SmallestCart = 40;

/**
 * @class AddCartTool
 *
 * @extends GradumTool
 * @description Drag on the canvas to mark out a cart. The rectangle follows the pointer while the drag is
 * under way, so the area is drawn rather than typed in, and a drag too small to be meant is thrown away.
 */
export class AddCartTool extends GradumTool {
    public toolName: string = "addCart";

    /**
     * @description The cart being drawn, and the corner the drag started from. A drag draws one cart, so
     * there is never more than one of either.
     */
    protected drawn: Cart;
    protected origin: Point;

    @behavior() public dragStart(e: GradumEvent, target: Node) {
        if (!gradum(target).metadata?.get("substrate")) return Propagation.propagate;

        this.origin = e.position;
        this.drawn = Cart.create({parent: target as Element, position: e.position, size: new Point()});
        return Propagation.stopPropagation;
    }

    @behavior() public drag(e: GradumEvent) {
        if (!this.drawn) return Propagation.propagate;
        this.resize(e.position);
        return Propagation.stopPropagation;
    }

    @behavior() public dragEnd(e: GradumEvent) {
        if (!this.drawn) return Propagation.propagate;
        this.resize(e.position);

        //Too small to have been meant: take it away again rather than leave a sliver on the canvas.
        const size = this.drawn.size;
        if (size.x < SmallestCart || size.y < SmallestCart) this.drawn.delete();

        this.drawn = undefined;
        this.origin = undefined;
        return Propagation.stopPropagation;
    }

    /**
     * @description Lay the cart between the corner the drag started from and where the pointer is now, so
     * dragging in any direction draws the same rectangle.
     * @param {Point} corner - Where the pointer is.
     * @protected
     */
    protected resize(corner: Point) {
        this.drawn.position = new Point(Math.min(this.origin.x, corner.x), Math.min(this.origin.y, corner.y));
        this.drawn.size = new Point(Math.abs(corner.x - this.origin.x), Math.abs(corner.y - this.origin.y));
    }
}
