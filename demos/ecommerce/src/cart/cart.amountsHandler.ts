import {GradumHandler} from "../../../../build/gradum-kit.esm";
import {Item} from "../item/item";
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
 */
export class CartAmountsHandler extends GradumHandler<CartModel> {
    public keyName: string = "amounts";

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
        const total = this.of(item) + amount;
        this.model.amounts.set(item, total);
        return total;
    }

    /**
     * @function of
     * @description How much of an item the cart has been asked for.
     * @param {Item} item - The item to ask about.
     * @returns {number} The amount, or `0` if none has been added.
     */
    public of(item: Item): number {
        return this.model.amounts.get(item) ?? 0;
    }

    /**
     * @function clear
     * @description Forget everything the cart was asked for. What is lying on its area is untouched.
     */
    public clear(): void {
        this.model.amounts.clear();
    }
}
