import {describe, it, expect} from "vitest";
import {GradumTool} from "../../mvc/tool/tool";
import {behavior} from "../listener/listener";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {div} from "../../elementCreation/basicElements";
import {Propagation} from "../../gradumFunctions/event/event.types";

describe("a behavior is registered once per tool name", () => {
    //Behaviors belong to the tool, not to the instance: every instance of a tool contributes to one set, and
    //any of them firing runs all of it. So the same function registering again would only ever double up.
    it("collapses the same behavior across instances of one tool", () => {
        const ran: string[] = [];

        class Stamper extends GradumTool {
            public toolName = "stamp";
            public label: string;
            @behavior() public click() {
                ran.push(this.label);
                return Propagation.propagate;
            }
        }

        for (const label of ["first", "second", "third"]) {
            const tool = new Stamper({element: div({id: `s-${label}`})} as any);
            tool.label = label;
            tool.initialize();
        }

        gradum(div({id: "stamp-target"})).applyTool("stamp", "gradum-click", new Event("click"));
        expect(ran.length).toBe(1);
    });

    it("keeps behaviors of tools registered under different names", () => {
        const ran: string[] = [];

        class Corner extends GradumTool {
            public toolName: string;
            @behavior() public click() {
                ran.push(this.toolName);
                return Propagation.propagate;
            }
        }

        for (const name of ["corner-a", "corner-b"]) {
            const tool = new Corner({element: div({id: name})} as any);
            //Assigned after construction, not through properties: a subclass field initializer runs after
            //super() and would overwrite whatever the constructor put there.
            tool.toolName = name;
            tool.initialize();
        }

        gradum(div({id: "corner-target"})).applyTool("corner-a", "gradum-click", new Event("click"));
        gradum(div({id: "corner-target"})).applyTool("corner-b", "gradum-click", new Event("click"));
        expect(ran).toEqual(["corner-a", "corner-b"]);
    });

    it("keeps distinct behaviors of the same tool", () => {
        const ran: string[] = [];

        class Pair extends GradumTool {
            public toolName = "pair";
            @behavior() public click() {ran.push("click"); return Propagation.propagate}
            @behavior() public drag() {ran.push("drag"); return Propagation.propagate}
        }

        new Pair({element: div({id: "pair"})} as any).initialize();

        gradum(div({id: "pair-target"})).applyTool("pair", "gradum-click", new Event("click"));
        gradum(div({id: "pair-target"})).applyTool("pair", "gradum-drag", new Event("drag"));
        expect(ran).toEqual(["click", "drag"]);
    });

    it("skips a plain function registered twice by hand", () => {
        const ran: string[] = [];
        const handler = () => {ran.push("ran"); return Propagation.propagate};
        const host = div({id: "manual"});

        gradum(host).addToolBehavior("gradum-click", handler, "manual");
        gradum(host).addToolBehavior("gradum-click", handler, "manual");

        gradum(host).applyTool("manual", "gradum-click", new Event("click"));
        expect(ran.length).toBe(1);
    });

    it("still keeps two different functions under one name", () => {
        const ran: string[] = [];
        const host = div({id: "two-fns"});

        gradum(host).addToolBehavior("gradum-click", () => {ran.push("a"); return Propagation.propagate}, "two");
        gradum(host).addToolBehavior("gradum-click", () => {ran.push("b"); return Propagation.propagate}, "two");

        gradum(host).applyTool("two", "gradum-click", new Event("click"));
        expect(ran).toEqual(["a", "b"]);
    });
});

describe("behaviors receive their options argument", () => {
    it("passes the embedded-tool context through", () => {
        const seen: any[] = [];
        const host = div({id: "emb-host"}), embedded = div({id: "emb-target"});

        class Embedder extends GradumTool {
            public toolName = "embedder";
            @behavior() public click(e: Event, el: Node, options?: any) {
                seen.push(options);
                return Propagation.propagate;
            }
        }

        new Embedder({element: host} as any).initialize();
        gradum(host).embedTool(embedded);

        gradum(host).applyTool("embedder", "gradum-click", new Event("click"));

        expect(seen.length).toBe(1);
        expect(seen[0]?.isEmbedded).toBe(true);
        expect(seen[0]?.embeddedTarget).toBe(embedded);
    });
});
