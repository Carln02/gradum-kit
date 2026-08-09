import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumElementProperties} from "../../../gradumElement/gradumElement.types";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {Coordinate} from "../../../types/basic.types";
import {GradumPopup} from "./popup";

/**
 * @group Components
 * @category Containers
 */
type GradumPopupProperties<
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    anchor?: Element,
    popupPosition?: Coordinate,
    anchorPosition?: Coordinate,
    fallbackModes?: PopupFallbackMode | Coordinate<PopupFallbackMode>,
    viewportMargin?: number | Coordinate,
    offsetFromAnchor?: number | Coordinate,
};

/**
 * @group Components
 * @category Containers
 */
enum PopupFallbackMode {
    invert = "invert",
    offset = "offset",
    none = "none"
}

declare module "../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-popup": GradumPopup
    }
}

export {GradumPopupProperties, PopupFallbackMode};