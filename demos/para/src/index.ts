import {Toolbar} from "./toolbar/toolbar";
import {GradumButton} from "../../../build/gradum-kit.esm";
import {SelectTool} from "./tools/select/select.tool";
import {ResizeTool} from "./tools/resize.tool";
import {RotateTool} from "./tools/rotate.tool";
import {Bucket} from "./tools/bucket/bucket";
import {Canvas} from "./canvas/canvas";
import {AddSquareListTool} from "./tools/addSquareList.tool";

Canvas.create({parent: document.body});
Toolbar.create({
    parent: document.body,
    entries: [
        GradumButton.create({text: "Select", tools: SelectTool, classes: "demo-button"}),
        GradumButton.create({text: "Resize", tools: ResizeTool, classes: "demo-button"}),
        GradumButton.create({text: "Rotate", tools: RotateTool, classes: "demo-button"}),
        GradumButton.create({text: "Add SquareList", tools: AddSquareListTool, classes: "demo-button"}),
        Bucket.create({text: "Bucket", classes: "demo-button"}),
    ]
});
