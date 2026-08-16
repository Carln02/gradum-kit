import {GradumTool, GradumDragEvent, GradumEvent, gradum, Coordinate, Point, Propagation, behavior, Anchor} from "../../../../build/gradum-kit.esm";

//Resize tool
export class ResizeTool extends GradumTool {
    public toolName = "resize"; //Define the tool name
    public activeClasses = "resizing"; //Marks the page while this tool is out
    public anchor: Anchor | Point = Anchor.Center;

    @behavior() public dragStart(e: GradumEvent, el: Node) {
        if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
        if ("startResize" in el && typeof el.startResize === "function") el.startResize(e.position);
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }

    //Equivalent to gradum(tool).addToolBehavior("gradum-drag", "resize", (e, el) => {...});
    @behavior() public drag(e: GradumDragEvent, el: Node) {
        try {
            if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
            if ("resize" in el && typeof el.resize === "function") el.resize(e.deltaPosition, this.anchor, e.keys.includes("Shift"));
            else if ("size" in el && typeof el.size === "object") el.size = e.deltaPosition.add(el.size as Coordinate);
            else return Propagation.propagate;
            return Propagation.stopPropagation;
        } catch (e) {return Propagation.stopPropagation}
    }

    @behavior() public dragEnd(e: GradumDragEvent, el: Node) {
        if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
        if ("endResize" in el && typeof el.endResize === "function") el.endResize(e.position);
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }
}
