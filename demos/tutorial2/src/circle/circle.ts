import {GradumElement, dataSignal, Point, define, effect, gradum} from "../../../../build/gradum-kit.esm";
import "./circle.css";

export class Circle extends GradumElement {
    @dataSignal() position: Point = new Point();
    @dataSignal() size: Point = new Point(100, 100);
    @dataSignal() color: string = "red";

    @effect protected updatePosition() {
        const centeredPosition = this.position.sub(this.size.div(2));
        gradum(this).setStyle("transform", `translate(${centeredPosition.x}px, ${centeredPosition.y}px)`);
    }

    @effect protected updateSize() {
        gradum(this).setStyles({
            width: this.size.x + "px",
            height: this.size.y + "px"
        });
    }

    @effect protected updateColor() {
        gradum(this).setStyle("backgroundColor", this.color);
    }
}

define(Circle, "my-circle");