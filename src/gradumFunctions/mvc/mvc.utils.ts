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
import {disposeEffect, initializeEffects} from "../../decorators/reactivity/reactivity";

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
 * @property {boolean} [initialized] - Whether the element's pieces have been initialized. What tells a piece
 * handed over later that it has missed that pass and has to initialize itself.
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
    initialized?: boolean;
    unbound?: boolean;
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

    public peek(element: object): MvcData | undefined {
        if (element instanceof GradumSelector) element = element.element;
        if (element instanceof GradumModel) element = element.attachedElements[0];
        return element ? this.dataMap.get(element) : undefined;
    }

    public data(element: object): MvcData {
        if (element instanceof GradumSelector) element = element.element;
        if (element instanceof GradumModel) element = element.attachedElements[0];
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
        model.trackAttachment(element, attach);
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
            //The hook holds one element's callback at a time. Detaching another element sharing the model must
            //not cut off the one it points to; detaching the one it points to hands it to a remaining element.
            if (model.fireCallbackHook === mvc.emitterCallback) {
                const remaining = model.attachedElements.find(other => other !== element);
                model.fireCallbackHook = remaining ? this.peek(remaining)?.emitterCallback : undefined;
            }
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

    /**
     * @function unbindPieces
     * @description Tear down whatever on an initialized element is bound to its current view and model, ahead of
     * either one being replaced or removed: the view (or `view`, when given) and every operator and interactor are
     * detached — their DOM, listeners, emitter subscriptions, effects and observers — and the effects of the element,
     * its tools and its constrainers are disposed. {@link bindPieces} builds them again.
     * @param {object} element - The element.
     * @param {GradumView} [view] - The view to detach, when it is not (or no longer) the one on record.
     */
    public unbindPieces(element: object, view: GradumView = this.peek(element)?.view) {
        const mvc = this.peek(element);
        if (!mvc) return;
        view?.detach?.();
        mvc.operators.forEach(operator => operator.detach());
        mvc.interactors.forEach(interactor => interactor.detach());
        [element, ...mvc.tools.values(), ...mvc.constrainers.values()].forEach(piece => disposeEffect(piece));
    }

    /**
     * @function bindPieces
     * @description Build again what {@link unbindPieces} tore down, against the element's current view and model:
     * the UI phases run across the view, operators and interactors one phase at a time (as when the element
     * initializes), then each of them initializes, and the effects of the element, its tools and its
     * constrainers start again so they read the new pieces.
     * @param {object} element - The element.
     */
    public bindPieces(element: object) {
        const mvc = this.peek(element);
        if (!mvc) return;
        this.linkPieces(element);
        const uiPieces = [mvc.view, ...mvc.operators.values(), ...mvc.interactors.values()];
        uiPieces.forEach(piece => piece?.initializeUIElements?.());
        uiPieces.forEach(piece => piece?.initializeUILayout?.());
        uiPieces.forEach(piece => piece?.initialize?.());
        [element, ...mvc.tools.values(), ...mvc.constrainers.values()].forEach(piece => initializeEffects(piece));
    }

    public removeInstance(element: object, kind: string, keyOrInstance: string | object) {
        if (!element) return;
        const map = kind === "handler" ? this.peek(element)?.model?.handlers : this.peek(element)?.[kind + "s"];
        if (!map) return;
        const key = typeof keyOrInstance === "string" ? keyOrInstance
            : Array.from(map.entries()).find(([, v]) => v === keyOrInstance)?.[0];
        if (!key) return;
        const instance = map.get(key);
        //Unlinking the model, view and emitter is not enough on its own: the piece's listeners would go on
        //firing, now against the references just taken away from it. It is let go of first, then unlinked.
        instance?.detach?.();
        const methodName = "update" + kind.charAt(0).toUpperCase() + kind.slice(1);
        this[methodName]?.(element, instance, false);
        map.delete(key);
    }

    /**
     * @function keyIsTaken
     * @description Whether the key an MVC piece derived is already spoken for, and say so out loud when it is
     * spoken for by something else. Two classes whose essence names come out the same — a hazard of deriving
     * keys from class names — would otherwise have the second one quietly discarded, leaving nothing to
     * explain why its listeners never fire.
     * @param {Map<string, any>} map - The map the piece would be registered in.
     * @param {string} key - The key it derived or was given.
     * @param {object} instance - The piece being registered.
     * @param {string} kind - What kind of piece it is, for the warning.
     * @returns {boolean} Whether registration should be skipped.
     */
    public keyIsTaken(map: Map<string, any>, key: string, instance: object, kind: string): boolean {
        if (!map) return false;
        const existing = map.get(key);
        if (existing === undefined) return false;
        //Re-adding the same piece is the idempotent case this check exists for, and stays quiet.
        if (existing !== instance) console.warn(
            `Gradum: ${instance?.constructor?.name} was not added — the ${kind} key "${key}" on this element `
            + `already belongs to ${existing?.constructor?.name}. Give one of them a distinct keyName.`);
        return true;
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
