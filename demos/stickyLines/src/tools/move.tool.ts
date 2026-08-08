import {TurboTool, TurboDragEvent, Coordinate, Propagation, behavior} from "../../../../build/gradum-kit.esm";

//Move tool
export class MoveTool extends TurboTool {
    public toolName = "move"; //Define the tool name

    //Equivalent to turbo(tool).addToolBehavior("turbo-drag", "move", (e, el) => {...});
    @behavior() public drag(e: TurboDragEvent, el: Node) {
        try {
            if ("move" in el && typeof el.move === "function") el.move(e.deltaPosition);
            else if ("translate" in el && typeof el.translate === "function") el.translate(e.deltaPosition);
            else if ("position" in el && typeof el.position === "object") el.position = e.deltaPosition.add(el.position as Coordinate);
            else return Propagation.propagate;
            return Propagation.stopPropagation;
        } catch (e) {return Propagation.stopPropagation}
    }
}