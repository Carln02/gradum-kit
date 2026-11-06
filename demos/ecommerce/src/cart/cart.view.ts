import {DefaultEventName, effect, element, GradumIcon, gradum} from "../../../../build/gradum-kit.esm";
import type {Cart} from "./cart";
import {CartModel} from "./cart.model";
import {CollectionView} from "../collection/collection.view";

/**
 * @class CartView
 *
 * @extends CollectionView
 * @description A collection's panel, with a round button for adding to the cart at the end of its strip.
 */
export class CartView extends CollectionView<Cart, CartModel> {
    protected addButton: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();
        this.addButton = element({
            tag: "button", classes: ["collection-button", "cart-add"], title: "Add",
            children: GradumIcon.create({icon: "plus"})
        });
        this.header.appendChild(this.addButton);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        //What it does is for later; it says so rather than doing nothing silently.
        gradum(this.addButton).on(DefaultEventName.click, () => this.element.onAddClicked.fire(this.element));
    }

    @effect protected updateAddButton() {
        gradum(this.addButton).toggleClass("disabled", this.model.locked);
    }
}
