import {define, GradumElement, gradum} from "../../../../build/gradum-kit.esm";
import "./canvas.css";

export class Canvas extends GradumElement {
    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "substrate");
    }
}

define(Canvas, "my-canvas");