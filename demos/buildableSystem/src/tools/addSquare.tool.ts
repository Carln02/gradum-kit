import {GradumTool, GradumEvent, Propagation, behavior, define} from "../../../../build/gradum-kit.esm";
import {Square} from "../square/square";
import {Canvas} from "../canvas/canvas";

//Add square tool
export class AddSquareTool extends GradumTool {
    public toolName: string = "addSquare"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("click", "addSquare", (e, target) => {...});
    @behavior() public click(e: GradumEvent, target: Node) {
        if (target instanceof Canvas) {
            const square = Square.create({parent: target});
            square.position = e.scaledPosition;
            return Propagation.stopPropagation;
        }
    }
}
define(AddSquareTool);