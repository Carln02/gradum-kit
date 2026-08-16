import {GradumOperator, Point} from "../../../../build/gradum-kit.esm";
import {Stroke} from "../stroke/stroke";
import {TextEditor} from "./textEditor";
import {Selection} from "../marks/selection";
import {EditorView} from "@tiptap/pm/view";
import {EditorState} from "@tiptap/pm/state";
import {TextRange} from "./textEditor.types";

/**
 * @description Text as a sequence, for tools that treat it the way they treat a shape.
 *
 * A shape has a size and an angle; an ordered list of items has a length and a rotation too, and they mean
 * something exact. Turning it is a cyclic shift — a full circle brings every item back where it started.
 * Stretching it adds items, shrinking it drops them.
 *
 * The items are words when there is a selection to work on, and the characters of a single word when there
 * is not.
 */
export class TextEditorSequenceOperator extends GradumOperator<TextEditor> {
    //The passage the drag has hold of, when it started on one. Nothing while a drag is drawing a new one.
    protected stroke: Stroke;

    //Where the drag began and where the pointer is now, kept for a drag that is drawing a passage rather
    //than working one — the same anchor-and-head pair the eraser uses.
    protected tool: string;
    protected anchor: number;
    protected pointer: Point;

    public get editorView(): EditorView {
        return this.element.editorView;
    }

    public get editorState(): EditorState {
        return this.element.editorState;
    }

    /**
     * @description Work out what the stroke starting at `position` is for.
     *
     * A drag that begins on the passage this tool has marked works that passage. A drag that begins anywhere
     * else marks a new one, which is how a passage is chosen in the first place.
     * @param {Point} position - Where the drag began.
     * @param {string} tool - The tool the stroke belongs to, and the mark that shows its passage.
     */
    public begin(position: Point, tool: string) {
        this.stroke = undefined;
        this.tool = tool;
        this.pointer = position;
        this.anchor = this.element.positionAt(position);
        if (this.anchor === undefined) return;

        const selection = this.selectionOf(tool);
        //Started on the passage this tool has hold of, so the drag works it. Anywhere else it draws a new
        //one, and the old one goes.
        if (selection && this.anchor >= selection.from && this.anchor <= selection.to) {
            this.stroke = this.take(this.oneBlockOf(selection), tool);
            if (this.stroke) this.draw(this.stroke);
        }
        else this.element.markOperator.unmark(tool);
    }

    /**
     * @description The passage a tool has marked, however many text nodes it happens to be split across.
     * @param {string} tool - The tool whose passage to look for.
     */
    public selectionOf(tool: string): TextRange {
        const ranges = this.element.markOperator.marked(tool);
        return ranges.length ? {from: ranges[0].from, to: ranges[ranges.length - 1].to} : undefined;
    }

    /**
     * @description Let go of every passage the pointer is not on, and of all of them when given nowhere.
     *
     * A marked passage is a hold on the text; clicking elsewhere, or reaching for another tool, is how that
     * hold is released.
     * @param {Point} [position] - Where the pointer is, if anywhere.
     */
    public release(position?: Point) {
        const at = position ? this.element.positionAt(position) : undefined;

        for (const name of this.element.markOperator.marksIn(Selection)) {
            const selection = this.selectionOf(name);
            if (!selection) continue;
            if (at !== undefined && at >= selection.from && at <= selection.to) continue;
            this.element.markOperator.unmark(name);
        }
    }

    /**
     * @description Draw the passage out from where the drag began to where the pointer has reached.
     * @protected
     */
    protected extend(position: Point) {
        const at = this.element.positionAt(position);
        if (at === undefined || this.anchor === undefined) return;

        if (at === this.anchor) return this.element.markOperator.unmark(this.tool);
        this.element.markOperator.remark(this.tool,
            {from: Math.min(this.anchor, at), to: Math.max(this.anchor, at)});
    }

    /**
     * @description Turn the sequence: a full circle cycles it once all the way round, and each step of
     * `360 / items` takes the last item to the front.
     * @param {Point} from - Where the pointer was.
     * @param {Point} to - Where it is now.
     */
    public turn(from: Point, to: Point) {
        const stroke = this.stroke;
        if (!stroke) return this.extend(to);
        if (stroke.turn(to)) this.draw(stroke);
    }

