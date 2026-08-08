import {GradumSelectProperties} from "../../basics/select/select.types";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumElementProperties} from "../../../gradumElement/gradumElement.types";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {HTMLTag} from "../../../types/htmlElement.types";
import {GradumSelectElementProperties} from "../../basics/selectElement/selectElement.types";
import {GradumDropdown} from "./dropdown";

/**
 * @type {GradumDropdownProperties}
 * @group Components
 * @category GradumDropdown
 *
 * @description Properties for configuring a Dropdown.
 * @extends GradumProperties
 *
 * @property {(string | HTMLElement)} [selector] - Element or descriptor used as the dropdown selector. If a
 * string is passed, a Button with the given string as text will be assigned as the selector.
 * @property {HTMLElement} [popup] - The element used as a container for the dropdown entries.
 *
 * @property {boolean} [multiSelection=false] - Enables selection of multiple dropdown entries.
 *
 * @property {ValidTag} [selectorTag] - Custom HTML tag for the selector's text. Overrides the
 * default tag set in GradumConfig.Dropdown.
 *
 * @property {string | string[]} [selectorClasses] - Custom CSS class(es) for the selector. Overrides the default
 * classes set in GradumConfig.Dropdown.
 * @property {string | string[]} [popupClasses] - Custom CSS class(es) for the popup container. Overrides the
 * default classes set in GradumConfig.Dropdown.
 */
type GradumDropdownProperties<
    ValueType = string,
    SecondaryValueType = string,
    EntryType extends HTMLElement = HTMLElement,
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel<DataType>,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumSelectElementProperties<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType> & {
    selector?: string | HTMLElement;
    popup?: HTMLElement;
    selectorTag?: HTMLTag;
    selectorClasses?: string | string[];
    popupClasses?: string | string[];
};


declare module "../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-dropdown": GradumDropdown
    }
}

export {GradumDropdownProperties};