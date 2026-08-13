
import {
    define, GradumElement, Point, expose, auto, gradum, p, Color, GradumModel, Anchor, AnchorPoint
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
    //Exposed so overlays can read where `position` actually sits — the centre, or the top-left corner.
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
        //Increment size
        const before = this.model.size;
        this.model.size = before.add(delta);
        //The model clamps size to a floor, so the growth that actually landed can be smaller than what was
        //asked for. Shift by that instead of by delta, or the square keeps sliding once it has bottomed out.
        const applied = this.model.size.sub(before);
        //Bound the anchor between -0.5 and 0.5
        anchor = new AnchorPoint(anchor).value.div(200);
        //Shift the center of the element according to the anchor
        const center = this.model.position.sub(applied.mul(anchor));
        //Move the element to make it seem like its growing from the proper side
        this.model.position = this.model.centerAnchor ? center : center.sub(applied.div(2));
    }
}
define(Square, "demo-square");