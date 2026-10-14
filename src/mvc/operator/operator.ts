import {GradumView} from "../view/view";
import {disposeEffect, initializeEffects} from "../../decorators/reactivity/reactivity";
import {attachListenersAndBehaviors, detachListenersAndBehaviors} from "../../decorators/listener/listener";
import {GradumModel} from "../model/model";
import {GradumEmitter} from "../emitter/emitter";
import {addRegistryCategory, define} from "../../decorators/define/define";
import {GradumOperatorProperties} from "./operator.types";

/**
 * @class GradumOperator
 * @group MVC
 * @category Operator
 *
 * @template {object} ElementType - The type of the main component.
 * @template {GradumView} ViewType - The element's MVC view type.
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @template {GradumEmitter} EmitterType - The element's MVC emitter type.
 * @description The MVC base operator class. Its main job is to handle some part of (or all of) the logic of the
 * component. It has access to the element, the model to read and write data, the view to update the UI, and the
 * emitter to listen for changes in the model or any other internal events. It can only communicate with other
 * operators via the emitter (by firing or listening for changes on a certain key).
 */
class GradumOperator<
    ElementType extends object = object,
    ViewType extends GradumView = GradumView<any, any>,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> {
    /**
     * @description The key of the operator. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the operator's class name is MyElementSomethingOperator, the key would
     * default to "something".
     */
    public keyName: string;

    /**
     * @description The element it is bound to.
     */
    public element: ElementType;

    /**
     * @description The MVC view.
     */
    public view: ViewType;

    /**
     * @description The MVC model.
     */
    public model: ModelType;

    /**
     * @description The MVC emitter.
     */
    public emitter: EmitterType;

    /**
     * @constructor
     * @description Create an operator bound to an element. The view, model, and emitter default to the
     * element's own, so an operator shares them rather than owning any state itself.
     * @param {GradumOperatorProperties} properties - The element to attach to, plus optional view, model, and
     * emitter overrides.
     */
    public constructor(properties: GradumOperatorProperties<ElementType, ViewType, ModelType, EmitterType>) {
        this.element = properties.element;
        if (properties.model) this.model = properties.model;
        if (properties.emitter) this.emitter = properties.emitter;
        if (properties.view) this.view = properties.view;
        this.setup();
    }

    /**
     * @function setup
     * @description Called in the constructor. Use for setup that should happen at instantiation,
     * before `this.initialize()` is called.
     * @protected
     */
    protected setup(): void {}

    /**
     * @function initialize
     * @description Initializes the operator. Specifically, it will set up the change callbacks.
     */
    public initialize(): void {
        const setup = () => {
            this.setupUIListeners();
            this.setupChangedCallbacks();
        };
        //Run against the emitter on the record, so whatever this operator subscribes while setting itself
        //up is known to be its own and can be taken back when it is detached.
        if (this.emitter) this.emitter.attributeTo(this, setup);
        else setup();
    }

    /**
     * @function detach
     * @description Undoes {@link initialize}: the operator stops hearing about anything. Every `@listener`
     * and `@behavior` it bound is taken back, everything it subscribed on the emitter while initializing is
     * dropped, and its `@effect` methods are disposed. Called for you when the operator is removed, before
     * its model, view and emitter are taken away — which is the point, since those are what its callbacks
     * would go on reading.
     *
     * Initializing it again restores all three, so an operator may be removed and added back.
     *
     * *Note: a subscription made outside `initialize` — later, from a method of its own — is not on the
     * record, and is the operator's own to undo.*
     */
    public detach(): void {
        detachListenersAndBehaviors(this);
        this.emitter?.removeFor(this);
        disposeEffect(this);
    }

    /**
     * @function setupUIListeners
     * @description Setup method for defining DOM and input event listeners.
     * @protected
     */
    protected setupUIListeners(): void {
        attachListenersAndBehaviors(this);
    }

    /**
     * @function setupChangedCallbacks
     * @description Setup method intended to initialize change listeners and callbacks.
     * @protected
     */
    protected setupChangedCallbacks(): void {
        initializeEffects(this);
    }
}

addRegistryCategory(GradumOperator);
define(GradumOperator);
export {GradumOperator};