import {disposeEffect, initializeEffects} from "../../decorators/reactivity/reactivity";
import {attachListenersAndBehaviors, detachListenersAndBehaviors} from "../../decorators/listener/listener";
import {GradumModel} from "../model/model";
import {GradumEmitter} from "../emitter/emitter";
import {GradumViewProperties} from "./view.types";
import {addRegistryCategory, define} from "../../decorators/define/define";
import {OwnedDisposable, runWithDisposableOwner, runWithOwner} from "../operator/operator.ownership";

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
     * @description How many of the UI phases the element has run ahead of {@link initialize}: 0 (none),
     * 1 (elements) or 2 (elements and layout). The element runs them across all its pieces first, then calls
     * `initialize`, which skips what already ran and resets this, so calling `initialize` again re-runs every
     * phase.
     */
    private uiStage: 0 | 1 | 2 = 0;

    /**
     * @function initializeUIElements
     * @description Run {@link setupUIElements}, once. Called by the element for every piece (the view and its
     * operators) before any layout runs.
     */
    public initializeUIElements(): void {
        if (this.uiStage >= 1) return;
        this.uiStage = 1;
        //The view's nodes are its own, not those of an operator that happens to be creating this element.
        this.runOwned(() => this.setupUIElements());
    }

    /**
     * @function initializeUILayout
     * @description Run {@link setupUILayout} (after {@link setupUIElements} if it hasn't run), once. Called by
     * the element for every piece after all their elements exist.
     */
    public initializeUILayout(): void {
        this.initializeUIElements();
        if (this.uiStage >= 2) return;
        this.uiStage = 2;
        this.runOwned(() => this.setupUILayout());
    }

    /**
     * @function initialize
     * @description Initializes the view: runs whichever UI phases (elements, layout) haven't run yet, then sets
     * up its event listeners and change callbacks.
     */
    public initialize(): void {
        this.initializeUILayout();
        //Only observers are recorded here, like on an operator: nodes count as the view's own when added during
        //its UI phases, or through `own()`.
        const setup = () => runWithDisposableOwner(this.ownedDisposables, () => {
            this.setupUIListeners();
            //Attached here rather than inside `setupUIListeners` so that a view overriding that method cannot
            //drop its own declared listeners by forgetting to call `super`.
            attachListenersAndBehaviors(this);
            this.setupChangedCallbacks();
        });
        //Run against the emitter on the record, so whatever the view subscribes while setting itself up can be
        //taken back when it is detached.
        if (this.emitter) this.emitter.attributeTo(this, setup);
        else setup();
        this.uiStage = 0;
    }

    /**
     * @readonly
     * @description The nodes this view added to the DOM during its UI phases, removed by {@link detach}.
     */
    protected readonly ownedNodes: Set<Node> = new Set();

    /**
     * @readonly
     * @description The observers this view created while setting itself up, destroyed by {@link detach}.
     */
    protected readonly ownedDisposables: Set<OwnedDisposable> = new Set();

    /**
     * @private
     * @function runOwned
     * @description Run part of the view's setup so that the nodes it adds and the observers it creates are
     * recorded as the view's own.
     */
    private runOwned(work: () => void): void {
        runWithOwner(this.ownedNodes, () => runWithDisposableOwner(this.ownedDisposables, work));
    }

    /**
     * @function own
     * @description Mark a node as belonging to this view, so {@link detach} removes it. Only needed for nodes added
     * outside the UI phases: everything added through `gradum(...).addChild` while they run is recorded already.
     * @template {Node} Type - The node's type.
     * @param {Type} node - The node.
     * @returns {Type} The same node, for chaining.
     */
    public own<Type extends Node>(node: Type): Type {
        if (node) this.ownedNodes.add(node);
        return node;
    }

    /**
     * @function detach
     * @description Take the view off its element: stop its listeners, emitter subscriptions and effects, destroy
     * the observers it created, and remove the nodes it added. Called when the element's view is replaced or
     * its model is detached; calling {@link initialize} afterwards builds it again from scratch. Styles its
     * effects set on the element itself stay until something else sets them.
     */
    public detach(): void {
        detachListenersAndBehaviors(this);
        this.emitter?.removeFor(this);
        disposeEffect(this);
        this.ownedDisposables.forEach(disposable => disposable.destroy());
        this.ownedDisposables.clear();
        this.ownedNodes.forEach(node => node.parentNode?.removeChild(node));
        this.ownedNodes.clear();
        this.uiStage = 0;
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
    }
}

addRegistryCategory(GradumView);
define(GradumView);
export {GradumView};