import {GradumHandler} from "../../../../build/gradum-kit.esm";
import {Cart} from "../cart/cart";
import {CanvasModel} from "./canvas.model";

/**
 * @class CanvasCartsHandler
 *
 * @extends GradumHandler
 * @description Keeps the canvas's list of carts straight. Pure bookkeeping over the list — nothing here
 * touches the page, which is why it is a handler rather than part of the canvas element.
 */
export class CanvasCartsHandler extends GradumHandler<CanvasModel> {
    public keyName: string = "carts";

    /**
     * @function add
     * @description Put a cart on the list, unless it is already there.
     * @param {Cart} cart - The cart to add.
     * @param index
     * @returns {boolean} Whether the list changed.
     */
    public add(cart: Cart, index: number = this.model.carts.length): boolean {
        if (!cart || this.model.carts.includes(cart)) return false;
        const arr = [...this.model.carts];
        if (typeof index !== "number" || index >= arr.length) arr.push(cart);
        else {
            if (index < 0) index = 0;
            arr.splice(index, 0, cart);
        }
        this.model.carts = arr;
        return true;
    }

    /**
     * @function remove
     * @description Take a cart off the list.
     * @param {Cart} cart - The cart to remove.
     * @returns {boolean} Whether the list changed.
     */
    public remove(cart: Cart): boolean {
        if (!cart || !this.model.carts.includes(cart)) return false;
        this.model.carts = this.model.carts.filter(entry => entry !== cart);
        return true;
    }

    /**
     * @function removeAt
     * @description Take the cart at a given place off the list.
     * @param {number} index - Where in the list it is.
     * @returns {boolean} Whether the list changed.
     */
    public removeAt(index: number): boolean {
        if (typeof index !== "number" || index >= this.model.carts.length || index < 0) return false;
        //A new array rather than splicing in place: the list is a signal, and what it is set to is what is
        //noticed. `splice` also hands back what it took out, not what is left.
        const arr = [...this.model.carts];
        arr.splice(index, 1);
        this.model.carts = arr;
        return true;
    }

    /**
     * @function nextFreeName
     * @description A name for a cart that has not been given one: `"Cart 1"`, then `"Cart 2"`, and so on
     * past whatever names are already taken, so drawing and deleting carts never produces two of the same.
     * @returns {string} The name to use.
     */
    public nextFreeName(): string {
        const taken = new Set(this.model.carts.map(cart => cart.name));
        for (let index = 1; ; index++) {
            const name = `Cart ${index}`;
            if (!taken.has(name)) return name;
        }
    }

    /**
     * @function getCart
     * @description The cart whose {@link Cart.dataId} is the given one.
     * @param {string} id - The id to look for.
     * @returns {Cart} The cart, or `undefined` if no cart on the list has that id.
     */
    public getCart(id: string): Cart {
        return this.model.carts.find(cart => cart.dataId === id);
    }
}