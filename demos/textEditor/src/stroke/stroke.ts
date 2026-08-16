import {Point} from "../../../../build/gradum-kit.esm";
import {StrokeParts, StrokeProperties, TextUnit} from "./stroke.types";

//How far out from the middle of the passage a turning drag has to be before its angle is read, in pixels.
const MIN_RADIUS = 16;

/**
 * @class Stroke
 * @description A passage of text held as a sequence, and how far a drag has got with it.
 *
 * A shape has a size and an angle; an ordered list of items has a length and a rotation too, and they mean
 * something exact. Turning it is a cyclic shift — a full circle brings every item back where it started.
 * Stretching it repeats the last item; trimming it drops items off the end.
 *
 * Nothing here knows about the document it came from. It is given the passage's text, and it says what that
 * text should read as the drag goes on ({@link Stroke.text}) and what it settles to when the drag ends
 * ({@link Stroke.result}) — writing either one back is someone else's business.
 */
export class Stroke {
    /**
     * @description Where the passage starts in the document. Fixed for the stroke: every edit happens at or
     * after this point, so it stays valid however much the text after it changes.
     */
    public readonly from: number;

    /**
     * @description The passage as it read before the drag started.
     */
    public readonly original: string;

    /**
     * @description Whether the passage's items are words or letters.
     */
    public readonly unit: TextUnit;

    /**
     * @description The items themselves, and what sits between them. `gaps[i]` separates `tokens[i]` from
     * `tokens[i + 1]` — kept aside so that reordering the items leaves the spacing where it was.
     */
    public readonly tokens: string[];
    public readonly gaps: string[];

    /**
     * @description How long the passage's text is in the document right now, which is how its end is found
     * again. Set by whoever writes {@link Stroke.text} out.
     */
    public length: number;

    //What the gesture is measured against: the point a turn goes round, and how many pixels one item is
    //worth when stretching.
    protected readonly pivot: Point;
    protected readonly step: number;

    //How far the gesture has got, in items: `shift` cycles the items, `added` extends or trims them.
    protected shift: number = 0;
    protected added: number = 0;

    //And the same before rounding to whole items — radians swept and pixels dragged — with the last pointer
    //position far enough out to be worth an angle.
    protected angle: number = 0;
    protected offset: number = 0;
    protected reference: Point;

    /**
     * @constructor
     * @param {StrokeProperties} properties - The passage to take hold of.
     */
    public constructor(properties: StrokeProperties) {
        this.from = properties.from;
        this.original = properties.text;
        this.length = this.original.length;

        this.unit = /\s/.test(this.original) ? "word" : "char";
        const parts = this.unit === "word" ? this.original.split(/(\s+)/) : [...this.original];
        this.tokens = this.unit === "word" ? parts.filter((_, index) => index % 2 === 0) : parts;
        this.gaps = this.unit === "word" ? parts.filter((_, index) => index % 2 === 1) : [];

        const start = properties.coordsAt(0);
        const end = properties.coordsAt(this.original.length);
        this.pivot = new Point((start.left + end.right) / 2, (start.top + end.bottom) / 2);

        //One item's worth of drag is one item's width on screen, so the text pulls at the rate it reads.
        //Measured off the first item rather than the whole passage, since a passage that wraps onto another
        //line ends to the left of where it started and its width on screen says nothing about its items.
        const head = properties.coordsAt(this.tokens[0].length);
        const character = Math.max(3, Math.abs(head.right - start.left) / this.tokens[0].length);
        this.step = Math.max(6, character * this.original.length / this.tokens.length);
    }

