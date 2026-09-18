import {GradumSelector} from "../gradumSelector";
import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {ToolBehaviorCallback} from "./tool.types";
import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";
import {Propagation} from "../event/event.types";
import {ListenerSet} from "../../gradumComponents/datatypes/listener/listenerSet";
import {Listener} from "../../gradumComponents/datatypes/listener/listener";

/**
 * @internal
 * @type {ElementData}
 * @description The tool state held against one element, per event manager: which tools it is, which it
 * ignores, the target its tools act on when embedded, and the activation delegates. Distinct from the
 * `ElementData` types in the constrainer and element utils, which track unrelated state.
 * @property {Set<string>} tools - Names of the tools this element is.
 * @property {boolean} ignoreAllTools - Whether every tool skips this element.
 * @property {Map<string, "all" | Set<string>>} ignoredTools - Per-tool ignore rules.
 * @property {Node} [embeddedTarget] - The node the element's tools act on, when embedded elsewhere.
 * @property {Map<string, Delegate<() => void>>} activationDelegates - Fired when a named tool activates.
 * @property {Map<string, Delegate<() => void>>} deactivationDelegates - Fired when a named tool deactivates.
 * @property {Map<string, Delegate<(target: Node) => void>>} engagementDelegates - Fired when this element
 * becomes the one a named tool is being used through.
 * @property {Map<string, Delegate<(target: Node) => void>>} disengagementDelegates - Fired when another
 * element takes over.
 */
type ElementData = {
    tools: Set<string>,
    ignoreAllTools: boolean,
    ignoredTools: Map<string, "all" | Set<string>>,
    embeddedTarget?: Node,
    activationDelegates: Map<string, Delegate<() => void>>,
    deactivationDelegates: Map<string, Delegate<() => void>>,
    engagementDelegates: Map<string, Delegate<(target: Node, toolInstance: object) => void>>,
    disengagementDelegates: Map<string, Delegate<(target: Node, toolInstance: object) => void>>
};

/**
 * @internal
 * @type {ToolData}
 * @description The behaviors registered for one named tool on one event manager, and which of the elements
 * carrying that tool is currently being used through.
 * @property {ListenerSet<Node, ToolBehaviorCallback>} behaviors - The tool's capture-phase behaviors.
 * @property {WeakRef<Node>} [engagedHost] - The element the tool is currently being used through. Held
 * weakly: being engaged never keeps an element alive.
 * @property {WeakRef<Node>} [engagedTarget] - What that element's tool was acting on, kept so it can be
 * named again when the element is disengaged.
 */
type ToolData = {
    behaviors: ListenerSet<Node, ToolBehaviorCallback>,
    engagedHost?: WeakRef<Node>,
    engagedTarget?: WeakRef<Node>
};

/**
 * @internal
 * @class ToolFunctionsUtils
 * @description Shared helpers and per-element state behind the tool functions on {@link GradumSelector}.
 */
export class ToolFunctionsUtils {
    private elements: WeakMap<Node, WeakMap<GradumEventManager, ElementData>> = new WeakMap();
    private tools: WeakMap<GradumEventManager, Map<string, ToolData>> = new WeakMap();

    private getOrCreate<Key, Value>(map: Map<Key, Value>, key: Key, factory: () => Value): Value;
    private getOrCreate<Key extends object, Value>(map: WeakMap<Key, Value>, key: Key, factory: () => Value): Value;
    private getOrCreate(map: any, key: any, factory: () => any): any {
        let value = map.get(key);
        if (!value) {
            value = factory();
            map.set(key, value);
        }
        return value;
    }

    public getElementData(element: Node, manager: GradumEventManager): ElementData {
        if (element instanceof GradumSelector) element = element.element;
        const es = this.getOrCreate(this.elements, element,
            () => new WeakMap());
        return this.getOrCreate(es, manager, () => ({
            tools: new Set(),
            ignoreAllTools: false,
            ignoredTools: new Map(),
            activationDelegates: new Map(),
            deactivationDelegates: new Map(),
            engagementDelegates: new Map(),
            disengagementDelegates: new Map(),
        }));
    }

