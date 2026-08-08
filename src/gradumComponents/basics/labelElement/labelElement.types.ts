import {ValidTag} from "../../../types/element.types";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumRichElementProperties} from "../richElement/richElement.types";

/**
 * @group Components
 * @category GradumLabelElement
 */
type GradumLabelElementProperties<
    ElementTag extends ValidTag = any,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumRichElementProperties<ElementTag, ViewType, DataType, ModelType, EmitterType> & {
    label?: string,
    locked?: boolean,
};

export {GradumLabelElementProperties};