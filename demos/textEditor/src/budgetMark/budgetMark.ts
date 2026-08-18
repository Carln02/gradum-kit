import {Mark as TipTapMark} from "@tiptap/core";
import {Plugin, Transaction} from "@tiptap/pm/state";
import {constrainer, effect, Point} from "../../../../build/gradum-kit.esm";
import {Mark} from "../mark/mark";
import {BudgetMarkConstrainer} from "./budgetMark.constrainer";
import {BudgetPanel} from "../budgetPanel/budgetPanel";
import {TextEditor} from "../textEditor/textEditor";
import "./budgetMark.css";

/**
 * @class BudgetMark
 * @description A passage with a ceiling on how many words it may hold.
 *
 * The ceiling lives in the mark's own attributes rather than in a list kept beside the document. That way it
 * travels with the text as everything above it changes, it survives an undo, and two passages with different
 * ceilings stay two passages — which is what gives the constrainer a population to work on.
 *
 * Its own group, not the one the tools' passages share: a budget is meant to outlast the drag that set it,
 * where a selection is not.
 */
export class BudgetMark extends Mark {
    public static markName: string = "budget";
    public static group: string = "budget";

    //How far out in the margin the panel sits, past the edge of the editor.
    protected static readonly panelGap = 12;

    public static defaultProperties = {constrainers: BudgetMarkConstrainer};

    /**
     * @function definition
     * @static
     * @description The mark, and with it the one place a change can be turned down.
     *
     * ProseMirror asks a plugin before applying a change, which is the only moment at which one can be
     * refused — a checker of gradum's own is never consulted for typing, since typing never passes through
     * it. The answer comes from whoever holds the ceilings; the mark only carries the question.
     * @param {TextEditor} [editor] - The editor whose rule decides.
     */
    public static definition(editor?: TextEditor) {
        return TipTapMark.create({
            name: this.markName,
            group: this.group,
            //Inclusive, so a word typed at the end of a passage counts towards its ceiling rather than
            //falling out of it: half a word inside the budget and half outside is nobody's idea of a budget.
            inclusive: true,

            addAttributes() {
                return {
                    ...Mark.identityAttribute(),
                    max: {
                        default: null,
                        parseHTML: element => Number(element.getAttribute("data-max")),
                        renderHTML: attributes => ({"data-max": attributes.max})
                    }
                };
            },

            addProseMirrorPlugins() {
                const passages = () => (editor?.findMarks(this.name) ?? []) as BudgetMark[];

                return [new Plugin({
                    //Every budgeted passage gets a say: a change goes through when none of them would be
                    //left over its ceiling with no way back under it.
                    filterTransaction: transaction => passages().every(mark => mark.allows(transaction)),

                    props: {
                        //Typing is turned away here rather than by the veto above. A key refused only after
                        //the browser has already put it in the page leaves ProseMirror to undo the page, and
                        //what comes back is not always what was typed — a second space at the end came back
                        //as the full stop the system makes of two, dropped outside the passage. Turned away
                        //at the source, the key simply does nothing.
                        handleTextInput: (view, from, to, text) =>
                            passages().some(mark => mark.refuses(text, from))
                    }
                })];
            },

            parseHTML() {
                return [{tag: "span[data-budget]"}];
            },

            renderHTML({HTMLAttributes}) {
                return ["span", {"data-budget": "true", ...HTMLAttributes}, 0];
            }
        });
    }

    @constrainer("budget") protected constrainer: BudgetMarkConstrainer;
    protected panel: BudgetPanel;

    protected followText = () => this.showPanel();

    /**
     * @description How many words this passage may hold, or nothing when it has been given no ceiling.
     */
    public get max(): number {
        return this.attributes.max;
    }

    public set max(value: number) {
        if (value !== this.max) this.setAttributes({max: value});
    }

    /**
     * @description Whether the passage has no room left for another word.
     */
    public get full(): boolean {
        return this.max !== undefined && this.max !== null && this.words >= this.max;
    }

    /**
     * @function refuses
     * @description Whether the passage turns away text typed at it.
     *
     * A full passage takes nothing on its end that would start another word — a space, or anything with one
     * in it — since there would be no room for the word it begins, and the space would be left behind for
     * good. Letters are welcome: they join the word already there, and a passage is measured in words.
     * @param {string} text - What is being typed.
     * @param {number} at - Where it would go.
     */
    public refuses(text: string, at: number): boolean {
        return at === this.drawnRange?.to && this.full && /\s/.test(text);
    }

    /**
     * @function allows
     * @description Whether this passage would let a change through. Its rule decides; the passage only
     * carries the question, since the rule is not something the document can be asked about.
     * @param {Transaction} transaction - The change about to be applied.
     */
    public allows(transaction: Transaction): boolean {
        return this.constrainer?.allows(transaction) ?? true;
    }

    /**
     * @function settle
     * @description Settle a freshly drawn passage: it is given room for what it holds, and some to grow
     * into. Nothing happens to one that already has a ceiling — the number was set deliberately.
     */
    public settle() {
        this.constrainer.updateMax();
    }

    public initialize() {
        this.panel = BudgetPanel.create({parent: document.body});
        super.initialize();
        this.editor?.editor.on("update", this.followText);
    }

    /**
     * @description Take the ceiling from the panel whenever the number in it changes. Reading it is what
     * subscribes the passage to being retyped.
     * @protected
     */
    @effect protected updateMax() {
        if (this.panel.max !== undefined) this.max = this.panel.max;
    }

    /**
     * @description Keep the panel beside the passage as it is drawn out. An effect, so that it follows the
     * drag on its own: reading where the passage runs is what subscribes it to the passage moving.
     * @protected
     */
    @effect public draw() {
        super.draw();
        this.showPanel();
    }

    /**
     * @description Put the panel beside the passage, or take it away when there is no passage left — the
     * text under a budget can be erased like any other.
     * @protected
     */
    protected showPanel() {
        const range = this.range;
        if (!range || !this.panel) return this.panel?.hide();

        const start = this.editorView.coordsAtPos(range.from);
        const edge = this.editor.getBoundingClientRect();
        const gap = (this.constructor as typeof BudgetMark).panelGap;
        this.panel.show(this.words, this.max, new Point(edge.right + gap, start.top));
    }

    /**
     * @description Let go of the panel along with the passage. Called whether the passage was deleted or
     * simply vanished from the document, so a panel is never left behind pointing at nothing.
     */
    public delete(): this {
        this.editor?.editor?.off("update", this.followText);
        this.panel?.remove();
        this.panel = undefined;
        return this;
    }
}
