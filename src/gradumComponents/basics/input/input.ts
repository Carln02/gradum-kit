import {define} from "../../../decorators/define/define";
import {GradumElement} from "../../../gradumElement/gradumElement";
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
import {effect} from "../../../decorators/reactivity/reactivity";
import "./input.css";

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
     * @function create
     * @static
     * @description Instantiate an input, reading `InputTag` and `ValueType` back off the properties — so
     * `GradumInput.create({inputTag: "textarea"})` is typed as a textarea input without a cast. Narrows
     * {@link GradumElement.create}, which cannot see generics declared on a subclass.
     * @template {{prototype: GradumElement}} This - The class `create` was called on. The constraint
     * matches the base signature; the return type still narrows to this class.
     * @template {"input" | "textarea"} InputTag - Inferred from `properties.inputTag`.
     * @template ValueType - Inferred from the properties' value type.
     * @param {GradumInputProperties} [properties] - Properties to set on the new input.
     * @returns {GradumInput} The created input, typed as the class this was called on.
     */
    public static create<
        This extends {prototype: GradumElement},
        InputTag extends "input" | "textarea" = "input",
        ValueType = string,
        ViewType extends GradumView = GradumView<any, any>,
        DataType extends object = object,
        ModelType extends GradumModel = GradumModel,
        EmitterType extends GradumEmitter = GradumEmitter<any>
    >(
        this: This,
        properties?: This["prototype"]["properties"]
            & GradumInputProperties<InputTag, ValueType, ViewType, DataType, ModelType, EmitterType>
    ): This["prototype"]
        & GradumInput<InputTag, ValueType, ViewType, DataType, ModelType, EmitterType> {
        return (super.create as any).call(this, properties);
    }

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
     * @description Whether the input is only as wide as what is in it, growing and shrinking as the value
     * changes — what a name wants when it stands in for a line of text rather than sitting in a form.
     *
     * Uses the browser's own `field-sizing` where there is one, and measures the text and writes the width
     * where there is not. Either way the width lands on the element laying the text out rather than on the
     * component around it, which is why setting a width from outside does not work.
     *
     * *Pair it with {@link GradumInput.plain} to have the field look like text as well as size like it.*
     */
    @signal public fitContent: boolean = false;

    /**
     * @description Whether the input is drawn as plain text: no box, no border, no outline, and colour,
     * font and alignment taken from whatever it sits in. For a field that stands in for a line of text —
     * a title edited in place — rather than one in a form.
     */
    @signal public plain: boolean = false;

    /**
     * @private
     * @static
     * @description The offscreen element every input measures its text in. Shared: it carries the font of
     * whichever input is asking at the time, and only for as long as the measurement takes.
     */
    private static measurer: HTMLElement;

    /**
     * @readonly
     * @static
     * @description Whether the browser sizes a field to its content by itself.
     */
    private static get supportsFieldSizing(): boolean {
        return typeof CSS !== "undefined" && CSS.supports?.("field-sizing", "content");
    }

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
     * @private
     * @description The last value assigned through {@link GradumInput.value}, kept for its type rather than
     * its contents: it is what tells a read which type to parse the element's text back into. Nothing else
     * holds it — the element stores text, and the string form written to it cannot be turned back into a
     * `Point` or a `Color` without knowing that is what it was.
     */
    private typedValue: ValueType;

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
     * @description Keep the field as wide as its value while {@link GradumInput.fitContent} is on. Reads
     * the value, so it follows what is typed: every accepted change marks it dirty.
     * @protected
     */
    @effect protected applyFitContent() {
        const fit = this.fitContent;
        const value = this.rawValue;
        const element = this.element;
        if (!(element instanceof HTMLInputElement) && !(element instanceof HTMLTextAreaElement)) return;

        gradum(this).toggleClass("gradum-input-fit", fit);
        //The browser's own sizing is applied by the class, and nothing needs writing.
        if (!fit || GradumInput.supportsFieldSizing) {
            gradum(element).setStyle("width", "", true);
            return;
        }
        gradum(element).setStyle("width", `${this.measureValueWidth(value)}px`, true);
    }

    /**
     * @description Dress the field down to plain text while {@link GradumInput.plain} is on.
     * @protected
     */
    @effect protected applyPlain() {
        gradum(this).toggleClass("gradum-input-plain", this.plain);
    }

    /**
     * @function measureValueWidth
     * @protected
     * @description How wide the field has to be to show a piece of text without scrolling: the text as
     * this field would draw it, plus whatever the field puts around it.
     *
     * Measured in an offscreen element carrying this field's own font, rather than counted in `ch` — a
     * `ch` is the width of a zero, which is the width of nothing else in a proportional font.
     * @param {string} text - The text to measure. Falls back to the placeholder when empty, so an empty
     * field is still wide enough to read its prompt.
     * @returns {number} The width in pixels.
     */
    protected measureValueWidth(text: string): number {
        const element = this.element as HTMLInputElement;
        const style = getComputedStyle(element);

        const measurer = GradumInput.measurer ??= document.createElement("div");
        measurer.style.cssText = "position:absolute; top:-9999px; left:-9999px; visibility:hidden; white-space:pre";
        //Re-attached rather than attached once: it is shared and lives as long as the page, so anything
        //that replaces the body would otherwise leave it orphaned and every measurement at zero.
        if (!measurer.isConnected) document.body.appendChild(measurer);
        for (const property of ["fontStyle", "fontVariant", "fontWeight", "fontStretch", "fontSize",
            "fontFamily", "letterSpacing", "wordSpacing", "textTransform"]) {
            measurer.style[property] = style[property];
        }
        measurer.textContent = text || element.placeholder || "";

        const around = ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"]
            .reduce((total, property) => total + (parseFloat(style[property]) || 0), 0);
        //One pixel over, so the caret at the end of the text has somewhere to sit rather than being clipped.
        return measurer.offsetWidth + around + 1;
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
     * @description The input's value, parsed from its text. Text that reads as a whole number is returned
     * as one, text left over from a value that exposes `fromString` is parsed back into that value's type,
     * and anything else is tried as JSON before being handed back as the string it is. Assigning writes
     * the value's string form to the element and remembers the type it came in as.
     *
     * *Note: a number wins over `fromString`, so an input holding a `Point` whose text reads `"5"` gives
     * back `5` rather than a point.*
     */
    @signal public get value(): ValueType {
        const value = this.rawValue;
        if (!value) return undefined;

        //Whole-number-or-nothing, rather than `parseFloat`, which reads "3 clips" as 3 and would turn any
        //description starting with a digit into a number.
        const trimmed = value.trim();
        if (trimmed) {
            const num = Number(trimmed);
            if (!Number.isNaN(num)) return num as ValueType;
        }

        //The last value assigned, for its type: `this.value` here would be this getter calling itself.
        const current = this.typedValue;
        if (current && typeof current === "object" && "fromString" in current
            && typeof current.fromString === "function") return (current.fromString as any)(value) as ValueType;

        try {return JSON.parse(value) as ValueType;} catch {}
        return value as ValueType;
    }

    public set value(value: ValueType) {
        this.typedValue = value;
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
        //Asked of the emitter only if there is one. An input built on its own — no model, no view — has
        //none, and assigning to it is still the ordinary way to fill it in.
        this.emitter?.fire("valueSet");
    }

    /**
     * @function setValueSilently
     * @description Write a value into the element without running the regex checks or announcing the
     * change. Use it to sync the input from an external source without echoing an update back out.
     * @param {ValueType} value - The value to write.
     */
    public setValueSilently(value: ValueType) {
        if (!(this.element instanceof HTMLInputElement) && !(this.element instanceof HTMLTextAreaElement)) return;
        //Remembered here too, or the type a read parses back into would be the one before this write.
        this.typedValue = value;
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

//Named outright rather than derived from the class name: a build that renames the class — vitest's
//esbuild pass renames it to `_GradumInput` — would otherwise derive a tag the browser rejects.
define(GradumInput, "gradum-input", "GradumInput");
export {GradumInput};