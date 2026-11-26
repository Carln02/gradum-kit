import {Toolbar} from "./toolbar/toolbar";
import {GradumIcon, GradumButton} from "../../../build/gradum-kit.esm";
import {Canvas} from "./canvas/canvas";
import {AddSquareTool} from "./tools/addSquare.tool";
import {MoveTool} from "./tools/move.tool";
import {ResizeTool} from "./tools/resize.tool";
import {AddNoteTool} from "./tools/addNote.tool";
import {AddCircleTool} from "./tools/addCircle.tool";
import {AddChecklistNoteTool} from "./tools/addChecklistNote.tool";
import {AddClockTool} from "./tools/addClock.tool";
import {AddTextTool} from "./tools/addText.tool";

GradumIcon.defaultProperties.directory = "icons";

Canvas.create({parent: document.body});
Toolbar.create({
    parent: document.body,
    entries: [
        GradumButton.create({leftIcon: "cursor", tools: MoveTool}),
        GradumButton.create({leftIcon: "resize", tools: ResizeTool}),
        GradumButton.create({leftIcon: "add-square", tools: AddSquareTool}),
        GradumButton.create({leftIcon: "add-circle", tools: AddCircleTool}),
        GradumButton.create({leftIcon: "add-card", tools: AddNoteTool}),
        GradumButton.create({leftIcon: "checkmark", tools: AddChecklistNoteTool}),
        GradumButton.create({leftIcon: "clock", tools: AddClockTool}),
        GradumButton.create({leftIcon: "add-text", tools: AddTextTool}),
    ]
});