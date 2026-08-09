/**
 * @class GradumSelector
 * @group GradumSelector
 * @category Core
 *
 * @template {object} Type - The type of the object it wraps.
 * @description Selector class that wraps an object and augments it with useful functions to manipulate it. It also
 * proxies the object, so you can access properties and methods on the underlying object directly through the selector.
 */
class GradumSelector<Type extends object = Node> {
    /**
     * @category Core
     * @description The underlying, wrapped object. Every method on the selector reads and writes through it.
     */
    public element: Type;

    #generateProxy() {
        return new Proxy(this, {
            get(target, prop, receiver) {
                if (prop in target) return Reflect.get(target, prop, receiver);
                const value = target.element?.[prop];
                return typeof value === "function" ? value.bind(target.element) : value;
            },
            set(target, prop, value, receiver) {
                if (prop in target) return Reflect.set(target, prop, value, receiver);
                target.element[prop] = value;
                return true;
            },
            has(target, prop) {
                return prop in target || prop in target.element;
            },
            ownKeys(target) {
                return Array.from([...Reflect.ownKeys(target), ...Reflect.ownKeys(target.element)]);
            },
            getOwnPropertyDescriptor(target, prop) {
                return Reflect.getOwnPropertyDescriptor(target, prop)
                    || Object.getOwnPropertyDescriptor(target.element, prop)
                    || undefined;
            }
        });
    }

    /**
     * @category Core
     * @constructor
     * @description Create a bare selector. Prefer {@link gradum} (or `g`, `gr`, `$`), which caches one
     * selector per target and wires up {@link GradumSelector.element} for you. The instance returned is a
     * proxy, so properties not found on the selector fall through to the wrapped object.
     */
    public constructor() {
        return this.#generateProxy();
    }
}

export {GradumSelector};