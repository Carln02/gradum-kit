import {Editor} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {Erasing} from "../marks/erasing";
import {Growing} from "../marks/growing";
import {ResizeSelection, RotateSelection} from "../marks/selection";
import {
    define, GradumElement, GradumEvent, GradumEventManager, GradumEventName, gradum, listener, Point, operator
} from "../../../../build/gradum-kit.esm";
import "./textEditor.css";
import {EditorView} from "@tiptap/pm/view";
import {EditorState} from "@tiptap/pm/state";
import {TextEditorMarkOperator} from "./textEditor.markOperator";
import {TextEditorSequenceOperator} from "./textEditor.sequenceOperator";

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

export class TextEditor extends GradumElement {
    public static defaultProperties = {
        operators: [TextEditorMarkOperator, TextEditorSequenceOperator]
    };

    public editor: Editor;
    protected strokeAnchor: number;

    @operator() markOperator: TextEditorMarkOperator;
    @operator() sequenceOperator: TextEditorSequenceOperator;

    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "modifiable");

        //Reaching for another tool puts down whatever was in hand: a passage belongs to the tool that
        //marked it, and there is nothing to say what a passage marked by one tool means to another.
        GradumEventManager.instance.onToolChange.add(() => this.sequenceOperator.release());
    }

    /**
     * @description Let go of a passage when a click lands anywhere but on it.
     */
    @listener({type: GradumEventName.clickStart, target: document})
    protected releaseSelections(e: GradumEvent) {
        this.sequenceOperator.release(e.position);
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

    public deleteAt(position: Point) {
        const head = this.positionAt(position);
        if (head === undefined) return;
        this.strokeAnchor ??= head;

        this.markOperator.remark("erasing", {
            from: Math.min(this.strokeAnchor, head),
            to: Math.max(this.strokeAnchor, head)
        });
    }

    public endDeleteAt() {
        const ranges = this.markOperator.marked("erasing");
        this.strokeAnchor = undefined;

        this.markOperator.unmark("erasing");
        if (ranges.length) this.editor.commands.deleteRange({from: ranges[0].from, to: ranges[ranges.length - 1].to});
    }

    /**
     * @description Begin a stroke: on the passage this tool has marked it turns that passage, and anywhere
     * else it marks a new one.
     */
    public startRotate(position: Point) {
        this.sequenceOperator.begin(position, "rotate");
    }

    /**
     * @description Turn the sequence. A full circle cycles it once all the way round, so each step of
     * `360 / items` carries the last item to the front.
     */
    public rotate(from: Point, to: Point) {
        this.sequenceOperator.turn(from, to);
    }

    public endRotate() {
        this.sequenceOperator.commit();
    }

    /**
     * @description Begin a stroke: on the passage this tool has marked it stretches that passage, and
     * anywhere else it marks a new one.
     */
    public startResize(position: Point) {
        this.sequenceOperator.begin(position, "resize");
    }

    /**
     * @description Stretch or trim the sequence, an item at a time as the drag runs along it.
     */
    public resize(delta: Point) {
        this.sequenceOperator.pull(delta);
    }

    public endResize() {
        this.sequenceOperator.commit();
    }

    /**
     * @description Where in the document a point on the screen falls, or `undefined` when it falls outside.
     */
    public positionAt(position: Point): number {
        return this.editorView.posAtCoords({left: position.x, top: position.y})?.pos;
    }
}

define(TextEditor, "demo-text-editor");
