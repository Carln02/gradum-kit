import {GradumHandler} from "../../../build/gradum-kit.esm";
import {ComponentModel} from "./component.model";

//=====================================================================================================================
// THE HANDLER — helper functions over part of the model's data. Sees the model only.
// Keeps the model small, and can be swapped (e.g. a different search strategy with the same functions).
// Retrieved in the model with @handler(), then called as model.myHandler.reset().
// Handlers support @effect too.
//=====================================================================================================================

export class ComponentHandler extends GradumHandler<ComponentModel> {
    public keyName = "my";   //Omitted, it's inferred from the class name.

    public reset() {
        this.model.counter = 0;
        this.model.x = 0;
    }

    public isEmpty(): boolean {
        return !this.model.a && !this.model.b;
    }
}
