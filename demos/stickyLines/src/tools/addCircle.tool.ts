import {GradumTool, GradumEvent, Propagation, behavior, gradum} from "../../../../build/gradum-kit.esm";
import {Circle} from "../circle/circle";

//Add circle tool
export class AddCircleTool extends GradumTool {
    public toolName: string = "addCircle"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("click", "addCircle", (e, target) => {...});
    @behavior() public click(e: GradumEvent, target: Node) {
        if (gradum(target).metadata.get("substrate")) {
            Circle.create({parent: target as Element, position: e.position, size: 80});
            return Propagation.stopPropagation;
        }
    }
}