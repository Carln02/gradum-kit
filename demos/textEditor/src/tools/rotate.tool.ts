import {GradumTool, GradumDragEvent, GradumEvent, gradum, Propagation, behavior, Anchor, Point} from "../../../../build/gradum-kit.esm";

//Rotate tool
export class RotateTool extends GradumTool {
    public toolName = "rotate"; //Define the tool name
    public activeClasses = "rotating"; //Marks the page while this tool is out
    public anchor: Anchor | Point = Anchor.Center;

    //Where the drag begins settles what it turns, before anything has moved.
    @behavior() public dragStart(e: GradumEvent, el: Node) {
        if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
        if ("startRotate" in el && typeof el.startRotate === "function") el.startRotate(e.position);
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }

    //Equivalent to gradum(tool).addToolBehavior("gradum-drag", "rotate", (e, el) => {...});
    @behavior() public drag(e: GradumDragEvent, el: Node) {
        if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
        const from = e.position.sub(e.deltaPosition);

        if ("rotate" in el && typeof el.rotate === "function") el.rotate(from, e.position, this.anchor);
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }

    //Turning is shown as it goes and settled here, so the whole sweep is one thing to undo.
    @behavior() public dragEnd(e: GradumDragEvent, el: Node) {
        if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
        if ("endRotate" in el && typeof el.endRotate === "function") el.endRotate();
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }
}
