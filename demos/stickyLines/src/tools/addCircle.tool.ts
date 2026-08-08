import {TurboTool, TurboEvent, Propagation, behavior} from "../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas/canvas";
import {Circle} from "../circle/circle";

//Add circle tool
export class AddCircleTool extends TurboTool {
    public toolName: string = "addCircle"; //Define the tool name

    //Equivalent to turbo(tool).addToolBehavior("click", "addCircle", (e, target) => {...});
    @behavior() public click(e: TurboEvent, target: Node) {
        if (target instanceof Canvas) {
            const circle = Circle.create({parent: target, elementSize: 80});
            circle.position = e.scaledPosition;
            return Propagation.stopPropagation;
        }
    }
}