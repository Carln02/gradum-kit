import {GradumElementProperties} from "../../../../build/gradum-kit.esm";
import {Item} from "./item";
import {ItemView} from "./item.view";
import {Cart} from "../cart/cart";
import {Product} from "../catalogue/catalogue.types";

/**
 * @description What an item is, as opposed to what you are currently doing with it: the product it stands
 * for, as the catalogue lists it. It travels together — it is the item's own description, the part that is
 * loaded from a catalogue or synced — so it lives in the model's data rather than on the instance. Every
 * field is optional, so an item made by hand needs only what it has.
 */
export type ItemData = Partial<Product>;

/**
 * @description Properties to create an {@link Item}. What the item *is* goes in `data`; what you are doing
 * with it — which cart — is set directly, since none of it belongs to the item itself.
 * @property {ItemData} [data] - The item's own description. Defaults to an empty item.
 * @property {Cart} [cart] - The cart the cart button starts out adding to.
 * @property {boolean} [showAddButton=true] - Whether the card shows its cart button.
 * @property {boolean} [expanded=false] - Whether the card shows everything about the product.
 * @property {boolean} [fixed=false] - Whether the card is laid out by whatever it is in rather than placing
 * itself.
 */
export type ItemProperties = GradumElementProperties<ItemView, ItemData> & {
    cart?: Cart,
    showAddButton?: boolean,
    expanded?: boolean,
    fixed?: boolean,
};
