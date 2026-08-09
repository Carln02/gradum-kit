import {GradumRawEventProperties} from "../../../eventHandling/events/gradumEvent.types";

/**
 * @internal
 * @type {EntryData}
 * @description Per-entry state a select keeps for each of its entries.
 * @property {boolean} [enabled] - Whether the entry can be selected.
 * @property {boolean} [selected] - Whether the entry is currently selected.
 */
export type EntryData = {
    enabled?: boolean,
    selected?: boolean,
};

/**
 * @type {GradumSelectProperties}
 * @group Components
 * @category GradumSelect
 *
 * @template ValueType - The type of the value each entry carries.
 * @template SecondaryValueType - The type of the secondary value each entry carries.
 * @template {object} EntryType - The type of the entries themselves.
 * @description Properties to initialize a {@link GradumSelect}. Entries can be supplied directly through
 * `entries`, or generated from `values` using `createEntry`.
 * @property {string | string[]} [entriesClasses] - CSS class(es) added to every entry.
 * @property {string | string[]} [selectedEntriesClasses] - CSS class(es) added to entries while selected.
 * @property {HTMLCollection | NodeList | EntryType[]} [entries] - The entries to populate the select with.
 * @property {(ValueType | EntryType)[]} [values] - Values to build entries from, using `createEntry`.
 * @property {ValueType[]} [selectedValues] - Values selected initially.
 * @property {(entry: EntryType) => ValueType} [getValue] - Reads the value carried by an entry.
 * @property {(entry: EntryType) => SecondaryValueType} [getSecondaryValue] - Reads an entry's secondary value.
 * @property {(value: ValueType) => EntryType} [createEntry] - Builds an entry for a value in `values`.
 * @property {(entry: EntryType, index: number) => void} [onEntryAdded] - Called when an entry is added.
 * @property {(entry: EntryType) => void} [onEntryRemoved] - Called when an entry is removed.
 * @property {(entry: EntryType, e: Event) => void} [onEntryClicked] - Called when an entry is clicked.
 * @property {boolean} [multiSelection=false] - Whether more than one entry can be selected at a time.
 * @property {boolean} [forceSelection=false] - Whether at least one entry must stay selected, preventing
 * the last selected entry from being deselected.
 * @property {string} [inputName] - Name given to the underlying form inputs, to submit the selection with a form.
 * @property {Element} [parent] - Element the entries are appended to.
 * @property {(b: boolean, entry: EntryType, index: number) => void} [onSelect] - Called when an entry's
 * selected state changes, with the new state.
 * @property {(b: boolean, entry: EntryType, index: number) => void} [onEnabled] - Called when an entry's
 * enabled state changes, with the new state.
 */
type GradumSelectProperties<
    ValueType = string,
    SecondaryValueType = string,
    EntryType extends object = HTMLElement,
> = {
    entriesClasses?: string | string[];
    selectedEntriesClasses?: string | string[],

    entries?: HTMLCollection | NodeList | EntryType[],
    values?: (ValueType | EntryType)[],
    selectedValues?: ValueType[],

    getValue?: (entry: EntryType) => ValueType,
    getSecondaryValue?: (entry: EntryType) => SecondaryValueType,
    createEntry?: (value: ValueType) => EntryType,
    onEntryAdded?: (entry: EntryType, index: number) => void,
    onEntryRemoved?: (entry: EntryType) => void,
    onEntryClicked?: (entry: EntryType, e: Event) => void,

    multiSelection?: boolean,
    forceSelection?: boolean,
    inputName?: string,

    parent?: Element,
    onSelect?: (b: boolean, entry: EntryType, index: number) => void,
    onEnabled?: (b: boolean, entry: EntryType, index: number) => void,
};

/**
 * @type {GradumSelectInputEventProperties}
 * @group Components
 * @category GradumSelect
 *
 * @extends GradumRawEventProperties
 * @template ValueType - The type of the value each entry carries.
 * @template SecondaryValueType - The type of the secondary value each entry carries.
 * @template {object} EntryType - The type of the entries themselves.
 * @description Properties to initialize a {@link GradumSelectInputEvent}, the event a select fires when
 * its selection changes.
 * @property {EntryType} toggledEntry - The entry whose selected state just changed.
 * @property {ValueType[]} values - The values selected after the change.
 */
type GradumSelectInputEventProperties<
    ValueType = string,
    SecondaryValueType = string,
    EntryType extends object = HTMLElement,
> = GradumRawEventProperties & {
    toggledEntry: EntryType,
    values: ValueType[]
};

export {GradumSelectProperties, GradumSelectInputEventProperties};