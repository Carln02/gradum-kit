import {describe, expect, it, vi} from "vitest";
import {GradumEventManager} from "../gradumEventManager";
import {div} from "../../../elementCreation/basicElements";
import {$} from "../../../gradumFunctions/gradumFunctions";
import {ClickMode} from "../gradumEventManager.types";

describe("GradumEventManager: tools & locks", () => {
    it("addTool / setTool selects & activates; onToolChange fires", () => {
        const mgr = GradumEventManager.create();

        const toolEl = div({parent: document.body});
        const sel = $(toolEl);
        sel.makeTool("brush", {manager: mgr});

        const onAct = vi.fn();
        const onDeact = vi.fn();
        sel.onToolActivate("brush").add(onAct);
        sel.onToolDeactivate("brush").add(onDeact);

        const fired = vi.fn();
        mgr.onToolChange.add?.(fired);

        mgr.setTool(toolEl, ClickMode.left, {select: true, activate: true});
        expect(mgr.getCurrentToolName(ClickMode.left)).toBe("brush");

        expect(onAct).toHaveBeenCalledTimes(1);
        expect(fired).toHaveBeenCalledTimes(1);
        expect(fired.mock.calls[0]).toEqual([undefined, toolEl, ClickMode.left]);

        const tool2 = div({parent: document.body});
        $(tool2).makeTool("eraser", {manager: mgr});
        mgr.setTool(tool2, ClickMode.left, {select: true, activate: true});
        expect(onDeact).toHaveBeenCalledTimes(1);
        expect(mgr.getCurrentToolName(ClickMode.left)).toBe("eraser");
    });

    it("activates tools registered on a manager other than the shared one", () => {
        //The activation delegates are kept per manager, so a manager has to look them up under itself. A
        //page with its own manager would otherwise register activation callbacks that never run.
        GradumEventManager.create();
        const own = GradumEventManager.create();

        const toolEl = div({parent: document.body});
        $(toolEl).makeTool("stamp", {manager: own});

        const onAct = vi.fn();
        const onDeact = vi.fn();
        $(toolEl).onToolActivate("stamp", own).add(onAct);
        $(toolEl).onToolDeactivate("stamp", own).add(onDeact);

        own.setTool(toolEl, ClickMode.left, {select: true, activate: true});
        expect(onAct).toHaveBeenCalledTimes(1);

        const other = div({parent: document.body});
        $(other).makeTool("plain", {manager: own});
        own.setTool(other, ClickMode.left, {select: true, activate: true});
        expect(onDeact).toHaveBeenCalledTimes(1);
    });

    it("key mapping: setToolByKey picks the mapped tool; key release clears key mode", () => {
        const mgr = GradumEventManager.create();
        const toolEl = div({parent: document.body});
        $(toolEl).makeTool("pan", {key: "p", manager: mgr});

        const ok = mgr.setToolByKey("p");
        expect(ok).toBe(true);
        expect(mgr.getCurrentToolName(ClickMode.key)).toBe("pan");
    });

    it("lock/unlock affects getters", () => {
        const mgr = GradumEventManager.create({enabled: true, preventDefaultMouse: true});
        expect(mgr.enabled).toBe(true);
        mgr.lock(document.body, {enabled: false, preventDefaultMouse: false});
        expect(mgr.enabled).toBe(false);
        expect(mgr.preventDefaultMouse).toBe(false);
        mgr.unlock();
        expect(mgr.enabled).toBe(true);
        expect(mgr.preventDefaultMouse).toBe(true);
    });
});
