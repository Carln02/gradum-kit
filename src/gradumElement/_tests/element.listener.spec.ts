import {describe, it, expect} from "vitest";
import {GradumElement} from "../gradumElement";
import {GradumHeadlessElement} from "../gradumHeadlessElement/gradumHeadlessElement";
import {GradumProxiedElement} from "../gradumProxiedElement/gradumProxiedElement";
import {GradumView} from "../../mvc/view/view";
import {define} from "../../decorators/define/define";
import {listener} from "../../decorators/listener/listener";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {div} from "../../elementCreation/basicElements";

const click = (target: Node) => gradum(target).executeAction("gradum-click", null, new Event("gradum-click"));

@define("listener-element")
class ListeningElement extends GradumElement {
    public clicks: number = 0;

    @listener() public gradumClick(): void {
        this.clicks++;
    }
}

//The reason listeners are attached by `initialize` rather than by `setupUIListeners`: an element is free to
//override that method, and forgetting `super` should not quietly cost it every listener it declared.
@define("listener-element-override")
class OverridingElement extends ListeningElement {
    public setUp: boolean = false;

    protected setupUIListeners(): void {
        this.setUp = true;
    }
}

describe("an element listens for what it declares", () => {
    it("fires a declared listener once initialized", () => {
        const element = ListeningElement.create({parent: document.body}) as ListeningElement;
        expect(element.clicks).toBe(0);

        click(element);
        expect(element.clicks).toBe(1);
    });

    it("keeps them through an override of setupUIListeners that forgets super", () => {
        const element = OverridingElement.create({parent: document.body}) as OverridingElement;
        expect(element.setUp).toBe(true);

        click(element);
        expect(element.clicks).toBe(1);
    });

    it("does not fire before the element is initialized", () => {
        const element = new ListeningElement();
        click(element);
        expect(element.clicks).toBe(0);
    });
});

describe("a proxied element listens on the element it wraps", () => {
    class ListeningProxy extends GradumProxiedElement<"div"> {
        public clicks: number = 0;

        @listener() public gradumClick(): void {
            this.clicks++;
        }
    }

    it("binds to the wrapped element, since that is what the events reach", () => {
        const proxy = ListeningProxy.create({tag: "div", parent: document.body}) as ListeningProxy;

        click(proxy.element);
        expect(proxy.clicks).toBe(1);
    });
});

describe("a headless element listens wherever it is told to", () => {
    class ListeningHeadless extends GradumHeadlessElement {
        public clicks: number = 0;

        //Headless: there is no element of its own for a listener to sit on, so it names its target.
        @listener({target: document}) public gradumClick(): void {
            this.clicks++;
        }
    }

    class UntargetedHeadless extends GradumHeadlessElement {
        public clicks: number = 0;

        @listener() public gradumClick(): void {
            this.clicks++;
        }
    }

    it("fires on the target it names", () => {
        const headless = ListeningHeadless.create() as ListeningHeadless;

        click(document);
        expect(headless.clicks).toBe(1);
    });

    it("has nothing to bind to without one", () => {
        const headless = UntargetedHeadless.create() as UntargetedHeadless;

        click(document);
        expect(headless.clicks).toBe(0);
    });
});

describe("a view listens for what it declares", () => {
    class ListeningView extends GradumView {
        public clicks: number = 0;

        @listener() public gradumClick(): void {
            this.clicks++;
        }
    }

    class OverridingView extends ListeningView {
        protected setupUIListeners(): void {
        }
    }

    it("fires a declared listener once initialized", () => {
        const element = div({parent: document.body});
        const view = new ListeningView({element});
        view.initialize();

        click(element);
        expect(view.clicks).toBe(1);
    });

    it("keeps them through an override of setupUIListeners that forgets super", () => {
        const element = div({parent: document.body});
        const view = new OverridingView({element});
        view.initialize();

        click(element);
        expect(view.clicks).toBe(1);
    });
});
