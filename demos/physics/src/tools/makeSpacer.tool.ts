import {GradumEvent, GradumTool, behavior} from "../../../../build/gradum-kit.esm";

//Pusher tool
export class MakeSpacerTool extends GradumTool {
    public toolName: string = "makeSpacer"; //Define tool name

    @behavior() public click(e: GradumEvent, target: Node) {
        if ("isSpacer" in target && typeof target.isSpacer === "boolean") target.isSpacer = !target.isSpacer;
    }
}