import { Doc, YEvent, Array, Map as Map$1, AbstractType } from 'yjs';
export { AbstractType as YAbstractType, Array as YArray, YArrayEvent, Doc as YDoc, YEvent, Map as YMap, YMapEvent, Text as YText } from 'yjs';

/**
 * @type {AutoOptions}
 * @group Decorators
 * @category Augmentation
 *
 * @template Type
 * @description Options for configuring the `@auto` decorator.
 * @property {boolean} [override] - If true, will try to override the defined property in `super`.
 * @property {boolean} [cancelIfUnchanged=true] - If true, cancels the setter if the new value is the same as the
 * current value. Defaults to `true`.
 * @property {(value: Type) => Type} [preprocessValue] - Optional callback to execute on the value and preprocess it
 * just before it is set. The returned value will be stored.
 * @property {(value: Type) => void} [callBefore] - Optional function to call before preprocessing and setting the value.
 * @property {(value: Type) => void} [callAfter] - Optional function to call after setting the value.
 * @property {boolean} [setIfUndefined] - If true, will fire the setter when the underlying value is `undefined` and
 * the program is trying to access it (maybe through its getter).
 * @property {boolean} [returnDefinedGetterValue] - If true and a custom getter is defined, the return value of this
 * getter will be returned when accessing the property. Otherwise, the underlying saved value will always be returned.
 * Defaults to `false`.
 * @property {boolean} [executeSetterBeforeStoring] - If true, when setting the value, the setter will execute first,
 * and then the value will be stored. In this case, accessing the value in the setter will return the previous value.
 * Defaults to `false`.
 * @property {Type} [defaultValue] - If defined, whenever the underlying value is `undefined` and trying to be
 * accessed, it will be set to `defaultValue` through the setter before getting accessed.
 * @property {() => Type} [defaultValueCallback] - If defined, whenever the underlying value is `undefined` and
 * trying to be accessed, it will be set to the return value of `defaultValueCallback` through the setter before
 * getting accessed.
 * @property {Type} [initialValue] - If defined, on initialization, the property will be set to `initialValue`.
 * @property {() => Type} [initialValueCallback] - If defined, on initialization, the property will be set to the
 * return value of `initialValueCallback`.
 */
type AutoOptions<Type = any> = {
    override?: boolean;
    cancelIfUnchanged?: boolean;
    setIfUndefined?: boolean;
    returnDefinedGetterValue?: boolean;
    executeSetterBeforeStoring?: boolean;
    defaultValue?: Type;
    defaultValueCallback?: () => Type;
    initialValue?: Type;
    initialValueCallback?: () => Type;
    preprocessValue?: (value: Type) => Type;
    callBefore?: (value: Type) => void;
    callAfter?: (value: Type) => void;
};

/**
 * @decorator
 * @function auto
 * @group Decorators
 * @category Augmentation
 *
 * @description Stage-3 decorator that augments fields, getters, setters, and accessors. Useful to quickly create a setter
 * and only define additional functionality on set. The decorator takes an optional object as parameter to configure
 * it, allowing you to, among other things:
 * - Preprocess the value when it is set,
 * - Specify callbacks to call before/after the value is set,
 * - Define a default value to return instead of `undefined` when calling the getter, and
 * - Fire the setter when the underlying value is `undefined`.
 *
 * *Note: If you want to chain decorators, place `@auto` closest to the property to ensure it runs first and sets
 * up the accessor for other decorators.*
 *
 * @param {AutoOptions} [options] - Options object to define custom behaviors.
 *
 * @example
 * ```ts
 * @auto() public set color(value: string) {
 *    this.style.backgroundColor = value;
 * }
 * ```
 *Is equivalent to:
 * ```ts
 * private _color: string;
 * public get color(): string {
 *    return this._color;
 * }
 *
 * public set color(value: string) {
 *    this._color = value;
 *    this.style.backgroundColor = value;
 * }
 * ```
 */
declare function auto(options?: AutoOptions): <Type extends object, Value>(value: ((initial: Value) => Value) | ((this: Type) => Value) | ((this: Type, v: Value) => void) | {
    get?: (this: Type) => Value;
    set?: (this: Type, value: Value) => void;
}, context: ClassFieldDecoratorContext<Type, Value> | ClassGetterDecoratorContext<Type, Value> | ClassSetterDecoratorContext<Type, Value> | ClassAccessorDecoratorContext<Type, Value>) => any;

/**
 * @type {CacheOptions}
 * @group Decorators
 * @category Cache
 *
 * @description Options for configuring the `@cache` decorator.
 *
 * Defines when and how cached values should expire, refresh, or invalidate.
 * These options apply equally to cached **methods**, **getters**, and **accessors**.
 *
 * @property {number} [timeout]
 *  Duration in milliseconds after which the cached value automatically expires.
 *  Useful for time-based caching where values should refresh periodically.
 *
 * @property {string | string[]} [onEvent]
 *  One or more event names (space-separated string or array) that, when fired on the instance,
 *  immediately clear the cache.
 *  This allows integration with custom event systems or reactive models.
 *
 * @property {() => boolean | Promise<boolean>} [onCallback]
 *  Function (sync or async) periodically called to decide whether to invalidate the cache.
 *  If it returns `true`, the cache is cleared.
 *
 * @property {number} [onCallbackFrequency]
 *  Frequency in milliseconds at which `onCallback` should be executed.
 *  Ignored if `onCallback` is not provided.
 *
 * @property {string | Function | (string | Function)[]} [onFieldChange]
 *  One or more property names or methods to watch for changes.
 *  Whenever any of these fields or functions change, the cache for the decorated member is cleared.
 *  Can be a string, a function reference, or an array of both.
 *
 * @property {boolean} [clearOnNextFrame]
 *  If `true`, clears the cache automatically on the **next animation frame** (or equivalent microtask fallback).
 *  Useful when the cached value is only valid for the current render/update cycle.
 */
type CacheOptions = {
    timeout?: number;
    onEvent?: string | string[];
    onCallback?: () => boolean | Promise<boolean>;
    onCallbackFrequency?: number;
    onFieldChange?: string | Function | (string | Function)[];
    clearOnNextFrame?: boolean;
};

/**
 * @decorator
 * @function cache
 * @group Decorators
 * @category Cache
 *
 * @description Stage-3 decorator that memorizes expensive reads.
 *
 * **What it does**
 * - **Method**: caches the return value **per unique arguments** (using a stable key from args).
 * - **Getter**: caches the value **once per instance** until invalidated.
 * - **Accessor**: wraps the `get` path like a cached getter; the `set` path invalidates cached value.
 *
 * @param {CacheOptions} [options] - Optional caching configuration to define when to clear it (on event, after
 * timeout, on next frame, on callback, etc.).
 *
 * @example
 * ```ts
 * class IconRenderer {
 *   #value = 0;
 *
 *   // Accessor: cached read; any write invalidates immediately
 *   @cache({clearOnNextFrame: true}) accessor data = {
 *     get: () => this.#value,
 *     set: (v: number) => { this.#value = v; }
 *   };
 *
 *   // Caches per argument list (e.g., same path ⇒ same result until invalidation)
 *   @cache({timeout: 5_000}) async loadSvg(path: string): Promise<string> {
 *     // ...expensive IO
 *     return fetch(path).then(r => r.text());
 *   }
 * }
 * ```
 */
declare function cache(options?: CacheOptions): <Type extends object, Value>(value: ((this: Type, ...args: any[]) => any) | ((this: Type) => Value) | {
    get?: (this: Type) => Value;
    set?: (this: Type, value: Value) => void;
}, context: ClassMethodDecoratorContext<Type> | ClassGetterDecoratorContext<Type, Value> | ClassAccessorDecoratorContext<Type, Value>) => any;
/**
 * @function clearCache
 * @group Decorators
 * @category Cache
 *
 * @description Clear *all* cache entries created by `@cache` on an instance.
 * @param {any} instance - The instance for which the cache should be cleared.
 */
declare function clearCache(instance: any): void;
/**
 * @function clearCacheEntry
 * @group Decorators
 * @category Cache
 *
 * @description Clear a specific cache entry for a given method, function, or getter.
 * @param {any} instance - The instance for which the cache should be cleared.
 * @param {string | Function} field - The name (or the function itself) of the field to clear.
 */
declare function clearCacheEntry(instance: any, field: string | Function): void;

/**
 * @function callOnce
 * @group Decorators
 * @category Augmentation
 *
 * @template {(...args: any[]) => any} Type
 * @description Function wrapper that ensures the passed function is called only once.
 * Subsequent calls will just return the cached computed result (if any) of the first call of that function.
 * @param {Type} fn - The function to process.
 *
 * @example
 * ```ts
 * const init = callOnce(function () { ... });
 * const out = init();
 * ```
 */
declare function callOnce<Type extends (...args: any[]) => any>(fn: Type): Type;
/**
 * @decorator
 * @function callOncePerInstance
 * @group Decorators
 * @category Augmentation
 *
 * @description Stage-3 method decorator. It ensures a method in a class is called only once per instance.
 * Subsequent calls will be canceled and log a warning. Works for instance or static methods.
 *
 * @example
 * ```ts
 *   class A {
 *     @callOnce init() { ... }
 *   }
 * ```
 */
declare function callOncePerInstance<Type extends object>(value: (this: Type, ...args: any[]) => any, context: ClassMethodDecoratorContext<Type>): any;

/**
 * @type KeyType
 * @group Types
 * @category Basics
 */
type KeyType = string | number | symbol;
/**
 * @type FlatKeyType
 * @group Types
 * @category Basics
 */
type FlatKeyType = string | number;
/**
 * @group Types
 * @category Basics
 */
type FlexRect = {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
};
/**
 * @group Types
 * @category Basics
 */
type Coordinate<Type = number> = {
    x: Type;
    y: Type;
};
/**
 * @group Types
 * @category Basics
 */
type PartialRecord<Property extends keyof any, Value> = {
    [P in Property]?: Value;
};

/**
 * @group Components
 * @category Point
 */
declare class Point {
    readonly x: number;
    readonly y: number;
    /**
     * @description Create a point with coordinates (0, 0)
     */
    constructor();
    /**
     * @description Create a point with coordinates (n, n)
     * @param {number} n - The input value
     */
    constructor(n: number);
    /**
     * @description Create a point with coordinates (x, y)
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     */
    constructor(x: number, y: number);
    /**
     * @description Create a point with the clientX/clientY values. Useful for events.
     * @param {{clientX: number, clientY: number}} e - The coordinates
     */
    constructor(e: {
        clientX: number;
        clientY: number;
    });
    /**
     * @description Create a point with the provided coordinates
     * @param {Coordinate} p - The coordinates (or Point)
     */
    constructor(p: Coordinate);
    /**
     * @description Create a point with the provided [x, y] values.
     * @param {[number, number]} arr - The array of size 2.
     */
    constructor(arr: [number, number]);
    constructor(x: number | Coordinate | {
        clientX: number;
        clientY: number;
    } | [number, number]);
    /**
     * @description Calculate the distance between two Position2D points.
     * @param {Point} p1 - First point
     * @param {Point} p2 - Second point
     */
    static dist(p1: Coordinate, p2: Coordinate): number;
    /**
     * @description Calculate the mid-point from the provided points
     * @param {Point[]} arr - Undetermined number of point parameters
     */
    static midPoint(...arr: Coordinate[]): Point;
    /**
     * @description Calculate the max on both x and y from the provided points
     * @param {Point[]} arr - Undetermined number of point parameters
     */
    static max(...arr: Coordinate[]): Point;
    /**
     * @description Calculate the min on both x and y from the provided points
     * @param {Point[]} arr - Undetermined number of point parameters
     */
    static min(...arr: Coordinate[]): Point;
    get object(): Coordinate;
    /**
     * @description Determine whether this point is equal to the provided coordinates
     * @param {Coordinate} p - The coordinates to compare it to
     * @return A boolean indicating whether they are equal
     */
    equals(p: Coordinate): boolean;
    /**
     * @description Determine whether this point is equal to the provided coordinates
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     * @return A boolean indicating whether they are equal
     */
    equals(x: number, y: number): boolean;
    boundX(x1: number, x2: number): number;
    boundY(y1: number, y2: number): number;
    bound(n1: number, n2: number): Point;
    /**
     * @description Add coordinates to this point
     * @param {number} n - The value to add to both x and y
     * @returns A new Point object with the result
     */
    add(n: number): Point;
    /**
     * @description Add coordinates to this point
     * @param {number} x - The value to add to the x coordinate
     * @param {number} y - The value to add to the y coordinate
     * @returns A new Point object with the result
     */
    add(x: number, y: number): Point;
    /**
     * @description Add coordinates to this point
     * @param {Coordinate} p - The coordinates to add
     * @returns A new Point object with the result
     */
    add(p: Coordinate): Point;
    /**
     * @description Subtract coordinates from this point
     * @param {number} n - The value to subtract from both x and y
     * @returns A new Point object with the result
     */
    sub(n: number): Point;
    /**
     * @description Subtract coordinates from this point
     * @param {number} x - The value to subtract from the x coordinate
     * @param {number} y - The value to subtract from the y coordinate
     * @returns A new Point object with the result
     */
    sub(x: number, y: number): Point;
    /**
     * @description Subtract coordinates from this point
     * @param {Coordinate} p - The coordinates to subtract
     * @returns A new Point object with the result
     */
    sub(p: Coordinate): Point;
    /**
     * @description Multiply coordinates of this point
     * @param {number} n - The value to multiply both x and y
     * @returns A new Point object with the result
     */
    mul(n: number): Point;
    /**
     * @description Multiply coordinates of this point
     * @param {number} x - The value to multiply the x coordinate
     * @param {number} y - The value to multiply the y coordinate
     * @returns A new Point object with the result
     */
    mul(x: number, y: number): Point;
    /**
     * @description Multiply coordinates of this point
     * @param {Coordinate} p - The coordinates to multiply
     * @returns A new Point object with the result
     */
    mul(p: Coordinate): Point;
    /**
     * @description Divide coordinates of this point
     * @param {number} n - The value to divide both x and y
     * @returns A new Point object with the result
     */
    div(n: number): Point;
    /**
     * @description Divide coordinates of this point
     * @param {number} x - The value to divide the x coordinate
     * @param {number} y - The value to divide the y coordinate
     * @returns A new Point object with the result
     */
    div(x: number, y: number): Point;
    /**
     * @description Divide coordinates of this point
     * @param {Coordinate} p - The coordinates to divide with
     * @returns A new Point object with the result
     */
    div(p: Coordinate): Point;
    /**
     * @description Mod coordinates of this point
     * @param {number} n - The value to mod both x and y
     * @returns A new Point object with the result
     */
    mod(n: number): Point;
    /**
     * @description Mod coordinates of this point
     * @param {number} x - The value to mod the x coordinate
     * @param {number} y - The value to mod the y coordinate
     * @returns A new Point object with the result
     */
    mod(x: number, y: number): Point;
    /**
     * @description Mod coordinates of this point
     * @param {Coordinate} p - The coordinates to mod with
     * @returns A new Point object with the result
     */
    mod(p: Coordinate): Point;
    /**
     * @description Calculate the absolute value of the coordinates
     * @returns A new Point object with the absolute values
     */
    get abs(): Point;
    /**
     * @description Get the maximum value between x and y coordinates
     * @returns The maximum value
     */
    get max(): number;
    /**
     * @description Get the minimum value between x and y coordinates
     * @returns The minimum value
     */
    get min(): number;
    get length2(): number;
    get length(): number;
    dot(p: Point): number;
    /**
     * @description Create a copy of the current point
     * @returns A new Point object with the same coordinates
     */
    copy(): Point;
    /**
     * @description Get the coordinates as an array
     * @returns An array with x and y coordinates
     */
    arr(): number[];
    positionOnSegment(start: Point, end: Point): number;
    static linearInterpolation(start: Point, end: Point, t: number): Point;
    toString(): string;
    fromString(value: string): Point;
}

/**
 * @internal
 * @class SimpleDelegate
 * @template {(...args: any[]) => any} CallbackType - The type of callbacks accepted by the delegate.
 * @description Class representing a set of callbacks that can be maintained and executed together.
 */
declare class SimpleDelegate<CallbackType extends (...args: any[]) => any> {
    private callbacks;
    /**
     * @description Adds a callback to the list.
     * @param callback - The callback function to add.
     */
    add(callback: CallbackType): void;
    /**
     * @description Removes a callback from the list.
     * @param callback - The callback function to remove.
     * @returns A boolean indicating whether the callback was found and removed.
     */
    remove(callback: CallbackType): boolean;
    /**
     * @description Checks whether a callback is in the list.
     * @param callback - The callback function to check for.
     * @returns A boolean indicating whether the callback was found.
     */
    has(callback: CallbackType): boolean;
    /**
     * @description Invokes all callbacks with the provided arguments.
     * @param args - The arguments to pass to the callbacks.
     */
    fire(...args: Parameters<CallbackType>): ReturnType<CallbackType>;
    /**
     * @description Clears added callbacks
     */
    clear(): void;
}
/**
 * @class Delegate
 * @group Components
 * @category Delegate
 * @template {(...args: any[]) => any} CallbackType - The type of callbacks accepted by the delegate.
 * @description Class representing a set of callbacks that can be maintained and executed together.
 */
declare class Delegate<CallbackType extends (...args: any[]) => any> extends SimpleDelegate<CallbackType> {
    /**
     * @description Delegate fired when a callback is added.
     */
    onAdded: SimpleDelegate<(callback: CallbackType) => void>;
    /**
     * @description Adds a callback to the list.
     * @param callback - The callback function to add.
     */
    add(callback: CallbackType): void;
}

declare class GradumNestedMapNode<KeyType, ValueType> extends Map<KeyType, ValueType> {
}
/**
 * @class GradumNestedMap
 * @group Components
 * @category GradumNestedMap
 *
 * @description A map of arbitrary nesting depth, addressed via `...keys` paths.
 *
 * @template ValueType - The type of stored values.
 * @template KeyType - The type of keys at each level of the path. Defaults to `string | symbol | number`.
 */
declare class GradumNestedMap<ValueType = any, KeyType = string | symbol | number> {
    protected readonly nestedMap: GradumNestedMapNode<KeyType, any>;
    /**
     * @function get
     * @description Retrieve the value at the given key path.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     * @returns {ValueType | undefined} The stored value, or `undefined` if not found.
     */
    get(...keys: KeyType[]): ValueType;
    /**
     * @function getFlat
     * @description Retrieve the value at the given flat key.
     * @param {number | string} flatKey - A flat key produced by {@link flattenKey}.
     * @param {number} [depth] - Optional depth of the entry for numerical flat keys.
     * @returns {ValueType | undefined} The stored value, or `undefined` if not found.
     */
    getFlat(flatKey: number | string, depth?: number): ValueType;
    /**
     * @function getKey
     * @description Find the key path of the first occurrence of the given value.
     * @param {ValueType} value - The value to locate.
     * @returns {KeyType[] | undefined} The key path, or `undefined` if not found.
     */
    getKey(value: ValueType): KeyType[];
    /**
     * @function getKeys
     * @description Find the key paths of all occurrences of the given value.
     * @param {ValueType} value - The value to locate.
     * @returns {KeyType[][]} Array of key paths.
     */
    getKeys(value: ValueType): KeyType[][];
    /**
     * @function getFlatKey
     * @description Return the flat key of the first occurrence of the given value.
     * @param {ValueType} value - The value to query.
     * @returns {string | number | undefined} The flat key, or `undefined` if not found.
     */
    getFlatKey(value: ValueType): string | number;
    /**
     * @function set
     * @description Store a value at the given key path. Intermediate nodes are created automatically.
     * @param {ValueType} value - The value to store.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     */
    set(value: ValueType, ...keys: KeyType[]): void;
    /**
     * @function setFlat
     * @description Store a value at the given flat key.
     * @param {ValueType} value - The value to store.
     * @param {number | string} flatKey - A flat key produced by {@link flattenKey}.
     * @param {number} [depth] - Optional depth of the entry for numerical flat keys.
     */
    setFlat(value: ValueType, flatKey: number | string, depth?: number): void;
    /**
     * @function has
     * @description Check whether an entry exists at the given key path.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     * @returns {boolean}
     */
    has(...keys: KeyType[]): boolean;
    /**
     * @function hasFlat
     * @description Check whether an entry exists at the given flat key.
     * @param {number | string} flatKey - A flat key produced by {@link flattenKey}.
     * @param {number} [depth] - Optional depth of the entry for numerical flat keys.
     * @returns {boolean}
     */
    hasFlat(flatKey: number | string, depth?: number): boolean;
    /**
     * @function hasValue
     * @description Check whether the given value exists anywhere in the map.
     * @param {ValueType} value - The value to look for.
     * @returns {boolean}
     */
    hasValue(value: ValueType): boolean;
    /**
     * @function remove
     * @description Remove the entry at the given key path.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     */
    remove(...keys: KeyType[]): void;
    /**
     * @function removeValue
     * @description Remove the first occurrence of the given value.
     * @param {ValueType} value - The value to remove.
     */
    removeValue(value: ValueType): void;
    /**
     * @function removeValues
     * @description Remove all occurrences of the given value.
     * @param {ValueType} value - The value to remove.
     */
    removeValues(value: ValueType): void;
    /**
     * @function getEntriesAt
     * @description Return all leaf `[key, value]` pairs under the given path, sorted alphabetically by key.
     * Pass no keys to get all leaf entries in the map.
     * @param {...KeyType[]} keys - Path to the subtree root.
     * @returns {[KeyType, ValueType][]}
     */
    getEntriesAt(...keys: KeyType[]): [KeyType, ValueType][];
    /**
     * @description All leaf `[key, value]` pairs in the nested map, sorted alphabetically by key.
     */
    get entries(): [KeyType, ValueType][];
    /**
     * @function getKeysAt
     * @description Return all leaf keys under the given path, sorted alphabetically.
     * Pass no keys to get all leaf keys in the map.
     * @param {...KeyType[]} keys - Path to the parent node.
     * @returns {KeyType[]}
     */
    getKeysAt(...keys: KeyType[]): KeyType[];
    /**
     * @description All leaf keys in the nested map, sorted alphabetically.
     */
    get keys(): KeyType[];
    /**
     * @function getValuesAt
     * @description Return all leaf values under the given path, sorted alphabetically by key.
     * Pass no keys to get all leaf values in the map.
     * @param {...KeyType[]} keys - Path to the parent node.
     * @returns {ValueType[]}
     */
    getValuesAt(...keys: KeyType[]): ValueType[];
    /**
     * @description All leaf values in the nested map, sorted alphabetically by key.
     */
    get values(): ValueType[];
    /**
     * @function getPathsAt
     * @description Return all leaf key paths under the given path.
     * Pass no keys to get all leaf paths in the map.
     * @param {...KeyType[]} keys - Path to the subtree root.
     * @returns {KeyType[][]}
     */
    getPathsAt(...keys: KeyType[]): KeyType[][];
    /**
     * @description All leaf key paths in the map.
     */
    get paths(): KeyType[][];
    /**
     * @function getSizeAt
     * @description Return the number of leaf entries under the given path.
     * Pass no keys to get the number of all leaf entries.
     * @param {...KeyType[]} keys - Path to the root.
     * @returns {number}
     */
    getSizeAt(...keys: KeyType[]): number;
    /**
     * @description Number of all leaf entries in the nested map.
     */
    get size(): number;
    /**
     * @function flattenKey
     * @description Serialize a key path into a single flat key.
     * - Fully numeric paths produce a numeric global leaf index.
     * - All other paths produce a `"k0|k1|k2|..."` string.
     * @param {...KeyType[]} keys - The key path to serialize.
     * @returns {string | number | undefined} The flat key, or `undefined` if the path is invalid.
     */
    flattenKey(...keys: KeyType[]): string | number;
    /**
     * @function scopeKey
     * @description Convert a flat key back into a key path. Reverses {@link flattenKey}.
     * - A string `"k0|k1|k2"` becomes `[k0, k1, k2]`.
     * - A numeric global leaf index becomes the corresponding numeric path.
     * @param {number | string} flatKey - The flat key to convert.
     * @param {number} [depth] - Optional depth of the entry for numerical flat keys.
     * @returns {KeyType[] | undefined} The key path, or `undefined` if conversion fails.
     */
    scopeKey(flatKey: number | string, depth?: number): KeyType[];
    /**
     * @function clear
     * @description Remove all entries from the map.
     */
    clear(): void;
    protected findPaths(node: Map<KeyType, any>, target?: ValueType, allPaths?: boolean, prefix?: KeyType[]): KeyType[][];
    protected getFlatCompatibleKey(key: any): string | number | undefined;
}

/**
 * @class GradumObserver
 * @group MVC
 * @category GradumModel
 *
 * @extends GradumNestedMap
 * @description Generic observer that keeps a set of component instances organized by key path.
 * Useful to maintain UI components or other per-entry objects synchronized with a data source
 * ({@link GradumModel}).
 *
 * @template DataType - The type of data handled by the observer.
 * @template {object} ComponentType - The instance type created/managed by the observer.
 * @template {string | number | symbol} KeyType - The key type used at each level of the path.
 */
declare class GradumObserver<DataType = any, ComponentType extends object = any, DataKeyType extends KeyType = KeyType> extends GradumNestedMap<ComponentType, DataKeyType> {
    protected _isInitialized: boolean;
    private readonly prevData;
    private replaceOnUpdate;
    /**
     * @property onAdded
     * @description Delegate called when a change is reported at a key path for which no component instance exists yet.
     * Handlers may return a newly-created component instance, which will be stored and passed to subsequent
     * `onUpdated` calls.
     */
    readonly onAdded: Delegate<(data: DataType, self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: DataKeyType[]) => ComponentType | void>;
    /**
     * @property onUpdated
     * @description Delegate called when a change is reported at a key path that already has an associated instance.
     */
    readonly onUpdated: Delegate<(data: DataType, instance: ComponentType, self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: DataKeyType[]) => void>;
    /**
     * @property onDeleted
     * @description Delegate called when a key path is reported as deleted.
     */
    readonly onDeleted: Delegate<(data: DataType, instance: ComponentType, self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: DataKeyType[]) => void>;
    /**
     * @property onInitialize
     * @description Delegate fired once when the observer is initialized. Useful for initial population.
     */
    readonly onInitialize: Delegate<(self: GradumObserver<DataType, ComponentType, DataKeyType>) => void>;
    /**
     * @property onDestroy
     * @description Delegate fired when the observer is destroyed.
     */
    readonly onDestroy: Delegate<(self: GradumObserver<DataType, ComponentType, DataKeyType>) => void>;
    /**
     * @constructor
     * @description Create a GradumObserver.
     * By default, `onUpdated` updates the data of the mapped instance if it exposes a {@link GradumModel} model,
     * or `data` / `dataId` fields. `onDeleted` removes the instance from the map and the DOM.
     * @param {GradumObserverProperties<DataType, ComponentType, KeyType>} [properties] - Initialization
     * options and lifecycle callbacks.
     */
    constructor(properties?: GradumObserverProperties<DataType, ComponentType, DataKeyType>);
    /**
     * @function remove
     * @description Remove the instance at the given key path from the map and call `instance.remove()` if available.
     * @param {...KeyType[]} keys - Ordered path to the instance.
     */
    remove(...keys: DataKeyType[]): void;
    /**
     * @function detach
     * @description Remove the instance at the given key path from the map without calling `instance.remove()`,
     * detaching it from the observer.
     * @param {...KeyType[]} keys - Ordered path to the instance.
     */
    detach(...keys: DataKeyType[]): void;
    /**
     * @property isInitialized
     * @description Whether the observer has been initialized (i.e. {@link initialize} has been called).
     */
    get isInitialized(): boolean;
    /**
     * @function initialize
     * @description Initialization method that fires `onInitialize`. No-op if already initialized.
     */
    initialize(): void;
    /**
     * @function clear
     * @description Remove all managed instances, reset the observer to an uninitialized state, and optionally
     * call `instance.remove()` on each instance.
     * @param {boolean} [removeFromDom=true] - Whether to call `instance.remove()` on each managed instance.
     */
    clear(removeFromDom?: boolean): void;
    /**
     * @function destroy
     * @description Remove all managed instances, reset the observer to an uninitialized state, optionally
     * call `instance.remove()` on each instance, and fire `onDestroy`.
     * @param {boolean} [removeFromDom=true] - Whether to call `instance.remove()` on each managed instance.
     */
    destroy(removeFromDom?: boolean): void;
    /**
     * @function keyChanged
     * @description Notify the observer of a change at the given key path.
     * Fires `onDeleted` if `deleted` is `true` and an instance exists, `onAdded` if no instance exists yet
     * (storing the returned instance if any), and `onUpdated` otherwise.
     * @param {KeyType[]} keys - The key path that changed.
     * @param {DataType} value - The new value at that path.
     * @param {boolean} [deleted=false] - Whether the entry was deleted.
     */
    keyChanged(keys: DataKeyType[], value: DataType, deleted?: boolean): void;
}

type GradumModelProxy<DataType extends object = any, IdType extends KeyType = any> = DataType & {
    readonly $model: GradumModel<DataType, KeyType, IdType>;
};
/**
 * @type GradumModelProperties
 * @group MVC
 * @category GradumModel
 *
 * @description Configuration object used when creating a {@link GradumModel}.
 * @template DataType - The type of data stored in the model.
 * @template IdType - The type of the data's ID.
 * @property {IdType} [id] - Optional ID attached to the model. Useful to reference the data in a nested structure.
 * @property {DataType} [data] - Initial data.
 * @property {boolean} [initialize] - If true, {@link GradumModel.initialize} is called immediately after
 * construction.
 */
type GradumModelProperties<DataType = any, IdType extends KeyType = any> = {
    id?: IdType;
    data?: DataType;
    initialize?: boolean;
    enabledCallbacks?: boolean;
    bubbleChanges?: boolean;
    makeSignals?: boolean;
};
/**
 * @type GradumObserverProperties
 * @group Components
 * @category GradumDataBlock
 *
 * @description Configuration object to create a new {@link GradumObserver}.
 *
 * @template DataType - The type of data handled by the observer.
 * @template {object} ComponentType - The instance type created/managed by the observer.
 * @template {string | number | symbol} KeyType - The per-item key type.
 * @template {string | number} BlockKeyType - The block-grouping key type.
 *
 * @property {new(...args:any[]) => GradumObserver<DataType, ComponentType, KeyType, BlockKeyType>} [customConstructor] -
 * Optional custom observer constructor to instantiate instead of the default `GradumObserver`.
 * @property {boolean} [initialize] - If true, the observer is initialized immediately.
 * @property {(data, id, self, blockKey?) => ComponentType | void} [onAdded] - Called when a new item appears.
 * @property {(data, instance, id, self, blockKey?) => void} [onUpdated] - Called when an existing item changes.
 * @property {(data, instance, id, self, blockKey?) => void} [onDeleted] - Called when an item is deleted.
 * @property {(self) => void} [onInitialize] - Called when the observer is initialized.
 * @property {(self) => void} [onDestroy] - Called when the observer is destroyed.
 */
type GradumObserverProperties<DataType = any, ComponentType extends object = any, DataKeyType extends KeyType = KeyType> = {
    customConstructor?: new (...args: any[]) => GradumObserver<DataType, ComponentType, DataKeyType>;
    depth?: number;
    initialize?: boolean;
    onAdded?: (data: DataType, self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: KeyType[]) => ComponentType | void;
    onUpdated?: (data: DataType, instance: ComponentType, self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: KeyType[]) => void;
    onDeleted?: (data: DataType, instance: ComponentType, self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: KeyType[]) => void;
    replaceOnUpdate?: (prevData: DataType, newData: DataType, instance: ComponentType, self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: KeyType[]) => boolean;
    onInitialize?: (self: GradumObserver<DataType, ComponentType, DataKeyType>) => void;
    onDestroy?: (self: GradumObserver<DataType, ComponentType, DataKeyType>) => void;
};

type SignalSubscriber = () => void;
/**
 * @type {SignalEntry}
 * @group Decorators
 * @category Signal
 *
 * @template Type
 * @description Type that represents a base signal object.
 * @property {function(): Type} get - Retrieve the signal value.
 * @property {function(value: Type): void} set - Set the signal value.
 * @property {function(updater: (previous: Type) => Type): void} update - Set the value using a pure updater based
 * on the previous value.
 * @property {(fn: SignalSubscriber) => () => void} sub - Subscribe to change notifications. Returns an unsubscribe
 * function.
 * @property {() => void} emit - Force a notification cycle without changing the value (useful after in-place
 * mutation of structural data).
 *
 * @example
 * ```ts
 * const count: SignalEntry<number> = makeSignal(0);
 * const unsub = count.sub(() => console.log("count:", count.get()));
 * count.set(1); // logs "count: 1"
 * count.update(c => c+1); // logs "count: 2"
 * unsub();
 * ```
 */
type SignalEntry<Type = any> = {
    get(): Type;
    set(value: Type): void;
    update(updater: (previous: Type) => Type): void;
    sub(fn: SignalSubscriber): () => void;
    emit(): void;
};
/**
 * @type {SignalBox}
 * @group Decorators
 * @category Signal
 *
 * @template Type
 * @description A signal entry that is also usable like its underlying primitive/object.
 *
 * ### Interop Notes
 * - `toJSON()` returns the raw value.
 * - `valueOf()` returns the raw value.
 * - `Symbol.toPrimitive(hint)`:
 *    - `"number"` → numeric coercion from the inner value
 *    - `"string"` or `"default"` → string coercion from the inner value
 * - The `value` getter/setter mirrors `get()`/`set()` for ergonomic usage.
 *
 * @example
 * ```ts
 * const count: SignalBox<number> = signal(0);
 *
 * // Read
 * console.log(count.get()); // 0
 * console.log(count.value); // 0
 * console.log(+count); // 0
 *
 * // Write
 * count.set(5);
 * count.value = 6;
 * count.update(v => v + 1); // 7
 *
 * // JSON / string
 * console.log(`${count}`); // "7"
 * console.log(JSON.stringify(count)); // 7
 *
 * // Reactivity
 * const unsub = count.sub(() => console.log("changed to", count.get()));
 * count.set(8); // triggers subscriber
 * unsub();
 * ```
 */
type SignalBox<Type> = Type & SignalEntry<Type> & {
    toJSON(): Type;
    valueOf(): Type;
    value: Type;
    [Symbol.toPrimitive](hint: "default" | "number" | "string"): string | number;
};

/**
 * @class GradumHandler
 * @group MVC
 * @category Handler
 *
 * @description The MVC base handler class. It's an extension of the model, and its main job is to provide some utility
 * functions to manipulate some of (or all of) the model's data.
 * @template {GradumModel} ModelType - The element's MVC model type.
 */
declare class GradumHandler<ModelType extends GradumModel = GradumModel> {
    /**
     * @description The key of the handler. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the handler's class name is MyElementSomethingHandler, the key would
     * default to "something".
     */
    keyName: string;
    /**
     * @description The MVC model.
     * @protected
     */
    model: ModelType;
    constructor(model?: ModelType);
    /**
     * @function setup
     * @description Called in the constructor. Use for setup that should happen at instantiation,
     * before `this.initialize()` is called.
     * @protected
     */
    protected setup(): void;
}

type ObserverData<DataType = any, ComponentType extends object = any, DataKeyType extends KeyType = KeyType> = {
    observer: GradumObserver<DataType, ComponentType, DataKeyType>;
    keys: KeyType[];
    deep?: boolean;
};
type ListenerData = {
    listener: (keys: KeyType[], value: any) => void;
    keys: KeyType[];
};
/**
 * @class GradumModel
 * @group MVC
 * @category GradumModel
 *
 * @template DataType - The type of the data held in the model.
 * @template {KeyType} KeyType - The type of the data's keys.
 * @template {KeyType} IdType - The type of the data's ID.
 * @template ComponentType - The type of instances managed by attached observers.
 * @template DataEntryType - The type of data associated with each observer instance.
 *
 * @description Wrapper around a plain JS container (object, Array, or Map) that exposes a
 * consistent API for reads/writes, signals, and {@link GradumObserver}s.
 */
declare class GradumModel<DataType = any, DataKeyType extends KeyType = any, IdType extends KeyType = any, ComponentType extends object = any, DataEntryType = any> {
    /**
     * @description Symbol used in {@link nestAll}, {@link makeSignals}, and {@link generateObserver}
     * to target all entries at a certain level inside the data.
     */
    static readonly ALL: unique symbol;
    static from<DataType extends object = any, IdType extends KeyType = any>(data?: DataType, id?: IdType): GradumModelProxy<DataType, IdType>;
    static create<DataType = any, DataKeyType extends KeyType = any, IdType extends KeyType = any, ComponentType extends object = any, DataEntryType = any>(properties?: GradumModelProperties): GradumModel<DataType, DataKeyType, IdType, ComponentType, DataEntryType>;
    /**
     * @description The default constructor used to create nested {@link GradumModel} instances.
     */
    modelConstructor: new (...args: any[]) => GradumModel;
    /**
     * @description The default constructor used to create {@link GradumObserver} instances via {@link generateObserver}.
     */
    observerConstructor: new (...args: any[]) => GradumObserver;
    /**
     * @description Map of MVC handlers bound to this model.
     */
    handlers: Map<string, GradumHandler>;
    /**
     * @description Whether change callbacks and observer notifications are enabled.
     */
    accessor enabledCallbacks: boolean;
    /**
     * @description Whether changes bubble up from nested models to their parent.
     */
    accessor bubbleChanges: boolean;
    /**
     * @description Delegate fired whenever a value changes at a key path. Receives the new value followed
     * by the key path as spread arguments.
     */
    readonly onKeyChanged: Delegate<(value: any, ...keys: KeyType[]) => void>;
    readonly onDataChanged: Delegate<(oldData: any, newData: any) => void>;
    fireCallbackHook: (key: string, ...values: any[]) => void;
    protected isInitialized: boolean;
    private readonly signals;
    protected readonly changeObservers: Set<ObserverData<DataEntryType, ComponentType, DataKeyType>>;
    protected readonly nestedModels: Map<DataKeyType, GradumModel>;
    protected nestedListeners: Set<ListenerData>;
    /**
     * @description The ID of the data held by this model.
     */
    id: IdType;
    private _data;
    /**
     * @description The data held by this model. Setting it clears the current state and re-initializes the model.
     */
    get data(): DataType;
    set data(data: DataType);
    /**
     * @description The metadata held by this model. Separate from this model's data.
     */
    get meta(): GradumModel<object>;
    /**
     * @constructor
     * @description Create a new GradumModel.
     * @param {GradumModelProperties} [properties] - Optional initialization properties.
     */
    constructor(properties?: GradumModelProperties);
    /**
     * @function setup
     * @description Called in the constructor. Use for setup that should happen at instantiation,
     * before `this.initialize()` is called.
     * @protected
     */
    protected setup(): void;
    /**
     * @protected
     * @function getAction
     * @description Read a single key from a data container. Override this method to support other datatypes.
     * @param {any} data - The container to read from.
     * @param {KeyType} key - The key to read.
     * @returns {any} The value at the key, or `undefined` if not found.
     */
    protected getAction(data: any, key: KeyType): any;
    /**
     * @function get
     * @description Retrieve the value at the given key.
     * @param {KeyType} key - The key to read.
     * @returns {any} The stored value, or `undefined` if not found.
     */
    get(key: DataKeyType): any;
    /**
     * @function get
     * @description Retrieve the value at the given key path. Pass no keys to get the root data.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     * @returns {any} The stored value, or `undefined` if not found.
     */
    get(...keys: KeyType[]): any;
    /**
     * @function getFlat
     * @description Retrieve the value at the given flat key.
     * @param {FlatKeyType} flatKey - A flat key produced by {@link flattenKey}.
     * @param {number} [depth] - Required when `flatKey` is a numeric index. The depth of the key path.
     * @returns {any} The stored value, or `undefined` if not found.
     */
    getFlat(flatKey: FlatKeyType, depth?: number): any;
    /**
     * @function getKey
     * @description Find the key path of the first occurrence of the given value, searching depth-first.
     * @param {any} value - The value to locate.
     * @returns {KeyType[]} The key path, or `undefined` if not found.
     */
    getKey(value: any): KeyType[];
    /**
     * @function getFlatKey
     * @description Return the flat key of the first occurrence of the given value.
     * @param {any} value - The value to query.
     * @returns {FlatKeyType | undefined} The flat key, or `undefined` if not found.
     */
    getFlatKey(value: any): FlatKeyType;
    /**
     * @function getKeys
     * @description Find the key paths of all occurrences of the given value, searching depth-first.
     * @param {any} value - The value to locate.
     * @returns {KeyType[][]} Array of key paths.
     */
    getKeys(value: any): KeyType[][];
    /**
     * @function getFlatKeys
     * @description Return the flat keys of all occurrences of the given value.
     * @param {any} value - The value to query.
     * @returns {FlatKeyType[]} Array of flat keys.
     */
    getFlatKeys(value: any): FlatKeyType[];
    /**
     * @protected
     * @function setAction
     * @description Write a single key to a data container. Override this method to support other datatypes.
     * @param {any} data - The container to write to.
     * @param {KeyType} key - The key to write.
     * @param {any} value - The value to set.
     */
    protected setAction(data: any, value: any, key: KeyType): void;
    /**
     * @protected
     * @function internalSet
     * @description Write a value at a key, propagating the change to a nested model if one exists,
     * and firing {@link keyChanged} if the value actually changed.
     * @param {GradumModel} model - The owning model (used for nested model lookup and change notification),
     * or `undefined` if operating on a non-root container.
     * @param {any} data - The container to write to.
     * @param {KeyType} key - The key to write.
     * @param {any} value - The value to set.
     */
    protected internalSet(model: GradumModel, data: any, value: any, key: KeyType): boolean;
    /**
     * @function set
     * @description Set a value at the given key and notify observers and signals if the value changed.
     * @param {KeyType} key - The key to write.
     * @param {unknown} value - The value to set.
     */
    set(value: unknown, key: DataKeyType): boolean;
    /**
     * @function set
     * @description Set a value at the given key path and notify observers and signals if the value changed.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     * @param {unknown} value - The value to set.
     */
    set(value: unknown, ...keys: KeyType[]): boolean;
    /**
     * @function setFlat
     * @description Set a value at the given flat key.
     * @param {unknown} value - The value to set.
     * @param {FlatKeyType} flatKey - A flat key produced by {@link flattenKey}.
     * @param {number} [depth] - Required when `flatKey` is a numeric index. The depth of the key path.
     */
    setFlat(value: unknown, flatKey: FlatKeyType, depth?: number): boolean;
    /**
     * @protected
     * @function internalAdd
     * @description Insert a value into a container via {@link addAction} and fire {@link keyChanged}.
     * @param {GradumModel} model - The owning model for change notification, or `undefined` for non-root containers.
     * @param {any} data - The container to insert into.
     * @param {any} value - The value to insert.
     * @param {KeyType} key - The target index or key.
     * @returns {KeyType} The index or key where the value was stored.
     */
    protected internalAdd(model: GradumModel, data: any, value: any, key: KeyType): KeyType;
    /**
     * @protected
     * @function addAction
     * @description Perform the raw insertion. Override this method to support other datatypes.
     * @param {GradumModel} model - The owning model.
     * @param {any} data - The container to insert into.
     * @param {any} value - The value to insert.
     * @param {KeyType} key - The target index or key. Clamped to valid array bounds for array containers.
     * @returns {KeyType} The index or key where the value was stored.
     */
    protected addAction(model: GradumModel, data: any, value: any, key: KeyType): KeyType;
    /**
     * @function add
     * @description Push a value to the end of an array-backed model. For non-array models, forwards to {@link set}.
     * @param {unknown} value - The value to insert.
     * @returns {KeyType} The index where the value was stored.
     */
    add(value: unknown): DataKeyType;
    /**
     * @function add
     * @description Insert a value into an array-backed model at the given index, or push it if no index is given.
     * For non-array models, forwards to {@link set}.
     * @param {unknown} value - The value to insert.
     * @param {KeyType} [key] - The index to insert at. If omitted, the value is pushed to the end.
     * @returns {KeyType} The index where the value was stored.
     */
    add(value: unknown, key?: DataKeyType): DataKeyType;
    /**
     * @function add
     * @description Insert a value at the given key path. For array-backed nodes, the last key is the insertion index.
     * For non-array models, forwards to {@link set}.
     * @param {unknown} value - The value to insert.
     * @param {...KeyType[]} keys - Key path to the target node, with the last key as the insertion index.
     * @returns {KeyType} The index or key where the value was stored.
     */
    add(value: unknown, ...keys: KeyType[]): KeyType;
    /**
     * @function addFlat
     * @description Insert a value at the position described by the given flat key.
     * @param {unknown} value - The value to insert.
     * @param {FlatKeyType} flatKey - A flat key produced by {@link flattenKey}.
     * @param {number} [depth] - Required when `flatKey` is a numeric index. The depth of the key path.
     * @returns {KeyType} The index or key where the value was stored.
     */
    addFlat(value: unknown, flatKey: FlatKeyType, depth?: number): KeyType;
    /**
     * @protected
     * @function hasAction
     * @description Check whether a key exists in a container. Override this method to support other datatypes.
     * @param {any} data - The container to check.
     * @param {KeyType} key - The key to check.
     * @returns {boolean} `true` if the key is present.
     */
    protected hasAction(data: any, key: KeyType): boolean;
    /**
     * @function has
     * @description Check whether the given key exists in the model.
     * @param {KeyType} key - The key to check.
     * @returns {boolean} `true` if the entry exists.
     */
    has(key: DataKeyType): boolean;
    /**
     * @function has
     * @description Check whether the given key path exists in the model.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     * @returns {boolean} `true` if the entry exists.
     */
    has(...keys: KeyType[]): boolean;
    /**
     * @function hasFlat
     * @description Check whether an entry exists at the given flat key.
     * @param {FlatKeyType} flatKey - A flat key produced by {@link flattenKey}.
     * @param {number} [depth] - Required when `flatKey` is a numeric index. The depth of the key path.
     * @returns {boolean}
     */
    hasFlat(flatKey: FlatKeyType, depth?: number): boolean;
    /**å
     * @protected
     * @function deleteAction
     * @description Remove a single key from a container. Override this method to support other datatypes.
     * @param {any} data - The container to remove from.
     * @param {KeyType} key - The key to remove.
     */
    protected deleteAction(data: any, key: KeyType): void;
    /**
     * @protected
     * @function internalDelete
     * @description Remove a key from a container, clearing any associated nested model, and firing {@link keyChanged}.
     * No-op if the key does not exist.
     * @param {GradumModel} model - The owning model for nested model cleanup and change notification,
     * or `undefined` for non-root containers.
     * @param {any} data - The container to remove from.
     * @param {KeyType} key - The key to remove.
     */
    protected internalDelete(model: GradumModel, data: any, key: KeyType): void;
    /**
     * @function delete
     * @description Remove the entry at the given key and notify observers.
     * @param {KeyType} key - The key to remove.
     */
    delete(key: DataKeyType): void;
    /**
     * @function delete
     * @description Remove the entry at the given key path and notify observers.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     */
    delete(...keys: KeyType[]): void;
    /**
     * @function deleteFlat
     * @description Remove the entry at the given flat key.
     * @param {FlatKeyType} flatKey - A flat key produced by {@link flattenKey}.
     * @param {number} [depth] - Required when `flatKey` is a numeric index. The depth of the key path.
     */
    deleteFlat(flatKey: FlatKeyType, depth?: number): void;
    protected getKeysAction(data: any): KeyType[];
    /**
     * @property keys
     * @description All keys currently present in the model.
     */
    get keys(): DataKeyType[];
    /**
     * @property values
     * @description All values in the model, in the order of {@link keys}.
     */
    get values(): any[];
    /**
     * @property dataSize
     * @description Number of entries in the model.
     */
    get dataSize(): number;
    /**
     * @function flatSize
     * @description Return the total number of entries reachable from this model at the given depth.
     * @param {number} depth - How many levels deep to count.
     * @returns {number}
     */
    flatSize(depth: number): number;
    protected diffCheck(oldData: DataType, newData: DataType): boolean;
    protected diffAction(oldData: DataType, newData: DataType): void;
    /**
     * @description Iterate over `[key, value]` pairs.
     */
    [Symbol.iterator](): IterableIterator<[DataKeyType, any]>;
    /**
     * @function entries
     * @description Return all `[key, value]` pairs in the model.
     * @returns {[KeyType, any][]}
     */
    entries(): [DataKeyType, any][];
    /**
     * @function forEach
     * @description Execute a callback for each entry in the model.
     * @param {(value: any, key: KeyType, model: this) => void} callback - Called with the value, key, and model.
     * @param {any} [thisArg] - Value to use as `this` when calling the callback.
     */
    forEach(callback: (value: any, key: DataKeyType, model: this) => void, thisArg?: any): void;
    /**
     * @function initialize
     * @description Fire change notifications for all existing keys, marking the model as initialized.
     * No-op if already initialized or if data is empty.
     */
    initialize(): void;
    /**
     * @function clear
     * @description Reset the model, clearing nested models, observers, and signals.
     * @param {boolean} [clearData=true] - Whether to also clear the stored data.
     */
    clear(clearData?: boolean): void;
    /**
     * @function toJSON
     * @description Convert the model's data into a JSON-serializable form.
     * Maps become plain objects. For non-object data types, the raw value is returned.
     * @returns {object | DataType}
     */
    toJSON(): object | DataType;
    /**
     * @function makeSignal
     * @description Return an existing reactive {@link SignalBox} for the given key, or create one if absent.
     * The signal reads via {@link get} and writes via {@link set}.
     * @template Type - The type of the signal's value.
     * @param {KeyType} key - The key to create a signal for.
     * @returns {SignalBox<Type>}
     */
    makeSignal<Type = any>(key: DataKeyType): SignalBox<Type>;
    /**
     * @function makeSignal
     * @description Return an existing reactive {@link SignalBox} for the given key path, or create one if absent.
     * The last key in the path is the signal's target; preceding keys navigate to the parent nested model.
     * The signal reads via {@link get} and writes via {@link set}.
     * @template Type - The type of the signal's value.
     * @param {...KeyType[]} keys - Key path, with the last key as the signal target.
     * @returns {SignalBox<Type>}
     */
    makeSignal<Type = any>(...keys: KeyType[]): SignalBox<Type>;
    /**
     * @function makeSignals
     * @description Return reactive {@link SignalBox} instances for multiple keys at the given path.
     * Pass {@link GradumModel.ALL} at any level of the path to expand all entries at that level.
     * @template Type - The type of the signals' values.
     * @param {...KeyType[]} keys - Key path to the signal targets. Use `ALL` at any level to target all entries there.
     * @returns {SignalBox<Type>[]}
     */
    makeSignals<Type = any>(...keys: KeyType[]): SignalBox<Type>[];
    /**
     * @function getSignal
     * @description Retrieve an existing {@link SignalBox} for the given key, or `undefined` if none exists.
     * @param {KeyType} key - The key whose signal to retrieve.
     * @returns {SignalBox<any>}
     */
    getSignal(key: DataKeyType): SignalBox<any>;
    /**
     * @function getSignal
     * @description Retrieve an existing {@link SignalBox} for the given key path, or `undefined` if none exists.
     * The last key in the path is the signal's target; preceding keys navigate to the parent nested model.
     * @param {...KeyType[]} keys - Key path, with the last key as the signal target.
     * @returns {SignalBox<any>}
     */
    getSignal(...keys: KeyType[]): SignalBox<any>;
    /**
     * @function nestAll
     * @description Return `[this]`.
     * @returns {[this]}
     */
    nestAll(): [this];
    /**
     * @function nestAll
     * @description Create or retrieve nested {@link GradumModel} instances at each entry under the given key path.
     * Use {@link GradumModel.ALL} in the path to expand all entries at that level.
     * @param {...KeyType[]} keys - Key path to the subtree to expand.
     * @returns {GradumModel[]} Array of nested models.
     */
    nestAll<NestedDataType = any, NestedKeyType extends KeyType = any>(...keys: KeyType[]): GradumModel<NestedDataType, NestedKeyType>[];
    /**
     * @function nestAll
     * @description Create or retrieve nested {@link GradumModel} instances at each entry under the given key path,
     * with custom initialization properties for the nested models.
     * Use {@link GradumModel.ALL} in the path to expand all entries at that level.
     * @param {...[...KeyType[], GradumModelProperties]} keysAndProperties - Key path followed by optional properties.
     * @returns {GradumModel[]} Array of nested models.
     */
    nestAll<NestedDataType = any, NestedKeyType extends KeyType = any>(...keysAndProperties: [...KeyType[], GradumModelProperties]): GradumModel<NestedDataType, NestedKeyType>[];
    private nestRecur;
    /**
     * @function nest
     * @description Create or retrieve a single nested {@link GradumModel} at the given key.
     * @param {KeyType} key - The key of the nested model.
     * @returns {GradumModel}
     */
    nest<NestedDataType = any, NestedKeyType extends KeyType = any>(key: DataKeyType): GradumModel<NestedDataType, NestedKeyType>;
    /**
     * @function nest
     * @description Create or retrieve a single nested {@link GradumModel} at the given key path.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     * @returns {GradumModel}
     */
    nest<NestedDataType = any, NestedKeyType extends KeyType = any>(...keys: KeyType[]): GradumModel<NestedDataType, NestedKeyType>;
    /**
     * @function nest
     * @description Create or retrieve a single nested {@link GradumModel} at the given key path,
     * with custom initialization properties.
     * @param {...[...KeyType[], GradumModelProperties]} keysAndProperties - Key path followed by optional properties.
     * @returns {GradumModel}
     */
    nest<NestedDataType = any, NestedKeyType extends KeyType = any>(...keysAndProperties: [...KeyType[], GradumModelProperties]): GradumModel<NestedDataType, NestedKeyType>;
    /**
     * @function getNested
     * @description Return `this`.
     * @returns {GradumModel}
     */
    getNested(): GradumModel;
    /**
     * @function getNested
     * @description Retrieve an already-created nested model at the given key, or `undefined` if none exists.
     * @param {KeyType} key - The key of the nested model.
     * @returns {GradumModel | undefined}
     */
    getNested(key: DataKeyType): GradumModel;
    /**
     * @function getNested
     * @description Retrieve an already-created nested model at the given key path, or `undefined` if none exists.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     * @returns {GradumModel | undefined}
     */
    getNested(...keys: KeyType[]): GradumModel;
    /**
     * @function generateObserver
     * @description Create and attach a {@link GradumObserver} to this model.
     * If a key path is provided, the observer is attached to the nested model(s) at that path instead.
     * Pass {@link GradumModel.ALL} at any level of the path to process all entries at that level,
     * allowing a single observer to track multiple subtrees simultaneously.
     * @param {GradumObserverProperties<DataEntryType, ComponentType, KeyType>} [properties={}] - Observer options and lifecycle callbacks.
     * @param {...KeyType[]} keys - Optional key path to the nested model(s) to observe. Use `ALL` at
     * any level to process all entries there.
     * @returns {GradumObserver<DataEntryType, ComponentType, KeyType>}
     */
    generateObserver(properties?: GradumObserverProperties<DataEntryType, ComponentType, DataKeyType>, ...keys: KeyType[]): GradumObserver<DataEntryType, ComponentType, DataKeyType>;
    /**
     * @function generateDeepObserver
     * @description Like {@link generateObserver}, but fires for the registered depth **and all deeper levels**.
     * Whereas `generateObserver(..., GradumModel.ALL)` only notifies at depth-2, `generateDeepObserver(..., GradumModel.ALL)`
     * also notifies for depth-3, depth-4, etc. — passing the full key path to `onAdded`/`onUpdated`/`onDeleted`.
     * Use when you need to react to any nested change regardless of depth.
     * @param {GradumObserverProperties<DataEntryType, ComponentType, KeyType>} [properties={}] - Observer options and lifecycle callbacks.
     * @param {...KeyType[]} keys - Optional key path to the nested model(s) to observe.
     * @returns {GradumObserver<DataEntryType, ComponentType, KeyType>}
     */
    generateDeepObserver(properties?: GradumObserverProperties<DataEntryType, ComponentType, DataKeyType>, ...keys: KeyType[]): GradumObserver<DataEntryType, ComponentType, DataKeyType>;
    protected initializeObserverOnPath(data: any, observer: GradumObserver, keys: KeyType[], prefixKeys: KeyType[], deep?: boolean): void;
    /**
     * @protected
     * @function keyChanged
     * @description Called internally whenever an entry is added, updated, or deleted.
     * Emits signals, fires {@link onKeyChanged}, and notifies attached observers.
     * @param {KeyType[]} keys - The key path that changed.
     * @param {unknown} [value] - The new value. Defaults to the current value at the key.
     * @param {boolean} [deleted=false] - Whether the entry was removed.
     */
    protected keyChanged(keys: KeyType[], value?: unknown, deleted?: boolean): void;
    private matchObserverAndNotify;
    private static flattenSize;
    /**
     * @function flattenKey
     * @description Serialize a key path into a single flat key.
     * - Fully numeric paths into array-backed data produce a numeric global leaf index.
     * - All other paths produce a `"k0|k1|k2|..."` string, with symbols encoded as `"@@description"`.
     * @param {...KeyType[]} keys - The key path to serialize.
     * @returns {FlatKeyType}
     */
    flattenKey(...keys: KeyType[]): FlatKeyType;
    /**
     * @function scopeKey
     * @description Convert a flat string key back into a key path. Reverses the string form of {@link flattenKey}.
     * Segments starting with `"@@"` are decoded back to symbols.
     * @param {string} flatKey - The flat string key to convert.
     * @returns {KeyType[]}
     */
    scopeKey(flatKey: string): KeyType[];
    /**
     * @function scopeKey
     * @description Convert a numeric global index back into a numeric key path.
     * Reverses the numeric form of {@link flattenKey}.
     * @param {number} flatKey - The numeric index to convert.
     * @param {number} depth - The depth of the key path to reconstruct.
     * @returns {KeyType[]}
     */
    scopeKey(flatKey: number, depth: number): KeyType[];
    /**
     * @function getHandler
     * @description Retrieves the attached MVC handler with the given key.
     * By default, unless manually defined in the handler, if the element's class name is MyElement
     * and the handler's class name is MyElementSomethingHandler, the key would be "something".
     * @param {string} key - The handler's key.
     * @return {GradumHandler} - The handler.
     */
    getHandler(key: string): GradumHandler;
    /**
     * @function addHandler
     * @description Registers a GradumHandler for the given key.
     * @param {GradumHandler} handler - The handler instance to register.
     */
    addHandler(handler: GradumHandler): void;
    setDataWithoutInitializing(data: DataType): void;
    fireCallback(key: string, ...values: any[]): void;
    private createNestedChild;
}

/**
 * @class GradumEmitter
 * @group MVC
 * @category Emitter
 *
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @template {KeyType} DataKeyType - The key type of the MVC's model.
 * @description The base MVC emitter class. Its role is basically an event bus. It allows the different parts of the
 * MVC structure to fire events or listen to some, with various methods.
 */
declare class GradumEmitter<ModelType extends GradumModel = GradumModel, DataKeyType extends KeyType = KeyType> {
    /**
     * @description Map containing all custom callbacks.
     * @protected
     */
    protected readonly callbacks: Map<string, Delegate<(...args: any[]) => void>>;
    /**
     * @description Map containing all data callbacks.
     * @protected
     */
    protected readonly dataCallbacks: Map<FlatKeyType, Delegate<(value: any, ...keys: DataKeyType[]) => void>>;
    /**
     * @description The attached MVC model.
     */
    model?: ModelType;
    constructor(model?: ModelType);
    /**
     * @function add
     * @description Register a callback for the given event name.
     * @param {string} event - The event name.
     * @param {(...args: any[]) => void} callback - The callback to invoke when the event fires.
     */
    add(event: string, callback: (...args: any[]) => void): void;
    /**
     * @function remove
     * @description Remove a specific callback from the given event, or all callbacks if omitted.
     * @param {string} event - The event name.
     * @param {(...args: any[]) => void} [callback] - The callback to remove. If omitted,
     * all callbacks for the event are removed.
     */
    remove(event: string, callback?: (...args: any[]) => void): void;
    /**
     * @function fire
     * @description Trigger all callbacks registered for the given event name.
     * @param {string} event - The event name.
     * @param {...any[]} args - Arguments passed to each callback.
     */
    fire(event: string, ...args: any[]): void;
    /**
     * @function addKey
     * @description Register a callback fired when the entry at the given key path changes in the model.
     * The callback receives the new value as its first argument, followed by the key path as spread arguments.
     * @param {(value: any, ...keys: DataKeyType[]) => void} callback - The callback to register.
     * @param {...DataKeyType[]} keys - Ordered path from outermost to innermost key.
     */
    addKey(callback: (value: any, ...keys: DataKeyType[]) => void, ...keys: DataKeyType[]): void;
    /**
     * @function removeKey
     * @description Remove a specific callback for the given key path, or all callbacks if omitted.
     * @param {(value: any, ...keys: DataKeyType[]) => void} [callback] - The callback to remove. If omitted,
     * all callbacks for this path are removed.
     * @param {...DataKeyType[]} keys - Ordered path from outermost to innermost key.
     */
    removeKey(callback: (value: any, ...keys: DataKeyType[]) => void, ...keys: DataKeyType[]): void;
    /**
     * @function fireKey
     * @description Trigger all callbacks registered for the given key path.
     * Called automatically when the model fires a change notification at this path.
     * @param {any} value - The new value at the key path.
     * @param {...DataKeyType[]} keys - Ordered path from outermost to innermost key.
     */
    fireKey(value: any, ...keys: DataKeyType[]): void;
    /**
     * @protected
     * @function resolveFlatKey
     * @description Convert a key path to a stable flat string key for internal storage lookup. Joins with `"|"`.
     * @param {DataKeyType[]} keys - The key path to flatten.
     * @returns {FlatKeyType}
     */
    protected resolveFlatKey(keys: DataKeyType[]): FlatKeyType;
}

/**
 * @group MVC
 * @category Model
 */
type MvcBlocksType<Type extends "array" | "map" = "map", BlockType extends object = object> = Type extends "map" ? Map<string, BlockType> : BlockType[];
/**
 * @group MVC
 * @category Model
 */
type MvcBlockKeyType<Type extends "array" | "map" = "map"> = Type extends "map" ? string : number;
/**
 * @group MVC
 * @category Model
 */
type MvcFlatKeyType<B extends "array" | "map"> = B extends "array" ? number : string;
/**
 * @group MVC
 * @category View
 */
type GradumViewProperties<ElementType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = {
    element: ElementType;
    model?: ModelType;
    emitter?: EmitterType;
};

/**
 * @class GradumView
 * @group MVC
 * @category View
 *
 * @template {object} ElementType - The type of the element attached to the view.
 * @template {GradumModel} ModelType - The model type used in this view.
 * @template {GradumEmitter} EmitterType - The emitter type used in this view.
 * @description A base view class for MVC elements, providing structure for initializing and managing UI setup and
 * event listeners. Designed to be devoid of logic and only handle direct UI changes.
 */
declare class GradumView<ElementType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> {
    /**
     * @description The main component this view is attached to.
     */
    element: ElementType;
    /**
     * @description The model instance this view is bound to.
     */
    model?: ModelType;
    /**
     * @description The emitter instance used for event communication.
     */
    emitter?: EmitterType;
    /**
     * @constructor
     * @param {GradumViewProperties<ElementType, ModelType, EmitterType>} properties - Properties to initialize the view with.
     */
    constructor(properties: GradumViewProperties<ElementType, ModelType, EmitterType>);
    /**
     * @function setup
     * @description Called in the constructor. Use for setup that should happen at instantiation,
     * before `this.initialize()` is called.
     * @protected
     */
    protected setup(): void;
    /**
     * @function initialize
     * @description Initializes the view by setting up change callbacks, UI elements, layout, and event listeners.
     */
    initialize(): void;
    /**
     * @function setupChangedCallbacks
     * @description Setup method for initializing data/model change listeners and associated UI logic.
     * @protected
     */
    protected setupChangedCallbacks(): void;
    /**
     * @function setupUIElements
     * @description Setup method for initializing and storing sub-elements of the UI.
     * @protected
     */
    protected setupUIElements(): void;
    /**
     * @function setupUILayout
     * @description Setup method for creating the layout structure and injecting sub-elements into the DOM tree.
     * @protected
     */
    protected setupUILayout(): void;
    /**
     * @function setupUIListeners
     * @description Setup method for defining DOM and input event listeners.
     * @protected
     */
    protected setupUIListeners(): void;
}

/**
 * @type {GradumOperatorProperties}
 * @group MVC
 * @category Operator
 *
 * @extends {GradumViewProperties}
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description  Options used to create a new {@link GradumOperator} attached to an element.
 * @property {ViewType} [view] - The MVC view.
 */
type GradumOperatorProperties<ElementType extends object = object, ViewType extends GradumView = GradumView, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumViewProperties<ElementType, ModelType, EmitterType> & {
    view?: ViewType;
};

/**
 * @class GradumOperator
 * @group MVC
 * @category Operator
 *
 * @description The MVC base operator class. Its main job is to handle some part of (or all of) the logic of the
 * component. It has access to the element, the model to read and write data, the view to update the UI, and the
 * emitter to listen for changes in the model or any other internal events. It can only communicate with other
 * operators via the emitter (by firing or listening for changes on a certain key).
 * @template {object} ElementType - The type of the main component.
 * @template {GradumView} ViewType - The element's MVC view type.
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @template {GradumEmitter} EmitterType - The element's MVC emitter type.
 */
declare class GradumOperator<ElementType extends object = object, ViewType extends GradumView = GradumView<any, any>, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> {
    /**
     * @description The key of the operator. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the operator's class name is MyElementSomethingOperator, the key would
     * default to "something".
     */
    keyName: string;
    /**
     * @description The element it is bound to.
     */
    element: ElementType;
    /**
     * @description The MVC view.
     */
    view: ViewType;
    /**
     * @description The MVC model.
     */
    model: ModelType;
    /**
     * @description The MVC emitter.
     */
    emitter: EmitterType;
    constructor(properties: GradumOperatorProperties<ElementType, ViewType, ModelType, EmitterType>);
    /**
     * @function setup
     * @description Called in the constructor. Use for setup that should happen at instantiation,
     * before `this.initialize()` is called.
     * @protected
     */
    protected setup(): void;
    /**
     * @function initialize
     * @description Initializes the operator. Specifically, it will set up the change callbacks.
     */
    initialize(): void;
    /**
     * @function setupUIListeners
     * @description Setup method for defining DOM and input event listeners.
     * @protected
     */
    protected setupUIListeners(): void;
    /**
     * @function setupChangedCallbacks
     * @description Setup method intended to initialize change listeners and callbacks.
     * @protected
     */
    protected setupChangedCallbacks(): void;
}

/**
 * @class Listener
 * @group Components
 * @category Listener
 *
 * @template {Node} TargetType - The type of the event target.
 * @template {ListenerCallback<TargetType>} CallbackType - The type of the callback executed by this listener.
 * @description Object representing an event listener, storing its metadata (type, target, toolName, options,
 * manager) and providing utilities to execute and match it.
 */
declare class Listener<TargetType extends Node = Node, CallbackType extends ListenerCallback<TargetType> = ListenerCallback<TargetType>> {
    /** @description Event type (e.g., `"click"`, `"pointermove"`). */
    readonly type: string;
    /** @description Target node this listener is associated with. */
    target: TargetType;
    /** @description Name of the tool this listener is bound to (if any). */
    readonly toolName: string;
    /** @description Callback provided by the user. */
    readonly callback: CallbackType;
    /**
     * @description Bundled listener that adapts native events to the {@link ListenerCallback} signature.
     */
    readonly bundledListener: ((e: Event) => Propagation | any);
    /** @description Listener options used for registration and additional behaviors.*/
    readonly options: ListenerOptions;
    /** @description Associated event manager used to coordinate listener execution. */
    readonly manager: GradumEventManager;
    /** @description Last animation frame index during which this listener executed. */
    lastExecutionFrame: number;
    /** @description Last timestamp (ms) at which this listener executed. */
    lastExecutionTime: number;
    /**
     * @constructor
     * @param {ListenerProperties<TargetType, CallbackType>} properties - Listener configuration.
     * @description Creates a {@link Listener}.
     */
    constructor(properties: ListenerProperties<TargetType, CallbackType>);
    /**
     * @function execute
     * @description Executes the listener using its bundled signature.
     * @param {Event} e - Event passed to the callback.
     * @returns {Propagation} Propagation returned by the callback.
     */
    execute(e: Event): Propagation;
    /**
     * @function executeOn
     * @description Executes the underlying callback on an explicit target.
     * @param {Event} e - Event passed to the callback.
     * @param {TargetType} target - Target node.
     * @param {...any[]} args - Additional arguments forwarded to the callback.
     * @returns {any} Whatever the callback returns (typically {@link Propagation}).
     */
    executeOn(e: Event, target: TargetType, ...args: any[]): any;
    /**
     * @function match
     * @description Checks whether this listener matches a subset of properties.
     * @param {MatchListenerProperties<TargetType, CallbackType>} [properties={}] - Properties to match against.
     * @returns {boolean} Whether this listener matches.
     */
    match(properties?: MatchListenerProperties): boolean;
}

/**
 * @class ListenerSet
 * @group Components
 * @category Listener
 *
 * @template {Node} TargetType - The type of the event target.
 * @template {ListenerCallback<TargetType>} CallbackType - The type of the callback executed by this listener.
 * @description Collection of {@link Listener} instances indexed by event type.
 * Provides helpers to add/remove/query listeners and to remove listeners matching criteria.
 */
declare class ListenerSet<TargetType extends Node = Node, CallbackType extends ListenerCallback<TargetType> = ListenerCallback<TargetType>> {
    /**
     * @description Map from event type to a set of listeners registered for that type.
     */
    readonly listeners: Map<string, Set<Listener<TargetType, CallbackType>>>;
    /**
     * @readonly
     * @description Flattened array of all listeners in the set.
     */
    get listenersArray(): Listener<TargetType, CallbackType>[];
    /**
     * @function addListener
     * @description Adds a listener to the set.
     * @param {ListenerProperties<TargetType, CallbackType>} properties - The listener properties to add.
     */
    addListener(properties: ListenerProperties<TargetType, CallbackType>): void;
    /**
     * @function addListener
     * @description Adds a listener to the set.
     * @param {Listener<TargetType, CallbackType>} listener - The listener to add.
     */
    addListener(listener: Listener<TargetType, CallbackType>): void;
    /**
     * @function removeListener
     * @description Removes a listener from the set.
     * @param {ListenerCallback<TargetType>} callback - The listener callback to remove.
     */
    removeListener(callback: ListenerCallback<TargetType>): void;
    /**
     * @function removeListener
     * @description Removes a listener from the set.
     * @param {Listener<TargetType, CallbackType>} listener - The listener to remove.
     */
    removeListener(listener: Listener<TargetType, CallbackType>): void;
    /**
     * @function removeMatchingListeners
     * @description Removes all listeners that match the provided properties (see {@link Listener.match}).
     * @param {MatchListenerProperties<TargetType, CallbackType>} [matchingProperties={}] - Properties to match.
     */
    removeMatchingListeners(matchingProperties?: MatchListenerProperties<TargetType, CallbackType>): void;
    /**
     * @function getListeners
     * @description Returns all listeners matching the provided properties (see {@link Listener.match}).
     * @param {MatchListenerProperties<TargetType, CallbackType>} [matchingProperties={}] - Properties to match.
     * @returns {Listener[]} Matching listeners.
     */
    getListeners(matchingProperties?: MatchListenerProperties<TargetType, CallbackType>): Listener[];
    /**
     * @function getListenersByType
     * @description Returns the set of listeners registered for the given event type.
     * @param {string} type - Event type.
     * @returns {Set<Listener<TargetType, CallbackType>>} Set of listeners for that type.
     */
    getListenersByType(type: string): Set<Listener<TargetType, CallbackType>>;
}

/**
 * @enum {Propagation}
 * @group Types
 * @category Event
 *
 * @description Enum dictating the propagation of an event.
 *
 * @property {Propagation.propagate} propagate - Continue normal propagation.
 * @property {Propagation.stopPropagation} stopPropagation - Stop propagation to parent targets.
 * @property {Propagation.stopImmediatePropagation} stopImmediatePropagation - Stop propagation and prevent any
 * additional listeners on the same target from executing.
 */
declare enum Propagation {
    propagate = "propagate",
    stopPropagation = "stopPropagation",
    stopImmediatePropagation = "stopImmediatePropagation"
}
/**
 * @type {PreventDefaultOptions}
 * @group Types
 * @category Event
 *
 * @description Options for {@link GradumSelector.preventDefault}, which prevents default browser behaviors for
 * selected event types and can optionally stop propagation.
 *
 * @property {string[]} [types] - List of event types to affect. If omitted, defaults to {@link BasicInputEvents}.
 * @property {"capture" | "bubble"} [phase] - Which phase to prevent. Defaults to `"bubble"`.
 * @property {false | "stop" | "immediate"} [stop] - Whether to stop propagation when handling the event:
 * - `false`: do not stop propagation,
 * - `"stop"`: call `stopPropagation`,
 * - `"immediate"`: call `stopImmediatePropagation`.
 * @property {(type: string, e: Event) => boolean} [preventDefaultOn] - Predicate to decide (per event) whether to
 * call `preventDefault`. Return `true` to prevent default for that event.
 * @property {boolean} [clearPreviousListeners] - If true, clears previously installed prevent-default listeners
 * before installing new ones.
 * @property {GradumEventManager} [manager] - Event manager to use. Defaults to {@link GradumEventManager.instance}.
 */
type PreventDefaultOptions = {
    types?: string[];
    phase?: "capture" | "bubble";
    stop?: false | "stop" | "immediate";
    preventDefaultOn?: (type: string, e: Event) => boolean;
    clearPreviousListeners?: boolean;
    manager?: GradumEventManager;
};
/**
 * @group Types
 * @category Event
 * @description Default set of basic input event types typically handled by {@link GradumSelector.preventDefault}.
 */
declare const BasicInputEvents: readonly ["mousedown", "mouseup", "mousemove", "click", "dblclick", "contextmenu", "dragstart", "selectstart", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "wheel"];
/**
 * @group Types
 * @category Event
 * @description Event types that should usually be registered as **non-passive** when you intend to call
 *  * `preventDefault()` (e.g., scroll/touch/pointer interactions).
 */
declare const NonPassiveEvents: readonly ["wheel", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointercancel"];
/**
 * @type {ListenerProperties}
 * @group Components
 * @category Listener
 *
 * @template {Node} TargetType - The type of the event target.
 * @template {ListenerCallback<TargetType>} CallbackType - The type of the callback executed by this listener.
 * @description Configuration object used to construct a {@link Listener}.
 *
 * @property {string} type - Event type (e.g., `"click"`, `"pointermove"`).
 * @property {CallbackType} callback - Listener callback.
 * @property {TargetType} [target] - Target node.
 * @property {string} [toolName] - Tool name to bind this listener to (if applicable).
 * @property {ListenerOptions} [options] - Options controlling registration and execution behaviors.
 * @property {GradumEventManager} [manager] - Event manager to use. Defaults to {@link GradumEventManager.instance}.
 */
type ListenerProperties<TargetType extends Node = Node, CallbackType extends ListenerCallback<TargetType> = ListenerCallback<TargetType>> = {
    type: string;
    callback: CallbackType;
    target?: TargetType;
    toolName?: string;
    options?: ListenerOptions;
    manager?: GradumEventManager;
};
/**
 * @type {MatchListenerProperties}
 * @group Components
 * @category Listener
 *
 * @template {Node} TargetType - The type of the event target.
 * @template {ListenerCallback<TargetType>} CallbackType - The type of the callback executed by this listener.
 * @extends ListenerProperties
 * @description Properties used for matching listeners (see {@link Listener.match}).
 *
 * @property {string[]} [optionsToSkip] - List of option keys to ignore when matching `options`.
 */
type MatchListenerProperties<TargetType extends Node = Node, CallbackType extends ListenerCallback<TargetType> = ListenerCallback<TargetType>> = Partial<ListenerProperties<TargetType, CallbackType>> & {
    optionsToSkip?: string[];
};
/**
 * @callback ListenerCallback
 * @group Components
 * @category Listener
 * @template {Node} Type - The type of the event target.
 *
 * @description Callback signature for listeners. Receives the native event and the resolved target.
 *
 * @param {Event} e - The native event.
 * @param {Type} el - The target element/node the listener is bound to.
 * @returns {Propagation | any} A propagation directive (or any value).
 */
type ListenerCallback<Type extends Node = Node> = ((e: Event, el: Type) => Propagation | any);
/**
 * @type {ListenerOptions}
 * @group Components
 * @category Listener
 * @extends AddEventListenerOptions
 * @description Options used for listeners.
 *
 * @property {boolean} [checkConstrainers] - If true, checks constrainers before execution. Defaults to true.
 * @property {boolean} [solveConstrainers] - If true, triggers constrainer solving after execution. Defaults to true.
 * @property {number} [throttleEveryFrames] - Throttle execution to at most once every N animation frames.
 * @property {number} [throttleEveryMs] - Throttle execution to at most once every N milliseconds.
 */
type ListenerOptions = AddEventListenerOptions & {
    checkConstrainers?: boolean;
    solveConstrainers?: boolean;
    throttleEveryFrames?: number;
    throttleEveryMs?: number;
};

/**
 * @type {GradumInteractorProperties}
 * @group MVC
 * @category Interactor
 *
 * @extends {GradumOperatorProperties}
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description  Options used to create a new {@link GradumInteractor} attached to an element.
 * @property {string} [toolName] - The name of the tool (if any) that the event listeners will listen for.
 * @property {Node} [target] - The target that will listen for the events. Defaults to `this.element`.
 * @property {PartialRecord<DefaultEventNameKey, ListenerOptions>} [listenerOptions] - Custom default options to define
 * for all listeners.
 * @property {GradumEventManager} [manager] - The event manager instance the listeners should register against. Defaults
 * to `GradumEventManager.instance`.
 */
type GradumInteractorProperties<ElementType extends object = object, ViewType extends GradumView = GradumView, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumOperatorProperties<ElementType, ViewType, ModelType, EmitterType> & {
    manager?: GradumEventManager;
    toolName?: string;
    target?: Node;
    listenerOptions?: ListenerOptions;
};

/**
 * @class GradumInteractor
 * @group MVC
 * @category Interactor
 *
 * @extends GradumOperator
 * @template {object} ElementType - The type of the main component.
 * @template {GradumView} ViewType - The element's MVC view type.
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @template {GradumEmitter} EmitterType - The element's MVC emitter type.
 * @description Class representing an MVC interactor. It holds event listeners to set up on the element itself, or
 * the custom defined target.
 */
declare class GradumInteractor<ElementType extends object = object, ViewType extends GradumView = GradumView<any, any>, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumOperator<ElementType, ViewType, ModelType, EmitterType> {
    /**
     * @description The key of the interactor. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the interactor's class name is MyElementSomethingInteractor, the key would
     * default to "something".
     */
    keyName: string;
    /**
     * @description The target of the event listeners. Defaults to the element itself.
     */
    accessor target: Node;
    /**
     * @readonly
     * @description The name of the tool (if any) to listen for.
     */
    readonly toolName: string;
    /**
     * @readonly
     * @description The associated event manager. Defaults to `GradumEventManager.instance`.
     */
    readonly manager: GradumEventManager;
    /**
     *
     * @readonly
     * @description Optional custom options to define per event type.
     */
    readonly options: ListenerOptions;
    constructor(properties: GradumInteractorProperties<ElementType, ViewType, ModelType, EmitterType>);
}

/**
 * @group Types
 * @category Event Names
 */
declare const GradumKeyEventName: {
    readonly keyPressed: "gradum-key-pressed";
    readonly keyReleased: "gradum-key-released";
};
/**
 * @group Types
 * @category Event Names
 */
declare const DefaultKeyEventName: {
    readonly keyPressed: "keydown";
    readonly keyReleased: "keyup";
};
/**
 * @group Types
 * @category Event Names
 */
declare const GradumClickEventName: {
    readonly click: "gradum-click";
    readonly clickStart: "gradum-click-start";
    readonly clickEnd: "gradum-click-end";
    readonly longPress: "gradum-long-press";
};
/**
 * @group Types
 * @category Event Names
 */
declare const DefaultClickEventName: {
    readonly click: "click";
    readonly clickStart: "mousedown";
    readonly clickEnd: "mouseup";
    readonly longPress: "gradum-long-press";
};
/**
 * @group Types
 * @category Event Names
 */
declare const GradumMoveEventName: {
    readonly move: "gradum-move";
};
/**
 * @group Types
 * @category Event Names
 */
declare const DefaultMoveEventName: {
    readonly move: "mousemove";
};
/**
 * @group Types
 * @category Event Names
 */
declare const GradumDragEventName: {
    readonly drag: "gradum-drag";
    readonly dragStart: "gradum-drag-start";
    readonly dragEnd: "gradum-drag-end";
};
/**
 * @group Types
 * @category Event Names
 */
declare const DefaultDragEventName: {
    readonly drag: "gradum-drag";
    readonly dragStart: "gradum-drag-start";
    readonly dragEnd: "gradum-drag-end";
};
/**
 * @group Types
 * @category Event Names
 */
declare const GradumWheelEventName: {
    readonly scroll: "gradum-scroll";
    readonly pinch: "gradum-pinch";
};
/**
 * @group Types
 * @category Event Names
 */
declare const DefaultWheelEventName: {
    readonly scroll: "wheel";
    readonly pinch: "wheel";
};
/**
 * @group Types
 * @category Event Names
 */
declare const GradumEventName: {
    readonly selectInput: "gradum-select-input";
    readonly scroll: "gradum-scroll";
    readonly pinch: "gradum-pinch";
    readonly drag: "gradum-drag";
    readonly dragStart: "gradum-drag-start";
    readonly dragEnd: "gradum-drag-end";
    readonly move: "gradum-move";
    readonly keyPressed: "gradum-key-pressed";
    readonly keyReleased: "gradum-key-released";
    readonly click: "gradum-click";
    readonly clickStart: "gradum-click-start";
    readonly clickEnd: "gradum-click-end";
    readonly longPress: "gradum-long-press";
};
/**
 * @group Types
 * @category Event Names
 *
 * @description Object containing the names of events fired by default by the gradumComponents. Modifying it (prior to
 * setting up new gradum components) will subsequently alter the events that the instantiated components will listen for.
 */
declare const DefaultEventName: {
    wheel: string;
    scroll: string;
    input: string;
    change: string;
    focus: string;
    focusIn: string;
    focusOut: string;
    blur: string;
    resize: string;
    compositionStart: string;
    compositionEnd: string;
    pinch: "wheel";
    drag: "gradum-drag";
    dragStart: "gradum-drag-start";
    dragEnd: "gradum-drag-end";
    move: "mousemove";
    click: "click";
    clickStart: "mousedown";
    clickEnd: "mouseup";
    longPress: "gradum-long-press";
    keyPressed: "keydown";
    keyReleased: "keyup";
};
/**
 * @group Types
 * @category Event Names
 */
type DefaultEventNameKey = keyof typeof DefaultEventName;
/**
 * @group Types
 * @category Event Names
 */
type DefaultEventNameEntry = typeof DefaultEventName[DefaultEventNameKey];
/**
 * @group Types
 * @category Event Names
 */
type GradumEventNameKey = keyof typeof GradumEventName;
/**
 * @group Types
 * @category Event Names
 */
type GradumEventNameEntry = typeof GradumEventName[GradumEventNameKey];

/**
 * @type {MakeToolOptions}
 * @group Types
 * @category Tool
 *
 * @description Options used to create a new tool attached to an element via {@link makeTool}.
 * @property {() => void} [onActivate] - Function to execute when the tool is activated.
 * @property {() => void} [onDeactivate] - Function to execute when the tool is deactivated.
 * @property {DefaultEventNameEntry} [activationEvent] - Custom activation event to listen to. Defaults to the
 * default click event name.
 * @property {ClickMode} [clickMode] -  Click mode that will hold this tool when activated. Defaults to `ClickMode.left`.
 * @property {(element: Gradum<Element>, manager: GradumEventManager) => void} [customActivation] - Custom activation
 * function. If provided, is called with `(el, manager)` to define when the tool is activated.
 * @property {string} [key] - Optional keyboard key to map to this tool. When pressed, it will be set as the current key tool.
 * @property {GradumEventManager} [manager] - The event manager instance this tool should register against. Defaults
 * to `GradumEventManager.instance`.
 */
type MakeToolOptions<ElementType extends object = object> = {
    onActivate?: () => void;
    onDeactivate?: () => void;
    activationEvent?: DefaultEventNameEntry;
    clickMode?: ClickMode;
    customActivation?: (element: ElementType, manager?: GradumEventManager) => void;
    key?: string;
    manager?: GradumEventManager;
};
/**
 * @type {ToolBehaviorCallback}
 * @group Types
 * @category Tool
 *
 * @description Function signature for a tool behavior. Returning `true` marks the behavior as handled/consumed,
 * leading to stopping the propagation of the event.
 * @param {Event} event - The original DOM/Gradum event.
 * @param {Node} target - The node the behavior should operate on (the object or its embedded target).
 * @param {ToolBehaviorOptions} [options] - Additional info (embedded context, etc.).
 * @return {boolean} - Whether to stop the propagation.
 */
type ToolBehaviorCallback<TargetType extends Node = Node> = (event: Event, target: TargetType, options?: ToolBehaviorOptions) => Propagation | any;
/**
 * @type {ToolBehaviorOptions}
 * @group Types
 * @category Tool
 *
 * @description Options object passed to tool behaviors at execution time.
 * @property {boolean} [isEmbedded] - Indicates if the tool is embedded in a target node.
 * @property {Node} [embeddedTarget] - The target of the tool, if it is embedded.
 */
type ToolBehaviorOptions = {
    isEmbedded?: boolean;
    embeddedTarget?: Node;
};
/**
 * @type {GradumToolProperties}
 * @group MVC
 * @category Tool
 *
 * @extends GradumOperatorProperties
 * @extends MakeToolOptions
 *
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description Options used to create a new {@link GradumTool} attached to an element.
 * @property {string} [toolName] - The name of the tool.
 * @property {Node} [embeddedTarget] - If the tool is embedded, its target.
 */
type GradumToolProperties<ElementType extends object = object, ViewType extends GradumView = GradumView, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumOperatorProperties<ElementType, ViewType, ModelType, EmitterType> & MakeToolOptions & {
    toolName?: string;
    embeddedTarget?: Node;
};

/**
 * @class GradumTool
 * @group MVC
 * @category Tool
 *
 * @extends GradumOperator
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 * @description Class representing a tool in MVC, bound to the provided element.
 */
declare class GradumTool<ElementType extends object = object, ViewType extends GradumView = GradumView<any, any>, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumOperator<ElementType, ViewType, ModelType, EmitterType> {
    /**
     * @description The key of the tool. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the tool's class name is MyElementSomethingTool, the key would
     * default to "something".
     */
    keyName: string;
    /**
     * @description The name of the tool.
     */
    toolName: string;
    /**
     * @readonly
     * @description The target of this tool. If defined, will embed the tool.
     */
    readonly embeddedTarget: Node;
    /**
     * @readonly
     * @description The associated event manager. Defaults to `GradumEventManager.instance`.
     */
    readonly manager: GradumEventManager;
    /**
     * @readonly
     * @description Custom activation event to listen to. Defaults to the default click event name.
     */
    readonly activationEvent: DefaultEventNameEntry;
    /**
     * @readonly
     * @description Click mode that will hold this tool when activated. Defaults to `ClickMode.left`.
     */
    readonly clickMode: ClickMode;
    /**
     * @readonly
     * @description Optional keyboard key to map to this tool. When pressed, it will be set as the current key tool.
     */
    readonly key: string;
    constructor(properties: GradumToolProperties<ElementType, ViewType, ModelType, EmitterType>);
    /**
     * @function initialize
     * @override
     * @description Initialization function that calls {@link makeTool} on `this.element`, sets it up, and attaches
     * all the defined tool behaviors.
     */
    initialize(): void;
}

/**
 * @type {GradumConstrainerProperties}
 * @group MVC
 * @category Constrainer
 *
 * @extends GradumOperatorProperties
 * @extends MakeConstrainerOptions
 *
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description Options used to create a new {@link GradumConstrainer} attached to an element.
 * @property {string} [constrainerName] - The name of the constrainer.
 */
type GradumConstrainerProperties<ElementType extends object = object, ViewType extends GradumView = GradumView, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumOperatorProperties<ElementType, ViewType, ModelType, EmitterType> & MakeConstrainerOptions & {
    constrainerName?: string;
};

/**
 * @class GradumQueue
 * @group Components
 * @category GradumQueue
 */
declare class GradumQueue<Type = any> {
    private items;
    private head;
    push(...values: Type[]): this;
    addOnTop(...values: Type[]): this;
    pop(): Type | undefined;
    peek(): Type;
    has(value: Type): boolean;
    get size(): number;
    get isEmpty(): boolean;
    removeDuplicates(entry?: Type): this;
    clear(): this;
    toArray(): Type[];
    clone(): GradumQueue<Type>;
    remove(value: Type): boolean;
}

/**
 * @type {NodeListType}
 * @group Components
 * @category GradumNodeList
 *
 * @description Union type representing any value that can be added to or removed from a
 * {@link GradumNodeList}. Accepts a {@link GradumNodeList}, a live DOM {@link HTMLCollection},
 * a {@link NodeListOf}, a {@link Set}, or a plain array.
 *
 * @template {object} EntryType - The type of the nodes held in the collection.
 */
type NodeListType<EntryType extends object = object> = GradumNodeList<EntryType> | HTMLCollection | NodeListOf<EntryType & Node> | Set<EntryType> | EntryType[];
type NodeListSlot<EntryType extends object = object> = GradumNodeList<EntryType> | HTMLCollection | NodeListOf<EntryType & Node> | EntryType;

/**
 * @class GradumNodeList
 * @group Components
 * @category GradumNodeList
 *
 * @description A composable, Set-like collection for managing nodes. Supports individual nodes, live DOM
 * collections ({@link HTMLCollection} or {@link NodeListOf}), and nested {@link GradumNodeList} instances as
 * sub-lists. Changes to sub-lists and live DOM collections propagate automatically on iteration.
 *
 * @template {object} Type - The type of the nodes held in the list.
 */
declare class GradumNodeList<Type extends object = object> {
    private slots;
    private ignoredMap;
    private domListObservers;
    private subNodeListHandlers;
    /**
     * @description Delegate fired whenever an entry is added to or removed from the list, including entries
     * from nested {@link GradumNodeList}s, {@link HTMLCollection}s, and {@link NodeListOf} instances.
     */
    onChanged: Delegate<(entry: Type, state: "added" | "removed") => void>;
    /**
     * @constructor
     * @param {...(Type | NodeListType<Type>)[]} [values] - Optional initial value(s) to populate the list with.
     */
    constructor(...values: (Type | NodeListType<Type>)[]);
    /**
     * @description Whether to observe added {@link HTMLCollection}s and {@link NodeListOf} instances for DOM
     * mutations, automatically firing {@link onChanged} when nodes are added or removed from the DOM.
     */
    set observeDomLists(value: boolean);
    /**
     * @description A {@link Set} snapshot of all entries in this list, without duplicates.
     */
    get list(): Set<Type>;
    set list(value: NodeListType<Type>);
    /**
     * @description An array snapshot of all entries in this list, without duplicates.
     */
    get array(): Type[];
    /**
     * @description The number of resolved unique entries in this list. For the number of slots, see
     * {@link slotCount}.
     */
    get size(): number;
    /**
     * @description The number of slots in this list. Individual entries, {@link HTMLCollection}s,
     * {@link NodeListOf} instances, and nested {@link GradumNodeList}s each count as one slot, regardless
     * of how many entries they contain. For the number of resolved entries, see {@link size}.
     */
    get slotCount(): number;
    /**
     * @function isGradumNodeList
     * @protected
     * @description Type guard — returns true if the given value is a {@link GradumNodeList}.
     * @param {any} entry - The value to check.
     * @returns {boolean} Whether the value is a {@link GradumNodeList}.
     */
    protected isGradumNodeList(entry: any): entry is GradumNodeList<Type>;
    /**
     * @function isDomList
     * @protected
     * @description Type guard — returns true if the given value is an {@link HTMLCollection} or
     * {@link NodeListOf}.
     * @param {any} entry - The value to check.
     * @returns {boolean} Whether the value is a DOM list.
     */
    protected isDomList(entry: any): entry is HTMLCollection | NodeListOf<Type & Node>;
    /**
     * @function isSet
     * @protected
     * @description Type guard — returns true if the given value is a {@link Set} or an array.
     * @param {any} entry - The value to check.
     * @returns {boolean} Whether the value is a Set or array.
     */
    protected isSet(entry: any): entry is Set<Type> | Type[];
    /**
     * @function isEntry
     * @protected
     * @description Type guard — returns true if the given value is an individual node entry (i.e. not a
     * {@link GradumNodeList}, DOM list, Set, array, or {@link WeakRef}).
     * @param {any} entry - The value to check.
     * @returns {boolean} Whether the value is an individual entry.
     */
    protected isEntry(entry: any): entry is Type;
    /**
     * @description Iterates over all resolved unique entries in slot order, skipping ignored and duplicate
     * entries.
     */
    [Symbol.iterator](): IterableIterator<Type>;
    /**
     * @function resolveSlot
     * @description Resolves a slot {@link WeakRef} into its constituent entries. Yields all entries from
     * sub-lists and DOM lists, or the single entry for individual node slots. Yields nothing if the
     * referent has been garbage collected.
     * @param {WeakRef<NodeListSlot<Type>>} slot - The slot to resolve.
     */
    protected resolveSlot(slot: WeakRef<NodeListSlot<Type>>): IterableIterator<Type>;
    forEach(callback: (value: Type, set: this) => void, thisArg?: any): this;
    /**
     * @function add
     * @description Adds one or more entries to the end of the list. Entries may be individual nodes,
     * arrays, {@link Set}s, {@link HTMLCollection}s, {@link NodeListOf} instances, or nested
     * {@link GradumNodeList}s.
     * @param {...(NodeListType<Type> | Type)[]} entries - The entries to add.
     * @returns {this} Itself, allowing for method chaining.
     */
    add(...entries: (NodeListType<Type> | Type)[]): this;
    /**
     * @function addAt
     * @description Adds one or more entries at the given resolved size index. The index refers to the position
     * among resolved unique entries, not slots. Arrays and {@link Set}s are expanded inline.
     * @param {number} index - The resolved entry index to insert at.
     * @param {...(NodeListType<Type> | Type)[]} entries - The entries to add.
     * @returns {this} Itself, allowing for method chaining.
     */
    addAt(index: number, ...entries: (NodeListType<Type> | Type)[]): this;
    /**
     * @function addAtSlot
     * @description Adds one or more entries at the given slot index. Subsequent entries are inserted
     * consecutively after the previous one. Arrays and {@link Set}s are expanded inline, each item
     * occupying the next slot index.
     * @param {number} index - The slot index to insert at.
     * @param {...(NodeListType<Type> | Type)[]} entries - The entries to add.
     * @returns {this} Itself, allowing for method chaining.
     */
    addAtSlot(index: number, ...entries: (NodeListType<Type> | Type)[]): this;
    /**
     * @function remove
     * @description Removes one or more entries from the list. Entries may be individual nodes, arrays,
     * {@link Set}s, {@link HTMLCollection}s, {@link NodeListOf} instances, or nested
     * {@link GradumNodeList}s.
     * @param {...(NodeListType<Type> | Type)[]} entries - The entries to remove.
     * @returns {this} Itself, allowing for method chaining.
     */
    remove(...entries: (NodeListType<Type> | Type)[]): this;
    /**
     * @function removeAtSlot
     * @description Removes one or more slots starting at the given slot index. Each slot removed may
     * correspond to an individual entry, a DOM list, or a nested {@link GradumNodeList}.
     * @param {number} index - The slot index to start removing from.
     * @param {number} [count=1] - The number of consecutive slots to remove.
     * @returns {this} Itself, allowing for method chaining.
     */
    removeAtSlot(index: number, count?: number): this;
    /**
     * @function move
     * @description Moves an existing entry to the given resolved size index. If the entry is a member of a
     * nested {@link GradumNodeList}, it is moved within that sub-list. If it belongs to a DOM list, it is
     * repositioned in the DOM accordingly.
     * @param {Type} entry - The entry to move.
     * @param {number} index - The resolved entry index to move the entry to.
     * @returns {this} Itself, allowing for method chaining.
     */
    move(entry: Type, index: number): this;
    /**
     * @function moveToSlot
     * @description Moves an existing entry to the given slot index.
     * @param {Type} entry - The entry to move.
     * @param {number} index - The slot index to move the entry to.
     * @returns {this} Itself, allowing for method chaining.
     */
    moveToSlot(entry: Type, index: number): this;
    /**
     * @function has
     * @description Checks whether the given entry or entries are present in the list.
     * - For {@link GradumNodeList}s and DOM lists, checks if they belong to this list.
     * - For arrays and {@link Set}s, returns true only if every item is present.
     * @param {Type | NodeListType<Type>} entry - The entry or entries to check.
     * @returns {boolean} Whether the entry or entries are present in the list.
     */
    has(entry: Type | NodeListType<Type>): boolean;
    /**
     * @function clear
     * @description Clears all entries from the list, firing {@link onChanged} for every resolved entry.
     * @returns {this} Itself, allowing for method chaining.
     */
    clear(): this;
    /**
     * @function addEntry
     * @description Core insertion method. Inserts a single entry, DOM list, sub-list, or expands an
     * array/Set inline. Skips already-present entries and duplicate slots. Registers sub-list handlers
     * and DOM observers as needed.
     * @param {Type | NodeListType<Type>} entry - The entry to add.
     * @param {number} [index] - The slot index to insert at. Defaults to the end of the slot array.
     * @returns {number} The next available slot index after this insertion, for consecutive chaining.
     */
    protected addEntry(entry: Type | NodeListType<Type>, index?: number): number;
    /**
     * @function removeEntry
     * @description Core removal method. Removes a single entry, DOM list, sub-list, or expands an
     * array/Set inline. Marks removed individual entries in {@link ignoredMap}. Disconnects observers
     * and unregisters sub-list handlers as needed.
     * @param {Type | NodeListType<Type>} entry - The entry to remove.
     */
    protected removeEntry(entry: Type | NodeListType<Type>): void;
    /**
     * @function insertOrRemoveSlot
     * @description Low-level slot mutation. On `"added"`, clamps the index and splices a new
     * {@link WeakRef} into {@link slots}. On `"removed"`, finds the slot by identity and splices it out.
     * Fires {@link onChanged} for all resolved entries of the slot.
     * @param {NodeListSlot<Type>} slot - The slot value to insert or remove.
     * @param {"added" | "removed"} state - Whether to insert or remove the slot.
     * @param {number} [index] - Slot index for insertion. Ignored on removal.
     * @returns {number} The next available slot index after the operation, for consecutive chaining.
     */
    protected insertOrRemoveSlot(slot: NodeListSlot<Type>, state: "added" | "removed", index?: number): number;
    /**
     * @function attachObserver
     * @description Attaches a {@link MutationObserver} to the parent of the first node in the given DOM
     * list, firing {@link onChanged} when nodes matching the list are added to or removed from the DOM.
     * Does nothing if an observer is already attached for this list, or if no parent node is found.
     * @param {HTMLCollection | NodeListOf<Type & Node>} domList - The DOM list to observe.
     */
    protected attachObserver(domList: HTMLCollection | NodeListOf<Type & Node>): void;
    protected sizeIndexToSlotIndex(sizeIndex: number): number;
    /**
     * @function findContainingSlot
     * @protected
     * @description Finds the slot that directly contains or resolves to the given entry.
     * Returns the slot itself if the entry is a direct slot, the nested {@link GradumNodeList}
     * that contains it, or the DOM list that contains it.
     * @param {Type} entry - The entry to locate.
     * @returns {NodeListSlot<Type> | undefined} The containing slot, or undefined if not found.
     */
    protected findContainingSlot(entry: Type): NodeListSlot<Type>;
}

/**
 * @class GradumConstrainer
 * @group MVC
 * @category Constrainer
 *
 * @extends GradumOperator
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 * @description Class representing an constrainer in MVC, bound to the provided element.
 */
declare class GradumConstrainer<ElementType extends object = object, ViewType extends GradumView = GradumView<any, any>, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumOperator<ElementType, ViewType, ModelType, EmitterType> {
    /**
     * @description The key of the constrainer. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the constrainer's class name is MyElementSomethingConstrainer, the key would
     * default to "something".
     */
    keyName: string;
    /**
     * @description The name of the constrainer.
     */
    readonly constrainerName: string;
    /**
     * @description The property keys of the constrainer solvers defined in the instance.
     */
    readonly solversMetadata: ConstrainerAddCallbackProperties<ConstrainerSolver>[];
    /**
     * @description The property keys of the constrainer checkers defined in the instance.
     */
    readonly checkersMetadata: ConstrainerAddCallbackProperties<ConstrainerChecker>[];
    /**
     * @description The property keys of the constrainer mutators defined in the instance.
     */
    readonly mutatorsMetadata: ConstrainerAddCallbackProperties<ConstrainerMutator>[];
    /**
     * @description The priority of the constrainer. Higher priority constrainers (lower number) should
     * be resolved first. Defaults to 10.
     */
    priority: number;
    /**
     * @description The list of objects constrained by the constrainer. To manipulate, check {@link GradumNodeList}.
     * Defaults to the children of the element the constrainer is attached to.
     */
    objectList: GradumNodeList;
    /**
     * @description The list of objects that trigger the constrainer to resolve.
     * Interacting with any of these objects would typically lead to the solving of the given constrainer.
     * To manipulate, check {@link GradumNodeList}. Defaults to the objects in this.objectList.
     */
    triggerList: GradumNodeList;
    /**
     * @description The default queue template for the constrainer, used when starting a new resolving pass.
     * It defaults to the constrainer's object list.
     */
    defaultQueue: object[] | GradumQueue<object>;
    /**
     * @description The maximum number of passes allowed per object for this constrainer during resolving.
     * This helps prevent infinite cycles in constraint propagation. Defaults to 5.
     */
    maxPasses: number;
    /**
     * @description Whether the constrainer is active. Defaults to true.
     */
    get active(): boolean;
    set active(value: boolean);
    /**
     * @description Delegate fired whenever an object is added to or removed from the constrainer's object list.
     */
    get onObjectListChange(): Delegate<(object: object, status: "added" | "removed") => void>;
    /**
     * @description The current queue to be processed by the constrainer while resolving.
     */
    get queue(): GradumQueue<object>;
    constructor(properties: GradumConstrainerProperties<ElementType, ViewType, ModelType, EmitterType>);
    /**
     * @function initialize
     * @override
     * @description Initialization function that calls {@link makeConstrainer} on `this.element`, sets it up, and attaches
     * all the defined solvers.
     */
    initialize(): void;
    /**
     * @function getObjectPasses
     * @description Retrieve how many times the given object has been processed for the current resolving session
     * of the constrainer.
     * @param {object} object - The object to query.
     * @return {number} - Number of passes already performed on this object.
     */
    getObjectPasses(object: object): number;
    /**
     * @function getObjectData
     * @description Retrieve custom per-object data for this constrainer. It is reset on every new
     * resolving session.
     * @param {object} object - The object to query.
     * @return {Record<string, any>} - The stored data object (or an empty object if none).
     */
    getObjectData(object: object): Record<string, any>;
    /**
     * @function setObjectData
     * @description Set custom per-object data for this constrainer. It is reset on every new resolving session.
     * @param {object} object - The object to update.
     * @param {Record<string, any>} [data] - The new data object to associate with this object.
     * @return {this} - Itself for chaining.
     */
    setObjectData(object: object, data?: Record<string, any>): this;
    /**
     * @function addChecker
     * @description Register a checker in the constrainer. Checkers dictate whether the event should continue
     * executing depending on the provided context (event, tool, target, etc.).
     * @param {ConstrainerAddCallbackProperties<ConstrainerChecker>} properties - Configuration object, including the
     * checker `callback` to be executed, the `name` of the checker to access it later, the name of the attached
     * `constrainer`, and the `priority` of the checker.
     * @return {this} - Itself for chaining.
     */
    addChecker(properties: ConstrainerAddCallbackProperties<ConstrainerChecker>): this;
    /**
     * @function removeChecker
     * @description Remove a checker from this constrainer by its name.
     * @param {string} name - The checker name.
     * @return {this} - Itself for chaining.
     */
    removeChecker(name: string): this;
    /**
     * @function clearCheckers
     * @description Remove all checkers attached to this constrainer.
     * @return {this} - Itself for chaining.
     */
    clearCheckers(): this;
    /**
     * @function check
     * @description Evaluate all checkers for this constrainer and return whether the event should proceed or halt.
     * @param {ConstrainerCallbackProperties} [properties] - Context passed to each checker.
     * @return {boolean} - Whether the constrainer passes all checks.
     */
    check(properties?: ConstrainerCallbackProperties): boolean;
    /**
     * @function addMutator
     * @description Register a mutator in the constrainer. Mutators compute or transform a value based on the context.
     * @param {ConstrainerAddCallbackProperties<ConstrainerMutator>} properties - Configuration object, including the
     * mutator `callback` to be executed, the `name` of the mutator to access it later, and the `priority` of the mutator.
     * @return {this} - Itself for chaining.
     */
    addMutator(properties: ConstrainerAddCallbackProperties<ConstrainerMutator>): this;
    /**
     * @function removeMutator
     * @description Remove a mutator from this constrainer by its name.
     * @param {string} name - The mutator name.
     * @return {this} - Itself for chaining.
     */
    removeMutator(name: string): this;
    /**
     * @function clearMutators
     * @description Remove all mutators attached to this constrainer.
     * @return {this} - Itself for chaining.
     */
    clearMutators(): this;
    /**
     * @function mutate
     * @template Type - The type of the value to mutate
     * @description Execute a mutator for this constrainer and return the resulting value.
     * @param {ConstrainerMutatorProperties<Type>} [properties] - Context object, including the
     * `mutation` to execute, and the input `value` to mutate.
     * @return {Type} - The mutated result.
     */
    mutate<Type = any>(properties?: ConstrainerMutatorProperties<Type>): Type;
    /**
     * @function addSolver
     * @description Register a solver in the constrainer. Solvers typically execute after an event is fired to
     * ensure the constrainer's constraints are maintained. They process all objects in the constrainer's queue,
     * one after the other.
     * @param {ConstrainerAddCallbackProperties<ConstrainerSolver>} properties - Configuration object, including the
     * solver `callback` to be executed, the `name` of the solver to access it later, and the `priority` of the solver.
     * @return {this} - Itself for chaining.
     */
    addSolver(properties: ConstrainerAddCallbackProperties<ConstrainerSolver>): this;
    /**
     * @function removeSolver
     * @description Remove the given function from the constrainer's list of solvers.
     * @param {string} name - The solver's name.
     * @return {this} - Itself for chaining.
     */
    removeSolver(name: string): this;
    /**
     * @function clearSolvers
     * @description Remove all solvers attached to the constrainer.
     * @return {this} - Itself for chaining.
     */
    clearSolvers(): this;
    /**
     * @function solve
     * @description Solve the constrainer by executing all of its attached solvers. Each solver will be executed
     * on every object in the constrainer's queue, incrementing its number of passes in the process.
     * @param {ConstrainerCallbackProperties} [properties] - Options object to configure the context.
     * @return {this} - Itself for chaining.
     */
    solve(properties?: ConstrainerCallbackProperties): this;
}

/**
 * @internal
 */
interface GradumElementMvcInterface<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> {
    /**
     * @description The view (if any) of the element.
     */
    view: ViewType;
    /**
     * @description The model (if any) of the element.
     */
    model: ModelType;
    /**
     * @description The emitter (if any) of the element.
     */
    emitter: EmitterType;
    /**
     * @description The main data block (if any) attached to the element, taken from its model (if any).
     */
    data: DataType;
    /**
     * @description The ID of the main data block (if any) of the element, taken from its model (if any).
     */
    dataId: string;
    /**
     * @description The numerical index of the main data block (if any) of the element, taken from its model (if any).
     */
    dataIndex: number;
    /**
     * @description The size (number) of the main data block (if any) of the element, taken from its model (if any).
     */
    readonly dataSize: number;
    /**
     * @description The operators (if any) attached to the element's MVC structure.
     */
    operators: GradumOperator[];
    /**
     * @description The handlers (if any) attached to the element's model.
     * Returns an empty array if no model is set.
     */
    handlers: GradumHandler[];
    /**
     * @description The interactors (if any) attached to the element's MVC structure.
     */
    interactors: GradumInteractor[];
    /**
     * @description The tools (if any) attached to the element's MVC structure.
     */
    tools: GradumTool[];
    /**
     * @description The constrainers (if any) attached to the element's MVC structure.
     */
    constrainers: GradumConstrainer[];
}

/**
 * @group Types
 * @category SVG Element
 */
type SVGTagMap = Omit<SVGElementTagNameMap, "style">;
/**
 * @group Types
 * @category SVG Element
 * @description Ensures that only valid tags are used, i.e., those that map to elements.
 */
type SVGTag<Tag extends keyof SVGElementTagNameMap = keyof SVGElementTagNameMap> = Tag;
/**
 * @group Types
 * @category SVG Element
 * @description Ensures that only valid elements are used, i.e., those that extend Element.
 */
type ValidSVGElement<Tag extends SVGTag = SVGTag> = SVGElementTagNameMap[Tag] extends SVGElement ? SVGElementTagNameMap[Tag] : SVGElement;
/**
 * @group Types
 * @category SVG Element
 * @description URL to the SVG namespace.
 */
declare const SvgNamespace = "http://www.w3.org/2000/svg";
/**
 * @group Types
 * @category SVG Element
 * @description Set of Valid SVG tags.
 */
declare const SvgTags: Set<keyof SVGElementTagNameMap>;
declare global {
    interface SVGElement extends Element {
    }
    interface SVGSVGElement extends SVGElement {
    }
    interface SVGCircleElement extends SVGElement {
    }
    interface SVGEllipseElement extends SVGElement {
    }
    interface SVGLineElement extends SVGElement {
    }
    interface SVGPathElement extends SVGElement {
    }
    interface SVGPolygonElement extends SVGElement {
    }
    interface SVGPolylineElement extends SVGElement {
    }
    interface SVGRectElement extends SVGElement {
    }
    interface SVGTextElement extends SVGElement {
    }
    interface SVGUseElement extends SVGElement {
    }
    interface SVGImageElement extends SVGElement {
    }
    interface SVGAElement extends SVGElement {
    }
    interface SVGDefsElement extends SVGElement {
    }
    interface SVGGradientElement extends SVGElement {
    }
    interface SVGSymbolElement extends SVGElement {
    }
    interface SVGMarkerElement extends SVGElement {
    }
    interface SVGClipPathElement extends SVGElement {
    }
    interface SVGMPathElement extends SVGElement {
    }
    interface SVGMaskElement extends SVGElement {
    }
    interface SVGMetadataElement extends SVGElement {
    }
    interface SVGPatternElement extends SVGElement {
    }
    interface SVGStopElement extends SVGElement {
    }
    interface SVGSwitchElement extends SVGElement {
    }
    interface SVGViewElement extends SVGElement {
    }
    interface SVGDescElement extends SVGElement {
    }
    interface SVGForeignObjectElement extends SVGElement {
    }
    interface SVGTitleElement extends SVGElement {
    }
    interface SVGScriptElement extends SVGElement {
    }
    interface SVGStyleElement extends SVGElement {
    }
    interface SVGFontElement extends SVGElement {
    }
    interface SVGFontFaceElement extends SVGElement {
    }
    interface SVGGElement extends SVGElement {
    }
    interface SVGSymbolElement extends SVGElement {
    }
    interface SVGTextPathElement extends SVGElement {
    }
    interface SVGTSpanElement extends SVGElement {
    }
    interface SVGAltGlyphElement extends SVGElement {
    }
    interface SVGAltGlyphDefElement extends SVGElement {
    }
    interface SVGAltGlyphItemElement extends SVGElement {
    }
    interface SVGGlyphElement extends SVGElement {
    }
    interface SVGMissingGlyphElement extends SVGElement {
    }
    interface SVGAnimateElement extends SVGElement {
    }
    interface SVGAnimateMotionElement extends SVGElement {
    }
    interface SVGAnimateTransformElement extends SVGElement {
    }
    interface SVGDiscardElement extends SVGElement {
    }
    interface SVGFEBlendElement extends SVGElement {
    }
    interface SVGFEColorMatrixElement extends SVGElement {
    }
    interface SVGFEComponentTransferElement extends SVGElement {
    }
    interface SVGFECompositeElement extends SVGElement {
    }
    interface SVGFEConvolveMatrixElement extends SVGElement {
    }
    interface SVGFEDiffuseLightingElement extends SVGElement {
    }
    interface SVGFEDisplacementMapElement extends SVGElement {
    }
    interface SVGFEDistantLightElement extends SVGElement {
    }
    interface SVGFEDropShadowElement extends SVGElement {
    }
    interface SVGFEFloodElement extends SVGElement {
    }
    interface SVGFEFuncAElement extends SVGElement {
    }
    interface SVGFEFuncBElement extends SVGElement {
    }
    interface SVGFEFuncGElement extends SVGElement {
    }
    interface SVGFEFuncRElement extends SVGElement {
    }
    interface SVGFEGaussianBlurElement extends SVGElement {
    }
    interface SVGFEImageElement extends SVGElement {
    }
    interface SVGFEMergeElement extends SVGElement {
    }
    interface SVGFEMergeNodeElement extends SVGElement {
    }
    interface SVGFEMorphologyElement extends SVGElement {
    }
    interface SVGFEOffsetElement extends SVGElement {
    }
    interface SVGFEPointLightElement extends SVGElement {
    }
    interface SVGFESpecularLightingElement extends SVGElement {
    }
    interface SVGFESpotLightElement extends SVGElement {
    }
    interface SVGFETileElement extends SVGElement {
    }
    interface SVGFETurbulenceElement extends SVGElement {
    }
    interface SVGFilterElement extends SVGElement {
    }
    interface SVGForeignObjectElement extends SVGElement {
    }
    interface SVGHatchElement extends SVGElement {
    }
    interface SVGHatchpathElement extends SVGElement {
    }
    interface SVGMeshElement extends SVGElement {
    }
    interface SVGMeshgradientElement extends SVGElement {
    }
    interface SVGMeshpatchElement extends SVGElement {
    }
    interface SVGMeshrowElement extends SVGElement {
    }
    interface SVGSolidcolorElement extends SVGElement {
    }
    interface SVGVKernElement extends SVGElement {
    }
}

/**
 * @group Types
 * @category Element
 * @description Ensures that only valid tags are used, i.e., those that map to elements.
 */
type HTMLTag<Tag extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = Tag;
/**
 * @group Types
 * @category Element
 * @description Ensures that only valid elements are used, i.e., those that extend Element.
 */
type ValidHTMLElement<Tag extends HTMLTag = HTMLTag> = HTMLElementTagNameMap[Tag] extends HTMLElement ? HTMLElementTagNameMap[Tag] : HTMLElement;
declare global {
    interface HTMLElement extends Element {
    }
    interface GradumElement extends HTMLElement {
    }
    interface HTMLAnchorElement extends HTMLElement {
    }
    interface HTMLAreaElement extends HTMLElement {
    }
    interface HTMLAudioElement extends HTMLElement {
    }
    interface HTMLBaseElement extends HTMLElement {
    }
    interface HTMLQuoteElement extends HTMLElement {
    }
    interface HTMLBodyElement extends HTMLElement {
    }
    interface HTMLBRElement extends HTMLElement {
    }
    interface HTMLButtonElement extends HTMLElement {
    }
    interface HTMLCanvasElement extends HTMLElement {
    }
    interface HTMLTableCaptionElement extends HTMLElement {
    }
    interface HTMLTableColElement extends HTMLElement {
    }
    interface HTMLDataElement extends HTMLElement {
    }
    interface HTMLDataListElement extends HTMLElement {
    }
    interface HTMLModElement extends HTMLElement {
    }
    interface HTMLDetailsElement extends HTMLElement {
    }
    interface HTMLDialogElement extends HTMLElement {
    }
    interface HTMLDivElement extends HTMLElement {
    }
    interface HTMLDListElement extends HTMLElement {
    }
    interface HTMLEmbedElement extends HTMLElement {
    }
    interface HTMLFieldSetElement extends HTMLElement {
    }
    interface HTMLFormElement extends HTMLElement {
    }
    interface HTMLHeadingElement extends HTMLElement {
    }
    interface HTMLHeadElement extends HTMLElement {
    }
    interface HTMLHRElement extends HTMLElement {
    }
    interface HTMLHtmlElement extends HTMLElement {
    }
    interface HTMLIFrameElement extends HTMLElement {
    }
    interface HTMLImageElement extends HTMLElement {
    }
    interface HTMLInputElement extends HTMLElement {
    }
    interface HTMLLabelElement extends HTMLElement {
    }
    interface HTMLLegendElement extends HTMLElement {
    }
    interface HTMLLIElement extends HTMLElement {
    }
    interface HTMLLinkElement extends HTMLElement {
    }
    interface HTMLMapElement extends HTMLElement {
    }
    interface HTMLMenuElement extends HTMLElement {
    }
    interface HTMLMetaElement extends HTMLElement {
    }
    interface HTMLMeterElement extends HTMLElement {
    }
    interface HTMLObjectElement extends HTMLElement {
    }
    interface HTMLOListElement extends HTMLElement {
    }
    interface HTMLOptGroupElement extends HTMLElement {
    }
    interface HTMLOptionElement extends HTMLElement {
    }
    interface HTMLOutputElement extends HTMLElement {
    }
    interface HTMLParagraphElement extends HTMLElement {
    }
    interface HTMLPictureElement extends HTMLElement {
    }
    interface HTMLPreElement extends HTMLElement {
    }
    interface HTMLProgressElement extends HTMLElement {
    }
    interface HTMLQuoteElement extends HTMLElement {
    }
    interface HTMLScriptElement extends HTMLElement {
    }
    interface HTMLSelectElement extends HTMLElement {
    }
    interface HTMLSlotElement extends HTMLElement {
    }
    interface HTMLSourceElement extends HTMLElement {
    }
    interface HTMLSpanElement extends HTMLElement {
    }
    interface HTMLStyleElement extends HTMLElement {
    }
    interface HTMLTableElement extends HTMLElement {
    }
    interface HTMLTableSectionElement extends HTMLElement {
    }
    interface HTMLTableCellElement extends HTMLElement {
    }
    interface HTMLTemplateElement extends HTMLElement {
    }
    interface HTMLTextAreaElement extends HTMLElement {
    }
    interface HTMLTableSectionElement extends HTMLElement {
    }
    interface HTMLTimeElement extends HTMLElement {
    }
    interface HTMLTitleElement extends HTMLElement {
    }
    interface HTMLTableRowElement extends HTMLElement {
    }
    interface HTMLTrackElement extends HTMLElement {
    }
    interface HTMLUListElement extends HTMLElement {
    }
    interface HTMLVideoElement extends HTMLElement {
    }
    interface HTMLAppletElement extends HTMLElement {
    }
    interface HTMLFrameElement extends HTMLElement {
    }
    interface HTMLFrameSetElement extends HTMLElement {
    }
    interface HTMLMarqueeElement extends HTMLElement {
    }
}

/**
 * @group Types
 * @category MathML Element
 * @description Ensures that only valid tags are used, i.e., those that map to elements.
 */
type MathMLTag<Tag extends keyof MathMLElementTagNameMap = keyof MathMLElementTagNameMap> = Tag;
/**
 * @group Types
 * @category MathML Element
 * @description Ensures that only valid elements are used, i.e., those that extend Element.
 */
type ValidMathMLElement<Tag extends MathMLTag = MathMLTag> = MathMLElementTagNameMap[Tag] extends MathMLElement ? MathMLElementTagNameMap[Tag] : MathMLElement;
/**
 * @group Types
 * @category MathML Element
 * @description URL to the MathML namespace.
 */
declare const MathMLNamespace = "http://www.w3.org/1998/Math/MathML";
/**
 * @group Types
 * @category MathML Element
 * @description Set of Valid MathML tags.
 */
declare const MathMLTags: Set<keyof MathMLElementTagNameMap>;
declare global {
    interface MathMLElement extends Element {
    }
    interface MathMLMathElement extends MathMLElement {
    }
    interface MathMLAnnotationElement extends MathMLElement {
    }
    interface MathMLAnnotationXmlElement extends MathMLElement {
    }
    interface MathMLMencloseElement extends MathMLElement {
    }
    interface MathMLMerrorElement extends MathMLElement {
    }
    interface MathMLMfencedElement extends MathMLElement {
    }
    interface MathMLMfracElement extends MathMLElement {
    }
    interface MathMLMiElement extends MathMLElement {
    }
    interface MathMLMnElement extends MathMLElement {
    }
    interface MathMLMoElement extends MathMLElement {
    }
    interface MathMLMoverElement extends MathMLElement {
    }
    interface MathMLMunderElement extends MathMLElement {
    }
    interface MathMLMunderoverElement extends MathMLElement {
    }
    interface MathMLMsElement extends MathMLElement {
    }
    interface MathMLMsubElement extends MathMLElement {
    }
    interface MathMLMsupElement extends MathMLElement {
    }
    interface MathMLMsubsupElement extends MathMLElement {
    }
    interface MathMLMtableElement extends MathMLElement {
    }
    interface MathMLMtdElement extends MathMLElement {
    }
    interface MathMLMtrElement extends MathMLElement {
    }
    interface MathMLMtextElement extends MathMLElement {
    }
    interface MathMLMspaceElement extends MathMLElement {
    }
    interface MathMLMsqrtElement extends MathMLElement {
    }
    interface MathMLMrootElement extends MathMLElement {
    }
    interface MathMLMrowElement extends MathMLElement {
    }
    interface MathMLMstyleElement extends MathMLElement {
    }
    interface MathMLMtokenElement extends MathMLElement {
    }
    interface MathMLSemanticsElement extends MathMLElement {
    }
    interface MathMLNoneElement extends MathMLElement {
    }
}

/**
 * @group Types
 * @category Element
 * @description A type that represents a union of HTML, SVG, and MathML tag name maps.`
 */
type ElementTagMap = HTMLElementTagNameMap & SVGTagMap & MathMLElementTagNameMap & GradumElementTagNameMap;
/**
 * @group Types
 * @category Element
 * @description Ensures that only valid tags are used, i.e., those that map to elements.
 */
type ValidTag<Tag extends keyof ElementTagMap = keyof ElementTagMap> = Tag;
/**
 * @group Types
 * @category Element
 * @description Ensures that only valid elements are used, i.e., those that extend Element.
 */
type ValidElement<Tag extends ValidTag = ValidTag> = Tag extends HTMLTag ? ValidHTMLElement<Tag> : (Tag extends SVGTag ? ValidSVGElement<Tag> : (Tag extends MathMLTag ? ValidMathMLElement<Tag> : (ElementTagMap[Tag] extends Element ? ElementTagMap[Tag] : Element)));
/**
 * @group Types
 * @category Element
 * @description Ensures that only valid elements are used, i.e., those that extend Element.
 */
type ValidNode<Tag = ValidTag> = Tag extends ValidTag ? ValidElement<Tag> : Node;
/**
 * @group Types
 * @category Element
 * @description Type of non-function properties of an element.
 */
type HTMLElementNonFunctions<Tag extends ValidTag = ValidTag> = {
    [ElementField in keyof ValidElement<Tag>]: ValidElement<Tag>[ElementField] extends Function ? never : ElementField;
}[keyof ValidElement<Tag>];
/**
 * @group Types
 * @category Element
 * @description Represents mutable fields of an HTML element, excluding specific fields.
 */
type HTMLElementMutableFields<Tag extends ValidTag = ValidTag> = Omit<Partial<Pick<ValidElement<Tag>, HTMLElementNonFunctions<Tag>>>, "children" | "className" | "style">;
/**
 * @type {ElementTagDefinition}
 * @group Types
 * @category Element
 * @description Represents an element's definition of its tag and its namespace (both optional).
 *
 * @property {string} [tag="div"] - The HTML tag of the element (e.g., "div", "span", "input"). Defaults to "div."
 * @property {string} [namespace] - The namespace of the element. Defaults to HTML. If "svgManipulation" or "mathML"
 * is provided, the corresponding namespace will be used to create the element. Otherwise, the custom namespace
 * provided will be used.
 */
type ElementTagDefinition<Tag extends ValidTag = "div"> = {
    tag?: Tag;
    namespace?: string;
};
interface GradumElementTagNameMap {
}
interface GradumElementPropertiesMap {
}
declare global {
    interface Document extends Node {
    }
    interface DocumentFragment extends Node {
    }
    interface HTMLDocument extends Document {
    }
    interface XMLDocument extends Document {
    }
    interface CharacterData extends Node {
    }
    interface Text extends CharacterData {
    }
    interface Comment extends CharacterData {
    }
    interface CDATASection extends CharacterData {
    }
    interface Element extends Node {
    }
    interface ShadowRoot extends Element {
    }
    interface ChildNode extends Node {
    }
    interface ParentNode extends Node {
    }
    interface ProcessingInstruction extends Node {
    }
    interface DocumentType extends Node {
    }
    interface EntityReference extends Node {
    }
    interface Entity extends Node {
    }
    interface Notation extends Node {
    }
}

/**
 * @group Types
 * @category Element
 */
type CloneElementOptions = {
    exclude?: PropertyKey[];
    forceInclude?: PropertyKey[];
    deepClone?: PropertyKey[];
    copyReference?: PropertyKey[];
    copyNodes?: boolean;
    deepCloneObjects?: boolean;
    deepCloneNodes?: boolean;
    /**
     * When true, the clone's model receives a detached snapshot of the origin's data
     * (via `toJSON()` when available — e.g. Y.js types — else `structuredClone`) instead
     * of a live reference. Required for previews of MVC/synced elements: a reference copy
     * would make the clone a live twin whose field writes go through the shared model.
     */
    snapshotData?: boolean;
};
/**
 * @group Types
 * @category Element
 */
type FeedforwardProperties = GradumElementProperties & {
    removeOnPointerRelease?: boolean;
    type?: string;
    cloneOptions?: CloneElementOptions;
    /**
     * When true, the clone is placed inside a `GradumMovable` positioning wrapper and the wrapper
     * is returned instead of the clone. The wrapper exposes `position` (alias `translation`) and
     * `rotation` accessors that apply pure CSS transforms to the wrapper — callers position the
     * preview without ever touching the clone's semantic fields. The clone's own `transform` is
     * neutralized via an injected `!important` stylesheet rule (an MVC clone's view keeps
     * rendering its snapshot transform otherwise, overriding any caller positioning). The
     * original clone remains accessible on the wrapper's `content` / `feedforwardClone` properties.
     */
    wrap?: boolean;
};
/**
 * @group Types
 * @category Element
 *
 * @type {GradumProperties}
 * @template {ValidTag} Tag - The HTML (or other) tag of the element, if passing it as a property. Defaults to "div".
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {object} DataType - The element's data type, if any.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description Object containing properties for configuring an Element. A tag (and
 * possibly a namespace) can be provided for element creation. Already-created elements will ignore these
 * properties if set.
 * Any HTML attribute can be passed as key to be processed by the class/function. The type has the following
 * described custom properties:
 *
 * @property {string} [id] - The ID of the element.
 * @property {string | string[]} [classes] - The CSS class(es) to apply to the element (either a string of
 * space-separated classes or an array of class names).
 * @property {string} [style] - The inline style of the element. Use the css literal function for autocompletion.
 * @property {string} [stylesheet] - The associated stylesheet (if any) with the element. Declaring this property will
 * generate automatically a new style element in the element's corresponding root. Use the css literal function
 * for autocompletion.
 * @property {Record<string, EventListenerOrEventListenerObject | ((e: Event, el: Element) => boolean)>} [listeners]
 * - An object containing event listeners to be applied to this element.
 * @property {(e: Event, el: Element) => boolean} [onClick] - Click event listener.
 * @property {(e: Event, el: Element) => boolean} [onDrag] - Drag event listener.
 * @property {Element | Element[]} [children] - An array of child wrappers or elements to append to
 * the created element.
 * @property {Element} [parent] - The parent element to which the created element will be appended.
 * @property {string | Element} [out] - If defined, declares (or sets) the element in the parent as a field with the
 * given value as key.
 * @property {string} [text] - The text content of the element (if any).
 * @property {boolean} [shadowDOM] - If true, indicate that the element will be created under a shadow root.
 */
type GradumProperties<Tag extends ValidTag = "div"> = ElementTagDefinition<Tag> & Omit<HTMLElementMutableFields<Tag>, "tag" | "namespace"> & {
    id?: string;
    classes?: string | string[];
    style?: string;
    stylesheet?: string;
    shadowDOM?: boolean;
    parent?: Element;
    children?: Element | Element[];
    text?: string;
    listeners?: Record<string, ((e: Event, el: ValidElement<Tag>) => boolean | any)>;
    onClick?: (e: Event, el: ValidElement<Tag>) => boolean | any;
    onDrag?: (e: Event, el: ValidElement<Tag>) => boolean | any;
    out?: string | Node;
    [key: string]: any;
};

/**
 * @internal
 */
interface GradumElementUiInterface {
    /**
     * @description Whether to set the default CSS classes defined in the static config on the element or not. Setting
     * it will accordingly add/remove the CSS classes from the element.
     */
    unsetDefaultClasses: boolean;
    shadowDOM: boolean;
    defaultClasses: string | string[];
}

/**
 * @group GradumElement
 * @category GradumProxiedElement
 */
type GradumProxiedProperties<Tag extends ValidTag = "div", ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumProperties<Tag> & GradumHeadlessProperties<ViewType, DataType, ModelType, EmitterType> & {
    unsetDefaultClasses?: boolean;
    shadowDOM?: boolean;
    defaultSelectedClasses?: string | string[];
    defaultClasses?: string | string[];
};
/**
 * @type {GradumElementProperties}
 * @group GradumElement
 * @category GradumElement
 *
 * @extends GradumProperties
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {object} DataType - The element's data type, if any.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description Object containing properties for configuring a custom HTML element. Is basically GradumProperties
 * without the tag.
 */
type GradumElementProperties<ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumProxiedProperties<"div", ViewType, DataType, ModelType, EmitterType>;

/**
 * @internal
 */
interface GradumElementDefaultInterface {
    readonly properties: object;
    /**
     * @function destroy
     * @description Destroys the node by removing it from the document and removing all its bound listeners.
     * @returns {this} Itself, allowing for method chaining.
     */
    destroy(): this;
    /**
     * @function initialize
     * @description Initializes the element. It sets up the UI by calling the methods `setupUIElements`,
     * `setupUILayout`, `setupUIListeners`, and `setupChangedCallbacks` (in this order, if they are defined).
     * This function is called automatically in `.setProperties()` and when instantiating an
     * element via `element()`. It is called only once per element (as it checks with the reflected `initialized` flag).
     */
    initialize(): void;
    /**
     * @readonly
     * @description Whether the element was initialized already or not.
     */
    readonly initialized: boolean;
    defaultFeedforwardProperties: GradumElementProperties;
    feedforward(properties?: FeedforwardProperties): this;
    clone(options?: CloneElementOptions): this;
}

/**
 * @group MVC
 * @category MVC
 *
 * @type {MvcInstanceOrConstructor}
 * @template Type
 * @template PropertiesType
 * @description Type representing the constructor of a certain `Type` (which takes a single parameter), or an
 * instance of `Type`.
 */
type MvcInstanceOrConstructor<Type, PropertiesType = any> = Type | (new (properties: PropertiesType) => Type);
/**
 * @group MVC
 * @category MVC
 *
 * @type {MvcManyInstancesOrConstructors}
 * @template Type
 * @template PropertiesType
 * @description Type representing a single entry or an array of {@link MvcInstanceOrConstructor}.
 */
type MvcManyInstancesOrConstructors<Type, PropertiesType = any> = MvcInstanceOrConstructor<Type, PropertiesType> | MvcInstanceOrConstructor<Type, PropertiesType>[];
/**
 * @type {MvcGenerationProperties}
 * @group MVC
 * @category MVC
 *
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {object} DataType - The element's data type, if any.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description Type representing a configuration object for an {@link Mvc} instance.
 * @property {MvcInstanceOrConstructor<ViewType, GradumViewProperties>} [view] - The view (or view constructor) to attach.
 * @property {ModelType | (new (data?: any, dataBlocksType?: "map" | "array") => ModelType)} [model] - The model
 * (or model constructor) to attach.
 * @property {MvcInstanceOrConstructor<EmitterType, ModelType>} [emitter] - The emitter (or emitter constructor) to
 * attach. If not defined, a default GradumEmitter will be created.
 * @property {MvcManyInstancesOrConstructors<GradumOperator, GradumOperatorProperties>} [operators] - The
 * operator, constructor of operator, or array of the latter, to attach.
 * @property {MvcManyInstancesOrConstructors<GradumHandler, ModelType>} [handlers] - The
 * handler, constructor of handler, or array of the latter, to attach.
 * @property {MvcManyInstancesOrConstructors<GradumInteractor, GradumInteractorProperties>} [interactors] - The
 * interactor, constructor of interactor, or array of the latter, to attach.
 * @property {MvcManyInstancesOrConstructors<GradumTool, GradumToolProperties>} [tools] - The
 * tool, constructor of tool, or array of the latter, to attach.
 * @property {MvcManyInstancesOrConstructors<GradumConstrainer, GradumConstrainerProperties>} [constrainers] - The
 * constrainer, constructor of constrainer, or array of the latter, to attach.
 */
type MvcProperties<ViewType extends GradumView = GradumView<any, any>, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = {
    view?: MvcInstanceOrConstructor<ViewType, GradumViewProperties>;
    model?: ModelType | (new (data?: any, dataBlocksType?: "map" | "array") => ModelType);
    emitter?: MvcInstanceOrConstructor<EmitterType, ModelType>;
    operators?: MvcManyInstancesOrConstructors<GradumOperator, GradumOperatorProperties>;
    handlers?: MvcManyInstancesOrConstructors<GradumHandler, ModelType>;
    interactors?: MvcManyInstancesOrConstructors<GradumInteractor, GradumInteractorProperties>;
    tools?: MvcManyInstancesOrConstructors<GradumTool, GradumToolProperties>;
    constrainers?: MvcManyInstancesOrConstructors<GradumConstrainer, GradumConstrainerProperties>;
};
/**
 * @type {MvcGenerationProperties}
 * @group MVC
 * @category MVC
 *
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {object} DataType - The element's data type, if any.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @extends {MvcProperties}
 * @description Type representing a configuration object for an {@link Mvc} instance.
 * @property {DataType} [data] - The data to attach to the model.
 * @property {boolean} [initialize] - Whether to initialize the MVC pieces after setting them or not. Defaults to true.
 */
type MvcGenerationProperties<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = MvcProperties<ViewType, ModelType, EmitterType> & {
    data?: DataType;
    initialize?: boolean;
};
/**
 * @type {GradumHeadlessProperties}
 * @group GradumElement
 * @category GradumHeadlessElement
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Object containing properties for configuring a headless (non-HTML) element, with possibly MVC properties.
 */
type GradumHeadlessProperties<ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = MvcGenerationProperties<ViewType, DataType, ModelType, EmitterType> & {
    out?: string | Node;
    [key: string]: any;
};

declare class GradumEventManagerUtilsHandler extends GradumHandler<GradumEventManagerModel> {
    keyName: string;
    setClickMode(button: number, isTouch?: boolean): ClickMode;
    applyEventNames(eventNames: Record<string, string>): void;
    setTimer(timerName: string, callback: () => void, duration: number): void;
    clearTimer(timerName: string): void;
    activateTool(element: Node, toolName: string, value: boolean): void;
}

/**
 * @group Components
 * @category GradumMap
 */
declare class GradumMap<KeyType, ValueType> extends Map<KeyType, ValueType> {
    enforceImmutability: boolean;
    set(key: KeyType, value: ValueType): any;
    get(key: KeyType): ValueType;
    get first(): ValueType | null;
    get last(): ValueType | null;
    keysArray(): KeyType[];
    valuesArray(): ValueType[];
    private copy;
    mapKeys<C>(callback: (key: KeyType, value: ValueType) => C): GradumMap<C, ValueType>;
    mapValues<C>(callback: (key: KeyType, value: ValueType) => C): GradumMap<KeyType, C>;
    filter(callback: (key: KeyType, value: ValueType) => boolean): GradumMap<KeyType, ValueType>;
    merge(map: Map<KeyType, ValueType>): GradumMap<KeyType, ValueType>;
}

/**
 * @group Components
 * @category GradumWeakSet
 */
declare class GradumWeakSet<Type extends object = object> {
    private readonly _weakRefs;
    constructor();
    add(obj: Type): this;
    has(obj: Type): boolean;
    delete(obj: Type): boolean;
    cleanup(): void;
    toArray(): Type[];
    get size(): number;
    clear(): void;
    forEach(callback: (value: Type, set: this) => void, thisArg?: any): void;
    [Symbol.iterator](): IterableIterator<Type>;
}

declare class GradumEventManagerModel extends GradumModel {
    utils: GradumEventManagerUtilsHandler;
    readonly state: GradumEventManagerStateProperties;
    lockState: GradumEventManagerLockStateProperties;
    readonly onInputDeviceChange: Delegate<(device: InputDevice) => void>;
    /**
     * @description Delegate fired when a tool is changed on a certain click button/mode
     */
    readonly onToolChange: Delegate<(oldTool: Node, newTool: Node, type: ClickMode) => void>;
    readonly currentKeys: string[];
    currentAction: ActionMode;
    currentClick: ClickMode;
    wasRecentlyTrackpad: boolean;
    moveThreshold: number;
    longPressDuration: number;
    authorizeEventScaling: boolean | (() => boolean);
    scaleEventPosition: (position: Point) => Point;
    activePointers: Set<number>;
    readonly origins: GradumMap<number, Point>;
    readonly previousPositions: GradumMap<number, Point>;
    positions: GradumMap<number, Point>;
    lastTargetOrigin: Node;
    readonly timerMap: GradumMap<string, NodeJS.Timeout>;
    readonly tools: Map<string, GradumWeakSet<Node>>;
    readonly mappedKeysToTool: Map<string, string>;
    readonly currentTools: Map<ClickMode, Node>;
    set inputDevice(value: InputDevice);
}

/**
 * @group Event Handling
 * @category GradumEventManager
 */
type GradumEventManagerStateProperties = {
    enabled?: boolean;
    preventDefaultWheel?: boolean;
    preventDefaultMouse?: boolean;
    preventDefaultTouch?: boolean;
};
/**
 * @group Event Handling
 * @category GradumEventManager
 */
type EnabledGradumEventTypes = {
    keyEventsEnabled?: boolean;
    wheelEventsEnabled?: boolean;
    mouseEventsEnabled?: boolean;
    touchEventsEnabled?: boolean;
    clickEventsEnabled?: boolean;
    dragEventsEnabled?: boolean;
    moveEventsEnabled?: boolean;
};
/**
 * @group Event Handling
 * @category GradumEventManager
 */
type GradumEventManagerProperties<ModelType extends GradumEventManagerModel = GradumEventManagerModel> = GradumHeadlessProperties<any, any, ModelType> & GradumEventManagerStateProperties & EnabledGradumEventTypes & {
    moveThreshold?: number;
    longPressDuration?: number;
    authorizeEventScaling?: boolean | (() => boolean);
    scaleEventPosition?: (position: Point) => Point;
};
/**
 * @group Event Handling
 * @category GradumEventManager
 */
type GradumEventManagerLockStateProperties = GradumEventManagerStateProperties & {
    lockOrigin?: Node;
};
/**
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description Object representing options passed to the ToolManager's setTool() function.
 * @property select - Indicate whether to visually select the tool on all toolbars, defaults to true
 * @property activate - Indicate whether to fire activation on the tool when setting it, defaults to true
 * @property setAsNoAction - Indicate whether the tool will also be set as the tool for ClickMode == none, defaults
 * to true if the click mode is left.
 */
type SetToolOptions = {
    select?: boolean;
    activate?: boolean;
    setAsNoAction?: boolean;
};
/**
 * @group Event Handling
 * @category Enums
 */
declare enum ActionMode {
    none = 0,
    click = 1,
    longPress = 2,
    drag = 3
}
/**
 * @group Event Handling
 * @category Enums
 */
declare enum ClickMode {
    none = 0,
    left = 1,
    right = 2,
    middle = 3,
    other = 4,
    key = 5
}
/**
 * @group Event Handling
 * @category Enums
 */
declare enum InputDevice {
    unknown = 0,
    mouse = 1,
    trackpad = 2,
    touch = 3
}

declare class GradumEventManagerKeyOperator extends GradumOperator<GradumEventManager, any, GradumEventManagerModel> {
    keyName: string;
    keyDown: (e: KeyboardEvent) => void;
    protected keyDownFn(e: KeyboardEvent): void;
    keyUp: (e: KeyboardEvent) => void;
    protected keyUpFn(e: KeyboardEvent): void;
}

declare class GradumEventManagerWheelOperator extends GradumOperator<GradumEventManager, any, GradumEventManagerModel> {
    keyName: string;
    wheel: (e: WheelEvent) => void;
}

declare class GradumEventManagerPointerOperator extends GradumOperator<GradumEventManager, any, GradumEventManagerModel> {
    keyName: string;
    pointerDown: (e: PointerEvent) => void;
    pointerMove: (e: PointerEvent) => void;
    pointerUp: (e: PointerEvent) => void;
    pointerCancel: (e: PointerEvent) => void;
    lostPointerCapture: (e: PointerEvent) => void;
    protected pointerDownFn(e: PointerEvent): void;
    protected pointerMoveFn(e: PointerEvent): void;
    protected pointerUpFn(e: PointerEvent): void;
    protected pointerCancelFn(e: PointerEvent): void;
    protected lostPointerCaptureFn(e: PointerEvent): void;
    /**
     * @description Fires a custom Gradum click event at the click target with the click position
     * @param p
     * @param eventName
     * @private
     */
    private fireClick;
    /**
     * @description Fires a custom Gradum drag event at the target with the origin of the drag, the last drag position, and the current position
     * @param positions
     * @param eventName
     * @private
     */
    private fireDrag;
    private getFireOrigin;
}

/**
 * @group Event Handling
 * @category Enums
 */
declare enum ClosestOrigin {
    target = "target",
    position = "position"
}
/**
 * @group Event Handling
 * @category GradumEvents
 */
type GradumRawEventProperties = {
    clickMode?: ClickMode;
    inputDevice?: InputDevice;
    keys?: string[];
    eventName?: GradumEventNameEntry;
    eventManager?: GradumEventManager;
    toolName?: string;
    authorizeScaling?: boolean | (() => boolean);
    scalePosition?: (position: Point) => Point;
    eventInitDict?: EventInit;
};
/**
 * @group Event Handling
 * @category GradumEvents
 */
type GradumEventProperties = GradumRawEventProperties & {
    position?: Point;
};
/**
 * @group Event Handling
 * @category GradumEvents
 */
type GradumDragEventProperties = GradumRawEventProperties & {
    origins?: GradumMap<number, Point>;
    previousPositions?: GradumMap<number, Point>;
    positions?: GradumMap<number, Point>;
};
/**
 * @group Event Handling
 * @category GradumEvents
 */
type GradumKeyEventProperties = GradumRawEventProperties & {
    keyPressed?: string;
    keyReleased?: string;
};
/**
 * @group Event Handling
 * @category GradumEvents
 */
type GradumWheelEventProperties = GradumRawEventProperties & {
    delta?: Point;
};

/**
 * @class GradumEvent
 * @group Event Handling
 * @category GradumEvents
 * @description Generic gradum event.
 */
declare class GradumEvent extends Event {
    /**
     * @description The event manager that fired this event.
     */
    readonly eventManager: GradumEventManager;
    /**
     * @description The name of the tool (if any) associated with this event.
     */
    readonly toolName: string;
    /**
     * @description The name of the event.
     */
    readonly eventName: GradumEventNameEntry;
    /**
     * @description The click mode of the fired event
     */
    readonly clickMode: ClickMode;
    /**
     * @description The input device that fired this event
     */
    readonly inputDevice: InputDevice;
    /**
     * @description The keys pressed when the event was fired
     */
    readonly keys: string[];
    /**
     * @description The screen position from where the event was fired
     */
    readonly position: Point;
    /**
     * @description Callback function (or boolean) to be overridden to specify when to allow transformation
     * and/or scaling.
     */
    authorizeScaling: boolean | (() => boolean);
    /**
     * @description Callback function to be overridden to specify how to transform a position from screen to
     * document space.
     */
    scalePosition: (position: Point) => Point;
    constructor(properties: GradumEventProperties);
    /**
     * @description The tool (if any) associated with this event.
     */
    get tool(): Node;
    /**
     * @description Returns the closest ancestor (or the element itself) that matches the given type.
     * Accepts a constructor (matched via `instanceof`) or a custom-element tag name string such as
     * `"my-component"` (resolved to its registered constructor via `customElements`, then matched via
     * `instanceof`). Falls back to a native CSS-selector walk when no custom element is registered for
     * the given string.
     * @param type - Constructor or custom-element tag name / CSS selector string.
     * @param strict - When `true` (default) the matched element must contain the event position.
     * Pass an `Element` to use that element's bounds as the containment check instead.
     * @param from - Whether to start from the event target or from the elements under the pointer position.
     */
    closest<T extends Element>(type: new (...args: any[]) => T, strict?: Element | boolean, from?: ClosestOrigin): T | null;
    closest(type: string, strict?: Element | boolean, from?: ClosestOrigin): Element | null;
    /**
     * @description Checks if the position is inside the given element's bounding box.
     * @param position
     * @param element
     */
    private isPositionInsideElement;
    /**
     * @description The target of the event (as an Element - or the document)
     */
    get target(): Element | Document;
    /**
     * @description The position of the fired event transformed and/or scaled using the class's scalePosition().
     */
    get scaledPosition(): Point;
    /**
     * @description Specifies whether to allow transformation and/or scaling.
     */
    get scalingAuthorized(): boolean;
    /**
     * @private
     * @description Takes a map of points and returns a new map where each point is transformed accordingly.
     * @param positions
     */
    protected scalePositionsMap(positions?: GradumMap<number, Point>): GradumMap<number, Point>;
}

declare class GradumEventManagerDispatchOperator extends GradumOperator<GradumEventManager, any, GradumEventManagerModel> {
    keyName: string;
    private boundHooks;
    protected setupChangedCallbacks(): void;
    protected dispatchEvent: <EventType extends GradumEvent = GradumEvent, PropertiesType extends GradumRawEventProperties = GradumRawEventProperties>(target: Node, eventType: new (properties: PropertiesType) => EventType, properties: Partial<PropertiesType>) => void;
    private getToolHandlingCallback;
    setupCustomDispatcher(type: string): void;
    removeCustomDispatcher(type: string): void;
}

/**
 * @class GradumBaseElement
 * @group GradumElement
 * @category GradumBaseElement
 *
 * @description GradumHeadlessElement class, similar to GradumElement but without extending HTMLElement.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 */
declare class GradumBaseElement {
    /**
     * @description Default properties assigned to a new instance.
     */
    static defaultProperties: object;
    static create<Type extends new (...args: any[]) => GradumBaseElement>(this: Type, properties?: InstanceType<Type>["properties"]): InstanceType<Type>;
    protected static customCreate(properties: object): object;
}

/**
 * @class GradumEventManager
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description Class that manages default mouse, trackpad, and touch events, and accordingly fires custom events for
 * easier management of input.
 */
declare class GradumEventManager<ToolType extends string = string> extends GradumBaseElement {
    protected static managers: GradumEventManager[];
    static get instance(): GradumEventManager;
    static get allManagers(): GradumEventManager[];
    static set allManagers(managers: GradumEventManager[]);
    get model(): GradumEventManagerModel;
    readonly properties: GradumEventManagerProperties;
    static defaultProperties: GradumEventManagerProperties;
    protected keyOperator: GradumEventManagerKeyOperator;
    protected wheelOperator: GradumEventManagerWheelOperator;
    protected pointerOperator: GradumEventManagerPointerOperator;
    protected dispatchOperator: GradumEventManagerDispatchOperator;
    /**
     * @description The currently identified input device. It is not 100% accurate, especially when differentiating
     * between mouse and trackpad.
     */
    inputDevice: InputDevice;
    onInputDeviceChange: Delegate<(device: InputDevice) => void>;
    currentClick: ClickMode;
    currentKeys: string[];
    /**
     * @description Delegate fired when a tool is changed on a certain click button/mode
     */
    onToolChange: Delegate<(oldTool: Node, newTool: Node, type: ClickMode) => void>;
    authorizeEventScaling: boolean | (() => boolean);
    scaleEventPosition: (position: Point) => Point;
    moveThreshold: number;
    longPressDuration: number;
    constructor();
    initialize(): void;
    set keyEventsEnabled(value: boolean);
    set wheelEventsEnabled(value: boolean);
    set moveEventsEnabled(value: boolean);
    set mouseEventsEnabled(value: boolean);
    set touchEventsEnabled(value: boolean);
    set clickEventsEnabled(value: boolean);
    set dragEventsEnabled(value: boolean);
    /**
     * @description Sets the lock state for the event manager.
     * @param origin - The element that initiated the lock state.
     * @param value - The state properties to set.
     */
    lock(origin: Node, value: GradumEventManagerStateProperties): void;
    /**
     * @description Resets the lock state to the default values.
     */
    unlock(): void;
    get enabled(): boolean;
    set enabled(value: boolean);
    get preventDefaultWheel(): boolean;
    set preventDefaultWheel(value: boolean);
    get preventDefaultMouse(): boolean;
    set preventDefaultMouse(value: boolean);
    get preventDefaultTouch(): boolean;
    set preventDefaultTouch(value: boolean);
    get preventDefaults(): boolean;
    set preventDefaults(value: boolean);
    /**
     * @description All attached tools in an array
     */
    get toolsArray(): Node[];
    getCurrentTool(mode?: ClickMode): Node;
    /**
     * @description Returns the instances of the tool currently held by the provided click mode
     * @param mode
     */
    getCurrentTools(mode?: ClickMode): Node[];
    /**
     * @description Returns the name of the tool currently held by the provided click mode
     * @param mode
     */
    getCurrentToolName(mode?: ClickMode): ToolType;
    getToolName(tool: Node): ToolType;
    getSimilarTools(tool: Node): Node[];
    /**
     * @description Returns the tool with the given name (or undefined)
     * @param name
     */
    getToolsByName(name: ToolType): Node[];
    /**
     * @description Returns the first tool with the given name (or undefined)
     * @param name
     * @param predicate
     */
    getToolByName(name: ToolType, predicate?: (tool: Node) => boolean): Node;
    /**
     * @description Returns the tools associated with the given key
     * @param key
     */
    getToolsByKey(key: string): Node[];
    /**
     * @description Returns the first tool associated with the given key
     * @param key
     * @param predicate
     */
    getToolByKey(key: string, predicate?: (tool: Element) => boolean): Node;
    /**
     * @description Adds a tool to the tools map, identified by its name. Optionally, provide a key to bind the tool to.
     * @param toolName
     * @param tool
     * @param key
     */
    addTool(toolName: ToolType, tool: Node, key?: string): void;
    /**
     * @description Sets the provided tool as a current tool associated with the provided type
     * @param tool
     * @param type
     * @param options
     */
    setTool(tool: Node, type: ClickMode, options?: SetToolOptions): void;
    /**
     * @description Sets tool associated with the provided key as the current tool for the key mode
     * @param key
     */
    setToolByKey(key: string): boolean;
    setupCustomDispatcher(type: string): void;
    protected applyAndHookEvents(gradumEventNames: Record<string, string>, defaultEventNames: Record<string, string>, applyGradumEvents: boolean): void;
    destroy(): this;
}

/**
 * @type {MakeConstrainerOptions}
 * @group Types
 * @category Constrainer
 *
 * @description Type representing objects used to configure the creation of constrainers. Used in {@link makeConstrainer}.
 * @property {() => void} [onActivate] - Callback function to execute when the constrainer is activated.
 * @property {() => void} [onDeactivate] - Callback function to execute when the constrainer is deactivated.
 * @property {number} [priority] - The priority of the constrainer. Higher priority constrainers (lower number) should
 * be resolved first. Defaults to 10.
 * @property {boolean} [active] - Whether the constrainer is active. Defaults to true.
 * @property {GradumConstrainer} [attachedInstance] - The optional GradumConstrainer instance to attach to the constrainer.
 */
type MakeConstrainerOptions = {
    onActivate?: () => void;
    onDeactivate?: () => void;
    priority?: number;
    active?: boolean;
    attachedInstance?: GradumConstrainer;
};
/**
 * @type {ConstrainerCallbackProperties}
 * @group Types
 * @category Constrainer
 *
 * @description Type representing objects passed as context for resolving constrainers. Given as first parameter to
 * solvers when executing them via {@link solveConstrainer}.
 * @property {string} [constrainer] - The targeted constrainer. Defaults to `currentConstrainer`.
 * @property {object} [constrainerHost] - The object to which the target constrainer is attached.
 * @property {object} [target] - The current object being processed by the solver. Property set by
 * {@link solveConstrainer} when processing every object in the constrainer's list.
 * @property {Event} [event] - The event (if any) that fired the resolving of the constrainer.
 * @property {string} [eventType] - The type of the event.
 * @property {Node} [eventTarget] - The target of the event.
 * @property {string} [toolName] - The name of the active tool when the event was fired.
 * @property {ListenerOptions} [eventOptions] - The options of the event.
 * @property {GradumEventManager} [manager] - The event manager that captured the event. Defaults to the first
 * instantiated event manager.
 */
type ConstrainerCallbackProperties = {
    constrainer?: string;
    constrainerHost?: object;
    target?: object;
    event?: Event;
    eventType?: string;
    eventTarget?: Node;
    toolName?: string;
    eventOptions?: ListenerOptions;
    manager?: GradumEventManager;
};
/**
 * @type {ConstrainerMutatorProperties}
 * @group Types
 * @category Constrainer
 *
 * @extends ConstrainerCallbackProperties
 * @template Type - The type of the value to mutate.
 * @description Type representing objects passed as context to mutate a value in an constrainer. Given as first parameter to
 * mutators when executing them via {@link mutate}.
 * @property {string} [mutation] - The name of the mutator to execute.
 * @property {Type} [value] - The value to mutate.
 */
type ConstrainerMutatorProperties<Type = any> = ConstrainerCallbackProperties & {
    mutation?: string;
    value?: Type;
};
/**
 * @type {ConstrainerChecker}
 * @group Types
 * @category Constrainer
 *
 * @description Type representing the signature of checker functions that constrainers expect.
 */
type ConstrainerChecker = (properties: ConstrainerCallbackProperties, ...args: any[]) => boolean;
/**
 * @type {ConstrainerMutator}
 * @group Types
 * @category Constrainer
 *
 * @description Type representing the signature of mutator functions that constrainers expect.
 */
type ConstrainerMutator<Type = any> = (properties: ConstrainerMutatorProperties<Type>, ...args: any[]) => Type;
/**
 * @type {ConstrainerSolver}
 * @group Types
 * @category Constrainer
 *
 * @description Type representing the signature of solver functions that constrainers expect.
 */
type ConstrainerSolver = (properties: ConstrainerCallbackProperties, ...args: any[]) => Propagation | void;
/**
 * @type {ConstrainerAddCallbackProperties}
 * @group Types
 * @category Constrainer
 * @template {ConstrainerChecker | ConstrainerMutator | ConstrainerSolver} Type - The type of callback.
 *
 * @description Type representing a configuration object to add a new callback to the given constrainer.
 * @property {string} [name] - The name of the callback to add.
 * @property {Type} [callback] - The callback to add.
 * @property {string} [constrainer] - The constrainer to add the callback to.
 * @property {number} [priority] - The priority of the callback.
 */
type ConstrainerAddCallbackProperties<Type extends ConstrainerChecker | ConstrainerMutator | ConstrainerSolver> = {
    name?: string;
    callback?: Type;
    constrainer?: string;
    priority?: number;
};
/**
 * @decorator
 * @function solver
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 decorator that turns methods into constrainer solvers.
 * @example
 * ```ts
 * @solver private constrainPosition(properties: ConstrainerSolverProperties) {...}
 * ```
 * Is equivalent to:
 * ```ts
 * private constrainPosition(properties: ConstrainerSolverProperties) {...}
 *
 * public initialize() {
 *   ...
 *   $(this).addSolver(this.constrainPosition);
 * }
 * ```
 */
declare function solver(properties?: ConstrainerAddCallbackProperties<ConstrainerSolver>): <Type extends object>(value: ((this: Type, ...args: any[]) => any), context: ClassMethodDecoratorContext<Type>) => any;
/**
 * @decorator
 * @function checker
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 decorator that turns methods into constrainer checkers.
 * @example
 * ```ts
 * @checker private constrainPosition(properties: ConstrainerSolverProperties) {...}
 * ```
 * Is equivalent to:
 * ```ts
 * private constrainPosition(properties: ConstrainerSolverProperties) {...}
 *
 * public initialize() {
 *   ...
 *   $(this).addChecker(this.constrainPosition);
 * }
 * ```
 */
declare function checker(properties?: ConstrainerAddCallbackProperties<ConstrainerChecker>): <Type extends object>(value: ((this: Type, ...args: any[]) => any), context: ClassMethodDecoratorContext<Type>) => any;
/**
 * @decorator
 * @function mutator
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 decorator that turns methods into constrainer mutators.
 * @example
 * ```ts
 * @mutator private constrainPosition(properties: ConstrainerSolverProperties) {...}
 * ```
 * Is equivalent to:
 * ```ts
 * private constrainPosition(properties: ConstrainerSolverProperties) {...}
 *
 * public initialize() {
 *   ...
 *   $(this).addMutator(this.constrainPosition);
 * }
 * ```
 */
declare function mutator(properties?: ConstrainerAddCallbackProperties<ConstrainerMutator>): <Type extends object>(value: ((this: Type, ...args: any[]) => any), context: ClassMethodDecoratorContext<Type>) => any;

/**
 * @type {DefineOptions}
 * @group Decorators
 * @category Registry, Attributes & DOM
 *
 * @description Options object for the {@link define} decorator and imperative function.
 * @property {boolean} [injectAttributeBridge=true] - Whether to inject an `attributeChangedCallback`
 * into the class prototype if one is not already present. When enabled, HTML attribute changes are
 * automatically mirrored to their associated `@observe`-decorated fields, and vice versa.
 */
type DefineOptions = {
    injectAttributeBridge?: boolean;
};
/**
 * @enum {string} RegistryCategory
 * @group Decorators
 * @category Registry, Attributes & DOM
 *
 * @description Categorizes registered classes by their base type in the Gradum Kit registry.
 * Categories are ordered from most to least specific within each group, which determines
 * how {@link inferCategory} resolves ambiguous inheritance chains.
 *
 * **Gradum Kit elements** (most to least specific):
 * - `GradumProxiedElement`, `GradumElement`, `GradumBaseElement`, `GradumHeadlessElement`
 *
 * **Native DOM elements** (most to least specific):
 * - `SVGElement`, `MathMLElement`, `HTMLElement`, `Element`, `Node`
 *
 * **MVC pieces:**
 * - `GradumOperator`, `GradumHandler`, `GradumInteractor`, `GradumTool`, `GradumConstrainer`,
 *   `GradumView`, `GradumEmitter`, `GradumModel`
 *
 * **Fallback:**
 * - `Other` — for classes that do not match any recognized base type.
 */
declare enum RegistryCategory {
    GradumElement = "GradumElement",
    GradumBaseElement = "GradumBaseElement",
    GradumHeadlessElement = "GradumHeadlessElement",
    GradumProxiedElement = "GradumProxiedElement",
    HTMLElement = "HTMLElement",
    SVGElement = "SVGElement",
    MathMLElement = "MathMLElement",
    Element = "Element",
    Node = "Node",
    GradumModel = "GradumModel",
    GradumView = "GradumView",
    GradumEmitter = "GradumEmitter",
    GradumOperator = "GradumOperator",
    GradumHandler = "GradumHandler",
    GradumInteractor = "GradumInteractor",
    GradumTool = "GradumTool",
    GradumConstrainer = "GradumConstrainer",
    Other = "Other"
}
/**
 * @type {RegistryEntry}
 * @group Decorators
 * @category Registry, Attributes & DOM
 *
 * @description Represents a single entry in the Gradum Kit class registry, as stored and returned
 * by {@link findRegistered} and related query functions.
 * @property {new (...args: any[]) => any} constructor - The registered class constructor.
 * @property {RegistryCategory} category - The category the class was registered under,
 * either explicitly provided or inferred from its inheritance chain.
 * @property {string} name - The registered name of the class, used as the registry key.
 * Typically the class name as passed to {@link define}.
 * @property {string} [tag] - The custom element tag name associated with this class.
 * Only present for classes registered as custom HTML elements via {@link define}.
 */
type RegistryEntry = {
    constructor: new (...args: any[]) => any;
    category: RegistryCategory | string;
    tag?: string;
    name: string;
};

/**
 * @decorator
 * @function define
 * @group Decorators
 * @category Registry, Attributes & DOM
 *
 * @description Stage-3 **class** decorator factory that registers a class in the Gradum Kit registry
 * and, if the class extends a DOM element, also registers it as a custom HTML element. Specifically, it:
 * - Registers the class in the registry by {@link RegistryCategory}, inferring the category
 *   from the class's inheritance chain.
 * - If the class extends a DOM `Element`:
 *   - Registers it with the browser's `customElements` registry under the provided or inferred tag name.
 *   - Stores the tag name on the class as a static `tagName` property.
 *   - Adds the tag name as a CSS class to all instances (enabling CSS targeting by class hierarchy).
 *   - Wraps the static `create()` method to automatically inject the tag name into creation properties.
 *   - Publishes a live `observedAttributes` getter aggregating all `@observe`-decorated fields
 *     across the entire class hierarchy.
 *   - Optionally injects an `attributeChangedCallback` that mirrors HTML attribute changes to
 *     their corresponding `@observe`-decorated fields, and vice versa.
 *
 * @param {string} className - The class name, used as the registry key and to infer the tag name.
 * @param {string} [elementName] - The custom element tag name. Inferred as the kebab-case of
 * `className` if omitted (e.g. `"MyEl"` → `"my-el"`).
 * @param {DefineOptions} [options] - Configuration options. See {@link DefineOptions}.
 *
 * @example
 * ```ts
 * @define("MyEl")           // tag inferred as "my-el"
 * class MyEl extends GradumElement { ... }
 *
 * @define("MyEl", "my-el") // explicit tag name
 * class MyEl extends GradumElement { ... }
 *
 * @define("MyModel")        // non-element: only registered in Gradum Kit registry
 * class MyModel extends GradumModel { ... }
 * ```
 */
declare function define(className: string, elementName?: string, options?: DefineOptions): any;
/**
 * @function define
 * @group Decorators
 * @category Registry, Attributes & DOM
 *
 * @description Imperative equivalent of the `@define` decorator. Applies identical registration
 * and setup logic without requiring decorator syntax — useful for dynamically registering classes
 * at runtime, or in build environments where class decorators cause unwanted output transformations.
 *
 * When the class extends a DOM `Element`, it:
 * - Registers it with the browser's `customElements` registry.
 * - Stores the tag name as a static `tagName` property.
 * - Adds the tag name as a CSS class to all instances.
 * - Wraps the static `create()` method to automatically inject the tag.
 * - Publishes a live `observedAttributes` getter across the class hierarchy.
 * - Optionally injects an `attributeChangedCallback` attribute bridge.
 *
 * For all classes (element or not), it registers the class in the registry by {@link RegistryCategory}.
 *
 * @param {Type} Base - The class to register.
 * @param {string} [elementName] - The custom element tag name. Inferred as the kebab-case of
 * `className` if omitted.
 * @param {string} [className] - The class name, used as the registry key. Inferred from
 * `Base.name` if omitted.
 * @param {DefineOptions} [options] - Configuration options. See {@link DefineOptions}.
 * @returns {Type} The class, unchanged, after all setup has been applied.
 *
 * @example
 * ```ts
 * class MyEl extends GradumElement { ... }
 * define(MyEl);                    // className → "MyEl", tag → "my-el"
 * define(MyEl, "my-el");           // explicit tag, className inferred
 * define(MyEl, "my-el", "MyEl");   // both explicit
 *
 * class MyModel extends GradumModel { ... }
 * define(MyModel, undefined, "MyModel"); // non-element, registry only
 * ```
 */
declare function define<Type extends new (...args: any[]) => any>(Base: Type, elementName?: string, className?: string, options?: DefineOptions): Type;
/**
 * @function findRegistered
 * @group Decorators
 * @category Registry, Attributes & DOM
 *
 * @description Finds a registered entry by name, optionally scoped to a specific category.
 * If no category is provided, searches across all categories and returns the first match.
 * @param {string} name - The registered name to search for.
 * @param {RegistryCategory} [category] - The category to scope the search to. Searches all categories if omitted.
 * @returns {RegistryEntry} The matching registry entry, or `undefined` if not found.
 */
declare function findRegistered(name: string, category?: RegistryCategory): RegistryEntry;
/**
 * @function getRegisteredByCategories
 * @group Decorators
 * @category Registry, Attributes & DOM
 *
 * @description Returns all registered entries across one or more specified categories.
 * @param {...RegistryCategory[]} categories - The categories to retrieve entries from.
 * @returns {RegistryEntry[]} An array of all registry entries in the specified categories.
 */
declare function getRegisteredByCategories(...categories: RegistryCategory[]): RegistryEntry[];
/**
 * @function getAllRegistered
 * @group Decorators
 * @category Registry, Attributes & DOM
 *
 * @description Returns all registered entries across every category in the registry.
 * @returns {RegistryEntry[]} An array of all registry entries.
 */
declare function getAllRegistered(): RegistryEntry[];
/**
 * @function getRegisteredMvc
 * @group Decorators
 * @category Registry, Attributes & DOM
 *
 * @description Returns all registered entries belonging to MVC-related categories:
 * `GradumOperator`, `GradumEmitter`, `GradumHandler`, `GradumInteractor`, `GradumModel`,
 * `GradumConstrainer`, `GradumTool`, and `GradumView`.
 * @returns {RegistryEntry[]} An array of all MVC registry entries.
 */
declare function getRegisteredMvc(): RegistryEntry[];
/**
 * @function getRegisteredElements
 * @group Decorators
 * @category Registry, Attributes & DOM
 *
 * @description Returns all registered entries belonging to element-related categories:
 * `GradumElement`, `GradumProxiedElement`, `Element`, `HTMLElement`, `SVGElement`, and `MathMLElement`.
 * @returns {RegistryEntry[]} An array of all element registry entries.
 */
declare function getRegisteredElements(): RegistryEntry[];
/**
 * @function addRegistryCategory
 * @group Decorators
 * @category Registry
 *
 * @description Associates a class constructor with a {@link RegistryCategory} in the Gradum Kit registry's
 * category inference map. When {@link define} is called on a subclass, it walks the prototype chain and
 * uses this map to determine the appropriate category without requiring direct imports of the base classes
 * (which would cause circular dependencies).
 *
 * This should be called once per base class, after its definition, by the Gradum Kit internals.
 * User-defined subclasses do not need to call this — category inference propagates automatically
 * through the prototype chain.
 *
 * @param {new (...args: any[]) => object} type - The base class constructor to associate with a category.
 * @param {RegistryCategory} [category] - The category to associate with the class. Defaults to the
 * class name if omitted, which is useful when the class name matches a {@link RegistryCategory} value.
 *
 * @example
 * ```ts
 * // At the bottom of gradumModel.ts, after class definition:
 * addRegistryCategory(GradumModel, RegistryCategory.GradumModel);
 *
 * // Later, when a subclass is defined:
 * class MyModel extends GradumModel { ... }
 * define(MyModel, "MyModel"); // infers RegistryCategory.GradumModel automatically
 * ```
 */
declare function addRegistryCategory(type: new (...args: any[]) => object, category?: RegistryCategory): void;
/**
 * @function getRegisteredEntry
 * @group Decorators
 * @category Registry, Attributes & DOM
 *
 * @description Returns the registry entry for a given class instance, looked up by its constructor.
 * Walks the instance's prototype chain until it finds a registered constructor, so subclasses that
 * were not themselves passed to {@link define} will still resolve to their nearest registered ancestor.
 * @param {object} instance - The class instance to look up.
 * @returns {RegistryEntry | undefined} The matching registry entry (containing `name`, `category`,
 * `constructor`, and optionally `tag`), or `undefined` if no registered class is found in the chain.
 */
declare function getRegisteredEntry(instance: object): RegistryEntry;

/**
 * @decorator
 * @function expose
 * @group Decorators
 * @category Augmentation
 *
 * @description Stage-3 decorator that augments fields, accessors, and methods to expose fields and methods
 * from inner instances.
 *
 * @example
 * ```ts
 * protected model: GradumModel;
 * @expose("model") public color: string;
 * ```
 * Is equivalent to:
 * ```ts
 * protected model: GradumModel;
 *
 * public get color(): string {
 *     return this.model.color;
 * }
 *
 * public set color(value: string) {
 *     this.model.color = value;
 * }
 * ```
 */
declare function expose(rootKey: string, exposeSetter?: boolean): any;
/**
 * @function expose
 * @group Decorators
 * @category Augmentation
 *
 * @description Imperatively exposes a specific field from an inner instance onto a host object.
 * @param {object} host - The host object to define the exposed property on.
 * @param {string} rootKey - The property key of the inner instance to expose from.
 * @param {string} key - The property key to expose.
 * @param {boolean} [exposeSetter=true] - Whether to expose a setter for the property. Defaults to true.
 *
 * @example
 * ```ts
 * expose(this, "model", "color");
 * expose(this, "model", "readonlyProp", false);
 * ```
 */
declare function expose(host: object, rootKey: string, key: string, exposeSetter?: boolean): void;

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
declare function listener(properties?: Partial<Omit<ListenerProperties, "callback">>): <T extends object>(value: (this: T, e?: Event, target?: Node) => any, context: ClassMethodDecoratorContext<T>) => (this: T, e?: Event, target?: Node) => any;
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
declare function behavior(properties?: Partial<Omit<ListenerProperties, "callback" | "options">>): <T extends object>(value: (this: T, e?: Event, target?: Node) => any, context: ClassMethodDecoratorContext<T>) => (this: T, e?: Event, target?: Node) => any;
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
declare function attachListenersAndBehaviors(context: any): void;

/**
 * @decorator
 * @function operator
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched operator.
 * @param {string} [name] - The key name of the operator in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingOperator`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @operator() protected textOperator: GradumOperator;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textOperator(): GradumOperator {
 *    if (this.mvc instanceof Mvc) return this.mvc.getOperator("text");
 *    if (typeof this.getOperator === "function") return this.getOperator("text");
 * }
 * ```
 */
declare function operator(name?: string): (_unused: unknown, context: ClassFieldDecoratorContext) => void;
/**
 * @decorator
 * @function handler
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched handler.
 * @param {string} [name] - The key name of the handler in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingHandler`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @handler() protected textHandler: GradumHandler;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textHandler(): GradumHandler {
 *    if (this.mvc instanceof Mvc) return this.mvc.getHandler("text");
 *    if (typeof this.getHandler === "function") return this.getHandler("text");
 * }
 * ```
 */
declare function handler(name?: string): (_unused: unknown, context: ClassFieldDecoratorContext) => void;
/**
 * @decorator
 * @function interactor
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched interactor.
 * @param {string} [name] - The key name of the interactor in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingInteractor`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @interactor() protected textInteractor: GradumInteractor;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textInteractor(): GradumInteractor {
 *    if (this.mvc instanceof Mvc) return this.mvc.getInteractor("text");
 *    if (typeof this.getInteractor === "function") return this.getInteractor("text");
 * }
 * ```
 */
declare function interactor(name?: string): (_unused: unknown, context: ClassFieldDecoratorContext) => void;
/**
 * @decorator
 * @function tool
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched tool.
 * @param {string} [name] - The key name of the tool in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingTool`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @tool() protected textTool: GradumTool;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textTool(): GradumTool {
 *    if (this.mvc instanceof Mvc) return this.mvc.getTool("text");
 *    if (typeof this.getTool === "function") return this.getTool("text");
 * }
 * ```
 */
declare function tool(name?: string): (_unused: unknown, context: ClassFieldDecoratorContext) => void;
/**
 * @decorator
 * @function constrainer
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched constrainer.
 * @param {string} [name] - The key name of the constrainer in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingConstrainer`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @tool() protected textConstrainer: GradumConstrainer;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textConstrainer(): GradumConstrainer {
 *    if (this.mvc instanceof Mvc) return this.mvc.getConstrainer("text");
 *    if (typeof this.getConstrainer === "function") return this.getConstrainer("text");
 * }
 * ```
 */
declare function constrainer(name?: string): (_unused: unknown, context: ClassFieldDecoratorContext) => void;

/**
 * @internal
 */
declare global {
    interface SymbolConstructor {
        metadata: symbol;
    }
}
/**
 * @decorator
 * @function observe
 * @group Decorators
 * @category Attributes & DOM
 *
 * @description Stage-3 decorator for fields, getters, setters, and accessors that reflects a property to an HTML
 * attribute. So when the value of the property changes, it is reflected in the element's HTML attributes.
 * It also records the attribute name into the class's `observedAttributed` to listen for changes on the HTML.
 *
 * @example
 * ```ts
 * @define()
 * class MyClass extends HTMLElement {
 *    @observe fieldName: string = "hello";
 * }
 * ```
 *
 * Leads to:
 * ```html
 * <my-class field-name="hello"></my-class>
 * ```
 *
 */
declare function observe<Type extends object, Value>(value: ((initial: Value) => Value) | ((this: Type) => Value) | ((this: Type, v: Value) => void) | {
    get?: (this: Type) => Value;
    set?: (this: Type, value: Value) => void;
}, context: ClassFieldDecoratorContext<Type, Value> | ClassGetterDecoratorContext<Type, Value> | ClassSetterDecoratorContext<Type, Value> | ClassAccessorDecoratorContext<Type, Value>): any;

/**
 * @overload
 * @function signal
 * @group Decorators
 * @category Signal
 *
 * @description Create a standalone reactive signal box.
 * Returns a {@link SignalBox} wrapping the initial value.
 *
 * @template Value
 * @param {Value} [initial] - Initial value stored by the signal.
 * @param {object} [target] - The target to which the signal is bound.
 * @param {...PropertyKey[]} keys - The key path at which the signal will be stored in the target.
 * @returns {SignalBox<Value>} A reactive box for reading/updating the value.
 *
 * @example
 * ```ts
 * const count = signal(0);
 * const nested = signal(0, target, "users", "42", "score");
 * ```
 */
declare function signal<Value>(initial?: Value, target?: object, ...keys: KeyType[]): SignalBox<Value>;
/**
 * @overload
 * @function signal
 * @group Decorators
 * @category Signal
 *
 * @description Create a standalone reactive signal box that mirrors a getter and a setter.
 * Returns a {@link SignalBox} wrapping the initial value.
 *
 * @template Value
 * @param {() => Value} get - Getter that returns the value.
 * @param {(value: Value) => void} set - Setter that changes the value and emits the signal.
 * @param {object} [target] - The target to which the signal is bound.
 * @param {...PropertyKey[]} keys - The key path at which the signal will be stored in the target.
 * @returns {SignalBox<Value>} A reactive box for reading/updating the value.
 *
 * @example
 * ```ts
 * const nested = signal(() => target.get("users", "42"), v => target.set(v, "users", "42"), target, "users", "42");
 * ```
 */
declare function signal<Value>(get: () => Value, set: (value: Value) => void, target?: object, ...keys: KeyType[]): SignalBox<Value>;
/**
 * @overload
 * @decorator
 * @function signal
 * @group Decorators
 * @category Signal
 *
 * @description Stage-3 decorator that turns a field, getter, setter, or accessor into a reactive signal.
 *
 * @example
 * ```ts
 * class Counter {
 *   @signal count = 0;
 *
 *   @effect
 *   log() { console.log(this.count); }
 * }
 *
 * const c = new Counter();
 * c.count++; // triggers effect, logs updated value
 * ```
 */
declare function signal<Type extends object, Value>(value: ((initial: Value) => Value) | ((this: Type) => Value) | ((this: Type, v: Value) => void) | {
    get?: (this: Type) => Value;
    set?: (this: Type, value: Value) => void;
}, context: ClassFieldDecoratorContext<Type, Value> | ClassGetterDecoratorContext<Type, Value> | ClassSetterDecoratorContext<Type, Value> | ClassAccessorDecoratorContext<Type, Value>): any;
/**
 * @decorator
 * @function modelSignal
 * @group Decorators
 * @category Signal
 *
 * @description Decorator that binds a reactive signal to a key path in the model's data,
 * read via `this.get(...keys)` and written via `this.set(value, ...keys)`.
 *
 * @param {...string[]} keys - The key path into the model's data. Defaults to the decorated member name if omitted.
 *
 * @example
 * ```ts
 * class TodoModel extends GradumModel {
 *   @modelSignal() title = "";
 *   @modelSignal("meta", "author") author = "";
 * }
 * ```
 * Is equivalent to:
 * ```ts
 * class TodoModel extends GradumModel {
 *   @signal get title() { return this.get("title"); }
 *   set title(value) { this.set(value, "title"); }
 *
 *   @signal get author() { return this.get("meta", "author"); }
 *   set author(value) { this.set(value, "meta", "author"); }
 * }
 * ```
 */
declare function modelSignal(...keys: KeyType[]): <Type extends object, Value>(value: ((initial: Value) => Value) | ((this: Type) => Value) | ((this: Type, v: Value) => void) | {
    get?: (this: Type) => Value;
    set?: (this: Type, value: Value) => void;
}, context: ClassFieldDecoratorContext<Type, Value> | ClassGetterDecoratorContext<Type, Value> | ClassSetterDecoratorContext<Type, Value> | ClassAccessorDecoratorContext<Type, Value>) => any;
/**
 * @decorator
 * @function nestedModelSignal
 * @group Decorators
 * @category Signal
 *
 * @description Decorator that binds a reactive signal to a nested {@link GradumModel} instance at the given key path.
 * - Getter returns the nested model instance via `this.getNested(...keys)`.
 * - Setter assigns the new value to the nested model's root data via `this.getNested(...keys).data = value`.
 *
 * @param {...string[]} keys - The key path navigating to the nested model.
 *
 * @example
 * ```ts
 * class AppModel extends GradumModel {
 *   @nestedModelSignal("users", "42") user = undefined;
 * }
 * ```
 * Is equivalent to:
 * ```ts
 * class AppModel extends GradumModel {
 *   @signal get user() { return this.getNested("users", "42"); }
 *   set user(value) { this.getNested("users", "42").data = value; }
 * }
 * ```
 */
declare function nestedModelSignal(...keys: string[]): <Type extends object, Value>(value: ((initial: Value) => Value) | ((this: Type) => Value) | ((this: Type, v: Value) => void) | {
    get?: (this: Type) => Value;
    set?: (this: Type, value: Value) => void;
}, context: ClassFieldDecoratorContext<Type, Value> | ClassGetterDecoratorContext<Type, Value> | ClassSetterDecoratorContext<Type, Value> | ClassAccessorDecoratorContext<Type, Value>) => any;
/**
 * @decorator
 * @function isolatedModelSignal
 * @group Decorators
 * @category Signal
 *
 * @description Decorator that binds a reactive signal to a nested {@link GradumModel} at the given key path,
 * where the nested model's data is **not** stored inside the parent model's data container.
 *
 * Use this when the nested model holds data that lives outside the parent's data tree — for example,
 * a Y.js type that is already part of a Y.js document at a different location. Unlike
 * {@link nestedModelSignal}, this decorator does **not** write to the parent model's data when
 * the value is set, so it will not attempt to insert a foreign Y.js type into the parent's Y.js
 * structure (which would throw, since a Y.js type can only belong to one place in a document).
 *
 * - Getter returns the nested model instance via `this.nest(...keys)`.
 * - Setter assigns directly to `nestedModel.data = value`, leaving the parent's data untouched.
 *
 * **Limitation:** `@modelSignal("myField", "subKey")` will **not** work for a field backed by
 * `@isolatedModelSignal`, because `GradumModel.get()` reads through the parent's data container
 * rather than routing through registered nested models. Access sub-keys directly through the
 * nested model instead: `(this.myField as MyNestedModel).subKey`.
 *
 * @param {...string[]} keys - The key path identifying the nested model slot. Defaults to the
 * decorated property name if omitted.
 *
 * @example
 * ```ts
 * class CardModel extends GradumYModel {
 *   // Foreign YMap managed elsewhere in the Y.js document — must not be written into this
 *   // model's data tree.
 *   @isolatedModelSignal() cardData: CardDataModel;
 * }
 * ```
 * Is equivalent to:
 * ```ts
 * class CardModel extends GradumYModel {
 *   @signal get cardData() { return this.nest("cardData"); }
 *   set cardData(value) { this.nest("cardData").data = value; }
 * }
 * ```
 */
declare function isolatedModelSignal(...keys: string[]): <Type extends object, Value>(value: ((initial: Value) => Value) | ((this: Type) => Value) | ((this: Type, v: Value) => void) | {
    get?: (this: Type) => Value;
    set?: (this: Type, value: Value) => void;
}, context: ClassFieldDecoratorContext<Type, Value> | ClassGetterDecoratorContext<Type, Value> | ClassSetterDecoratorContext<Type, Value> | ClassAccessorDecoratorContext<Type, Value>) => any;
/**
 * @overload
 * @function effect
 * @group Decorators
 * @category Effect
 *
 * @description Bind a standalone effect callback to any signal it includes. The callback will be fired everytime
 * the signal's value changes.
 *
 * @param {() => void} callback - The callback to process.
 * @returns {() => void} A callback that, once called, disposes of the created effect.
 *
 * @example
 * ```ts
 * const count = signal(0);
 * effect(() => console.log(count.value));
 * ```
 */
declare function effect(callback: () => void): () => void;
/**
 * @overload
 * @decorator
 * @function effect
 * @group Decorators
 * @category Effect
 *
 * @description Stage-3 decorator that turns a function or getter into an effect callback bound to any signal it includes.
 * The callback will be fired everytime the signal's value changes.
 *
 * @example
 * ```ts
 * class Counter {
 *   @signal count = 0;
 *
 *   @effect log = () => console.log(this.count);
 * }
 *
 * const c = new Counter();
 * c.count++; // triggers effect, logs updated value
 * ```
 */
declare function effect<Type extends object>(value: ((this: Type) => void) | (() => void), context?: ClassMethodDecoratorContext<Type, any> | ClassGetterDecoratorContext<Type, any> | ClassFieldDecoratorContext<Type, any>): any;
/**
 * @function getSignal
 * @group Decorators
 * @category Signal
 *
 * @template Type
 * @description Retrieve the signal at the given `key` inside `target`.
 * @param {object} target - The target to which the signal is bound.
 * @param {PropertyKey} key - The key of the signal inside `target`.
 * @return {SignalEntry<Type>} - The signal entry.
 */
declare function getSignal<Type = any>(target: object, key: PropertyKey): SignalEntry<Type>;
/**
 * @function setSignal
 * @group Decorators
 * @category Signal
 *
 * @template Type
 * @description Set the value of the signal at the given `key` inside `target`.
 * @param {object} target - The target to which the signal is bound.
 * @param {PropertyKey} key - The key of the signal inside `target`.
 * @param {Type} value - The new value of the signal.
 */
declare function setSignal<Type = any>(target: object, key: PropertyKey, value: Type): void;
/**
 * @overload
 * @function markDirty
 * @group Decorators
 * @category Signal
 *
 * @description Marks the signal at the given `key` inside `target` as dirty and fires all of its attached effects.
 * @param {object} target - The target to which the signal is bound.
 * @param {PropertyKey} key - The key of the signal inside `target`.
 */
declare function markDirty(target: object, key: PropertyKey): void;
/**
 * @overload
 * @function markDirty
 * @group Decorators
 * @category Signal
 *
 * @description Marks the signal bound to the given key path inside `target` as dirty and fires all attached effects.
 * @param {object} target - The target to which the signal is bound.
 * @param {...(string | number | symbol)[]} keys - The key path of the data.
 */
declare function markDirty(target: object, ...keys: KeyType[]): void;
/**
 * @function markDirtyPath
 * @group Decorators
 * @category Signal
 *
 * @description Marks as dirty every signal whose bound key path (registered via {@link modelSignal} or
 * {@link nestedModelSignal}) overlaps the given changed key path, and fires their attached effects.
 * A bound path overlaps the changed path when either is a prefix of (or equal to) the other:
 * replacing a parent value invalidates signals bound deeper inside it, and changing a nested value
 * invalidates signals bound to any of its ancestors. An empty `keys` array marks every bound path dirty,
 * as it represents a change at the root.
 * @param {object} target - The target to which the signals are bound.
 * @param {KeyType[]} keys - The key path of the data that changed.
 */
declare function markDirtyPath(target: object, keys: KeyType[]): void;
/**
 * @function initializeEffects
 * @group Decorators
 * @category Effect
 *
 * @description Initializes and runs all the effects attached to the given `target`.
 * @param {object} target - The target to which the effects are bound.
 */
declare function initializeEffects(target: object): void;
/**
 * @function disposeEffect
 * @group Decorators
 * @category Effect
 *
 * @description Disposes of all the effects attached to the given `target`.
 * @param {object} target - The target to which the effects are bound.
 */
declare function disposeEffect(target: object): void;
/**
 * @function disposeEffect
 * @group Decorators
 * @category Effect
 *
 * @description Disposes of the effect at the given `key` inside `target`.
 * @param {object} target - The target to which the signal is bound.
 * @param {PropertyKey} key - The key of the signal inside `target`.
 */
declare function disposeEffect(target: object, key: PropertyKey): void;
declare function untrack<T>(fn: () => T): T;

/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates an "a" element with the specified properties.
 * @param {GradumProperties<"a">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"a">} The created element.
 */
declare function a(properties?: GradumProperties<"a">): ValidElement<"a">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "canvas" element with the specified properties.
 * @param {GradumProperties<"canvas">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"canvas">} The created element.
 */
declare function canvas(properties?: GradumProperties<"canvas">): ValidElement<"canvas">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "div" element with the specified properties.
 * @param {GradumProperties<"div">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"div">} The created element.
 */
declare function div(properties?: GradumProperties): ValidElement<"div">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "form" element with the specified properties.
 * @param {GradumProperties<"form">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"form">} The created element.
 */
declare function form(properties?: GradumProperties<"form">): ValidElement<"form">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "h1" element with the specified properties.
 * @param {GradumProperties<"h1">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h1">} The created element.
 */
declare function h1(properties?: GradumProperties<"h1">): ValidElement<"h1">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "h2" element with the specified properties.
 * @param {GradumProperties<"h2">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h2">} The created element.
 */
declare function h2(properties?: GradumProperties<"h2">): ValidElement<"h2">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "h3" element with the specified properties.
 * @param {GradumProperties<"h3">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h3">} The created element.
 */
declare function h3(properties?: GradumProperties<"h3">): ValidElement<"h3">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "h4" element with the specified properties.
 * @param {GradumProperties<"h4">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h4">} The created element.
 */
declare function h4(properties?: GradumProperties<"h4">): ValidElement<"h4">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "h5" element with the specified properties.
 * @param {GradumProperties<"h5">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h5">} The created element.
 */
declare function h5(properties?: GradumProperties<"h5">): ValidElement<"h5">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "h6" element with the specified properties.
 * @param {GradumProperties<"h6">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h6">} The created element.
 */
declare function h6(properties?: GradumProperties<"h6">): ValidElement<"h6">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates an "img" element with the specified properties.
 * @param {GradumProperties<"img">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"img">} The created element.
 */
declare function img(properties?: GradumProperties<"img">): ValidElement<"img">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates an "input" element with the specified properties.
 * @param {GradumProperties<"input">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"input">} The created element.
 */
declare function input(properties?: GradumProperties<"input">): ValidElement<"input">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "link" element with the specified properties.
 * @param {GradumProperties<"link">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"link">} The created element.
 */
declare function link(properties?: GradumProperties<"link">): ValidElement<"link">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "p" element with the specified properties.
 * @param {GradumProperties<"p">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"p">} The created element.
 */
declare function p(properties?: GradumProperties<"p">): ValidElement<"p">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "span" element with the specified properties.
 * @param {GradumProperties<"span">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"span">} The created element.
 */
declare function span(properties?: GradumProperties<"span">): ValidElement<"span">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "style" element with the specified properties.
 * @param {GradumProperties<"style">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"style">} The created element.
 */
declare function style(properties?: GradumProperties<"style">): ValidElement<"style">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "textarea" element with the specified properties.
 * @param {GradumProperties<"textarea">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"textarea">} The created element.
 */
declare function textarea(properties?: GradumProperties<"textarea">): ValidElement<"textarea">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "video" element with the specified properties.
 * @param {GradumProperties<"video">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"video">} The created element.
 */
declare function video(properties?: GradumProperties<"video">): ValidElement<"video">;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a "button" element with the specified properties.
 * @param {GradumProperties<"button">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"button">} The created element.
 */
declare function button(properties?: GradumProperties<"button">): ValidElement<"button">;

/**
 * @group Element Creation
 * @category Creation Functions
 *
 * @description returns a function that generates an HTML element with the provided tag that takes GradumProperties
 * as input.
 * @param {keyof ElementTagMap} tag - The tag to generate the function from.
 * @return The function
 */
declare function generateTagFunction<Tag extends ValidTag>(tag: Tag): (properties?: GradumProperties<Tag>) => ValidElement<Tag>;
/**
 * @group Element Creation
 * @category Creation Functions
 *
 * @description Create an element with the specified properties (and the specified namespace if applicable).
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element.
 * @returns {ValidElement<Tag>} The created element.
 * @template Tag
 */
declare function element<Tag extends ValidTag>(properties?: GradumProperties<Tag>): ValidElement<Tag>;
/**
 * @group Element Creation
 * @category Creation Functions
 *
 * @description Create an element with the specified properties. Supports SVG and MathML.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element.
 * @returns {ValidElement<Tag>} The created element.
 * @template Tag
 */
declare function blindElement<Tag extends ValidTag>(properties?: GradumProperties<Tag>): ValidElement<Tag>;

/**
 * @group Element Creation
 * @category Flex Elements
 *
 * @description Create a flex column element.
 * @param {GradumProperties<Tag>} properties - Object containing properties of the element.
 * @returns {ValidHTMLElement<Tag>} The created flex element.
 * @template {HTMLTag} Tag
 */
declare function flexCol<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag>;
/**
 * @group Element Creation
 * @category Flex Elements
 *
 * @description Create a flex column element.
 * @param {GradumProperties<Tag>} properties - Object containing properties of the element.
 * @returns {ValidHTMLElement<Tag>} The created flex element.
 * @template {HTMLTag} Tag
 */
declare function flexColCenter<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag>;
/**
 * @group Element Creation
 * @category Flex Elements
 *
 * @description Create a flex row element.
 * @param {GradumProperties<Tag>} properties - Object containing properties of the element.
 * @returns {ValidHTMLElement<Tag>} The created flex element.
 * @template {HTMLTag} Tag
 */
declare function flexRow<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag>;
/**
 * @group Element Creation
 * @category Flex Elements
 *
 * @description Create a flex row element.
 * @param {GradumProperties<Tag>} properties - Object containing properties of the element.
 * @returns {ValidHTMLElement<Tag>} The created flex element.
 * @template {HTMLTag} Tag
 */
declare function flexRowCenter<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag>;
/**
 * @group Element Creation
 * @category Flex Elements
 *
 * @description Create a spacer element.
 * @param {GradumProperties<Tag>} properties - Object containing properties of the element.
 * @returns {ValidHTMLElement<Tag>} The created spacer element.
 * @template {HTMLTag} Tag
 */
declare function spacer<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag>;

/**
 * @type {StylesRoot}
 * @group Types
 * @category Style
 *
 * @description A type that represents entities that can hold a <style> object (Shadow root or HTML head).
 */
type StylesRoot = ShadowRoot | HTMLHeadElement;
/**
 * @type {StylesType}
 * @group Types
 * @category Style
 *
 * @description A type that represents the types that are accepted as styles entries (mainly by the HTMLElement.setStyles()
 * method). It includes strings, numbers, and records of CSS attributes to strings or numbers.
 */
type StylesType = string | number | PartialRecord<keyof CSSStyleDeclaration, string | number>;
/**
 * @group Element Creation
 * @category Base Elements
 *
 * @description Adds the provided string as a new style element to the provided root.
 * @param {string} [styles] - The css string. Use the css literal function for autocompletion.
 * @param {StylesRoot} [root] - The root to which the style element will be added.
 */
declare function stylesheet(styles?: string, root?: StylesRoot): void;

/**
 * @class GradumDragEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description Gradum drag event class, fired on gradum-drag, gradum-drag-start, gradum-drag-end, etc.
 */
declare class GradumDragEvent extends GradumEvent {
    /**
     * @description Map containing the origins of the dragging points
     */
    readonly origins: GradumMap<number, Point>;
    /**
     * @description Map containing the previous positions of the dragging points
     */
    readonly previousPositions: GradumMap<number, Point>;
    /**
     * @description Map containing the positions of the dragging points
     */
    readonly positions: GradumMap<number, Point>;
    constructor(properties: GradumDragEventProperties);
    /**
     * @description Map of the origins mapped to the current canvas translation and scale
     */
    get scaledOrigins(): GradumMap<number, Point>;
    /**
     * @description Map of the previous positions mapped to the current canvas translation and scale
     */
    get scaledPreviousPositions(): GradumMap<number, Point>;
    /**
     * @description Map of the positions mapped to the current canvas translation and scale
     */
    get scaledPositions(): GradumMap<number, Point>;
    get deltaPositions(): GradumMap<number, Point>;
    get deltaPosition(): Point;
    get scaledDeltaPositions(): GradumMap<number, Point>;
    get scaledDeltaPosition(): Point;
}

/**
 * @class GradumKeyEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description Custom key event
 */
declare class GradumKeyEvent extends GradumEvent {
    /**
     * @description The key pressed (if any) when the event was fired
     */
    readonly keyPressed: string;
    /**
     * @description The key released (if any) when the event was fired
     */
    readonly keyReleased: string;
    constructor(properties: GradumKeyEventProperties);
}

/**
 * @class GradumWheelEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description Custom wheel event
 */
declare class GradumWheelEvent extends GradumEvent {
    /**
     * @description The delta amount of scrolling
     */
    readonly delta: Point;
    constructor(properties: GradumWheelEventProperties);
}

/**
 * @class GradumElement
 * @group GradumElement
 * @category GradumElement
 *
 * @extends HTMLElement
 * @description Base GradumElement class, extending the base HTML element with a few useful tools and functions.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * */
declare class GradumElement<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>> extends HTMLElement {
    /**
     * @description Default properties assigned to a new instance.
     */
    static defaultProperties: GradumElementProperties;
    static create<Type extends new (...args: any[]) => GradumElement, PropertiesType extends InstanceType<Type>["properties"]>(this: Type, properties?: PropertiesType): InstanceType<Type>;
    protected static customCreate(properties: object): object;
    readonly properties: GradumElementProperties;
    /**
     * @description Delegate fired when the element is attached to DOM.
     */
    readonly onAttach: Delegate<() => void>;
    /**
     * @description Delegate fired when the element is detached from the DOM.
     */
    readonly onDetach: Delegate<() => void>;
    /**
     * @description Delegate fired when the element is adopted by a new parent in the DOM.
     */
    readonly onAdopt: Delegate<() => void>;
    /**
     * @function setupChangedCallbacks
     * @description Setup method intended to initialize change listeners and callbacks. Called on `initialize()`.
     * @protected
     */
    protected setupChangedCallbacks(): void;
    /**
     * @function setupUIElements
     * @description Setup method intended to initialize all direct sub-elements attached to this element, and store
     * them in fields. Called on `initialize()`.
     * @protected
     */
    protected setupUIElements(): void;
    /**
     * @function setupUILayout
     * @description Setup method to create the layout structure of the element by adding all created sub-elements to
     * this element's child tree. Called on `initialize()`.
     * @protected
     */
    protected setupUILayout(): void;
    /**
     * @function setupUIListeners
     * @description Setup method to initialize and define all input/DOM event listeners of the element. Called on
     * `initialize()`.
     * @protected
     */
    protected setupUIListeners(): void;
    /**
     * @function connectedCallback
     * @description function called when the element is attached to the DOM.
     */
    connectedCallback(): void;
    /**
     * @function disconnectedCallback
     * @description function called when the element is detached from the DOM.
     */
    disconnectedCallback(): void;
    /**
     * @function adoptedCallback
     * @description function called when the element is adopted by a new parent in the DOM.
     */
    adoptedCallback(): void;
}

/**
 * @class Color
 * @group Utilities
 * @category Color
 *
 * @description Unified color class. Parses any CSS color string (hex, rgb/rgba, hsl/hsla), stores the color
 * internally as RGBA, and provides conversions, interpolation, luminance, and contrast utilities.
 * All channels are kept in sync: setting any of r/g/b/a/h/s/l/hex updates the rest automatically.
 */
declare class Color {
    private syncing;
    set r(value: number);
    set g(value: number);
    set b(value: number);
    set a(value: number);
    set h(value: number);
    set s(value: number);
    set l(value: number);
    set hex(value: string);
    /**
     * @constructor
     * @param {number} r - Red channel (0–255).
     * @param {number} g - Green channel (0–255).
     * @param {number} b - Blue channel (0–255).
     * @param {number} [a=1] - Alpha channel (0–1).
     */
    constructor(r?: number, g?: number, b?: number, a?: number);
    /**
     * @description Returns the color as a CSS `rgb()` string (alpha ignored).
     * @returns {string} - e.g. `"rgb(255 136 0)"`.
     */
    get rgb(): string;
    /**
     * @description Returns the color as a CSS `rgb()` string with alpha.
     * @returns {string} - e.g. `"rgb(255 136 0 / 0.5)"`.
     */
    get rgba(): string;
    /**
     * @description Returns the color as a CSS `hsl()` string (alpha ignored).
     * @returns {string} - e.g. `"hsl(32 100% 50%)"`.
     */
    get hsl(): string;
    /**
     * @description Returns the color as a CSS `hsl()` string with alpha.
     * @returns {string} - e.g. `"hsl(32 100% 50% / 0.5)"`.
     */
    get hsla(): string;
    /**
     * @description Returns `rgb()` for opaque colors and `rgb()` with alpha for semi-transparent ones.
     */
    toString(): string;
    fromString(value: string): Color;
    private syncFromRgb;
    private syncFromHsl;
    private syncFromHex;
    private syncHex;
    /**
     * @description Creates a Color from a CSS color string or an existing Color instance.
     * Supports hex (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`), `rgb()`/`rgba()`, and `hsl()`/`hsla()`.
     * Returns `Color(0, 0, 0)` if the string cannot be parsed.
     * @param {string | Color} color - The CSS color string or Color instance to parse.
     * @returns {Color}
     */
    static from(color: string | Color): Color;
    /**
     * @description Creates a Color from a hex string (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`).
     * @param {string} hex - The hex color string.
     * @returns {Color | null} - Null if the string is not a valid hex color.
     */
    static fromHexString(hex: string): Color;
    /**
     * @description Creates a Color from HSL components.
     * @param {number} h - Hue, 0–360.
     * @param {number} s - Saturation, 0–100.
     * @param {number} l - Lightness, 0–100.
     * @param {number} [a=1] - Alpha, 0–1.
     * @returns {Color}
     */
    static fromHsl(h: number, s: number, l: number, a?: number): Color;
    /**
     * @description Creates a Color from a CSS `hsl()`/`hsla()` string.
     * Handles both comma-separated (CSS Level 3) and space-separated (CSS Level 4) syntax,
     * with or without `%` signs and `deg` units, and optional alpha via `/` or as a fourth argument.
     * @param {string} color - The HSL color string.
     * @returns {Color | null} - Null if parsing fails.
     */
    static fromHslString(color: string): Color;
    /**
     * @description Creates a Color from a CSS `rgb()`/`rgba()` string.
     * Handles both comma-separated (CSS Level 3) and space-separated (CSS Level 4) syntax,
     * and optional alpha via `/` or as a fourth argument.
     * @param {string} color - The RGB color string.
     * @returns {Color | null} - Null if parsing fails.
     */
    static fromRgbString(color: string): Color;
    /**
     * @description The WCAG 2.1 relative luminance of the color (0 = black, 1 = white).
     * @returns {number}
     */
    get luminance(): number;
    /**
     * @description Computes the WCAG 2.1 contrast ratio between this color and another.
     * @param {Color | string} other - The color to compare against.
     * @returns {number} - Contrast ratio, 1–21.
     */
    contrast(other: Color | string): number;
    /**
     * @description Returns whichever of the two candidate colors has better contrast against this color.
     * Defaults to black and white if candidates are not provided.
     * @param {Color | string} [dark="#000000"] - The dark candidate.
     * @param {Color | string} [light="#ffffff"] - The light candidate.
     * @returns {Color}
     */
    bestOverlay(dark?: Color | string, light?: Color | string): Color;
    /**
     * @description Linearly interpolates between this color and another in RGB space.
     * Works regardless of the original format of the input color.
     * @param {Color | string} other - The target color.
     * @param {number} t - Interpolation factor (0 = this, 1 = other).
     * @returns {Color}
     */
    interpolate(other: Color | string, t: number): Color;
    /**
     * @description Checks whether this color is equal to another color or CSS color string,
     * comparing all four channels within an optional tolerance.
     * @param {Color | string} other - The color to compare against.
     * @param {number} [tolerance=0] - Maximum allowed difference per channel.
     * @returns {boolean}
     */
    equals(other: Color | string, tolerance?: number): boolean;
    /**
     * @description Linearly interpolates between two colors in RGB space.
     * Accepts any mix of `Color` instances and CSS color strings of any supported format.
     * @param {Color | string} color1 - The start color.
     * @param {Color | string} color2 - The end color.
     * @param {number} t - Interpolation factor (0 = color1, 1 = color2).
     * @returns {Color}
     */
    static interpolate(color1: Color | string, color2: Color | string, t: number): Color;
    /**
     * @description Interpolates along a multi-stop gradient.
     * `t = 0` returns the first color, `t = 1` returns the last color.
     * @param {(Color | string)[]} colors - Two or more color stops.
     * @param {number} t - Gradient position (0–1).
     * @returns {Color}
     */
    static gradient(colors: (Color | string)[], t: number): Color;
    /**
     * @description Computes the WCAG 2.1 contrast ratio between two colors.
     * @param {Color | string} color1
     * @param {Color | string} color2
     * @returns {number}
     */
    static contrast(color1: Color | string, color2: Color | string): number;
    /**
     * @description Computes the WCAG 2.1 relative luminance of a color.
     * @param {Color | string} color
     * @returns {number}
     */
    static luminance(color: Color | string): number;
    /**
     * @description Returns whichever of the two candidates has better contrast against the base color.
     * @param {Color | string} base
     * @param {Color | string} [dark="#000000"]
     * @param {Color | string} [light="#ffffff"]
     * @returns {Color}
     */
    static bestOverlay(base: Color | string, dark?: Color | string, light?: Color | string): Color;
    /**
     * @group Utilities
     * @category Random
     */
    static random(saturation?: number | [number, number], lightness?: number | [number, number]): Color;
    private static rgbToHsl;
    private static hslToRgb;
    private static toHexStr;
    private static extractNumbers;
}

/**
 * @type {GradumIconProperties}
 * @group Components
 * @category GradumIcon
 *
 * @description Properties object that extends GradumElementProperties with properties specific to icons.
 * @extends GradumProperties
 *
 * @property {string} icon - The name of the icon.
 * @property {string} [iconColor] - The color of the icon.
 * @property {((svgManipulation: SVGElement) => {})} [onLoaded] - Custom function that takes an SVG element to execute on the
 * SVG icon (if it is one) once it is loaded. This property will be disregarded if the icon is not of type SVG.
 *
 * @property {string} [type] - Custom type of the icon, overrides the default type assigned to
 * GradumIcon.config.type (whose default value is "svgManipulation").
 * @property {string} [directory] - Custom directory to the icon, overrides the default directory assigned to
 * GradumIcon.config.directory.
 * @property {boolean} [unsetDefaultClasses] - Set to true to not add the default classes specified in
 * GradumIcon.config.defaultClasses to this instance of Icon.
 */
type GradumIconProperties<ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    type?: string;
    directory?: string;
    icon: string;
    iconColor?: string;
    onLoaded?: (svg: SVGElement) => void;
};

/**
 * @class GradumIcon
 * @group Components
 * @category GradumIcon
 *
 * @description Icon class for creating icon elements.
 * @extends GradumElement
 */
declare class GradumIcon<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumIconProperties;
    static readonly customLoaders: Record<string, (path: string) => (Element | Promise<Element>)>;
    static defaultProperties: Partial<GradumIconProperties>;
    private static imageTypes;
    private _element;
    private _loadToken;
    onLoaded: (element: Element) => void;
    /**
     * @description The type of the icon.
     */
    type: string;
    /**
     * @description The user-provided (or statically configured) directory to the icon's file.
     */
    directory: string;
    /**
     * @description The path to the icon's source file.
     */
    get path(): string;
    /**
     * @description The name (or path) of the icon. Might include the file extension (to override the icon's type).
     * Setting it will update the icon accordingly.
     */
    set icon(value: string);
    /**
     * @description The assigned color to the icon (if any)
     */
    get iconColor(): Color;
    set iconColor(value: Color | string);
    /**
     * @description The child element of the icon element (an HTML image or an SVG element).
     */
    private set element(value);
    get element(): Element;
    protected loadSvg(path: string): Promise<SVGElement>;
    protected loadImg(path: string): HTMLImageElement;
    protected updateColor(value?: Color): void;
    protected generateIcon(): void;
    private getLoader;
    private setupLoadedElement;
    private clear;
}

/**
 * @type {GradumRichElementProperties}
 * @group Components
 * @category GradumRichElement
 *
 * @description Properties object for configuring a Button. Extends GradumElementProperties.
 * @extends GradumProperties
 *
 * @property {string} [text] - The text to set to the rich element's main element.
 *
 * @property {Element | Element[]} [leftCustomElements] - Custom elements
 * to be placed on the left side of the button (before the left icon).
 * @property {string | GradumIcon} [leftIcon] - An icon to be placed on the left side of the button text. Can be a
 * string (icon name/path) or an Icon instance.
 * @property {string | GradumProperties<ElementTag> | ValidElement<ElementTag>} [buttonText] - The text content of the button.
 * @property {string | GradumIcon} [rightIcon] - An icon to be placed on the right side of the button text. Can be a
 * string (icon name/path) or an Icon instance.
 * @property {Element | Element[]} [rightCustomElements] - Custom elements
 * to be placed on the right side of the button (after the right icon).
 *
 * @property {ValidTag} [customTextTag] - The HTML tag to be used for the buttonText element (if the latter is passed as
 * a string). If not specified, the default text tag specified in the Button class will be used.
 * @property {boolean} [unsetDefaultClasses] - Set to true to not add the default classes specified in GradumConfig.Button
 * to this instance of Button.
 *
 * @template {ValidTag} ElementTag="p"
 */
type GradumRichElementProperties<ElementTag extends ValidTag = any, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    elementTag?: ElementTag;
    text?: string;
    leftCustomElements?: Element | Element[];
    leftIcon?: string | GradumIcon;
    prefixEntry?: string | HTMLElement;
    element?: string | GradumProperties<ElementTag> | ValidElement<ElementTag>;
    suffixEntry?: string | HTMLElement;
    rightIcon?: string | GradumIcon;
    rightCustomElements?: Element | Element[];
};

/**
 * @class GradumRichElement
 * @group Components
 * @category GradumRichElement
 *
 * @description Class for creating a rich gradum element (an element that is possibly accompanied by icons (or other elements) on
 * its left and/or right).
 * @extends GradumElement
 * @template {ValidTag} ElementTag - The tag of the main element to create the rich element from.
 */
declare class GradumRichElement<ElementTag extends ValidTag = any, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumRichElementProperties;
    static defaultProperties: GradumRichElementProperties;
    protected static customCreate(properties: GradumRichElementProperties): object;
    readonly childrenOrder: readonly ["leftCustomElements", "leftIcon", "prefixEntry", "element", "suffixEntry", "rightIcon", "rightCustomElements"];
    /**
     * @description Adds a given element or elements to the button at a specified position.
     * @param {Element | Element[] | null} element - The element(s) to add.
     * @param {this["childrenOrder"][number]} type - The type of child element being added.
     */
    private addAtPosition;
    /**
     * @description The tag of the text element in the button
     */
    elementTag: ElementTag;
    /**
     * @description The custom element(s) on the left. Can be set to new element(s) by a simple assignment.
     */
    set leftCustomElements(value: Element | Element[]);
    /**
     * @description The left icon element. Can be set with a new icon by a simple assignment (the name/path of the
     * icon, or a Gradum/HTML element).
     */
    set leftIcon(value: string | GradumIcon);
    get leftIcon(): GradumIcon;
    /**
     * @description The left icon element. Can be set with a new icon by a simple assignment (the name/path of the
     * icon, or a Gradum/HTML element).
     */
    set prefixEntry(value: string | HTMLElement);
    get prefixEntry(): HTMLElement;
    /**
     * @description The text element. Can be set to a new element by a simple assignment. Setting the value to a new
     * string will update the text's textContent with the given string.
     */
    set element(value: string | GradumProperties<ElementTag> | ValidElement<ElementTag>);
    get element(): ValidElement<ElementTag>;
    /**
     * @description The text element. Can be set to a new element by a simple assignment. Setting the value to a new
     * string will update the text's textContent with the given string.
     */
    get text(): string;
    set text(value: string);
    /**
     * @description The left icon element. Can be set with a new icon by a simple assignment (the name/path of the
     * icon, or a Gradum/HTML element).
     */
    set suffixEntry(value: string | HTMLElement);
    get suffixEntry(): HTMLElement;
    /**
     * @description The right icon element. Can be set with a new icon by a simple assignment (the name/path of the
     * icon, or a Gradum/HTML element).
     */
    set rightIcon(value: string | GradumIcon);
    get rightIcon(): GradumIcon;
    /**
     * @description The custom element(s) on the right. Can be set to new element(s) by a simple assignment.
     */
    set rightCustomElements(value: Element | Element[]);
}

/**
 * @class GradumButton
 * @group Components
 * @category GradumButton
 *
 * @description Button class for creating Gradum button elements.
 * @extends GradumElement
 */
declare class GradumButton<ElementTag extends ValidTag = any, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumRichElement<ElementTag, ViewType, DataType, ModelType, EmitterType> {
}

/**
 * @group Components
 * @category StatefulReifect
 * @description A function type that interpolates a value based on the index, total count, and the object.
 *
 * @template Type
 * @template ClassType
 * @param {number} index - The index of the object.
 * @param {number} total - The total number of objects.
 * @param {ClassType} object - The object being interpolated.
 * @returns {Type}
 */
type ReifectInterpolator<Type, ClassType extends object = Element> = (index: number, total: number, object: ClassType) => Type;
/**
 * @group Components
 * @category StatefulReifect
 * @description A function type that interpolates a value based on the state, index, total count, and the object.
 *
 * @template Type
 * @template State
 * @template ClassType
 * @param {State} state - The current state.
 * @param {number} index - The index of the object.
 * @param {number} total - The total number of objects.
 * @param {ClassType} object - The object being interpolated.
 * @returns {Type}
 */
type StateInterpolator<Type, State extends KeyType, ClassType extends object = Element> = (state: State, index: number, total: number, object: ClassType) => Type;
/**
 * @group Components
 * @category StatefulReifect
 * @description A type that represents a property specific to a state or an interpolated value.
 *
 * @template Type
 * @template ClassType
 */
type StateSpecificProperty<Type, ClassType extends object = Element> = Type | ReifectInterpolator<Type, ClassType>;
/**
 * @group Components
 * @category StatefulReifect
 * @description A configuration type for properties based on states or interpolated values.
 *
 * @template Type
 * @template State
 * @template ClassType
 */
type BasicPropertyConfig<Type, State extends KeyType> = PartialRecord<State, Type> | Type;
/**
 * @group Components
 * @category StatefulReifect
 * @description A configuration type for properties based on states or interpolated values.
 *
 * @template Type
 * @template State
 * @template ClassType
 */
type PropertyConfig<Type, State extends KeyType, ClassType extends object = Element> = PartialRecord<State, Type | ReifectInterpolator<Type, ClassType>> | Type | StateInterpolator<Type, State, ClassType>;
type ReifectOnSwitchCallback<State extends KeyType, ClassType extends object = Element> = (state: State, index: number, total: number, object: ClassType) => void;
/**
 * @group Components
 * @category StatefulReifect
 */
type ReifectObjectData<State extends KeyType, ClassType extends object = Element> = {
    object: WeakRef<ClassType>;
    enabled: ReifectEnabledObject;
    lastState?: State;
    resolvedValues?: ReifectObjectComputedProperties<State, ClassType>;
    index?: number;
    total?: number;
    onSwitch?: ReifectOnSwitchCallback<State, ClassType>;
    disposeEffect?: () => void;
};
/**
 * @group Components
 * @category StatefulReifect
 */
type ReifectObjectComputedProperties<State extends KeyType, ClassType extends object = Element> = {
    properties: PartialRecord<State, PartialRecord<keyof ClassType, any>>;
    styles: PartialRecord<State, StylesType>;
    classes: PartialRecord<State, string | string[]>;
    replaceWith: PartialRecord<State, ClassType>;
};
/**
 * @group Components
 * @category StatefulReifect
 */
type StatefulReifectCoreProperties<State extends KeyType, ClassType extends object = Element> = {
    styles?: PropertyConfig<StylesType, State, ClassType>;
    classes?: PropertyConfig<string | string[], State, ClassType>;
    replaceWith?: PropertyConfig<ClassType, State, ClassType>;
    [k: PropertyKey]: PropertyConfig<any, State, ClassType>;
};
/**
 * @group Components
 * @category StatefulReifect
 */
type StatefulReifectProperties<State extends KeyType, ClassType extends object = Element> = StatefulReifectCoreProperties<State, ClassType> & {
    states?: State[] | object;
    initialState?: State | boolean;
    attachedObjects?: ClassType[];
};
/**
 * @group Components
 * @category StatefulReifect
 */
type ReifectAppliedOptions<State extends KeyType = any, ClassType extends object = Element> = {
    attachObjects?: boolean;
    executeForAll?: boolean;
    recomputeIndices?: boolean;
    recomputeProperties?: boolean;
    applyStylesInstantly?: boolean;
    propertiesOverride?: StatefulReifectCoreProperties<State, ClassType>;
};
/**
 * @group Components
 * @category StatefulReifect
 */
type ReifectEnabledObject = {
    global?: boolean;
    properties?: boolean;
    styles?: boolean;
    classes?: boolean;
    replaceWith?: boolean;
};

/**
 * @class StatefulReifect
 * @group Components
 * @category StatefulReifect
 *
 * @description A class to manage and apply dynamic state-based properties, styles, classes, and transitions to a
 * set of objects.
 *
 * @template {string | number | symbol} State - The type of the reifier's states.
 * @template {object} ClassType - The object type this reifier will be applied to.
 */
declare class StatefulReifect<State extends string | number | symbol = any, ClassType extends object = object> {
    protected static readonly fields: readonly ["properties", "classes", "styles", "replaceWith"];
    protected static readonly knownFields: Set<string>;
    protected static readonly chainableStyleFields: Set<string>;
    protected readonly timeRegex: RegExp;
    protected readonly attachedObjectsData: WeakMap<ClassType, ReifectObjectData<State, ClassType>>;
    protected readonly attachedObjects: GradumNodeList<ClassType>;
    /**
     * @description All possible states.
     */
    get states(): State[];
    set states(states: State[] | object);
    set propertiesEnabled(value: boolean);
    set classesEnabled(value: boolean);
    set stylesEnabled(value: boolean);
    set replacedWithEnabled(value: boolean);
    set enabled(value: boolean);
    /**
     * @description The properties to be assigned to the objects. It could take:
     * - A record of `{key: value}` pairs.
     * - A record of `{state: {key: value} pairs or an interpolation function that would return a record of
     * {key: value} pairs}`.
     * - An interpolation function that would return a record of `{key: value}` pairs based on the state value.
     *
     * The interpolation function would take as arguments:
     * - `state: State`: the state being applied to the object(s). Only passed to the callback function if it is
     * defined for the whole field (and not for a specific state).
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     */
    set properties(value: PropertyConfig<PartialRecord<keyof ClassType, any>, State, ClassType>);
    get properties(): PartialRecord<State, ReifectInterpolator<PartialRecord<keyof ClassType, any>, ClassType>>;
    /**
     * @description The styles to be assigned to the objects (only if they are eligible elements). It could take:
     * - A record of `{CSS property: value}` pairs.
     * - A record of `{state: {CSS property: value} pairs or an interpolation function that would return a record of
     * {key: value} pairs}`.
     * - An interpolation function that would return a record of `{key: value}` pairs based on the state value.
     *
     * The interpolation function would take as arguments:
     * - `state: State`: the state being applied to the object(s). Only passed to the callback function if it is
     * defined for the whole field (and not for a specific state).
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     */
    set styles(value: PropertyConfig<StylesType, State, ClassType>);
    get styles(): PartialRecord<State, ReifectInterpolator<StylesType, ClassType>>;
    /**
     * @description The classes to be assigned to the objects (only if they are eligible elements). It could take:
     * - A string of space-separated classes.
     * - An array of classes.
     * - A record of `{state: space-separated class string, array of classes, or an interpolation function that would
     * return any of the latter}`.
     * - An interpolation function that would return a string of space-separated classes or an array of classes based
     * on the state value.
     *
     * The interpolation function would take as arguments:
     * - `state: State`: the state being applied to the object(s). Only passed to the callback function if it is
     * defined for the whole field (and not for a specific state).
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     */
    set classes(value: PropertyConfig<string | string[], State, ClassType>);
    get classes(): PartialRecord<State, ReifectInterpolator<string | string[], ClassType>>;
    /**
     * @description The object that should replace (in the DOM as well if eligible) the attached objects. It could take:
     * - The object to be replaced with.
     * - A record of `{state: object to be replaced with, or an interpolation function that would return an object
     * to be replaced with}`.
     * - An interpolation function that would return the object to be replaced with based on the state value.
     *
     * The interpolation function would take as arguments:
     * - `state: State`: the state being applied to the object(s). Only passed to the callback function if it is
     * defined for the whole field (and not for a specific state).
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     */
    set replaceWith(value: PropertyConfig<ClassType, State, ClassType>);
    get replaceWith(): PartialRecord<State, ReifectInterpolator<ClassType, ClassType>>;
    /**
     * @description Creates an instance of StatefulReifier.
     * @param {StatefulReifectProperties<State, ClassType>} properties - The configuration properties.
     */
    constructor(properties: StatefulReifectProperties<State, ClassType>);
    attach(object: ClassType): this;
    attach(object: ClassType, index: number): this;
    /**
     * @function attach
     * @description Attaches an object to the reifier.
     * @param {ClassType} object - The object to attach.
     * @param {ReifectOnSwitchCallback<State, ClassType>} [onSwitch] - Optional
     * callback fired when the reifier is applied to the object. The callback takes as parameters:
     * - `state: State`: The state being applied to the object.
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     * @param {number} [index] - Optional index to specify the position at which to insert the object in the reifier's
     * attached list.
     * @returns {this} - The reifier itself, for method chaining.
     */
    attach(object: ClassType, onSwitch: ReifectOnSwitchCallback<State, ClassType>, index?: number): this;
    attach(...objects: ClassType[]): this;
    attach(...objectsAndIndex: [...ClassType[], number]): this;
    attach(...objectsAndOnSwitch: [...ClassType[], ReifectOnSwitchCallback<State, ClassType>]): this;
    attach(...objectsAndOptions: [...ClassType[], ReifectOnSwitchCallback<State, ClassType>, number]): this;
    detach(object: ClassType): this;
    /**
     * @function detach
     * @description Detaches one or more objects from the reifier.
     * @param {...ClassType[]} objects - The objects to detach.
     * @returns {this} - The reifier itself, for method chaining.
     */
    detach(...objects: ClassType[]): this;
    /**
     * @protected
     * @function attachObject
     * @description Function used to generate a data entry for the given object, and add it to the attached list at
     * the provided index (if any).
     * @param {ClassType} object - The object to attach
     * @param {number} [index] - Optional index to specify the position at which to insert the object in the reifier's
     * attached list.
     * @param {ReifectOnSwitchCallback<State, ClassType>} [onSwitch] - Optional
     * callback fired when the reifier is applied to the object. The callback takes as parameters:
     * - `state: State`: The state being applied to the object.
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     * @returns {ReifectObjectData<State, ClassType>} - The created data entry.
     */
    protected attachObject(object: ClassType, onSwitch?: ReifectOnSwitchCallback<State, ClassType>, index?: number): ReifectObjectData<State, ClassType>;
    /**
     * @protected
     * @function detachObject
     * @description Function used to remove a data entry from the attached objects list.
     * @param object
     */
    protected detachObject(object: ClassType): void;
    /**
     * @function getData
     * @description Retrieve the data entry of a given object.
     * @param {ClassType} object - The object to find the data of.
     * @returns {ReifectObjectData<State, ClassType>} - The corresponding data, or `null` if was not found.
     */
    getData(object: ClassType): ReifectObjectData<State, ClassType>;
    /**
     * @function getObject
     * @description Retrieves the object attached to the given data entry.
     * @param {ReifectObjectData<State, ClassType>} data - The data entry to get the corresponding object of.
     * @returns {ClassType} The corresponding object, or `null` if was garbage collected.
     */
    getObject(data: ReifectObjectData<State, ClassType>): ClassType;
    /**
     * @function stateOf
     * @description Determine the current state of the reifect on the provided object.
     * @param {ClassType} object - The object to determine the state for.
     * @returns {State | undefined} - The current state of the reifect or undefined if not determinable.
     */
    stateOf(object: ClassType): State;
    /**
     * @protected
     * @function parseState
     * @description Parses a boolean into the corresponding state value.
     * @param {State | boolean} value - The value to parse.
     * @returns {State} The parsed value, or `null` if the boolean could not be parsed.
     */
    protected parseState(value: State | boolean): State;
    /**
     * @function getObjectEnabledState
     * @description Returns the `enabled` value corresponding to the provided object for this reifier.
     * @param {ClassType} object - The object to get the state of.
     * @returns {ReifectEnabledObject} - The corresponding enabled state.
     */
    getObjectEnabledState(object: ClassType): ReifectEnabledObject;
    initialize(state: State | boolean, objects?: ClassType | ClassType[], options?: ReifectAppliedOptions<State, ClassType>): this;
    apply(state: State | boolean, objects?: ClassType | ClassType[], options?: ReifectAppliedOptions<State, ClassType>): this;
    toggle(objects?: ClassType | ClassType[], options?: ReifectAppliedOptions<State, ClassType>): this;
    unapply(objects?: ClassType | ClassType[], options?: ReifectAppliedOptions<State, ClassType>): this;
    /**
     * @function reloadFor
     * @description Generates the transition CSS string for the provided transition with the correct interpolation
     * information.
     * @param {ClassType} object - The element to apply the string to.
     * @returns {this} Itself for method chaining.
     */
    reloadFor(object: ClassType): this;
    getEnabledObjects(objects?: ClassType | ClassType[], options?: ReifectAppliedOptions<State, ClassType>): ClassType[];
    applyAll(object: ClassType, applyStylesInstantly?: boolean): void;
    unapplyAll(object: ClassType, applyStylesInstantly?: boolean): void;
    refreshAll(): void;
    applyProperties(object: ClassType, state?: State): void;
    unapplyProperties(object: ClassType): void;
    refreshProperties(): void;
    applyReplaceWith(object: ClassType, state?: State): void;
    unapplyReplaceWith(object: ClassType): void;
    refreshReplaceWith(): void;
    applyClasses(object: ClassType, state?: State): void;
    unapplyClasses(object: ClassType): void;
    refreshClasses(): void;
    applyStyles(object: ClassType, state?: State, applyStylesInstantly?: boolean): void;
    unapplyStyles(object: ClassType, applyStylesInstantly?: boolean): void;
    refreshStyles(): void;
    getChainableStyles(object: ClassType): Partial<Record<string, string>>;
    protected applyField(object: ClassType, field: string, callback: (object: ClassType, data: ReifectObjectData<State, ClassType>, state: State) => void, state?: State): void;
    protected parseStylesValue(styles: StylesType): PartialRecord<string, string>;
    protected filterEnabledObjects(data: ReifectObjectData<State, ClassType>): boolean;
    protected processRawProperties(object: ClassType, override?: StatefulReifectCoreProperties<State, ClassType>): void;
    private generateNewData;
    private initializeOptions;
    /**
     * @description Clone the reifect to create a new copy with the same properties but no attached objects.
     * @returns {StatefulReifect<State, ClassType>} - The new reifect.
     */
    clone(): StatefulReifect<State, ClassType>;
    protected normalizeStates(states: State[] | object): State[];
    protected normalizePropertyConfig<Type>(currentConfig: PartialRecord<State, ReifectInterpolator<Type, ClassType>>, newConfig: PropertyConfig<Type, State, ClassType>): PartialRecord<State, ReifectInterpolator<Type, ClassType>>;
}

/**
 * @group Types
 * @category Enums
 */
declare enum Direction {
    vertical = "vertical",
    horizontal = "horizontal"
}
/**
 * @group Types
 * @category Enums
 */
declare enum SideH {
    left = "left",
    right = "right"
}
/**
 * @group Types
 * @category Enums
 */
declare enum SideV {
    top = "top",
    bottom = "bottom"
}
/**
 * @group Types
 * @category Enums
 */
declare enum Side {
    top = "top",
    bottom = "bottom",
    left = "left",
    right = "right"
}
/**
 * @group Types
 * @category Enums
 */
declare enum InOut {
    in = "in",
    out = "out"
}
/**
 * @group Types
 * @category Enums
 */
declare enum OnOff {
    on = "on",
    off = "off"
}
/**
 * @group Types
 * @category Enums
 */
declare enum Open {
    open = "open",
    closed = "closed"
}
/**
 * @group Types
 * @category Enums
 */
declare enum Shown {
    visible = "visible",
    hidden = "hidden"
}
/**
 * @group Types
 * @category Enums
 */
declare enum AccessLevel {
    public = "public",
    protected = "protected",
    private = "private"
}
/**
 * @group Types
 * @category Enums
 */
declare enum Range {
    min = "min",
    max = "max"
}
/**
 * @group Types
 * @category Enums
 */
declare enum Anchor {
    TopLeft = "topLeft",
    TopRight = "topRight",
    TopMiddle = "topMiddle",
    BottomLeft = "bottomLeft",
    BottomMiddle = "bottomMiddle",
    BottomRight = "bottomRight",
    Center = "center",
    CenterLeft = "centerLeft",
    CenterRight = "centerRight"
}

/**
 * @group Components
 * @category GradumIconSwitch
 */
type GradumIconSwitchProperties<State extends string | number | symbol, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumIconProperties<ViewType, DataType, ModelType, EmitterType> & {
    switchReifect?: StatefulReifect<State, GradumIcon> | StatefulReifectProperties<State, GradumIcon>;
    defaultState?: State;
    appendStateToIconName?: boolean;
};

/**
 * @group Components
 * @category GradumIconSwitch
 */
declare class GradumIconSwitch<State extends string | number | symbol = OnOff, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumIcon<ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumIconSwitchProperties<any>;
    get switchReifect(): StatefulReifect<State, GradumIcon>;
    set switchReifect(value: StatefulReifect<State, GradumIcon> | StatefulReifectProperties<State, GradumIcon>);
    set defaultState(value: State);
    set appendStateToIconName(value: boolean);
    initialize(): void;
}

/**
 * @group Components
 * @category GradumIconToggle
 */
type GradumIconToggleProperties<ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumIconProperties<ViewType, DataType, ModelType, EmitterType> & {
    toggled?: boolean;
    toggleOnClick?: boolean;
    stopPropagationOnClick?: boolean;
    onToggle?: (value: boolean, el: GradumIconToggle) => void;
};

/**
 * @group Components
 * @category GradumIconToggle
 */
declare class GradumIconToggle<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumIcon<ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumIconToggleProperties;
    stopPropagationOnClick: boolean;
    onToggle: (value: boolean, el: GradumIconToggle) => void;
    private clickListener;
    set toggled(value: boolean);
    set toggleOnClick(value: boolean);
    toggle(): void;
}

/**
 * @group Components
 * @category GradumInput
 */
type GradumInputProperties<InputTag extends "input" | "textarea" = "input", ValueType = string, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = Omit<GradumRichElementProperties<InputTag, ViewType, DataType, ModelType, EmitterType>, "element" | "elementTag"> & {
    inputTag?: InputTag;
    input?: GradumProperties<InputTag> | ValidElement<InputTag>;
    label?: string;
    locked?: boolean;
    dynamicVerticalResize?: boolean;
    inputRegexCheck?: RegExp | string;
    blurRegexCheck?: RegExp | string;
    selectTextOnFocus?: boolean;
    value?: ValueType;
    type?: string;
    placeholder?: string;
    pattern?: string;
    size?: string;
};
/**
 * @group Components
 * @category GradumLabelElement
 */
type GradumLabelElementProperties<ElementTag extends ValidTag = any, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumRichElementProperties<ElementTag, ViewType, DataType, ModelType, EmitterType> & {
    label?: string;
    locked?: boolean;
};

declare class GradumLabelElement<ElementTag extends ValidTag = any, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumRichElement<ElementTag, ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumLabelElementProperties<ElementTag, ViewType, DataType, ModelType, EmitterType>;
    defaultId: string;
    protected labelElement: HTMLLabelElement;
    content: HTMLElement;
    set label(value: string);
    get label(): string;
    get element(): ValidElement<ElementTag>;
    set element(value: GradumProperties<ElementTag> | ValidElement<ElementTag>);
    protected setupUIElements(): void;
    protected setupUILayout(): void;
    private updateId;
}

/**
 * @group Components
 * @category GradumInput
 */
declare class GradumInput<InputTag extends "input" | "textarea" = "input", ValueType = string, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumLabelElement<InputTag, ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumInputProperties<InputTag, ValueType, ViewType, DataType, ModelType, EmitterType>;
    static defaultProperties: GradumInputProperties;
    protected static customCreate(properties: GradumInputProperties): object;
    locked: boolean;
    selectTextOnFocus: boolean;
    dynamicVerticalResize: boolean;
    inputRegexCheck: RegExp | string;
    blurRegexCheck: RegExp | string;
    private lastValidForInput;
    private lastValidForBlur;
    readonly onFocus: Delegate<() => void>;
    readonly onBlur: Delegate<() => void>;
    readonly onInput: Delegate<() => void>;
    get input(): ValidElement<InputTag>;
    set input(value: GradumProperties<InputTag> | ValidElement<InputTag>);
    get element(): ValidElement<InputTag>;
    set element(value: GradumProperties<InputTag> | ValidElement<InputTag>);
    accessor type: string;
    accessor placeholder: string;
    accessor pattern: string;
    accessor size: string;
    protected setupChangedCallbacks(): void;
    protected setupUIListeners(): void;
    get value(): ValueType;
    set value(value: ValueType);
    get rawValue(): string;
    set rawValue(value: string);
    setValueSilently(value: ValueType): void;
    protected processInputValue(value?: string): void;
    private sanitizeByRegex;
}

/**
 * @group Components
 * @category GradumNumericalInput
 */
type GradumNumericalInputProperties<ValueType = string, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumInputProperties<"input", ValueType, ViewType, DataType, ModelType, EmitterType> & {
    multiplier?: number;
    decimalPlaces?: number;
    min?: number;
    max?: number;
};

/**
 * @group Components
 * @category GradumNumericalInput
 */
declare class GradumNumericalInput<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumInput<"input", number, ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumNumericalInputProperties<number, ViewType, DataType, ModelType, EmitterType>;
    static defaultProperties: GradumNumericalInputProperties;
    multiplier: number;
    decimalPlaces: number;
    min: number;
    max: number;
    get value(): number;
    set value(value: string | number);
}

type EntryData = {
    enabled?: boolean;
    selected?: boolean;
};
/**
 * @group Components
 * @category GradumSelect
 */
type GradumSelectProperties<ValueType = string, SecondaryValueType = string, EntryType extends object = HTMLElement> = {
    entriesClasses?: string | string[];
    selectedEntriesClasses?: string | string[];
    entries?: HTMLCollection | NodeList | EntryType[];
    values?: (ValueType | EntryType)[];
    selectedValues?: ValueType[];
    getValue?: (entry: EntryType) => ValueType;
    getSecondaryValue?: (entry: EntryType) => SecondaryValueType;
    createEntry?: (value: ValueType) => EntryType;
    onEntryAdded?: (entry: EntryType, index: number) => void;
    onEntryRemoved?: (entry: EntryType) => void;
    onEntryClicked?: (entry: EntryType, e: Event) => void;
    multiSelection?: boolean;
    forceSelection?: boolean;
    inputName?: string;
    parent?: Element;
    onSelect?: (b: boolean, entry: EntryType, index: number) => void;
    onEnabled?: (b: boolean, entry: EntryType, index: number) => void;
};
/**
 * @group Components
 * @category GradumSelect
 */
type GradumSelectInputEventProperties<ValueType = string, SecondaryValueType = string, EntryType extends object = HTMLElement> = GradumRawEventProperties & {
    toggledEntry: EntryType;
    values: ValueType[];
};

/**
 * @class GradumSelect
 * @group Components
 * @category GradumSelect
 *
 * @description Base class for creating a selection menu

 * @extends GradumElement
 */
declare class GradumSelect<ValueType = string, SecondaryValueType = string, EntryType extends object = HTMLElement> extends GradumBaseElement {
    readonly properties: GradumSelectProperties<ValueType, SecondaryValueType, EntryType>;
    static defaultProperties: GradumSelectProperties;
    private _inputField;
    private _entries;
    private readonly _entriesData;
    private parentObserver;
    private readonly _onSelect;
    get onSelect(): Delegate<(b: boolean, entry: EntryType, index: number) => void>;
    set onSelect(value: (b: boolean, entry: EntryType, index: number) => void);
    private readonly _onEnabled;
    get onEnabled(): Delegate<(b: boolean, entry: EntryType, index: number) => void>;
    set onEnabled(value: (b: boolean, entry: EntryType, index: number) => void);
    private readonly _onEntryAdded;
    get onEntryAdded(): Delegate<(entry: EntryType, index: number) => void>;
    set onEntryAdded(value: (entry: EntryType, index: number) => void);
    private readonly _onEntryRemoved;
    get onEntryRemoved(): Delegate<(entry: EntryType) => void>;
    set onEntryRemoved(value: (entry: EntryType) => void);
    private readonly _onEntryClicked;
    get onEntryClicked(): Delegate<(entry: EntryType, e: Event) => void>;
    set onEntryClicked(value: (entry: EntryType, e: Event) => void);
    /**
     * The dropdown's entries.
     */
    get entries(): EntryType[];
    set entries(value: HTMLCollection | NodeList | EntryType[]);
    /**
     * @description The dropdown's values. Setting it will update the dropdown accordingly.
     */
    get values(): ValueType[];
    set values(values: ValueType[]);
    get selectedEntries(): EntryType[];
    set selectedEntries(value: EntryType[]);
    set parent(value: Element);
    getValue: (entry: EntryType) => ValueType;
    getSecondaryValue: (entry: EntryType) => SecondaryValueType;
    createEntry: (value: ValueType) => EntryType;
    /**
     * The dropdown's underlying hidden input. Might be undefined.
     */
    get inputName(): string;
    set inputName(value: string);
    get inputField(): HTMLInputElement;
    set multiSelection(value: boolean);
    forceSelection: boolean;
    selectedEntriesClasses: string | string[];
    entriesClasses: string | string[];
    protected static customCreate(properties: GradumSelectProperties): object;
    /**
     * @description Dropdown constructor
     */
    constructor();
    protected getEntryData(entry: EntryType): EntryData;
    protected clearEntryData(entry: EntryType): void;
    addEntry(entry: EntryType, index?: number): void;
    removeEntry(value: ValueType | EntryType): this;
    getEntryFromSecondaryValue(value: SecondaryValueType): EntryType;
    isSelected(entry: EntryType): boolean;
    protected getEntry(value: EntryType | ValueType): EntryType;
    /**
     * @description Select an entry.
     * @param {string | EntryType} value - The DropdownEntry (or its string value) to select.
     * @param selected
     * @return {GradumSelect} - This Dropdown for chaining.
     */
    select(value: ValueType | EntryType, selected?: boolean): this;
    /**
     * @description Select an entry.
     * @param {number} index - The index of the entry to select
     * @param {(index: number, entriesCount: number, zero?: number) => number} [preprocess=trim] - Callback to execute
     * on the index to preprocess it. Defaults to trim().
     * @return {GradumSelect} - This Dropdown for chaining.
     */
    selectByIndex(index: number, preprocess?: (index: number, entriesCount: number, zero?: number) => number): this;
    getIndex(entry: EntryType): number;
    deselectAll(): void;
    reset(): void;
    get enabledEntries(): EntryType[];
    get enabledValues(): ValueType[];
    get enabledSecondaryValues(): SecondaryValueType[];
    find(value: ValueType): EntryType;
    findBySecondaryValue(value: SecondaryValueType): EntryType;
    findAll(...values: ValueType[]): EntryType[];
    findAllBySecondaryValue(...values: SecondaryValueType[]): EntryType[];
    enable(b: boolean, ...entries: (ValueType | EntryType)[]): void;
    /**
     * @description The dropdown's currently selected entries
     */
    get selectedEntry(): EntryType;
    get selectedIndex(): number;
    set selectedIndex(value: number);
    get selectedIndices(): number[];
    set selectedValues(values: ValueType[]);
    /**
     * @description The dropdown's currently selected values
     */
    get selectedValues(): ValueType[];
    get selectedValue(): ValueType;
    get selectedSecondaryValues(): SecondaryValueType[];
    get selectedSecondaryValue(): SecondaryValueType;
    get stringSelectedValue(): string;
    clear(disableObserver?: boolean): void;
    refreshInputField(): void;
    destroy(): this;
    protected enableObserver(value: boolean): void;
    protected initializeSelection(): void;
    protected setupParentObserver(): void;
}

/**
 * @group Event Handling
 * @category GradumEvents
 */
declare class GradumSelectInputEvent<ValueType = string, SecondaryValueType = string, EntryType extends object = HTMLElement> extends GradumEvent {
    readonly toggledEntry: EntryType;
    readonly values: ValueType[];
    constructor(properties: GradumSelectInputEventProperties<ValueType, SecondaryValueType, EntryType>);
}

/**
 * @type {GradumSelectElementProperties}
 * @group Components
 * @category GradumDropdown
 *
 * @description Properties for configuring a Dropdown.
 * @extends GradumProperties
 *
 * @property {string | string[]} [entriesClasses] - CSS class(es) for dropdown entries.
 * @property {string | string[]} [selectedEntriesClasses] - CSS class(es) for selected entries.
 */
type GradumSelectElementProperties<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel<DataType>, EmitterType extends GradumEmitter = GradumEmitter> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & GradumSelectProperties<ValueType, SecondaryValueType, EntryType> & {
    entriesClasses?: string | string[];
    selectedEntriesClasses?: string | string[];
};
/**
 * @group Components
 * @category Reifect
 *
 * @description A configuration type for properties based on states or interpolated values.
 *
 * @template Type
 * @template State
 * @template ClassType
 */
type StatelessPropertyConfig<Type, ClassType extends object = Element> = Type | ReifectInterpolator<Type, ClassType>;
/**
 * @group Components
 * @category Reifect
 */
type StatelessReifectCoreProperties<ClassType extends object = Element> = {
    styles?: StatelessPropertyConfig<StylesType, ClassType>;
    classes?: StatelessPropertyConfig<string | string[], ClassType>;
    replaceWith?: StatelessPropertyConfig<ClassType, ClassType>;
    [k: PropertyKey]: StatelessPropertyConfig<any, ClassType>;
};
/**
 * @group Components
 * @category Reifect
 */
type StatelessReifectProperties<ClassType extends object = Element> = StatelessReifectCoreProperties<ClassType> & {
    attachedObjects?: ClassType[];
};

/**
 * @class Reifect
 * @group Components
 * @category Reifect
 *
 * @description A class to manage and apply dynamic properties, styles, classes, and transitions to a
 * set of objects.
 *
 * @template {object} ClassType - The object type this reifier will be applied to.
 */
declare class Reifect<ClassType extends object = Node> extends StatefulReifect<"default", ClassType> {
    /**
     * @description Creates an instance of StatefulReifier.
     * @param {StatelessReifectProperties<ClassType>} properties - The configuration properties.
     */
    constructor(properties: StatelessReifectProperties<ClassType>);
    /**
     * @description The properties to be assigned to the objects. It could take:
     * - A record of `{key: value}` pairs.
     * - An interpolation function that would return a record of `{key: value}` pairs.
     *
     * The interpolation function would take as arguments:
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     */
    get properties(): StatelessPropertyConfig<PartialRecord<keyof ClassType, any>, ClassType>;
    set properties(value: StatelessPropertyConfig<PartialRecord<keyof ClassType, any>, ClassType>);
    /**
     * @description The styles to be assigned to the objects (only if they are eligible elements). It could take:
     * - A record of `{CSS property: value}` pairs.
     * - An interpolation function that would return a record of `{key: value}` pairs.
     *
     * The interpolation function would take as arguments:
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     */
    get styles(): StatelessPropertyConfig<StylesType, ClassType>;
    set styles(value: StatelessPropertyConfig<StylesType, ClassType>);
    /**
     * @description The classes to be assigned to the objects (only if they are eligible elements). It could take:
     * - A string of space-separated classes.
     * - An array of classes.
     * - An interpolation function that would return a string of space-separated classes or an array of classes.
     *
     * The interpolation function would take as arguments:
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     */
    get classes(): StatelessPropertyConfig<string | string[], ClassType>;
    set classes(value: StatelessPropertyConfig<string | string[], ClassType>);
    /**
     * @description The object that should replace (in the DOM as well if eligible) the attached objects. It could take:
     * - The object to be replaced with.
     * - An interpolation function that would return the object to be replaced with.
     *
     * The interpolation function would take as arguments:
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     */
    get replaceWith(): StatelessPropertyConfig<ClassType, ClassType>;
    set replaceWith(value: StatelessPropertyConfig<ClassType, ClassType>);
    initialize(objects?: ClassType | ClassType[], options?: ReifectAppliedOptions<"default", ClassType>): void;
    apply(objects?: ClassType[] | ClassType, options?: ReifectAppliedOptions<"default", ClassType>): void;
    protected normalizePropertyConfig<Type>(currentConfig: any, newConfig: any): any;
}

/**
 * @class GradumSelectElement
 * @group Components
 * @category GradumSelectElement
 *
 * @description Select element class for creating Gradum button elements.
 * @extends GradumElement
 */
declare class GradumSelectElement<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumSelectElementProperties;
    static defaultProperties: GradumSelectElementProperties;
    protected _sizeTransitionTimeout: ReturnType<typeof setTimeout>;
    readonly select: GradumSelect<ValueType, SecondaryValueType, EntryType>;
    entriesTag: ValidTag;
    get entries(): EntryType[];
    set entries(value: HTMLCollection | NodeList | EntryType[]);
    values: ValueType[];
    accessor selectedEntries: EntryType[];
    accessor selectedEntry: EntryType;
    accessor selectedIndex: number;
    accessor selectedIndices: number[];
    entriesClasses: string | string[];
    selectedEntriesClasses: string | string[];
    accessor inputName: string;
    accessor inputField: HTMLInputElement;
    accessor multiSelection: boolean;
    accessor forceSelection: boolean;
    accessor enabledEntries: EntryType[];
    accessor enabledValues: ValueType[];
    accessor enabledSecondaryValues: SecondaryValueType[];
    accessor selectedValue: ValueType;
    accessor selectedValues: ValueType[];
    accessor selectedSecondaryValues: SecondaryValueType[];
    accessor selectedSecondaryValue: SecondaryValueType;
    accessor stringSelectedValue: string;
    initialize(): void;
    private _transitionDuration;
    get transitionDuration(): number;
    /**
     * @description Duration of the container size transition in seconds. Kept in sync with
     * `switchTransitionReifect` — set this to change both at once.
     */
    set transitionDuration(value: number);
    set transitionReifect(value: Reifect | StatelessReifectProperties);
    get transitionReifect(): Reifect;
    /**
     * @description Animates the container from its current size to the selected entry's natural
     * size. Subclasses should call `super.applyTransition()` then add their own entry-level logic.
     *
     * The sequence:
     * 1. Freeze container at current px size (gives CSS transition a `from` value)
     * 2. Call `beforeResize()` — subclass hook to prepare entries before the frame
     * 3. Next frame: read selected entry's natural size, animate container to it
     * 4. After `transitionDuration`ms: release explicit container size
     */
    protected applyTransition(): void;
    /**
     * @description Called synchronously inside `applyTransition`, before the rAF that reads the
     * selected entry's new size. Use this to reposition/reflow entries so the size read is correct.
     * @param selectedEntry - The newly selected entry.
     */
    protected beforeResize(selectedEntry: EntryType): void;
    /**
     * @description Called after the container size transition completes.
     * @param selectedEntry - The selected entry.
     */
    protected afterResize(selectedEntry: EntryType): void;
}

declare enum ContentSwitchMode {
    fadeLeft = "fadeLeft",
    fadeRight = "fadeRight",
    carousel = "carousel"
}
type GradumContentSwitchProperties<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    mode?: ContentSwitchMode;
    transitionDuration?: number;
    transitionReifect?: StatefulReifect<Shown> | StatefulReifectProperties<Shown>;
};

declare class GradumContentSwitch<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumSelectElement<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType> {
    static defaultProperties: {
        transitionDuration: number;
    };
    readonly properties: GradumContentSwitchProperties<ViewType, DataType, ModelType, EmitterType>;
    set mode(value: ContentSwitchMode);
    set entryTransitionReifect(value: Reifect | StatelessReifectProperties);
    get entryTransitionReifect(): Reifect;
    set movementReifect(value: Reifect | StatelessReifectProperties);
    get movementReifect(): Reifect;
    set transitionDuration(value: number);
    initialize(): void;
    protected setupEntry(entry: EntryType): void;
    private freezeAndHide;
    private reloadMovementReifect;
    protected beforeResize(selectedEntry: EntryType): void;
}

/**
 * @group Components
 * @category GradumDrawer
 */
type GradumDrawerProperties<ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    side?: Side;
    offset?: number | PartialRecord<Open, number>;
    hideOverflow?: boolean;
    panel?: GradumProperties | HTMLElement;
    thumb?: GradumProperties | HTMLElement;
    icon?: string | Element | GradumIconSwitchProperties<Side> | GradumIconSwitch<Side>;
    attachSideToIconName?: boolean;
    rotateIconBasedOnSide?: boolean;
    open?: boolean;
    transition?: Reifect<HTMLElement>;
};

/**
 * @group Components
 * @category GradumDrawer
 */
declare class GradumDrawer<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EMitterType extends GradumEmitter = GradumEmitter> extends GradumElement<ViewType, DataType, ModelType, EMitterType> {
    readonly properties: GradumDrawerProperties;
    private _panelContainer;
    get panelContainer(): HTMLElement;
    private dragging;
    protected resizeObserver: ResizeObserver;
    set thumb(value: GradumProperties | HTMLElement);
    get thumb(): HTMLElement;
    set panel(value: GradumProperties | HTMLElement);
    get panel(): HTMLElement;
    set icon(_value: string | Element | GradumIconSwitchProperties<Side> | GradumIconSwitch<Side>);
    get icon(): GradumIconSwitch<Side> | Element;
    set hideOverflow(value: boolean);
    set attachSideToIconName(value: boolean);
    set rotateIconBasedOnSide(value: boolean);
    set side(value: Side);
    set offset(value: number | PartialRecord<Open, number>);
    get offset(): PartialRecord<Open, number>;
    get isVertical(): boolean;
    set open(value: boolean);
    private set translation(value);
    transition: Reifect;
    get translation(): number;
    initialize(): void;
    protected setupUIElements(): void;
    protected setupUILayout(): void;
    protected setupUIListeners(): void;
    getOppositeSide(side?: Side): Side;
    getAdjacentSide(side?: Side): Side;
    refresh(): void;
    protected enableTransition(b: boolean): void;
    protected setupResizeObserver(): void;
}
/**
 * @group Components
 * @category GradumDrawer
 */
declare function drawer<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter>(properties: GradumDrawerProperties<ViewType, DataType, ModelType, EmitterType>): GradumDrawer<ViewType, DataType, ModelType, EmitterType>;

/**
 * @group Components
 * @category GradumPopup
 */
type GradumPopupProperties<ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    anchor?: Element;
    popupPosition?: Coordinate;
    anchorPosition?: Coordinate;
    fallbackModes?: PopupFallbackMode | Coordinate<PopupFallbackMode>;
    viewportMargin?: number | Coordinate;
    offsetFromAnchor?: number | Coordinate;
};
/**
 * @group Components
 * @category GradumPopup
 */
declare enum PopupFallbackMode {
    invert = "invert",
    offset = "offset",
    none = "none"
}

/**
 * @group Components
 * @category GradumPopup
 */
declare class GradumPopup<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumPopupProperties;
    static defaultProperties: GradumPopupProperties;
    protected static parentElement: HTMLElement;
    anchor: Element;
    set popupPosition(value: Coordinate);
    get popupPosition(): Point;
    set anchorPosition(value: Coordinate);
    get anchorPosition(): Point;
    set viewportMargin(value: Coordinate | number);
    get viewportMargin(): Point;
    set offsetFromAnchor(value: Coordinate | number);
    get offsetFromAnchor(): Point;
    set fallbackModes(value: PopupFallbackMode | Coordinate<PopupFallbackMode>);
    get fallbackModes(): Coordinate<PopupFallbackMode>;
    protected get rect(): DOMRect;
    protected get anchorRect(): DOMRect;
    protected get computedStyle(): CSSStyleDeclaration;
    protected get anchorComputedStyle(): CSSStyleDeclaration;
    protected get computedMargins(): Coordinate;
    initialize(): void;
    protected setupUIListeners(): void;
    private recomputePosition;
    private computeAxis;
    show(b: boolean): this;
}

/**
 * @class AnchorPoint
 * @group Components
 * @category AnchorPoint
 */
declare class AnchorPoint {
    constructor(anchor?: Point | Anchor);
    set value(value: Point | Anchor);
    get value(): Point;
    get enum(): Anchor;
    static pointToEnum(value: Point): Anchor;
    static enumToPoint(value: Anchor): Point;
}

/**
 * @type ScopedKey
 * @group Components
 * @category GradumNestedMap
 *
 * @template KeyType - The per-item key type.
 * @template BlockKeyType - The block-grouping key type.
 *
 * @description Pair containing a `blockKey` and an item `key`.
 */
type ScopedKey<KeyType = any, BlockKeyType = any> = {
    blockKey?: BlockKeyType;
    key?: KeyType;
};
/**
 * @group Components
 * @category GradumNestedStore
 */
type BlockStoreType<Type extends "array" | "map" = "map", BlockType extends object = object> = Type extends "map" ? Map<string, BlockType> : BlockType[];

/**
 * @type GradumRectProperties
 * @group Components
 * @category GradumRect
 */
type GradumRectProperties = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    angleRad?: number;
    angleDeg?: number;
    anchor?: Point | Anchor | AnchorPoint;
};

/**
 * @class GradumRect
 * @group Components
 * @category GradumRect
 */
declare class GradumRect extends DOMRect {
    angleRad: number;
    anchor: AnchorPoint;
    constructor(properties?: GradumRectProperties);
    static fromSegment(a: Point, b: Point, thickness?: number, properties?: GradumRectProperties): GradumRect;
    static fromDOMRect(rect: DOMRect, properties?: GradumRectProperties): GradumRect;
    render(): HTMLElement;
    get angleDeg(): number;
    set angleDeg(value: number);
    get center(): Point;
    get xAxis(): Point;
    get yAxis(): Point;
    get half(): Point;
    /** Corners in world/screen coords (clockwise) */
    get points(): [Point, Point, Point, Point];
    /** Closest point on (or inside) this rotated rect to p */
    closestPoint(point: Point): Point;
    closestPoint(point1: Point, point2: Point): Point;
    closestPoint(rect: DOMRect): Point;
    distanceTo(point: Point): number;
    distanceTo(point1: Point, point2: Point): number;
    distanceTo(rect: DOMRect): number;
    overlaps(other: DOMRect): boolean;
    overlaps(point: Point): boolean;
    overlaps(a: Point, b: Point): boolean;
}

/**
 * @type {GradumDropdownProperties}
 * @group Components
 * @category GradumDropdown
 *
 * @description Properties for configuring a Dropdown.
 * @extends GradumProperties
 *
 * @property {(string | HTMLElement)} [selector] - Element or descriptor used as the dropdown selector. If a
 * string is passed, a Button with the given string as text will be assigned as the selector.
 * @property {HTMLElement} [popup] - The element used as a container for the dropdown entries.
 *
 * @property {boolean} [multiSelection=false] - Enables selection of multiple dropdown entries.
 *
 * @property {ValidTag} [selectorTag] - Custom HTML tag for the selector's text. Overrides the
 * default tag set in GradumConfig.Dropdown.
 *
 * @property {string | string[]} [selectorClasses] - Custom CSS class(es) for the selector. Overrides the default
 * classes set in GradumConfig.Dropdown.
 * @property {string | string[]} [popupClasses] - Custom CSS class(es) for the popup container. Overrides the
 * default classes set in GradumConfig.Dropdown.
 */
type GradumDropdownProperties<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel<DataType>, EmitterType extends GradumEmitter = GradumEmitter> = GradumSelectElementProperties<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType> & {
    selector?: string | HTMLElement;
    popup?: HTMLElement;
    selectorTag?: HTMLTag;
    selectorClasses?: string | string[];
    popupClasses?: string | string[];
};

/**
 * @class GradumDropdown
 * @group Components
 * @category GradumDropdown
 *
 * @description Dropdown class for creating Gradum button elements.
 * @extends GradumElement
 */
declare class GradumDropdown<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumSelectElement<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumDropdownProperties;
    static defaultProperties: GradumDropdownProperties;
    readonly select: GradumSelect<ValueType, SecondaryValueType, EntryType>;
    private popupOpen;
    selectorTag: HTMLTag;
    selectorClasses: string | string[];
    popupClasses: string | string[];
    /**
     * The dropdown's selector element.
     */
    set selector(value: string | HTMLElement);
    get selector(): HTMLElement;
    /**
     * The dropdown's popup element.
     */
    set popup(value: HTMLElement);
    initialize(): void;
    private openPopup;
}

/**
 * @group Components
 * @category GradumMarkingMenu
 */
type GradumMarkingMenuProperties<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel> = GradumElementProperties<ViewType, DataType, ModelType> & {
    transition?: StatefulReifect<InOut> | StatefulReifectProperties<InOut>;
    startAngle?: number;
    endAngle?: number;
    semiMajor?: number;
    semiMinor?: number;
    minDragDistance?: number;
};

/**
 * @group Components
 * @category GradumMarkingMenu
 */
declare class GradumMarkingMenu<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel> extends GradumElement<ViewType, DataType, ModelType> {
    readonly properties: GradumMarkingMenuProperties;
    private readonly transition;
    private currentOrigin;
    minDragDistance: number;
    semiMajor: number;
    semiMinor: number;
    startAngle: number;
    endAngle: number;
}

/**
 * @group Components
 * @category GradumSelectWheel
 */
type GradumSelectWheelProperties<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    direction?: Direction;
    reifect?: Reifect | StatelessReifectProperties;
    generateCustomStyling?: (properties: GradumSelectWheelStylingProperties) => string | PartialRecord<keyof CSSStyleDeclaration, string | number>;
    size?: number | Record<Range, number>;
    opacity?: Record<Range, number>;
    scale?: Record<Range, number>;
    alwaysOpen?: boolean;
};
/**
 * @group Components
 * @category GradumSelectWheel
 */
type GradumSelectWheelStylingProperties = {
    element: HTMLElement;
    translationValue: number;
    scaleValue: number;
    opacityValue: number;
    size: Record<Range, number>;
    defaultComputedStyles: PartialRecord<keyof CSSStyleDeclaration, string | number>;
};

/**
 * @class GradumSelectWheel
 * @group Components
 * @category GradumSelectWheel
 *
 * @extends GradumSelectElement
 * @description A swipeable selection wheel. Entries are always position absolute, fanned out by a
 * continuous pixel offset. Dragging moves all entries in real time; releasing snaps to the nearest.
 * The container sizes to the selected entry. Visual state is driven by `entryTransitionReifect`
 * (CSS transitions) and `computeAndApplyStyling` (per-entry opacity/scale/transform).
 */
declare class GradumSelectWheel<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumSelectElement<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType> {
    static defaultProperties: {
        transitionDuration: number;
    };
    readonly properties: GradumSelectWheelProperties<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType>;
    private _currentPosition;
    private _index;
    protected readonly sizePerEntry: number[];
    protected readonly positionPerEntry: number[];
    protected totalSize: number;
    dragLimitOffset: number;
    openTimeout: number;
    direction: Direction;
    scale: Record<Range, number>;
    generateCustomStyling: (properties: GradumSelectWheelStylingProperties) => string | PartialRecord<keyof CSSStyleDeclaration, string | number>;
    protected dragging: boolean;
    protected openTimer: ReturnType<typeof setTimeout>;
    initialize(): void;
    opacity: Record<Range, number>;
    set size(value: Record<Range, number> | number);
    get size(): Record<Range, number>;
    set entryTransitionReifect(value: Reifect | StatelessReifectProperties);
    get entryTransitionReifect(): Reifect;
    set transitionDuration(value: number);
    set customReifect(value: Reifect | StatelessReifectProperties | null);
    get customReifect(): Reifect;
    private readonly _closeOnClick;
    set alwaysOpen(value: boolean);
    set open(value: boolean);
    get isVertical(): boolean;
    /** Fractional index — integer when snapped, fractional mid-drag. */
    get index(): number;
    protected set index(value: number);
    get currentPosition(): number;
    protected set currentPosition(value: number);
    protected computeDragDelta(delta: Point): number;
    protected reloadEntrySizes(): void;
    protected indexToPosition(index: number): number;
    protected positionToIndex(position: number): number;
    protected snapToNearest(): void;
    protected applyTransition(): void;
    protected applyAllEntryStyles(): void;
    protected computeAndApplyStyling(element: HTMLElement, translationValue: number, size?: Record<Range, number>, instant?: boolean): void;
    protected clearOpenTimer(): void;
    protected setOpenTimer(): void;
}

/**
 * @type {GradumDropdownProperties}
 * @group Components
 * @category GradumDropdown
 *
 * @description Properties for configuring a Dropdown.
 * @extends GradumProperties
 *
 * @property {(string | HTMLElement)} [selector] - Element or descriptor used as the dropdown selector. If a
 * string is passed, a Button with the given string as text will be assigned as the selector.
 * @property {HTMLElement} [popup] - The element used as a container for the dropdown entries.
 *
 * @property {boolean} [multiSelection=false] - Enables selection of multiple dropdown entries.
 *
 * @property {ValidTag} [selectorTag] - Custom HTML tag for the selector's text. Overrides the
 * default tag set in GradumConfig.Dropdown.
 *
 * @property {string | string[]} [selectorClasses] - Custom CSS class(es) for the selector. Overrides the default
 * classes set in GradumConfig.Dropdown.
 * @property {string | string[]} [popupClasses] - Custom CSS class(es) for the popup container. Overrides the
 * default classes set in GradumConfig.Dropdown.
 */
type GradumButtonPopupProperties<ElementTag extends ValidTag = any, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel<DataType>, EmitterType extends GradumEmitter = GradumEmitter> = GradumRichElementProperties<ElementTag, ViewType, DataType, ModelType, EmitterType> & {
    popup?: HTMLElement;
    popupClasses?: string | string[];
};

/**
 * @class GradumButtonPopup
 * @group Components
 * @category GradumButton
 *
 * @description Button class for creating Gradum button elements.
 * @extends GradumElement
 */
declare class GradumButtonPopup<ElementTag extends ValidTag = any, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumButton<ElementTag, ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumButtonPopupProperties;
    private popupOpen;
    popupClasses: string | string[];
    /**
     * The dropdown's popup element.
     */
    set popup(value: HTMLElement);
    protected setupUIListeners(): void;
    private openPopup;
}

declare class GradumGrid<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
}

/**
 * @class GradumMovable
 * @group Components
 * @category GradumMovable
 *
 * @extends GradumElement
 * @description Positioning wrapper that places arbitrary content via pure CSS transforms.
 * Set {@link translation} (alias {@link position}) and {@link rotation} to move/rotate the
 * wrapper without touching the content's own fields — useful for previews (feedforwards),
 * ghosts, overlays, or any element that must be positioned independently of how its content
 * renders itself.
 *
 * @example
 * ```ts
 * const movable = GradumMovable.create({content: myElement});
 * movable.translation = new Point(120, 40);
 * movable.rotation = Math.PI / 6;
 * movable.translateBy(new Point(5, 0));
 * ```
 */
declare class GradumMovable<ContentType extends Element = Element> extends GradumElement {
    /** @description The translation applied to the wrapper, in pixels. */
    translation: Point;
    /** @description The rotation applied to the wrapper, in radians. */
    rotation: number;
    /** @description When true, the wrapper is offset by -50% so translation refers to its center. */
    centerAnchor: boolean;
    /** @description The content element wrapped by this movable. Assigning it appends it as a child. */
    set content(value: ContentType);
    protected setupUILayout(): void;
    protected updateTransform(): void;
    /** @description Add the given delta to the current translation. */
    translateBy(delta: Point): void;
    /** @description Add the given angle (radians) to the current rotation. */
    rotateBy(angle: number): void;
    /**
     * @description Alias of {@link translation}, so code that positions elements through a
     * `position` field (e.g. constrainer solvers) works on the wrapper as-is.
     */
    get position(): Point;
    set position(value: Point | Coordinate);
}

/**
 * @class GradumHeadlessElement
 * @group GradumElement
 * @category GradumHeadlessElement
 *
 * @description GradumHeadlessElement class, similar to GradumElement but without extending HTMLElement.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 */
declare class GradumHeadlessElement<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>> {
    /**
     * @description Default properties assigned to a new instance.
     */
    static defaultProperties: GradumHeadlessProperties;
    static create<Type extends new (...args: any[]) => GradumHeadlessElement>(this: Type, properties?: InstanceType<Type>["properties"]): InstanceType<Type>;
    protected static customCreate(properties: object): object;
    readonly properties: GradumHeadlessProperties<ViewType, DataType, ModelType, EmitterType>;
}

/**
 * @class GradumProxiedElement
 * @group GradumElement
 * @category GradumProxiedElement
 *
 * @description GradumProxiedElement class, similar to GradumElement but containing an HTML element instead of being one.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 */
declare class GradumProxiedElement<ElementTag extends ValidTag = ValidTag, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>> {
    /**
     * @description Default properties assigned to a new instance.
     */
    static defaultProperties: GradumElementProperties;
    static create<Type extends new (...args: any[]) => GradumProxiedElement>(this: Type, properties?: InstanceType<Type>["properties"]): InstanceType<Type>;
    protected static customCreate(properties: object): object;
    readonly properties: GradumProxiedProperties<ElementTag, ViewType, DataType, ModelType, EmitterType>;
    /**
     * @description The HTML (or other) element wrapped inside this instance.
     */
    get element(): ValidElement<ElementTag>;
    /**
     * @function setupChangedCallbacks
     * @description Setup method intended to initialize change listeners and callbacks. Called on `initialize()`.
     * @protected
     */
    protected setupChangedCallbacks(): void;
    /**
     * @function setupUIElements
     * @description Setup method intended to initialize all direct sub-elements attached to this element, and store
     * them in fields. Called on `initialize()`.
     * @protected
     */
    protected setupUIElements(): void;
    /**
     * @function setupUILayout
     * @description Setup method to create the layout structure of the element by adding all created sub-elements to
     * this element's child tree. Called on `initialize()`.
     * @protected
     */
    protected setupUILayout(): void;
    /**
     * @function setupUIListeners
     * @description Setup method to initialize and define all input/DOM event listeners of the element. Called on
     * `initialize()`.
     * @protected
     */
    protected setupUIListeners(): void;
}

/**
 * @class GradumSelector
 * @group GradumSelector
 *
 * @template {object} Type - The type of the object it wraps.
 * @description Selector class that wraps an object and augments it with useful functions to manipulate it. It also
 * proxies the object, so you can access properties and methods on the underlying object directly through the selector.
 */
declare class GradumSelector<Type extends object = Node> {
    #private;
    /**
     * @description The underlying, wrapped object.
     */
    element: Type;
    constructor();
}

/**
 * @group GradumSelector
 */
type Gradum<Type extends object = Node> = GradumSelector<Type> & Type;
/**
 * @group GradumSelector
 */
type GradumifyOptions = {
    excludeHierarchyFunctions?: boolean;
    excludeMvcFunctions?: boolean;
    excludeStyleFunctions?: boolean;
    excludeClassFunctions?: boolean;
    excludeElementFunctions?: boolean;
    excludeEventFunctions?: boolean;
    excludeToolFunctions?: boolean;
    excludeConstrainerFunctions?: boolean;
    excludeMiscFunctions?: boolean;
    excludeReifectFunctions?: boolean;
};
/**
 * @overload
 * @function gradum
 * @group GradumSelector
 *
 * @template {ValidTag} Tag
 * @description All-in-one selector function that instantiates an element with the given tag and returns it wrapped
 * in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use `gr()`,
 * `g()`, or `$()` for the same behavior.
 * @param {Tag} [tag="div"] - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @return {Gradum<ValidElement<Tag>>} - The instantiated, wrapped, and proxied element.
 */
declare function gradum<Tag extends ValidTag = "div">(tag?: Tag): Gradum<ValidElement<Tag>>;
/**
 * @overload
 * @function gradum
 * @group GradumSelector
 *
 * @template {object} Type
 * @description All-in-one selector function that wraps the given object in a proxied selector that augments it
 * with useful functions for manipulating it. You can alternatively use `gr()`, `g()`, or `$()` for the same behavior.
 * @param {Type} object - The object to wrap.
 * @param {boolean} [raw=false] - If set to true, the selector will operate directly on the provided object, even
 * if it contains an inner `element` field. Useful when you want to set properties on a proxied wrapper itself rather
 * than its underlying DOM element.
 * @return {Gradum<Type>} - The wrapped, proxied object.
 */
declare function gradum<Type extends object = Node>(object: Type, raw?: boolean): Gradum<Type>;
/**
 * @overload
 * @function gradum
 * @group GradumSelector
 *
 * @description All-in-one selector function that instantiates an element with the given tag (if valid) and returns it
 * wrapped in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use
 * `gr()`, `g()`, or `$()` for the same behavior.
 * @param {string} tag - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @return {Gradum<Element>} - The instantiated, wrapped, and proxied element.
 */
declare function gradum(tag?: string): Gradum<Element>;
/**
 * @overload
 * @function gr
 * @group GradumSelector
 *
 * @template {ValidTag} Tag
 * @description All-in-one selector function that instantiates an element with the given tag and returns it wrapped
 * in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use `gradum()`,
 * `g()`, or `$()` for the same behavior.
 * @param {Tag} [tag="div"] - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @return {Gradum<ValidElement<Tag>>} - The instantiated, wrapped, and proxied element.
 */
declare function gr<Tag extends ValidTag = "div">(tag?: Tag): Gradum<ValidElement<Tag>>;
/**
 * @overload
 * @function gr
 * @group GradumSelector
 *
 * @template {object} Type
 * @description All-in-one selector function that wraps the given object in a proxied selector that augments it
 * with useful functions for manipulating it. You can alternatively use `gradum()`, `g()`, or `$()` for the same behavior.
 * @param {Type} object - The object to wrap.
 * @param {boolean} [raw=false] - If set to true, the selector will operate directly on the provided object, even
 * if it contains an inner `element` field. Useful when you want to set properties on a proxied wrapper itself rather
 * than its underlying DOM element.
 * @return {Gradum<Type>} - The wrapped, proxied object.
 */
declare function gr<Type extends object = Node>(object: Type, raw?: boolean): Gradum<Type>;
/**
 * @overload
 * @function gr
 * @group GradumSelector
 *
 * @description All-in-one selector function that instantiates an element with the given tag (if valid) and returns it
 * wrapped in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use
 * `gradum()`, `g()`, or `$()` for the same behavior.
 * @param {string} tag - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @return {Gradum<Element>} - The instantiated, wrapped, and proxied element.
 */
declare function gr(tag: string): Gradum<Element>;
/**
 * @overload
 * @function g
 * @group GradumSelector
 *
 * @template {ValidTag} Tag
 * @description All-in-one selector function that instantiates an element with the given tag and returns it wrapped
 * in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use `gradum()`,
 * `gr()`, or `$()` for the same behavior.
 * @param {Tag} [tag="div"] - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @return {Gradum<ValidElement<Tag>>} - The instantiated, wrapped, and proxied element.
 */
declare function g<Tag extends ValidTag = "div">(tag?: Tag): Gradum<ValidElement<Tag>>;
/**
 * @overload
 * @function g
 * @group GradumSelector
 *
 * @template {object} Type
 * @description All-in-one selector function that wraps the given object in a proxied selector that augments it
 * with useful functions for manipulating it. You can alternatively use `gradum()`, `gr()`, or `$()` for the same behavior.
 * @param {Type} object - The object to wrap.
 * @param {boolean} [raw=false] - If set to true, the selector will operate directly on the provided object, even
 * if it contains an inner `element` field. Useful when you want to set properties on a proxied wrapper itself rather
 * than its underlying DOM element.
 * @return {Gradum<Type>} - The wrapped, proxied object.
 */
declare function g<Type extends object = Node>(object: Type, raw?: boolean): Gradum<Type>;
/**
 * @overload
 * @function g
 * @group GradumSelector
 *
 * @description All-in-one selector function that instantiates an element with the given tag (if valid) and returns it
 * wrapped in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use
 * `gradum()`, `gr()`, or `$()` for the same behavior.
 * @param {string} tag - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @return {Gradum<Element>} - The instantiated, wrapped, and proxied element.
 */
declare function g(tag: string): Gradum<Element>;
/**
 * @overload
 * @function $
 * @group GradumSelector
 *
 * @template {ValidTag} Tag
 * @description All-in-one selector function that instantiates an element with the given tag and returns it wrapped
 * in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use `gradum()`,
 * `gr()`, or `g()` for the same behavior.
 * @param {Tag} [tag="div"] - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @return {Gradum<ValidElement<Tag>>} - The instantiated, wrapped, and proxied element.
 */
declare function $<Tag extends ValidTag = "div">(tag?: Tag): Gradum<ValidElement<Tag>>;
/**
 * @overload
 * @function $
 * @group GradumSelector
 *
 * @template {object} Type
 * @description All-in-one selector function that wraps the given object in a proxied selector that augments it
 * with useful functions for manipulating it. You can alternatively use `gradum()`, `gr()`, or `g()` for the same behavior.
 * @param {Type} object - The object to wrap.
 * @param {boolean} [raw=false] - If set to true, the selector will operate directly on the provided object, even
 * if it contains an inner `element` field. Useful when you want to set properties on a proxied wrapper itself rather
 * than its underlying DOM element.
 * @return {Gradum<Type>} - The wrapped, proxied object.
 */
declare function $<Type extends object = Node>(object: Type, raw?: boolean): Gradum<Type>;
/**
 * @overload
 * @function $
 * @group GradumSelector
 *
 * @description All-in-one selector function that instantiates an element with the given tag (if valid) and returns it
 * wrapped in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use
 * `gradum()`, `gr()`, or `g()` for the same behavior.
 * @param {string} tag - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @return {Gradum<Element>} - The instantiated, wrapped, and proxied element.
 */
declare function $(tag: string): Gradum<Element>;
/**
 * @group GradumSelector
 */
declare const gradumify: (options?: GradumifyOptions) => void;

/**
 * @type {ChildHandler}
 * @group Types
 * @category Hierarchy
 *
 * @description A type that represents all entities that can hold and manage children (an element or a shadow root).
 */
type ChildHandler = Node | ShadowRoot;
/**
 * @constant
 * @group Types
 * @category Misc
 * @description Default array-like keys to merge when applying defaults with {@link GradumSelector.applyDefaults}.
 */
declare const ApplyDefaultsMergeProperties: readonly ["interactors", "tools", "constrainers", "operators", "handlers"];
/**
 * @type {ApplyDefaultsOptions}
 * @group Types
 * @category Misc
 *
 * @description Options for {@link GradumSelector.applyDefaults}.
 * @property {string[]} [mergeProperties] - Array-like keys to merge. Defaults to {@link ApplyDefaultsMergeProperties}.
 * @property {boolean} [removeDuplicates] - Whether to remove duplicates when merging arrays. Defaults to `true`.
 */
type ApplyDefaultsOptions = {
    mergeProperties?: string[];
    removeDuplicates?: boolean;
};

declare module "yjs" {
    interface Map<MapType = any> {
    }
    interface Array<T = any> {
    }
    interface AbstractType<EventType = any> {
    }
    interface YEvent<T = any, EventType = any> {
    }
    interface YMapEvent<T = any, EventType = any> {
    }
    interface YArrayEvent<T = any, EventType = any> {
    }
}
/**
 * @group Types
 * @category Yjs
 */
type YDocumentProperties<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    document: Doc;
};

/**
 * @group MVC
 * @category GradumModel
 */
declare class GradumYModel<DataType = any, DataKeyType extends KeyType = any, IdType extends KeyType = any, ComponentType extends object = any, DataEntryType = any> extends GradumModel<DataType, DataKeyType, IdType, ComponentType, DataEntryType> {
    private readonly observer;
    private readonly observedYTypes;
    /**
     * @inheritDoc
     */
    modelConstructor: new (...args: any[]) => GradumModel;
    /**
     * @inheritDoc
     */
    set enabledCallbacks(value: boolean);
    /**
     * @inheritDoc
     */
    protected getAction(data: any, key: KeyType): any;
    /**
     * @inheritDoc
     */
    protected setAction(data: any, value: any, key: KeyType): void;
    /**
     * @inheritDoc
     */
    protected addAction(model: GradumModel, data: any, value: any, key: KeyType): KeyType;
    /**
     * @inheritDoc
     */
    protected hasAction(data: any, key: KeyType): boolean;
    /**
     * @inheritDoc
     */
    protected deleteAction(data: any, key: KeyType): void;
    /**
     * @inheritDoc
     */
    protected getKeysAction(data: any): KeyType[];
    /**
     * @inheritDoc
     */
    initialize(): void;
    /**
     * @inheritDoc
     */
    clear(clearData?: boolean): void;
    protected diffCheck(oldData: DataType, newData: DataType): boolean;
    protected observeChanges(event: YEvent, transaction: any): void;
    protected attachNestedObservers(value: any): void;
    protected detachNestedObservers(value: any): void;
    private shiftIndices;
    private getPathToTarget;
}

/**
 * @group Utilities
 * @category Equity
 */
declare function areEqual<Type = any>(...entries: Type[]): boolean;
declare function areSimilar<Type = any>(...entries: Type[]): boolean;
/**
 * @group Utilities
 * @category Equity
 */
declare function equalToAny<Type = any>(entry: Type, ...values: Type[]): boolean;
/**
 * @group Utilities
 * @category Equity
 */
declare function eachEqualToAny<Type = any>(values: Type[], ...entries: Type[]): boolean;

/**
 * @group Utilities
 * @category String
 *
 * @description Extracts the extension from the given filename or path (e.g.: ".png").
 * @param {string} str - The filename or path
 * @return The extension, or an empty string if not found.
 */
declare function getFileExtension(str?: string): string;

/**
 * @group Utilities
 * @category Hash
 */
declare function hashString(input: string): Promise<string>;
/**
 * @group Utilities
 * @category Hash
 */
declare function hashBySize(input: string, chars?: number): Promise<string>;

/**
 * @group Utilities
 * @category Interpolation
 *
 * @description Interpolates x linearly between (x1, y1) and (x2, y2). If strict is true, then x will not be allowed
 * to go beyond [x1, x2].
 * @param x
 * @param x1
 * @param x2
 * @param y1
 * @param y2
 * @param strict
 */
declare function linearInterpolation(x: number, x1: number, x2: number, y1: number, y2: number, strict?: boolean): number;

/**
 * @group Utilities
 * @category Numbers
 */
declare function trim(value: number, max: number, min?: number, fallback?: number): number;
/**
 * @group Utilities
 * @category Numbers
 */
declare function mod(value: number, modValue?: number): number;

/**
 * @group Utilities
 * @category Random
 */
declare function randomId(length?: number): string;
/**
 * @group Utilities
 * @category Random
 */
declare function randomFromRange(n1: number, n2: number): number;
/**
 * @group Utilities
 * @category Random
 */
declare function randomString(length?: number): string;

declare function replaceUrlParams(...params: {
    name: string;
    value: string;
}[]): void;
declare function getUrlParam(name: string): string;
declare function pushUrlParams(...params: {
    name: string;
    value: string;
}[]): void;
declare function clearUrlParams(): void;

/**
 * @group Utilities
 * @category String
 *
 * @description converts the provided string from camelCase to kebab-case.
 * @param {string} str - The string to convert
 */
declare function camelToKebabCase(str?: string): string;
/**
 * @group Utilities
 * @category String
 *
 * @description converts the provided string from kebab-case to camelCase.
 * @param {string} str - The string to convert
 */
declare function kebabToCamelCase(str?: string): string;

/**
 * @description Formats the given number of seconds as "MM:SS". The ":" can be replaced and specified in the separator
 * parameter.
 * @param seconds
 * @param separator
 */
declare function formatMMSS(seconds: number, separator?: string): string;
/**
 * @description Formats the given number of seconds as "HH:MM:SS". The ":" can be replaced and specified in the separator
 * parameter.
 * @param seconds
 * @param separator
 */
declare function formatHHMMSS(seconds: number, separator?: string): string;
declare function formatMmSs(seconds: number, separator?: string): string;

declare function blobToUrl(blob: Blob): Promise<string>;
declare function urlToBlob(url: string): Promise<Blob>;

/**
 * @group Utilities
 * @category Element
 *
 * @description Converts a string of tags into an Element.
 * @param {string} text - The string to convert
 * @return The Element
 */
declare function textToElement(text: string): Element;
/**
 * @group Utilities
 * @category Element
 */
declare function createProxy<SelfType extends object, ProxiedType extends object>(self: SelfType, proxied: ProxiedType): SelfType & ProxiedType;

/**
 * @group Utilities
 * @category Null Check
 */
declare function isNull(value: any): boolean;
/**
 * @group Utilities
 * @category Null Check
 */
declare function isUndefined(value: any): boolean;
/**
 * @group Utilities
 * @category Sorting
 */
declare function alphabeticalSorting(a: string | number | symbol, b: string | number | symbol): number;

/**
 * @group Utilities
 * @category Prototype
 */
declare function getFirstDescriptorInChain(object: object, key: PropertyKey): PropertyDescriptor;
/**
 * @group Utilities
 * @category Prototype
 */
declare function hasPropertyInChain(object: object, key: PropertyKey): boolean;
/**
 * @group Utilities
 * @category Prototype
 */
declare function getFirstPrototypeInChainWith(object: object, key: PropertyKey): any;
/**
 * @group Utilities
 * @category Prototype
 */
declare function getSuperMethod(object: object, key: PropertyKey, wrapperFn: Function): Function;
/**
 * @group Utilities
 * @category Prototype
 */
declare function getSuperDescriptor(object: object, key: PropertyKey): PropertyDescriptor;
/**
 * @group Utilities
 * @category Prototype
 */
declare function getPrototypeChain(object: object): any[];
/**
 * @group Utilities
 * @category Prototype
 */
declare function getConstructorChain(object: object): any[];

/**
 * @group Utilities
 * @category String
 *
 * @description Converts the passed variable into a string.
 * @param value - The variable to convert to string
 * @returns {string} - The string representation of the value
 */
declare function stringify(value: any): string;
/**
 * @group Utilities
 * @category String
 *
 * @description Attempts to convert the passed string back to its original type.
 * @param str - The string to convert back to its original type
 * @returns {any} - The original value
 */
declare function parse(str: string): any;

/**
 * @group Utilities
 * @category SVG
 *
 * @description Fetches an SVG from the given path
 * @param {string} path - The path to the SVG
 * @param logError
 * @returns An SVGElement promise
 */
declare function fetchSvg(path: string, logError?: boolean): Promise<SVGElement>;

declare function getVideoDuration(input: Blob | string): Promise<number>;

/**
 * @function createYDoc
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @description Creates a new YDoc with a default map and populates it with optional data.
 * @param {string} [mapKey="content"] - The key of the default map to setup. Defaults to "content".
 * @param {object} [data] - Optional data to set inside the default map.
 * @returns {{doc: YDoc, map: YMap}} - An object containing the YDoc and the default YMap.
 */
declare function createYDoc(mapKey?: string, data?: object): {
    doc: Doc;
    map: Map$1;
};
/**
 * @function createYMap
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @description Creates a YMap and populates it with key-value pairs from a plain object.
 * @param {object} data - The initial data to populate the YMap with.
 * @returns {YMap} A new YMap instance.
 */
declare function createYMap<DataType = object>(data: DataType): Map$1 & DataType;
/**
 * @function createYArray
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @template DataType - The type of the array's content.
 * @description Creates a YArray and populates it with elements from a plain array.
 * @param {DataType[]} data - The array of data to populate the YArray with.
 * @returns {YArray} A new YArray instance.
 */
declare function createYArray<DataType = object>(data: DataType[]): Array;
/**
 * @function jsonToYjs
 * @group Utilities
 * @category Yjs
 *
 * @description Attempts to deep-convert a JSON structure into Yjs data.
 * @param {object} data - The JSON data to convert.
 * @return {YAbstractType} - The Yjs data.
 */
declare function jsonToYjs(data: object): AbstractType;
/**
 * @function addInYMap
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @async
 * @description Adds the provided data in the provided parent in the Yjs document, with a unique ID as its field name.
 * @param {object} data - The data to append to the Yjs document.
 * @param {YMap} parentYMap - The YMap to add the data to.
 * @param {string} [id] - Optional ID to use. If not provided, a unique ID is generated.
 * @returns {Promise<string>} The ID of the inserted data.
 */
declare function addInYMap(data: object, parentYMap: Map$1, id?: string): Promise<string>;
/**
 * @function addInYArray
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @description Adds the provided data in the provided parent array in the Yjs document.
 * @param {object} data - The data to append to the Yjs document.
 * @param {YArray} parentYArray - The YArray to which the data should be appended.
 * @param {number} [index] - The index to insert the data at. If omitted or invalid, it is appended at the end.
 * @returns {number} The index where the data was inserted.
 */
declare function addInYArray(data: object, parentYArray: Array, index?: number): number;
/**
 * @function removeFromYArray
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @description Removes the first occurrence of the given entry from the YArray.
 * @param {unknown} entry - The entry to remove.
 * @param {YArray} parentYArray - The parent YArray.
 * @returns {boolean} True if removed, false otherwise.
 */
declare function removeFromYArray(entry: unknown, parentYArray: Array): boolean;
/**
 * @function deepObserveAny
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @description Observes deeply for changes to any of the specified fields and invokes callback when any field
 * changes.
 * @param {YAbstractType} data - The Yjs type to observe.
 * @param {(fieldChanged: string | null, event: YEvent, target: YAbstractType) => void} callback - The function to
 * call when a matching field changes. `fieldChanged` is `null` for direct insertions/deletions on `data` itself.
 * @param {...string} fieldNames - List of field names to observe.
 */
declare function deepObserveAny(data: AbstractType, callback: (fieldChanged: string | null, event: YEvent, target: AbstractType) => void, ...fieldNames: string[]): void;
/**
 * @function deepObserveAll
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @description Observes deeply for changes to all specified fields and invokes callback only when all fields
 * have changed.
 * @param {YAbstractType} data - The Yjs type to observe.
 * @param {(event: YEvent, target: YAbstractType) => void} callback - The function to call when all fields change.
 * @param {...string} fieldNames - List of field names to observe.
 */
declare function deepObserveAll(data: AbstractType, callback: (event: YEvent, target: AbstractType) => void, ...fieldNames: string[]): void;

/**
 * @group Utilities
 * @category Event
 * @param e
 */
declare function getEventPosition(e: Event): Point;

/**
 * @group Utilities
 * @category Geometry
 */
declare function aabbCorners(r: DOMRect): [Point, Point, Point, Point];
/**
 * @group Utilities
 * @category Geometry
 */
declare function closestPointOnAabb(p: Point, r: DOMRect): Point;

/**
 * @group Utilities
 * @category Geometry
 */
declare function isPointInConvexPolygon(p: Point, poly: Point[]): boolean;
/**
 * @group Utilities
 * @category Geometry
 */
declare function segmentIntersectsPolygon(a: Point, b: Point, poly: Point[]): Point | null;
/**
 * @group Utilities
 * @category Geometry
 */
declare function projectPolygonOntoAxis(points: Point[], axis: Point): [number, number];
/**
 * @group Utilities
 * @category Geometry
 */
declare function hasSeparatingAxisForPolygons(polyA: Point[], polyB: Point[]): boolean;
/**
 * @group Utilities
 * @category Geometry
 */
declare function polygonsIntersect(a: Point[], b: Point[]): boolean;

declare function closestPointOnEdge(pointer: Coordinate, rect: DOMRect): Point;
declare function pointInsideRect(point: Coordinate, rect: DOMRect, margin?: number): boolean;

/**
 * @group Utilities
 * @category Geometry
 */
declare function closestPointOnSegment(p: Point, a: Point, b: Point): Point;
/**
 * @group Utilities
 * @category Geometry
 */
declare function intersectSegments(a: Point, b: Point, c: Point, d: Point): Point;

/**
 * @group Utilities
 * @category CSS
 * @description Constructs a single CSS string from a template literal containing CSS rules.
 */
declare function css(strings: TemplateStringsArray, ...values: any[]): string;

/**
 * @type {FontProperties}
 * @group Utilities
 * @category Font
 *
 * @description An object representing a local font, or a family of fonts.
 *
 * @property {string} name - The name of the font. The font's filename should also match.
 * @property {string} pathOrDirectory - The path to the local font file, or the path to the local font family's directory.
 * @property {Record<string, string> | Record<number, Record<string, string>>} [weight] - If loading a single font, a
 * record in the form {weight: style}. Defaults to {"normal": "normal"}. If loading a family, a record in the form
 * {weight: {fontSubName: style}}, such that every font file in the family is named in the form fontName-fontSubName.
 * Defaults to an object containing common sub-names and styles for weights from 100 to 900.
 * @property {string} [format] - The format of the font. Defaults to "woff2".
 * @property {string} [extension] - The extension of the font file(s). Defaults to ".ttf".
 */
type FontProperties = {
    name: string;
    pathOrDirectory: string;
    stylesPerWeights?: Record<string, string> | Record<number, Record<string, string>>;
    format?: string;
    extension?: string;
};

/**
 * @group Utilities
 * @category Font
 * @description Loads a local font file, or a family of fonts from a directory.
 * @param {FontProperties} font - The font properties
 */
declare function loadLocalFont(font: FontProperties): void;

export { $, AccessLevel, ActionMode, Anchor, AnchorPoint, ApplyDefaultsMergeProperties, BasicInputEvents, ClickMode, ClosestOrigin, Color, ContentSwitchMode, DefaultClickEventName, DefaultDragEventName, DefaultEventName, DefaultKeyEventName, DefaultMoveEventName, DefaultWheelEventName, Delegate, Direction, GradumBaseElement, GradumButton, GradumButtonPopup, GradumClickEventName, GradumConstrainer, GradumContentSwitch, GradumDragEvent, GradumDragEventName, GradumDrawer, GradumDropdown, GradumElement, GradumEmitter, GradumEvent, GradumEventManager, GradumEventName, GradumGrid, GradumHandler, GradumHeadlessElement, GradumIcon, GradumIconSwitch, GradumIconToggle, GradumInput, GradumInteractor, GradumKeyEvent, GradumKeyEventName, GradumLabelElement, GradumMap, GradumMarkingMenu, GradumModel, GradumMovable, GradumMoveEventName, GradumNestedMap, GradumNodeList, GradumNumericalInput, GradumObserver, GradumOperator, GradumPopup, GradumProxiedElement, GradumQueue, GradumRect, GradumRichElement, GradumSelect, GradumSelectElement, GradumSelectInputEvent, GradumSelectWheel, GradumSelector, GradumTool, GradumView, GradumWeakSet, GradumWheelEvent, GradumWheelEventName, GradumYModel, InOut, InputDevice, Listener, ListenerSet, MathMLNamespace, MathMLTags, NonPassiveEvents, OnOff, Open, Point, PopupFallbackMode, Propagation, Range, RegistryCategory, Reifect, Shown, Side, SideH, SideV, StatefulReifect, SvgNamespace, SvgTags, a, aabbCorners, addInYArray, addInYMap, addRegistryCategory, alphabeticalSorting, areEqual, areSimilar, attachListenersAndBehaviors, auto, behavior, blindElement, blobToUrl, button, cache, callOnce, callOncePerInstance, camelToKebabCase, canvas, checker, clearCache, clearCacheEntry, clearUrlParams, closestPointOnAabb, closestPointOnEdge, closestPointOnSegment, constrainer, createProxy, createYArray, createYDoc, createYMap, css, deepObserveAll, deepObserveAny, define, disposeEffect, div, drawer, eachEqualToAny, effect, element, equalToAny, expose, fetchSvg, findRegistered, flexCol, flexColCenter, flexRow, flexRowCenter, form, formatHHMMSS, formatMMSS, formatMmSs, g, generateTagFunction, getAllRegistered, getConstructorChain, getEventPosition, getFileExtension, getFirstDescriptorInChain, getFirstPrototypeInChainWith, getPrototypeChain, getRegisteredByCategories, getRegisteredElements, getRegisteredEntry, getRegisteredMvc, getSignal, getSuperDescriptor, getSuperMethod, getUrlParam, getVideoDuration, gr, gradum, gradumify, h1, h2, h3, h4, h5, h6, handler, hasPropertyInChain, hasSeparatingAxisForPolygons, hashBySize, hashString, img, initializeEffects, input, interactor, intersectSegments, isNull, isPointInConvexPolygon, isUndefined, isolatedModelSignal, jsonToYjs, kebabToCamelCase, linearInterpolation, link, listener, loadLocalFont, markDirty, markDirtyPath, mod, modelSignal, mutator, nestedModelSignal, observe, operator, p, parse, pointInsideRect, polygonsIntersect, projectPolygonOntoAxis, pushUrlParams, randomFromRange, randomId, randomString, removeFromYArray, replaceUrlParams, segmentIntersectsPolygon, setSignal, signal, solver, spacer, span, stringify, style, stylesheet, textToElement, textarea, tool, trim, untrack, urlToBlob, video };
export type { ApplyDefaultsOptions, AutoOptions, BasicPropertyConfig, BlockStoreType, CacheOptions, ChildHandler, CloneElementOptions, ConstrainerAddCallbackProperties, ConstrainerCallbackProperties, ConstrainerChecker, ConstrainerMutator, ConstrainerMutatorProperties, ConstrainerSolver, Coordinate, DefaultEventNameEntry, DefaultEventNameKey, DefineOptions, ElementTagDefinition, ElementTagMap, EnabledGradumEventTypes, FeedforwardProperties, FlatKeyType, FlexRect, FontProperties, Gradum, GradumButtonPopupProperties, GradumConstrainerProperties, GradumContentSwitchProperties, GradumDragEventProperties, GradumDrawerProperties, GradumDropdownProperties, GradumElementDefaultInterface, GradumElementMvcInterface, GradumElementProperties, GradumElementPropertiesMap, GradumElementTagNameMap, GradumElementUiInterface, GradumEventManagerLockStateProperties, GradumEventManagerProperties, GradumEventManagerStateProperties, GradumEventNameEntry, GradumEventNameKey, GradumEventProperties, GradumHeadlessProperties, GradumIconProperties, GradumIconSwitchProperties, GradumIconToggleProperties, GradumInputProperties, GradumInteractorProperties, GradumKeyEventProperties, GradumLabelElementProperties, GradumMarkingMenuProperties, GradumModelProperties, GradumModelProxy, GradumNumericalInputProperties, GradumObserverProperties, GradumOperatorProperties, GradumPopupProperties, GradumProperties, GradumProxiedProperties, GradumRawEventProperties, GradumRectProperties, GradumRichElementProperties, GradumSelectElementProperties, GradumSelectInputEventProperties, GradumSelectProperties, GradumSelectWheelProperties, GradumSelectWheelStylingProperties, GradumToolProperties, GradumViewProperties, GradumWheelEventProperties, GradumifyOptions, HTMLElementMutableFields, HTMLElementNonFunctions, HTMLTag, KeyType, ListenerCallback, ListenerOptions, ListenerProperties, MakeConstrainerOptions, MakeToolOptions, MatchListenerProperties, MathMLTag, MvcBlockKeyType, MvcBlocksType, MvcFlatKeyType, MvcGenerationProperties, MvcProperties, NodeListSlot, NodeListType, PartialRecord, PreventDefaultOptions, PropertyConfig, RegistryEntry, ReifectAppliedOptions, ReifectEnabledObject, ReifectInterpolator, ReifectObjectData, ReifectOnSwitchCallback, SVGTag, SVGTagMap, ScopedKey, SetToolOptions, SignalBox, SignalEntry, StateInterpolator, StateSpecificProperty, StatefulReifectCoreProperties, StatefulReifectProperties, StatelessPropertyConfig, StatelessReifectCoreProperties, StatelessReifectProperties, StylesRoot, StylesType, ToolBehaviorCallback, ToolBehaviorOptions, ValidElement, ValidHTMLElement, ValidMathMLElement, ValidNode, ValidSVGElement, ValidTag, YDocumentProperties };

// Flattened from relative module augmentations
interface GradumSelector {
        /**
         * @description Readonly set of listeners bound to this node.
         */
        readonly boundListeners: ListenerSet;
        /**
         * @description If you want the element to bypass the event manager and allow native events to seep through
         * (in case you are preventing default events), you can set this field to a predicate that
         * defines when to bypass the manager according to the passed event.
         */
        bypassManagerOn: (e: Event) => boolean | GradumEventManagerStateProperties;
        /**
         * @function on
         * @description Adds an event listener to the element.
         * @template {Node} Type - The type of the element.
         * @param {string} type - The type of the event.
         * @param {ListenerCallback<Type>} listener - The function that receives a notification.
         * @param {ListenerOptions} [options] - An options object that specifies characteristics
         * about the event listener.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        on<Type extends Node>(type: string, listener: ListenerCallback<Type>, options?: ListenerOptions, manager?: GradumEventManager): this;
        /**
         * @function onTool
         * @template {Node} Type - The type of the element.
         * @description Adds an event listener to the element.
         * @param {string} type - The type of the event.
         * @param {string} toolName - The name of the tool. Set to null or undefined to check for listeners not bound
         * to a tool.
         * @param {ListenerCallback<Type>} listener - The function that receives a notification.
         * @param {ListenerOptions} [options] - An options object that specifies characteristics
         * about the event listener.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        onTool<Type extends Node>(type: string, toolName: string, listener: ListenerCallback<Type>, options?: ListenerOptions, manager?: GradumEventManager): this;
        /**
         * @function executeAction
         * @description Execute the listeners bound on this element for the given `type` and `toolName`. Simulates
         * firing a `type` event on the element with `toolName` active.
         * @param {string} type -  The type of the event.
         * @param {string} toolName - The name of the tool. Set to null or undefined to fire listeners not bound
         * to a tool.
         * @param {Event} event - The event to pass as parameter to the listeners.
         * @param {ListenerOptions} [options] - Options object that specifies characteristics
         * about the event listeners to fire.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         */
        executeAction(type: string, toolName: string, event: Event, options?: ListenerOptions, manager?: GradumEventManager): Propagation;
        /**
         * @function hasListener
         * @description Checks if the given event listener is bound to the element (in its boundListeners list).
         * @param {string} type - The type of the event. Set to null or undefined to get all event types.
         * @param {ListenerCallback} listener - The function that receives a notification.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {boolean} - Whether the element has the given listener.
         */
        hasListener(type: string, listener: ListenerCallback, manager?: GradumEventManager): boolean;
        /**
         * @function hasToolListener
         * @description Checks if the given event listener is bound to the element (in its boundListeners list).
         * @param {string} type - The type of the event. Set to null or undefined to get all event types.
         * @param {string} toolName - The name of the tool the listener is attached to. Set to null or undefined
         * to check for listeners not bound to a tool.
         * @param {ListenerCallback} listener - The function that receives a notification.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {boolean} - Whether the element has the given listener.
         */
        hasToolListener(type: string, toolName: string, listener: ListenerCallback, manager?: GradumEventManager): boolean;
        /**
         * @function hasListenersByType
         * @description Checks if the element has bound listeners of the given type (in its boundListeners list).
         * @param {string} type - The type of the event. Set to null or undefined to get all event types.
         * @param {string} toolName - The name of the tool to consider (if any). Set to null or undefined
         * to check for listeners not bound to a tool.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {boolean} - Whether the element has a listener of this type.
         */
        hasListenersByType(type: string, toolName?: string, manager?: GradumEventManager): boolean;
        /**
         * @function removeListener
         * @description Removes an event listener that is bound to the element (in its boundListeners list).
         * @param {string} type - The type of the event.
         * @param {ListenerCallback} listener - The function that receives a notification.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeListener(type: string, listener: ListenerCallback, manager?: GradumEventManager): this;
        /**
         * @function removeToolListener
         * @description Removes an event listener that is bound to the element (in its boundListeners list).
         * @param {string} type - The type of the event.
         * @param {string} toolName - The name of the tool the listener is attached to. Set to null or undefined
         * to check for listeners not bound to a tool.
         * @param {ListenerCallback} listener - The function that receives a notification.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeToolListener(type: string, toolName: string, listener: ListenerCallback, manager?: GradumEventManager): this;
        /**
         * @function removeListenersByType
         * @description Removes all event listeners bound to the element (in its boundListeners list) assigned to the
         * specified type.
         * @param {string} type - The type of the event. Set to null or undefined to consider all types.
         * @param {string} [toolName] - The name of the tool associated (if any). Set to null or undefined
         * to check for listeners not bound to a tool.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeListenersByType(type: string, toolName?: string, manager?: GradumEventManager): this;
        /**
         * @function removeAllListeners
         * @description Removes all event listeners bound to the element (in its boundListeners list).
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeAllListeners(manager?: GradumEventManager): this;
        /**
         * @description Prevent default browser behavior on the provided event types. By default, all basic input events
         * will be processed.
         * @param {PreventDefaultOptions} [options] - An options object to customize the behavior of the function.
         */
        preventDefault(options?: PreventDefaultOptions): this;
    }
interface GradumSelector {
        /**
         * @function makeTool
         * @description Turns the element into a tool identified by `toolName`, optionally wiring activation and
         * key mapping. By default, this function also sets up an event listener on the element to activate the
         * tool on click. This behavior can be overridden via the `options` parameter.
         * @param {string} toolName - The unique name of the tool to register under the manager. Reusing an existing
         * `toolName` will make this element another instance of `toolName`.
         * @param {MakeToolOptions} [options] - Tool creation options (custom activation, click mode, key mapping, manager).
         * @returns {this} - Itself for chaining.
         */
        makeTool(toolName: string, options?: MakeToolOptions): this;
        /**
         * @function isTool
         * @description Whether this element is registered as a tool for the provided manager.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @return {boolean} True if the element is a tool, false otherwise.
         */
        isTool(manager?: GradumEventManager): boolean;
        /**
         * @function getToolNames
         * @description Returns all tool names registered on this element for the provided manager.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @return {string[]} The list of tool names.
         */
        getToolNames(manager?: GradumEventManager): string[];
        /**
         * @function getToolName
         * @description Returns the first registered tool name on this element for the provided manager.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @return {string} The first tool name, if any.
         */
        getToolName(manager?: GradumEventManager): string;
        /**
         * @function onToolActivate
         * @description Retrieve the delegate fired when this tool is activated in the corresponding manager.
         * @param {string} [toolName=this.getToolName()] - The name of the tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @return {Delegate<() => void} - The delegate.
         */
        onToolActivate(toolName?: string, manager?: GradumEventManager): Delegate<() => void>;
        /**
         * @function onToolDeactivate
         * @description Retrieve the delegate fired when this tool is deactivated in the corresponding manager.
         * @param {string} [toolName=this.getToolName()] - The name of the tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @return {Delegate<() => void} - The delegate.
         */
        onToolDeactivate(toolName?: string, manager?: GradumEventManager): Delegate<() => void>;
        /**
         * @function addToolBehavior
         * @description Adds a behavior callback for a given tool and a given type. This callback will attempt to be
         * executed on the target element when a `type` event is fired and `toolName` is active. It is applied to
         * all instances of the tool.
         * @param {string} type - The type of the event (e.g., "pointerdown", "click", custom gradum event).
         * @param {ToolBehaviorCallback} callback - The behavior function. Return `true` to stop propagation.
         * @param {string} [toolName=this.getToolName()] - Tool name to bind the behavior to. Defaults to this
         * element's first tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        addToolBehavior(type: string, callback: ToolBehaviorCallback, toolName?: string, manager?: GradumEventManager): this;
        /**
         * @function hasToolBehavior
         * @description Checks whether there is at least one tool behavior for the pair "`type`, `toolName`."
         * @param {string} type - The type of the event (e.g., "pointerdown", "click", custom gradum event).
         * @param {string} [toolName=this.getToolName()] - The tool name to check under. Defaults to this
         * element's first tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @return {boolean} True if one or more behaviors are registered.
         */
        hasToolBehavior(type: string, toolName?: string, manager?: GradumEventManager): boolean;
        /**
         * @function removeToolBehaviors
         * @description Removes all behaviors for the pair "`type`, `toolName`" under the given manager.
         * @param {string} type - The type of the event (e.g., "pointerdown", "click", custom gradum event).
         * @param {string} [toolName=this.getToolName()] - The tool name whose behaviors will be removed. Defaults to this
         * element's first tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        removeToolBehaviors(type: string, toolName?: string, manager?: GradumEventManager): this;
        /**
         * @function applyTool
         * @description Executes all behaviors registered for the pair "`type`, `toolName`" against this element.
         * @param {string} toolName - The name of the tool whose behaviors should run.
         * @param {string} type - The type of the event (e.g., "pointerdown", "click", custom gradum event).
         * @param {Event} event - The triggering event instance.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @return {boolean} True if at least one behavior returned `true` (to stop propagation of the event).
         */
        applyTool(toolName: string, type: string, event: Event, manager?: GradumEventManager): Propagation;
        /**
         * @function clearToolBehaviors
         * @description Clears all registered behaviors for the tools attached to this element.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @return {this} Itself for chaining.
         */
        clearToolBehaviors(manager?: GradumEventManager): this;
        /**
         * @function embedTool
         * @description Embeds this tool into a target node, so all interactions on the tool element apply to the
         * defined target.
         * @param {Node} target - The node to manipulate when interacting with the tool element itself.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        embedTool(target: Node, manager?: GradumEventManager): this;
        /**
         * @function isEmbeddedTool
         * @description Whether this tool is embedded under the provided manager.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @return {boolean} True if an embedded target is present.
         */
        isEmbeddedTool(manager?: GradumEventManager): boolean;
        /**
         * @function getEmbeddedToolTarget
         * @description Returns the target node for this embedded tool under the provided manager.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @return {Node} The embedded tool's target node, if any.
         */
        getEmbeddedToolTarget(manager?: GradumEventManager): Node;
        /**
         * @function ignoreTool
         * @description Make the current element ignore the provided tool, so interacting with the tool on this
         * element will have no effect and propagate.
         * @param {string} toolName - The name of the tool to ignore.
         * @param {string} [type] - The type of the event. If undefined, all event types will be considered.
         * @param {boolean} [ignore] - Whether to ignore the tool. Defaults to true.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @return {this} Itself for chaining.
         */
        ignoreTool(toolName: string, type?: string, ignore?: boolean, manager?: GradumEventManager): this;
        /**
         * @function ignoreTool
         * @description Make the current element ignore all tools, so interacting with any tool on this
         * element will have no effect and propagate.
         * @param {boolean} [ignore] - Whether to ignore the tools. Defaults to true.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @return {this} Itself for chaining.
         */
        ignoreAllTools(ignore?: boolean, manager?: GradumEventManager): this;
        /**
         * @function isToolIgnored
         * @description Whether the current element is ignoring the provided tool.
         * @param {string} toolName - The name of the tool to check for.
         * @param {string} [type] - The type of the event. If undefined, all event types will be considered.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @return {boolean} Whether the tool is ignored for the provided event type.
         */
        isToolIgnored(toolName: string, type?: string, manager?: GradumEventManager): boolean;
    }
interface GradumTool<ElementType extends object = object> {
        /**
         * @function customActivation
         * @description Custom activation function.
         * @param {Gradum<Element>} element - The tool element itself.
         * @param {GradumEventManager} [manager] - The event manager instance this tool should register against. Defaults
         * to `GradumEventManager.instance`.
         */
        customActivation(element: ElementType, manager?: GradumEventManager): void;
        /**
         * @function onActivate
         * @description Function to execute when the tool is activated.
         */
        onActivate(): void;
        /**
         * @function onDeactivate
         * @description Function to execute when the tool is deactivated.
         */
        onDeactivate(): void;
    }
interface GradumConstrainer {
        /**
         * @function onActivate
         * @description Function to execute when the constrainer is activated.
         */
        onActivate(): void;
        /**
         * @function onDeactivate
         * @description Function to execute when the constrainer is deactivated.
         */
        onDeactivate(): void;
    }
interface GradumSelector<Type extends object = Node> {
        /**
         * @function setProperties
         * @template {ValidTag} Tag - The HTML tag of the element (for accurate autocompletion of available properties).
         * @description Sets the declared properties to the element (if possible).
         * @param {GradumProperties<Tag>} properties - The properties object.
         * @param {boolean} [setOnlyBaseProperties=false] - If set to true, will only set the base gradum properties (classes,
         * text, style, id, children, parent, etc.) and ignore all other properties not explicitly defined in GradumProperties.
         * @returns {this} Itself, allowing for method chaining.
         */
        setProperties<Tag extends ValidTag>(properties: GradumProperties<Tag>, setOnlyBaseProperties?: boolean): this;
        getFields(): Record<string, any>;
        clone(options?: CloneElementOptions): Type;
        /**
         * @description Destroys the element by removing it from the document and removing all its bound listeners.
         * @returns {this} Itself, allowing for method chaining.
         */
        destroy(): this;
        /**
         * @description Sets the value of an attribute on the element.
         * @param {string} name The name of the attribute.
         * @param {string | number | boolean} [value] The value of the attribute. Can be left blank to represent
         * a true boolean.
         * @returns {this} Itself, allowing for method chaining.
         */
        setAttribute(name: string, value?: string | number | boolean): this;
        /**
         * @description Removes an attribute from the element.
         * @param {string} name The name of the attribute to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeAttribute(name: string): this;
        /**
         * @description Causes the element to lose focus.
         * @returns {this} Itself, allowing for method chaining.
         */
        blur(): this;
        /**
         * @description Sets focus on the element.
         * @returns {this} Itself, allowing for method chaining.
         */
        focus(): this;
        feedforward(options?: FeedforwardProperties): Type;
        defaultFeedforwardProperties: GradumElementProperties;
    }
interface GradumProxiedElement extends GradumElementDefaultInterface {
    }
interface GradumProxiedElement<ElementTag extends ValidTag = ValidTag, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel> extends GradumElementMvcInterface<ViewType, DataType, ModelType> {
    }
interface GradumProxiedElement extends GradumElementUiInterface {
    }
interface GradumElement {
        readonly tagName: string;
    }
interface GradumElement extends GradumElementDefaultInterface {
    }
interface GradumElement<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel> extends GradumElementMvcInterface<ViewType, DataType, ModelType> {
    }
interface GradumElement extends GradumElementUiInterface {
    }
interface GradumSelector<Type extends object = Node> {
        readonly mvc: MvcProperties;
        /**
         * @description The model of the element's MVC structure.
         */
        model: any;
        /**
         * @description The view of the element's MVC structure.
         */
        view: any;
        /**
         * @description The emitter of the element's MVC structure.
         */
        emitter: any;
        /**
         * @description The main data block attached to the element's model.
         */
        data: any;
        readonly metadata: GradumModel<object>;
        /**
         * @description The ID of the main data block of the element's model.
         */
        dataId: string;
        /**
         * @description The numerical index of the main data block of the element's model.
         */
        dataIndex: number;
        /**
         * @description The size (number) of the main data block of the element's model.
         */
        readonly dataSize: number;
        /**
         * @description The operators of the element's MVC structure.
         */
        operators: GradumOperator[];
        /**
         * @description The handlers attached to the element's model.
         * Returns an empty array if no model is set.
         */
        handlers: GradumHandler[];
        /**
         * @description The interactors of the element's MVC structure.
         */
        interactors: GradumInteractor[];
        /**
         * @description The tools of the element's MVC structure.
         */
        tools: GradumTool[];
        /**
         * @description The constrainers of the element's MVC structure.
         */
        constrainers: GradumConstrainer[];
        /**
         * @function setMvc
         * @description Configures the MVC structure for the element. Sets the provided MVC pieces (model, view,
         * emitter, operators, handlers, interactors, tools, constrainers) on the element, initializes a default
         * emitter if none is provided, and initializes all MVC pieces unless explicitly disabled.
         * @param {MvcGenerationProperties} properties - The properties to configure the MVC structure.
         * @returns {this} Itself, allowing for method chaining.
         */
        setMvc(properties: MvcGenerationProperties): this;
        /**
         * @function initializeMvc
         * @description Initializes all MVC pieces attached to the element, in the following order: view,
         * operators, interactors, tools, constrainers, and model. The model is initialized last to allow
         * the view and operators to set up their change callbacks first.
         * @returns {this} Itself, allowing for method chaining.
         */
        initializeMvc(): this;
        /**
         * @function getMvcDifference
         * @template {GradumView} ViewType - The element's view type.
         * @template {object} DataType - The element's data type.
         * @template {GradumModel<DataType>} ModelType - The element's model type.
         * @template {GradumEmitter} EmitterType - The element's emitter type.
         * @description Computes the structural difference between the element's current MVC configuration
         * and a provided configuration description. The comparison is constructor-based (not instance-based):
         * - For singular fields (`view`, `model`, `emitter`), the constructors are compared.
         * - For collection fields (`operators`, `handlers`, `interactors`, `tools`, `constrainers`),
         *   the result contains constructors present in the current MVC but absent from the provided configuration.
         * @param {MvcGenerationProperties<ViewType, DataType, ModelType, EmitterType>} [properties={}] -
         *  The configuration to compare against.
         * @returns {MvcGenerationProperties<ViewType, DataType, ModelType, EmitterType>}
         *  A partial configuration of constructors describing pieces present in the current MVC
         *  but not in the provided configuration.
         */
        getMvcDifference<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>>(properties?: MvcGenerationProperties<ViewType, DataType, ModelType, EmitterType>): MvcGenerationProperties<ViewType, DataType, ModelType, EmitterType>;
        /**
         * @function getOperator
         * @description Retrieves the attached MVC operator with the given key.
         * @param {string} key - The operator's key.
         * @returns {GradumOperator} - The operator.
         */
        getOperator(key: string): GradumOperator;
        /**
         * @function addOperator
         * @description Adds the given operator to the element's MVC structure.
         * @param {GradumOperator} operator - The operator to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addOperator(operator: GradumOperator): this;
        /**
         * @function removeOperator
         * @description Removes the given operator from the element's MVC structure and unlinks it.
         * @param {string | GradumOperator} keyOrInstance - The operator's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeOperator(keyOrInstance: string | GradumOperator): this;
        /**
         * @function getHandler
         * @description Retrieves the attached MVC handler with the given key.
         * Returns undefined if no model is set.
         * @param {string} key - The handler's key.
         * @returns {GradumHandler} - The handler.
         */
        getHandler(key: string): GradumHandler;
        /**
         * @function addHandler
         * @description Adds the given handler to the element's model.
         * If no model is set, this operation is a no-op.
         * @param {GradumHandler} handler - The handler to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addHandler(handler: GradumHandler): this;
        /**
         * @function removeHandler
         * @description Removes the given handler from the element's model and unlinks it.
         * If no model is set, this operation is a no-op.
         * @param {string | GradumHandler} keyOrInstance - The handler's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeHandler(keyOrInstance: string | GradumHandler): this;
        /**
         * @function getInteractor
         * @description Retrieves the attached MVC interactor with the given key.
         * @param {string} key - The interactor's key.
         * @returns {GradumInteractor} - The interactor.
         */
        getInteractor(key: string): GradumInteractor;
        /**
         * @function addInteractor
         * @description Adds the given interactor to the element's MVC structure.
         * @param {GradumInteractor} interactor - The interactor to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addInteractor(interactor: GradumInteractor): this;
        /**
         * @function removeInteractor
         * @description Removes the given interactor from the element's MVC structure and unlinks it.
         * @param {string | GradumInteractor} keyOrInstance - The interactor's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeInteractor(keyOrInstance: string | GradumInteractor): this;
        /**
         * @function getTool
         * @description Retrieves the attached MVC tool with the given key.
         * @param {string} key - The tool's key.
         * @returns {GradumTool} - The tool.
         */
        getTool(key: string): GradumTool;
        /**
         * @function addTool
         * @description Adds the given tool to the element's MVC structure.
         * @param {GradumTool} tool - The tool to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addTool(tool: GradumTool): this;
        /**
         * @function removeTool
         * @description Removes the given tool from the element's MVC structure and unlinks it.
         * @param {string | GradumTool} keyOrInstance - The tool's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeTool(keyOrInstance: string | GradumTool): this;
        /**
         * @function getConstrainer
         * @description Retrieves the attached MVC constrainer with the given key.
         * @param {string} key - The constrainer's key.
         * @returns {GradumConstrainer} - The constrainer.
         */
        getConstrainer(key: string): GradumConstrainer;
        /**
         * @function addConstrainer
         * @description Adds the given constrainer to the element's MVC structure.
         * @param {GradumConstrainer} constrainer - The constrainer to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addConstrainer(constrainer: GradumConstrainer): this;
        /**
         * @function removeConstrainer
         * @description Removes the given constrainer from the element's MVC structure and unlinks it.
         * @param {string | GradumConstrainer} keyOrInstance - The constrainer's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeConstrainer(keyOrInstance: string | GradumConstrainer): this;
    }
interface GradumHeadlessElement extends GradumElementDefaultInterface {
    }
interface GradumHeadlessElement<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel> extends GradumElementMvcInterface<ViewType, DataType, ModelType> {
    }
interface GradumSelector {
        /**
         * @description Array of all the constrainers attached to this element.
         */
        readonly constrainersNames: string[];
        /**
         * @function makeConstrainer
         * @description Creates a new constrainer attached to this element. Useful to maintain certain constraints or
         * ensure some behaviors persist on a list of objects (by attaching solvers to this constrainer).
         * @param {string} name - The name of the new constrainer.
         * @param {MakeConstrainerOptions} [options] - Options parameter to configure the newly-created constrainer.
         * @return {this} - Itself for chaining.
         */
        makeConstrainer(name: string, options?: MakeConstrainerOptions): this;
        /**
         * @description Array of active constrainers on this element.
         */
        readonly activeConstrainers: string[];
        /**
         * @function activateConstrainer
         * @description Activate the given constrainer.
         * @param {string[]} constrainers - The name of the constrainer(s) to activate. Defaults to the first active constrainer.
         * @return {this} - Itself for chaining.
         */
        activateConstrainer(...constrainers: string[]): this;
        /**
         * @function deactivateConstrainer
         * @description Deactivate the given constrainer.
         * @param {string[]} constrainers - The name of the constrainer(s) to deactivate. Defaults to the first active constrainer.
         * @return {this} - Itself for chaining.
         */
        deactivateConstrainer(...constrainers: string[]): this;
        /**
         * @function toggleConstrainer
         * @description Toggle the active state of the given constrainer.
         * @param {string} constrainer - The name of the constrainer to toggle. Defaults to the first active constrainer.
         * @param {boolean} [force] - If set, the constrainer's active state will be set to this value.
         * @return {this} - Itself for chaining.
         */
        toggleConstrainer(constrainer?: string, force?: boolean): this;
        /**
         * @function activateOnlyConstrainer
         * @description Activate the provided constrainer and deactivate all other constrainers attached to this element.
         * @param {string} constrainer - The constrainer name to activate as the single active constrainer. Defaults to the
         * first active constrainer.
         * @return {this} - Itself for chaining.
         */
        activateOnlyConstrainer(constrainer: string): this;
        /**
         * @function activateAllConstrainers
         * @description Activate all the constrainers attached to this element.
         * @return {this} - Itself for chaining.
         */
        activateAllConstrainers(): this;
        /**
         * @function deactivateAllConstrainers
         * @description Deactivate all the constrainers attached to this element.
         * @return {this} - Itself for chaining.
         */
        deactivateAllConstrainers(): this;
        /**
         * @function onConstrainerActivate
         * @description Get the delegate fired when the constrainer of the given name is activated.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {Delegate<() => void>} - The delegate.
         */
        onConstrainerActivate(constrainer?: string): Delegate<() => void>;
        /**
         * @function onConstrainerDeactivate
         * @description Get the delegate fired when the constrainer of the given name is deactivated.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {Delegate<() => void>} - The delegate.
         */
        onConstrainerDeactivate(constrainer?: string): Delegate<() => void>;
        /**
         * @function getConstrainerPriority
         * @description Get the priority of the targeted constrainer. Higher priority constrainers (lower number) should
         * be resolved first.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {number} - The constrainer priority.
         */
        getConstrainerPriority(constrainer?: string): number;
        /**
         * @function setConstrainerPriority
         * @description Set the priority of the targeted constrainer. Higher priority constrainers (lower number) should
         * be resolved first.
         * @param {number} priority - The priority value to set.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {this} - Itself for chaining.
         */
        setConstrainerPriority(priority: number, constrainer?: string): this;
        /**
         * @function getConstrainerObjectList
         * @description Retrieve the list of objects that are constrained by the given constrainer.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {GradumNodeList} - The list of objects. To manipulate, check {@link GradumNodeList}.
         */
        getConstrainerObjectList(constrainer?: string): GradumNodeList;
        /**
         * @function onConstrainerObjectListChange
         * @description Get the delegate fired whenever an object is added to or removed from the constrainer's object list.
         * Defaults to the children of the element the constrainer is attached to.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {Delegate<(object: object, status: "added" | "removed") => void>} - The delegate.
         */
        onConstrainerObjectListChange(constrainer?: string): Delegate<(object: object, status: "added" | "removed") => void>;
        /**
         * @function getConstrainerTriggerList
         * @description Retrieve the list of objects that trigger the given constrainer to resolve.
         * Interacting with any of these objects would typically lead to the solving of the given constrainer.
         * Defaults to the constrainer's object list.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {GradumNodeList} - The list of trigger objects. To manipulate, check {@link GradumNodeList}.
         */
        getConstrainerTriggerList(constrainer?: string): GradumNodeList;
        /**
         * @function getConstrainerQueue
         * @description Retrieve the current queue to be processed by the constrainer while resolving.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {GradumQueue<object>} - The current constrainer queue.
         */
        getConstrainerQueue(constrainer?: string): GradumQueue<object>;
        /**
         * @function getDefaultConstrainerQueue
         * @description Retrieve the default queue template for the constrainer, used when starting a new resolving pass.
         * It defaults to the constrainer's object list.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {GradumQueue<object>} - The default constrainer queue.
         */
        getDefaultConstrainerQueue(constrainer?: string): GradumQueue<object>;
        /**
         * @function setDefaultConstrainerQueue
         * @description Define the default queue template for the constrainer, used when starting a new resolving pass.
         * @param {object[] | GradumQueue<object>} queue - The queue (or list to build a queue from).
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {this} - Itself for chaining.
         */
        setDefaultConstrainerQueue(queue: object[] | GradumQueue<object>, constrainer?: string): this;
        /**
         * @function getObjectPassesForConstrainer
         * @description Retrieve how many times the given object has been processed for the current resolving session
         * of the constrainer.
         * @param {object} object - The object to query.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {number} - Number of passes already performed on this object.
         */
        getObjectPassesForConstrainer(object: object, constrainer?: string): number;
        /**
         * @function getMaxPassesForConstrainer
         * @description Get the maximum number of passes allowed per object for this constrainer during resolving.
         * This helps prevent infinite cycles in constraint propagation.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {number} - The maximum allowed passes.
         */
        getMaxPassesForConstrainer(constrainer?: string): number;
        /**
         * @function setMaxPassesForConstrainer
         * @description Set the maximum number of passes allowed per object for this constrainer during resolving. This
         * helps prevent infinite cycles in constraint propagation.
         * @param {number} passes - Maximum number of passes.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {this} - Itself for chaining.
         */
        setMaxPassesForConstrainer(passes: number, constrainer?: string): this;
        /**
         * @function getObjectDataForConstrainer
         * @description Retrieve custom per-object data for this constrainer. It is reset on every new
         * resolving session.
         * @param {object} object - The object to query.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {Record<string, any>} - The stored data object (or an empty object if none).
         */
        getObjectDataForConstrainer(object: object, constrainer?: string): Record<string, any>;
        /**
         * @function setObjectDataForConstrainer
         * @description Set custom per-object data for this constrainer. It is reset on every new resolving session.
         * @param {object} object - The object to update.
         * @param {Record<string, any>} [data] - The new data object to associate with this object.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {this} - Itself for chaining.
         */
        setObjectDataForConstrainer(object: object, data?: Record<string, any>, constrainer?: string): this;
        /**
         * @function addChecker
         * @description Register a checker in the constrainer. Checkers dictate whether the event should continue
         * executing depending on the provided context (event, tool, target, etc.).
         * @param {ConstrainerAddCallbackProperties<ConstrainerChecker>} properties - Configuration object, including the
         * checker `callback` to be executed, the `name` of the checker to access it later, the name of the attached
         * `constrainer`, and the `priority` of the checker.
         * @return {this} - Itself for chaining.
         */
        addChecker(properties: ConstrainerAddCallbackProperties<ConstrainerChecker>): this;
        /**
         * @function removeChecker
         * @description Remove a checker from the given constrainer by its name.
         * @param {string} name - The checker name.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {this} - Itself for chaining.
         */
        removeChecker(name: string, constrainer?: string): this;
        /**
         * @function clearCheckers
         * @description Remove all checkers attached to the given constrainer.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {this} - Itself for chaining.
         */
        clearCheckers(constrainer?: string): this;
        /**
         * @function checkConstrainer
         * @description Evaluate all checkers for the targeted constrainer and return whether the event should proceed or halt.
         * @param {ConstrainerCallbackProperties} [properties] - Context passed to each checker.
         * @return {boolean} - Whether the constrainer passes all checks.
         */
        checkConstrainer(properties?: ConstrainerCallbackProperties): boolean;
        /**
         * @function checkConstrainersForEvent
         * @description Evaluate checkers for all relevant constrainers for a given event context.
         * @param {ConstrainerCallbackProperties} [properties] - Event context.
         * @return {boolean} - Whether all the checkers allowed the event to proceed.
         */
        checkConstrainersForEvent(properties?: ConstrainerCallbackProperties): boolean;
        /**
         * @function addMutator
         * @description Register a mutator in the constrainer. Mutators compute or transform a value based on the context.
         * @param {ConstrainerAddCallbackProperties<ConstrainerMutator>} properties - Configuration object, including the
         * mutator `callback` to be executed, the `name` of the mutator to access it later, the name of the attached
         * `constrainer`, and the `priority` of the mutator.
         * @return {this} - Itself for chaining.
         */
        addMutator(properties: ConstrainerAddCallbackProperties<ConstrainerMutator>): this;
        /**
         * @function removeMutator
         * @description Remove a mutator from the given constrainer by its name.
         * @param {string} name - The mutator name.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {this} - Itself for chaining.
         */
        removeMutator(name: string, constrainer?: string): this;
        /**
         * @function clearMutators
         * @description Remove all mutators attached to the given constrainer.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {this} - Itself for chaining.
         */
        clearMutators(constrainer?: string): this;
        /**
         * @function mutate
         * @template Type - The type of the value to mutate
         * @description Execute a mutator for the targeted constrainer and return the resulting value.
         * @param {ConstrainerMutatorProperties<Type>} [properties] - Context object, including the
         * `mutation` to execute, and the input `value` to mutate.
         * @return {Type} - The mutated result.
         */
        mutate<Type = any>(properties?: ConstrainerMutatorProperties<Type>): Type;
        /**
         * @function addSolver
         * @description Register a solver in the constrainer. Solvers typically execute after an event is fired to
         * ensure the constrainer's constraints are maintained. They process all objects in the constrainer's queue,
         * one after the other.
         * @param {ConstrainerAddCallbackProperties<ConstrainerSolver>} properties - Configuration object, including the
         * solver `callback` to be executed, the `name` of the solver to access it later, the name of the attached
         * `constrainer`, and the `priority` of the solver.
         * @return {this} - Itself for chaining.
         */
        addSolver(properties: ConstrainerAddCallbackProperties<ConstrainerSolver>): this;
        /**
         * @function removeSolver
         * @description Remove the given function from the constrainer's list of solvers.
         * @param {string} name - The solver's name.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {this} - Itself for chaining.
         */
        removeSolver(name: string, constrainer?: string): this;
        /**
         * @function clearSolvers
         * @description Remove all solvers attached to the constrainer.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @return {this} - Itself for chaining.
         */
        clearSolvers(constrainer?: string): this;
        /**
         * @function solveConstrainer
         * @description Solve the constrainer by executing all of its attached solvers. Each solver will be executed
         * on every object in the constrainer's queue, incrementing its number of passes in the process.
         * @param {ConstrainerCallbackProperties} [properties] - Options object to configure the context.
         * @return {this} - Itself for chaining.
         */
        solveConstrainer(properties?: ConstrainerCallbackProperties): this;
        /**
         * @function solveConstrainersForEvent
         * @description Solve all relevant constrainers for a given event context.
         * @param {ConstrainerCallbackProperties} [properties] - Event context to pass to solvers.
         * @return {this} - Itself for chaining.
         */
        solveConstrainersForEvent(properties?: ConstrainerCallbackProperties): this;
    }
interface GradumSelector {
        /**
         * @description The closest root to the element in the document (the closest ShadowRoot, or the document's head).
         */
        readonly closestRoot: StylesRoot;
        /**
         * @description Whether the element is selected or not. Setting it on an Element will accordingly toggle on it
         * the "selected" CSS class (or whichever default selected class was set for this element) and update the UI.
         */
        selected: boolean;
        defaultSelectedClasses: string | string[];
        readonly onSelected: Delegate<(value: boolean) => void>;
        /**
         * @function setStyle
         * @description Set a certain style attribute of the element to the provided value.
         * @param {keyof CSSStyleDeclaration} attribute - A string representing the style attribute to set.
         * @param {string | number} value - THe value to append.
         * @param {boolean} [instant=false] - If true, will set the fields directly. Otherwise, will set them on next
         * animation frame.
         * @returns {this} Itself, allowing for method chaining.
         */
        setStyle(attribute: keyof CSSStyleDeclaration, value: string | number, instant?: boolean): this;
        /**
         * @function appendStyle
         * @description Append the provided value to a certain style attribute.
         * @param {keyof CSSStyleDeclaration} attribute - A string representing the style attribute to append to.
         * @param {string | number} value - The value to append.
         * @param {string} [separator=", "] - The separator to use between the existing and new values.
         * @param {boolean} [instant=false] - If true, will set the fields directly. Otherwise, will set them on next
         * animation frame.
         * @returns {this} Itself, allowing for method chaining.
         */
        appendStyle(attribute: keyof CSSStyleDeclaration, value: string | number, separator?: string, instant?: boolean): this;
        /**
         * @function setStyles
         * @description Parses and applies the given CSS to the element's inline styles.
         * @param {StylesType} styles - Acceptable styles to set.
         * @param {boolean} [instant=false] - If true, will set the fields directly. Otherwise, will set them on next
         * animation frame.
         * @returns {this} Itself, allowing for method chaining.
         */
        setStyles(styles: StylesType, instant?: boolean): this;
    }
interface GradumElementTagNameMap {
        "gradum-button": GradumButton;
    }
interface GradumElementTagNameMap {
        "gradum-icon": GradumIcon;
    }
interface GradumElementTagNameMap {
        "gradum-rich-element": GradumRichElement;
    }
interface GradumElementTagNameMap {
        "gradum-icon-switch": GradumIconSwitch;
    }
interface GradumElementTagNameMap {
        "gradum-icon-toggle": GradumIconToggle;
    }
interface GradumElementTagNameMap {
        "gradum-inout": GradumInput;
    }
interface GradumElementTagNameMap {
        "gradum-numerical-inout": GradumNumericalInput;
    }
interface GradumElementTagNameMap {
        "gradum-select-element": GradumSelectElement;
    }
interface GradumElementTagNameMap {
        "gradum-content-switch": GradumContentSwitch;
    }
interface GradumElementTagNameMap {
        "gradum-drawer": GradumDrawer;
    }
interface GradumElementTagNameMap {
        "gradum-popup": GradumPopup;
    }
interface GradumElementTagNameMap {
        "gradum-dropdown": GradumDropdown;
    }
interface GradumElementTagNameMap {
        "gradum-marking-menu": GradumMarkingMenu;
    }
interface GradumElementTagNameMap {
        "gradum-select-wheel": GradumSelectWheel;
    }
interface GradumElementTagNameMap {
        "gradum-button-popup": GradumButtonPopup;
    }
interface GradumSelector {
        /**
         * @description Add one or more CSS classes to the element.
         * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
         * @returns {this} Itself, allowing for method chaining.
         */
        addClass(classes?: string | string[]): this;
        /**
         * @description Remove one or more CSS classes from the element.
         * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeClass(classes?: string | string[]): this;
        /**
         * @description Toggle one or more CSS classes in the element.
         * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
         * @param {boolean} force - (Optional) Boolean that turns the toggle into a one way-only operation. If set to false,
         * then the class will only be removed, but not added. If set to true, then token will only be added, but not removed.
         * @returns {this} Itself, allowing for method chaining.
         */
        toggleClass(classes?: string | string[], force?: boolean): this;
        /**
         * @description Check if the element's class list contains the provided class(es).
         * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
         * @return A boolean indicating whether the provided classes are included.
         */
        hasClass(classes?: string | string[]): boolean;
    }
interface GradumSelector extends Node {
    }
interface GradumSelector {
        /**
         * @description The child handler object associated with the node. It is the node itself (if it is handling
         * its children) or its shadow root (if defined). Set it to change the node where the children are added/
         * removed/queried from when manipulating the node's children.
         */
        childHandler: ChildHandler;
        /**
         * @description Static array of all the child nodes of the node.
         */
        readonly childNodesArray: Node[];
        /**
         * @description Static array of all the child elements of the node.
         */
        readonly childrenArray: Element[];
        /**
         * @description Static array of all the sibling nodes (including the node itself) of the node.
         */
        readonly siblingNodes: Node[];
        /**
         * @description Static array of all the sibling elements (including the element itself, if it is one) of the node.
         */
        readonly siblings: Element[];
        /**
         * @function bringToFront
         * @description Brings the element to the front amongst its siblings in the DOM.
         * @return {this} Itself for chaining.
         */
        bringToFront(): this;
        /**
         * @function sendToBack
         * @description Sends the element to the back amongst its siblings in the DOM.
         * @return {this} Itself for chaining.
         */
        sendToBack(): this;
        /**
         * @function remove
         * @description Removes the node from the document.
         * @returns {this} Itself, allowing for method chaining.
         */
        remove(): this;
        /**
         * @function addToParent
         * @description Add the element to the given parent node
         * @param {Node} parent - The parent node to attach the element to.
         * @param {number} [index] - The position at which to add the element relative to the parent's child list.
         * Leave undefined to add the element at the end.
         * @param {Node[] | NodeListOf<Node>} [referenceList=parent.childrenArray] - The child list to
         * use as computation reference for index placement. Defaults to the parent's `childrenArray`.
         * @returns {this} Itself, allowing for method chaining.
         */
        addToParent(parent: Node, index?: number, referenceList?: Node[] | NodeListOf<Node>): this;
        /**
         * @function addChild
         * @description Add one or more children to the element.
         * @param {Node | Node[]} [children] - Array of (or single) child nodes.
         * @param {number} [index] - The position at which to add the child relative to the parent's child list.
         * Leave undefined to add the child at the end.
         * @param {Node[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
         * use as computation reference for index placement. Defaults to the node's `childrenArray`.
         * @returns {this} Itself, allowing for method chaining.
         */
        addChild(children?: Node | Node[], index?: number, referenceList?: Node[] | NodeListOf<Node>): this;
        /**
         * @function remChild
         * @description Remove one or more children from the element.
         * @param {Node | Node[]} [children] - Array of (or single) child nodes.
         * @returns {this} Itself, allowing for method chaining.
         */
        remChild(children?: Node | Node[]): this;
        /**
         * @function addChildBefore
         * @description Add one or more children to the element before the provided sibling. If the
         * sibling is not found in the parent's children, the nodes will be added to the end of the parent's child list.
         * @param {Node | Node[]} [children] - Array of (or single) child nodes to insert before sibling.
         * @param {Node} [sibling] - The sibling node to insert the children before.
         * @returns {this} Itself, allowing for method chaining.
         */
        addChildBefore(children?: Node | Node[], sibling?: Node): this;
        /**
         * @function removeChildAt
         * @description Remove one or more child nodes from the element.
         * @param {number} [index] - The index of the child(ren) to remove.
         * @param {number} [count=1] - The number of children to remove.
         * @param {Node[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
         * use as computation reference for index placement and count. Defaults to the node's `childrenArray`.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeChildAt(index?: number, count?: number, referenceList?: Node[] | NodeListOf<Node>): this;
        /**
         * @function removeAllChildren
         * @description Remove all children of the node.
         * @param {Node[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
         * representing all the nodes to remove. Defaults to the node's `childrenArray`.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeAllChildren(referenceList?: Node[] | NodeListOf<Node>): this;
        /**
         * @function childAt
         * @description Returns the child of the parent node at the given index. Any number inputted (including
         * negatives) will be reduced modulo length of the list size.
         * @param {number} [index] - The index of the child to retrieve.
         * @param {Node[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
         * use as computation reference for index placement. Defaults to the node's `childrenArray`.
         * @returns {Node} The child at the given index, or `null` if the index is invalid.
         */
        childAt(index?: number, referenceList?: Node[] | NodeListOf<Node>): Node;
        /**
         * @function indexOfChild
         * @description Returns the index of the given child.
         * @param {Node} [child] - The child element to find.
         * @param {Node[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
         * use as computation reference for index placement. Defaults to the node's `childrenArray`.
         * @returns {number} The index of the child node in the provided list, or -1 if the child is not found.
         */
        indexOfChild(child?: Node, referenceList?: Node[] | NodeListOf<Node>): number;
        /**
         * @function hasChild
         * @description Identify whether one or more children belong to this parent node.
         * @param {Node | Node[]} [children] - Array of (or single) child nodes.
         * @returns {boolean} A boolean indicating whether the provided nodes belong to the parent or not.
         */
        hasChild(children?: Node | Node[]): boolean;
        /**
         * @function findInSubTree
         * @description Finds whether one or more children belong to this node.
         * @param {Node | Node[]} [children] - The child or children to check.
         * @returns {boolean} True if the children belong to the node, false otherwise.
         */
        findInSubTree(children?: Node | Node[]): boolean;
        /**
         * @function findInParents
         * @description Finds whether this node is within the given parent(s).
         * @param {Node | Node[]} [parents] - The parent(s) to check.
         * @returns {boolean} True if the node is within the given parents, false otherwise.
         */
        findInParents(parents?: Node | Node[]): boolean;
        /**
         * @function indexInParent
         * @description Finds whether one or more children belong to this node.
         * @param {Node[]} [referenceList=this.siblings] - The siblings list to use as computation
         * reference for index placement. Defaults to the node's `siblings`.
         * @returns {boolean} True if the children belong to the node, false otherwise.
         */
        indexInParent(referenceList?: Node[]): number;
        /**
         * @overload
         * @function closest
         * @description Finds the closest ancestor of the current element (or the current element itself) that matches
         * that is an instance of the element associated with the given tag name.
         * @param {Type} type - The (valid) tag name.
         * @returns {Element} The matching ancestor element, or null if no match is found.
         */
        closest<Tag extends ValidTag>(type: Tag): ValidElement<Tag>;
        /**
         * @overload
         * @function closest
         * @description Finds the closest ancestor of the current element (or the current element itself) that matches
         * the provided CSS selector.
         * @param {Type} type - The (valid) CSS selector string.
         * @returns {Element} The matching ancestor element, or null if no match is found.
         */
        closest<Tag extends string>(type: Tag): Element;
        /**
         * @overload
         * @function closest
         * @template {Element} Type - The type of element to find.
         * @description Finds the closest ancestor of the current element (or the current element itself) that is an
         * instance of the given class.
         * @param {new (...args: any[]) => Type} type - The class to match.
         * @returns {Element} The matching ancestor element, or null if no match is found.
         */
        closest<Type extends Element>(type: new (...args: any[]) => Type): Type;
    }
interface GradumSelector {
        /**
         * @description Execute a callback on the node while still benefiting from chaining.
         * @param {(el: this) => void} callback The function to execute, with 1 parameter representing the instance
         * itself.
         * @returns {this} Itself, allowing for method chaining.
         */
        execute(callback: ((el: this) => void)): this;
        apply(properties: Partial<this["element"]> & Record<string, any>): this;
        removeFields(keys: (keyof this["element"] | string)[]): this;
        getDefaults(defaults: (keyof this["element"] | string)[]): Partial<this["element"]> & Record<string, any>;
        getIntersection(other: Partial<this["element"]> & Record<string, any>): Partial<this["element"]> & Record<string, any>;
        getDifference(other: Partial<this["element"]> & Record<string, any>): Partial<this["element"]> & Record<string, any>;
        extract(keys: (keyof this["element"] | string)[]): Partial<this["element"]> & Record<string, any>;
        /**
         * @function applyDefaults
         * @description Apply default properties to the underlying object, with optional smart merging for
         * array-like keys. By default, merging will happen on all MVC properties that accept arrays (like
         * `operators`, `handlers`, `tools`, etc.) to allow for concatenation of such MVC pieces.
         *
         * @param {Record<string, any>} defaults - Key/value map of defaults to apply on the object.
         * @param {ApplyDefaultsOptions} [options] - Optional configuration for merging keys.
         * @returns {this} The same selector instance for chaining.
         *
         * @example
         * ```ts
         * const properties = {...};
         * gradum(properties).applyDefaults({
         *   tag: "my-el",
         *   view: MyElementView,
         *   tools: [selectTool, panTool],
         *   operators: KeyboardOperator
         * });
         * ```
         */
        applyDefaults(defaults: Partial<this["element"]> & Record<string, any>, options?: ApplyDefaultsOptions): this;
    }
interface GradumSelector {
        /**
         * @description Readonly shallow set of the reifects attached to this object.
         */
        readonly reifects: Set<StatefulReifect>;
        /**
         * @description The transition used by the element's show() and isShown methods. Directly modifying its
         * value will modify all elements' default showTransition. Unless this is the desired outcome, set it to a
         * new custom StatefulReifect.
         */
        showTransition: StatefulReifect<Shown>;
        /**
         * @description Boolean indicating whether the element is shown or not, based on its showTransition.
         */
        readonly isShown: boolean;
        /**
         * @description Show or hide the element (based on CSS) by transitioning in/out of the element's showTransition.
         * @param {boolean} b - Whether to show the element or not
         * @param options
         * @returns {this} Itself, allowing for method chaining.
         */
        show(b: boolean, options?: ReifectAppliedOptions<Shown>): this;
        /**
         * @function attachReifect
         * @description Attach one or more reifects to the object.
         * @param {StatefulReifect[]} reifects - The reifect(s) to attach.
         * @returns {this} - Itself, allowing for method chaining.
         */
        attachReifect(...reifects: StatefulReifect[]): this;
        /**
         * @function detachReifect
         * @description Detach one or more reifects from the object.
         * @param {StatefulReifect[]} reifects - The reifect(s) to detach.
         * @returns {this} - Itself, allowing for method chaining.
         */
        detachReifect(...reifects: StatefulReifect[]): this;
        /**
         * @function initializeReifect
         * @template {string | symbol | number} State - The type of the reifect's states.
         * @description Initializes the reifect at the given state for the corresponding object.
         * @param {StatefulReifect<State>} reifect - The reifect to initialize.
         * @param {State} state - The state to initialize to (if the reifect is not stateless).
         * @param {ReifectAppliedOptions<State>} [options] - Optional overrides for the default values.
         * Set to `null` to not set anything on the object.
         * @returns {this} - Itself, allowing for method chaining.
         */
        initializeReifect<State extends string | symbol | number>(reifect?: StatefulReifect<State>, state?: State, options?: ReifectAppliedOptions<State>): this;
        /**
         * @function applyReifect
         * @template {string | symbol | number} State - The type of the reifect's states.
         * @description Applies the reifect at the given state for the corresponding object.
         * @param {StatefulReifect<State>} reifect - The reifect to apply.
         * @param {State} state - The state to initialize to (if the reifect is not stateless).
         * @param {ReifectAppliedOptions<State>} [options] - Optional overrides for the default values.
         * Set to `null` to not set anything on the object.
         * @returns {this} - Itself, allowing for method chaining.
         */
        applyReifect<State extends string | symbol | number>(reifect: StatefulReifect<State>, state?: State, options?: ReifectAppliedOptions<State>): this;
        /**
         * @function toggleReifect
         * @template {string | symbol | number} State - The type of the reifect's states.
         * @description Toggles the reifect to the next state for the corresponding object.
         * @param {StatefulReifect<State>} reifect - The reifect to toggle.
         * @param {ReifectAppliedOptions<State>} [options] - Optional overrides for the default values.
         * Set to `null` to not set anything on the object.
         * @returns {this} - Itself, allowing for method chaining.
         */
        toggleReifect<State extends string | symbol | number>(reifect: StatefulReifect<State>, options?: ReifectAppliedOptions<State>): this;
        /**
         * @function reloadReifects
         * @description Reloads all reifects attached to this object. Doesn't recompute values.
         * @returns {this} - Itself, allowing for method chaining.
         */
        reloadReifects(): this;
        /**
         * @function reloadReifectsChainableStyles
         * @description Reloads all transitions attached to this object. Doesn't recompute values.
         * @returns {this} - Itself, allowing for method chaining.
         */
        reloadReifectsChainableStyles(applyInstantly?: boolean): this;
        /**
         * @function reifectEnabledState
         * @description Get the reifect enabled state of this object. If a reifect is provided, the enabled state of
         * the object for this specific reifect will be returned. otherwise, the global state of the object will
         * be returned.
         * @param {StatefulReifect} [reifect] - The target reifect.
         * @return {ReifectEnabledObject} - The enabled state.
         */
        reifectEnabledState(reifect?: StatefulReifect): ReifectEnabledObject;
        /**
         * @function enableReifect
         * @description Set the reifect enabled state of this object. If a reifect is provided, the enabled state of
         * the object for this specific reifect will be updated. otherwise, the global state of the object will
         * be updated
         * @param {boolean | ReifectEnabledObject} value - The new state.
         * @param {StatefulReifect} [reifect] - The target reifect.
         * @return {this} - Itself, allowing for method chaining.
         */
        enableReifect(value: boolean | ReifectEnabledObject, reifect?: StatefulReifect): this;
    }
