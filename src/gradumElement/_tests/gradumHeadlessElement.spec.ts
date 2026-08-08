import {describe, it, expect} from "vitest";
import {GradumHeadlessElement} from "../gradumHeadlessElement/gradumHeadlessElement";
import {gradum} from "../../gradumFunctions/gradumFunctions";

describe("GradumHeadlessElement: default properties & MVC accessors", () => {
    it("selected works on headless instances (no DOM element)", () => {
        const h = new GradumHeadlessElement();

        gradum(h).selected = true;
        expect(gradum(h).selected).toBe(true);

        gradum(h).selected = false;
        expect(gradum(h).selected).toBe(false);
    });
});