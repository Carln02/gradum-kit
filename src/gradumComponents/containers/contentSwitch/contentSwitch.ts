import "./contentSwitch.css";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {auto} from "../../../decorators/auto/auto";
import {define} from "../../../decorators/define/define";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {ContentSwitchMode, GradumContentSwitchProperties} from "./contentSwitch.types";
import {GradumSelectElement} from "../../basics/selectElement/selectElement";
import {Reifect} from "../../wrappers/reifect/reifect";
import {StatelessReifectProperties} from "../../wrappers/reifect/reifect.types";

class GradumContentSwitch<
    ValueType = string,
    SecondaryValueType = string,
    EntryType extends HTMLElement = HTMLElement,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumSelectElement<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType> {
    public static defaultProperties = {transitionDuration: 0.3};

    public declare readonly properties: GradumContentSwitchProperties<ViewType, DataType, ModelType, EmitterType>;

    @auto({defaultValue: ContentSwitchMode.fadeRight}) public set mode(value: ContentSwitchMode) {
        this.reloadMovementReifect();
    }

    @auto({
        preprocessValue: function (value) {
            if (!value) return;
            if (value instanceof Reifect) return value;
            return new Reifect(value);
        }
    }) public set entryTransitionReifect(value: Reifect | StatelessReifectProperties) {
        if (!value) return;
        if (this.entries.length > 0) value.attach(...this.entries);
    }
    public get entryTransitionReifect(): Reifect {return;}

    @auto({
        preprocessValue: function (value) {
            if (!value) return;
            if (value instanceof Reifect) return value;
            return new Reifect(value);
        }
    }) public set movementReifect(value: Reifect | StatelessReifectProperties) {
        if (value && this.entries.length > 0) value.attach(...this.entries);
    }
    public get movementReifect(): Reifect {return;}

    @auto({override: true}) public set transitionDuration(value: number) {
        if (value <= 0) return;
        if (!this.entryTransitionReifect) this.entryTransitionReifect = new Reifect({});
        this.entryTransitionReifect.styles = `transition: transform ${value}s ease-in-out, opacity ${value}s ease-in-out`;
    }

    public initialize() {
        this.select.onEntryAdded.add(entry => this.setupEntry(entry));
        this.select.onEntryRemoved.add(entry => {
            this.entryTransitionReifect?.detach(entry);
            this.movementReifect?.detach(entry);
        });
        super.initialize();
        this.reloadMovementReifect();
    }

    protected setupEntry(entry: EntryType) {
        gradum(entry).setStyles({position: "relative", width: "", height: "", top: "0", left: "0"}, true);
        this.entryTransitionReifect?.attach(entry);
        this.movementReifect?.attach(entry);
        requestAnimationFrame(() => {
            if (entry !== this.selectedEntry) this.freezeAndHide(entry);
        });
    }

    private freezeAndHide(entry: EntryType, isRelative: boolean = false) {
        gradum(entry).setStyles({
            width: isRelative ? "" : `${entry.offsetWidth}px`,
            height: isRelative ? "" : `${entry.offsetHeight}px`,
            position: isRelative ? "relative" : "absolute",
            top: "0",
            left: "0",
        }, true);
    }

    private reloadMovementReifect() {
        if (!this.movementReifect) this.movementReifect = new Reifect({});
        this.movementReifect.styles = (index) => {
            const offset = index - this.selectedIndex;
            if (offset === 0) return "transform: translateX(0); opacity: 1; pointer-events: all;";
            if (this.mode === ContentSwitchMode.carousel)
                return `transform: translateX(${offset > 0 ? "100%" : "-100%"}); opacity: 0; pointer-events: none;`;
            const dx = this.mode === ContentSwitchMode.fadeLeft ? "-100%" : "100%";
            return `transform: translateX(${dx}); opacity: 0; pointer-events: none;`;
        };
    }

    protected beforeResize(selectedEntry: EntryType) {
        this.select.entries.forEach(entry => this.freezeAndHide(entry, entry === selectedEntry));
        this.movementReifect?.apply(this.select.entries, {recomputeProperties: true});
    }
}

define(GradumContentSwitch, "gradum-content-switch");
export {GradumContentSwitch};