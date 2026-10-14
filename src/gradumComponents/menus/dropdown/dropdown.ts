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
     * @description The element that shows the current selection and opens the popup when clicked. Assign an
     * element to use your own; assign a string, or leave it unset, and the dropdown builds a
     * {@link GradumButton} carrying that text — or the selected value's — and keeps its text in step with
     * what is selected.
     */
    @auto({
        setIfUndefined: true,
        preprocessValue: function (value: string | HTMLElement) {
            if (value instanceof HTMLElement) return value;
            const text = typeof value === "string" ? value : stringify(this.select.getValue(this.entries[0]));
            //A button already built is relabelled rather than replaced — and handed back, since what this
            //returns is what gets stored. Returning nothing here would store nothing.
            if (this.selector instanceof GradumButton) {
                this.selector.text = text;
                return this.selector;
            }
            return GradumButton.create({text, elementTag: this.selectorTag});
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

    //Declared for the read type — `@auto` installs the accessor that actually answers, as it does for the
    //stub getters on GradumRichElement. Without one here, reads would be typed as the setter's input.
    public get selector(): HTMLElement {return}

    /**
     * @description The popup the entries sit in, shown when the selector is clicked. One is built on first
     * use if none is given; supplying your own replaces it, and the one it replaces is destroyed.
     */
    @auto({defaultValueCallback: () => GradumPopup.create()}) public set popup(value: HTMLElement) {
        const previous = this.installedPopup;
        this.installedPopup = value;

        if (value instanceof GradumPopup) value.anchor = this.selector;
        gradum(value).addClass(this.popupClasses);
        //Before the old one is destroyed, so the entries are carried across rather than taken down with it.
        this.select.parent = value;

        //A popup is parked in the shared popup container rather than kept inside the dropdown, so replacing
        //the reference is not enough to be rid of it — nothing would be left pointing at it. The one being
        //replaced is usually the default, built on the first read of `popup`: assigning a `selector` reads
        //it to anchor against, which happens before a supplied popup is applied.
        if (previous && previous !== value) gradum(previous).destroy();
    }

    /**
     * @private
     * @description The popup currently installed, so the next one can tell what it is replacing.
     */
    private installedPopup: HTMLElement;

    public initialize() {
        super.initialize();
        this.selector;
        gradum(document.body).on(DefaultEventName.click, e => {
            if (this.popupOpen && !this.contains(e.target as Node)) this.openPopup(false);
        }, {capture: true});
    }

    private openPopup(b: boolean) {
        if (this.popupOpen == b) return;
        this.popupOpen = b;
        if ("show" in this.popup && typeof this.popup.show === "function") this.popup.show(b);
        else gradum(this.popup).show(b);
    }

    /**
     * @description Take the dropdown off the page, and its popup with it. The popup is parked in the shared
     * popup container rather than kept inside the dropdown, so it is not carried off by the dropdown being
     * removed — it has to be removed itself.
     */
    public remove(): void {
        gradum(this.popup).remove();
        super.remove();
    }

    /**
     * @function destroy
     * @description Get rid of the dropdown and its popup, listeners included. What
     * {@link GradumSelector.destroy} calls when a subtree holding a dropdown is destroyed.
     */
    public destroy(): this {
        gradum(this.popup).destroy();
        return this;
    }
}

define(GradumDropdown);
export {GradumDropdown};