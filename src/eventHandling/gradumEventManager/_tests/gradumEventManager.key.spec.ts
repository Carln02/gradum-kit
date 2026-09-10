import {describe, expect, it, vi} from "vitest";
import {GradumEventManager} from "../gradumEventManager";
import {ClickMode} from "../gradumEventManager.types";
import {$} from "../../../gradumFunctions/gradumFunctions";
import {GradumKeyEventName} from "../../../types/eventNaming.types";
import {GradumKeyEvent} from "../../events/gradumKeyEvent";
import {Point} from "../../../gradumComponents/datatypes/point/point";
import {GradumMap} from "../../../gradumComponents/datatypes/map/map";

describe("Key operator → GradumKeyEvent dispatch + mapping", () => {
    it("keydown → keyPressed; keyup → keyReleased; key mapping toggles ClickMode.key tool", () => {
        const mgr = GradumEventManager.create();
        const keyCtl = (mgr as any).keyOperator;

        const pressed = vi.fn();
        const released = vi.fn();
        document.addEventListener(GradumKeyEventName.keyPressed, pressed as any);
        document.addEventListener(GradumKeyEventName.keyReleased, released as any);

        // map 'b' key to 'brush' tool
        const tool = document.createElement("div");
        $(tool).makeTool("brush", {key: "b", manager: mgr});

        // key down fires event and selects 'brush' in key mode (via dispatchOperator)
        keyCtl.keyDown(new KeyboardEvent("keydown", { key: "b", bubbles: true }));
        expect(pressed).toHaveBeenCalledTimes(1);
        expect(mgr.getCurrentToolName(ClickMode.key)).toBe("brush");

        // key up fires release event and clears key mode tool
        keyCtl.keyUp(new KeyboardEvent("keyup", { key: "b", bubbles: true }));
        expect(released).toHaveBeenCalledTimes(1);
        expect(mgr.getCurrentToolName(ClickMode.key)).toBeUndefined();
    });
});

describe("a key event carries the pointer's last known position", () => {
    it("takes the position from where the manager last saw the pointer", () => {
        const mgr = GradumEventManager.create();
        mgr.model.positions = new GradumMap<number, Point>();
        mgr.model.positions.set(1, new Point(120, 45));

        const event = new GradumKeyEvent({
            eventName: GradumKeyEventName.keyPressed, keyPressed: "b", eventManager: mgr
        });

        expect(event.position).toEqual(new Point(120, 45));
    });

    it("keeps an explicitly given position", () => {
        const mgr = GradumEventManager.create();
        mgr.model.positions = new GradumMap<number, Point>();
        mgr.model.positions.set(1, new Point(120, 45));

        const event = new GradumKeyEvent({
            eventName: GradumKeyEventName.keyPressed, keyPressed: "b", eventManager: mgr,
            position: new Point(7, 8)
        });

        expect(event.position).toEqual(new Point(7, 8));
    });

    it("is null when the manager has not seen a pointer", () => {
        const mgr = GradumEventManager.create();
        mgr.model.positions = undefined;

        const event = new GradumKeyEvent({
            eventName: GradumKeyEventName.keyPressed, keyPressed: "b", eventManager: mgr
        });

        expect(event.position).toBeNull();
    });

    it("reaches the handler with the position on it", () => {
        const mgr = GradumEventManager.create();
        const keyCtl = (mgr as any).keyOperator;
        mgr.model.positions = new GradumMap<number, Point>();
        mgr.model.positions.set(1, new Point(300, 200));

        let seen: Point;
        const onPressed = (e: GradumKeyEvent) => {seen = e.position};
        document.addEventListener(GradumKeyEventName.keyPressed, onPressed as any);

        keyCtl.keyDown(new KeyboardEvent("keydown", {key: "q", bubbles: true}));
        document.removeEventListener(GradumKeyEventName.keyPressed, onPressed as any);

        expect(seen).toEqual(new Point(300, 200));
    });
});

describe("a key event is aimed where the pointer is", () => {
    it("dispatches at the hovered element, with the document still on the path", () => {
        const mgr = GradumEventManager.create();
        const keyCtl = (mgr as any).keyOperator;
        mgr.model.positions = new GradumMap<number, Point>();
        mgr.model.positions.set(1, new Point(40, 60));

        const hovered = document.createElement("div");
        document.body.appendChild(hovered);
        const fromPoint = vi.fn(() => hovered);
        (document as any).elementFromPoint = fromPoint;

        const onElement = vi.fn();
        const onDocument = vi.fn();
        hovered.addEventListener(GradumKeyEventName.keyPressed, onElement as any);
        document.addEventListener(GradumKeyEventName.keyPressed, onDocument as any);

        keyCtl.keyDown(new KeyboardEvent("keydown", {key: "j", bubbles: true}));

        expect(fromPoint).toHaveBeenCalledWith(40, 60);
        expect(onElement).toHaveBeenCalledTimes(1);
        //Bound to the document as before, and still reached: the element is a descendant of it.
        expect(onDocument).toHaveBeenCalledTimes(1);

        document.removeEventListener(GradumKeyEventName.keyPressed, onDocument as any);
        hovered.remove();
        delete (document as any).elementFromPoint;
    });

    it("falls back to the document when nothing is under the pointer", () => {
        const mgr = GradumEventManager.create();
        const keyCtl = (mgr as any).keyOperator;
        mgr.model.positions = undefined;

        const onDocument = vi.fn();
        document.addEventListener(GradumKeyEventName.keyPressed, onDocument as any);
        keyCtl.keyDown(new KeyboardEvent("keydown", {key: "k", bubbles: true}));
        document.removeEventListener(GradumKeyEventName.keyPressed, onDocument as any);

        expect(onDocument).toHaveBeenCalledTimes(1);
    });
});

