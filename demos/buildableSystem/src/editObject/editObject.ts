import {define, TurboPopup} from "../../../../build/gradum-kit.esm";
import {EditObjectView} from "./editObject.view";
import {EditObjectTool} from "./editObject.tool";
import "./editObject.css";

export class EditObject extends TurboPopup<EditObjectView> {
    public static defaultProperties = {
        view: EditObjectView,
        tools: EditObjectTool
    };
}
define(EditObject);