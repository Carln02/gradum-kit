import {
    Anchor, AnchorPoint, define, tool, GradumElement, gradum
} from "../../../../../build/gradum-kit.esm";
import {ResizeTool} from "../resize.tool";

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
        const corner = AnchorPoint.enumToPoint(this.anchor);
        this.resizeTool.anchor = AnchorPoint.pointToEnum(corner.mul(-1));
        gradum(this).setStyles({left: `${(corner.x + 100) / 2}%`, top: `${(corner.y + 100) / 2}%`});
    }

    public retarget(target: Node) {
        gradum(this).embedTool(target);
    }
}

define(ResizeHandle, "demo-resize-handle");
