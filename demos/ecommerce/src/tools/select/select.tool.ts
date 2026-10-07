import {
    GradumTool, GradumDragEvent, GradumEvent, gradum, Coordinate, GradumMovable, Propagation, behavior
} from "../../../../../build/gradum-kit.esm";
import {SelectionBox} from "./selectionBox";
import {findDropTarget} from "../../utils";

//Select tool
export class SelectTool extends GradumTool {
    public toolName = "select"; //Define the tool name
    protected selectionBox: SelectionBox;

    /**
     * @description The ghost following the pointer while something is being dragged and dropped, and what it
     * is a ghost of. One gesture drags one card, so there is never more than one of either.
     */
    protected ghost: GradumMovable;
    protected dragged: Node;

    public onDeactivate() {
        this.selectionBox?.clear();
    }

    //Clicking a modifiable element selects it, which puts a border and four resize grips over it. Clicking
    //anything else clears the selection.
    @behavior() public clickStart(e: GradumEvent, el: Node) {
        if (this.selectionBox?.contains(e.target)) return Propagation.propagate;
        if (gradum(el).metadata?.get("selectionBox") === false) return Propagation.propagate;
        if (gradum(el).metadata?.get("modifiable")) {
            if (!this.selectionBox) this.selectionBox = SelectionBox.create({parent: document.body});
            this.selectionBox.target = el;
            return Propagation.stopPropagation;
        }
        //A card laid out by something else is not selectable, but pressing it is still about the card —
        //without this the press would carry on to the cart underneath and select that instead.
        if (gradum(el).metadata?.get("dragAndDroppable")) {
            this.selectionBox?.clear();
            return Propagation.stopPropagation;
        }
        if (el === document.body) this.selectionBox?.clear();
    }

    /**
     * @description Pick a card up. Something that positions itself is dragged where it stands; something laid
     * out by whatever it is in — a card in the shelf, a card in a cart — cannot be, so it stays put at low
     * opacity and a ghost of it follows the pointer instead, to be dropped somewhere at the end.
     */
    @behavior() public dragStart(e: GradumDragEvent, el: Node) {
        try {
            if (!gradum(el).metadata?.get("dragAndDroppable")) return Propagation.propagate;

            this.dragged = el;
            gradum(el).setStyle("opacity", "0.4", true);
            //`wrap` hands back the library's positioning wrapper around the copy, which is what makes the
            //ghost something that can simply be told where to be.
            this.ghost = gradum(el).feedforward({
                wrap: true,
                parent: document.body,
                classes: "drag-ghost",
                translation: e.position,
                centerAnchor: true
            }) as GradumMovable;
            return Propagation.stopPropagation;
        } catch (e) {return Propagation.stopPropagation}
    }

    //@behavior() registers the drag() function as a listener for the "gradum-drag" event with the "move" tool.
    //Equivalent to gradum(tool).addToolBehavior("gradum-drag", "select", (e, el) => {...});
    @behavior() public drag(e: GradumDragEvent, el: Node) {
        try {
            if (this.ghost && el === this.dragged) {
                this.ghost.translateBy(e.deltaPosition);
                return Propagation.stopPropagation;
            }
            if (!gradum(el).metadata?.get("modifiable")) return Propagation.propagate;
            if ("move" in el && typeof el.move === "function") el.move(e.deltaPosition);
            else if ("translate" in el && typeof el.translate === "function") el.translate(e.deltaPosition);
            else if ("position" in el && typeof el.position === "object") el.position = e.deltaPosition.add(el.position as Coordinate);
            else return Propagation.propagate;
            return Propagation.stopPropagation;
        } catch (e) {return Propagation.stopPropagation}
    }

    /**
     * @description Let the card go. What was under the pointer decides what that means — the canvas lays it
     * down where it was dropped, a cart puts it in its list — and a card let go of over nothing at all simply
     * stays where it came from.
     */
    @behavior() public dragEnd(e: GradumDragEvent, el: Node) {
        try {
            if (!this.ghost || el !== this.dragged) return Propagation.propagate;

            gradum(el).setStyle("opacity", "", true);
            this.ghost.remove();
            this.ghost = undefined;
            this.dragged = undefined;

            findDropTarget(e.position)?.acceptDrop(el, e.position);
            return Propagation.stopPropagation;
        } catch (e) {return Propagation.stopPropagation}
    }
}
