/**
 * @class GradumWeakSet
 * @group Components
 * @category Data Structures
 *
 * @template {object} Type - The type of the held objects.
 * @description A set that holds its members weakly, so membership never keeps an object alive. Unlike
 * a native [WeakSet](https://developer.mozilla.org/en-US/docs/Web/API/WeakSet), it is iterable and
 * reports its size — collected objects simply disappear from both. Useful for tracking DOM nodes
 * without leaking them once they are removed.
 */
class GradumWeakSet<Type extends object = object> {
    private readonly _weakRefs: Set<WeakRef<Type>>;

    /**
     * @constructor
     * @description Create an empty set.
     */
    public constructor() {
        this._weakRefs = new Set();
    }

    /**
     * @description Add an object to the set, if not already present. The set does not keep it alive.
     * @param {Type} obj - The object to add.
     * @returns {this} Itself, allowing for method chaining.
     */
    public add(obj: Type): this {
        if (!this.has(obj)) this._weakRefs.add(new WeakRef(obj));
        return this;
    }

    /**
     * @description Check whether an object is in the set.
     * @param {Type} obj - The object to look for, compared by identity.
     * @returns {boolean} Whether the object is present and has not been garbage-collected.
     */
    public has(obj: Type): boolean {
        for (const weakRef of this._weakRefs) {
            if (weakRef.deref() === obj) return true;
        }
        return false;
    }

    /**
     * @description Remove an object from the set.
     * @param {Type} obj - The object to remove, compared by identity.
     * @returns {boolean} Whether a matching object was found and removed.
     */
    public delete(obj: Type): boolean {
        for (const weakRef of this._weakRefs) {
            if (weakRef.deref() === obj) {
                this._weakRefs.delete(weakRef);
                return true;
            }
        }
        return false;
    }

    /**
     * @description Drop the bookkeeping left behind by objects that have been garbage-collected. Only
     * frees the set's own references — collected objects are already absent from iteration and
     * {@link size} without it.
     */
    public cleanup() {
        for (const weakRef of this._weakRefs) {
            if (weakRef.deref() === undefined) this._weakRefs.delete(weakRef);
        }
    }

    /**
     * @description Snapshot the objects that are still alive.
     * @returns {Type[]} A new array of the live objects, in insertion order.
     */
    public toArray(): Type[] {
        const result: Type[] = [];
        for (const weakRef of this._weakRefs) {
            const obj = weakRef.deref();
            if (obj !== undefined) result.push(obj);
            else this._weakRefs.delete(weakRef);
        }
        return result;
    }

    /**
     * @description The number of objects still alive. Counted on each read rather than stored, so it
     * costs a full pass over the set.
     * @readonly
     */
    public get size(): number {
        return this.toArray().length;
    }

    /**
     * @description Remove every object from the set.
     */
    public clear() {
        this._weakRefs.clear();
    }

    /**
     * @description Run a callback for each live object, in insertion order. Objects collected since
     * the last pass are skipped.
     * @param {(value: Type, set: this) => void} callback - Called once per live object.
     * @param {any} [thisArg] - Value to bind as `this` inside the callback.
     */
    public forEach(callback: (value: Type, set: this) => void, thisArg?: any): void {
        for (const weakRef of this._weakRefs) {
            const obj = weakRef.deref();
            if (obj !== undefined) callback.call(thisArg, obj, obj, this);
            else this._weakRefs.delete(weakRef);
        }
    }

    /**
     * @description Iterate the live objects in insertion order, skipping any that have been collected.
     */
    public *[Symbol.iterator](): IterableIterator<Type> {
        for (const weakRef of this._weakRefs) {
            const obj = weakRef.deref();
            if (obj !== undefined) yield obj;
            else this._weakRefs.delete(weakRef);
        }
    }
}

export {GradumWeakSet};