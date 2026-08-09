import {GradumIconProperties} from "../icon.types";
import {GradumIconToggle} from "./iconToggle";
import {GradumView} from "../../../../mvc/view/view";
import {GradumModel} from "../../../../mvc/model/model";
import {GradumEmitter} from "../../../../mvc/emitter/emitter";

/**
 * @group Components
 * @category Basics
 */
type GradumIconToggleProperties<
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumIconProperties<ViewType, DataType, ModelType, EmitterType> & {
    toggled?: boolean,
    toggleOnClick?: boolean,
    stopPropagationOnClick?: boolean,
    onToggle?: (value: boolean, el: GradumIconToggle) => void,
}

declare module "../../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-icon-toggle": GradumIconToggle
    }
}

export {GradumIconToggleProperties};