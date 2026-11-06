import {GradumHandler} from "../../../../build/gradum-kit.esm";
import type {Item} from "../item/item";
import type {ItemData} from "../item/item.types";
import {CartModel} from "./cart.model";

/**
 * @class CartAmountsHandler
 *
 * @extends GradumHandler
 * @description What has been asked for from the cart, and how much of it.
 *
 * Kept apart from the items lying on the cart's area: that is where a card happens to be, this is a quantity
 * somebody pressed a button for. Nothing here touches the page, so it is the model's business rather than
 * the cart element's.
 *
 * Counted by product rather than by card, so every card for the same product — on another page of a
 * catalogue, or dragged out of it — reads the same amount.
 */
export class CartAmountsHandler extends GradumHandler<CartModel> {
    public keyName: string = "amounts";

    /**
     * @description What an item is counted under: its product's id, or its name for an item made by hand.
     * @param {Item} item - The item.
     * @returns {string} Its key.
     */
    public static keyOf(item: Item): string {
        return item?.data?.id ?? item?.name;
    }

    /**
     * @function add
     * @description Add an amount of an item to what the cart has been asked for, on top of whatever it was
     * already asked for.
     * @param {Item} item - The item being added.
     * @param {number} amount - How many units of it. Anything that is not a positive number is ignored.
     * @returns {number} How much of that item the cart now holds.
     */
    public add(item: Item, amount: number): number {
        if (!item || !(amount > 0)) return this.of(item);
        return this.set(item, this.of(item) + amount);
    }

    /**
     * @function set
     * @description Say outright how much of an item the cart has been asked for. Zero or less takes it out.
     * @param {Item} item - The item.
     * @param {number} amount - How many units of it.
     * @returns {number} How much of that item the cart now holds.
     */
    public set(item: Item, amount: number): number {
        const key = CartAmountsHandler.keyOf(item);
        //Kept, so the cart can show a card for it without the card it was added from.
        if (key && amount > 0 && item.data) this.model.products[key] = {...item.data};
        return this.setKey(key, amount);
    }

    /**
     * @function setKey
     * @description {@link CartAmountsHandler.set}, for a product known only by its key.
     * @param {string} key - The product's key — see {@link CartAmountsHandler.keyOf}.
     * @param {number} amount - How many units of it.
     * @returns {number} How much of that product the cart now holds.
     */
    public setKey(key: string, amount: number): number {
        if (!key) return 0;
        //Replaced rather than changed in place, so whatever reads the amounts hears about it.
        const amounts = {...this.model.amounts};
        if (amount > 0) amounts[key] = amount;
        else delete amounts[key];
        this.model.amounts = amounts;
        return amounts[key] ?? 0;
    }

    /**
     * @function of
     * @description How much of an item the cart has been asked for.
     * @param {Item} item - The item to ask about.
     * @returns {number} The amount, or `0` if none has been added.
     */
    public of(item: Item): number {
        return this.ofKey(CartAmountsHandler.keyOf(item));
    }

    /**
     * @function ofKey
     * @description {@link CartAmountsHandler.of}, for a product known only by its key.
     * @param {string} key - The product's key.
     * @returns {number} The amount, or `0` if none has been added.
     */
    public ofKey(key: string): number {
        return this.model.amounts[key] ?? 0;
    }

    /**
     * @function productOf
     * @description What was added under a key, as it was when it was added.
     * @param {string} key - The product's key.
     * @returns {ItemData} The product, or `undefined` if nothing was added under it.
     */
    public productOf(key: string): ItemData {
        return this.model.products[key];
    }

    /**
     * @function clear
     * @description Forget everything the cart was asked for. What is lying on its area is untouched.
     */
    public clear(): void {
        this.model.amounts = {};
    }
}
