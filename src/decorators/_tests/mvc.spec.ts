import {describe, it, expect} from "vitest";
import {operator, handler, interactor, tool, constrainer} from "../mvc";
import {GradumOperator} from "../../mvc/operator/operator";
import {GradumHandler} from "../../mvc/handler/handler";
import {GradumInteractor} from "../../mvc/interactor/interactor";
import {GradumTool} from "../../mvc/tool/tool";
import {GradumConstrainer} from "../../mvc/constrainer/constrainer";
import {GradumHeadlessElement} from "../../gradumElement/gradumHeadlessElement/gradumHeadlessElement";
import {GradumModel} from "../../mvc/model/model";

describe("MVC decorators", () => {
    describe("operator decorator", () => {
        it("infers key from <name>Operator and fetches via getOperator()", () => {
            class DispatchOperator extends GradumOperator {}
            class Host extends GradumHeadlessElement {
                static defaultProperties = {operators: DispatchOperator};
                @operator() dispatchOperator!: unknown;
            }

            const h = Host.create();
            expect(h.dispatchOperator).toBeInstanceOf(DispatchOperator);
        });

        it("uses explicit name when provided", () => {
            class MyOperator extends GradumOperator {keyName = "my"}
            class Host extends GradumHeadlessElement {
                static defaultProperties = {operators: MyOperator};
                @operator("my") toolOperator!: unknown;
            }

            const h = Host.create();
            expect(h.toolOperator).toBeInstanceOf(MyOperator);
        });

        it("throws helpful error when operator not found", () => {
            class Host extends GradumHeadlessElement {
                @operator() missingOperator!: unknown;
            }

            const h = Host.create();
            expect(() => (h as any).missingOperator).toThrow(/Operator "missing"/);
        });

        it("setter overrides cached value", () => {
            class AOperator extends GradumOperator {}
            class Host extends GradumHeadlessElement {
                static defaultProperties = {operators: AOperator};
                @operator() aOperator!: unknown;
            }

            const h = Host.create();
            const first = h.aOperator;
            expect(first).toBeInstanceOf(AOperator);

            const second = new AOperator(h as any);
            h.aOperator = second;
            expect(h.aOperator).toBe(second);
            expect(h.aOperator).not.toBe(first);
        });

        it("property is non-enumerable", () => {
            class DemoOperator extends GradumOperator {}
            class Host extends GradumHeadlessElement {
                static defaultProperties = {operators: DemoOperator};
                @operator() demoOperator!: unknown;
            }

            const h = Host.create();
            expect(h.demoOperator).toBeInstanceOf(DemoOperator);
            expect(Object.keys(h)).not.toContain("demoOperator");
        });
    });

    describe("handler decorator", () => {
        it("infers key from <name>Handler and fetches via getHandler()", () => {
            class StateHandler extends GradumHandler {}
            class MyModel extends GradumModel {}
            class Host extends GradumHeadlessElement {
                static defaultProperties = {
                    model: MyModel,
                    handlers: StateHandler
                };
                @handler() stateHandler!: unknown;
            }

            const h = Host.create();
            expect(h.stateHandler).toBeInstanceOf(StateHandler);
        });

        it("uses explicit name for handler", () => {
            class CtxHandler extends GradumHandler {keyName = "ctx"}
            class Host extends GradumHeadlessElement {
                static defaultProperties = {
                    model: GradumModel,
                    handlers: CtxHandler
                };
                @handler("ctx") local!: unknown;
            }

            const h = Host.create();
            expect(h.local).toBeInstanceOf(CtxHandler);
        });

        it("throws when handler not found", () => {
            class Host extends GradumHeadlessElement {
                @handler() missingHandler!: unknown;
            }

            const h = Host.create();
            expect(() => (h as any).missingHandler).toThrow(/Handler "missing"/);
        });
    });

    describe("interactor decorator", () => {
        it("infers key from <name>Interactor and fetches via getInteractor()", () => {
            class DragInteractor extends GradumInteractor {}
            class Host extends GradumHeadlessElement {
                static defaultProperties = {interactors: DragInteractor};
                @interactor() dragInteractor!: unknown;
            }

            const h = Host.create();
            expect(h.dragInteractor).toBeInstanceOf(DragInteractor);
        });

        it("uses explicit name for interactor", () => {
            class MyInteractor extends GradumInteractor {keyName = "my"}
            class Host extends GradumHeadlessElement {
                static defaultProperties = {interactors: MyInteractor};
                @interactor("my") local!: unknown;
            }

            const h = Host.create();
            expect(h.local).toBeInstanceOf(MyInteractor);
        });

        it("throws when interactor not found", () => {
            class Host extends GradumHeadlessElement {
                @interactor() missingInteractor!: unknown;
            }

            const h = Host.create();
            expect(() => (h as any).missingInteractor).toThrow(/Interactor "missing"/);
        });
    });

    describe("tool decorator", () => {
        it("infers key from <name>Tool and fetches via getTool()", () => {
            class SelectTool extends GradumTool {}
            class Host extends GradumHeadlessElement {
                static defaultProperties = {tools: SelectTool};
                @tool() selectTool!: unknown;
            }

            const h = Host.create();
            expect(h.selectTool).toBeInstanceOf(SelectTool);
        });

        it("uses explicit name for tool", () => {
            class MyTool extends GradumTool {keyName = "my"}
            class Host extends GradumHeadlessElement {
                static defaultProperties = {tools: MyTool};
                @tool("my") local!: unknown;
            }

            const h = Host.create();
            expect(h.local).toBeInstanceOf(MyTool);
        });

        it("throws when tool not found", () => {
            class Host extends GradumHeadlessElement {
                @tool() missingTool!: unknown;
            }

            const h = Host.create();
            expect(() => (h as any).missingTool).toThrow(/Tool "missing"/);
        });
    });

    describe("constrainer decorator", () => {
        it("infers key from <name>Constrainer and fetches via getConstrainer()", () => {
            class GridConstrainer extends GradumConstrainer {}
            class Host extends GradumHeadlessElement {
                static defaultProperties = {constrainers: GridConstrainer};
                @constrainer() gridConstrainer!: unknown;
            }

            const h = Host.create();
            expect(h.gridConstrainer).toBeInstanceOf(GridConstrainer);
        });

        it("uses explicit name for constrainer", () => {
            class MyConstrainer extends GradumConstrainer {keyName = "my"}
            class Host extends GradumHeadlessElement {
                static defaultProperties = {constrainers: MyConstrainer};
                @constrainer("my") local!: unknown;
            }

            const h = Host.create();
            expect(h.local).toBeInstanceOf(MyConstrainer);
        });

        it("throws when constrainer not found", () => {
            class Host extends GradumHeadlessElement {
                @constrainer() missingConstrainer!: unknown;
            }

            const h = Host.create();
            expect(() => (h as any).missingConstrainer).toThrow(/Constrainer "missing"/);
        });
    });
})
