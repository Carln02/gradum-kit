import {describe, it, expect, vi} from "vitest";
import {$} from "../../gradumFunctions";
import {div} from "../../../elementCreation/basicElements";
import {GradumEventManager} from "../../../eventHandling/gradumEventManager/gradumEventManager";

describe("Tool: activation", () => {
    it("default activation wires a generic listener that calls manager.setTool(toolName)", () => {
        const host = div({id: "act-1"});
        const setToolSpy = vi.spyOn(GradumEventManager.instance, "setTool");

        $(host).makeTool("brush", {activationEvent: "click"});
        $(host).executeAction("click", undefined as any, new Event("click"));

        expect(setToolSpy).toHaveBeenCalledWith(host, expect.anything());
    });

    it("custom activation via options.activateOn is invoked immediately with (selector, manager)", () => {
        const host = div({id: "act-2"});

        const activate = vi.fn();
        $(host).makeTool("brush", {customActivation: activate});

        expect(activate).toHaveBeenCalledTimes(1);
        const [selArg, mgrArg] = activate.mock.calls[0];

        expect(selArg).toHaveProperty("element", host);
        expect(mgrArg).toBe(GradumEventManager.instance);
    });
});