import {describe, it, expect} from "vitest";
import {GradumElement} from "../../gradumElement/gradumElement";
import {GradumView} from "../view/view";
import {GradumOperator} from "../operator/operator";
import {define} from "../../decorators/define/define";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {div} from "../../elementCreation/basicElements";

const calls: string[] = [];

class UiHostView extends GradumView<any, any> {
    public panel: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();
        calls.push("view:elements");
        this.panel = div({classes: "panel"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        calls.push("view:layout");
        gradum(this).addChild(this.panel);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        calls.push("view:listeners");
    }

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        calls.push("view:changed");
    }
}

//Adds a badge to the element and a label inside the view's panel, so its layout depends on the view's elements.
class UiHostBadgeOperator extends GradumOperator<UiHost, UiHostView> {
    public badge: HTMLElement;
    public label: HTMLElement;
    public panelAtLayout: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();
        calls.push("badge:elements");
        this.badge = div({classes: "badge"});
        this.label = div({classes: "label"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        calls.push("badge:layout");
        this.panelAtLayout = this.view.panel;
        gradum(this).addChild(this.badge);
        gradum(this.view.panel).addChild(this.label);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        calls.push("badge:listeners");
    }

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        calls.push("badge:changed");
    }
}

class UiHostTagOperator extends GradumOperator {
    protected setupUIElements() {
        super.setupUIElements();
        calls.push("tag:elements");
    }

    protected setupUILayout() {
        super.setupUILayout();
        calls.push("tag:layout");
    }
}

class UiHost extends GradumElement<UiHostView> {
    public static defaultProperties = {
        view: UiHostView,
        operators: [UiHostBadgeOperator, UiHostTagOperator]
    };
}
define(UiHost, "operator-ui-host");

function createHost() {
    calls.length = 0;
    const host = UiHost.create({parent: document.body} as any);
    const badge = gradum(host).getOperator("badge") as UiHostBadgeOperator;
    return {host, badge};
}

describe("operator UI phases", () => {
    it("runs each UI phase across the view and every operator before the next", () => {
        createHost();
        expect(calls.slice(0, 6)).toEqual([
            "view:elements", "badge:elements", "tag:elements",
            "view:layout", "badge:layout", "tag:layout"
        ]);
        expect(calls.slice(6)).toEqual(["view:listeners", "view:changed", "badge:listeners", "badge:changed"]);
    });

    it("lets an operator's layout use the view's elements", () => {
        const {host, badge} = createHost();
        expect(badge.panelAtLayout).toBe(host.querySelector(".panel"));
        expect(badge.label.parentElement).toBe(badge.panelAtLayout);
        expect(badge.badge.parentElement).toBe(host);
    });

    it("runs every phase, in order, when an operator is initialized on its own", () => {
        class UiHostLateOperator extends UiHostTagOperator {}
        const {host} = createHost();
        calls.length = 0;
        gradum(host).addOperator(new UiHostLateOperator({element: host} as any));
        expect(calls).toEqual(["tag:elements", "tag:layout"]);
    });
});

describe("operator UI ownership", () => {
    it("removes the nodes it added when detached, wherever they were added", () => {
        const {host, badge} = createHost();
        const panel = host.querySelector(".panel");
        gradum(host).removeOperator("badge");

        expect(host.querySelector(".badge")).toBeNull();
        expect(panel.querySelector(".label")).toBeNull();
        //The view's own node is not the operator's.
        expect(host.querySelector(".panel")).toBe(panel);
        expect(badge.badge.isConnected).toBe(false);
    });

    it("leaves the nodes of a component it creates to that component", () => {
        class UiInner extends GradumElement<UiHostView> {
            public static defaultProperties = {view: UiHostView};
        }
        define(UiInner, "operator-ui-inner");

        class UiHostInnerOperator extends GradumOperator {
            public inner: UiInner;

            protected setupUIElements() {
                super.setupUIElements();
                //Its view adds a panel into it while this operator's phase is running.
                this.inner = UiInner.create({} as any);
            }

            protected setupUILayout() {
                super.setupUILayout();
                gradum(this).addChild(this.inner);
            }

            public get owned() {
                return this.ownedNodes;
            }
        }

        const {host} = createHost();
        const operator = new UiHostInnerOperator({element: host} as any);
        gradum(host).addOperator(operator);

        expect([...operator.owned]).toEqual([operator.inner]);
        expect(operator.inner.querySelector(".panel")).not.toBeNull();
    });

    it("removes nodes marked with own() too", () => {
        const {host, badge} = createHost();
        const extra = badge.own(div({parent: host, classes: "extra"}));
        expect(extra.isConnected).toBe(true);

        gradum(host).removeOperator("badge");
        expect(extra.isConnected).toBe(false);
    });

    it("rebuilds its UI when initialized again after a detach", () => {
        const {host, badge} = createHost();
        gradum(host).removeOperator("badge");
        expect(host.querySelector(".badge")).toBeNull();

        gradum(host).addOperator(badge);
        expect(host.querySelectorAll(".badge")).toHaveLength(1);
    });

    it("records nothing outside the UI phases", () => {
        const {host, badge} = createHost();
        gradum(host).addChild(div({classes: "later"}));
        gradum(host).removeOperator("badge");
        expect(host.querySelector(".later")).not.toBeNull();
    });
});
