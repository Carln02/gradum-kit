import {auto, Color, GradumModel, Point, signal, Anchor} from "../../../../build/gradum-kit.esm";

//Model of the square element
export class SquareModel extends GradumModel {
    //Turned simple fields into signals (so changing their values will trigger @effect callbacks)
    @signal color: Color = Color.random([60, 90], [40, 70]);
    @signal position: Point = new Point();
    @signal rotation: number = 0;
    @signal anchor: Anchor | Point = Anchor.Center;

    @signal @auto({
        preprocessValue: (value: any) =>
            (Point.from(value) ?? new Point(100, 100)).bound(5, Infinity, 5, Infinity)
    }) accessor size: Point = new Point(100, 100);
}