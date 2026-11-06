import {
    DefaultEventName, div, effect, element, GradumIcon, GradumView, gradum, img, signal, span
} from "../../../../build/gradum-kit.esm";
import {Item} from "./item";
import {ItemModel} from "./item.model";
import {formatPrice} from "../utils";
import {Carousel} from "../carousel/carousel";
import {CartButton} from "../cartButton/cartButton";
import type {Canvas} from "../canvas/canvas";
import type {Cart} from "../cart/cart";

//How many words of the description show before "Read more".
const PreviewWords = 50;

/**
 * @class ItemView
 *
 * @extends GradumView
 * @description The card itself. Collapsed, the product's picture beside its name, price, and the buttons to
 * put it in a cart and to open it. Expanded, the card reads down instead: the name in full, where it is
 * filed, the price, its pictures in a carousel, its description and a table of its measurements, with the
 * same buttons at the end.
 *
 * Every part is a child of the card and the stylesheet lays them out for either state, so expanding moves
 * nothing between parents. What only the expanded card shows is only drawn while it is expanded — a
 * catalogue holds a hundred cards, and most are never opened.
 */
export class ItemView extends GradumView<Item, ItemModel> {
    @signal public showAddButton: boolean = true;

    /**
     * @description Whether the card shows everything about the product rather than only its name and price.
     */
    @signal public expanded: boolean = false;

    /**
     * @description Whether the description is shown in full rather than cut short.
     */
    @signal public fullText: boolean = false;

    protected picture: HTMLImageElement;
    protected title: HTMLElement;
    protected price: HTMLElement;
    protected breadcrumb: HTMLElement;

    protected carousel: Carousel;

    protected description: HTMLElement;
    protected textBody: HTMLElement;
    protected text: HTMLElement;
    protected highlights: HTMLElement;
    protected moreButton: HTMLElement;

    protected propertiesTable: HTMLElement;

    protected actions: HTMLElement;
    protected cartButton: CartButton;
    protected infoButton: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();

        this.picture = img({classes: "item-picture"});
        this.title = span({classes: "item-title"});
        this.price = span({classes: "item-price"});
        this.breadcrumb = div({classes: ["item-breadcrumb", "item-detail"]});

        this.carousel = Carousel.create({classes: ["item-carousel", "item-detail"]});

        this.textBody = span();
        this.text = element({tag: "p", classes: "item-text", children: this.textBody});
        this.highlights = element({tag: "ul", classes: "item-highlights"});
        this.moreButton = element({tag: "button", classes: "item-more"});
        this.description = div({
            classes: ["item-description", "item-detail"],
            children: [this.text, this.highlights, this.moreButton]
        });

        this.propertiesTable = div({classes: ["item-properties", "item-detail"]});

