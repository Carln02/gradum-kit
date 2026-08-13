import {
    define, GradumElement, Point, expose, auto, gradum, p, Color, GradumModel, Anchor, AnchorPoint, GradumRect
} from "../../../../build/gradum-kit.esm";
import {SquareModel} from "./square.model";
import {SquareView} from "./square.view";
import "./square.css";

//Custom square element, defined as a custom element
export class Square extends GradumElement<SquareView, any, SquareModel> {
    //Expose fields from the model
    @expose("model") color: Color;
    @expose("model") size: Point;
    @expose("model") position: Point;
    @expose("model") rotation: number;
    @expose("model") centerAnchor: boolean;

    public static defaultProperties = {
        view: SquareView,
        model: SquareModel,
    };

    public initialize() {
        gradum(this).metadata.set(true, "modifiable");
        gradum(this).metadata.makeSignal("isPusher");
        gradum(this).metadata.makeSignal("isSpacer");
        super.initialize();
    }

    public move(delta: Point) {
        this.model.position = delta.add(this.model.position);
    }

    public rotate(angle: number) {
        this.model.rotation += angle;
    }

    public resize(delta: Point, anchor: Anchor | Point = Anchor.Center) {
        const oldSize = this.model.size;
        this.model.size = oldSize.add(delta);
        const appliedDelta = this.model.size.sub(oldSize);

        anchor = new AnchorPoint(anchor).value.div(200);
        const center = this.model.position.sub(appliedDelta.mul(anchor));
        this.model.position = this.model.centerAnchor ? center : center.sub(appliedDelta.div(2));
    }

    public getBoundingClientRect(): DOMRect {
        return new GradumRect({
            x: this.model.position.x - (this.model.centerAnchor ? this.model.size.x / 2 : 0),
            y: this.model.position.y - (this.model.centerAnchor ? this.model.size.y / 2 : 0),
            width: this.model.size.x,
            height: this.model.size.y,
            angleRad: this.model.rotation
        });
    }
}

define(Square, "demo-square");