import {Toolbar} from "./toolbar/toolbar";
import {GradumButton, GradumIcon, div} from "../../../build/gradum-kit.esm";
import {Shelf} from "./shelf/shelf";
import {AddCartTool} from "./tools/addCart.tool";
import {SelectTool} from "./tools/select/select.tool";
import {ResizeTool} from "./tools/resize.tool";
import {RotateTool} from "./tools/rotate.tool";
import {Bucket} from "./tools/bucket/bucket";
import {AddSquareTool} from "./tools/addSquare.tool";
import {Canvas} from "./canvas/canvas";
import {DeleteTool} from "./tools/delete.tool";

GradumIcon.defaultProperties.directory = "assets";

const canvas = Canvas.create({parent: document.body});

//Everything on offer, read from items.json. On the canvas rather than beside it, so that a card anywhere —
//on the shelf, on the canvas, in a cart — finds the canvas above it and can ask which carts there are.
Shelf.create({parent: canvas, source: "items.json"});

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
        GradumButton.create({text: "Add cart", tools: AddCartTool, classes: "demo-button"}),
    ]
});