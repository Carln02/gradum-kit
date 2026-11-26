import {effect, GradumOperator} from "../../../build/gradum-kit.esm";
import type {Component} from "./component";
import {ComponentView} from "./component.view";
import {ComponentModel} from "./component.model";

//=====================================================================================================================
// THE OPERATOR — a piece of logic attached to the element, that isn't drawing (view) or data (model).
// (Formerly "controller".) E.g. playback for a video, paging for a list, fitting cards into an area.
//
// Why a separate class: it can be swapped (a subclass, a different operator) or reused on another component.
// Tools, interactors, and constrainers are operators too: everything below applies to them.
//
// Lifecycle: setup() → initialize() → setupUIListeners() → setupChangedCallbacks(). Always call super.
//=====================================================================================================================

export class ComponentOperator extends GradumOperator<Component, ComponentView, ComponentModel> {
    //Key used by @operator() to find it. Omitted, it's inferred: ComponentVideoOperator → "video".
    //Same rule for handlers, interactors, tools, and constrainers.
    public keyName = "video";

    //== Listening =====================================================================================================
    protected setupChangedCallbacks(): void {
        super.setupChangedCallbacks();   //Starts this operator's @effects.
        this.emitter.add("paragraphClicked", () => this.model.counter++);   //Fired by the view.
    }

    //== Effects =======================================================================================================
    @effect protected logCounter() {
        console.log("Clicked", this.model.counter, "times");
    }

    //== Cheat sheet ===================================================================================================
    private api() {
        this.element; this.view; this.model; this.emitter;
        this.detach();   //Stops its effects and listeners. Done for you when it's removed.
    }
}
