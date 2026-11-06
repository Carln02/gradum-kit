import {
    ConstrainerCallbackProperties, GradumConstrainer, GradumEventName, solver
} from "../../../../build/gradum-kit.esm";
import {Collection} from "../collection/collection";
import {Item} from "../item/item";
import {Canvas} from "./canvas";
import {getRect} from "../utils";

/**
 * @class CanvasCollectionConstrainer
 *
 * @extends GradumConstrainer
 * @description Picks loose cards up into the collections they come to rest on.
 *
 * A card dropped straight onto a collection is the collection's own business — the select tool hands it over
 * and the collection puts it where it was dropped. This is the other way in: a card lying on the canvas that
 * is dragged where it stands and left over a collection, or one a collection is moved on top of, is taken in.
 * Being taken in is a real move — the card becomes the collection's child.
 *
 * Which collection a card is over is decided by its centre rather than by any overlap, so a card straddling
 * two collections goes to the one its middle is over, and to exactly one. A locked collection or a catalogue
 * takes nothing in.
 */
export class CanvasCollectionConstrainer extends GradumConstrainer<Canvas> {
    public constrainerName = "collections";

    //Solve only what the user just manipulated, rather than sweeping the whole canvas.
    public defaultQueue = [];

    @solver() protected collectLooseItems(properties: ConstrainerCallbackProperties) {
        //Only once the card has been let go of: moving one across a collection on the way somewhere else
        //should not drop it in, and taking it in mid-drag would pull it out from under the pointer.
        if (properties.eventType !== GradumEventName.dragEnd) return;
        const moved = properties.eventTarget;

        //A collection that moved has to be asked the other way round — which cards does it now cover? — since
        //asking only which collection covers one card would leave a collection swept across the canvas
        //picking up none.
        if (moved instanceof Collection) {
            if (this.takesIn(moved)) this.looseItems.filter(item => this.holds(moved, item))
                .forEach(item => this.insert(moved, item));
            return;
        }

        if (!(moved instanceof Item) || !this.looseItems.includes(moved)) return;
        const holder = this.element.collections.find(collection =>
            this.takesIn(collection) && this.holds(collection, moved));
        if (holder) this.insert(holder, moved);
    }

    /**
     * @readonly
     * @description The cards lying on the canvas itself. A card already in a collection is that collection's
     * child, so it is not among them.
     * @protected
     */
    protected get looseItems(): Item[] {
        return Array.from(this.element.children).filter(child => child instanceof Item) as Item[];
    }

    /**
     * @description Whether a collection takes anything in at all.
     * @param {Collection} collection - The collection to ask.
     * @returns {boolean} Whether it does.
     * @protected
     */
    protected takesIn(collection: Collection): boolean {
        return !collection.locked && !collection.catalogue;
    }

    /**
     * @description Put a card in a collection where its middle came to rest.
     * @param {Collection} collection - The collection taking it in.
     * @param {Item} item - The card.
     * @protected
     */
    protected insert(collection: Collection, item: Item) {
        const centre = getRect(item)?.center;
        collection.insertItem(item, centre ? collection.layoutOperator.indexAt(centre, item) : undefined, centre);
    }

    /**
     * @description Whether a collection covers the middle of an item.
     * @param {Collection} collection - The collection to test.
     * @param {Item} item - The item to test.
     * @returns {boolean} Whether the item's centre lies within the collection's area.
     * @protected
     */
    protected holds(collection: Collection, item: Item): boolean {
        const area = getRect(collection), rect = getRect(item);
        if (!area || !rect) return false;

        //Asked of the rect rather than worked out from its `x`: `x` is wherever the rect is anchored, and
        //a card anchored anywhere but its top-left would have its middle reckoned half a card away.
        const centre = rect.center;
        return centre.x >= area.left && centre.x <= area.right
            && centre.y >= area.top && centre.y <= area.bottom;
    }
}
