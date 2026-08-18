import {
    checker, ConstrainerCallbackProperties, GradumConstrainer, GradumNodeList, solver
} from "../../../../build/gradum-kit.esm";
import {Transaction} from "@tiptap/pm/state";
import {Node} from "@tiptap/pm/model";
import {BudgetMark} from "./budgetMark";
import {TextEditorTextOperator} from "../textEditor/textEditor.textOperator";
import {TextRange} from "../textEditor/textEditor.types";

/**
 * @type {BudgetedSpan}
 * @description Where a budgeted passage sits, and in which document. A change is judged against the document
 * it would produce, so a span found there has to be read there too — the same positions in the document on
 * screen are a character or two out.
 */
type BudgetedSpan = TextRange & {doc?: Node};

/**
 * @class BudgetMarkConstrainer
 * @description Holds a budgeted passage to the ceiling it was given.
 *
 * One of these belongs to each passage, which is the natural size of the rule: the ceiling is a ceiling, so
 * the constraint is simply that this passage never holds more words than its `max`, and the way back under
 * it is to eat the words in front of whatever pushed it over.
 *
 * It is a constrainer rather than a check inside the tool that set the ceiling, because by the time it
 * matters the tool is long gone: a passage can go over by being typed into, by another passage being
 * stretched into it, or by an undo. Whatever the cause, the same rule puts it right.
 */
export class BudgetMarkConstrainer extends GradumConstrainer<BudgetMark> {
    public keyName = "budget";
    public constrainerName = "budget";

    //How much room a passage is given over what it already holds, when a ceiling is first set on it.
    public headroom: number = 5;

    //Where the last change to the text left off, which is the point a ceiling eats forward from. Noted as
    //the change goes past on its way in, because by the time the rule is asked to put the passage right the
    //change is over and nothing is left to read it from.
    protected editAt: number;

    /**
     * @function editEnd
     * @static
     * @description Where a change leaves off. Read from the change itself rather than from the caret, so
     * that it is right whoever made it — a tool's stroke has no caret to speak of.
     * @param {Transaction} transaction - The change to read.
     */
    protected static editEnd(transaction: Transaction): number {
        let at: number;
        transaction.mapping.maps.forEach(map => map.forEach((_from, _to, _newFrom, newTo) => at = newTo));
        return at;
    }

    public initialize() {
        super.initialize();

        //Set going by anything that happens to the editor rather than by anything happening to the passage:
        //a passage goes over its ceiling by being typed into, and typing is not something done *to* it.
        this.triggerList = new GradumNodeList(this.element.editor);
        this.objectList = new GradumNodeList(this.element);
    }

