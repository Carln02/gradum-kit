import {auto, GradumModel, modelSignal, Point, signal} from "../../../../build/gradum-kit.esm";
import {ItemData} from "./item.types";
import {atLeastZero} from "../utils";
import {Cart} from "../cart/cart";

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

    @signal public position: Point = undefined;

    public get cartCost(): number {
        return this.price * this.cartAmount;
    }
}
