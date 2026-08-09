import "./button.types";
import "./button.css";
import {GradumRichElement} from "../richElement/richElement";
import {define} from "../../../decorators/define/define";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {ValidTag} from "../../../types/element.types";

/**
 * @class GradumButton
 * @group Components
 * @category Basics
 *
 * @extends GradumElement
 * @description Button class for creating Gradum button elements.
 */
class GradumButton<
    ElementTag extends ValidTag = any,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumRichElement<ElementTag, ViewType, DataType, ModelType, EmitterType> {
}

define(GradumButton);
export {GradumButton};