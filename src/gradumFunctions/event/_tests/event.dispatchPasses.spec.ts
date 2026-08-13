import {describe, it, expect, vi} from "vitest";
import {div} from "../../../elementCreation/basicElements";
import {gradum} from "../../gradumFunctions";

describe("what each pass actually dispatches to", () => {
    it("capture pass: only capture:true listeners, no behaviours", () => {
        const node = div({id: "c1"});
        const plain = vi.fn(), capturing = vi.fn(), behaviour = vi.fn();

        gradum(node).on("click", plain);
        gradum(node).on("click", capturing, {capture: true});
        gradum(node).addToolBehavior("click", behaviour, "brush");
        gradum(node).makeTool("brush");

        gradum(node).executeAction("click", "brush", new Event("click"), {capture: true});

        expect(capturing).toHaveBeenCalledTimes(1);
        expect(plain).not.toHaveBeenCalled();
        expect(behaviour).not.toHaveBeenCalled();
    });

    it("bubble pass: listeners and behaviours both run", () => {
        const node = div({id: "c2"});
        const plain = vi.fn(), behaviour = vi.fn();

        gradum(node).on("click", plain);
        gradum(node).addToolBehavior("click", behaviour, "brush");
        gradum(node).makeTool("brush");

        gradum(node).executeAction("click", "brush", new Event("click"));

        expect(plain).toHaveBeenCalledTimes(1);
        expect(behaviour).toHaveBeenCalledTimes(1);
    });
});
