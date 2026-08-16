import {Editor} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {Erasing} from "../marks/erasing";
import {Growing} from "../marks/growing";
import {ResizeSelection, RotateSelection, Selection} from "../marks/selection";
import {
    define, GradumElement, GradumEvent, GradumEventManager, GradumEventName, gradum, listener, Point, operator
} from "../../../../build/gradum-kit.esm";
import "./textEditor.css";
import {EditorView} from "@tiptap/pm/view";
import {EditorState} from "@tiptap/pm/state";
import {TextEditorMarkOperator} from "./textEditor.markOperator";
import {TextEditorStrokeOperator} from "./textEditor.strokeOperator";
import {TextEditorModel} from "./textEditor.model";

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
        operators: [TextEditorMarkOperator, TextEditorStrokeOperator]
    };

    public editor: Editor;

    @operator() markOperator: TextEditorMarkOperator;
    @operator() strokeOperator: TextEditorStrokeOperator;

    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "modifiable");
        GradumEventManager.instance.onToolChange.add(() => this.release());
    }

    /**
     * @description Let go of a passage when a click lands anywhere but on it.
     */
    @listener({type: GradumEventName.clickStart, target: document})
    protected releaseSelections(e: GradumEvent) {
        this.release(e.position);
    }

    @listener({type: "dragstart"})
    protected stopDragStart(e: GradumEvent) {
        e.preventDefault();
    }

    protected setupUIElements() {
        super.setupUIElements();
        this.editor = new Editor({
            element: this,
            extensions: [StarterKit, Erasing, Growing, ResizeSelection, RotateSelection],
            content: CONTENT,
        });
    }

    /**
     * @description ProseMirror's view.
     */
    public get editorView(): EditorView {
        return this.editor.view;
    }

    /**
     * @description The document as it stands, with its schema.
     */
    public get editorState(): EditorState {
        return this.editor.view.state;
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
        this.strokeOperator.startStroke(position);
    }

    public deleteAt(position: Point) {
        this.strokeOperator.continueStroke(position, "erasing");
    }

    public endDeleteAt() {
        const ranges = this.markOperator.marked(Erasing.name);
        this.markOperator.unmark(Erasing.name);
        if (ranges.length) this.editor.commands.deleteRange({from: ranges[0].from, to: ranges[ranges.length - 1].to});
        this.model.clearData();
    }

    /*
     *
     * ROTATE
     *
     */

    public startRotate(position: Point) {
        this.strokeOperator.startStroke(position);
        this.model.currentStroke = this.strokeOperator.strokeAtPoint(RotateSelection.name);
        if (this.model.currentStroke) this.strokeOperator.drawStroke();
        else this.markOperator.unmark(RotateSelection.name);
    }

    public rotate(_from: Point, to: Point) {
        if (!this.model.currentStroke) return this.strokeOperator.continueStroke(to, RotateSelection.name);
        if (this.model.currentStroke.turn(to)) this.strokeOperator.drawStroke();
    }

    public endRotate() {
        this.strokeOperator.commitStroke();
        this.model.clearData();
    }

    /*
     *
     * RESIZE
     *
     */

    public startResize(position: Point) {
        this.model.currentPosition = position;
        this.strokeOperator.startStroke(position);
        this.model.currentStroke = this.strokeOperator.strokeAtPoint(ResizeSelection.name);
        if (this.model.currentStroke) this.strokeOperator.drawStroke();
        else this.markOperator.unmark(ResizeSelection.name);
    }

    public resize(delta: Point) {
        this.model.currentPosition = this.model.currentPosition?.add(delta);
        if (!this.model.currentStroke) return this.strokeOperator.continueStroke(this.model.currentPosition, ResizeSelection.name);
        if (this.model.currentStroke.pull(delta.x)) this.strokeOperator.drawStroke();
    }

    public endResize() {
        this.strokeOperator.commitStroke();
        this.model.clearData();
    }

    /*
     *
     * UTILS
     *
     */

    /**
     * @description Where in the document a point on the screen falls, or `undefined` when it falls outside.
     */
    public positionAt(position: Point): number {
        return this.editorView.posAtCoords({left: position.x, top: position.y})?.pos;
    }

    public release(position?: Point) {
        const at = position ? this.positionAt(position) : undefined;
        for (const name of this.markOperator.marksIn(Selection)) this.markOperator.unmarkUnlessAt(name, at);
    }
}

define(TextEditor, "demo-text-editor");
