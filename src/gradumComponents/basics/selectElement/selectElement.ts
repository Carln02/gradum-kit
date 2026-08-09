import {define} from "../../../decorators/define/define";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumElement} from "../../../gradumElement/gradumElement";
import {expose} from "../../../decorators/expose";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumSelectElementProperties} from "./selectElement.types";
import {GradumSelect} from "../select/select";
import {ValidTag} from "../../../types/element.types";
import {auto} from "../../../decorators/auto/auto";
import {Reifect} from "../../wrappers/reifect/reifect";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {StatelessReifectProperties} from "../../wrappers/reifect/reifect.types";

/**
 * @class GradumSelectElement
 * @group Components
 * @category GradumSelectElement
 *
 * @extends GradumElement
 * @description Select element class for creating Gradum button elements.
 */
class GradumSelectElement<
    ValueType = string,
    SecondaryValueType = string,
    EntryType extends HTMLElement = HTMLElement,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
    public declare readonly properties: GradumSelectElementProperties;
    /**
     * @static
     * @description Default properties assigned to a new select element. Entries are built as
     * {@link GradumRichElement}s unless another tag is given.
     */
    public static defaultProperties: GradumSelectElementProperties = {
        entriesTag: "gradum-rich-element"
    };

    /**
     * @protected
     * @description The pending timer that clears the container's fixed size once the resize animation ends.
     */
    protected _sizeTransitionTimeout: ReturnType<typeof setTimeout>;

    /**
     * @readonly
     * @description The selection logic backing this element. It owns the entries and their selected state;
     * this element renders them.
     */
    public readonly select: GradumSelect<ValueType, SecondaryValueType, EntryType> = GradumSelect.create() as any;

    /**
     * @description The tag used to build entries from plain values.
     */
    public entriesTag: ValidTag;

    /**
     * @description The element's entries, in order. Assigning a new list replaces them all.
     */
    public get entries(): EntryType[] {
        return this.select.entries;
    }

    public set entries(value: HTMLCollection | NodeList | EntryType[]) {
        this.select.entries = value;
    }

    @expose("select") public values: ValueType[];

    @expose("select") public accessor selectedEntries: EntryType[];
    @expose("select", false) public accessor selectedEntry: EntryType;

    @expose("select") public accessor selectedIndex: number;
    @expose("select", false) public accessor selectedIndices: number[];

    @expose("select") public entriesClasses: string | string[];
    @expose("select") public selectedEntriesClasses: string | string[];

    @expose("select") public accessor inputName: string;
    @expose("select", false) public accessor inputField: HTMLInputElement;

    @expose("select") public accessor multiSelection: boolean;
    @expose("select") public accessor forceSelection: boolean;

    @expose("select", false) public accessor enabledEntries: EntryType[];
    @expose("select", false) public accessor enabledValues: ValueType[];
    @expose("select", false) public accessor enabledSecondaryValues: SecondaryValueType[];

    @expose("select", false) public accessor selectedValue: ValueType;
    @expose("select", false) public accessor selectedValues: ValueType[];

    @expose("select", false) public accessor selectedSecondaryValues: SecondaryValueType[];
    @expose("select", false) public accessor selectedSecondaryValue: SecondaryValueType;

    @expose("select", false) public accessor stringSelectedValue: string;

    /**
     * @function initialize
     * @description Set the element up and select its initial entry.
     */
    public initialize() {
        this.select.onSelect.add(() => this.applyTransition());
        super.initialize();
        if (!this.select.parent) this.select.parent = this;
    }

    private _transitionDuration: number = 0;

    public get transitionDuration(): number {
        return this._transitionDuration;
    }

    /**
     * @description Duration of the container size transition in seconds. Kept in sync with
     * `switchTransitionReifect` — set this to change both at once.
     */
    public set transitionDuration(value: number) {
        this._transitionDuration = value;
        if (value <= 0) return;
        if (!this.transitionReifect) this.transitionReifect = new Reifect({});
        this.transitionReifect.styles = `transition: width ${value}s ease-in-out, height ${value}s ease-in-out`;
    }

    @auto({
        preprocessValue: function (value) {
            if (!value) return;
            if (value instanceof Reifect) return value;
            return new Reifect(value);
        }
    }) public set transitionReifect(value: Reifect | StatelessReifectProperties) {
        if (!value) return;
        value.attach(this);
    }
    public get transitionReifect(): Reifect {return;}

    /**
     * @description Animates the container from its current size to the selected entry's natural
     * size. Subclasses should call `super.applyTransition()` then add their own entry-level logic.
     * The sequence:
     * 1. Freeze container at current px size (gives CSS transition a `from` value)
     * 2. Call `beforeResize()` — subclass hook to prepare entries before the frame
     * 3. Next frame: read selected entry's natural size, animate container to it
     * 4. After `transitionDuration`ms: release explicit container size
     */
    protected applyTransition() {
        if (this.transitionDuration <= 0 || !this.transitionReifect) return;
        const selectedEntry = this.selectedEntry;
        if (!selectedEntry) return;

        this.transitionReifect.unapply(this);
        gradum(this).setStyles({width: `${this.offsetWidth}px`, height: `${this.offsetHeight}px`}, true);
        this.transitionReifect.apply(this);

        this.beforeResize(selectedEntry);
        requestAnimationFrame(() => gradum(this).setStyles({
            width: `${selectedEntry.offsetWidth}px`,
            height: `${selectedEntry.offsetHeight}px`
        }));

        clearTimeout(this._sizeTransitionTimeout);
        this._sizeTransitionTimeout = setTimeout(() => {
            gradum(this).setStyles({width: "", height: ""});
            this.afterResize(selectedEntry);
        }, this.transitionDuration * 1000);
    }

    /**
     * @description Called synchronously inside `applyTransition`, before the rAF that reads the
     * selected entry's new size. Use this to reposition/reflow entries so the size read is correct.
     * @param {EntryType} selectedEntry - The newly selected entry.
     */
    protected beforeResize(selectedEntry: EntryType) {}

    /**
     * @description Called after the container size transition completes.
     * @param {EntryType} selectedEntry - The entry that is now selected.
     */
    protected afterResize(selectedEntry: EntryType) {}
}

define(GradumSelectElement);
export {GradumSelectElement};