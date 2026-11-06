import {GradumHandler} from "../../../../build/gradum-kit.esm";
import {Product} from "../catalogue/catalogue.types";
import {FilterModel} from "./filter.model";

/**
 * @class FilterSearchHandler
 *
 * @extends GradumHandler
 * @description Works out whether a product answers the filter's keywords, and how well.
 *
 * An empty search asks for nothing in particular, so everything answers it; past that, what the keywords mean
 * is the subclass's to say — see {@link FilterSubstringSearchHandler}, {@link FilterTokenSearchHandler} and
 * {@link FilterFuzzySearchHandler}. All three answer to the key `"search"`, so one can be swapped for another.
 */
export abstract class FilterSearchHandler extends GradumHandler<FilterModel> {
    public keyName: string = "search";

    /**
     * @readonly
     * @description The keywords, trimmed and lower-cased. Reads them, so asking this from an effect follows
     * them.
     */
    public get search(): string {
        return this.model.keywords?.trim().toLowerCase() ?? "";
    }

    /**
     * @function matches
     * @description Whether a product answers the keywords.
     * @param {Partial<Product>} product - The product.
     * @returns {boolean} Whether it does. Always, while there are no keywords.
     */
    public matches(product: Partial<Product>): boolean {
        const search = this.search;
        return !search || this.matchesSearch(product, search);
    }

    /**
     * @function score
     * @description How well a product answers the keywords, for ordering by relevance: higher is better.
     * Words found in the name count most, then in the categories, then in the selling points.
     * @param {Partial<Product>} product - The product.
     * @returns {number} Its score. 0 while there are no keywords.
     */
    public score(product: Partial<Product>): number {
        const search = this.search;
        if (!search) return 0;
        const name = (product?.name ?? "").toLowerCase();
        const categories = (product?.categories ?? []).join(" ").toLowerCase();
        const highlights = (product?.description?.highlights ?? []).join(" ").toLowerCase();

        let score = name.includes(search) ? 10 : 0;
        for (const token of search.split(/\s+/)) {
            if (name.includes(token)) score += 3;
            if (categories.includes(token)) score += 2;
            if (highlights.includes(token)) score += 1;
        }
        return score;
    }

    /**
     * @description Whether a product answers the keywords. They arrive trimmed and lower-cased, and are never
     * empty.
     * @param {Partial<Product>} product - The product.
     * @param {string} search - The keywords.
     * @returns {boolean} Whether it answers them.
     * @protected
     */
    protected abstract matchesSearch(product: Partial<Product>, search: string): boolean;
}

/**
 * @class FilterSubstringSearchHandler
 *
 * @extends FilterSearchHandler
 * @description Finds products whose name contains the keywords, as typed. The strictest reading: `"lego
 * star"` finds nothing unless a name contains exactly that.
 */
export class FilterSubstringSearchHandler extends FilterSearchHandler {
    protected matchesSearch(product: Partial<Product>, search: string): boolean {
        return (product?.name ?? "").toLowerCase().includes(search);
    }
}

/**
 * @class FilterTokenSearchHandler
 *
 * @extends FilterSearchHandler
 * @description Finds products answering every word typed, in any order, anywhere in their name, categories or
 * selling points. What a search box is usually taken to mean, and the default.
 */
export class FilterTokenSearchHandler extends FilterSearchHandler {
    protected matchesSearch(product: Partial<Product>, search: string): boolean {
        const haystack = [
            product?.name,
            ...(product?.categories ?? []),
            ...(product?.description?.highlights ?? []),
        ].join(" ").toLowerCase();
        return search.split(/\s+/).every(token => haystack.includes(token));
    }
}

/**
 * @class FilterFuzzySearchHandler
 *
 * @extends FilterSearchHandler
 * @description Finds products whose name contains the typed letters in order, with anything in between. The
 * most forgiving: `"lgbrd"` finds the longboard.
 */
export class FilterFuzzySearchHandler extends FilterSearchHandler {
    protected matchesSearch(product: Partial<Product>, search: string): boolean {
        const name = (product?.name ?? "").toLowerCase();
        let at = 0;
        for (const letter of search.replace(/\s+/g, "")) {
            at = name.indexOf(letter, at) + 1;
            if (at === 0) return false;
        }
        return true;
    }
}
