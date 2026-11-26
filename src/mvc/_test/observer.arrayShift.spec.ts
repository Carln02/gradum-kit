import {describe, it, expect} from "vitest";
import {GradumModel} from "../model/model";

function setup(items: string[]) {
    const model = GradumModel.create({data: {items: [...items]}, initialize: true});
    const observer = model.generateObserver({onAdded: (data) => ({data, remove() {}}) as any}, "items");
    return {model, observer};
}

describe("GradumObserver on a plain array", () => {
    it("keeps instances aligned with their entries after a deletion", () => {
        const {model, observer} = setup(["a", "b", "c"]);
        model.delete("items", 0);
        expect((observer.get("items", 0) as any).data).toBe("b");
        expect((observer.get("items", 1) as any).data).toBe("c");
        expect(observer.has("items", 2)).toBe(false);

        model.delete("items", 1);
        expect((observer.get("items", 0) as any).data).toBe("b");
        expect(observer.has("items", 1)).toBe(false);
        expect(model.get("items")).toEqual(["b"]);
    });

    it("keeps instances aligned after an insertion in the middle", () => {
        const {model, observer} = setup(["a", "c"]);
        model.add("b", "items", 1);
        expect([0, 1, 2].map(i => (observer.get("items", i) as any).data)).toEqual(["a", "b", "c"]);
    });

    it("appends at the end without moving anything", () => {
        const {model, observer} = setup(["a"]);
        model.add("b", "items", 1);
        expect([0, 1].map(i => (observer.get("items", i) as any).data)).toEqual(["a", "b"]);
    });
});

describe("GradumModel.push", () => {
    it("appends to an array and returns the index", () => {
        const model = GradumModel.create({data: {items: ["a"]}, initialize: true});
        const observer = model.generateObserver({onAdded: (data) => ({data, remove() {}}) as any}, "items");
        expect(model.push("b", "items")).toBe(1);
        expect(model.get("items")).toEqual(["a", "b"]);
        expect((observer.get("items", 1) as any).data).toBe("b");
    });

    it("appends to the model's own data when no keys are given", () => {
        const model = GradumModel.create({data: ["a"], initialize: true});
        expect(model.push("b")).toBe(1);
        expect(model.data).toEqual(["a", "b"]);
    });

    it("stores under a random key in an object and returns it", () => {
        const model = GradumModel.create({data: {items: {}}, initialize: true});
        const key = model.push("a", "items");
        expect(typeof key).toBe("string");
        expect(model.get("items", key)).toBe("a");
    });

    it("stores under a random key in a Map", () => {
        const model = GradumModel.create({data: {items: new Map()}, initialize: true});
        const key = model.push("a", "items");
        expect(model.get("items", key)).toBe("a");
    });
});
