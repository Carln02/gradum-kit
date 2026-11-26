import {describe, it, expect} from "vitest";
import {GradumElement} from "../../gradumElement/gradumElement";
import {GradumView} from "../view/view";
import {GradumModel} from "../model/model";
import {GradumOperator} from "../operator/operator";
import {GradumObserver} from "../model/observer";
import {define} from "../../decorators/define/define";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {div} from "../../elementCreation/basicElements";
import {dataSignal, effect} from "../../decorators/reactivity/reactivity";

//Effects re-run on a microtask.
const tick = () => new Promise(resolve => setTimeout(resolve, 20));

class LabelView extends GradumView<any, GradumModel> {
    public panel: HTMLElement;
    public label: HTMLElement;
    public renders = 0;

    protected setupUIElements() {
        super.setupUIElements();
        this.panel = div({classes: "label-panel"});
        this.label = div({parent: this.panel, classes: "label"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild(this.panel);
    }

    @effect protected render() {
        this.renders++;
        this.label.textContent = this.model.get("label");
    }
}

class OtherLabelView extends LabelView {
    protected setupUIElements() {
        super.setupUIElements();
        this.panel.classList.add("other");
    }
}

class ListView extends GradumView<any, GradumModel> {
    public list: HTMLElement;
    public observer: GradumObserver;

    protected setupUIElements() {
        super.setupUIElements();
        this.list = div({classes: "list"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild(this.list);
    }

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        this.observer = this.model.nest("items").generateObserver({
            onAdded: (data) => {
                const item = div({parent: this.list, classes: "item"});
                item.textContent = String(data);
                return item;
            }
        });
    }
}

//Puts a badge inside the view's panel, so it depends on whichever view is current.
class SwapHostBadgeOperator extends GradumOperator<any, LabelView> {
    protected setupUILayout() {
        super.setupUILayout();
        gradum(this.view.panel).addChild(div({classes: "badge"}));
    }
}

class SwapHost extends GradumElement<LabelView> {
    public static defaultProperties = {view: LabelView, operators: SwapHostBadgeOperator};
}
define(SwapHost, "mvc-swap-host");

class PlainHost extends GradumElement<LabelView> {
    public static defaultProperties = {view: LabelView};
}
define(PlainHost, "mvc-swap-plain-host");

class ListHost extends GradumElement<ListView> {
    public static defaultProperties = {view: ListView};
}
define(ListHost, "mvc-swap-list-host");

//No view: the element renders its own data.
class BareHost extends GradumElement {
    @dataSignal() label: string = "";
    public text = "";

    @effect protected render() {
        this.text = this.label;
    }
}
define(BareHost, "mvc-swap-bare-host");

//With signals, so `model.get` inside an effect is tracked.
const model = (data: object) => GradumModel.create({data, initialize: true, makeSignals: true});
const host = (data: object = {label: "a"}) => SwapHost.create({parent: document.body, model: model(data)} as any);

describe("swapping the view", () => {
    it("replaces the old view's DOM with the new one's", () => {
        const element = host();
        const old = element.view;
        gradum(element).view = OtherLabelView;

        expect(element.querySelectorAll(".label-panel")).toHaveLength(1);
        expect(element.querySelector(".label-panel.other .label")?.textContent).toBe("a");
        expect(old.panel.isConnected).toBe(false);
    });

    it("stops the old view's effects", async () => {
        const element = host();
        const old = element.view;
        gradum(element).view = OtherLabelView;
        const before = old.renders;

        gradum(element).model.set("b", "label");
        await tick();
        expect(old.renders).toBe(before);
        expect(element.view.label.textContent).toBe("b");
    });

    it("rebuilds operators against the new view", () => {
        const element = host();
        gradum(element).view = OtherLabelView;
        expect(element.querySelectorAll(".badge")).toHaveLength(1);
        expect(element.view.panel.querySelector(".badge")).not.toBeNull();
    });

    it("removes the view entirely when set to undefined", () => {
        const element = PlainHost.create({parent: document.body, model: model({label: "a"})} as any);
        gradum(element).view = undefined;
        expect(element.querySelector(".label-panel")).toBeNull();
        expect(gradum(element).view).toBeUndefined();
    });
});

describe("swapping the model", () => {
    it("re-renders against the new model and ignores the old one", async () => {
        const element = host({label: "a"});
        const old = gradum(element).model;
        gradum(element).model = model({label: "b"});
        expect(element.view.label.textContent).toBe("b");

        old.set("stale", "label");
        await tick();
        expect(element.view.label.textContent).toBe("b");
        expect(old.attachedElements).not.toContain(element);
    });

    it("destroys the old view's observers", () => {
        const old = model({items: [1, 2]});
        const element = ListHost.create({parent: document.body, model: old} as any);
        expect(element.querySelectorAll(".item")).toHaveLength(2);

        gradum(element).model = model({items: [3]});
        expect([...element.querySelectorAll(".item")].map(item => item.textContent)).toEqual(["3"]);

        old.push(4, "items");
        expect(element.querySelectorAll(".item")).toHaveLength(1);
    });

    it("re-runs the element's own effects against the new model", () => {
        const element = BareHost.create({parent: document.body, data: {label: "a"}} as any);
        expect(element.text).toBe("a");
        gradum(element).model = model({label: "b"});
        expect(element.text).toBe("b");
    });
});

describe("detaching a shared model", () => {
    const shared = () => {
        const data = model({label: "a"});
        const a = SwapHost.create({parent: document.body, model: data} as any);
        const b = SwapHost.create({parent: document.body, model: data} as any);
        return {data, a, b};
    };

    it("knows every element it is attached to", () => {
        const {data, a, b} = shared();
        expect(data.attachedElements).toEqual([a, b]);
    });

    it("detaches from one element and keeps serving the others", async () => {
        const {data, a, b} = shared();
        data.detach(a);

        expect(gradum(a).model).toBeUndefined();
        expect(a.querySelector(".label-panel")).toBeNull();
        expect(data.attachedElements).toEqual([b]);

        data.set("c", "label");
        await tick();
        expect(b.view.label.textContent).toBe("c");
    });

    it("detaches from all elements when given none", () => {
        const {data, a, b} = shared();
        data.detach();
        expect(data.attachedElements).toEqual([]);
        expect(gradum(a).model).toBeUndefined();
        expect(gradum(b).model).toBeUndefined();
    });

    it("rebuilds an element when a model is attached again", () => {
        const {data, a} = shared();
        data.detach(a);
        gradum(a).model = data;
        expect(a.querySelectorAll(".label-panel")).toHaveLength(1);
        expect(a.querySelectorAll(".badge")).toHaveLength(1);
        expect(a.view.label.textContent).toBe("a");
    });

    it("keeps an unbound element torn down when its view changes", () => {
        const {data, a} = shared();
        data.detach(a);
        gradum(a).view = OtherLabelView;
        expect(a.querySelector(".label-panel")).toBeNull();

        gradum(a).model = data;
        expect(a.querySelector(".label-panel.other")).not.toBeNull();
    });

    it("routes fireCallback to a remaining element", () => {
        const {data, a, b} = shared();
        const heard: string[] = [];
        gradum(a).emitter.add("ping", () => heard.push("a"));
        gradum(b).emitter.add("ping", () => heard.push("b"));

        //The hook points at the last element attached; detaching that one must not silence the model.
        data.detach(b);
        data.fireCallback("ping");
        expect(heard).toEqual(["a"]);
    });
});

describe("removeView / removeModel", () => {
    it("removeView removes the view and chains", () => {
        const element = PlainHost.create({parent: document.body, model: model({label: "a"})} as any);
        expect(gradum(element).removeView()).toBe(gradum(element));
        expect(gradum(element).view).toBeUndefined();
        expect(element.querySelector(".label-panel")).toBeNull();
    });

    it("removeModel detaches from that element only", () => {
        const data = model({label: "a"});
        const a = SwapHost.create({parent: document.body, model: data} as any);
        const b = SwapHost.create({parent: document.body, model: data} as any);
        gradum(a).removeModel();

        expect(gradum(a).model).toBeUndefined();
        expect(a.querySelector(".label-panel")).toBeNull();
        expect(data.attachedElements).toEqual([b]);
    });

    it("does nothing when there is nothing to remove", () => {
        const element = PlainHost.create({parent: document.body, model: model({label: "a"})} as any);
        gradum(element).removeView().removeView();
        gradum(element).removeModel().removeModel();
        expect(gradum(element).model).toBeUndefined();
    });
});
