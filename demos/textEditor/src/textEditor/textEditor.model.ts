import {GradumModel, signal, Point} from "../../../../build/gradum-kit.esm";
import {Stroke} from "../stroke/stroke";

export class TextEditorModel extends GradumModel {
    @signal public textAnchor: number;
    @signal public currentStroke: Stroke;
    @signal public currentPosition: Point;

    //Where the last change to the document ended: the point a budgeted passage eats forward from, so that
    //what goes is the word after the one just typed rather than one at the far end of the passage.
    @signal public lastEditAt: number;

    //Where the budgeted passage the panel is about begins. Kept rather than the passage itself, since the
    //passage is read back out of the document every time it is needed.
    @signal public budgetAnchor: number;

    public clearData() {
        this.textAnchor = undefined;
        this.currentStroke = undefined;
        this.currentPosition = undefined;
    }
}