import {GradumRichElementProperties} from "../richElement/richElement.types";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumProperties} from "../../../gradumFunctions/element/element.types";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {ValidElement} from "../../../types/element.types";
import {GradumInput} from "./input";

/**
 * @group Components
 * @category GradumInput
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
        "gradum-inout": GradumInput
    }
}

export {GradumInputProperties};