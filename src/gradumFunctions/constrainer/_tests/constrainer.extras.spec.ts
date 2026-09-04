import {describe, it, expect, vi} from "vitest";
import {div} from "../../../elementCreation/basicElements";
import {gradum} from "../../gradumFunctions";
import {GradumConstrainer} from "../../../mvc/constrainer/constrainer";
import {GradumNodeList} from "../../../gradumComponents/datatypes/nodeList/nodeList";

describe("Constrainer functions – extras", () => {
    it("addObjectToConstrainer / removeObjectFromConstrainer with Set", () => {
        const host = div({parent: document.body});
        gradum(host).makeConstrainer("main");

        const objectList = gradum(host).getConstrainerObjectList("main");

        const a = {id: "a"};
        const b = {id: "b"};

        // add
        objectList.add(a, a, b);
        expect(objectList.size).toBe(2);

        // has
        expect(objectList.has(a)).toBe(true);
        expect(objectList.has({id: "z"})).toBe(false);

        // remove
        objectList.remove(a);
        expect(objectList.size).toBe(1);
    });

    it("hasObjectInConstrainer works for HTMLCollection and NodeList", () => {
        const host = div({parent: document.body});
        gradum(host).makeConstrainer("main");

        // HTMLCollection (children)
        const span = document.createElement("span");
        host.appendChild(span);
        const objectList = gradum(host).getConstrainerObjectList("main");
        expect(objectList.has(span)).toBe(true);

        // NodeList (childNodes)
        const txt = document.createTextNode("x");
        objectList.list = host.childNodes;
        host.appendChild(txt);
        expect(objectList.has(txt)).toBe(true);
    });

    it("wasObjectProcessedByConstrainer changes after solveConstrainer", () => {
        const host = div({parent: document.body});
        gradum(host).makeConstrainer("main");

        const objectList = gradum(host).getConstrainerObjectList("main");
        const a = {id: "a"};
        objectList.add(a);

        const solver = vi.fn();
        gradum(host).addSolver({callback: solver});

        expect(gradum(host).getObjectPassesForConstrainer(a, "main")).toBe(0);

        gradum(host).solveConstrainer(); // processes 'a'

        expect(solver).toHaveBeenCalledTimes(1);
        expect(gradum(host).getObjectPassesForConstrainer(a, "main")).toBe(1);
    });

    it("solveConstrainer processes all items in a Set and honors eventTarget first", () => {
        const host = div({parent: document.body});
        gradum(host).makeConstrainer("main");

        const objectList = gradum(host).getConstrainerObjectList("main");
        const a = {id: "a"};
        const b = {id: "b"};
        objectList.add(a, b);

        const calls: any[] = [];
        const solver = vi.fn((props) => calls.push(props.target));
        gradum(host).addSolver({callback: solver as any});

        gradum(host).solveConstrainer({eventTarget: b as any});

        expect(calls.length).toBe(2);
        // First call should be eventTarget
        expect(calls[0]).toBe(b);
        expect(new Set(calls)).toEqual(new Set([a, b]));
    });

    it("solveConstrainer picks up items added during the same pass (Set)", () => {
        const host = div({parent: document.body});
        gradum(host).makeConstrainer("main");

        const objectList = gradum(host).getConstrainerObjectList("main");
        const a = {id: "a"};
        const b = {id: "b"};
        const c = {id: "c"};
        objectList.add(a, b);

        const seen: object[] = [];
        const solver = vi.fn((props: any) => {
            seen.push(props.target);
            objectList.add(c);
        });
        gradum(host).addSolver({callback: solver, constrainer: "main"});
        gradum(host).solveConstrainer();

        expect(new Set(seen)).toEqual(new Set([a, b, c]));
        expect(solver).toHaveBeenCalledTimes(3);
    });

    it("solveConstrainer picks up items added during the same pass to an attached instance's own object list", () => {
        const host = div({parent: document.body});

        const a = {id: "a"};
        const b = {id: "b"};
        const c = {id: "c"};

        const seen: object[] = [];

        class ShadowingConstrainer extends GradumConstrainer {
            //Declaring its own list is what a GradumConstrainer subclass is expected to do; the pass has to
            //watch this one rather than the list the constrainer data created for the host.
            public objectList = new GradumNodeList().add(a, b);
        }

        const constrainer = new ShadowingConstrainer({element: host, constrainerName: "main"} as any);
        constrainer.initialize();
        constrainer.addSolver({
            name: "collect",
            callback: (props: any) => {
                seen.push(props.target);
                constrainer.objectList.add(c);
            }
        });

        constrainer.solve();

        expect(new Set(seen)).toEqual(new Set([a, b, c]));
    });

    it("solveConstrainer honors a maxPasses set on the attached instance", () => {
        const host = div({parent: document.body});

        const a = {id: "a"};
        const seen: object[] = [];

        class LimitedConstrainer extends GradumConstrainer {
            public objectList = new GradumNodeList().add(a);
            public maxPasses = 2;
        }

        const constrainer = new LimitedConstrainer({element: host, constrainerName: "main"} as any);
        constrainer.initialize();
        constrainer.addSolver({
            name: "requeue",
            callback: (props: any) => {
                seen.push(props.target);
                constrainer.queue.push(props.target);
            }
        });

        constrainer.solve();

        //The object is queued again on every pass, so only the limit stops it: two solved passes, then a
        //third dequeue that the limit skips.
        expect(seen.length).toBe(2);
        expect(gradum(host).getObjectPassesForConstrainer(a, "main")).toBe(2);
    });

    it("solveConstrainer with default HTMLCollection processes existing and newly appended children", () => {
        const host = div({parent: document.body});
        gradum(host).makeConstrainer("main");

        // default: objects = host.children (HTMLCollection)
        const s1 = document.createElement("span");
        const s2 = document.createElement("span");
        host.appendChild(s1);
        host.appendChild(s2);

        const processed: Element[] = [];
        const solver = vi.fn((props: any) => {
            processed.push(props.target as Element);
            // On first call, append another element (live list should include it later)
            if (processed.length === 1) {
                const s3 = document.createElement("span");
                host.appendChild(s3);
                gradum(host).getConstrainerQueue().push(s3);
            }
        });
        gradum(host).addSolver({callback: solver});

        gradum(host).solveConstrainer();

        // Should have processed s1, s2, and s3
        expect(processed.length).toBe(3);
        expect(host.children.length).toBe(3);
    });
});
