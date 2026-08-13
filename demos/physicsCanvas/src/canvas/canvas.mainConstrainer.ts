import {
    Coordinate,
    Point,
    solver,
    ConstrainerCallbackProperties,
    GradumDragEvent,
    GradumConstrainer,
    gradum
} from "../../../../build/gradum-kit.esm";
import {getRect} from "../utils/getRect";
import {Substrate} from "../interfaces";

//An element's collision box in its own frame: where it sits, how far it reaches, and which way it faces.
//Keeping the axes explicit is what lets the same code handle rotated and upright boxes alike.
type OrientedBox = {
    center: Point,
    half: Point,
    axes: [Point, Point]
};

//Pusher constrainer
export class CanvasConstrainer extends GradumConstrainer<Substrate> {
    //Define the constrainer's name. Equivalent to gradum(canvas).makeConstrainer("main").
    public constrainerName = "main";

    //On initialize --> set default queue to be an empty array instead of all objects in the list
    //The queue will be dynamically populated with objects the user collides with
    public initialize() {
        super.initialize();
        this.defaultQueue = [];

        this.objectList = this.element["objectsList"];
        this.triggerList = this.objectList;
    }

    /**
     * @description Check if an element is a spacer.
     * @param el - The object to check.
     * @protected
     */
    protected isSpacer(el: object): boolean {
        return !!gradum(el).metadata?.get("isSpacer");
    }

    /**
     * @description Check if an element is a pusher.
     * @param {object} el - The object to check.
     * @protected
     */
    protected isPusher(el: object): boolean {
        return !!gradum(el).metadata?.get("isPusher");
    }

    /**
     * @description Spacer solver (with higher priority - it executes on the target before the pusher solver).
     * @param {ConstrainerCallbackProperties} properties - The solving properties passed down by the toolkit.
     * @protected
     */
    @solver({priority: 5}) protected spacerSolver(properties: ConstrainerCallbackProperties) {
        //For each object overlapping with el, and given that el has been moved by delta
        this.processTargetWithContext(properties, (el, delta, overlap) => {
            //If neither el nor overlap are spacers, return.
            if (!this.isSpacer(el) && !this.isSpacer(overlap)) return;
            //Bounce back el so it doesn't overlap anymore, and retrieve the value.
            const movedValue = this.pushElement(el, overlap, delta, true);
            //If el wasn't bounced back --> return.
            if (!movedValue) return;
            //Store el's movement in its temporary data.
            this.getObjectData(el).movedDelta = movedValue;
            //Clear the queue to reinitialize the propagation from el.
            this.queue.clear();
        });
    }

    /**
     * @description Pusher solver (with lower priority - it executes on the target after the spacer solver).
     * @param {ConstrainerCallbackProperties} properties - The solving properties passed down by the toolkit.
     * @protected
     */
    @solver({priority: 10}) protected pusherSolver(properties: ConstrainerCallbackProperties) {
        //If interaction target is not a pusher --> don't push and return.
        if (!this.isPusher(properties.eventTarget)) return;
        //For each object overlapping with el, and given that el has been moved by delta
        this.processTargetWithContext(properties, (el, delta, overlap) => {
            //Spacers never budge. Without this the spacer gets pushed here, lands in the queue, and the
            //spacer solver then bounces it back — which is the "spacer jumps the other way" glitch.
            if (this.isSpacer(overlap)) return;
            //Push overlap so it's no longer over el, and retrieve the value.
            const movedValue = this.pushElement(el, overlap, delta);
            //If overlap wasn't pushed --> return.
            if (!movedValue) return;
            //Store overlap's movement in its temporary data.
            this.getObjectData(overlap).movedDelta = movedValue;
            //Add overlap to the queue (if it isn't already in it).
            if (!this.queue.has(overlap)) this.queue.push(overlap);
        });
    }

