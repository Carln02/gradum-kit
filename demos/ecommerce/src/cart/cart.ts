import {Delegate, define, expose, GradumElement, GradumRect, gradum, Point, randomId} from "../../../../build/gradum-kit.esm";
import {Item} from "../item/item";
import {DropTarget} from "../utils";
import {Canvas} from "../canvas/canvas";
import {CartAmountsHandler} from "./cart.amountsHandler";
import {CartLockOperator} from "./cart.lockOperator";
import {CartScrollFitOperator} from "./cart.fitOperator";
import {CartModel} from "./cart.model";
import {CartView} from "./cart.view";
import "./cart.css";

/**
 * @class Cart
 *
 * @extends GradumElement
 * @description A cart, as an area of the canvas: a tinted rectangle that whatever is lying on it belongs to.
 *
 * What a cart holds, it holds: an item put in one becomes the cart's own child and is laid out down the
 * cart in the order it is in, rather than placing itself. Dropping a card on a cart is what puts it in, and
 * where down the cart it was dropped is where in the order it goes; dropping one back on the canvas takes it
 * out again. A cart moved over loose cards on the canvas picks them up, which is the constrainer's doing.
 *
 * A locked cart is closed: it cannot be dragged, and it takes nothing in — what it holds is what it held
 * when it was locked.
 */
export class Cart extends GradumElement<CartView, any, CartModel> implements DropTarget {
    public static defaultProperties = {
        view: CartView,
        model: CartModel,
        handlers: CartAmountsHandler,
        operators: [CartLockOperator, CartScrollFitOperator],
    };

    @expose("model") name: string;
    @expose("model") color: string;
    @expose("model") position: Point;
    @expose("model") size: Point;
    @expose("model") locked: boolean;
    @expose("model") items: Item[];

    /**
     * @readonly
     * @description Fired when the cart's add button is pressed. What that should do is still to be decided,
     * so the cart says it happened and leaves it there.
     */
    public readonly onAddClicked: Delegate<(cart: Cart) => void> = new Delegate();

    public initialize() {
        super.initialize();
        this.dataId = randomId();
        gradum(this).metadata.set(true, "dropTarget");
        this.canvas?.addCart(this);
    }

    public get canvas() {
        return gradum(this).closest("my-canvas") as Canvas;
    }

    /**
     * @readonly
     * @description The cards in the cart, in the order they are laid out. Read from the cart's own children,
     * so the order on screen and the order in the list are the same thing rather than two things kept in step.
     */
    public get itemElements(): Item[] {
        return Array.from(this.children).filter(child => child instanceof Item) as Item[];
    }

    /**
     * @function acceptDrop
     * @description Take a card dropped on the cart, and put it where down the cart it was dropped. A card
     * dragged from the shelf is a catalogue entry, so a copy of it goes in and the shelf keeps its own.
     *
     * A locked cart takes nothing, and the card goes back to wherever it came from.
     * @param {Item} item - The card that was dropped.
     * @param {Point} position - Where it was let go of.
     */
    public acceptDrop(item: Item, position: Point) {
        if (this.locked || !(item instanceof Item)) return;
        const placed = gradum(item).metadata?.get("catalogue") ? item.clone({parent: this}) : item;
        this.insertItem(placed, this.indexAt(position.y, placed));
        this.canvas?.syncCarts();
    }

    /**
     * @function insertItem
     * @description Put a card in the cart at a given place in the order, taking it out of wherever it was.
     * The card gives up its own position: inside a cart it is laid out by the cart.
     * @param {Item} item - The card to put in.
     * @param {number} [index=the end] - Where in the order it goes.
     */
    public insertItem(item: Item, index: number = this.itemElements.length) {
        if (!item) return;
        item.position = undefined;

        const before = this.itemElements.filter(entry => entry !== item)[index];
        if (before) this.insertBefore(item, before);
        else this.appendChild(item);

        this.syncItems();
    }

    /**
     * @function syncItems
     * @description Read the cart's contents back off its children, so the list matches what is on screen
     * after anything has moved.
     */
    public syncItems() {
        const items = this.itemElements;
        const current = this.model.items;
        if (items.length === current.length && items.every((item, at) => current[at] === item)) return;
        this.model.items = items;
    }

    /**
     * @description Where in the order a card dropped at this height belongs: before the first card whose
     * middle is below it, or last when it is below them all.
     * @param {number} y - The height the card was dropped at.
     * @param {Item} [moved] - The card being placed, left out of the reckoning so that a card already in the
     * cart is not counted against its own new place.
     * @returns {number} The place in the order.
     * @protected
     */
    protected indexAt(y: number, moved?: Item): number {
        const items = this.itemElements.filter(item => item !== moved);
        for (let index = 0; index < items.length; index++) {
            const rect = items[index].getBoundingClientRect();
            if (y < rect.y + rect.height / 2) return index;
        }
        return items.length;
    }

    /**
     * @function addItem
     * @description Take an amount of an item, as an item's add button asks it to. Separate from lying on the
     * cart's area: this is a quantity somebody asked for, that one is where the card happens to be.
     *
     * A locked cart takes nothing.
     * @param {Item} item - The item being added.
     * @param {number} amount - How many units of it.
     */
    public addItem(item: Item, amount: number): void {
        //Refusing is the cart's own decision; the sum once it has agreed is the model's.
        if (this.locked) return;
        this.model.amountsHandler.add(item, amount);
    }

    /**
     * @function howMuchOf
     * @description How much of an item has been added to this cart through an add button.
     * @param {Item} item - The item to ask about.
     * @returns {number} The amount, or `0` if none has been added.
     */
    public howMuchOf(item: Item): number {
        return this.model.amountsHandler.of(item);
    }

    /**
     * @description Take the cart off the canvas, and the cards in it with it. A card to be kept has to be
     * dragged back out onto the canvas first.
     */
    public delete() {
        this.canvas?.removeCart(this);
        //Destroyed rather than removed, so that the add dropdown of every card in the cart takes its popup
        //with it instead of stranding it in the shared popup container.
        gradum(this).destroy();
    }

    public getBoundingClientRect(): GradumRect {
        return new GradumRect({
            x: this.model.position.x,
            y: this.model.position.y,
            width: this.model.size.x,
            height: this.model.size.y
        });
    }
}

define(Cart, "demo-cart");
