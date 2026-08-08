import {define, TurboElement} from "../../../../build/gradum-kit.esm";
import "./canvas.css";
import {CanvasConstrainer} from "./canvas.mainConstrainer";

export class Canvas extends TurboElement {
    public static defaultProperties = {
        constrainers: [CanvasConstrainer]
    };
}

define(Canvas, "my-canvas");