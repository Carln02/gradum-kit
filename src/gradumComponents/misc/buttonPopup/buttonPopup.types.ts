import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {ValidTag} from "../../../types/element.types";
import {GradumRichElementProperties} from "../../basics/richElement/richElement.types";
import {GradumButtonPopup} from "./buttonPopup";

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
type GradumButtonPopupProperties<
    ElementTag extends ValidTag = any,
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel<DataType>,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumRichElementProperties<ElementTag, ViewType, DataType, ModelType, EmitterType> & {
    popup?: HTMLElement;
    popupClasses?: string | string[];
};


declare module "../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-button-popup": GradumButtonPopup
    }
}

export {GradumButtonPopupProperties};