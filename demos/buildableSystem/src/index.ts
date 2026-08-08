import {Toolbar} from "./toolbar/toolbar";
import {GradumButton, ClickMode, GradumEventManager, GradumIcon} from "../../../build/gradum-kit.esm";
import {SelectTool} from "./tools/select.tool";
import {Bucket} from "./tools/bucket/bucket";
import {Canvas} from "./canvas/canvas";
import {AddSquareTool} from "./tools/addSquare.tool";
import {EditObject} from "./editObject/editObject";
import {ImportedFiles} from "./importedFiles/importedFiles";

GradumIcon.defaultProperties.directory = "assets/icons";

Canvas.create({parent: document.body});
Toolbar.create({
    parent: document.body,
    entries: [
        ImportedFiles.create({leftIcon: "files"}),
        GradumButton.create({text: "Select", tools: SelectTool, classes: "demo-button"}),
        GradumButton.create({text: "Add Square", tools: AddSquareTool, classes: "demo-button"}),
        Bucket.create({text: "Bucket", classes: "demo-button"}),
    ]
});

GradumEventManager.instance.setTool(EditObject.create(), ClickMode.right);