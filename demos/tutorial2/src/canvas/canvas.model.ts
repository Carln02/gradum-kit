import {auto, Coordinate, Point, signal, GradumModel} from "../../../../build/gradum-kit.esm";

export class CanvasModel extends GradumModel {
    @signal public color: string = "white";

    //Zooming bounds
    public readonly maxScale = 7.5 as const;
    public readonly minScale = 0.1 as const;

    //Const fields representing the zoom intensity for different input devices
    public readonly zoomMouseIntensity = 0.1 as const;
    public readonly zoomTrackpadIntensity = 0.05 as const;
    public readonly zoomTouchIntensity = 0.005 as const;

    @signal public translation: Point = new Point(window.innerWidth / 2, window.innerHeight / 2);

    @signal @auto({
        defaultValue: 1,
        preprocessValue: function (value) {
            //Make sure the value is between the bounds, with 0.01 offset.
            if (value > this.maxScale) return this.maxScale - 0.001;
            else if (value < this.minScale) return this.minScale + 0.001;
            else return value;
        }
    }) public scale: number;

    public translate(delta: Coordinate) {
        if (!delta) return;
        this.translation = this.translation.add(delta);
    }
}