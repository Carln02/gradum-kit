import {Toolbar} from "./toolbar/toolbar";
import {GradumButton, GradumIcon, div} from "../../../build/gradum-kit.esm";
import {Item} from "./item/item";
import {Cart} from "./item/item.types";
import {SelectTool} from "./tools/select/select.tool";
import {ResizeTool} from "./tools/resize.tool";
import {RotateTool} from "./tools/rotate.tool";
import {Bucket} from "./tools/bucket/bucket";
import {AddSquareTool} from "./tools/addSquare.tool";
import {Canvas} from "./canvas/canvas";
import {DeleteTool} from "./tools/delete.tool";

GradumIcon.defaultProperties.directory = "assets";

const canvas = Canvas.create({parent: document.body});

//Stand-ins for the carts an item can be added to, until there is a cart component to put there. Enough to
//show the picker choosing between them, and to see what an item hands over when it is added.
const makeCart = (name: string): Cart => ({
    name,
    addItem: (item, amount) => console.log(`${name}: +${amount} ${item.unit} of ${item.name}`)
});
const carts: Cart[] = [makeCart("Weekly shop"), makeCart("Dinner party")];

//Stand-in pictures, so the demo needs neither asset files nor a network to show one.
const picture = (emoji: string, color: string) => "data:image/svg+xml;utf8," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160">`
    + `<rect width="240" height="160" fill="${color}"/>`
    + `<text x="120" y="108" font-size="76" text-anchor="middle">${emoji}</text></svg>`);

// //What each item is goes in its data; which carts it can go to, and how much of it, does not.
// const shelf = div({classes: "item-shelf", parent: canvas});
// Item.create({parent: shelf, carts, cartAmount: 1.5, recipeAmount: 3,
//     data: {name: "Bananas", price: 2.4, unit: "kg", image: picture("🍌", "#fdf3d0")}});
// Item.create({parent: shelf, carts, recipeAmount: 0.5,
//     data: {name: "Sourdough loaf", price: 4.5, unit: "each", image: picture("🍞", "#f6e3cd")}});
// Item.create({parent: shelf, carts, cartAmount: 0.25, recipeAmount: 0.08,
//     data: {name: "Parmesan", price: 28, unit: "kg", image: picture("🧀", "#fdf0c4")}});

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
    ]
});