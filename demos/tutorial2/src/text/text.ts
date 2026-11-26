import {GradumElement, dataSignal, Point, define, effect, gradum} from "../../../../build/gradum-kit.esm";
import "./text.css";

/**
 * A floating, editable line of text. Its position is the left edge of the text, centered vertically.
 * While you type it ignores tools (so dragging selects text instead of moving it), until it loses focus.
 * Removes itself if it loses focus while empty.
 */
export class Text extends GradumElement {
    @dataSignal() position: Point = new Point();
    @dataSignal() text: string = "";
    @dataSignal() color: string = "var(--text)";

    public initialize() {
        this.contentEditable = "plaintext-only";
        super.initialize();
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this).on("input", (e: Event) => {
            if (e.target !== this) return;
            this.text = this.innerText;
            gradum(this).ignoreAllTools(true);
        });
        gradum(this).on("focusout", (e: Event) => {
            if (e.target !== this) return;
            gradum(this).ignoreAllTools(false);
            if (!this.text.trim()) this.remove();
        });
    }

    /** Focus the text and select all of it, ready to type over. */
    public edit() {
        this.focus();
        getSelection()?.selectAllChildren(this);
    }

    @effect protected updatePosition() {
        gradum(this).setStyle("transform", `translate(${this.position.x}px, ${this.position.y}px) translateY(-50%)`);
    }

    @effect protected updateText() {
        if (this.innerText !== this.text) this.innerText = this.text;
    }

    @effect protected updateColor() {
        gradum(this).setStyle("color", this.color);
    }
}

define(Text, "my-text");
