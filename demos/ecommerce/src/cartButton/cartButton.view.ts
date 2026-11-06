import {
    DefaultEventName, div, effect, element, GradumIcon, GradumPopup, GradumView, gradum, signal, span
} from "../../../../build/gradum-kit.esm";
import type {CartButton} from "./cartButton";
import {CartButtonChoice} from "./cartButton.types";

/**
 * @class CartButtonView
 *
 * @extends GradumView
 * @description The button's two faces. With nothing in yet, a pill saying "+ Cart"; with something in, a
 * stepper — a button to take one out, the count, and a button to put one more in. The take-out button is a
 * bin while there is only one left, since taking that one out empties it.
 *
 * Where there is more than one place to add to, the add face asks which first, from a popup hung off it.
 */
export class CartButtonView extends GradumView<CartButton> {
    @signal public count: number = 0;
    @signal public label: string = "Cart";
    @signal public choices: CartButtonChoice[] = [];
    @signal public disabled: boolean = false;

    public addFace: HTMLElement;
    protected addLabel: HTMLElement;

    protected stepper: HTMLElement;
    protected decrementButton: HTMLElement;
    protected decrementIcon: GradumIcon;
    protected countLabel: HTMLElement;
    protected incrementButton: HTMLElement;

    /**
     * @description Where the choices are offered. Parked in the shared popup container rather than kept in
     * the button, so the button takes it away itself when it goes — see {@link CartButton.destroy}.
     */
    public popup: GradumPopup;
    protected popupOpen: boolean = false;

    protected setupUIElements() {
        super.setupUIElements();

        this.addLabel = span({classes: "cart-button-label"});
        this.addFace = element({
            tag: "button", classes: "cart-button-add",
            children: [GradumIcon.create({icon: "plus", classes: "cart-button-icon"}), this.addLabel]
        });

        this.decrementIcon = GradumIcon.create({icon: "minus"});
        this.decrementButton = element({
            tag: "button", classes: "cart-button-step", children: this.decrementIcon
        });
        this.countLabel = span({classes: "cart-button-count"});
        this.incrementButton = element({
            tag: "button", classes: "cart-button-step", title: "One more",
            children: GradumIcon.create({icon: "plus"})
        });
        this.stepper = div({
            classes: "cart-button-stepper",
            children: [this.decrementButton, this.countLabel, this.incrementButton]
        });

        this.popup = GradumPopup.create({anchor: this.addFace, classes: "cart-button-popup"});
        this.popup.show(false);
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([this.addFace, this.stepper]);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this.addFace).on(DefaultEventName.click, () => {
            if (this.choices.length > 1) return this.openPopup(!this.popupOpen);
            this.element.onAdd.fire(this.choices[0]?.value);
        });
        gradum(this.incrementButton).on(DefaultEventName.click, () => this.element.onIncrement.fire());
        gradum(this.decrementButton).on(DefaultEventName.click, () => this.element.onDecrement.fire());

        //Anywhere else closes it, as a dropdown's would.
        gradum(document.body).on(DefaultEventName.click, event => {
            const target = event.target as Node;
            if (this.popupOpen && !this.popup.contains(target) && !this.addFace.contains(target)) this.openPopup(false);
        }, {capture: true});
    }

    protected openPopup(open: boolean) {
        this.popupOpen = open;
        this.popup.show(open);
    }

    @effect protected updateLabel() {
        this.addLabel.textContent = this.label;
    }

    @effect protected updateCount() {
        const count = this.count;
        const empty = !(count > 0);
        gradum(this).toggleClass("filled", !empty);
        this.countLabel.textContent = String(count);
        //The last one out empties it, so it says so.
        this.decrementIcon.icon = count === 1 ? "trash" : "minus";
        this.decrementButton.title = count === 1 ? "Remove" : "One less";
        if (!empty) this.openPopup(false);
    }

    @effect protected updateChoices() {
        this.popup.replaceChildren(...this.choices.map(choice => {
            const option = element({tag: "button", classes: "cart-button-choice", text: choice.label});
            gradum(option).on(DefaultEventName.click, () => {
                this.openPopup(false);
                this.element.onAdd.fire(choice.value);
            });
            return option;
        }));
    }

    @effect protected updateDisabled() {
        gradum(this).toggleClass("disabled", this.disabled);
    }
}
