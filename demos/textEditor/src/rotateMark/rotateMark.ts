import {Point} from "../../../../build/gradum-kit.esm";
import {SequenceMark} from "../sequenceMark/sequenceMark";
import "./rotateMark.css";

//How far out from the middle of the passage a turning drag has to be before its angle is read, in pixels.
const MIN_RADIUS = 16;

/**
 * @class RotateMark
 * @description A passage that turns: a full circle cycles it once all the way round, so each step of
 * `360 / items` carries the last item to the front.
 */
export class RotateMark extends SequenceMark {
    public static markName: string = "rotating";

    //The point the turn goes round: the middle of the passage as it sat when the drag took hold of it.
    protected pivot: Point;

    //Radians swept so far, before rounding to whole items, and the last pointer position far enough out to
    //be worth an angle.
    protected angle: number = 0;
    protected reference: Point;

    //How far the turn has carried the items, in items.
    protected shift: number = 0;

    public begin(): boolean {
        this.angle = this.shift = 0;
        this.reference = undefined;
        if (!super.begin()) return false;

        this.pivot = this.rectOf(0, this.original.length).center;
        return true;
    }

    /**
     * @description The items in the order the turn puts them, the last moving to the front a step at a time.
     * @protected
     */
    protected get items(): string[] {
        const count = this.tokens.length;
        const shift = ((this.shift % count) + count) % count;
        return shift ? this.tokens.slice(count - shift).concat(this.tokens.slice(0, count - shift))
            : this.tokens.slice();
    }

    /**
     * @function startRotate
     * @description Take hold: the drag began on this passage, so the rest of it is this passage's to answer
     * for. Drawn straight away, so it shows as held before anything moves.
     */
    public startRotate() {
        this.hold();
    }

    /**
     * @function endRotate
     * @description Let go, keeping what the turn made.
     */
    public endRotate() {
        this.commit();
    }

    /**
     * @function rotate
     * @description Take the turn to where the pointer has reached, and show it when it has moved the passage
     * on by an item.
     * @param {Point} from - Where the pointer was. Unused: a turn is measured between counted positions of
     * its own, not between every pair the pointer passes through.
     * @param {Point} to - Where it is now.
     */
    public rotate(from: Point, to: Point) {
        if (!this.tokens || this.tokens.length < 2) return;

        //Close to the middle a small movement sweeps a wild angle, and the drag starts there — on the
        //passage itself, since that is what says which text to turn. So nothing counts until the pointer is
        //far enough out for its angle to mean something.
        if (this.pivot.sub(to).length < MIN_RADIUS) {
            this.reference = undefined;
            return;
        }

        //The first position out is a reference to measure from, not a sweep in itself: without that, coming
        //out on the far side of the middle would read as half a turn taken all at once.
        if (!this.reference) {
            this.reference = to;
            return;
        }

        this.angle += this.pivot.angleBetween(this.reference, to);
        this.reference = to;

        const shift = Math.round(this.angle / (2 * Math.PI / this.tokens.length));
        if (shift === this.shift) return;

        this.shift = shift;
        this.drawPreview();
    }
}
