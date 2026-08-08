import {TurboModel, Point, signal} from "../../../../build/gradum-kit.esm";

export class StickyLineModel extends TurboModel {
    @signal thickness: number = 2;
    @signal hitThickness: number = 10;
    @signal color: string = "black";
}