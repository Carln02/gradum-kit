import {effect, GradumOperator} from "../../../../build/gradum-kit.esm";
import {Shelf} from "./shelf";
import {AllCategories, ShelfModel} from "./shelf.model";
import {ShelfEntry} from "./shelf.types";
import {ShelfView} from "./shelf.view";

/**
 * @class ShelfFilterOperator
 *
 * @extends GradumOperator
 * @description Works out which of the shelf's items the search and the current tab call for.
 *
 * The tab is the same test however the search is read, so it is done here; what the typed text means is
 * what the subclass decides. Every pass fires `filtered` on the shelf's emitter with the items that match,
 * and {@link ShelfFilterOperator.matches} answers the same question on demand, for the view to ask after it
 * has rebuilt its cards and cannot wait for the next pass.
 *
 * Swap the subclass to change what searching means — see {@link ShelfSubstringFilterOperator},
 * {@link ShelfTokenFilterOperator} and {@link ShelfFuzzyFilterOperator}. All three answer to the key
 * `"filter"`, so one can be taken out and another put in:
 *
 * ```ts
 * gradum(shelf).removeOperator("filter").addOperator(new ShelfFuzzyFilterOperator());
 * ```
 */
export abstract class ShelfFilterOperator extends GradumOperator<Shelf, ShelfView, ShelfModel> {
    public keyName: string = "filter";

    @effect protected filter() {
        //What is on offer and what is being asked of it. Read outright: these are the signals this pass
        //follows, and `matches` below reads them again rather than being handed them.
        this.model.items;
        this.model.search;
        this.model.category;

        this.emitter.fire("filtered", this.matches());
    }

    /**
     * @function matches
     * @description The items the shelf should be showing: the ones on the tab it is on that the search
     * would find. Ask it when you need the answer now; listen for `filtered` to be told when it changes.
     * @returns {Set<ShelfEntry>} The items to show.
     */
    public matches(): Set<ShelfEntry> {
        const category = this.model.category;
        const search = this.model.search?.trim().toLowerCase() ?? "";

        return new Set((this.model.items ?? []).filter(entry => {
            if (category !== AllCategories && entry?.category !== category) return false;
            //An empty search asks for nothing in particular, so everything on the tab answers it. Left to
            //the subclasses, each would have to say so itself.
            return !search || this.matchesSearch(entry, search);
        }));
    }

    /**
     * @description Whether an item answers the text typed into the search. The searched text arrives
     * trimmed and lower-cased, and is never empty.
     * @param {ShelfEntry} entry - The item to test.
     * @param {string} search - What was typed.
     * @returns {boolean} Whether the item answers it.
     * @protected
     */
    protected abstract matchesSearch(entry: ShelfEntry, search: string): boolean;
}

/**
 * @class ShelfSubstringFilterOperator
 *
 * @extends ShelfFilterOperator
 * @description Finds items whose name contains what was typed, as typed.
 *
 * The plain reading, and the strictest of the three: `"sour d"` finds nothing, because no name contains it.
 */
export class ShelfSubstringFilterOperator extends ShelfFilterOperator {
    protected matchesSearch(entry: ShelfEntry, search: string): boolean {
        return (entry?.name ?? "").toLowerCase().includes(search);
    }
}

/**
 * @class ShelfTokenFilterOperator
 *
 * @extends ShelfFilterOperator
 * @description Finds items answering every word typed, in any order, in their name, category or unit.
 *
 * What a search box is usually taken to mean: `"bread sour"` finds the sourdough, and `"kg veg"` finds the
 * vegetables sold by weight — neither of which is a substring of anything.
 */
export class ShelfTokenFilterOperator extends ShelfFilterOperator {
    protected matchesSearch(entry: ShelfEntry, search: string): boolean {
        const haystack = [entry?.name, entry?.category, entry?.unit].join(" ").toLowerCase();
        return search.split(/\s+/).every(token => haystack.includes(token));
    }
}

/**
 * @class ShelfFuzzyFilterOperator
 *
 * @extends ShelfFilterOperator
 * @description Finds items whose name contains the typed letters in order, with anything in between.
 *
 * The most forgiving of the three: `"srdgh"` finds the sourdough. Good for a long shelf and a rough guess
 * at the spelling, at the cost of turning up things that only look like an answer.
 */
export class ShelfFuzzyFilterOperator extends ShelfFilterOperator {
    protected matchesSearch(entry: ShelfEntry, search: string): boolean {
        const name = (entry?.name ?? "").toLowerCase();

        let at = 0;
        for (const letter of search) {
            at = name.indexOf(letter, at) + 1;
            if (at === 0) return false;
        }
        return true;
    }
}
