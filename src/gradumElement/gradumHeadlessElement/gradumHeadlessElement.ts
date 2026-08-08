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
 * @group GradumElement
 * @category GradumHeadlessElement
 *
 * @description GradumHeadlessElement class, similar to GradumElement but without extending HTMLElement.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
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

    public static create<Type extends new (...args: any[]) => GradumHeadlessElement>
    (this: Type, properties: InstanceType<Type>["properties"] = {}): InstanceType<Type> {
        return (this as any).customCreate.call(this, properties);
    }

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