    private getToolsData(manager: GradumEventManager, toolName: string): ToolData {
        const byTool = this.getOrCreate(this.tools, manager, () => new Map());
        return this.getOrCreate(byTool, toolName, () => ({
            behaviors: new ListenerSet()
        }));
    }

    public getActivationDelegate(element: Node, toolName: string, manager: GradumEventManager): Delegate<() => void> {
        const map = this.getElementData(element, manager).activationDelegates;
        if (!map.get(toolName)) map.set(toolName, new Delegate());
        return map.get(toolName);
    }

    public getDeactivationDelegate(element: Node, toolName: string, manager: GradumEventManager): Delegate<() => void> {
        const map = this.getElementData(element, manager).deactivationDelegates;
        if (!map.get(toolName)) map.set(toolName, new Delegate());
        return map.get(toolName);
    }

    public getEngagementDelegate(element: Node, toolName: string,
                                 manager: GradumEventManager): Delegate<(target: Node, toolInstance: object) => void> {
        const map = this.getElementData(element, manager).engagementDelegates;
        if (!map.get(toolName)) map.set(toolName, new Delegate());
        return map.get(toolName);
    }

    public getDisengagementDelegate(element: Node, toolName: string,
                                    manager: GradumEventManager): Delegate<(target: Node, toolInstance: object) => void> {
        const map = this.getElementData(element, manager).disengagementDelegates;
        if (!map.get(toolName)) map.set(toolName, new Delegate());
        return map.get(toolName);
    }

    /**
     * @function engageTool
     * @description Note which element a named tool is being used through, and tell the elements involved
     * when that changes. Nothing fires while the same element keeps being used, however many events it
     * takes — engagement is about which one, not about how often.
     * @param {Node} host - The element the tool is being used through.
     * @param {string} toolName - The name of the tool.
     * @param {Node} target - What that element's tool is acting on.
     * @param {GradumEventManager} manager - The associated event manager.
     */
    public engageTool(host: Node, toolName: string, target: Node, manager: GradumEventManager): void {
        if (host instanceof GradumSelector) host = host.element;
        const data = this.getToolsData(manager, toolName);

        const previousHost = data.engagedHost?.deref();
        if (previousHost === host) return;

        const toolInstance = this.getToolInstance(toolName, manager);

        //The one being let go of is told what it was working on, not what the new one is about to.
        if (previousHost) this.getDisengagementDelegate(previousHost, toolName, manager)
            .fire(data.engagedTarget?.deref(), toolInstance);

        data.engagedHost = host ? new WeakRef(host) : undefined;
        data.engagedTarget = target ? new WeakRef(target) : undefined;
        if (host) this.getEngagementDelegate(host, toolName, manager).fire(target, toolInstance);
    }

    /**
     * @function getToolInstance
     * @description The tool object a named tool's behaviors run against. A behavior is registered once per
     * name, by whichever element carrying it got there first, so every element sharing that name shares this
     * one object — which is what an element sets up when it is engaged.
     * @param {string} toolName - The name of the tool.
     * @param {GradumEventManager} manager - The associated event manager.
     * @returns {object} The tool object, or `undefined` if nothing has registered a behavior for that name.
     */
    public getToolInstance(toolName: string, manager: GradumEventManager): object {
        const behaviors = this.getToolsData(manager, toolName).behaviors?.getListeners({toolName, manager});
        for (const behavior of behaviors ?? []) {
            const instance = (behavior.callback as any)?.instance;
            if (instance) return instance;
        }
        return undefined;
    }

    /**
     * @function getEngagedTool
     * @description The element a named tool is currently being used through.
     * @param {string} toolName - The name of the tool.
     * @param {GradumEventManager} manager - The associated event manager.
     * @returns {Node} The engaged element, or `undefined` if the tool has not been used yet.
     */
    public getEngagedTool(toolName: string, manager: GradumEventManager): Node {
        return this.getToolsData(manager, toolName).engagedHost?.deref();
    }

