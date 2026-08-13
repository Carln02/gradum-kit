import {gradum, effect} from "../../../../build/gradum-kit.esm";
import {SquareView} from "../square/square.view";

//View of the square element
export class TriangleView extends SquareView {
    @effect protected updateColor() {
        gradum(this).setStyle("borderBottomColor", this.model.color.toString());
    }

    @effect protected updateSize() {
        //Drawn as CSS borders rather than a box, so the size goes into the border widths: half the width to
        //each side, the full height below.
        gradum(this).setStyles({
            borderLeftWidth: this.model.size.x / 2 + "px",
            borderRightWidth: this.model.size.x / 2 + "px",
            borderBottomWidth: this.model.size.y + "px",
        });
    }
}