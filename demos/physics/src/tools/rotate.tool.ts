import {GradumTool, GradumDragEvent, gradum, Propagation, behavior} from "../../../../build/gradum-kit.esm";
import {getRect} from "../utils/getRect";

//Rotate tool
export class RotateTool extends GradumTool {
    public toolName = "rotate"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("gradum-drag", "rotate", (e, el) => {...});
    @behavior() public drag(e: GradumDragEvent, el: Node) {
        try {
            if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;

            const rect = getRect(el);
            if (!rect) return Propagation.propagate;
            const center = {x: rect.x + rect.width / 2, y: rect.y + rect.height / 2};

            const from = e.position.sub(e.deltaPosition);
            const swept = Math.atan2(e.position.y - center.y, e.position.x - center.x)
                - Math.atan2(from.y - center.y, from.x - center.x);
            const angle = Math.atan2(Math.sin(swept), Math.cos(swept));
            if (!angle) return Propagation.stopPropagation;

            if ("rotate" in el && typeof el.rotate === "function") el.rotate(angle);
            else if ("rotation" in el && typeof el.rotation === "number") el.rotation += angle;
            else return Propagation.propagate;
            return Propagation.stopPropagation;
        } catch (e) {return Propagation.stopPropagation}
    }
}
