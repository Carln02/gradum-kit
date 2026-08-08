import { describe, it, expect, vi } from "vitest";
import {GradumEventManager} from "../gradumEventManager";
import {GradumEventName} from "../../../types/eventNaming.types";

function patchElementFromPoint(target: Element) {
    const orig = document.elementFromPoint;
    document.elementFromPoint = () => target;
    return () => (document.elementFromPoint = orig);
}

describe("Pointer operator → GradumEvent/GradumDragEvent dispatch", () => {
    it("clickStart → longPress (after timeout) → clickEnd sequence", () => {
        const mgr = GradumEventManager.create({ longPressDuration: 100 });
        const ptr = (mgr as any).pointerOperator;

        const target = document.createElement("div");
        document.body.appendChild(target);
        const restore = patchElementFromPoint(target);

        const start = vi.fn();
        const longp = vi.fn();
        const end = vi.fn();

        target.addEventListener(GradumEventName.clickStart, start as any);
        target.addEventListener(GradumEventName.longPress, longp as any);
        target.addEventListener(GradumEventName.clickEnd, end as any);

        vi.useFakeTimers();

        // down at (10,10)
        ptr.pointerDown(new MouseEvent("mousedown", { clientX: 10, clientY: 10, bubbles: true }));
        expect(start).toHaveBeenCalledTimes(1);

        // wait past longPress
        vi.advanceTimersByTime(110);
        expect(longp).toHaveBeenCalledTimes(1);

        // release → clickEnd (no "click", since action became longPress)
        ptr.pointerUp(new MouseEvent("mouseup", { clientX: 10, clientY: 10, bubbles: true }));
        expect(end).toHaveBeenCalledTimes(1);

        vi.useRealTimers();
        restore();
    });

    it("dragStart/drag/dragEnd when movement exceeds threshold; move events fire too", () => {
        const mgr = GradumEventManager.create({ moveThreshold: 10 });
        const ptr = (mgr as any).pointerOperator;

        const origin = document.createElement("div");
        document.body.appendChild(origin);
        const restore = patchElementFromPoint(origin);

        const move = vi.fn();
        const dstart = vi.fn();
        const dmove = vi.fn();
        const dend = vi.fn();

        origin.addEventListener(GradumEventName.move, move as any);
        origin.addEventListener(GradumEventName.dragStart, dstart as any);
        origin.addEventListener(GradumEventName.drag, dmove as any);
        origin.addEventListener(GradumEventName.dragEnd, dend as any);

        // pointer down at (0,0)
        ptr.pointerDown(new MouseEvent("mousedown", { clientX: 0, clientY: 0, bubbles: true }));

        // small move (under threshold) → only move
        ptr.pointerMove(new MouseEvent("mousemove", { clientX: 5, clientY: 0, bubbles: true }));
        expect(move).toHaveBeenCalledTimes(1);
        expect(dstart).toHaveBeenCalledTimes(0);

        // exceed threshold → dragStart then drag
        ptr.pointerMove(new MouseEvent("mousemove", { clientX: 20, clientY: 0, bubbles: true }));
        expect(dstart).toHaveBeenCalledTimes(1);
        expect(dmove).toHaveBeenCalledTimes(1);

        // more drag
        ptr.pointerMove(new MouseEvent("mousemove", { clientX: 30, clientY: 5, bubbles: true }));
        expect(dmove).toHaveBeenCalledTimes(2);

        // release → dragEnd + clickEnd (clickEnd always fires)
        ptr.pointerUp(new MouseEvent("mouseup", { clientX: 30, clientY: 5, bubbles: true }));
        expect(dend).toHaveBeenCalledTimes(1);

        restore();
    });

    it("disabling dragEventEnabled prevents dragStart/drag/dragEnd", () => {
        const mgr = GradumEventManager.create({ moveThreshold: 5 });
        const ptr = (mgr as any).pointerOperator;

        mgr.dragEventsEnabled = false;

        const target = document.createElement("div");
        document.body.appendChild(target);
        const restore = patchElementFromPoint(target);

        const dstart = vi.fn();
        const dmove = vi.fn();
        const dend = vi.fn();

        target.addEventListener(GradumEventName.dragStart, dstart as any);
        target.addEventListener(GradumEventName.drag, dmove as any);
        target.addEventListener(GradumEventName.dragEnd, dend as any);

        ptr.pointerDown(new MouseEvent("mousedown", { clientX: 0, clientY: 0, bubbles: true }));
        ptr.pointerMove(new MouseEvent("mousemove", { clientX: 100, clientY: 0, bubbles: true }));
        ptr.pointerUp(new MouseEvent("mouseup", { clientX: 100, clientY: 0, bubbles: true }));

        expect(dstart).toHaveBeenCalledTimes(0);
        expect(dmove).toHaveBeenCalledTimes(0);
        expect(dend).toHaveBeenCalledTimes(0);

        restore();
    });
});