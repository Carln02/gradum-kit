import {Coordinate, gradum, GradumDragEvent, GradumTool} from "../../../../../build/gradum-kit.esm";

export class SelectTool extends GradumTool {
    public toolName = "select";

    public onActivation() {
        gradum(this).toggleClass("selected", true);
    }

    public onDeactivation() {
        gradum(this).toggleClass("selected", false);
    }

    public drag(e: GradumDragEvent, target: Node): boolean {
        if ("origin" in target && typeof target.origin === "object") {
            target.origin = e.scaledDeltaPosition.add(target.origin as Coordinate).object;
            return true;
        }
    }
}