import {
    DefaultEventName, div, effect, element, GradumButton, GradumNumericalInput, GradumView, gradum, img,
    span, untrack
} from "../../../../build/gradum-kit.esm";
import {Item} from "./item";
import {ItemModel} from "./item.model";

//Money the way a shop writes it. One currency, since a demo has no reason to carry a second.
const formatPrice = (value: number) => `$${(value ?? 0).toFixed(2)}`;

/**
 * @class ItemView
 *
 * @extends GradumView
 * @description The card itself: the item's picture, name and unit price, then the row that puts an amount
 * of it in a cart, and the row that says how much of it a recipe uses.
 */
export class ItemView extends GradumView<Item, ItemModel> {
    protected picture: HTMLImageElement;
    protected title: HTMLElement;
    protected price: HTMLElement;

    protected cartPicker: HTMLSelectElement;
    protected cartAmountInput: GradumNumericalInput;
    protected addButton: GradumButton;
    protected subtotal: HTMLElement;

    protected recipeAmountInput: GradumNumericalInput;
    protected recipeUnit: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();

        this.picture = img({classes: "item-picture"});
        this.title = span({classes: "item-title"});
        this.price = span({classes: "item-price"});

        this.cartPicker = element({tag: "select", classes: "item-cart-picker"});
        this.cartAmountInput = this.createAmountInput();
        this.addButton = GradumButton.create({classes: "item-add", text: "Add"});
        this.subtotal = span({classes: "item-subtotal"});

        this.recipeAmountInput = this.createAmountInput();
        this.recipeUnit = span({classes: "item-unit"});
    }

    protected setupUILayout() {
        super.setupUILayout();

        gradum(this).addChild([
            this.picture,
            div({classes: "item-heading", children: [this.title, this.price]}),
            div({
                classes: ["item-row", "item-cart-row"],
                children: [
                    span({classes: "item-label", text: "Cart"}),
                    this.cartPicker, this.cartAmountInput, this.addButton, this.subtotal
                ]
            }),
            div({
                classes: ["item-row", "item-recipe-row"],
                children: [
                    span({classes: "item-label", text: "Recipe"}),
                    this.recipeAmountInput, this.recipeUnit
                ]
            })
        ]);
    }

    protected setupUIListeners() {
        super.setupUIListeners();

        //Carts are picked by their place in the list rather than by name, so two carts called the same
        //thing are still told apart.
        gradum(this.cartPicker).on(DefaultEventName.change, () =>
            this.model.cart = this.model.carts?.[Number(this.cartPicker.value)]);

        //An empty field reads back as NaN, which the model turns into zero along with anything negative.
        this.cartAmountInput.onInput.add(() => this.model.cartAmount = this.cartAmountInput.value);
        this.recipeAmountInput.onInput.add(() => this.model.recipeAmount = this.recipeAmountInput.value);

        gradum(this.addButton).on(DefaultEventName.click, () => this.element.addToCart());
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
     * @description Rebuild the cart picker and mark the picked cart. Both are done together rather than in
     * an effect each, because rebuilding the options drops whatever was picked — so the two have to happen
     * in that order, which only holds inside one effect.
     * @protected
     */
    @effect protected updateCarts() {
        const carts = this.model.carts ?? [];
        this.cartPicker.replaceChildren(...carts.map((cart, index) =>
            element({tag: "option", text: cart.name, value: String(index)})));

        const picked = carts.indexOf(this.model.cart);
        this.cartPicker.value = picked < 0 ? "" : String(picked);
        //There is nothing to add to until the item has been given a cart.
        gradum(this.addButton).toggleClass("disabled", picked < 0);
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
     * @description Build one of the card's two amount fields. Both accept the same thing — some number of
     * units, never negative — and differ only in what is done with what they hold.
     * @returns {GradumNumericalInput} The field, not yet attached to anything.
     * @protected
     */
    protected createAmountInput(): GradumNumericalInput {
        return GradumNumericalInput.create({classes: "item-amount", min: 0, decimalPlaces: 2});
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
            //An empty field reads as NaN. Someone has just cleared it to type a new number, and writing the
            //zero the model made of that straight back over them is what makes a field impossible to type in.
            if (Number.isNaN(shown) && amount === 0) return;
            if (shown === amount) return;
            input.value = amount;
        });
    }
}
