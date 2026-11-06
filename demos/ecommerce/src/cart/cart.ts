import {Color, Delegate, define, signal} from "../../../../build/gradum-kit.esm";
import {Item} from "../item/item";
import {Collection} from "../collection/collection";
import {CartAmountsHandler} from "./cart.amountsHandler";
import {CartContentsOperator} from "./cart.contentsOperator";
import {CartModel} from "./cart.model";
import {CartView} from "./cart.view";
import {CartProperties} from "./cart.types";
import "./cart.css";

/**
 * @class Cart
 *
 * @extends Collection
 * @description A collection you buy from. On top of holding cards like any collection, a cart keeps count of
 * how much of each product has been added to it, and holds a card for each — see
 * {@link CartContentsOperator}.
 */
export class Cart extends Collection<CartView, CartModel> {
    public declare properties: CartProperties;
    public static defaultProperties: CartProperties = {
        view: CartView,
        model: CartModel,
        handlers: CartAmountsHandler,
        //Its own list replaces the collection's rather than adding to it, so the collection's are listed too.
        operators: [...[Collection.defaultProperties.operators].flat(), CartContentsOperator],
    };

    public static namePrefix: string = "Cart";

    //A panel to shop from, as a catalogue is, rather than a tinted area.
    @signal public color: Color = Color.from("#FFFFFFB3");

    /**
     * @readonly
     * @description Fired when the cart's add button is pressed. What that should do is still to be decided,
     * so the cart says it happened and leaves it there.
     */
    public readonly onAddClicked: Delegate<(cart: Cart) => void> = new Delegate();

    /**
     * @function addItem
     * @description Take an amount of an item, as an item's add button asks it to. Separate from lying in the
     * cart: this is a quantity somebody asked for, that one is where the card happens to be.
     *
     * A locked cart takes nothing.
     * @param {Item} item - The item being added.
     * @param {number} amount - How many of it.
     */
    public addItem(item: Item, amount: number): void {
        //Refusing is the cart's own decision; the sum once it has agreed is the model's.
        if (this.locked) return;
        this.model.amountsHandler.add(item, amount);
    }

    /**
     * @function setAmount
     * @description Say outright how much of an item the cart holds, as an item's stepper does. Zero takes it
     * out. A locked cart is left as it is.
     * @param {Item} item - The item.
     * @param {number} amount - How many of it.
     */
    public setAmount(item: Item, amount: number): void {
        if (this.locked) return;
        this.model.amountsHandler.set(item, amount);
    }

    /**
     * @function howMuchOf
     * @description How much of an item has been added to this cart through an add button.
     * @param {Item} item - The item to ask about.
     * @returns {number} The amount, or `0` if none has been added.
     */
    public howMuchOf(item: Item): number {
        return this.model.amountsHandler.of(item);
    }
}

define(Cart, "demo-cart");
