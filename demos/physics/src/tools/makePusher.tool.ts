import {GradumEvent, GradumTool, behavior, gradum, Propagation} from "../../../../build/gradum-kit.esm";

//Pusher tool
export class MakePusherTool extends GradumTool {
    public toolName: string = "makePusher"; //Define tool name

    @behavior() public click(e: GradumEvent, target: Node) {
        if (gradum(target).metadata?.get("modifiable")) {
            gradum(target).metadata?.set(true, "isPusher");
            return Propagation.stopPropagation;
        }
    }
}