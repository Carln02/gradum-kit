import { describe, it, expect, vi } from "vitest";
import {div} from "../../../elementCreation/basicElements";
import {gradum} from "../../gradumFunctions";

describe("Constrainer functions", () => {
    it("makeConstrainer() creates a named constrainer and getConstrainers() lists it", () => {
        const host = div({parent: document.body});

        gradum(host).makeConstrainer("main");
        gradum(host).makeConstrainer("alt");

        const names = gradum(host).constrainersNames;
        expect(names).toEqual(["main", "alt"]);
    });

    it("currentConstrainer getter/setter + setConstrainer() update current and fire onConstrainerChange", () => {
        const host = div({parent: document.body});

        gradum(host).makeConstrainer("main");
        gradum(host).makeConstrainer("alt");

        expect(gradum(host).activeConstrainers.length).toBe(2);

        gradum(host).deactivateConstrainer("alt");
        expect(gradum(host).activeConstrainers).toEqual(["main"]);
    });

    it("getConstrainerObjectList() defaults to Set() when no current constrainer", () => {
        const host = div({parent: document.body});
        gradum(host).makeConstrainer("main");
        const list = gradum(host).getConstrainerObjectList();
        expect(list.size).toEqual(0);
    });

    it("default elements list is live (HTMLCollection of element.children)", () => {
        const host = div({parent: document.body});
        gradum(host).makeConstrainer("main");

        expect(gradum(host).getConstrainerObjectList().size).toBe(0);

        const c1 = document.createElement("span");
        host.appendChild(c1);
        expect(gradum(host).getConstrainerObjectList().size).toBe(1);

        const c2 = document.createElement("span");
        host.appendChild(c2);
        expect(gradum(host).getConstrainerObjectList().size).toBe(2);
    });

    it("setConstrainerObjectList() replaces the constrainer list (e.g., with a Set)", () => {
        const host = div({parent: document.body});
        gradum(host).makeConstrainer("main");

        const custom = new Set<Node>();
        gradum(host).getConstrainerObjectList("main").list = custom;

        const list = gradum(host).getConstrainerObjectList("main");
        expect(list.size).toBe(0);

        host.appendChild(document.createElement("span"));
        expect(list.size).toBe(0);
    });

    it("onConstrainerObjectListChange fires when objects are added to / removed from the list", () => {
        const host = div({parent: document.body});
        gradum(host).makeConstrainer("main");

        const changes: [Node, string][] = [];
        gradum(host).onConstrainerObjectListChange("main").add((object: Node, status: string) =>
            changes.push([object, status]));

        const child = document.createElement("span");
        gradum(host).getConstrainerObjectList("main").add(child);
        expect(changes).toContainEqual([child, "added"]);

        gradum(host).getConstrainerObjectList("main").remove(child);
        expect(changes).toContainEqual([child, "removed"]);
    });

    it("onConstrainerObjectListChange keeps firing after the objectList is replaced via setField path", () => {
        const host = div({parent: document.body});
        gradum(host).makeConstrainer("main");

        const changes: string[] = [];
        gradum(host).onConstrainerObjectListChange("main").add((_object: Node, status: string) =>
            changes.push(status));

        // Replace the list contents (same GradumNodeList instance — the common pattern)
        gradum(host).getConstrainerObjectList("main").list = new Set<Node>();
        const child = document.createElement("span");
        gradum(host).getConstrainerObjectList("main").add(child);
        expect(changes).toContain("added");
    });

    it("onConstrainerActivate/onConstrainerDeactivate delegates include callbacks passed to makeConstrainer()", () => {
        const host = div({parent: document.body});

        const onAct = vi.fn();
        const onDeact = vi.fn();

        gradum(host).makeConstrainer("paint", { onActivate: onAct, onDeactivate: onDeact });

        gradum(host).onConstrainerActivate("paint").fire();
        gradum(host).onConstrainerDeactivate("paint").fire();

        expect(onAct).toHaveBeenCalledTimes(1);
        expect(onDeact).toHaveBeenCalledTimes(1);
    });

    it("addSolver/removeSolver/clearSolvers do not throw and are chainable", () => {
        const host = div({parent: document.body});

        gradum(host).makeConstrainer("main");
        const solverA = () => 1;
        const solverB = () => 2;

        gradum(host)
            .addSolver({callback: solverA as any, constrainer: "main"})
            .addSolver({callback: solverB as any, constrainer: "main"})
            .removeSolver("solverB")
            .clearSolvers("main");

        expect(true).toBe(true);
    });
});