    /**
     * @description Boilerplate code that checks the target is usable, computes the delta of the target
     * (by how much it was last moved), and executes the callback on each object overlapping with the target.
     * @param {ConstrainerCallbackProperties} properties - The solving properties passed down by the toolkit.
     * @param {(target: object, delta: Point, overlap: object) => void} callback - The callback to execute for
     * each overlap.
     * @protected
     */
    protected processTargetWithContext(
        properties: ConstrainerCallbackProperties,
        callback: (target: object, delta: Point, overlap: object) => void
    ) {
        //Anything the substrate holds counts, Node or not — these objects are drawn into a canvas, so most
        //of them never enter the DOM at all.
        const el = properties.target;
        if (!el || typeof el !== "object") return;

        //Compute delta. If the target has a stored movement, use it.
        const delta: Point = this.getObjectData(el).movedDelta ??
            //Otherwise, if the target is also the event target
            (el === properties.eventTarget
                //Use the event's delta position (if defined)
                ? (properties.event as GradumDragEvent)?.deltaPosition
                //Otherwise, undefined.
                : undefined);
        //If delta is undefined --> return.
        if (!delta) return;
        //Loop on all overlaps with target and execute callback.
        for (const overlap of this.findOverlaps(el)) callback(el, delta, overlap);
    }

    /**
     * @description Given a pusher element, an element to be pushed, and a vector indicating the direction and amount
     * by which the pusher was moved --> move either the pushed element or the pusher (depending on the value of
     * pushBack) and return the value of the movement.
     * @param {object} pusher - The object that pushes.
     * @param {object} pushed - The object that is pushed.
     * @param {Point} deltaPosition - The vector along which pusher was moved.
     * @param {boolean} [pushBack=false] - If true --> will move the pusher so it doesn't overlap with pushed.
     * Otherwise, will move pushed so it doesn't overlap with pusher.
     * @return {Point} - The amount of the movement.
     * @protected
     */
    protected pushElement(pusher: object, pushed: object, deltaPosition: Point, pushBack: boolean = false): Point {
        //Compute mtv axis (physics stuff).
        const mtv = pushBack ? this.mtvAxis(pusher, pushed) : this.mtvAxis(pushed, pusher);
        if (!mtv) return;
        //Get the normal between pushed and pusher.
        const normal = mtv.normal;
        //Dot product between delta and normal
        const alongN = deltaPosition.dot(normal);
        //If pushed will be moved and the vectors are not in the same direction --> return.
        if (!pushBack && alongN <= 0) return;
        //A bounce-back always follows the normal. It is the separating direction by construction, so the
        //element's own delta has no say in it — flipping when the two happened to agree drove the element
        //deeper in instead of out, and far enough in, it came out the other side. Rare with axis-aligned
        //pushes, where the delta nearly always opposed the normal; routine once a rotated pusher makes the
        //delta diagonal and the sign along the separating axis more or less arbitrary.
        //Compute the vector along which to move the element. Both directions move by the penetration depth:
        //that is the amount that actually separates the two boxes. Using the delta projection instead would
        //under-correct whenever the overlap is deeper than this frame's movement — a fast drag, or a push
        //propagated further down the chain — and leave the sliver of overlap behind.
        const move = normal.mul(mtv.depth);
        //Update the element's position and return the vector if it was applied.
        return this.applyMove(pushBack ? pusher : pushed, move) ? move : undefined;
    }

    /**
     * @description Attempts to move an object by delta.
     * @param {object} obj - The object to move.
     * @param {Point} delta - The amount by which to move.
     * @return Whether the object was moved.
     * @protected
     */
    protected applyMove(obj: object, delta: Point): boolean {
        //If it is undefined, not an object, or doesn't have a position field --> return.
        if (!obj || typeof obj !== "object" || !("position" in obj)) return false;
        //If the object's position is not an object --> return.
        const position = obj.position;
        if (typeof position !== "object") return false;
        //If position is a Point --> add to it delta.
        if (position instanceof Point) obj.position = position.add(delta);
        //Otherwise --> treat it as a coordinate, turn it into a point, and add to it delta.
        else obj.position = new Point(position as Coordinate).add(delta);
        return true;
    }

