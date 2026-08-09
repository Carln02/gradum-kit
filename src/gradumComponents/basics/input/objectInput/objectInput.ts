import {GradumInput} from "../input";
import {GradumView} from "../../../../mvc/view/view";
import {GradumModel} from "../../../../mvc/model/model";
import {GradumEmitter} from "../../../../mvc/emitter/emitter";
import {signal} from "../../../../decorators/reactivity/reactivity";
import {ValidElement} from "../../../../types/element.types";
import {GradumProperties} from "../../../../gradumFunctions/element/element.types";

/**
 * @internal
 * @class GradumObjectInput
 * @description A {@link GradumInput} whose backing `element` accessor is reactive, so effects re-run when
 * the underlying input or textarea node is swapped out. Not currently exported or referenced anywhere.
 */
class GradumObjectInput<
    InputTag extends "input" | "textarea" = "input",
    ValueType = string,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter,
> extends GradumInput<InputTag, ValueType, ViewType, DataType, ModelType, EmitterType> {
    /**
     * @description The underlying input element, made reactive so effects re-run when it is swapped out.
     */
    @signal public get element(): ValidElement<InputTag> {
        return super.element;
    }

    public set element(value: GradumProperties<InputTag> | ValidElement<InputTag>) {
        super.element = value;
    }
}