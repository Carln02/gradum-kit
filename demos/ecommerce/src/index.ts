import {Toolbar} from "./toolbar/toolbar";
import {ClickMode, GradumButton, GradumEventManager, GradumIcon, div} from "../../../build/gradum-kit.esm";
import {AddCartTool, AddCatalogueTool, AddFilterTool} from "./tools/addCollection.tool";
import {SelectTool} from "./tools/select/select.tool";
import {ResizeTool} from "./tools/resize.tool";
import {RotateTool} from "./tools/rotate.tool";
import {Bucket} from "./tools/bucket/bucket";
import {AddSquareTool} from "./tools/addSquare.tool";
import {Canvas} from "./canvas/canvas";
import {DeleteTool} from "./tools/delete.tool";
import {Catalogue} from "./catalogue/catalogue";

GradumIcon.defaultProperties.directory = "assets";

//Everything on offer, read once and shared by every catalogue drawn on the canvas.
const catalogue = Catalogue.create({source: "data/products.json", unitsSource: "data/units.json"});

Canvas.create({parent: document.body, catalogue});

const selectButton = GradumButton.create({leftIcon: "cursor", tools: SelectTool, classes: "demo-button"});

Toolbar.create({
    parent: document.body,
    entries: [
        selectButton,
        GradumButton.create({leftIcon: "resize", tools: ResizeTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "rotate", tools: RotateTool, classes: "demo-button"}),
        Bucket.create({leftIcon: "bucket", classes: "demo-button"}),
        GradumButton.create({leftIcon: "trash", tools: DeleteTool, classes: "demo-button"}),
        div({classes: "divider"}),
        GradumButton.create({leftIcon: "addSquare", tools: AddSquareTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "add-catalogue", tools: AddCatalogueTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "add-cart", tools: AddCartTool, classes: "demo-button"}),
        GradumButton.create({leftIcon: "add-search", tools: AddFilterTool, classes: "demo-button"}),
    ]
});

//Start out selecting, as the cursor would, rather than with no tool at all.
GradumEventManager.instance.setTool(selectButton, ClickMode.left);
