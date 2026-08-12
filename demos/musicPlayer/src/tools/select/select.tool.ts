import {Coordinate, gradum, GradumDragEvent, GradumTool, behavior, Propagation} from "../../../../../build/gradum-kit.esm";

export class SelectTool extends GradumTool {
    public toolName = "select";

    public onActivate() {
        gradum(this).toggleClass("selected", true);
    }

    public onDeactivate() {
        gradum(this).toggleClass("selected", false);
    }

    @behavior() public drag(e: GradumDragEvent, target: Node) {
        if ("origin" in target && typeof target.origin === "object") {
            target.origin = e.scaledDeltaPosition.add(target.origin as Coordinate).object;
            return Propagation.stopPropagation;
        }
    }
}