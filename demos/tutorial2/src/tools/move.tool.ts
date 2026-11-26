import {GradumTool, behavior, GradumDragEvent, Propagation, gradum} from "../../../../build/gradum-kit.esm";

export class MoveTool extends GradumTool {
    public toolName = "move";

    @behavior() drag(e: GradumDragEvent, target: Node) {
        if ("position" in target && typeof target.position === "object") {
            const delta = gradum(target).closest("my-canvas") ? e.scaledDeltaPosition : e.deltaPosition;
            target.position = delta.add(target.position as any);
        }
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }
}