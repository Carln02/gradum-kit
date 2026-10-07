import {GradumModel, handler, signal} from "../../../../build/gradum-kit.esm";
import {ShelfSourceHandler} from "./shelf.sourceHandler";
import {ShelfEntry} from "./shelf.types";

/**
 * @description The tab standing for no category at all, always first and always there.
 */
export const AllCategories = "All";

/**
 * @class ShelfModel
 *
 * @extends GradumModel
 * @description What the shelf is showing and what it is filtering by: the items it knows about, the text
 * typed into its search, and the category tab it is on.
 */
export class ShelfModel extends GradumModel {
    /**
     * @description Every item the shelf knows about, filtered or not — what was read from its source.
     */
    @signal public items: ShelfEntry[] = [];

    /**
     * @description Where the items are read from. Naming a source is all it takes; the shelf's source
     * handler watches this and goes and reads it.
     */
    @signal public source: string = "";

    /**
     * @description Text the listed items must contain in their name. Empty shows them all.
     */
    @signal public search: string = "";

    /**
     * @description The category tab the shelf is on. {@link AllCategories} shows every category.
     */
    @signal public category: string = AllCategories;

    /**
     * @description Whether the listed items show their recipe amounts.
     */
    @signal public showRecipe: boolean = false;

    /**
     * @description The tabs to offer: `"All"`, then each category in the order it first appears among the
     * items. Taken from the items themselves, so a source file that grows a new category grows a tab.
     */
    public get categories(): string[] {
        const categories = [AllCategories];
        for (const entry of this.items ?? []) {
            if (entry?.category && !categories.includes(entry.category)) categories.push(entry.category);
        }
        return categories;
    }

    /**
     * @description Reading the shelf's items from the file it was pointed at.
     */
    @handler() public sourceHandler: ShelfSourceHandler;

}