        this.cartButton = CartButton.create();
        this.infoButton = element({
            tag: "button", classes: ["item-info", "pill-button"],
            children: [GradumIcon.create({icon: "chevron-bottom"}), span({text: "Info"})]
        });
        this.actions = div({classes: "item-actions", children: [this.cartButton, this.infoButton]});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([
            this.picture, this.title, this.breadcrumb, this.price, this.carousel,
            this.description, this.propertiesTable, this.actions
        ]);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this.infoButton).on(DefaultEventName.click, () => this.expanded = !this.expanded);
        gradum(this.moreButton).on(DefaultEventName.click, () => this.fullText = !this.fullText);

        this.cartButton.onAdd.add(value => {
            const cart = this.canvas?.getCart(value) ?? this.cart;
            if (!cart) return;
            //Picking a cart is also what the card goes on adding to.
            this.model.cart = cart;
            cart.addItem(this.element, 1);
        });
        this.cartButton.onIncrement.add(() => this.cart?.addItem(this.element, 1));
        this.cartButton.onDecrement.add(() => {
            const cart = this.cart;
            cart?.setAmount(this.element, cart.howMuchOf(this.element) - 1);
        });
    }

    /**
     * @readonly
     * @description The canvas the card is on, which is what knows the carts. Looked up by its tag rather than
     * its class, so the card does not have to import the canvas — which imports the card.
     * @protected
     */
    protected get canvas(): Canvas {
        return gradum(this).closest("my-canvas") as Canvas;
    }

    /**
     * @readonly
     * @description The cart the card's button adds to: the one last picked, while it is still on the canvas,
     * or the only one there is. With several and none picked yet, there is none until one is.
     * @protected
     */
    protected get cart(): Cart {
        const carts = this.canvas?.carts ?? [];
        const picked = this.model.cart;
        if (picked && carts.includes(picked)) return picked;
        return carts.length === 1 ? carts[0] : undefined;
    }

    @effect protected updateExpanded() {
        //The parts are laid out and hidden by the stylesheet rather than here, so a collapsed card takes no
        //room for what it does not show.
        gradum(this).toggleClass("expanded", this.expanded);
    }

    @effect protected updatePicture() {
        const image = this.model.image;
        gradum(this.picture).toggleClass("item-hidden", !image);
        if (image) this.picture.src = image;
        this.picture.alt = this.model.name;
    }

    @effect protected updateTitle() {
        this.title.textContent = this.model.name;
        this.title.title = this.model.name;
    }

    @effect protected updatePrice() {
        this.price.textContent = formatPrice(this.model.price);
    }

    /**
     * @description Point the cart button at the cart the card adds to, and show how much of the product is
     * in it. With no cart picked yet, adding asks which of them.
     * @protected
     */
    @effect protected updateCartButton() {
        const carts = this.canvas?.carts ?? [];
        const cart = this.cart;

        this.cartButton.count = cart?.howMuchOf(this.element) ?? 0;
        this.cartButton.choices = (cart ? [cart] : carts).map(entry => ({label: entry.name, value: entry.dataId}));
        this.cartButton.disabled = carts.length === 0 || !!cart?.locked;
        gradum(this.cartButton).toggleClass("item-hidden", !this.showAddButton);
    }

    @effect protected updateBreadcrumb() {
        if (!this.expanded) return;
        const categories = this.model.categories ?? [];
        this.breadcrumb.replaceChildren(...categories.map(category => span({classes: "item-chip", text: category})));
        gradum(this.breadcrumb).toggleClass("item-hidden", categories.length === 0);
    }

    @effect protected updateCarousel() {
        if (!this.expanded) return;
        const images = this.model.images ?? [];
        this.carousel.images = images;
        this.carousel.alt = this.model.name;
        gradum(this.carousel).toggleClass("item-hidden", images.length === 0);
    }

    /**
     * @description The description's text in full: the product's own, or its selling points run together
     * when it has none — in which case, in full, the list says it all and the text is left empty.
     */
    protected get descriptionText(): string {
        const description = this.model.description;
        if (description?.text) return description.text;
        return this.fullText ? "" : (description?.highlights ?? []).join(" ");
    }

    /**
     * @description Fill in the description. Cut short, it is the first {@link PreviewWords} words with
     * "Read more" straight after the last one. In full, the text, the selling points as a list, and
     * "Read less" under them. With nothing more to show, there is no button.
     * @protected
     */
    @effect protected updateDescription() {
        if (!this.expanded) return;
        const highlights = this.model.description?.highlights ?? [];
        this.highlights.replaceChildren(...highlights.map(highlight => element({tag: "li", text: highlight})));
        gradum(this.description).toggleClass("item-hidden", !this.model.description?.text && highlights.length === 0);

        const fullText = this.fullText;
        const text = this.descriptionText;
        const words = text.split(/\s+/).filter(Boolean);
        const cut = !fullText && words.length > PreviewWords;

        gradum(this.description).toggleClass("full", fullText);
        this.moreButton.textContent = fullText ? "Read less" : "Read more";
        gradum(this.moreButton).toggleClass("item-hidden", !cut && !fullText && highlights.length === 0);
        //Inline at the end of the text while it is cut, under the list once it is not.
        if (fullText) this.description.appendChild(this.moreButton);
        else this.text.appendChild(this.moreButton);

        this.textBody.textContent = cut ? words.slice(0, PreviewWords).join(" ") + "… " : text + " ";
    }

    /**
     * @description Rebuild the table of measurements, each under its label and with its unit. Reads the
     * units through the catalogue, so the table is drawn again once the units file has been read. A card off
     * any canvas has no catalogue, and shows the numbers bare.
     * @protected
     */
    @effect protected updateProperties() {
        if (!this.expanded) return;
        const properties = this.model.properties ?? {};
        const catalogue = this.canvas?.catalogue;
        const keys = catalogue?.model.unitsHandler.order(properties) ?? Object.keys(properties);

        this.propertiesTable.replaceChildren(...keys.map(key => div({
            classes: "item-property",
            children: [
                span({classes: "item-property-name", text: catalogue?.label(key) ?? key}),
                span({
                    classes: "item-property-value",
                    text: catalogue?.format(key, properties[key]) ?? String(properties[key])
                }),
            ]
        })));
        gradum(this.propertiesTable).toggleClass("item-hidden", keys.length === 0);
    }
}
