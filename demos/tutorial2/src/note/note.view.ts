import {effect, gradum, div, h4} from "../../../../build/gradum-kit.esm";
import {Note} from "./note";
import {NoteModel} from "./note.model";
import {SquareView} from "../square/square.view";

export class NoteView extends SquareView<Note, NoteModel> {
    protected titleElement: HTMLElement;
    protected contentElement: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();
        this.titleElement = h4({classes: "note-title", contentEditable: "true"});
        this.contentElement = div({classes: "note-content", contentEditable: "true"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([this.titleElement, this.contentElement]);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this.titleElement).on("input", () => this.model.title = this.titleElement.innerText);
        gradum(this.contentElement).on("input", () => this.model.content = this.contentElement.innerText);
    }

    @effect protected updateTitle() {
        if (this.titleElement.innerText !== this.model.title) this.titleElement.innerText = this.model.title;
    }

    @effect protected updateContent() {
        if (this.contentElement.innerText !== this.model.content) this.contentElement.innerText = this.model.content;
    }
}