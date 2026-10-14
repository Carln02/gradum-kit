import {describe, it, expect, vi, beforeAll, beforeEach, afterEach} from "vitest";
import {GradumDrawer} from "../drawer";
import {Side} from "../../../../types/enums.types";
import {div} from "../../../../elementCreation/basicElements";

beforeAll(() => {
    (globalThis as any).ResizeObserver ??= class {
        observe() {} unobserve() {} disconnect() {}
    };
});

/**
 * A drawer's position was only ever written by something *changing*: the `side`, `open` and `dragging`
 * paths. At construction nothing changes — a closed drawer is `open === false` from the moment it exists,
 * so `initialize`'s `open = false` was dropped as unchanged and `refresh` never ran. With `hideOverflow`
 * on, where closed means the panel container collapsed to `translation` pixels, that left the container at
 * the panel's natural size: the drawer stood fully open while reporting `open === false`, and the first
 * click on it only set `open` to the `true` it already looked like.
 */
describe("a drawer takes up its position as it is built", () => {
    const panelOf = (size: number) => {
        const panel = div();
        Object.defineProperty(panel, "offsetWidth", {get: () => size, configurable: true});
        Object.defineProperty(panel, "offsetHeight", {get: () => size, configurable: true});
        return panel;
    };

    it("collapses the panel container of a drawer built closed", () => {
        const drawer = GradumDrawer.create({parent: document.body, side: Side.left,
            hideOverflow: true, panel: panelOf(120)}) as GradumDrawer;

        expect(drawer.open).toBe(false);
        expect(drawer.panelContainer.style.width).toBe("0px");
    });

    it("collapses it to the closed offset rather than to nothing", () => {
        const drawer = GradumDrawer.create({parent: document.body, side: Side.left, hideOverflow: true,
            offset: {open: 12, closed: 8}, panel: panelOf(120)}) as GradumDrawer;

        expect(drawer.panelContainer.style.width).toBe("8px");
    });

    it("reports the position it is standing in", () => {
        const drawer = GradumDrawer.create({parent: document.body, side: Side.bottom, hideOverflow: true,
            offset: {open: 12, closed: 0}, panel: panelOf(100)}) as GradumDrawer;

        expect(drawer.translation).toBe(0);
        expect(drawer.panelContainer.style.height).toBe(drawer.translation + "px");
    });

    it("stands open when it is built open", () => {
        const drawer = GradumDrawer.create({parent: document.body, side: Side.left, hideOverflow: true,
            offset: {open: 12, closed: 0}, open: true, panel: panelOf(120)}) as GradumDrawer;

        expect(drawer.open).toBe(true);
        expect(drawer.translation).toBe(132);
        expect(drawer.panelContainer.style.width).toBe("132px");
    });

    //A drawer is often built before it has anywhere to be. There is nothing to measure while it is
    //detached — the panel's offset size is 0 — so an open one would lay itself out collapsed and, with
    //nothing else to change, stay that way.
    it("measures the panel once the drawer is in the document", () => {
        const panel = div();
        Object.defineProperty(panel, "offsetWidth", {
            get(this: HTMLElement) {return this.isConnected ? 120 : 0}, configurable: true
        });
        const drawer = GradumDrawer.create({side: Side.left, hideOverflow: true,
            offset: {open: 12, closed: 0}, open: true, panel}) as GradumDrawer;
        expect(drawer.translation).toBe(12);

        document.body.appendChild(drawer);

        expect(drawer.translation).toBe(132);
        expect(drawer.panelContainer.style.width).toBe("132px");
    });

    //Written as it is built rather than on the next frame: a drawer in a backgrounded tab, whose frame
    //never comes, still has to be standing where it says it is.
    it("writes the position without waiting for a frame", () => {
        const frames: FrameRequestCallback[] = [];
        const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
            frames.push(cb);
            return 0;
        });

        try {
            const drawer = GradumDrawer.create({parent: document.body, side: Side.left,
                hideOverflow: true, offset: 10, panel: panelOf(120)}) as GradumDrawer;

            expect(drawer.panelContainer.style.width).toBe("10px");
        } finally {
            raf.mockRestore();
        }
    });

    it("transforms a drawer built without clipping instead of sizing its container", () => {
        const drawer = GradumDrawer.create({parent: document.body, side: Side.left,
            offset: {open: 0, closed: 20}, panel: panelOf(120)}) as GradumDrawer;

        expect(drawer.style.transform).toBe("translateX(-20px)");
        expect(drawer.panelContainer.style.width).toBe("");
    });
});

