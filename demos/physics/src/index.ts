import {GradumButton, GradumIcon, div} from "../../../build/gradum-kit.esm";
import {SelectTool} from "./tools/select/select.tool";
import {PusherSubstrateTool} from "./tools/pusherSubstrate.tool";
import {AddSquareTool} from "./tools/addSquare.tool";
import {Canvas} from "./canvas/canvas";
import {MakePusherTool} from "./tools/makePusher.tool";
import {MakeSpacerTool} from "./tools/makeSpacer.tool";
import {SpacerSubstrateTool} from "./tools/spacerSubstrate.tool";
import {Toolbar} from "./toolbar/toolbar";
import {Bucket} from "./tools/bucket/bucket";
import {ResizeTool} from "./tools/resize.tool";
import {RotateTool} from "./tools/rotate.tool";
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
        GradumButton.create({leftIcon: "trash", tools: DeleteTool, classes: "demo-button"}),
        div({classes: "divider"}),
        GradumButton.create({text: "Make Pusher", tools: MakePusherTool, classes: "demo-button"}),
        GradumButton.create({text: "Make Spacer", tools: MakeSpacerTool, classes: "demo-button"}),
        GradumButton.create({text: "Pusher Substrate", tools: PusherSubstrateTool, classes: "demo-button"}),
        GradumButton.create({text: "Spacer Substrate", tools: SpacerSubstrateTool, classes: "demo-button"}),
    ]
});