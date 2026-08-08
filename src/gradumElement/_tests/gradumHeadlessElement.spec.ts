import {describe, it, expect} from "vitest";
import {GradumHeadlessElement} from "../gradumHeadlessElement/gradumHeadlessElement";

describe("GradumHeadlessElement: default properties & MVC accessors", () => {
    it("selected works on headless instances (no DOM element)", () => {
        const h = new GradumHeadlessElement();

        h.selected = true;
        expect(h.selected).toBe(true);

        h.selected = false;
        expect(h.selected).toBe(false);
    });
});