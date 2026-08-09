import {GradumIconProperties} from "../icon.types";
import {StatefulReifectProperties} from "../../../wrappers/statefulReifect/statefulReifect.types";
import {GradumIcon} from "../icon";
import {StatefulReifect} from "../../../wrappers/statefulReifect/statefulReifect";
import {GradumModel} from "../../../../mvc/model/model";
import {GradumView} from "../../../../mvc/view/view";
import {GradumEmitter} from "../../../../mvc/emitter/emitter";
import {GradumIconSwitch} from "./iconSwitch";

/**
 * @type {GradumIconSwitchProperties}
 * @group Components
 * @category Basics
 *
 * @extends GradumIconProperties
 * @template {string | number | symbol} State - The set of states the icon can switch between.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumIconSwitch} — an icon that swaps its appearance as
 * its state changes.
 * @property {StatefulReifect<State, GradumIcon> | StatefulReifectProperties<State, GradumIcon>} [switchReifect] -
 * The reifect driving the transition between states, or the properties to build one from.
 * @property {State} [defaultState] - The state the icon starts in.
 * @property {boolean} [appendStateToIconName=false] - Whether the current state is appended to the icon name,
 * so each state loads its own icon file.
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