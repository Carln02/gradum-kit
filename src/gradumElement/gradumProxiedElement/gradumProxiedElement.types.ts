import {GradumProperties} from "../../gradumFunctions/element/element.types";
import {GradumHeadlessProperties} from "../gradumHeadlessElement/gradumHeadlessElement.types";
import {GradumView} from "../../mvc/view/view";
import {GradumEmitter} from "../../mvc/emitter/emitter";
import {GradumModel} from "../../mvc/model/model";
import {GradumElementDefaultInterface} from "../setup/default/default.types";
import {GradumElementMvcInterface} from "../setup/mvc/mvc.types";
import {GradumElementUiInterface} from "../setup/ui/ui.types";
import {ValidTag} from "../../types/element.types";

/**
 * @group GradumElement
 * @category GradumProxiedElement
 */
type GradumProxiedProperties<
    Tag extends ValidTag = "div",
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumProperties<Tag> & GradumHeadlessProperties<ViewType, DataType, ModelType, EmitterType> & {
    unsetDefaultClasses?: boolean,
    shadowDOM?: boolean,
    defaultSelectedClasses?: string | string[]
    defaultClasses?: string | string[],
};

declare module "./gradumProxiedElement" {
    interface GradumProxiedElement extends GradumElementDefaultInterface {}

    interface GradumProxiedElement<
        ElementTag extends ValidTag = ValidTag,
        ViewType extends GradumView = GradumView<any, any>,
        DataType extends object = object,
        ModelType extends GradumModel = GradumModel
    > extends GradumElementMvcInterface<ViewType, DataType, ModelType> {}

    interface GradumProxiedElement extends GradumElementUiInterface {}
}

export {GradumProxiedProperties};