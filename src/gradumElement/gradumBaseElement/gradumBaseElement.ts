import {defineDefaultProperties} from "../setup/default/default";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {getPrototypeChain} from "../../utils/dataManipulation/prototype";
import {addRegistryCategory} from "../../decorators/define/define";

/**
 * @class GradumBaseElement
 * @group GradumElement
 * @category GradumBaseElement
 *
 * @description GradumHeadlessElement class, similar to GradumElement but without extending HTMLElement.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 */
class GradumBaseElement {
    /**
     * @description Default properties assigned to a new instance.
     */
    public static defaultProperties: object = {};

    public static create<Type extends new (...args: any[]) => GradumBaseElement>
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
}

(() => {
    defineDefaultProperties(GradumBaseElement);
})();

addRegistryCategory(GradumBaseElement);
export {GradumBaseElement};