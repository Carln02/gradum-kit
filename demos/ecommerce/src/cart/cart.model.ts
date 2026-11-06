import {handler, signal} from "../../../../build/gradum-kit.esm";
import {CartAmountsHandler} from "./cart.amountsHandler";
import type {ItemData} from "../item/item.types";
import {CollectionModel} from "../collection/collection.model";

/**
 * @class CartModel
 *
 * @extends CollectionModel
 * @description A collection that is also somewhere to buy from: on top of what is lying in it, how much of
 * each item it has been asked for.
 */
export class CartModel extends CollectionModel {
    /**
     * @description How much of each item has been added to this cart through an item's add button, as
     * opposed to merely lying in it, keyed by product. Read and written through
     * {@link CartModel.amountsHandler}.
     */
    @signal public amounts: Record<string, number> = {};

    /**
     * @description What was added under each key of {@link CartModel.amounts}, so the cart can show a card
     * for it.
     */
    public readonly products: Record<string, ItemData> = {};

    /**
     * @description What the cart has been asked for, and the sums over it.
     */
    @handler() public amountsHandler: CartAmountsHandler;
}
