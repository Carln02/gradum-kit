import {GradumOperator, Point} from "../../../../build/gradum-kit.esm";
import type {Collection} from "./collection";
import type {Item} from "../item/item";
import {CollectionModel} from "./collection.model";
import {CollectionView} from "./collection.view";

/**
 * @class CollectionLayoutOperator
 *
 * @extends GradumOperator
 * @description Decides how a collection lays out what it holds — and so what putting an item in it means.
 *
 * An item in a collection is the collection's child, whatever the layout: moving the collection moves it,
 * with nothing to do. What differs is how a child is placed. A list puts it at a place in its order and lays
 * it out itself; a freeform area lets it keep a position of its own, inside the area.
 *
 * Swap the subclass to change the layout. Every layout answers to the key `"layout"`, so one can be taken out
 * and another put in:
 *
 * ```ts
 * gradum(collection).removeOperator("layout").addOperator(new CollectionListLayoutOperator());
 * ```
 */
export abstract class CollectionLayoutOperator extends GradumOperator<Collection, CollectionView, CollectionModel> {
    public keyName: string = "layout";

    /**
     * @function place
     * @description Put an item in the collection, taking it out of wherever it was.
     * @param {Item} item - The item to put in.
     * @param {number} [index] - Where in the collection's order it goes. Left out, it goes last.
     * @param {Point} [position] - Where on the canvas it was put down, for a layout that keeps positions.
     */
    public abstract place(item: Item, index?: number, position?: Point): void;

    /**
     * @function indexAt
     * @description Where in the collection's order an item put down at this point belongs, for a layout
     * where that means something.
     * @param {Point} position - Where it was put down, on the canvas.
     * @param {Item} [moved] - The item being placed, left out of the reckoning so that an item already in the
     * collection is not counted against its own new place.
     * @returns {number} The place in the order, or `undefined` for a layout where the order is not where it
     * was put down — which puts it last.
     */
    public abstract indexAt(position: Point, moved?: Item): number;
}

/**
 * @class CollectionListLayoutOperator
 *
 * @extends CollectionLayoutOperator
 * @description Lays the collection out as a list, down its length, in its order.
 *
 * An item in a list gives up its own position: it is laid out by the list, and is dragged and dropped rather
 * than moved in place. Where down the list it is dropped is where in the order it goes.
 */
export class CollectionListLayoutOperator extends CollectionLayoutOperator {
    public place(item: Item, index?: number, position?: Point) {
        if (!item) return;
        item.fixed = true;

        const others = this.element.itemElements.filter(entry => entry !== item);
        const before = index === undefined ? undefined : others[index];
        if (before) this.element.insertBefore(item, before);
        else this.element.appendChild(item);

        this.element.syncItems();
    }

    /**
     * @description Before the first item whose middle is below the point, or last when it is below them all.
     */
    public indexAt(position: Point, moved?: Item): number {
        if (!position) return undefined;
        const items = this.element.itemElements.filter(item => item !== moved);
        for (let index = 0; index < items.length; index++) {
            const rect = items[index].getBoundingClientRect();
            if (position.y < rect.y + rect.height / 2) return index;
        }
        return items.length;
    }
}
