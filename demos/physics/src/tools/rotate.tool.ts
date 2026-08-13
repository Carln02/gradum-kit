import {GradumTool, GradumDragEvent, gradum, Propagation, behavior, Anchor, Point} from "../../../../build/gradum-kit.esm";

//Rotate tool
export class RotateTool extends GradumTool {
    public toolName = "rotate"; //Define the tool name
    public anchor: Anchor | Point = Anchor.Center;

    //Equivalent to gradum(tool).addToolBehavior("gradum-drag", "rotate", (e, el) => {...});
    @behavior() public drag(e: GradumDragEvent, el: Node) {
        try {
            if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
            if ("rotate" in el && typeof el.rotate === "function") el.rotate(e.position.sub(e.deltaPosition), e.position, this.anchor);
            else return Propagation.propagate;
            return Propagation.stopPropagation;
        } catch (e) {return Propagation.stopPropagation}
    }
}
