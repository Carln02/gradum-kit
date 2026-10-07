import {GradumElementProperties} from "../../../../build/gradum-kit.esm";
import {Item} from "./item";
import {ItemView} from "./item.view";
import {Cart} from "../cart/cart";

/**
 * @description What an item is, as opposed to what you are currently doing with it. These four travel
 * together — they are the item's own description, the part that would be loaded from a catalogue or synced
 * — so they live in the model's data rather than on the instance.
 * @property {string} [name] - What the item is called.
 * @property {string} [image] - Source of the item's picture. No picture is shown without one.
 * @property {number} [price] - What one unit costs.
 * @property {string} [unit] - What the price is per — `"kg"`, `"each"`, `"bunch"`.
 */
export type ItemData = {
    name?: string,
    image?: string,
    price?: number,
    unit?: string,
};

/**
 * @description Properties to create an {@link Item}. What the item *is* goes in `data`; what you are doing
 * with it — which cart, how much — is set directly, since none of it belongs to the item itself.
 * @property {ItemData} [data] - The item's own description. Defaults to an empty item.
 * @property {Cart} [cart] - The cart to start out picked. Defaults to the first of `carts`.
 * @property {number} [cartAmount=1] - How many units the add button puts in the cart.
 * @property {number} [recipeAmount=1] - How many units a recipe uses.
 * @property {boolean} [showAddButton=true] - Whether the card offers a way of putting the item in a cart.
 * @property {boolean} [showRecipe=true] - Whether the card shows how much of the item a recipe uses.
 */
export type ItemProperties = GradumElementProperties<ItemView, ItemData> & {
    cart?: Cart,
    cartAmount?: number,
    recipeAmount?: number,
    showAddButton?: boolean,
    showRecipe?: boolean,
};
