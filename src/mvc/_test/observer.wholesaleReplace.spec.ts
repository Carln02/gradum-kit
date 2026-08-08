import {describe, it, expect} from "vitest";
import {GradumModel} from "../model/model";
import {GradumYModel} from "../model/yModel";

// Regression: re-assigning model data wholesale with equivalent content must be a no-op
// for observer values — not a teardown. (VideoClipper timeline bug, 2026-07-08.)
describe("GradumObserver — wholesale data replacement", () => {
    function setup(ModelCtor: typeof GradumModel = GradumModel) {
        const model = new ModelCtor({data: {}});
        const events: string[] = [];
        const observer = model.generateObserver({
            onAdded: (data: any) => {
                events.push(`added:${data}`);
                return {resolved: data};
            },
            onUpdated: (data: any) => { events.push(`updated:${data}`); },
            onDeleted: (data: any, instance: any, self: any, ...keys: any[]) => {
                events.push(`deleted:${data}`);
                self.remove(...keys);
            },
            initialize: true,
        });
        return {model, observer, events};
    }

    it("re-assigning an identical-content array preserves observer values", () => {
        const {model, observer, events} = setup();

        model.data = ["cardA"];
        expect(observer.values.length).toBe(1);
        expect(events).toContain("added:cardA");

        events.length = 0;
        model.data = ["cardA"]; // fresh array instance, same content
        expect(observer.values.length).toBe(1);
        expect(events).not.toContain("deleted:cardA");
    });

    it("re-assigning an identical-content array on GradumYModel preserves observer values", () => {
        const {model, observer, events} = setup(GradumYModel as any);

        model.data = ["cardA"];
        expect(observer.values.length).toBe(1);

        events.length = 0;
        model.data = ["cardA"];
        expect(observer.values.length).toBe(1);
        expect(events).not.toContain("deleted:cardA");
    });

    it("changed entries fire onUpdated (or delete+add) but retained entries keep their value", () => {
        const {model, observer, events} = setup();

        model.data = ["cardA", "cardB"];
        expect(observer.values.length).toBe(2);
        const valueA = observer.get(0 as any);

        events.length = 0;
        model.data = ["cardA", "cardC"];
        expect(observer.get(0 as any)).toBe(valueA);
        expect(events).toContain("updated:cardC");
        expect(events).not.toContain("deleted:cardA");
    });

    it("shrinking the array fires onDeleted only for dropped indices", () => {
        const {model, observer, events} = setup();

        model.data = ["cardA", "cardB"];
        events.length = 0;
        model.data = ["cardA"];

        expect(events).toContain("deleted:cardB");
        expect(events).not.toContain("deleted:cardA");
        expect(observer.values.length).toBe(1);
    });

    it("array → array replacement after initial object → array transition preserves values", () => {
        // Mirrors the VideoClipper sequence: constructor data {} → first array assignment
        // (clear + initialize path) → second identical array assignment (diff path).
        const {model, observer} = setup();

        model.data = ["id1"];
        model.data = ["id1"];
        model.data = ["id1"];
        expect(observer.values.length).toBe(1);
    });
});
