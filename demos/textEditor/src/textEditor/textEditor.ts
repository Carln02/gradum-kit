import {Editor} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {Erasing} from "../marks/erasing";
import {define, GradumElement, gradum, Point, operator} from "../../../../build/gradum-kit.esm";
import "./textEditor.css";
import {EditorView} from "@tiptap/pm/view";
import {EditorState} from "@tiptap/pm/state";
import {TextEditorMarkOperator} from "./textEditor.markOperator";

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
        operators: TextEditorMarkOperator
    };

    public editor: Editor;
    protected strokeAnchor: number;

    @operator() markOperator: TextEditorMarkOperator;

    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "modifiable");
    }

    protected setupUIElements() {
        super.setupUIElements();
        this.editor = new Editor({
            element: this,
            extensions: [StarterKit, Erasing],
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
     * @description Where in the document a point on the screen falls, or `undefined` when it falls outside.
     */
    protected positionAt(position: Point): number {
        return this.editorView.posAtCoords({left: position.x, top: position.y})?.pos;
    }
}

define(TextEditor, "demo-text-editor");
