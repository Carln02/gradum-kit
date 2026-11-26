import {GradumTool, behavior, GradumEvent, Color, Propagation} from "../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas/canvas";
import {Square} from "../square/square";

export class AddSquareTool extends GradumTool {
    public toolName: string = "addSquare";

    @behavior() click(e: GradumEvent, target: Node) {
        if (target instanceof Canvas) {
            Square.create({
                parent: target,
                data: {position: e.scaledPosition, color: Color.random()}
            });
            return Propagation.stopPropagation;
        }
    }
}