    /**
     * @function turn
     * @description Take the turn to where the pointer has reached. A full circle cycles the passage once all
     * the way round, so each step of `360 / items` carries the last item to the front.
     * @param {Point} to - Where the pointer is now.
     * @returns {boolean} Whether that moved the passage on by an item.
     */
    public turn(to: Point): boolean {
        if (this.tokens.length < 2) return false;

        //Close to the middle a small movement sweeps a wild angle, and the drag starts there — on the
        //passage itself, since that is what says which text to turn. So nothing counts until the pointer is
        //far enough out for its angle to mean something.
        if (this.pivot.sub(to).length < MIN_RADIUS) {
            this.reference = undefined;
            return false;
        }

        //The first position out is a reference to measure from, not a sweep in itself: without that, coming
        //out on the far side of the middle would read as half a turn taken all at once.
        if (!this.reference) {
            this.reference = to;
            return false;
        }

        this.angle += this.pivot.angleBetween(this.reference, to);
        this.reference = to;

        const shift = Math.round(this.angle / (2 * Math.PI / this.tokens.length));
        if (shift === this.shift) return false;

        this.shift = shift;
        return true;
    }

    /**
     * @function pull
     * @description Take the stretch on by however far the pointer moved.
     * @param {number} distance - How far it moved along the text, in pixels.
     * @returns {boolean} Whether that added or trimmed an item.
     */
    public pull(distance: number): boolean {
        //The pointer arrives a few pixels at a time, so the distance is kept rather than rounded away: a
        //drag is the sum of its moves, not a sequence of moves each too small to count for anything.
        this.offset += distance;

        const added = Math.round(this.offset / this.step);
        if (added === this.added) return false;

        //Trimming stops at nothing left; there is no such limit on the way out.
        this.added = Math.max(added, -this.tokens.length);
        return true;
    }

    /**
     * @description What the passage should read while the drag is still going.
     *
     * Trimmed items are still there, to be struck through rather than removed: the passage only ever grows
     * while the drag is live, so nothing shifts under a pointer that is still measuring against it.
     */
    public get text(): string {
        return this.join(this.cycled) + this.grown;
    }

    /**
     * @description Which parts of {@link Stroke.text} are going and which are new, as offsets into it.
     */
    public get parts(): StrokeParts {
        const kept = this.join(this.cycled).length;
        const grown = this.grown.length;

        return {
            trimmed: {from: this.added < 0 ? this.trimmedFrom : kept, to: kept},
            grown: {from: kept, to: kept + grown}
        };
    }

    /**
     * @description What the passage reads once the drag is over: cycled, with the trimmed tail gone and the
     * grown tail kept.
     */
    public get result(): string {
        const tokens = this.cycled;
        const kept = this.added < 0 ? tokens.slice(0, Math.max(0, tokens.length + this.added)) : tokens;
        return this.join(kept) + this.grown;
    }

    /**
     * @description The items in the order the turn puts them, the last moving to the front a step at a time.
     * @protected
     */
    protected get cycled(): string[] {
        const count = this.tokens.length;
        const shift = ((this.shift % count) + count) % count;
        return shift ? this.tokens.slice(count - shift).concat(this.tokens.slice(0, count - shift))
            : this.tokens.slice();
    }

    /**
     * @description What a stretch adds: the last item again, as many times over as the drag asks for.
     * @protected
     */
    protected get grown(): string {
        if (this.added <= 0) return "";

        const tokens = this.cycled;
        const gap = this.unit === "word" ? (this.gaps[this.gaps.length - 1] ?? " ") : "";
        return (gap + tokens[tokens.length - 1]).repeat(this.added);
    }

    /**
     * @description Where the trimmed tail starts, as an offset into the passage: the gap before the first
     * doomed item, so that the space going with it is struck through too.
     * @protected
     */
    protected get trimmedFrom(): number {
        const tokens = this.cycled;
        const kept = Math.max(0, tokens.length + this.added);
        return kept ? this.join(tokens.slice(0, kept)).length : 0;
    }

    /**
     * @description Put items back together with the spacing the passage had, which stays where it was
     * however the items move.
     * @protected
     */
    protected join(tokens: string[]): string {
        return tokens.reduce((text, token, index) =>
            index ? text + (this.gaps[index - 1] ?? "") + token : token, "");
    }
}
