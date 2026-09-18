import {
    Anchor, AnchorPoint, signal, effect, define, tool, GradumElement, gradum
} from "../../../../../build/gradum-kit.esm";
import {RotateTool} from "../rotate.tool";

export class RotateHandle extends GradumElement {
    public static defaultProperties = {tools: RotateTool};

    @signal public anchor: Anchor;
    @tool() protected rotateTool: RotateTool;

    public initialize() {
        super.initialize();
        this.rotateTool.customActivation = () => {};
    }

    @effect private updateAnchor() {
        const corner = AnchorPoint.enumToPoint(this.anchor);
        gradum(this).setStyles({
            left: `${(corner.x + 100) / 2}%`,
            top: `${(corner.y + 100) / 2}%`,
            transform: `translate(${corner.x < 0 ? -100 : 0}%, ${corner.y < 0 ? -100 : 0}%)`
        });
    }

    public retarget(target: Node) {
        gradum(this).embedTool(target);
    }
}

define(RotateHandle, "demo-rotate-handle");