import {GradumProxiedProperties} from "./gradumProxiedElement/gradumProxiedElement.types";
import {GradumEmitter} from "../mvc/emitter/emitter";
import {GradumModel} from "../mvc/model/model";
import {GradumView} from "../mvc/view/view";
import {GradumElementDefaultInterface} from "./setup/default/default.types";
import {GradumElementMvcInterface} from "./setup/mvc/mvc.types";
import {GradumElementUiInterface} from "./setup/ui/ui.types";

/**
 * @type {GradumElementProperties}
 * @group MVC
 * @category Element Classes
 *
 * @extends GradumProperties
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {object} DataType - The element's data type, if any.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description Object containing properties for configuring a custom HTML element. Is basically GradumProperties
 * without the tag.
 */
type GradumElementProperties<
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumProxiedProperties<"div", ViewType, DataType, ModelType, EmitterType>;

declare module "./gradumElement" {
    interface GradumElement {
        readonly tagName: string;
    }

    interface GradumElement extends GradumElementDefaultInterface {}

    interface GradumElement<
        ViewType extends GradumView = GradumView<any, any>,
        DataType extends object = object,
        ModelType extends GradumModel = GradumModel
    > extends GradumElementMvcInterface<ViewType, DataType, ModelType> {}

    interface GradumElement extends GradumElementUiInterface {}
}

export {GradumElementProperties};