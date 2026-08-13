import {define, GradumElement, gradum} from "../../../../build/gradum-kit.esm";
import "./canvas.css";
import {CanvasConstrainer} from "./canvas.mainConstrainer";
import {CanvasPusherConstrainer} from "./canvas.pusherConstrainer";
import {CanvasSpacerConstrainer} from "./canvas.spacerConstrainer";

export class Canvas extends GradumElement {
    public static defaultProperties = {
        constrainers: [CanvasPusherConstrainer, CanvasConstrainer, CanvasSpacerConstrainer],
    }

    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "substrate");
    }
}

define(Canvas, "my-canvas");