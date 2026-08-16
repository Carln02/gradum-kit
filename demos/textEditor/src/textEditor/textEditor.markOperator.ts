import {GradumOperator} from "../../../../build/gradum-kit.esm";
import {TextEditor} from "./textEditor";
import {EditorView} from "@tiptap/pm/view";
import {EditorState} from "@tiptap/pm/state";
import {TextRange} from "./textEditor.types";

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
    public mark(markName: string, range: TextRange, addToHistory: boolean = false) {
        const mark = this.editorState.schema.marks[markName];
        if (!mark) return;

        const transaction = this.editorState.tr;
        this.editorView.dispatch(transaction
            .addMark(range.from, range.to, mark.create())
            .setMeta("addToHistory", addToHistory));
    }

    /**
     * @description Clears a mark then marks it on a range.
     */
    public remark(markName: string, range: TextRange, addToHistory: boolean = false) {
        const mark = this.editorState.schema.marks[markName];
        if (!mark) return;

        const transaction = this.editorState.tr;
        this.editorView.dispatch(transaction
            .removeMark(0, transaction.doc.content.size, mark)
            .addMark(range.from, range.to, mark.create())
            .setMeta("addToHistory", addToHistory));
    }

    /**
     * @description Clear a mark from the whole document.
     */
    public unmark(markName: string, addToHistory: boolean = false) {
        const mark = this.editorState.schema.marks[markName];
        if (!mark) return;

        const transaction = this.editorState.tr;
        this.editorView.dispatch(transaction
            .removeMark(0, transaction.doc.content.size, mark)
            .setMeta("addToHistory", addToHistory));
    }

    /**
     * @description The names of every mark in a group, as the marks themselves declare it.
     */
    public marksIn(group: string): string[] {
        return Object.values(this.editorState.schema.marks)
            .filter(mark => mark.spec.group?.split(" ").includes(group))
            .map(mark => mark.name);
    }

    /**
     * @description Every span currently carrying a mark, in document order.
     */
    public marked(markName: string): TextRange[] {
        const mark = this.editorState.schema.marks[markName];
        if (!mark) return [];

        const ranges: TextRange[] = [];
        this.editorState.doc.descendants((node, pos) => {
            if (node.isText && mark.isInSet(node.marks)) ranges.push({from: pos, to: pos + node.nodeSize});
        });
        return ranges;
    }

    /**
     * @description A single joined range that carries all the spans of a mark.
     */
    public markedJoined(markName: string): TextRange {
        const ranges = this.element.markOperator.marked(markName);
        return ranges.length ? {from: ranges[0].from, to: ranges[ranges.length - 1].to} : undefined;
    }

    public pointInMark(position: number, mark: TextRange): boolean {
        return mark && position >= mark.from && position <= mark.to;
    }

    /**
     * @description Clear a mark unless the given position is inside what it holds.
     */
    public unmarkUnlessAt(markName: string, position: number) {
        if (this.pointInMark(position, this.markedJoined(markName))) return;
        this.unmark(markName);
    }
}