import {GradumTool, GradumDragEvent, gradum, Coordinate, Point, Propagation, behavior, Anchor} from "../../../../build/gradum-kit.esm";

//Resize tool
export class ResizeTool extends GradumTool {
    public toolName = "resize"; //Define the tool name
    public anchor: Anchor | Point = Anchor.Center;

    //Equivalent to gradum(tool).addToolBehavior("gradum-drag", "resize", (e, el) => {...});
    @behavior() public drag(e: GradumDragEvent, el: Node) {
        try {
            let delta = e.deltaPosition.mul(2);
            //Holding Shift maintains the ratio
            if (e.keys.includes("Shift")) delta = new Point(delta.min, delta.min);

            if ("resize" in el && typeof el.resize === "function") el.resize(delta, this.anchor);
            else if ("size" in el && typeof el.size === "object") el.size = delta.add(el.size as Coordinate);
            else return Propagation.propagate;
            return Propagation.stopPropagation;
        } catch (e) {return Propagation.stopPropagation}
    }
}