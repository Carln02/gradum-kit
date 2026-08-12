import {define, GradumElement} from "../../../../build/gradum-kit.esm";
import "./canvas.css";
import {CanvasConstrainer} from "./canvas.mainConstrainer";
import {CanvasPusherConstrainer} from "./canvas.pusherConstrainer";
import {CanvasSpacerConstrainer} from "./canvas.spacerConstrainer";

export class Canvas extends GradumElement {
    public static defaultProperties = {
        constrainers: [CanvasPusherConstrainer, CanvasConstrainer, CanvasSpacerConstrainer],
    }
}
define(Canvas, "my-canvas");