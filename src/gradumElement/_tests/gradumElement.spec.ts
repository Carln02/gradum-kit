import {describe, it, expect} from "vitest";
import { GradumElement } from "../gradumElement";
import {define} from "../../decorators/define/define";

@define("te-test")
class TE extends GradumElement {
    attachCount = 0;
    detachCount = 0;
    adoptCount = 0;

    constructor() {
        super();
        this.onAttach.add(() => this.attachCount++);
        this.onDetach.add(() => this.detachCount++);
        this.onAdopt.add(() => this.adoptCount++);
    }
}

describe("GradumElement: lifecycle delegates + initialize", () => {
    it("fires onAttach/onDetach when connected/disconnected", () => {
        const el = new TE();
        expect(el.attachCount).toBe(0);
        expect(el.detachCount).toBe(0);

        document.body.appendChild(el);
        expect(el.attachCount).toBe(1);
        expect(el.detachCount).toBe(0);

        el.remove();
        expect(el.attachCount).toBe(1);
        expect(el.detachCount).toBe(1);
    });

    it("initializeUI calls setup* methods when present", () => {
        class Custom extends GradumElement {
            steps: string[] = [];
            protected setupChangedCallbacks() { this.steps.push("changed"); }
            protected setupUIElements() { this.steps.push("elems"); }
            protected setupUILayout() { this.steps.push("layout"); }
            protected setupUIListeners() { this.steps.push("listeners"); }
        }
        customElements.define("te-y", Custom);

        const el = new Custom();
        el.initialize();

        expect(el.steps).toEqual(["elems", "layout", "listeners", "changed"]);
    });
});