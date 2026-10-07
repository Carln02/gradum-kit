import {describe, it, expect} from "vitest";
import {GradumDropdown} from "../dropdown";
import {GradumButtonPopup} from "../../../misc/buttonPopup/buttonPopup";
import {gradum} from "../../../../gradumFunctions/gradumFunctions";
import {div} from "../../../../elementCreation/basicElements";

//A popup moves itself into the shared popup container as it is built, so it is not inside the dropdown it
//belongs to and is not carried off when that dropdown goes. Every dropdown ever built used to leave one
//behind there, with nothing left pointing at it.
describe("a popup does not outlive what it hangs off", () => {
    it("takes the popup away when the dropdown is removed", () => {
        const dropdown = GradumDropdown.create({parent: document.body});
        const popup = dropdown.popup;
        expect(popup.parentElement?.id).toBe("gradum-popup-parent-element");

        dropdown.remove();

        expect(dropdown.parentElement).toBeNull();
        expect(popup.parentElement).toBeNull();
    });

    it("takes the popup away when the dropdown is destroyed", () => {
        const dropdown = GradumDropdown.create({parent: document.body});
        const popup = dropdown.popup;

        gradum(dropdown).destroy();

        expect(popup.parentElement).toBeNull();
    });

    it("takes it away when an ancestor is destroyed, not only the dropdown itself", () => {
        const card = div({parent: document.body});
        const dropdown = GradumDropdown.create({parent: card});
        const popup = dropdown.popup;

        gradum(card).destroy();

        expect(card.parentElement).toBeNull();
        //The point of the whole thing: destroying a card has to reach the dropdown inside it, since that is
        //the only thing that knows where its popup went.
        expect(popup.parentElement).toBeNull();
    });

    it("does the same for a button popup", () => {
        const card = div({parent: document.body});
        const button = GradumButtonPopup.create({parent: card});
        const popup = button.popup;

        gradum(card).destroy();

        expect(popup.parentElement).toBeNull();
    });

    it("leaves a dropdown that is merely moved with its popup intact", () => {
        const from = div({parent: document.body}), to = div({parent: document.body});
        const dropdown = GradumDropdown.create({parent: from});
        const popup = dropdown.popup;

        gradum(dropdown).addToParent(to);

        expect(dropdown.parentElement).toBe(to);
        expect(popup.parentElement?.id).toBe("gradum-popup-parent-element");
    });
});
