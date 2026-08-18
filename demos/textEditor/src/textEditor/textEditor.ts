import {Editor} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {Erasing} from "../marks/erasing";
import {Growing} from "../marks/growing";
import {ResizeSelection, RotateSelection, Selection} from "../marks/selection";
import {Budget} from "../marks/budget";
import {
    constrainer, define, GradumElement, GradumEvent, GradumEventManager, GradumEventName, gradum, listener,
    Point, operator
} from "../../../../build/gradum-kit.esm";
import "./textEditor.css";
import {EditorView} from "@tiptap/pm/view";
import {TextEditorMarkOperator} from "./textEditor.markOperator";
import {TextEditorStrokeOperator} from "./textEditor.strokeOperator";
import {TextEditorModel} from "./textEditor.model";
import {TextEditorBudgetConstrainer} from "./textEditor.budgetConstrainer";
import {BudgetPanel} from "../budgetPanel/budgetPanel";
import {TextRange} from "./textEditor.types";

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
        operators: [TextEditorMarkOperator, TextEditorStrokeOperator],
        constrainers: TextEditorBudgetConstrainer
    };

    //How much room a passage is given over what it already holds, when a budget is first set on it.
    public headroom: number = 20;

    protected budgetPanel: BudgetPanel;

    public editor: Editor;

    @constrainer() budgetConstrainer: TextEditorBudgetConstrainer;
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
            content: CONTENT,
            extensions: [
                StarterKit, Erasing, Growing, ResizeSelection, RotateSelection,
                Budget.configure({allows: transaction => this.budgetConstrainer?.allows(transaction) ?? true})
            ],
        });

        //The mark travels with the text on its own, but the position remembering which passage the panel is
        //about does not: text added above it pushes it along, and it has to be carried with it.
        this.editor.on("transaction", ({transaction}) => {
            if (!transaction.docChanged) return;

            //Where the change left off. Read from the transaction rather than from the caret, so that it is
            //right whoever made the change — a tool's stroke has no caret to speak of.
            this.model.lastEditAt = this.budgetConstrainer.editEnd(transaction) ?? this.model.lastEditAt;

            if (this.model.budgetAnchor !== undefined)
                this.model.budgetAnchor = transaction.mapping.map(this.model.budgetAnchor);
        });

        //A change to the text is announced as an event of its own, because ProseMirror's changes are the one
        //kind the toolkit cannot see: nothing about typing passes through it. Announcing is all the editor
        //does — which constrainers that leaves to put right is their business, not its.
        //
        //Held off while a stroke is live: the stroke keeps its own account of how long the passage is, and
        //cutting the text from under it mid-drag would leave the two disagreeing. It bites on release.
        this.editor.on("update", () => {
            if (this.model.currentStroke) return;
            gradum(this).executeAction("text-changed", undefined, new CustomEvent("text-changed"));
            this.showBudget();
        });

        this.budgetPanel = BudgetPanel.create({parent: document.body});
        this.budgetPanel.onMaxChanged.add(max => this.setBudgetMax(max));
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
        const stroke = this.model.currentStroke;
        this.model.clearData();
        this.strokeOperator.commitStroke(stroke);
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
        const stroke = this.model.currentStroke;
        this.model.clearData();
        this.strokeOperator.commitStroke(stroke);
    }

    /*
     *
     * BUDGET
     *
     */

    public startBudget(position: Point) {
        this.strokeOperator.startStroke(position);
    }

    public budgetAt(position: Point) {
        this.strokeOperator.continueStroke(position, Budget.name);
    }

    /**
     * @description Settle a freshly drawn passage: it is given room for what it holds, plus some to grow
     * into, and its panel comes up beside it.
     */
    public endBudget() {
        const passage = this.markOperator.marked(Budget.name)
            .find(range => this.markOperator.pointInMark(this.model.textAnchor, range));
        if (!passage) return this.showBudget();

        //Only a passage that has just been drawn has no ceiling yet; one drawn over an old one keeps its.
        if (passage.attributes?.max == null) {
            this.markOperator.mark(Budget.name, {
                ...passage,
                attributes: {max: this.budgetConstrainer.wordCount(passage) + this.headroom}
            });
        }

        this.model.budgetAnchor = passage.from;
        this.showBudget();
    }

    /**
     * @description Bring up the panel for the budgeted passage under a point, if there is one.
     */
    public focusBudget(position: Point) {
        const at = this.positionAt(position);
        const passage = this.markOperator.marked(Budget.name)
            .find(range => this.markOperator.pointInMark(at, range));

        this.model.budgetAnchor = passage?.from;
        this.showBudget();
    }

    /**
     * @description Give the passage in hand a new ceiling. The constrainer takes it from there.
     */
    public setBudgetMax(max: number) {
        const passage = this.budgetedPassage();
        if (!passage) return;

        this.markOperator.mark(Budget.name, {...passage, attributes: {max}});
    }

    /**
     * @description Show the panel beside the passage in hand, and take it away when there is none left —
     * the text it was about can be erased like any other.
     * @protected
     */
    protected showBudget() {
        const passage = this.budgetedPassage();
        if (!passage) return this.budgetPanel?.hide();

        //Beside the passage rather than over it: out in the margin, level with where it starts.
        const start = this.editorView.coordsAtPos(passage.from);
        const edge = this.getBoundingClientRect();
        this.budgetPanel.show(this.budgetConstrainer.wordCount(passage), passage.attributes?.max,
            new Point(edge.right + 12, start.top));
    }

    /**
     * @description The budgeted passage the panel is about, found again by where it starts.
     * @protected
     */
    protected budgetedPassage(): TextRange {
        if (this.model.budgetAnchor === undefined) return undefined;
        return this.markOperator.marked(Budget.name)
            .find(range => this.markOperator.pointInMark(this.model.budgetAnchor, range));
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
