import {
    DefaultEventName, div, effect, element, GradumInput, GradumView, gradum, span, untrack
} from "../../../../build/gradum-kit.esm";
import {Item} from "../item/item";
import {Shelf} from "./shelf";
import {ShelfModel} from "./shelf.model";
import {ShelfEntry} from "./shelf.types";

/**
 * @description Draw an item's picture from an emoji on a tinted square, so the shelf needs no image files.
 * @param {string} emoji - The emoji to draw.
 * @param {string} [tint="#eef2f7"] - The colour behind it.
 * @returns {string} A data URI to use as a picture source.
 */
const drawPicture = (emoji: string, tint: string = "#eef2f7") => "data:image/svg+xml;utf8,"
    + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">`
        + `<rect width="120" height="120" fill="${tint}"/>`
        + `<text x="60" y="84" font-size="58" text-anchor="middle">${emoji}</text></svg>`);

/**
 * @class ShelfView
 *
 * @extends GradumView
 * @description The panel itself: a search field and a row of category tabs above a scrolling list of items.
 *
 * The items are built once from what the shelf was given and then only shown or hidden as the search and
 * tabs change, so typing filters a list that is already there rather than building a new one per keystroke.
 */
export class ShelfView extends GradumView<Shelf, ShelfModel> {
    protected searchInput: GradumInput;
    protected tabs: HTMLElement;
    protected list: HTMLElement;
    protected empty: HTMLElement;

    /**
     * @description The card built for each item, so an item can be shown or hidden without rebuilding it.
     */
    protected cards: Map<ShelfEntry, Item> = new Map();

    protected setupUIElements() {
        super.setupUIElements();

        this.searchInput = GradumInput.create({
            classes: "shelf-search",
            input: {type: "search", placeholder: "Search products"}
        });
        this.tabs = div({classes: "shelf-tabs"});
        this.list = div({classes: "shelf-list"});
        this.empty = span({classes: "shelf-empty", text: "Nothing matches"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([
            div({classes: "shelf-header", children: [this.searchInput, this.tabs]}),
            this.list,
            this.empty
        ]);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        this.searchInput.onInput.add(() => this.model.search = String(this.searchInput.value ?? ""));
    }

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        //Which items answer the search is the filter operator's to work out and the view's to show. Told
        //rather than asked, so the view never has to know which operator is in and how it decided.
        this.emitter.add("filtered", (matches: Set<ShelfEntry>) => this.showOnly(matches));
    }

    /**
     * @description Rebuild the category tabs and mark the one the shelf is on. Both together rather than in
     * an effect each: rebuilding the tabs drops the mark, so the two have to happen in that order.
     * @protected
     */
    @effect protected updateTabs() {
        const current = this.model.category;

        this.tabs.replaceChildren(...this.model.categories.map(category => {
            const tab = element({tag: "button", classes: "shelf-tab", text: category});
            gradum(tab).toggleClass("selected", category === current);
            gradum(tab).on(DefaultEventName.click, () => this.model.category = category);
            return tab;
        }));
    }

    /**
     * @description Build a card for each item the shelf knows about, replacing whatever was there before.
     * Only runs when the items themselves change, not when the search does.
     * @protected
     */
    @effect protected updateCards() {
        const items = this.model.items ?? [];

        //Deleted rather than removed: a card's add dropdown keeps its popup outside the card. Left to
        //`remove()`, every rebuild would strand another popup in the shared container.
        this.cards.forEach(card => card.delete());
        this.cards.clear();

        for (const entry of items) {
            const {category, emoji, tint, ...data} = entry;
            const card = Item.create({
                parent: this.list,
                data: {...data, image: entry.image ?? (emoji ? drawPicture(emoji, tint) : "")}
            });
            //Marked as the shelf's own, so dragging one onto the canvas leaves it on the shelf and puts a
            //copy down instead of emptying the shelf a card at a time.
            gradum(card).metadata.set(true, "catalogue");
            this.cards.set(entry, card);
        }

        //The settings and the filter still apply to the cards just built, but reading either here would
        //have this effect rebuild every card whenever one changed — the one thing it exists to avoid. The
        //operator is asked outright rather than waited on: it has its own pass coming, but these cards are
        //on the page now and would show through unfiltered until it arrived.
        untrack(() => {
            this.applyCardSettings();
            this.showOnly(this.element.filterOperator.matches());
        });
    }

    @effect protected updateCardSettings() {
        //Read outright, so that this effect is the one that follows it rather than the rebuild.
        this.model.showRecipe;
        this.applyCardSettings();
    }

    /**
     * @description Tell every card whether it shows recipe amounts. Set on the cards that are there rather
     * than by building new ones.
     * @protected
     */
    protected applyCardSettings() {
        this.cards.forEach(card => card.showRecipe = this.model.showRecipe);
    }

    /**
     * @description Show these items and hide the rest. Says as much when that leaves nothing, rather than
     * showing an empty panel.
     * @param {Set<ShelfEntry>} matches - The items to show.
     * @protected
     */
    protected showOnly(matches: Set<ShelfEntry>) {
        this.cards.forEach((card, entry) => gradum(card).toggleClass("shelf-hidden", !matches.has(entry)));
        gradum(this.empty).toggleClass("shelf-hidden", matches.size > 0);
    }
}
