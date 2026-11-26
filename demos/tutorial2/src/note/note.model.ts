import {dataSignal} from "../../../../build/gradum-kit.esm";
import {SquareModel} from "../square/square.model";

export class NoteModel extends SquareModel {
    @dataSignal() title: string = "Untitled";
    @dataSignal() content: string = "";

    @dataSignal() date: number = Date.now();
}