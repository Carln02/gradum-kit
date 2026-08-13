import {define, GradumElement, expose, gradum, Point, GradumRect} from "../../../../build/gradum-kit.esm";
import {StickyLineView} from "./stickyLine.view";
import {StickyLineModel} from "./stickyLine.model";
import "./stickyLine.css";
import {Square} from "../square/square";
import {StickyLineConstrainer} from "./stickyLine.constrainer";

export class StickyLine extends GradumElement<StickyLineView, any, StickyLineModel> {
    @expose("view", false) public accessor startHandle: Square;
    @expose("view", false) public accessor endHandle: Square;

    public get position(): Point {
        return Point.midPoint(this.startHandle.position, this.endHandle.position);
    }

    public set position(value: Point) {
        this.move(value.sub(this.position));
    }

    public static defaultProperties = {
        model: StickyLineModel,
        view: StickyLineView,
        constrainers: StickyLineConstrainer,
        origin: new Point(500, 300),
    };

    public initialize() {
        super.initialize();
        //Not a Square, so it marks itself: the select tool only moves and selects what says it is modifiable.
        gradum(this).metadata.set(true, "modifiable");
    }

    public move(delta: Point) {
        this.view.startHandle?.move(delta);
        this.view.endHandle?.move(delta);
    }

    public getBoundingClientRect() {
        return GradumRect.fromSegment(this.startHandle.position, this.endHandle.position, 10);
    }
}

define(StickyLine, "sticky-line");