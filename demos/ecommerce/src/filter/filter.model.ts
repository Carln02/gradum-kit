import {GradumModel, handler, signal} from "../../../../build/gradum-kit.esm";
import type {Collection} from "../collection/collection";
import {FacetRange, FilterSort, SortKey} from "./filter.types";
import {FilterSearchHandler} from "./filter.searchHandler";
import {FilterCategoriesHandler} from "./filter.categoriesHandler";
import {FilterFacetsHandler} from "./filter.facetsHandler";
import {FilterSortHandler} from "./filter.sortHandler";
import {FilterQueryHandler} from "./filter.queryHandler";

/**
 * @class FilterModel
 *
 * @extends GradumModel
 * @description What a filter asks of products — keywords, categories, ranges on numeric properties, and an
 * order — and the collections it asks it on behalf of.
 *
 * The asking itself is done by its handlers, one per part. Each reads the settings it needs as it goes, so a
 * collection that asks a filter about a product from inside an effect follows exactly those settings.
 */
export class FilterModel extends GradumModel {
    /**
     * @description What to search for. Empty for anything.
     */
    @signal public keywords: string = "";

    /**
     * @description The category paths let through, as {@link CatalogueCategoriesHandler.pathsOf} writes them.
     * A product filed under any one of them, at any depth, is let through. Empty for every category.
     */
    @signal public categories: string[] = [];

    /**
     * @description The ranges numeric properties have to fall in, by key. `"price"` is the product's price
     * rather than one of its properties.
     */
    @signal public facets: Record<string, FacetRange> = {};

    /**
     * @description What to order products by.
     */
    @signal public sort: FilterSort = {key: SortKey.none, direction: "ascending"};

    /**
     * @description Whether the filter applies at all. A paused filter lets everything through in the order it
     * came.
     */
    @signal public enabled: boolean = true;

    /**
     * @description The collections the filter applies to. Only written by the canvas's links handler, which
     * keeps it in step with each collection's own list of filters.
     */
    @signal public targets: Collection[] = [];

    @handler() public searchHandler: FilterSearchHandler;
    @handler() public categoriesHandler: FilterCategoriesHandler;
    @handler() public facetsHandler: FilterFacetsHandler;
    @handler() public sortHandler: FilterSortHandler;
    @handler() public queryHandler: FilterQueryHandler;
}