/**
 * The position is carried by a different style depending on `hideOverflow` and on which axis `side` opens
 * along, but `translation` only ever held the number. Switching either left the old style in place and
 * wrote nothing new when the number happened to come out the same — the drawer stayed where the old mode
 * had put it.
 */
describe("a drawer moves its position to the style that now carries it", () => {
    const openDrawer = (properties: object = {}) => {
        const panel = div();
        Object.defineProperty(panel, "offsetWidth", {get: () => 120, configurable: true});
        Object.defineProperty(panel, "offsetHeight", {get: () => 100, configurable: true});
        return GradumDrawer.create({parent: document.body, open: true, offset: 0,
            panel, ...properties}) as GradumDrawer;
    };

    it("hands the position from the transform to the container size", () => {
        const drawer = openDrawer({side: Side.left, hideOverflow: false});
        expect(drawer.style.transform).toBe("translateX(-120px)");

        drawer.hideOverflow = true;

        expect(drawer.panelContainer.style.width).toBe("120px");
        expect(drawer.style.transform).toBe("");
    });

    it("hands it back from the container size to the transform", () => {
        const drawer = openDrawer({side: Side.left, hideOverflow: true});
        expect(drawer.panelContainer.style.width).toBe("120px");

        drawer.hideOverflow = false;

        expect(drawer.style.transform).toBe("translateX(-120px)");
        expect(drawer.panelContainer.style.width).toBe("");
    });

    it("clears the size on the axis it no longer opens along", () => {
        const drawer = openDrawer({side: Side.bottom, hideOverflow: true});
        expect(drawer.panelContainer.style.height).toBe("100px");

        drawer.side = Side.left;

        expect(drawer.panelContainer.style.width).toBe("120px");
        expect(drawer.panelContainer.style.height).toBe("");
    });

    it("transforms along the axis it moved to", () => {
        const drawer = openDrawer({side: Side.bottom, hideOverflow: false});
        expect(drawer.style.transform).toBe("translateY(-100px)");

        drawer.side = Side.right;

        expect(drawer.style.transform).toBe("translateX(-120px)");
    });
});

/**
 * `thumb` and `panel` took the element they were replacing off the drawer with `remChild`, which goes
 * through `childHandler` — and the drawer points that at its panel once the layout is up. So the removal
 * asked the panel to remove a node that was never its child, failed, and left the replaced element
 * attached: a second panel in the container for the drawer to measure around, and a replaced thumb that
 * `setupUILayout` then collected as loose content and moved into the panel.
 */
describe("replacing a drawer's parts lets go of the old ones", () => {
    it("leaves one panel in the container", () => {
        const drawer = GradumDrawer.create({parent: document.body, side: Side.left,
            hideOverflow: true, panel: div({id: "first"})}) as GradumDrawer;

        drawer.panel = div({id: "second"});

        expect([...drawer.panelContainer.children].map(child => child.id)).toEqual(["second"]);
    });

    it("does not bury the replaced thumb in the panel", () => {
        const drawer = GradumDrawer.create({parent: document.body, side: Side.left,
            thumb: div({id: "first"})}) as GradumDrawer;

        drawer.thumb = div({id: "second"});

        expect(drawer.panel.childElementCount).toBe(0);
        expect([...drawer.children].map(child => child.id || child.className))
            .toEqual(["second", "gradum-drawer-panel-container"]);
    });
});
