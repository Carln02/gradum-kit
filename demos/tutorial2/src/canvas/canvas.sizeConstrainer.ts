import {GradumConstrainer, solver, ConstrainerCallbackProperties, Point} from "../../../../build/gradum-kit.esm";
import {Canvas} from "./canvas";
import {Square} from "../square/square";

export class CanvasSizeConstrainer extends GradumConstrainer<Canvas> {
    public constrainerName = "size";
    public minSize = new Point(40, 40);
    public maxSize = new Point(400, 400);

    public defaultQueue = [];

    @solver() protected clampSize(properties: ConstrainerCallbackProperties) {
        const object = properties.target;
        if (object instanceof Square) {
            const clamped = object.size.bound(this.minSize, this.maxSize);
            if (!clamped.equals(object.size)) object.size = clamped;
        }
    }
}
