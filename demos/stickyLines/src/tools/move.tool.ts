import {GradumTool, GradumDragEvent, Coordinate, Propagation, behavior} from "../../../../build/gradum-kit.esm";

//Move tool
export class MoveTool extends GradumTool {
    public toolName = "move"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("gradum-drag", "move", (e, el) => {...});
    @behavior() public drag(e: GradumDragEvent, el: Node) {
        try {
            if ("move" in el && typeof el.move === "function") el.move(e.deltaPosition);
            else if ("translate" in el && typeof el.translate === "function") el.translate(e.deltaPosition);
            else if ("position" in el && typeof el.position === "object") el.position = e.deltaPosition.add(el.position as Coordinate);
            else return Propagation.propagate;
            return Propagation.stopPropagation;
        } catch (e) {return Propagation.stopPropagation}
    }
}