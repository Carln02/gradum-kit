import {GradumRichElementProperties} from "../richElement/richElement.types";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumProperties} from "../../../gradumFunctions/element/element.types";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {ValidElement} from "../../../types/element.types";
import {GradumInput} from "./input";

/**
 * @type {GradumInputProperties}
 * @group Components
 * @category GradumInput
 *
 * @template {"input" | "textarea"} InputTag - The tag of the inner input element.
 * @template ValueType - The type the input's string value is converted to and from.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumInput}. Extends
 * {@link GradumRichElementProperties} without `element` and `elementTag`, which the input sets itself.
 * @property {InputTag} [inputTag="input"] - Whether the field is an `input` or a `textarea`.
 * @property {GradumProperties<InputTag> | ValidElement<InputTag>} [input] - Properties for the inner input
 * element, or an existing element to use instead of creating one.
 * @property {string} [label] - Text of the label shown next to the field.
 * @property {boolean} [locked=false] - Whether the field rejects user edits.
 * @property {boolean} [dynamicVerticalResize=false] - Whether the field grows to fit its content as the
 * user types. Meant for `textarea`.
 * @property {RegExp | string} [inputRegexCheck] - Pattern the value must match while typing. Input that
 * would break the match is rejected as it is entered.
 * @property {RegExp | string} [blurRegexCheck] - Pattern the value must match when the field loses focus.
 * @property {boolean} [selectTextOnFocus=false] - Whether focusing the field selects all of its text.
 * @property {ValueType} [value] - Initial value of the field.
 * @property {string} [type] - Value of the input's `type` attribute.
 * @property {string} [placeholder] - Text shown while the field is empty.
 * @property {string} [pattern] - Value of the input's `pattern` attribute.
 * @property {string} [size] - Value of the input's `size` attribute.
 */
type GradumInputProperties<
    InputTag extends "input" | "textarea" = "input",
    ValueType = string,
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter,
> = Omit<GradumRichElementProperties<InputTag, ViewType, DataType, ModelType, EmitterType>, "element" | "elementTag"> & {
    inputTag?: InputTag;
    input?: GradumProperties<InputTag> | ValidElement<InputTag>,
    label?: string,

    locked?: boolean,
    dynamicVerticalResize?: boolean,

    inputRegexCheck?: RegExp | string,
    blurRegexCheck?: RegExp | string,

    selectTextOnFocus?: boolean,

    value?: ValueType,
    type?: string,
    placeholder?: string,
    pattern?: string,
    size?: string
};


declare module "../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-input": GradumInput
    }
}

export {GradumInputProperties};