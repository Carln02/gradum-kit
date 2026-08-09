import {GradumSelectProperties} from "../select/select.types";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumElementProperties} from "../../../gradumElement/gradumElement.types";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumSelectElement} from "./selectElement";

/**
 * @type {GradumSelectElementProperties}
 * @group Components
 * @category GradumSelectElement
 *
 * @extends GradumElementProperties
 * @extends GradumSelectProperties
 * @template ValueType - The type of the value held by each entry.
 * @template SecondaryValueType - The type of each entry's secondary value.
 * @template {HTMLElement} EntryType - The type of the entry elements.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties for configuring a {@link GradumSelectElement} — everything a selection accepts,
 * plus the element-level options and the classes applied to its entries.
 * @property {string | string[]} [entriesClasses] - CSS class(es) applied to every entry.
 * @property {string | string[]} [selectedEntriesClasses] - CSS class(es) applied to selected entries.
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