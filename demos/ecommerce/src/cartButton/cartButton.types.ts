import {GradumElementProperties} from "../../../../build/gradum-kit.esm";
import {CartButtonView} from "./cartButton.view";

/**
 * @description One of the places a cart button can add to, as its popup offers it.
 * @property {string} label - What the popup calls it.
 * @property {string} value - What {@link CartButton.onAdd} is handed when it is picked.
 */
export type CartButtonChoice = {
    label: string,
    value: string,
};

/**
 * @description Properties to create a {@link CartButton}.
 * @property {number} [count=0] - How many are in already. At zero the button offers to add; above it, it
 * offers to take one out or put one more in.
 * @property {string} [label="Cart"] - What the add face says beside its plus.
 * @property {CartButtonChoice[]} [choices] - Where it can add to. With more than one, adding asks which first.
 * @property {boolean} [disabled=false] - Whether the button does nothing.
 */
export type CartButtonProperties = GradumElementProperties<CartButtonView> & {
    count?: number,
    label?: string,
    choices?: CartButtonChoice[],
    disabled?: boolean,
};
