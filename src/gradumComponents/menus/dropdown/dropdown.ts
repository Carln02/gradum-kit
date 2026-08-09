import {GradumButton} from "../../basics/button/button";
import "./dropdown.css";
import {GradumSelect} from "../../basics/select/select";
import {GradumPopup} from "../../containers/popup/popup";
import {define} from "../../../decorators/define/define";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {auto} from "../../../decorators/auto/auto";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {HTMLTag} from "../../../types/htmlElement.types";
import {DefaultEventName} from "../../../types/eventNaming.types";
import {stringify} from "../../../utils/dataManipulation/string";
import {Propagation} from "../../../gradumFunctions/event/event.types";
import {GradumSelectElement} from "../../basics/selectElement/selectElement";
import {GradumDropdownProperties} from "./dropdown.types";

/**
 * @class GradumDropdown
 * @group Components
 * @category Menus
 *
 * @extends GradumElement
 * @description Dropdown class for creating Gradum button elements.
 */
class GradumDropdown<
    ValueType = string,
    SecondaryValueType = string,
    EntryType extends HTMLElement = HTMLElement,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumSelectElement<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType> {
    //TODO MOVE DEFAULT CLICK TO MAIN CONFIG
     public declare readonly properties: GradumDropdownProperties;
    /**
     * @static
     * @description Default properties assigned to a new dropdown. Its selector is rendered as an `<h4>`.
     */
    public static defaultProperties: GradumDropdownProperties = {
        selectorTag: "h4",
    };

    /**
     * @readonly
     * @description The selection logic backing this dropdown. Clicking an entry closes the popup.
     */
    public readonly select: GradumSelect<ValueType, SecondaryValueType, EntryType> = GradumSelect.create({
        onEntryClicked: () => this.openPopup(false)
    }) as any;

    private popupOpen: boolean = false;

    /**
     * @description The tag used to build the selector element that shows the current selection.
     */
    public selectorTag: HTMLTag;

    @auto({
        callBefore: function () {gradum(this.selector).removeClass(this.selectorClasses)},
        callAfter: function () {gradum(this.selector).addClass(this.selectorClasses)}
    }) public selectorClasses: string | string[];

    @auto({
        callBefore: function () {gradum(this.popup).removeClass(this.popupClasses)},
        callAfter: function () {gradum(this.popup).addClass(this.popupClasses)}
    }) public popupClasses: string | string[];

    /**
     * The dropdown's selector element.
     */
    @auto({
        setIfUndefined: true,
        preprocessValue: function (value: string | HTMLElement) {
            if (value instanceof HTMLElement) return value;
            const text = typeof value === "string" ? value : stringify(this.select.getValue(this.entries[0]));
            if (this.selector instanceof GradumButton) this.selector.text = text;
            else return GradumButton.create({text, elementTag: this.selectorTag});
        }
    }) public set selector(value: string | HTMLElement) {
        if (!(value instanceof HTMLElement)) return;
        gradum(value)
            .addClass(this.selectorClasses)
            .on(DefaultEventName.click, (e) => {
                this.openPopup(!this.popupOpen);
                return Propagation.stopPropagation;
            });
        if (this.popup instanceof GradumPopup) this.popup.anchor = value;
        gradum(this).addChild(value);
        if (value instanceof GradumButton) this.select.onSelect = () => value.text = this.stringSelectedValue;
    }

    public get selector(): HTMLElement {return}

    /**
     * The dropdown's popup element.
     */
    @auto({defaultValueCallback: () => GradumPopup.create()}) public set popup(value: HTMLElement) {
        if (value instanceof GradumPopup) value.anchor = this.selector;
        gradum(value).addClass(this.popupClasses);
        this.select.parent = value;
    }

    public initialize() {
        super.initialize();
        this.selector;
        gradum(document.body).on(DefaultEventName.click, () => e => {
            if (this.popupOpen && !this.contains(e.target as Node)) this.openPopup(false);
        }, {capture: true});
    }

    private openPopup(b: boolean) {
        if (this.popupOpen == b) return;
        this.popupOpen = b;
        if ("show" in this.popup && typeof this.popup.show === "function") this.popup.show(b);
        else gradum(this.popup).show(b);
    }
}

define(GradumDropdown);
export {GradumDropdown};