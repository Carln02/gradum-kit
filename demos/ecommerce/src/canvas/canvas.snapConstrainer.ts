import {GradumConstrainer, solver, ConstrainerCallbackProperties, Point} from "../../../../build/gradum-kit.esm";
import {Canvas} from "./canvas";

export class CanvasSnapConstrainer extends GradumConstrainer<Canvas> {
    public constrainerName = "snap";
    public gridSize = 40;

    // Solve only the object the user manipulated
    public defaultQueue = [];

    //@solver() registers the snap() function as a solver to be executed after every manipulation
    //the user performs on any child of the canvas
    @solver() protected snap(properties: ConstrainerCallbackProperties) {
        //We decided to only snap objects at the end of a drag.
        if (properties.eventType !== "gradium-drag-end") return;
        const object = properties.eventTarget;
        if ("position" in object && object.position instanceof Point) object.position = new Point(
            Math.round(object.position.x / this.gridSize) * this.gridSize,
            Math.round(object.position.y / this.gridSize) * this.gridSize
        );
    }
}