import {GradumSelector} from "../gradumSelector";
import {GradumModel} from "../../mvc/model/model";
import {GradumView} from "../../mvc/view/view";
import {GradumEmitter} from "../../mvc/emitter/emitter";
import {GradumOperator} from "../../mvc/operator/operator";
import {GradumInteractor} from "../../mvc/interactor/interactor";
import {GradumTool} from "../../mvc/tool/tool";
import {GradumConstrainer} from "../../mvc/constrainer/constrainer";
import {KeyType} from "../../types/basic.types";
import {GradumHandler} from "../../mvc/handler/handler";
import {MvcManyInstancesOrConstructors} from "./mvc.types";

/**
 * @internal
 * @type {MvcData}
 * @description The MVC pieces bound to one element — model, view, emitter, and the operator, interactor,
 * tool, and constrainer maps — plus the two callbacks the element registers on its emitter so model
 * changes reach it. Created on first access and kept per element.
 * @property {GradumModel<object>} [metadata] - The element's key-value store, created on first access.
 * @property {GradumModel} [model] - The bound model, if one was set.
 * @property {GradumView} [view] - The bound view, if one was set.
 * @property {GradumEmitter} [emitter] - The bound emitter, if one was set.
 * @property {Map<string, GradumOperator>} operators - Operators by key name.
 * @property {Map<string, GradumInteractor>} interactors - Interactors by key name.
 * @property {Map<string, GradumTool>} tools - Tools by key name.
 * @property {Map<string, GradumConstrainer>} constrainers - Constrainers by key name.
 * @property {(value: any, key: string) => void} emitterCallback - Relays named emitter events to the element.
 * @property {(value: any, ...keys: KeyType[]) => void} emitterKeyCallback - Relays key-path events to the element.
 */
type MvcData = {
    metadata?: GradumModel<object>;
    model?: GradumModel;
    view?: GradumView;
    emitter?: GradumEmitter;
    operators: Map<string, GradumOperator>;
    interactors: Map<string, GradumInteractor>;
    tools: Map<string, GradumTool>;
    constrainers: Map<string, GradumConstrainer>;
    emitterCallback: (value: any, key: string) => void;
    emitterKeyCallback: (value: any, ...keys: KeyType[]) => void;
};

/**
 * @internal
 * @description Key under which a raw DOM node stores the {@link GradumProxiedElement} wrapping it, so MVC
 * pieces are constructed against the public wrapper rather than the underlying node.
 */
export const proxyWrapperSymbol = Symbol("__proxyWrapper__");

/**
 * @internal
 * @class MvcFunctionsUtils
 * @description Shared helpers and per-element state behind the MVC functions on {@link GradumSelector}.
 */
export class MvcFunctionsUtils {
    private dataMap = new WeakMap<object, MvcData>;
    private modelLookupMap = new WeakMap<GradumModel, Set<object>>;

    public peek(element: object): MvcData | undefined {
        if (element instanceof GradumSelector) element = element.element;
        if (element instanceof GradumModel) element = this.modelLookupMap.get(element)?.values().next().value;
        return element ? this.dataMap.get(element) : undefined;
    }

    public data(element: object): MvcData {
        if (element instanceof GradumSelector) element = element.element;
        if (element instanceof GradumModel) element = this.modelLookupMap.get(element)?.values().next().value;
        if (!element) return;
        let entry = this.dataMap.get(element);
        if (!entry) {
            entry = {
                emitter: new GradumEmitter(),
                operators: new Map(), constrainers: new Map(), interactors: new Map(), tools: new Map(),
                emitterCallback: (key: string, ...values: any[]) => entry.emitter?.fire(key, ...values),
                emitterKeyCallback: (value: any, ...keys: KeyType[]) => entry.emitter?.fireKey(value, ...keys)
            };
            this.dataMap.set(element, entry);
        }
        return entry;
    }

    public attachModel(element: object, model: GradumModel, attach: boolean = true) {
        if (!element || !model) return;
        if (attach && !this.modelLookupMap.has(model)) this.modelLookupMap.set(model, new Set());
        if (attach) this.modelLookupMap.get(model).add(element);
        else this.modelLookupMap.get(model).delete(element);
    }

    public updateModel(element: object, model: GradumModel, attach: boolean = true) {
        if (!element || !model) return;
        const mvc = this.peek(element);
        if (!mvc) return;
        if (attach) {
            if (!model.onKeyChanged.has(mvc.emitterKeyCallback)) model.onKeyChanged.add(mvc.emitterKeyCallback);
            model.fireCallbackHook = mvc.emitterCallback;
        } else {
            model.onKeyChanged.remove(mvc.emitterKeyCallback);
            model.fireCallbackHook = undefined;
        }
    }

    public updateView(element: object, view: GradumView, attach: boolean = true) {
        if (!view || !element) return;
        const mvc = this.peek(element);
        if (!mvc) return;
        view.emitter = attach ? mvc.emitter : undefined;
        view.model = attach ? mvc.model : undefined;
    }

    public updateEmitter(element: object, emitter: GradumEmitter, attach: boolean = true) {
        if (!emitter || !element) return;
        const mvc = this.peek(element);
        if (!mvc) return;
        emitter.model = attach ? mvc.model : undefined;
    }