describe("a held key repeats", () => {
    it("fires every repeat, marks them, and keeps the held-keys list free of duplicates", () => {
        const mgr = GradumEventManager.create();
        const keyCtl = (mgr as any).keyOperator;

        const seen: boolean[] = [];
        const onPressed = (e: GradumKeyEvent) => seen.push(e.repeat);
        document.addEventListener(GradumKeyEventName.keyPressed, onPressed as any);

        keyCtl.keyDown(new KeyboardEvent("keydown", {key: "ArrowRight", bubbles: true}));
        keyCtl.keyDown(new KeyboardEvent("keydown", {key: "ArrowRight", bubbles: true}));
        keyCtl.keyDown(new KeyboardEvent("keydown", {key: "ArrowRight", bubbles: true}));
        document.removeEventListener(GradumKeyEventName.keyPressed, onPressed as any);

        expect(seen).toEqual([false, true, true]);
        expect(mgr.model.currentKeys.filter(key => key === "ArrowRight").length).toBe(1);

        keyCtl.keyUp(new KeyboardEvent("keyup", {key: "ArrowRight", bubbles: true}));
    });

    it("marks a release as no repeat", () => {
        const mgr = GradumEventManager.create();
        const keyCtl = (mgr as any).keyOperator;

        let released: GradumKeyEvent;
        const onReleased = (e: GradumKeyEvent) => {released = e};
        document.addEventListener(GradumKeyEventName.keyReleased, onReleased as any);

        keyCtl.keyDown(new KeyboardEvent("keydown", {key: "x", bubbles: true}));
        keyCtl.keyUp(new KeyboardEvent("keyup", {key: "x", bubbles: true}));
        document.removeEventListener(GradumKeyEventName.keyReleased, onReleased as any);

        expect(released.repeat).toBe(false);
    });
});

describe("preventing a key event's default reaches the browser", () => {
    it("carries preventDefault back to the native key event", () => {
        const mgr = GradumEventManager.create();
        const keyCtl = (mgr as any).keyOperator;

        const prevent = (e: GradumKeyEvent) => e.preventDefault();
        document.addEventListener(GradumKeyEventName.keyPressed, prevent as any);

        const native = new KeyboardEvent("keydown", {key: " ", bubbles: true, cancelable: true});
        keyCtl.keyDown(native);
        document.removeEventListener(GradumKeyEventName.keyPressed, prevent as any);

        expect(native.defaultPrevented).toBe(true);
        keyCtl.keyUp(new KeyboardEvent("keyup", {key: " ", bubbles: true}));
    });

    it("leaves the native event alone when no handler prevents it", () => {
        const mgr = GradumEventManager.create();
        const keyCtl = (mgr as any).keyOperator;

        const native = new KeyboardEvent("keydown", {key: "z", bubbles: true, cancelable: true});
        keyCtl.keyDown(native);

        expect(native.defaultPrevented).toBe(false);
        keyCtl.keyUp(new KeyboardEvent("keyup", {key: "z", bubbles: true}));
    });
});

describe("the keys an event carries are the keys held when it fired", () => {
    it("does not change as keys are pressed and released afterwards", () => {
        const mgr = GradumEventManager.create();
        const keyCtl = (mgr as any).keyOperator;

        let captured: GradumKeyEvent;
        const onPressed = (e: GradumKeyEvent) => {captured ??= e};
        document.addEventListener(GradumKeyEventName.keyPressed, onPressed as any);

        keyCtl.keyDown(new KeyboardEvent("keydown", {key: "Shift", bubbles: true}));
        const atFireTime = [...captured.keys];

        keyCtl.keyDown(new KeyboardEvent("keydown", {key: "Control", bubbles: true}));
        keyCtl.keyUp(new KeyboardEvent("keyup", {key: "Shift", bubbles: true}));
        document.removeEventListener(GradumKeyEventName.keyPressed, onPressed as any);

        expect(captured.keys).toEqual(atFireTime);
        expect(captured.keys).toContain("Shift");
        expect(captured.keys).not.toContain("Control");

        keyCtl.keyUp(new KeyboardEvent("keyup", {key: "Control", bubbles: true}));
    });
});

