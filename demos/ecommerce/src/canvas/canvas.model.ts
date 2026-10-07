import {GradumModel, handler, signal} from "../../../../build/gradum-kit.esm";
import {Cart} from "../cart/cart";
import {CanvasCartsHandler} from "./canvas.cartsHandler";

/**
 * @class CanvasModel
 *
 * @extends GradumModel
 * @description What the canvas is holding. For now that is the carts drawn on it — the items are ordinary
 * children and need no listing, but the carts are what everything else asks the canvas about.
 */
export class CanvasModel extends GradumModel {
    /**
     * @description The carts drawn on the canvas, in the order they were drawn. A plain signal rather than a
     * nested model: what reads this is an effect that wants the whole list — an item's add dropdown, rebuilt
     * whenever the carts change — and a model tracks reads key by key, so `cartModel.data` would hand back
     * an array that no effect ever hears about again.
     */
    @signal public carts: Cart[] = [];

    /**
     * @description Keeping that list straight: adding, removing, and naming.
     */
    @handler() public cartsHandler: CanvasCartsHandler;
}
