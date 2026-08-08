import {GradumInput} from "../input";
import {define} from "../../../../decorators/define/define";
import {GradumView} from "../../../../mvc/view/view";
import {GradumModel} from "../../../../mvc/model/model";
import {GradumEmitter} from "../../../../mvc/emitter/emitter";
import {GradumNumericalInputProperties} from "./numericalInput.types";

/**
 * @group Components
 * @category GradumNumericalInput
 */
class GradumNumericalInput<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumInput<"input", number, ViewType, DataType, ModelType, EmitterType> {
     public declare readonly properties: GradumNumericalInputProperties<number, ViewType, DataType, ModelType, EmitterType>;

    public static defaultProperties: GradumNumericalInputProperties = {
        inputRegexCheck: /^(?!-0?(\.0+)?$)-?(0|[1-9]\d*)?(\.\d+)?\.?$|^-$|^$/,
        blurRegexCheck: /^(?!-0?(\.0+)?$)-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/,
    }

    public multiplier: number = 1;
    public decimalPlaces: number;

    public min: number;
    public max: number;

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

