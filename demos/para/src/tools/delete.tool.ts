import {GradumTool, GradumDragEvent, Propagation, behavior, gradum, GradumEvent} from "../../../../build/gradum-kit.esm";

/**
 * @class DeleteTool
 * @description Takes away whatever says it can be taken away.
 *
 * Unlike the tools that move things about, this one does not ask whether its target is modifiable: a square
 * in the middle of a list is placed by the reifect rather than by hand, which is a reason for the select tool
 * to leave it alone but no reason at all why it cannot be deleted. Saying `delete` is the whole of the
 * permission — what deleting one means is the thing's own business.
 */
export class DeleteTool extends GradumTool {
    public toolName = "delete"; //Define the tool name
    public activeClasses = "erasing"; //Marks the page while this tool is out

    public radius: number = 12;

    @behavior() public click(e: GradumEvent, el: Node) {
        if ("delete" in el && typeof el.delete === "function") el.delete(e.position);
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