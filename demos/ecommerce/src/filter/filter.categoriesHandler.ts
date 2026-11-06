import {GradumHandler} from "../../../../build/gradum-kit.esm";
import {Product} from "../catalogue/catalogue.types";
import {CatalogueCategoriesHandler} from "../catalogue/catalogue.categoriesHandler";
import {FilterModel} from "./filter.model";

/**
 * @class FilterCategoriesHandler
 *
 * @extends GradumHandler
 * @description Works out whether a product is filed under one of the filter's categories, and picks
 * categories in and out.
 */
export class FilterCategoriesHandler extends GradumHandler<FilterModel> {
    public keyName: string = "categories";

    /**
     * @function matches
     * @description Whether a product is filed under any of the filter's categories, at any depth.
     * @param {Partial<Product>} product - The product.
     * @returns {boolean} Whether it is. Always, while no category is picked.
     */
    public matches(product: Partial<Product>): boolean {
        const picked = this.model.categories;
        if (!picked?.length) return true;
        const paths = CatalogueCategoriesHandler.pathsOf(product);
        return picked.some(path => paths.includes(path));
    }

    /**
     * @function has
     * @param {string} path - A category path.
     * @returns {boolean} Whether the filter lets that category through.
     */
    public has(path: string): boolean {
        return this.model.categories.includes(path);
    }

    /**
     * @function toggle
     * @description Pick a category in, or out again if it already was.
     * @param {string} path - The category's path.
     */
    public toggle(path: string) {
        const picked = this.model.categories;
        this.model.categories = picked.includes(path)
            ? picked.filter(entry => entry !== path)
            : [...picked, path];
    }

    /**
     * @function clear
     * @description Let every category through again.
     */
    public clear() {
        if (this.model.categories.length) this.model.categories = [];
    }
}
