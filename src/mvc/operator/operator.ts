import {GradumView} from "../view/view";
import {disposeEffect, initializeEffects} from "../../decorators/reactivity/reactivity";
import {attachListenersAndBehaviors, detachListenersAndBehaviors} from "../../decorators/listener/listener";
import {GradumModel} from "../model/model";
import {GradumEmitter} from "../emitter/emitter";
import {addRegistryCategory, define} from "../../decorators/define/define";
import {GradumOperatorProperties} from "./operator.types";
import {OwnedDisposable, runWithDisposableOwner, runWithOwner} from "./operator.ownership";

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
 *
 * An operator can bring its own UI, so a feature — its DOM and its logic — lives in one class that can be added
 * to any element. It has the same four setup phases as a view: `setupUIElements`, `setupUILayout`,
 * `setupUIListeners`, `setupChangedCallbacks`. When the element initializes, each phase runs across the view and
 * all operators before the next one starts, so an operator's layout can use what the view built.
 *
 * Every node it adds with `gradum(...).addChild` during `setupUIElements` and `setupUILayout` is its own, and is
 * removed from the DOM when it is {@link detach | detached}. Use {@link own} for nodes added later.
 *
 * @example
 * ```ts
 * class LockOperator extends GradumOperator {
 *     protected button: HTMLElement;
 *
 *     protected setupUIElements() {
 *         super.setupUIElements();
 *         this.button = button({text: "Lock"});
 *     }
 *
 *     protected setupUILayout() {
 *         super.setupUILayout();
 *         gradum(this).addChild(this.button); // added to the element; removed on detach
 *     }
 * }
 * ```
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
     * @description The nodes this operator added to the DOM, removed when it is detached.
     */
    protected readonly ownedNodes: Set<Node> = new Set();

    /**
     * @readonly
     * @description The observers this operator created while setting itself up, destroyed by {@link detach}.
     */
    protected readonly ownedDisposables: Set<OwnedDisposable> = new Set();

    /**
     * @description How many of the UI phases the element has run ahead of {@link initialize}: 0 (none),
     * 1 (elements) or 2 (elements and layout). The element runs them across all its pieces first, then calls
     * `initialize`, which skips what already ran and resets this.
     */
    private uiStage: 0 | 1 | 2 = 0;

    /**
     * @function initializeUIElements
     * @description Run {@link setupUIElements}, once. Called by the element for every piece before any layout
     * runs; call {@link initialize} instead when initializing an operator yourself.
     */
    public initializeUIElements(): void {
        if (this.uiStage >= 1) return;
        this.uiStage = 1;
        runWithOwner(this.ownedNodes, () => runWithDisposableOwner(this.ownedDisposables, () => this.setupUIElements()));
    }

    /**
     * @function initializeUILayout
     * @description Run {@link setupUILayout} (after {@link setupUIElements} if it hasn't run), once. Called by
     * the element for every piece after all their elements exist; call {@link initialize} instead when
     * initializing an operator yourself.
     */
    public initializeUILayout(): void {
        this.initializeUIElements();
        if (this.uiStage >= 2) return;
        this.uiStage = 2;
        runWithOwner(this.ownedNodes, () => runWithDisposableOwner(this.ownedDisposables, () => this.setupUILayout()));
    }

    /**
     * @function initialize
     * @description Initializes the operator: runs whichever UI phases haven't run yet, then sets up its
     * listeners and change callbacks.
     */
    public initialize(): void {
        this.initializeUILayout();
        const setup = () => runWithDisposableOwner(this.ownedDisposables, () => {
            this.setupUIListeners();
            this.setupChangedCallbacks();
        });
        //Run against the emitter on the record, so whatever this operator subscribes while setting itself
        //up is known to be its own and can be taken back when it is detached.
        if (this.emitter) this.emitter.attributeTo(this, setup);
        else setup();
        this.uiStage = 0;
    }

    /**
     * @function own
     * @description Mark a node as this operator's, so it is removed from the DOM when the operator is
     * detached. Nodes added with `gradum(...).addChild` during the UI phases are already owned; use this for
     * nodes added later, or with native DOM methods.
     * @template {Node} Type - The type of the node.
     * @param {Type} node - The node to own.
     * @returns {Type} The node, for chaining.
     */
    public own<Type extends Node>(node: Type): Type {
        if (node) this.ownedNodes.add(node);
        return node;
    }

    /**
     * @function detach
     * @description Undoes {@link initialize}: the operator stops hearing about anything. Every `@listener`
     * and `@behavior` it bound is taken back, everything it subscribed on the emitter while initializing is
     * dropped, and its `@effect` methods are disposed. Called for you when the operator is removed, before
     * its model, view and emitter are taken away — which is the point, since those are what its callbacks
     * would go on reading.
     *
     * The nodes it owns (see {@link own}) are removed from the DOM too.
     *
     * Initializing it again restores all of it, rebuilding its UI, so an operator may be removed and added back.
     *
     * *Note: a subscription made outside `initialize` — later, from a method of its own — is not on the
     * record, and is the operator's own to undo.*
     */
    public detach(): void {
        detachListenersAndBehaviors(this);
        this.emitter?.removeFor(this);
        disposeEffect(this);
        this.ownedDisposables.forEach(disposable => disposable.destroy());
        this.ownedDisposables.clear();
        this.ownedNodes.forEach(node => node.parentNode?.removeChild(node));
        this.ownedNodes.clear();
    }

    /**
     * @function setupUIElements
     * @description Setup method for creating the operator's DOM elements. Don't attach them here: the
     * element's other pieces may not have built theirs yet. Use {@link setupUILayout} for that.
     * @protected
     */
    protected setupUIElements(): void {
    }

    /**
     * @function setupUILayout
     * @description Setup method for placing the operator's elements, e.g. with `gradum(this).addChild(...)`.
     * Runs after every piece's {@link setupUIElements}, so the view's elements exist.
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