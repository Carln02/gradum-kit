import {GradumTool, behavior, GradumEvent, Propagation, Point} from "../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas/canvas";
import {Note} from "../note/note";

export class AddNoteTool extends GradumTool {
    public toolName: string = "addNote";

    @behavior() click(e: GradumEvent, target: Node) {
        if (target instanceof Canvas) {
            Note.create({
                parent: target, data: {
                    position: e.scaledPosition,
                    color: "#fff8c5",
                    size: new Point(200, 200)
                }
            });
            return Propagation.stopPropagation;
        }
    }
}