import {Toolbar} from "./toolbar/toolbar";
import {GradumButton} from "../../../build/gradum-kit.esm";
import {MoveTool} from "./tools/move.tool";
import {Bucket} from "./tools/bucket/bucket";
import {AddSquareTool} from "./tools/addSquare.tool";
import {Canvas} from "./canvas/canvas";
import {AddStickyLineTool} from "./tools/addStickyLine.tool";
import {AddCircleTool} from "./tools/addCircle.tool";
import {AddTriangleTool} from "./tools/addTriangle.tool";

Canvas.create({parent: document.body});
Toolbar.create({
    parent: document.body,
    entries: [
        GradumButton.create({text: "Move", tools: MoveTool, classes: "demo-button"}),
        GradumButton.create({text: "Add Square", tools: AddSquareTool, classes: "demo-button"}),
        GradumButton.create({text: "Add Circle", tools: AddCircleTool, classes: "demo-button"}),
        GradumButton.create({text: "Add Triangle", tools: AddTriangleTool, classes: "demo-button"}),
        GradumButton.create({text: "Add StickyLine", tools: AddStickyLineTool, classes: "demo-button"}),
        Bucket.create({text: "Bucket", classes: "demo-button"}),
    ]
});