import {
    Anchor, AnchorPoint, signal, effect, define, tool, GradumElement, gradum
} from "../../../../../build/gradum-kit.esm";
import {ResizeTool} from "../resize.tool";

//A corner grip of the selection box. The handle itself is a tool, embedded into the selected element: the
//resize behavior runs with that element as its target, so dragging the grip resizes the square underneath
//without the square ever receiving the drag.
export class ResizeHandle extends GradumElement {
    public static defaultProperties = {tools: ResizeTool};

    public anchor: Anchor;
    @tool() protected resizeTool: ResizeTool;

    public initialize() {
        this.updateAnchor();
        super.initialize();
    }

    private updateAnchor() {
        this.resizeTool.toolName = `resize-${this.anchor}`;
        this.resizeTool.customActivation = () => {};

        const corner = AnchorPoint.enumToPoint(this.anchor);
        this.resizeTool.anchor = AnchorPoint.pointToEnum(corner.mul(-1));
        this.resizeTool.sign = corner.div(100);

        gradum(this).setStyles({left: `${(corner.x + 100) / 2}%`, top: `${(corner.y + 100) / 2}%`});
    }

    public retarget(target: Node) {
        gradum(this).embedTool(target);
    }
}

define(ResizeHandle, "demo-resize-handle");
