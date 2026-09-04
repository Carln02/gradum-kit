import {
    GradumConstrainer,
    solver,
    ConstrainerCallbackProperties,
    Point,
    gradum,
    closestPointOnSegment
} from "../../../../build/gradum-kit.esm";
import {StickyLine} from "./stickyLine";
import {getRect} from "../utils/getRect";
import {StickyLineView} from "./stickyLine.view";
import {StickyLineModel} from "./stickyLine.model";

//How close to its spot on the line an object has to be before it is left alone. Solvers run several times
//per pointer event, so without it every pass would rewrite a position that is already right.
const Epsilon = 0.25;

export class StickyLineConstrainer extends GradumConstrainer<StickyLine, StickyLineView, StickyLineModel> {
    public constrainerName = "stickyLine";

    /**
     * @description Where each held object sits along the line, as a fraction from the start handle to the
     * end one. Remembered so an object rides the line when the line moves, rather than being re-projected
     * onto whatever part of it ends up nearest.
     */
    protected positions: WeakMap<object, number> = new WeakMap();

    public initialize(): void {
        super.initialize();
        this.objectList.list = [this.element];

        //An object the line lets go of keeps nothing of its stay: no spot on the line to return to.
        this.onObjectListChange.add((object: object, status) => {
            if (object === this.element || status === "added") return;
            this.positions.delete(object);
        });
    }

    @solver() protected ensureAlignment(properties: ConstrainerCallbackProperties) {
        const target = properties.target;
        //The line's own parts are in the list so that touching them solves the line, not so that the line
        //aligns them to itself. Another line is skipped too: a line is not something a line holds.
        if (!(target instanceof Element) || target instanceof StickyLine ||
            target === this.element || (target instanceof Node && this.element.contains(target))) return;
        //An object dragged off the line leaves the list mid-event, but the queue it was already in still
        //carries it. Without this, the pass that follows would snap it straight back.
        if (!this.objectList.has(target)) return;
        //An object whose feedforward is standing on the line is left where the pointer has it: the copy is
        //what shows where it will land. Its old spot on the line goes with it, so when it is finally put
        //down the line asks afresh, and it lands where its copy was rather than where it set off from.
        for (const entry of this.objectList) {
            if (gradum(entry).feedforwardOrigin === target) {
                this.positions.delete(target);
                return;
            }
        }

        const start = this.view.startHandle?.position;
        const end = this.view.endHandle?.position;
        if (!start || !end) return;

        //What the target answers for. Usually itself — but the canvas hands the line a feedforward for an
        //object being dragged, a copy that shows where the object will land while the object itself follows
        //the pointer. A feedforward belongs wherever the object it stands for currently is.
        const source = gradum(target).feedforwardOrigin ?? target;

        //Where the thing being placed is now, and where whatever it answers for is. The two differ only for
        //a feedforward: it is placed against the object's spot, but checked for drift against its own.
        const anchor = getRect(target)?.origin;
        const sourceAnchor = source === target ? anchor : getRect(source)?.origin;
        if (!sourceAnchor) return;

        //A spot along the line is worked out when the object arrives and kept from then on, so that moving
        //the line carries what it holds instead of re-projecting it. A feedforward is the exception: it is
        //there precisely because its object is on the move, so its spot is asked again every pass.
        if (!this.positions.has(target) || source !== target)
            this.positions.set(target, closestPointOnSegment(sourceAnchor, start, end).positionOnSegment(start, end));

        const position = this.positions.get(target);
        if (typeof position !== "number") return;

        const destination = start.add(end.sub(start).mul(position));
        //Facing is part of the constraint, so it is put back whether or not the object has drifted — turning
        //something on the line without moving it should not leave it lying across the line.
        this.applyRotation(target, Math.atan2(end.y - start.y, end.x - start.x));
        if (anchor && Point.dist(anchor, destination) < Epsilon) return;
        this.applyPosition(target, destination);
    }

    protected applyRotation(element: Element, angle: number): boolean {
        //If element is undefined, not an Element, or doesn't have a rotation field --> return.
        if (!element || !(element instanceof Element) || !("rotation" in element)) return false;
        element.rotation = angle;
        return true;
    }

    protected applyPosition(element: Element, position: Point): boolean {
        //If element is undefined, not an Element, or doesn't have a position field --> return.
        if (!element || !(element instanceof Element) || !("position" in element)) return false;
        //If the element's position is not an object --> return.
        element.position = position;
        return true;
    }
}
