import {
    DefaultEventName, div, effect, element, GradumIcon, GradumView, gradum, span
} from "../../../../build/gradum-kit.esm";
import type {Collection} from "./collection";
import {CollectionModel} from "./collection.model";
import {LockTool} from "../tools/lock.tool";

/**
 * @class CollectionView
 *
 * @extends GradumView
 * @description The area itself: a panel on the canvas with a strip along the top carrying the collection's
 * name, how much it holds, and its lock — and, for a catalogue, a pager floating at the bottom. The items it holds are its own children, after the
 * strip, laid out by whichever layout operator it has.
 *
 * Where the area is and how big it is are drawn by the square it is, not here.
 */
export class CollectionView<
    Element extends Collection<any, any> = Collection<any, any>,
    Model extends CollectionModel = CollectionModel
> extends GradumView<Element, Model> {
    /**
     * @description The strip along the top. Public because the fit operators measure around it to work out
     * how much room the items have.
     */
    public header: HTMLElement;

    /**
     * @description The strip along the bottom, with the pager. Public for the same reason as the header.
     */
    public footer: HTMLElement;

    protected title: HTMLElement;
    protected count: HTMLElement;
    protected lockButton: HTMLElement;
    protected lockIcon: GradumIcon;

    protected previousButton: HTMLElement;
    protected nextButton: HTMLElement;
    protected pageLabel: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();

        this.title = span({classes: "collection-name"});
        this.count = span({classes: "collection-count"});
        this.lockIcon = GradumIcon.create({icon: "unlock"});
        this.lockButton = element({
            tag: "button", classes: ["collection-button", "collection-lock"], children: this.lockIcon
        });
        this.header = div({
            classes: ["collection-header", "floating-bar"],
            children: [this.title, this.count, this.lockButton]
        });

        this.previousButton = element({
            tag: "button", classes: ["collection-page-button", "pill-button"],
            children: [GradumIcon.create({icon: "chevron-left"}), span({text: "Previous"})]
        });
        this.nextButton = element({
            tag: "button", classes: ["collection-page-button", "pill-button"],
            children: [span({text: "Next"}), GradumIcon.create({icon: "chevron-right"})]
        });
        this.pageLabel = span({classes: "collection-page"});
        this.footer = div({
            classes: ["collection-footer", "floating-bar"],
            children: [this.previousButton, this.pageLabel, this.nextButton]
        });
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([this.header, this.footer]);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        //The lock button is the lock tool, embedded: clicking it uses the tool on this collection. It never
        //becomes the tool in hand, so clicking it leaves the toolbar's choice alone.
        new LockTool({element: this.lockButton, embeddedTarget: this.element, customActivation: () => {}})
            .initialize();
        gradum(this.previousButton).on(DefaultEventName.click, () => this.element.turnPage(-1));
        gradum(this.nextButton).on(DefaultEventName.click, () => this.element.turnPage(1));
    }

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        //Whether the contents fit is the fit operator's to work out and the view's to show. Told rather
        //than measured, so the view never has to know which operator is in and how it decided.
        this.emitter.add("overflowed", () => gradum(this).toggleClass("collection-full", true));
        this.emitter.add("fits", () => gradum(this).toggleClass("collection-full", false));
    }

    @effect protected updateName() {
        this.title.textContent = this.model.name;
    }

    /**
     * @description Say how much the collection holds. A catalogue only holds a page of cards at a time, so it
     * counts what it has to show across all its pages instead; anything else says how many of its cards its
     * filters are hiding, if any.
     * @protected
     */
    @effect protected updateCount() {
        const held = this.model.items?.length ?? 0, shown = this.model.total;
        const count = this.model.catalogue ? shown : held;
        const text = count === 1 ? "1 item" : `${count} items`;
        this.count.textContent = !this.model.catalogue && shown < held ? `${shown} of ${text}` : text;
    }

    /**
     * @description Show which of a catalogue's products are on the page — "21–40 of 100" — and let the pager
     * go only where there is somewhere to go. Only a catalogue has pages, and one that fits on a single page
     * has no need of a pager.
     * @protected
     */
    @effect protected updatePager() {
        const total = this.model.total, size = this.model.pageSize, page = this.model.page;
        const pages = Math.max(1, Math.ceil(total / size));
        gradum(this.footer).toggleClass("hidden", !this.model.catalogue || pages <= 1);

        const first = total === 0 ? 0 : page * size + 1;
        this.pageLabel.textContent = `${first} – ${Math.min(total, (page + 1) * size)} of ${total}`;
        gradum(this.previousButton).toggleClass("disabled", page <= 0);
        gradum(this.nextButton).toggleClass("disabled", page >= pages - 1);
    }

    @effect protected updateLocked() {
        const locked = this.model.locked;
        this.lockIcon.icon = locked ? "lock" : "unlock";
        this.lockButton.title = locked ? "Unlock" : "Lock";
        gradum(this).toggleClass("locked", locked);
    }

    @effect protected updateCatalogue() {
        gradum(this).toggleClass("catalogue", this.model.catalogue);
    }
}
