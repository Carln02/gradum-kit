import {GradumRawEventProperties} from "../../../eventHandling/events/gradumEvent.types";

export type EntryData = {
    enabled?: boolean,
    selected?: boolean,
};

/**
 * @group Components
 * @category GradumSelect
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
 * @group Components
 * @category GradumSelect
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