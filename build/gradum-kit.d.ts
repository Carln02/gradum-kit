import { Doc, YEvent, Array, Map as Map$1, AbstractType } from 'yjs';
export { AbstractType as YAbstractType, Array as YArray, YArrayEvent, Doc as YDoc, YEvent, Map as YMap, YMapEvent, Text as YText } from 'yjs';

/**
 * @type {AutoOptions}
 * @group Decorators
 * @category Augmentation
 *
 * @template Type - The type of the decorated property.
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
 * @property {number} [timeout]
 *  Duration in milliseconds after which the cached value automatically expires.
 *  Useful for time-based caching where values should refresh periodically.
 * @property {string | string[]} [onEvent]
 *  One or more event names (space-separated string or array) that, when fired on the instance,
 *  immediately clear the cache.
 *  This allows integration with custom event systems or reactive models.
 * @property {() => boolean | Promise<boolean>} [onCallback]
 *  Function (sync or async) periodically called to decide whether to invalidate the cache.
 *  If it returns `true`, the cache is cleared.
 * @property {number} [onCallbackFrequency]
 *  Frequency in milliseconds at which `onCallback` should be executed.
 *  Ignored if `onCallback` is not provided.
 * @property {string | Function | (string | Function)[]} [onFieldChange]
 *  One or more property names or methods to watch for changes.
 *  Whenever any of these fields or functions change, the cache for the decorated member is cleared.
 *  Can be a string, a function reference, or an array of both.
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
 * @template {(...args: any[]) => any} Type - The type of the wrapped function.
 * @description Wrap a function so its body runs only on the first call. Later calls skip the body and
 * return the first call's result.
 * @param {Type} fn - The function to wrap.
 * @returns {Type} A function with the same signature as `fn`, whose body runs at most once.
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
 * @type {KeyType}
 * @group Core Types
 * @category Primitives
 *
 * @description Any value usable as an object key. Key paths throughout the MVC layer — model data,
 * observers, {@link GradumNestedMap} — are arrays of these.
 */
type KeyType = string | number | symbol;
/**
 * @type {FlatKeyType}
 * @group Core Types
 * @category Primitives
 *
 * @description A whole key path collapsed into one value, so a nested entry can be addressed without an
 * array. Fully numeric paths flatten to a number; anything else to a `"k0|k1|k2"` string.
 */
type FlatKeyType = string | number;
/**
 * @type {FlexRect}
 * @group Core Types
 * @category Primitives
 *
 * @description A rectangle where every field is optional, for describing only the edges you care about.
 * Sides and dimensions may be mixed, and any that are omitted are left to the caller to infer.
 * @property {number} [top] - Distance from the top edge.
 * @property {number} [bottom] - Distance from the bottom edge.
 * @property {number} [left] - Distance from the left edge.
 * @property {number} [right] - Distance from the right edge.
 * @property {number} [x] - Horizontal origin.
 * @property {number} [y] - Vertical origin.
 * @property {number} [width] - Width of the rectangle.
 * @property {number} [height] - Height of the rectangle.
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
 * @type {Coordinate}
 * @group Core Types
 * @category Primitives
 *
 * @template Type - The type of each component. Defaults to `number`.
 * @description A pair of values on the x and y axes. Generic so the same shape can carry something other
 * than numbers, such as a coordinate per axis expressed as a range.
 * @property {Type} x - The horizontal component.
 * @property {Type} y - The vertical component.
 */
type Coordinate<Type = number> = {
    x: Type;
    y: Type;
};
/**
 * @type {PartialRecord}
 * @group Core Types
 * @category Primitives
 *
 * @template {keyof any} Property - The union of allowed keys.
 * @template Value - The type stored at each key.
 * @description A `Record` whose every key is optional. Use it to accept any subset of a known set of keys.
 */
type PartialRecord<Property extends keyof any, Value> = {
    [P in Property]?: Value;
};

/**
 * @group Components
 * @category Data Structures
 */
declare class Point {
    /**
     * @readonly
     * @description The point's x coordinate. Points are immutable — the arithmetic methods return new
     * points rather than changing this one.
     */
    readonly x: number;
    /**
     * @readonly
     * @description The point's y coordinate.
     */
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
    /**
     * @readonly
     * @description This point as a plain `{x, y}` object, detached from this instance.
     */
    get object(): Coordinate;
    /**
     * @description Determine whether this point is equal to the given coordinates.
     * @param {Coordinate} p - The coordinates to compare against.
     * @returns {boolean} Whether both coordinates match.
     */
    equals(p: Coordinate): boolean;
    /**
     * @description Determine whether this point is equal to the given coordinates.
     * @param {number} x - The x coordinate to compare against.
     * @param {number} y - The y coordinate to compare against.
     * @returns {boolean} Whether both coordinates match.
     */
    equals(x: number, y: number): boolean;
    /**
     * @function boundX
     * @description Clamp this point's x coordinate to a range.
     * @param {number} x1 - The lower bound.
     * @param {number} x2 - The upper bound.
     * @returns {number} The clamped x coordinate. This point is left unchanged.
     */
    boundX(x1: number, x2: number): number;
    /**
     * @function boundY
     * @description Clamp this point's y coordinate to a range.
     * @param {number} y1 - The lower bound.
     * @param {number} y2 - The upper bound.
     * @returns {number} The clamped y coordinate. This point is left unchanged.
     */
    boundY(y1: number, y2: number): number;
    /**
     * @function bound
     * @description Clamp both coordinates to the same range.
     * @param {number} n1 - The lower bound for both axes.
     * @param {number} n2 - The upper bound for both axes.
     * @returns {Point} A new clamped point. This point is left unchanged.
     */
    bound(n1: number, n2: number): Point;
    /**
     * @function bound
     * @description Clamp each coordinate to its own range.
     * @param {number} x1 - The lower bound for x.
     * @param {number} x2 - The upper bound for x.
     * @param {number} [y1=x1] - The lower bound for y. Defaults to the x bound.
     * @param {number} [y2=x2] - The upper bound for y. Defaults to the x bound.
     * @returns {Point} A new clamped point. This point is left unchanged.
     */
    bound(x1: number, x2: number, y1?: number, y2?: number): Point;
    /**
     * @description Add coordinates to this point
     * @param {number} n - The value to add to both x and y
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    add(n: number): Point;
    /**
     * @description Add coordinates to this point
     * @param {number} x - The value to add to the x coordinate
     * @param {number} y - The value to add to the y coordinate
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    add(x: number, y: number): Point;
    /**
     * @description Add coordinates to this point
     * @param {Coordinate} p - The coordinates to add
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    add(p: Coordinate): Point;
    /**
     * @description Subtract coordinates from this point
     * @param {number} n - The value to subtract from both x and y
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    sub(n: number): Point;
    /**
     * @description Subtract coordinates from this point
     * @param {number} x - The value to subtract from the x coordinate
     * @param {number} y - The value to subtract from the y coordinate
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    sub(x: number, y: number): Point;
    /**
     * @description Subtract coordinates from this point
     * @param {Coordinate} p - The coordinates to subtract
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    sub(p: Coordinate): Point;
    /**
     * @description Multiply coordinates of this point
     * @param {number} n - The value to multiply both x and y
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    mul(n: number): Point;
    /**
     * @description Multiply coordinates of this point
     * @param {number} x - The value to multiply the x coordinate
     * @param {number} y - The value to multiply the y coordinate
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    mul(x: number, y: number): Point;
    /**
     * @description Multiply coordinates of this point
     * @param {Coordinate} p - The coordinates to multiply
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    mul(p: Coordinate): Point;
    /**
     * @description Divide coordinates of this point
     * @param {number} n - The value to divide both x and y
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    div(n: number): Point;
    /**
     * @description Divide coordinates of this point
     * @param {number} x - The value to divide the x coordinate
     * @param {number} y - The value to divide the y coordinate
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    div(x: number, y: number): Point;
    /**
     * @description Divide coordinates of this point
     * @param {Coordinate} p - The coordinates to divide with
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    div(p: Coordinate): Point;
    /**
     * @description Mod coordinates of this point
     * @param {number} n - The value to mod both x and y
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    mod(n: number): Point;
    /**
     * @description Mod coordinates of this point
     * @param {number} x - The value to mod the x coordinate
     * @param {number} y - The value to mod the y coordinate
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    mod(x: number, y: number): Point;
    /**
     * @description Mod coordinates of this point
     * @param {Coordinate} p - The coordinates to mod with
     * @returns {Point} A new point holding the result. This point is left unchanged.
     */
    mod(p: Coordinate): Point;
    /**
     * @description Calculate the absolute value of the coordinates
     * @returns {Point} A new point with both coordinates made positive. This point is left unchanged.
     */
    get abs(): Point;
    /**
     * @description Get the maximum value between x and y coordinates
     * @returns {number} The larger of the two coordinates.
     */
    get max(): number;
    /**
     * @description Get the minimum value between x and y coordinates
     * @returns {number} The smaller of the two coordinates.
     */
    get min(): number;
    /**
     * @description Turn this point by an angle, about the origin or about another point.
     * @param {number} angle - The angle to turn by, in radians. Positive turns from the x axis towards the y.
     * @param {Coordinate} [around] - The point to turn around. Defaults to the origin, which turns this point
     * as a vector rather than as a position.
     * @returns {Point} A new point holding the result. This point is left unchanged.
     *
     * @example
     * ```ts
     * //A vector expressed in a box's own frame, brought back into screen space.
     * const screen = local.rotate(box.angleRad);
     * //A corner swung around the point it is pinned to.
     * const moved = corner.rotate(swept, pivot);
     * ```
     */
    rotate(angle: number, around?: Coordinate): Point;
    /**
     * @description The angle from this point to another, measured from the x axis.
     * @param {Coordinate} to - The point to measure towards.
     * @returns {number} The angle in radians, in (-π, π].
     */
    angleTo(to: Coordinate): number;
    /**
     * @description The angle swept around this point in going from one place to another — how far something
     * turned, treating this point as the pivot.
     *
     * The result is folded back into (-π, π]. Subtracting two raw angles instead would jump by a full turn
     * whenever the sweep crosses the seam directly behind the pivot, reporting a near-complete spin in the
     * opposite direction for what was a small movement.
     * @param {Coordinate} from - Where the sweep started.
     * @param {Coordinate} to - Where it ended.
     * @returns {number} The angle swept, in radians, in (-π, π].
     */
    angleBetween(from: Coordinate, to: Coordinate): number;
    /**
     * @readonly
     * @description The squared distance from the origin to this point. Cheaper than {@link Point.length}
     * since it skips the square root — use it when comparing magnitudes.
     */
    get length2(): number;
    /**
     * @readonly
     * @description The distance from the origin to this point.
     */
    get length(): number;
    /**
     * @function dot
     * @description Compute the dot product of this point and another, treating both as vectors.
     * @param {Point} p - The other vector.
     * @returns {number} The dot product. Zero means the two are perpendicular.
     */
    dot(p: Point): number;
    /**
     * @description Create a copy of the current point
     * @returns {Point} A new point with the same coordinates.
     */
    copy(): Point;
    /**
     * @description Get the coordinates as an array
     * @returns {number[]} A two-element array, `[x, y]`.
     */
    arr(): number[];
    /**
     * @function positionOnSegment
     * @description Find how far along a segment this point projects, as a fraction from its start to its
     * end. Useful for snapping a position onto a line.
     * @param {Point} start - The segment's start.
     * @param {Point} end - The segment's end.
     * @returns {number} A value from `0` (at the start) to `1` (at the end), clamped to that range.
     * Returns `0` for a zero-length segment.
     */
    positionOnSegment(start: Point, end: Point): number;
    /**
     * @function linearInterpolation
     * @static
     * @description Interpolate between two points.
     * @param {Point} start - The point at `t = 0`.
     * @param {Point} end - The point at `t = 1`.
     * @param {number} t - The interpolation fraction. Values outside `0`–`1` extrapolate past the ends.
     * @returns {Point} The interpolated point.
     */
    static linearInterpolation(start: Point, end: Point, t: number): Point;
    /**
     * @function toString
     * @description Serialize this point to a JSON string, in the form {@link Point.fromString} reads.
     * @returns {string} The serialized point, e.g. `'{"x":1,"y":2}'`.
     */
    toString(): string;
    /**
     * @overload
     * @function from
     * @static
     * @group Components
     * @category Data Structures
     *
     * @description Parse a point from a JSON string produced by {@link Point.toString}.
     * @param {string} value - The string to parse.
     * @returns {Point} The parsed point, or `undefined` if the string is not valid JSON holding numeric
     * `x` and `y` fields.
     */
    static from(value: string): Point;
    /**
     * @overload
     * @function from
     * @static
     * @group Components
     * @category Data Structures
     *
     * @description Read a value as a point, checking it first. Accepts everything the constructor does — a
     * number standing for both axes, an `x`/`y` pair, a two-number array, an event's `clientX`/`clientY` —
     * and hands back `undefined` for anything that is not one of those, where the constructor would build a
     * point out of `NaN`s. A value that is already a point is returned as-is, points being immutable.
     * @param {number | Coordinate | [number, number] | {clientX: number, clientY: number}} value - The value
     * to read.
     * @returns {Point} The point, or `undefined` when the value holds no usable coordinates.
     *
     * @example
     * ```ts
     * Point.from(50);                //(50, 50)
     * Point.from({x: 1, y: 2});      //(1, 2)
     * Point.from({width: 10});       //undefined, where new Point({width: 10}) gives (NaN, NaN)
     * ```
     */
    static from(value: number | Coordinate | [number, number] | {
        clientX: number;
        clientY: number;
    }): Point;
    /**
     * @function fromString
     * @description Parse a point from a JSON string produced by {@link Point.toString}. Delegates to
     * {@link Point.from}; it exists as an instance method because {@link GradumInput} discovers a value's
     * parser by looking for `fromString` on the value itself, which a static member would not satisfy.
     * @param {string} value - The string to parse.
     * @returns {Point} The parsed point, or `undefined` if the string is not valid JSON holding numeric
     * `x` and `y` fields.
     */
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
     * @function add
     * @description Register a callback. Adding the same callback twice has no effect.
     * @param {CallbackType} callback - The callback to register.
     */
    add(callback: CallbackType): void;
    /**
     * @function remove
     * @description Unregister a callback.
     * @param {CallbackType} callback - The callback to unregister.
     * @returns {boolean} Whether the callback was registered and has been removed.
     */
    remove(callback: CallbackType): boolean;
    /**
     * @function has
     * @description Check whether a callback is registered.
     * @param {CallbackType} callback - The callback to look for.
     * @returns {boolean} Whether the callback is registered.
     */
    has(callback: CallbackType): boolean;
    /**
     * @function fire
     * @description Invoke every registered callback with the given arguments. A callback that throws is
     * logged and skipped, so one failure does not stop the rest.
     * @param {...Parameters<CallbackType>} args - Arguments passed to each callback.
     * @returns {ReturnType<CallbackType>} The last value returned by a callback, ignoring those that
     * returned `undefined`.
     */
    fire(...args: Parameters<CallbackType>): ReturnType<CallbackType>;
    /**
     * @function clear
     * @description Unregister every callback.
     */
    clear(): void;
}
/**
 * @class Delegate
 * @group Components
 * @category Data Structures
 *
 * @template {(...args: any[]) => any} CallbackType - The type of callbacks accepted by the delegate.
 * @description A set of callbacks kept together and fired as one, used throughout the library wherever a
 * component announces something (`onChanged`, `onSelected`, ...). Subscribe with {@link Delegate.add} and
 * drop the subscription with {@link Delegate.remove}. Unlike its plain counterpart, this one announces
 * its own subscriptions through {@link Delegate.onAdded}.
 */
declare class Delegate<CallbackType extends (...args: any[]) => any> extends SimpleDelegate<CallbackType> {
    /**
     * @description Fired whenever a callback is registered on this delegate, with the new callback as its
     * argument. Use it to react to something starting to listen.
     */
    onAdded: SimpleDelegate<(callback: CallbackType) => void>;
    /**
     * @function add
     * @description Register a callback, then fire {@link Delegate.onAdded} with it.
     * @param {CallbackType} callback - The callback to register.
     */
    add(callback: CallbackType): void;
}

/**
 * @internal
 * @class GradumNestedMapNode
 * @description One level of a {@link GradumNestedMap}. Holds either child nodes or leaf values.
 */
declare class GradumNestedMapNode<KeyType, ValueType> extends Map<KeyType, ValueType> {
}
/**
 * @class GradumNestedMap
 * @group Components
 * @category Data Structures
 *
 * @template ValueType - The type of stored values.
 * @template KeyType - The type of keys at each level of the path. Defaults to `string | symbol | number`.
 * @description A map of arbitrary nesting depth, addressed by a `...keys` path rather than a single key.
 * Entries can also be reached by a flat key that collapses a whole path into one value, so a nested
 * structure can be indexed as if it were flat.
 */
declare class GradumNestedMap<ValueType = any, KeyType = string | symbol | number> {
    /**
     * @protected
     * @readonly
     * @description The root of the nested structure holding this map's entries.
     */
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
 * @category Model
 *
 * @extends GradumNestedMap
 * @template DataType - The type of data handled by the observer.
 * @template {object} ComponentType - The instance type created/managed by the observer.
 * @template {KeyType} DataKeyType - The key type used at each level of the path.
 * @description Generic observer that keeps a set of component instances organized by key path.
 * Useful to maintain UI components or other per-entry objects synchronized with a data source
 * ({@link GradumModel}).
 *
 */
declare class GradumObserver<DataType = any, ComponentType extends object = any, DataKeyType extends KeyType = KeyType> extends GradumNestedMap<ComponentType, DataKeyType> {
    protected _isInitialized: boolean;
    private readonly prevData;
    private replaceOnUpdate;
    /**
     * @readonly
     * @description Delegate called when a change is reported at a key path for which no component instance exists yet.
     * Handlers may return a newly-created component instance, which will be stored and passed to subsequent
     * `onUpdated` calls.
     */
    readonly onAdded: Delegate<(data: DataType, self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: DataKeyType[]) => ComponentType | void>;
    /**
     * @readonly
     * @description Delegate called when a change is reported at a key path that already has an associated instance.
     */
    readonly onUpdated: Delegate<(data: DataType, instance: ComponentType, self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: DataKeyType[]) => void>;
    /**
     * @readonly
     * @description Delegate called when a key path is reported as deleted.
     */
    readonly onDeleted: Delegate<(data: DataType, instance: ComponentType, self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: DataKeyType[]) => void>;
    /**
     * @readonly
     * @description Delegate fired once when the observer is initialized. Useful for initial population.
     */
    readonly onInitialize: Delegate<(self: GradumObserver<DataType, ComponentType, DataKeyType>) => void>;
    /**
     * @readonly
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
     * @readonly
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

/**
 * @type {GradumModelProxy}
 * @group MVC
 * @category Model
 *
 * @template {object} DataType - The type of the wrapped data.
 * @template {KeyType} IdType - The type of the data's ID.
 * @description Plain data that reads and writes through a {@link GradumModel}, as returned by
 * {@link GradumModel.from}. Use the keys of the data directly; reach the backing model through `$model`.
 * @property {GradumModel} $model - The model backing this data.
 */
type GradumModelProxy<DataType extends object = any, IdType extends KeyType = any> = DataType & {
    readonly $model: GradumModel<DataType, KeyType, IdType>;
};
/**
 * @type {GradumModelProperties}
 * @group MVC
 * @category Model
 *
 * @template DataType - The type of data stored in the model.
 * @template IdType - The type of the data's ID.
 * @description Configuration object used when creating a {@link GradumModel}.
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
 * @type {GradumObserverProperties}
 * @group MVC
 * @category Model
 *
 * @template DataType - The type of data handled by the observer.
 * @template {object} ComponentType - The instance type created and managed by the observer.
 * @template {KeyType} DataKeyType - The per-item key type.
 * @description Options and lifecycle callbacks used to create a new {@link GradumObserver}.
 * *Note: `self` is the second argument of `onAdded` but the third of `onUpdated` and `onDeleted`, which take
 * the existing instance in second place.*
 * @property {new (...args: any[]) => GradumObserver<DataType, ComponentType, DataKeyType>} [customConstructor] -
 * Observer subclass to instantiate instead of the default {@link GradumObserver}.
 * @property {number} [depth] - How many levels below the attached path to watch. Defaults to the depth
 * implied by the key path the observer is registered on.
 * @property {boolean} [initialize] - If `true`, the observer is initialized on creation, so it immediately
 * reports every entry already present.
 * @property {(data: DataType, self: GradumObserver, ...keys: KeyType[]) => ComponentType | void} [onAdded] -
 * Called when a change is reported at a key path with no instance yet. Return an instance to have it stored
 * and handed back to later callbacks.
 * @property {(data: DataType, instance: ComponentType, self: GradumObserver, ...keys: KeyType[]) => void} [onUpdated] -
 * Called when an entry that already has an instance changes.
 * @property {(data: DataType, instance: ComponentType, self: GradumObserver, ...keys: KeyType[]) => void} [onDeleted] -
 * Called when an entry is removed.
 * @property {(prevData: DataType, newData: DataType, instance: ComponentType, self: GradumObserver, ...keys: KeyType[]) => boolean} [replaceOnUpdate] -
 * Called before `onUpdated`. Return `true` to destroy the existing instance and create a fresh one through
 * `onAdded` instead of updating it in place.
 * @property {(self: GradumObserver) => void} [onInitialize] - Called when the observer is initialized.
 * @property {(self: GradumObserver) => void} [onDestroy] - Called when the observer is destroyed.
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

/**
 * @internal
 * @callback SignalSubscriber
 * @description Signature for a signal change subscriber. Registered through {@link SignalEntry.sub}
 * and called after the signal's value changes.
 */
type SignalSubscriber = () => void;
/**
 * @type {SignalEntry}
 * @group Decorators
 * @category Signal
 *
 * @template Type - The type of the value held by the signal.
 * @description The read/write/subscribe surface shared by every signal. {@link SignalBox} adds
 * the ergonomic wrappers on top of this.
 * @property {() => Type} get - Read the current value.
 * @property {(value: Type) => void} set - Store a new value. Subscribers run only if the value actually changed.
 * @property {(updater: (previous: Type) => Type) => void} update - Store a new value derived from the previous one.
 * @property {(fn: SignalSubscriber) => () => void} sub - Subscribe to change notifications. Returns a function that
 * unsubscribes.
 * @property {() => void} emit - Notify subscribers without changing the value. Use it after mutating structural
 * data in place, which `set` cannot detect.
 *
 * @example
 * ```ts
 * const count: SignalEntry<number> = signal(0);
 * const unsub = count.sub(() => console.log("count:", count.get()));
 * count.set(1); // logs "count: 1"
 * count.update(c => c + 1); // logs "count: 2"
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
 * @template Type - The type of the value held by the signal.
 * @description A {@link SignalEntry} that can also be used directly as its underlying value. It
 * coerces to the inner value in string, number, and JSON contexts, so it can usually be dropped in
 * wherever the raw value was expected.
 * @property {Type} value - The current value. Mirrors `get()` and `set()`.
 * @property {() => Type} toJSON - The raw value, used by `JSON.stringify`.
 * @property {() => Type} valueOf - The raw value, used in arithmetic and comparison.
 * @property {(hint: "default" | "number" | "string") => string | number} [Symbol.toPrimitive] - Coerces to a number
 * for the `"number"` hint, and to a string for `"string"` and `"default"`.
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
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @description Holds model-level logic that would otherwise crowd the model itself. A handler sees only
 * `this.model` — no element and no view — so use it for computations and edits over the model's data, and
 * reach for a {@link GradumOperator} when the DOM is involved. Register one with the `@handler` decorator.
 */
declare class GradumHandler<ModelType extends GradumModel = GradumModel> {
    /**
     * @description The key of the handler. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the handler's class name is MyElementSomethingHandler, the key would
     * default to "something".
     */
    keyName: string;
    /**
     * @description The model this handler operates on. Assigned by the MVC wiring when the handler is
     * registered, so it is set by the time `initialize` runs.
     */
    model: ModelType;
    /**
     * @constructor
     * @description Create a handler. Handlers are normally constructed without arguments — the MVC wiring
     * binds {@link GradumHandler.model} when the handler is registered on its model.
     * @param {ModelType} [model] - The model to bind. Omit it to let the MVC wiring bind one on registration.
     */
    constructor(model?: ModelType);
    /**
     * @function setup
     * @description Called in the constructor. Use for setup that should happen at instantiation,
     * before `this.initialize()` is called.
     * @protected
     */
    protected setup(): void;
}

/**
 * @internal
 * @type {ObserverData}
 * @description One observer registration on a model: the observer itself plus the key path it watches.
 * @property {GradumObserver} observer - The registered observer.
 * @property {KeyType[]} keys - The key path it is attached to. May contain `GradumModel.ALL`.
 * @property {boolean} [deep] - Whether it also fires for levels deeper than the registered path.
 */
type ObserverData<DataType = any, ComponentType extends object = any, DataKeyType extends KeyType = KeyType> = {
    observer: GradumObserver<DataType, ComponentType, DataKeyType>;
    keys: KeyType[];
    deep?: boolean;
};
/**
 * @internal
 * @type {ListenerData}
 * @description One key-path listener registration on a model, used to relay changes from nested models.
 * @property {(keys: KeyType[], value: any) => void} listener - Called with the changed path and its new value.
 * @property {KeyType[]} keys - The key path being listened to.
 */
type ListenerData = {
    listener: (keys: KeyType[], value: any) => void;
    keys: KeyType[];
};
/**
 * @class GradumModel
 * @group MVC
 * @category Model
 *
 * @template DataType - The type of the data held in the model.
 * @template {KeyType} DataKeyType - The type of the data's keys.
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
    /**
     * @function from
     * @static
     * @template {object} DataType - The type of the data to wrap.
     * @template {KeyType} IdType - The type of the data's ID.
     * @description Wrap plain data in a proxy that reads and writes through a model, so the data can be used
     * directly while still producing signals. Reach the underlying model through the proxy's `$model` key.
     * Assigning an unknown key creates a signal for it.
     * @param {DataType} [data={}] - The data to wrap.
     * @param {IdType} [id] - The ID to give the backing model.
     * @returns {GradumModelProxy<DataType, IdType>} The proxied data.
     */
    static from<DataType extends object = any, IdType extends KeyType = any>(data?: DataType, id?: IdType): GradumModelProxy<DataType, IdType>;
    /**
     * @function create
     * @static
     * @description Instantiate a model, then optionally initialize it and make its signals. The return type
     * follows the class it is called on, so `GradumYModel.create(...)` yields a {@link GradumYModel} with its
     * Y-specific members intact.
     *
     * *Note: the callee is read through `this["prototype"]` rather than `InstanceType<this>`. The latter
     * instantiates this class' generics with their constraints (`object`, `KeyType`, `unknown`) instead of
     * their `any` defaults, which breaks inference at every call site.*
     * @template {{prototype: GradumModel}} This - The class `create` was called on.
     * @param {GradumModelProperties} [properties={}] - Optional initialization properties.
     * @returns {GradumModel} The created model, typed as the class this was called on.
     */
    static create<This extends {
        prototype: GradumModel;
    }>(this: This, properties?: GradumModelProperties): This["prototype"];
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
    /**
     * @description Delegate fired when this model is pointed at different data. Receives the previous data
     * followed by the new data. Use it to set up watchers that depend on `this.data`.
     */
    readonly onDataChanged: Delegate<(oldData: any, newData: any) => void>;
    /**
     * @description Hook invoked by {@link GradumModel.fireCallback}. Assign it to route named callbacks from
     * the model out to whatever owns it.
     */
    fireCallbackHook: (key: string, ...values: any[]) => void;
    /**
     * @protected
     * @description Whether {@link GradumModel.initialize} has already run on this model.
     */
    protected isInitialized: boolean;
    private readonly signals;
    /**
     * @protected
     * @readonly
     * @description Every observer attached to this model, with the key path each one watches.
     */
    protected readonly changeObservers: Set<ObserverData<DataEntryType, ComponentType, DataKeyType>>;
    /**
     * @protected
     * @readonly
     * @description Child models created for nested keys, one per key that has been nested.
     */
    protected readonly nestedModels: Map<DataKeyType, GradumModel>;
    /**
     * @protected
     * @description Listeners relaying changes from nested models up to this one.
     */
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
     * @returns {boolean} `true` if an entry exists at that flat key.
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
     * @readonly
     * @description All keys currently present in the model.
     */
    get keys(): DataKeyType[];
    /**
     * @readonly
     * @description All values in the model, in the order of {@link GradumModel.keys}.
     */
    get values(): any[];
    /**
     * @readonly
     * @description Number of entries in the model.
     */
    get dataSize(): number;
    /**
     * @function flatSize
     * @description Return the total number of entries reachable from this model at the given depth.
     * @param {number} depth - How many levels deep to count.
     * @returns {number} The number of entries at that depth, counting every branch.
     */
    flatSize(depth: number): number;
    /**
     * @protected
     * @function diffCheck
     * @description Whether two data containers are similar enough to be swapped in place by
     * {@link GradumModel.diffAction} rather than triggering a full clear and re-initialize. True for two plain
     * objects, two arrays, or two Maps.
     * @param {DataType} oldData - The data being replaced.
     * @param {DataType} newData - The data to adopt.
     * @returns {boolean} `true` if the swap can be done in place.
     */
    protected diffCheck(oldData: DataType, newData: DataType): boolean;
    /**
     * @protected
     * @function diffAction
     * @description Swap in new data while keeping existing nested models and signals alive, re-pointing each
     * child at its counterpart in the new data instead of tearing the tree down. Only called when
     * {@link GradumModel.diffCheck} accepts the pair.
     * @param {DataType} oldData - The data being replaced.
     * @param {DataType} newData - The data to adopt.
     */
    protected diffAction(oldData: DataType, newData: DataType): void;
    /**
     * @description Iterate over `[key, value]` pairs.
     */
    [Symbol.iterator](): IterableIterator<[DataKeyType, any]>;
    /**
     * @function entries
     * @description Return all `[key, value]` pairs in the model.
     * @returns {[KeyType, any][]} The pairs, in the order of {@link GradumModel.keys}.
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
     * @returns {object | DataType} A plain copy of the data, safe to pass to `JSON.stringify`.
     */
    toJSON(): object | DataType;
    /**
     * @function makeSignal
     * @template Type - The type of the signal's value.
     * @description Return an existing reactive {@link SignalBox} for the given key, or create one if absent.
     * The signal reads via {@link get} and writes via {@link set}.
     * @param {KeyType} key - The key to create a signal for.
     * @returns {SignalBox<Type>} The signal for that key. Reading or writing it keeps the model's data in sync.
     */
    makeSignal<Type = any>(key: DataKeyType): SignalBox<Type>;
    /**
     * @function makeSignal
     * @template Type - The type of the signal's value.
     * @description Return an existing reactive {@link SignalBox} for the given key path, or create one if absent.
     * The last key in the path is the signal's target; preceding keys navigate to the parent nested model.
     * The signal reads via {@link get} and writes via {@link set}.
     * @param {...KeyType[]} keys - Key path, with the last key as the signal target.
     * @returns {SignalBox<Type>} The signal for that key path. Reading or writing it keeps the model's data in sync.
     */
    makeSignal<Type = any>(...keys: KeyType[]): SignalBox<Type>;
    /**
     * @function makeSignals
     * @template Type - The type of the signals' values.
     * @description Return reactive {@link SignalBox} instances for multiple keys at the given path.
     * Pass {@link GradumModel.ALL} at any level of the path to expand all entries at that level.
     * @param {...KeyType[]} keys - Key path to the signal targets. Use `ALL` at any level to target all entries there.
     * @returns {SignalBox<Type>[]} One signal per key at that path, in the order the keys appear.
     */
    makeSignals<Type = any>(...keys: KeyType[]): SignalBox<Type>[];
    /**
     * @function getSignal
     * @description Retrieve an existing {@link SignalBox} for the given key, or `undefined` if none exists.
     * @param {KeyType} key - The key whose signal to retrieve.
     * @returns {SignalBox<any>} The existing signal, or `undefined` if the key has none.
     */
    getSignal(key: DataKeyType): SignalBox<any>;
    /**
     * @function getSignal
     * @description Retrieve an existing {@link SignalBox} for the given key path, or `undefined` if none exists.
     * The last key in the path is the signal's target; preceding keys navigate to the parent nested model.
     * @param {...KeyType[]} keys - Key path, with the last key as the signal target.
     * @returns {SignalBox<any>} The existing signal, or `undefined` if the key path has none.
     */
    getSignal(...keys: KeyType[]): SignalBox<any>;
    /**
     * @function nestAll
     * @description Return `[this]`.
     * @returns {[this]} This model, wrapped in an array so the result matches the other overloads.
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
     * @returns {GradumModel} The nested model at that key, created on first access and reused after.
     */
    nest<NestedDataType = any, NestedKeyType extends KeyType = any>(key: DataKeyType): GradumModel<NestedDataType, NestedKeyType>;
    /**
     * @function nest
     * @description Create or retrieve a single nested {@link GradumModel} at the given key path.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     * @returns {GradumModel} The nested model at that key path, created on first access and reused after.
     */
    nest<NestedDataType = any, NestedKeyType extends KeyType = any>(...keys: KeyType[]): GradumModel<NestedDataType, NestedKeyType>;
    /**
     * @function nest
     * @description Create or retrieve a single nested {@link GradumModel} at the given key path,
     * with custom initialization properties.
     * @param {...[...KeyType[], GradumModelProperties]} keysAndProperties - Key path followed by optional properties.
     * @returns {GradumModel} The nested model at that key path, created on first access and reused after.
     */
    nest<NestedDataType = any, NestedKeyType extends KeyType = any>(...keysAndProperties: [...KeyType[], GradumModelProperties]): GradumModel<NestedDataType, NestedKeyType>;
    /**
     * @function getNested
     * @description Return `this`.
     * @returns {GradumModel} This model, so an empty path resolves to the root.
     */
    getNested(): GradumModel;
    /**
     * @function getNested
     * @description Retrieve an already-created nested model at the given key, or `undefined` if none exists.
     * @param {KeyType} key - The key of the nested model.
     * @returns {GradumModel | undefined} The nested model, or `undefined` if that key was never nested.
     */
    getNested(key: DataKeyType): GradumModel;
    /**
     * @function getNested
     * @description Retrieve an already-created nested model at the given key path, or `undefined` if none exists.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     * @returns {GradumModel | undefined} The nested model, or `undefined` if that path was never nested.
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
     * @returns {GradumObserver} The attached observer. Keep the reference to read its instances or destroy it later.
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
     * @returns {GradumObserver} The attached observer. Keep the reference to read its instances or destroy it later.
     */
    generateDeepObserver(properties?: GradumObserverProperties<DataEntryType, ComponentType, DataKeyType>, ...keys: KeyType[]): GradumObserver<DataEntryType, ComponentType, DataKeyType>;
    /**
     * @protected
     * @function initializeObserverOnPath
     * @description Walk the data along an observer's key path and report every existing entry to it, so an
     * observer attached to already-populated data still sees what is there. Paths containing
     * {@link GradumModel.ALL} fan out across every entry at that level.
     * @param {any} data - The data to walk.
     * @param {GradumObserver} observer - The observer to notify.
     * @param {KeyType[]} keys - The remaining key path to walk.
     * @param {KeyType[]} prefixKeys - The path already walked, passed back to the observer.
     */
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
     * @returns {FlatKeyType} The flat key: a number for a fully numeric path, otherwise a `"k0|k1"` string.
     */
    flattenKey(...keys: KeyType[]): FlatKeyType;
    /**
     * @function scopeKey
     * @description Convert a flat string key back into a key path. Reverses the string form of {@link flattenKey}.
     * Segments starting with `"@@"` are decoded back to symbols.
     * @param {string} flatKey - The flat string key to convert.
     * @returns {KeyType[]} The key path the flat key was built from.
     */
    scopeKey(flatKey: string): KeyType[];
    /**
     * @function scopeKey
     * @description Convert a numeric global index back into a numeric key path.
     * Reverses the numeric form of {@link flattenKey}.
     * @param {number} flatKey - The numeric index to convert.
     * @param {number} depth - The depth of the key path to reconstruct.
     * @returns {KeyType[]} The numeric key path that global index maps to at the given depth.
     */
    scopeKey(flatKey: number, depth: number): KeyType[];
    /**
     * @function getHandler
     * @description Retrieves the attached MVC handler with the given key.
     * By default, unless manually defined in the handler, if the element's class name is MyElement
     * and the handler's class name is MyElementSomethingHandler, the key would be "something".
     * @param {string} key - The handler's key.
     * @returns {GradumHandler} The handler registered under that key, or `undefined` if there is none.
     */
    getHandler(key: string): GradumHandler;
    /**
     * @function addHandler
     * @description Registers a GradumHandler for the given key.
     * @param {GradumHandler} handler - The handler instance to register.
     */
    addHandler(handler: GradumHandler): void;
    /**
     * @function setDataWithoutInitializing
     * @description Point the model at new data without running {@link GradumModel.initialize} on it, so
     * observers and signals are not re-created. Use it when the caller will initialize at a moment of its
     * own choosing; prefer assigning `data` otherwise.
     * @param {DataType} data - The data to adopt.
     */
    setDataWithoutInitializing(data: DataType): void;
    /**
     * @function fireCallback
     * @description Fire a named callback through {@link GradumModel.fireCallbackHook}. Does nothing if no
     * hook has been assigned.
     * @param {string} key - The name of the callback to fire.
     * @param {...any[]} values - Arguments forwarded to the hook.
     */
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
    /**
     * @constructor
     * @description Create an emitter, optionally bound to a model so key-path events can be fired against it.
     * @param {ModelType} [model] - The model whose key changes this emitter relays.
     */
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
     * @returns {FlatKeyType} The flat key, suitable for use as a map key.
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
 * @type {GradumViewProperties}
 * @group MVC
 * @category View
 *
 * @template {object} ElementType - The type of the element the view renders.
 * @template {GradumModel} ModelType - The element's model type.
 * @template {GradumEmitter} EmitterType - The element's emitter type.
 * @description Properties used to construct a {@link GradumView}.
 * @property {ElementType} element - The element this view renders into.
 * @property {ModelType} [model] - The model the view reads from. Omit for a view with no state of its own.
 * @property {EmitterType} [emitter] - The emitter shared with the element and its operators.
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
 * @template {object} ElementType - The type of the main component.
 * @template {GradumView} ViewType - The element's MVC view type.
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @template {GradumEmitter} EmitterType - The element's MVC emitter type.
 * @description The MVC base operator class. Its main job is to handle some part of (or all of) the logic of the
 * component. It has access to the element, the model to read and write data, the view to update the UI, and the
 * emitter to listen for changes in the model or any other internal events. It can only communicate with other
 * operators via the emitter (by firing or listening for changes on a certain key).
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
    /**
     * @constructor
     * @description Create an operator bound to an element. The view, model, and emitter default to the
     * element's own, so an operator shares them rather than owning any state itself.
     * @param {GradumOperatorProperties} properties - The element to attach to, plus optional view, model, and
     * emitter overrides.
     */
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
 * @category Data Structures
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
     * @description Create a listener from its configuration. A {@link GradumSelector} passed as `target`
     * is unwrapped to the element it wraps.
     * @param {ListenerProperties<TargetType, CallbackType>} properties - Listener configuration.
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
 * @category Data Structures
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
     * @description Flattened array of all listeners in the set.
     * @readonly
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
 * @group GradumSelector
 * @category Events
 *
 * @description Enum dictating the propagation of an event.
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
 * @callback HitResolver
 * @group GradumSelector
 * @category Events
 *
 * @description Finds the objects an element is displaying at a screen position. Assign one to an element
 * whose contents the DOM cannot see into — a canvas, a WebGL surface — and the objects it returns join the
 * event dispatch as if they were children of it. See {@link GradumSelector.hitResolver}.
 * @param {Point} position - The screen position to test.
 * @param {Event} event - The event being dispatched, for resolvers that answer differently per event.
 * @returns {object[]} The objects at that position, topmost first. Return an empty array for a miss.
 */
type HitResolver = (position: Point, event: Event) => object[];
/**
 * @type {PreventDefaultOptions}
 * @group GradumSelector
 * @category Events
 *
 * @description Options for {@link GradumSelector.preventDefault}, which prevents default browser behaviors for
 * selected event types and can optionally stop propagation.
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
 * @group GradumSelector
 * @category Events
 * @description Default set of basic input event types typically handled by {@link GradumSelector.preventDefault}.
 */
declare const BasicInputEvents: readonly ["mousedown", "mouseup", "mousemove", "click", "dblclick", "contextmenu", "dragstart", "selectstart", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "wheel"];
/**
 * @group GradumSelector
 * @category Events
 * @description Event types that should usually be registered as **non-passive** when you intend to call
 *  * `preventDefault()` (e.g., scroll/touch/pointer interactions).
 */
declare const NonPassiveEvents: readonly ["wheel", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointercancel"];
/**
 * @type {ListenerProperties}
 * @group Components
 * @category Data Structures
 *
 * @template {Node} TargetType - The type of the event target.
 * @template {ListenerCallback<TargetType>} CallbackType - The type of the callback executed by this listener.
 * @description Configuration object used to construct a {@link Listener}.
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
 * @category Data Structures
 *
 * @extends ListenerProperties
 * @template {Node} TargetType - The type of the event target.
 * @template {ListenerCallback<TargetType>} CallbackType - The type of the callback executed by this listener.
 * @description A partial {@link ListenerProperties} used as a search pattern by {@link Listener.match}.
 * Only the fields present are compared, so an empty pattern matches every listener.
 * @property {string[]} [optionsToSkip] - Option keys to ignore when comparing `options`.
 */
type MatchListenerProperties<TargetType extends Node = Node, CallbackType extends ListenerCallback<TargetType> = ListenerCallback<TargetType>> = Partial<ListenerProperties<TargetType, CallbackType>> & {
    optionsToSkip?: string[];
};
/**
 * @callback ListenerCallback
 * @group Components
 * @category Data Structures
 * @template {Node} Type - The type of the event target.
 * @description Callback signature for listeners. Receives the native event and the resolved target.
 * @param {Event} e - The native event.
 * @param {Type} el - The target element/node the listener is bound to.
 * @returns {Propagation | any} A propagation directive (or any value).
 */
type ListenerCallback<Type extends Node = Node> = ((e: Event, el: Type) => Propagation | any);
/**
 * @type {ListenerOptions}
 * @group Components
 * @category Data Structures
 * @extends AddEventListenerOptions
 * @description Options used for listeners.
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
    /**
     * @constructor
     * @description Create an interactor bound to an element. Anything omitted from `properties` falls back to
     * the value already declared on the instance, then to a default — the event manager to
     * {@link GradumEventManager.instance}, and the listener options to an empty object.
     * @param {GradumInteractorProperties} properties - The element to attach to, plus the tool name, target,
     * event manager, and listener options.
     */
    constructor(properties: GradumInteractorProperties<ElementType, ViewType, ModelType, EmitterType>);
}

/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The key event names dispatched by {@link GradumEventManager}. Listen for these to receive
 * the manager's normalized key events rather than the raw DOM ones.
 * @property {string} keyPressed - Fired while a key is held down.
 * @property {string} keyReleased - Fired when a key is let go.
 */
declare const GradumKeyEventName: {
    readonly keyPressed: "gradum-key-pressed";
    readonly keyReleased: "gradum-key-released";
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The key events components listen for out of the box. Both map to their native DOM
 * equivalents, since the platform already provides them.
 * @property {string} keyPressed - `keydown`.
 * @property {string} keyReleased - `keyup`.
 */
declare const DefaultKeyEventName: {
    readonly keyPressed: "keydown";
    readonly keyReleased: "keyup";
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The click event names dispatched by {@link GradumEventManager}. These are pointer-type
 * agnostic — a mouse, a touch, and a pen all produce the same names.
 * @property {string} click - Fired on a completed click.
 * @property {string} clickStart - Fired when the pointer goes down.
 * @property {string} clickEnd - Fired when the pointer comes back up.
 * @property {string} longPress - Fired when the pointer is held past the manager's long-press duration.
 */
declare const GradumClickEventName: {
    readonly click: "gradum-click";
    readonly clickStart: "gradum-click-start";
    readonly clickEnd: "gradum-click-end";
    readonly longPress: "gradum-long-press";
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The click events components listen for out of the box. `click`, `clickStart`, and `clickEnd`
 * map to their native DOM equivalents; `longPress` keeps the Gradum name, because the platform has no
 * equivalent and only {@link GradumEventManager} can produce it.
 * @property {string} click - `click`.
 * @property {string} clickStart - `mousedown`.
 * @property {string} clickEnd - `mouseup`.
 * @property {string} longPress - The Gradum long-press name.
 */
declare const DefaultClickEventName: {
    readonly click: "click";
    readonly clickStart: "mousedown";
    readonly clickEnd: "mouseup";
    readonly longPress: "gradum-long-press";
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The pointer-move event name dispatched by {@link GradumEventManager}.
 * @property {string} move - Fired as the pointer moves.
 */
declare const GradumMoveEventName: {
    readonly move: "gradum-move";
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The move event components listen for out of the box, mapped to its native DOM equivalent.
 * @property {string} move - `mousemove`.
 */
declare const DefaultMoveEventName: {
    readonly move: "mousemove";
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The drag event names dispatched by {@link GradumEventManager}. A drag begins once the pointer
 * travels past the manager's move threshold while held.
 * @property {string} drag - Fired repeatedly as the pointer moves during a drag.
 * @property {string} dragStart - Fired once, when the drag begins.
 * @property {string} dragEnd - Fired once, when the pointer is released.
 */
declare const GradumDragEventName: {
    readonly drag: "gradum-drag";
    readonly dragStart: "gradum-drag-start";
    readonly dragEnd: "gradum-drag-end";
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The drag events components listen for out of the box. All three keep their Gradum names —
 * the native HTML drag-and-drop events are a separate mechanism, so {@link GradumEventManager} is the only
 * source of these.
 * @property {string} drag - The Gradum drag name.
 * @property {string} dragStart - The Gradum drag-start name.
 * @property {string} dragEnd - The Gradum drag-end name.
 */
declare const DefaultDragEventName: {
    readonly drag: "gradum-drag";
    readonly dragStart: "gradum-drag-start";
    readonly dragEnd: "gradum-drag-end";
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The wheel event names dispatched by {@link GradumEventManager}, which separates a plain
 * wheel turn from a pinch gesture.
 * @property {string} scroll - Fired on a wheel turn without a modifier.
 * @property {string} pinch - Fired on a trackpad pinch, which the browser reports as a modified wheel event.
 */
declare const GradumWheelEventName: {
    readonly scroll: "gradum-scroll";
    readonly pinch: "gradum-pinch";
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The wheel events components listen for out of the box. Both map to the native `wheel` event,
 * since the browser reports scrolling and pinching through the same one — it is the manager that tells them
 * apart and fires the distinct {@link GradumWheelEventName} names.
 * @property {string} scroll - `wheel`.
 * @property {string} pinch - `wheel`.
 */
declare const DefaultWheelEventName: {
    readonly scroll: "wheel";
    readonly pinch: "wheel";
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description Every event name {@link GradumEventManager} can dispatch, combining the key, click, move,
 * drag, and wheel families with the select-input event.
 * @property {string} selectInput - Fired when a selection component's value changes.
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
 * @group Event Handling
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
 * @group Event Handling
 * @category Event Names
 *
 * @description The name of any event in {@link DefaultEventName}, such as `"clickStart"` or `"focusIn"`.
 */
type DefaultEventNameKey = keyof typeof DefaultEventName;
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The event-name string of any entry in {@link DefaultEventName}, such as `"mousedown"`.
 * This is what you pass to {@link GradumSelector.on}.
 */
type DefaultEventNameEntry = typeof DefaultEventName[DefaultEventNameKey];
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The name of any event in {@link GradumEventName}, such as `"dragStart"`.
 */
type GradumEventNameKey = keyof typeof GradumEventName;
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The event-name string of any entry in {@link GradumEventName}, such as `"gradum-drag-start"`.
 */
type GradumEventNameEntry = typeof GradumEventName[GradumEventNameKey];

/**
 * @type {MakeToolOptions}
 * @group GradumSelector
 * @category Tools
 *
 * @description Options used to create a new tool attached to an element via {@link GradumSelector.makeTool}.
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
 * @group GradumSelector
 * @category Tools
 *
 * @description Function signature for a tool behavior. Returning `true` marks the behavior as handled/consumed,
 * leading to stopping the propagation of the event.
 * @param {Event} event - The original DOM/Gradum event.
 * @param {Node} target - The node the behavior should operate on (the object or its embedded target).
 * @param {ToolBehaviorOptions} [options] - Additional info (embedded context, etc.).
 * @returns {boolean} Whether to stop the propagation.
 */
type ToolBehaviorCallback<TargetType extends Node = Node> = (event: Event, target: TargetType, options?: ToolBehaviorOptions) => Propagation | any;
/**
 * @type {ToolBehaviorOptions}
 * @group GradumSelector
 * @category Tools
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
 * @description A named mode that changes what interacting with an element does. Its `@behavior` methods run
 * during the capture phase of the event loop, before any interactor sees the event, so a tool can claim an
 * interaction and stop it reaching the element underneath. Only the active tool for a given click mode
 * receives events.
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
    /**
     * @constructor
     * @description Create a tool bound to an element. Anything omitted from `properties` falls back to the
     * value already declared on the instance, then to a default — the event manager to
     * {@link GradumEventManager.instance}, the activation event to the default click name, and the click mode
     * to `ClickMode.left`.
     * @param {GradumToolProperties} properties - The element to attach to, plus the tool name, embedded
     * target, activation event, click mode, mapped key, and activation callbacks.
     */
    constructor(properties: GradumToolProperties<ElementType, ViewType, ModelType, EmitterType>);
    /**
     * @function initialize
     * @override
     * @description Initialization function that calls {@link GradumSelector.makeTool} on `this.element`, sets it up,
     * and attaches all the defined tool behaviors.
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
 * @category Data Structures
 *
 * @template Type - The type of the queued values.
 * @description A first-in, first-out queue. {@link push} adds to the back, {@link pop} takes from the
 * front, and {@link addOnTop} jumps the line. Popping does not shift the backing array, so draining a
 * long queue stays cheap.
 */
declare class GradumQueue<Type = any> {
    private items;
    private head;
    /**
     * @description Add one or more values to the back of the queue.
     * @param {...Type[]} values - The values to enqueue, in order.
     * @returns {this} Itself, allowing for method chaining.
     */
    push(...values: Type[]): this;
    /**
     * @description Add one or more values to the front of the queue, so they are popped before
     * everything already queued.
     * @param {...Type[]} values - The values to enqueue, in order.
     * @returns {this} Itself, allowing for method chaining.
     */
    addOnTop(...values: Type[]): this;
    /**
     * @description Take the value at the front of the queue and remove it.
     * @returns {Type | undefined} The removed value, or `undefined` if the queue is empty.
     */
    pop(): Type | undefined;
    /**
     * @description Read the value at the front of the queue without removing it.
     * @returns {Type} The next value to be popped, or `undefined` if the queue is empty.
     */
    peek(): Type;
    /**
     * @description Check whether a value is queued.
     * @param {Type} value - The value to look for, compared by identity.
     * @returns {boolean} Whether the value is present.
     */
    has(value: Type): boolean;
    /**
     * @description The number of values still waiting to be popped.
     * @readonly
     */
    get size(): number;
    /**
     * @description Whether the queue has nothing left to pop.
     * @readonly
     */
    get isEmpty(): boolean;
    /**
     * @description Drop repeated values, keeping the earliest occurrence of each so queue order is
     * preserved. Mutates the queue.
     * @param {Type} [entry] - Restrict deduplication to this value, leaving every other duplicate in
     * place. Omit it to deduplicate the whole queue.
     * @returns {this} Itself, allowing for method chaining.
     */
    removeDuplicates(entry?: Type): this;
    /**
     * @description Discard every queued value.
     * @returns {this} Itself, allowing for method chaining.
     */
    clear(): this;
    /**
     * @description Snapshot the pending values.
     * @returns {Type[]} A new array of the values still waiting to be popped, front first. Already
     * popped values are excluded.
     */
    toArray(): Type[];
    /**
     * @description Copy the queue.
     * @returns {GradumQueue<Type>} A new queue holding the same pending values in the same order. The
     * values themselves are shared, not copied.
     */
    clone(): GradumQueue<Type>;
    /**
     * @description Remove the first pending occurrence of a value, wherever it sits in the queue.
     * @param {Type} value - The value to remove, compared by identity.
     * @returns {boolean} Whether a matching value was found and removed.
     */
    remove(value: Type): boolean;
}

/**
 * @type {NodeListType}
 * @group Components
 * @category Data Structures
 *
 * @template {object} EntryType - The type of the nodes held in the collection.
 * @description Anything a {@link GradumNodeList} accepts as a source of entries: another list, a live DOM
 * `HTMLCollection` or `NodeListOf`, a `Set`, or a plain array. Live DOM collections keep reflecting the
 * document after being added, so the list stays in sync with them.
 */
type NodeListType<EntryType extends object = object> = GradumNodeList<EntryType> | HTMLCollection | NodeListOf<EntryType & Node> | Set<EntryType> | EntryType[];
/**
 * @type {NodeListSlot}
 * @group Components
 * @category Data Structures
 *
 * @template {object} EntryType - The type of the nodes held in the collection.
 * @description One slot of a {@link GradumNodeList}: either a single entry, or a whole sub-collection
 * counted as one position. Unlike {@link NodeListType} it excludes `Set` and array, which are flattened
 * into individual slots when added.
 */
type NodeListSlot<EntryType extends object = object> = GradumNodeList<EntryType> | HTMLCollection | NodeListOf<EntryType & Node> | EntryType;

/**
 * @class GradumNodeList
 * @group Components
 * @category Data Structures
 *
 * @template {object} Type - The type of the nodes held in the list.
 * @description A composable, Set-like collection of nodes. A single list can mix individual nodes, live
 * DOM collections ([HTMLCollection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection) or
 * [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)), and nested
 * {@link GradumNodeList}s. Iteration resolves all of them in order and de-duplicates, so entries added
 * to a sub-list or to the DOM show up without re-registering anything. Entries are held weakly, so a
 * node removed from the document drops out of the list on its own.
 */
declare class GradumNodeList<Type extends object = object> {
    private slots;
    private ignoredMap;
    private domListObservers;
    private subNodeListHandlers;
    /**
     * @description Delegate fired whenever an entry is added to or removed from the list, including entries
     * from nested {@link GradumNodeList}s, `HTMLCollection`s, and `NodeListOf` instances.
     */
    onChanged: Delegate<(entry: Type, state: "added" | "removed") => void>;
    /**
     * @constructor
     * @param {...(Type | NodeListType<Type>)[]} [values] - Optional initial value(s) to populate the list with.
     */
    constructor(...values: (Type | NodeListType<Type>)[]);
    /**
     * @description Whether to observe added `HTMLCollection`s and `NodeListOf` instances for DOM
     * mutations, automatically firing {@link onChanged} when nodes are added or removed from the DOM.
     */
    set observeDomLists(value: boolean);
    /**
     * @description A `Set` snapshot of all entries in this list, without duplicates.
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
     * @description The number of slots in this list. Individual entries, `HTMLCollection`s,
     * `NodeListOf` instances, and nested {@link GradumNodeList}s each count as one slot, regardless
     * of how many entries they contain. For the number of resolved entries, see {@link size}.
     */
    get slotCount(): number;
    /**
     * @function isGradumNodeList
     * @description Type guard — returns true if the given value is a {@link GradumNodeList}.
     * @param {any} entry - The value to check.
     * @returns {boolean} Whether the value is a {@link GradumNodeList}.
     * @protected
     */
    protected isGradumNodeList(entry: any): entry is GradumNodeList<Type>;
    /**
     * @function isDomList
     * @description Type guard — returns true if the given value is an `HTMLCollection` or
     * `NodeListOf`.
     * @param {any} entry - The value to check.
     * @returns {boolean} Whether the value is a DOM list.
     * @protected
     */
    protected isDomList(entry: any): entry is HTMLCollection | NodeListOf<Type & Node>;
    /**
     * @function isSet
     * @description Type guard — returns true if the given value is a `Set` or an array.
     * @param {any} entry - The value to check.
     * @returns {boolean} Whether the value is a Set or array.
     * @protected
     */
    protected isSet(entry: any): entry is Set<Type> | Type[];
    /**
     * @function isEntry
     * @description Type guard — returns true if the given value is an individual node entry (i.e. not a
     * {@link GradumNodeList}, DOM list, Set, array, or `WeakRef`).
     * @param {any} entry - The value to check.
     * @returns {boolean} Whether the value is an individual entry.
     * @protected
     */
    protected isEntry(entry: any): entry is Type;
    /**
     * @description Iterates over all resolved unique entries in slot order, skipping ignored and duplicate
     * entries.
     */
    [Symbol.iterator](): IterableIterator<Type>;
    /**
     * @function resolveSlot
     * @description Expand a single slot into the entries it currently stands for — every entry of a
     * sub-list or DOM list, or the one node of an individual slot. Yields nothing once the slot's
     * referent has been garbage-collected, which is how dead entries leave the list.
     * @param {WeakRef<NodeListSlot<Type>>} slot - The slot to resolve.
     * @returns {IterableIterator<Type>} The entries this slot resolves to, in order.
     * @protected
     */
    protected resolveSlot(slot: WeakRef<NodeListSlot<Type>>): IterableIterator<Type>;
    /**
     * @description Run a callback for each resolved unique entry, in slot order. Ignored and duplicate
     * entries are skipped.
     * @param {(value: Type, set: this) => void} callback - Called once per entry.
     * @param {any} [thisArg] - Value to bind as `this` inside the callback.
     * @returns {this} Itself, allowing for method chaining.
     */
    forEach(callback: (value: Type, set: this) => void, thisArg?: any): this;
    /**
     * @function add
     * @description Adds one or more entries to the end of the list. Entries may be individual nodes,
     * arrays, `Set`s, `HTMLCollection`s, `NodeListOf` instances, or nested
     * {@link GradumNodeList}s.
     * @param {...(NodeListType<Type> | Type)[]} entries - The entries to add.
     * @returns {this} Itself, allowing for method chaining.
     */
    add(...entries: (NodeListType<Type> | Type)[]): this;
    /**
     * @function addAt
     * @description Adds one or more entries at the given resolved size index. The index refers to the position
     * among resolved unique entries, not slots. Arrays and `Set`s are expanded inline.
     * @param {number} index - The resolved entry index to insert at.
     * @param {...(NodeListType<Type> | Type)[]} entries - The entries to add.
     * @returns {this} Itself, allowing for method chaining.
     */
    addAt(index: number, ...entries: (NodeListType<Type> | Type)[]): this;
    /**
     * @function addAtSlot
     * @description Adds one or more entries at the given slot index. Subsequent entries are inserted
     * consecutively after the previous one. Arrays and `Set`s are expanded inline, each item
     * occupying the next slot index.
     * @param {number} index - The slot index to insert at.
     * @param {...(NodeListType<Type> | Type)[]} entries - The entries to add.
     * @returns {this} Itself, allowing for method chaining.
     */
    addAtSlot(index: number, ...entries: (NodeListType<Type> | Type)[]): this;
    /**
     * @function remove
     * @description Removes one or more entries from the list. Entries may be individual nodes, arrays,
     * `Set`s, `HTMLCollection`s, `NodeListOf` instances, or nested
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
     * - For arrays and `Set`s, returns true only if every item is present.
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
     * @description Add one value of any accepted shape. Arrays and sets are expanded so each item takes
     * its own slot; everything else occupies a single slot. Values already present are ignored, and
     * sub-lists and DOM lists start being watched from here.
     * @param {Type | NodeListType<Type>} entry - The entry to add.
     * @param {number} [index] - The slot index to insert at. Defaults to the end of the slot array.
     * @returns {number} The next available slot index after this insertion, for consecutive chaining.
     * @protected
     */
    protected addEntry(entry: Type | NodeListType<Type>, index?: number): number;
    /**
     * @function removeEntry
     * @description Remove one value of any accepted shape. Arrays and sets are expanded and removed
     * item by item. An individual entry stays suppressed even if a sub-list or DOM list it belongs to
     * still resolves to it, and sub-lists and DOM lists stop being watched from here.
     * @param {Type | NodeListType<Type>} entry - The entry to remove.
     * @protected
     */
    protected removeEntry(entry: Type | NodeListType<Type>): void;
    /**
     * @function insertOrRemoveSlot
     * @description Insert or drop a single slot and announce it, firing {@link onChanged} once per
     * entry the slot resolves to. An out-of-range insertion index is clamped to the ends.
     * @param {NodeListSlot<Type>} slot - The slot value to insert or remove.
     * @param {"added" | "removed"} state - Whether to insert or remove the slot.
     * @param {number} [index] - Slot index for insertion. Ignored on removal.
     * @returns {number} The next available slot index after the operation, for consecutive chaining.
     * @protected
     */
    protected insertOrRemoveSlot(slot: NodeListSlot<Type>, state: "added" | "removed", index?: number): number;
    /**
     * @function attachObserver
     * @description Attaches a `MutationObserver` to the parent of the first node in the given DOM
     * list, firing {@link onChanged} when nodes matching the list are added to or removed from the DOM.
     * Does nothing if an observer is already attached for this list, or if no parent node is found.
     * @param {HTMLCollection | NodeListOf<Type & Node>} domList - The DOM list to observe.
     */
    protected attachObserver(domList: HTMLCollection | NodeListOf<Type & Node>): void;
    /**
     * @function sizeIndexToSlotIndex
     * @description Translate a position among resolved entries into the slot index that holds it. The
     * two differ whenever a slot resolves to more than one entry, as DOM lists and sub-lists do.
     * @param {number} sizeIndex - The resolved entry index, clamped to the current size.
     * @returns {number} The matching slot index.
     * @protected
     */
    protected sizeIndexToSlotIndex(sizeIndex: number): number;
    /**
     * @function findContainingSlot
     * @description Finds the slot that directly contains or resolves to the given entry.
     * Returns the slot itself if the entry is a direct slot, the nested {@link GradumNodeList}
     * that contains it, or the DOM list that contains it.
     * @param {Type} entry - The entry to locate.
     * @returns {NodeListSlot<Type> | undefined} The containing slot, or undefined if not found.
     * @protected
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
 * @description Keeps a set of objects satisfying a constraint. Attach one to an element and it watches a
 * list of objects, and whenever a trigger object is interacted with it runs the solvers declared with
 * `@solver` until the constraint holds again — capped by `maxPasses` so propagation cannot cycle forever.
 * Checkers (`@checker`) report whether the constraint already holds; mutators (`@mutator`) adjust values
 * as part of resolving.
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
    /**
     * @constructor
     * @description Create a constrainer bound to an element. If no object list is supplied, it defaults to the
     * element's children, and the trigger list defaults to that same object list.
     * @param {GradumConstrainerProperties} properties - The element to attach to, plus the constrainer name,
     * priority, active state, and activation callbacks.
     */
    constructor(properties: GradumConstrainerProperties<ElementType, ViewType, ModelType, EmitterType>);
    /**
     * @function initialize
     * @override
     * @description Initialization function that calls {@link GradumSelector.makeConstrainer} on `this.element`, sets
     * it up, and attaches all the defined solvers.
     */
    initialize(): void;
    /**
     * @function getObjectPasses
     * @description Retrieve how many times the given object has been processed for the current resolving session
     * of the constrainer.
     * @param {object} object - The object to query.
     * @returns {number} Number of passes already performed on this object.
     */
    getObjectPasses(object: object): number;
    /**
     * @function getObjectData
     * @description Retrieve custom per-object data for this constrainer. It is reset on every new
     * resolving session.
     * @param {object} object - The object to query.
     * @returns {Record<string, any>} The stored data object (or an empty object if none).
     */
    getObjectData(object: object): Record<string, any>;
    /**
     * @function setObjectData
     * @description Set custom per-object data for this constrainer. It is reset on every new resolving session.
     * @param {object} object - The object to update.
     * @param {Record<string, any>} [data] - The new data object to associate with this object.
     * @returns {this} Itself, allowing for method chaining.
     */
    setObjectData(object: object, data?: Record<string, any>): this;
    /**
     * @function addChecker
     * @description Register a checker in the constrainer. Checkers dictate whether the event should continue
     * executing depending on the provided context (event, tool, target, etc.).
     * @param {ConstrainerAddCallbackProperties<ConstrainerChecker>} properties - Configuration object, including the
     * checker `callback` to be executed, the `name` of the checker to access it later, the name of the attached
     * `constrainer`, and the `priority` of the checker.
     * @returns {this} Itself, allowing for method chaining.
     */
    addChecker(properties: ConstrainerAddCallbackProperties<ConstrainerChecker>): this;
    /**
     * @function removeChecker
     * @description Remove a checker from this constrainer by its name.
     * @param {string} name - The checker name.
     * @returns {this} Itself, allowing for method chaining.
     */
    removeChecker(name: string): this;
    /**
     * @function clearCheckers
     * @description Remove all checkers attached to this constrainer.
     * @returns {this} Itself, allowing for method chaining.
     */
    clearCheckers(): this;
    /**
     * @function check
     * @description Evaluate all checkers for this constrainer and return whether the event should proceed or halt.
     * @param {ConstrainerCallbackProperties} [properties] - Context passed to each checker.
     * @returns {boolean} Whether the constrainer passes all checks.
     */
    check(properties?: ConstrainerCallbackProperties): boolean;
    /**
     * @function addMutator
     * @description Register a mutator in the constrainer. Mutators compute or transform a value based on the context.
     * @param {ConstrainerAddCallbackProperties<ConstrainerMutator>} properties - Configuration object, including the
     * mutator `callback` to be executed, the `name` of the mutator to access it later, and the `priority` of the mutator.
     * @returns {this} Itself, allowing for method chaining.
     */
    addMutator(properties: ConstrainerAddCallbackProperties<ConstrainerMutator>): this;
    /**
     * @function removeMutator
     * @description Remove a mutator from this constrainer by its name.
     * @param {string} name - The mutator name.
     * @returns {this} Itself, allowing for method chaining.
     */
    removeMutator(name: string): this;
    /**
     * @function clearMutators
     * @description Remove all mutators attached to this constrainer.
     * @returns {this} Itself, allowing for method chaining.
     */
    clearMutators(): this;
    /**
     * @function mutate
     * @template Type - The type of the value to mutate
     * @description Execute a mutator for this constrainer and return the resulting value.
     * @param {ConstrainerMutatorProperties<Type>} [properties] - Context object, including the
     * `mutation` to execute, and the input `value` to mutate.
     * @returns {Type} The mutated result.
     */
    mutate<Type = any>(properties?: ConstrainerMutatorProperties<Type>): Type;
    /**
     * @function addSolver
     * @description Register a solver in the constrainer. Solvers typically execute after an event is fired to
     * ensure the constrainer's constraints are maintained. They process all objects in the constrainer's queue,
     * one after the other.
     * @param {ConstrainerAddCallbackProperties<ConstrainerSolver>} properties - Configuration object, including the
     * solver `callback` to be executed, the `name` of the solver to access it later, and the `priority` of the solver.
     * @returns {this} Itself, allowing for method chaining.
     */
    addSolver(properties: ConstrainerAddCallbackProperties<ConstrainerSolver>): this;
    /**
     * @function removeSolver
     * @description Remove the given function from the constrainer's list of solvers.
     * @param {string} name - The solver's name.
     * @returns {this} Itself, allowing for method chaining.
     */
    removeSolver(name: string): this;
    /**
     * @function clearSolvers
     * @description Remove all solvers attached to the constrainer.
     * @returns {this} Itself, allowing for method chaining.
     */
    clearSolvers(): this;
    /**
     * @function solve
     * @description Solve the constrainer by executing all of its attached solvers. Each solver will be executed
     * on every object in the constrainer's queue, incrementing its number of passes in the process.
     * @param {ConstrainerCallbackProperties} [properties] - Options object to configure the context.
     * @returns {this} Itself, allowing for method chaining.
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
 * @type {SVGTagMap}
 * @group Core Types
 * @category SVG Tags
 *
 * @description The SVG tag-to-element map, minus `style`. That one tag is excluded because it collides
 * with the HTML `<style>` element of the same name, which would make the combined tag maps ambiguous.
 */
type SVGTagMap = Omit<SVGElementTagNameMap, "style">;
/**
 * @group Core Types
 * @category SVG Tags
 * @description Ensures that only valid tags are used, i.e., those that map to elements.
 */
type SVGTag<Tag extends keyof SVGElementTagNameMap = keyof SVGElementTagNameMap> = Tag;
/**
 * @group Core Types
 * @category SVG Tags
 * @description Ensures that only valid elements are used, i.e., those that extend Element.
 */
type ValidSVGElement<Tag extends SVGTag = SVGTag> = SVGElementTagNameMap[Tag] extends SVGElement ? SVGElementTagNameMap[Tag] : SVGElement;
/**
 * @group Core Types
 * @category SVG Tags
 * @description URL to the SVG namespace.
 */
declare const SvgNamespace = "http://www.w3.org/2000/svg";
/**
 * @group Core Types
 * @category SVG Tags
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
 * @group Core Types
 * @category Element Tags
 * @description Ensures that only valid tags are used, i.e., those that map to elements.
 */
type HTMLTag<Tag extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = Tag;
/**
 * @group Core Types
 * @category Element Tags
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
 * @group Core Types
 * @category MathML Tags
 * @description Ensures that only valid tags are used, i.e., those that map to elements.
 */
type MathMLTag<Tag extends keyof MathMLElementTagNameMap = keyof MathMLElementTagNameMap> = Tag;
/**
 * @group Core Types
 * @category MathML Tags
 * @description Ensures that only valid elements are used, i.e., those that extend Element.
 */
type ValidMathMLElement<Tag extends MathMLTag = MathMLTag> = MathMLElementTagNameMap[Tag] extends MathMLElement ? MathMLElementTagNameMap[Tag] : MathMLElement;
/**
 * @group Core Types
 * @category MathML Tags
 * @description URL to the MathML namespace.
 */
declare const MathMLNamespace = "http://www.w3.org/1998/Math/MathML";
/**
 * @group Core Types
 * @category MathML Tags
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
 * @group Core Types
 * @category Element Tags
 * @description A type that represents a union of HTML, SVG, and MathML tag name maps.`
 */
type ElementTagMap = HTMLElementTagNameMap & SVGTagMap & MathMLElementTagNameMap & GradumElementTagNameMap;
/**
 * @group Core Types
 * @category Element Tags
 * @description Ensures that only valid tags are used, i.e., those that map to elements.
 */
type ValidTag<Tag extends keyof ElementTagMap = keyof ElementTagMap> = Tag;
/**
 * @group Core Types
 * @category Element Tags
 * @description Ensures that only valid elements are used, i.e., those that extend Element.
 */
type ValidElement<Tag extends ValidTag = ValidTag> = Tag extends HTMLTag ? ValidHTMLElement<Tag> : (Tag extends SVGTag ? ValidSVGElement<Tag> : (Tag extends MathMLTag ? ValidMathMLElement<Tag> : (ElementTagMap[Tag] extends Element ? ElementTagMap[Tag] : Element)));
/**
 * @group Core Types
 * @category Element Tags
 * @description Ensures that only valid elements are used, i.e., those that extend Element.
 */
type ValidNode<Tag = ValidTag> = Tag extends ValidTag ? ValidElement<Tag> : Node;
/**
 * @group Core Types
 * @category Element Tags
 * @description Type of non-function properties of an element.
 */
type HTMLElementNonFunctions<Tag extends ValidTag = ValidTag> = {
    [ElementField in keyof ValidElement<Tag>]: ValidElement<Tag>[ElementField] extends Function ? never : ElementField;
}[keyof ValidElement<Tag>];
/**
 * @group Core Types
 * @category Element Tags
 * @description Represents mutable fields of an HTML element, excluding specific fields.
 */
type HTMLElementMutableFields<Tag extends ValidTag = ValidTag> = Omit<Partial<Pick<ValidElement<Tag>, HTMLElementNonFunctions<Tag>>>, "children" | "className" | "style">;
/**
 * @type {ElementTagDefinition}
 * @group Core Types
 * @category Element Tags
 * @description Represents an element's definition of its tag and its namespace (both optional).
 * @property {string} [tag="div"] - The HTML tag of the element (e.g., "div", "span", "input"). Defaults to "div."
 * @property {string} [namespace] - The namespace of the element. Defaults to HTML. If "svgManipulation" or "mathML"
 * is provided, the corresponding namespace will be used to create the element. Otherwise, the custom namespace
 * provided will be used.
 */
type ElementTagDefinition<Tag extends ValidTag = "div"> = {
    tag?: Tag;
    namespace?: string;
};
/**
 * @type {GradumElementTagNameMap}
 * @group Core Types
 * @category Element Tags
 *
 * @description Maps custom element tag names to their classes. Empty by design — every component adds its
 * own entry by augmenting this interface, which is what folds custom tags into {@link ElementTagMap} so
 * they resolve to a concrete class. Augment it the same way to make your own elements type-aware.
 *
 * @example
 * ```ts
 * declare module "gradum-kit" {
 *    interface GradumElementTagNameMap {
 *       "my-widget": MyWidget;
 *    }
 * }
 * ```
 */
interface GradumElementTagNameMap {
}
/**
 * @type {GradumElementPropertiesMap}
 * @group Core Types
 * @category Element Tags
 *
 * @description Maps custom element tag names to their properties types, the counterpart of
 * {@link GradumElementTagNameMap}. Augment it alongside that one so the properties accepted when creating
 * your element are resolved from its tag.
 */
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
 * @type {CloneElementOptions}
 * @group GradumSelector
 * @category Element
 *
 * @description Controls what {@link GradumSelector.clone} carries over to the copy. By default a clone gets
 * the origin's own fields but shares object and node references; these options let you deepen or narrow
 * that per field.
 * @property {PropertyKey[]} [exclude] - Fields to leave off the clone entirely.
 * @property {PropertyKey[]} [forceInclude] - Fields to copy even though they would normally be skipped.
 * @property {PropertyKey[]} [deepClone] - Fields to deep-clone rather than copy by reference.
 * @property {PropertyKey[]} [copyReference] - Fields to copy by reference even under a deep-clone setting.
 * @property {boolean} [copyNodes] - Whether to copy fields holding DOM nodes.
 * @property {boolean} [deepCloneObjects] - Whether to deep-clone every object-valued field.
 * @property {boolean} [deepCloneNodes] - Whether to deep-clone every node-valued field.
 * @property {boolean} [snapshotData] - Whether the clone's model gets a detached snapshot of the data
 * instead of a live reference. See the note on the field.
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
     * @description When true, the clone's model receives a detached snapshot of the origin's data
     * (via `toJSON()` when available — e.g. Y.js types — else `structuredClone`) instead
     * of a live reference. Required for previews of MVC/synced elements: a reference copy
     * would make the clone a live twin whose field writes go through the shared model.
     */
    snapshotData?: boolean;
};
/**
 * @type {FeedforwardProperties}
 * @group GradumSelector
 * @category Element
 *
 * @extends GradumElementProperties
 * @description Controls the preview element {@link GradumSelector.feedforward} produces — everything
 * {@link GradumElementProperties} accepts, plus how the preview is cloned, wrapped, and torn down. Used to
 * show the user what an interaction is about to do before they commit to it.
 * @property {boolean} [removeOnPointerRelease] - Whether the preview removes itself when the pointer is released.
 * @property {string} [type] - A label identifying the kind of feedforward, for callers that show several.
 * @property {CloneElementOptions} [cloneOptions] - How to clone the origin element into the preview.
 * @property {boolean} [wrap] - Whether to wrap the clone in a positioning wrapper. See the note on the field.
 */
type FeedforwardProperties = GradumElementProperties & {
    removeOnPointerRelease?: boolean;
    type?: string;
    cloneOptions?: CloneElementOptions;
    /**
     * @description When true, the clone is placed inside a `GradumMovable` positioning wrapper and the wrapper
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
 * @type {GradumProperties}
 * @group GradumSelector
 * @category Element
 *
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
 * @type {GradumElementUiInterface}
 * @description The UI members every element class gains from `defineUIPrototype`. Declared separately so
 * the element classes can merge it in, since the members are installed on the prototype at runtime rather
 * than declared on the class.
 */
interface GradumElementUiInterface {
    /**
     * @description Whether to set the default CSS classes defined in the static config on the element or not. Setting
     * it will accordingly add/remove the CSS classes from the element.
     */
    unsetDefaultClasses: boolean;
    /**
     * @description Whether the element renders its children into a shadow root. Assigning `true` attaches
     * one if the element does not already have it.
     */
    shadowDOM: boolean;
    /**
     * @description The CSS classes applied to every instance of this element class. Assigning a new value
     * swaps the previous classes out for the new ones, unless `unsetDefaultClasses` is set.
     */
    defaultClasses: string | string[];
}

/**
 * @group MVC
 * @category Element Classes
 */
type GradumProxiedProperties<Tag extends ValidTag = "div", ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumProperties<Tag> & GradumHeadlessProperties<ViewType, DataType, ModelType, EmitterType> & {
    unsetDefaultClasses?: boolean;
    shadowDOM?: boolean;
    defaultSelectedClasses?: string | string[];
    defaultClasses?: string | string[];
};
/**
 * @type {GradumElementProperties}
 * @group MVC
 * @category Element Classes
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
 * @type {GradumElementDefaultInterface}
 * @description The lifecycle members every element class gains from `defineDefaultProperties`. Declared
 * separately so the element classes can merge it in, since the members are installed on the prototype at
 * runtime rather than declared on the class.
 */
interface GradumElementDefaultInterface {
    /**
     * @readonly
     * @description The properties this element was created with.
     */
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
    /**
     * @description The properties passed on to children created through {@link feedforward}, letting a
     * parent seed its descendants with shared defaults.
     */
    defaultFeedforwardProperties: GradumElementProperties;
    /**
     * @function feedforward
     * @description Push this element's feedforward properties down to its children, so newly added
     * descendants pick up the same defaults.
     * @param {FeedforwardProperties} [properties] - Properties to feed forward. Defaults to
     * `defaultFeedforwardProperties`.
     * @returns {this} Itself, allowing for method chaining.
     */
    feedforward(properties?: FeedforwardProperties): this;
    /**
     * @function clone
     * @description Create a copy of this element. By default the copy carries the same properties and
     * children but none of the bound listeners.
     * @param {CloneElementOptions} [options] - What to carry over to the copy.
     * @returns {this} The cloned element.
     */
    clone(options?: CloneElementOptions): this;
}

/**
 * @internal
 * @type {MvcInstanceOrConstructor}
 * @template Type - The MVC piece being supplied.
 * @template PropertiesType - The single argument its constructor takes.
 * @description Either a ready-made MVC piece or a constructor to build one from. Lets every role in
 * {@link MvcProperties} accept an instance you have already configured, or a class to instantiate.
 */
type MvcInstanceOrConstructor<Type, PropertiesType = any> = Type | (new (properties: PropertiesType) => Type);
/**
 * @internal
 * @type {MvcManyInstancesOrConstructors}
 * @template Type - The MVC piece being supplied.
 * @template PropertiesType - The single argument its constructor takes.
 * @description One {@link MvcInstanceOrConstructor} or an array of them, for the roles that accept several
 * pieces — operators, handlers, interactors, tools, and constrainers.
 */
type MvcManyInstancesOrConstructors<Type, PropertiesType = any> = MvcInstanceOrConstructor<Type, PropertiesType> | MvcInstanceOrConstructor<Type, PropertiesType>[];
/**
 * @type {MvcProperties}
 * @group MVC
 * @category Configuration
 *
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description The set of MVC pieces attached to an element. Pass one to `defaultProperties` or to
 * {@link GradumSelector.setMvc} to declare which classes fill each role; read the assembled set back from
 * {@link GradumSelector.mvc}. Every role is optional, and each accepts either a ready-made instance or a
 * constructor to build one from.
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
 * @category Configuration
 *
 * @extends MvcProperties
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {object} DataType - The element's data type, if any.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 * @description Everything {@link MvcProperties} accepts, plus the data to seed the model with and whether
 * to initialize. This is the shape {@link GradumSelector.setMvc} takes, so the pieces can be attached and
 * brought up in one call.
 * @property {DataType} [data] - The data to attach to the model.
 * @property {boolean} [initialize] - Whether to initialize the MVC pieces after setting them or not. Defaults to true.
 */
type MvcGenerationProperties<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = MvcProperties<ViewType, ModelType, EmitterType> & {
    data?: DataType;
    initialize?: boolean;
};
/**
 * @type {GradumHeadlessProperties}
 * @group MVC
 * @category Element Classes
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

/**
 * @internal
 * @class GradumEventManagerUtilsHandler
 * @extends GradumHandler
 * @description Shared helpers for the event manager's operators: mapping a native button number to a
 * {@link ClickMode}, resolving which Gradum event names are enabled, running the named timers behind
 * long-press detection, and activating a tool.
 */
declare class GradumEventManagerUtilsHandler extends GradumHandler<GradumEventManagerModel> {
    keyName: string;
    setClickMode(button: number, isTouch?: boolean): ClickMode;
    applyEventNames(eventNames: Record<string, string>): void;
    setTimer(timerName: string, callback: () => void, duration: number): void;
    clearTimer(timerName: string): void;
    activateTool(element: Node, toolName: string, value: boolean): void;
}

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
declare class GradumMap<KeyType, ValueType> extends Map<KeyType, ValueType> {
    /**
     * @description Whether values are copied on the way in and out. While `true` (the default), stored
     * objects are cloned, so mutating a value you read back does not affect the map. Set it to `false`
     * to store and return the original references.
     */
    enforceImmutability: boolean;
    /**
     * @description Store a value at the given key. The value is copied first unless
     * {@link enforceImmutability} is `false`.
     * @param {KeyType} key - The key to store under.
     * @param {ValueType} value - The value to store.
     * @returns {this} Itself, allowing for method chaining.
     */
    set(key: KeyType, value: ValueType): any;
    /**
     * @description Read the value at the given key.
     * @param {KeyType} key - The key to read.
     * @returns {ValueType} A copy of the stored value, or the value itself when
     * {@link enforceImmutability} is `false`. `undefined` if the key is not set.
     */
    get(key: KeyType): ValueType;
    /**
     * @description The first value in insertion order, or `null` when the map is empty. Copied unless
     * {@link enforceImmutability} is `false`.
     * @readonly
     */
    get first(): ValueType | null;
    /**
     * @description The last value in insertion order, or `null` when the map is empty. Copied unless
     * {@link enforceImmutability} is `false`.
     * @readonly
     */
    get last(): ValueType | null;
    /**
     * @description All keys as an array, in insertion order.
     * @returns {KeyType[]} A new array of the map's keys.
     */
    keysArray(): KeyType[];
    /**
     * @description All values as an array, in insertion order.
     * @returns {ValueType[]} A new array of the map's values. The values themselves are not copied.
     */
    valuesArray(): ValueType[];
    private copy;
    /**
     * @template C - The type of the new keys.
     * @description Derive a new map with the same values under recomputed keys.
     * @param {(key: KeyType, value: ValueType) => C} callback - Returns the new key for each entry.
     * @returns {GradumMap<C, ValueType>} A new map. This map is left unchanged. Entries whose callback
     * returns the same key collapse into one.
     */
    mapKeys<C>(callback: (key: KeyType, value: ValueType) => C): GradumMap<C, ValueType>;
    /**
     * @template C - The type of the new values.
     * @description Derive a new map with the same keys and recomputed values.
     * @param {(key: KeyType, value: ValueType) => C} callback - Returns the new value for each entry.
     * @returns {GradumMap<KeyType, C>} A new map. This map is left unchanged.
     */
    mapValues<C>(callback: (key: KeyType, value: ValueType) => C): GradumMap<KeyType, C>;
    /**
     * @description Select the entries matching a predicate.
     * @param {(key: KeyType, value: ValueType) => boolean} callback - Returns `true` to keep an entry.
     * @returns {GradumMap<KeyType, ValueType>} A new map holding the kept entries. This map is left unchanged.
     */
    filter(callback: (key: KeyType, value: ValueType) => boolean): GradumMap<KeyType, ValueType>;
    /**
     * @description Copy every entry of another map into this one, overwriting on key collisions.
     * Unlike {@link mapKeys}, {@link mapValues}, and {@link filter}, this mutates the map it is called on.
     * @param {Map<KeyType, ValueType>} map - The map to read entries from. It is left unchanged.
     * @returns {this} Itself, allowing for method chaining.
     */
    merge(map: Map<KeyType, ValueType>): GradumMap<KeyType, ValueType>;
}

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
declare class GradumWeakSet<Type extends object = object> {
    private readonly _weakRefs;
    /**
     * @constructor
     * @description Create an empty set.
     */
    constructor();
    /**
     * @description Add an object to the set, if not already present. The set does not keep it alive.
     * @param {Type} obj - The object to add.
     * @returns {this} Itself, allowing for method chaining.
     */
    add(obj: Type): this;
    /**
     * @description Check whether an object is in the set.
     * @param {Type} obj - The object to look for, compared by identity.
     * @returns {boolean} Whether the object is present and has not been garbage-collected.
     */
    has(obj: Type): boolean;
    /**
     * @description Remove an object from the set.
     * @param {Type} obj - The object to remove, compared by identity.
     * @returns {boolean} Whether a matching object was found and removed.
     */
    delete(obj: Type): boolean;
    /**
     * @description Drop the bookkeeping left behind by objects that have been garbage-collected. Only
     * frees the set's own references — collected objects are already absent from iteration and
     * {@link size} without it.
     */
    cleanup(): void;
    /**
     * @description Snapshot the objects that are still alive.
     * @returns {Type[]} A new array of the live objects, in insertion order.
     */
    toArray(): Type[];
    /**
     * @description The number of objects still alive. Counted on each read rather than stored, so it
     * costs a full pass over the set.
     * @readonly
     */
    get size(): number;
    /**
     * @description Remove every object from the set.
     */
    clear(): void;
    /**
     * @description Run a callback for each live object, in insertion order. Objects collected since
     * the last pass are skipped.
     * @param {(value: Type, set: this) => void} callback - Called once per live object.
     * @param {any} [thisArg] - Value to bind as `this` inside the callback.
     */
    forEach(callback: (value: Type, set: this) => void, thisArg?: any): void;
    /**
     * @description Iterate the live objects in insertion order, skipping any that have been collected.
     */
    [Symbol.iterator](): IterableIterator<Type>;
}

/**
 * @internal
 * @class GradumEventManagerModel
 * @extends GradumModel
 * @description Holds a {@link GradumEventManager}'s live input state: which pointers are down and where
 * they started, the current click mode and action mode, the keys held, the registered tools and their
 * key bindings, and the thresholds separating a click from a drag or a long press. The manager's
 * operators read and update this as raw input arrives.
 */
declare class GradumEventManagerModel extends GradumModel {
    utils: GradumEventManagerUtilsHandler;
    readonly state: GradumEventManagerStateProperties;
    lockState: GradumEventManagerLockStateProperties;
    readonly onInputDeviceChange: Delegate<(device: InputDevice) => void>;
    /**
     * @description Delegate fired when the tool bound to a click mode changes, receiving the old tool, the
     * new tool, and the mode it changed on.
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
    /**
     * @description The objects a {@link GradumSelector.hitResolver} reported where the drag began. Resolved
     * alongside {@link lastTargetOrigin} and reused for the rest of the drag, so grabbing a shape on a canvas
     * keeps sending it the drag even once the pointer has moved off it — the same way pointer capture keeps a
     * drag with the element it started on.
     */
    lastOriginHits: object[];
    readonly timerMap: GradumMap<string, NodeJS.Timeout>;
    readonly tools: Map<string, GradumWeakSet<Node>>;
    readonly mappedKeysToTool: Map<string, string>;
    readonly currentTools: Map<ClickMode, Node>;
    set inputDevice(value: InputDevice);
}

/**
 * @type {GradumEventManagerStateProperties}
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description Whether a {@link GradumEventManager} is running, and which native default actions it
 * suppresses while it does.
 * @property {boolean} [enabled=true] - Whether the manager processes input at all. Set it to `false` to
 * silence every Gradum event without tearing the manager down.
 * @property {boolean} [preventDefaultWheel=false] - Whether to call `preventDefault` on wheel input,
 * suppressing native page zoom and scroll.
 * @property {boolean} [preventDefaultMouse=false] - Whether to call `preventDefault` on mouse input.
 * @property {boolean} [preventDefaultTouch=false] - Whether to call `preventDefault` on touch input,
 * suppressing native scrolling and pinch-zoom.
 */
type GradumEventManagerStateProperties = {
    enabled?: boolean;
    preventDefaultWheel?: boolean;
    preventDefaultMouse?: boolean;
    preventDefaultTouch?: boolean;
};
/**
 * @type {EnabledGradumEventTypes}
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description Which families of Gradum events a manager fires. The first four switch off input
 * *sources*; the last three switch off *interpretations* the manager derives from them, so you can keep
 * pointer input while dropping, say, drag events. All default to `true`.
 * @property {boolean} [keyEventsEnabled=true] - Whether keyboard input produces {@link GradumKeyEvent}s.
 * @property {boolean} [wheelEventsEnabled=true] - Whether wheel input produces {@link GradumWheelEvent}s.
 * @property {boolean} [mouseEventsEnabled=true] - Whether mouse input is processed.
 * @property {boolean} [touchEventsEnabled=true] - Whether touch input is processed.
 * @property {boolean} [clickEventsEnabled=true] - Whether click, long-press, and click start/end events fire.
 * @property {boolean} [dragEventsEnabled=true] - Whether drag and drag start/end events fire.
 * @property {boolean} [moveEventsEnabled=true] - Whether move events fire.
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
 * @type {GradumEventManagerProperties}
 * @group Event Handling
 * @category GradumEventManager
 *
 * @template {GradumEventManagerModel} ModelType - The manager's model type.
 * @description Properties used to construct a {@link GradumEventManager}. Combines the MVC properties of
 * a headless element with {@link GradumEventManagerStateProperties}, {@link EnabledGradumEventTypes}, and
 * the thresholds below.
 * @property {number} [moveThreshold=10] - How far, in pixels, a pointer must travel before the manager
 * treats the interaction as a drag rather than a click.
 * @property {number} [longPressDuration=500] - How long, in milliseconds, a pointer must be held still
 * before a long press fires.
 * @property {boolean | (() => boolean)} [authorizeEventScaling] - Whether fired events compute scaled
 * positions. Pass a callback to decide per event.
 * @property {(position: Point) => Point} [scaleEventPosition] - Converts a screen position into document
 * space for every event this manager fires. Set it to make events aware of a panned or zoomed canvas.
 */
type GradumEventManagerProperties<ModelType extends GradumEventManagerModel = GradumEventManagerModel> = GradumHeadlessProperties<any, any, ModelType> & GradumEventManagerStateProperties & EnabledGradumEventTypes & {
    moveThreshold?: number;
    longPressDuration?: number;
    authorizeEventScaling?: boolean | (() => boolean);
    scaleEventPosition?: (position: Point) => Point;
};
/**
 * @type {GradumEventManagerLockStateProperties}
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description A {@link GradumEventManagerStateProperties} override held for the duration of one
 * interaction, together with the node that asked for it. Locking lets an element impose its own
 * prevent-default and enabled settings mid-gesture, then hand them back.
 * @property {Node} [lockOrigin] - The node that established the lock, and the only one that can lift it.
 */
type GradumEventManagerLockStateProperties = GradumEventManagerStateProperties & {
    lockOrigin?: Node;
};
/**
 * @type {SetToolOptions}
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description Options for {@link GradumEventManager.setTool}, controlling the side effects of making a
 * tool current beyond the assignment itself.
 * @property {boolean} [select=true] - Whether to visually select the tool on every toolbar showing it.
 * @property {boolean} [activate=true] - Whether to fire the tool's activation callback.
 * @property {boolean} [setAsNoAction] - Whether the tool also becomes the one used for
 * `ClickMode.none`. Defaults to `true` when the click mode is `ClickMode.left`.
 */
type SetToolOptions = {
    select?: boolean;
    activate?: boolean;
    setAsNoAction?: boolean;
};
/**
 * @enum {ActionMode}
 * @group Event Handling
 * @category Event Modes
 *
 * @description What the manager has decided the current interaction is. A press starts as `click` and
 * becomes `longPress` or `drag` once it outlasts `longPressDuration` or travels past `moveThreshold`.
 * @property {ActionMode.none} none - No interaction in progress.
 * @property {ActionMode.click} click - A press that has neither moved far nor been held long.
 * @property {ActionMode.longPress} longPress - A press held in place past the long-press duration.
 * @property {ActionMode.drag} drag - A press that has moved past the move threshold.
 */
declare enum ActionMode {
    none = 0,
    click = 1,
    longPress = 2,
    drag = 3
}
/**
 * @enum {ClickMode}
 * @group Event Handling
 * @category Event Modes
 *
 * @description Which pointer button or input mode an interaction belongs to. The manager holds one
 * current tool per mode, so a different tool can be bound to each button.
 * @property {ClickMode.none} none - No button held.
 * @property {ClickMode.left} left - Primary button.
 * @property {ClickMode.right} right - Secondary button.
 * @property {ClickMode.middle} middle - Middle button.
 * @property {ClickMode.other} other - Any further button.
 * @property {ClickMode.key} key - Interaction driven by a mapped keyboard key rather than a button.
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
 * @enum {InputDevice}
 * @group Event Handling
 * @category Event Modes
 *
 * @description The device the manager believes is driving input. *Note: this is inferred from event
 * shape and is not fully reliable, particularly between `mouse` and `trackpad`.*
 * @property {InputDevice.unknown} unknown - Not yet identified.
 * @property {InputDevice.mouse} mouse - A mouse.
 * @property {InputDevice.trackpad} trackpad - A trackpad.
 * @property {InputDevice.touch} touch - A touchscreen.
 */
declare enum InputDevice {
    unknown = 0,
    mouse = 1,
    trackpad = 2,
    touch = 3
}

/**
 * @internal
 * @class GradumEventManagerKeyOperator
 * @extends GradumOperator
 * @description Translates native keyboard input into {@link GradumKeyEvent}s. It keeps the manager's
 * list of currently-held keys up to date and activates any tool bound to the pressed key.
 */
declare class GradumEventManagerKeyOperator extends GradumOperator<GradumEventManager, any, GradumEventManagerModel> {
    keyName: string;
    keyDown: (e: KeyboardEvent) => void;
    protected keyDownFn(e: KeyboardEvent): void;
    keyUp: (e: KeyboardEvent) => void;
    protected keyUpFn(e: KeyboardEvent): void;
}

/**
 * @internal
 * @class GradumEventManagerWheelOperator
 * @extends GradumOperator
 * @description Translates native wheel input into {@link GradumWheelEvent}s, choosing between a scroll
 * and a pinch and inferring whether the input came from a mouse or a trackpad.
 */
declare class GradumEventManagerWheelOperator extends GradumOperator<GradumEventManager, any, GradumEventManagerModel> {
    keyName: string;
    wheel: (e: WheelEvent) => void;
}

/**
 * @internal
 * @class GradumEventManagerPointerOperator
 * @extends GradumOperator
 * @description Turns raw pointer input into Gradum's click, long-press, move, and drag events. It tracks
 * every active pointer so multi-touch gestures stay coherent, and decides what an interaction is by
 * watching it: a press becomes a long press once it outlives `longPressDuration`, or a drag once it
 * travels past `moveThreshold`.
 */
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
     * @private
     * @function fireClick
     * @description Fire a click-family event at whichever element sits under the given position.
     * @param {Point} p - The screen position the click happened at. Nothing fires when it is undefined.
     * @param {GradumEventNameEntry} [eventName=GradumEventName.click] - The event name to fire, letting the
     * same path emit click start, click end, and long press.
     */
    private fireClick;
    /**
     * @private
     * @function fireDrag
     * @description Fire a drag-family event at the drag's origin element, carrying the origin, the previous
     * position, and the current position of every active pointer.
     * @param {GradumMap<number, Point>} positions - Current position per pointer id. Nothing fires when it
     * is undefined.
     * @param {GradumEventNameEntry} [eventName=GradumEventName.drag] - The event name to fire, letting the
     * same path emit drag start, drag, and drag end.
     */
    private fireDrag;
    private getFireOrigin;
}

/**
 * @enum {ClosestOrigin}
 * @group Event Handling
 * @category Event Modes
 *
 * @description Where {@link GradumEvent.closest} starts searching from when looking for a matching
 * ancestor.
 * @property {ClosestOrigin.target} target - Start from the event's target and walk up its ancestors.
 * @property {ClosestOrigin.position} position - Start from the elements under the event position, which
 * also reaches elements the target overlaps but does not descend from.
 */
declare enum ClosestOrigin {
    target = "target",
    position = "position"
}
/**
 * @type {GradumRawEventProperties}
 * @group Event Handling
 * @category GradumEvents
 *
 * @description The fields every Gradum event is built from. The concrete property types
 * ({@link GradumEventProperties}, {@link GradumDragEventProperties}, ...) extend this with whatever
 * positional data their event carries.
 * @property {ClickMode} [clickMode] - The pointer button or input mode the event belongs to. Defaults to
 * the manager's current click mode.
 * @property {InputDevice} [inputDevice] - The device that produced the event. Defaults to
 * `InputDevice.unknown`.
 * @property {string[]} [keys] - Keys held when the event fired. Defaults to the manager's current keys.
 * @property {GradumEventNameEntry} [eventName] - The name the event is dispatched under.
 * @property {GradumEventManager} [eventManager] - The manager firing the event. Defaults to
 * {@link GradumEventManager.instance}.
 * @property {string} [toolName] - The tool the event is attributed to, if any.
 * @property {boolean | (() => boolean)} [authorizeScaling=true] - Whether scaled positions are computed.
 * Pass a callback to decide per read.
 * @property {(position: Point) => Point} [scalePosition] - Converts a screen position into document
 * space. Defaults to returning the position unchanged.
 * @property {EventInit} [eventInitDict] - Native event options, merged over the defaults of `bubbles`
 * and `cancelable` set to `true`.
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
 * @type {GradumEventProperties}
 * @group Event Handling
 * @category GradumEvents
 *
 * @description Properties used to construct a {@link GradumEvent}. Extends
 * {@link GradumRawEventProperties} with the single point the event happened at.
 * @property {Point} [position] - The screen position the event was fired from.
 */
type GradumEventProperties = GradumRawEventProperties & {
    position?: Point;
};
/**
 * @type {GradumDragEventProperties}
 * @group Event Handling
 * @category GradumEvents
 *
 * @description Properties used to construct a {@link GradumDragEvent}. Each map is keyed by pointer id,
 * so a multi-touch drag carries one entry per finger.
 * @property {GradumMap<number, Point>} [origins] - Where each pointer started its drag.
 * @property {GradumMap<number, Point>} [previousPositions] - Where each pointer was on the previous event.
 * @property {GradumMap<number, Point>} [positions] - Where each pointer is now. Its first entry becomes
 * the event's `position`.
 */
type GradumDragEventProperties = GradumRawEventProperties & {
    origins?: GradumMap<number, Point>;
    previousPositions?: GradumMap<number, Point>;
    positions?: GradumMap<number, Point>;
};
/**
 * @type {GradumKeyEventProperties}
 * @group Event Handling
 * @category GradumEvents
 *
 * @description Properties used to construct a {@link GradumKeyEvent}. Exactly one of the two keys is set,
 * depending on whether the event is a press or a release.
 * @property {string} [keyPressed] - The key that was pressed.
 * @property {string} [keyReleased] - The key that was released.
 */
type GradumKeyEventProperties = GradumRawEventProperties & {
    keyPressed?: string;
    keyReleased?: string;
};
/**
 * @type {GradumWheelEventProperties}
 * @group Event Handling
 * @category GradumEvents
 *
 * @description Properties used to construct a {@link GradumWheelEvent}.
 * @property {Point} [delta] - How far the wheel or trackpad scrolled, per axis.
 */
type GradumWheelEventProperties = GradumRawEventProperties & {
    delta?: Point;
};

/**
 * @class GradumEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends Event
 * @description The base class for every event the {@link GradumEventManager} fires. On top of a native
 * [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) it carries the pointer position, the
 * click mode, the input device, the keys held at the time, and the tool the event is attributed to. It
 * also knows how to map screen coordinates into document space, so handlers running under a panned or
 * zoomed canvas can read {@link GradumEvent.scaledPosition} instead of doing the maths themselves.
 */
declare class GradumEvent extends Event {
    /**
     * @description The event manager that fired this event.
     */
    readonly eventManager: GradumEventManager;
    /**
     * @description The name of the tool this event is attributed to, or `undefined` when no tool was
     * current. Resolve it to the tool itself with {@link GradumEvent.tool}.
     */
    readonly toolName: string;
    /**
     * @description The name this event was dispatched under, such as `gradum-click`.
     */
    readonly eventName: GradumEventNameEntry;
    /**
     * @description The pointer button or input mode this event belongs to.
     */
    readonly clickMode: ClickMode;
    /**
     * @description The device that produced this event.
     */
    readonly inputDevice: InputDevice;
    /**
     * @description The keys held down when the event fired.
     */
    readonly keys: string[];
    /**
     * @description The screen position the event was fired from.
     */
    readonly position: Point;
    /**
     * @description Everything this event was dispatched over, innermost first: the composed path with any
     * objects reported by a {@link GradumSelector.hitResolver} spliced in ahead of the element that reported
     * them. Equal to `composedPath()` when nothing resolved. Move events carry the z-stack under the pointer
     * instead, which is what they are dispatched over.
     */
    dispatchPath: readonly object[];
    /**
     * @description The objects a {@link GradumSelector.hitResolver} reported at this event's position,
     * topmost first, or empty when the pointer only touched real elements.
     */
    hits: object[];
    /**
     * @readonly
     * @description The most specific thing the event actually hit: the topmost object reported by a
     * {@link GradumSelector.hitResolver}, or {@link GradumEvent.target} when no resolver contributed. Use it
     * over `target` when the thing interacted with might have been painted inside an element rather than
     * being one — reading it costs nothing when nothing is.
     */
    get hitTarget(): object;
    /**
     * @description Whether {@link GradumEvent.scaledPosition} and its per-pointer equivalents actually
     * scale, or hand back the raw position. Assign a callback to decide per read — useful when a canvas
     * is only sometimes transformed. Defaults to `true`.
     */
    authorizeScaling: boolean | (() => boolean);
    /**
     * @description How a screen position is mapped into document space. Assign it to make events aware of
     * a panned or zoomed canvas. Defaults to returning the position unchanged.
     */
    scalePosition: (position: Point) => Point;
    /**
     * @constructor
     * @description Create a Gradum event. Anything left out of `properties` falls back to the current
     * state of {@link GradumEventManager.instance}.
     * @param {GradumEventProperties} properties - The event's name, position, and input context.
     */
    constructor(properties: GradumEventProperties);
    /**
     * @readonly
     * @description The tool associated with this event, or `null` if the event carries no tool name.
     */
    get tool(): Node;
    /**
     * @function closest
     * @template {Element} T - The type of element to look for.
     * @description Find the nearest element of the given class, starting from the event target or the
     * event position and walking up. Matching is by `instanceof`.
     * @param {new (...args: any[]) => T} type - The constructor to match against.
     * @param {Element | boolean} [strict=true] - When `true`, the match must also contain the event
     * position, so an ancestor the pointer has left is rejected. Pass an `Element` to test against that
     * element's bounds instead, or `false` to skip the check.
     * @param {ClosestOrigin} [from=ClosestOrigin.target] - Where to start searching from.
     * @returns {T | null} The nearest matching element, or `null` if there is none.
     */
    closest<T extends Element>(type: new (...args: any[]) => T, strict?: Element | boolean, from?: ClosestOrigin): T | null;
    /**
     * @function closest
     * @description Find the nearest element matching the given string. A registered custom-element tag
     * such as `"my-component"` is resolved to its constructor and matched by `instanceof`; anything else
     * is treated as a CSS selector.
     * @param {string} type - A custom-element tag name, or a CSS selector.
     * @param {Element | boolean} [strict=true] - When `true`, the match must also contain the event
     * position. Pass an `Element` to test against that element's bounds instead, or `false` to skip it.
     * @param {ClosestOrigin} [from=ClosestOrigin.target] - Where to start searching from.
     * @returns {Element | null} The nearest matching element, or `null` if there is none.
     */
    closest(type: string, strict?: Element | boolean, from?: ClosestOrigin): Element | null;
    /**
     * @private
     * @function isPositionInsideElement
     * @description Check whether a position falls within an element's bounding box.
     * @param {Point} position - The position to test.
     * @param {Element} element - The element whose bounds are tested against.
     * @returns {boolean} Whether the position is inside the element.
     */
    private isPositionInsideElement;
    /**
     * @readonly
     * @description The element the event was fired on, or the document when there is no element target.
     */
    get target(): Element | Document;
    /**
     * @readonly
     * @description The event position in document space, obtained by running {@link GradumEvent.position}
     * through `scalePosition`. Falls back to the raw position when scaling is not authorized.
     */
    get scaledPosition(): Point;
    /**
     * @readonly
     * @description Whether scaled positions are computed for this event. Resolves `authorizeScaling`,
     * calling it first if it is a callback.
     */
    get scalingAuthorized(): boolean;
    /**
     * @protected
     * @function scalePositionsMap
     * @description Map every point in a per-pointer map into document space. Used by
     * {@link GradumDragEvent} to expose scaled variants of its position maps.
     * @param {GradumMap<number, Point>} [positions] - Positions keyed by pointer id.
     * @returns {GradumMap<number, Point>} A new map with each position scaled. The input is unchanged.
     */
    protected scalePositionsMap(positions?: GradumMap<number, Point>): GradumMap<number, Point>;
}

/**
 * @internal
 * @class GradumEventManagerDispatchOperator
 * @extends GradumOperator
 * @description Dispatches Gradum events along the composed path. It runs two sequential passes over that
 * same path: a capture pass from the outermost entry down to the event target, then a bubble pass back up.
 * The capture pass reaches only listeners bound with `capture: true`. The bubble pass reaches every other
 * listener — `@listener` methods and those bound with `gradum(el).on()` — and is the only pass that runs
 * tool `@behavior` methods. Each pass stops early when a handler returns anything other than
 * `Propagation.propagate`.
 *
 * *Note: move events are the exception. Their composed path is the drag origin's ancestor chain, which
 * omits elements merely sitting under the cursor, so they are dispatched in a single pass over the
 * z-stack at the pointer instead — topmost first, stopping at the first handler that does not
 * propagate. A move handler therefore sees neither a capture pass nor a bubble pass.*
 */
declare class GradumEventManagerDispatchOperator extends GradumOperator<GradumEventManager, any, GradumEventManagerModel> {
    keyName: string;
    private boundHooks;
    protected setupChangedCallbacks(): void;
    protected dispatchEvent: <EventType extends GradumEvent = GradumEvent, PropertiesType extends GradumRawEventProperties = GradumRawEventProperties>(target: Node, eventType: new (properties: PropertiesType) => EventType, properties: Partial<PropertiesType>) => void;
    /**
     * @private
     * @function expandPath
     * @description Splice the objects reported by any {@link GradumSelector.hitResolver} in the path into the
     * path itself, so things an element merely paints — shapes on a canvas — are dispatched to like children
     * of it. Hits land at lower indices than the element that reported them, which is what gives them the
     * right position in both passes: capture descends into them last, bubble reaches them first.
     *
     * Each hit is given the reporting element as its {@link GradumSelector.hitParent} unless it already names
     * one, so climbing back out works without the scene having to track parentage.
     * @param {EventTarget[]} path - The path to expand, from {@link Event.composedPath} or a z-stack.
     * @param {Event} event - The event being dispatched, passed on to the resolvers.
     * @returns {object} The expanded path, and the set of entries that were contributed. Returns `path`
     * itself when no resolver contributed anything, so dispatch is untouched for everyone not using this.
     */
    private expandPath;
    private getToolHandlingCallback;
    /**
     * @private
     * @description Whether a path entry should be dispatched to. Nodes always are; anything else only when a
     * hit resolver contributed it, which keeps `Window` — in every composed path, and not a Node — out.
     */
    private isDispatchable;
    /**
     * @private
     * @description Hand the expansion to the event, so handlers and {@link GradumEvent.closest} can read what
     * was hit without resolving anything again.
     */
    private recordHits;
    setupCustomDispatcher(type: string): void;
    removeCustomDispatcher(type: string): void;
}

/**
 * @class GradumBaseElement
 * @group MVC
 * @category Element Classes
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description GradumHeadlessElement class, similar to GradumElement but without extending HTMLElement.
 */
declare class GradumBaseElement {
    /**
     * @description Default properties assigned to a new instance.
     */
    static defaultProperties: object;
    /**
     * @function create
     * @static
     * @description Instantiate this class with the given properties. Defaults declared by every class in the
     * inheritance chain are applied first, nearest ancestor last, so a subclass' `defaultProperties` win over
     * its parent's. The return type follows the class it is called on, so a subclass gets its own type back.
     * @param {PropertiesType} [properties] - Properties to set on the new instance.
     * @returns {InstanceType<Type>} The created instance.
     */
    static create<This extends {
        prototype: GradumBaseElement;
    }>(this: This, properties?: This["prototype"]["properties"]): This["prototype"];
    /**
     * @protected
     * @static
     * @function customCreate
     * @description The construction step behind {@link create}. Override it to change how instances of a class
     * are built — to route through a factory, or to wrap the instance — while keeping the default-merging that
     * `create` performs.
     * @param {object} properties - Properties to set on the new instance, defaults already merged in.
     * @returns {object} The created instance.
     */
    protected static customCreate(properties: object): object;
}

/**
 * @class GradumEventManager
 * @group Event Handling
 * @category GradumEventManager
 *
 * @extends GradumBaseElement
 * @template {string} ToolType - The union of tool names this manager recognizes.
 * @description Listens to native mouse, trackpad, touch, and keyboard input and turns it into Gradum's
 * richer events — {@link GradumEvent}, {@link GradumDragEvent}, {@link GradumKeyEvent}, and
 * {@link GradumWheelEvent} — so a click, a long press, and a drag arrive as distinct, named events
 * rather than something each component has to derive itself. It also owns the current tool per
 * {@link ClickMode}, and can map screen coordinates into document space for every event it fires.
 *
 * Most applications need only one, reached through {@link GradumEventManager.instance}.
 */
declare class GradumEventManager<ToolType extends string = string> extends GradumBaseElement {
    /**
     * @protected
     * @static
     * @description Every manager that has been created, in creation order.
     */
    protected static managers: GradumEventManager[];
    /**
     * @static
     * @readonly
     * @description The default manager. Creating one on first access, so reading this is always safe.
     */
    static get instance(): GradumEventManager;
    /**
     * @static
     * @description Every manager currently registered. Reading gives a copy, so mutating the result does
     * not affect the registry; assign a new array to replace it.
     */
    static get allManagers(): GradumEventManager[];
    static set allManagers(managers: GradumEventManager[]);
    /**
     * @readonly
     * @description This manager's model, holding its live input state.
     */
    get model(): GradumEventManagerModel;
    /**
     * @readonly
     * @description The properties this manager was created with.
     */
    readonly properties: GradumEventManagerProperties;
    /**
     * @static
     * @description The MVC pieces and event-type switches a new manager starts with. Every event family is
     * enabled by default; pass the matching {@link EnabledGradumEventTypes} flag to `create` to turn one off.
     */
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
    /**
     * @readonly
     * @description Fired whenever the identified input device changes.
     */
    onInputDeviceChange: Delegate<(device: InputDevice) => void>;
    /**
     * @readonly
     * @description The pointer button or input mode currently in use.
     */
    currentClick: ClickMode;
    /**
     * @readonly
     * @description The keyboard keys currently held down.
     */
    currentKeys: string[];
    /**
     * @readonly
     * @description Fired when the tool held by a click mode changes, with the previous tool, the new
     * tool, and the mode.
     */
    onToolChange: Delegate<(oldTool: Node, newTool: Node, type: ClickMode) => void>;
    /**
     * @description Whether events fired by this manager compute scaled positions. Assign a callback to
     * decide per event.
     */
    authorizeEventScaling: boolean | (() => boolean);
    /**
     * @description Converts a screen position into document space for every event this manager fires.
     * Set it so events stay correct under a panned or zoomed canvas.
     */
    scaleEventPosition: (position: Point) => Point;
    /**
     * @description How far, in pixels, a pointer must travel before the interaction counts as a drag
     * rather than a click. Defaults to `10`.
     */
    moveThreshold: number;
    /**
     * @description How long, in milliseconds, a pointer must be held still before a long press fires.
     * Defaults to `500`.
     */
    longPressDuration: number;
    /**
     * @constructor
     * @description Create an event manager and register it in {@link GradumEventManager.allManagers}.
     * The first one created becomes {@link GradumEventManager.instance}.
     */
    constructor();
    /**
     * @function initialize
     * @description Start listening to pointer input on the document and clear any lock. Called
     * automatically by the element lifecycle.
     */
    initialize(): void;
    /**
     * @description Whether keyboard input is listened to and turned into {@link GradumKeyEvent}s. Setting it
     * to `false` reverts key handling to the native event names.
     */
    set keyEventsEnabled(value: boolean);
    /**
     * @description Whether wheel input is listened to and turned into {@link GradumWheelEvent}s. Setting it to
     * `false` reverts wheel handling to the native event names.
     */
    set wheelEventsEnabled(value: boolean);
    /**
     * @description Whether pointer movement produces Gradum move events. Setting it to `false` reverts move
     * handling to the native event names.
     */
    set moveEventsEnabled(value: boolean);
    /**
     * @description Whether mouse input is processed. Setting it to `false` reverts mouse handling to the native
     * event names.
     */
    set mouseEventsEnabled(value: boolean);
    /**
     * @description Whether touch input is processed. Setting it to `false` reverts touch handling to the native
     * event names.
     */
    set touchEventsEnabled(value: boolean);
    /**
     * @description Whether click, click start/end, and long-press events fire. Setting it to `false` reverts
     * click handling to the native event names.
     */
    set clickEventsEnabled(value: boolean);
    /**
     * @description Whether drag and drag start/end events fire. Setting it to `false` reverts drag handling to
     * the native event names.
     */
    set dragEventsEnabled(value: boolean);
    /**
     * @function lock
     * @description Temporarily override the manager's state on behalf of one node, for the duration of
     * an interaction. Use it to impose settings mid-gesture — suppressing native touch scrolling while a
     * drag is in flight, say — then call {@link GradumEventManager.unlock} to hand them back. Any
     * existing lock is released first, so locks do not nest.
     * @param {Node} origin - The node establishing the lock.
     * @param {GradumEventManagerStateProperties} value - The state to impose while the lock is held.
     */
    lock(origin: Node, value: GradumEventManagerStateProperties): void;
    /**
     * @function unlock
     * @description Release the current lock, so the manager's own state applies again.
     */
    unlock(): void;
    /**
     * @description Whether the manager is processing input. Reading combines the manager's own setting
     * with any active lock, so a lock can disable it without overwriting the underlying value; assigning
     * changes only the manager's own setting.
     */
    get enabled(): boolean;
    set enabled(value: boolean);
    /**
     * @description Whether wheel input has its native default suppressed, blocking browser page zoom and
     * scroll. Combines the manager's setting with any active lock, as {@link GradumEventManager.enabled} does.
     */
    get preventDefaultWheel(): boolean;
    set preventDefaultWheel(value: boolean);
    /**
     * @description Whether mouse input has its native default suppressed. Combines the manager's setting
     * with any active lock, as {@link GradumEventManager.enabled} does.
     */
    get preventDefaultMouse(): boolean;
    set preventDefaultMouse(value: boolean);
    /**
     * @description Whether touch input has its native default suppressed, blocking native scrolling and
     * pinch-zoom. Combines the manager's setting with any active lock, as
     * {@link GradumEventManager.enabled} does.
     */
    get preventDefaultTouch(): boolean;
    set preventDefaultTouch(value: boolean);
    /**
     * @description All three prevent-default settings at once. *Note: the getter and setter are not
     * symmetric — reading gives `true` when **any** of wheel, mouse, or touch is suppressed, while
     * assigning sets **all three** to the given value.*
     */
    get preventDefaults(): boolean;
    set preventDefaults(value: boolean);
    /**
     * @readonly
     * @description Every registered tool instance, across all tool names, flattened into one array.
     */
    get toolsArray(): Node[];
    /**
     * @function getCurrentTool
     * @description Get the tool instance currently held by a click mode.
     * @param {ClickMode} [mode=this.model.currentClick] - The click mode to read. Defaults to the mode
     * currently in use.
     * @returns {Node} The tool held by that mode, or `undefined` if it holds none.
     */
    getCurrentTool(mode?: ClickMode): Node;
    /**
     * @function getCurrentTools
     * @description Get every instance sharing the name of the tool currently held by a click mode. Use
     * it when several elements — toolbar buttons in different places, say — represent the same tool.
     * @param {ClickMode} [mode=this.model.currentClick] - The click mode to read. Defaults to the mode
     * currently in use.
     * @returns {Node[]} All instances of that tool, or an empty array if the mode holds none.
     */
    getCurrentTools(mode?: ClickMode): Node[];
    /**
     * @function getCurrentToolName
     * @description Get the name of the tool currently held by a click mode.
     * @param {ClickMode} [mode=this.model.currentClick] - The click mode to read. Defaults to the mode
     * currently in use.
     * @returns {ToolType} The tool's name, or `undefined` if the mode holds none.
     */
    getCurrentToolName(mode?: ClickMode): ToolType;
    /**
     * @function getToolName
     * @description Get the name a tool instance is registered under.
     * @param {Node} tool - The tool instance to look up.
     * @returns {ToolType} The registered name, or `undefined` if the node is not a registered tool.
     */
    getToolName(tool: Node): ToolType;
    /**
     * @function getSimilarTools
     * @description Get every instance registered under the same name as the given tool, including the
     * tool itself.
     * @param {Node} tool - The tool instance to match against.
     * @returns {Node[]} All instances sharing its name, or an empty array if it is not registered.
     */
    getSimilarTools(tool: Node): Node[];
    /**
     * @function getToolsByName
     * @description Get every tool instance registered under a name.
     * @param {ToolType} name - The tool name to look up.
     * @returns {Node[]} All instances registered under that name, or an empty array if there are none.
     */
    getToolsByName(name: ToolType): Node[];
    /**
     * @function getToolByName
     * @description Get a single tool instance registered under a name. Pass a predicate to choose among
     * several instances.
     * @param {ToolType} name - The tool name to look up.
     * @param {(tool: Node) => boolean} [predicate] - Chooses which instance to return. Without it, the
     * first registered instance is returned.
     * @returns {Node} The matching instance, or `undefined` if there is none.
     */
    getToolByName(name: ToolType, predicate?: (tool: Node) => boolean): Node;
    /**
     * @function getToolsByKey
     * @description Get every tool instance bound to a keyboard key.
     * @param {string} key - The key the tool is mapped to.
     * @returns {Node[]} All instances bound to that key, or an empty array if the key maps to nothing.
     */
    getToolsByKey(key: string): Node[];
    /**
     * @function getToolByKey
     * @description Get a single tool instance bound to a keyboard key. Pass a predicate to choose among
     * several instances.
     * @param {string} key - The key the tool is mapped to.
     * @param {(tool: Element) => boolean} [predicate] - Chooses which instance to return. Without it, the
     * first one is returned.
     * @returns {Node} The matching instance, or `undefined` if there is none.
     */
    getToolByKey(key: string, predicate?: (tool: Element) => boolean): Node;
    /**
     * @function addTool
     * @description Register a tool instance under a name, so the manager can make it current and find it
     * again. Several instances may share one name.
     * @param {ToolType} toolName - The name to register the instance under.
     * @param {Node} tool - The tool instance.
     * @param {string} [key] - A keyboard key that selects this tool when pressed.
     */
    addTool(toolName: ToolType, tool: Node, key?: string): void;
    /**
     * @function setTool
     * @description Make a tool the current one for a click mode, so interactions in that mode are
     * attributed to it. The previously held tool is deselected and deactivated first, and
     * {@link GradumEventManager.onToolChange} fires once the swap is done. Passing a tool that is not
     * registered with this manager does nothing.
     * @param {Node} tool - The tool instance to make current. Pass `undefined` to clear the mode.
     * @param {ClickMode} type - The click mode to bind the tool to.
     * @param {SetToolOptions} [options={}] - Whether to select and activate the tool, and whether it also
     * becomes the tool for `ClickMode.none`.
     */
    setTool(tool: Node, type: ClickMode, options?: SetToolOptions): void;
    /**
     * @function setToolByKey
     * @description Make the tool bound to a keyboard key current for `ClickMode.key`. The tool is
     * activated but not visually selected.
     * @param {string} key - The key whose tool should become current.
     * @returns {boolean} Whether a tool was bound to that key and therefore set.
     */
    setToolByKey(key: string): boolean;
    /**
     * @function setupCustomDispatcher
     * @description Start dispatching an additional event type through the Gradum two-pass dispatch, so
     * tool behaviors and interactor listeners receive it like any built-in Gradum event. Registering the
     * same type twice is a no-op.
     * @param {string} type - The event type to dispatch.
     */
    setupCustomDispatcher(type: string): void;
    /**
     * @protected
     * @function applyAndHookEvents
     * @description Switch a family of events between its Gradum names and its native names, and hook or
     * unhook the dispatcher for each. Backs the `*EventsEnabled` setters.
     * @param {Record<string, string>} gradumEventNames - The Gradum names for this family.
     * @param {Record<string, string>} defaultEventNames - The native names to fall back to.
     * @param {boolean} applyGradumEvents - Whether to use the Gradum names and hook the dispatcher, or
     * revert to the native names and unhook it.
     */
    protected applyAndHookEvents(gradumEventNames: Record<string, string>, defaultEventNames: Record<string, string>, applyGradumEvents: boolean): void;
    /**
     * @function destroy
     * @description Shut the manager down: disable every event family, unhook its dispatchers, and clear
     * the tool-change subscribers. Registered tools are left in place.
     * @returns {this} Itself, allowing for method chaining.
     */
    destroy(): this;
}

/**
 * @type {MakeConstrainerOptions}
 * @group GradumSelector
 * @category Constrainers
 *
 * @description Options for turning an object into a constrainer with
 * {@link GradumSelector.makeConstrainer}.
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
 * @group GradumSelector
 * @category Constrainers
 *
 * @description The context handed to a solver as its first argument, naming the constrainer, the object
 * being processed, and the event that triggered it. Passed when solving through
 * {@link GradumSelector.solveConstrainer}.
 * @property {string} [constrainer] - The targeted constrainer. Defaults to `currentConstrainer`.
 * @property {object} [constrainerHost] - The object to which the target constrainer is attached.
 * @property {object} [target] - The current object being processed by the solver. Property set by
 * {@link GradumSelector.solveConstrainer} when processing every object in the constrainer's list.
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
 * @group GradumSelector
 * @category Constrainers
 *
 * @extends ConstrainerCallbackProperties
 * @template Type - The type of the value to mutate.
 * @description The context handed to a mutator as its first argument, naming which mutator to run and the
 * value it should transform. Passed when mutating through {@link GradumSelector.mutate}.
 * @property {string} [mutation] - The name of the mutator to execute.
 * @property {Type} [value] - The value to mutate.
 */
type ConstrainerMutatorProperties<Type = any> = ConstrainerCallbackProperties & {
    mutation?: string;
    value?: Type;
};
/**
 * @callback ConstrainerChecker
 * @group GradumSelector
 * @category Constrainers
 *
 * @description Signature for a constrainer checker: decides whether the constraint currently holds for the
 * object being processed. Returning `false` stops the event that triggered the check.
 * @param {ConstrainerCallbackProperties} properties - The constrainer context for this pass.
 * @param {...any[]} args - Any extra arguments forwarded by the caller.
 * @returns {boolean} Whether the constraint is satisfied.
 */
type ConstrainerChecker = (properties: ConstrainerCallbackProperties, ...args: any[]) => boolean;
/**
 * @callback ConstrainerMutator
 * @group GradumSelector
 * @category Constrainers
 * @template Type - The type of the value being mutated.
 *
 * @description Signature for a constrainer mutator: transforms a value as part of resolving a constraint.
 * @param {ConstrainerMutatorProperties<Type>} properties - The mutation context, naming the mutator and
 * carrying the value.
 * @param {...any[]} args - Any extra arguments forwarded by the caller.
 * @returns {Type} The transformed value.
 */
type ConstrainerMutator<Type = any> = (properties: ConstrainerMutatorProperties<Type>, ...args: any[]) => Type;
/**
 * @callback ConstrainerSolver
 * @group GradumSelector
 * @category Constrainers
 *
 * @description Signature for a constrainer solver: adjusts the object so the constraint is satisfied.
 * @param {ConstrainerCallbackProperties} properties - The constrainer context for this pass.
 * @param {...any[]} args - Any extra arguments forwarded by the caller.
 * @returns {Propagation | void} An optional propagation directive for the event that triggered the solve.
 */
type ConstrainerSolver = (properties: ConstrainerCallbackProperties, ...args: any[]) => Propagation | void;
/**
 * @type {ConstrainerAddCallbackProperties}
 * @group GradumSelector
 * @category Constrainers
 * @template {ConstrainerChecker | ConstrainerMutator | ConstrainerSolver} Type - The type of callback.
 *
 * @description Options for registering a checker, mutator, or solver on an existing constrainer.
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
 * @category Registry
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
 * @enum {RegistryCategory}
 * @group Decorators
 * @category Registry
 *
 * @description The bucket a class is filed under in the Gradum Kit registry, and the value
 * {@link getRegisteredByCategories} groups by. {@link define} infers it by walking the class'
 * inheritance chain; within each family below the categories are listed most to least specific, and
 * the first match wins, so a class extending {@link GradumElement} is filed as `GradumElement` rather
 * than the `HTMLElement` it also inherits from.
 * @property {RegistryCategory.GradumProxiedElement} GradumProxiedElement - Gradum elements, most specific first.
 * @property {RegistryCategory.GradumElement} GradumElement - Gradum element extending `HTMLElement`.
 * @property {RegistryCategory.GradumBaseElement} GradumBaseElement - Shared element foundation.
 * @property {RegistryCategory.GradumHeadlessElement} GradumHeadlessElement - Element without a DOM node.
 * @property {RegistryCategory.SVGElement} SVGElement - Native DOM elements, most specific first.
 * @property {RegistryCategory.MathMLElement} MathMLElement - Native MathML element.
 * @property {RegistryCategory.HTMLElement} HTMLElement - Native HTML element.
 * @property {RegistryCategory.Element} Element - Any other native element.
 * @property {RegistryCategory.Node} Node - Any other DOM node.
 * @property {RegistryCategory.GradumOperator} GradumOperator - MVC pieces.
 * @property {RegistryCategory.GradumHandler} GradumHandler - Model-only helper.
 * @property {RegistryCategory.GradumInteractor} GradumInteractor - Tool-event listener holder.
 * @property {RegistryCategory.GradumTool} GradumTool - Capture-phase behavior holder.
 * @property {RegistryCategory.GradumConstrainer} GradumConstrainer - Constraint solver.
 * @property {RegistryCategory.GradumView} GradumView - View.
 * @property {RegistryCategory.GradumEmitter} GradumEmitter - Emitter.
 * @property {RegistryCategory.GradumModel} GradumModel - Model.
 * @property {RegistryCategory.Other} Other - Classes matching no recognized base type.
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
 * @category Registry
 *
 * @description Represents a single entry in the Gradum Kit class registry, as stored and returned
 * by {@link findRegistered} and related query functions.
 * @property {new (...args: any[]) => any} constructor - The registered class constructor.
 * @property {RegistryCategory | string} category - The category the class was registered under, either
 * passed explicitly to {@link define} or inferred from its inheritance chain. It is a plain string when
 * a custom category was supplied.
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
 * @category Registry
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
 * @category Registry
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
 * @category Registry
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
 * @category Registry
 *
 * @description Returns all registered entries across one or more specified categories.
 * @param {...RegistryCategory[]} categories - The categories to retrieve entries from.
 * @returns {RegistryEntry[]} An array of all registry entries in the specified categories.
 */
declare function getRegisteredByCategories(...categories: RegistryCategory[]): RegistryEntry[];
/**
 * @function getAllRegistered
 * @group Decorators
 * @category Registry
 *
 * @description Returns all registered entries across every category in the registry.
 * @returns {RegistryEntry[]} An array of all registry entries.
 */
declare function getAllRegistered(): RegistryEntry[];
/**
 * @function getRegisteredMvc
 * @group Decorators
 * @category Registry
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
 * @category Registry
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
 * @category Registry
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
declare function behavior(properties?: Partial<Omit<ListenerProperties, "callback" | "options">>): <T extends object>(value: (this: T, e?: Event, target?: Node, options?: ToolBehaviorOptions) => any, context: ClassMethodDecoratorContext<T>) => (this: T, e?: Event, target?: Node, options?: ToolBehaviorOptions) => any;
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
 * @category Attributes
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
 * @template Value - The type of the value held by the signal.
 * @description Create a standalone reactive signal from an initial value.
 * @param {Value} [initial] - Initial value stored by the signal.
 * @param {object} [target] - The object to bind the signal to. Omit it for a free-standing signal.
 * @param {...KeyType[]} keys - The key path at which the signal is stored in the target.
 * @returns {SignalBox<Value>} A reactive box for reading and updating the value.
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
 * @template Value - The type of the value held by the signal.
 * @description Create a standalone reactive signal backed by an existing getter and setter, rather than
 * by its own storage. Use it to make a value that already lives somewhere else reactive.
 * @param {() => Value} get - Getter that returns the value.
 * @param {(value: Value) => void} set - Setter that changes the value and emits the signal.
 * @param {object} [target] - The object to bind the signal to. Omit it for a free-standing signal.
 * @param {...KeyType[]} keys - The key path at which the signal is stored in the target.
 * @returns {SignalBox<Value>} A reactive box for reading and updating the value.
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
 * @description Stage-3 decorator that turns a field on a {@link GradumModel} into a reactive property
 * stored in the model's data, rather than on the instance. Use it for state that must be persisted or
 * synced — on a {@link GradumYModel} the value lives in the underlying Y.js structure. Use `@signal`
 * instead for state that should stay in memory.
 * @param {...KeyType[]} keys - The key path into the model's data. Defaults to the decorated member name if omitted.
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
 * @description Stage-3 decorator that exposes a nested collection as a {@link GradumModel} rather than as
 * raw data. Reading the property gives back the nested model, so you can attach a {@link GradumObserver}
 * to it; assigning replaces the data it wraps. Use it when you need to observe a collection — reach for
 * `@modelSignal` when the raw value is enough.
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
 * @function trackSignal
 * @group Decorators
 * @category Signal
 *
 * @description Register a signal as a dependency of the effect currently running, without reading through
 * it. Use it when a value is fetched by some other route — a lookup, a data walk — but should still make the
 * surrounding `@effect` re-run when that signal changes. Outside an effect it does nothing.
 * @param {SignalEntry} entry - The signal to depend on.
 */
declare function trackSignal(entry: SignalEntry): void;
/**
 * @function getSignal
 * @group Decorators
 * @category Signal
 *
 * @template Type - The type of the value held by the signal.
 * @description Retrieve the signal backing a reactive property, to read or subscribe to it without
 * going through the property itself.
 * @param {object} target - The object the signal is bound to.
 * @param {PropertyKey} key - The key of the signal inside `target`.
 * @returns {SignalEntry<Type>} The signal, or `undefined` if `key` is not reactive on `target`.
 */
declare function getSignal<Type = any>(target: object, key: PropertyKey): SignalEntry<Type>;
/**
 * @function setSignal
 * @group Decorators
 * @category Signal
 *
 * @template Type - The type of the value held by the signal.
 * @description Write to a reactive property through its signal, notifying subscribers and effects.
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
/**
 * @function untrack
 * @group Decorators
 * @category Effect
 *
 * @template T - The type returned by the callback.
 * @description Read signals without subscribing to them. Signals read inside the callback are not recorded
 * as dependencies of the surrounding `@effect`, so changing them later will not re-run it. Use it when an
 * effect needs a value to compute with but should not fire when that value changes — reading a current
 * index or a configuration flag, say, while only tracking the data being rendered.
 * @param {() => T} fn - The callback to run outside the tracking context.
 * @returns {T} Whatever the callback returns.
 *
 * @example
 * ```ts
 * @effect private render() {
 *    // re-runs when `items` changes, but not when `verbose` does
 *    this.draw(this.model.items, untrack(() => this.model.verbose));
 * }
 * ```
 */
declare function untrack<T>(fn: () => T): T;

/**
 * @function a
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates an `<a>` element with the specified properties.
 * @param {GradumProperties<"a">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"a">} The created element, with the given properties already applied.
 */
declare function a(properties?: GradumProperties<"a">): ValidElement<"a">;
/**
 * @function canvas
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<canvas>` element with the specified properties.
 * @param {GradumProperties<"canvas">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"canvas">} The created element, with the given properties already applied.
 */
declare function canvas(properties?: GradumProperties<"canvas">): ValidElement<"canvas">;
/**
 * @function div
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<div>` element with the specified properties.
 * @param {GradumProperties<"div">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"div">} The created element, with the given properties already applied.
 */
declare function div(properties?: GradumProperties): ValidElement<"div">;
/**
 * @function form
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<form>` element with the specified properties.
 * @param {GradumProperties<"form">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"form">} The created element, with the given properties already applied.
 */
declare function form(properties?: GradumProperties<"form">): ValidElement<"form">;
/**
 * @function h1
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h1>` element with the specified properties.
 * @param {GradumProperties<"h1">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h1">} The created element, with the given properties already applied.
 */
declare function h1(properties?: GradumProperties<"h1">): ValidElement<"h1">;
/**
 * @function h2
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h2>` element with the specified properties.
 * @param {GradumProperties<"h2">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h2">} The created element, with the given properties already applied.
 */
declare function h2(properties?: GradumProperties<"h2">): ValidElement<"h2">;
/**
 * @function h3
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h3>` element with the specified properties.
 * @param {GradumProperties<"h3">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h3">} The created element, with the given properties already applied.
 */
declare function h3(properties?: GradumProperties<"h3">): ValidElement<"h3">;
/**
 * @function h4
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h4>` element with the specified properties.
 * @param {GradumProperties<"h4">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h4">} The created element, with the given properties already applied.
 */
declare function h4(properties?: GradumProperties<"h4">): ValidElement<"h4">;
/**
 * @function h5
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h5>` element with the specified properties.
 * @param {GradumProperties<"h5">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h5">} The created element, with the given properties already applied.
 */
declare function h5(properties?: GradumProperties<"h5">): ValidElement<"h5">;
/**
 * @function h6
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h6>` element with the specified properties.
 * @param {GradumProperties<"h6">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h6">} The created element, with the given properties already applied.
 */
declare function h6(properties?: GradumProperties<"h6">): ValidElement<"h6">;
/**
 * @function img
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates an `<img>` element with the specified properties.
 * @param {GradumProperties<"img">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"img">} The created element, with the given properties already applied.
 */
declare function img(properties?: GradumProperties<"img">): ValidElement<"img">;
/**
 * @function input
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates an `<input>` element with the specified properties.
 * @param {GradumProperties<"input">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"input">} The created element, with the given properties already applied.
 */
declare function input(properties?: GradumProperties<"input">): ValidElement<"input">;
/**
 * @function link
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<link>` element with the specified properties.
 * @param {GradumProperties<"link">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"link">} The created element, with the given properties already applied.
 */
declare function link(properties?: GradumProperties<"link">): ValidElement<"link">;
/**
 * @function p
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<p>` element with the specified properties.
 * @param {GradumProperties<"p">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"p">} The created element, with the given properties already applied.
 */
declare function p(properties?: GradumProperties<"p">): ValidElement<"p">;
/**
 * @function span
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<span>` element with the specified properties.
 * @param {GradumProperties<"span">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"span">} The created element, with the given properties already applied.
 */
declare function span(properties?: GradumProperties<"span">): ValidElement<"span">;
/**
 * @function style
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<style>` element with the specified properties.
 * @param {GradumProperties<"style">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"style">} The created element, with the given properties already applied.
 */
declare function style(properties?: GradumProperties<"style">): ValidElement<"style">;
/**
 * @function textarea
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<textarea>` element with the specified properties.
 * @param {GradumProperties<"textarea">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"textarea">} The created element, with the given properties already applied.
 */
declare function textarea(properties?: GradumProperties<"textarea">): ValidElement<"textarea">;
/**
 * @function video
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<video>` element with the specified properties.
 * @param {GradumProperties<"video">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"video">} The created element, with the given properties already applied.
 */
declare function video(properties?: GradumProperties<"video">): ValidElement<"video">;
/**
 * @function button
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<button>` element with the specified properties.
 * @param {GradumProperties<"button">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"button">} The created element, with the given properties already applied.
 */
declare function button(properties?: GradumProperties<"button">): ValidElement<"button">;

/**
 * @function generateTagFunction
 * @group Element Creation
 * @category Creation Functions
 *
 * @template {ValidTag} Tag - The tag the generated function creates.
 * @description Build a creation function bound to one tag, so callers no longer have to pass the tag
 * themselves. Use it to add a shorthand builder for a tag this library does not already ship one for —
 * the result behaves like the built-in {@link div} and {@link span}.
 * @param {Tag} tag - The tag the returned function creates.
 * @returns {(properties?: GradumProperties<Tag>) => ValidElement<Tag>} A function that creates an
 * element of that tag from the given properties.
 *
 * @example
 * ```ts
 * const section = generateTagFunction("section");
 * const el = section({classes: "panel"});
 * ```
 */
declare function generateTagFunction<Tag extends ValidTag>(tag: Tag): (properties?: GradumProperties<Tag>) => ValidElement<Tag>;
/**
 * @function element
 * @group Element Creation
 * @category Creation Functions
 *
 * @template {ValidTag} Tag - The tag of the element to create.
 * @description Create an element from a properties object and apply those properties to it. The
 * namespace is taken from `properties.namespace`: pass `"svg"` or `"mathML"` for those documents, or a
 * namespace URI directly. Use {@link blindElement} instead to have the namespace inferred from the tag.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidElement<Tag>} The created element, with the given properties already applied.
 */
declare function element<Tag extends ValidTag>(properties?: GradumProperties<Tag>): ValidElement<Tag>;
/**
 * @function blindElement
 * @group Element Creation
 * @category Creation Functions
 *
 * @template {ValidTag} Tag - The tag of the element to create.
 * @description Create an element from a properties object, working out the namespace from the tag alone
 * — SVG tags land in the SVG namespace, MathML tags in the MathML one, everything else in HTML. Use it
 * when the tag is only known at runtime; use {@link element} when you can state the namespace yourself.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidElement<Tag>} The created element, with the given properties already applied.
 */
declare function blindElement<Tag extends ValidTag>(properties?: GradumProperties<Tag>): ValidElement<Tag>;

/**
 * @function flexCol
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create an element that lays its children out in a vertical flex column.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `display: flex` and
 * `flex-direction: column` already applied.
 */
declare function flexCol<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag>;
/**
 * @function flexColCenter
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create a vertical flex column that also centers its children on both axes.
 * Same as {@link flexCol}, with the centering styles applied on top.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `display: flex`,
 * `flex-direction: column`, `justify-content: center`, and `align-items: center` applied.
 */
declare function flexColCenter<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag>;
/**
 * @function flexRow
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create an element that lays its children out in a horizontal flex row.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `display: flex` and
 * `flex-direction: row` already applied.
 */
declare function flexRow<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag>;
/**
 * @function flexRowCenter
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create a horizontal flex row that also centers its children on both axes.
 * Same as {@link flexRow}, with the centering styles applied on top.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `display: flex`,
 * `flex-direction: row`, `justify-content: center`, and `align-items: center` applied.
 */
declare function flexRowCenter<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag>;
/**
 * @function spacer
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create an element that absorbs the free space of its flex parent, pushing the
 * siblings on either side of it apart.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `flex-grow: 1` already applied.
 */
declare function spacer<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag>;

/**
 * @type {StylesRoot}
 * @group GradumSelector
 * @category Style
 *
 * @description A type that represents entities that can hold a <style> object (Shadow root or HTML head).
 */
type StylesRoot = ShadowRoot | HTMLHeadElement;
/**
 * @type {StylesType}
 * @group GradumSelector
 * @category Style
 *
 * @description A type that represents the types that are accepted as styles entries (mainly by the
 * HTMLElement.setStyles()
 * method). It includes strings, numbers, and records of CSS attributes to strings or numbers.
 */
type StylesType = string | number | PartialRecord<keyof CSSStyleDeclaration, string | number>;
/**
 * @function stylesheet
 * @group Element Creation
 * @category Creation Functions
 *
 * @description Add a CSS string to the document as a new `<style>` element. Pass a shadow root to
 * scope the styles to one component instead of the whole page. Does nothing if `styles` is empty.
 * @param {string} [styles] - The CSS to add. Use the {@link css} literal function for autocompletion.
 * @param {StylesRoot} [root=document.head] - The shadow root or document head to add the element to.
 */
declare function stylesheet(styles?: string, root?: StylesRoot): void;

/**
 * @class GradumDragEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description The event fired for `gradum-drag`, `gradum-drag-start`, and `gradum-drag-end`. It tracks
 * every active pointer at once, so a multi-touch drag reports one entry per finger: each map below is
 * keyed by pointer id. Every position is available raw and scaled into document space, along with the
 * per-event deltas.
 */
declare class GradumDragEvent extends GradumEvent {
    /**
     * @description Where each pointer started its drag, keyed by pointer id.
     */
    readonly origins: GradumMap<number, Point>;
    /**
     * @description Where each pointer was on the previous drag event, keyed by pointer id.
     */
    readonly previousPositions: GradumMap<number, Point>;
    /**
     * @description Where each pointer is now, keyed by pointer id.
     */
    readonly positions: GradumMap<number, Point>;
    /**
     * @constructor
     * @description Create a drag event. The event's single `position` is taken from the first entry of
     * `positions`.
     * @param {GradumDragEventProperties} properties - The per-pointer position maps and input context.
     */
    constructor(properties: GradumDragEventProperties);
    /**
     * @readonly
     * @description {@link GradumDragEvent.origins} in document space. Falls back to the raw origins when
     * scaling is not authorized.
     */
    get scaledOrigins(): GradumMap<number, Point>;
    /**
     * @readonly
     * @description {@link GradumDragEvent.previousPositions} in document space. Falls back to the raw
     * positions when scaling is not authorized.
     */
    get scaledPreviousPositions(): GradumMap<number, Point>;
    /**
     * @readonly
     * @description {@link GradumDragEvent.positions} in document space. Falls back to the raw positions
     * when scaling is not authorized.
     */
    get scaledPositions(): GradumMap<number, Point>;
    /**
     * @readonly
     * @description How far each pointer moved since the previous event, keyed by pointer id. A pointer
     * with no previous position — on drag start, or when a finger has just joined — reports a zero delta
     * rather than being left out, so a delta is always defined for every active pointer.
     */
    get deltaPositions(): GradumMap<number, Point>;
    /**
     * @readonly
     * @description The average movement across all pointers since the previous event. Use it to move
     * something with the drag without caring how many fingers are down.
     */
    get deltaPosition(): Point;
    /**
     * @readonly
     * @description {@link GradumDragEvent.deltaPositions} in document space, so the deltas match the
     * coordinates of a panned or zoomed canvas.
     */
    get scaledDeltaPositions(): GradumMap<number, Point>;
    /**
     * @readonly
     * @description The average movement across all pointers since the previous event, in document space.
     */
    get scaledDeltaPosition(): Point;
}

/**
 * @class GradumKeyEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description The event fired for `gradum-key-pressed` and `gradum-key-released`. Which of the two key
 * fields is set tells you which happened. Key events carry no pointer position, so
 * {@link GradumEvent.position} is `null`.
 */
declare class GradumKeyEvent extends GradumEvent {
    /**
     * @description The key that was pressed, or `undefined` on a release event.
     */
    readonly keyPressed: string;
    /**
     * @description The key that was released, or `undefined` on a press event.
     */
    readonly keyReleased: string;
    /**
     * @constructor
     * @description Create a key event. Its position is always `null`.
     * @param {GradumKeyEventProperties} properties - The key involved and the input context.
     */
    constructor(properties: GradumKeyEventProperties);
}

/**
 * @class GradumWheelEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description The event fired for `gradum-scroll` and `gradum-pinch`. Wheel events carry no pointer
 * position, so {@link GradumEvent.position} is `null` — read {@link GradumWheelEvent.delta} instead.
 */
declare class GradumWheelEvent extends GradumEvent {
    /**
     * @description How far the wheel or trackpad moved on each axis since the last event.
     */
    readonly delta: Point;
    /**
     * @constructor
     * @description Create a wheel event. Its position is always `null`.
     * @param {GradumWheelEventProperties} properties - The scroll delta and the input context.
     */
    constructor(properties: GradumWheelEventProperties);
}

/**
 * @class GradumElement
 * @group MVC
 * @category Element Classes
 *
 * @extends HTMLElement
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Base GradumElement class, extending the base HTML element with a few useful tools and functions.
 * */
declare class GradumElement<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>> extends HTMLElement {
    /**
     * @description Default properties assigned to a new instance.
     */
    static defaultProperties: GradumElementProperties;
    /**
     * @function create
     * @static
     * @description Instantiate this class with the given properties. Defaults declared by every class in the
     * inheritance chain are applied first, nearest ancestor last, so a subclass' `defaultProperties` win over
     * its parent's. The return type follows the class it is called on, and the MVC type parameters are read
     * back off the properties — passing `model: MyModel` types `.model` as `MyModel` without a cast.
     *
     * *Note: the callee is read through `this["prototype"]` rather than `InstanceType<this>`, because the
     * latter instantiates a generic class' parameters with their constraints instead of their defaults,
     * which is what forced casts at call sites.*
     * @template {{prototype: GradumElement}} This - The class `create` was called on.
     * @template {GradumView} ViewType - Inferred from `properties.view`.
     * @template {object} DataType - Inferred from `properties.data`.
     * @template {GradumModel} ModelType - Inferred from `properties.model`.
     * @template {GradumEmitter} EmitterType - Inferred from `properties.emitter`.
     * @param {GradumElementProperties} [properties] - Properties to set on the new instance.
     * @returns {GradumElement} The created instance, typed as the class this was called on.
     */
    static create<This extends {
        prototype: GradumElement;
    }, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>>(this: This, properties?: This["prototype"]["properties"] & GradumElementProperties<ViewType, DataType, ModelType, EmitterType>): This["prototype"] & GradumElement<ViewType, DataType, ModelType, EmitterType>;
    /**
     * @protected
     * @static
     * @function customCreate
     * @description The construction step behind {@link create}. Override it to change how instances of a class
     * are built — to route through a factory, or to wrap the instance — while keeping the default-merging that
     * `create` performs.
     * @param {object} properties - Properties to set on the new instance, defaults already merged in.
     * @returns {object} The created instance.
     */
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
     * @function random
     * @description Generate a random color with a random hue, constrained to the given saturation and
     * lightness. The defaults produce muted pastel tones rather than fully saturated ones.
     * @param {number | [number, number]} [saturation=[50, 70]] - Saturation percentage, or a `[min, max]`
     * range to pick one from.
     * @param {number | [number, number]} [lightness=[70, 85]] - Lightness percentage, or a `[min, max]`
     * range to pick one from.
     * @returns {Color} The generated color.
     * @static
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
 * @category Basics
 *
 * @extends GradumElementProperties
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumIcon}. Values left out fall back to
 * {@link GradumIcon.defaultProperties}.
 * @property {string} icon - Name of the icon, file extension included to override the resolved type.
 * @property {string} [iconColor] - Color applied to the icon.
 * @property {(svg: SVGElement) => void} [onLoaded] - Called with the loaded SVG element, to modify it once
 * it is available. Ignored for icons that are not SVGs.
 * @property {string} [type] - File type of the icon, used when the name carries no extension.
 * @property {string} [directory] - Directory the icon is loaded from.
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
 * @category Basics
 *
 * @extends GradumElement
 * @description Icon class for creating icon elements.
 */
declare class GradumIcon<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumIconProperties;
    /**
     * @static
     * @readonly
     * @description Extra icon loaders, keyed by file extension. Register one to teach every icon how to
     * load a format the built-in SVG and image loaders do not cover.
     */
    static readonly customLoaders: Record<string, (path: string) => (Element | Promise<Element>)>;
    /**
     * @static
     * @description Default properties assigned to a new icon. Icons are treated as SVG unless told otherwise.
     */
    static defaultProperties: Partial<GradumIconProperties>;
    private static imageTypes;
    private _element;
    private _loadToken;
    /**
     * @description Called with the loaded element once the icon finishes loading. Loading is asynchronous
     * for SVGs, so use this rather than reading the element straight after assigning an icon name.
     */
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
    /**
     * @function loadSvg
     * @protected
     * @description Fetch an SVG file and return its root element. Results are cached, so the same path is
     * only fetched once.
     * @param {string} path - The path to the SVG file.
     * @returns {Promise<SVGElement>} The loaded SVG element.
     */
    protected loadSvg(path: string): Promise<SVGElement>;
    /**
     * @function loadImg
     * @protected
     * @description Build an `<img>` element for a raster icon, using the icon's name as its alt text.
     * @param {string} path - The path to the image file.
     * @returns {HTMLImageElement} The created image element.
     */
    protected loadImg(path: string): HTMLImageElement;
    /**
     * @function updateColor
     * @protected
     * @description Recolor the icon by setting its fill. Only applies to SVG icons; raster images are left
     * as they are.
     * @param {Color} [value=this.iconColor] - The color to apply. Defaults to the icon's own color.
     */
    protected updateColor(value?: Color): void;
    /**
     * @function generateIcon
     * @protected
     * @description Load the icon for the current name and type, and swap it in as this element's content.
     * Reuses the existing element when only the source changed.
     */
    protected generateIcon(): void;
    private getLoader;
    private setupLoadedElement;
    private clear;
}

/**
 * @type {GradumRichElementProperties}
 * @group Components
 * @category Basics
 *
 * @extends GradumElementProperties
 * @template {ValidTag} ElementTag - The tag of the main element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumRichElement} — a main element flanked by up to
 * four optional slots. They are laid out left to right in the order below.
 * @property {ElementTag} [elementTag] - The HTML tag used for the main element when `element` is a string
 * or a properties object.
 * @property {string} [text] - Text content of the main element.
 * @property {Element | Element[]} [leftCustomElements] - Elements placed leftmost, before `leftIcon`.
 * @property {string | GradumIcon} [leftIcon] - Icon placed left of the main element. A string is treated as
 * an icon name or path.
 * @property {string | HTMLElement} [prefixEntry] - Content placed immediately before the main element.
 * @property {string | GradumProperties<ElementTag> | ValidElement<ElementTag>} [element] - The main element:
 * its text, the properties to build it from, or an existing element to adopt.
 * @property {string | HTMLElement} [suffixEntry] - Content placed immediately after the main element.
 * @property {string | GradumIcon} [rightIcon] - Icon placed right of the main element. A string is treated as
 * an icon name or path.
 * @property {Element | Element[]} [rightCustomElements] - Elements placed rightmost, after `rightIcon`.
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
 * @category Basics
 *
 * @extends GradumElement
 * @template {ValidTag} ElementTag - The tag of the main element to create the rich element from.
 * @description Class for creating a rich gradum element (an element that is possibly accompanied by icons (or other elements) on
 * its left and/or right).
 */
declare class GradumRichElement<ElementTag extends ValidTag = any, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumRichElementProperties;
    /**
     * @static
     * @description Default properties assigned to a new rich element.
     */
    static defaultProperties: GradumRichElementProperties;
    /**
     * @function customCreate
     * @static
     * @protected
     * @description Build a rich element, resolving `text` and `elementTag` into the configuration of its inner
     * element before construction.
     * @param {GradumRichElementProperties} properties - The element's configuration.
     * @returns {object} The created rich element.
     */
    protected static customCreate(properties: GradumRichElementProperties): object;
    /**
     * @readonly
     * @description The order the rich element's parts are laid out in, from left to right. Assigning a part
     * inserts it at its place in this order rather than at the end.
     */
    readonly childrenOrder: readonly ["leftCustomElements", "leftIcon", "prefixEntry", "element", "suffixEntry", "rightIcon", "rightCustomElements"];
    /**
     * @description Add one or more elements to this rich element at the given position.
     * @param {Element | Element[] | null} element - The element(s) to add.
     * @param {this["childrenOrder"][number]} type - The type of child element being added.
     */
    private addAtPosition;
    /**
     * @description The tag used for this rich element's text element
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
     * @description The element shown before the text. Assigning a string sets its text content; assigning
     * an element replaces it outright.
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
     * @description The element shown after the text. Assigning a string sets its text content; assigning
     * an element replaces it outright.
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
 * @category Basics
 *
 * @extends GradumElement
 * @description Button class for creating Gradum button elements.
 */
declare class GradumButton<ElementTag extends ValidTag = any, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumRichElement<ElementTag, ViewType, DataType, ModelType, EmitterType> {
}

/**
 * @callback ReifectInterpolator
 * @group Components
 * @category Reifects
 *
 * @template Type - The type of the configured value.
 * @template {object} ClassType - The type of the attached object.
 * @description Computes a value per attached object, so one configuration can vary across the objects it
 * is applied to — staggering a delay by `index`, for instance.
 * @param {number} index - The object's position among the attached objects.
 * @param {number} total - How many objects are attached in total.
 * @param {ClassType} object - The object the value is being computed for.
 * @returns {Type} The value to use for that object.
 */
type ReifectInterpolator<Type, ClassType extends object = Element> = (index: number, total: number, object: ClassType) => Type;
/**
 * @callback StateInterpolator
 * @group Components
 * @category Reifects
 *
 * @template Type - The type of the configured value.
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description Computes a value per attached object *and* per state, for configurations that vary along
 * both axes. Use {@link ReifectInterpolator} when the value does not depend on the state.
 * @param {State} state - The state the value is being computed for.
 * @param {number} index - The object's position among the attached objects.
 * @param {number} total - How many objects are attached in total.
 * @param {ClassType} object - The object the value is being computed for.
 * @returns {Type} The value to use for that object in that state.
 */
type StateInterpolator<Type, State extends KeyType, ClassType extends object = Element> = (state: State, index: number, total: number, object: ClassType) => Type;
/**
 * @type {StateSpecificProperty}
 * @group Components
 * @category Reifects
 *
 * @template Type - The type of the configured value.
 * @template {object} ClassType - The type of the attached object.
 * @description A value for one state: either a fixed value, or a {@link ReifectInterpolator} that computes
 * it per object.
 */
type StateSpecificProperty<Type, ClassType extends object = Element> = Type | ReifectInterpolator<Type, ClassType>;
/**
 * @type {BasicPropertyConfig}
 * @group Components
 * @category Reifects
 *
 * @template Type - The type of the configured value.
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @description A property configured either per state, or as one value shared by every state. The
 * interpolator-free counterpart of {@link PropertyConfig}.
 */
type BasicPropertyConfig<Type, State extends KeyType> = PartialRecord<State, Type> | Type;
/**
 * @type {PropertyConfig}
 * @group Components
 * @category Reifects
 *
 * @template Type - The type of the configured value.
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description How a single reifect property may be configured: one value for every state, a value per
 * state (each optionally interpolated per object), or a single {@link StateInterpolator} covering both.
 */
type PropertyConfig<Type, State extends KeyType, ClassType extends object = Element> = PartialRecord<State, Type | ReifectInterpolator<Type, ClassType>> | Type | StateInterpolator<Type, State, ClassType>;
/**
 * @callback ReifectOnSwitchCallback
 * @group Components
 * @category Reifects
 *
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description Called on an attached object each time the reifect switches it to a new state.
 * @param {State} state - The state being switched to.
 * @param {number} index - The object's position among the reifect's attached objects.
 * @param {number} total - How many objects are attached in total, for staggering effects by index.
 * @param {ClassType} object - The object being switched.
 */
type ReifectOnSwitchCallback<State extends KeyType, ClassType extends object = Element> = (state: State, index: number, total: number, object: ClassType) => void;
/**
 * @type {ReifectObjectData}
 * @group Components
 * @category Reifects
 *
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description The bookkeeping a {@link StatefulReifect} keeps for one attached object. The object is held
 * weakly, so attaching a reifect does not keep it alive once the rest of the application drops it.
 * @property {WeakRef<ClassType>} object - Weak reference to the attached object.
 * @property {ReifectEnabledObject} enabled - Which parts of the reifect apply to this object.
 * @property {State} [lastState] - The state the object was last switched to.
 * @property {ReifectObjectComputedProperties<State, ClassType>} [resolvedValues] - The per-state values
 * resolved for this object, so interpolated configurations are computed once rather than on every switch.
 * @property {number} [index] - The object's position among the attached objects.
 * @property {number} [total] - How many objects are attached in total.
 * @property {ReifectOnSwitchCallback<State, ClassType>} [onSwitch] - Called when this object switches state.
 * @property {() => void} [disposeEffect] - Tears down the effect tracking this object's reactive values.
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
 * @internal
 * @type {ReifectObjectComputedProperties}
 * @description The per-state values a {@link StatefulReifect} has resolved for one attached object, so a
 * configuration given as an interpolator is evaluated once rather than on every state switch.
 * @property {PartialRecord<State, PartialRecord<keyof ClassType, any>>} properties - Resolved property
 * values, per state.
 * @property {PartialRecord<State, StylesType>} styles - Resolved inline styles, per state.
 * @property {PartialRecord<State, string | string[]>} classes - Resolved CSS classes, per state.
 * @property {PartialRecord<State, ClassType>} replaceWith - Resolved replacement objects, per state.
 */
type ReifectObjectComputedProperties<State extends KeyType, ClassType extends object = Element> = {
    properties: PartialRecord<State, PartialRecord<keyof ClassType, any>>;
    styles: PartialRecord<State, StylesType>;
    classes: PartialRecord<State, string | string[]>;
    replaceWith: PartialRecord<State, ClassType>;
};
/**
 * @type {StatefulReifectCoreProperties}
 * @group Components
 * @category Reifects
 *
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description What a {@link StatefulReifect} applies to its objects on each state switch. Beyond the
 * named entries, any other key is treated as a property to set on the object itself.
 * @property {PropertyConfig<StylesType, State, ClassType>} [styles] - Inline styles to apply per state.
 * @property {PropertyConfig<string | string[], State, ClassType>} [classes] - CSS classes to toggle per state.
 * @property {PropertyConfig<ClassType, State, ClassType>} [replaceWith] - An object to swap the attached one
 * out for, per state.
 */
type StatefulReifectCoreProperties<State extends KeyType, ClassType extends object = Element> = {
    styles?: PropertyConfig<StylesType, State, ClassType>;
    classes?: PropertyConfig<string | string[], State, ClassType>;
    replaceWith?: PropertyConfig<ClassType, State, ClassType>;
    [k: PropertyKey]: PropertyConfig<any, State, ClassType>;
};
/**
 * @type {StatefulReifectProperties}
 * @group Components
 * @category Reifects
 *
 * @extends StatefulReifectCoreProperties
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description Options for constructing a {@link StatefulReifect}: everything it applies per state, plus
 * the states themselves and the objects to attach at creation.
 * @property {State[] | object} [states] - The available states, as an array or as an enum-like object.
 * @property {State | boolean} [initialState] - The state to start in.
 * @property {ClassType[]} [attachedObjects] - Objects to attach immediately.
 */
type StatefulReifectProperties<State extends KeyType, ClassType extends object = Element> = StatefulReifectCoreProperties<State, ClassType> & {
    states?: State[] | object;
    initialState?: State | boolean;
    attachedObjects?: ClassType[];
};
/**
 * @type {ReifectAppliedOptions}
 * @group Components
 * @category Reifects
 *
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description Options controlling one application of a reifect — how widely it reaches, and how much of
 * its cached per-object data it recomputes first.
 * @property {boolean} [attachObjects] - Attach any object passed in that is not attached yet.
 * @property {boolean} [executeForAll] - Apply to every attached object rather than only the one given.
 * @property {boolean} [recomputeIndices] - Recompute each object's index and total before applying.
 * @property {boolean} [recomputeProperties] - Re-resolve interpolated values before applying.
 * @property {boolean} [applyStylesInstantly] - Set styles directly instead of on the next frame, skipping
 * any CSS transition.
 * @property {StatefulReifectCoreProperties<State, ClassType>} [propertiesOverride] - Values to use for this
 * application in place of the reifect's own.
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
 * @type {ReifectEnabledObject}
 * @group Components
 * @category Reifects
 *
 * @description Which parts of a reifect apply to a given object. Set `global` to `false` to disable the
 * reifect for that object entirely; the rest switch off one category each.
 * @property {boolean} [global] - Whether the reifect applies at all.
 * @property {boolean} [properties] - Whether property values are applied.
 * @property {boolean} [styles] - Whether inline styles are applied.
 * @property {boolean} [classes] - Whether CSS classes are toggled.
 * @property {boolean} [replaceWith] - Whether object replacement is performed.
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
 * @category Reifects
 *
 * @template {string | number | symbol} State - The type of the reifier's states.
 * @template {object} ClassType - The object type this reifier will be applied to.
 * @description A class to manage and apply dynamic state-based properties, styles, classes, and transitions to a
 * set of objects.
 */
declare class StatefulReifect<State extends string | number | symbol = any, ClassType extends object = object> {
    /**
     * @static
     * @readonly
     * @protected
     * @description The categories of value a reifect can apply to an object.
     */
    protected static readonly fields: readonly ["properties", "classes", "styles", "replaceWith"];
    /**
     * @static
     * @readonly
     * @protected
     * @description Property names the reifect handles itself. Anything else given in its configuration is
     * treated as a property to set on the attached objects.
     */
    protected static readonly knownFields: Set<string>;
    /**
     * @static
     * @readonly
     * @protected
     * @description Style properties that several reifects may contribute to at once, and so are recombined
     * rather than overwritten when more than one reifect is attached to the same object.
     */
    protected static readonly chainableStyleFields: Set<string>;
    /**
     * @protected
     * @readonly
     * @description Matches a CSS duration, capturing the number and its unit, so durations given as strings
     * can be read back as seconds.
     */
    protected readonly timeRegex: RegExp;
    /**
     * @protected
     * @readonly
     * @description Per-object state, keyed weakly so attaching a reifect does not keep an object alive.
     */
    protected readonly attachedObjectsData: WeakMap<ClassType, ReifectObjectData<State, ClassType>>;
    /**
     * @protected
     * @readonly
     * @description Every object this reifect is attached to, in attachment order. Objects dropped elsewhere
     * disappear from the list on their own.
     */
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
     * @protected
     */
    protected attachObject(object: ClassType, onSwitch?: ReifectOnSwitchCallback<State, ClassType>, index?: number): ReifectObjectData<State, ClassType>;
    /**
     * @function detachObject
     * @protected
     * @description Stop tracking an object, so the reifect no longer applies to it. Does nothing if the
     * object was never attached.
     * @param {ClassType} object - The object to detach.
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
     * @function parseState
     * @description Parses a boolean into the corresponding state value.
     * @param {State | boolean} value - The value to parse.
     * @returns {State} The parsed value, or `null` if the boolean could not be parsed.
     * @protected
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
    /**
     * @function unapply
     * @description Remove everything this reifect applied, returning the objects to how they were before.
     * @param {ClassType | ClassType[]} [objects] - The objects to clear. Defaults to every attached object.
     * @param {ReifectAppliedOptions} [options] - Options controlling reach and recomputation.
     * @returns {this} Itself, allowing for method chaining.
     */
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
    /**
     * @function filterEnabledObjects
     * @protected
     * @description Decide whether an object should be acted on, warning when one is skipped because the
     * reifect was disabled for it. Override to change which objects a reifect reaches.
     * @param {ReifectObjectData} data - The object's tracked state.
     * @returns {boolean} Whether the reifect applies to this object.
     */
    protected filterEnabledObjects(data: ReifectObjectData<State, ClassType>): boolean;
    /**
     * @function processRawProperties
     * @protected
     * @description Resolve an object's per-state values from the reifect's configuration and cache them, so
     * interpolated values are computed once instead of on every state switch. The resolution runs inside an
     * effect, so the cache refreshes by itself when a value it read changes.
     * @param {ClassType} object - The object to resolve values for.
     * @param {StatefulReifectCoreProperties} [override] - Values to resolve instead of the reifect's own.
     */
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
 * @enum {Direction}
 * @group Core Types
 * @category Enums
 *
 * @description The axis a component lays out, scrolls, or moves along.
 * @property {Direction.vertical} vertical - Along the y axis.
 * @property {Direction.horizontal} horizontal - Along the x axis.
 */
declare enum Direction {
    vertical = "vertical",
    horizontal = "horizontal"
}
/**
 * @enum {SideH}
 * @group Core Types
 * @category Enums
 *
 * @description One of the two horizontal sides. Use {@link Side} when vertical sides are also valid.
 * @property {SideH.left} left - The left side.
 * @property {SideH.right} right - The right side.
 */
declare enum SideH {
    left = "left",
    right = "right"
}
/**
 * @enum {SideV}
 * @group Core Types
 * @category Enums
 *
 * @description One of the two vertical sides. Use {@link Side} when horizontal sides are also valid.
 * @property {SideV.top} top - The top side.
 * @property {SideV.bottom} bottom - The bottom side.
 */
declare enum SideV {
    top = "top",
    bottom = "bottom"
}
/**
 * @enum {Side}
 * @group Core Types
 * @category Enums
 *
 * @description Any one of the four sides of a rectangle or element — which edge a
 * {@link GradumDrawer} slides from, for instance.
 * @property {Side.top} top - The top side.
 * @property {Side.bottom} bottom - The bottom side.
 * @property {Side.left} left - The left side.
 * @property {Side.right} right - The right side.
 */
declare enum Side {
    top = "top",
    bottom = "bottom",
    left = "left",
    right = "right"
}
/**
 * @enum {InOut}
 * @group Core Types
 * @category Enums
 *
 * @description Whether a motion travels toward a centre or away from it, such as the direction of a
 * {@link GradumMarkingMenu} gesture.
 * @property {InOut.in} in - Inward, toward the centre.
 * @property {InOut.out} out - Outward, away from the centre.
 */
declare enum InOut {
    in = "in",
    out = "out"
}
/**
 * @enum {OnOff}
 * @group Core Types
 * @category Enums
 *
 * @description A two-state toggle, for states better named on/off than `true`/`false`.
 * @property {OnOff.on} on - Enabled.
 * @property {OnOff.off} off - Disabled.
 */
declare enum OnOff {
    on = "on",
    off = "off"
}
/**
 * @enum {Open}
 * @group Core Types
 * @category Enums
 *
 * @description Whether a container currently exposes its content.
 * @property {Open.open} open - Content is exposed.
 * @property {Open.closed} closed - Content is collapsed away.
 */
declare enum Open {
    open = "open",
    closed = "closed"
}
/**
 * @enum {Shown}
 * @group Core Types
 * @category Enums
 *
 * @description Whether an element is displayed. Used as the pair of states a reifect transitions
 * between, and by {@link GradumContentSwitch} to pick the active child.
 * @property {Shown.visible} visible - Displayed.
 * @property {Shown.hidden} hidden - Not displayed.
 */
declare enum Shown {
    visible = "visible",
    hidden = "hidden"
}
/**
 * @enum {AccessLevel}
 * @group Core Types
 * @category Enums
 *
 * @description How widely a member is exposed, mirroring the TypeScript access modifiers.
 * @property {AccessLevel.public} public - Reachable from anywhere.
 * @property {AccessLevel.protected} protected - Reachable from the declaring class and its subclasses.
 * @property {AccessLevel.private} private - Reachable only from the declaring class.
 */
declare enum AccessLevel {
    public = "public",
    protected = "protected",
    private = "private"
}
/**
 * @enum {Range}
 * @group Core Types
 * @category Enums
 *
 * @description Which end of a bounded range a value refers to.
 * @property {Range.min} min - The lower bound.
 * @property {Range.max} max - The upper bound.
 */
declare enum Range {
    min = "min",
    max = "max"
}
/**
 * @enum {Anchor}
 * @group Core Types
 * @category Enums
 *
 * @description A reference point on a rectangle — the nine combinations of a vertical and a horizontal
 * position. Used to anchor a {@link GradumRect} or an {@link AnchorPoint}.
 * @property {Anchor.TopLeft} TopLeft - Top-left corner.
 * @property {Anchor.TopMiddle} TopMiddle - Centre of the top edge.
 * @property {Anchor.TopRight} TopRight - Top-right corner.
 * @property {Anchor.CenterLeft} CenterLeft - Centre of the left edge.
 * @property {Anchor.Center} Center - Centre of the rectangle.
 * @property {Anchor.CenterRight} CenterRight - Centre of the right edge.
 * @property {Anchor.BottomLeft} BottomLeft - Bottom-left corner.
 * @property {Anchor.BottomMiddle} BottomMiddle - Centre of the bottom edge.
 * @property {Anchor.BottomRight} BottomRight - Bottom-right corner.
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
 * @type {GradumIconSwitchProperties}
 * @group Components
 * @category Basics
 *
 * @extends GradumIconProperties
 * @template {string | number | symbol} State - The set of states the icon can switch between.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumIconSwitch} — an icon that swaps its appearance as
 * its state changes.
 * @property {StatefulReifect<State, GradumIcon> | StatefulReifectProperties<State, GradumIcon>} [switchReifect] -
 * The reifect driving the transition between states, or the properties to build one from.
 * @property {State} [defaultState] - The state the icon starts in.
 * @property {boolean} [appendStateToIconName=false] - Whether the current state is appended to the icon name,
 * so each state loads its own icon file.
 */
type GradumIconSwitchProperties<State extends string | number | symbol, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumIconProperties<ViewType, DataType, ModelType, EmitterType> & {
    switchReifect?: StatefulReifect<State, GradumIcon> | StatefulReifectProperties<State, GradumIcon>;
    defaultState?: State;
    appendStateToIconName?: boolean;
};

/**
 * @group Components
 * @category Basics
 */
declare class GradumIconSwitch<State extends string | number | symbol = OnOff, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumIcon<ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumIconSwitchProperties<any>;
    /**
     * @description The reifect that swaps the icon between its states. Assign reifect properties to build one.
     */
    get switchReifect(): StatefulReifect<State, GradumIcon>;
    set switchReifect(value: StatefulReifect<State, GradumIcon> | StatefulReifectProperties<State, GradumIcon>);
    set defaultState(value: State);
    set appendStateToIconName(value: boolean);
    /**
     * @function initialize
     * @description Set the icon up and apply its default state.
     */
    initialize(): void;
}

/**
 * @group Components
 * @category Basics
 */
type GradumIconToggleProperties<ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumIconProperties<ViewType, DataType, ModelType, EmitterType> & {
    toggled?: boolean;
    toggleOnClick?: boolean;
    stopPropagationOnClick?: boolean;
    onToggle?: (value: boolean, el: GradumIconToggle) => void;
};

/**
 * @group Components
 * @category Basics
 */
declare class GradumIconToggle<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumIcon<ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumIconToggleProperties;
    /**
     * @description Whether a click that toggles this icon stops propagating, keeping ancestors from also
     * reacting to it.
     */
    stopPropagationOnClick: boolean;
    /**
     * @description Called with the new state whenever the icon is toggled.
     */
    onToggle: (value: boolean, el: GradumIconToggle) => void;
    private clickListener;
    /**
     * @description Whether the icon is currently toggled on. Assigning fires
     * {@link GradumIconToggle.onToggle}.
     */
    set toggled(value: boolean);
    /**
     * @description Whether clicking the icon toggles it. Assigning attaches or removes the click listener.
     */
    set toggleOnClick(value: boolean);
    /**
     * @function toggle
     * @description Flip the icon's state, firing {@link GradumIconToggle.onToggle}.
     */
    toggle(): void;
}

/**
 * @type {GradumInputProperties}
 * @group Components
 * @category Basics
 *
 * @template {"input" | "textarea"} InputTag - The tag of the inner input element.
 * @template ValueType - The type the input's string value is converted to and from.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumInput}. Extends
 * {@link GradumRichElementProperties} without `element` and `elementTag`, which the input sets itself.
 * @property {InputTag} [inputTag="input"] - Whether the field is an `input` or a `textarea`.
 * @property {GradumProperties<InputTag> | ValidElement<InputTag>} [input] - Properties for the inner input
 * element, or an existing element to use instead of creating one.
 * @property {string} [label] - Text of the label shown next to the field.
 * @property {boolean} [locked=false] - Whether the field rejects user edits.
 * @property {boolean} [dynamicVerticalResize=false] - Whether the field grows to fit its content as the
 * user types. Meant for `textarea`.
 * @property {RegExp | string} [inputRegexCheck] - Pattern the value must match while typing. Input that
 * would break the match is rejected as it is entered.
 * @property {RegExp | string} [blurRegexCheck] - Pattern the value must match when the field loses focus.
 * @property {boolean} [selectTextOnFocus=false] - Whether focusing the field selects all of its text.
 * @property {ValueType} [value] - Initial value of the field.
 * @property {string} [type] - Value of the input's `type` attribute.
 * @property {string} [placeholder] - Text shown while the field is empty.
 * @property {string} [pattern] - Value of the input's `pattern` attribute.
 * @property {string} [size] - Value of the input's `size` attribute.
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
 * @type {GradumLabelElementProperties}
 * @group Components
 * @category Basics
 *
 * @extends GradumRichElementProperties
 * @template {ValidTag} ElementTag - The tag of the main element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumLabelElement} — a rich element paired with a
 * `label` bound to it.
 * @property {string} [label] - Text of the label shown next to the element.
 * @property {boolean} [locked=false] - Whether the element rejects user edits.
 */
type GradumLabelElementProperties<ElementTag extends ValidTag = any, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumRichElementProperties<ElementTag, ViewType, DataType, ModelType, EmitterType> & {
    label?: string;
    locked?: boolean;
};

/**
 * @class GradumLabelElement
 * @group Components
 * @category Basics
 *
 * @extends GradumRichElement
 * @template {ValidTag} ElementTag - The tag of the main element in the rich element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description A rich element with an HTML `<label>` attached to it. Setting {@link GradumLabelElement.label}
 * to a non-empty string creates the label and puts it before the content; setting it to an empty value
 * removes it again.
 */
declare class GradumLabelElement<ElementTag extends ValidTag = any, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumRichElement<ElementTag, ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumLabelElementProperties<ElementTag, ViewType, DataType, ModelType, EmitterType>;
    defaultId: string;
    protected labelElement: HTMLLabelElement;
    /**
     * @description The wrapper holding everything except the label. It becomes the element's child handler, so
     * children added later land inside it rather than beside the label.
     */
    content: HTMLElement;
    /**
     * @description The label's text. Assigning a non-empty string creates the `<label>` and places it before
     * the content; assigning an empty value removes it. The label is linked to the inner element's `id`, so
     * clicking it focuses that element.
     */
    set label(value: string);
    get label(): string;
    get element(): ValidElement<ElementTag>;
    set element(value: GradumProperties<ElementTag> | ValidElement<ElementTag>);
    /**
     * @inheritDoc
     */
    protected setupUIElements(): void;
    /**
     * @inheritDoc
     */
    protected setupUILayout(): void;
    private updateId;
}

/**
 * @group Components
 * @category Basics
 */
declare class GradumInput<InputTag extends "input" | "textarea" = "input", ValueType = string, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumLabelElement<InputTag, ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumInputProperties<InputTag, ValueType, ViewType, DataType, ModelType, EmitterType>;
    /**
     * @function create
     * @static
     * @description Instantiate an input, reading `InputTag` and `ValueType` back off the properties — so
     * `GradumInput.create({inputTag: "textarea"})` is typed as a textarea input without a cast. Narrows
     * {@link GradumElement.create}, which cannot see generics declared on a subclass.
     * @template {{prototype: GradumElement}} This - The class `create` was called on. The constraint
     * matches the base signature; the return type still narrows to this class.
     * @template {"input" | "textarea"} InputTag - Inferred from `properties.inputTag`.
     * @template ValueType - Inferred from the properties' value type.
     * @param {GradumInputProperties} [properties] - Properties to set on the new input.
     * @returns {GradumInput} The created input, typed as the class this was called on.
     */
    static create<This extends {
        prototype: GradumElement;
    }, InputTag extends "input" | "textarea" = "input", ValueType = string, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>>(this: This, properties?: This["prototype"]["properties"] & GradumInputProperties<InputTag, ValueType, ViewType, DataType, ModelType, EmitterType>): This["prototype"] & GradumInput<InputTag, ValueType, ViewType, DataType, ModelType, EmitterType>;
    /**
     * @static
     * @description Default properties assigned to a new input: an `<input>` element, wired to the
     * interactor that keeps its value and size in step with what the user types.
     */
    static defaultProperties: GradumInputProperties;
    /**
     * @function customCreate
     * @static
     * @protected
     * @description Build an input, deferring the initial `value` until the underlying element exists so it
     * is not lost during construction.
     * @param {GradumInputProperties} properties - The input's configuration.
     * @returns {object} The created input.
     */
    protected static customCreate(properties: GradumInputProperties): object;
    /**
     * @description Whether the input rejects focus, so clicking it does nothing.
     */
    locked: boolean;
    /**
     * @description Whether the input's whole text is selected when it gains focus.
     */
    selectTextOnFocus: boolean;
    /**
     * @description Whether the input grows and shrinks vertically to fit its content, for `<textarea>`
     * elements that should not scroll.
     */
    dynamicVerticalResize: boolean;
    /**
     * @description A pattern the value must match while typing. Input that fails it is sanitized if
     * possible, and otherwise reverted to the last value that passed.
     */
    inputRegexCheck: RegExp | string;
    /**
     * @description A pattern the value must match once editing ends. Stricter than
     * {@link GradumInput.inputRegexCheck}, so partial input is allowed mid-typing but not left behind.
     */
    blurRegexCheck: RegExp | string;
    private lastValidForInput;
    private lastValidForBlur;
    /**
     * @readonly
     * @description Fired when the input gains focus.
     */
    readonly onFocus: Delegate<() => void>;
    /**
     * @readonly
     * @description Fired when the input loses focus.
     */
    readonly onBlur: Delegate<() => void>;
    /**
     * @readonly
     * @description Fired on every accepted change to the input's value.
     */
    readonly onInput: Delegate<() => void>;
    /**
     * @description The underlying `<input>` or `<textarea>` element. An alias of `element`, kept for
     * readability where the distinction matters.
     */
    get input(): ValidElement<InputTag>;
    set input(value: GradumProperties<InputTag> | ValidElement<InputTag>);
    get element(): ValidElement<InputTag>;
    set element(value: GradumProperties<InputTag> | ValidElement<InputTag>);
    accessor type: string;
    accessor placeholder: string;
    accessor pattern: string;
    accessor size: string;
    /**
     * @inheritDoc
     */
    protected setupChangedCallbacks(): void;
    /**
     * @inheritDoc
     */
    protected setupUIListeners(): void;
    /**
     * @description The input's value, parsed from its text. Numbers and JSON are converted automatically,
     * and a current value exposing `fromString` is used to parse the text into its own type. Assigning
     * writes the value's string form back to the element.
     */
    get value(): ValueType;
    set value(value: ValueType);
    /**
     * @description The input's text exactly as it appears in the element, with no parsing. Assigning
     * checks it against {@link GradumInput.blurRegexCheck} and reverts to the last valid text if it fails.
     */
    get rawValue(): string;
    set rawValue(value: string);
    /**
     * @function setValueSilently
     * @description Write a value into the element without running the regex checks or announcing the
     * change. Use it to sync the input from an external source without echoing an update back out.
     * @param {ValueType} value - The value to write.
     */
    setValueSilently(value: ValueType): void;
    /**
     * @function processInputValue
     * @protected
     * @description Validate the element's current text against the configured patterns, sanitizing or
     * reverting it as needed, and record it as the last known-good value.
     * @param {string} [value=this.element.value] - The text to validate. Defaults to the element's.
     */
    protected processInputValue(value?: string): void;
    private sanitizeByRegex;
}

/**
 * @type {GradumNumericalInputProperties}
 * @group Components
 * @category Basics
 *
 * @template ValueType - The type the input's string value is converted to and from.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumNumericalInput}. Extends
 * {@link GradumInputProperties} with the numeric constraints applied to the entered value.
 * @property {number} [multiplier=1] - Factor applied between the displayed value and the stored one.
 * @property {number} [decimalPlaces] - How many decimals the value is rounded to. Left unrounded if omitted.
 * @property {number} [min] - Lowest accepted value. The value is clamped to it.
 * @property {number} [max] - Highest accepted value. The value is clamped to it.
 */
type GradumNumericalInputProperties<ValueType = string, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumInputProperties<"input", ValueType, ViewType, DataType, ModelType, EmitterType> & {
    multiplier?: number;
    decimalPlaces?: number;
    min?: number;
    max?: number;
};

/**
 * @group Components
 * @category Basics
 */
declare class GradumNumericalInput<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumInput<"input", number, ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumNumericalInputProperties<number, ViewType, DataType, ModelType, EmitterType>;
    /**
     * @static
     * @description Default properties assigned to a new numerical input: patterns that allow a number to be
     * typed one character at a time, but require a complete number once editing ends.
     */
    static defaultProperties: GradumNumericalInputProperties;
    /**
     * @description A factor between the displayed text and the value read back, for showing a value in one
     * unit while storing it in another. The text is divided by it on read and multiplied on write.
     */
    multiplier: number;
    /**
     * @description How many decimal places values are rounded to. Leave unset to keep full precision.
     */
    decimalPlaces: number;
    /**
     * @description The lowest accepted value. Anything lower is clamped up to it.
     */
    min: number;
    /**
     * @description The highest accepted value. Anything higher is clamped down to it.
     */
    max: number;
    /**
     * @description The input's numeric value. Assigning clamps it to the configured range, rounds it to the
     * configured precision, and writes the scaled result back to the element.
     */
    get value(): number;
    set value(value: string | number);
}

/**
 * @internal
 * @type {EntryData}
 * @description Per-entry state a select keeps for each of its entries.
 * @property {boolean} [enabled] - Whether the entry can be selected.
 * @property {boolean} [selected] - Whether the entry is currently selected.
 */
type EntryData = {
    enabled?: boolean;
    selected?: boolean;
};
/**
 * @type {GradumSelectProperties}
 * @group Components
 * @category Basics
 *
 * @template ValueType - The type of the value each entry carries.
 * @template SecondaryValueType - The type of the secondary value each entry carries.
 * @template {object} EntryType - The type of the entries themselves.
 * @description Properties to initialize a {@link GradumSelect}. Entries can be supplied directly through
 * `entries`, or generated from `values` using `createEntry`.
 * @property {string | string[]} [entriesClasses] - CSS class(es) added to every entry.
 * @property {string | string[]} [selectedEntriesClasses] - CSS class(es) added to entries while selected.
 * @property {HTMLCollection | NodeList | EntryType[]} [entries] - The entries to populate the select with.
 * @property {(ValueType | EntryType)[]} [values] - Values to build entries from, using `createEntry`.
 * @property {ValueType[]} [selectedValues] - Values selected initially.
 * @property {(entry: EntryType) => ValueType} [getValue] - Reads the value carried by an entry.
 * @property {(entry: EntryType) => SecondaryValueType} [getSecondaryValue] - Reads an entry's secondary value.
 * @property {(value: ValueType) => EntryType} [createEntry] - Builds an entry for a value in `values`.
 * @property {(entry: EntryType, index: number) => void} [onEntryAdded] - Called when an entry is added.
 * @property {(entry: EntryType) => void} [onEntryRemoved] - Called when an entry is removed.
 * @property {(entry: EntryType, e: Event) => void} [onEntryClicked] - Called when an entry is clicked.
 * @property {boolean} [multiSelection=false] - Whether more than one entry can be selected at a time.
 * @property {boolean} [forceSelection=false] - Whether at least one entry must stay selected, preventing
 * the last selected entry from being deselected.
 * @property {string} [inputName] - Name given to the underlying form inputs, to submit the selection with a form.
 * @property {Element} [parent] - Element the entries are appended to.
 * @property {(b: boolean, entry: EntryType, index: number) => void} [onSelect] - Called when an entry's
 * selected state changes, with the new state.
 * @property {(b: boolean, entry: EntryType, index: number) => void} [onEnabled] - Called when an entry's
 * enabled state changes, with the new state.
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
 * @type {GradumSelectInputEventProperties}
 * @group Components
 * @category Basics
 *
 * @extends GradumRawEventProperties
 * @template ValueType - The type of the value each entry carries.
 * @template SecondaryValueType - The type of the secondary value each entry carries.
 * @template {object} EntryType - The type of the entries themselves.
 * @description Properties to initialize a {@link GradumSelectInputEvent}, the event a select fires when
 * its selection changes.
 * @property {EntryType} toggledEntry - The entry whose selected state just changed.
 * @property {ValueType[]} values - The values selected after the change.
 */
type GradumSelectInputEventProperties<ValueType = string, SecondaryValueType = string, EntryType extends object = HTMLElement> = GradumRawEventProperties & {
    toggledEntry: EntryType;
    values: ValueType[];
};

/**
 * @class GradumSelect
 * @group Components
 * @category Basics
 *
 * @extends GradumElement
 * @description Base class for creating a selection menu

 */
declare class GradumSelect<ValueType = string, SecondaryValueType = string, EntryType extends object = HTMLElement> extends GradumBaseElement {
    readonly properties: GradumSelectProperties<ValueType, SecondaryValueType, EntryType>;
    /**
     * @function create
     * @static
     * @description Instantiate a selection, reading its value and entry types back off the properties — so
     * the types come from `getValue`/`getSecondaryValue` rather than needing a cast. Narrows
     * {@link GradumBaseElement.create}, which cannot see generics declared on a subclass.
     * @template {{prototype: GradumBaseElement}} This - The class `create` was called on. The constraint
     * matches the base signature; the return type still narrows to this class.
     * @template ValueType - Inferred from `properties.getValue`.
     * @template SecondaryValueType - Inferred from `properties.getSecondaryValue`.
     * @template {object} EntryType - Inferred from the entries the accessors receive.
     * @param {GradumSelectProperties} [properties] - Properties to set on the new selection.
     * @returns {GradumSelect} The created selection, typed as the class this was called on.
     */
    static create<This extends {
        prototype: GradumBaseElement;
    }, ValueType = string, SecondaryValueType = string, EntryType extends object = HTMLElement>(this: This, properties?: This["prototype"]["properties"] & GradumSelectProperties<ValueType, SecondaryValueType, EntryType>): This["prototype"] & GradumSelect<ValueType, SecondaryValueType, EntryType>;
    /**
     * @static
     * @description Default properties assigned to a new selection: selected entries get the `selected` class,
     * and disabled entries are hidden.
     */
    static defaultProperties: GradumSelectProperties;
    private _inputField;
    private _entries;
    private readonly _entriesData;
    private parentObserver;
    private readonly _onSelect;
    /**
     * @description Fired whenever an entry is selected or deselected, with the new state, the entry, and its
     * index. Assigning a function subscribes it rather than replacing the existing subscribers.
     */
    get onSelect(): Delegate<(b: boolean, entry: EntryType, index: number) => void>;
    set onSelect(value: (b: boolean, entry: EntryType, index: number) => void);
    private readonly _onEnabled;
    /**
     * @description Fired whenever an entry is enabled or disabled. Assigning a function subscribes it rather
     * than replacing the existing subscribers.
     */
    get onEnabled(): Delegate<(b: boolean, entry: EntryType, index: number) => void>;
    set onEnabled(value: (b: boolean, entry: EntryType, index: number) => void);
    private readonly _onEntryAdded;
    /**
     * @description Fired whenever an entry is added. Assigning a function subscribes it rather than replacing
     * the existing subscribers.
     */
    get onEntryAdded(): Delegate<(entry: EntryType, index: number) => void>;
    set onEntryAdded(value: (entry: EntryType, index: number) => void);
    private readonly _onEntryRemoved;
    /**
     * @description Fired whenever an entry is removed. Assigning a function subscribes it rather than
     * replacing the existing subscribers.
     */
    get onEntryRemoved(): Delegate<(entry: EntryType) => void>;
    set onEntryRemoved(value: (entry: EntryType) => void);
    private readonly _onEntryClicked;
    /**
     * @description Fired whenever an entry is clicked, whether or not the click changes the selection.
     * Assigning a function subscribes it rather than replacing the existing subscribers.
     */
    get onEntryClicked(): Delegate<(entry: EntryType, e: Event) => void>;
    set onEntryClicked(value: (entry: EntryType, e: Event) => void);
    /**
     * @description This selection's entries, in order. Assigning a new list replaces them all.
     */
    get entries(): EntryType[];
    set entries(value: HTMLCollection | NodeList | EntryType[]);
    /**
     * @description The values of this selection's entries. Assigning a new list rebuilds the entries to match.
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
    /**
     * @function customCreate
     * @static
     * @protected
     * @description Build a selection, deferring the initial entries and selected values until the element
     * exists so they are not lost during construction.
     * @param {GradumSelectProperties} properties - The selection's configuration.
     * @returns {object} The created selection.
     */
    protected static customCreate(properties: GradumSelectProperties): object;
    /**
     * @description Create a selection.
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
     * @function select
     * @description Select or deselect an entry. In single-selection mode selecting one entry deselects
     * whichever was selected before.
     * @param {ValueType | EntryType} value - The entry to select, or the value identifying it.
     * @param {boolean} [selected=true] - Whether to select the entry, or deselect it.
     * @returns {this} Itself, allowing for method chaining.
     */
    select(value: ValueType | EntryType, selected?: boolean): this;
    /**
     * @function selectByIndex
     * @description Select the entry at the given index.
     * @param {number} index - The index of the entry to select.
     * @param {(index: number, entriesCount: number, zero?: number) => number} [preprocess=trim] - Applied to the
     * index before use. Defaults to `trim`, which clamps it into range; pass `mod` to wrap around instead.
     * @returns {this} Itself, allowing for method chaining.
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
    /**
     * @readonly
     * @description The entry whose selection changed and caused this event.
     */
    readonly toggledEntry: EntryType;
    /**
     * @readonly
     * @description The values of every entry selected after the change.
     */
    readonly values: ValueType[];
    /**
     * @constructor
     * @description Create a selection-input event.
     * @param {GradumSelectInputEventProperties} properties - The event's configuration, including the
     * toggled entry and the resulting values.
     */
    constructor(properties: GradumSelectInputEventProperties<ValueType, SecondaryValueType, EntryType>);
}

/**
 * @type {GradumSelectElementProperties}
 * @group Components
 * @category Basics
 *
 * @extends GradumElementProperties
 * @extends GradumSelectProperties
 * @template ValueType - The type of the value held by each entry.
 * @template SecondaryValueType - The type of each entry's secondary value.
 * @template {HTMLElement} EntryType - The type of the entry elements.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties for configuring a {@link GradumSelectElement} — everything a selection accepts,
 * plus the element-level options and the classes applied to its entries.
 * @property {string | string[]} [entriesClasses] - CSS class(es) applied to every entry.
 * @property {string | string[]} [selectedEntriesClasses] - CSS class(es) applied to selected entries.
 */
type GradumSelectElementProperties<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel<DataType>, EmitterType extends GradumEmitter = GradumEmitter> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & GradumSelectProperties<ValueType, SecondaryValueType, EntryType> & {
    entriesClasses?: string | string[];
    selectedEntriesClasses?: string | string[];
};
/**
 * @group Components
 * @category Reifects
 *
 * @template Type - The type of the configured value.
 * @template State - The set of states the reifect can switch between.
 * @template ClassType - The type of the attached object.
 * @description A configuration type for properties based on states or interpolated values.
 */
type StatelessPropertyConfig<Type, ClassType extends object = Element> = Type | ReifectInterpolator<Type, ClassType>;
/**
 * @group Components
 * @category Reifects
 */
type StatelessReifectCoreProperties<ClassType extends object = Element> = {
    styles?: StatelessPropertyConfig<StylesType, ClassType>;
    classes?: StatelessPropertyConfig<string | string[], ClassType>;
    replaceWith?: StatelessPropertyConfig<ClassType, ClassType>;
    [k: PropertyKey]: StatelessPropertyConfig<any, ClassType>;
};
/**
 * @group Components
 * @category Reifects
 */
type StatelessReifectProperties<ClassType extends object = Element> = StatelessReifectCoreProperties<ClassType> & {
    attachedObjects?: ClassType[];
};

/**
 * @class Reifect
 * @group Components
 * @category Reifects
 *
 * @template {object} ClassType - The object type this reifier will be applied to.
 * @description A class to manage and apply dynamic properties, styles, classes, and transitions to a
 * set of objects.
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
 * @category Basics
 *
 * @extends GradumElement
 * @description Select element class for creating Gradum button elements.
 */
declare class GradumSelectElement<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumSelectElementProperties;
    /**
     * @static
     * @description Default properties assigned to a new select element. Entries are built as
     * {@link GradumRichElement}s unless another tag is given.
     */
    static defaultProperties: GradumSelectElementProperties;
    /**
     * @protected
     * @description The pending timer that clears the container's fixed size once the resize animation ends.
     */
    protected _sizeTransitionTimeout: ReturnType<typeof setTimeout>;
    /**
     * @readonly
     * @description The selection logic backing this element. It owns the entries and their selected state;
     * this element renders them.
     */
    readonly select: GradumSelect<ValueType, SecondaryValueType, EntryType>;
    /**
     * @description The tag used to build entries from plain values.
     */
    entriesTag: ValidTag;
    /**
     * @description The element's entries, in order. Assigning a new list replaces them all.
     */
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
    /**
     * @function initialize
     * @description Set the element up and select its initial entry.
     */
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
     * @param {EntryType} selectedEntry - The newly selected entry.
     */
    protected beforeResize(selectedEntry: EntryType): void;
    /**
     * @description Called after the container size transition completes.
     * @param {EntryType} selectedEntry - The entry that is now selected.
     */
    protected afterResize(selectedEntry: EntryType): void;
}

/**
 * @enum {ContentSwitchMode}
 * @group Components
 * @category Containers
 *
 * @description How a {@link GradumContentSwitch} animates from the outgoing entry to the incoming one.
 * @property {ContentSwitchMode.fadeLeft} fadeLeft - The new entry fades in while sliding leftwards.
 * @property {ContentSwitchMode.fadeRight} fadeRight - The new entry fades in while sliding rightwards.
 * @property {ContentSwitchMode.carousel} carousel - Entries slide as one strip, in the direction of travel.
 */
declare enum ContentSwitchMode {
    fadeLeft = "fadeLeft",
    fadeRight = "fadeRight",
    carousel = "carousel"
}
/**
 * @type {GradumContentSwitchProperties}
 * @group Components
 * @category Containers
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties accepted when creating a {@link GradumContentSwitch}.
 * @property {ContentSwitchMode} [mode=ContentSwitchMode.fadeRight] - The transition played when the
 * selected entry changes.
 * @property {number} [transitionDuration=0.3] - How long that transition lasts, in seconds.
 * @property {StatefulReifect<Shown> | StatefulReifectProperties<Shown>} [transitionReifect] - The reifect
 * driving the transition. Pass an existing {@link StatefulReifect} to share one between components, or a
 * properties object to have one built.
 */
type GradumContentSwitchProperties<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    mode?: ContentSwitchMode;
    transitionDuration?: number;
    transitionReifect?: StatefulReifect<Shown> | StatefulReifectProperties<Shown>;
};

/**
 * @class GradumContentSwitch
 * @group Components
 * @category Containers
 *
 * @extends GradumSelectElement
 * @template ValueType - The type of the value held by each entry.
 * @template SecondaryValueType - The type of each entry's secondary value.
 * @template {HTMLElement} EntryType - The type of the entry elements.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Shows one entry at a time and animates the swap when the selection changes. Registered
 * as `<gradum-content-switch>`. Selection works as on any {@link GradumSelectElement}; this adds the
 * transition between the outgoing and incoming entry, configured through {@link GradumContentSwitch.mode}.
 */
declare class GradumContentSwitch<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumSelectElement<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType> {
    /**
     * @static
     * @description Default properties assigned to a new content switch. Entries cross over 0.3 seconds.
     */
    static defaultProperties: {
        transitionDuration: number;
    };
    readonly properties: GradumContentSwitchProperties<ViewType, DataType, ModelType, EmitterType>;
    /**
     * @description The transition played when the selected entry changes. Assigning a new mode rebuilds
     * the movement reifect, so the next switch uses it. Defaults to `ContentSwitchMode.fadeRight`.
     */
    set mode(value: ContentSwitchMode);
    /**
     * @description The reifect controlling how each entry itself fades. Assigning a properties object
     * builds a {@link Reifect} from it, and the result is attached to every current entry.
     */
    set entryTransitionReifect(value: Reifect | StatelessReifectProperties);
    get entryTransitionReifect(): Reifect;
    /**
     * @description The reifect controlling how entries slide, which {@link GradumContentSwitch.mode}
     * regenerates. Assigning a properties object builds a {@link Reifect} from it, and the result is
     * attached to every current entry.
     */
    set movementReifect(value: Reifect | StatelessReifectProperties);
    get movementReifect(): Reifect;
    /**
     * @description How long the entry transition lasts, in seconds. Assigning a value rewrites the entry
     * reifect's CSS transition, creating that reifect if it does not exist yet. Values of `0` or less are
     * ignored. Defaults to `0.3`.
     * @override
     */
    set transitionDuration(value: number);
    initialize(): void;
    protected setupEntry(entry: EntryType): void;
    private freezeAndHide;
    private reloadMovementReifect;
    protected beforeResize(selectedEntry: EntryType): void;
}

/**
 * @group Components
 * @category Containers
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
 * @category Containers
 */
declare class GradumDrawer<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EMitterType extends GradumEmitter = GradumEmitter> extends GradumElement<ViewType, DataType, ModelType, EMitterType> {
    readonly properties: GradumDrawerProperties;
    private _panelContainer;
    /**
     * @private
     * @description Guards {@link setupUILayout} against re-entering itself. Reading `thumb` or `panel`
     * creates them on first access, and their setters call `setupUILayout` again — so the layout would
     * otherwise run nested, and the inner run would leave `childHandler` pointing at the panel while the
     * outer run is still going.
     */
    private layingOutUI;
    /**
     * @readonly
     * @description The element wrapping the panel. It is the one that resizes as the drawer opens and
     * closes; the panel itself keeps its natural size.
     */
    get panelContainer(): HTMLElement;
    private dragging;
    /**
     * @protected
     * @description Watches the panel while the drawer is open, so the drawer follows its content when
     * that content changes size.
     */
    protected resizeObserver: ResizeObserver;
    /**
     * @description The handle used to open and close the drawer. Assign an element to use it directly, or
     * properties to build one. Clicking it toggles the drawer; dragging it moves the drawer with the pointer.
     */
    set thumb(value: GradumProperties | HTMLElement);
    get thumb(): HTMLElement;
    /**
     * @description The drawer's content panel. Assign an element to use it directly, or properties to build
     * one. Any children already on the drawer are moved into it when the layout is set up.
     */
    set panel(value: GradumProperties | HTMLElement);
    get panel(): HTMLElement;
    /**
     * @description The icon shown inside the thumb. Assign an icon name, an element, or icon-switch
     * properties. Given a name, a {@link GradumIconSwitch} is built that tracks the drawer's side so the
     * icon points the right way.
     */
    set icon(_value: string | Element | GradumIconSwitchProperties<Side> | GradumIconSwitch<Side>);
    get icon(): GradumIconSwitch<Side> | Element;
    /**
     * @description Whether content overflowing the panel is clipped rather than spilling out of the drawer.
     */
    set hideOverflow(value: boolean);
    /**
     * @description Whether the drawer's side is appended to the icon's name, so a different icon file is
     * loaded per side. Turning this on turns {@link GradumDrawer.rotateIconBasedOnSide} off.
     */
    set attachSideToIconName(value: boolean);
    /**
     * @description Whether one icon is rotated to suit the drawer's side instead of swapping files.
     * Turning this on turns {@link GradumDrawer.attachSideToIconName} off.
     */
    set rotateIconBasedOnSide(value: boolean);
    /**
     * @description The edge the drawer is attached to. Assigning it swaps the matching CSS class and
     * refreshes the drawer's position.
     */
    set side(value: Side);
    /**
     * @description How far the drawer sits from its edge, in pixels, given separately for its open and
     * closed states. Assign a single number to use it for both.
     */
    set offset(value: number | PartialRecord<Open, number>);
    get offset(): PartialRecord<Open, number>;
    /**
     * @readonly
     * @description Whether the drawer opens along the vertical axis, i.e. it is attached to the top or
     * bottom edge.
     */
    get isVertical(): boolean;
    /**
     * @description Whether the drawer is open. Assigning it animates the drawer to its new position.
     */
    set open(value: boolean);
    private set translation(value);
    transition: Reifect;
    /**
     * @description How far the drawer is currently displaced from its edge, in pixels. Set while dragging
     * to follow the pointer; otherwise driven by {@link GradumDrawer.open}.
     */
    get translation(): number;
    /**
     * @function initialize
     * @description Set the drawer up and settle it into its closed position without animating, then enable
     * transitions on the next frame so later changes animate normally.
     */
    initialize(): void;
    /**
     * @inheritDoc
     */
    protected setupUIElements(): void;
    /**
     * @inheritDoc
     */
    protected setupUILayout(): void;
    /**
     * @inheritDoc
     */
    protected setupUIListeners(): void;
    /**
     * @function getOppositeSide
     * @description Get the side facing the given one — top against bottom, left against right.
     * @param {Side} [side=this.side] - The side to invert. Defaults to the drawer's own side.
     * @returns {Side} The opposite side.
     */
    getOppositeSide(side?: Side): Side;
    /**
     * @function getAdjacentSide
     * @description Get the side a quarter-turn from the given one, used to rotate the thumb's icon.
     * @param {Side} [side=this.side] - The side to rotate from. Defaults to the drawer's own side.
     * @returns {Side} The adjacent side.
     */
    getAdjacentSide(side?: Side): Side;
    /**
     * @function refresh
     * @description Re-measure the panel and move the drawer to the position its current state calls for.
     * Call it after changing the panel's contents outside the drawer's own observers.
     */
    refresh(): void;
    /**
     * @function enableTransition
     * @protected
     * @description Turn the drawer's open/close animation on or off, to move it instantly while dragging.
     * @param {boolean} b - Whether the transition is enabled.
     */
    protected enableTransition(b: boolean): void;
    /**
     * @function setupResizeObserver
     * @protected
     * @description Start following the panel's size while the drawer is open, so the drawer grows and
     * shrinks with its content. Resizes are ignored mid-transition and mid-drag, where the size is already
     * being driven deliberately.
     */
    protected setupResizeObserver(): void;
}
/**
 * @function drawer
 * @group Components
 * @category Containers
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Create a {@link GradumDrawer}. Shorthand for `GradumDrawer.create(properties)`.
 * @param {GradumDrawerProperties} properties - The drawer's configuration.
 * @returns {GradumDrawer} The created drawer.
 */
declare function drawer<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter>(properties: GradumDrawerProperties<ViewType, DataType, ModelType, EmitterType>): GradumDrawer<ViewType, DataType, ModelType, EmitterType>;

/**
 * @group Components
 * @category Containers
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
 * @category Containers
 */
declare enum PopupFallbackMode {
    invert = "invert",
    offset = "offset",
    none = "none"
}

/**
 * @group Components
 * @category Containers
 */
declare class GradumPopup<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumPopupProperties;
    /**
     * @static
     * @description Default properties assigned to a new popup: anchored below its target, kept 4px inside
     * the viewport, and falling back by offsetting horizontally or flipping vertically when it would
     * overflow.
     */
    static defaultProperties: GradumPopupProperties;
    /**
     * @static
     * @protected
     * @description The shared container every popup is moved into, appended to the document body on first
     * use. Reparenting popups here keeps them clear of any ancestor that clips or transforms them.
     */
    protected static parentElement: HTMLElement;
    /**
     * @description The element this popup positions itself against. Defaults to the document body.
     */
    anchor: Element;
    /**
     * @description Which point of the popup is pinned to the anchor, in percentages of its own size —
     * `{x: 0, y: 0}` is its top-left, `{x: 100, y: 100}` its bottom-right. Values are clamped to `0`–`100`.
     */
    set popupPosition(value: Coordinate);
    get popupPosition(): Point;
    /**
     * @description Which point of the anchor the popup is pinned to, in percentages of the anchor's size.
     * Values are clamped to `0`–`100`.
     */
    set anchorPosition(value: Coordinate);
    get anchorPosition(): Point;
    /**
     * @description The minimum gap in pixels kept between the popup and the viewport edges. Assign a
     * single number to use it for both axes.
     */
    set viewportMargin(value: Coordinate | number);
    get viewportMargin(): Point;
    /**
     * @description Extra pixel offset applied after the popup is aligned to its anchor. Assign a single
     * number to use it for both axes.
     */
    set offsetFromAnchor(value: Coordinate | number);
    get offsetFromAnchor(): Point;
    /**
     * @description What to do per axis when the popup would overflow the viewport — shift it back into
     * view, or flip it to the anchor's other side. Assign a single mode to use it for both axes.
     */
    set fallbackModes(value: PopupFallbackMode | Coordinate<PopupFallbackMode>);
    get fallbackModes(): Coordinate<PopupFallbackMode>;
    protected get rect(): DOMRect;
    protected get anchorRect(): DOMRect;
    protected get computedStyle(): CSSStyleDeclaration;
    protected get anchorComputedStyle(): CSSStyleDeclaration;
    protected get computedMargins(): Coordinate;
    /**
     * @function initialize
     * @description Set the popup up hidden, and move it into the shared popup container so no ancestor can
     * clip or transform it.
     */
    initialize(): void;
    /**
     * @inheritDoc
     */
    protected setupUIListeners(): void;
    private recomputePosition;
    private computeAxis;
    /**
     * @function show
     * @description Show or hide the popup. Showing it repositions it against its anchor first, while it is
     * still invisible, so it never appears at a stale position.
     * @param {boolean} b - Whether to show the popup.
     * @returns {this} Itself, allowing for method chaining.
     */
    show(b: boolean): this;
}

/**
 * @class AnchorPoint
 * @group Components
 * @category Data Structures
 *
 * @description A position within a box, expressed either as one of the nine named {@link Anchor} values
 * or as a free {@link Point} in percentages from `-100` to `100`. The two forms are interchangeable —
 * assign whichever is convenient and read back whichever you need.
 */
declare class AnchorPoint {
    /**
     * @constructor
     * @description Create an anchor point.
     * @param {Point | Anchor} [anchor] - The starting position, as a named anchor or a point.
     */
    constructor(anchor?: Point | Anchor);
    /**
     * @description The anchor's position as a point. Assigning a named {@link Anchor} converts it; assigning
     * anything unrecognized leaves the current value untouched.
     */
    set value(value: Point | Anchor);
    get value(): Point;
    /**
     * @readonly
     * @description This position as a fraction of the box, from `-0.5` at the left or top edge through `0`
     * at the centre to `+0.5` at the right or bottom. The same value as {@link AnchorPoint.value}, which is
     * a percentage, scaled into the form that multiplies a size directly.
     *
     * @example
     * ```ts
     * //Where a box's anchor sits, measured from its middle.
     * const offset = new AnchorPoint(Anchor.TopLeft).fraction.mul(size); //(-w/2, -h/2)
     * ```
     */
    get fraction(): Point;
    /**
     * @function offsetIn
     * @description The vector from the middle of a box out to this anchor. Turned by `rotation`, so it
     * points where the anchor actually is on a box that has been rotated about its middle, rather than
     * where it would sit on an upright one.
     * @param {Coordinate} size - The box's width and height.
     * @param {number} [rotation=0] - The box's rotation in radians.
     * @returns {Point} The offset from the middle of the box.
     *
     * @example
     * ```ts
     * //The screen position of a rotated box's top-left corner.
     * const corner = middle.add(new AnchorPoint(Anchor.TopLeft).offsetIn(size, angleRad));
     * ```
     */
    offsetIn(size: Coordinate, rotation?: number): Point;
    /**
     * @readonly
     * @description The named {@link Anchor} nearest this position, snapping each axis to its closest edge
     * or centre.
     */
    get enum(): Anchor;
    /**
     * @function pointToEnum
     * @static
     * @description Snap a point to the nearest named anchor. Each axis rounds to the closest of its two
     * edges or its centre.
     * @param {Point} value - The point to convert.
     * @returns {Anchor} The nearest named anchor. Defaults to `Anchor.Center` for a missing point.
     */
    static pointToEnum(value: Point): Anchor;
    /**
     * @function enumToPoint
     * @static
     * @description Convert a named anchor to its point, in percentages from `-100` to `100`.
     * @param {Anchor} value - The anchor to convert.
     * @returns {Point} The corresponding point. Returns the origin for a missing anchor.
     */
    static enumToPoint(value: Anchor): Point;
}

/**
 * @type {ScopedKey}
 * @group Components
 * @category Data Structures
 *
 * @template KeyType - The per-item key type.
 * @template BlockKeyType - The block-grouping key type.
 * @description An item key together with the block it belongs to, used to address an entry that is
 * scoped to one block rather than to the store as a whole.
 * @property {BlockKeyType} [blockKey] - The block the item belongs to. Omit it to target the default block.
 * @property {KeyType} [key] - The item's key inside that block.
 */
type ScopedKey<KeyType = any, BlockKeyType = any> = {
    blockKey?: BlockKeyType;
    key?: KeyType;
};
/**
 * @type {BlockStoreType}
 * @group Components
 * @category Data Structures
 *
 * @template {"array" | "map"} Type - How the blocks are stored. Defaults to `"map"`.
 * @template {object} BlockType - The type of one block.
 * @description The container a nested store keeps its blocks in, resolved from `Type`: a `Map` keyed by
 * block name for `"map"`, or a plain array indexed by position for `"array"`.
 */
type BlockStoreType<Type extends "array" | "map" = "map", BlockType extends object = object> = Type extends "map" ? Map<string, BlockType> : BlockType[];

/**
 * @type GradumRectProperties
 * @group Components
 * @category Data Structures
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
 * @category Data Structures
 *
 * @extends DOMRect
 * @description A rectangle that can be rotated, unlike the axis-aligned
 * [DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) it extends. Its geometry helpers
 * ({@link GradumRect.closestPoint}, {@link GradumRect.distanceTo}, {@link GradumRect.overlaps}) all
 * account for the rotation, and accept a point, a segment, or another rect.
 */
declare class GradumRect extends DOMRect {
    /**
     * @description The rectangle's rotation in radians, about its {@link GradumRect.anchor}.
     */
    angleRad: number;
    /**
     * @description The point of the rectangle that `x` and `y` give the position of, and that it turns
     * about. Defaults to `Anchor.TopLeft`, which is what makes an unrotated rectangle read exactly like the
     * `DOMRect` it extends.
     *
     * *Note: the `left`, `top`, `right` and `bottom` inherited from `DOMRect` are derived from `x`, `y`,
     * `width` and `height` alone, so they describe the box only while it is unrotated and anchored to its
     * top-left. Use {@link GradumRect.points} or {@link GradumRect.center} otherwise.*
     */
    anchor: AnchorPoint;
    /**
     * @constructor
     * @description Create a rectangle. Give either `angleRad` or `angleDeg` to rotate it; omitting both
     * leaves it axis-aligned.
     * @param {GradumRectProperties} [properties={}] - The rectangle's position, size, rotation, and anchor.
     */
    constructor(properties?: GradumRectProperties);
    /**
     * @function fromSegment
     * @static
     * @description Build a rectangle covering the segment between two points: centred on the segment,
     * as long as it, and rotated to match its direction.
     * @param {Point} a - The segment's start.
     * @param {Point} b - The segment's end.
     * @param {number} [thickness=1] - The rectangle's height, across the segment.
     * @param {GradumRectProperties} [properties={}] - Extra properties. The computed rotation wins over
     * any angle given here.
     * @returns {GradumRect} The rectangle covering the segment.
     */
    static fromSegment(a: Point, b: Point, thickness?: number, properties?: GradumRectProperties): GradumRect;
    /**
     * @function fromDOMRect
     * @static
     * @description Build a rectangle from a plain `DOMRect`, such as one returned by
     * `getBoundingClientRect()`.
     * @param {DOMRect} rect - The rect to copy position and size from.
     * @param {GradumRectProperties} [properties={}] - Extra properties, such as a rotation to apply.
     * @returns {GradumRect} The converted rectangle.
     */
    static fromDOMRect(rect: DOMRect, properties?: GradumRectProperties): GradumRect;
    /**
     * @function render
     * @description Create a translucent red `div` matching this rectangle's position, size, and rotation.
     * Meant for debugging geometry — append the result to the document to see where the rect actually is.
     * @returns {HTMLElement} The generated element. It is not attached to the document.
     */
    render(): HTMLElement;
    /**
     * @description The rectangle's rotation in degrees. Reads and writes the same rotation as
     * {@link GradumRect.angleRad}, converted.
     */
    get angleDeg(): number;
    set angleDeg(value: number);
    /**
     * @readonly
     * @description The rectangle's centre point, wherever its anchor has put it. `x` and `y` give the
     * anchor's position and the rectangle turns about that anchor, so the centre swings around it as the
     * rotation changes — for the default top-left anchor and no rotation this is the familiar
     * `x + width / 2, y + height / 2`.
     */
    get center(): Point;
    /**
     * @readonly
     * @description Where the rectangle's anchor sits: its `x` and `y`, as a point.
     */
    get origin(): Point;
    /**
     * @readonly
     * @description The rectangle's width and height, as a point.
     */
    get size(): Point;
    /**
     * @function pointAt
     * @description Where one of the rectangle's anchors sits, in the same coordinates as `x` and `y`. Follows
     * the rotation, so it reports where that part of the rectangle actually is rather than where it would sit
     * unrotated.
     * @param {Anchor | Point | AnchorPoint} anchor - The anchor to locate.
     * @returns {Point} Its position.
     *
     * @example
     * ```ts
     * //A rect anchored at its centre still knows where its corner is.
     * const rect = new GradumRect({x: 400, y: 300, width: 100, height: 80, anchor: Anchor.Center});
     * rect.pointAt(Anchor.TopLeft); //(350, 260)
     * ```
     */
    pointAt(anchor: Anchor | Point | AnchorPoint): Point;
    /**
     * @readonly
     * @description The unit vector along the rectangle's own x axis, pointing along its width once rotated.
     */
    get xAxis(): Point;
    /**
     * @readonly
     * @description The unit vector along the rectangle's own y axis, pointing along its height once rotated.
     */
    get yAxis(): Point;
    /**
     * @readonly
     * @description Half the rectangle's width and height, as a point.
     */
    get half(): Point;
    /**
     * @readonly
     * @description The corner to lay the rectangle out from: the top-left of the untilted box sitting at
     * {@link GradumRect.center}. Rotating that box about its own middle reproduces this rectangle, whatever
     * it is anchored to — which is what makes it the value a `translate(...) rotate(...)` transform, or a
     * canvas `drawImage`, wants.
     *
     * *Note: not the same as the rectangle's actual top-left corner once it is rotated. For that, ask for
     * {@link GradumRect.points}`[0]` or {@link GradumRect.pointAt}`(Anchor.TopLeft)`.*
     *
     * @example
     * ```ts
     * gradum(el).setStyle("transform", `translate(${rect.topLeft.x}px, ${rect.topLeft.y}px)
     *     rotate(${rect.angleRad}rad)`);
     * ```
     */
    get topLeft(): Point;
    /**
     * @readonly
     * @description The rectangle's four corners in screen coordinates, clockwise from the top-left,
     * with the rotation applied.
     */
    get points(): [Point, Point, Point, Point];
    /**
     * @function closestPoint
     * @description Find the point on this rectangle nearest to the given point. Points inside the
     * rectangle return themselves.
     * @param {Point} point - The point to measure to.
     * @returns {Point} The nearest point on this rectangle.
     */
    closestPoint(point: Point): Point;
    /**
     * @function closestPoint
     * @description Find the point on this rectangle nearest to the segment between two points. Returns
     * the intersection if the segment crosses the rectangle.
     * @param {Point} point1 - The segment's start.
     * @param {Point} point2 - The segment's end.
     * @returns {Point} The nearest point on this rectangle.
     */
    closestPoint(point1: Point, point2: Point): Point;
    /**
     * @function closestPoint
     * @description Find the point on this rectangle nearest to another rectangle. Accepts a plain
     * `DOMRect` or a rotated {@link GradumRect}.
     * @param {DOMRect} rect - The rectangle to measure to.
     * @returns {Point} The nearest point on this rectangle.
     */
    closestPoint(rect: DOMRect): Point;
    /**
     * @function distanceTo
     * @description Measure the shortest distance from this rectangle to a point.
     * @param {Point} point - The point to measure to.
     * @returns {number} The distance, or `0` if the point is inside this rectangle.
     */
    distanceTo(point: Point): number;
    /**
     * @function distanceTo
     * @description Measure the shortest distance from this rectangle to the segment between two points.
     * @param {Point} point1 - The segment's start.
     * @param {Point} point2 - The segment's end.
     * @returns {number} The distance, or `0` if the segment crosses this rectangle.
     */
    distanceTo(point1: Point, point2: Point): number;
    /**
     * @function distanceTo
     * @description Measure the shortest distance from this rectangle to another rectangle.
     * @param {DOMRect} rect - The rectangle to measure to.
     * @returns {number} The distance, or `0` if the two overlap.
     */
    distanceTo(rect: DOMRect): number;
    /**
     * @function overlaps
     * @description Test whether this rectangle overlaps another. Accepts a plain `DOMRect` or a rotated
     * {@link GradumRect}.
     * @param {DOMRect} other - The rectangle to test against.
     * @returns {boolean} Whether the two overlap.
     */
    overlaps(other: DOMRect): boolean;
    /**
     * @function overlaps
     * @description Test whether a point lies on or inside this rectangle.
     * @param {Point} point - The point to test.
     * @returns {boolean} Whether the point is contained.
     */
    overlaps(point: Point): boolean;
    /**
     * @function overlaps
     * @description Test whether the segment between two points crosses this rectangle.
     * @param {Point} a - The segment's start.
     * @param {Point} b - The segment's end.
     * @returns {boolean} Whether the segment intersects this rectangle.
     */
    overlaps(a: Point, b: Point): boolean;
}

/**
 * @type {GradumDropdownProperties}
 * @group Components
 * @category Menus
 *
 * @extends GradumProperties
 * @description Properties for configuring a Dropdown.
 * @property {(string | HTMLElement)} [selector] - Element or descriptor used as the dropdown selector. If a
 * string is passed, a Button with the given string as text will be assigned as the selector.
 * @property {HTMLElement} [popup] - The element used as a container for the dropdown entries.
 * @property {boolean} [multiSelection=false] - Enables selection of multiple dropdown entries.
 * @property {ValidTag} [selectorTag] - Custom HTML tag for the selector's text. Overrides the
 * default tag set in GradumConfig.Dropdown.
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
 * @category Menus
 *
 * @extends GradumElement
 * @description Dropdown class for creating Gradum button elements.
 */
declare class GradumDropdown<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumSelectElement<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType> {
    readonly properties: GradumDropdownProperties;
    /**
     * @static
     * @description Default properties assigned to a new dropdown. Its selector is rendered as an `<h4>`.
     */
    static defaultProperties: GradumDropdownProperties;
    /**
     * @readonly
     * @description The selection logic backing this dropdown. Clicking an entry closes the popup.
     */
    readonly select: GradumSelect<ValueType, SecondaryValueType, EntryType>;
    private popupOpen;
    /**
     * @description The tag used to build the selector element that shows the current selection.
     */
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
 * @category Menus
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
 * @category Menus
 */
declare class GradumMarkingMenu<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel> extends GradumElement<ViewType, DataType, ModelType> {
    readonly properties: GradumMarkingMenuProperties;
    private readonly transition;
    private currentOrigin;
    /**
     * @description How far the pointer must travel, in pixels, before a drag counts as choosing an entry
     * rather than a stray movement.
     */
    minDragDistance: number;
    /**
     * @description The radius of the ring the entries are arranged on, along its wider axis, in pixels.
     */
    semiMajor: number;
    /**
     * @description The radius of the ring the entries are arranged on, along its narrower axis, in pixels.
     * Set it differently from the wider radius to lay the entries out on an ellipse.
     */
    semiMinor: number;
    startAngle: number;
    endAngle: number;
}

/**
 * @group Components
 * @category Menus
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
 * @category Menus
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
 * @category Menus
 *
 * @extends GradumSelectElement
 * @description A swipeable selection wheel. Entries are always position absolute, fanned out by a
 * continuous pixel offset. Dragging moves all entries in real time; releasing snaps to the nearest.
 * The container sizes to the selected entry. Visual state is driven by `entryTransitionReifect`
 * (CSS transitions) and `computeAndApplyStyling` (per-entry opacity/scale/transform).
 */
declare class GradumSelectWheel<ValueType = string, SecondaryValueType = string, EntryType extends HTMLElement = HTMLElement, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> extends GradumSelectElement<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType> {
    /**
     * @static
     * @description Default properties assigned to a new wheel. Entries animate over 0.3 seconds.
     */
    static defaultProperties: {
        transitionDuration: number;
    };
    readonly properties: GradumSelectWheelProperties<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType>;
    private _currentPosition;
    private _index;
    /**
     * @protected
     * @readonly
     * @description Each entry's measured size along the wheel's axis, indexed by entry position. Refreshed
     * by {@link GradumSelectWheel.reloadEntrySizes}.
     */
    protected readonly sizePerEntry: number[];
    /**
     * @protected
     * @readonly
     * @description Each entry's offset from the start of the wheel, indexed by entry position.
     */
    protected readonly positionPerEntry: number[];
    /**
     * @protected
     * @description The combined size of every entry along the wheel's axis.
     */
    protected totalSize: number;
    /**
     * @description How far past the first and last entries the wheel can be dragged, in pixels, before it
     * springs back.
     */
    dragLimitOffset: number;
    /**
     * @description How long the wheel stays open after the last interaction, in milliseconds, unless
     * {@link GradumSelectWheel.alwaysOpen} is set.
     */
    openTimeout: number;
    /**
     * @description The axis the wheel scrolls along.
     */
    direction: Direction;
    /**
     * @description The scale applied to entries at the centre of the wheel and at its edges. Entries in
     * between are scaled proportionally, producing the wheel's depth effect.
     */
    scale: Record<Range, number>;
    /**
     * @description An optional hook replacing the wheel's built-in entry styling. It receives the computed
     * translation, opacity, and scale alongside the default styles, and returns the styles to apply instead.
     */
    generateCustomStyling: (properties: GradumSelectWheelStylingProperties) => string | PartialRecord<keyof CSSStyleDeclaration, string | number>;
    /**
     * @protected
     * @description Whether the wheel is currently being dragged.
     */
    protected dragging: boolean;
    /**
     * @protected
     * @description The pending timer that will close the wheel once {@link GradumSelectWheel.openTimeout}
     * elapses.
     */
    protected openTimer: ReturnType<typeof setTimeout>;
    /**
     * @function initialize
     * @description Set the wheel up and start tracking its entries, re-measuring them whenever an entry is
     * added or removed.
     */
    initialize(): void;
    opacity: Record<Range, number>;
    /**
     * @description The wheel's extent on either side of its centre, in pixels. Assign a single number to
     * use it symmetrically.
     */
    set size(value: Record<Range, number> | number);
    get size(): Record<Range, number>;
    /**
     * @description The reifect animating entries as they move through the wheel. Assign reifect properties
     * to build one. It is attached to every existing entry on assignment.
     */
    set entryTransitionReifect(value: Reifect | StatelessReifectProperties);
    get entryTransitionReifect(): Reifect;
    set transitionDuration(value: number);
    /**
     * @description An extra reifect applied to entries alongside the built-in transition, for styling beyond
     * position and scale. Assign reifect properties to build one, or `null` to remove it.
     */
    set customReifect(value: Reifect | StatelessReifectProperties | null);
    get customReifect(): Reifect;
    private readonly _closeOnClick;
    set alwaysOpen(value: boolean);
    set open(value: boolean);
    /**
     * @readonly
     * @description Whether the wheel scrolls vertically.
     */
    get isVertical(): boolean;
    /** Fractional index — integer when snapped, fractional mid-drag. */
    get index(): number;
    protected set index(value: number);
    /**
     * @description How far the wheel is scrolled, in pixels from its start. Assigning clamps the value to
     * the draggable range, updates the selected index, and restyles every entry.
     */
    get currentPosition(): number;
    protected set currentPosition(value: number);
    /**
     * @function computeDragDelta
     * @protected
     * @description Convert a drag delta into movement along the wheel's axis, inverted so dragging one way
     * scrolls the entries the other.
     * @param {Point} delta - The pointer's movement.
     * @returns {number} The distance to scroll, in pixels.
     */
    protected computeDragDelta(delta: Point): number;
    /**
     * @function reloadEntrySizes
     * @protected
     * @description Re-measure every entry and rebuild the wheel's size and position tables. Call it after the
     * entries change, or after the wheel becomes visible — entries laid out while hidden measure as zero.
     */
    protected reloadEntrySizes(): void;
    /**
     * @function indexToPosition
     * @protected
     * @description Get the scroll position at which the given entry sits at the centre of the wheel.
     * @param {number} index - The entry's index.
     * @returns {number} The corresponding scroll position, in pixels.
     */
    protected indexToPosition(index: number): number;
    /**
     * @function positionToIndex
     * @protected
     * @description Get the entry index a scroll position corresponds to. The result is fractional between
     * entries, which is what drives the wheel's scaling mid-drag.
     * @param {number} position - The scroll position, in pixels.
     * @returns {number} The fractional entry index.
     */
    protected positionToIndex(position: number): number;
    /**
     * @function snapToNearest
     * @protected
     * @description Settle the wheel on the entry nearest its current position and select it. Called when a
     * drag ends.
     */
    protected snapToNearest(): void;
    /**
     * @function applyTransition
     * @protected
     * @description Scroll the wheel to the selected entry and size the wheel to match it. Overrides the base
     * selection behaviour, which sizes to the entry element instead.
     */
    protected applyTransition(): void;
    /**
     * @function applyAllEntryStyles
     * @protected
     * @description Restyle every entry for the current scroll position. Styles are applied instantly while
     * dragging, so transforms are not queued behind a frame and left visibly lagging the pointer.
     */
    protected applyAllEntryStyles(): void;
    /**
     * @function computeAndApplyStyling
     * @protected
     * @description Compute an entry's opacity, scale, and transform from how far it sits from the wheel's
     * centre, and apply them. Defers to {@link GradumSelectWheel.generateCustomStyling} when one is set.
     * @param {HTMLElement} element - The entry to style.
     * @param {number} translationValue - The entry's offset from the centre, in pixels.
     * @param {Record<Range, number>} [size=this.size] - The wheel's extent, used to scale the falloff.
     * @param {boolean} [instant=false] - Whether to set the styles directly, skipping the CSS transition.
     */
    protected computeAndApplyStyling(element: HTMLElement, translationValue: number, size?: Record<Range, number>, instant?: boolean): void;
    /**
     * @function clearOpenTimer
     * @protected
     * @description Cancel the pending timer that would close the wheel.
     */
    protected clearOpenTimer(): void;
    /**
     * @function setOpenTimer
     * @protected
     * @description Restart the timer that closes the wheel once {@link GradumSelectWheel.openTimeout} elapses.
     */
    protected setOpenTimer(): void;
}

/**
 * @type {GradumButtonPopupProperties}
 * @group Components
 * @category Basics
 *
 * @extends GradumRichElementProperties
 * @template {ValidTag} ElementTag - The tag of the main element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumButtonPopup} — a button that shows a popup when
 * activated. Adds the popup container to everything {@link GradumRichElementProperties} accepts.
 * @property {HTMLElement} [popup] - Element used as the popup container. One is created if omitted.
 * @property {string | string[]} [popupClasses] - CSS class(es) to add to the popup container.
 */
type GradumButtonPopupProperties<ElementTag extends ValidTag = any, ViewType extends GradumView = GradumView, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel<DataType>, EmitterType extends GradumEmitter = GradumEmitter> = GradumRichElementProperties<ElementTag, ViewType, DataType, ModelType, EmitterType> & {
    popup?: HTMLElement;
    popupClasses?: string | string[];
};

/**
 * @class GradumButtonPopup
 * @group Components
 * @category Basics
 *
 * @extends GradumButton
 * @template {ValidTag} ElementTag - The tag of the button's main element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description A button that toggles a {@link GradumPopup} anchored to itself. A popup is created on
 * first use if none is assigned, so the button works without any extra setup.
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

/**
 * @class GradumGrid
 * @group Components
 * @category Wrappers
 *
 * @extends GradumElement
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description An element laying its children out on a grid, positioning them by cell rather than by
 * coordinates.
 * *Note: unimplemented. The class is currently an empty placeholder that behaves exactly like a plain
 * {@link GradumElement}, and it is not registered as a custom element.*
 */
declare class GradumGrid<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
}

/**
 * @class GradumMovable
 * @group Components
 * @category Wrappers
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
 * @group MVC
 * @category Element Classes
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description GradumHeadlessElement class, similar to GradumElement but without extending HTMLElement.
 */
declare class GradumHeadlessElement<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>> {
    /**
     * @description Default properties assigned to a new instance.
     */
    static defaultProperties: GradumHeadlessProperties;
    /**
     * @function create
     * @static
     * @description Instantiate this class with the given properties. Defaults declared by every class in the
     * inheritance chain are applied first, nearest ancestor last, so a subclass' `defaultProperties` win over
     * its parent's. The return type follows the class it is called on, so a subclass gets its own type back.
     * @param {PropertiesType} [properties] - Properties to set on the new instance.
     * @returns {InstanceType<Type>} The created instance.
     */
    static create<This extends {
        prototype: GradumHeadlessElement;
    }, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>>(this: This, properties?: This["prototype"]["properties"] & GradumHeadlessProperties<ViewType, DataType, ModelType, EmitterType>): This["prototype"] & GradumHeadlessElement<ViewType, DataType, ModelType, EmitterType>;
    /**
     * @protected
     * @static
     * @function customCreate
     * @description The construction step behind {@link create}. Override it to change how instances of a class
     * are built — to route through a factory, or to wrap the instance — while keeping the default-merging that
     * `create` performs.
     * @param {object} properties - Properties to set on the new instance, defaults already merged in.
     * @returns {object} The created instance.
     */
    protected static customCreate(properties: object): object;
    readonly properties: GradumHeadlessProperties<ViewType, DataType, ModelType, EmitterType>;
}

/**
 * @class GradumProxiedElement
 * @group MVC
 * @category Element Classes
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description GradumProxiedElement class, similar to GradumElement but containing an HTML element instead of being one.
 */
declare class GradumProxiedElement<ElementTag extends ValidTag = ValidTag, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>> {
    /**
     * @description Default properties assigned to a new instance.
     */
    static defaultProperties: GradumElementProperties;
    /**
     * @function create
     * @static
     * @description Instantiate this class with the given properties. Defaults declared by every class in the
     * inheritance chain are applied first, nearest ancestor last, so a subclass' `defaultProperties` win over
     * its parent's. The return type follows the class it is called on, so a subclass gets its own type back.
     * @param {PropertiesType} [properties] - Properties to set on the new instance.
     * @returns {InstanceType<Type>} The created instance.
     */
    static create<This extends {
        prototype: GradumProxiedElement;
    }, ElementTag extends ValidTag = ValidTag, ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel = GradumModel, EmitterType extends GradumEmitter = GradumEmitter<any>>(this: This, properties?: This["prototype"]["properties"] & GradumProxiedProperties<ElementTag, ViewType, DataType, ModelType, EmitterType>): This["prototype"] & GradumProxiedElement<ElementTag, ViewType, DataType, ModelType, EmitterType>;
    /**
     * @protected
     * @static
     * @function customCreate
     * @description The construction step behind {@link create}. Override it to change how instances of a class
     * are built — to route through a factory, or to wrap the instance — while keeping the default-merging that
     * `create` performs.
     * @param {object} properties - Properties to set on the new instance, defaults already merged in.
     * @returns {object} The created instance.
     */
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
 * @category Core
 *
 * @template {object} Type - The type of the object it wraps.
 * @description Selector class that wraps an object and augments it with useful functions to manipulate it. It also
 * proxies the object, so you can access properties and methods on the underlying object directly through the selector.
 */
declare class GradumSelector<Type extends object = Node> {
    #private;
    /**
     * @category Core
     * @description The underlying, wrapped object. Every method on the selector reads and writes through it.
     */
    element: Type;
    /**
     * @category Core
     * @constructor
     * @description Create a bare selector. Prefer {@link gradum} (or `g`, `gr`, `$`), which caches one
     * selector per target and wires up {@link GradumSelector.element} for you. The instance returned is a
     * proxy, so properties not found on the selector fall through to the wrapped object.
     */
    constructor();
}

/**
 * @type {Gradum}
 * @group GradumSelector
 * @category Core
 *
 * @template {object} Type - The type of the wrapped object. Defaults to `Node`.
 * @description What {@link gradum} hands back: the wrapped object plus the whole selector API, intersected.
 * That means a wrapped element still answers to its own members — `el.textContent` works alongside
 * `el.addChild(...)` — so a `Gradum<HTMLDivElement>` can be used anywhere the raw element was.
 */
type Gradum<Type extends object = Node> = GradumSelector<Type> & Type;
/**
 * @type {GradumifyOptions}
 * @group GradumSelector
 * @category Core
 *
 * @description Which families of selector functions {@link gradumify} should skip. Every family is installed
 * by default; set a flag to leave that family off the {@link GradumSelector} prototype. Excluding a family
 * means its functions simply do not exist, so only do it if you know nothing in your app calls them.
 * @property {boolean} [excludeHierarchyFunctions] - Skip `addChild`, `closest`, `childHandler`, and the rest of the DOM-hierarchy functions.
 * @property {boolean} [excludeMvcFunctions] - Skip `model`, `view`, `emitter`, and the MVC add/get/remove methods.
 * @property {boolean} [excludeStyleFunctions] - Skip `setStyle`, `setStyles`, `selected`, and `closestRoot`.
 * @property {boolean} [excludeClassFunctions] - Skip `addClass`, `removeClass`, `toggleClass`, and `hasClass`.
 * @property {boolean} [excludeElementFunctions] - Skip `setProperties`, `clone`, `destroy`, and `feedforward`.
 * @property {boolean} [excludeEventFunctions] - Skip `on`, `onTool`, `executeAction`, and `preventDefault`.
 * @property {boolean} [excludeToolFunctions] - Skip `makeTool`, `applyTool`, and `embedTool`.
 * @property {boolean} [excludeConstrainerFunctions] - Skip `makeConstrainer`, `solveConstrainer`, and `mutate`.
 * @property {boolean} [excludeMiscFunctions] - Skip `apply`, `applyDefaults`, `extract`, and `getDifference`.
 * @property {boolean} [excludeReifectFunctions] - Skip `show`, `applyReifect`, and `attachReifect`.
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
 * @category Core
 *
 * @template {ValidTag} Tag - The HTML tag of the element to instantiate.
 * @description All-in-one selector function that instantiates an element with the given tag and returns it wrapped
 * in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use `gr()`,
 * `g()`, or `$()` for the same behavior.
 * @param {Tag} [tag="div"] - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<ValidElement<Tag>>} The instantiated, wrapped, and proxied element.
 */
declare function gradum<Tag extends ValidTag = "div">(tag?: Tag): Gradum<ValidElement<Tag>>;
/**
 * @overload
 * @function gradum
 * @group GradumSelector
 * @category Core
 *
 * @template {object} Type - The type of the object to wrap.
 * @description All-in-one selector function that wraps the given object in a proxied selector that augments it
 * with useful functions for manipulating it. You can alternatively use `gr()`, `g()`, or `$()` for the same behavior.
 * @param {Type} object - The object to wrap.
 * @param {boolean} [raw=false] - If set to true, the selector will operate directly on the provided object, even
 * if it contains an inner `element` field. Useful when you want to set properties on a proxied wrapper itself rather
 * than its underlying DOM element.
 * @returns {Gradum<Type>} The wrapped, proxied object.
 */
declare function gradum<Type extends object = Node>(object: Type, raw?: boolean): Gradum<Type>;
/**
 * @overload
 * @function gradum
 * @group GradumSelector
 * @category Core
 *
 * @description All-in-one selector function that instantiates an element with the given tag (if valid) and returns it
 * wrapped in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use
 * `gr()`, `g()`, or `$()` for the same behavior.
 * @param {string} tag - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<Element>} The instantiated, wrapped, and proxied element.
 */
declare function gradum(tag?: string): Gradum<Element>;
/**
 * @overload
 * @function gr
 * @group GradumSelector
 * @category Core
 *
 * @template {ValidTag} Tag - The HTML tag of the element to instantiate.
 * @description All-in-one selector function that instantiates an element with the given tag and returns it wrapped
 * in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use `gradum()`,
 * `g()`, or `$()` for the same behavior.
 * @param {Tag} [tag="div"] - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<ValidElement<Tag>>} The instantiated, wrapped, and proxied element.
 */
declare function gr<Tag extends ValidTag = "div">(tag?: Tag): Gradum<ValidElement<Tag>>;
/**
 * @overload
 * @function gr
 * @group GradumSelector
 * @category Core
 *
 * @template {object} Type - The type of the object to wrap.
 * @description All-in-one selector function that wraps the given object in a proxied selector that augments it
 * with useful functions for manipulating it. You can alternatively use `gradum()`, `g()`, or `$()` for the same behavior.
 * @param {Type} object - The object to wrap.
 * @param {boolean} [raw=false] - If set to true, the selector will operate directly on the provided object, even
 * if it contains an inner `element` field. Useful when you want to set properties on a proxied wrapper itself rather
 * than its underlying DOM element.
 * @returns {Gradum<Type>} The wrapped, proxied object.
 */
declare function gr<Type extends object = Node>(object: Type, raw?: boolean): Gradum<Type>;
/**
 * @overload
 * @function gr
 * @group GradumSelector
 * @category Core
 *
 * @description All-in-one selector function that instantiates an element with the given tag (if valid) and returns it
 * wrapped in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use
 * `gradum()`, `g()`, or `$()` for the same behavior.
 * @param {string} tag - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<Element>} The instantiated, wrapped, and proxied element.
 */
declare function gr(tag: string): Gradum<Element>;
/**
 * @overload
 * @function g
 * @group GradumSelector
 * @category Core
 *
 * @template {ValidTag} Tag - The HTML tag of the element to instantiate.
 * @description All-in-one selector function that instantiates an element with the given tag and returns it wrapped
 * in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use `gradum()`,
 * `gr()`, or `$()` for the same behavior.
 * @param {Tag} [tag="div"] - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<ValidElement<Tag>>} The instantiated, wrapped, and proxied element.
 */
declare function g<Tag extends ValidTag = "div">(tag?: Tag): Gradum<ValidElement<Tag>>;
/**
 * @overload
 * @function g
 * @group GradumSelector
 * @category Core
 *
 * @template {object} Type - The type of the object to wrap.
 * @description All-in-one selector function that wraps the given object in a proxied selector that augments it
 * with useful functions for manipulating it. You can alternatively use `gradum()`, `gr()`, or `$()` for the same behavior.
 * @param {Type} object - The object to wrap.
 * @param {boolean} [raw=false] - If set to true, the selector will operate directly on the provided object, even
 * if it contains an inner `element` field. Useful when you want to set properties on a proxied wrapper itself rather
 * than its underlying DOM element.
 * @returns {Gradum<Type>} The wrapped, proxied object.
 */
declare function g<Type extends object = Node>(object: Type, raw?: boolean): Gradum<Type>;
/**
 * @overload
 * @function g
 * @group GradumSelector
 * @category Core
 *
 * @description All-in-one selector function that instantiates an element with the given tag (if valid) and returns it
 * wrapped in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use
 * `gradum()`, `gr()`, or `$()` for the same behavior.
 * @param {string} tag - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<Element>} The instantiated, wrapped, and proxied element.
 */
declare function g(tag: string): Gradum<Element>;
/**
 * @overload
 * @function $
 * @group GradumSelector
 * @category Core
 *
 * @template {ValidTag} Tag - The HTML tag of the element to instantiate.
 * @description All-in-one selector function that instantiates an element with the given tag and returns it wrapped
 * in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use `gradum()`,
 * `gr()`, or `g()` for the same behavior.
 * @param {Tag} [tag="div"] - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<ValidElement<Tag>>} The instantiated, wrapped, and proxied element.
 */
declare function $<Tag extends ValidTag = "div">(tag?: Tag): Gradum<ValidElement<Tag>>;
/**
 * @overload
 * @function $
 * @group GradumSelector
 * @category Core
 *
 * @template {object} Type - The type of the object to wrap.
 * @description All-in-one selector function that wraps the given object in a proxied selector that augments it
 * with useful functions for manipulating it. You can alternatively use `gradum()`, `gr()`, or `g()` for the same behavior.
 * @param {Type} object - The object to wrap.
 * @param {boolean} [raw=false] - If set to true, the selector will operate directly on the provided object, even
 * if it contains an inner `element` field. Useful when you want to set properties on a proxied wrapper itself rather
 * than its underlying DOM element.
 * @returns {Gradum<Type>} The wrapped, proxied object.
 */
declare function $<Type extends object = Node>(object: Type, raw?: boolean): Gradum<Type>;
/**
 * @overload
 * @function $
 * @group GradumSelector
 * @category Core
 *
 * @description All-in-one selector function that instantiates an element with the given tag (if valid) and returns it
 * wrapped in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use
 * `gradum()`, `gr()`, or `g()` for the same behavior.
 * @param {string} tag - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<Element>} The instantiated, wrapped, and proxied element.
 */
declare function $(tag: string): Gradum<Element>;
/**
 * @function gradumify
 * @group GradumSelector
 * @category Core
 *
 * @description Install every selector function onto the {@link GradumSelector} prototype. Runs once — later
 * calls are no-ops — and is invoked automatically the first time {@link gradum} is called, so you rarely
 * need it directly. Call it yourself only to opt a family of functions out before anything else runs.
 * @param {GradumifyOptions} [options={}] - Which function families to skip.
 *
 * @example
 * ```ts
 * // Install everything except the tool and constrainer functions.
 * gradumify({excludeToolFunctions: true, excludeConstrainerFunctions: true});
 * ```
 */
declare const gradumify: (options?: GradumifyOptions) => void;

/**
 * @type {ChildHandler}
 * @group GradumSelector
 * @category Hierarchy
 *
 * @description A type that represents all entities that can hold and manage children (an element or a shadow root).
 */
type ChildHandler = Node | ShadowRoot;
/**
 * @constant
 * @group GradumSelector
 * @category Misc
 * @description Default array-like keys to merge when applying defaults with {@link GradumSelector.applyDefaults}.
 */
declare const ApplyDefaultsMergeProperties: readonly ["interactors", "tools", "constrainers", "operators", "handlers"];
/**
 * @type {ApplyDefaultsOptions}
 * @group GradumSelector
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
 * @type {YDocumentProperties}
 * @group Utilities
 * @category Yjs
 *
 * @template {GradumView} ViewType - The element's view type.
 * @template {object} DataType - The element's data type.
 * @template {GradumModel<DataType>} ModelType - The element's model type.
 * @template {GradumEmitter} EmitterType - The element's emitter type.
 * @description Properties for an element backed by a Y.js document. Everything
 * {@link GradumElementProperties} accepts, plus the document the element's data lives in.
 * @property {YDoc} document - The Y.js document backing this element.
 */
type YDocumentProperties<ViewType extends GradumView = GradumView<any, any>, DataType extends object = object, ModelType extends GradumModel<DataType> = GradumModel, EmitterType extends GradumEmitter = GradumEmitter> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    document: Doc;
};

/**
 * @class GradumYModel
 * @group MVC
 * @category Model
 *
 * @extends GradumModel
 * @template DataType - The type of the data held in the model.
 * @template {KeyType} DataKeyType - The type of the data's keys.
 * @template {KeyType} IdType - The type of the data's ID.
 * @template {object} ComponentType - The type of instances managed by attached observers.
 * @template DataEntryType - The type of data associated with each observer instance.
 * @description A {@link GradumModel} whose data lives in a Y.js structure, so edits propagate to every other
 * client sharing the document. Reads and writes go through the same API as a plain model; changes arriving
 * from Y.js — local or remote — are turned into the usual signal and observer notifications.
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
    /**
     * @inheritDoc
     */
    protected diffCheck(oldData: DataType, newData: DataType): boolean;
    protected observeChanges(event: YEvent, transaction: any): void;
    /**
     * @protected
     * @function attachNestedObservers
     * @description Start observing a Y.js type and everything nested inside it, so changes anywhere in the
     * subtree reach this model. Types already being observed are skipped, so repeated calls are cheap.
     * @param {any} value - The Y.js type to observe. Non-Y values are ignored.
     */
    protected attachNestedObservers(value: any): void;
    /**
     * @protected
     * @function detachNestedObservers
     * @description Stop observing a Y.js type and everything nested inside it, releasing the observers
     * attached by {@link GradumYModel.attachNestedObservers}.
     * @param {any} value - The Y.js type to stop observing. Non-Y values are ignored.
     */
    protected detachNestedObservers(value: any): void;
    private shiftIndices;
    private getPathToTarget;
}

/**
 * @function areEqual
 * @group Utilities
 * @category Equity
 *
 * @template Type - The type of the compared entries.
 * @description Check whether every entry is the same value, compared with `Object.is`. Use it for identity;
 * reach for {@link areSimilar} when two distinct objects holding the same content should count as equal.
 * @param {...Type[]} entries - The entries to compare. Fewer than two entries always counts as equal.
 * @returns {boolean} `true` if all entries are the same value.
 */
declare function areEqual<Type = any>(...entries: Type[]): boolean;
/**
 * @function areSimilar
 * @group Utilities
 * @category Equity
 *
 * @template Type - The type of the compared entries.
 * @description Check whether every entry holds the same content, even if they are different objects. Falls
 * back through three strategies per pair: identity, the entries' own `equals` method if they define one, then
 * matching JSON and string representations. Non-objects that are not identical are never similar.
 * @param {...Type[]} entries - The entries to compare. Fewer than two entries always counts as similar.
 * @returns {boolean} `true` if all entries are equivalent in content.
 */
declare function areSimilar<Type = any>(...entries: Type[]): boolean;
/**
 * @function equalToAny
 * @group Utilities
 * @category Equity
 *
 * @template Type - The type of the compared entries.
 * @description Check whether one entry matches at least one of the given values, compared loosely (`==`).
 * @param {Type} entry - The entry to look for.
 * @param {...Type[]} values - The values to match against. Passing none counts as a match.
 * @returns {boolean} `true` if `entry` equals any of the values.
 */
declare function equalToAny<Type = any>(entry: Type, ...values: Type[]): boolean;
/**
 * @function eachEqualToAny
 * @group Utilities
 * @category Equity
 *
 * @template Type - The type of the compared entries.
 * @description Check whether every entry matches at least one of the allowed values, compared loosely (`==`).
 * Use it to validate that a set of inputs all fall within a known set.
 * @param {Type[]} values - The allowed values.
 * @param {...Type[]} entries - The entries to check. Passing none counts as a match.
 * @returns {boolean} `true` if every entry equals one of the allowed values.
 */
declare function eachEqualToAny<Type = any>(values: Type[], ...entries: Type[]): boolean;

/**
 * @function getFileExtension
 * @group Utilities
 * @category String
 *
 * @description Read the extension off a filename or path, leading dot included. Also used to tell a file path
 * from a directory path, since a directory yields an empty string.
 * @param {string} [str] - The filename or path to read.
 * @returns {string} The extension including its dot (`".png"`), or an empty string if there is none. Only
 * extensions of one to four characters are recognized.
 */
declare function getFileExtension(str?: string): string;

/**
 * @function hashString
 * @group Utilities
 * @category Hash
 *
 * @description Hash a string with SHA-256 and render it as hexadecimal. Use it when you need a stable
 * fingerprint of some content; use {@link hashBySize} when the result has to fit a length budget.
 * @param {string} input - The string to hash.
 * @returns {Promise<string>} The 64-character hexadecimal digest.
 */
declare function hashString(input: string): Promise<string>;
/**
 * @function hashBySize
 * @group Utilities
 * @category Hash
 *
 * @description Hash a string with SHA-256 and render it as a short, URL-safe string of the requested length.
 * The alphabet is base64 with `+` and `/` swapped for `-` and `_` and the padding dropped, so the result is
 * safe in URLs and identifiers. Shorter lengths raise the chance of collisions.
 * @param {string} input - The string to hash.
 * @param {number} [chars=12] - How many characters the result should be.
 * @returns {Promise<string>} The truncated URL-safe digest.
 */
declare function hashBySize(input: string, chars?: number): Promise<string>;

/**
 * @function linearInterpolation
 * @group Utilities
 * @category Interpolation
 *
 * @description Map a value from one range onto another, along the straight line through `(x1, y1)` and
 * `(x2, y2)`. Useful for turning a position into a ratio, a ratio into a size, and so on.
 * @param {number} x - The input value to map.
 * @param {number} x1 - Start of the input range.
 * @param {number} x2 - End of the input range.
 * @param {number} y1 - Value returned when `x` equals `x1`.
 * @param {number} y2 - Value returned when `x` equals `x2`.
 * @param {boolean} [strict=true] - Whether to clamp `x` into `[x1, x2]` first. Set it to `false` to allow
 * extrapolation beyond the given range.
 * @returns {number} The interpolated value.
 */
declare function linearInterpolation(x: number, x1: number, x2: number, y1: number, y2: number, strict?: boolean): number;

/**
 * @function trim
 * @group Utilities
 * @category Numbers
 *
 * @description Clamp a number into a range. Anything that is not a number comes back as the fallback rather
 * than as `NaN`, so it is safe to pass unvalidated input straight in.
 * *Note: the bounds are given max-first.*
 * @param {number} value - The value to clamp.
 * @param {number} max - Upper bound, inclusive.
 * @param {number} [min=0] - Lower bound, inclusive.
 * @param {number} [fallback=0] - Returned when `value` is not a number.
 * @returns {number} The value clamped into `[min, max]`, or `fallback` if it was not a number.
 */
declare function trim(value: number, max: number, min?: number, fallback?: number): number;
/**
 * @function mod
 * @group Utilities
 * @category Numbers
 *
 * @description Wrap a number into `[0, modValue)`, so negative inputs come back positive — unlike the `%`
 * operator, which keeps the sign of its left operand. Use it to cycle an index around a list.
 * @param {number} value - The value to wrap.
 * @param {number} modValue - The modulus. Must be non-zero.
 * @returns {number} The wrapped value, always in `[0, modValue)`.
 * @throws {RangeError} If `modValue` is `0`, since no value can be wrapped into an empty range. Guard the
 * call when the modulus comes from a length that may be zero.
 */
declare function mod(value: number, modValue: number): number;

/**
 * @function randomId
 * @group Utilities
 * @category Random
 *
 * @description Generate a random identifier from the platform's cryptographic random source. Prefer it over
 * {@link randomString} whenever the value has to be unpredictable, such as an element or record ID.
 * @param {number} [length=8] - How many characters the ID should be.
 * @returns {string} A random alphanumeric ID of the requested length.
 */
declare function randomId(length?: number): string;
/**
 * @function randomFromRange
 * @group Utilities
 * @category Random
 *
 * @description Pick a random number between two bounds. The bounds may be given in either order, and
 * non-numeric input yields `0` rather than `NaN`.
 * @param {number} n1 - One end of the range.
 * @param {number} n2 - The other end of the range.
 * @returns {number} A number in `[min, max)`, or `0` if either bound was not a number.
 */
declare function randomFromRange(n1: number, n2: number): number;
/**
 * @function randomString
 * @group Utilities
 * @category Random
 *
 * @description Generate a random alphanumeric string from `Math.random`. Suitable for filler and test data;
 * use {@link randomId} instead when the value must be unguessable.
 * @param {number} [length=12] - How many characters the string should be.
 * @returns {string} A random string of the requested length.
 */
declare function randomString(length?: number): string;

/**
 * @function replaceUrlParams
 * @group Utilities
 * @category URL
 *
 * @description Set query parameters on the current URL without adding a history entry, so the change cannot
 * be undone with the browser's back button. Use {@link pushUrlParams} when the change should be navigable.
 * Existing parameters of the same name are overwritten; the rest are left alone.
 * @param {...{name: string, value: string}[]} params - The parameters to set.
 */
declare function replaceUrlParams(...params: {
    name: string;
    value: string;
}[]): void;
/**
 * @function getUrlParam
 * @group Utilities
 * @category URL
 *
 * @description Read one query parameter from the current URL.
 * @param {string} name - The parameter to read.
 * @returns {string} The parameter's value, or `null` if it is not present.
 */
declare function getUrlParam(name: string): string;
/**
 * @function pushUrlParams
 * @group Utilities
 * @category URL
 *
 * @description Set query parameters on the current URL and add a history entry, so the change can be undone
 * with the browser's back button. Use {@link replaceUrlParams} when it should not be navigable.
 * @param {...{name: string, value: string}[]} params - The parameters to set.
 */
declare function pushUrlParams(...params: {
    name: string;
    value: string;
}[]): void;
/**
 * @function clearUrlParams
 * @group Utilities
 * @category URL
 *
 * @description Strip every query parameter from the current URL without adding a history entry.
 */
declare function clearUrlParams(): void;

/**
 * @function camelToKebabCase
 * @group Utilities
 * @category String
 *
 * @description Convert a camelCase string to kebab-case, the form HTML attributes and CSS properties use.
 * @param {string} [str] - The string to convert.
 * @returns {string} The kebab-case string, or `undefined` if the input was empty or missing.
 */
declare function camelToKebabCase(str?: string): string;
/**
 * @function kebabToCamelCase
 * @group Utilities
 * @category String
 *
 * @description Convert a kebab-case string to camelCase, the form JavaScript properties use.
 * @param {string} [str] - The string to convert.
 * @returns {string} The camelCase string, or `undefined` if the input was empty or missing.
 */
declare function kebabToCamelCase(str?: string): string;

/**
 * @function formatMMSS
 * @group Utilities
 * @category String
 *
 * @description Format a duration in seconds as `"MM:SS"`, both parts zero-padded. Minutes are not capped at
 * 60, so a long duration reads as `"90:00"` rather than rolling into hours — use {@link formatHHMMSS} for that.
 * @param {number} seconds - The duration in seconds. Fractions are truncated.
 * @param {string} [separator=":"] - What to place between the parts.
 * @returns {string} The formatted duration.
 */
declare function formatMMSS(seconds: number, separator?: string): string;
/**
 * @function formatHHMMSS
 * @group Utilities
 * @category String
 *
 * @description Format a duration in seconds as `"HH:MM:SS"`, each part zero-padded.
 * @param {number} seconds - The duration in seconds. Fractions are truncated.
 * @param {string} [separator=":"] - What to place between the parts.
 * @returns {string} The formatted duration.
 */
declare function formatHHMMSS(seconds: number, separator?: string): string;
/**
 * @function formatMmSs
 * @group Utilities
 * @category String
 *
 * @description Format a duration in seconds in a compact, human-readable form such as `"2m30s"` — no
 * zero-padding, and the minutes part dropped entirely when the duration is under a minute.
 * @param {number} seconds - The duration in seconds. Fractions are truncated.
 * @param {string} [separator=""] - What to place between the minutes and seconds parts.
 * @returns {string} The formatted duration.
 */
declare function formatMmSs(seconds: number, separator?: string): string;

/**
 * @function blobToUrl
 * @group Utilities
 * @category URL
 *
 * @description Read a blob into a `data:` URL that embeds its content, so it can be stored or sent as text.
 * The result is self-contained and needs no cleanup, unlike `URL.createObjectURL`, but is larger than the
 * original by roughly a third.
 * @param {Blob} blob - The blob to read.
 * @returns {Promise<string>} A `data:` URL holding the blob's content.
 */
declare function blobToUrl(blob: Blob): Promise<string>;
/**
 * @function urlToBlob
 * @group Utilities
 * @category URL
 *
 * @description Fetch a URL and hand back its content as a blob. Works with `data:` URLs as well as remote
 * ones, making it the inverse of {@link blobToUrl}.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<Blob>} The fetched content.
 */
declare function urlToBlob(url: string): Promise<Blob>;

/**
 * @function textToElement
 * @group Utilities
 * @category DOM
 *
 * @description Parse a string of HTML into a live element. Only the first top-level element of the string is
 * returned, so wrap multiple siblings in a container if you need all of them.
 * @param {string} text - The markup to parse.
 * @returns {Element} The parsed element, or `undefined` if the string held no element.
 */
declare function textToElement(text: string): Element;
/**
 * @function createProxy
 * @group Utilities
 * @category DOM
 *
 * @template {object} SelfType - The type of the primary object.
 * @template {object} ProxiedType - The type of the fallback object.
 * @description Combine two objects into one, without copying anything. Reads and writes go to the first
 * object when it already has the property, and fall through to the second otherwise — so the first shadows
 * the second, and both stay live rather than being snapshotted.
 * @param {SelfType} self - The primary object, consulted first.
 * @param {ProxiedType} proxied - The fallback object, used for anything the primary lacks.
 * @returns {SelfType & ProxiedType} A proxy exposing both objects as one.
 */
declare function createProxy<SelfType extends object, ProxiedType extends object>(self: SelfType, proxied: ProxiedType): SelfType & ProxiedType;

/**
 * @function isNull
 * @group Utilities
 * @category Null Check
 *
 * @description Check whether a value is `null`. Treats `undefined` as distinct, so pair it with
 * {@link isUndefined} to cover both.
 * @param {any} value - The value to test.
 * @returns {boolean} `true` if the value is `null`.
 */
declare function isNull(value: any): boolean;
/**
 * @function isUndefined
 * @group Utilities
 * @category Null Check
 *
 * @description Check whether a value is `undefined`. Uses a `typeof` test, so it is safe on names that were
 * never declared, and it does not treat `null` as undefined.
 * @param {any} value - The value to test.
 * @returns {boolean} `true` if the value is `undefined`.
 */
declare function isUndefined(value: any): boolean;
/**
 * @function alphabeticalSorting
 * @group Utilities
 * @category Sorting
 *
 * @description Comparator for `Array.prototype.sort` that orders keys naturally: strings by locale, numbers
 * by value, and symbols by their description. Pairs of mixed types are left in place.
 * @param {string | number | symbol} a - The first key.
 * @param {string | number | symbol} b - The second key.
 * @returns {number} A negative number, zero, or a positive number, as `sort` expects.
 */
declare function alphabeticalSorting(a: string | number | symbol, b: string | number | symbol): number;

/**
 * @function getFirstDescriptorInChain
 * @group Utilities
 * @category Prototype
 *
 * @description Find how a property is defined on an object or the closest ancestor that declares it, giving
 * you the getter, setter, or value rather than just the resolved result. The search starts at the object
 * itself and stops before `Object.prototype`, so inherited built-ins are never returned.
 * @param {object} object - The object to search from.
 * @param {PropertyKey} key - The property to look for.
 * @returns {PropertyDescriptor} The nearest descriptor, or `undefined` if nothing in the chain declares it.
 */
declare function getFirstDescriptorInChain(object: object, key: PropertyKey): PropertyDescriptor;
/**
 * @function hasPropertyInChain
 * @group Utilities
 * @category Prototype
 *
 * @description Check whether an object or any of its ancestors declares a property as its own. Unlike `in`,
 * the search stops before `Object.prototype`, so built-ins such as `toString` do not count as a match.
 * @param {object} object - The object to search from.
 * @param {PropertyKey} key - The property to look for.
 * @returns {boolean} `true` if the property is declared anywhere in the chain.
 */
declare function hasPropertyInChain(object: object, key: PropertyKey): boolean;
/**
 * @function getFirstPrototypeInChainWith
 * @group Utilities
 * @category Prototype
 *
 * @description Find the nearest ancestor prototype that declares a property, skipping the object itself. Use
 * it to locate which class in a hierarchy a member came from.
 * @param {object} object - The object to search from.
 * @param {PropertyKey} key - The property to look for.
 * @returns {any} The nearest prototype declaring it, or `undefined` if none does.
 */
declare function getFirstPrototypeInChainWith(object: object, key: PropertyKey): any;
/**
 * @function getSuperMethod
 * @group Utilities
 * @category Prototype
 *
 * @description Find the inherited implementation a wrapper is standing in for, so a decorator or patched
 * method can call through to it. The wrapper itself is skipped, which is what stops a patched method from
 * finding and recursing into itself.
 * @param {object} object - The object whose ancestors to search.
 * @param {PropertyKey} key - The member to look for.
 * @param {Function} wrapperFn - The wrapping function to skip over.
 * @returns {Function} The inherited implementation, or `undefined` if there is none.
 */
declare function getSuperMethod(object: object, key: PropertyKey, wrapperFn: Function): Function;
/**
 * @function getSuperDescriptor
 * @group Utilities
 * @category Prototype
 *
 * @description Find how a property is defined one level further up than {@link getFirstPrototypeInChainWith}
 * looks, skipping both the object and its immediate prototype. Use it from inside a class to reach the
 * definition its own prototype is overriding.
 * @param {object} object - The object whose ancestors to search.
 * @param {PropertyKey} key - The property to look for.
 * @returns {PropertyDescriptor} The inherited descriptor, or `undefined` if none exists.
 */
declare function getSuperDescriptor(object: object, key: PropertyKey): PropertyDescriptor;
/**
 * @function getPrototypeChain
 * @group Utilities
 * @category Prototype
 *
 * @description List an object's prototype chain, nearest first. Passing a class lists the class and its
 * ancestors; passing an instance starts at its prototype. Used to walk a hierarchy and merge each level's
 * static defaults.
 * @param {object} object - The instance or class to walk.
 * @returns {any[]} The chain from nearest to furthest, stopping before `Function.prototype`.
 */
declare function getPrototypeChain(object: object): any[];
/**
 * @function getConstructorChain
 * @group Utilities
 * @category Prototype
 *
 * @description List the constructors an object inherits from, nearest first. Where {@link getPrototypeChain}
 * yields prototypes, this yields the classes themselves.
 * @param {object} object - The instance or class to walk.
 * @returns {any[]} The constructors from nearest to furthest, stopping before `Object`.
 */
declare function getConstructorChain(object: object): any[];

/**
 * @function stringify
 * @group Utilities
 * @category String
 *
 * @description Render any value as a string that {@link parse} can turn back into an equivalent value. Dates
 * become ISO strings, arrays are stringified entry by entry, and DOM elements collapse to the placeholder
 * `"[DOM ELEMENT]"` rather than being serialized.
 * @param {any} value - The value to render.
 * @returns {string} The string form, or `undefined` when the value is `null` or `undefined`.
 */
declare function stringify(value: any): string;
/**
 * @function parse
 * @group Utilities
 * @category String
 *
 * @description Turn a string produced by {@link stringify} back into a value, recovering booleans, `null`,
 * numbers, bigints, objects, and arrays. Anything it cannot place comes back unchanged as the original string.
 * *Note: strings that look like function source are evaluated, so only parse input you trust.*
 * @param {string} str - The string to convert back.
 * @returns {any} The recovered value, or the original string if it matched no known form.
 */
declare function parse(str: string): any;

/**
 * @function fetchSvg
 * @group Utilities
 * @category SVG
 *
 * @description Fetch an SVG file and parse it into a live element, ready to be inserted into the document.
 * Because the markup is parsed rather than placed in an `<img>`, the result can be styled and scripted.
 * @param {string} path - The path or URL to fetch the SVG from.
 * @param {boolean} [logError=true] - Whether to also log failures to the console. The promise rejects either
 * way.
 * @returns {Promise<SVGElement>} The parsed SVG element. Rejects on an empty path, a failed request, or
 * markup that does not parse.
 */
declare function fetchSvg(path: string, logError?: boolean): Promise<SVGElement>;

/**
 * @function getVideoDuration
 * @group Utilities
 * @category Media
 *
 * @description Read how long a video is without displaying it, by loading just its metadata into a detached
 * element. Streams whose duration is not known upfront are handled by seeking to the end to force the browser
 * to resolve it. The element and any temporary object URL are cleaned up before the promise settles.
 * @param {Blob | string} input - The video to measure, as a blob or a URL. URLs are fetched anonymously, so
 * a remote server must allow cross-origin reads.
 * @returns {Promise<number>} The duration in seconds. Rejects if the metadata cannot be loaded.
 */
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
 * @returns {YAbstractType} The converted Yjs structure: a YMap for an object, a YArray for an array, and the
 * value itself for a primitive.
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
 * @description Remove the first occurrence of an entry from a YArray. Entries are matched by identity, so
 * pass the same object the array holds rather than an equal copy.
 * @param {unknown} entry - The entry to remove.
 * @param {YArray} parentYArray - The array to remove it from.
 * @returns {boolean} `true` if an entry was removed, `false` if it was not in the array.
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
 * @function getEventPosition
 * @group Utilities
 * @category Geometry
 *
 * @description Read the pointer position out of an event, whichever kind it is. A {@link GradumEvent} yields
 * its scaled position, so the result already accounts for a panned or zoomed canvas; a native pointer event
 * yields raw client coordinates.
 * @param {Event} e - The event to read.
 * @returns {Point} The pointer position, or `undefined` for an event that carries none.
 */
declare function getEventPosition(e: Event): Point;

/**
 * @function aabbCorners
 * @group Utilities
 * @category Geometry
 *
 * @description List the four corners of an axis-aligned rectangle, in clockwise order starting top-left.
 * Use it to feed a `DOMRect` into the polygon helpers, which expect point lists.
 * @param {DOMRect} r - The rectangle to read.
 * @returns {[Point, Point, Point, Point]} The corners: top-left, top-right, bottom-right, bottom-left.
 */
declare function aabbCorners(r: DOMRect): [Point, Point, Point, Point];
/**
 * @function closestPointOnAabb
 * @group Utilities
 * @category Geometry
 *
 * @description Find the point of an axis-aligned rectangle nearest to a given point. A point already inside
 * the rectangle is returned unchanged, so the result is the point itself rather than a point on the border —
 * use {@link closestPointOnEdge} when you always want a point on the outline.
 * @param {Point} p - The point to measure from.
 * @param {DOMRect} r - The rectangle to measure against.
 * @returns {Point} A new point; neither argument is modified.
 */
declare function closestPointOnAabb(p: Point, r: DOMRect): Point;

/**
 * @function isPointInConvexPolygon
 * @group Utilities
 * @category Geometry
 *
 * @description Check whether a point lies inside a convex polygon, borders included.
 * *Note: the polygon must be convex; a concave one gives wrong answers.*
 * @param {Point} p - The point to test.
 * @param {Point[]} poly - The polygon's vertices, in order around its outline.
 * @returns {boolean} `true` if the point is inside or on the border.
 */
declare function isPointInConvexPolygon(p: Point, poly: Point[]): boolean;
/**
 * @function segmentIntersectsPolygon
 * @group Utilities
 * @category Geometry
 *
 * @description Find where a line segment first meets a polygon. A segment lying wholly inside the polygon
 * crosses no edge, so one of its endpoints is returned instead — meaning a non-null result means "touches",
 * not strictly "crosses an edge".
 * @param {Point} a - Start of the segment.
 * @param {Point} b - End of the segment.
 * @param {Point[]} poly - The polygon's vertices, in order around its outline.
 * @returns {Point | null} The meeting point, or `null` if the segment misses the polygon entirely.
 */
declare function segmentIntersectsPolygon(a: Point, b: Point, poly: Point[]): Point | null;
/**
 * @function projectPolygonOntoAxis
 * @group Utilities
 * @category Geometry
 *
 * @description Flatten a polygon onto an axis and return the span it covers there. This is the building block
 * of the separating-axis test in {@link hasSeparatingAxisForPolygons}.
 * @param {Point[]} points - The polygon's vertices.
 * @param {Point} axis - The axis to project onto. Need not be normalized.
 * @returns {[number, number]} The minimum and maximum positions along the axis.
 */
declare function projectPolygonOntoAxis(points: Point[], axis: Point): [number, number];
/**
 * @function hasSeparatingAxisForPolygons
 * @group Utilities
 * @category Geometry
 *
 * @description Check whether any edge of the first polygon yields an axis that separates the two, proving
 * they cannot overlap. This is one half of the test — it must be run both ways round, which is what
 * {@link polygonsIntersect} does.
 * @param {Point[]} polyA - The polygon whose edges supply the candidate axes.
 * @param {Point[]} polyB - The polygon to test against.
 * @returns {boolean} `true` if a separating axis exists, meaning the polygons are apart.
 */
declare function hasSeparatingAxisForPolygons(polyA: Point[], polyB: Point[]): boolean;
/**
 * @function polygonsIntersect
 * @group Utilities
 * @category Geometry
 *
 * @description Check whether two convex polygons overlap, using the separating-axis test in both directions.
 * *Note: both polygons must be convex.*
 * @param {Point[]} a - The first polygon's vertices.
 * @param {Point[]} b - The second polygon's vertices.
 * @returns {boolean} `true` if the polygons overlap.
 */
declare function polygonsIntersect(a: Point[], b: Point[]): boolean;

/**
 * @function closestPointOnEdge
 * @group Utilities
 * @category Geometry
 *
 * @description Find the point on a rectangle's outline nearest to a given point. Unlike
 * {@link closestPointOnAabb}, a point inside the rectangle is pushed out to the nearest edge rather than
 * returned as-is, so the result always sits on the border.
 * @param {Coordinate} pointer - The point to measure from.
 * @param {DOMRect} rect - The rectangle to measure against.
 * @returns {Point} A new point on the rectangle's outline; neither argument is modified.
 */
declare function closestPointOnEdge(pointer: Coordinate, rect: DOMRect): Point;
/**
 * @function pointInsideRect
 * @group Utilities
 * @category Geometry
 *
 * @description Check whether a point falls within a rectangle, with a tolerance band so a near miss still
 * counts — useful for hit-testing against a pointer, which rarely lands exactly on target.
 * @param {Coordinate} point - The point to test.
 * @param {DOMRect} rect - The rectangle to test against.
 * @param {number} [margin=5] - How far outside the rectangle still counts as inside, in pixels.
 * @returns {boolean} `true` if the point is inside the rectangle grown by `margin`.
 */
declare function pointInsideRect(point: Coordinate, rect: DOMRect, margin?: number): boolean;

/**
 * @function closestPointOnSegment
 * @group Utilities
 * @category Geometry
 *
 * @description Find the point of a line segment nearest to a given point. The result is clamped to the
 * segment, so it never lands on the infinite line beyond the endpoints.
 * @param {Point} p - The point to measure from.
 * @param {Point} a - Start of the segment.
 * @param {Point} b - End of the segment.
 * @returns {Point} A new point on the segment; the arguments are left unchanged. A zero-length segment
 * returns `a` itself.
 */
declare function closestPointOnSegment(p: Point, a: Point, b: Point): Point;
/**
 * @function intersectSegments
 * @group Utilities
 * @category Geometry
 *
 * @description Find where two line segments cross, if they do. Only a crossing within both segments counts;
 * an intersection that would fall beyond either one is not reported.
 * @param {Point} a - Start of the first segment.
 * @param {Point} b - End of the first segment.
 * @param {Point} c - Start of the second segment.
 * @param {Point} d - End of the second segment.
 * @returns {Point} A new point at the crossing, or `null` if the segments do not cross. Parallel segments
 * always return `null`, including collinear ones that overlap.
 */
declare function intersectSegments(a: Point, b: Point, c: Point, d: Point): Point;

/**
 * @function css
 * @group Utilities
 * @category CSS
 *
 * @description Tagged template that joins a CSS template literal into one string. It exists mainly so editors
 * syntax-highlight and format the rules inside the literal; the interpolated values are inserted as-is.
 * @param {TemplateStringsArray} strings - The literal's static parts, supplied by the tagged template.
 * @param {...any[]} values - The interpolated values, supplied by the tagged template.
 * @returns {string} The assembled CSS.
 *
 * @example
 * ```ts
 * const styles = css`
 *    .my-class { color: ${color}; }
 * `;
 * ```
 */
declare function css(strings: TemplateStringsArray, ...values: any[]): string;

/**
 * @type {FontProperties}
 * @group Utilities
 * @category Font
 *
 * @description Describes a local font to load with {@link loadLocalFont} — either a single file or a whole
 * family living in one directory. Which of the two is inferred from `pathOrDirectory`: a path with a file
 * extension is treated as one font, a path without one as a directory of them.
 * @property {string} name - The font family name to register it under. For a family, each file must also be
 * named `name-subName`, matching the keys of `stylesPerWeights`.
 * @property {string} pathOrDirectory - Path to the font file, or to the directory holding the family.
 * @property {Record<string, string> | Record<number, Record<string, string>>} [stylesPerWeights] - For a single
 * font, a `{weight: style}` record, defaulting to `{"normal": "normal"}`. For a family, a
 * `{weight: {subName: style}}` record, defaulting to common sub-names and styles for weights 100 through 900.
 * @property {string} [format="woff2"] - The font format declared in the generated `@font-face` rule.
 * @property {string} [extension=".ttf"] - The file extension of the family's files. A missing leading dot is
 * added for you.
 */
type FontProperties = {
    name: string;
    pathOrDirectory: string;
    stylesPerWeights?: Record<string, string> | Record<number, Record<string, string>>;
    format?: string;
    extension?: string;
};

/**
 * @function loadLocalFont
 * @group Utilities
 * @category Font
 *
 * @description Register a local font with the document, so it can be used by family name in CSS. Generates
 * the `@font-face` rules and injects them as a stylesheet. Whether one file or a whole family is loaded is
 * inferred from the path — see {@link FontProperties}.
 * *Note: the passed object is filled in with the defaults it was missing, so it is modified in place.*
 * @param {FontProperties} font - Describes the font to load. Logs an error if `name` or `pathOrDirectory`
 * is missing.
 */
declare function loadLocalFont(font: FontProperties): void;

export { $, AccessLevel, ActionMode, Anchor, AnchorPoint, ApplyDefaultsMergeProperties, BasicInputEvents, ClickMode, ClosestOrigin, Color, ContentSwitchMode, DefaultClickEventName, DefaultDragEventName, DefaultEventName, DefaultKeyEventName, DefaultMoveEventName, DefaultWheelEventName, Delegate, Direction, GradumBaseElement, GradumButton, GradumButtonPopup, GradumClickEventName, GradumConstrainer, GradumContentSwitch, GradumDragEvent, GradumDragEventName, GradumDrawer, GradumDropdown, GradumElement, GradumEmitter, GradumEvent, GradumEventManager, GradumEventName, GradumGrid, GradumHandler, GradumHeadlessElement, GradumIcon, GradumIconSwitch, GradumIconToggle, GradumInput, GradumInteractor, GradumKeyEvent, GradumKeyEventName, GradumLabelElement, GradumMap, GradumMarkingMenu, GradumModel, GradumMovable, GradumMoveEventName, GradumNestedMap, GradumNodeList, GradumNumericalInput, GradumObserver, GradumOperator, GradumPopup, GradumProxiedElement, GradumQueue, GradumRect, GradumRichElement, GradumSelect, GradumSelectElement, GradumSelectInputEvent, GradumSelectWheel, GradumSelector, GradumTool, GradumView, GradumWeakSet, GradumWheelEvent, GradumWheelEventName, GradumYModel, InOut, InputDevice, Listener, ListenerSet, MathMLNamespace, MathMLTags, NonPassiveEvents, OnOff, Open, Point, PopupFallbackMode, Propagation, Range, RegistryCategory, Reifect, Shown, Side, SideH, SideV, StatefulReifect, SvgNamespace, SvgTags, a, aabbCorners, addInYArray, addInYMap, addRegistryCategory, alphabeticalSorting, areEqual, areSimilar, attachListenersAndBehaviors, auto, behavior, blindElement, blobToUrl, button, cache, callOnce, callOncePerInstance, camelToKebabCase, canvas, checker, clearCache, clearCacheEntry, clearUrlParams, closestPointOnAabb, closestPointOnEdge, closestPointOnSegment, constrainer, createProxy, createYArray, createYDoc, createYMap, css, deepObserveAll, deepObserveAny, define, disposeEffect, div, drawer, eachEqualToAny, effect, element, equalToAny, expose, fetchSvg, findRegistered, flexCol, flexColCenter, flexRow, flexRowCenter, form, formatHHMMSS, formatMMSS, formatMmSs, g, generateTagFunction, getAllRegistered, getConstructorChain, getEventPosition, getFileExtension, getFirstDescriptorInChain, getFirstPrototypeInChainWith, getPrototypeChain, getRegisteredByCategories, getRegisteredElements, getRegisteredEntry, getRegisteredMvc, getSignal, getSuperDescriptor, getSuperMethod, getUrlParam, getVideoDuration, gr, gradum, gradumify, h1, h2, h3, h4, h5, h6, handler, hasPropertyInChain, hasSeparatingAxisForPolygons, hashBySize, hashString, img, initializeEffects, input, interactor, intersectSegments, isNull, isPointInConvexPolygon, isUndefined, isolatedModelSignal, jsonToYjs, kebabToCamelCase, linearInterpolation, link, listener, loadLocalFont, markDirty, markDirtyPath, mod, modelSignal, mutator, nestedModelSignal, observe, operator, p, parse, pointInsideRect, polygonsIntersect, projectPolygonOntoAxis, pushUrlParams, randomFromRange, randomId, randomString, removeFromYArray, replaceUrlParams, segmentIntersectsPolygon, setSignal, signal, solver, spacer, span, stringify, style, stylesheet, textToElement, textarea, tool, trackSignal, trim, untrack, urlToBlob, video };
export type { ApplyDefaultsOptions, AutoOptions, BasicPropertyConfig, BlockStoreType, CacheOptions, ChildHandler, CloneElementOptions, ConstrainerAddCallbackProperties, ConstrainerCallbackProperties, ConstrainerChecker, ConstrainerMutator, ConstrainerMutatorProperties, ConstrainerSolver, Coordinate, DefaultEventNameEntry, DefaultEventNameKey, DefineOptions, ElementTagDefinition, ElementTagMap, EnabledGradumEventTypes, FeedforwardProperties, FlatKeyType, FlexRect, FontProperties, Gradum, GradumButtonPopupProperties, GradumConstrainerProperties, GradumContentSwitchProperties, GradumDragEventProperties, GradumDrawerProperties, GradumDropdownProperties, GradumElementDefaultInterface, GradumElementMvcInterface, GradumElementProperties, GradumElementPropertiesMap, GradumElementTagNameMap, GradumElementUiInterface, GradumEventManagerLockStateProperties, GradumEventManagerProperties, GradumEventManagerStateProperties, GradumEventNameEntry, GradumEventNameKey, GradumEventProperties, GradumHeadlessProperties, GradumIconProperties, GradumIconSwitchProperties, GradumIconToggleProperties, GradumInputProperties, GradumInteractorProperties, GradumKeyEventProperties, GradumLabelElementProperties, GradumMarkingMenuProperties, GradumModelProperties, GradumModelProxy, GradumNumericalInputProperties, GradumObserverProperties, GradumOperatorProperties, GradumPopupProperties, GradumProperties, GradumProxiedProperties, GradumRawEventProperties, GradumRectProperties, GradumRichElementProperties, GradumSelectElementProperties, GradumSelectInputEventProperties, GradumSelectProperties, GradumSelectWheelProperties, GradumSelectWheelStylingProperties, GradumToolProperties, GradumViewProperties, GradumWheelEventProperties, GradumifyOptions, HTMLElementMutableFields, HTMLElementNonFunctions, HTMLTag, HitResolver, KeyType, ListenerCallback, ListenerOptions, ListenerProperties, MakeConstrainerOptions, MakeToolOptions, MatchListenerProperties, MathMLTag, MvcBlockKeyType, MvcBlocksType, MvcFlatKeyType, MvcGenerationProperties, MvcProperties, NodeListSlot, NodeListType, PartialRecord, PreventDefaultOptions, PropertyConfig, RegistryEntry, ReifectAppliedOptions, ReifectEnabledObject, ReifectInterpolator, ReifectObjectData, ReifectOnSwitchCallback, SVGTag, SVGTagMap, ScopedKey, SetToolOptions, SignalBox, SignalEntry, StateInterpolator, StateSpecificProperty, StatefulReifectCoreProperties, StatefulReifectProperties, StatelessPropertyConfig, StatelessReifectCoreProperties, StatelessReifectProperties, StylesRoot, StylesType, ToolBehaviorCallback, ToolBehaviorOptions, ValidElement, ValidHTMLElement, ValidMathMLElement, ValidNode, ValidSVGElement, ValidTag, YDocumentProperties };

// Flattened from relative module augmentations
interface GradumSelector {
        /**
         * @category Events
         * @description Readonly set of listeners bound to this node.
         */
        readonly boundListeners: ListenerSet;
        /**
         * @category Events
         * @description If you want the element to bypass the event manager and allow native events to seep through
         * (in case you are preventing default events), you can set this field to a predicate that
         * defines when to bypass the manager according to the passed event.
         */
        bypassManagerOn: (e: Event) => boolean | GradumEventManagerStateProperties;
        /**
         * @category Events
         * @description Lets an element contribute targets the DOM cannot see. Assign a {@link HitResolver} to
         * an element that paints its contents — a canvas — and whatever it reports at the pointer joins the
         * dispatch as if it were a child of it: capture reaches it last, bubble reaches it first, and it can
         * carry listeners, tools, and constrainers like any element.
         *
         * *Note: the objects are looked up once per event, so keep the resolver cheap — test bounding boxes
         * before exact shapes.*
         *
         * @example
         * ```ts
         * gradum(canvas).hitResolver = position => scene.objectsAt(position); //topmost first
         * ```
         */
        hitResolver: HitResolver;
        /**
         * @category Events
         * @description The object to treat as this one's parent when it has no DOM parent, letting a virtual
         * hit target still be found by {@link GradumEvent.closest} and still trigger the constrainers of the
         * element that drew it. Held weakly, so naming a parent never keeps it alive.
         *
         * *Note: objects returned by a {@link HitResolver} get the resolving element as their parent
         * automatically. Assign this only for a scene that nests, where the real parent is another object.*
         */
        hitParent: object;
        /**
         * @function getParent
         * @category Events
         * @description One step up the tree, for a DOM node and a virtual hit target alike: the DOM parent
         * when there is one, otherwise the {@link GradumSelector.hitParent}. This is the climb
         * {@link GradumEvent.closest} and the constrainer checks follow, so an object painted inside a canvas
         * still reaches the element that drew it and everything above that.
         * @returns {object} The parent, or `undefined` at the top of the chain.
         */
        getParent(): object;
        /**
         * @function on
         * @category Events
         * @template {Node} Type - The type of the element.
         * @description Adds an event listener to the element.
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
         * @category Events
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
         * @category Events
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
         * @category Events
         * @description Checks if the given event listener is bound to the element (in its boundListeners list).
         * @param {string} type - The type of the event. Set to null or undefined to get all event types.
         * @param {ListenerCallback} listener - The function that receives a notification.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {boolean} Whether the element has the given listener.
         */
        hasListener(type: string, listener: ListenerCallback, manager?: GradumEventManager): boolean;
        /**
         * @function hasToolListener
         * @category Events
         * @description Checks if the given event listener is bound to the element (in its boundListeners list).
         * @param {string} type - The type of the event. Set to null or undefined to get all event types.
         * @param {string} toolName - The name of the tool the listener is attached to. Set to null or undefined
         * to check for listeners not bound to a tool.
         * @param {ListenerCallback} listener - The function that receives a notification.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {boolean} Whether the element has the given listener.
         */
        hasToolListener(type: string, toolName: string, listener: ListenerCallback, manager?: GradumEventManager): boolean;
        /**
         * @function hasListenersByType
         * @category Events
         * @description Checks if the element has bound listeners of the given type (in its boundListeners list).
         * @param {string} type - The type of the event. Set to null or undefined to get all event types.
         * @param {string} toolName - The name of the tool to consider (if any). Set to null or undefined
         * to check for listeners not bound to a tool.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {boolean} Whether the element has a listener of this type.
         */
        hasListenersByType(type: string, toolName?: string, manager?: GradumEventManager): boolean;
        /**
         * @function removeListener
         * @category Events
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
         * @category Events
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
         * @category Events
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
         * @category Events
         * @description Removes all event listeners bound to the element (in its boundListeners list).
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeAllListeners(manager?: GradumEventManager): this;
        /**
         * @category Events
         * @description Prevent default browser behavior on the provided event types. By default, all basic input events
         * will be processed.
         * @param {PreventDefaultOptions} [options] - An options object to customize the behavior of the function.
         */
        preventDefault(options?: PreventDefaultOptions): this;
    }
interface GradumSelector {
        /**
         * @function makeTool
         * @category Tools
         * @description Turns the element into a tool identified by `toolName`, optionally wiring activation and
         * key mapping. By default, this function also sets up an event listener on the element to activate the
         * tool on click. This behavior can be overridden via the `options` parameter.
         * @param {string} toolName - The unique name of the tool to register under the manager. Reusing an existing
         * `toolName` will make this element another instance of `toolName`.
         * @param {MakeToolOptions} [options] - Tool creation options (custom activation, click mode, key mapping, manager).
         * @returns {this} Itself for chaining.
         */
        makeTool(toolName: string, options?: MakeToolOptions): this;
        /**
         * @function isTool
         * @category Tools
         * @description Whether this element is registered as a tool for the provided manager.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {boolean} True if the element is a tool, false otherwise.
         */
        isTool(manager?: GradumEventManager): boolean;
        /**
         * @function getToolNames
         * @category Tools
         * @description Returns all tool names registered on this element for the provided manager.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {string[]} The list of tool names.
         */
        getToolNames(manager?: GradumEventManager): string[];
        /**
         * @function getToolName
         * @category Tools
         * @description Returns the first registered tool name on this element for the provided manager.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {string} The first tool name, if any.
         */
        getToolName(manager?: GradumEventManager): string;
        /**
         * @function onToolActivate
         * @category Tools
         * @description Retrieve the delegate fired when this tool is activated in the corresponding manager.
         * @param {string} [toolName=this.getToolName()] - The name of the tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {Delegate<() => void} The delegate.
         */
        onToolActivate(toolName?: string, manager?: GradumEventManager): Delegate<() => void>;
        /**
         * @function onToolDeactivate
         * @category Tools
         * @description Retrieve the delegate fired when this tool is deactivated in the corresponding manager.
         * @param {string} [toolName=this.getToolName()] - The name of the tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {Delegate<() => void} The delegate.
         */
        onToolDeactivate(toolName?: string, manager?: GradumEventManager): Delegate<() => void>;
        /**
         * @function addToolBehavior
         * @category Tools
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
         * @category Tools
         * @description Checks whether there is at least one tool behavior for the pair "`type`, `toolName`."
         * @param {string} type - The type of the event (e.g., "pointerdown", "click", custom gradum event).
         * @param {string} [toolName=this.getToolName()] - The tool name to check under. Defaults to this
         * element's first tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {boolean} True if one or more behaviors are registered.
         */
        hasToolBehavior(type: string, toolName?: string, manager?: GradumEventManager): boolean;
        /**
         * @function removeToolBehaviors
         * @category Tools
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
         * @category Tools
         * @description Executes all behaviors registered for the pair "`type`, `toolName`" against this element.
         * @param {string} toolName - The name of the tool whose behaviors should run.
         * @param {string} type - The type of the event (e.g., "pointerdown", "click", custom gradum event).
         * @param {Event} event - The triggering event instance.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {boolean} True if at least one behavior returned `true` (to stop propagation of the event).
         */
        applyTool(toolName: string, type: string, event: Event, manager?: GradumEventManager): Propagation;
        /**
         * @function clearToolBehaviors
         * @category Tools
         * @description Clears all registered behaviors for the tools attached to this element.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        clearToolBehaviors(manager?: GradumEventManager): this;
        /**
         * @function embedTool
         * @category Tools
         * @description Embeds this tool into a target node, so all interactions on the tool element apply to the
         * defined target.
         * @param {Node} target - The node to manipulate when interacting with the tool element itself.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        embedTool(target: Node, manager?: GradumEventManager): this;
        /**
         * @function isEmbeddedTool
         * @category Tools
         * @description Whether this tool is embedded under the provided manager.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {boolean} True if an embedded target is present.
         */
        isEmbeddedTool(manager?: GradumEventManager): boolean;
        /**
         * @function getEmbeddedToolTarget
         * @category Tools
         * @description Returns the target node for this embedded tool under the provided manager.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {Node} The embedded tool's target node, if any.
         */
        getEmbeddedToolTarget(manager?: GradumEventManager): Node;
        /**
         * @function ignoreTool
         * @category Tools
         * @description Make the current element ignore the provided tool, so interacting with the tool on this
         * element will have no effect and propagate.
         * @param {string} toolName - The name of the tool to ignore.
         * @param {string} [type] - The type of the event. If undefined, all event types will be considered.
         * @param {boolean} [ignore] - Whether to ignore the tool. Defaults to true.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        ignoreTool(toolName: string, type?: string, ignore?: boolean, manager?: GradumEventManager): this;
        /**
         * @function ignoreTool
         * @category Tools
         * @description Make the current element ignore all tools, so interacting with any tool on this
         * element will have no effect and propagate.
         * @param {boolean} [ignore] - Whether to ignore the tools. Defaults to true.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        ignoreAllTools(ignore?: boolean, manager?: GradumEventManager): this;
        /**
         * @function isToolIgnored
         * @category Tools
         * @description Whether the current element is ignoring the provided tool.
         * @param {string} toolName - The name of the tool to check for.
         * @param {string} [type] - The type of the event. If undefined, all event types will be considered.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {boolean} Whether the tool is ignored for the provided event type.
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
         * @category Element
         * @template {ValidTag} Tag - The HTML tag of the element (for accurate autocompletion of available properties).
         * @description Sets the declared properties to the element (if possible).
         * @param {GradumProperties<Tag>} properties - The properties object.
         * @param {boolean} [setOnlyBaseProperties=false] - If set to true, will only set the base gradum properties (classes,
         * text, style, id, children, parent, etc.) and ignore all other properties not explicitly defined in GradumProperties.
         * @returns {this} Itself, allowing for method chaining.
         */
        setProperties<Tag extends ValidTag>(properties: GradumProperties<Tag>, setOnlyBaseProperties?: boolean): this;
        /**
         * @category Element
         * @description Read every own field of the element as a plain object, so it can be diffed or cloned.
         * @returns {Record<string, any>} The element's fields, keyed by name.
         */
        getFields(): Record<string, any>;
        /**
         * @category Element
         * @description Create a copy of the element. By default the copy carries the same properties and children,
         * but none of the bound listeners.
         * @param {CloneElementOptions} [options] - What to carry over to the copy.
         * @returns {Type} The cloned element.
         */
        clone(options?: CloneElementOptions): Type;
        /**
         * @category Element
         * @description Destroys the element by removing it from the document and removing all its bound listeners.
         * @returns {this} Itself, allowing for method chaining.
         */
        destroy(): this;
        /**
         * @category Element
         * @description Sets the value of an attribute on the element.
         * @param {string} name The name of the attribute.
         * @param {string | number | boolean} [value] The value of the attribute. Can be left blank to represent
         * a true boolean.
         * @returns {this} Itself, allowing for method chaining.
         */
        setAttribute(name: string, value?: string | number | boolean): this;
        /**
         * @category Element
         * @description Removes an attribute from the element.
         * @param {string} name The name of the attribute to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeAttribute(name: string): this;
        /**
         * @category Element
         * @description Causes the element to lose focus.
         * @returns {this} Itself, allowing for method chaining.
         */
        blur(): this;
        /**
         * @category Element
         * @description Sets focus on the element.
         * @returns {this} Itself, allowing for method chaining.
         */
        focus(): this;
        /**
         * @category Element
         * @description Push the element's feedforward properties down to its children, so newly added descendants
         * pick up the same defaults.
         * @param {FeedforwardProperties} [options] - Properties to feed forward. Defaults to
         * {@link GradumSelector.defaultFeedforwardProperties}.
         * @returns {Type} The element, allowing for method chaining.
         */
        feedforward(options?: FeedforwardProperties): Type;
        /**
         * @category Element
         * @description The properties passed on to children created through {@link GradumSelector.feedforward},
         * letting a parent seed its descendants with shared defaults.
         */
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
        /**
         * @readonly
         * @category MVC
         * @description Every MVC piece bound to the element — its view, model, emitter, and the operator, handler,
         * interactor, tool, and constrainer collections — in one object.
         */
        readonly mvc: MvcProperties;
        /**
         * @category MVC
         * @description The model of the element's MVC structure.
         */
        model: any;
        /**
         * @category MVC
         * @description The view of the element's MVC structure.
         */
        view: any;
        /**
         * @category MVC
         * @description The emitter of the element's MVC structure.
         */
        emitter: any;
        /**
         * @category MVC
         * @description The main data block attached to the element's model.
         */
        data: any;
        /**
         * @category MVC
         * @description A key-value store attached to the element, backed by its own {@link GradumModel} and
         * created on first read — so it is available whether or not the element has a model of its own. Use
         * it for flags that tools and behaviors read off an element: `selectable`, `dragAndDroppable`, and
         * the like. Assigning a plain object replaces the store's contents; assigning a model adopts it.
         *
         * Reads participate in effect tracking once a signal exists for the key, so
         * `metadata.makeSignal("flag")` at setup makes `metadata.get("flag")` reactive inside an `@effect`.
         */
        get metadata(): GradumModel<object>;
        set metadata(value: GradumModel<object> | object);
        /**
         * @category MVC
         * @description The ID of the main data block of the element's model.
         */
        dataId: string;
        /**
         * @category MVC
         * @description The numerical index of the main data block of the element's model.
         */
        dataIndex: number;
        /**
         * @category MVC
         * @description The size (number) of the main data block of the element's model.
         */
        readonly dataSize: number;
        /**
         * @category MVC
         * @description The operators of the element's MVC structure.
         */
        operators: GradumOperator[];
        /**
         * @category MVC
         * @description The handlers attached to the element's model.
         * Returns an empty array if no model is set.
         */
        handlers: GradumHandler[];
        /**
         * @category MVC
         * @description The interactors of the element's MVC structure.
         */
        interactors: GradumInteractor[];
        /**
         * @category MVC
         * @description The tools of the element's MVC structure.
         */
        tools: GradumTool[];
        /**
         * @category MVC
         * @description The constrainers of the element's MVC structure.
         */
        constrainers: GradumConstrainer[];
        /**
         * @function setMvc
         * @category MVC
         * @description Configures the MVC structure for the element. Sets the provided MVC pieces (model, view,
         * emitter, operators, handlers, interactors, tools, constrainers) on the element, initializes a default
         * emitter if none is provided, and initializes all MVC pieces unless explicitly disabled.
         * @param {MvcGenerationProperties} properties - The properties to configure the MVC structure.
         * @returns {this} Itself, allowing for method chaining.
         */
        setMvc(properties: MvcGenerationProperties): this;
        /**
         * @function initializeMvc
         * @category MVC
         * @description Initializes all MVC pieces attached to the element, in the following order: view,
         * operators, interactors, tools, constrainers, and model. The model is initialized last to allow
         * the view and operators to set up their change callbacks first.
         * @returns {this} Itself, allowing for method chaining.
         */
        initializeMvc(): this;
        /**
         * @function getMvcDifference
         * @category MVC
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
         * @category MVC
         * @description Retrieves the attached MVC operator with the given key.
         * @param {string} key - The operator's key.
         * @returns {GradumOperator} The operator.
         */
        getOperator(key: string): GradumOperator;
        /**
         * @function addOperator
         * @category MVC
         * @description Adds the given operator to the element's MVC structure.
         * @param {GradumOperator} operator - The operator to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addOperator(operator: GradumOperator): this;
        /**
         * @function removeOperator
         * @category MVC
         * @description Removes the given operator from the element's MVC structure and unlinks it.
         * @param {string | GradumOperator} keyOrInstance - The operator's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeOperator(keyOrInstance: string | GradumOperator): this;
        /**
         * @function getHandler
         * @category MVC
         * @description Retrieves the attached MVC handler with the given key.
         * Returns undefined if no model is set.
         * @param {string} key - The handler's key.
         * @returns {GradumHandler} The handler.
         */
        getHandler(key: string): GradumHandler;
        /**
         * @function addHandler
         * @category MVC
         * @description Adds the given handler to the element's model.
         * If no model is set, this operation is a no-op.
         * @param {GradumHandler} handler - The handler to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addHandler(handler: GradumHandler): this;
        /**
         * @function removeHandler
         * @category MVC
         * @description Removes the given handler from the element's model and unlinks it.
         * If no model is set, this operation is a no-op.
         * @param {string | GradumHandler} keyOrInstance - The handler's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeHandler(keyOrInstance: string | GradumHandler): this;
        /**
         * @function getInteractor
         * @category MVC
         * @description Retrieves the attached MVC interactor with the given key.
         * @param {string} key - The interactor's key.
         * @returns {GradumInteractor} The interactor.
         */
        getInteractor(key: string): GradumInteractor;
        /**
         * @function addInteractor
         * @category MVC
         * @description Adds the given interactor to the element's MVC structure.
         * @param {GradumInteractor} interactor - The interactor to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addInteractor(interactor: GradumInteractor): this;
        /**
         * @function removeInteractor
         * @category MVC
         * @description Removes the given interactor from the element's MVC structure and unlinks it.
         * @param {string | GradumInteractor} keyOrInstance - The interactor's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeInteractor(keyOrInstance: string | GradumInteractor): this;
        /**
         * @function getTool
         * @category MVC
         * @description Retrieves the attached MVC tool with the given key.
         * @param {string} key - The tool's key.
         * @returns {GradumTool} The tool.
         */
        getTool(key: string): GradumTool;
        /**
         * @function addTool
         * @category MVC
         * @description Adds the given tool to the element's MVC structure.
         * @param {GradumTool} tool - The tool to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addTool(tool: GradumTool): this;
        /**
         * @function removeTool
         * @category MVC
         * @description Removes the given tool from the element's MVC structure and unlinks it.
         * @param {string | GradumTool} keyOrInstance - The tool's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeTool(keyOrInstance: string | GradumTool): this;
        /**
         * @function getConstrainer
         * @category MVC
         * @description Retrieves the attached MVC constrainer with the given key.
         * @param {string} key - The constrainer's key.
         * @returns {GradumConstrainer} The constrainer.
         */
        getConstrainer(key: string): GradumConstrainer;
        /**
         * @function addConstrainer
         * @category MVC
         * @description Adds the given constrainer to the element's MVC structure.
         * @param {GradumConstrainer} constrainer - The constrainer to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addConstrainer(constrainer: GradumConstrainer): this;
        /**
         * @function removeConstrainer
         * @category MVC
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
         * @category Constrainers
         * @description Array of all the constrainers attached to this element.
         */
        readonly constrainersNames: string[];
        /**
         * @function makeConstrainer
         * @category Constrainers
         * @description Creates a new constrainer attached to this element. Useful to maintain certain constraints or
         * ensure some behaviors persist on a list of objects (by attaching solvers to this constrainer).
         * @param {string} name - The name of the new constrainer.
         * @param {MakeConstrainerOptions} [options] - Options parameter to configure the newly-created constrainer.
         * @returns {this} Itself for chaining.
         */
        makeConstrainer(name: string, options?: MakeConstrainerOptions): this;
        /**
         * @category Constrainers
         * @description Array of active constrainers on this element.
         */
        readonly activeConstrainers: string[];
        /**
         * @function activateConstrainer
         * @category Constrainers
         * @description Activate the given constrainer.
         * @param {string[]} constrainers - The name of the constrainer(s) to activate. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        activateConstrainer(...constrainers: string[]): this;
        /**
         * @function deactivateConstrainer
         * @category Constrainers
         * @description Deactivate the given constrainer.
         * @param {string[]} constrainers - The name of the constrainer(s) to deactivate. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        deactivateConstrainer(...constrainers: string[]): this;
        /**
         * @function toggleConstrainer
         * @category Constrainers
         * @description Toggle the active state of the given constrainer.
         * @param {string} constrainer - The name of the constrainer to toggle. Defaults to the first active constrainer.
         * @param {boolean} [force] - If set, the constrainer's active state will be set to this value.
         * @returns {this} Itself for chaining.
         */
        toggleConstrainer(constrainer?: string, force?: boolean): this;
        /**
         * @function activateOnlyConstrainer
         * @category Constrainers
         * @description Activate the provided constrainer and deactivate all other constrainers attached to this element.
         * @param {string} constrainer - The constrainer name to activate as the single active constrainer. Defaults to the
         * first active constrainer.
         * @returns {this} Itself for chaining.
         */
        activateOnlyConstrainer(constrainer: string): this;
        /**
         * @function activateAllConstrainers
         * @category Constrainers
         * @description Activate all the constrainers attached to this element.
         * @returns {this} Itself for chaining.
         */
        activateAllConstrainers(): this;
        /**
         * @function deactivateAllConstrainers
         * @category Constrainers
         * @description Deactivate all the constrainers attached to this element.
         * @returns {this} Itself for chaining.
         */
        deactivateAllConstrainers(): this;
        /**
         * @function onConstrainerActivate
         * @category Constrainers
         * @description Get the delegate fired when the constrainer of the given name is activated.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {Delegate<() => void>} The delegate.
         */
        onConstrainerActivate(constrainer?: string): Delegate<() => void>;
        /**
         * @function onConstrainerDeactivate
         * @category Constrainers
         * @description Get the delegate fired when the constrainer of the given name is deactivated.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {Delegate<() => void>} The delegate.
         */
        onConstrainerDeactivate(constrainer?: string): Delegate<() => void>;
        /**
         * @function getConstrainerPriority
         * @category Constrainers
         * @description Get the priority of the targeted constrainer. Higher priority constrainers (lower number) should
         * be resolved first.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {number} The constrainer priority.
         */
        getConstrainerPriority(constrainer?: string): number;
        /**
         * @function setConstrainerPriority
         * @category Constrainers
         * @description Set the priority of the targeted constrainer. Higher priority constrainers (lower number) should
         * be resolved first.
         * @param {number} priority - The priority value to set.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        setConstrainerPriority(priority: number, constrainer?: string): this;
        /**
         * @function getConstrainerObjectList
         * @category Constrainers
         * @description Retrieve the list of objects that are constrained by the given constrainer.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {GradumNodeList} The list of objects. To manipulate, check {@link GradumNodeList}.
         */
        getConstrainerObjectList(constrainer?: string): GradumNodeList;
        /**
         * @function onConstrainerObjectListChange
         * @category Constrainers
         * @description Get the delegate fired whenever an object is added to or removed from the constrainer's object list.
         * Defaults to the children of the element the constrainer is attached to.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {Delegate<(object: object, status: "added" | "removed") => void>} The delegate.
         */
        onConstrainerObjectListChange(constrainer?: string): Delegate<(object: object, status: "added" | "removed") => void>;
        /**
         * @function getConstrainerTriggerList
         * @category Constrainers
         * @description Retrieve the list of objects that trigger the given constrainer to resolve.
         * Interacting with any of these objects would typically lead to the solving of the given constrainer.
         * Defaults to the constrainer's object list.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {GradumNodeList} The list of trigger objects. To manipulate, check {@link GradumNodeList}.
         */
        getConstrainerTriggerList(constrainer?: string): GradumNodeList;
        /**
         * @function getConstrainerQueue
         * @category Constrainers
         * @description Retrieve the current queue to be processed by the constrainer while resolving.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {GradumQueue<object>} The current constrainer queue.
         */
        getConstrainerQueue(constrainer?: string): GradumQueue<object>;
        /**
         * @function getDefaultConstrainerQueue
         * @category Constrainers
         * @description Retrieve the default queue template for the constrainer, used when starting a new resolving pass.
         * It defaults to the constrainer's object list.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {GradumQueue<object>} The default constrainer queue.
         */
        getDefaultConstrainerQueue(constrainer?: string): GradumQueue<object>;
        /**
         * @function setDefaultConstrainerQueue
         * @category Constrainers
         * @description Define the default queue template for the constrainer, used when starting a new resolving pass.
         * @param {object[] | GradumQueue<object>} queue - The queue (or list to build a queue from).
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        setDefaultConstrainerQueue(queue: object[] | GradumQueue<object>, constrainer?: string): this;
        /**
         * @function getObjectPassesForConstrainer
         * @category Constrainers
         * @description Retrieve how many times the given object has been processed for the current resolving session
         * of the constrainer.
         * @param {object} object - The object to query.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {number} Number of passes already performed on this object.
         */
        getObjectPassesForConstrainer(object: object, constrainer?: string): number;
        /**
         * @function getMaxPassesForConstrainer
         * @category Constrainers
         * @description Get the maximum number of passes allowed per object for this constrainer during resolving.
         * This helps prevent infinite cycles in constraint propagation.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {number} The maximum allowed passes.
         */
        getMaxPassesForConstrainer(constrainer?: string): number;
        /**
         * @function setMaxPassesForConstrainer
         * @category Constrainers
         * @description Set the maximum number of passes allowed per object for this constrainer during resolving. This
         * helps prevent infinite cycles in constraint propagation.
         * @param {number} passes - Maximum number of passes.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        setMaxPassesForConstrainer(passes: number, constrainer?: string): this;
        /**
         * @function getObjectDataForConstrainer
         * @category Constrainers
         * @description Retrieve custom per-object data for this constrainer. It is reset on every new
         * resolving session.
         * @param {object} object - The object to query.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {Record<string, any>} The stored data object (or an empty object if none).
         */
        getObjectDataForConstrainer(object: object, constrainer?: string): Record<string, any>;
        /**
         * @function setObjectDataForConstrainer
         * @category Constrainers
         * @description Set custom per-object data for this constrainer. It is reset on every new resolving session.
         * @param {object} object - The object to update.
         * @param {Record<string, any>} [data] - The new data object to associate with this object.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        setObjectDataForConstrainer(object: object, data?: Record<string, any>, constrainer?: string): this;
        /**
         * @function addChecker
         * @category Constrainers
         * @description Register a checker in the constrainer. Checkers dictate whether the event should continue
         * executing depending on the provided context (event, tool, target, etc.).
         * @param {ConstrainerAddCallbackProperties<ConstrainerChecker>} properties - Configuration object, including the
         * checker `callback` to be executed, the `name` of the checker to access it later, the name of the attached
         * `constrainer`, and the `priority` of the checker.
         * @returns {this} Itself for chaining.
         */
        addChecker(properties: ConstrainerAddCallbackProperties<ConstrainerChecker>): this;
        /**
         * @function removeChecker
         * @category Constrainers
         * @description Remove a checker from the given constrainer by its name.
         * @param {string} name - The checker name.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        removeChecker(name: string, constrainer?: string): this;
        /**
         * @function clearCheckers
         * @category Constrainers
         * @description Remove all checkers attached to the given constrainer.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        clearCheckers(constrainer?: string): this;
        /**
         * @function checkConstrainer
         * @category Constrainers
         * @description Evaluate all checkers for the targeted constrainer and return whether the event should proceed or halt.
         * @param {ConstrainerCallbackProperties} [properties] - Context passed to each checker.
         * @returns {boolean} Whether the constrainer passes all checks.
         */
        checkConstrainer(properties?: ConstrainerCallbackProperties): boolean;
        /**
         * @function checkConstrainersForEvent
         * @category Constrainers
         * @description Evaluate checkers for all relevant constrainers for a given event context.
         * @param {ConstrainerCallbackProperties} [properties] - Event context.
         * @returns {boolean} Whether all the checkers allowed the event to proceed.
         */
        checkConstrainersForEvent(properties?: ConstrainerCallbackProperties): boolean;
        /**
         * @function addMutator
         * @category Constrainers
         * @description Register a mutator in the constrainer. Mutators compute or transform a value based on the context.
         * @param {ConstrainerAddCallbackProperties<ConstrainerMutator>} properties - Configuration object, including the
         * mutator `callback` to be executed, the `name` of the mutator to access it later, the name of the attached
         * `constrainer`, and the `priority` of the mutator.
         * @returns {this} Itself for chaining.
         */
        addMutator(properties: ConstrainerAddCallbackProperties<ConstrainerMutator>): this;
        /**
         * @function removeMutator
         * @category Constrainers
         * @description Remove a mutator from the given constrainer by its name.
         * @param {string} name - The mutator name.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        removeMutator(name: string, constrainer?: string): this;
        /**
         * @function clearMutators
         * @category Constrainers
         * @description Remove all mutators attached to the given constrainer.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        clearMutators(constrainer?: string): this;
        /**
         * @function mutate
         * @category Constrainers
         * @template Type - The type of the value to mutate
         * @description Execute a mutator for the targeted constrainer and return the resulting value.
         * @param {ConstrainerMutatorProperties<Type>} [properties] - Context object, including the
         * `mutation` to execute, and the input `value` to mutate.
         * @returns {Type} The mutated result.
         */
        mutate<Type = any>(properties?: ConstrainerMutatorProperties<Type>): Type;
        /**
         * @function addSolver
         * @category Constrainers
         * @description Register a solver in the constrainer. Solvers typically execute after an event is fired to
         * ensure the constrainer's constraints are maintained. They process all objects in the constrainer's queue,
         * one after the other.
         * @param {ConstrainerAddCallbackProperties<ConstrainerSolver>} properties - Configuration object, including the
         * solver `callback` to be executed, the `name` of the solver to access it later, the name of the attached
         * `constrainer`, and the `priority` of the solver.
         * @returns {this} Itself for chaining.
         */
        addSolver(properties: ConstrainerAddCallbackProperties<ConstrainerSolver>): this;
        /**
         * @function removeSolver
         * @category Constrainers
         * @description Remove the given function from the constrainer's list of solvers.
         * @param {string} name - The solver's name.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        removeSolver(name: string, constrainer?: string): this;
        /**
         * @function clearSolvers
         * @category Constrainers
         * @description Remove all solvers attached to the constrainer.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        clearSolvers(constrainer?: string): this;
        /**
         * @function solveConstrainer
         * @category Constrainers
         * @description Solve the constrainer by executing all of its attached solvers. Each solver will be executed
         * on every object in the constrainer's queue, incrementing its number of passes in the process.
         * @param {ConstrainerCallbackProperties} [properties] - Options object to configure the context.
         * @returns {this} Itself for chaining.
         */
        solveConstrainer(properties?: ConstrainerCallbackProperties): this;
        /**
         * @function solveConstrainersForEvent
         * @category Constrainers
         * @description Solve all relevant constrainers for a given event context.
         * @param {ConstrainerCallbackProperties} [properties] - Event context to pass to solvers.
         * @returns {this} Itself for chaining.
         */
        solveConstrainersForEvent(properties?: ConstrainerCallbackProperties): this;
    }
interface GradumSelector {
        /**
         * @category Style
         * @description The closest root to the element in the document (the closest ShadowRoot, or the document's head).
         */
        readonly closestRoot: StylesRoot;
        /**
         * @category Style
         * @description Whether the element is selected or not. Setting it on an Element will accordingly toggle on it
         * the "selected" CSS class (or whichever default selected class was set for this element) and update the UI.
         */
        selected: boolean;
        /**
         * @category Style
         * @description The CSS classes applied when the element is selected. Assigning a new value moves the
         * classes over if the element is currently selected.
         */
        defaultSelectedClasses: string | string[];
        /**
         * @readonly
         * @category Style
         * @description Delegate fired whenever the element's selected state changes. Receives the new state.
         */
        readonly onSelected: Delegate<(value: boolean) => void>;
        /**
         * @function setStyle
         * @category Style
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
         * @category Style
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
         * @category Style
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
        "gradum-input": GradumInput;
    }
interface GradumElementTagNameMap {
        "gradum-numerical-input": GradumNumericalInput;
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
         * @category Classes
         * @description Add one or more CSS classes to the element.
         * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
         * @returns {this} Itself, allowing for method chaining.
         */
        addClass(classes?: string | string[]): this;
        /**
         * @category Classes
         * @description Remove one or more CSS classes from the element.
         * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeClass(classes?: string | string[]): this;
        /**
         * @category Classes
         * @description Toggle one or more CSS classes in the element.
         * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
         * @param {boolean} force - (Optional) Boolean that turns the toggle into a one way-only operation. If set to false,
         * then the class will only be removed, but not added. If set to true, then token will only be added, but not removed.
         * @returns {this} Itself, allowing for method chaining.
         */
        toggleClass(classes?: string | string[], force?: boolean): this;
        /**
         * @category Classes
         * @description Check if the element's class list contains the provided class(es).
         * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
         * @returns {boolean} Whether the element carries every one of the given classes.
         */
        hasClass(classes?: string | string[]): boolean;
    }
interface GradumSelector extends Node {
    }
interface GradumSelector {
        /**
         * @category Hierarchy
         * @description The child handler object associated with the node. It is the node itself (if it is handling
         * its children) or its shadow root (if defined). Set it to change the node where the children are added/
         * removed/queried from when manipulating the node's children.
         */
        childHandler: ChildHandler;
        /**
         * @category Hierarchy
         * @description Static array of all the child nodes of the node.
         */
        readonly childNodesArray: Node[];
        /**
         * @category Hierarchy
         * @description Static array of all the child elements of the node.
         */
        readonly childrenArray: Element[];
        /**
         * @category Hierarchy
         * @description Static array of all the sibling nodes (including the node itself) of the node.
         */
        readonly siblingNodes: Node[];
        /**
         * @category Hierarchy
         * @description Static array of all the sibling elements (including the element itself, if it is one) of the node.
         */
        readonly siblings: Element[];
        /**
         * @function bringToFront
         * @category Hierarchy
         * @description Brings the element to the front amongst its siblings in the DOM.
         * @returns {this} Itself for chaining.
         */
        bringToFront(): this;
        /**
         * @function sendToBack
         * @category Hierarchy
         * @description Sends the element to the back amongst its siblings in the DOM.
         * @returns {this} Itself for chaining.
         */
        sendToBack(): this;
        /**
         * @function remove
         * @category Hierarchy
         * @description Removes the node from the document.
         * @returns {this} Itself, allowing for method chaining.
         */
        remove(): this;
        /**
         * @function addToParent
         * @category Hierarchy
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
         * @category Hierarchy
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
         * @category Hierarchy
         * @description Remove one or more children from the element.
         * @param {Node | Node[]} [children] - Array of (or single) child nodes.
         * @returns {this} Itself, allowing for method chaining.
         */
        remChild(children?: Node | Node[]): this;
        /**
         * @function addChildBefore
         * @category Hierarchy
         * @description Add one or more children to the element before the provided sibling. If the
         * sibling is not found in the parent's children, the nodes will be added to the end of the parent's child list.
         * @param {Node | Node[]} [children] - Array of (or single) child nodes to insert before sibling.
         * @param {Node} [sibling] - The sibling node to insert the children before.
         * @returns {this} Itself, allowing for method chaining.
         */
        addChildBefore(children?: Node | Node[], sibling?: Node): this;
        /**
         * @function removeChildAt
         * @category Hierarchy
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
         * @category Hierarchy
         * @description Remove all children of the node.
         * @param {Node[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
         * representing all the nodes to remove. Defaults to the node's `childrenArray`.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeAllChildren(referenceList?: Node[] | NodeListOf<Node>): this;
        /**
         * @function childAt
         * @category Hierarchy
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
         * @category Hierarchy
         * @description Returns the index of the given child.
         * @param {Node} [child] - The child element to find.
         * @param {Node[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
         * use as computation reference for index placement. Defaults to the node's `childrenArray`.
         * @returns {number} The index of the child node in the provided list, or -1 if the child is not found.
         */
        indexOfChild(child?: Node, referenceList?: Node[] | NodeListOf<Node>): number;
        /**
         * @function hasChild
         * @category Hierarchy
         * @description Identify whether one or more children belong to this parent node.
         * @param {Node | Node[]} [children] - Array of (or single) child nodes.
         * @returns {boolean} A boolean indicating whether the provided nodes belong to the parent or not.
         */
        hasChild(children?: Node | Node[]): boolean;
        /**
         * @function findInSubTree
         * @category Hierarchy
         * @description Finds whether one or more children belong to this node.
         * @param {Node | Node[]} [children] - The child or children to check.
         * @returns {boolean} True if the children belong to the node, false otherwise.
         */
        findInSubTree(children?: Node | Node[]): boolean;
        /**
         * @function findInParents
         * @category Hierarchy
         * @description Finds whether this node is within the given parent(s).
         * @param {Node | Node[]} [parents] - The parent(s) to check.
         * @returns {boolean} True if the node is within the given parents, false otherwise.
         */
        findInParents(parents?: Node | Node[]): boolean;
        /**
         * @function indexInParent
         * @category Hierarchy
         * @description Finds whether one or more children belong to this node.
         * @param {Node[]} [referenceList=this.siblings] - The siblings list to use as computation
         * reference for index placement. Defaults to the node's `siblings`.
         * @returns {boolean} True if the children belong to the node, false otherwise.
         */
        indexInParent(referenceList?: Node[]): number;
        /**
         * @overload
         * @function closest
         * @category Hierarchy
         * @description Finds the closest ancestor of the current element (or the current element itself) that matches
         * that is an instance of the element associated with the given tag name.
         * @param {Type} type - The (valid) tag name.
         * @returns {Element} The matching ancestor element, or null if no match is found.
         */
        closest<Tag extends ValidTag>(type: Tag): ValidElement<Tag>;
        /**
         * @overload
         * @function closest
         * @category Hierarchy
         * @description Finds the closest ancestor of the current element (or the current element itself) that matches
         * the provided CSS selector.
         * @param {Type} type - The (valid) CSS selector string.
         * @returns {Element} The matching ancestor element, or null if no match is found.
         */
        closest<Tag extends string>(type: Tag): Element;
        /**
         * @overload
         * @function closest
         * @category Hierarchy
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
         * @category Misc
         * @description Execute a callback on the node while still benefiting from chaining.
         * @param {(el: this) => void} callback The function to execute, with 1 parameter representing the instance
         * itself.
         * @returns {this} Itself, allowing for method chaining.
         */
        execute(callback: ((el: this) => void)): this;
        /**
         * @category Misc
         * @description Assign every given property onto the element, overwriting existing values.
         * @param {object} properties - The properties to assign.
         * @returns {this} Itself, allowing for method chaining.
         */
        apply(properties: Partial<this["element"]> & Record<string, any>): this;
        /**
         * @category Misc
         * @description Delete the given fields from the element.
         * @param {(keyof this["element"] | string)[]} keys - The field names to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeFields(keys: (keyof this["element"] | string)[]): this;
        /**
         * @category Misc
         * @description Read the element's current values for the given keys, to capture them before overwriting.
         * @param {(keyof this["element"] | string)[]} defaults - The field names to read.
         * @returns {object} The current value of each requested field.
         */
        getDefaults(defaults: (keyof this["element"] | string)[]): Partial<this["element"]> & Record<string, any>;
        /**
         * @category Misc
         * @description The fields the element and the given object both have, with the element's values.
         * @param {object} other - The object to compare against.
         * @returns {object} The shared fields. Neither input is modified.
         */
        getIntersection(other: Partial<this["element"]> & Record<string, any>): Partial<this["element"]> & Record<string, any>;
        /**
         * @category Misc
         * @description The fields where the element and the given object disagree, with the element's values.
         * @param {object} other - The object to compare against.
         * @returns {object} The differing fields. Neither input is modified.
         */
        getDifference(other: Partial<this["element"]> & Record<string, any>): Partial<this["element"]> & Record<string, any>;
        /**
         * @category Misc
         * @description Read the given fields off the element into a plain object, leaving the element unchanged.
         * @param {(keyof this["element"] | string)[]} keys - The field names to extract.
         * @returns {object} The requested fields and their values.
         */
        extract(keys: (keyof this["element"] | string)[]): Partial<this["element"]> & Record<string, any>;
        /**
         * @function applyDefaults
         * @category Misc
         * @description Apply default properties to the underlying object, with optional smart merging for
         * array-like keys. By default, merging will happen on all MVC properties that accept arrays (like
         * `operators`, `handlers`, `tools`, etc.) to allow for concatenation of such MVC pieces.
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
         * @category Reifects
         * @description Readonly shallow set of the reifects attached to this object.
         */
        readonly reifects: Set<StatefulReifect>;
        /**
         * @category Reifects
         * @description The transition used by the element's show() and isShown methods. Directly modifying its
         * value will modify all elements' default showTransition. Unless this is the desired outcome, set it to a
         * new custom StatefulReifect.
         */
        showTransition: StatefulReifect<Shown>;
        /**
         * @category Reifects
         * @description Boolean indicating whether the element is shown or not, based on its showTransition.
         */
        readonly isShown: boolean;
        /**
         * @category Reifects
         * @description Show or hide the element (based on CSS) by transitioning in/out of the element's showTransition.
         * @param {boolean} b - Whether to show the element.
         * @param {ReifectAppliedOptions<Shown>} [options] - Options controlling how the transition is applied.
         * @returns {this} Itself, allowing for method chaining.
         */
        show(b: boolean, options?: ReifectAppliedOptions<Shown>): this;
        /**
         * @function attachReifect
         * @category Reifects
         * @description Attach one or more reifects to the object.
         * @param {StatefulReifect[]} reifects - The reifect(s) to attach.
         * @returns {this} Itself, allowing for method chaining.
         */
        attachReifect(...reifects: StatefulReifect[]): this;
        /**
         * @function detachReifect
         * @category Reifects
         * @description Detach one or more reifects from the object.
         * @param {StatefulReifect[]} reifects - The reifect(s) to detach.
         * @returns {this} Itself, allowing for method chaining.
         */
        detachReifect(...reifects: StatefulReifect[]): this;
        /**
         * @function initializeReifect
         * @category Reifects
         * @template {string | symbol | number} State - The type of the reifect's states.
         * @description Initializes the reifect at the given state for the corresponding object.
         * @param {StatefulReifect<State>} reifect - The reifect to initialize.
         * @param {State} state - The state to initialize to (if the reifect is not stateless).
         * @param {ReifectAppliedOptions<State>} [options] - Optional overrides for the default values.
         * Set to `null` to not set anything on the object.
         * @returns {this} Itself, allowing for method chaining.
         */
        initializeReifect<State extends string | symbol | number>(reifect?: StatefulReifect<State>, state?: State, options?: ReifectAppliedOptions<State>): this;
        /**
         * @function applyReifect
         * @category Reifects
         * @template {string | symbol | number} State - The type of the reifect's states.
         * @description Applies the reifect at the given state for the corresponding object.
         * @param {StatefulReifect<State>} reifect - The reifect to apply.
         * @param {State} state - The state to initialize to (if the reifect is not stateless).
         * @param {ReifectAppliedOptions<State>} [options] - Optional overrides for the default values.
         * Set to `null` to not set anything on the object.
         * @returns {this} Itself, allowing for method chaining.
         */
        applyReifect<State extends string | symbol | number>(reifect: StatefulReifect<State>, state?: State, options?: ReifectAppliedOptions<State>): this;
        /**
         * @function toggleReifect
         * @category Reifects
         * @template {string | symbol | number} State - The type of the reifect's states.
         * @description Toggles the reifect to the next state for the corresponding object.
         * @param {StatefulReifect<State>} reifect - The reifect to toggle.
         * @param {ReifectAppliedOptions<State>} [options] - Optional overrides for the default values.
         * Set to `null` to not set anything on the object.
         * @returns {this} Itself, allowing for method chaining.
         */
        toggleReifect<State extends string | symbol | number>(reifect: StatefulReifect<State>, options?: ReifectAppliedOptions<State>): this;
        /**
         * @function reloadReifects
         * @category Reifects
         * @description Reloads all reifects attached to this object. Doesn't recompute values.
         * @returns {this} Itself, allowing for method chaining.
         */
        reloadReifects(): this;
        /**
         * @function reloadReifectsChainableStyles
         * @category Reifects
         * @description Reloads all transitions attached to this object. Doesn't recompute values.
         * @returns {this} Itself, allowing for method chaining.
         */
        reloadReifectsChainableStyles(applyInstantly?: boolean): this;
        /**
         * @function reifectEnabledState
         * @category Reifects
         * @description Get the reifect enabled state of this object. If a reifect is provided, the enabled state of
         * the object for this specific reifect will be returned. otherwise, the global state of the object will
         * be returned.
         * @param {StatefulReifect} [reifect] - The target reifect.
         * @returns {ReifectEnabledObject} The enabled state.
         */
        reifectEnabledState(reifect?: StatefulReifect): ReifectEnabledObject;
        /**
         * @function enableReifect
         * @category Reifects
         * @description Set the reifect enabled state of this object. If a reifect is provided, the enabled state of
         * the object for this specific reifect will be updated. otherwise, the global state of the object will
         * be updated
         * @param {boolean | ReifectEnabledObject} value - The new state.
         * @param {StatefulReifect} [reifect] - The target reifect.
         * @returns {this} Itself, allowing for method chaining.
         */
        enableReifect(value: boolean | ReifectEnabledObject, reifect?: StatefulReifect): this;
    }
