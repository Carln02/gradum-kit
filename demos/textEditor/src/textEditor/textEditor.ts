import {Editor} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {ErasingMark} from "../erasingMark/erasingMark";
import {RotateMark} from "../rotateMark/rotateMark";
import {ResizeMark} from "../resizeMark/resizeMark";
import {BudgetMark} from "../budgetMark/budgetMark";
import {
    define, GradumElement, GradumEvent, GradumEventManager, GradumEventName, gradum, GradumRect, listener,
    Point, operator
} from "../../../../build/gradum-kit.esm";
import "./textEditor.css";
import {EditorView} from "@tiptap/pm/view";
import {TextEditorMarkOperator} from "./textEditor.markOperator";
import {TextEditorTextOperator} from "./textEditor.textOperator";
import {TextEditorModel} from "./textEditor.model";
import {markTypes} from "../marks";
import {Mark} from "../mark/mark";

const CONTENT = `
    <h2>Lorem ipsum</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
    ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
    laborum.</p>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
    sunt explicabo.</p>
`;

export class TextEditor extends GradumElement<any, any, TextEditorModel> {
    public static defaultProperties = {
        model: TextEditorModel,
        operators: [TextEditorMarkOperator, TextEditorTextOperator]
    };

    public editor: Editor;

    @operator() protected markOperator: TextEditorMarkOperator;
    @operator() public textOperator: TextEditorTextOperator;

    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "modifiable");

        //Forward events to the marks themselves
        gradum(this).hitResolver = position => this.markOperator.marksAt(position);
        GradumEventManager.instance.onToolChange.add(() => this.markOperator.release());
    }

    /**
     * @description Let go of a passage when a click lands anywhere but on it.
     */
    @listener({type: GradumEventName.clickStart, target: document})
    protected releaseSelections(e: GradumEvent) {
        this.markOperator.release(e.position);
    }

    @listener({type: "dragstart"})
    protected stopDragStart(e: GradumEvent) {
        e.preventDefault();
    }

    protected setupUIElements() {
        super.setupUIElements();
        this.editor = new Editor({
            element: this,
            content: CONTENT,
            extensions: [StarterKit, ...markTypes.map(type => type.definition(this))],
        });

        //On every transaction -> remap all Marks
        //A change that was turned down comes through here just the same — TipTap announces every transaction
        //it is handed, applied or not — and is told apart by the document it left behind: a refused change
        //never became the editor's. Carrying the passages along with one would slide them over text that
        //never moved.
        this.editor.on("transaction", ({editor, transaction}) => {
            if (transaction.docChanged && editor.state.doc === transaction.doc)
                this.markOperator.remapMarks(transaction.mapping);
        });

        //On every document update -> add new Marks and remove deleted ones, and fire a Gradum event (to trigger constrainers)
        this.editor.on("update", () => {
            this.markOperator.syncMarks();
            if (this.markOperator.working) return;
            gradum(this).executeAction("text-changed", undefined, new CustomEvent("text-changed"));
        });
    }

    public get marks(): Mark[] {
        return this.markOperator.marks;
    }

    /**
     * @description ProseMirror's view.
     */
    public get editorView(): EditorView {
        return this.editor.view;
    }

    public destroy(): this {
        this.editor?.destroy();
        this.editor = undefined;
        return this;
    }

    /*
     *
     * DELETE
     *
     */

    public startDeleteAt(position: Point) {
        this.markOperator.createMark(ErasingMark, position);
    }

    public deleteAt(position: Point) {
        this.markOperator.drawTo(position);
    }

    public endDeleteAt() {
        this.markOperator.deleteMark(this.model.currentMark);
        this.model.clearData();
    }

    /*
     *
     * ROTATE
     *
     */

    public startRotate(position: Point) {
        this.markOperator.createMark(RotateMark, position);
    }

    public rotate(_from: Point, to: Point) {
        this.markOperator.drawTo(to);
    }

    /*
     *
     * RESIZE
     *
     */

    public startResize(position: Point) {
        this.model.currentPosition = position;
        this.markOperator.createMark(ResizeMark, position);
    }

    public resize(delta: Point) {
        //Only the distance moved is given, so where the pointer is now is where it was plus all of it.
        this.model.currentPosition = this.model.currentPosition?.add(delta);
        this.markOperator.drawTo(this.model.currentPosition);
    }

    public endResize() {
        this.model.clearData();
    }

    /*
     *
     * BUDGET
     *
     */

    public startBudget(position: Point) {
        this.markOperator.createMark(BudgetMark, position);
    }

    public budgetAt(position: Point) {
        this.markOperator.drawTo(position);
    }

    /**
     * @description Settle a freshly drawn passage: it is given room for what it holds, plus some to grow
     * into. Its panel is its own business, and comes up beside it on its own.
     */
    public endBudget() {
        const mark = this.model.currentMark as BudgetMark;
        if (!mark?.exists) return;
        mark.settle();
    }

    /*
     *
     * UTILS
     *
     */

    public findMarks(markName: string): Mark[] {
        return this.markOperator.findMarks(markName);
    }

    /**
     * @description Where in the document a point on the screen falls, or `undefined` when it falls outside.
     */
    public positionAt(position: Point): number {
        return this.editorView.posAtCoords({left: position.x, top: position.y})?.pos;
    }

    /**
     * @description The box a span of the document occupies on the screen — the other way round from
     * {@link TextEditor.positionAt}, and what a gesture takes its bearings from.
     *
     * Measured from where the span starts to where it ends, which for a span that wraps onto another line
     * ends to the left of where it began. Whoever measures against it has to know that.
     * @param {number} from - Where the span starts.
     * @param {number} to - Where it ends.
     */
    public rectAt(from: number, to: number): GradumRect {
        const start = this.editorView.coordsAtPos(from), end = this.editorView.coordsAtPos(to);
        return new GradumRect({
            x: start.left, y: start.top, width: end.right - start.left, height: end.bottom - start.top
        });
    }
}

define(TextEditor, "demo-text-editor");
