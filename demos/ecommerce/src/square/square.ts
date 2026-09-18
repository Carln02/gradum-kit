import {
    define, GradumElement, Point, signal, auto, effect, gradum, Color, Anchor, AnchorPoint, GradumRect
} from "../../../../build/gradum-kit.esm";
import "./square.css";

//Custom square element, defined as a custom element
export class Square extends GradumElement {
    //Data as signals
    @signal color: Color = Color.random([60, 90], [40, 70]);
    @signal position: Point = new Point();
    @signal rotation: number = 0;
    @signal anchor: Anchor | Point = Anchor.Center;

    @signal @auto({
        preprocessValue: (value: any) =>
            (Point.from(value) ?? new Point(100, 100)).bound(5, Infinity, 5, Infinity)
    }) accessor size: Point = new Point(100, 100);

    public initialize() {
        gradum(this).metadata.set(true, "modifiable");
        super.initialize();
    }

    public move(delta: Point) {
        this.position = delta.add(this.position);
    }

    public rotate(from: Point, to: Point, anchor: Anchor | Point = this.anchor) {
        const pivot = this.getBoundingClientRect().pointAt(anchor);
        const swept = pivot.angleBetween(from, to);
        if (!swept) return;

        const offset = this.position.sub(pivot);
        this.rotation += swept;
        this.position = pivot.add(offset.rotate(swept));
    }

    public resize(delta: Point, anchor: Anchor | Point = this.anchor, uniform: boolean = false) {
        const fraction = new AnchorPoint(anchor).fraction;
        const local = delta.rotate(-(this.rotation ?? 0));

        let sizeDelta = local.mul(new Point(
            fraction.x === 0 ? 2 : -2 * fraction.x,
            fraction.y === 0 ? 2 : -2 * fraction.y
        ));
        if (uniform) sizeDelta = new Point(sizeDelta.min, sizeDelta.min);

        const pinned = this.getBoundingClientRect().pointAt(anchor);
        this.size = this.size.add(sizeDelta);
        this.position = this.position.add(pinned.sub(this.getBoundingClientRect().pointAt(anchor)));
    }

    public delete() {
        this.remove();
    }

    public getBoundingClientRect(): GradumRect {
        return new GradumRect({
            x: this.position.x,
            y: this.position.y,
            width: this.size.x,
            height: this.size.y,
            anchor: this.anchor,
            angleRad: this.rotation
        });
    }

    //Updating the representation of the square
    //@effect methods will be called when the values of the signals they use change
    @effect protected updatePosition() {
        const rect = this.getBoundingClientRect();
        gradum(this).setStyle("transform", `
            translate(${rect.topLeft.x}px, ${rect.topLeft.y}px)
            rotate(${this.rotation}rad)
        `);
    }

    @effect protected updateColor() {
        gradum(this).setStyle("backgroundColor", this.color.toString());
    }

    @effect protected updateSize() {
        gradum(this).setStyles({width: this.size.x + "px", height: this.size.y + "px"});
    }
}

define(Square, "demo-square");