import {
    DefaultEventName, div, effect, element, GradumIcon, GradumView, gradum, signal, span
} from "../../../../build/gradum-kit.esm";
import type {Filter} from "./filter";
import {FilterModel} from "./filter.model";
import {SortKey} from "./filter.types";
import {CatalogueCategoriesHandler, CategorySeparator} from "../catalogue/catalogue.categoriesHandler";

/**
 * @description What the sort keys that are not properties are called in the sort dropdown.
 */
const SortLabels: Record<string, string> = {
    [SortKey.none]: "Featured",
    [SortKey.relevance]: "Relevance",
    [SortKey.name]: "Name",
    [SortKey.price]: "Price",
};

/**
 * @class FilterView
 *
 * @extends GradumView
 * @description The panel itself, top to bottom, like the side of a shop's results page: a header with the
 * filter's switch and a reset, a search field, the sort, a category browser, ranges on numeric properties, and
 * the collections it can apply to.
 *
 * The category browser goes down a level at a time: the categories one level under the one being browsed,
 * each with how many products are filed under it, and a breadcrumb back up. Ticking a category picks it;
 * clicking its name goes into it. What is offered — categories, counts, ranges — is worked out from the
 * products the filter's collections hold, so it only offers what could be found.
 */
export class FilterView extends GradumView<Filter, FilterModel> {
    /**
     * @description The category path being browsed. Empty for the top level.
     */
    @signal public browsing: string = "";

    protected enabledButton: HTMLElement;
    protected resetButton: HTMLElement;

    protected searchInput: HTMLInputElement;

    protected sortSelect: HTMLSelectElement;
    protected directionButton: HTMLElement;

    protected picked: HTMLElement;
    protected breadcrumb: HTMLElement;
    protected categoryList: HTMLElement;

    protected facetList: HTMLElement;
    protected facetSelect: HTMLSelectElement;

    protected targetList: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();

        this.enabledButton = element({tag: "button", classes: "filter-switch"});
        this.resetButton = element({tag: "button", classes: "filter-reset", text: "Reset"});

        this.searchInput = element({tag: "input", classes: "filter-search"}) as HTMLInputElement;
        this.searchInput.type = "search";
        this.searchInput.placeholder = "Search...";

        this.sortSelect = element({tag: "select", classes: "filter-select"}) as HTMLSelectElement;
        this.directionButton = element({tag: "button", classes: "filter-direction"});

        this.picked = div({classes: "filter-picked"});
        this.breadcrumb = div({classes: "filter-breadcrumb"});
        this.categoryList = div({classes: "filter-categories"});

        this.facetList = div({classes: "filter-facets"});
        this.facetSelect = element({tag: "select", classes: "filter-select"}) as HTMLSelectElement;

        this.targetList = div({classes: "filter-targets"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        const section = (title: string, ...children: HTMLElement[]) => div({
            classes: "filter-section",
            children: [span({classes: "filter-heading", text: title}), ...children]
        });

        gradum(this).addChild([
            div({
                classes: "filter-header",
                children: [span({classes: "filter-title", text: "Filter"}), this.enabledButton, this.resetButton]
            }),
            div({classes: "filter-search-box", children: [this.searchInput, GradumIcon.create({icon: "search"})]}),
            section("Sort by", div({classes: "filter-row", children: [this.sortSelect, this.directionButton]})),
            section("Category", this.picked, this.breadcrumb, this.categoryList),
            section("Ranges", this.facetList, this.facetSelect),
            section("Applies to", this.targetList),
        ]);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this.enabledButton).on(DefaultEventName.click, () => this.model.enabled = !this.model.enabled);
        gradum(this.resetButton).on(DefaultEventName.click, () => {
            this.element.reset();
            this.browsing = "";
        });

        gradum(this.searchInput).on(DefaultEventName.input, () => this.model.keywords = this.searchInput.value);

        gradum(this.sortSelect).on(DefaultEventName.change, () =>
            this.model.sortHandler.sortBy(this.sortSelect.value));
        gradum(this.directionButton).on(DefaultEventName.click, () => this.model.sortHandler.reverse());

        gradum(this.facetSelect).on(DefaultEventName.change, () => {
            const key = this.facetSelect.value;
            if (key) this.model.facetsHandler.set(key, {});
            this.facetSelect.value = "";
        });
    }

