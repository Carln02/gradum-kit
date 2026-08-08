import {initializeEffects} from "../../decorators/reactivity/reactivity";
import {attachListenersAndBehaviors} from "../../decorators/listener/listener";
import {GradumModel} from "../model/model";
import {GradumEmitter} from "../emitter/emitter";
import {GradumViewProperties} from "./view.types";
import {addRegistryCategory, define} from "../../decorators/define/define";

/**
 * @class GradumView
 * @group MVC
 * @category View
 *
 * @template {object} ElementType - The type of the element attached to the view.
 * @template {GradumModel} ModelType - The model type used in this view.
 * @template {GradumEmitter} EmitterType - The emitter type used in this view.
 * @description A base view class for MVC elements, providing structure for initializing and managing UI setup and
 * event listeners. Designed to be devoid of logic and only handle direct UI changes.
 */
class GradumView<
    ElementType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> {
    /**
     * @description The main component this view is attached to.
     */
    public element: ElementType;

    /**
     * @description The model instance this view is bound to.
     */
    public model?: ModelType;

    /**
     * @description The emitter instance used for event communication.
     */
    public emitter?: EmitterType;

    /**
     * @constructor
     * @param {GradumViewProperties<ElementType, ModelType, EmitterType>} properties - Properties to initialize the view with.
     */
    public constructor(properties: GradumViewProperties<ElementType, ModelType, EmitterType>) {
        this.element = properties.element;
        if (properties.model) this.model = properties.model;
        if (properties.emitter) this.emitter = properties.emitter;
        this.setup();
    }

    /**
     * @function setup
     * @description Called in the constructor. Use for setup that should happen at instantiation,
     * before `this.initialize()` is called.
     * @protected
     */
    protected setup() {}

    /**
     * @function initialize
     * @description Initializes the view by setting up change callbacks, UI elements, layout, and event listeners.
     */
    public initialize(): void {
        this.setupUIElements();
        this.setupUILayout();
        this.setupUIListeners();
        this.setupChangedCallbacks();
    }

    /**
     * @function setupChangedCallbacks
     * @description Setup method for initializing data/model change listeners and associated UI logic.
     * @protected
     */
    protected setupChangedCallbacks(): void {
        initializeEffects(this);
    }

    /**
     * @function setupUIElements
     * @description Setup method for initializing and storing sub-elements of the UI.
     * @protected
     */
    protected setupUIElements(): void {
    }

    /**
     * @function setupUILayout
     * @description Setup method for creating the layout structure and injecting sub-elements into the DOM tree.
     * @protected
     */
    protected setupUILayout(): void {
    }

    /**
     * @function setupUIListeners
     * @description Setup method for defining DOM and input event listeners.
     * @protected
     */
    protected setupUIListeners(): void {
        attachListenersAndBehaviors(this);
    }
}

addRegistryCategory(GradumView);
define(GradumView);
export {GradumView};