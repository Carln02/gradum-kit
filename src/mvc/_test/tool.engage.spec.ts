import {describe, it, expect} from "vitest";
import {GradumTool} from "../tool/tool";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {div} from "../../elementCreation/basicElements";
import {behavior} from "../../decorators/listener/listener";
import {Propagation} from "../../gradumFunctions/event/event.types";
import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {ClickMode} from "../../eventHandling/gradumEventManager/gradumEventManager.types";

//Every call below names "select" as the tool in hand, the way it is in practice: a handle's own tool is
//never the one the user is holding, it is reached through the element the interaction landed on.
//Several elements can carry the same tool — four resize handles, one "resize" tool — and each needs to set
//it up its own way. Activation cannot say which: it fires on every element carrying the tool at once.
//Engagement is per element, and says which one the interaction actually reached.
describe("a tool is engaged through the element the interaction reached", () => {
    const makeHandle = (manager: GradumEventManager, target: Node, log: string[], name: string) => {
        const handle = div({parent: document.body});
        const tool = new GradumTool({
            element: handle,
            toolName: "probe",
            manager,
            customActivation: () => {},
            onEngage: (on: Node) => log.push(`engage ${name}${on === target ? " on target" : ""}`),
            onDisengage: (on: Node) => log.push(`disengage ${name}${on === target ? " on target" : ""}`)
        } as any);
        tool.initialize();
        gradum(handle).embedTool(target, manager);
        return handle;
    };

    it("tells the element it is the one being used, and names what it acts on", () => {
        const manager = GradumEventManager.create();
        const log: string[] = [];
        const target = div({parent: document.body});
        const handle = makeHandle(manager, target, log, "a");

        gradum(handle).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);

        expect(log).toEqual(["engage a on target"]);
    });

    it("says nothing more while the same element keeps being used", () => {
        const manager = GradumEventManager.create();
        const log: string[] = [];
        const target = div({parent: document.body});
        const handle = makeHandle(manager, target, log, "a");

        for (let i = 0; i < 4; i++)
            gradum(handle).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);

        expect(log).toEqual(["engage a on target"]);
    });

    it("hands over when a second element carrying the same tool is used", () => {
        const manager = GradumEventManager.create();
        const log: string[] = [];
        const target = div({parent: document.body});
        const first = makeHandle(manager, target, log, "a");
        const second = makeHandle(manager, target, log, "b");

        gradum(first).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);
        gradum(second).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);
        gradum(first).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);

        expect(log).toEqual([
            "engage a on target",
            "disengage a on target", "engage b on target",
            "disengage b on target", "engage a on target"
        ]);
    });

    it("reports which element the tool is being used through", () => {
        const manager = GradumEventManager.create();
        const log: string[] = [];
        const target = div({parent: document.body});
        const first = makeHandle(manager, target, log, "a");
        const second = makeHandle(manager, target, log, "b");

        expect(gradum(first).getEngagedTool("probe", manager)).toBeUndefined();

        gradum(second).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);
        expect(gradum(first).getEngagedTool("probe", manager)).toBe(second);
    });

    it("keeps one element's engagement apart from another tool's", () => {
        const manager = GradumEventManager.create();
        const log: string[] = [];
        const target = div({parent: document.body});
        const handle = makeHandle(manager, target, log, "a");

        const other = div({parent: document.body});
        const otherTool = new GradumTool({
            element: other, toolName: "other", manager, customActivation: () => {}
        } as any);
        otherTool.initialize();
        gradum(other).embedTool(target, manager);

        gradum(handle).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);
        gradum(other).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);

        //Engaging a different tool leaves this one's element engaged: they are tracked per tool name.
        expect(log).toEqual(["engage a on target"]);
        expect(gradum(handle).getEngagedTool("probe", manager)).toBe(handle);
    });

    it("runs before the tool's behaviors, so what engagement sets is in place for them", () => {
        const manager = GradumEventManager.create();
        const seen: string[] = [];

        class StampTool extends GradumTool {
            public toolName = "stamp";
            public stamp: string = "not engaged";

            public onEngage() {
                this.stamp = "engaged";
            }

            @behavior() public drag() {
                seen.push(this.stamp);
                return Propagation.propagate;
            }
        }

        const target = div({parent: document.body});
        const handle = div({parent: document.body});
        const tool = new StampTool({element: handle, manager, customActivation: () => {}} as any);
        tool.initialize();
        gradum(handle).embedTool(target, manager);

        gradum(handle).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);

        expect(seen).toEqual(["engaged"]);
    });

    it("hands the callback the tool object the behaviors run against", () => {
        //The point of the whole thing: one tool name across several elements, each setting up the one tool
        //object that does the work, as it is taken up. Nothing is rebound behind the developer's back —
        //`this` inside a behavior is the object the callback was handed.
        const manager = GradumEventManager.create();
        const used: string[] = [];

        class CornerTool extends GradumTool {
            public toolName = "corner";
            public corner: string;

            @behavior() public drag() {
                used.push(this.corner);
                return Propagation.propagate;
            }
        }

        const target = div({parent: document.body});
        const handles = ["topLeft", "topRight", "bottomLeft", "bottomRight"].map(corner => {
            const handle = div({parent: document.body});
            const tool = new CornerTool({
                element: handle, manager, customActivation: () => {},
                onEngage: (_: Node, toolInstance: CornerTool) => toolInstance.corner = corner
            } as any);
            tool.initialize();
            gradum(handle).embedTool(target, manager);
            return handle;
        });

        for (const handle of handles)
            gradum(handle).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);

        expect(used).toEqual(["topLeft", "topRight", "bottomLeft", "bottomRight"]);
    });

    it("names the same tool instance to every element carrying the name", () => {
        const manager = GradumEventManager.create();
        const seen: object[] = [];

        class SharedTool extends GradumTool {
            public toolName = "shared";
            @behavior() public drag() {return Propagation.propagate}
        }

        const target = div({parent: document.body});
        const first = div({parent: document.body});
        const firstTool = new SharedTool({
            element: first, manager, customActivation: () => {},
            onEngage: (_: Node, toolInstance: object) => seen.push(toolInstance)
        } as any);
        firstTool.initialize();
        gradum(first).embedTool(target, manager);

        const second = div({parent: document.body});
        const secondTool = new SharedTool({
            element: second, manager, customActivation: () => {},
            onEngage: (_: Node, toolInstance: object) => seen.push(toolInstance)
        } as any);
        secondTool.initialize();
        gradum(second).embedTool(target, manager);

        gradum(first).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);
        gradum(second).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);

        //Both were handed the one object the behaviors belong to — the first tool to register.
        expect(seen).toEqual([firstTool, firstTool]);
        expect(gradum(first).getToolInstance("shared", manager)).toBe(firstTool);
    });

    it("works the same for a tool the user is holding, not just an embedded one", () => {
        const manager = GradumEventManager.create();
        const used: string[] = [];

        class HeldTool extends GradumTool {
            public toolName = "held";
            public mark: string;

            @behavior() public drag() {
                used.push(this.mark);
                return Propagation.propagate;
            }
        }

        const firstEl = div({parent: document.body});
        const first = new HeldTool({
            element: firstEl, manager, onEngage: (_: Node, toolInstance: HeldTool) => toolInstance.mark = "first"
        } as any);
        first.initialize();

        const secondEl = div({parent: document.body});
        const second = new HeldTool({
            element: secondEl, manager, onEngage: (_: Node, toolInstance: HeldTool) => toolInstance.mark = "second"
        } as any);
        second.initialize();

        const acted = div({parent: document.body});

        manager.setTool(secondEl, ClickMode.left);
        gradum(acted).executeAction("gradum-drag", undefined, new Event("gradum-drag"), {}, manager);

        manager.setTool(firstEl, ClickMode.left);
        gradum(acted).executeAction("gradum-drag", undefined, new Event("gradum-drag"), {}, manager);

        expect(used).toEqual(["second", "first"]);
    });

    it("engages the instance a held tool was picked up on", () => {
        const manager = GradumEventManager.create();
        const log: string[] = [];

        const make = (name: string) => {
            const el = div({parent: document.body});
            const tool = new GradumTool({
                element: el, toolName: "held", manager,
                onEngage: () => log.push(`engage ${name}`),
                onDisengage: () => log.push(`disengage ${name}`)
            } as any);
            tool.initialize();
            return el;
        };
        const firstEl = make("first");
        const secondEl = make("second");
        const acted = div({parent: document.body});

        manager.setTool(firstEl, ClickMode.left);
        gradum(acted).executeAction("gradum-drag", undefined, new Event("gradum-drag"), {}, manager);
        manager.setTool(secondEl, ClickMode.left);
        gradum(acted).executeAction("gradum-drag", undefined, new Event("gradum-drag"), {}, manager);

        expect(log).toEqual(["engage first", "disengage first", "engage second"]);
    });

    it("leaves the tool instance alone when nothing has been taken up", () => {
        //A caller naming a tool directly, with nobody holding it and nothing reached through: no element is
        //engaged, so no callback runs and the behavior sees whatever it was last left with.
        const manager = GradumEventManager.create();
        const used: string[] = [];

        class NamedTool extends GradumTool {
            public toolName = "named";
            public mark: string = "untouched";

            @behavior() public drag() {
                used.push(this.mark);
                return Propagation.propagate;
            }
        }

        const first = new NamedTool({element: div({parent: document.body}), manager} as any);
        first.initialize();

        gradum(div({parent: document.body}))
            .executeAction("gradum-drag", "named", new Event("gradum-drag"), {}, manager);

        expect(used).toEqual(["untouched"]);
    });

    it("takes the callbacks through makeTool, without a GradumTool", () => {
        //A tool made straight off an element, rather than declared as a class.
        const manager = GradumEventManager.create();
        const log: string[] = [];
        const target = div({parent: document.body});

        const make = (name: string) => {
            const el = div({parent: document.body});
            gradum(el).makeTool("made", {
                manager,
                customActivation: () => {},
                onEngage: (on: Node) => log.push(`engage ${name}${on === target ? " on target" : ""}`),
                onDisengage: () => log.push(`disengage ${name}`)
            });
            gradum(el).embedTool(target, manager);
            return el;
        };
        const first = make("first");
        const second = make("second");

        gradum(first).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);
        gradum(second).executeAction("gradum-drag", "select", new Event("gradum-drag"), {}, manager);

        expect(log).toEqual(["engage first on target", "disengage first", "engage second on target"]);
    });
});
