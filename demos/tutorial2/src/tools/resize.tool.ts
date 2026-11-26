import {GradumTool, behavior, GradumDragEvent, Propagation, gradum} from "../../../../build/gradum-kit.esm";

export class ResizeTool extends GradumTool {
    public toolName: string = "resize";

    @behavior() protected drag(e: GradumDragEvent, target: Node) {
        if ("size" in target && typeof target.size === "object") {
            const delta = gradum(target).closest("my-canvas") ? e.scaledDeltaPosition : e.deltaPosition;
            target.size = delta.mul(2).add(target.size as any);
        }
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }
}