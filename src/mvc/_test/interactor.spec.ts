import {describe, it, expect} from "vitest";
import {GradumView} from "../view/view";
import {GradumInteractor} from "../interactor/interactor";
import {GradumOperator} from "../operator/operator";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {div} from "../../elementCreation/basicElements";
import {listener} from "../../decorators/listener/listener";
import {GradumModel} from "../model/model";
import {GradumEmitter} from "../emitter/emitter";

class DemoInteractor extends GradumInteractor {
    public rand = 0;

    @listener() click(): void { this.rand++; }
}

class MinimalInteractor extends GradumInteractor {}

describe("GradumInteractor", () => {
    it("is a subclass of GradumOperator", () => {
        const element = div({parent: document.body});
        const itc = new MinimalInteractor({element});
        expect(itc).toBeInstanceOf(GradumOperator);
    });

    it("constructor assigns element, view, model, emitter", () => {
        const element = div({parent: document.body});
        const model = new GradumModel({data: {}});
        const emitter = new GradumEmitter(model);
        const view = new GradumView({element});

        const itc = new MinimalInteractor({element, view, model, emitter} as any);

        expect(itc.element).toBe(element);
        expect(itc.view).toBe(view);
        expect(itc.model).toBe(model);
        expect(itc.emitter).toBe(emitter);
    });

    it("sets target to the element when element is a Node", () => {
        const element = div({parent: document.body});
        const itc = new MinimalInteractor({element});
        expect(itc.target).toBe(element);
    });

    it("target falls back to the element Node when no explicit target is given", () => {
        // When no target is provided, the interactor defaults its target to the element.
        const element = div({parent: document.body});
        const itc = new MinimalInteractor({element});
        expect(itc.target).toBe(element);
    });

    it("toolName is set from properties", () => {
        const element = div({parent: document.body});
        const itc = new MinimalInteractor({element, toolName: "pen"} as any);
        expect(itc.toolName).toBe("pen");
    });

    it("initialize() does not throw", () => {
        const element = div({parent: document.body});
        const itc = new MinimalInteractor({element});
        expect(() => itc.initialize()).not.toThrow();
    });

    it("@listener decorator wires click events after initialize()", () => {
        const element = div({parent: document.body});
        const model = new GradumModel({data: {}});
        const emitter = new GradumEmitter(model);
        const view = new GradumView({element});

        const itc = new DemoInteractor({element});
        itc.view = view;
        itc.model = model;
        itc.emitter = emitter;

        expect(itc.rand).toBe(0);
        itc.initialize();

        gradum(element).executeAction("gradum-click", null, new Event("gradum-click"));
        expect(itc.rand).toBe(1);
    });
});