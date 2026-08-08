import {gradum} from "../../../../build/gradum-kit.esm";
import {SelectTool} from "./select.tool";
import {Canvas} from "../canvas/canvas";

//Pusher tool
export class PusherSubstrateTool extends SelectTool {
    public toolName: string = "pusherSubstrate"; //Define tool name

    protected get canvas(): Canvas {
        return Array.from(document.body.children).find(el => el instanceof Canvas);
    }

    public onActivate() {
        const canvas = this.canvas;
        gradum(canvas).activateSubstrate("pusher");
        gradum(canvas).deactivateSubstrate("spacer", "main");
    }

    public onDeactivate() {
        const canvas = this.canvas;
        gradum(canvas).deactivateSubstrate("pusher", "pusher");
        gradum(canvas).activateSubstrate("main");
    }
}