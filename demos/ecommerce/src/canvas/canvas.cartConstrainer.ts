import {
    ConstrainerCallbackProperties, GradumConstrainer, GradumEventName, solver
} from "../../../../build/gradum-kit.esm";
import {Cart} from "../cart/cart";
import {Item} from "../item/item";
import {Canvas} from "./canvas";
import {getRect} from "../utils";

/**
 * @class CanvasCartConstrainer
 *
 * @extends GradumConstrainer
 * @description Picks loose cards up into the carts they come to rest on.
 *
 * A card dropped straight onto a cart is the cart's own business — the select tool hands it over and the
 * cart puts it in its order. This is the other way in: a card lying on the canvas that is dragged where it
 * stands and left over a cart, or one a cart is moved on top of, is taken in. Being taken in is a real move
 * — the card becomes the cart's child and gives up placing itself.
 *
 * Which cart a card is over is decided by its centre rather than by any overlap, so a card straddling two
 * carts goes to the one its middle is over, and to exactly one cart.
 */
export class CanvasCartConstrainer extends GradumConstrainer<Canvas> {
    public constrainerName = "carts";

    //Solve only what the user just manipulated, rather than sweeping the whole canvas.
    public defaultQueue = [];

    @solver() protected collectLooseItems(properties: ConstrainerCallbackProperties) {
        //Only once the card has been let go of: moving one across a cart on the way somewhere else should
        //not drop it in, and taking it in mid-drag would pull it out from under the pointer.
        if (properties.eventType !== GradumEventName.dragEnd) return;
        const moved = properties.eventTarget;

        //A cart that moved has to be asked the other way round — which cards does it now cover? — since
        //asking only which cart covers one card would leave a cart swept across the canvas picking up none.
        if (moved instanceof Cart) {
            if (!moved.locked) this.looseItems.filter(item => this.holds(moved, item))
                .forEach(item => moved.insertItem(item));
            return;
        }

        if (!(moved instanceof Item) || !this.looseItems.includes(moved)) return;
        const holder = this.element.carts.find(cart => !cart.locked && this.holds(cart, moved));
        holder?.insertItem(moved);
    }

    /**
     * @readonly
     * @description The cards lying on the canvas itself. A card already in a cart is that cart's child, so
     * it is not among them.
     * @protected
     */
    protected get looseItems(): Item[] {
        return Array.from(this.element.children).filter(child => child instanceof Item) as Item[];
    }

    /**
     * @description Whether a cart covers the middle of an item.
     * @param {Cart} cart - The cart to test.
     * @param {Item} item - The item to test.
     * @returns {boolean} Whether the item's centre lies within the cart's area.
     * @protected
     */
    protected holds(cart: Cart, item: Item): boolean {
        const area = getRect(cart), rect = getRect(item);
        if (!area || !rect) return false;

        //Asked of the rect rather than worked out from its `x`: `x` is wherever the rect is anchored, and
        //a card anchored anywhere but its top-left would have its middle reckoned half a card away.
        const centre = rect.center;
        return centre.x >= area.left && centre.x <= area.right
            && centre.y >= area.top && centre.y <= area.bottom;
    }
}
