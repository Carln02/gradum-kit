import {GradumConstrainer, solver, ConstrainerCallbackProperties, GradumEventName, Point, gradum} from "../../../../build/gradum-kit.esm";
import {Canvas} from "./canvas";

export class CanvasSnapConstrainer extends GradumConstrainer<Canvas> {
    public constrainerName = "snap";
    public gridSize = 40;

    public defaultQueue = [];

    @solver() protected snap(properties: ConstrainerCallbackProperties) {
        if (properties.eventType !== GradumEventName.dragEnd) return;
        const object = properties.target;
        //An object ignoring the tool (e.g. locked by LockOperator) wasn't moved, so leave it where it is.
        if (gradum(object).isToolIgnored(properties.toolName)) return;
        if ("position" in object && object?.position instanceof Point) {
            object.position = object.position.round(this.gridSize);
        }
    }
}