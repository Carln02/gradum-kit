import {
    Anchor, AnchorPoint, signal, effect, define, tool, GradumElement, gradum
} from "../../../../../build/gradum-kit.esm";
import {RotateTool} from "../rotate.tool";

//The rotation zone just beyond a corner grip, the way drawing tools do it: grab the corner itself to resize,
//grab the empty space diagonally outside it to spin the shape instead. It sits under the grip in the DOM so
//the grip keeps the few pixels the two share, and it only ever extends outwards — reaching inwards would
//steal drags from the shape underneath.
export class RotateHandle extends GradumElement {
    public static defaultProperties = {tools: RotateTool};

    @signal public anchor: Anchor;
    @tool() protected rotateTool: RotateTool;

    @effect private updateAnchor() {
        const corner = AnchorPoint.enumToPoint(this.anchor);
        gradum(this).setStyles({
            left: `${(corner.x + 100) / 2}%`,
            top: `${(corner.y + 100) / 2}%`,
            marginLeft: corner.x < 0 ? "calc(-1 * var(--rotate-zone))" : "0",
            marginTop: corner.y < 0 ? "calc(-1 * var(--rotate-zone))" : "0"
        });
    }

    public retarget(target: Node) {
        gradum(this).embedTool(target);
    }
}

define(RotateHandle, "demo-rotate-handle");