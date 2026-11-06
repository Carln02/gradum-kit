import {effect, GradumOperator, gradum, untrack} from "../../../../build/gradum-kit.esm";
import type {Cart} from "./cart";
import {CartModel} from "./cart.model";
import {CartView} from "./cart.view";
import {CartAmountsHandler} from "./cart.amountsHandler";
import {Item} from "../item/item";

/**
 * @class CartContentsOperator
 *
 * @extends GradumOperator
 * @description Keeps what is lying in the cart and what it has been asked for the same thing: a card for
 * every product with an amount, and an amount for every card.
 *
 * Either side can move first. Adding from a card's button puts a card for it in the cart, and taking the last
 * one out takes the card away. A card dropped in counts as one; one dragged out or deleted takes the product
 * out.
 */
export class CartContentsOperator extends GradumOperator<Cart, CartView, CartModel> {
    public keyName: string = "contents";

    /**
     * @description The products the cart held a card for, and the amounts, as they were the last time the
     * two were put in step — so a card that has gone can be told from an amount that has.
     * @protected
     */
    protected previousKeys: Set<string> = new Set();
    protected previousAmounts: Record<string, number> = {};

    @effect protected sync() {
        const amounts = this.model.amounts;
        const items = this.model.items ?? [];
        untrack(() => {
            this.reconcile(amounts, items);
            //Taken after, not before: what this changed itself does not run it again, so the next run has
            //to start from where this one left things.
            this.previousKeys = new Set(this.element.itemElements.map(item => CartAmountsHandler.keyOf(item)));
            this.previousAmounts = this.model.amounts;
        });
    }

    /**
     * @description Put the cards and the amounts in step, going by which of them changed.
     * @param {Record<string, number>} amounts - What the cart has been asked for.
     * @param {Item[]} items - The cards lying in it.
     * @protected
     */
    protected reconcile(amounts: Record<string, number>, items: Item[]) {
        const handler = this.model.amountsHandler;
        const previousKeys = this.previousKeys, previousAmounts = this.previousAmounts;

        //One card per product: a second one dropped in counts as one more of the first.
        const cards = new Map<string, Item>();
        const duplicates: Item[] = [];
        for (const item of items) {
            const key = CartAmountsHandler.keyOf(item);
            if (cards.has(key)) duplicates.push(item);
            else cards.set(key, item);
        }
        if (duplicates.length && !this.element.locked) {
            for (const item of duplicates) {
                handler.add(cards.get(CartAmountsHandler.keyOf(item)), 1);
                gradum(item).destroy();
            }
            return this.element.syncItems();
        }
        if (this.element.locked) return;

        //A card that went while its amount stayed put was taken out by hand.
        for (const key of previousKeys) {
            if (!cards.has(key) && amounts[key] > 0 && previousAmounts[key] === amounts[key]) handler.setKey(key, 0);
        }

        //A card with no amount was dropped in.
        for (const [key, item] of cards) if (!(amounts[key] > 0) && !(previousAmounts[key] > 0)) {
            item.cart = this.element;
            handler.set(item, 1);
        }

        //An amount that came to nothing takes its card away.
        let changed = false;
        for (const [key, item] of cards) if (previousAmounts[key] > 0 && !(amounts[key] > 0)) {
            gradum(item).destroy();
            changed = true;
        }

        //An amount with no card gets one.
        for (const key of Object.keys(amounts)) {
            if (cards.has(key) || previousKeys.has(key) && previousAmounts[key] === amounts[key]) continue;
            const data = handler.productOf(key);
            if (!data) continue;
            this.element.insertItem(Item.create({parent: this.element, data: {...data}, cart: this.element}));
            changed = true;
        }

        if (changed) this.element.syncItems();
    }
}
