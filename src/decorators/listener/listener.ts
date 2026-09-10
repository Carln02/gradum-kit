import {ListenerProperties} from "../../gradumComponents/datatypes/listener/listener.types";
import {camelToKebabCase} from "../../utils/conversions/string";
import {DefaultEventName} from "../../types/eventNaming.types";
import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {ListenerUtils} from "./listener.utils";
import {ToolBehaviorOptions} from "../../gradumFunctions/tool/tool.types";

const utils = new ListenerUtils();

/**
 * @decorator
 * @function listener
 * @group Decorators
 * @category Listeners
 *
 * @description Method decorator that registers the decorated method as an event listener, to be attached later
 * via {@link attachListenersAndBehaviors}. Usable on elements (`GradumElement`, `GradumHeadlessElement`,
 * `GradumProxiedElement`), views, operators, and interactors: each attaches what it declares when it
 * initializes.
 *
 * What the listener binds to, unless `properties.target` names it: the instance itself when it is a node, and
 * otherwise its `element`. A headless element is neither, so it has to name its target.
 * @param {Partial<Omit<ListenerProperties, "callback">>} [properties={}] - Listener configuration. Values
 * will be merged with the detected defaults. If `properties.type` is omitted, the name of the method will be used
 * to derive the event name from {@link DefaultEventName}.
 *
 * @example ```ts
 * class MyElement {
 *   @listener() click(e: Event) { ... }
 *   //Equivalent to: gradum(this).on(DefaultEventName.click, (e: Event) => { ... });
 * }
 * ```
 * @example ```ts
 * class MyHeadlessElement {
 *   @listener({target: document}) gradumClick(e: GradumEvent) { ... }
 *   //Nothing of its own to listen on, so it says where to listen.
 * }
 * ```
 */
function listener(properties: Partial<Omit<ListenerProperties, "callback">> = {}) {
    return function <T extends object>(
        value: (this: T, e?: Event, target?: Node) => any,
        context: ClassMethodDecoratorContext<T>
    ) {
        //TODO FIX
        GradumEventManager.instance;
        let type = properties.type;
        if (!type) {
            const kebab = camelToKebabCase(String(context.name));
            type = Object.values(DefaultEventName).includes("gradum-" + kebab) ? "gradum-" + kebab : kebab;
        }

        context.addInitializer(function (this: any) {
            utils.addListener(Object.getPrototypeOf(this), {...properties, type, methodName: context.name, kind: "listener"});
        });

        return value;
    };
}

/**
 * @decorator
 * @function behavior
 * @group Decorators
 * @category Listeners
 *
 * @description Method decorator that registers the decorated method as a tool behavior, to be attached later
 * via {@link attachListenersAndBehaviors}.
 * @param {Partial<Omit<ListenerProperties, "callback">>} [properties={}] - Listener configuration. Values
 * will be merged with the detected defaults. If `properties.type` is omitted, the name of the method will be used
 * to derive the event name from {@link DefaultEventName}.
 *
 * @example ```ts
 * class MyElement {
 *   @behavior() click(e: Event) { ... }
 *   //Equivalent to: gradum(this).addToolBehavior(DefaultEventName.click, (e: Event) => { ... });
 * }
 * ```
 */
function behavior(properties: Partial<Omit<ListenerProperties, "callback" | "options">> = {}) {
    return function <T extends object>(
        value: (this: T, e?: Event, target?: Node, options?: ToolBehaviorOptions) => any,
        context: ClassMethodDecoratorContext<T>
    ) {
        //TODO FIX
        GradumEventManager.instance;
        let type = properties.type;
        if (!type) {
            const kebab = camelToKebabCase(String(context.name));
            type = Object.values(DefaultEventName).includes("gradum-" + kebab) ? "gradum-" + kebab : kebab;
        }

        context.addInitializer(function (this: any) {
            utils.addListener(Object.getPrototypeOf(this), {...properties, type, methodName: context.name, kind: "behavior"});
        });

        return value;
    };
}

