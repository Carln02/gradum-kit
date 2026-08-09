import {GradumIconSwitchProperties} from "../../basics/icon/iconSwitch/iconSwitch.types";
import {GradumIconSwitch} from "../../basics/icon/iconSwitch/iconSwitch";
import {Reifect} from "../../wrappers/reifect/reifect";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumElementProperties} from "../../../gradumElement/gradumElement.types";
import {GradumProperties} from "../../../gradumFunctions/element/element.types";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {Open, Side} from "../../../types/enums.types";
import {PartialRecord} from "../../../types/basic.types";
import {GradumDrawer} from "./drawer";

/**
 * @group Components
 * @category Containers
 */
type GradumDrawerProperties<
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    side?: Side,
    offset?: number | PartialRecord<Open, number>
    hideOverflow?: boolean,

    panel?: GradumProperties | HTMLElement,
    thumb?: GradumProperties | HTMLElement,

    icon?: string | Element | GradumIconSwitchProperties<Side> | GradumIconSwitch<Side>;
    attachSideToIconName?: boolean;
    rotateIconBasedOnSide?: boolean;

    open?: boolean,
    transition?: Reifect<HTMLElement>
}

declare module "../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-drawer": GradumDrawer
    }
}

export {GradumDrawerProperties};