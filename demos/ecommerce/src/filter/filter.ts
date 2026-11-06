import {Anchor, Color, define, expose, gradum, Point, signal} from "../../../../build/gradum-kit.esm";
import {Square} from "../square/square";
import type {Canvas} from "../canvas/canvas";
import type {Collection} from "../collection/collection";
import {Product} from "../catalogue/catalogue.types";
import {FilterModel} from "./filter.model";
import {FilterView} from "./filter.view";
import {FacetRange, FilterProperties, FilterSort, SortKey} from "./filter.types";
import {FilterTokenSearchHandler} from "./filter.searchHandler";
import {FilterCategoriesHandler} from "./filter.categoriesHandler";
import {FilterFacetsHandler} from "./filter.facetsHandler";
import {FilterSortHandler} from "./filter.sortHandler";
import {FilterQueryHandler} from "./filter.queryHandler";
import "./filter.css";

/**
 * @class Filter
 *
 * @extends Square
 * @description A panel on the canvas that narrows down and orders what collections show: keywords,
 * categories, ranges on numeric properties — the price, the weight, the recommended age — and a sort.
 *
 * A filter does nothing on its own. It applies to the collections it is linked to, each of which asks it, as
 * it lays out its cards, which products get through and in what order — see {@link Collection.query}. A
 * collection can be linked to several filters, which then all have to let a product through.
 *
 * ```ts
 * const filter = Filter.create({parent: canvas, keywords: "puzzle", sort: {key: "price", direction: "ascending"}});
 * canvas.toggleLink(filter, catalogue);
 * ```
 */
export class Filter extends Square<FilterView, any, FilterModel> {
    public declare properties: FilterProperties;
    public static defaultProperties: FilterProperties = {
        view: FilterView,
        model: FilterModel,
        handlers: [
            FilterTokenSearchHandler,
            FilterCategoriesHandler,
            FilterFacetsHandler,
            FilterSortHandler,
            FilterQueryHandler
        ],
    };

    @signal color: Color = Color.from("#FFFFFF");

    //Placed by its corner, like a collection, so drawing one is a matter of where the drag started.
    @signal anchor: Anchor | Point = Anchor.TopLeft;

    @expose("model") keywords: string;
    @expose("model") categories: string[];
    @expose("model") facets: Record<string, FacetRange>;
    @expose("model") sort: FilterSort;
    @expose("model") enabled: boolean;

    /**
     * @readonly
     * @description The collections the filter applies to. Linked and unlinked through the canvas — see
     * {@link Canvas.toggleLink}.
     */
    @expose("model", false) targets: Collection[];

    /**
     * @readonly
     * @description The canvas the filter is on.
     */
    public get canvas(): Canvas {
        return gradum(this).closest("my-canvas") as Canvas;
    }

    /**
     * @readonly
     * @description The products the filter is choosing among: everything its collections hold — the whole
     * catalogue, for a catalogue — or the whole catalogue while it applies to nothing. What its categories and
     * ranges are offered from.
     */
    public get scope(): Partial<Product>[] {
        const all = this.canvas?.catalogue?.products ?? [];
        const targets = this.targets ?? [];
        if (targets.length === 0) return all;

        const products = new Map<string, Partial<Product>>();
        for (const target of targets) {
            const held = target.catalogue ? all : target.items.map(item => item.data as Partial<Product>);
            held.forEach(product => products.set(product?.id ?? product?.name, product));
        }
        return [...products.values()];
    }

    /**
     * @function test
     * @description Whether a product gets through the filter.
     * @param {Partial<Product>} product - The product.
     * @returns {boolean} Whether it does. Always, while the filter is paused.
     */
    public test(product: Partial<Product>): boolean {
        return this.model.queryHandler.test(product);
    }

    /**
     * @function comparator
     * @description What the filter orders products with.
     * @returns {(a: Partial<Product>, b: Partial<Product>) => number} The comparator, or `undefined` when the
     * filter orders nothing.
     */
    public comparator(): (a: Partial<Product>, b: Partial<Product>) => number {
        return this.model.queryHandler.comparator();
    }

    /**
     * @function reset
     * @description Clear every setting, so the filter lets everything through in the order it came.
     */
    public reset() {
        this.keywords = "";
        this.categories = [];
        this.facets = {};
        this.sort = {key: SortKey.none, direction: "ascending"};
    }

    /**
     * @function delete
     * @description Get rid of the filter. Whatever it applied to goes back to showing everything.
     */
    public delete() {
        this.canvas?.removeFilter(this);
        gradum(this).destroy();
    }
}

define(Filter, "demo-filter");
