import {gradum, effect} from "../../../../build/gradum-kit.esm";
import {SquareView} from "../square/square.view";

//View of the square element
export class TriangleView extends SquareView {
    @effect protected updateColor() {
        gradum(this).setStyle("borderBottomColor", this.model.color.toString());
    }

    @effect protected updateSize() {
        const half = this.model.elementSize / 2;
        gradum(this).setStyles({
            borderLeftWidth: half + "px",
            borderRightWidth: half + "px",
            borderBottomWidth: this.model.elementSize + "px",
        });
    }
}