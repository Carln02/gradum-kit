import {Color, GradumElementProperties, Point} from "../../../../build/gradum-kit.esm";
import type {FilterView} from "./filter.view";

/**
 * @description A range a numeric property has to fall in. Either end may be left out, for a range open on that
 * side.
 * @property {number} [min] - The lowest value let through.
 * @property {number} [max] - The highest value let through.
 */
export type FacetRange = {
    min?: number,
    max?: number,
};

/**
 * @description Which way a sort runs.
 */
export type SortDirection = "ascending" | "descending";

/**
 * @description What a filter orders products by: one of {@link SortKey}, or the key of any numeric property.
 * @property {string} key - What to order by.
 * @property {SortDirection} direction - Which way.
 */
export type FilterSort = {
    key: string,
    direction: SortDirection,
};

/**
 * @description The sort keys that are not properties.
 */
export const SortKey = {
    /** Leave the order alone. */
    none: "none",
    /** Best match for the keywords first. */
    relevance: "relevance",
    name: "name",
    price: "price",
} as const;

/**
 * @description What a filter can be created with.
 * @property {string} [keywords] - What to search for.
 * @property {string[]} [categories] - The category paths let through. Empty for every category.
 * @property {Record<string, FacetRange>} [facets] - The ranges numeric properties have to fall in, by key.
 * @property {FilterSort} [sort] - What to order by.
 * @property {boolean} [enabled=true] - Whether the filter applies at all.
 */
export type FilterProperties = GradumElementProperties<FilterView> & {
    keywords?: string,
    categories?: string[],
    facets?: Record<string, FacetRange>,
    sort?: FilterSort,
    enabled?: boolean,
    color?: Color,
    position?: Point,
    size?: Point,
};
