import {
    GradumConstrainer,
    solver, ConstrainerCallbackProperties,
    gradum, GradumRect, GradumEventName
} from "../../../../build/gradum-kit.esm";
import {StickyLine} from "../stickyLine/stickyLine";

//Pusher substrate
export class CanvasConstrainer extends GradumConstrainer {
    //Define the substrate's name. Equivalent to gradum(canvas).makeSubstrate("main").
    public constrainerName = "main";

    public defaultQueue = [];

    /**
     * @description The feedforward currently standing on the lines in place of the object being dragged, and
     * the object it stands for. One gesture moves one object, so there is never more than one of either.
     */
    protected feedforward: object;
    protected feedforwardOrigin: object;

    /**
     * @description The tools whose drags are fed forward: the object stays under the pointer and a copy of
     * it waits on the line until the pointer is released. Every other tool hands the lines the object itself
     * — resizing or rotating never takes it off the line, so there is nothing to feed forward.
     */
    protected feedforwardTools: string[] = ["select"];

    @solver() protected refreshStickyLinesLists(properties: ConstrainerCallbackProperties) {
        const type = properties.eventType;
        //Nothing here moves on a move event: objects and lines alike are moved by the tools, on the drag
        //events. A move only ever arrives mid-drag naming the object already under way without saying so,
        //and acting on it would have the line take hold of the object itself halfway through the gesture.
        if (type === GradumEventName.move) return;

        const target = properties.target;
        if (!target || gradum(target).isFeedforward) return;

        //Which of the passes names what the pointer has hold of. Every other pass is one where nothing is
        //being dragged, so there is nothing to feed forward either.
        const draggedTarget: object = type === GradumEventName.dragStart || type === GradumEventName.drag
            ? properties.eventTarget : undefined;

        const lines: object[] = [];
        const objects: object[] = [];
        for (const entry of this.objectList) {
            if (gradum(entry).isFeedforward) continue;
            (entry instanceof StickyLine ? lines : objects).push(entry);
        }
        this.refreshFeedforward(draggedTarget, properties, lines, objects);

        //A line that moves has to be asked the other way around: which objects does it now cover? Asking
        //only which lines cover the object would leave a line sweeping across the canvas picking up nothing.
        //It only ever picks up here, never lets go: what it holds travels with it, so an object leaves a
        //line by being dragged off it — which is the other branch, where the object is the one that moved.
        if (target instanceof StickyLine) {
            for (const object of this.findOverlaps(target, objects)) this.hold(target, object);
            return;
        }

        const overlaps = this.findOverlaps(target, lines);
        for (const line of lines) {
            if (overlaps.includes(line)) this.hold(line, target);
            else this.release(line, target);
        }
    }

    /**
     * @description Have the line hold the object, and — while the object is being dragged — the feedforward
     * for it alongside. The line places the copy and leaves the object alone, which is what lets the object
     * follow the pointer while the line still shows where it will land.
     *
     * The object stays in the list either way. A constrainer is only woken by events naming something in
     * its list, so a line that let go of the object while standing in for it would stop being told about
     * the drag at all, and its copy would sit wherever it was last left.
     * @param {object} line - The line doing the holding.
     * @param {object} object - The object it should hold.
     * @protected
     */
    protected hold(line: object, object: object): void {
        const list = gradum(line).getConstrainerObjectList();
        list.add(object);
        if (object === this.feedforwardOrigin) list.add(this.feedforward);
    }

    /**
     * @description Have the line let go of the object, and of the feedforward stood there for it.
     * @param {object} line - The line letting go.
     * @param {object} object - The object it should let go of.
     * @protected
     */
    protected release(line: object, object: object): void {
        const list = gradum(line).getConstrainerObjectList();
        list.remove(object);
        if (object === this.feedforwardOrigin) list.remove(this.feedforward);
    }

    /**
     * @description Keep a feedforward for the object being dragged for as long as the gesture calls for
     * one, and none once it does not. Releasing is what commits: the feedforward comes off the lines, and
     * the object takes its place there on the same pass, so what waited on the line is what lands on it.
     * @param {object} target - What the pointer has hold of, or nothing when it holds nothing.
     * @param {ConstrainerCallbackProperties} properties - The current solver pass.
     * @param {object[]} lines - The lines on the canvas.
     * @param {object[]} objects - Everything else the canvas holds, which is everything a line can pick up.
     * @protected
     */
    protected refreshFeedforward(target: object, properties: ConstrainerCallbackProperties, lines: object[], objects: object[]): void {
        //Wanted for something held over a line by a tool that would carry it off one, until the drag ends —
        //which is what commits, putting the object itself down where its feedforward was waiting.
        const wanted = objects.includes(target)
            && properties.eventType !== GradumEventName.dragEnd
            && this.feedforwardTools.includes(properties.toolName)
            && lines.some(line => this.overlaps(target, line));

        if (wanted) {
            const standing = this.feedforward;
            this.feedforwardOrigin = target;
            //Asking for it again on a later pass hands back the same copy, not a new one, and it takes
            //itself away when the pointer is released.
            this.feedforward = gradum(target).feedforward({removeOnPointerRelease: true, parent: target instanceof Element ? target.parentElement : undefined});
            //A copy coming back from an earlier stint on a line still sits where that stint left it. It
            //starts again on the object it stands for, so it is never seen at the old spot in the moment
            //before the line takes it over.
            if (!standing && "position" in this.feedforward && "position" in target)
                this.feedforward["position"] = target["position"];
            return;
        }

        if (!this.feedforward) return;
        for (const line of lines) gradum(line).getConstrainerObjectList().remove(this.feedforward);
        //Off the lists is not enough: nothing places it any more, so left in the page it would hang where it
        //last stood. The copy itself is kept — asking to feed it forward again puts this same one back.
        this.feedforward["remove"]?.();
        this.feedforward = undefined;
        this.feedforwardOrigin = undefined;
    }

    /**
     * @description Retrieve all elements from the object list that overlap on the screen with the given element.
     * @param {Element} element - The element to check overlaps for.
     * @param pool
     * @return {Element[]} - Array of overlapping elements.
     * @protected
     */
    protected findOverlaps(element: object, pool: object[] = Array.from(this.objectList)): object[] {
        const out: object[] = [];
        //For each element in the substrate's object list
        for (const el of pool) {
            //If it is the reference element --> continue.
            if (el === element) continue;
            //If it overlaps with the reference element --> add it to the out array.
            if (this.overlaps(el, element)) out.push(el);
        }
        return out;
    }

    /**
     * @description Find whether element 1 visually overlaps with element 2.
     * @param {Element} el1 - First element.
     * @param {Element} el2 - Second element.
     * @return Whether they overlap.
     * @protected
     */
    //Finds if element a overlaps with b
    protected overlaps(el1: object, el2: object): boolean {
        //Get bounding rects for each element.
        const r1 = el1["getBoundingClientRect"]?.();
        const r2 = el2["getBoundingClientRect"]?.();
        if (!r1 || !r2 || !(r1 instanceof DOMRect) || !(r2 instanceof DOMRect)) return false;

        if (r1 instanceof GradumRect) return r1.overlaps(r2);
        if (r2 instanceof GradumRect) return r2.overlaps(r1);

        //If any dimension is 0 or undefined --> return.
        if (!r1.width || !r1.height || !r2.width || !r2.height) return false;
        //Return true if any overlap is computed.
        return !(r1.right <= r2.left || r1.left >= r2.right || r1.bottom <= r2.top || r1.top >= r2.bottom);
    }
}
