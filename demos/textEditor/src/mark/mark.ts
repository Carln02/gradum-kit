import {effect, GradumHeadlessElement, gradum, randomId, signal} from "../../../../build/gradum-kit.esm";
import {TextEditor} from "../textEditor/textEditor";
import {TextRange} from "../textEditor/textEditor.types";
import {AnyExtension} from "@tiptap/core";
import {EditorView} from "@tiptap/pm/view";
import {EditorState} from "@tiptap/pm/state";
import {MarkType, Node} from "@tiptap/pm/model";
import {Mapping} from "@tiptap/pm/transform";
import {MarkProperties} from "./mark.types";

/**
 * @class Mark
 * @description A marked passage of the editor's text, as an object a tool can take hold of.
 *
 * The same idea as the squares a canvas draws: the editor is a surface the DOM cannot see into, so what is
 * inside it is given objects of its own, and those objects join the event dispatch as if they were children
 * of the editor.
 *
 * The difference is where the truth lives. A square *is* the thing it draws; a mark is only a handle on a
 * range of a document that belongs to ProseMirror. So nothing here holds a position — it holds an identity,
 * and asks the document where that identity currently sits. A handle cannot go stale that way: text inserted
 * above it, an undo, a stroke rewriting the words underneath, and it still finds itself.
 */
export class Mark extends GradumHeadlessElement {
    /**
     * @description What this kind of mark is called in the document's schema. Every kind names itself, and
     * {@link Mark.definition} says how the document should hold it.
     */
    public static markName: string;

    /**
     * @function definition
     * @static
     * @description The mark as the document knows it: what it is called, how it behaves when typed against,
     * and how it is written out. Handed to the editor's extensions, so the class that stands for a mark is
     * also the one that says what the mark is.
     * @param {TextEditor} [editor] - The editor it is being defined for, for a mark that needs to reach it.
     */
    public static definition(editor?: TextEditor): AnyExtension {
        return undefined;
    }

