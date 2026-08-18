import {GradumButton, GradumIcon, spacer} from "../../../build/gradum-kit.esm";
import {TextEditor} from "./textEditor/textEditor";
import {Toolbar} from "./toolbar/toolbar";
import {TextTool} from "./tools/text.tool";
import {DeleteTool} from "./tools/delete.tool";
import {RotateTool} from "./tools/rotate.tool";
import {ResizeTool} from "./tools/resize.tool";
import {BudgetTool} from "./tools/budget.tool";

GradumIcon.defaultProperties.directory = "assets";

Toolbar.create({
    parent: document.body,
    entries: [
        GradumButton.create({leftIcon: "cursor", tools: TextTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "rotate", tools: RotateTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "resize", tools: ResizeTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "trash", tools: DeleteTool, classes: "demo-button"}),
        spacer({classes: "divider"}),
        GradumButton.create({text: "Word Budget", tools: BudgetTool, classes: "demo-button"}),
    ]
});
TextEditor.create({parent: document.body});
