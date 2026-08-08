import {GradumModel, Point, signal} from "../../../../build/gradum-kit.esm";

export class StickyLineModel extends GradumModel {
    @signal thickness: number = 2;
    @signal hitThickness: number = 10;
    @signal color: string = "black";
}