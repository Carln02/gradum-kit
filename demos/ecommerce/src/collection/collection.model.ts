import {GradumModel, signal} from "../../../../build/gradum-kit.esm";
import type {Item} from "../item/item";
import type {Filter} from "../filter/filter";

/**
 * @class CollectionModel
 *
 * @extends GradumModel
 * @description What a collection is and what is in it: what it is called, whether it is closed to changes,
 * whether it is a catalogue, and the items it holds. Where it is and how big it is belong to the collection
 * itself, as they do to any square on the canvas.
 */
export class CollectionModel extends GradumModel {
    /**
     * @description What the collection is called. Shown on it, and — for a cart — what an item's add
     * dropdown lists it as.
     */
    @signal public name: string = "";

    /**
     * @description Whether the collection is closed to changes. A locked collection cannot be moved and takes
     * nothing in — what it holds is what it held when it was locked.
     */
    @signal public locked: boolean = false;

    /**
     * @description Whether the collection is a catalogue: stocked with every product on offer, its cards
     * templates that are copied rather than moved when dragged out, and taking nothing in.
     */
    @signal public catalogue: boolean = false;

    /**
     * @description The items in the collection, in its own order. Read back off the collection's children by
     * {@link Collection.syncItems} rather than set directly, so the list and the page cannot differ.
     */
    @signal public items: Item[] = [];

    /**
     * @description Which page of a catalogue is shown, counting from 0. A catalogue builds cards for one
     * page of products at a time rather than for all of them, so the page holds at most
     * {@link CollectionModel.pageSize} cards however much is on offer.
     */
    @signal public page: number = 0;

    /**
     * @description How many cards a catalogue shows per page.
     */
    @signal public pageSize: number = 20;

    /**
     * @description How many products the collection has to show once its filters have had their say. For a
     * catalogue, across all its pages — what the pager counts against — and set by the catalogue operator;
     * for anything else, how many of its cards are not hidden, set by the query operator.
     */
    @signal public total: number = 0;

    /**
     * @description The filters applying to the collection, in the order they were connected. Only written by
     * the canvas's links handler.
     */
    @signal public filters: Filter[] = [];
}
