import {defineDefaultProperties} from "../setup/default/default";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {getPrototypeChain} from "../../utils/dataManipulation/prototype";
import {addRegistryCategory} from "../../decorators/define/define";

/**
 * @class GradumBaseElement
 * @group MVC
 * @category Element Classes
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description GradumHeadlessElement class, similar to GradumElement but without extending HTMLElement.
 */
class GradumBaseElement {
    /**
     * @description Default properties assigned to a new instance.
     */
    public static defaultProperties: object = {};

    /**
     * @function create
     * @static
     * @description Instantiate this class with the given properties. Defaults declared by every class in the
     * inheritance chain are applied first, nearest ancestor last, so a subclass' `defaultProperties` win over
     * its parent's. The return type follows the class it is called on, so a subclass gets its own type back.
     * @param {PropertiesType} [properties] - Properties to set on the new instance.
     * @returns {InstanceType<Type>} The created instance.
     */
    public static create<This extends {prototype: GradumBaseElement}>(
        this: This, properties: This["prototype"]["properties"] = {}
    ): This["prototype"] {
        return (this as any).customCreate.call(this, properties);
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
        const obj = new this();
        gradum(obj).setProperties(properties);
        return obj;
    }
}

(() => {
    defineDefaultProperties(GradumBaseElement);
})();

addRegistryCategory(GradumBaseElement);
export {GradumBaseElement};