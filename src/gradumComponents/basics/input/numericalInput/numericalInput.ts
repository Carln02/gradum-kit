import {GradumInput} from "../input";
import {define} from "../../../../decorators/define/define";
import {GradumView} from "../../../../mvc/view/view";
import {GradumModel} from "../../../../mvc/model/model";
import {GradumEmitter} from "../../../../mvc/emitter/emitter";
import {GradumNumericalInputProperties} from "./numericalInput.types";

/**
 * @group Components
 * @category Basics
 */
class GradumNumericalInput<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumInput<"input", number, ViewType, DataType, ModelType, EmitterType> {
     public declare readonly properties: GradumNumericalInputProperties<number, ViewType, DataType, ModelType, EmitterType>;

    /**
     * @static
     * @description Default properties assigned to a new numerical input: patterns that allow a number to be
     * typed one character at a time, but require a complete number once editing ends.
     */
    public static defaultProperties: GradumNumericalInputProperties = {
        inputRegexCheck: /^(?!-0?(\.0+)?$)-?(0|[1-9]\d*)?(\.\d+)?\.?$|^-$|^$/,
        blurRegexCheck: /^(?!-0?(\.0+)?$)-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/,
    }

    /**
     * @description A factor between the displayed text and the value read back, for showing a value in one
     * unit while storing it in another. The text is divided by it on read and multiplied on write.
     */
    public multiplier: number = 1;
    /**
     * @description How many decimal places values are rounded to. Leave unset to keep full precision.
     */
    public decimalPlaces: number;

    /**
     * @description The lowest accepted value. Anything lower is clamped up to it.
     */
    public min: number;
    /**
     * @description The highest accepted value. Anything higher is clamped down to it.
     */
    public max: number;

    /**
     * @description The input's numeric value. Assigning clamps it to the configured range, rounds it to the
     * configured precision, and writes the scaled result back to the element.
     */
    public get value(): number {
        return this.element ? Number.parseFloat(this.element.value) / this.multiplier : undefined;
    }

    public set value(value: string | number) {
        if (!value || value == "") value = 0;
        if (typeof value == "string") value = Number.parseFloat(value);

        value *= this.multiplier;

        if (this.min != undefined && value < this.min) value = this.min;
        if (this.max != undefined && value > this.max) value = this.max;

        if (this.decimalPlaces != undefined) {
            value = Math.round(value * Math.pow(10, this.decimalPlaces)) / Math.pow(10, this.decimalPlaces);
        }

        super.value = value;
    }
}

define(GradumNumericalInput);
export {GradumNumericalInput};

