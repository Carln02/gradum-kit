import {GradumView} from "../../mvc/view/view";
import {GradumModel} from "../../mvc/model/model";
import {GradumEmitter} from "../../mvc/emitter/emitter";
import {GradumElementMvcInterface} from "../setup/mvc/mvc.types";
import {GradumElementDefaultInterface} from "../setup/default/default.types";
import {MvcGenerationProperties} from "../../gradumFunctions/mvc/mvc.types";

/**
 * @type {GradumHeadlessProperties}
 * @group GradumElement
 * @category GradumHeadlessElement
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Object containing properties for configuring a headless (non-HTML) element, with possibly MVC properties.
 */
type GradumHeadlessProperties<
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = MvcGenerationProperties<ViewType, DataType, ModelType, EmitterType> & {
    out?: string | Node,
    [key: string]: any
};

declare module "./gradumHeadlessElement" {
    interface GradumHeadlessElement extends GradumElementDefaultInterface {}

    interface GradumHeadlessElement<
        ViewType extends GradumView = GradumView<any, any>,
        DataType extends object = object,
        ModelType extends GradumModel = GradumModel
    > extends GradumElementMvcInterface<ViewType, DataType, ModelType> {}
}

export {GradumHeadlessProperties};