    public saveTool(element: Node, toolName: string, manager: GradumEventManager): void {
        if (element instanceof GradumSelector) element = element.element;
        if (!element) return;
        this.getElementData(element, manager).tools.add(toolName);
    }

    public getToolNames(element: Node, manager: GradumEventManager): string[] {
        if (element instanceof GradumSelector) element = element.element;
        if (!element) return [];
        return [...this.getElementData(element, manager).tools];
    }

    public setEmbeddedToolTarget(element: Node, target: Node, manager: GradumEventManager): void {
        if (target instanceof GradumSelector) target = target.element;
        if (!target) return;
        if (element instanceof GradumSelector) element = element.element;
        if (!element) return;
        this.getElementData(element, manager).embeddedTarget = target;
    }

    public getEmbeddedToolTarget(element: Node, manager: GradumEventManager): Node {
        if (element instanceof GradumSelector) element = element.element;
        if (!element) return;
        return this.getElementData(element, manager).embeddedTarget;
    }

    public addToolBehavior(toolName: string, type: string, callback: ToolBehaviorCallback, manager: GradumEventManager): void {
        const behaviors = this.getToolsData(manager, toolName).behaviors;
        if (!behaviors) return;
        const identity = (callback as any)?.sourceFunction ?? callback;
        for (const existing of behaviors.getListeners({toolName, manager, type})) {
            if (((existing.callback as any)?.sourceFunction ?? existing.callback) === identity) return;
        }
        behaviors.addListener({callback, type, toolName, manager});
    }

    public getToolBehaviors(toolName: string, type: string, manager: GradumEventManager): Listener<Node, ToolBehaviorCallback>[] {
        return this.getToolsData(manager, toolName).behaviors?.getListeners({toolName, manager, type});
    }

    public removeToolBehavior(toolName: string, type: string, callback: ToolBehaviorCallback,
                              manager: GradumEventManager): void {
        this.getToolsData(manager, toolName).behaviors?.removeMatchingListeners({toolName, manager, type, callback});
    }

    public removeToolBehaviors(toolName: string, type: string, manager: GradumEventManager): void {
        this.getToolsData(manager, toolName).behaviors?.removeMatchingListeners({toolName, manager, type});
    }

    public clearToolBehaviors(manager: GradumEventManager): void {
        this.getOrCreate(this.tools, manager, () => new Map()).clear();
    }

    public ignoreTool(element: Node, toolName: string, type: string, ignore: boolean, manager: GradumEventManager): void {
        const ignoredTools = this.getElementData(element, manager).ignoredTools;
        if (!type) {
            if (ignore) ignoredTools.set(toolName, "all");
            else ignoredTools.delete(toolName);
        }
        else {
            const ignoredTool = ignoredTools.get(toolName);
            if (!ignore) {
                if (ignoredTool instanceof Set) ignoredTool.delete(type);
                return;
            }
            if (!(ignoredTool instanceof Set)) ignoredTools.set(toolName, new Set());
            (ignoredTools.get(toolName) as Set<string>).add(type);
        }
    }

    public isToolIgnored(element: Node, toolName: string, type: string, manager: GradumEventManager): boolean {
        const ignoredTool = this.getElementData(element, manager).ignoredTools?.get(toolName);
        if (!ignoredTool) return false;
        if (ignoredTool === "all" || !type) return true;
        return ignoredTool.has(type);
    }

    public processPropagation(
        currentPropagation: Propagation | any,
        storedPropagation: Propagation = Propagation.propagate,
        defaultPropagation: Propagation = Propagation.stopPropagation
    ): Propagation {
        const orderedValues = [
            Propagation.propagate,
            Propagation.stopPropagation,
            Propagation.stopImmediatePropagation
        ];

        if (!orderedValues.includes(currentPropagation)) currentPropagation = defaultPropagation;
        return orderedValues.indexOf(currentPropagation) <= orderedValues.indexOf(storedPropagation)
            ? storedPropagation : currentPropagation;
    }
}