    /**
     * @description What a sort key or a property is called: the dropdown's own name for the keys that are not
     * properties, the catalogue's label for the rest.
     * @param {string} key - The key.
     * @returns {string} Its label.
     * @protected
     */
    protected label(key: string): string {
        return SortLabels[key] ?? this.element.canvas?.catalogue?.label(key) ?? key;
    }

    /**
     * @description The unit a property is measured in, as the catalogue's units file has it.
     * @param {string} key - The property's key.
     * @returns {string} The unit, or an empty string when it has none.
     * @protected
     */
    protected unit(key: string): string {
        const units = this.element.canvas?.catalogue?.units;
        return (key === SortKey.price ? units?.price : units?.properties?.[key]) ?? "";
    }

    @effect protected updateEnabled() {
        const enabled = this.model.enabled;
        this.enabledButton.textContent = enabled ? "On" : "Paused";
        gradum(this.enabledButton).toggleClass("off", !enabled);
        gradum(this).toggleClass("paused", !enabled);
    }

    @effect protected updateSearch() {
        //Only written when it says something else, so the field is never rewritten under the caret.
        const keywords = this.model.keywords ?? "";
        if (this.searchInput.value !== keywords) this.searchInput.value = keywords;
    }

    @effect protected updateSort() {
        const {key, direction} = this.model.sort;
        const keys = this.model.sortHandler.keys(this.element.scope);
        if (!keys.includes(key)) keys.push(key);

        this.sortSelect.replaceChildren(...keys.map(entry => {
            const option = element({tag: "option", text: this.label(entry)}) as HTMLOptionElement;
            option.value = entry;
            return option;
        }));
        this.sortSelect.value = key;

        //Neither has a direction worth choosing: no order at all, and best match first.
        const directed = key !== SortKey.none && key !== SortKey.relevance;
        gradum(this.directionButton).toggleClass("hidden", !directed);
        this.directionButton.textContent = direction === "descending" ? "↓ High to low" : "↑ Low to high";
        if (key === SortKey.name) this.directionButton.textContent = direction === "descending" ? "↓ Z–A" : "↑ A–Z";
    }

    /**
     * @description Show the picked categories as chips, each with a cross to put it back.
     * @protected
     */
    @effect protected updatePicked() {
        const picked = this.model.categories ?? [];
        this.picked.replaceChildren(...picked.map(path => {
            const chip = element({tag: "button", classes: "filter-chip", text: path.split(CategorySeparator).at(-1) + " ✕"});
            chip.title = path;
            gradum(chip).on(DefaultEventName.click, () => this.model.categoriesHandler.toggle(path));
            return chip;
        }));
        gradum(this.picked).toggleClass("hidden", picked.length === 0);
    }

