import {define} from "../../../decorators/define/define";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumInputProperties} from "./input.types";
import {randomId} from "../../../utils/computations/random";
import {GradumProperties} from "../../../gradumFunctions/element/element.types";
import {GradumInputInputInteractor} from "./input.inputInteractor";
import {Delegate} from "../../datatypes/delegate/delegate";
import {ValidElement} from "../../../types/element.types";
import {expose} from "../../../decorators/expose";
import {Propagation} from "../../../gradumFunctions/event/event.types";
import {DefaultEventName} from "../../../types/eventNaming.types";
import {markDirty, signal} from "../../../decorators/reactivity/reactivity";
import {GradumLabelElement} from "../labelElement/labelElement";

/**
 * @group Components
 * @category Basics
 */
class GradumInput<
    InputTag extends "input" | "textarea" = "input",
    ValueType = string,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter,
> extends GradumLabelElement<InputTag, ViewType, DataType, ModelType, EmitterType> {
    public declare readonly properties: GradumInputProperties<InputTag, ValueType, ViewType, DataType, ModelType, EmitterType>;

    /**
     * @static
     * @description Default properties assigned to a new input: an `<input>` element, wired to the
     * interactor that keeps its value and size in step with what the user types.
     */
    public static defaultProperties: GradumInputProperties = {
        inputTag: "input",
        interactors: GradumInputInputInteractor
    };

    /**
     * @function customCreate
     * @static
     * @protected
     * @description Build an input, deferring the initial `value` until the underlying element exists so it
     * is not lost during construction.
     * @param {GradumInputProperties} properties - The input's configuration.
     * @returns {object} The created input.
     */
    protected static customCreate(properties: GradumInputProperties): object {
        const element: object = properties.input ?? {};
        const elementTag: any = properties.inputTag ?? "input";
        const value = properties.value;
        const input = super.customCreate({...properties, elementTag, element,
            value: undefined, input: undefined, inputTag: undefined});
        if (value !== undefined && value !== null) (input as any).value = value;
        return input;
    }

    /**
     * @description Whether the input rejects focus, so clicking it does nothing.
     */
    @signal public locked: boolean = false;
    /**
     * @description Whether the input's whole text is selected when it gains focus.
     */
    @signal public selectTextOnFocus: boolean = false;
    /**
     * @description Whether the input grows and shrinks vertically to fit its content, for `<textarea>`
     * elements that should not scroll.
     */
    @signal public dynamicVerticalResize: boolean = false;

    /**
     * @description A pattern the value must match while typing. Input that fails it is sanitized if
     * possible, and otherwise reverted to the last value that passed.
     */
    public inputRegexCheck: RegExp | string;

    /**
     * @description A pattern the value must match once editing ends. Stricter than
     * {@link GradumInput.inputRegexCheck}, so partial input is allowed mid-typing but not left behind.
     */
    public blurRegexCheck: RegExp | string;

    private lastValidForInput = "";
    private lastValidForBlur = "";

    /**
     * @readonly
     * @description Fired when the input gains focus.
     */
    public readonly onFocus: Delegate<() => void> = new Delegate();

    /**
     * @readonly
     * @description Fired when the input loses focus.
     */
    public readonly onBlur: Delegate<() => void> = new Delegate();

    /**
     * @readonly
     * @description Fired on every accepted change to the input's value.
     */
    public readonly onInput: Delegate<() => void> = new Delegate();

    /**
     * @description The underlying `<input>` or `<textarea>` element. An alias of `element`, kept for
     * readability where the distinction matters.
     */
    public get input(): ValidElement<InputTag> {
        return this.element;
    }

    public set input(value: GradumProperties<InputTag> | ValidElement<InputTag>) {
        this.element = value;
    }

    @signal public get element(): ValidElement<InputTag> {
        return super.element;
    }

    public set element(value: GradumProperties<InputTag> | ValidElement<InputTag>) {
        if (!(value instanceof Node) && typeof value === "object") {
            if (!value.name) (value as any).name = randomId();
            if (this.elementTag === "input" && !value.type) (value as any).type = "text";
        }
        super.element = value;
    }

    @expose("element") public accessor type: string;
    @expose("element") public accessor placeholder: string;
    @expose("element") public accessor pattern: string;
    @expose("element") public accessor size: string;

    /**
     * @inheritDoc
     */
    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        this.emitter?.add("processValue", () => this.processInputValue());
    }

    /**
     * @inheritDoc
     */
    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this).on(DefaultEventName.click, () => {
            if (!this.locked) this.element?.focus();
            return Propagation.propagate;
        });
    }

    /**
     * @description The input's value, parsed from its text. Numbers and JSON are converted automatically,
     * and a current value exposing `fromString` is used to parse the text into its own type. Assigning
     * writes the value's string form back to the element.
     */
    @signal public get value(): ValueType {
        const value = this.rawValue;
        if (!value) return undefined;
        try {
            const num = parseFloat(value);
            if (!isNaN(num)) return num as ValueType;
        } catch {}
        try {
            const current = this.value;
            if (current && typeof current === "object" && "fromString" in current
                && typeof current.fromString === "function") return current.fromString(value) as ValueType;
        } catch {}
        try {return JSON.parse(value) as ValueType;} catch {}
        return value as ValueType;
    }

    public set value(value: ValueType) {
        this.rawValue = value.toString();
    }

    /**
     * @description The input's text exactly as it appears in the element, with no parsing. Assigning
     * checks it against {@link GradumInput.blurRegexCheck} and reverts to the last valid text if it fails.
     */
    @signal public get rawValue(): string {
        return this.element?.value ?? "";
    }

    public set rawValue(value: string) {
        if (!(this.element instanceof HTMLInputElement) && !(this.element instanceof HTMLTextAreaElement)) return;
        let strValue = value.toString();
        if (this.blurRegexCheck) {
            const re = new RegExp(this.blurRegexCheck as any);
            if (!re.test(strValue)) strValue = this.lastValidForBlur;
        }
        this.element.value = strValue;
        this.emitter.fire("valueSet");
    }

    /**
     * @function setValueSilently
     * @description Write a value into the element without running the regex checks or announcing the
     * change. Use it to sync the input from an external source without echoing an update back out.
     * @param {ValueType} value - The value to write.
     */
    public setValueSilently(value: ValueType) {
        if (!(this.element instanceof HTMLInputElement) && !(this.element instanceof HTMLTextAreaElement)) return;
        this.element.value = typeof (value as any)?.toString === "function" ? (value as any).toString() : String(value);
    }

    /**
     * @function processInputValue
     * @protected
     * @description Validate the element's current text against the configured patterns, sanitizing or
     * reverting it as needed, and record it as the last known-good value.
     * @param {string} [value=this.element.value] - The text to validate. Defaults to the element's.
     */
    protected processInputValue(value: string = this.element.value) {
        if (this.inputRegexCheck) {
            const re = new RegExp(this.inputRegexCheck as any);
            if (!re.test(value)) {
                const attemptSanitize = this.sanitizeByRegex(value, this.inputRegexCheck);
                if (re.test(attemptSanitize)) value = attemptSanitize;
                else value = this.lastValidForInput;
            }
        }

        this.lastValidForInput = value.toString();
        if (this.blurRegexCheck) {
            const re = new RegExp(this.blurRegexCheck as any);
            if (re.test(value.toString())) this.lastValidForBlur = value;
        } else {
            this.lastValidForBlur = value;
        }

        if (this.element instanceof HTMLInputElement || this.element instanceof HTMLTextAreaElement)
            this.element.value = value;
        markDirty(this, "rawValue");
        this.onInput.fire();
    }

    private sanitizeByRegex(value: string, rule: RegExp | string): string {
        const src = typeof rule === "string" ? rule : rule.source;
        const flags = typeof rule === "string" ? "" : rule.flags.replace("g", "");
        const re = new RegExp(src, flags);

        let out = "";
        for (const ch of value) {
            const candidate = out + ch;
            re.lastIndex = 0;
            if (re.test(candidate)) out = candidate;
        }
        return out;
    }
}

define(GradumInput);
export {GradumInput};