import {describe, it, expect} from "vitest";
import {GradumHandler} from "../handler/handler";
import {GradumModel} from "../model/model";

describe("GradumHandler constructor", () => {
    // The guard used to read `if (this.model)` — testing the field rather than the
    // argument — so a model passed in was always discarded.
    it("binds a model passed to the constructor", () => {
        const model = GradumModel.create({data: {a: 1}});
        const handler = new GradumHandler(model);

        expect(handler.model).toBe(model);
    });

    it("leaves the model unset when constructed without one", () => {
        const handler = new GradumHandler();

        expect(handler.model).toBeUndefined();
    });

    it("lets the MVC wiring assign the model after construction", () => {
        const model = GradumModel.create({data: {a: 1}});
        const handler = new GradumHandler();

        handler.model = model;
        expect(handler.model).toBe(model);
    });

    it("binds the model on a subclass that reads it in its own methods", () => {
        class CountHandler extends GradumHandler {
            public count(): number {
                return this.model.get("a") as number;
            }
        }

        const model = GradumModel.create({data: {a: 42}, initialize: true});
        expect(new CountHandler(model).count()).toBe(42);
    });
});
