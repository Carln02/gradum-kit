import {Color, GradumElementProperties, Point} from "../../../../build/gradum-kit.esm";
import {CollectionView} from "./collection.view";

/**
 * @description Properties to create a {@link Collection}.
 * @property {string} [name] - What the collection is called. Defaults to the next free name of its kind.
 * @property {Color} [color] - The colour of the area. Defaults to a random pale one.
 * @property {Point} [position] - The top-left corner of the area, in canvas coordinates.
 * @property {Point} [size] - How big the area is.
 * @property {boolean} [locked=false] - Whether the collection is closed to changes. A locked collection
 * cannot be moved, and takes nothing in.
 * @property {boolean} [catalogue=false] - Whether the collection is stocked with every product on offer, its
 * cards templates that are copied rather than moved when dragged out.
 */
export type CollectionProperties = GradumElementProperties<CollectionView> & {
    name?: string,
    color?: Color,
    position?: Point,
    size?: Point,
    locked?: boolean,
    catalogue?: boolean,
};
