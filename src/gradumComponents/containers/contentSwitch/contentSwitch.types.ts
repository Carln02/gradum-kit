import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumElementProperties} from "../../../gradumElement/gradumElement.types";
import {Shown} from "../../../types/enums.types";
import {StatefulReifect} from "../../wrappers/statefulReifect/statefulReifect";
import {StatefulReifectProperties} from "../../wrappers/statefulReifect/statefulReifect.types";
import {GradumContentSwitch} from "./contentSwitch";

/**
 * @enum {ContentSwitchMode}
 * @group Components
 * @category Containers
 *
 * @description How a {@link GradumContentSwitch} animates from the outgoing entry to the incoming one.
 * @property {ContentSwitchMode.fadeLeft} fadeLeft - The new entry fades in while sliding leftwards.
 * @property {ContentSwitchMode.fadeRight} fadeRight - The new entry fades in while sliding rightwards.
 * @property {ContentSwitchMode.carousel} carousel - Entries slide as one strip, in the direction of travel.
 */
enum ContentSwitchMode {
    fadeLeft = "fadeLeft",
    fadeRight = "fadeRight",
    carousel = "carousel"
}

/**
 * @type {GradumContentSwitchProperties}
 * @group Components
 * @category Containers
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties accepted when creating a {@link GradumContentSwitch}.
 * @property {ContentSwitchMode} [mode=ContentSwitchMode.fadeRight] - The transition played when the
 * selected entry changes.
 * @property {number} [transitionDuration=0.3] - How long that transition lasts, in seconds.
 * @property {StatefulReifect<Shown> | StatefulReifectProperties<Shown>} [transitionReifect] - The reifect
 * driving the transition. Pass an existing {@link StatefulReifect} to share one between components, or a
 * properties object to have one built.
 */
type GradumContentSwitchProperties<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    mode?: ContentSwitchMode;
    transitionDuration?: number;
    transitionReifect?: StatefulReifect<Shown> | StatefulReifectProperties<Shown>;
};

declare module "../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-content-switch": GradumContentSwitch;
    }
}

export {ContentSwitchMode, GradumContentSwitchProperties};