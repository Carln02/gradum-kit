import {StatefulReifect} from "../../wrappers/statefulReifect/statefulReifect";
import {StatefulReifectProperties} from "../../wrappers/statefulReifect/statefulReifect.types";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumElementProperties} from "../../../gradumElement/gradumElement.types";
import {InOut} from "../../../types/enums.types";
import {GradumMarkingMenu} from "./markingMenu";

/**
 * @group Components
 * @category GradumMarkingMenu
 */
type GradumMarkingMenuProperties<
    ValueType = string,
    SecondaryValueType = string,
    EntryType extends HTMLElement = HTMLElement,
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel
> = GradumElementProperties<ViewType, DataType, ModelType> & {
    transition?: StatefulReifect<InOut> | StatefulReifectProperties<InOut>,

    startAngle?: number,
    endAngle?: number,

    semiMajor?: number,
    semiMinor?: number,
    minDragDistance?: number
}


declare module "../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-marking-menu": GradumMarkingMenu
    }
}

export {GradumMarkingMenuProperties};