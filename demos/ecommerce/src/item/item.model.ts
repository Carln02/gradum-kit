import {auto, GradumModel, dataSignal, Point, signal} from "../../../../build/gradum-kit.esm";
import {ItemData} from "./item.types";
import {atLeastZero} from "../utils";
import {Cart} from "../cart/cart";
import {ProductDescription, PropertyValue} from "../catalogue/catalogue.types";

/**
 * @class ItemModel
 *
 * @extends GradumModel
 * @description State of one item, split by what it belongs to. What the item *is* — the product it stands
 * for — is held in the model's data, since that is the item's own description and the part a catalogue
 * supplies. What you are currently doing with it — which cart it goes in — is held on the model itself,
 * since none of it belongs to the item. Where the card is, and how it is shown, belong to the card.
 */
export class ItemModel extends GradumModel<ItemData> {
    @dataSignal() @auto({defaultValue: "Unnamed item"}) public name: string;
    @dataSignal() @auto({preprocessValue: atLeastZero, defaultValue: 0}) public price: number;
    @dataSignal() public images: string[];
    @dataSignal() public categories: string[];
    @dataSignal() public description: ProductDescription;
    @dataSignal() public properties: Record<string, PropertyValue>;

    @signal public cart: Cart = undefined;

    /**
     * @readonly
     * @description Source of the item's main picture, or an empty string when it has none.
     */
    public get image(): string {
        return this.images?.[0] ?? "";
    }
}