/**
 * @decorator
 * @function attachListenersAndBehaviors
 * @group Decorators
 * @category Listeners
 *
 * @description Attach all previously-decorated listeners and behaviors recorded on the given `context`. It attempts to
 * resolve defaults from the latter, such as the `target`, `toolName`, `options`, and `manager`. This method is called
 * automatically when an element, view, or operator initializes, so declaring a listener is all that is needed.
 *
 * A declaration with no target to bind to is skipped: `@listener` on something that is neither a node nor holds
 * one does nothing until it names a `target`.
 *
 * Calling it again re-attaches from scratch: whatever it bound last time is taken back first, so a context whose
 * target has changed ends up bound once, to the new one.
 * @param {any} context - The object/instance/prototype to attach the listeners and behaviors defined for it.
 */
function attachListenersAndBehaviors(context: any) {
    if (!context || typeof context !== "object") return;
    detachListenersAndBehaviors(context);
    const listeners = utils.getAllListeners(context);
    if (!listeners || listeners.size === 0) return;

    const defaultTarget = context.target instanceof Node
        ? context.target : context instanceof Node
        ? context : context.element instanceof Node
            ? context.element : undefined;

    const defaultTool = typeof context.toolName === "string" ? context.toolName : undefined;
    const defaultOptions = typeof context.options === "object" ? context.options : undefined;
    const defaultManager = context.manager instanceof GradumEventManager ? context.manager : undefined;

    for (const [, listener] of listeners) {
        const method = context[listener.methodName];
        if (typeof method !== "function") continue;

        const target = listener.target ?? defaultTarget;
        const tool = listener.toolName ?? defaultTool;
        const manager = listener.manager ?? defaultManager;

        if (listener.kind === "behavior") {
            if (!tool) continue;
            const callback = (e: Event, el: Node, options?: ToolBehaviorOptions) =>
                method.call(context, e, el, options);
            (callback as any).sourceFunction = method;
            gradum(context).addToolBehavior(listener.type, callback, tool, manager);
            utils.addAttachment(context, {kind: "behavior", type: listener.type, toolName: tool, callback, manager});
        } else if (listener.kind === "listener") {
            if (!(target instanceof Node)) continue;
            const callback = (e: Event, el: Node) => method.call(context, e, el);
            gradum(target).onTool(listener.type, tool, callback, listener.options ?? defaultOptions, manager);
            utils.addAttachment(context,
                {kind: "listener", target, type: listener.type, toolName: tool, callback, manager});
        }
    }
}

/**
 * @function detachListenersAndBehaviors
 * @group Decorators
 * @category Listeners
 *
 * @description Take back every listener and behavior {@link attachListenersAndBehaviors} bound for the given
 * context, and nothing else. Called for you when an operator, interactor, tool, or constrainer is removed from
 * an element, so a piece that has been taken off stops responding to events.
 * @param {any} context - The object whose bindings should be taken back.
 */
function detachListenersAndBehaviors(context: any) {
    if (!context || typeof context !== "object") return;
    utils.removeAttachments(context);
}

/**
 * @function reattachListenersAndBehaviors
 * @group Decorators
 * @category Listeners
 *
 * @description Bind the context's listeners and behaviors again, but only if they were ever bound in the first
 * place. For anything that has to be re-bound when what it listens on changes, without that change reaching
 * forward and attaching listeners to something that has not initialized yet.
 * @param {any} context - The object to re-bind.
 * @returns {boolean} Whether anything was re-bound.
 */
function reattachListenersAndBehaviors(context: any): boolean {
    if (!context || typeof context !== "object" || !utils.hasAttachments(context)) return false;
    attachListenersAndBehaviors(context);
    return true;
}

export {listener, behavior, attachListenersAndBehaviors, detachListenersAndBehaviors, reattachListenersAndBehaviors};