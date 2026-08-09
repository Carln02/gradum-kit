import {isUndefined} from "../../../utils/dataManipulation/misc";

/**
 * @internal
 * @class SimpleDelegate
 * @template {(...args: any[]) => any} CallbackType - The type of callbacks accepted by the delegate.
 * @description Class representing a set of callbacks that can be maintained and executed together.
 */
class SimpleDelegate<CallbackType extends (...args: any[]) => any> {
    private callbacks: Set<CallbackType> = new Set();

    /**
     * @function add
     * @description Register a callback. Adding the same callback twice has no effect.
     * @param {CallbackType} callback - The callback to register.
     */
    public add(callback: CallbackType) {
        this.callbacks.add(callback);
    }

    /**
     * @function remove
     * @description Unregister a callback.
     * @param {CallbackType} callback - The callback to unregister.
     * @returns {boolean} Whether the callback was registered and has been removed.
     */
    public remove(callback: CallbackType): boolean {
        return this.callbacks.delete(callback);
    }

    /**
     * @function has
     * @description Check whether a callback is registered.
     * @param {CallbackType} callback - The callback to look for.
     * @returns {boolean} Whether the callback is registered.
     */
    public has(callback: CallbackType): boolean {
        return this.callbacks.has(callback);
    }

    /**
     * @function fire
     * @description Invoke every registered callback with the given arguments. A callback that throws is
     * logged and skipped, so one failure does not stop the rest.
     * @param {...Parameters<CallbackType>} args - Arguments passed to each callback.
     * @returns {ReturnType<CallbackType>} The last value returned by a callback, ignoring those that
     * returned `undefined`.
     */
    public fire(...args: Parameters<CallbackType>): ReturnType<CallbackType> {
        let returnValue: ReturnType<CallbackType>;
        for (const callback of this.callbacks) {
            try {
                const value = callback(...args);
                if (!isUndefined(value)) returnValue = value;
            } catch (error) {
                console.error("Error invoking callback:", error);
            }
        }
        return returnValue;
    }

    /**
     * @function clear
     * @description Unregister every callback.
     */
    public clear() {
        this.callbacks.clear();
    }
}

/**
 * @class Delegate
 * @group Components
 * @category Delegate
 *
 * @template {(...args: any[]) => any} CallbackType - The type of callbacks accepted by the delegate.
 * @description A set of callbacks kept together and fired as one, used throughout the library wherever a
 * component announces something (`onChanged`, `onSelected`, ...). Subscribe with {@link Delegate.add} and
 * drop the subscription with {@link Delegate.remove}. Unlike its plain counterpart, this one announces
 * its own subscriptions through {@link Delegate.onAdded}.
 */
class Delegate<CallbackType extends (...args: any[]) => any> extends SimpleDelegate<CallbackType> {
    /**
     * @description Fired whenever a callback is registered on this delegate, with the new callback as its
     * argument. Use it to react to something starting to listen.
     */
    public onAdded: SimpleDelegate<(callback: CallbackType) => void> = new SimpleDelegate();

    /**
     * @function add
     * @description Register a callback, then fire {@link Delegate.onAdded} with it.
     * @param {CallbackType} callback - The callback to register.
     */
    public add(callback: CallbackType) {
        super.add(callback);
        this.onAdded.fire(callback);
    }
}

export {Delegate};