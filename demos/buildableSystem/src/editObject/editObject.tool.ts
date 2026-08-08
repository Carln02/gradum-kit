import {ClickMode, GradumTool, behavior, Propagation} from "../../../../build/gradum-kit.esm";
import {EditObject} from "./editObject";

export class EditObjectTool extends GradumTool<EditObject> {
    public toolName = "editObject";
    public clickMode = ClickMode.right;

    @behavior() private contextmenu(e: Event, target: Element) {
        e.preventDefault();
        this.element.anchor = target;
        this.element.show(true);
        return Propagation.stopPropagation;
    }
}