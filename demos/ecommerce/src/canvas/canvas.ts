import {define, expose, GradumElement, gradum, Point} from "../../../../build/gradum-kit.esm";
import {Item} from "../item/item";
import {DropTarget} from "../utils";
import {Cart} from "../cart/cart";
import type {Collection} from "../collection/collection";
import type {Catalogue} from "../catalogue/catalogue";
import {CanvasCollectionConstrainer} from "./canvas.collectionConstrainer";
import {CanvasCollectionsHandler} from "./canvas.collectionsHandler";
import {CanvasLinksHandler} from "./canvas.linksHandler";
import type {Filter} from "../filter/filter";
import {CanvasModel} from "./canvas.model";
import "./canvas.css";

/**
 * @class Canvas
 *
 * @extends GradumElement
 * @description The surface everything is arranged on, and the one place that knows which collections exist
 * and what is on offer.
 *
 * A card dropped on the canvas is laid down where it was dropped and is the canvas's own; a card dropped on a
 * collection becomes that collection's, and one left lying on a collection is taken in by
 * {@link CanvasCollectionConstrainer}. A collection puts itself on the canvas's list as it is drawn, so
 * anything wanting to offer the carts — an item's add button, say — can ask the canvas rather than having to
 * watch for them.
 */
export class Canvas extends GradumElement<any, any, CanvasModel> implements DropTarget {
    public static defaultProperties = {
        model: CanvasModel,
        handlers: [CanvasCollectionsHandler, CanvasLinksHandler],
        constrainers: [CanvasCollectionConstrainer],
    };

    /**
     * @readonly
     * @description The collections drawn on the canvas, in the order they were drawn.
     */
    @expose("model", false) collections: Collection[];

    /**
     * @description Everything on offer. A catalogue collection on this canvas is stocked from it.
     */
    @expose("model") catalogue: Catalogue;

    /**
     * @readonly
     * @description The carts among the collections, in the order they were drawn — what an item's add
     * dropdown offers.
     */
    public get carts(): Cart[] {
        return this.collections.filter(collection => collection instanceof Cart) as Cart[];
    }

    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "substrate");
        gradum(this).metadata.set(true, "dropTarget");
    }

    /**
     * @function acceptDrop
     * @description Lay a card down on the canvas where it was dropped. A card dragged from a catalogue is a
     * template, so the canvas takes a copy of it and leaves the catalogue's own card where it is; anything
     * else is the card itself, moved here from wherever it was, and placing itself again from now on.
     * @param {Item} item - The card that was dropped.
     * @param {Point} position - Where it was let go of.
     */
    public acceptDrop(item: Item, position: Point) {
        if (!(item instanceof Item)) return;
        //A catalogue card is cloned straight onto the canvas rather than cloned and then added: the copy
        //works out what it can be added to as it is built, and it can only do that once it is here.
        const placed = gradum(item).metadata?.get("catalogue") ? item.clone({parent: this}) : item;
        gradum(placed).addToParent(this);
        placed.fixed = false;
        //A card is placed by its middle, so this lands it where the ghost was.
        placed.position = position;

        this.syncCollections();
    }

    /**
     * @function syncCollections
     * @description Have every collection look again at what it is holding. Called after a card has been
     * moved between collections or onto the canvas, since only the two ends of that move know it happened.
     */
    public syncCollections() {
        this.collections.forEach(collection => collection.syncItems());
    }

    /**
     * @function addCollection
     * @description Take note of a collection drawn on the canvas, naming it if it has no name. Called by the
     * collection itself as it appears; there is no need to call it by hand.
     * @param {Collection} collection - The collection to take note of.
     */
    public addCollection(collection: Collection) {
        if (!collection.name) collection.name = this.model.collectionsHandler
            .nextFreeName((collection.constructor as typeof Collection).namePrefix);
        this.model.collectionsHandler.add(collection);
    }

    /**
     * @function getCollection
     * @description The collection whose {@link Collection.dataId} is the given one.
     * @param {string} id - The id to look for.
     * @returns {Collection} The collection, or `undefined` if none on the canvas answers to that id.
     */
    public getCollection(id: string): Collection {
        if (!id) return undefined;
        return this.model.collectionsHandler.get(id);
    }

    /**
     * @function getCart
     * @description The cart whose {@link Cart.dataId} is the given one, as named in an add button's
     * `data-cart`.
     * @param {string} id - The id to look for.
     * @returns {Cart} The cart, or `undefined` if no cart on the canvas answers to that id.
     */
    public getCart(id: string): Cart {
        const collection = this.getCollection(id);
        return collection instanceof Cart ? collection : undefined;
    }

    /**
     * @function removeCollection
     * @description Forget a collection that has been taken off the canvas.
     * @param {Collection} collection - The collection to forget.
     */
    public removeCollection(collection: Collection) {
        this.model.linksHandler.disconnectAll(collection);
        this.model.collectionsHandler.remove(collection);
    }

    /**
     * @function isLinked
     * @param {Filter} filter - A filter.
     * @param {Collection} collection - A collection.
     * @returns {boolean} Whether the filter applies to the collection.
     */
    public isLinked(filter: Filter, collection: Collection): boolean {
        return this.model.linksHandler.has(filter, collection);
    }

    /**
     * @function toggleLink
     * @description Have a filter apply to a collection, or stop it applying if it did.
     * @param {Filter} filter - The filter.
     * @param {Collection} collection - The collection.
     */
    public toggleLink(filter: Filter, collection: Collection) {
        this.model.linksHandler.toggle(filter, collection);
    }

    /**
     * @function removeFilter
     * @description Forget a filter that is being deleted: it stops applying to anything.
     * @param {Filter} filter - The filter.
     */
    public removeFilter(filter: Filter) {
        this.model.linksHandler.disconnectAll(filter);
    }
}

define(Canvas, "my-canvas");
