import {
    CloneElementOptions, define, effect, expose, GradumElement, gradum, Point
} from "../../../../build/gradum-kit.esm";
import {ItemModel} from "./item.model";
import {ItemView} from "./item.view";
import {ItemData, ItemProperties} from "./item.types";
import {Cart} from "../cart/cart";
import "./item.css";

/**
 * @class Item
 *
 * @extends GradumElement
 * @description A grocery item, as a card: its picture, name and price per unit, and the two amounts you can
 * set on it — how much of it to add to a cart, and how much of it a recipe uses. The card can be pointed at
 * any number of carts and adds to whichever one is picked.
 */
export class Item extends GradumElement<ItemView, ItemData, ItemModel> {
    public declare properties: ItemProperties;
    public static defaultProperties = {
        view: ItemView,
        model: ItemModel,
    };

    //Exposed from the model, so a card reads and writes as one object. The first four reach through to the
    //model's data; the rest are the model's own.
    @expose("model") name: string;
    @expose("model") image: string;
    @expose("model") price: number;
    @expose("model") unit: string;
    @expose("model") cart: Cart;
    @expose("model") cartAmount: number;

    /**
     * @description Where the card sits on the canvas. Unset while it is in a list.
     */
    @expose("model") position: Point;
    @expose("model") recipeAmount: number;

    @expose("view") showAddButton: boolean;
    @expose("view") showRecipe: boolean;

    /**
     * @readonly
     * @description What the amount currently set for the cart comes to at this item's price.
     */
    @expose("model", false) cartCost: number;

    /**
     * @description How the card is taken hold of, which follows from whether it places itself. A card with a
     * position of its own is dragged where it stands; one laid out by whatever it is in — the shelf, a cart —
     * is dragged and dropped instead, since moving it in place would mean nothing.
     */
    @effect protected isModifiable() {
        const placed = !!this.model.position;
        gradum(this).metadata.set(placed, "modifiable");
        gradum(this).metadata.set(!placed, "dragAndDroppable");
    }

    /**
     * @function clone
     * @description A second card for the same item. What the shelf hands over when one of its cards is
     * dragged onto the canvas: the shelf's own card is a catalogue entry and stays where it is.
     *
     * Give it the parent it is going to rather than adding it afterwards — a card works out what it can be
     * added to from where it is, and it works that out as it is built.
     * @param {CloneElementOptions} [options] - Where the new card goes, under `parent`.
     * @returns {Item} The new card.
     */
    public clone(options: CloneElementOptions & {parent?: Element} = {}): this {
        return Item.create({
            parent: options.parent,
            data: {name: this.name, image: this.image, price: this.price, unit: this.unit},
            cartAmount: this.cartAmount,
            recipeAmount: this.recipeAmount
        }) as this;
    }

    /**
     * @function delete
     * @description Get rid of the card, and the add dropdown's popup with it. What the delete tool calls.
     * Use it over `remove()`: the popup is parked outside the card, so removing the card alone would leave
     * it behind.
     */
    public delete() {
        gradum(this).destroy();
    }
}

define(Item, "demo-item");
