import {describe, it, expect} from "vitest";
import {GradumElement} from "../../gradumElement/gradumElement";
import {GradumHandler} from "../handler/handler";
import {GradumModel} from "../model/model";
import {define} from "../../decorators/define/define";
import {effect, signal} from "../../decorators/reactivity/reactivity";
import {handler} from "../../decorators/mvc";
import {gradum} from "../../gradumFunctions/gradumFunctions";

const tick = () => new Promise(resolve => queueMicrotask(resolve as () => void));

class SourceModel extends GradumModel {
    @signal public source: string = "";
    @handler() public loadHandler: LoadHandler;
}

class LoadHandler extends GradumHandler<SourceModel> {
    public reads: string[] = [];

    @effect protected followSource() {
        const source = this.model.source;
        if (source) this.reads.push(source);
    }
}

class Sourced extends GradumElement<any, any, SourceModel> {
    public static defaultProperties = {model: SourceModel, handlers: LoadHandler};
}
define(Sourced, "test-sourced");

//A handler's `@effect` used to be dead code: `GradumHandler` started its effects from the base constructor,
//which runs before a method decorator has registered any, and before `model` is bound for them to read.
describe("a handler's effects run, and run against its model", () => {
    it("follows the model once the handler is initialized", async () => {
        const el = Sourced.create({parent: document.body});
        await tick();
        expect(el.model.loadHandler.initialized).toBe(true);
        expect(el.model.loadHandler.reads).toEqual([]);

        el.model.source = "items.json";
        await tick();

        expect(el.model.loadHandler.reads).toEqual(["items.json"]);
    });

    it("keeps following it after the first change", async () => {
        const el = Sourced.create({parent: document.body});
        el.model.source = "a.json";
        await tick();
        el.model.source = "b.json";
        await tick();

        expect(el.model.loadHandler.reads).toEqual(["a.json", "b.json"]);
    });

    it("does not start the same effects twice", async () => {
        const el = Sourced.create({parent: document.body});
        const loader = el.model.loadHandler;
        loader.initialize();
        loader.initialize();

        el.model.source = "once.json";
        await tick();

        expect(loader.reads).toEqual(["once.json"]);
    });

    it("initializes a handler added after the element already has", async () => {
        const el = Sourced.create({parent: document.body});
        const late = new LoadHandler();
        late.keyName = "late";
        gradum(el).addHandler(late);
        expect(late.initialized).toBe(true);

        el.model.source = "late.json";
        await tick();

        expect(late.reads).toEqual(["late.json"]);
    });
});