    /**
     * @function updateMax
     * @description Give a freshly drawn passage a ceiling: room for what it holds, and some to grow into.
     *
     * A passage drawn over one that already has a ceiling keeps it — the number was set deliberately, and
     * redrawing the passage is not a reason to forget it.
     */
    public updateMax() {
        if (this.element.max == null) this.element.max = this.element.words + this.headroom;
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
     * a checker of gradum's own is never consulted for typing, since typing never passes through it. It is
     * also the only moment at which the change itself can be read, so this is where the rule takes note of
     * where it leaves off — what it eats forward from when it comes to trim.
     * @param {Transaction} transaction - The change about to be applied.
     * @returns {boolean} Whether to let it through.
     */
    public allows(transaction: Transaction): boolean {
        const allowed = this.judge(transaction);

        //Only a change that is going to happen is worth remembering the place of. A change this passage
        //allows can still be turned down by another passage's ceiling, which leaves the note pointing at
        //somewhere nothing happened — harmless, since a trim aimed outside the passage falls back to its
        //tail, and the next real change overwrites it.
        if (allowed && transaction.docChanged)
            this.editAt = BudgetMarkConstrainer.editEnd(transaction) ?? this.editAt;
        return allowed;
    }

    /**
     * @description The judgement behind {@link BudgetMarkConstrainer.allows}, kept apart from the note it
     * leaves so that the note is only made for changes that survive it.
     * @param {Transaction} transaction - The change about to be applied.
     * @protected
     */
    protected judge(transaction: Transaction): boolean {
        if (!transaction.docChanged) return true;

        //A gesture keeps its own account of the text it is working, so refusing its writes halfway through
        //would leave the two disagreeing. Its overshoot is trimmed once it lets go.
        if (transaction.getMeta("from-mark")) return true;

        //A change that moves no text cannot push a passage over its ceiling by adding words — lowering a
        //ceiling is such a change, and refusing it would mean the ceiling could never be brought down at
        //all. What it leaves over is this constrainer's to trim afterwards.
        const at = BudgetMarkConstrainer.editEnd(transaction);
        if (at === undefined) return true;

        //Judged against the document the change would produce, before it becomes that document.
        const passage = this.getRange(transaction.doc);
        if (!passage) return true;

        if (this.within(passage)) return true;
        return !!this.wordsAfterEdit(passage, this.excess(passage), at);
    }

    /**
     * @description Cut the passage back to its ceiling, eating forward from wherever it was last changed.
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
    @solver() protected trimToCeiling(properties: ConstrainerCallbackProperties) {
        const passage = this.getRange();
        if (!passage || this.within(passage)) return;

        const excess = this.excess(passage);
        const cut = this.wordsAfterEdit(passage, excess)
            ?? this.textOperator.wordsAtEnd(this.textOf(passage), excess);
        if (!cut) return;

        //Whatever is left hanging on the end goes with it: a passage ending in space is holding room for a
        //word it has no room for, and the next thing typed there is turned away.
        const text = this.textOf(passage);
        if (!text.slice(cut.to).trim()) cut.to = text.length;

        const view = this.element.editorView;
        view.dispatch(view.state.tr
            .delete(passage.from + cut.from, passage.from + cut.to)
            .setMeta("addToHistory", false));
    }

    /**
     * @description Where the passage sits in a document, or nothing when it is not in it.
     * @param {Node} [doc] - The document to look in. Defaults to the one on screen.
     * @protected
     */
    protected getRange(doc?: Node): BudgetedSpan {
        const found = BudgetMark.rangesOf(this.element.editorState, doc)
            .find(range => range.attributes?.id === this.element.id);
        return found && {...found, doc};
    }

    /**
     * @description What the editor knows about words, which is all this rule needs to know about them.
     * @protected
     */
    protected get textOperator(): TextEditorTextOperator {
        return this.element.editor.textOperator;
    }

    /**
     * @description Whether a span of this passage is within its ceiling.
     * @protected
     */
    protected within(passage: BudgetedSpan): boolean {
        const max = passage?.attributes?.max;
        return !passage || max === undefined || max === null || this.wordCount(passage) <= max;
    }

    /**
     * @description How many words over its ceiling a span of this passage is.
     * @protected
     */
    protected excess(passage: BudgetedSpan): number {
        return this.wordCount(passage) - (passage.attributes?.max ?? Infinity);
    }

    /**
     * @description The next `count` words after the last change, as offsets into the passage, with the space
     * in front of them so that removing them leaves no gap. Nothing when the change was at the end of the
     * passage, or outside it, and there is nothing in front to eat.
     * @protected
     */
    protected wordsAfterEdit(passage: BudgetedSpan, count: number, at: number = this.editAt): TextRange {
        if (at === undefined || at < passage.from || at > passage.to) return undefined;
        return this.textOperator.wordsAfter(this.textOf(passage), at - passage.from, count);
    }

    /**
     * @description How many words a span holds.
     * @protected
     */
    protected wordCount(passage: BudgetedSpan): number {
        return this.textOperator.countWords(this.textOf(passage));
    }

    /**
     * @description What a span reads, out of the document it was found in.
     * @protected
     */
    protected textOf(passage: BudgetedSpan): string {
        return this.textOperator.textIn(passage, passage?.doc);
    }
}
