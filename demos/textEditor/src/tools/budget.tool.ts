import {GradumTool, GradumDragEvent, GradumEvent, gradum, Propagation, behavior} from "../../../../build/gradum-kit.esm";

//Budget tool: draw a passage, and it is given a ceiling on how many words it may hold.
export class BudgetTool extends GradumTool {
    public toolName = "budget"; //Define the tool name
    public activeClasses = "budgeting";

    @behavior() public dragStart(e: GradumEvent, el: Node) {
        if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
        if ("startBudget" in el && typeof el.startBudget === "function") el.startBudget(e.position);
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }

    @behavior() public drag(e: GradumDragEvent, el: Node) {
        if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
        if ("budgetAt" in el && typeof el.budgetAt === "function") el.budgetAt(e.position);
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }

    @behavior() public dragEnd(e: GradumDragEvent, el: Node) {
        if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
        if ("endBudget" in el && typeof el.endBudget === "function") el.endBudget(e.position);
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }
}
