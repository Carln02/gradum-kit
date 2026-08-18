import {
    define, div, effect, GradumElement, gradum, input, Point, signal, span
} from "../../../../build/gradum-kit.esm";
import "./budgetPanel.css";

export class BudgetPanel extends GradumElement {
    @signal public words: number = 0;
    @signal public max: number;

    @signal public position: Point;

    protected count: HTMLElement;
    protected limit: HTMLInputElement;

    protected setupUIElements() {
        this.count = span({classes: "budget-count"});
        this.limit = input({type: "number", classes: "budget-max", min: "0"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([
            this.count,
            div({classes: "budget-separator", text: "/"}),
            this.limit
        ]);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        this.limit.addEventListener("change", () => this.max = Number(this.limit.value));
    }

    @effect private updateCount() {
        this.count.textContent = `${this.words}`;
        gradum(this.count).toggleClass("over", this.words > this.max);
    }

    @effect private updateMax() {
        if (document.activeElement !== this.limit) this.limit.value = `${this.max ?? ""}`;
    }

    @effect private updatePosition() {
        if (!this.position) return;
        gradum(this).setStyles({left: `${this.position.x}px`, top: `${this.position.y}px`});
    }

    /**
     * @description Show the panel for a passage, or hide it when there is none.
     */
    public show(words: number, max: number, anchor: Point) {
        this.words = words;
        this.max = max;
        this.position = anchor;
        gradum(this).addClass("shown");
    }

    public hide() {
        gradum(this).removeClass("shown");
    }
}

define(BudgetPanel, "demo-budget-panel");
