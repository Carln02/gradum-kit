import {GradumHandler} from "../../../../build/gradum-kit.esm";
import type {Collection} from "../collection/collection";
import type {Filter} from "../filter/filter";
import {CanvasModel} from "./canvas.model";

/**
 * @description One filter applying to one collection.
 * @property {Filter} filter - The filter.
 * @property {Collection} collection - The collection it applies to.
 */
export type Link = {
    filter: Filter,
    collection: Collection,
};

/**
 * @class CanvasLinksHandler
 *
 * @extends GradumHandler
 * @description Keeps track of which filters apply to which collections.
 *
 * The only thing that writes a filter's `targets` or a collection's `filters`, so the two sides of a link
 * cannot disagree: every link is written to both, and to the canvas's own list, in one go.
 */
export class CanvasLinksHandler extends GradumHandler<CanvasModel> {
    public keyName: string = "links";

    /**
     * @function has
     * @param {Filter} filter - The filter.
     * @param {Collection} collection - The collection.
     * @returns {boolean} Whether the filter applies to the collection.
     */
    public has(filter: Filter, collection: Collection): boolean {
        return this.model.links.some(link => link.filter === filter && link.collection === collection);
    }

    /**
     * @function connect
     * @description Have a filter apply to a collection. Filters apply in the order they were connected.
     * @param {Filter} filter - The filter.
     * @param {Collection} collection - The collection.
     * @returns {boolean} Whether anything changed — `false` if it already applied.
     */
    public connect(filter: Filter, collection: Collection): boolean {
        if (!filter || !collection || this.has(filter, collection)) return false;
        this.model.links = [...this.model.links, {filter, collection}];
        this.sync(filter, collection);
        return true;
    }

    /**
     * @function disconnect
     * @description Stop a filter applying to a collection.
     * @param {Filter} filter - The filter.
     * @param {Collection} collection - The collection.
     * @returns {boolean} Whether anything changed.
     */
    public disconnect(filter: Filter, collection: Collection): boolean {
        if (!this.has(filter, collection)) return false;
        this.model.links = this.model.links
            .filter(link => link.filter !== filter || link.collection !== collection);
        this.sync(filter, collection);
        return true;
    }

    /**
     * @function toggle
     * @description Connect a filter to a collection, or disconnect it if it was.
     * @param {Filter} filter - The filter.
     * @param {Collection} collection - The collection.
     */
    public toggle(filter: Filter, collection: Collection) {
        if (!this.disconnect(filter, collection)) this.connect(filter, collection);
    }

    /**
     * @function disconnectAll
     * @description Undo every link a filter or a collection is part of — what deleting one calls.
     * @param {Filter | Collection} end - The filter or collection.
     */
    public disconnectAll(end: Filter | Collection) {
        this.model.links.filter(link => link.filter === end || link.collection === end)
            .forEach(link => this.disconnect(link.filter, link.collection));
    }

    /**
     * @description Write a filter's targets and a collection's filters back from the canvas's list.
     * @param {Filter} filter - The filter.
     * @param {Collection} collection - The collection.
     * @protected
     */
    protected sync(filter: Filter, collection: Collection) {
        const links = this.model.links;
        filter.model.targets = links.filter(link => link.filter === filter).map(link => link.collection);
        collection.model.filters = links.filter(link => link.collection === collection).map(link => link.filter);
    }
}
