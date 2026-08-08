import {GradumTool, GradumEvent, Propagation, behavior} from "../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas/canvas";
import {Circle} from "../circle/circle";

//Add circle tool
export class AddCircleTool extends GradumTool {
    public toolName: string = "addCircle"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("click", "addCircle", (e, target) => {...});
    @behavior() public click(e: GradumEvent, target: Node) {
        if (target instanceof Canvas) {
            const circle = Circle.create({parent: target, elementSize: 80});
            circle.position = e.scaledPosition;
            return Propagation.stopPropagation;
        }
    }
}