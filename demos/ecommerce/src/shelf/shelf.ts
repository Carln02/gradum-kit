import {define, expose, GradumElement, gradum, operator} from "../../../../build/gradum-kit.esm";
import {DropTarget} from "../utils";
import {ShelfModel} from "./shelf.model";
import {ShelfFilterOperator, ShelfSubstringFilterOperator} from "./shelf.filterOperator";
import {ShelfSourceHandler} from "./shelf.sourceHandler";
import {ShelfEntry} from "./shelf.types";
import {ShelfView} from "./shelf.view";
import "./shelf.css";

/**
 * @class Shelf
 *
 * @extends GradumElement
 * @description The side panel you shop from: every grocery item that can be put in a cart, with a search
 * field and a tab per category above them. What it lists is read from a JSON file, so the range on offer is
 * data rather than code.
 *
 * It sits on the canvas rather than beside it, so that a card anywhere on the page — on the shelf, on the
 * canvas, in a cart — finds the canvas above it and can ask which carts there are.
 */
export class Shelf extends GradumElement<ShelfView, any, ShelfModel> implements DropTarget {
    public static defaultProperties = {
        view: ShelfView,
        model: ShelfModel,
        handlers: ShelfSourceHandler,
        operators: [ShelfSubstringFilterOperator],
    };

    /**
     * @readonly
     * @description Which items the search and the current tab call for. Swap it to change what searching
     * means; see {@link ShelfFilterOperator}.
     */
    @operator() public filterOperator: ShelfFilterOperator;

    @expose("model") items: ShelfEntry[];
    @expose("model") search: string;
    @expose("model") category: string;
    @expose("model") showRecipe: boolean;

    /**
     * @readonly
     * @description The tabs on offer: `"All"`, then one per category found among the items.
     */
    @expose("model", false) categories: string[];

    /**
     * @description Where the shelf reads its items from. Assigning it loads them, replacing whatever the
     * shelf was listing.
     */
    @expose("model") source: string;

    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "dropTarget");
    }

    /**
     * @function acceptDrop
     * @description Take nothing. The shelf is what you shop from, not somewhere to put things — but it does
     * cover part of the canvas, and without this a card let go of over the panel would be laid down on the
     * canvas behind it, out of sight. A card dropped here stays where it came from.
     */
    public acceptDrop() {}

    /**
     * @function load
     * @description Read the shelf's items from a file, now, rather than waiting for its source to change.
     * Use it to pick up a file that has been edited since it was last read.
     * @param {string} [source=this.source] - URL to read from.
     * @returns {Promise<ShelfEntry[]>} What ended up listed.
     */
    public async load(source: string = this.source): Promise<ShelfEntry[]> {
        return this.model.sourceHandler.read(source);
    }
}

define(Shelf, "demo-shelf");
