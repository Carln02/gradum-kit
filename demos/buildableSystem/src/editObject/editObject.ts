import {define, GradumPopup} from "../../../../build/gradum-kit.esm";
import {EditObjectView} from "./editObject.view";
import {EditObjectTool} from "./editObject.tool";
import "./editObject.css";

export class EditObject extends GradumPopup<EditObjectView> {
    public static defaultProperties = {
        view: EditObjectView,
        tools: EditObjectTool
    };
}
define(EditObject);