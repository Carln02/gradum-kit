import {GradumTool, behavior, GradumEvent, Color, Propagation} from "../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas/canvas";
import {Circle} from "../circle/circle";

export class AddCircleTool extends GradumTool {
    public toolName: string = "addCircle";

    @behavior() click(e: GradumEvent, target: Node) {
        if (target instanceof Canvas) {
            Circle.create({
                parent: target,
                data: {position: e.scaledPosition, color: Color.random()}
            });
            return Propagation.stopPropagation;
        }
    }
}