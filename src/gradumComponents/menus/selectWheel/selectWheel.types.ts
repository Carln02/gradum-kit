import {Reifect} from "../../wrappers/reifect/reifect";
import {StatelessReifectProperties} from "../../wrappers/reifect/reifect.types";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumElementProperties} from "../../../gradumElement/gradumElement.types";
import {Direction, Range} from "../../../types/enums.types";
import {PartialRecord} from "../../../types/basic.types";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumSelectWheel} from "./selectWheel";

/**
 * @group Components
 * @category Menus
 */
type GradumSelectWheelProperties<
    ValueType = string,
    SecondaryValueType = string,
    EntryType extends HTMLElement = HTMLElement,
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    direction?: Direction,
    reifect?: Reifect | StatelessReifectProperties,

    generateCustomStyling?: (properties: GradumSelectWheelStylingProperties)
        => string | PartialRecord<keyof CSSStyleDeclaration, string | number>;

    size?: number | Record<Range, number>,
    opacity?: Record<Range, number>,
    scale?: Record<Range, number>,

    alwaysOpen?: boolean,
}

/**
 * @group Components
 * @category Menus
 */
type GradumSelectWheelStylingProperties = {
    element: HTMLElement,
    translationValue: number,
    scaleValue: number,
    opacityValue: number,
    size: Record<Range, number>,
    defaultComputedStyles: PartialRecord<keyof CSSStyleDeclaration, string | number>
};


declare module "../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-select-wheel": GradumSelectWheel
    }
}

export {GradumSelectWheelProperties, GradumSelectWheelStylingProperties};