import {GradumTool, behavior, GradumEvent, Propagation} from "../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas/canvas";
import {Text} from "../text/text";

export class AddTextTool extends GradumTool {
    public toolName: string = "addText";

    @behavior() click(e: GradumEvent, target: Node) {
        if (target instanceof Canvas) {
            const text = Text.create({parent: target, data: {position: e.scaledPosition, text: "Text"}});
            //After the click finishes, or the canvas takes focus back.
            requestAnimationFrame(() => text.edit());
            return Propagation.stopPropagation;
        }
    }
}
