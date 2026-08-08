import {define, GradumElement, Point, expose, auto, gradum, p} from "../../../../build/gradum-kit.esm";
import {SquareModel} from "./square.model";
import {SquareView} from "./square.view";
import "./square.css";

//Custom square element, defined as a custom element
@define("demo-square")
export class Square extends GradumElement<SquareView, any, SquareModel> {
    //Expose fields from the model
    @expose("model") color: string;
    @expose("model") size: number;
    @expose("model") position: Point;
    @expose("model") rotation: number;

    public static defaultProperties = {
        view: SquareView,
        model: SquareModel,
        isSpacer: false,
        isPusher: false,
    };

    @auto({defaultValue: false}) public set isPusher(value: boolean) {
        if (value) this.isSpacer = false;
        gradum(this).removeAllChildren();
        if (value) gradum(this).addChild(p({text: "Pusher"}));
    }

    @auto({defaultValue: false}) public set isSpacer(value: boolean) {
        if (value) this.isPusher = false;
        gradum(this).removeAllChildren();
        if (value) gradum(this).addChild(p({text: "Spacer"}));
    }

    public move(delta: Point) {
        this.model.position = delta.add(this.model.position);
    }

    public rotate(angle: number) {
        this.model.rotation += angle;
    }

    public resize(delta: Point) {
        this.model.size = delta.min;
    }
}