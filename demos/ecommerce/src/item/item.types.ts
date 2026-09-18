import {GradumElementProperties} from "../../../../build/gradum-kit.esm";
import {Item} from "./item";

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
 * @description What an {@link Item} needs from a cart in order to put itself in one: a name to show in the
 * item's picker, and a way to be handed an amount. Anything that can do those two things can act as a cart,
 * so a card works against whatever the carts on a given page turn out to be.
 * @property {string} name - What the cart is called. Shown in the item's cart picker.
 * @property {(item: Item, amount: number) => void} addItem - Take the given amount of the given item.
 */
export type Cart = {
    readonly name: string,
    addItem(item: Item, amount: number): void,
};

/**
 * @description Properties to create an {@link Item}. What the item *is* goes in `data`; what you are doing
 * with it — which cart, how much — is set directly, since none of it belongs to the item itself.
 * @property {ItemData} [data] - The item's own description. Defaults to an empty item.
 * @property {Cart[]} [carts] - The carts this item can be added to.
 * @property {Cart} [cart] - The cart to start out picked. Defaults to the first of `carts`.
 * @property {number} [cartAmount=1] - How many units the add button puts in the cart.
 * @property {number} [recipeAmount=1] - How many units a recipe uses.
 */
export type ItemProperties = GradumElementProperties & {
    data?: ItemData,
    carts?: Cart[],
    cart?: Cart,
    cartAmount?: number,
    recipeAmount?: number,
};
