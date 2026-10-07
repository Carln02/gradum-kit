import {auto, Color, GradumModel, handler, Point, signal} from "../../../../build/gradum-kit.esm";
import {CartAmountsHandler} from "./cart.amountsHandler";
import {Item} from "../item/item";

/**
 * @class CartModel
 *
 * @extends GradumModel
 * @description What a cart is and what is in it: the area it covers on the canvas, what it is called,
 * whether it is closed to changes, and the items currently lying on it.
 */
export class CartModel extends GradumModel {
    /**
     * @description What the cart is called. Shown on the area, and what an item's add dropdown lists it as.
     */
    @signal public name: string = "";

    @signal public id: string = "";

    /**
     * @description The colour of the area. Pale by default, since items sit on top of it and have to stay
     * readable.
     */
    @signal public color: string = Color.random([70, 95], [80, 92]).toString();

    /**
     * @description The top-left corner of the area, in page coordinates.
     */
    @signal public position: Point = new Point();

    /**
     * @description How big the area is. Never smaller than nothing, so a drag that goes backwards still
     * describes a rectangle.
     */
    @signal @auto({
        preprocessValue: (value: any) => (Point.from(value) ?? new Point()).bound(0, Infinity, 0, Infinity)
    }) accessor size: Point = new Point(240, 180);

    /**
     * @description Whether the cart is closed to changes. A locked cart cannot be moved and takes nothing
     * in — what it holds is what it held when it was locked.
     */
    @signal public locked: boolean = false;

    /**
     * @description The cards in the cart, in the order they are laid out. Read back off the cart's own
     * children by {@link Cart.syncItems} rather than set directly, so the list and the screen cannot differ.
     */
    @signal public items: Item[] = [];

    /**
     * @description How much of each item has been added to this cart through an item's add button, as
     * opposed to merely lying on its area. Read and written through {@link CartModel.amountsHandler}.
     */
    public readonly amounts: Map<Item, number> = new Map();

    /**
     * @description What the cart has been asked for, and the sums over it.
     */
    @handler() public amountsHandler: CartAmountsHandler;
}
