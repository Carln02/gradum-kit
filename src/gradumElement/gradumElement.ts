import {GradumEmitter} from "../mvc/emitter/emitter";
import {GradumModel} from "../mvc/model/model";
import {GradumView} from "../mvc/view/view";
import {defineDefaultProperties} from "./setup/default/default";
import {defineMvcAccessors} from "./setup/mvc/mvc";
import {defineUIPrototype} from "./setup/ui/ui";
import {GradumElementProperties} from "./gradumElement.types";
import {Delegate} from "../gradumComponents/datatypes/delegate/delegate";
import {element} from "../elementCreation/element";
import {gradum} from "../gradumFunctions/gradumFunctions";
import {getPrototypeChain} from "../utils/dataManipulation/prototype";
import {isUndefined} from "../utils/dataManipulation/misc";
import {kebabToCamelCase} from "../utils/conversions/string";
import {parse} from "@ungap/structured-clone/json";
import {addRegistryCategory} from "../decorators/define/define";

/**
 * @class GradumElement
 * @group MVC
 * @category Element Classes
 *
 * @extends HTMLElement
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Base GradumElement class, extending the base HTML element with a few useful tools and functions.
 * */
class GradumElement<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter<any>
> extends HTMLElement {
    /**
     * @description Default properties assigned to a new instance.
     */
    public static defaultProperties: GradumElementProperties = {
        defaultSelectedClasses: "selected"
    };

    // public static create<Type extends new (...args: any[]) => GradumElement>
    // (this: Type, properties: InstanceType<Type>["properties"] = {}): InstanceType<Type> {
    //     return (this as any).customCreate.call(this, properties);
    // }

    /**
     * @function create
     * @static
     * @description Instantiate this class with the given properties. Defaults declared by every class in the
     * inheritance chain are applied first, nearest ancestor last, so a subclass' `defaultProperties` win over
     * its parent's. The return type follows the class it is called on, and the MVC type parameters are read
     * back off the properties — passing `model: MyModel` types `.model` as `MyModel` without a cast.
     *
     * *Note: the callee is read through `this["prototype"]` rather than `InstanceType<this>`, because the
     * latter instantiates a generic class' parameters with their constraints instead of their defaults,
     * which is what forced casts at call sites.*
     * @template {{prototype: GradumElement}} This - The class `create` was called on.
     * @template {GradumView} ViewType - Inferred from `properties.view`.
     * @template {object} DataType - Inferred from `properties.data`.
     * @template {GradumModel} ModelType - Inferred from `properties.model`.
     * @template {GradumEmitter} EmitterType - Inferred from `properties.emitter`.
     * @param {GradumElementProperties} [properties] - Properties to set on the new instance.
     * @returns {GradumElement} The created instance, typed as the class this was called on.
     */
    public static create<
        This extends {prototype: GradumElement},
        ViewType extends GradumView = GradumView<any, any>,
        DataType extends object = object,
        ModelType extends GradumModel = GradumModel,
        EmitterType extends GradumEmitter = GradumEmitter<any>
    >(
        this: This,
        properties?: This["prototype"]["properties"]
            & GradumElementProperties<ViewType, DataType, ModelType, EmitterType>
    ): This["prototype"] & GradumElement<ViewType, DataType, ModelType, EmitterType> {
        return (this as any).customCreate(properties ?? {});
    }

    /**
     * @protected
     * @static
     * @function customCreate
     * @description The construction step behind {@link create}. Override it to change how instances of a class
     * are built — to route through a factory, or to wrap the instance — while keeping the default-merging that
     * `create` performs.
     * @param {object} properties - Properties to set on the new instance, defaults already merged in.
     * @returns {object} The created instance.
     */
    protected static customCreate(properties: object): object {
        const prototypeChain = getPrototypeChain(this);
        for (const prototype of prototypeChain) gradum(properties).applyDefaults(prototype["defaultProperties"] ?? {});
        return element({...properties});
    }

    public declare readonly properties: GradumElementProperties;

    /**
     * @description Delegate fired when the element is attached to DOM.
     */
    public readonly onAttach: Delegate<() => void> = new Delegate<() => void>();

    /**
     * @description Delegate fired when the element is detached from the DOM.
     */
    public readonly onDetach: Delegate<() => void> = new Delegate<() => void>();

    /**
     * @description Delegate fired when the element is adopted by a new parent in the DOM.
     */
    public readonly onAdopt: Delegate<() => void> = new Delegate<() => void>();

    /**
     * @function setupChangedCallbacks
     * @description Setup method intended to initialize change listeners and callbacks. Called on `initialize()`.
     * @protected
     */
    protected setupChangedCallbacks(): void {
    }

    /**
     * @function setupUIElements
     * @description Setup method intended to initialize all direct sub-elements attached to this element, and store
     * them in fields. Called on `initialize()`.
     * @protected
     */
    protected setupUIElements(): void {
    }

    /**
     * @function setupUILayout
     * @description Setup method to create the layout structure of the element by adding all created sub-elements to
     * this element's child tree. Called on `initialize()`.
     * @protected
     */
    protected setupUILayout(): void {
    }

    /**
     * @function setupUIListeners
     * @description Setup method to initialize and define all input/DOM event listeners of the element. Called on
     * `initialize()`.
     * @protected
     */
    protected setupUIListeners(): void {
    }

    /**
     * @function connectedCallback
     * @description function called when the element is attached to the DOM.
     */
    public connectedCallback() {
        if (!this.initialized) {
            const prototypeChain = getPrototypeChain(this);
            const defaults = {};
            for (const proto of prototypeChain) gradum(defaults).applyDefaults(proto.constructor?.["defaultProperties"]);
            const toApply = {};
            for (const [key, value] of Object.entries(defaults)) if (isUndefined(this[key])) toApply[key] = value;
            gradum(this).setProperties(toApply);

            for (const attribute of this.constructor["observedAttributes"] ?? []) {
                if (!this.hasAttribute(attribute)) continue;
                const property = kebabToCamelCase(attribute);
                const current = this.getAttribute(attribute);
                this[property] = parse(current);
            }
        }
        this.onAttach.fire();
    }

    /**
     * @function disconnectedCallback
     * @description function called when the element is detached from the DOM.
     */
    public disconnectedCallback() {
        this.onDetach.fire();
    }

    /**
     * @function adoptedCallback
     * @description function called when the element is adopted by a new parent in the DOM.
     */
    public adoptedCallback() {
        this.onAdopt.fire();
    }
}

(() => {
    defineDefaultProperties(GradumElement);
    defineMvcAccessors(GradumElement);
    defineUIPrototype(GradumElement);
})();

addRegistryCategory(GradumElement);
export {GradumElement};