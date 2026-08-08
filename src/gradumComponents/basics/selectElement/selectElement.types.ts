import {GradumSelectProperties} from "../select/select.types";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumElementProperties} from "../../../gradumElement/gradumElement.types";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumSelectElement} from "./selectElement";

/**
 * @type {GradumSelectElementProperties}
 * @group Components
 * @category GradumDropdown
 *
 * @description Properties for configuring a Dropdown.
 * @extends GradumProperties
 *
 * @property {string | string[]} [entriesClasses] - CSS class(es) for dropdown entries.
 * @property {string | string[]} [selectedEntriesClasses] - CSS class(es) for selected entries.
 */
type GradumSelectElementProperties<
    ValueType = string,
    SecondaryValueType = string,
    EntryType extends HTMLElement = HTMLElement,
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel<DataType>,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType>
    & GradumSelectProperties<ValueType, SecondaryValueType, EntryType> & {
    entriesClasses?: string | string[];
    selectedEntriesClasses?: string | string[];
};

declare module "../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-select-element": GradumSelectElement
    }
}

export {GradumSelectElementProperties};