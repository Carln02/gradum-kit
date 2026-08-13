import {describe, it, expect, beforeEach} from "vitest";
import {GradumTool} from "../tool/tool";
import {GradumOperator} from "../operator/operator";
import {GradumView} from "../view/view";
import {div} from "../../elementCreation/basicElements";
import {$, gradum} from "../../gradumFunctions/gradumFunctions";
import {behavior} from "../../decorators/listener/listener";
import {GradumModel} from "../model/model";
import {GradumEmitter} from "../emitter/emitter";

class DemoTool extends GradumTool {
    public rand = 0;

    @behavior() click(_e: any, _target: any): void { this.rand++; }
}

class MinimalTool extends GradumTool {}

describe("GradumTool", () => {
    //Behaviors live on the manager against a tool name, and the same function is only ever registered once
    //under it — so a tool an earlier test built would otherwise keep answering for "brush" here.
    beforeEach(() => gradum().clearToolBehaviors());

    it("is a subclass of GradumOperator", () => {
        const element = div({parent: document.body});
        const tool = new MinimalTool({element});
        expect(tool).toBeInstanceOf(GradumOperator);
    });

    it("constructor assigns element, view, model, emitter, toolName", () => {
        const element = div({parent: document.body});
        const model = new GradumModel({data: {}});
        const emitter = new GradumEmitter(model);
        const view = new GradumView({element, model, emitter} as any);

        const tool = new MinimalTool({element, view, model, emitter, toolName: "brush"} as any);

        expect(tool.element).toBe(element);
        expect(tool.view).toBe(view);
        expect(tool.model).toBe(model);
        expect(tool.emitter).toBe(emitter);
        expect(tool.toolName).toBe("brush");
    });

    it("toolName defaults to undefined when not provided", () => {
        const element = div({parent: document.body});
        const tool = new MinimalTool({element} as any);
        expect(tool.toolName).toBeUndefined();
    });

    it("key property is set from properties", () => {
        const element = div({parent: document.body});
        const tool = new MinimalTool({element, key: "b"} as any);
        expect(tool.key).toBe("b");
    });

    it("initialize() does not throw when toolName is undefined", () => {
        const element = {};
        const tool = new MinimalTool({element} as any);
        expect(() => tool.initialize()).not.toThrow();
    });

    it("initialize() does not throw when toolName is set", () => {
        const element = div({parent: document.body});
        const model = new GradumModel({data: {}});
        const emitter = new GradumEmitter(model);
        const view = new GradumView({element, model, emitter} as any);

        const tool = new DemoTool({element, view, model, emitter, toolName: "brush"} as any);
        expect(() => tool.initialize()).not.toThrow();
    });

    it("@behavior decorator wires click events after initialize() with a toolName", () => {
        const element = div({parent: document.body});
        const model = new GradumModel({data: {}});
        const emitter = new GradumEmitter(model);
        const view = new GradumView({element, model, emitter} as any);

        const tool = new DemoTool({element, view, model, emitter, toolName: "brush"} as any);
        tool.initialize();

        expect(tool.rand).toBe(0);
        $(div()).executeAction("gradum-click", "brush", new Event("gradum-click"));
        expect(tool.rand).toBe(1);
    });

    it("keyName can be assigned explicitly", () => {
        const tool = new MinimalTool({element: {}} as any);
        tool.keyName = "myTool";
        expect(tool.keyName).toBe("myTool");
    });
});