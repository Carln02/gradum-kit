import {GradumTool, GradumDragEvent, Propagation, behavior, gradum, GradumEvent} from "../../../../build/gradum-kit.esm";

export class DeleteTool extends GradumTool {
    public toolName = "delete"; //Define the tool name
    public activeClasses = "deleting"; //Marks the page while this tool is out

    @behavior() public click(e: GradumEvent, el: Node) {
        if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
        if ("delete" in el && typeof el.delete === "function") el.delete(e.position);
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }

    @behavior() public dragStart(e: GradumEvent, el: Node) {
        if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
        if ("startDeleteAt" in el && typeof el.startDeleteAt === "function") el.startDeleteAt(e.position);
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }

    //Equivalent to gradum(tool).addToolBehavior("gradum-drag", "delete", (e, el) => {...});
    @behavior() public drag(e: GradumDragEvent, el: Node) {
        if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
        if ("deleteAt" in el && typeof el.deleteAt === "function") el.deleteAt(e.position);
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }

    @behavior() public dragEnd(e: GradumDragEvent, el: Node) {
        if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
        if ("endDeleteAt" in el && typeof el.endDeleteAt === "function") el.endDeleteAt(e.position);
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }
}