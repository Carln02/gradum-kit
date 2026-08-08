import {GradumIconProperties} from "../icon.types";
import {StatefulReifectProperties} from "../../../wrappers/statefulReifect/statefulReifect.types";
import {GradumIcon} from "../icon";
import {StatefulReifect} from "../../../wrappers/statefulReifect/statefulReifect";
import {GradumModel} from "../../../../mvc/model/model";
import {GradumView} from "../../../../mvc/view/view";
import {GradumEmitter} from "../../../../mvc/emitter/emitter";
import {GradumIconSwitch} from "./iconSwitch";

/**
 * @group Components
 * @category GradumIconSwitch
 */
type GradumIconSwitchProperties<
    State extends string | number | symbol,
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumIconProperties<ViewType, DataType, ModelType, EmitterType> & {
    switchReifect?: StatefulReifect<State, GradumIcon> | StatefulReifectProperties<State, GradumIcon>;
    defaultState?: State;
    appendStateToIconName?: boolean
};

declare module "../../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-icon-switch": GradumIconSwitch
    }
}

export {GradumIconSwitchProperties};