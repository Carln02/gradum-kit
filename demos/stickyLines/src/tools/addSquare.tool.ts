import {GradumTool, GradumEvent, Propagation, behavior, gradum} from "../../../../build/gradum-kit.esm";
import {Square} from "../square/square";

//Add square tool
export class AddSquareTool extends GradumTool {
    public toolName: string = "addSquare"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("click", "addSquare", (e, target) => {...});
    @behavior() public click(e: GradumEvent, target: Node) {
        if (gradum(target).metadata.get("substrate")) {
            Square.create({parent: target as Element, position: e.position});
            return Propagation.stopPropagation;
        }
    }
}