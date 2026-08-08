import {GradumInput} from "../input";
import {GradumView} from "../../../../mvc/view/view";
import {GradumModel} from "../../../../mvc/model/model";
import {GradumEmitter} from "../../../../mvc/emitter/emitter";
import {signal} from "../../../../decorators/reactivity/reactivity";
import {ValidElement} from "../../../../types/element.types";
import {GradumProperties} from "../../../../gradumFunctions/element/element.types";

class GradumObjectInput<
    InputTag extends "input" | "textarea" = "input",
    ValueType = string,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter,
> extends GradumInput<InputTag, ValueType, ViewType, DataType, ModelType, EmitterType> {
    @signal public get element(): ValidElement<InputTag> {
        return super.element;
    }

    public set element(value: GradumProperties<InputTag> | ValidElement<InputTag>) {
        super.element = value;
    }
}