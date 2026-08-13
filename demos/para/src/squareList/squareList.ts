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
            for (let i = this.squares.length; i < this.count; i++) this.squares[i] =
                Square.create({parent: this.canvas});
        }

        //Only the two ends are yours to move: the middles are placed by the reifect, so they are marked
        //unmodifiable and the select tool leaves them alone.
        gradum(this.startSquare).metadata.set(true, "modifiable");
        gradum(this.endSquare).metadata.set(true, "modifiable");
        const middleSquares = this.squares.slice(1, -1);
        for (const square of middleSquares) gradum(square).metadata.set(false, "modifiable");
        this.reifect.attach(...middleSquares);
        this.reifect.apply();
    }
}

define(SquareList);