import {GradumIcon} from "../icon";
import {StatefulReifect} from "../../../wrappers/statefulReifect/statefulReifect";
import {StatefulReifectProperties} from "../../../wrappers/statefulReifect/statefulReifect.types";
import {define} from "../../../../decorators/define/define";
import {GradumView} from "../../../../mvc/view/view";
import {GradumModel} from "../../../../mvc/model/model";
import {auto} from "../../../../decorators/auto/auto";
import {GradumEmitter} from "../../../../mvc/emitter/emitter";
import {OnOff} from "../../../../types/enums.types";
import {GradumIconSwitchProperties} from "./iconSwitch.types";

/**
 * @group Components
 * @category GradumIconSwitch
 */
class GradumIconSwitch<
    State extends string | number | symbol = OnOff,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumIcon<ViewType, DataType, ModelType, EmitterType> {
     public declare readonly properties: GradumIconSwitchProperties<any>;

    public get switchReifect(): StatefulReifect<State, GradumIcon> {return}

    @auto({
        preprocessValue: function (value: StatefulReifect<State, GradumIcon> | StatefulReifectProperties<State, GradumIcon>) {
            if (value instanceof StatefulReifect) return value;
            else return new StatefulReifect<State, GradumIcon>(value || {});
        }
    }) public set switchReifect(value: StatefulReifect<State, GradumIcon> | StatefulReifectProperties<State, GradumIcon>) {
        this.switchReifect.attach(this);
        if (this.defaultState) this.switchReifect.apply(this.defaultState, this);
    }

    @auto() public set defaultState(value: State) {
        this.switchReifect?.apply(value, this);
    }

    @auto() public set appendStateToIconName(value: boolean) {
        if (value) {
            const properties: any = this.switchReifect.properties;
            this.switchReifect.states.forEach(state => {
               properties[state] = {...properties[state], icon: this.icon + "-" + state.toString()};
            });
            this.switchReifect.properties = properties;
        }
    }

    public initialize() {
        super.initialize();
        if (this.defaultState) this.switchReifect?.apply(this.defaultState, this);
    }
}

define(GradumIconSwitch);
export {GradumIconSwitch};