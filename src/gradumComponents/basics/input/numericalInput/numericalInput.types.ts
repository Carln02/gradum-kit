import {GradumInputProperties} from "../input.types";
import {GradumView} from "../../../../mvc/view/view";
import {GradumModel} from "../../../../mvc/model/model";
import {GradumEmitter} from "../../../../mvc/emitter/emitter";
import {GradumNumericalInput} from "./numericalInput";

/**
 * @type {GradumNumericalInputProperties}
 * @group Components
 * @category Basics
 *
 * @template ValueType - The type the input's string value is converted to and from.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumNumericalInput}. Extends
 * {@link GradumInputProperties} with the numeric constraints applied to the entered value.
 * @property {number} [multiplier=1] - Factor applied between the displayed value and the stored one.
 * @property {number} [decimalPlaces] - How many decimals the value is rounded to. Left unrounded if omitted.
 * @property {number} [min] - Lowest accepted value. The value is clamped to it.
 * @property {number} [max] - Highest accepted value. The value is clamped to it.
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
        "gradum-numerical-input": GradumNumericalInput
    }
}

export {GradumNumericalInputProperties};