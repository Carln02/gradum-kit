import {describe, it, expect, beforeAll} from "vitest";
import {GradumDrawer} from "../drawer";
import {Side} from "../../../../types/enums.types";

beforeAll(() => {
    (globalThis as any).ResizeObserver ??= class {
        observe() {} unobserve() {} disconnect() {}
    };
});

/**
 * `setupUILayout` reads `thumb` and `panel`, which are created on first access and whose setters call
 * `setupUILayout` again. The nested run used to finish by pointing `childHandler` at the panel, so when
 * the outer run resumed it appended the panelContainer *into* the panel — a cycle
 * (HierarchyRequestError) that aborted the rest and left the thumb detached.
 */
describe("GradumDrawer layout", () => {
    it("builds the full tree without re-entering itself", () => {
        const d: any = GradumDrawer.create({side: Side.bottom, hideOverflow: true} as any);

        expect(d.panelContainer.parentElement).toBe(d);
        expect(d.thumb.parentElement).toBe(d);
        expect(d.panel.parentElement).toBe(d.panelContainer);
    });

    it("never nests the panel and its container", () => {
        const d: any = GradumDrawer.create({side: Side.bottom} as any);

        expect(d.panel.contains(d.panelContainer)).toBe(false);
        expect(d.panelContainer.contains(d.panel)).toBe(true);
    });

    it("keeps the thumb out of the panel", () => {
        const d: any = GradumDrawer.create({side: Side.top} as any);

        expect(d.panel.contains(d.thumb)).toBe(false);
    });

    it("survives a re-layout triggered by assigning panel", () => {
        const d: any = GradumDrawer.create({side: Side.bottom} as any);
        d.panel = undefined;

        expect(d.panel.parentElement).toBe(d.panelContainer);
        expect(d.thumb.parentElement).toBe(d);
    });
});
