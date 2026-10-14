import {describe, it, expect} from "vitest";
import {GradumDropdown} from "../dropdown";
import {GradumButton} from "../../../basics/button/button";
import {GradumPopup} from "../../../containers/popup/popup";
import {GradumIcon} from "../../../basics/icon/icon";
import {div} from "../../../../elementCreation/basicElements";

const tick = () => new Promise(resolve => queueMicrotask(resolve as () => void));

const selectors = (dropdown: HTMLElement) => Array.from(dropdown.children)
    .filter(child => !(child instanceof GradumPopup));

//`get selector()` was a stub returning `undefined`, which made the accessor write-only. Three things read
//it and got nothing: the popup anchored to nothing, `setIfUndefined` kept thinking the selector was still
//missing, and the branch that relabels an existing button could never be true — so a dropdown given an
//icon ended up with the icon and a button beside it.
describe("a dropdown knows what its selector is", () => {
    it("gives back the element it was given", () => {
        const icon = GradumIcon.create({icon: "cursor"});
        const dropdown = GradumDropdown.create({parent: document.body, selector: icon});

        expect(dropdown.selector).toBe(icon);
    });

    it("keeps that element as its only selector", () => {
        const icon = GradumIcon.create({icon: "cursor"});
        const dropdown = GradumDropdown.create({parent: document.body, selector: icon});

        expect(selectors(dropdown)).toEqual([icon]);
    });

    it("builds exactly one button when given none, however often it is read", () => {
        const dropdown = GradumDropdown.create({parent: document.body});

        const first = dropdown.selector;
        for (let read = 0; read < 5; read++) dropdown.selector;

        expect(first).toBeInstanceOf(GradumButton);
        expect(dropdown.selector).toBe(first);
        //Every read used to find the selector still undefined and build another one.
        expect(selectors(dropdown)).toEqual([first]);
    });

    it("relabels the button it built rather than replacing it", async () => {
        const dropdown = GradumDropdown.create({parent: document.body});
        const built = dropdown.selector as GradumButton;

        dropdown.selector = "Choose";
        await tick();

        //The branch that relabels an existing button could never run, since the test guarding it read the
        //stub getter — so a dropdown told to change its label built a second button instead.
        expect(dropdown.selector).toBe(built);
        expect(selectors(dropdown)).toEqual([built]);
        //*The label itself is not asserted here: a rich element writes its text through `innerText`, which
        //jsdom does not implement. Checked in a browser instead.*
    });

    it("anchors its popup to the selector", () => {
        const icon = GradumIcon.create({icon: "cursor"});
        const dropdown = GradumDropdown.create({parent: document.body, selector: icon});

        expect((dropdown.popup as GradumPopup).anchor).toBe(icon);
    });

    it("anchors a popup supplied before the selector exists", () => {
        const popup = GradumPopup.create();
        const icon = GradumIcon.create({icon: "cursor"});
        const dropdown = GradumDropdown.create({parent: document.body, popup});

        dropdown.selector = icon;

        expect(popup.anchor).toBe(icon);
    });

    it("takes a plain element as its selector", () => {
        const own = div({text: "pick"});
        const dropdown = GradumDropdown.create({parent: document.body, selector: own});

        expect(dropdown.selector).toBe(own);
        expect(selectors(dropdown)).toEqual([own]);
    });
});
