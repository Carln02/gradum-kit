import {define, expose, GradumElement, gradum, Point} from "../../../../build/gradum-kit.esm";
import {Item} from "../item/item";
import {DropTarget} from "../utils";
import {Cart} from "../cart/cart";
import {CanvasCartConstrainer} from "./canvas.cartConstrainer";
import {CanvasCartsHandler} from "./canvas.cartsHandler";
import {CanvasModel} from "./canvas.model";
import "./canvas.css";

/**
 * @class Canvas
 *
 * @extends GradumElement
 * @description The surface everything is arranged on, and the one place that knows which carts exist.
 *
 * A card dropped on the canvas is laid down where it was dropped and is the canvas's own; a card dropped on
 * a cart becomes that cart's, and one left lying on a cart is taken in by {@link CanvasCartConstrainer}. A
 * cart puts itself on the canvas's list as it is drawn, so anything wanting to offer the carts — an item's
 * add button, say — can ask the canvas rather than having to watch for them.
 */
export class Canvas extends GradumElement<any, any, CanvasModel> implements DropTarget {
    public static defaultProperties = {
        model: CanvasModel,
        handlers: CanvasCartsHandler,
        constrainers: [CanvasCartConstrainer],
    };

    /**
     * @readonly
     * @description The carts drawn on the canvas, in the order they were drawn.
     */
    @expose("model", false) carts: Cart[];

    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "substrate");
        gradum(this).metadata.set(true, "dropTarget");
    }

    /**
     * @function acceptDrop
     * @description Lay a card down on the canvas where it was dropped. A card dragged from the shelf is a
     * catalogue entry, so the canvas takes a copy of it and leaves the shelf's own card where it is;
     * anything else is the card itself, moved here from wherever it was.
     * @param {Item} item - The card that was dropped.
     * @param {Point} position - Where it was let go of.
     */
    public acceptDrop(item: Item, position: Point) {
        if (!(item instanceof Item)) return;
        //A catalogue card is cloned straight onto the canvas rather than cloned and then added: the copy
        //works out what it can be added to as it is built, and it can only do that once it is here.
        const placed = gradum(item).metadata?.get("catalogue") ? item.clone({parent: this}) : item;
        gradum(placed).addToParent(this);
        //Centred on the pointer, so the card lands where the ghost was rather than below and right of it.
        const rect = placed.getBoundingClientRect();
        placed.position = new Point(position.x - rect.width / 2, position.y - rect.height / 2);

        this.syncCarts();
    }

    /**
     * @function syncCarts
     * @description Have every cart look again at what it is holding. Called after a card has been moved
     * between a cart and the canvas, since only the two ends of that move know it happened.
     */
    public syncCarts() {
        this.carts.forEach(cart => cart.syncItems());
    }

    /**
     * @function addCart
     * @description Take note of a cart drawn on the canvas. Called by the cart itself as it appears; there is
     * no need to call it by hand.
     * @param {Cart} cart - The cart to take note of.
     */
    public addCart(cart: Cart) {
        if (!cart.name) cart.name = this.model.cartsHandler.nextFreeName();
        //An id as well as a name, so that anything offering the carts can point at one by a value in the
        //DOM rather than by holding the cart itself.
        this.model.cartsHandler.add(cart);
    }

    /**
     * @function getCart
     * @description The cart whose {@link Cart.dataId} is the given one, as named in an add button's
     * `data-cart`.
     * @param {string} id - The id to look for.
     * @returns {Cart} The cart, or `undefined` if no cart on the canvas answers to that id.
     */
    public getCart(id: string): Cart {
        if (!id) return undefined;
        return this.model.cartsHandler.getCart(id);
    }

    /**
     * @function removeCart
     * @description Forget a cart that has been taken off the canvas.
     * @param {Cart} cart - The cart to forget.
     */
    public removeCart(cart: Cart) {
        this.model.cartsHandler.remove(cart);
    }
}

define(Canvas, "my-canvas");
