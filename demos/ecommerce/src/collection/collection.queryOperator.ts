import {effect, GradumOperator, gradum} from "../../../../build/gradum-kit.esm";
import type {Collection} from "./collection";
import {CollectionModel} from "./collection.model";
import {CollectionView} from "./collection.view";
import {Product} from "../catalogue/catalogue.types";

/**
 * @class CollectionQueryOperator
 *
 * @extends GradumOperator
 * @description Applies the collection's filters to the cards it holds: those the filters leave out are
 * hidden, and those left are ordered the way the filters ask.
 *
 * Only shows and orders — nothing is moved or taken out — so the collection's own order comes back as soon as
 * the filters stop asking for another. A catalogue is filtered before its cards are built instead, by its
 * catalogue operator, so this leaves catalogues alone.
 */
export class CollectionQueryOperator extends GradumOperator<Collection, CollectionView, CollectionModel> {
    public keyName: string = "query";

    @effect protected apply() {
        const items = this.model.items ?? [];
        if (this.model.catalogue) return this.clear(items);

        //By the item's data rather than the item, since that is what the filters read.
        const byData = new Map(items.map(item => [item.data as Partial<Product>, item]));
        const shown = this.element.query([...byData.keys()]);
        const sorted = this.model.filters.some(filter => filter.comparator());
        const rank = new Map(shown.map((data, index) => [byData.get(data), index]));
        this.model.total = shown.length;

        for (const item of items) {
            gradum(item).toggleClass("filtered-out", !rank.has(item));
            gradum(item).setStyle("order", sorted && rank.has(item) ? String(rank.get(item)) : "");
        }
    }

    /**
     * @description Show every card in its own order again.
     * @param {Item[]} items - The cards.
     * @protected
     */
    protected clear(items: Collection["items"] = this.model.items ?? []) {
        if (!this.model.catalogue) this.model.total = items.length;
        for (const item of items) {
            gradum(item).toggleClass("filtered-out", false);
            gradum(item).setStyle("order", "");
        }
    }

    public detach() {
        this.clear();
        super.detach();
    }
}
