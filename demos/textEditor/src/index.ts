import {GradumButton, GradumIcon, div} from "../../../build/gradum-kit.esm";
import {TextEditor} from "./textEditor/textEditor";
import {Toolbar} from "./toolbar/toolbar";
import {TextTool} from "./tools/text.tool";
import {DeleteTool} from "./tools/delete.tool";

GradumIcon.defaultProperties.directory = "assets";

Toolbar.create({
    parent: document.body,
    entries: [
        GradumButton.create({leftIcon: "cursor", tools: TextTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "trash", tools: DeleteTool, classes: "demo-button"}),
    ]
});
TextEditor.create({parent: document.body});
