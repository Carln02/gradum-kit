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
        gradum(canvas).activateConstrainer("spacer");
        gradum(canvas).deactivateConstrainer("pusher", "main");
    }

    public onDeactivate() {
        const canvas = this.canvas;
        gradum(canvas).deactivateConstrainer("spacer", "pusher");
        gradum(canvas).activateConstrainer("main");
    }
}