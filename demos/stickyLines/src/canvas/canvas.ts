import {define, GradumElement} from "../../../../build/gradum-kit.esm";
import "./canvas.css";
import {CanvasConstrainer} from "./canvas.mainConstrainer";

export class Canvas extends GradumElement {
    public static defaultProperties = {
        constrainers: [CanvasConstrainer]
    };
}

define(Canvas, "my-canvas");