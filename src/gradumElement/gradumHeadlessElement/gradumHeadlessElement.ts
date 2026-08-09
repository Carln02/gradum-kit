import {GradumHeadlessProperties} from "./gradumHeadlessElement.types";
import {GradumView} from "../../mvc/view/view";
import {GradumModel} from "../../mvc/model/model";
import {GradumEmitter} from "../../mvc/emitter/emitter";
import {defineMvcAccessors} from "../setup/mvc/mvc";
import {defineDefaultProperties} from "../setup/default/default";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {getPrototypeChain} from "../../utils/dataManipulation/prototype";
import {addRegistryCategory} from "../../decorators/define/define";

/**
 * @class GradumHeadlessElement
 * @group MVC
 * @category Element Classes
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description GradumHeadlessElement class, similar to GradumElement but without extending HTMLElement.
 */
class GradumHeadlessElement<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter<any>
> {
    /**
     * @description Default properties assigned to a new instance.
     */
    public static defaultProperties: GradumHeadlessProperties = {};

    /**
     * @function create
     * @static
     * @description Instantiate this class with the given properties. Defaults declared by every class in the
     * inheritance chain are applied first, nearest ancestor last, so a subclass' `defaultProperties` win over
     * its parent's. The return type follows the class it is called on, so a subclass gets its own type back.
     * @param {PropertiesType} [properties] - Properties to set on the new instance.
     * @returns {InstanceType<Type>} The created instance.
     */
    public static create<Type extends new (...args: any[]) => GradumHeadlessElement>
    (this: Type, properties: InstanceType<Type>["properties"] = {}): InstanceType<Type> {
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

    public declare readonly properties: GradumHeadlessProperties<ViewType, DataType, ModelType, EmitterType>;
}

(() => {
    defineDefaultProperties(GradumHeadlessElement);
    defineMvcAccessors(GradumHeadlessElement);
})();

addRegistryCategory(GradumHeadlessElement);
export {GradumHeadlessElement};