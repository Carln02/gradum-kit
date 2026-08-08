import {GradumTool, GradumEvent, Propagation, behavior} from "../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas/canvas";
import {StickyLine} from "../stickyLine/stickyLine";

//Add square tool
export class AddStickyLineTool extends GradumTool {
    public toolName: string = "addStickyLine"; //Define the tool name
    protected currentStickyline: StickyLine;

    @behavior() public dragStart(e: GradumEvent, target: Node) {
        if (target instanceof Canvas) {
            this.currentStickyline = StickyLine.create({parent: target});
            this.currentStickyline.startHandle.position = e.scaledPosition;
            this.currentStickyline.endHandle.position = e.scaledPosition;
            return Propagation.stopPropagation;
        }
    }

    @behavior() public drag(e: GradumEvent) {
        if (this.currentStickyline) {
            this.currentStickyline.endHandle.position = e.scaledPosition;
            return Propagation.stopPropagation;
        }
    }

    @behavior() public dragEnd() {
        this.currentStickyline = undefined;
    }
}