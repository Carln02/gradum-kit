import {GradumTool, GradumDragEvent, gradum, Coordinate, Propagation, behavior} from "../../../../build/gradum-kit.esm";

//Select tool
export class SelectTool extends GradumTool {
    public toolName = "select"; //Define the tool name

    //On activation --> add class
    public onActivation() {
        gradum(this.element).toggleClass("active-tool", true);
    }

    public onDeactivation() {
        gradum(this.element).toggleClass("active-tool", false);
    }

    //Equivalent to gradum(tool).addToolBehavior("gradum-drag", "select", (e, el) => {...});
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