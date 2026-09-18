import {auto, GradumModel, modelSignal, signal} from "../../../../build/gradum-kit.esm";
import {Cart, ItemData} from "./item.types";
import {atLeastZero} from "../utils";

/**
 * @class ItemModel
 *
 * @extends GradumModel
 * @description State of one grocery item, split by what it belongs to. What the item *is* — its name,
 * picture, price and unit — is held in the model's data, since that is the item's own description and the
 * part a catalogue would supply. What you are currently doing with it — which cart, how much of it to buy,
 * how much of it a recipe uses — is held on the model itself, since none of it belongs to the item.
 */
export class ItemModel extends GradumModel<ItemData> {
    @modelSignal() @auto({defaultValue: "Unnamed item"}) public name: string;
    @modelSignal() @auto({defaultValue: ""}) public image: string;
    @modelSignal() @auto({defaultValue: "each"}) public unit: string;
    @modelSignal() @auto({preprocessValue: atLeastZero, defaultValue: 0}) public price: number;

    @signal @auto({preprocessValue: atLeastZero}) accessor cartAmount: number = 1;
    @signal @auto({preprocessValue: atLeastZero}) accessor recipeAmount: number = 1;
    @signal public cart: Cart = undefined;

    /**
     * @description The carts this item can be added to. Assigning picks the first of them, unless the cart
     * already picked is among them — so an item handed its carts after it was created ends up with one, and
     * one whose carts change keeps the cart it was on if that cart is still there.
     */
    @signal @auto({
        callAfter: function (this: ItemModel, value: Cart[]) {
            if (!value?.includes(this.cart)) this.cart = value?.[0];
        }
    }) accessor carts: Cart[] = [];

    public get cartCost(): number {
        return this.price * this.cartAmount;
    }
}