    /**
     * @description The attribute that gives a mark an identity of its own.
     *
     * A mark carrying one is something the editor keeps an object for. The identity lives in the document rather
     * than beside it, so it rides along with the text through every edit and comes back with an undo — which is
     * what lets an object hold onto its mark without ever holding a position that can go stale.
     */
    public static identityAttribute = () => ({
        id: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute("data-id"),
            renderHTML: (attributes: Record<string, any>) => attributes.id ? {"data-id": attributes.id} : {}
        }
    });

    /**
     * @function rangesOf
     * @static
     * @description Every span a mark of the given kind covers in a document, in order.
     *
     * Runs that touch and say the same about themselves are one span as far as anyone outside is concerned:
     * a mark splits wherever the text does — at a bold word, say — without meaning anything by it.
     * @param {EditorState} state - The state to read.
     * @param {Node} [doc] - The document to read. Defaults to the state's own, which is not always the one
     * wanted: a change can be judged against the document it would produce, before it becomes that document.
     */
    public static rangesOf(state: EditorState, doc: Node = state?.doc): TextRange[] {
        const markName = this.markName;
        const type = state?.schema.marks[markName];
        if (!type || !doc) return [];

        const ranges: TextRange[] = [];
        doc.descendants((node, position) => {
            const found = node.isText && type.isInSet(node.marks);
            if (!found) return;

            const range = {markName, from: position, to: position + node.nodeSize, attributes: found.attrs};
            const previous = ranges[ranges.length - 1];
            if (previous?.to === range.from && this.sameAttributes(previous, range)) previous.to = range.to;
            else ranges.push(range);
        });
        return ranges;
    }

    /**
     * @function sameAttributes
     * @static
     * @description Whether two ranges carry a mark saying the same about itself.
     */
    public static sameAttributes(one: TextRange, other: TextRange): boolean {
        return JSON.stringify(one?.attributes ?? {}) === JSON.stringify(other?.attributes ?? {});
    }

    public declare properties: MarkProperties;

    /**
     * @description What finds this mark again in the document, carried in the mark's own attributes.
     */
    public id: string;

    @signal public anchor: number;
    @signal public edge: number;

    public get from(): number {
        return Math.min(this.anchor, this.edge);
    }

    public get to(): number {
        return Math.max(this.anchor, this.edge);
    }

    /**
     * @description Which kind of mark it is, which is also what it is called in the schema. Read off the
     * class rather than kept twice: a `RotateMark` is a "rotating" mark by virtue of being one.
     */
    public get markName(): string {
        return (this.constructor as typeof Mark).markName;
    }

    /**
     * @description The editor whose text it marks.
     */
    public readonly editor: TextEditor;

    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "modifiable");
        //Assign the parent of the Mark
        gradum(this).hitParent = this.editor;
        this.id ??= randomId();
    }

    public get editorView(): EditorView {
        return this.editor?.editorView;
    }

    public get editorState(): EditorState {
        return this.editor?.editorView.state;
    }

    /**
     * @description Where the mark sits in the document right now, or nothing when it is no longer there.
     *
     * Read from the document rather than kept here. A mark is a hold on a range that belongs to ProseMirror,
     * and the text under it moves — typed above, undone, rewritten by a stroke. Asking each time is what
     * keeps a hold from going stale.
     */
    public get range(): TextRange {
        if (this.anchor !== undefined && this.edge !== undefined && this.to > this.from)
            return {markName: this.markName, from: this.from, to: this.to, attributes: this.attributes};
        return this.drawnRange;
    }

    /**
     * @description Where the document currently has it, which is where it was last drawn.
     */
    public get drawnRange(): TextRange {
        return this.ranges.find(range => range.attributes?.id === this.id);
    }

    /**
     * @description Every span this kind of mark covers in the document, this one's among them.
     */
    public get ranges(): TextRange[] {
        return (this.constructor as typeof Mark).rangesOf(this.editorState);
    }

    /**
     * @description The kind of mark this is, as the document's schema holds it.
     */
    public get type(): MarkType {
        return this.editorState?.schema.marks[this.markName];
    }

    /**
     * @description What the mark's own attributes say — its ceiling, for one that has one.
     */
    public get attributes(): Record<string, any> {
        return this.drawnRange?.attributes ?? {};
    }

    /**
     * @function draw
     * @description Put the mark in the document where this passage says it goes.
     *
     * How a passage renders itself, and it does so on its own: setting {@link Mark.edge} is all anyone else
     * has to do. Nothing is written when the document already reads that way, which is
     * what keeps a passage from arguing with the text it marks.
     */
    @effect public draw() {
        const {from, to} = this;
        if (!this.type) return;

        const current = this.drawnRange;
        if (current?.from === from && current?.to === to) return;

        const transaction = this.editorState.tr;
        if (current) transaction.removeMark(current.from, current.to, this.type);
        if (from !== undefined && to > from)
            transaction.addMark(from, to, this.type.create({...this.attributes, id: this.id}));

        this.editorView.dispatch(transaction
            .setMeta("addToHistory", false)
            .setMeta("from-mark", true));
    }

    /**
     * @function remap
     * @description Carry the passage along with a change to the text: what it marks can move without it
     * having anything to do with it — text typed above it, an undo, another passage rewriting its words.
     * @param {Mapping} mapping - How the change moved the document's positions.
     */
    public remap(mapping: Mapping) {
        if (this.anchor === undefined) return;
        this.anchor = mapping.map(this.anchor);
        this.edge = mapping.map(this.edge);
    }

    /**
     * @function delete
     * @description Let go of the passage: take the mark out of the document, and stop being one of the
     * editor's. What that leaves behind is each kind's own business — an erasing passage takes the text
     * with it, a budget leaves the words where they are.
     */
    public delete() {
        const range = this.drawnRange;
        if (range && this.type) this.editorView.dispatch(this.editorState.tr
            .removeMark(range.from, range.to, this.type)
            .setMeta("addToHistory", false)
            .setMeta("from-mark", true));
        this.anchor = undefined;
        this.edge = undefined;
    }

    /**
     * @description Whether the mark is still in the document. Erasing the text it covers takes it with it.
     */
    public get exists(): boolean {
        return !!this.range;
    }

    /**
     * @description The text it marks.
     */
    public get text(): string {
        return this.editor?.textOperator.textIn(this.range) ?? "";
    }

    /**
     * @description How many words it holds.
     */
    public get words(): number {
        return this.editor?.textOperator.countWords(this.text) ?? 0;
    }

    /**
     * @description Whether a position in the document falls inside it.
     */
    public covers(position: number): boolean {
        const range = this.range;
        return !!range && position >= range.from && position <= range.to;
    }

    /**
     * @description Change what the mark's attributes say, leaving the rest of them alone.
     */
    public setAttributes(attributes: Record<string, any>): this {
        this.draw();
        const range = this.drawnRange;
        if (!range || !this.type) return this;

        this.editorView.dispatch(this.editorState.tr
            .removeMark(range.from, range.to, this.type)
            .addMark(range.from, range.to,
                this.type.create({...range.attributes, ...attributes, id: this.id}))
            .setMeta("addToHistory", false)
            .setMeta("from-mark", true));
        return this;
    }

    /**
     * @function write
     * @description Replace the text the mark covers, and lay the marks back over what replaces it.
     *
     * Rewriting text drops every mark on it, so this one is put back — identity and all, or the passage
     * would become a new one every time it is worked. Marks that outlast a stroke, a budget's ceiling among
     * them, are put back too.
     * @param {string} text - What the passage should read.
     * @param {TextRange[]} [marks] - Anything else to mark, as offsets into `text`.
     * @param {boolean} [record] - Whether the edit belongs in the undo history. Only a commit does.
     */
    public write(text: string, marks: TextRange[] = [], record: boolean = false) {
        const range = this.range;
        if (!range) return;

        //Marks that outlast a rewrite belong to other passages, and each of those is an object: ask them
        //where they are rather than trawling the document for them.
        const lasting = this.editor.marks
            .filter(other => other !== this && other.range?.from <= range.from && other.range?.to >= range.to)
            .map(other => ({markName: other.markName, from: 0, to: 0, attributes: other.attributes}));

        const transaction = this.editorState.tr;
        transaction.insertText(text, range.from, range.to);

        const all = [{markName: this.markName, from: 0, to: text.length, attributes: range.attributes},
            ...lasting.map(other => ({...other, to: text.length})), ...marks];

        for (const entry of all) {
            const mark = this.editorState.schema.marks[entry.markName];
            if (mark && entry.to > entry.from)
                transaction.addMark(range.from + entry.from, range.from + entry.to,
                    mark.create(entry.attributes));
        }

        if (!record) transaction.setMeta("addToHistory", false);
        this.editorView.dispatch(transaction.setMeta("from-mark", true));
    }
}
