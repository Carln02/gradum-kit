import {Toolbar} from "./toolbar/toolbar";
import {GradumButton, GradumIcon, div} from "../../../build/gradum-kit.esm";
import {SelectTool} from "./tools/select/select.tool";
import {ResizeTool} from "./tools/resize.tool";
import {RotateTool} from "./tools/rotate.tool";
import {Bucket} from "./tools/bucket/bucket";
import {AddSquareTool} from "./tools/addSquare.tool";
import {Canvas} from "./canvas/canvas";
import {AddStickyLineTool} from "./tools/addStickyLine.tool";
import {AddCircleTool} from "./tools/addCircle.tool";
import {AddTriangleTool} from "./tools/addTriangle.tool";
import {DeleteTool} from "./tools/delete.tool";

GradumIcon.defaultProperties.directory = "assets";

Canvas.create({parent: document.body});
Toolbar.create({
    parent: document.body,
    entries: [
        GradumButton.create({leftIcon: "cursor", tools: SelectTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "resize", tools: ResizeTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "rotate", tools: RotateTool, classes: "demo-button"}),
        Bucket.create({leftIcon: "bucket", classes: "demo-button"}),
        GradumButton.create({leftIcon: "addSquare", tools: AddSquareTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "addCircle", tools: AddCircleTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "addTriangle", tools: AddTriangleTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "trash", tools: DeleteTool, classes: "demo-button"}),
        div({classes: "divider"}),
        GradumButton.create({text: "Add StickyLine", tools: AddStickyLineTool, classes: "demo-button"}),
    ]
});