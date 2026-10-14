import {describe, it, expect} from "vitest";
import {GradumElement} from "../../gradumElement/gradumElement";
import {GradumHandler} from "../handler/handler";
import {GradumModel} from "../model/model";
import {GradumOperator} from "../operator/operator";
import {define} from "../../decorators/define/define";
import {effect, signal} from "../../decorators/reactivity/reactivity";
import {handler} from "../../decorators/mvc";
import {gradum} from "../../gradumFunctions/gradumFunctions";

const tick = () => new Promise(resolve => queueMicrotask(resolve as () => void));

class CaptureModel extends GradumModel {
    @signal public mode: string = "tap";
    @handler() public countHandler: CountHandler;
}

class CountHandler extends GradumHandler<CaptureModel> {
    //Counted before the model is touched: a callback that runs against a model just taken away throws,
    //and the delegate swallows that — so "did not append" cannot tell "never ran" from "ran and threw".
    public runs = 0;
    public modes: string[] = [];
    @effect protected follow() {this.runs++; this.modes.push(this.model?.mode);}
}

class CaptureOperator extends GradumOperator<any, any, CaptureModel> {
    public keyName = "capture";
    public heard: string[] = [];
    public seen: string[] = [];
    public keyed: any[] = [];

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        //The ordinary way an operator listens, per the component guide. Recorded before the model is
        //touched, for the reason above.
        this.emitter.add("captured", () => {this.heard.push("captured"); this.model.mode;});
        this.emitter.addKey(value => this.keyed.push(value), "mode");
    }

    @effect protected follow() {this.seen.push(this.model?.mode);}
}

class Panel extends GradumElement<any, any, CaptureModel> {
    public static defaultProperties = {model: CaptureModel, operators: CaptureOperator, handlers: CountHandler};
}
define(Panel, "test-capture-panel");

//Detaching used to take back only what `@listener` and `@behavior` bound. A removed operator went on
//hearing emitter events and re-running effects against the model and view just taken away from it —
//"Cannot read properties of undefined", the very failure the listener registry was added to end.
describe("a detached piece stops hearing about anything", () => {
    it("drops what the operator subscribed on the emitter", () => {
        const panel = Panel.create({parent: document.body});
        const operator = gradum(panel).getOperator("capture") as CaptureOperator;

        panel.emitter.fire("captured");
        expect(operator.heard).toEqual(["captured"]);

        gradum(panel).removeOperator("capture");
        panel.emitter.fire("captured");

        expect(operator.heard).toEqual(["captured"]);
    });

    it("drops its key subscriptions too", () => {
        const panel = Panel.create({parent: document.body});
        const operator = gradum(panel).getOperator("capture") as CaptureOperator;

        panel.emitter.fireKey("hold", "mode");
        expect(operator.keyed).toEqual(["hold"]);

        gradum(panel).removeOperator("capture");
        panel.emitter.fireKey("again", "mode");

        expect(operator.keyed).toEqual(["hold"]);
    });

    it("disposes the operator's effects", async () => {
        const panel = Panel.create({parent: document.body});
        const operator = gradum(panel).getOperator("capture") as CaptureOperator;
        await tick();
        const before = operator.seen.length;

        gradum(panel).removeOperator("capture");
        panel.model.mode = "hold";
        await tick();

        expect(operator.seen.length).toBe(before);
    });

    it("disposes a handler's effects, which it has had since handlers gained them", async () => {
        const panel = Panel.create({parent: document.body});
        const counter = panel.model.countHandler;
        await tick();
        expect(counter.modes).toEqual(["tap"]);
        const before = counter.runs;

        gradum(panel).removeHandler("count");
        panel.model.mode = "hold";
        await tick();

        expect(counter.runs).toBe(before);
    });

    it("hears everything again when added back", async () => {
        const panel = Panel.create({parent: document.body});
        const operator = gradum(panel).getOperator("capture") as CaptureOperator;
        gradum(panel).removeOperator("capture");

        gradum(panel).addOperator(operator);
        await tick();

        panel.emitter.fire("captured");
        expect(operator.heard).toEqual(["captured"]);

        panel.model.mode = "hold";
        await tick();
        //The effect was disposed on the way out and built again on the way back in; a disposed one cannot
        //be restarted, so this is what proves the round-trip.
        expect(operator.seen.at(-1)).toBe("hold");
    });

    it("subscribes once per round-trip rather than stacking up", () => {
        const panel = Panel.create({parent: document.body});
        const operator = gradum(panel).getOperator("capture") as CaptureOperator;

        for (let round = 0; round < 3; round++) {
            gradum(panel).removeOperator("capture");
            gradum(panel).addOperator(operator);
        }
        operator.heard.length = 0;
        panel.emitter.fire("captured");

        expect(operator.heard).toEqual(["captured"]);
    });

    it("leaves other pieces' subscriptions alone", () => {
        const panel = Panel.create({parent: document.body});
        const operator = gradum(panel).getOperator("capture") as CaptureOperator;
        const other: string[] = [];
        panel.emitter.add("captured", () => other.push("still here"));

        gradum(panel).removeOperator("capture");
        panel.emitter.fire("captured");

        expect(other).toEqual(["still here"]);
        expect(operator.heard).toEqual([]);
    });
});
