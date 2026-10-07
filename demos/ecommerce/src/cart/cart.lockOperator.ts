import {effect, GradumOperator, gradum} from "../../../../build/gradum-kit.esm";
import {Cart} from "./cart";
import {CartModel} from "./cart.model";
import {CartView} from "./cart.view";

/**
 * @class CartLockOperator
 *
 * @extends GradumOperator
 * @description Makes the cart's lock mean something to the rest of the page.
 *
 * Locking is one idea with consequences in several places — what the tools may take hold of, what the
 * canvas's constrainer may move in or out — and none of them are the cart's own drawing or state. This is
 * the half the tools care about: a locked cart stops being something they will pick up.
 */
export class CartLockOperator extends GradumOperator<Cart, CartView, CartModel> {
    public keyName: string = "lock";

    @effect protected applyLock() {
        gradum(this.element).metadata.set(!this.model.locked, "modifiable");
    }
}
