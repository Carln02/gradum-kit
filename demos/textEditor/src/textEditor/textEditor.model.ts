import {GradumModel, signal, Point} from "../../../../build/gradum-kit.esm";
import {Mark} from "../mark/mark";

export class TextEditorModel extends GradumModel {
    @signal public currentMark: Mark;
    @signal public currentPosition: Point;

    public clearData() {
        this.currentMark = undefined;
        this.currentPosition = undefined;
    }
}