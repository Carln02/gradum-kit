import {GradumTool, GradumEvent, behavior, Propagation} from "../../../../build/gradum-kit.esm";
import {Square} from "../square/square";
import {isSubstrate} from "../interfaces";

//Add square tool
export class AddSquareTool extends GradumTool {
    public toolName: string = "addSquare"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("click", "addSquare", (e, target) => {...});
    @behavior() public click(e: GradumEvent, target: Node) {
        if (!isSubstrate(target)) return Propagation.propagate;
        target.addObject(Square.create({position: e.position}));
        return Propagation.stopPropagation;
    }
}