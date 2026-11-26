import {GradumModel, dataSignal, Point} from "../../../../build/gradum-kit.esm";

export class SquareModel extends GradumModel {
    @dataSignal() position: Point = new Point();
    @dataSignal() size: Point = new Point(100, 100);
    @dataSignal() color: string = "red";
}