import {Toolbar} from "./toolbar/toolbar";
import {GradumButton, GradumIcon, div} from "../../../build/gradum-kit.esm";
import {SelectTool} from "./tools/select/select.tool";
import {ResizeTool} from "./tools/resize.tool";
import {RotateTool} from "./tools/rotate.tool";
import {Bucket} from "./tools/bucket/bucket";
import {Canvas} from "./canvas/canvas";
import {AddSquareListTool} from "./tools/addSquareList.tool";

GradumIcon.defaultProperties.directory = "assets";

Canvas.create({parent: document.body});
Toolbar.create({
    parent: document.body,
    entries: [
        GradumButton.create({leftIcon: "cursor", tools: SelectTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "resize", tools: ResizeTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "rotate", tools: RotateTool, classes: "demo-button"}),
        Bucket.create({leftIcon: "bucket", classes: "demo-button"}),
        div({classes: "divider"}),
        GradumButton.create({text: "Add Square List", tools: AddSquareListTool, classes: "demo-button"}),
    ]
});
