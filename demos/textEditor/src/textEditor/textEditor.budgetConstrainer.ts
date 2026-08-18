import {
    checker, ConstrainerCallbackProperties, GradumConstrainer, GradumNodeList, solver
} from "../../../../build/gradum-kit.esm";
import {EditorView} from "@tiptap/pm/view";
import {EditorState, Transaction} from "@tiptap/pm/state";
import {Node} from "@tiptap/pm/model";
import {TextEditor} from "./textEditor";
import {TextRange} from "./textEditor.types";
import {Budget} from "../marks/budget";
import {TextEditorModel} from "./textEditor.model";

//A budgeted passage, and the document it was read out of — which is not always the one on screen: a change
//is judged against the document it would produce, before it is allowed to become that document.
type BudgetedPassage = TextRange & {doc?: Node};

//What counts as a word: any run of non-space. The same rule the panel counts by, so the number on screen and
//the number the ceiling is measured against can never disagree.
const WORD = /\S+/g;

/**
 * @class TextEditorBudgetConstrainer
 * @description Holds every budgeted passage to the ceiling it was given.
 *
 * The ceiling is a ceiling, so the constraint is simply that a passage never holds more words than its
 * `max`, and the way back under it is to eat the words in front of whatever pushed it over.
 *
 * It is a constrainer rather than a check inside the tool that set the ceiling, because by the time it
 * matters the tool is long gone: the passage can go over by being typed into, by another passage being
 * stretched into it, or by an undo. Whatever the cause, the same rule puts it right.
 */
export class TextEditorBudgetConstrainer extends GradumConstrainer<TextEditor, any, TextEditorModel> {
    public constrainerName = "budget";

    public get editorView(): EditorView {
        return this.element.editor.view;
    }

    public get editorState(): EditorState {
        return this.element.editor.view.state;
    }

    public initialize() {
        super.initialize();

        //Anything happening to the editor is what sets this constrainer going: the toolkit solves it after
        //every event that reaches the editor, so nobody has to remember to ask for it.
        this.triggerList = new GradumNodeList(this.element);
        this.objectList = new GradumNodeList(this.element);
    }

    /**
     * @function allows
     * @description Whether a change may go through at all.
     *
     * A passage over its ceiling is normally put right afterwards, by eating the words in front of whatever
     * pushed it over. When there is nothing in front of them — a word typed at the end of a full passage —
     * there is no way back under the ceiling, so the change is refused instead of being allowed and then
     * half-undone.
     *
     * ProseMirror asks this before applying a change, which is the only moment at which one can be refused;
     * a checker of gradum's own is never consulted for typing, since typing never passes through it.
     * @param {Transaction} transaction - The change about to be applied.
     * @returns {boolean} Whether to let it through.
     */
    public allows(transaction: Transaction): boolean {
        if (!transaction.docChanged) return true;
        //A stroke keeps its own account of the text it is working, so refusing its writes halfway through
        //would leave the two disagreeing. Its overshoot is trimmed once it lets go.
        if (transaction.getMeta("from-stroke")) return true;

        const at = this.editEnd(transaction);
        return !this.passagesIn(transaction.doc).some(passage =>
            !this.check({target: passage}) && !this.wordsAfterEdit(passage, this.excess(passage), at));
    }

    /**
     * @function editEnd
     * @description Where a change leaves off, which is the point a ceiling eats forward from.
     * @param {Transaction} transaction - The change to read.
     */
    public editEnd(transaction: Transaction): number {
        let at: number;
        transaction.mapping.maps.forEach(map => map.forEach((_from, _to, _newFrom, newTo) => at = newTo));
        return at;
    }

    /**
     * @description Every budgeted passage in a document, each carrying that document so it can be measured
     * against the right one.
     * @param {Node} [doc] - The document to read. Defaults to the one on screen.
     */
    public passagesIn(doc?: Node): BudgetedPassage[] {
        return this.element.markOperator.marked(Budget.name, doc).map(passage => ({...passage, doc}));
    }

    /**
     * @description How many words over its ceiling a passage is.
     */
    public excess(passage: BudgetedPassage): number {
        return this.wordCount(passage) - (passage.attributes?.max ?? Infinity);
    }

    /**
     * @description How many words a passage holds.
     * @param {TextRange} passage - The passage to count.
     */
    public wordCount(passage: BudgetedPassage): number {
        return this.textOf(passage).match(WORD)?.length ?? 0;
    }

    /**
     * @description Whether a passage is within the ceiling it was given. A passage without one is never over.
     * @param {ConstrainerCallbackProperties} properties - The checking properties passed down by the toolkit.
     * @protected
     */
    @checker() protected withinBudget(properties: ConstrainerCallbackProperties): boolean {
        const passage = properties.target as BudgetedPassage;
        const max = passage?.attributes?.max;

        return max === undefined || max === null || this.wordCount(passage) <= max;
    }

    /**
     * @description Cut a passage back to its ceiling, eating forward from wherever it was last changed.
     *
     * A full passage typed into has to give up a word, and the one it gives up is the word after what was
     * just written — the text makes room for itself by swallowing what is in front of it, rather than losing
     * something at the far end where nobody is looking.
     *
     * Kept out of the undo history: the edit that pushed the passage over is already in there, and a
     * correction of its own would mean undoing it only to have it applied again on the way back.
     * @param {ConstrainerCallbackProperties} properties - The solving properties passed down by the toolkit.
     * @protected
     */
    @solver() protected trimToBudget(properties: ConstrainerCallbackProperties) {
        //Handed the editor, since that is what the event reached: the passages to put right are read back
        //out of the document, where they live.
        if (properties.target === this.element) return this.passagesIn()
            .forEach(passage => this.trimToBudget({...properties, target: passage}));
        if (this.withinBudget(properties)) return;

        const passage = properties.target as BudgetedPassage;
        const excess = this.excess(passage);
        const cut = this.wordsAfterEdit(passage, excess) ?? this.wordsAtEnd(passage, excess);
        if (!cut) return;

        const transaction = this.editorState.tr;
        this.editorView.dispatch(transaction
            .delete(passage.from + cut.from, passage.from + cut.to)
            .setMeta("addToHistory", false));
    }

    /**
     * @description The next `count` words after the last change, as offsets into the passage, with the space
     * in front of them so that removing them leaves no gap. Nothing when the change was at the end of the
     * passage, or outside it, and there is nothing in front to eat.
     * @protected
     */
    protected wordsAfterEdit(passage: BudgetedPassage, count: number,
                             at: number = this.model.lastEditAt): TextRange {
        if (at === undefined || at < passage.from || at > passage.to) return undefined;

        const text = this.textOf(passage);
        const following = [...text.matchAll(WORD)].filter(word => word.index >= at - passage.from);
        if (following.length < count) return undefined;

        const last = following[count - 1];
        return {from: Math.max(at - passage.from, following[0].index - 1), to: last.index + last[0].length};
    }

    /**
     * @description The last `count` words of a passage, as offsets into it. What a ceiling falls back to
     * when there is nothing in front of the change left to eat.
     * @protected
     */
    protected wordsAtEnd(passage: BudgetedPassage, count: number): TextRange {
        const text = this.textOf(passage);
        const words = [...text.matchAll(WORD)];
        const first = words[words.length - count];
        if (!first) return {from: 0, to: text.length};

        return {from: Math.max(0, first.index - 1), to: text.length};
    }

    /**
     * @description The text a passage holds.
     * @protected
     */
    protected textOf(passage: BudgetedPassage): string {
        return (passage.doc ?? this.editorState.doc).textBetween(passage.from, passage.to, "\n");
    }

}
