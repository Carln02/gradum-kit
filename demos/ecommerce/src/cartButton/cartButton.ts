import {Delegate, define, expose, gradum, GradumElement} from "../../../../build/gradum-kit.esm";
import {CartButtonView} from "./cartButton.view";
import {CartButtonChoice, CartButtonProperties} from "./cartButton.types";
import "./cartButton.css";

/**
 * @class CartButton
 *
 * @extends GradumElement
 * @description A button for putting something in a cart and seeing how much of it is in there. It only
 * shows a count and says what was pressed — what adding and taking out mean is up to whoever listens.
 *
 * @example
 * ```ts
 * const button = CartButton.create({choices: [{label: "Groceries", value: "cart-1"}]});
 * button.onAdd.add(value => button.count++);
 * button.onDecrement.add(() => button.count--);
 * ```
 */
export class CartButton extends GradumElement<CartButtonView> {
    public declare properties: CartButtonProperties;
    public static defaultProperties: CartButtonProperties = {
        view: CartButtonView,
    };

    @expose("view") public count: number;
    @expose("view") public label: string;
    @expose("view") public choices: CartButtonChoice[];
    @expose("view") public disabled: boolean;

    /**
     * @readonly
     * @description Fired when the add face is pressed — or, when there is more than one choice, when one is
     * picked from its popup. Handed the choice's value, if there is one.
     */
    public readonly onAdd: Delegate<(value?: string) => void> = new Delegate();

    /**
     * @readonly
     * @description Fired when the stepper's plus is pressed.
     */
    public readonly onIncrement: Delegate<() => void> = new Delegate();

    /**
     * @readonly
     * @description Fired when the stepper's minus — or bin, with one left — is pressed.
     */
    public readonly onDecrement: Delegate<() => void> = new Delegate();

    /**
     * @function destroy
     * @description Take the popup away with the button. What `gradum(...).destroy()` calls on a subtree
     * holding one, since the popup lives outside it.
     */
    public destroy(): this {
        gradum(this.view.popup).destroy();
        return this;
    }
}

define(CartButton, "demo-cart-button");
