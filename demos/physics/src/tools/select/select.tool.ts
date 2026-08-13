import {
    GradumTool, GradumDragEvent, GradumEvent, gradum, Coordinate, Propagation, behavior
} from "../../../../../build/gradum-kit.esm";
import {SelectionBox} from "./selectionBox";
import {Square} from "../../square/square";

//Select tool
export class SelectTool extends GradumTool {
    public toolName = "select"; //Define the tool name
    protected selectionBox: SelectionBox;

    public onDeactivate() {
        this.selectionBox.clear();
    }

    //Clicking a modifiable element selects it, which puts a border and four resize grips over it. Clicking
    //anything else clears the selection.
    @behavior() public click(e: GradumEvent, el: Node) {
        if (gradum(el).metadata?.get("modifiable")) {
            if (!this.selectionBox) this.selectionBox = SelectionBox.create({parent: document.body});
            this.selectionBox.target = el;
            return Propagation.stopPropagation;
        }
        if (el === document.body) this.selectionBox.clear();
    }

    //Equivalent to gradum(tool).addToolBehavior("gradum-drag", "select", (e, el) => {...});
    @behavior() public drag(e: GradumDragEvent, el: Node) {
        try {
            if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
            if ("move" in el && typeof el.move === "function") el.move(e.deltaPosition);
            else if ("translate" in el && typeof el.translate === "function") el.translate(e.deltaPosition);
            else if ("position" in el && typeof el.position === "object") el.position = e.deltaPosition.add(el.position as Coordinate);
            else return Propagation.propagate;
            return Propagation.stopPropagation;
        } catch (e) {return Propagation.stopPropagation}
    }
}