    /**
     * @description Stretch or trim the sequence, an item at a time, as the drag runs along it.
     * @param {Point} delta - How far the pointer moved since the last step.
     */
    public pull(delta: Point) {
        //Only the distance moved is given, so where the pointer is now is where it was plus all of it.
        this.pointer = this.pointer?.add(delta);

        const stroke = this.stroke;
        if (!stroke) return this.extend(this.pointer);
        if (stroke.pull(delta.x)) this.draw(stroke);
    }

    /**
     * @description End the stroke, keeping what it made.
     *
     * The document is put back as it was and the result written once over it, so that everything the drag
     * did lands in the history as a single step: one undo, not one per pixel.
     */
    public commit() {
        const stroke = this.stroke;
        this.stroke = undefined;
        this.anchor = undefined;
        //A drag that drew a passage leaves it drawn: that is the whole of what it had to do.
        if (!stroke) return;

        //Put the document back as the history knows it, then write the result over it once. The passage
        //stays marked over what it became, so it can be worked again straight away.
        const result = stroke.result;
        this.write(stroke, stroke.original);
        this.write(stroke, result, [{name: this.tool, from: 0, to: result.length}],
            result !== stroke.original);
    }

    /**
     * @description Take a span of the document apart into the items a stroke works on.
     * @param {object} range - The span to take.
     * @param {string} tool - The tool the stroke belongs to.
     * @protected
     */
    protected take(range: {from: number, to: number}, tool: string): Stroke {
        const text = this.editorState.doc.textBetween(range.from, range.to, "\n");

        //Leading and trailing space belongs to neither item, so the passage is narrowed past it rather than
        //carrying empty items around.
        const lead = text.length - text.trimStart().length;
        const original = text.trim();
        if (!original) return undefined;

        const from = range.from + lead;
        return new Stroke({
            from, text: original,
            //The stroke works out its own pivot and how far a drag is worth, and asks here for the one
            //thing it cannot know: where its text falls on screen.
            coordsAt: offset => this.editorView.coordsAtPos(from + offset)
        });
    }

    /**
     * @description Show where the stroke has got to, without yet committing to it.
     *
     * Rewriting the passage drops the mark that shows it, so the stroke's marks are laid on again with it.
     * @param {Stroke} stroke - The stroke to draw.
     * @protected
     */
    protected draw(stroke: Stroke) {
        const {trimmed, grown} = stroke.parts;

        this.write(stroke, stroke.text, [
            {name: this.tool, from: 0, to: stroke.text.length},
            {name: "erasing", ...trimmed},
            {name: "growing", ...grown}
        ]);
    }

    /**
     * @description Write a span's text, and mark parts of it, in one transaction.
     * @param {Stroke} stroke - The stroke whose span is being written.
     * @param {string} text - What the span should read.
     * @param {object[]} marks - Ranges to mark, as offsets into `text`.
     * @param {boolean} [record] - Whether the edit belongs in the undo history. Only the commit does.
     * @protected
     */
    protected write(stroke: Stroke, text: string, marks: {name: string, from: number, to: number}[] = [],
                    record: boolean = false) {
        const transaction = this.editorState.tr;
        transaction.insertText(text, stroke.from, stroke.from + stroke.length);

        for (const range of marks) {
            const mark = this.editorState.schema.marks[range.name];
            if (mark && range.to > range.from)
                transaction.addMark(stroke.from + range.from, stroke.from + range.to, mark.create());
        }

        if (!record) transaction.setMeta("addToHistory", false);
        this.editorView.dispatch(transaction);
        stroke.length = text.length;
    }

    /**
     * @description A range cut down to the block it starts in. A stroke reorders items within one run of
     * text; carrying it across a paragraph break would mean rewriting the document's structure, not its
     * sequence.
     * @protected
     */
    protected oneBlockOf(range: TextRange): TextRange {
        return {from: range.from, to: Math.min(range.to, this.editorState.doc.resolve(range.from).end())};
    }
}
