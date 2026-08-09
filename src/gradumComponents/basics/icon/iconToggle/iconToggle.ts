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
 * @category Basics
 */
class GradumIconToggle<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumIcon<ViewType, DataType, ModelType, EmitterType> {
     public declare readonly properties: GradumIconToggleProperties;
    /**
     * @description Whether a click that toggles this icon stops propagating, keeping ancestors from also
     * reacting to it.
     */
    public stopPropagationOnClick: boolean = true;

    /**
     * @description Called with the new state whenever the icon is toggled.
     */
    public onToggle: (value: boolean, el: GradumIconToggle) => void;
    private clickListener = () => {
        this.toggle();
        return this.stopPropagationOnClick;
    }

    /**
     * @description Whether the icon is currently toggled on. Assigning fires
     * {@link GradumIconToggle.onToggle}.
     */
    @auto({initialValue: false})
    public set toggled(value: boolean) {
        if (this.onToggle) this.onToggle(value, this);
    }

    /**
     * @description Whether clicking the icon toggles it. Assigning attaches or removes the click listener.
     */
    @auto({initialValue: false})
    public set toggleOnClick(value: boolean) {
        if (value) gradum(this).on(DefaultEventName.click, this.clickListener);
        else gradum(this).removeListener(DefaultEventName.click, this.clickListener);
    }

    /**
     * @function toggle
     * @description Flip the icon's state, firing {@link GradumIconToggle.onToggle}.
     */
    public toggle() {
        this.toggled = !this.toggled;
    }
}

define(GradumIconToggle);
export {GradumIconToggle};