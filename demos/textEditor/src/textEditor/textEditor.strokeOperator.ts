import {GradumOperator, Point} from "../../../../build/gradum-kit.esm";
import {Erasing} from "../marks/erasing";
import {EditorView} from "@tiptap/pm/view";
import {EditorState} from "@tiptap/pm/state";
import {TextEditor} from "./textEditor";
import {Stroke} from "../stroke/stroke";
import {TextRange} from "./textEditor.types";
import {Growing} from "../marks/growing";
import {Budget} from "../marks/budget";
import {TextEditorModel} from "./textEditor.model";

export class TextEditorStrokeOperator extends GradumOperator<TextEditor, any, TextEditorModel> {
    /**
     * @description ProseMirror's view.
     */
    public get editorView(): EditorView {
        return this.element.editor.view;
    }

    /**
     * @description The document as it stands, with its schema.
     */
    public get editorState(): EditorState {
        return this.element.editor.view.state;
    }

    /**
     * @description Take a span of the document apart into the items a stroke works on.
     */
    protected makeStroke(range: TextRange, markName: string): Stroke {
        const text = this.editorState.doc.textBetween(range.from, range.to, "\n");
        const lead = text.length - text.trimStart().length;
        const from = range.from + lead;
        const trimmed = text.trim();
        if (!trimmed) return undefined;
        return Stroke.create({
            from, text: trimmed, markName,
            coordsAt: offset => this.editorView.coordsAtPos(from + offset)
        });
    }

    /**
     * @description The passage a mark holds at a point, ready to work, or nothing when the point is not on
     * it. Defaults to where the drag began, which is the point that decides what a drag is for.
     */
    public strokeAtPoint(markName: string, point: number = this.model.textAnchor): Stroke {
        const range = this.element.markOperator.markedJoined(markName);
        if (!this.element.markOperator.pointInMark(point, range)) return undefined;
        return this.makeStroke(range, markName);
    }

    /**
     * @description Draw the stroke's evolution.
     */
    public drawStroke(stroke: Stroke = this.model.currentStroke) {
        const {trimmed, grown} = stroke.parts;
        this.writeStroke(stroke, stroke.text, [
            {markName: stroke.markName, from: 0, to: stroke.text.length},
            {markName: Erasing.name, ...trimmed},
            {markName: Growing.name, ...grown}
        ]);
    }

    public startStroke(position: Point, clearExisting: boolean = true): number {
        if (!clearExisting && this.model.textAnchor) return this.model.textAnchor;
        this.model.textAnchor = this.element.positionAt(position);
        return this.model.textAnchor;
    }

    public continueStroke(position: Point, markName: string) {
        if (this.model.textAnchor === undefined) return;
        const at = this.element.positionAt(position);
        if (at === undefined) return;

        if (at === this.model.textAnchor) return this.element.markOperator.unmark(markName);
        this.element.markOperator.remark(markName, {
            from: Math.min(this.model.textAnchor, at),
            to: Math.max(this.model.textAnchor, at)
        });
    }

    public commitStroke(stroke: Stroke = this.model.currentStroke) {
        if (!stroke) return;
        const result = stroke.result;
        this.writeStroke(stroke, stroke.original);
        this.writeStroke(stroke, result, [{markName: stroke.markName, from: 0, to: result.length}],
            result !== stroke.original);
    }


    protected writeStroke(stroke: Stroke, text: string, marks: TextRange[] = [], addToHistory: boolean = false) {
        //Rewriting text drops every mark on it, and a budget is meant to outlast the stroke working under
        //it. One covering the whole passage is taken down here and laid back over what replaces it, so a
        //stretch cannot shake off its ceiling by rewriting the words that carried it.
        const budget = this.element.markOperator.marked(Budget.name).find(range =>
            range.from <= stroke.from && range.to >= stroke.from + stroke.length);

        const transaction = this.editorState.tr;
        transaction.insertText(text, stroke.from, stroke.from + stroke.length);
        if (budget) marks = [...marks, {markName: Budget.name, from: 0, to: text.length,
            attributes: budget.attributes}];

        for (const range of marks) {
            const mark = this.editorState.schema.marks[range.markName];
            if (mark && range.to > range.from)
                transaction.addMark(stroke.from + range.from, stroke.from + range.to,
                    mark.create(range.attributes));
        }

        if (!addToHistory) transaction.setMeta("addToHistory", false);
        //Said outright, so a rule can let a stroke's own writes through: a stroke keeps its own account of
        //the passage it is working, and refusing one halfway would leave the two disagreeing.
        this.editorView.dispatch(transaction.setMeta("from-stroke", true));
        stroke.length = text.length;
    }
}