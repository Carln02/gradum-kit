import {GradumModel, handler, signal} from "../../../../build/gradum-kit.esm";
import type {Collection} from "../collection/collection";
import type {Catalogue} from "../catalogue/catalogue";
import {CanvasCollectionsHandler} from "./canvas.collectionsHandler";
import {CanvasLinksHandler, Link} from "./canvas.linksHandler";

/**
 * @class CanvasModel
 *
 * @extends GradumModel
 * @description What the canvas is holding: the collections drawn on it, and the catalogue everything on it is
 * stocked from. The items are ordinary children and need no listing, but the collections are what everything
 * else asks the canvas about.
 */
export class CanvasModel extends GradumModel {
    /**
     * @description The collections drawn on the canvas, in the order they were drawn. A plain signal rather
     * than a nested model: what reads this is an effect that wants the whole list — an item's add dropdown,
     * rebuilt whenever the carts change — and a model tracks reads key by key, so a nested model's `data`
     * would hand back an array that no effect ever hears about again.
     */
    @signal public collections: Collection[] = [];

    /**
     * @description Everything on offer. A catalogue collection on this canvas is stocked from it.
     */
    @signal public catalogue: Catalogue = undefined;

    /**
     * @description Keeping the list of collections straight: adding, removing, and naming.
     */
    @handler() public collectionsHandler: CanvasCollectionsHandler;

    /**
     * @description Which filters apply to which collections. Only written by the links handler.
     */
    @signal public links: Link[] = [];

    @handler() public linksHandler: CanvasLinksHandler;
}
