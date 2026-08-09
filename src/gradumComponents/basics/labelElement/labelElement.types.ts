import {ValidTag} from "../../../types/element.types";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumRichElementProperties} from "../richElement/richElement.types";

/**
 * @type {GradumLabelElementProperties}
 * @group Components
 * @category GradumLabelElement
 *
 * @extends GradumRichElementProperties
 * @template {ValidTag} ElementTag - The tag of the main element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumLabelElement} — a rich element paired with a
 * `label` bound to it.
 * @property {string} [label] - Text of the label shown next to the element.
 * @property {boolean} [locked=false] - Whether the element rejects user edits.
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