/**
 * @class GradumMap
 * @group Components
 * @category Data Structures
 *
 * @extends Map
 * @template KeyType - The type of the keys.
 * @template ValueType - The type of the stored values.
 * @description A [Map](https://developer.mozilla.org/en-US/docs/Web/API/Map) that hands out copies
 * instead of references, so callers cannot mutate stored values by accident. It also adds array
 * accessors and the usual `map`/`filter`/`merge` helpers, which return new maps rather than mutating
 * this one. Set {@link enforceImmutability} to `false` to get plain reference semantics back.
 */
class GradumMap<KeyType, ValueType> extends Map<KeyType, ValueType> {
    /**
     * @description Whether values are copied on the way in and out. While `true` (the default), stored
     * objects are cloned, so mutating a value you read back does not affect the map. Set it to `false`
     * to store and return the original references.
     */
    public enforceImmutability: boolean = true;

    /**
     * @description Store a value at the given key. The value is copied first unless
     * {@link enforceImmutability} is `false`.
     * @param {KeyType} key - The key to store under.
     * @param {ValueType} value - The value to store.
     * @returns {this} Itself, allowing for method chaining.
     */
    public set(key: KeyType, value: ValueType): any {
        return super.set(key, this.enforceImmutability ? this.copy(value) : value);
    }

    /**
     * @description Read the value at the given key.
     * @param {KeyType} key - The key to read.
     * @returns {ValueType} A copy of the stored value, or the value itself when
     * {@link enforceImmutability} is `false`. `undefined` if the key is not set.
     */
    public get(key: KeyType): ValueType {
        const result = super.get(key);
        return this.enforceImmutability ? this.copy(result) : result;
    }

    /**
     * @description The first value in insertion order, or `null` when the map is empty. Copied unless
     * {@link enforceImmutability} is `false`.
     * @readonly
     */
    public get first(): ValueType | null {
        if (this.size == 0) return null;
        const result = this.values().next().value;
        return this.enforceImmutability ? this.copy(result) : result;
    }

    /**
     * @description The last value in insertion order, or `null` when the map is empty. Copied unless
     * {@link enforceImmutability} is `false`.
     * @readonly
     */
    public get last(): ValueType | null {
        if (this.size == 0) return null;
        const result = this.valuesArray()[this.size - 1];
        return this.enforceImmutability ? this.copy(result) : result;
    }

    /**
     * @description All keys as an array, in insertion order.
     * @returns {KeyType[]} A new array of the map's keys.
     */
    public keysArray(): KeyType[] {
        return Array.from(this.keys());
    }

    /**
     * @description All values as an array, in insertion order.
     * @returns {ValueType[]} A new array of the map's values. The values themselves are not copied.
     */
    public valuesArray(): ValueType[] {
        return Array.from(this.values());
    }

    private copy(value: ValueType): ValueType {
        if (value && typeof value == "object") {
            if (value instanceof Array) return value.map(item => this.copy(item)) as any;
            if (value.constructor && value.constructor != Object) {
                if (typeof (value as any).clone == "function") return (value as any).clone();
                if (typeof (value as any).copy == "function") return (value as any).copy();
            }
            return {...value};
        }
        return value;
    }

    /**
     * @template C - The type of the new keys.
     * @description Derive a new map with the same values under recomputed keys.
     * @param {(key: KeyType, value: ValueType) => C} callback - Returns the new key for each entry.
     * @returns {GradumMap<C, ValueType>} A new map. This map is left unchanged. Entries whose callback
     * returns the same key collapse into one.
     */
    public mapKeys<C>(callback: (key: KeyType, value: ValueType) => C): GradumMap<C, ValueType> {
        const newMap = new GradumMap<C, ValueType>();
        for (let [key, value] of this) {
            newMap.set(callback(key, value), value);
        }
        return newMap;
    }

    /**
     * @template C - The type of the new values.
     * @description Derive a new map with the same keys and recomputed values.
     * @param {(key: KeyType, value: ValueType) => C} callback - Returns the new value for each entry.
     * @returns {GradumMap<KeyType, C>} A new map. This map is left unchanged.
     */
    public mapValues<C>(callback: (key: KeyType, value: ValueType) => C): GradumMap<KeyType, C> {
        const newMap = new GradumMap<KeyType, C>();
        for (let [key, value] of this) {
            newMap.set(key, callback(key, value));
        }
        return newMap;
    }

    /**
     * @description Select the entries matching a predicate.
     * @param {(key: KeyType, value: ValueType) => boolean} callback - Returns `true` to keep an entry.
     * @returns {GradumMap<KeyType, ValueType>} A new map holding the kept entries. This map is left unchanged.
     */
    public filter(callback: (key: KeyType, value: ValueType) => boolean): GradumMap<KeyType, ValueType> {
        const newMap = new GradumMap<KeyType, ValueType>();
        for (let [key, value] of this) {
            if (callback(key, value)) newMap.set(key, value);
        }
        return newMap;
    }

    /**
     * @description Copy every entry of another map into this one, overwriting on key collisions.
     * Unlike {@link mapKeys}, {@link mapValues}, and {@link filter}, this mutates the map it is called on.
     * @param {Map<KeyType, ValueType>} map - The map to read entries from. It is left unchanged.
     * @returns {this} Itself, allowing for method chaining.
     */
    public merge(map: Map<KeyType, ValueType>): GradumMap<KeyType, ValueType> {
        for (let [key, value] of map) {
            this.set(key, value);
        }
        return this;
    }
}

export {GradumMap};