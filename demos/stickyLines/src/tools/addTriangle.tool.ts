import {GradumTool, GradumEvent, Propagation, behavior, gradum} from "../../../../build/gradum-kit.esm";
import {Triangle} from "../triangle/triangle";

//Add circle tool
export class AddTriangleTool extends GradumTool {
    public toolName: string = "addTriangle"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("click", "addTriangle", (e, target) => {...});
    @behavior() public click(e: GradumEvent, target: Node) {
        if (gradum(target).metadata.get("substrate")) {
            Triangle.create({parent: target as Element, position: e.position, size: 60});
            return Propagation.stopPropagation;
        }
    }
}