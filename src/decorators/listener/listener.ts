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
 * via {@link attachListenersAndBehaviors}.
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
 * automatically in the GradumElement lifecycle.
 * @param {any} context - The object/instance/prototype to attach the listeners and behaviors defined for it.
 */
function attachListenersAndBehaviors(context: any) {
    if (!context || typeof context !== "object") return;
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
        } else if (listener.kind === "listener") {
            if (!(target instanceof Node)) continue;
            gradum(target).onTool(listener.type, tool, (e, el) => method.call(context, e, el),
                listener.options ?? defaultOptions, manager);
        }
    }
}

export {listener, behavior, attachListenersAndBehaviors};