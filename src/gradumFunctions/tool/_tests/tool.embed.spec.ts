import {describe, it, expect, vi} from "vitest";
import {div} from "../../../elementCreation/basicElements";
import {gradum} from "../../gradumFunctions";
import {Propagation} from "../../event/event.types";

describe("Tool: embedded", () => {
    it("embedTool is a no-op when the element is not a tool", () => {
        const host = div({id: "emb-0"});
        const target = div({id: "emb-0-target"});

        gradum(host).embedTool(target);
        expect(gradum(host).isEmbeddedTool()).toBe(false);
        expect(gradum(host).getEmbeddedToolTarget()).toBeUndefined();
    });

    it("embedTool stores and exposes the embedded target once the node is a tool", () => {
        const host = div({id: "emb-1"});
        const target = div({id: "emb-1-target"});

        gradum(host).makeTool("brush");
        gradum(host).embedTool(target);

        expect(gradum(host).isEmbeddedTool()).toBe(true);
        expect(gradum(host).getEmbeddedToolTarget()).toBe(target);
    });

    it("applyTool runs behaviors on the host (not auto-proxied to embedded)", () => {
        const host = div({id: "emb-2-host"});
        const target = div({id: "emb-2-target"});

        gradum(host).makeTool("brush");
        gradum(host).embedTool(target);

        const def = vi.fn().mockReturnValue(Propagation.stopPropagation);
        gradum(host).addToolBehavior("pointerdown", def, "brush");

        const consumed = gradum(host).applyTool("brush", "pointerdown", new Event("x"));
        expect(consumed).toBe(Propagation.stopPropagation);

        expect(def.mock.calls[0][1]).toBe(host);
    });
});
