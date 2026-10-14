import {describe, it, expect} from "vitest";
import {GradumSelect} from "../select";
import {gradum} from "../../../../gradumFunctions/gradumFunctions";
import {div} from "../../../../elementCreation/basicElements";

const build = (count: number = 3, properties: object = {}, keepSelection: boolean = true) => {
    const entries = Array.from({length: count}, (_, i) => div({text: `entry ${i}`}));
    const select = GradumSelect.create({parent: div({parent: document.body}), ...properties}) as any;
    //Assigned after creation: `forceSelection` defaults from `multiSelection`, and the `multiSelection`
    //setter writes it, so whichever is applied last at creation wins.
    select.forceSelection = keepSelection;
    entries.forEach(entry => select.addEntry(entry));
    return {select, entries};
};

//`select()` used to apply its own `selectedEntriesClasses` beside the library's notion of selected rather
//than through it, so `gradum(entry).selected` stayed false however the select was driven and
//`gradum(entry).onSelected` never fired. The class said selected and the gradum block said not.
describe("a selected entry knows it is selected", () => {
    it("answers gradum(entry).selected", () => {
        const {select, entries} = build();

        select.select(entries[1]);

        expect(entries.map(e => gradum(e).selected)).toEqual([false, true, false]);
        expect(select.isSelected(entries[1])).toBe(true);
    });

    it("still carries the class", () => {
        //`forceSelection` is on by default and refuses to let go of the last selected entry, so a test
        //about deselecting has to turn it off.
        const {select, entries} = build(3, {}, false);
        select.select(entries[0]);
        expect(entries[0].classList.contains("selected")).toBe(true);

        select.select(entries[0], false);
        expect(entries[0].classList.contains("selected")).toBe(false);
    });

    it("fires onSelected on the entry, both ways", () => {
        const {select, entries} = build(3, {}, false);
        const seen: boolean[] = [];
        gradum(entries[0]).onSelected.add(value => seen.push(value));

        select.select(entries[0]);
        select.select(entries[0], false);

        expect(seen).toEqual([true, false]);
    });

    it("deselects the previous entry when selection is single", () => {
        const {select, entries} = build();
        select.select(entries[0]);

        select.select(entries[2]);

        expect(entries.map(e => gradum(e).selected)).toEqual([false, false, true]);
    });

    it("clears every entry on deselectAll", () => {
        const {select, entries} = build(3, {multiSelection: true}, false);
        select.select(entries[0]);
        select.select(entries[1]);
        expect(entries.map(e => gradum(e).selected)).toEqual([true, true, false]);

        select.deselectAll();

        expect(entries.map(e => gradum(e).selected)).toEqual([false, false, false]);
    });

    it("uses the select's own selected classes, not the fallback", () => {
        const {select, entries} = build(3, {selectedEntriesClasses: "active"});

        select.select(entries[0]);

        expect(entries[0].classList.contains("active")).toBe(true);
        expect(entries[0].classList.contains("selected")).toBe(false);
        expect(gradum(entries[0]).selected).toBe(true);
    });

    it("moves the classes over when they are changed after the fact", () => {
        const {select, entries} = build();
        select.select(entries[0]);
        expect(entries[0].classList.contains("selected")).toBe(true);

        select.selectedEntriesClasses = "active";

        expect(entries[0].classList.contains("active")).toBe(true);
        expect(entries[0].classList.contains("selected")).toBe(false);
        expect(gradum(entries[0]).selected).toBe(true);
    });

    it("lets go of an entry it no longer owns", () => {
        const {select, entries} = build(3, {}, false);
        select.select(entries[1]);

        select.removeEntry(entries[1]);

        expect(gradum(entries[1]).selected).toBe(false);
    });
});
