import {GradumElementProperties, Point} from "../../../../build/gradum-kit.esm";
import {CartView} from "./cart.view";

/**
 * @description Properties to create a {@link Cart}.
 * @property {string} [name] - What the cart is called, shown on it and in an item's add dropdown.
 * @property {string} [color] - The colour of the area. Defaults to a random pale one.
 * @property {Point} [position] - The top-left corner of the area, in page coordinates.
 * @property {Point} [size] - How big the area is.
 * @property {boolean} [locked=false] - Whether the cart is closed to changes. A locked cart cannot be moved,
 * and neither takes in nor lets go of the items lying on it.
 */
export type CartProperties = GradumElementProperties<CartView> & {
    name?: string,
    color?: string,
    position?: Point,
    size?: Point,
    locked?: boolean,
};
