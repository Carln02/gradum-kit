import {describe, it, expect, vi, beforeAll, beforeEach, afterEach} from "vitest";
import {GradumDrawer} from "../drawer";
import {Side} from "../../../../types/enums.types";
import {div} from "../../../../elementCreation/basicElements";

beforeAll(() => {
    (globalThis as any).ResizeObserver ??= class {
        observe() {} unobserve() {} disconnect() {}
    };
});

//`refresh()` took the panel out of flow and only put it back on the *next* frame. One call was invisible;
//overlapping calls were not — each took it out again and booked its own restore, so a panel resizing
//during a gesture flickered for the whole gesture. A backgrounded tab, whose frame never comes, left the
//panel out of flow indefinitely.
describe("refresh is safe to call at interactive rates", () => {
    const frames: FrameRequestCallback[] = [];
    let raf: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        frames.length = 0;
        raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation(cb => frames.push(cb));
    });
    afterEach(() => raf.mockRestore());

    const drawerOf = (panelSize: number = 120) => {
        const drawer = GradumDrawer.create({parent: document.body, side: Side.left,
            hideOverflow: true, panel: div()}) as GradumDrawer;
        Object.defineProperty(drawer.panel, "offsetWidth", {get: () => panelSize, configurable: true});
        return drawer;
    };

    it("leaves the panel in flow once it returns", () => {
        const drawer = drawerOf();

        drawer.refresh();

        expect(drawer.panel.style.position).not.toBe("absolute");
    });

    it("leaves it in flow after overlapping calls, with no frame in between", () => {
        const drawer = drawerOf();

        for (let call = 0; call < 10; call++) drawer.refresh();

        //No frame has run at this point: the panel used to be sitting out of flow waiting for one.
        expect(drawer.panel.style.position).not.toBe("absolute");
    });

    it("leaves it in flow even if no frame ever comes", () => {
        const drawer = drawerOf();
        drawer.open = true;

        drawer.refresh();
        frames.length = 0;    //a backgrounded tab: the frame never arrives

        expect(drawer.panel.style.position).not.toBe("absolute");
    });

    it("settles the translation within the call rather than a frame later", () => {
        const drawer = drawerOf(120);
        drawer.open = true;

        drawer.refresh();

        expect(drawer.translation).toBe(120);
    });

    it("follows the panel's size as it changes", () => {
        const drawer = drawerOf(120);
        drawer.open = true;
        drawer.refresh();
        expect(drawer.translation).toBe(120);

        Object.defineProperty(drawer.panel, "offsetWidth", {get: () => 260, configurable: true});
        drawer.refresh();

        expect(drawer.translation).toBe(260);
    });

    it("takes the panel out of flow only to measure it, and only when clipping", () => {
        const drawer = drawerOf(120);
        drawer.open = true;
        const seen: string[] = [];
        Object.defineProperty(drawer.panel, "offsetWidth", {
            get() {seen.push(this.style.position); return 120;}, configurable: true
        });

        drawer.refresh();
        expect(seen).toEqual(["absolute"]);

        //Without clipping the panel is not shrunk to fit, so there is nothing to measure around.
        drawer.hideOverflow = false;
        seen.length = 0;
        drawer.translation = 0;
        drawer.refresh();
        expect(seen).toHaveLength(1);
        expect(seen[0]).not.toBe("absolute");
    });
});
