import {describe, it, expect, vi, beforeEach} from "vitest";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {div} from "../../../elementCreation/basicElements";
import {GradumEvent} from "../../events/gradumEvent";
import {GradumEventManager} from "../gradumEventManager";
import {GradumEventName} from "../../../types/eventNaming.types";
import {Point} from "../../../gradumComponents/datatypes/point/point";
import {Propagation} from "../../../gradumFunctions/event/event.types";
import {ClosestOrigin} from "../../events/gradumEvent.types";

//A thing painted inside the canvas. Deliberately not a Node, and deliberately without a bounding rect —
//that is the whole point of the feature.
class Shape {
    public constructor(public readonly name: string) {}
}

//Dispatches through the manager's own two-pass walk by firing a real event at the element.
function dispatch(target: Node, position: Point, eventName = GradumEventName.click) {
    GradumEventManager.instance.setupCustomDispatcher?.(eventName);
    const event = new GradumEvent({eventName, position, eventInitDict: {bubbles: true, composed: true}});
    target.dispatchEvent(event);
    return event;
}

describe("hit resolvers contribute dispatch targets", () => {
    let canvas: HTMLElement;
    let outer: HTMLElement;

    beforeEach(() => {
        gradum().clearToolBehaviors();
        outer = div({id: "outer", parent: document.body});
        canvas = div({id: "canvas", parent: outer});
    });

    it("leaves dispatch untouched when nothing declares a resolver", () => {
        const seen: string[] = [];
        //Compared entry by entry inside the dispatch, while composedPath() is still populated. Identity
        //rather than deep equality: these arrays hold window and document, which toEqual cannot walk.
        let samePath: boolean;
        gradum(canvas).on(GradumEventName.click, (e: any) => {
            const composed = e.composedPath();
            samePath = e.dispatchPath.length === composed.length
                && e.dispatchPath.every((entry: object, i: number) => entry === composed[i]);
            seen.push("canvas");
            return Propagation.propagate;
        });
        gradum(outer).on(GradumEventName.click, () => {seen.push("outer"); return Propagation.propagate});

        const event = dispatch(canvas, new Point(10, 10));

        expect(seen).toEqual(["canvas", "outer"]);
        expect(event.hits).toEqual([]);
        expect(event.hitTarget).toBe(canvas);
        expect(samePath).toBe(true);
    });

    it("dispatches to hits before their container on the bubble pass", () => {
        const top = new Shape("top"), below = new Shape("below");
        gradum(canvas).hitResolver = () => [top, below];

        const seen: string[] = [];
        gradum(top).on(GradumEventName.click, () => {seen.push("top"); return Propagation.propagate});
        gradum(below).on(GradumEventName.click, () => {seen.push("below"); return Propagation.propagate});
        gradum(canvas).on(GradumEventName.click, () => {seen.push("canvas"); return Propagation.propagate});
        gradum(outer).on(GradumEventName.click, () => {seen.push("outer"); return Propagation.propagate});

        dispatch(canvas, new Point(10, 10));

        //Innermost first, and the hits count as deeper than the element that drew them.
        expect(seen).toEqual(["top", "below", "canvas", "outer"]);
    });

    it("lets a hit consume the event before the container sees it", () => {
        const shape = new Shape("shape");
        gradum(canvas).hitResolver = () => [shape];

        const onCanvas = vi.fn().mockReturnValue(Propagation.propagate);
        gradum(shape).on(GradumEventName.click, () => Propagation.stopPropagation);
        gradum(canvas).on(GradumEventName.click, onCanvas);

        dispatch(canvas, new Point(10, 10));

        expect(onCanvas).not.toHaveBeenCalled();
    });

    it("records the expansion on the event", () => {
        const shape = new Shape("shape");
        gradum(canvas).hitResolver = () => [shape];

        const event = dispatch(canvas, new Point(10, 10));

        expect(event.hits).toEqual([shape]);
        expect(event.hitTarget).toBe(shape);
        //The hit sits immediately ahead of the element that reported it.
        expect(event.dispatchPath[0]).toBe(shape);
        expect(event.dispatchPath[1]).toBe(canvas);
    });

    it("passes the event position to the resolver", () => {
        const resolver = vi.fn().mockReturnValue([]);
        gradum(canvas).hitResolver = resolver;

        dispatch(canvas, new Point(42, 99));

        expect(resolver.mock.calls[0][0]).toEqual(new Point(42, 99));
    });

    it("never dispatches to window, which is in the path and is not a Node", () => {
        gradum(canvas).hitResolver = () => [new Shape("s")];
        const event = dispatch(canvas, new Point(10, 10));
        expect(event.dispatchPath).not.toContain(window);
    });
});

describe("hit targets and the parent chain", () => {
    let canvas: HTMLElement;

    beforeEach(() => {
        canvas = div({id: "canvas2", parent: document.body});
    });

    it("gives each hit its container as parent", () => {
        const shape = new Shape("shape");
        gradum(canvas).hitResolver = () => [shape];

        dispatch(canvas, new Point(10, 10));

        expect(gradum(shape).hitParent).toBe(canvas);
    });

    it("does not overwrite a parent the object already declares", () => {
        const group = new Shape("group"), shape = new Shape("shape");
        gradum(shape).hitParent = group;
        gradum(canvas).hitResolver = () => [shape];

        dispatch(canvas, new Point(10, 10));

        expect(gradum(shape).hitParent).toBe(group);
    });

    it("keeps parentage on the object itself when it carries an `element` field", () => {
        //gradum() unwraps any object with an object-valued `element` — correct for an MVC piece, wrong for a
        //scene object that happens to use the name. The hit path wraps raw so the two can't be confused.
        const shape: any = new Shape("shape");
        shape.element = {not: "a dom node"};
        gradum(canvas).hitResolver = () => [shape];

        dispatch(canvas, new Point(10, 10));

        expect(gradum(shape, true).hitParent).toBe(canvas);
        expect(gradum(shape.element, true).hitParent).toBeUndefined();
    });

    it("holds the parent weakly", () => {
        const shape = new Shape("shape");
        gradum(shape).hitParent = canvas;
        expect(gradum(shape).hitParent).toBe(canvas);
        gradum(shape).hitParent = undefined;
        expect(gradum(shape).hitParent).toBeUndefined();
    });
});

describe("closest() over hit targets", () => {
    class Scene extends HTMLElement {}
    if (!customElements.get("test-scene")) customElements.define("test-scene", Scene);

    let scene: Scene;

    beforeEach(() => {
        scene = document.createElement("test-scene") as Scene;
        document.body.appendChild(scene);
    });

    it("finds a hit target itself, with no bounding rect involved", () => {
        const shape = new Shape("shape");
        gradum(scene).hitResolver = () => [shape];

        const event = dispatch(scene, new Point(10, 10));

        expect(event.closest(Shape as any)).toBe(shape);
    });

    it("climbs out of the scene to the element that drew it", () => {
        const shape = new Shape("shape");
        gradum(scene).hitResolver = () => [shape];

        const event = dispatch(scene, new Point(10, 10));

        //Reaching Scene from a virtual object is only possible through hitParent.
        expect(event.closest(Scene, false)).toBe(scene);
    });

    it("still resolves to the element when nothing was hit", () => {
        const event = dispatch(scene, new Point(10, 10));
        expect(event.closest(Scene, false)).toBe(scene);
    });
});
