import {DefaultEventName, effect, GradumView, gradum, p, untrack} from "../../../build/gradum-kit.esm";
import type {Component} from "./component";
import {ComponentModel} from "./component.model";

//=====================================================================================================================
// THE VIEW — builds the component's DOM and keeps it in sync with the model.
// Knows the element and the model. Inside a view, gradum(this) targets the element, not the view.
//
// initialize() calls these, in order. Always call super.
//   1. setupUIElements()        Create sub-elements. Don't attach them, don't read signals.
//   2. setupUILayout()          Attach them.
//   3. setupUIListeners()       Add event listeners.
//   4. setupChangedCallbacks()  Observers + emitter. Its super STARTS THE @effects — never skip it.
//=====================================================================================================================

export class ComponentView extends GradumView<Component, ComponentModel> {
    public paragraph: HTMLParagraphElement;

    //== 1–4. Setup ====================================================================================================
    protected setupUIElements() {
        super.setupUIElements();
        this.paragraph = p();
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild(this.paragraph);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        //Tell the rest of the component through the emitter. The operator listens (see the operator).
        gradum(this.paragraph).on(DefaultEventName.click, () => this.emitter.fire("paragraphClicked"));
    }

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
    }

    //== Effects =======================================================================================================
    //Re-runs whenever a signal it read changes. Here: model.a or model.b.
    @effect private updateText() {
        this.paragraph.textContent = this.model.a + " " + this.model.b;
    }

    //Two rules:
    //  - Never call an @effect from another @effect: the inner one's signals get tracked by the outer one.
    //  - To read a signal without depending on it, use untrack().
    @effect private updateCount() {
        const prefix = untrack(() => this.model.b);   //Changing b won't re-run this.
        gradum(this.paragraph).toggleClass("many", this.model.counter > 3);
        this.paragraph.title = `${prefix}: ${this.model.counter}`;
    }

    //== Cheat sheet ===================================================================================================
    private api() {
        this.element; this.model;
        this.emitter.fire("name", 1, 2);   //Named events within the component.
        this.emitter.add("name", (a, b) => {});
    }
}
