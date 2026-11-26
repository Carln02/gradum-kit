import {gradum, div, GradumButton, GradumObserver, GradumModel, Propagation} from "../../../../build/gradum-kit.esm";
import {CheckItem} from "../checkItem/checkItem";
import {NoteView} from "./note.view";

export class NoteChecklistView extends NoteView {
    protected listElement: HTMLElement;
    protected addButton: GradumButton;

    protected items: GradumModel;
    protected itemsObserver: GradumObserver<any, CheckItem>;

    protected setupUIElements() {
        super.setupUIElements();
        this.listElement = div({classes: "note-checklist"});
        this.addButton = GradumButton.create({leftIcon: "add-square", text: "Add item", classes: "note-checklist-add"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this.contentElement).remove();
        gradum(this).addChild([this.listElement, this.addButton]);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this.addButton).on("click", () => {
            const index = this.items.push({text: "", checked: false});
            this.itemsObserver.get(index)?.focusText();
            return Propagation.stopPropagation;
        });
    }

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        if (!this.model.get("items")) this.model.set([], "items");
        this.items = this.model.nest("items");

        this.itemsObserver = this.items.generateObserver({
            onAdded: (data, self) => {
                const item = CheckItem.create({data, parent: this.listElement});
                item.onDelete.add(() => this.items.delete(...self.getKey(item)));
                return item;
            }
        });
    }
}
