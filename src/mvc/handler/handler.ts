import {initializeEffects} from "../../decorators/reactivity/reactivity";
import {GradumModel} from "../model/model";
import {addRegistryCategory, define} from "../../decorators/define/define";

/**
 * @class GradumHandler
 * @group MVC
 * @category Handler
 *
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @description Holds model-level logic that would otherwise crowd the model itself. A handler sees only
 * `this.model` — no element and no view — so use it for computations and edits over the model's data, and
 * reach for a {@link GradumOperator} when the DOM is involved. Register one with the `@handler` decorator.
 */
class GradumHandler<ModelType extends GradumModel = GradumModel> {
    /**
     * @description The key of the handler. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the handler's class name is MyElementSomethingHandler, the key would
     * default to "something".
     */
    public keyName: string;

    /**
     * @description The model this handler operates on. Assigned by the MVC wiring when the handler is
     * registered, so it is set by the time `initialize` runs.
     */
    public model: ModelType;

    /**
     * @constructor
     * @description Create a handler. Handlers are normally constructed without arguments — the MVC wiring
     * binds {@link GradumHandler.model} when the handler is registered on its model.
     * @param {ModelType} [model] - The model to bind. *Note: this argument is currently ignored, because the
     * assignment is guarded on the field rather than on the parameter.*
     */
    public constructor(model?: ModelType) {
        if (this.model) this.model = model;
        this.setup();
    }

    /**
     * @function setup
     * @description Called in the constructor. Use for setup that should happen at instantiation,
     * before `this.initialize()` is called.
     * @protected
     */
    protected setup(): void {
        initializeEffects(this);
    }
}

addRegistryCategory(GradumHandler);
define(GradumHandler);
export {GradumHandler};