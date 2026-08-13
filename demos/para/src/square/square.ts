import {
    define, GradumElement, Point, expose, gradum, Color, Anchor, AnchorPoint, GradumRect
} from "../../../../build/gradum-kit.esm";
import {SquareModel} from "./square.model";
import {SquareView} from "./square.view";
import "./square.css";

//Custom square element, defined as a custom element
export class Square extends GradumElement<SquareView, any, SquareModel> {
    //Ghost styling for the preview a feedforward drag shows. Specific to this demo.
    public defaultFeedforwardProperties = {style: "opacity: 0.4"};

    public static defaultProperties = {
        view: SquareView,
        model: SquareModel,
    };

    //Expose fields from the model
    @expose("model") color: Color;
    @expose("model") size: Point;
    @expose("model") position: Point;
    @expose("model") rotation: number;
    @expose("model") anchor: Anchor | Point;

    public initialize() {
        gradum(this).metadata.set(true, "modifiable");
        gradum(this).metadata.makeSignal("isPusher");
        gradum(this).metadata.makeSignal("isSpacer");
        super.initialize();
    }

    public move(delta: Point) {
        this.model.position = delta.add(this.model.position);
    }

    public rotate(from: Point, to: Point, anchor: Anchor | Point = this.anchor) {
        const pivot = this.getBoundingClientRect().pointAt(anchor);
        const swept = pivot.angleBetween(from, to);
        if (!swept) return;

        const offset = this.model.position.sub(pivot);
        this.model.rotation += swept;
        this.model.position = pivot.add(offset.rotate(swept));
    }

    public resize(delta: Point, anchor: Anchor | Point = this.anchor, uniform: boolean = false) {
        const fraction = new AnchorPoint(anchor).fraction;
        const local = delta.rotate(-(this.model.rotation ?? 0));

        let sizeDelta = local.mul(new Point(
            fraction.x === 0 ? 2 : -2 * fraction.x,
            fraction.y === 0 ? 2 : -2 * fraction.y
        ));
        if (uniform) sizeDelta = new Point(sizeDelta.min, sizeDelta.min);

        const pinned = this.getBoundingClientRect().pointAt(anchor);
        this.model.size = this.model.size.add(sizeDelta);
        this.model.position = this.model.position.add(pinned.sub(this.getBoundingClientRect().pointAt(anchor)));
    }

    public getBoundingClientRect(): GradumRect {
        return new GradumRect({
            x: this.model.position.x,
            y: this.model.position.y,
            width: this.model.size.x,
            height: this.model.size.y,
            anchor: this.model.anchor,
            angleRad: this.model.rotation
        });
    }
}

define(Square, "demo-square");