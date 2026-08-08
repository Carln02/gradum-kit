import {describe, expect, it, vi} from "vitest";
import {GradumEventManager} from "../gradumEventManager";
import {ClickMode} from "../gradumEventManager.types";
import {$} from "../../../gradumFunctions/gradumFunctions";
import {GradumKeyEventName} from "../../../types/eventNaming.types";

describe("Key operator → GradumKeyEvent dispatch + mapping", () => {
    it("keydown → keyPressed; keyup → keyReleased; key mapping toggles ClickMode.key tool", () => {
        const mgr = GradumEventManager.create();
        const keyCtl = (mgr as any).keyOperator;

        const pressed = vi.fn();
        const released = vi.fn();
        document.addEventListener(GradumKeyEventName.keyPressed, pressed as any);
        document.addEventListener(GradumKeyEventName.keyReleased, released as any);

        // map 'b' key to 'brush' tool
        const tool = document.createElement("div");
        $(tool).makeTool("brush", {key: "b", manager: mgr});

        // key down fires event and selects 'brush' in key mode (via dispatchOperator)
        keyCtl.keyDown(new KeyboardEvent("keydown", { key: "b", bubbles: true }));
        expect(pressed).toHaveBeenCalledTimes(1);
        expect(mgr.getCurrentToolName(ClickMode.key)).toBe("brush");

        // key up fires release event and clears key mode tool
        keyCtl.keyUp(new KeyboardEvent("keyup", { key: "b", bubbles: true }));
        expect(released).toHaveBeenCalledTimes(1);
        expect(mgr.getCurrentToolName(ClickMode.key)).toBeUndefined();
    });
});