    /**
     * @description Retrieve all elements from the object list that overlap on the screen with the given element.
     * @param {object} obj - The element to check overlaps for.
     * @return {object[]} - Array of overlapping elements.
     * @protected
     */
    protected findOverlaps(obj: object): object[] {
        const out: object[] = [];
        //For each element in the constrainer's object list
        for (const entry of Array.from(this.objectList)) {
            //If it is the reference element --> continue.
            if (!entry || typeof entry !== "object" || entry === obj) continue;
            //If it overlaps with the reference element --> add it to the out array.
            if (this.overlaps(entry, obj)) out.push(entry);
        }
        return out;
    }

    /**
     * @description Find whether object 1 visually overlaps with object 2.
     * @param {object} obj1 - First object.
     * @param {object} obj2 - Second object.
     * @return Whether they overlap.
     * @protected
     */
    //Finds if element a overlaps with b
    protected overlaps(obj1: object, obj2: object): boolean {
        return !!this.mtvAxis(obj1, obj2);
    }

    /**
     * @description The object as an oriented box: where its center is, how far it reaches along each of its
     * own two axes, and which way those axes point. Rotation is read off `angleRad` when the object reports
     * one — a plain `DOMRect` has no angle, so it comes back axis-aligned.
     * @param {object} obj - The object to measure.
     * @return {OrientedBox} The box, or `undefined` for anything with no area to collide with.
     * @protected
     */
    protected boxOf(obj: object): OrientedBox {
        const rect = getRect(obj);
        if (!rect) return undefined;

        const angle = rect.angleRad ?? 0;
        const cos = Math.cos(angle), sin = Math.sin(angle);
        return {
            center: new Point(rect.x + rect.width / 2, rect.y + rect.height / 2),
            half: new Point(rect.width / 2, rect.height / 2),
            //Unit vectors along the box's own width and height, so a rotated box is described in its own
            //frame rather than by the axis-aligned rect that would contain it.
            axes: [new Point(cos, sin), new Point(-sin, cos)]
        };
    }

    /**
     * @description How far a box reaches from its center along an arbitrary direction. Each of the box's own
     * axes contributes its half-extent scaled by how much of it lies along that direction, which is what makes
     * this work for a rotated box.
     * @param {OrientedBox} box - The box to measure.
     * @param {Point} axis - Unit vector to project onto.
     * @return {number} The reach, in pixels.
     * @protected
     */
    protected projectedRadius(box: OrientedBox, axis: Point): number {
        return box.half.x * Math.abs(box.axes[0].dot(axis))
            + box.half.y * Math.abs(box.axes[1].dot(axis));
    }

    /**
     * @description The shortest push that would separate two elements, by the separating axis theorem: two
     * convex boxes miss each other exactly when some axis exists on which their projections don't overlap, and
     * for rectangles only their four edge normals need testing. Finding no such axis means they intersect, and
     * the axis with the least overlap is the cheapest way out.
     *
     * *Note: replaces the axis-aligned test this used to do, which treated a rotated square as the upright box
     * containing it — so squares collided across a gap at 45°.*
     * @param {object} aObj - The object that would be moved.
     * @param {object} bObj - The object it is being separated from.
     * @return The direction to move `a` in and how far, or `null` when the two do not overlap.
     * @protected
     */
    protected mtvAxis(aObj: object, bObj: object): { normal: Point; depth: number } | null {
        const a = this.boxOf(aObj), b = this.boxOf(bObj);
        if (!a || !b) return null;

        const between = b.center.sub(a.center);
        let best: { normal: Point; depth: number } | null = null;

        for (const axis of [...a.axes, ...b.axes]) {
            const gap = this.projectedRadius(a, axis) + this.projectedRadius(b, axis)
                - Math.abs(between.dot(axis));
            //A single axis with no overlap is proof they are apart — nothing more to test.
            if (gap <= 0) return null;
            if (best && gap >= best.depth) continue;
            //Pointed from b towards a, so it always reads as "the way a moves to get clear".
            best = {normal: between.dot(axis) > 0 ? axis.mul(-1) : axis, depth: gap};
        }

        return best;
    }
}