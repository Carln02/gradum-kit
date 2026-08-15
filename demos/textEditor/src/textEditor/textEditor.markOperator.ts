import {GradumOperator} from "../../../../build/gradum-kit.esm";
import {TextEditor} from "./textEditor";
import {EditorView} from "@tiptap/pm/view";
import {EditorState} from "@tiptap/pm/state";

export class TextEditorMarkOperator extends GradumOperator<TextEditor> {
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
     * @description Marks a range.
     */
    public mark(markName: string, range: { from: number, to: number }) {
        const mark = this.editorState.schema.marks[markName];
        if (!mark) return;

        const transaction = this.editorState.tr;
        this.editorView.dispatch(transaction
            .addMark(range.from, range.to, mark.create())
            .setMeta("addToHistory", false));
    }

    /**
     * @description Clears a mark then marks it on a range.
     */
    public remark(markName: string, range: { from: number, to: number }) {
        const mark = this.editorState.schema.marks[markName];
        if (!mark) return;

        const transaction = this.editorState.tr;
        this.editorView.dispatch(transaction
            .removeMark(0, transaction.doc.content.size, mark)
            .addMark(range.from, range.to, mark.create())
            .setMeta("addToHistory", false));
    }

    /**
     * @description Clear a mark from the whole document.
     */
    public unmark(markName: string) {
        const mark = this.editorState.schema.marks[markName];
        if (!mark) return;

        const transaction = this.editorState.tr;
        this.editorView.dispatch(transaction
            .removeMark(0, transaction.doc.content.size, mark)
            .setMeta("addToHistory", false));
    }

    /**
     * @description Every span currently carrying a mark, in document order.
     */
    public marked(markName: string): { from: number, to: number }[] {
        const mark = this.editorState.schema.marks[markName];
        if (!mark) return [];

        const ranges: { from: number, to: number }[] = [];
        this.editorState.doc.descendants((node, pos) => {
            if (node.isText && mark.isInSet(node.marks)) ranges.push({from: pos, to: pos + node.nodeSize});
        });
        return ranges;
    }
}