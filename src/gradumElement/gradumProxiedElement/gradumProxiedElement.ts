import {GradumProxiedProperties} from "./gradumProxiedElement.types";
import {blindElement} from "../../elementCreation/element";
import {GradumEmitter} from "../../mvc/emitter/emitter";
import {GradumModel} from "../../mvc/model/model";
import {GradumView} from "../../mvc/view/view";
import {defineDefaultProperties} from "../setup/default/default";
import {defineMvcAccessors} from "../setup/mvc/mvc";
import {defineUIPrototype} from "../setup/ui/ui";
import {ValidElement, ValidTag} from "../../types/element.types";
import {GradumElementProperties} from "../gradumElement.types";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {proxyWrapperSymbol} from "../../gradumFunctions/mvc/mvc.utils";
import {MvcFields} from "../../gradumFunctions/mvc/mvc";
import {getFirstDescriptorInChain, getPrototypeChain} from "../../utils/dataManipulation/prototype";
import {addRegistryCategory} from "../../decorators/define/define";

const elementSymbol = Symbol("___element___");

/**
 * @class GradumProxiedElement
 * @group MVC
 * @category Element Classes
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description GradumProxiedElement class, similar to GradumElement but containing an HTML element instead of being one.
 */
class GradumProxiedElement<
    ElementTag extends ValidTag = ValidTag,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter<any>
> {
    /**
     * @description Default properties assigned to a new instance.
     */
    public static defaultProperties: GradumElementProperties = {
        defaultSelectedClasses: "selected"
    };

    /**
     * @function create
     * @static
     * @description Instantiate this class with the given properties. Defaults declared by every class in the
     * inheritance chain are applied first, nearest ancestor last, so a subclass' `defaultProperties` win over
     * its parent's. The return type follows the class it is called on, so a subclass gets its own type back.
     * @param {PropertiesType} [properties] - Properties to set on the new instance.
     * @returns {InstanceType<Type>} The created instance.
     */
    public static create<
        This extends {prototype: GradumProxiedElement},
        ElementTag extends ValidTag = ValidTag,
        ViewType extends GradumView = GradumView<any, any>,
        DataType extends object = object,
        ModelType extends GradumModel = GradumModel,
        EmitterType extends GradumEmitter = GradumEmitter<any>
    >(
        this: This,
        properties?: This["prototype"]["properties"]
            & GradumProxiedProperties<ElementTag, ViewType, DataType, ModelType, EmitterType>
    ): This["prototype"] & GradumProxiedElement<ElementTag, ViewType, DataType, ModelType, EmitterType> {
        const props = properties ?? {};
        const prototypeChain = getPrototypeChain(this);
        for (const prototype of prototypeChain) gradum(props).applyDefaults(prototype["defaultProperties"] ?? {});
        return (this as any).customCreate.call(this, props);
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
        const obj = new this();
        obj[elementSymbol] = blindElement({tag: properties["tag"]});
        // gradum(obj) without raw unwraps to obj.element, which is the same key the model getter
        // resolves to later. Using raw=true here would key MVC data under obj instead, making
        // gradum(obj).model return undefined during initialize().
        // The back-reference lets extractClassEssenceName walk obj's prototype chain (FlowEntry,
        // etc.) instead of the raw SVGGElement chain, so handler/operator key derivation works.
        obj[elementSymbol][proxyWrapperSymbol] = obj;
        const shouldInitialize = properties["initialize"] !== false;
        gradum(obj).setProperties(Object.assign({}, properties, {initialize: false}));

        // Dispatch custom wrapper setters that setProperties couldn't reach.
        // gradum(obj) routes through obj.element (the raw DOM node), so properties that have no
        // meaning on the raw element (e.g. FlowEntry.flow) are silently dropped. We replay them
        // onto obj directly — but only when: (1) not an MVC field already handled by GradumSelector,
        // (2) the raw element has no descriptor for the key (setProperties already handled it), and
        // (3) obj's prototype chain has a real setter for the key.
        const rawEl = obj[elementSymbol];
        for (const [key, value] of Object.entries(properties)) {
            if ((MvcFields as string[]).includes(key)) continue;
            if (getFirstDescriptorInChain(rawEl, key)) continue;
            const desc = getFirstDescriptorInChain(obj, key);
            if (desc?.set) obj[key] = value;
        }

        if (shouldInitialize && typeof obj["initialize"] === "function") obj["initialize"]();
        return obj;
    }

    public declare readonly properties: GradumProxiedProperties<ElementTag, ViewType, DataType, ModelType, EmitterType>;

    /**
     * @description The HTML (or other) element wrapped inside this instance.
     */
    public get element(): ValidElement<ElementTag> {
        return this[elementSymbol];
    }

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
}

(() => {
    defineDefaultProperties(GradumProxiedElement);
    defineMvcAccessors(GradumProxiedElement);
    defineUIPrototype(GradumProxiedElement);
})();

addRegistryCategory(GradumProxiedElement);
export {GradumProxiedElement};