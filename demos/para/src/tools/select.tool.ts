import {GradumTool, GradumDragEvent, Coordinate, Propagation, behavior, define} from "../../../../build/gradum-kit.esm";

//Select tool
export class SelectTool extends GradumTool {
    public toolName = "select"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("gradum-drag", "select", (e, el) => {...});
    @behavior() public drag(e: GradumDragEvent, el: Node) {
        try {
            if ("modifiable" in el && !el.modifiable) return Propagation.propagate;
            else if ("move" in el && typeof el.move === "function") el.move(e.deltaPosition);
            else if ("translate" in el && typeof el.translate === "function") el.translate(e.deltaPosition);
            else if ("position" in el && typeof el.position === "object") el.position = e.deltaPosition.add(el.position as Coordinate);
            else return Propagation.propagate;
            return Propagation.stopPropagation;
        } catch (e) {return Propagation.stopPropagation}
    }
}

define(SelectTool);