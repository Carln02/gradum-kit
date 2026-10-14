import {describe, it, expect, beforeEach} from "vitest";
import {GradumEventManager} from "../../../eventHandling/gradumEventManager/gradumEventManager";
import {$} from "../../gradumFunctions";
import {div} from "../../../elementCreation/basicElements";

const manager = () => GradumEventManager.instance;
const fire = (node: Node) => $(node).executeAction("click", undefined, new Event("click"));

//The predicate's result used to be passed through as the lock state, and a lock is a veto — so
//`() => true` locked everything *on*, which vetoes nothing and bypassed nothing, while `() => false` was
//what actually stood the manager down. The name, the doc and the one consumer all read `true` as "bypass".
describe("GradumSelector.bypassManagerOn", () => {
    beforeEach(() => {
        manager().unlock();
        manager().enabled = true;
        manager().preventDefaultMouse = true;
    });

    it("stands the manager down when the predicate says to", () => {
        const node = div({parent: document.body});
        $(node).bypassManagerOn = () => true;

        fire(node);

        expect(manager().enabled).toBe(false);
        expect(manager().preventDefaultMouse).toBe(false);
    });

    it("leaves the manager alone when it says not to", () => {
        const node = div({parent: document.body});
        $(node).bypassManagerOn = () => false;

        fire(node);

        expect(manager().enabled).toBe(true);
        expect(manager().preventDefaultMouse).toBe(true);
    });

    it("stands down only the parts it is asked for", () => {
        const node = div({parent: document.body});
        $(node).bypassManagerOn = () => ({preventDefaultMouse: true});

        fire(node);

        //The point of the long form: the browser handles the mouse natively while the manager goes on
        //dispatching.
        expect(manager().preventDefaultMouse).toBe(false);
        expect(manager().enabled).toBe(true);
    });

    it("lets the manager back up when it stops asking", () => {
        const node = div({parent: document.body});
        $(node).bypassManagerOn = () => true;
        fire(node);
        expect(manager().enabled).toBe(false);

        $(node).bypassManagerOn = () => false;
        fire(node);

        expect(manager().enabled).toBe(true);
    });

    it("asks once per event, and asks the predicate it was last given", () => {
        const node = div({parent: document.body});
        let calls = 0;

        $(node).bypassManagerOn = () => {calls++; return false;};
        $(node).bypassManagerOn = () => {calls++; return true;};
        fire(node);

        expect(calls).toBe(1);
        expect(manager().enabled).toBe(false);
    });
});
