import {GradumTool, GradumEvent, behavior} from "../../../../build/gradum-kit.esm";
import {Square} from "../square/square";
import {Canvas} from "../canvas/canvas";

//Add square tool
export class AddSquareTool extends GradumTool {
    public toolName: string = "addSquare"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("click", "addSquare", (e, target) => {...});
    @behavior() public click(e: GradumEvent, target: Node) {
        if (target instanceof Canvas) Square.create({parent: target, position: e.position});
    }
}