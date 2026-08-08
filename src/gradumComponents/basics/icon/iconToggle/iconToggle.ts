import {GradumIcon} from "../icon";
import {define} from "../../../../decorators/define/define";
import {GradumView} from "../../../../mvc/view/view";
import {GradumModel} from "../../../../mvc/model/model";
import {auto} from "../../../../decorators/auto/auto";
import {gradum} from "../../../../gradumFunctions/gradumFunctions";
import {GradumEmitter} from "../../../../mvc/emitter/emitter";
import {DefaultEventName} from "../../../../types/eventNaming.types";
import {GradumIconToggleProperties} from "./iconToggle.types";

/**
 * @group Components
 * @category GradumIconToggle
 */
class GradumIconToggle<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumIcon<ViewType, DataType, ModelType, EmitterType> {
     public declare readonly properties: GradumIconToggleProperties;
    public stopPropagationOnClick: boolean = true;

    public onToggle: (value: boolean, el: GradumIconToggle) => void;
    private clickListener = () => {
        this.toggle();
        return this.stopPropagationOnClick;
    }

    @auto({initialValue: false})
    public set toggled(value: boolean) {
        if (this.onToggle) this.onToggle(value, this);
    }

    @auto({initialValue: false})
    public set toggleOnClick(value: boolean) {
        if (value) gradum(this).on(DefaultEventName.click, this.clickListener);
        else gradum(this).removeListener(DefaultEventName.click, this.clickListener);
    }

    public toggle() {
        this.toggled = !this.toggled;
    }
}

define(GradumIconToggle);
export {GradumIconToggle};