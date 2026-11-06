import {GradumHandler} from "../../../../build/gradum-kit.esm";
import {Product} from "../catalogue/catalogue.types";
import {FacetRange} from "./filter.types";
import {FilterModel} from "./filter.model";

/**
 * @class FilterFacetsHandler
 *
 * @extends GradumHandler
 * @description Works out whether a product's numbers fall in the filter's ranges, and finds what ranges there
 * are to set.
 *
 * A facet is a range on one numeric property — or on the price, under the key `"price"`. A product with no
 * value for a property a range is set on is left out, since nothing says it is in range. A property that is
 * itself a range — a recommended age of 3 to 10 — is in when the two ranges overlap.
 */
export class FilterFacetsHandler extends GradumHandler<FilterModel> {
    public keyName: string = "facets";

    /**
     * @function valueOf
     * @static
     * @description A product's value for a facet, as a range: a single number is a range of one.
     * @param {Partial<Product>} product - The product.
     * @param {string} key - The facet's key.
     * @returns {FacetRange} The value, or `undefined` when the product has no number for it.
     */
    public static valueOf(product: Partial<Product>, key: string): FacetRange {
        const value = key === "price" ? product?.price : product?.properties?.[key];
        if (typeof value === "number") return {min: value, max: value};
        if (value && typeof value === "object") {
            const min = typeof value.min === "number" ? value.min : undefined;
            const max = typeof value.max === "number" ? value.max : undefined;
            if (min !== undefined || max !== undefined) return {min, max};
        }
        return undefined;
    }

    /**
     * @function matches
     * @description Whether a product falls in every range the filter sets.
     * @param {Partial<Product>} product - The product.
     * @returns {boolean} Whether it does.
     */
    public matches(product: Partial<Product>): boolean {
        for (const [key, range] of Object.entries(this.model.facets ?? {})) {
            if (range?.min === undefined && range?.max === undefined) continue;
            const value = FilterFacetsHandler.valueOf(product, key);
            if (!value) return false;
            //Overlap: the value does not end before the range starts, nor start after it ends.
            if (range.min !== undefined && (value.max ?? Infinity) < range.min) return false;
            if (range.max !== undefined && (value.min ?? -Infinity) > range.max) return false;
        }
        return true;
    }

    /**
     * @function keys
     * @description The facets there are to set on some products: the price, then every property any of them
     * has a number for.
     * @param {Partial<Product>[]} products - The products.
     * @returns {string[]} Their keys.
     */
    public keys(products: Partial<Product>[]): string[] {
        const keys = new Set<string>(["price"]);
        for (const product of products) {
            for (const key of Object.keys(product?.properties ?? {})) {
                if (FilterFacetsHandler.valueOf(product, key)) keys.add(key);
            }
        }
        return [...keys];
    }

    /**
     * @function bounds
     * @description The lowest and highest values some products have for a facet, to suggest where a range
     * could go.
     * @param {Partial<Product>[]} products - The products.
     * @param {string} key - The facet's key.
     * @returns {FacetRange} The bounds, or an empty range when none of them has a value.
     */
    public bounds(products: Partial<Product>[], key: string): FacetRange {
        let min = Infinity, max = -Infinity;
        for (const product of products) {
            const value = FilterFacetsHandler.valueOf(product, key);
            if (!value) continue;
            min = Math.min(min, value.min ?? value.max);
            max = Math.max(max, value.max ?? value.min);
        }
        return min <= max ? {min, max} : {};
    }

    /**
     * @function set
     * @description Set a facet's range, or one end of it.
     * @param {string} key - The facet's key.
     * @param {FacetRange} range - The ends to set. An end given as `undefined` is opened.
     */
    public set(key: string, range: FacetRange) {
        this.model.facets = {...this.model.facets, [key]: {...this.model.facets[key], ...range}};
    }

    /**
     * @function remove
     * @description Stop filtering on a facet.
     * @param {string} key - The facet's key.
     */
    public remove(key: string) {
        if (!(key in this.model.facets)) return;
        const {[key]: _, ...rest} = this.model.facets;
        this.model.facets = rest;
    }
}
