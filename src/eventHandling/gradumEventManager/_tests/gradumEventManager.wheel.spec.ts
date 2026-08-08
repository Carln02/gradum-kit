import { describe, it, expect, vi } from "vitest";
import {GradumEventManager} from "../gradumEventManager";
import {GradumEventName} from "../../../types/eventNaming.types";

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
