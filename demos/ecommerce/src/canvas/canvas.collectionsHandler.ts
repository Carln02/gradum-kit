import {GradumHandler} from "../../../../build/gradum-kit.esm";
import type {Collection} from "../collection/collection";
import {CanvasModel} from "./canvas.model";

/**
 * @class CanvasCollectionsHandler
 *
 * @extends GradumHandler
 * @description Keeps the canvas's list of collections straight. Pure bookkeeping over the list — nothing
 * here touches the page, which is why it is a handler rather than part of the canvas element.
 */
export class CanvasCollectionsHandler extends GradumHandler<CanvasModel> {
    public keyName: string = "collections";

    /**
     * @function add
     * @description Put a collection on the list, unless it is already there.
     * @param {Collection} collection - The collection to add.
     * @param {number} [index=the end] - Where in the list it goes.
     * @returns {boolean} Whether the list changed.
     */
    public add(collection: Collection, index: number = this.model.collections.length): boolean {
        if (!collection || this.model.collections.includes(collection)) return false;
        const arr = [...this.model.collections];
        if (typeof index !== "number" || index >= arr.length) arr.push(collection);
        else {
            if (index < 0) index = 0;
            arr.splice(index, 0, collection);
        }
        this.model.collections = arr;
        return true;
    }

    /**
     * @function remove
     * @description Take a collection off the list.
     * @param {Collection} collection - The collection to remove.
     * @returns {boolean} Whether the list changed.
     */
    public remove(collection: Collection): boolean {
        if (!collection || !this.model.collections.includes(collection)) return false;
        this.model.collections = this.model.collections.filter(entry => entry !== collection);
        return true;
    }

    /**
     * @function removeAt
     * @description Take the collection at a given place off the list.
     * @param {number} index - Where in the list it is.
     * @returns {boolean} Whether the list changed.
     */
    public removeAt(index: number): boolean {
        if (typeof index !== "number" || index >= this.model.collections.length || index < 0) return false;
        //A new array rather than splicing in place: the list is a signal, and what it is set to is what is
        //noticed. `splice` also hands back what it took out, not what is left.
        const arr = [...this.model.collections];
        arr.splice(index, 1);
        this.model.collections = arr;
        return true;
    }

    /**
     * @function nextFreeName
     * @description A name for a collection that has not been given one: `"Cart 1"`, then `"Cart 2"`, and so
     * on past whatever names are already taken, so drawing and deleting collections never produces two of the
     * same.
     * @param {string} prefix - What collections of this kind are called, before the number.
     * @returns {string} The name to use.
     */
    public nextFreeName(prefix: string): string {
        const taken = new Set(this.model.collections.map(collection => collection.name));
        for (let index = 1; ; index++) {
            const name = `${prefix} ${index}`;
            if (!taken.has(name)) return name;
        }
    }

    /**
     * @function get
     * @description The collection whose {@link Collection.dataId} is the given one.
     * @param {string} id - The id to look for.
     * @returns {Collection} The collection, or `undefined` if none on the list has that id.
     */
    public get(id: string): Collection {
        return this.model.collections.find(collection => collection.dataId === id);
    }
}
