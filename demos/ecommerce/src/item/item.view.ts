import {
    div, effect, element, GradumDropdown, GradumNumericalInput, GradumView, gradum, img, signal, span,
    untrack
} from "../../../../build/gradum-kit.esm";
import {Item} from "./item";
import {ItemModel} from "./item.model";
import {formatPrice} from "../utils";
import {Canvas} from "../canvas/canvas";
import {Cart} from "../cart/cart";

/**
 * @class ItemView
 *
 * @extends GradumView
 * @description The card itself: the item's picture beside its name and unit price, then the row that puts an
 * amount of it in a cart, and the row that says how much of it a recipe uses. Which cart is chosen from a
 * popup hung off the add button, so the card stays the size of what the item is rather than of what can be
 * done with it.
 */
export class ItemView extends GradumView<Item, ItemModel> {
    @signal public showAddButton: boolean = true;
    @signal public showRecipe: boolean = true;

    protected picture: HTMLImageElement;
    protected title: HTMLElement;
    protected price: HTMLElement;

    protected cartAmountInput: GradumNumericalInput;
    protected addDropdown: GradumDropdown;
    protected subtotal: HTMLElement;
    protected recipeAmountInput: GradumNumericalInput;
    protected recipeUnit: HTMLElement;

    protected cartRow: HTMLElement;
    protected recipeRow: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();

        this.picture = img({classes: "item-picture"});
        this.title = span({classes: "item-title"});
        this.price = span({classes: "item-price"});

        this.cartAmountInput = GradumNumericalInput.create({classes: "item-amount", min: 0, decimalPlaces: 2});
        this.subtotal = span({classes: "item-subtotal"});

        //A dropdown is the add button and its list of carts in one: a selector to click and a popup hung off
        //it. The selector is a plain button rather than a GradumButton on purpose — a dropdown rewrites a
        //GradumButton selector to show what was picked, and this one is an action, not a choice. It should
        //go on saying "Add".
        this.addDropdown = GradumDropdown.create({
            classes: "item-add-dropdown",
            selector: element({tag: "button", classes: "item-add", text: "Add"}),
            popupClasses: "item-cart-popup"
        });

        gradum(this.addDropdown).showTransition = gradum().displayTransition;

        this.recipeAmountInput = GradumNumericalInput.create({classes: "item-amount", min: 0, decimalPlaces: 2});
        this.recipeUnit = span({classes: "item-unit"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([
            div({
                classes: "item-header",
                children: [
                    this.picture,
                    div({classes: "item-heading", children: [this.title, this.price]})
                ]
            }),
            this.cartRow = div({
                classes: ["item-row", "item-cart-row"],
                children: [
                    span({classes: "item-label", text: "Cart"}),
                    this.cartAmountInput, this.addDropdown, this.subtotal
                ]
            }),
            this.recipeRow = div({
                classes: ["item-row", "item-recipe-row"],
                children: [
                    span({classes: "item-label", text: "Recipe"}),
                    this.recipeAmountInput, this.recipeUnit
                ]
            })
        ]);
        gradum(this.recipeRow).showTransition = gradum().displayTransition;
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        this.cartAmountInput.onInput.add(() => this.model.cartAmount = this.cartAmountInput.value);
        this.recipeAmountInput.onInput.add(() => this.model.recipeAmount = this.recipeAmountInput.value);
        this.addDropdown.select.onEntryClicked = entry =>
            this.addTo(gradum(this).closest(Canvas)?.getCart(entry.dataset?.cart));
    }

    @effect protected updatePlacement() {
        const position = this.model.position;
        gradum(this).toggleClass("placed", !!position);
        gradum(this).setStyle("transform",
            position ? `translate(${position.x}px, ${position.y}px)` : "", true);
    }

    @effect protected updatePicture() {
        const image = this.model.image;
        gradum(this.picture).show(!!image);
        if (image) this.picture.src = image;
        this.picture.alt = this.model.name;
    }

    @effect protected updateTitle() {
        this.title.textContent = this.model.name;
    }

    @effect protected updatePrice() {
        this.price.textContent = `${formatPrice(this.model.price)} / ${this.model.unit}`;
    }

    /**
     * @description Rebuild the list of carts the popup offers. An item with no carts has nothing to be added
     * to, so its add button says as much rather than opening on an empty list.
     * @protected
     */
    @effect protected updateCarts() {
        const carts = gradum(this).closest(Canvas)?.carts ?? [];
        this.addDropdown.select.clear();
        for (const cart of carts) this.addDropdown.select.addEntry(element({
            tag: "button", classes: "item-cart-option", text: cart.name, "data-cart": cart.dataId
        }));

        gradum(this.addDropdown).toggleClass("disabled", carts.length === 0);
    }

    @effect protected showDropdown() {
        gradum(this.addDropdown).show(this.showAddButton);
    }

    @effect protected showRecipeStuff() {
        gradum(this.recipeRow).show(this.showRecipe);
    }

    @effect protected updateCartAmount() {
        this.showAmount(this.cartAmountInput, this.model.cartAmount);
    }

    @effect protected updateRecipeAmount() {
        this.showAmount(this.recipeAmountInput, this.model.recipeAmount);
        this.recipeUnit.textContent = this.model.unit;
    }

    @effect protected updateSubtotal() {
        this.subtotal.textContent = formatPrice(this.model.cartCost);
    }

    /**
     * @description Hand the amount on the card to the cart that was chosen. Choosing is also what picks the
     * cart, so the card goes on pointing at the one it was last added to.
     * @param {Cart} cart - The cart chosen from the dropdown.
     * @protected
     */
    protected addTo(cart: Cart) {
        if (!cart) return;
        this.model.cart = cart;
        //Asked of the cart rather than of the card: taking something in is the cart's own business, and
        //whether it will is the cart's own decision.
        cart.addItem(this.element, this.model.cartAmount);
    }

    /**
     * @description Show an amount in one of the fields, unless it is already showing it.
     *
     * The field is read without subscribing to it, so that a card only ever writes into a field because the
     * model changed — never because the field did. A field someone has just cleared is left cleared: it
     * reads as zero, and writing that zero back mid-keystroke is what makes a field impossible to type in.
     * @param {GradumNumericalInput} input - The field to write into.
     * @param {number} amount - The amount it should be showing.
     * @protected
     */
    protected showAmount(input: GradumNumericalInput, amount: number) {
        untrack(() => {
            const shown = input.value;
            if (Number.isNaN(shown) && amount === 0) return;
            if (shown === amount) return;
            input.value = amount;
        });
    }
}
