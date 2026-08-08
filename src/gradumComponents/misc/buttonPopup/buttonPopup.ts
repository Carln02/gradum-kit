import {define} from "../../../decorators/define/define";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {ValidTag} from "../../../types/element.types";
import {GradumButton} from "../../basics/button/button";
import {GradumPopup} from "../../containers/popup/popup";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {DefaultEventName} from "../../../types/eventNaming.types";
import {auto} from "../../../decorators/auto/auto";
import {Propagation} from "../../../gradumFunctions/event/event.types";
import {GradumButtonPopupProperties} from "./buttonPopup.types";

/**
 * @class GradumButtonPopup
 * @group Components
 * @category GradumButton
 *
 * @description Button class for creating Gradum button elements.
 * @extends GradumElement
 */
class GradumButtonPopup<
    ElementTag extends ValidTag = any,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumButton<ElementTag, ViewType, DataType, ModelType, EmitterType> {
     public declare readonly properties: GradumButtonPopupProperties;
    private popupOpen: boolean = false;

    @auto({
        callBefore: function () {gradum(this.popup).removeClass(this.popupClasses)},
        callAfter: function () {gradum(this.popup).addClass(this.popupClasses)}
    }) public popupClasses: string | string[];

    /**
     * The dropdown's popup element.
     */
    @auto({defaultValueCallback: () => GradumPopup.create()}) public set popup(value: HTMLElement) {
        if (value instanceof GradumPopup) value.anchor = this;
        gradum(value).addClass(this.popupClasses);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(document.body).on(DefaultEventName.click, () => e => {
            if (this.popupOpen && !this.contains(e.target as Node)) this.openPopup(false);
        }, {capture: true});

        gradum(this).on(DefaultEventName.click, (e) => {
            this.openPopup(!this.popupOpen);
            return Propagation.stopPropagation;
        });
    }

    private openPopup(b: boolean) {
        if (this.popupOpen == b) return;
        this.popupOpen = b;
        if ("show" in this.popup && typeof this.popup.show === "function") this.popup.show(b);
        else gradum(this.popup).show(b);
    }
}

define(GradumButtonPopup);
export {GradumButtonPopup};