import {define, GradumElement, gradum} from "../../../../build/gradum-kit.esm";
import "./canvas.css";
import {CanvasConstrainer} from "./canvas.mainConstrainer";

export class Canvas extends GradumElement {
    public static defaultProperties = {
        constrainers: [CanvasConstrainer]
    };

    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "substrate");
    }
}

define(Canvas, "my-canvas");