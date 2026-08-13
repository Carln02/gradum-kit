import {GradumTool, GradumDragEvent, gradum, Propagation, behavior, Anchor, Point} from "../../../../build/gradum-kit.esm";
import {getRect} from "../utils/getRect";

//Rotate tool
export class RotateTool extends GradumTool {
    public toolName = "rotate"; //Define the tool name
    public anchor: Anchor | Point = Anchor.Center;

    //Equivalent to gradum(tool).addToolBehavior("gradum-drag", "rotate", (e, el) => {...});
    @behavior() public drag(e: GradumDragEvent, el: Node) {
        try {
            if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
            const from = e.position.sub(e.deltaPosition);

            if ("rotate" in el && typeof el.rotate === "function") el.rotate(from, e.position, this.anchor);
            else if ("rotation" in el && typeof el.rotation === "number") this.turn(el, from, e.position);
            else return Propagation.propagate;
            return Propagation.stopPropagation;
        } catch (e) {return Propagation.stopPropagation}
    }

    /**
     * @description Turn a target that only exposes a `rotation`, working the pivot out from its box. Doing
     * here what a target with its own `rotate` does for itself: turn about the anchor, and carry the target
     * round that point when it is not the one the target is positioned from.
     * @param {object} el - The target to turn.
     * @param {Point} from - Where the sweep started.
     * @param {Point} to - Where it ended.
     * @protected
     */
    protected turn(el: any, from: Point, to: Point) {
        const rect = getRect(el);
        if (!rect) return;

        const pivot = rect.pointAt(this.anchor);
        const swept = pivot.angleBetween(from, to);
        if (!swept) return;
        el.rotation += swept;

        const position = Point.from(el.position);
        if (position) el.position = pivot.add(position.sub(pivot).rotate(swept));
    }
}
