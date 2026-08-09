import {GradumInteractor} from "../../../mvc/interactor/interactor";
import {GradumInput} from "./input";
import {listener} from "../../../decorators/listener/listener";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {Propagation} from "../../../gradumFunctions/event/event.types";

/**
 * @internal
 * @class GradumInputInputInteractor
 * @description The interactor {@link GradumInput} attaches to itself to keep its value and size in step
 * with what the user types. It also holds back updates during IME composition, so mid-composition text
 * is not read as a committed value.
 */
export class GradumInputInputInteractor extends GradumInteractor<GradumInput> {
    /**
     * @description The key this interactor is registered under on its input.
     */
    public keyName = "__input__interactor__";

    private _composing = false;
    private _resizeQueued = false;

    /**
     * @readonly
     * @description The element the listeners are bound to — the input's inner `<input>` or `<textarea>`
     * rather than the component itself.
     */
    public get target() {
        return this.element.element;
    }

    /**
     * @function initialize
     * @description Bind the listeners that keep the input's value and size in step with what is typed.
     */
    public initialize() {
        super.initialize();
        gradum(this.target).bypassManagerOn = () => true;
    }

    /**
     * @inheritDoc
     */
    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        this.emitter.add("valueSet", () => this.handleInput());
    }

    @listener() public focusIn(e: Event) {
        if (this.element.locked) {
            this.target.blur();
            return Propagation.propagate;
        }
        if (this.element.selectTextOnFocus) requestAnimationFrame(() => {
            try {this.target.select?.()} catch {}
        });
        this.element.onFocus.fire();
    }

    @listener() public focusOut(e: Event) {
        this.element.rawValue = this.element.element?.value ?? "";
        this.element.onBlur.fire();
    }

    @listener({options: {capture: true}}) public compositionStart(e: Event) {
        this._composing = true;
    }

    @listener({options: {capture: true}}) public compositionEnd(e: Event) {
        this._composing = false;
        this.handleInput();
        this.emitter.fire("processValue");
    }

    @listener({options: {capture: true}}) public input(e: Event) {
        this.handleInput();
        this.emitter.fire("processValue");
    }

    private handleInput() {
        if (this._composing) return;
        if (this.element.dynamicVerticalResize && this.target instanceof HTMLTextAreaElement) {
            if (!this._resizeQueued) {
                this._resizeQueued = true;
                queueMicrotask(() => {
                    this._resizeQueued = false;
                    gradum(this.target)
                        .setStyle("height", "auto", true)
                        .setStyle("height", this.target.scrollHeight + "px", true);
                });
            }
        }
    }
}