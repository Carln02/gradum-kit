import {Point} from "../../../../build/gradum-kit.esm";
import {SequenceMark} from "../sequenceMark/sequenceMark";
import "./resizeMark.css";

/**
 * @class ResizeMark
 * @description A passage that stretches: dragging along it repeats its last item, and dragging back trims
 * items off the end.
 */
export class ResizeMark extends SequenceMark {
    public static markName: string = "resizing";

    //How many pixels of drag one item is worth.
    protected step: number;

    //Pixels dragged so far, before rounding to whole items, and what that comes to in items: above zero the
    //passage grows, below it the tail is dropped.
    protected offset: number = 0;
    protected added: number = 0;

    public begin(): boolean {
        this.offset = this.added = 0;
        if (!super.begin()) return false;

        //One item's worth of drag is one item's width on screen, so the text pulls at the rate it reads.
        //Measured off the first item rather than the whole passage, since a passage that wraps onto another
        //line ends to the left of where it started and its width on screen says nothing about its items.
        const head = this.rectOf(0, this.tokens[0].length);
        const character = Math.max(3, Math.abs(head.width) / this.tokens[0].length);
        this.step = Math.max(6, character * this.original.length / this.tokens.length);
        return true;
    }

    /**
     * @description Which items outlast the stretch: all of them, less however many the drag has trimmed off
     * the end.
     * @protected
     */
    protected get kept(): string[] {
        const items = this.items;
        return this.added < 0 ? items.slice(0, Math.max(0, items.length + this.added)) : items;
    }

    /**
     * @description What the stretch adds: the last item again, as many times over as the drag asks for.
     * @protected
     */
    protected get grown(): string {
        if (this.added <= 0) return "";

        const items = this.items;
        const gap = this.unit === "word" ? (this.gaps[this.gaps.length - 1] ?? " ") : "";
        return (gap + items[items.length - 1]).repeat(this.added);
    }

    /**
     * @description Where the trimmed tail starts, as an offset into the passage: the gap before the first
     * doomed item, so that the space going with it is struck through too.
     * @protected
     */
    protected get trimmedFrom(): number {
        return this.added < 0 ? this.join(this.kept).length : super.trimmedFrom;
    }

    /**
     * @function startResize
     * @description Take hold: the drag began on this passage, so the rest of it is this passage's to answer
     * for. Drawn straight away, so it shows as held before anything moves.
     */
    public startResize() {
        this.hold();
    }

    /**
     * @function endResize
     * @description Let go, keeping what the stretch made.
     */
    public endResize() {
        this.commit();
    }

    /**
     * @function resize
     * @description Take the stretch on by however far the pointer moved, and show it when that has added or
     * trimmed an item.
     * @param {Point} delta - How far the pointer moved since the last step.
     */
    public resize(delta: Point) {
        if (!this.tokens) return;

        //The pointer arrives a few pixels at a time, so the distance is kept rather than rounded away: a
        //drag is the sum of its moves, not a sequence of moves each too small to count for anything.
        this.offset += delta.x;

        //Trimming stops at nothing left; there is no such limit on the way out.
        const added = Math.max(Math.round(this.offset / this.step), -this.tokens.length);
        if (added === this.added) return;

        this.added = added;
        this.drawPreview();
    }
}
