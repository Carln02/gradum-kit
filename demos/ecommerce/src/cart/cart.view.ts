import {
    DefaultEventName, div, effect, element, GradumView, gradum, span
} from "../../../../build/gradum-kit.esm";
import {Cart} from "./cart";
import {CartModel} from "./cart.model";

/**
 * @class CartView
 *
 * @extends GradumView
 * @description The area itself: a tinted rectangle on the canvas with a strip along the top carrying the
 * cart's name, its lock, and the button for adding to it, and the cards it is holding laid out down the
 * rest of it.
 */
export class CartView extends GradumView<Cart, CartModel> {
    /**
     * @description The strip along the top. Public because the cart's fit operator measures around it to
     * work out how much room the cards have.
     */
    public header: HTMLElement;

    protected title: HTMLElement;
    protected count: HTMLElement;
    protected lockButton: HTMLElement;
    protected addButton: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();

        this.title = span({classes: "cart-name"});
        this.count = span({classes: "cart-count"});
        this.lockButton = element({tag: "button", classes: "cart-lock"});
        this.addButton = element({tag: "button", classes: "cart-add", text: "+"});
        this.header = div({
            classes: "cart-header",
            children: [this.title, this.count, this.lockButton, this.addButton]
        });
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild(this.header);
    }

    protected setupUIListeners() {
        super.setupUIListeners();

        gradum(this.lockButton).on(DefaultEventName.click, () => this.element.locked = !this.element.locked);
        //What it does is for later; it says so rather than doing nothing silently.
        gradum(this.addButton).on(DefaultEventName.click, () => this.element.onAddClicked.fire(this.element));
    }

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        //Whether the contents fit is the fit operator's to work out and the view's to show. Told rather
        //than measured, so the view never has to know which operator is in and how it decided.
        this.emitter.add("overflowed", () => gradum(this).toggleClass("cart-full", true));
        this.emitter.add("fits", () => gradum(this).toggleClass("cart-full", false));
    }

    @effect protected updateArea() {
        const position = this.model.position, size = this.model.size;
        //Applied instantly rather than queued for the next frame, so the rectangle keeps up with the drag
        //that is drawing it.
        gradum(this).setStyles({
            transform: `translate(${position.x}px, ${position.y}px)`,
            width: `${size.x}px`,
            height: `${size.y}px`,
            backgroundColor: this.model.color
        }, true);
    }

    @effect protected updateName() {
        this.title.textContent = this.model.name;
    }

    @effect protected updateCount() {
        const count = this.model.items?.length ?? 0;
        this.count.textContent = count === 1 ? "1 item" : `${count} items`;
    }

    @effect protected updateLocked() {
        const locked = this.model.locked;
        this.lockButton.textContent = locked ? "🔒" : "🔓";
        gradum(this).toggleClass("locked", locked);
    }
}
