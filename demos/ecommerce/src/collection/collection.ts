import {
    Anchor, Color, define, expose, gradum, operator, Point, randomId, signal
} from "../../../../build/gradum-kit.esm";
import {Square} from "../square/square";
import {Item} from "../item/item";
import {DropTarget} from "../utils";
import type {Canvas} from "../canvas/canvas";
import {CollectionModel} from "./collection.model";
import {CollectionView} from "./collection.view";
import {CollectionProperties} from "./collection.types";
import {CollectionLayoutOperator, CollectionListLayoutOperator} from "./collection.layoutOperator";
import {CollectionScrollFitOperator} from "./collection.fitOperator";
import {CollectionCatalogueOperator} from "./collection.catalogueOperator";
import {CollectionQueryOperator} from "./collection.queryOperator";
import {Product} from "../catalogue/catalogue.types";
import type {Filter} from "../filter/filter";
import "./collection.css";

/**
 * @class Collection
 *
 * @extends Square
 * @description A group of items, as an area of the canvas: a tinted rectangle that whatever is in it belongs
 * to.
 *
 * What a collection holds, it holds: an item put in one becomes its child, so moving the collection moves
 * the items with nothing else to do. How they are laid out inside it is its layout operator's business — see
 * {@link CollectionLayoutOperator}. Dropping a card on a collection is what puts it in; dropping one back on
 * the canvas takes it out again. A collection moved over loose cards on the canvas picks them up, which is the
 * canvas's constrainer's doing.
 *
 * A locked collection is closed: it cannot be dragged, and it takes nothing in. A catalogue is stocked with
 * every product on offer, and takes nothing in either — its cards are templates, copied when dragged out.
 */
export class Collection<
    View extends CollectionView = CollectionView<any, any>,
    Model extends CollectionModel = CollectionModel
> extends Square<View, any, Model> implements DropTarget {
    public declare properties: CollectionProperties;
    public static defaultProperties: CollectionProperties = {
        view: CollectionView,
        model: CollectionModel,
        operators: [
            CollectionListLayoutOperator,
            CollectionScrollFitOperator,
            CollectionCatalogueOperator,
            CollectionQueryOperator
        ],
    };

    /**
     * @description What a collection of this kind is called when it is not given a name — numbered after it,
     * as in "Collection 2".
     */
    public static namePrefix: string = "Collection";

    /**
     * @description How the collection lays out what it holds. Swap it to change the layout.
     */
    @operator() public layoutOperator: CollectionLayoutOperator;

    //Pale by default, since items sit on top of it and have to stay readable.
    @signal color: Color = Color.random([70, 95], [80, 92]);

    //Placed by its corner rather than its middle, so drawing one is a matter of where the drag started.
    @signal anchor: Anchor | Point = Anchor.TopLeft;

    @expose("model") name: string;
    @expose("model") locked: boolean;
    @expose("model") catalogue: boolean;

    /**
     * @readonly
     * @description The items in the collection, in its own order.
     */
    @expose("model", false) items: Item[];

    /**
     * @readonly
     * @description The filters applying to the collection, in the order they were connected.
     */
    @expose("model", false) filters: Filter[];

    public initialize() {
        //Only the first time, so a second call does not give the collection a new id under everything that
        //already points at it by the old one.
        if (this.initialized) return;
        super.initialize();
        this.dataId = randomId();
        gradum(this).metadata.set(true, "dropTarget");
        this.canvas?.addCollection(this);
    }

    /**
     * @readonly
     * @description The canvas the collection is on.
     */
    public get canvas(): Canvas {
        return gradum(this).closest("my-canvas") as Canvas;
    }

    /**
     * @readonly
     * @description The items in the collection, in the order they are laid out. Read from the collection's
     * own children, so the order on the page and the order in the list are the same thing rather than two
     * things kept in step.
     */
    public get itemElements(): Item[] {
        return Array.from(this.children).filter(child => child instanceof Item) as Item[];
    }

    /**
     * @function acceptDrop
     * @description Take a card dropped on the collection, and put it where it was dropped — whatever that
     * means for the layout. A card dragged from a catalogue is a template, so a copy of it goes in and the
     * catalogue keeps its own.
     *
     * A locked collection or a catalogue takes nothing, and the card goes back to wherever it came from.
     * @param {Item} item - The card that was dropped.
     * @param {Point} position - Where it was let go of.
     */
    public acceptDrop(item: Item, position: Point) {
        if (this.locked || this.catalogue || !(item instanceof Item)) return;
        const placed = gradum(item).metadata?.get("catalogue") ? item.clone({parent: this}) : item;
        this.insertItem(placed, this.layoutOperator.indexAt(position, placed), position);
        this.canvas?.syncCollections();
    }

    /**
     * @function query
     * @description Narrow and order products the way the filters linked to this collection ask. What a
     * catalogue shows is what this returns, a page at a time.
     *
     * Reads the filters' settings as it goes, so an effect asking this follows every filter linked here.
     * @param {Product[]} products - The products to narrow down. Left as they are.
     * @returns {Product[]} Those that every linked filter lets through, in the order they ask for.
     */
    public query<Entry extends Partial<Product>>(products: Entry[]): Entry[] {
        const filters = this.model.filters ?? [];
        if (filters.length === 0) return products;

        const shown = products.filter(product => filters.every(filter => filter.test(product)));
        const comparators = filters.map(filter => filter.comparator()).filter(Boolean);
        if (comparators.length === 0) return shown;

        //Each filter's order in turn, then the name for whatever is still tied.
        return shown.sort((a, b) => {
            for (const compare of comparators) {
                const order = compare(a, b);
                if (order) return order;
            }
            return (a?.name ?? "").localeCompare(b?.name ?? "");
        });
    }

    /**
     * @function turnPage
     * @description Go forward or back through a catalogue's pages, stopping at either end.
     * @param {number} by - How many pages to go: 1 for the next, -1 for the one before.
     */
    public turnPage(by: number) {
        const pages = Math.max(1, Math.ceil(this.model.total / this.model.pageSize));
        this.model.page = Math.min(pages - 1, Math.max(0, this.model.page + by));
    }

    /**
     * @function insertItem
     * @description Put a card in the collection, taking it out of wherever it was. See
     * {@link CollectionLayoutOperator.place}.
     * @param {Item} item - The card to put in.
     * @param {number} [index] - Where in the order it goes. Left out, it goes last.
     * @param {Point} [position] - Where on the canvas it was put down.
     */
    public insertItem(item: Item, index?: number, position?: Point) {
        this.layoutOperator.place(item, index, position);
    }

    /**
     * @function syncItems
     * @description Read the collection's contents back off its children, so the list matches what is on the
     * page after anything has moved.
     */
    public syncItems() {
        const items = this.itemElements;
        const current = this.model.items;
        if (items.length === current.length && items.every((item, at) => current[at] === item)) return;
        this.model.items = items;
    }

    /**
     * @description Take the collection off the canvas, and the cards in it with it. A card to be kept has to
     * be dragged back out onto the canvas first.
     */
    public delete() {
        this.canvas?.removeCollection(this);
        //Destroyed rather than removed, so that the add dropdown of every card in it takes its popup with it
        //instead of stranding it in the shared popup container.
        gradum(this).destroy();
    }
}

define(Collection, "demo-collection");
