import {GradumHandler} from "../../../../build/gradum-kit.esm";
import {Product} from "../catalogue/catalogue.types";
import {FilterModel} from "./filter.model";

/**
 * @class FilterQueryHandler
 *
 * @extends GradumHandler
 * @description The filter as a whole, for whatever applies it: whether a product gets through every part of
 * it, and how to order what does. A paused filter lets everything through and orders nothing.
 */
export class FilterQueryHandler extends GradumHandler<FilterModel> {
    public keyName: string = "query";

    /**
     * @function test
     * @param {Partial<Product>} product - The product.
     * @returns {boolean} Whether it gets through the keywords, the categories and every range.
     */
    public test(product: Partial<Product>): boolean {
        if (!this.model.enabled) return true;
        return this.model.searchHandler.matches(product)
            && this.model.categoriesHandler.matches(product)
            && this.model.facetsHandler.matches(product);
    }

    /**
     * @function comparator
     * @returns {(a: Partial<Product>, b: Partial<Product>) => number} What to order products with, or
     * `undefined` when the filter orders nothing.
     */
    public comparator(): (a: Partial<Product>, b: Partial<Product>) => number {
        if (!this.model.enabled) return undefined;
        return this.model.sortHandler.comparator();
    }
}
