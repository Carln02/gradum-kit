import {ListenerProperties} from "../../gradumComponents/datatypes/listener/listener.types";
import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {gradum} from "../../gradumFunctions/gradumFunctions";

/**
 * @internal
 * @type {ListenerConstructorType}
 * @description Per-constructor record of every listener and behavior declared on a class, collected by
 * the decorators and replayed onto each instance by {@link attachListenersAndBehaviors}.
 * @property {Map<PropertyKey, DecoratorListenerProperties>} listeners - Declarations indexed by method name.
 */
type ListenerConstructorType = {
    listeners: Map<PropertyKey, DecoratorListenerProperties>,
};

/**
 * @internal
 * @type {DecoratorListenerProperties}
 * @description A listener declaration recorded by `@listener` or `@behavior`. It is a
 * {@link ListenerProperties} without its callback, since the method itself supplies that at attach time.
 * @property {PropertyKey} methodName - The decorated method, resolved against the instance when attached.
 * @property {"listener" | "behavior"} kind - Which phase the declaration belongs to: `"listener"` runs in
 * the bubble loop, `"behavior"` in the capture loop.
 */
export type DecoratorListenerProperties = Omit<ListenerProperties, "callback"> & {
    methodName: PropertyKey,
    kind: "listener" | "behavior",
};

/**
 * @internal
 * @type {AttachedListener}
 * @description One listener or behavior actually bound by `attachListenersAndBehaviors`, kept so that it can
 * be taken back later. The callback is the wrapper built at attach time — it exists nowhere else, so without
 * this record nothing could ever name it again.
 * @property {"listener" | "behavior"} kind - Which of the two it was bound as.
 * @property {Node} [target] - The node the listener sits on. Behaviors have none: they belong to a tool.
 * @property {string} type - The event type it was bound for.
 * @property {string} [toolName] - The tool it was bound under, if any.
 * @property {Function} callback - The wrapper that was registered.
 * @property {GradumEventManager} [manager] - The manager it was registered with.
 */
export type AttachedListener = {
    kind: "listener" | "behavior",
    target?: Node,
    type: string,
    toolName?: string,
    callback: any,
    manager?: GradumEventManager,
};

/**
 * @internal
 * @class ListenerUtils
 * @description Stores the listener and behavior declarations gathered from `@listener` and `@behavior`,
 * keyed by prototype, so they can be attached once the instance exists — and, once they have been, what was
 * bound for each instance, so it can be unbound again.
 */
export class ListenerUtils {
    private constructorMap = new WeakMap<object, ListenerConstructorType>();

    /**
     * @description What has actually been bound, per context. Held weakly, so recording an attachment never
     * keeps the interactor or element it belongs to alive.
     */
    private attachedMap = new WeakMap<object, AttachedListener[]>();

    public constructorData(prototype: object) {
        let obj = this.constructorMap.get(prototype);
        if (!obj) {
            obj = {listeners: new Map()};
            this.constructorMap.set(prototype, obj);
        }
        return obj!;
    }

    public addListener(prototype: object, listener: DecoratorListenerProperties) {
        if (!listener.methodName) return;
        const data = this.constructorData(prototype)?.listeners;
        if (!data || data.has(listener.methodName)) return;
        data.set(listener.methodName, listener);
    }

    public getAllListeners(instance: object) {
        let prototype = Object.getPrototypeOf(instance);
        const results: Map<PropertyKey, DecoratorListenerProperties> = new Map();
        while (prototype && prototype !== Object.prototype) {
            const map = this.constructorData(prototype).listeners;
            if (map?.size) for (const [key, value] of map.entries()) {
                if (!results.has(key)) results.set(key, value);
            }
            prototype = Object.getPrototypeOf(prototype);
        }
        return results;
    }

    /**
     * @function addAttachment
     * @description Note one binding against the context that owns it.
     * @param {object} context - The object the binding was made for.
     * @param {AttachedListener} attachment - What was bound, and where.
     */
    public addAttachment(context: object, attachment: AttachedListener) {
        let attached = this.attachedMap.get(context);
        if (!attached) this.attachedMap.set(context, attached = []);
        attached.push(attachment);
    }

    /**
     * @function hasAttachments
     * @description Whether anything has been bound for the given context — which is to say, whether it has
     * ever attached. What tells a re-attach that there is something to redo.
     * @param {object} context - The object to check.
     * @returns {boolean} Whether it holds any bindings.
     */
    public hasAttachments(context: object): boolean {
        return this.attachedMap.has(context);
    }

    /**
     * @function removeAttachments
     * @description Take back every binding noted for the given context, and nothing else.
     *
     * It removes the exact wrappers that were bound, which is what lets it be precise where a caller cannot:
     * the wrapper around a decorated method is built at attach time and kept nowhere a caller could reach, so
     * unbinding a single declaration by hand would otherwise mean clearing every listener of that type on the
     * target.
     * @param {object} context - The object whose bindings should be taken back.
     */
    public removeAttachments(context: object) {
        const attached = this.attachedMap.get(context);
        if (!attached) return;
        this.attachedMap.delete(context);

        for (const entry of attached) {
            if (entry.kind === "behavior") gradum(context)
                .removeToolBehavior(entry.type, entry.callback, entry.toolName, entry.manager);
            else gradum(entry.target).removeToolListener(entry.type, entry.toolName, entry.callback, entry.manager);
        }
    }
}