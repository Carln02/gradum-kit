import {GradumModel, signal, Point} from "../../../../build/gradum-kit.esm";
import {Stroke} from "../stroke/stroke";

export class TextEditorModel extends GradumModel {
    @signal public textAnchor: number;
    @signal public currentStroke: Stroke;
    @signal public currentPosition: Point;

    public clearData() {
        this.textAnchor = undefined;
        this.currentStroke = undefined;
        this.currentPosition = undefined;
    }
}