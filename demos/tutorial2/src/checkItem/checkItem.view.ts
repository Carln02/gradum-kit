import {effect, gradum, input, span, GradumButton, GradumView} from "../../../../build/gradum-kit.esm";
import {CheckItem} from "./checkItem";
import {CheckItemModel} from "./checkItem.model";

export class CheckItemView extends GradumView<CheckItem, CheckItemModel> {
    protected checkbox: HTMLInputElement;
    public textElement: HTMLElement;
    protected deleteButton: GradumButton;

    protected setupUIElements() {
        super.setupUIElements();
        this.checkbox = input({type: "checkbox", classes: "check-item-box"});
        this.textElement = span({classes: "check-item-text", contentEditable: "true"});
        this.deleteButton = GradumButton.create({leftIcon: "x", classes: "check-item-delete"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([this.checkbox, this.textElement, this.deleteButton]);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this.checkbox).on("change", () => this.model.checked = this.checkbox.checked);
        gradum(this.textElement).on("input", () => this.model.text = this.textElement.innerText);
        gradum(this.deleteButton).on("click", () => {
            this.element.onDelete.fire();
            this.element.remove();
        });
    }

    @effect protected updateChecked() {
        this.checkbox.checked = this.model.checked;
        gradum(this).toggleClass("checked", this.model.checked);
    }

    @effect protected updateText() {
        //Only rewrite when different, or the cursor jumps back to the start while typing.
        if (this.textElement.innerText !== this.model.text) this.textElement.innerText = this.model.text;
    }
}