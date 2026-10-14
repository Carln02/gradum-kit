import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {GradumSelectWheel} from "../selectWheel";

//The wheel sizes itself to its entries, but only re-measured on entry added, entry removed, drag start and
//open. An entry's *content* changing is none of those, and `reloadEntrySizes` was `protected` — so a
//renamed entry kept the width it had when it was created, and there was no clean way to say so.
describe("a wheel can be told, or can tell, that an entry's content changed", () => {
    const frames: FrameRequestCallback[] = [];
    let raf: ReturnType<typeof vi.spyOn>;
    let observers: {callback: ResizeObserverCallback, targets: Element[]}[];

    const flush = () => {
        const queued = [...frames];
        frames.length = 0;
        queued.forEach(cb => cb(0));
    };

    beforeEach(() => {
        frames.length = 0;
        observers = [];
        raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation(cb => frames.push(cb));
        //jsdom has no ResizeObserver; this one records what is watched and lets a resize be acted out.
        (globalThis as any).ResizeObserver = class {
            public targets: Element[] = [];
            constructor(public callback: ResizeObserverCallback) {
                observers.push(this as any);
            }
            observe(target: Element) {this.targets.push(target);}
            unobserve(target: Element) {
                const at = this.targets.indexOf(target);
                if (at >= 0) this.targets.splice(at, 1);
            }
            disconnect() {this.targets.length = 0;}
        };
    });

    afterEach(() => {
        raf.mockRestore();
        delete (globalThis as any).ResizeObserver;
    });

    const wheelOf = (values: string[]) => {
        const wheel = GradumSelectWheel.create({}) as GradumSelectWheel<string>;
        document.body.appendChild(wheel as unknown as Node);
        wheel.values = values;
        //Given a width each: jsdom lays everything out as zero, and a wheel that measures zero books a
        //retry every frame forever, which would hide whether anything else booked one.
        wheel.entries.forEach(entry =>
            Object.defineProperty(entry, "offsetWidth", {get: () => 40, configurable: true}));
        return wheel;
    };
    const watched = () => observers.flatMap(o => o.targets);

    it("exposes the re-measure, so it need not be reached through a cast", () => {
        const wheel = wheelOf(["A"]);
        expect(typeof wheel.reloadEntrySizes).toBe("function");
        expect(typeof wheel.scheduleReloadEntrySizes).toBe("function");
    });

    it("watches each entry it is given", () => {
        const wheel = wheelOf(["A", "B"]);
        expect(watched()).toEqual(expect.arrayContaining(wheel.entries as any));
    });

    it("re-measures when an entry changes size", () => {
        const wheel = wheelOf(["A"]);
        flush(); flush();                       //drained: entries measure non-zero, so nothing retries
        expect(observers.length).toBeGreaterThan(0);

        //Counted rather than looking at the frame queue: applying the entry styles books frames of its
        //own, and those do not re-measure.
        const reload = vi.spyOn(wheel, "reloadEntrySizes");
        expect(reload).not.toHaveBeenCalled();

        //An entry renamed: its box changes, and nothing else announces it.
        observers.forEach(o => o.callback([] as any, null as any));
        flush();

        expect(reload).toHaveBeenCalledTimes(1);
    });

    it("stops watching an entry it no longer has", () => {
        const wheel = wheelOf(["A", "B"]);
        const removed = wheel.entries[0];
        expect(watched()).toContain(removed);

        wheel.select.removeEntry(removed as any);

        expect(watched()).not.toContain(removed);
        expect(watched()).toContain(wheel.entries[0]);
    });

    it("stops watching everything once destroyed", () => {
        const wheel = wheelOf(["A", "B"]);
        expect(watched().length).toBe(2);

        wheel.destroy();

        expect(watched()).toEqual([]);
    });
});
