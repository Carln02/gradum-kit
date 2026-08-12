import {gradum, effect, GradumView, auto, p} from "../../../../build/gradum-kit.esm";
import {SquareModel} from "./square.model";
import {Square} from "./square";

//View of the square element
export class SquareView extends GradumView<Square, SquareModel> {
    //@effect methods will be called when the values of the signals they use change
    @effect private updatePosition() {
        const offset = this.model.centerAnchor ? this.model.elementSize / 2 : 0;
        gradum(this).setStyle("transform", `
        translate(${this.model.position.x - offset}px, ${this.model.position.y - offset}px)
        rotate(${this.model.rotation}rad)
        `);
    }

    @effect private updateColor() {
        gradum(this).setStyle("backgroundColor", this.model.color.toString());
    }

    @effect private updateSize() {
        gradum(this).setStyles({width: this.model.elementSize + "px", height: this.model.elementSize + "px"});
    }

    @effect private updateText() {
        console.log("JII")
        const text = gradum(this).metadata.get("isPusher") ? "Pusher" :
            gradum(this).metadata.get("isSpacer") ? "Spacer" : undefined;
        gradum(this).removeAllChildren();
        if (text) gradum(this).addChild(p({text}));
    }
}