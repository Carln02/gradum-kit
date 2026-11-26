import {expose, define} from "../../../../build/gradum-kit.esm";
import {NoteView} from "./note.view";
import {NoteModel} from "./note.model";
import "./note.css";
import {Square} from "../square/square";
import {NoteLockOperator} from "./note.lockOperator";

export class Note extends Square<NoteView, NoteModel> {
    public static defaultProperties: any = {
        view: NoteView,
        model: NoteModel,
        operators: NoteLockOperator
    };

    @expose("model") public title: string;
    @expose("model") public content: string;
}

define(Note, "my-note");