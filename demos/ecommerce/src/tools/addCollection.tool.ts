import {
    behavior, Color, GradumEvent, GradumTool, gradum, Point, Propagation
} from "../../../../build/gradum-kit.esm";
import {Collection} from "../collection/collection";
import {CollectionProperties} from "../collection/collection.types";
import {Cart} from "../cart/cart";
import {Square} from "../square/square";
import {Filter} from "../filter/filter";

/**
 * @description A kind of area the tool can draw — anything with a `create` taking a square's properties: a
 * collection, or a filter. Looser than `typeof Collection`, which a subclass with MVC types of its own does
 * not match, and through which `create` cannot say what it returns — so what it returns is taken as a square.
 */
type AreaKind = {create(properties: CollectionProperties & {parent?: Element}): unknown};

//A drag that ends up smaller than this is taken as a misclick rather than as a collection nobody could use.
const SmallestCollection = 40;

/**
 * @class AddCollectionTool
 *
 * @extends GradumTool
 * @description Drag on the canvas to mark out an area. The rectangle follows the pointer while the drag is
 * under way, so the area is drawn rather than typed in, and a drag too small to be meant is thrown away.
 *
 * Not a tool of its own: what kind of area is drawn, and how it starts out, is up to the subclass — see
 * {@link AddCartTool}, {@link AddCatalogueTool} and {@link AddFilterTool}.
 */
export abstract class AddCollectionTool extends GradumTool {
    /**
     * @description The kind of area drawn.
     */
    protected abstract kind: AreaKind;

    /**
     * @description What every collection drawn starts out with, on top of where it is and how big.
     * @protected
     */
    protected get properties(): CollectionProperties {
        return {};
    }

    /**
     * @description The collection being drawn, and the corner the drag started from. A drag draws one
     * collection, so there is never more than one of either.
     */
    protected drawn: Square;
    protected origin: Point;

    @behavior() public dragStart(e: GradumEvent, target: Node) {
        if (!gradum(target).metadata?.get("substrate")) return Propagation.propagate;

        this.origin = e.position;
        this.drawn = this.kind.create({
            ...this.properties,
            parent: target as Element,
            position: e.position,
            size: new Point()
        }) as Square;
        return Propagation.stopPropagation;
    }

    @behavior() public drag(e: GradumEvent) {
        if (!this.drawn) return Propagation.propagate;
        this.resize(e.position);
        return Propagation.stopPropagation;
    }

    @behavior() public dragEnd(e: GradumEvent) {
        if (!this.drawn) return Propagation.propagate;
        this.resize(e.position);

        //Too small to have been meant: take it away again rather than leave a sliver on the canvas.
        const size = this.drawn.size;
        if (size.x < SmallestCollection || size.y < SmallestCollection) this.drawn.delete();

        this.drawn = undefined;
        this.origin = undefined;
        return Propagation.stopPropagation;
    }

    /**
     * @description Lay the collection between the corner the drag started from and where the pointer is now,
     * so dragging in any direction draws the same rectangle.
     * @param {Point} corner - Where the pointer is.
     * @protected
     */
    protected resize(corner: Point) {
        this.drawn.position = new Point(Math.min(this.origin.x, corner.x), Math.min(this.origin.y, corner.y));
        this.drawn.size = new Point(Math.abs(corner.x - this.origin.x), Math.abs(corner.y - this.origin.y));
    }
}

/**
 * @class AddCartTool
 *
 * @extends AddCollectionTool
 * @description Drag on the canvas to mark out a cart.
 */
export class AddCartTool extends AddCollectionTool {
    public toolName: string = "addCart";
    protected kind: AreaKind = Cart;
}

/**
 * @class AddCatalogueTool
 *
 * @extends AddCollectionTool
 * @description Drag on the canvas to mark out a catalogue: a collection stocked with every product on offer,
 * to shop from.
 */
export class AddCatalogueTool extends AddCollectionTool {
    public toolName: string = "addCatalogue";
    protected kind: AreaKind = Collection;

    protected get properties(): CollectionProperties {
        return {name: "Catalogue", catalogue: true, color: Color.from("#FFFFFFB3")};
    }
}

/**
 * @class AddFilterTool
 *
 * @extends AddCollectionTool
 * @description Drag on the canvas to mark out a filter, then pick the collections it applies to from it.
 */
export class AddFilterTool extends AddCollectionTool {
    public toolName: string = "addFilter";
    protected kind: AreaKind = Filter;
}
