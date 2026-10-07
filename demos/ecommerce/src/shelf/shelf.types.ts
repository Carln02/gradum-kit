import {GradumElementProperties} from "../../../../build/gradum-kit.esm";
import {ItemData} from "../item/item.types";
import {ShelfView} from "./shelf.view";

/**
 * @description One grocery item as the shelf's source file lists it: everything an {@link Item} is made of,
 * plus the category it is filed under.
 *
 * A picture can be given either way round. `image` is used as-is when the entry has one; otherwise `emoji`
 * and `tint` are drawn into one, which is what keeps this demo free of image files.
 * @property {string} [category] - What the item is filed under, and the tab it appears on.
 * @property {string} [emoji] - Drawn as the item's picture when it has no `image` of its own.
 * @property {string} [tint] - The colour behind that emoji. Defaults to a pale grey.
 */
export type ShelfEntry = ItemData & {
    category?: string,
    emoji?: string,
    tint?: string,
};

/**
 * @description Properties to create a {@link Shelf}.
 * @property {string} [source] - URL of the JSON listing the items. Assigning it loads them.
 * @property {ShelfEntry[]} [items] - The items to list, for a shelf given them rather than loading them.
 * @property {string} [search] - Text the listed items must contain in their name.
 * @property {string} [category] - The category tab to start on. Defaults to all of them.
 * @property {boolean} [showRecipe=false] - Whether the items show their recipe amounts. Off by default: a
 * shelf is for shopping, and the panel is narrow.
 */
export type ShelfProperties = GradumElementProperties<ShelfView> & {
    source?: string,
    items?: ShelfEntry[],
    search?: string,
    category?: string,
    showRecipe?: boolean,
};