    public updateOperator(element: object, operator: GradumOperator, attach: boolean = true) {
        if (!operator || !element) return;
        const mvc = this.peek(element);
        if (!mvc) return;
        operator.emitter = attach ? mvc.emitter : undefined;
        operator.model = attach ? mvc.model : undefined;
        operator.view = attach ? mvc.view : undefined;
    }

    public updateHandler(element: object, handler: GradumHandler, attach: boolean = true) {
        if (!element || !handler) return;
        const mvc = this.peek(element);
        if (!mvc) return;
        handler.model = attach ? mvc.model : undefined;
    }

    public updateInteractor(element: object, interactor: GradumInteractor, attach: boolean = true) {
        if (!element || !interactor) return;
        const mvc = this.peek(element);
        if (!mvc) return;
        interactor.model = attach ? mvc.model : undefined;
        interactor.view = attach ? mvc.view : undefined;
        interactor.emitter = attach ? mvc.emitter : undefined;
    }

    public updateTool(element: object, tool: GradumTool, attach: boolean = true) {
        if (!element || !tool) return;
        const mvc = this.peek(element);
        if (!mvc) return;
        tool.model = attach ? mvc.model : undefined;
        tool.view = attach ? mvc.view : undefined;
        tool.emitter = attach ? mvc.emitter : undefined;
    }

    public updateConstrainer(element: object, constrainer: GradumConstrainer, attach: boolean = true) {
        if (!element || !constrainer) return;
        const mvc = this.peek(element);
        if (!mvc) return;
        constrainer.model = attach ? mvc.model : undefined;
        constrainer.view = attach ? mvc.view : undefined;
        constrainer.emitter = attach ? mvc.emitter : undefined;
    }

    public linkPieces(element: object) {
        if (!element) return;
        const mvc = this.peek(element);
        if (!mvc) return;
        this.updateModel(element, mvc.model);
        this.updateEmitter(element, mvc.emitter);
        this.updateView(element, mvc.view);
        mvc.operators.forEach(operator => this.updateOperator(element, operator));
        mvc.model?.handlers.forEach(handler => this.updateHandler(element, handler));
        mvc.interactors.forEach(interactor => this.updateInteractor(element, interactor));
        mvc.tools.forEach(tool => this.updateTool(element, tool));
        mvc.constrainers.forEach(constrainer => this.updateConstrainer(element, constrainer));
    }

    public removeInstance(element: object, kind: string, keyOrInstance: string | object) {
        if (!element) return;
        const map = kind === "handler" ? this.peek(element)?.model?.handlers : this.peek(element)?.[kind + "s"];
        if (!map) return;
        const key = typeof keyOrInstance === "string" ? keyOrInstance
            : Array.from(map.entries()).find(([, v]) => v === keyOrInstance)?.[0];
        if (!key) return;
        const methodName = "update" + kind.charAt(0).toUpperCase() + kind.slice(1);
        this[methodName]?.(element, map.get(key), false);
        map.delete(key);
    }

    public generateInstance<Type>(data: MvcManyInstancesOrConstructors<Type>, element?: object): Type {
        if (!data) return undefined;
        // If element is a raw DOM node backing a GradumProxiedElement, pass the wrapper instead so
        // that view/operator/etc. constructors receive the public class instance (e.g. FlowEntry)
        // rather than the internal <g> element.
        const effectiveElement = element?.[proxyWrapperSymbol] ?? element;
        if (typeof data === "function") return new (data as any)(effectiveElement ? {element: effectiveElement} : undefined);
        return data as Type;
    }

    public generateInstances<Type>(data: MvcManyInstancesOrConstructors<Type>, element?: object): Type[] {
        if (!data) return [];
        if (typeof data !== "object" || !Array.isArray(data)) data = [data];
        const result: Type[] = [];
        data.forEach(constructor => {
            const instance = this.generateInstance(constructor, element);
            if (instance) result.push(instance);
        });
        return result;
    }

    /**
     * @protected
     * @function extractClassEssenceName
     * @description Utility that derives a shorter "essence" key name for an MVC piece from its constructor name.
     * It strips the element/class name prefix (if any) and the type suffix (e.g., "Operator", "Tool") to
     * produce a key that reads well in camelCase (e.g., `MyElementSnapOperator` -> `snap`).
     * @param {object} element - The element the piece is attached to, whose name is stripped from the prefix.
     * @param {new (...args: any[]) => any} constructor - The constructor to derive the name from.
     * @param {string} type - The type suffix to strip (e.g., "Operator", "Handler", "Tool", "Constrainer").
     * @returns {string} A lower-cased, camel-style key name derived from the constructor.
     */
    public extractClassEssenceName(element: object, constructor: new (...args: any[]) => any, type: string): string {
        let className = constructor.name;
        const target = element[proxyWrapperSymbol] ?? element;
        let prototype = Object.getPrototypeOf(target);

        while (prototype && prototype.constructor !== Object) {
            const name = prototype.constructor.name.replaceAll("_", "");
            if (className.startsWith(name)) {
                className = className.slice(name.length);
                break;
            }
            prototype = Object.getPrototypeOf(prototype);
        }

        if (className.endsWith(type)) className = className.slice(0, -(type.length));
        return className.charAt(0).toLowerCase() + className.slice(1);
    }
}
