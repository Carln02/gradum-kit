import {GradumRect} from "../../../../build/gradum-kit.esm";
import {Mark as TipTapMark} from "@tiptap/core";
import {Mark} from "../mark/mark";
import {MarkParts} from "../mark/mark.types";
import {TextUnit} from "../textEditor/textEditor.types";
import {ErasingMark} from "../erasingMark/erasingMark";
import {GrowingMark} from "../growingMark/growingMark";

/**
 * @class SequenceMark
 * @description A marked passage held as a sequence, for tools that treat text the way they treat a shape.
 *
 * A shape has a size and an angle; an ordered list of items has a length and a rotation too, and they mean
 * something exact. Turning it is a cyclic shift — a full circle brings every item back where it started.
 * Stretching it repeats the last item; trimming it drops items off the end.
 *
 * The items are words when the passage has a space in it, and the letters of a single word when it does not.
 * A drag takes the passage apart on {@link SequenceMark.begin}, moves it about while it lasts, and settles
 * on {@link SequenceMark.commit}.
 */
export class SequenceMark extends Mark {
    /**
     * @description The group every passage a tool can hold belongs to. What makes them one family — the
     * editor lets go of all of them at once without a list of them kept anywhere.
     */
    public static group: string = "selection";

    /**
     * @function definition
     * @static
     * @description Every sequence mark is drawn the same way and told apart by its name, which is also the
     * colour it wears: each tool's passage is visibly its own.
     */
    public static definition() {
        const markName = this.markName;
        return TipTapMark.create({
            name: markName,
            group: this.group,
            inclusive: false,
            addAttributes: Mark.identityAttribute,
            renderHTML: ({HTMLAttributes}) => ["span", {"data-selection": markName, ...HTMLAttributes}, 0]
        });
    }

    //The passage as it read when the drag took hold of it, and the same thing taken apart. `gaps[i]`
    //separates `tokens[i]` from `tokens[i + 1]` — kept aside so that reordering the items leaves the spacing
    //where it was.
    protected original: string;
    protected tokens: string[];
    protected gaps: string[];
    protected unit: TextUnit;

    //Where the first item sits in the document, noted while it is still true: the passage is rewritten as the
    //drag goes on, and what it reads then says nothing about where it began.
    protected start: number;

    /**
     * @function begin
     * @description Take hold of the passage: pull it apart into the items the gesture moves about. What the
     * gesture measures itself against is its own to work out, on top of this.
     * @returns {boolean} Whether there was anything to take hold of.
     */
    public begin(): boolean {
        const text = this.text;
        this.original = text.trim();
        if (!this.range || !this.original) return false;

        //Past whatever space came first, since that is where the items start.
        this.start = this.range.from + text.length - text.trimStart().length;
        ({unit: this.unit, tokens: this.tokens, gaps: this.gaps} =
            this.editor.textOperator.split(this.original));
        return true;
    }

    /**
     * @function hold
     * @description Take hold of the passage for a drag, and show it as held before anything moves.
     */
    public hold() {
        if (this.begin()) this.drawPreview();
    }

    /**
     * @function rectOf
     * @description The box some of the items occupy on the screen, as offsets into the passage. What a
     * gesture measures itself against — a point to turn about, the width of an item to pull against.
     * @param {number} from - How far into the passage the stretch starts.
     * @param {number} to - Where it ends.
     * @protected
     */
    protected rectOf(from: number, to: number): GradumRect {
        return this.editor.rectAt(this.start + from, this.start + to);
    }

    /**
     * @description Whether a drag has hold of this passage: taken on {@link SequenceMark.begin} and given
     * back on {@link SequenceMark.commit}.
     */
    public get working(): boolean {
        return this.original !== undefined;
    }

    /**
     * @function drawPreview
     * @description Show where the gesture has got to, without yet committing to it.
     *
     * Trimmed items are still there, struck through rather than removed: the passage only ever grows while
     * the drag is live, so nothing shifts under a pointer that is still measuring against it.
     */
    public drawPreview() {
        const {trimmed, grown} = this.parts;
        this.write(this.preview, [
            {markName: ErasingMark.markName, ...trimmed},
            {markName: GrowingMark.markName, ...grown}
        ]);
    }

    /**
     * @function commit
     * @description Settle the gesture, keeping what it made.
     *
     * The passage is put back as it was and the result written once over it, so that everything the drag did
     * lands in the history as a single step: one undo, not one per pixel.
     */
    public commit() {
        const result = this.result;
        if (this.original === undefined) return;

        this.write(this.original);
        if (result !== this.original) this.write(result, [], true);
        this.original = undefined;
    }

    /**
     * @description What the passage should read while the drag is still going: every item it holds, in
     * whatever order the gesture puts them, and whatever the gesture has added on the end. Items on their way
     * out are still there — struck through rather than removed — until the drag lets go.
     */
    public get preview(): string {
        return this.join(this.items) + this.grown;
    }

    /**
     * @description Which parts of {@link SequenceMark.preview} are going and which are new, as offsets.
     */
    public get parts(): MarkParts {
        const shown = this.join(this.items).length;
        return {
            trimmed: {from: this.trimmedFrom, to: shown},
            grown: {from: shown, to: shown + this.grown.length}
        };
    }

    /**
     * @description What the passage reads once the drag is over: what it keeps, and what it grew.
     */
    public get result(): string {
        return this.join(this.kept) + this.grown;
    }

    /**
     * @description The items in the order the gesture puts them. A gesture that does not reorder anything —
     * the plain passage, before any kind takes hold of it — leaves them as they were read.
     * @protected
     */
    protected get items(): string[] {
        return this.tokens?.slice() ?? [];
    }

    /**
     * @description Which of the items outlast the gesture. Everything, unless the gesture drops any.
     * @protected
     */
    protected get kept(): string[] {
        return this.items;
    }

    /**
     * @description What the gesture adds on the end. Nothing, unless the gesture grows the passage.
     * @protected
     */
    protected get grown(): string {
        return "";
    }

    /**
     * @description Where the doomed tail starts, as an offset into the passage. The very end when nothing is
     * doomed, which is to say an empty stretch.
     * @protected
     */
    protected get trimmedFrom(): number {
        return this.join(this.items).length;
    }

    /**
     * @description Put items back together with the spacing this passage was taken apart with.
     * @protected
     */
    protected join(tokens: string[]): string {
        return this.editor.textOperator.join(tokens, this.gaps);
    }
}
