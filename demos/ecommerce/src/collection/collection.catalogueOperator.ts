import {effect, GradumOperator, gradum, untrack} from "../../../../build/gradum-kit.esm";
import type {Collection} from "./collection";
import {CollectionModel} from "./collection.model";
import {CollectionView} from "./collection.view";
import {Item} from "../item/item";

/**
 * @class CollectionCatalogueOperator
 *
 * @extends GradumOperator
 * @description Stocks a catalogue collection with the products on offer, a page at a time.
 *
 * What is on offer is the canvas's catalogue, narrowed and ordered by whatever filters the collection is
 * linked to — see {@link Collection.query}. Of that, only the page the collection is on is built as cards:
 * {@link CollectionModel.pageSize} of them, never the whole catalogue, so a long catalogue costs no more to
 * show than a short one. Turning the page, or a filter changing, builds the page again.
 *
 * Each card is marked as a template, so dragging it out leaves it here and puts a copy down instead of
 * emptying the catalogue a card at a time. Does nothing for a collection that is not a catalogue, and takes
 * its cards away again if one stops being one.
 */
export class CollectionCatalogueOperator extends GradumOperator<Collection, CollectionView, CollectionModel> {
    public keyName: string = "catalogue";

    /**
     * @description The cards this operator put in, so they can be taken out again without touching anything
     * else the collection holds.
     */
    protected stocked: Item[] = [];

    /**
     * @description What the last pass had to show, by id, so a pass can tell a new set of products — a
     * filter changed — from the same set on another page.
     */
    protected shown: string = undefined;

    @effect protected stock() {
        const all = this.model.catalogue ? this.element.canvas?.catalogue?.products : undefined;
        if (!all) {
            untrack(() => this.clear());
            this.model.total = 0;
            this.shown = undefined;
            return;
        }

        //Narrowed and ordered before paging, so a page is a page of what was asked for.
        const products = this.element.query(all);
        const size = Math.max(1, this.model.pageSize);
        const pages = Math.max(1, Math.ceil(products.length / size));

        //A new set of products starts again from the first page, as a new search does; the same set on
        //another page is only a page turned. Either way the page has to be one there is.
        const shown = products.map(product => product.id).join(",");
        const changed = this.shown !== undefined && shown !== this.shown;
        this.shown = shown;
        const page = untrack(() => this.model.page);
        const wanted = changed ? 0 : Math.min(page, pages - 1);
        if (wanted !== page) this.model.page = wanted;

        //Read after it has been settled, so this pass follows the page from here on.
        const first = this.model.page * size;
        this.model.total = products.length;

        //Building cards reads all sorts of signals on the way. None of them are what this follows — only the
        //ones above are — so the building is done without listening.
        untrack(() => {
            this.clear();
            for (const product of products.slice(first, first + size)) {
                const card = Item.create({parent: this.element, data: product, fixed: true});
                gradum(card).metadata.set(true, "catalogue");
                this.stocked.push(card);
            }
            this.element.syncItems();
            this.element.scrollTop = 0;
        });
    }

    /**
     * @description Take out the cards this operator put in. Deleted rather than removed: a card's add
     * dropdown keeps its popup outside the card, and `remove()` would strand it.
     * @protected
     */
    protected clear() {
        if (this.stocked.length === 0) return;
        this.stocked.forEach(card => card.delete());
        this.stocked = [];
        this.element.syncItems();
    }

    public detach() {
        this.clear();
        super.detach();
    }
}
