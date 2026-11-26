import {GradumTool, behavior, GradumEvent, Propagation} from "../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas/canvas";
import {Clock} from "../clock/clock";

export class AddClockTool extends GradumTool {
    public toolName: string = "addClock";

    @behavior() click(e: GradumEvent, target: Node) {
        if (target instanceof Canvas) {
            Clock.create({parent: target, data: {position: e.scaledPosition, color: "white"}});
            return Propagation.stopPropagation;
        }
    }
}
