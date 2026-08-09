import {ListenerProperties} from "../../gradumComponents/datatypes/listener/listener.types";

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
 * @class ListenerUtils
 * @description Stores the listener and behavior declarations gathered from `@listener` and `@behavior`,
 * keyed by prototype, so they can be attached once the instance exists.
 */
export class ListenerUtils {
    private constructorMap = new WeakMap<object, ListenerConstructorType>();

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
}