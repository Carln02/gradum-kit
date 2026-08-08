import {GradumEvent, GradumTool, behavior} from "../../../../build/gradum-kit.esm";

//Pusher tool
export class MakePusherTool extends GradumTool {
    public toolName: string = "makePusher"; //Define tool name

    @behavior() public click(e: GradumEvent, target: Node) {
        if ("isPusher" in target && typeof target.isPusher === "boolean") target.isPusher = !target.isPusher;
    }
}