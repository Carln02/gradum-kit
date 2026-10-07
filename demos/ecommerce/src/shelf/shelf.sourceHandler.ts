import {effect, GradumHandler} from "../../../../build/gradum-kit.esm";
import {ShelfModel} from "./shelf.model";
import {ShelfEntry} from "./shelf.types";

/**
 * @class ShelfSourceHandler
 *
 * @extends GradumHandler
 * @description Reads the shelf's items from wherever it was pointed.
 *
 * Fetching and making sense of a file is neither what the shelf is nor how it is drawn, and it touches
 * nothing but the model — a source to read, a list to fill — so it is a handler rather than an operator.
 * Naming a source is all a shelf has to do: this watches the name and goes and reads it.
 */
export class ShelfSourceHandler extends GradumHandler<ShelfModel> {
    public keyName: string = "source";

    @effect protected followSource() {
        const source = this.model.source;
        if (source) void this.read(source);
    }

    /**
     * @function read
     * @description Read a file of items and list them. The file may be either a bare array of items or an
     * object with them under `items`.
     *
     * A file that cannot be read leaves the shelf empty and says so in the console rather than throwing: a
     * shop with nothing on the shelves is a better failure than a page that never finishes loading.
     * @param {string} source - URL to read from.
     * @returns {Promise<ShelfEntry[]>} What ended up listed.
     */
    public async read(source: string): Promise<ShelfEntry[]> {
        if (!source) return [];
        try {
            const response = await fetch(source);
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

            const read = await response.json();
            const items = Array.isArray(read) ? read : read?.items;
            this.model.items = Array.isArray(items) ? items : [];
        } catch (error) {
            console.warn(`Shelf could not read its items from "${source}":`, error);
            this.model.items = [];
        }
        return this.model.items;
    }
}
