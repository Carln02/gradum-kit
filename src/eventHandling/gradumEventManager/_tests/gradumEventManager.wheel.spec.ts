import { describe, it, expect, vi } from "vitest";
import {GradumEventManager} from "../gradumEventManager";
import {GradumEventName} from "../../../types/eventNaming.types";
import {GradumWheelEvent} from "../../events/gradumWheelEvent";
import {Point} from "../../../gradumComponents/datatypes/point/point";

describe("Wheel operator → GradumWheelEvent dispatch", () => {
    it("emits scroll for small delta; still scroll after timeout (mouse also emits scroll)", () => {
        const mgr = GradumEventManager.create();
        const wheelCtl = (mgr as any).wheelOperator;

        const scrollSpy = vi.fn();
        document.addEventListener(GradumEventName.scroll, scrollSpy as any);

        vi.useFakeTimers();

        // small delta → trackpad scroll
        wheelCtl.wheel(new WheelEvent("wheel", { deltaY: 20, deltaX: 0, ctrlKey: false }));
        expect(scrollSpy).toHaveBeenCalledTimes(1);

        // big delta immediately after still counts as recently trackpad → stays scroll
        wheelCtl.wheel(new WheelEvent("wheel", { deltaY: 200, deltaX: 0 }));
        expect(scrollSpy).toHaveBeenCalledTimes(2);

        // advance 800ms to clear "recently trackpad" and emit big-delta again → mouse scroll
        vi.advanceTimersByTime(800);
        wheelCtl.wheel(new WheelEvent("wheel", { deltaY: 200, deltaX: 0 }));
        expect(scrollSpy).toHaveBeenCalledTimes(3);

        vi.useRealTimers();
    });

    it("emits pinch when ctrlKey is true on trackpad", () => {
        const mgr = GradumEventManager.create();
        const wheelCtl = (mgr as any).wheelOperator;

        const pinchSpy = vi.fn();
        document.addEventListener(GradumEventName.pinch, pinchSpy as any);

        // small delta with ctrl key → pinch
        wheelCtl.wheel(new WheelEvent("wheel", { deltaY: 5, ctrlKey: true }));
        expect(pinchSpy).toHaveBeenCalledTimes(1);
    });
});

describe("a wheel event carries where it happened", () => {
    it("takes its position from the native wheel event", () => {
        const mgr = GradumEventManager.create();
        const wheelCtl = (mgr as any).wheelOperator;

        let seen: Point;
        const onScroll = (e: GradumWheelEvent) => {seen = e.position};
        document.addEventListener(GradumEventName.scroll, onScroll as any);

        wheelCtl.wheel(new WheelEvent("wheel", {deltaY: 20, clientX: 55, clientY: 90}));
        document.removeEventListener(GradumEventName.scroll, onScroll as any);

        expect(seen).toEqual(new Point(55, 90));
    });

    it("carries preventDefault back to the native wheel event", () => {
        const mgr = GradumEventManager.create();
        mgr.preventDefaultWheel = false;
        const wheelCtl = (mgr as any).wheelOperator;

        const prevent = (e: GradumWheelEvent) => e.preventDefault();
        document.addEventListener(GradumEventName.scroll, prevent as any);

        const native = new WheelEvent("wheel", {deltaY: 20, cancelable: true});
        wheelCtl.wheel(native);
        document.removeEventListener(GradumEventName.scroll, prevent as any);

        expect(native.defaultPrevented).toBe(true);
    });
});

