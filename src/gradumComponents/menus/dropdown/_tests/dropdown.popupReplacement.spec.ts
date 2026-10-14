import {describe, it, expect} from "vitest";
import {GradumDropdown} from "../dropdown";
import {GradumButtonPopup} from "../../../misc/buttonPopup/buttonPopup";
import {GradumPopup} from "../../../containers/popup/popup";
import {div} from "../../../../elementCreation/basicElements";
import {GradumRichElement} from "../../../basics/richElement/richElement";

//The shared popup container is built at module load, before the body is cleared between tests, so it is
//not reachable through the document — a popup's own parent is the way to it.
const container = GradumPopup.create().parentElement;
const parked = () => container.children.length;

//A popup is parked in the shared container rather than kept inside the thing that owns it, so replacing
//the reference left the old one there with nothing pointing at it — one leaked element per dropdown.
describe("replacing a popup does not leave the old one behind", () => {
    it("parks one popup per dropdown when the default is used", () => {
        const before = parked();
        for (let i = 0; i < 3; i++) GradumDropdown.create({parent: document.body});
        expect(parked() - before).toBe(3);
    });

    it("parks one per dropdown when a popup is supplied alongside a selector", () => {
        const before = parked();
        for (let i = 0; i < 3; i++) GradumDropdown.create({parent: document.body,
            selector: div({text: "pick"}), popup: GradumPopup.create()});
        //Assigning a selector reads `popup` to anchor against, which builds the default before the
        //supplied one arrives — that default used to stay parked forever.
        expect(parked() - before).toBe(3);
    });

    it("parks one when the popup is reassigned after construction", () => {
        const before = parked();
        const dropdown = GradumDropdown.create({parent: document.body});

        dropdown.popup = GradumPopup.create();

        expect(parked() - before).toBe(1);
    });

    it("keeps the popup that was supplied", () => {
        const popup = GradumPopup.create();
        const dropdown = GradumDropdown.create({parent: document.body,
            selector: div({text: "pick"}), popup});

        expect(dropdown.popup).toBe(popup);
        expect(popup.parentElement).toBe(container);
    });

    it("carries the entries across rather than taking them down with the old popup", () => {
        const entry = GradumRichElement.create({text: "Delete"});
        const dropdown = GradumDropdown.create({parent: document.body, entries: [entry]});
        const replacement = GradumPopup.create();

        dropdown.popup = replacement;

        expect(entry.parentElement).toBe(replacement);
        expect(dropdown.entries).toEqual([entry]);
    });

    it("does the same for a button popup", () => {
        const before = parked();
        const button = GradumButtonPopup.create({parent: document.body});
        button.popup;

        button.popup = GradumPopup.create();

        expect(parked() - before).toBe(1);
    });

    it("leaves the popup alone when it is assigned the one it already has", () => {
        const dropdown = GradumDropdown.create({parent: document.body});
        const popup = dropdown.popup;

        dropdown.popup = popup;

        expect(dropdown.popup).toBe(popup);
        expect(popup.parentElement).toBe(container);
    });
});
