import {describe, it, expect} from "vitest";
import {GradumElement} from "../../gradumElement/gradumElement";
import {GradumModel} from "../model/model";
import {GradumView} from "../view/view";
import {define} from "../../decorators/define/define";
import {dataSignal, effect} from "../../decorators/reactivity/reactivity";

async function flushMicrotasks(times = 4) {
    for (let i = 0; i < times; i++) await Promise.resolve();
}

class DataCircle extends GradumElement {
    @dataSignal() color: string = "red";
    @dataSignal("meta", "label") label: string;
}
define(DataCircle, "data-signal-circle");

class CircleModel extends GradumModel {}

class LabelView extends GradumView<any, any> {
    @dataSignal() caption: string = "none";
}

class ViewedElement extends GradumElement {}
define(ViewedElement, "data-signal-viewed");

describe("@dataSignal outside a model", () => {
    it("creates and attaches a default model when the element has none", () => {
        const circle = new DataCircle();
        expect(circle.model).toBeInstanceOf(GradumModel);
        expect(circle.color).toBe("red");
        expect(circle.model.get("color")).toBe("red");
    });

    it("reads and writes through the attached model, nested paths included", () => {
        const circle = new DataCircle();
        circle.color = "blue";
        //Models don't create missing parents on a nested write, so the parent has to exist first.
        circle.model.set({}, "meta");
        circle.label = "hello";
        expect(circle.model.get("color")).toBe("blue");
        expect(circle.model.get("meta", "label")).toBe("hello");

        circle.model.set("green", "color");
        expect(circle.color).toBe("green");
    });

    it("re-runs an effect when the value changes through the model", async () => {
        const circle = new DataCircle();
        const seen: string[] = [];
        const stop = effect(() => seen.push(circle.color));
        expect(seen).toEqual(["red"]);

        circle.model.set("blue", "color");
        await flushMicrotasks();
        expect(seen[seen.length - 1]).toBe("blue");

        circle.color = "green";
        await flushMicrotasks();
        expect(seen[seen.length - 1]).toBe("green");

        stop();
    });

    it("re-runs an effect on a nested path when its parent is replaced", async () => {
        const circle = new DataCircle();
        const seen: string[] = [];
        const stop = effect(() => seen.push(circle.label));

        circle.model.set({label: "a"}, "meta");
        await flushMicrotasks();
        expect(seen[seen.length - 1]).toBe("a");

        stop();
    });

    it("lets an explicitly attached model replace the default one", () => {
        const circle = new DataCircle();
        const defaultModel = circle.model;

        const explicit = new CircleModel({data: {color: "purple"}});
        circle.model = explicit;
        expect(circle.model).toBe(explicit);
        expect(circle.model).not.toBe(defaultModel);
        expect(circle.color).toBe("purple");
    });

    it("lands data passed to create() in the default model", () => {
        const circle = DataCircle.create({data: {color: "orange"}} as any);
        expect(circle.color).toBe("orange");
    });

    it("uses the model of the element a view belongs to", () => {
        const host = new ViewedElement();
        const view = new LabelView({element: host});
        expect(view.model).toBeInstanceOf(GradumModel);
        expect(host.model).toBe(view.model);
        expect(view.caption).toBe("none");

        host.model.set("shown", "caption");
        expect(view.caption).toBe("shown");
    });
});
