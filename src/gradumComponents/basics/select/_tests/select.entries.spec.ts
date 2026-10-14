import {describe, it, expect} from "vitest";
import {GradumSelect} from "../select";
import {GradumDropdown} from "../../../menus/dropdown/dropdown";
import {GradumIcon} from "../../icon/icon";
import {GradumRichElement} from "../../richElement/richElement";
import {gradum} from "../../../../gradumFunctions/gradumFunctions";
import {div} from "../../../../elementCreation/basicElements";

const host = () => div({parent: document.body});

//`set entries` registered its entries — fired `onEntryAdded`, applied the classes, set up selection — but
//never put them anywhere. Only `addEntry` did that, so the declarative way of filling a selection produced
//an empty one whenever the parent was already known.
describe("entries are placed however they are given", () => {
    it("places entries assigned after the parent", () => {
        const parent = host();
        const select = GradumSelect.create({parent}) as any;
        const entry = div({text: "a"});

        select.entries = [entry];

        expect(entry.parentElement).toBe(parent);
    });

    it("places entries assigned before the parent", () => {
        const parent = host();
        const select = GradumSelect.create({}) as any;
        const entry = div({text: "a"});

        select.entries = [entry];
        select.parent = parent;

        expect(entry.parentElement).toBe(parent);
    });

    it("keeps an entry that survives a reassignment", () => {
        const parent = host();
        const select = GradumSelect.create({parent}) as any;
        const kept = div({text: "a"}), added = div({text: "b"});
        select.entries = [kept];

        select.entries = [kept, added];

        //Replacing the list takes the old entries off the page; one that is in the new list has to go back.
        expect([kept.parentElement, added.parentElement]).toEqual([parent, parent]);
        expect(parent.children.length).toBe(2);
    });

    it("still places them one at a time through addEntry", () => {
        const parent = host();
        const select = GradumSelect.create({parent}) as any;
        const entry = div({text: "a"});

        select.addEntry(entry);

        expect(entry.parentElement).toBe(parent);
    });

    it("still places them through the values setter", () => {
        const parent = host();
        const select = GradumSelect.create({parent}) as any;

        select.values = ["a", "b"];

        expect(select.entries.every((e: HTMLElement) => e.parentElement === parent)).toBe(true);
        expect(parent.children.length).toBe(2);
    });

    it("tells entries set in a list what they wear when selected, as addEntry does", () => {
        const select = GradumSelect.create({parent: host(), selectedEntriesClasses: "active"}) as any;
        const entry = div({text: "a"});
        select.entries = [entry];

        select.select(entry);

        expect(entry.classList.contains("active")).toBe(true);
        expect(gradum(entry).selected).toBe(true);
    });

    it("fills a dropdown's popup from create()", () => {
        const entry = GradumRichElement.create({text: "Delete"});

        const dropdown = GradumDropdown.create({parent: document.body,
            selector: GradumIcon.create({icon: "cursor"}), entries: [entry]});

        //Giving a selector is what made this fail: assigning one reads the popup, which sets the select's
        //parent — so by the time the entries arrived the parent was already known, and nothing placed them.
        expect(entry.parentElement).toBe(dropdown.popup);
        expect((dropdown.popup as HTMLElement).children.length).toBe(1);
    });

    it("fills a dropdown's popup when no selector is given either", () => {
        const entry = GradumRichElement.create({text: "Delete"});
        const dropdown = GradumDropdown.create({parent: document.body, entries: [entry]});

        expect(entry.parentElement).toBe(dropdown.popup);
    });
});
