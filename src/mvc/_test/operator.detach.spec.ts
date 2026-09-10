import {describe, it, expect, vi} from "vitest";
import {GradumInteractor} from "../interactor/interactor";
import {GradumTool} from "../tool/tool";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {div} from "../../elementCreation/basicElements";
import {listener, behavior} from "../../decorators/listener/listener";
import {Propagation} from "../../gradumFunctions/event/event.types";

class CountingInteractor extends GradumInteractor {
    public count = 0;

    @listener() public click(): void {
        this.count++;
    }
}

class OtherInteractor extends GradumInteractor {
    public count = 0;

    @listener() public click(): void {
        this.count++;
    }
}

describe("removing an MVC piece takes its listeners with it", () => {
    //An interactor that has been removed from an element is gone as far as the element is concerned, but its
    //listeners were bound to the element's own listener set and knew nothing about that. They kept firing —
    //against a model, view and emitter the removal had just unlinked, so the first field read threw.
    it("stops a removed interactor's listeners from firing", () => {
        const element = div({parent: document.body});
        const interactor = new CountingInteractor({element});
        gradum(element).addInteractor(interactor);
        interactor.initialize();

        gradum(element).executeAction("gradum-click", null, new Event("gradum-click"));
        expect(interactor.count).toBe(1);

        gradum(element).removeInteractor("counting");
        gradum(element).executeAction("gradum-click", null, new Event("gradum-click"));
        expect(interactor.count).toBe(1);
    });

    it("leaves the listeners of everything else on the element alone", () => {
        const element = div({parent: document.body});
        const kept = new CountingInteractor({element});
        const removed = new OtherInteractor({element});
        gradum(element).addInteractor(kept);
        gradum(element).addInteractor(removed);
        kept.initialize();
        removed.initialize();

        let own = 0;
        gradum(element).on("gradum-click", () => {own++});

        gradum(element).removeInteractor(removed);
        gradum(element).executeAction("gradum-click", null, new Event("gradum-click"));

        expect(removed.count).toBe(0);
        expect(kept.count).toBe(1);
        expect(own).toBe(1);
    });

    it("stops a removed tool's behaviors from firing", () => {
        const ran: string[] = [];

        class DetachTool extends GradumTool {
            public toolName = "detach-probe";

            @behavior() public click() {
                ran.push("ran");
                return Propagation.propagate;
            }
        }

        const element = div({parent: document.body});
        const tool = new DetachTool({element} as any);
        gradum(element).addTool(tool);
        tool.initialize();

        gradum(div({id: "detach-target"})).applyTool("detach-probe", "gradum-click", new Event("click"));
        expect(ran.length).toBe(1);

        gradum(element).removeTool(tool);
        gradum(div({id: "detach-target"})).applyTool("detach-probe", "gradum-click", new Event("click"));
        expect(ran.length).toBe(1);
    });

    it("round-trips: removing then adding again binds the listeners afresh", () => {
        const element = div({parent: document.body});
        const interactor = new CountingInteractor({element});
        gradum(element).addInteractor(interactor);
        interactor.initialize();

        gradum(element).removeInteractor(interactor);
        gradum(element).addInteractor(interactor);
        interactor.initialize();

        gradum(element).executeAction("gradum-click", null, new Event("gradum-click"));
        //Once, not twice: re-attaching takes back what it bound before rather than doubling up.
        expect(interactor.count).toBe(1);
    });

    it("initializes a piece added to an element that has already initialized", () => {
        //The element's own initialization pass is what normally initializes its pieces. One handed over
        //afterwards has missed it, and would otherwise sit there bound to nothing.
        const element = div({parent: document.body});
        gradum(element).addInteractor(new OtherInteractor({element}));
        gradum(element).initializeMvc();

        const interactor = new CountingInteractor({element});
        gradum(element).addInteractor(interactor);

        gradum(element).executeAction("gradum-click", null, new Event("gradum-click"));
        expect(interactor.count).toBe(1);
    });

    it("swaps one interactor for another under the same key", () => {
        const element = div({parent: document.body});
        const first = new CountingInteractor({element});
        first.keyName = "variant";
        gradum(element).addInteractor(first);
        first.initialize();

        gradum(element).removeInteractor("variant");

        const second = new OtherInteractor({element});
        second.keyName = "variant";
        gradum(element).addInteractor(second);
        second.initialize();

        gradum(element).executeAction("gradum-click", null, new Event("gradum-click"));
        expect(first.count).toBe(0);
        expect(second.count).toBe(1);
    });
});

describe("an interactor's target can be changed after it has initialized", () => {
    it("moves the listeners onto the new target", () => {
        const first = div({parent: document.body});
        const second = div({parent: document.body});

        const interactor = new CountingInteractor({element: first});
        interactor.initialize();

        interactor.target = second;

        gradum(first).executeAction("gradum-click", null, new Event("gradum-click"));
        expect(interactor.count).toBe(0);

        gradum(second).executeAction("gradum-click", null, new Event("gradum-click"));
        expect(interactor.count).toBe(1);
    });

    it("binds only once when the target is set before initializing", () => {
        const element = div({parent: document.body});
        const other = div({parent: document.body});

        const interactor = new CountingInteractor({element});
        interactor.target = other;
        interactor.initialize();

        gradum(other).executeAction("gradum-click", null, new Event("gradum-click"));
        expect(interactor.count).toBe(1);
    });

    it("does nothing when the target is set to what it already was", () => {
        const element = div({parent: document.body});
        const interactor = new CountingInteractor({element});
        interactor.initialize();

        interactor.target = element;

        gradum(element).executeAction("gradum-click", null, new Event("gradum-click"));
        expect(interactor.count).toBe(1);
    });
});

describe("adding an MVC piece under a key that is taken", () => {
    it("warns and keeps the piece already registered", () => {
        const element = div({parent: document.body});
        const first = new CountingInteractor({element});
        const second = new OtherInteractor({element});
        //The collision this guards against is two classes deriving the same key from their names, which is
        //what an explicit shared keyName stands in for here.
        first.keyName = "variant";
        second.keyName = "variant";

        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        gradum(element).addInteractor(first);
        gradum(element).addInteractor(second);

        expect(warn).toHaveBeenCalledTimes(1);
        expect(String(warn.mock.calls[0][0])).toContain(first.keyName);
        expect(gradum(element).getInteractor(first.keyName)).toBe(first);
        warn.mockRestore();
    });

    it("stays quiet when the same piece is added twice", () => {
        const element = div({parent: document.body});
        const interactor = new CountingInteractor({element});

        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        gradum(element).addInteractor(interactor);
        gradum(element).addInteractor(interactor);

        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
    });
});
