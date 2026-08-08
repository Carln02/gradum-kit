import {GradumInputProperties} from "../input.types";
import {GradumView} from "../../../../mvc/view/view";
import {GradumModel} from "../../../../mvc/model/model";
import {GradumEmitter} from "../../../../mvc/emitter/emitter";
import {GradumNumericalInput} from "./numericalInput";

/**
 * @group Components
 * @category GradumNumericalInput
 */
type GradumNumericalInputProperties<
    ValueType = string,
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter,
> = GradumInputProperties<"input", ValueType, ViewType, DataType, ModelType, EmitterType> & {
    multiplier?: number,
    decimalPlaces?: number,

    min?: number,
    max?: number,
};

declare module "../../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-numerical-inout": GradumNumericalInput
    }
}

export {GradumNumericalInputProperties};