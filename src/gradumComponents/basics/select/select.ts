import {EntryData, GradumSelectProperties} from "./select.types";
import {GradumSelectInputEvent} from "./selectInputEvent";
import {trim} from "../../../utils/computations/misc";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {GradumBaseElement} from "../../../gradumElement/gradumBaseElement/gradumBaseElement";
import {auto} from "../../../decorators/auto/auto";
import {GradumRichElement} from "../richElement/richElement";
import {isNull, isUndefined} from "../../../utils/dataManipulation/misc";
import {input} from "../../../elementCreation/basicElements";
import {Delegate} from "../../datatypes/delegate/delegate";
import {DefaultEventName} from "../../../types/eventNaming.types";
import {stringify} from "../../../utils/dataManipulation/string";
import {Propagation} from "../../../gradumFunctions/event/event.types";
import {define} from "../../../decorators/define/define";

/**
 * @class GradumSelect
 * @group Components
 * @category Basics
 *
 * @extends GradumElement
 * @description Base class for creating a selection menu

 */
class GradumSelect<
    ValueType = string,
    SecondaryValueType = string,
    EntryType extends object = HTMLElement,
> extends GradumBaseElement {
    public declare readonly properties: GradumSelectProperties<ValueType, SecondaryValueType, EntryType>;

    /**
     * @function create
     * @static
     * @description Instantiate a selection, reading its value and entry types back off the properties — so
     * the types come from `getValue`/`getSecondaryValue` rather than needing a cast. Narrows
     * {@link GradumBaseElement.create}, which cannot see generics declared on a subclass.
     * @template {{prototype: GradumBaseElement}} This - The class `create` was called on. The constraint
     * matches the base signature; the return type still narrows to this class.
     * @template ValueType - Inferred from `properties.getValue`.
     * @template SecondaryValueType - Inferred from `properties.getSecondaryValue`.
     * @template {object} EntryType - Inferred from the entries the accessors receive.
     * @param {GradumSelectProperties} [properties] - Properties to set on the new selection.
     * @returns {GradumSelect} The created selection, typed as the class this was called on.
     */
    public static create<
        This extends {prototype: GradumBaseElement},
        ValueType = string,
        SecondaryValueType = string,
        EntryType extends object = HTMLElement
    >(
        this: This,
        properties?: This["prototype"]["properties"]
            & GradumSelectProperties<ValueType, SecondaryValueType, EntryType>
    ): This["prototype"] & GradumSelect<ValueType, SecondaryValueType, EntryType> {
        return (super.create as any).call(this, properties);
    }

    /**
     * @static
     * @description Default properties assigned to a new selection: selected entries get the `selected` class,
     * and disabled entries are hidden.
     */
    public static defaultProperties: GradumSelectProperties = {
        selectedEntriesClasses: "selected",
        onEnabled: (b, entry) => {
            if (!(entry instanceof HTMLElement)) return;
            gradum(entry).setStyle("visibility", b ? "" : "hidden");
        }
    };

    private _inputField: HTMLInputElement;
    private _entries: EntryType[] = [];
    private readonly _entriesData: WeakMap<EntryType, EntryData> = new WeakMap();

    private parentObserver: MutationObserver;
    private readonly _onSelect: Delegate<(b: boolean, entry: EntryType, index: number) => void> = new Delegate();
    /**
     * @description Fired whenever an entry is selected or deselected, with the new state, the entry, and its
     * index. Assigning a function subscribes it rather than replacing the existing subscribers.
     */
    public get onSelect(): Delegate<(b: boolean, entry: EntryType, index: number) => void> {
        return this._onSelect;
    }

    public set onSelect(value: (b: boolean, entry: EntryType, index: number) => void) {
        if (value) this._onSelect.add(value);
    }

    private readonly _onEnabled: Delegate<(b: boolean, entry: EntryType, index: number) => void> = new Delegate();
    /**
     * @description Fired whenever an entry is enabled or disabled. Assigning a function subscribes it rather
     * than replacing the existing subscribers.
     */
    public get onEnabled(): Delegate<(b: boolean, entry: EntryType, index: number) => void> {
        return this._onEnabled;
    }

    public set onEnabled(value: (b: boolean, entry: EntryType, index: number) => void) {
        if (value) this._onEnabled.add(value);
    }

    private readonly _onEntryAdded: Delegate<(entry: EntryType, index: number) => void> = new Delegate();
    /**
     * @description Fired whenever an entry is added. Assigning a function subscribes it rather than replacing
     * the existing subscribers.
     */
    public get onEntryAdded(): Delegate<(entry: EntryType, index: number) => void> {
        return this._onEntryAdded;
    }

    public set onEntryAdded(value: (entry: EntryType, index: number) => void) {
        if (value) this.onEntryAdded.add(value);
    }

    private readonly _onEntryRemoved: Delegate<(entry: EntryType) => void> = new Delegate();
    /**
     * @description Fired whenever an entry is removed. Assigning a function subscribes it rather than
     * replacing the existing subscribers.
     */
    public get onEntryRemoved(): Delegate<(entry: EntryType) => void> {
        return this._onEntryRemoved;
    }

    public set onEntryRemoved(value: (entry: EntryType) => void) {
        if (value) this.onEntryRemoved.add(value);
    }

    private readonly _onEntryClicked: Delegate<(entry: EntryType, e: Event) => void> = new Delegate();
    /**
     * @description Fired whenever an entry is clicked, whether or not the click changes the selection.
     * Assigning a function subscribes it rather than replacing the existing subscribers.
     */
    public get onEntryClicked(): Delegate<(entry: EntryType, e: Event) => void> {
        return this._onEntryClicked;
    }

    public set onEntryClicked(value: (entry: EntryType, e: Event) => void) {
        if (value) this.onEntryClicked.add(value);
    }

    /**
     * @description This selection's entries, in order. Assigning a new list replaces them all.
     */
    public get entries(): EntryType[] {
        return this._entries;
    }

    public set entries(value: HTMLCollection | NodeList | EntryType[]) {
        this.enableObserver(false);

        const previouslySelectedValues = this.selectedValues;
        this.clear(false);
        this._entries = (Array.isArray(value) ? value : Array.from(value) as EntryType[])
            .filter(entry => entry !== this.inputField);

        if (value instanceof HTMLCollection && value.item(0)) this.parent = value.item(0).parentElement;

        const array = this.entries;
        for (let i = 0; i < array.length; i++) {
            this.onEntryAdded.fire(array[i], i);
            gradum(array[i]).addClass(this.entriesClasses);
        }

        this.deselectAll();
        for (let i = 0; i < array.length; i++) {
            if (previouslySelectedValues.includes(this.getValue(array[i]))) this.select(array[i]);
        }

        if (this.selectedEntries.length === 0) this.initializeSelection();
        this.refreshInputField();
        this.enableObserver(true);
    }

    /**
     * @description The values of this selection's entries. Assigning a new list rebuilds the entries to match.
     */
    public get values(): ValueType[] {
        return this.entries.map(entry => this.getValue(entry));
    }

    public set values(values: ValueType[]) {
        const entries = [];
        values.forEach(value => {
            const entry = this.createEntry(value);
            if (entry instanceof Node && this.parent) gradum(this.parent).addChild(entry);
            entries.push(entry);
        });
        this.entries = entries;
    }

    public get selectedEntries(): EntryType[] {
        return this.entries.filter(entry => this.getEntryData(entry).selected);
    }

    public set selectedEntries(value: EntryType[]) {
        this.deselectAll();
        if (!value) return;
        value.forEach(entry => this.select(entry));
    }

    @auto() public set parent(value: Element) {
        if (!(value instanceof Element)) return;
        gradum(value).addChild(this.entries.filter(entry => entry instanceof Node) as Node[]);
        if (this.inputField) value.appendChild(this.inputField);
        this.setupParentObserver();
    }

    @auto({
        defaultValue: (entry: EntryType) => entry instanceof GradumRichElement ? entry.text
            : entry instanceof HTMLElement ? entry.textContent
                : entry instanceof Element ? entry.innerHTML
                    : undefined
    }) public getValue: (entry: EntryType) => ValueType;

    @auto({defaultValue: () => ""}) public getSecondaryValue: (entry: EntryType) => SecondaryValueType;

    @auto({
        defaultValue: (value: ValueType) => GradumRichElement.create({text: stringify(value)})
    }) public createEntry: (value: ValueType) => EntryType;

    /**
     * The dropdown's underlying hidden input. Might be undefined.
     */
    public get inputName(): string {
        return this.inputField?.name;
    }

    public set inputName(value: string) {
        if (!this._inputField) this._inputField = input({
            value: this.stringSelectedValue,
            type: "hidden",
            parent: this.parent ?? document.body
        });
        this.inputField.name = value;
    }

    public get inputField(): HTMLInputElement {
        return this._inputField;
    }

    @auto({defaultValue: false}) public set multiSelection(value: boolean) {
        this.forceSelection = !value;
    }

    @auto({
        defaultValueCallback: function () {
            return !this.multiSelection
        }
    })
    public forceSelection: boolean;

    //TODO FIX
    @auto({
        callBefore: function () {
            this.selectedEntries?.forEach(entry => gradum(entry).removeClass(this.selectedEntryClasses))
        },
        callAfter: function () {
            this.selectedEntries?.forEach(entry => gradum(entry).addClass(this.selectedEntryClasses))
        },
    }) public selectedEntriesClasses: string | string[];

    @auto({
        callBefore: function (value: string) {
            this.entries.forEach(entry => gradum(entry).removeClass(value))
        },
        callAfter: function (value: string) {
            this.entries.forEach(entry => gradum(entry).addClass(value))
        }
    }) public entriesClasses: string | string[];

    /**
     * @function customCreate
     * @static
     * @protected
     * @description Build a selection, deferring the initial entries and selected values until the element
     * exists so they are not lost during construction.
     * @param {GradumSelectProperties} properties - The selection's configuration.
     * @returns {object} The created selection.
     */
    protected static customCreate(properties: GradumSelectProperties): object {
        const {selectedValues, parent} = properties;
        const obj = super.customCreate({...properties, selectedValues: undefined, parent: undefined}) as GradumSelect;
        obj.parent = parent;
        obj.selectedValues = selectedValues || [];
        return obj;
    }

    /**
     * @description Create a selection.
     */
    public constructor() {
        super();
        this.onEntryClicked.add((entry) => this.select(entry, !this.isSelected(entry)));
        this.onEntryAdded.add((entry) => {
            this.initializeSelection();
            gradum(entry).on(DefaultEventName.click, (e: Event) => {
                this.onEntryClicked.fire(entry, e);
                return Propagation.stopPropagation;
            });
        });
    }

    protected getEntryData(entry: EntryType): EntryData {
        if (!entry) return {};
        let data = this._entriesData.get(entry);
        if (!data) {
            data = {selected: false, enabled: true};
            this._entriesData.set(entry, data);
        }
        return data;
    }

    protected clearEntryData(entry: EntryType) {
        this._entriesData.delete(entry);
        const index = this.entries.indexOf(entry);
        if (index >= 0) this.entries.splice(index, 1);
    }

    public addEntry(entry: EntryType, index: number = this.entries.length) {
        if (index === undefined || typeof index !== "number" || index > this.entries.length) index = this.entries.length;
        if (index < 0) index = 0;

        this.enableObserver(false);
        this.onEntryAdded.fire(entry, index);
        gradum(entry).addClass(this.entriesClasses);

        if (Array.isArray(this.entries) && !this.entries.includes(entry)) this.entries.splice(index, 0, entry);
        if (entry instanceof Node && !entry.parentElement && this.parent) gradum(this.parent).addChild(entry, index);

        this.enableObserver(true);
        requestAnimationFrame(() => this.select(this.selectedEntry));
    }

    public removeEntry(value: ValueType | EntryType): this {
        const entry = this.getEntry(value as any);
        if (!entry) return this;

        this.enableObserver(false);

        if (this.getEntryData(entry).selected && this.forceSelection) {
            const fallback = this.enabledEntries.find(e => e !== entry);
            if (fallback) this.select(fallback);
        }

        this.onEntryRemoved.fire(entry);
        if (entry instanceof Node && entry.parentElement) entry.parentElement.removeChild(entry);
        this.clearEntryData(entry);
        this.refreshInputField();

        this.enableObserver(true);
        return this;
    }

    public getEntryFromSecondaryValue(value: SecondaryValueType): EntryType {
        return this.entries.find((entry: EntryType) => this.getSecondaryValue(entry) === value);
    }

    public isSelected(entry: EntryType): boolean {
        return this.selectedEntries.includes(entry);
    }

    protected getEntry(value: EntryType | ValueType): EntryType {
        let entry: EntryType;
        try {
            const fromValue = this.find(value as any);
            if (fromValue) entry = fromValue;
            else {
                const isEntry = this.entries.find(entry => entry === value);
                if (isEntry) entry = isEntry;
            }
        } catch {
        }
        return entry;
    }

    /**
     * @function select
     * @description Select or deselect an entry. In single-selection mode selecting one entry deselects
     * whichever was selected before.
     * @param {ValueType | EntryType} value - The entry to select, or the value identifying it.
     * @param {boolean} [selected=true] - Whether to select the entry, or deselect it.
     * @returns {this} Itself, allowing for method chaining.
     */
    public select(value: ValueType | EntryType, selected: boolean = true): this {
        if (isNull(value) || isUndefined(value)) return this;

        let entry: EntryType;
        try {
            const fromValue = this.getEntry(value as any);
            if (fromValue) entry = fromValue;
            else {
                const isEntry = this.entries.find(entry => entry === value);
                if (isEntry) entry = isEntry;
            }
        } catch {
        }
        if (!entry) return this;

        const wasSelected = this.isSelected(entry);
        if (selected === wasSelected) return this;
        if (!selected && wasSelected && this.selectedEntries.length <= 1 && this.forceSelection) return this;
        if (!this.multiSelection) this.deselectAll();

        this.getEntryData(entry).selected = selected;
        if (entry instanceof HTMLElement) gradum(entry).toggleClass(this.selectedEntriesClasses, selected);

        this.initializeSelection();
        this.refreshInputField();

        this.onSelect.fire(selected, entry, this.getIndex(entry));
        (this.parent ?? document).dispatchEvent(new GradumSelectInputEvent<ValueType, SecondaryValueType, EntryType>({
            toggledEntry: entry,
            values: this.selectedValues
        }));

        return this;
    }

    /**
     * @function selectByIndex
     * @description Select the entry at the given index.
     * @param {number} index - The index of the entry to select.
     * @param {(index: number, entriesCount: number, zero?: number) => number} [preprocess=trim] - Applied to the
     * index before use. Defaults to `trim`, which clamps it into range; pass `mod` to wrap around instead.
     * @returns {this} Itself, allowing for method chaining.
     */
    public selectByIndex(index: number, preprocess: (index: number, entriesCount: number, zero?: number)
        => number = trim): this {
        index = preprocess(index, this.entries.length - 1, 0);
        return this.select(this.entries[index]);
    }

    public getIndex(entry: EntryType) {
        return this.entries.indexOf(entry);
    }

    public deselectAll() {
        this.selectedEntries.forEach(entry => {
            if (entry instanceof HTMLElement) gradum(entry).toggleClass(this.selectedEntriesClasses, false);
            this.getEntryData(entry).selected = false;
        });
        this.refreshInputField();
    }

    public reset() {
        this.deselectAll();
        // todo this.onEntryClick(this.enabledEntries[0]);
    }

    public get enabledEntries(): EntryType[] {
        return this.entries.filter(entry => this.getEntryData(entry).enabled);
    }

    public get enabledValues(): ValueType[] {
        return this.enabledEntries.map(entry => this.getValue(entry));
    }

    public get enabledSecondaryValues(): SecondaryValueType[] {
        return this.enabledEntries.map(entry => this.getSecondaryValue(entry));
    }

    public find(value: ValueType): EntryType {
        return this.entries.find((entry) => this.getValue(entry) === value);
    }

    public findBySecondaryValue(value: SecondaryValueType): EntryType {
        return this.entries.find((entry) => this.getSecondaryValue(entry) === value);
    }

    public findAll(...values: ValueType[]): EntryType[] {
        return this.entries.filter(entry => values.includes(this.getValue(entry)));
    }

    public findAllBySecondaryValue(...values: SecondaryValueType[]): EntryType[] {
        return this.entries.filter((entry) => values.includes(this.getSecondaryValue(entry)));
    }

    public enable(b: boolean, ...entries: (ValueType | EntryType)[]) {
        if (!entries || entries.length === 0) entries = this.entries;
        entries.forEach(value => {
            const entry = this.getEntry(value);
            if (!entry) return;
            this.getEntryData(entry).enabled = b;
            this.onEnabled.fire(b, entry, this.getIndex(entry));
        });
    }

    /**
     * @description The dropdown's currently selected entries
     */

    public get selectedEntry(): EntryType {
        return this.selectedEntries[0];
    }

    public get selectedIndex(): number {
        return this.getIndex(this.selectedEntry);
    }

    public set selectedIndex(value: number) {
        this.selectByIndex(value);
    }

    public get selectedIndices(): number[] {
        return this.selectedEntries.map(entry => this.getIndex(entry));
    }

    public set selectedValues(values: ValueType[]) {
        if (!this.forceSelection) this.deselectAll();
        this.entries.forEach(entry => {
            if (values.includes(this.getValue(entry))) this.select(entry)
        });
    }

    /**
     * @description The dropdown's currently selected values
     */
    public get selectedValues(): ValueType[] {
        return this.selectedEntries.map(entry => this.getValue(entry));
    }

    public get selectedValue(): ValueType {
        const selectedEntry = this.selectedEntry;
        if (!selectedEntry) return;
        return this.getValue(selectedEntry);
    }

    public get selectedSecondaryValues(): SecondaryValueType[] {
        return this.selectedEntries.map(entry => this.getSecondaryValue(entry));
    }

    public get selectedSecondaryValue(): SecondaryValueType {
        const selectedEntry = this.selectedEntry;
        if (!selectedEntry) return;
        return this.getSecondaryValue(selectedEntry);
    }

    public get stringSelectedValue(): string {
        return this.selectedEntries.map(entry => stringify(this.getValue(entry))).join(", ");
    }

    public clear(disableObserver: boolean = true): void {
        if (disableObserver) this.enableObserver(false);
        for (let index = this.entries.length - 1; index >= 0; index--) {
            const entry = this.entries[index];
            this.onEntryRemoved.fire(entry);
            if (this.parent && entry instanceof HTMLElement) entry.remove();
        }
        this._entries = [];
        this.refreshInputField();
        if (disableObserver) this.enableObserver(true);
    }

    public refreshInputField() {
        if (this.inputField) this.inputField.value = this.stringSelectedValue;
    }

    public destroy() {
        this.enableObserver(false);
        this.parentObserver = null;
        return this;
    }

    protected enableObserver(value: boolean) {
        if (!value) return this.parentObserver?.disconnect();
        if (this.parent instanceof Element && this.parentObserver) this.parentObserver.observe(this.parent, {childList: true});
    }

    protected initializeSelection() {
        if (this.forceSelection && this.enabledEntries.length && this.selectedEntries.length === 0) {
            const fallback = this.enabledEntries[0];
            if (fallback) this.select(fallback);
        }
    }

    protected setupParentObserver() {
        this.enableObserver(false);
        this.parentObserver = new MutationObserver(records => {
            for (const record of records) {
                for (const node of record.addedNodes) {
                    if (!(node instanceof Element) || node.parentElement !== this.parent) continue;
                    if (node === this.inputField) continue;

                    const entry = node as EntryType;
                    const children: EntryType[] = (Array.from(this.parent!.children) as EntryType[])
                        .filter(el => el !== this.inputField)
                        .filter(el => this.entries.includes(el) || el === entry);

                    const targetIndex = children.indexOf(entry);
                    if (targetIndex < 0) continue;
                    if (targetIndex === 0) this.entries.splice(targetIndex, 0, entry);
                    else {
                        const previousIndex = this.entries.indexOf(children[targetIndex - 1]);
                        this.entries.splice(previousIndex + 1, 0, entry);
                    }

                    this.getEntryData(entry);
                    this.onEntryAdded.fire(entry, this.getIndex(entry));
                    gradum(entry).addClass(this.entriesClasses);
                }

                for (const node of record.removedNodes) {
                    if (!(node instanceof Element)) continue;
                    if (node === this.inputField) continue;
                    queueMicrotask(() => {
                        if (node.isConnected) return;
                        const data = this.getEntryData(node as any);

                        if (data.selected && this.forceSelection && this.enabledEntries.length) {
                            const fallback = this.enabledEntries[0];
                            if (fallback) this.select(fallback);
                        }

                        data.selected = false;
                        this.onEntryRemoved.fire(node as any);
                        this.clearEntryData(node as any);
                    });
                }
            }
        });
        this.enableObserver(true);
    }
}

define(GradumSelect);
export {GradumSelect};