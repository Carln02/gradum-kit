import {
    CloneElementOptions, define, effect, expose, signal, gradum, Color, GradumRect, Point, Anchor
} from "../../../../build/gradum-kit.esm";
import {ItemModel} from "./item.model";
import {ItemView} from "./item.view";
import {ItemData, ItemProperties} from "./item.types";
import {Cart} from "../cart/cart";
import {ProductDescription} from "../catalogue/catalogue.types";
import "./item.css";
import {Square} from "../square/square";

/**
 * @class Item
 *
 * @extends Square
 * @description A product, as a card: its picture, name and price, and a button to put it in a cart and see
 * how much of it is in there. The button adds to whichever cart was last picked. Expanded, the same card
 * shows everything else about the product as well — see {@link expanded}.
 */
export class Item extends Square<ItemView, ItemData, ItemModel> {
    public declare properties: ItemProperties;
    public static defaultProperties = {
        view: ItemView,
        model: ItemModel,
    };

    @signal public color: Color = Color.from("#FFFFFF");
    //Held by its top-left, so a card that grows — expanded — grows down the canvas rather than both ways.
    @signal public anchor: Anchor | Point = Anchor.TopLeft;

    @expose("model") public name: string;
    @expose("model") public price: number;
    @expose("model") public images: string[];
    @expose("model") public categories: string[];
    @expose("model") public description: ProductDescription;
    @expose("model") public cart: Cart;

    /**
     * @description Whether the item is laid out by whatever it is in — a list — rather than placing itself.
     */
    @signal public fixed: boolean = false;

    @expose("view") public showAddButton: boolean;

    /**
     * @description Whether the card shows everything about the product — its pictures, where it is filed,
     * its description and measurements — rather than only its name and price. What the card's Info button
     * toggles.
     */
    @expose("view") public expanded: boolean;


    @expose("model", false) public image: string;

    /**
     * @description Keeps the card's size in step with its contents. A card is as big as what it shows — its
     * width is the stylesheet's and its height its contents' — so a card placing itself measures itself
     * rather than being sized, and expanding it grows its box with it.
     * @protected
     */
    protected contentObserver: ResizeObserver;

    public initialize() {
        if (this.initialized) return;
        super.initialize();
        this.contentObserver = new ResizeObserver(() => {
            if (this.fixed) return;
            this.size = new Point(this.offsetWidth, this.offsetHeight);
        });
        this.contentObserver.observe(this);
    }

    /**
     * @description How the card is taken hold of, which follows from whether it places itself. A card with a
     * position of its own is dragged where it stands; one laid out by whatever it is in — a list — is
     * dragged and dropped instead, since moving it in place would mean nothing.
     */
    @effect protected isModifiable() {
        gradum(this).metadata.set(!this.fixed, "modifiable");
        gradum(this).metadata.set(!!this.fixed, "dragAndDroppable");
    }

    /**
     * @function clone
     * @description A second card for the same item. What a catalogue hands over when one of its cards is
     * dragged out: the catalogue's own card is a template and stays where it is.
     *
     * Give it the parent it is going to rather than adding it afterwards — a card works out what it can be
     * added to from where it is, and it works that out as it is built.
     * @param {CloneElementOptions} [options] - Where the new card goes, under `parent`.
     * @returns {Item} The new card.
     */
    public clone(options: CloneElementOptions & {parent?: Element} = {}): this {
        return Item.create({
            parent: options.parent,
            data: {...this.data},
            cart: this.cart,
        }) as this;
    }

    /**
     * @function delete
     * @description Get rid of the card, and the add dropdown's popup with it. What the delete tool calls. Use
     * it over `remove()`: the popup is parked outside the card, so removing the card alone would leave it
     * behind.
     */
    public delete() {
        gradum(this).destroy();
    }

    /**
     * @description Where the card is. A card in a list is wherever the list put it, which only the page
     * knows; a card placing itself is where its position says.
     * @returns {GradumRect} The card's box.
     */
    public getBoundingClientRect(): GradumRect {
        if (!this.fixed) return super.getBoundingClientRect();
        const rect = HTMLElement.prototype.getBoundingClientRect.call(this);
        return new GradumRect({x: rect.x, y: rect.y, width: rect.width, height: rect.height});
    }

    @effect protected updatePosition() {
        gradum(this).toggleClass("placed", !this.fixed);
        gradum(this).setStyle("position", this.fixed ? "relative" : "absolute");
        //Through the same queue as the square's own writes rather than instantly, so a transform the square
        //queued while the card was still placing itself cannot land after this and put it back.
        if (this.fixed) gradum(this).setStyle("transform", "");
        else return super.updatePosition();
    }

    /**
     * @description Leave the card at the size of its contents rather than of {@link Square.size} — see
     * {@link Item.contentObserver}, which goes the other way.
     * @protected
     */
    @effect protected updateSize() {
        gradum(this).setStyles({width: this.fixed ? "auto" : "", height: ""});
    }
}

define(Item, "demo-item");
