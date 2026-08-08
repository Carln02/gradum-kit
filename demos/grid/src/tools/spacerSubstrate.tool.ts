import {gradum} from "../../../../build/gradum-kit.esm";
import {SelectTool} from "./select.tool";
import {Canvas} from "../canvas/canvas";

//Pusher tool
export class SpacerSubstrateTool extends SelectTool {
    public toolName: string = "spacerSubstrate"; //Define tool name

    protected get canvas(): Canvas {
        return Array.from(document.body.children).find(el => el instanceof Canvas);
    }

    public onActivate() {
        const canvas = this.canvas;
        gradum(canvas).activateSubstrate("spacer");
        gradum(canvas).deactivateSubstrate("pusher", "main");
    }

    public onDeactivate() {
        const canvas = this.canvas;
        gradum(canvas).deactivateSubstrate("spacer", "pusher");
        gradum(canvas).activateSubstrate("main");
    }
}