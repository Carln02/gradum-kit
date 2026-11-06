import {GradumHandler} from "../../../../build/gradum-kit.esm";
import {Product} from "../catalogue/catalogue.types";
import {SortKey} from "./filter.types";
import {FilterModel} from "./filter.model";
import {FilterFacetsHandler} from "./filter.facetsHandler";

/**
 * @class FilterSortHandler
 *
 * @extends GradumHandler
 * @description Orders products the way the filter's sort asks.
 */
export class FilterSortHandler extends GradumHandler<FilterModel> {
    public keyName: string = "sort";

    /**
     * @function comparator
     * @description What to sort products with. Reads the sort, so an effect asking this follows it.
     *
     * Products that compare the same are left as equal rather than broken by name, so a collection with
     * several filters can chain their comparators and break the last tie itself. Products with no value for
     * a property go last whichever way it runs.
     * @returns {(a: Partial<Product>, b: Partial<Product>) => number} The comparator, or `undefined` while
     * there is nothing to sort by.
     */
    public comparator(): (a: Partial<Product>, b: Partial<Product>) => number {
        const {key, direction} = this.model.sort ?? {key: SortKey.none, direction: "ascending"};
        const sign = direction === "descending" ? -1 : 1;

        switch (key) {
            case SortKey.none:
                return undefined;
            case SortKey.relevance: {
                //Read here, so the comparator follows the keywords; best first whichever way it runs.
                if (!this.model.searchHandler.search) return undefined;
                const search = this.model.searchHandler;
                return (a, b) => search.score(b) - search.score(a);
            }
            case SortKey.name:
                return (a, b) => sign * (a?.name ?? "").localeCompare(b?.name ?? "");
            default:
                return (a, b) => {
                    const first = FilterFacetsHandler.valueOf(a, key), second = FilterFacetsHandler.valueOf(b, key);
                    if (!first || !second) return (first ? 0 : 1) - (second ? 0 : 1);
                    return sign * ((first.min ?? first.max) - (second.min ?? second.max));
                };
        }
    }

    /**
     * @function keys
     * @description What products can be sorted by: the keys that are not properties, then every property the
     * products have a number for.
     * @param {Partial<Product>[]} products - The products.
     * @returns {string[]} The keys.
     */
    public keys(products: Partial<Product>[]): string[] {
        const properties = this.model.facetsHandler.keys(products).filter(key => key !== SortKey.price);
        return [SortKey.none, SortKey.relevance, SortKey.name, SortKey.price, ...properties];
    }

    /**
     * @function sortBy
     * @description Sort by a key, keeping the direction.
     * @param {string} key - The key.
     */
    public sortBy(key: string) {
        this.model.sort = {...this.model.sort, key};
    }

    /**
     * @function reverse
     * @description Run the sort the other way.
     */
    public reverse() {
        const direction = this.model.sort.direction === "ascending" ? "descending" : "ascending";
        this.model.sort = {...this.model.sort, direction};
    }
}
