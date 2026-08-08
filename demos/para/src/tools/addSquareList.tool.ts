import {GradumTool, GradumEvent, Propagation, behavior, define, getAllRegistered} from "../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas/canvas";
import {SquareList} from "../squareList/squareList";

//Add square tool
export class AddSquareListTool extends GradumTool {
    public toolName: string = "addSquareList"; //Define the tool name
    protected currentSquareList: SquareList;

    @behavior() public dragStart(e: GradumEvent, target: Node) {
        if (target instanceof Canvas) {
            this.currentSquareList = new SquareList();
            (this.currentSquareList as any).initialize();
            this.currentSquareList.startSquare.position = e.scaledPosition;
            this.currentSquareList.endSquare.position = e.scaledPosition;
            console.log(getAllRegistered().map(entry => entry.name));
            return Propagation.stopPropagation;
        }
    }

    @behavior() public drag(e: GradumEvent) {
        if (this.currentSquareList) {
            this.currentSquareList.endSquare.position = e.scaledPosition;
            return Propagation.stopPropagation;
        }
    }

    @behavior() public dragEnd() {
        this.currentSquareList = undefined;
    }
}

define(AddSquareListTool);