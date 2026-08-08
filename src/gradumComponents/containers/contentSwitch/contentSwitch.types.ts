import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumElementProperties} from "../../../gradumElement/gradumElement.types";
import {Shown} from "../../../types/enums.types";
import {StatefulReifect} from "../../wrappers/statefulReifect/statefulReifect";
import {StatefulReifectProperties} from "../../wrappers/statefulReifect/statefulReifect.types";
import {GradumContentSwitch} from "./contentSwitch";

enum ContentSwitchMode {
    fadeLeft = "fadeLeft",
    fadeRight = "fadeRight",
    carousel = "carousel"
}

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