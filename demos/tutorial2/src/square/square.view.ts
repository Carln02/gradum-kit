import {GradumView, effect, gradum} from "../../../../build/gradum-kit.esm";
import {Square} from "./square";
import {SquareModel} from "./square.model";

export class SquareView<
    Element extends Square = Square,
    Model extends SquareModel = SquareModel
> extends GradumView<Element, Model> {
    @effect protected updatePosition() {
        const centeredPosition = this.model.position.sub(this.model.size.div(2));
        gradum(this).setStyle("transform", `translate(${centeredPosition.x}px, ${centeredPosition.y}px)`);
    }

    @effect protected updateSize() {
        gradum(this).setStyles({
            width: this.model.size.x + "px",
            height: this.model.size.y + "px"
        });
    }

    @effect protected updateColor() {
        gradum(this).setStyle("backgroundColor", this.model.color);
    }
}
