import {define, expose, GradumElement} from "../../../../build/gradum-kit.esm";
import {ItemModel} from "./item.model";
import {ItemView} from "./item.view";
import {Cart, ItemData} from "./item.types";
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
    @expose("model") carts: Cart[];
    @expose("model") cart: Cart;
    @expose("model") cartAmount: number;
    @expose("model") recipeAmount: number;

    /**
     * @readonly
     * @description What the amount currently set for the cart comes to at this item's price.
     */
    @expose("model", false) cartCost: number;

    /**
     * @description Put an amount of this item in the cart it currently points at. Nothing happens when no
     * cart is picked or the amount is zero, so the button is safe to press at any time.
     * @param {number} [amount=this.cartAmount] - How many units to add. Defaults to the amount on the card.
     * @returns {boolean} Whether a cart took the item.
     */
    public addToCart(amount: number = this.cartAmount): boolean {
        if (!this.cart || !(amount > 0)) return false;
        this.cart.addItem(this, amount);
        return true;
    }
}

define(Item, "demo-item");
