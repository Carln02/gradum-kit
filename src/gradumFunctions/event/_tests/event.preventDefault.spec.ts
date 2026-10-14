import { describe, it, expect, vi } from "vitest";
import {div} from "../../../elementCreation/basicElements";
import {gradum} from "../../gradumFunctions";
import {Propagation} from "../event.types";

describe("preventDefaults + removeAllListeners", () => {
    it("preventDefaults adds handlers that call preventDefault", () => {
        const node = div({id: "pd"});

        gradum(node).preventDefaults = {types: ["click"]};

        const ev = new Event("click", {bubbles: true, cancelable: true});
        gradum(node).executeAction("click", undefined, ev);

        //Propagation is not this feature's business — `stop` is the option for that, and it is off.
        expect(ev.defaultPrevented).toBe(true);
    });

    it("removeAllListeners clears both bound and preventDefaults handlers", () => {
        const node = div({id: "rm"});

        const generic = vi.fn().mockReturnValue(Propagation.stopImmediatePropagation);
        gradum(node).on("click", generic);
        gradum(node).preventDefaults = {types: ["click"]};

        let ev = new Event("click", { bubbles: true, cancelable: true });
        let consumed = gradum(node).executeAction("click", undefined, ev);
        expect(consumed).toBe(Propagation.stopImmediatePropagation);
        expect(generic).toHaveBeenCalledTimes(1);

        gradum(node).removeAllListeners();

        ev = new Event("click", { bubbles: true, cancelable: true });
        consumed = gradum(node).executeAction("click", undefined, ev);
        expect(consumed).toBe(Propagation.propagate);
    });
});
