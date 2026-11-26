import {ResizeHandle} from "../resizeHandle/resizeHandle";
import {gradum, GradumInteractor} from "../../../../build/gradum-kit.esm";
import {ResizeTool} from "../tools/resize.tool";

export class SquareResizeInteractor extends GradumInteractor<Node> {
    protected resizeHandle: ResizeHandle;

    protected setupUIElements() {
        super.setupUIElements();
        this.resizeHandle = ResizeHandle.create({tools: ResizeTool});
        gradum(this.resizeHandle).embedTool(this.element);
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild(this.resizeHandle);
    }
}