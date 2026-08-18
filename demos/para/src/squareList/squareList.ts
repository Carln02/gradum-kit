import {
    signal,
    effect,
    Reifect,
    Point,
    GradumBaseElement,
    Color,
    define,
    gradum,
    linearInterpolation
} from "../../../../build/gradum-kit.esm";
import {Square} from "../square/square";

export class SquareList extends GradumBaseElement {
    @signal public count: number = 10;

    private squares: Square[] = [];

    private reifect: Reifect = new Reifect<Square>({
        position: (id, total) =>
            Point.linearInterpolation(this.startSquare.position, this.endSquare.position, (id + 1) / (total + 1)),
        color: (id, total) =>
            Color.interpolate(this.startSquare.color, this.endSquare.color, (id + 1) / (total + 1)),
        size: (id, total) =>
            Point.linearInterpolation(this.startSquare.size, this.endSquare.size, (id + 1) / (total + 1)),
        rotation: (id, total) =>
            linearInterpolation(id, 1, total, this.startSquare.rotation, this.endSquare.rotation)
    });

    public get startSquare(): Square {
        return this.squares[0];
    }

    public get endSquare(): Square {
        return this.squares[this.squares.length - 1];
    }

    public get canvas() {
        return document.querySelector("my-canvas");
    }

    @effect private updateSquareCount() {
        if (this.count < this.squares.length) {
            const removed = this.squares.splice(this.count);
            this.reifect.detach(...removed);
            for (const square of removed) square.remove();
        } else if (this.count > this.squares.length) {
            for (let i = this.squares.length; i < this.count; i++) {
                this.squares[i] = Square.create({parent: this.canvas});
                this.squares[i].delete = () => this.deleteSquare(i);
            }
        }

        if (!this.squares.length) return;
        for (let i = 0; i < this.squares.length; i++) {
            gradum(this.squares[i]).metadata.set(i === 0 || i === this.squares.length - 1, "modifiable");
        }

        this.reifect.detach(this.startSquare, this.endSquare);
        this.reifect.attach(...this.squares.slice(1, -1));
        this.reifect.apply(undefined, {recomputeProperties: true});
    }

    /**
     * @function deleteSquare
     * @description Take one square out of the list.
     *
     * Which square hardly matters for the middles: they are placed by the reifect off the two ends, so one
     * fewer of them is the whole of it and the rest spread out again to fill the gap. An end is another
     * matter — it is placed by hand, and everything else is measured from it — so it steps back to where its
     * neighbour was, which is another way of saying its neighbour has become the end.
     * @param index
     */
    public deleteSquare(index: number) {
        if (this.count <= 0 || index < 0 || index >= this.squares.length) return;
        this.reifect.detach(...this.squares);
        if (index !== this.squares.length - 1) {
            if (index === 0) this.copyInto(this.startSquare, this.squares[1]);
            this.copyInto(this.squares[this.squares.length - 2], this.endSquare);
        }
        this.count--;
    }

    /**
     * @description Give a square everything that says where and what another one is — which is exactly what
     * the reifect places the middles by, and so exactly what an end has to carry to be an end.
     * @protected
     */
    protected copyInto(square: Square, other: Square) {
        if (!square || !other || square === other) return;
        square.position = other.position;
        square.size = other.size;
        square.color = other.color;
        square.rotation = other.rotation;
    }
}

define(SquareList);