    /**
     * @description Draw the level of categories being browsed, and the breadcrumb back up to the top.
     * @protected
     */
    @effect protected updateCategories() {
        const tree = CatalogueCategoriesHandler.treeOf(this.element.scope);
        //A category that is no longer filed under anything browsed back to the top rather than shown empty.
        const node = CatalogueCategoriesHandler.find(tree, this.browsing) ?? tree;
        const picked = this.model.categories;

        const crumbs = [{name: "All", path: ""}];
        if (node.path) node.path.split(CategorySeparator).forEach((name, index, names) =>
            crumbs.push({name, path: names.slice(0, index + 1).join(CategorySeparator)}));
        this.breadcrumb.replaceChildren(...crumbs.map(crumb => {
            const link = element({tag: "button", classes: "filter-crumb", text: crumb.name});
            gradum(link).toggleClass("current", crumb.path === node.path);
            gradum(link).on(DefaultEventName.click, () => this.browsing = crumb.path);
            return link;
        }));

        this.categoryList.replaceChildren(...node.children.map(child => {
            const box = element({tag: "input", classes: "filter-check"}) as HTMLInputElement;
            box.type = "checkbox";
            box.checked = picked.includes(child.path);
            gradum(box).on(DefaultEventName.change, () => this.model.categoriesHandler.toggle(child.path));

            const name = element({tag: "button", classes: "filter-category-name", text: child.name});
            //Into it, when there is anywhere to go; a category with nothing under it can only be picked.
            gradum(name).on(DefaultEventName.click, () => child.children.length
                ? this.browsing = child.path
                : this.model.categoriesHandler.toggle(child.path));

            return div({
                classes: "filter-category",
                children: [
                    box, name,
                    span({classes: "filter-count", text: String(child.count)}),
                    span({classes: "filter-more", text: child.children.length ? "›" : ""})
                ]
            });
        }));
        if (node.children.length === 0) this.categoryList.replaceChildren(
            span({classes: "filter-empty", text: "Nothing filed deeper"}));
    }

    /**
     * @description Draw a row per range set — its label, the two ends, and a cross to stop filtering on it —
     * and offer the properties not yet ranged in the dropdown under them. Each end shows the lowest or highest
     * value there is while it is left open, so there is something to go by.
     * @protected
     */
    @effect protected updateFacets() {
        const facets = this.model.facets ?? {};
        const scope = this.element.scope;
        const handler = this.model.facetsHandler;

        this.facetList.replaceChildren(...Object.keys(facets).map(key => {
            const range = facets[key] ?? {}, bounds = handler.bounds(scope, key);
            const end = (side: "min" | "max") => {
                const input = element({tag: "input", classes: "filter-number"}) as HTMLInputElement;
                input.type = "number";
                input.step = "any";
                input.placeholder = bounds[side] === undefined ? "" : String(Math.round(bounds[side] * 100) / 100);
                if (range[side] !== undefined) input.value = String(range[side]);
                gradum(input).on(DefaultEventName.change, () => handler.set(key, {
                    [side]: input.value === "" ? undefined : Number(input.value)
                }));
                return input;
            };

            const remove = element({tag: "button", classes: "filter-remove", text: "✕"});
            gradum(remove).on(DefaultEventName.click, () => handler.remove(key));

            const unit = this.unit(key);
            return div({
                classes: "filter-facet",
                children: [
                    span({classes: "filter-facet-name", text: this.label(key) + (unit ? ` (${unit})` : "")}),
                    div({classes: "filter-row", children: [end("min"), span({text: "–"}), end("max"), remove]})
                ]
            });
        }));

        const offered = handler.keys(scope).filter(key => !(key in facets));
        const prompt = element({tag: "option", text: "+ Add a range"}) as HTMLOptionElement;
        prompt.value = "";
        this.facetSelect.replaceChildren(prompt, ...offered.map(key => {
            const option = element({tag: "option", text: this.label(key)}) as HTMLOptionElement;
            option.value = key;
            return option;
        }));
        this.facetSelect.value = "";
        gradum(this.facetSelect).toggleClass("hidden", offered.length === 0);
    }

    /**
     * @description Offer every collection on the canvas as a chip, lit while the filter applies to it.
     * Clicking one links or unlinks it.
     * @protected
     */
    @effect protected updateTargets() {
        const canvas = this.element.canvas;
        const collections = canvas?.collections ?? [];
        const targets = this.model.targets;

        this.targetList.replaceChildren(...collections.map(collection => {
            const chip = element({tag: "button", classes: "filter-chip", text: collection.name});
            gradum(chip).toggleClass("selected", targets.includes(collection));
            gradum(chip).on(DefaultEventName.click, () => canvas.toggleLink(this.element, collection));
            return chip;
        }));
        if (collections.length === 0) this.targetList.replaceChildren(
            span({classes: "filter-empty", text: "No collections on the canvas yet"}));
    }
}
