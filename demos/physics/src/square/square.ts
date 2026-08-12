
import {define, GradumElement, Point, expose, auto, gradum, p, Color, GradumModel} from "../../../../build/gradum-kit.esm";
import {SquareModel} from "./square.model";
import {SquareView} from "./square.view";
import "./square.css";

//Custom square element, defined as a custom element
export class Square extends GradumElement<SquareView, any, SquareModel> {
    //Expose fields from the model
    @expose("model") color: Color;
    @expose("model") elementSize: number;
    @expose("model") position: Point;
    @expose("model") rotation: number;

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

    public resize(delta: Point) {
        this.model.elementSize = delta.min;
    }
}
define(Square, "demo-square");