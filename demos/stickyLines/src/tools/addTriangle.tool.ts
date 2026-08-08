import {GradumTool, GradumEvent, Propagation, behavior} from "../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas/canvas";
import {Triangle} from "../triangle/triangle";

//Add circle tool
export class AddTriangleTool extends GradumTool {
    public toolName: string = "addTriangle"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("click", "addTriangle", (e, target) => {...});
    @behavior() public click(e: GradumEvent, target: Node) {
        if (target instanceof Canvas) {
            const triangle = Triangle.create({parent: target, elementSize: 60});
            triangle.position = e.scaledPosition;
            return Propagation.stopPropagation;
        }
    }
}