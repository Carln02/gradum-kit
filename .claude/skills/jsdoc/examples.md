# Worked examples

Full blocks for the cases the templates in `SKILL.md` don't spell out. Copy the shape, not the words.

## Contents

- [Class with members](#class-with-members)
- [Accessor pair](#accessor-pair)
- [Overloaded class method](#overloaded-class-method)
- [Overloaded standalone function](#overloaded-standalone-function)
- [Decorator](#decorator)
- [Options type](#options-type)
- [Enum](#enum)
- [Callback type](#callback-type)
- [Internal helper](#internal-helper)
- [Before / after rewrites](#before--after-rewrites)

---

## Class with members

The class block carries `@group`/`@category`/`@template`. Members carry only what they need.

````ts
/**
 * @class GradumObserver
 * @group MVC
 * @category Model
 *
 * @extends GradumNestedMap
 * @template DataType - The type of data handled by the observer.
 * @template {object} ComponentType - The instance type the observer creates and manages.
 * @description Keeps a set of component instances in sync with a data source. Point one at
 * a {@link GradumModel} and it creates an instance when an entry appears, updates it when
 * the entry changes, and removes it when the entry is deleted.
 */
class GradumObserver<DataType, ComponentType extends object> {

    /**
     * @description Fired when a change is reported at a key path that has no instance yet.
     * Return a new instance from a handler to have it stored and reused.
     */
    readonly onAdded: Delegate<...>;

    /**
     * @readonly
     * @description Whether {@link initialize} has been called.
     */
    get isInitialized(): boolean;

    /**
     * @function detach
     * @description Drop the instance at the given key path without calling `remove()` on it,
     * leaving it alive but no longer tracked.
     * @param {...KeyType[]} keys - Ordered path to the instance.
     */
    detach(...keys: KeyType[]): void;

    /**
     * @protected
     * @function keyChanged
     * @description Report a change at a key path. Fires `onDeleted`, `onAdded`, or
     * `onUpdated` depending on whether an instance already exists for that path.
     * @param {KeyType[]} keys - The key path that changed.
     * @param {DataType} value - The new value at that path.
     * @param {boolean} [deleted=false] - Whether the entry was removed.
     */
    protected keyChanged(keys: KeyType[], value: DataType, deleted?: boolean): void;
}
````

## Accessor pair

One block, on the getter. Describe the value, then what assigning does.

````ts
/**
 * @description The data held by this model. Assigning new data clears the current state —
 * nested models, observers, and signals — and re-initializes the model.
 */
get data(): DataType;
set data(data: DataType);
````

For an `accessor` field, the same block sits on the field:

````ts
/**
 * @description Whether change callbacks and observer notifications fire. Set it to `false`
 * to apply a batch of edits silently, then back to `true`.
 */
accessor enabledCallbacks: boolean;
````

## Overloaded class method

No `@overload`, no `@group`/`@category`. Each block explains its own signature.

````ts
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

// implementation signature — no doc block
get(...keys: KeyType[]): any { ... }
````

## Overloaded standalone function

`@overload` on each, and `@group`/`@category` repeated, because each renders as its own entry.

````ts
/**
 * @overload
 * @function markDirty
 * @group Decorators
 * @category Signal
 *
 * @description Mark the signal at the given key as dirty and run every effect attached to it.
 * @param {object} target - The object holding the signal.
 * @param {PropertyKey} key - The key of the signal inside `target`.
 */
declare function markDirty(target: object, key: PropertyKey): void;

/**
 * @overload
 * @function markDirty
 * @group Decorators
 * @category Signal
 *
 * @description Mark the signal bound to the given key path as dirty and run its effects.
 * Use this form for signals created by {@link modelSignal}.
 * @param {object} target - The object holding the signal.
 * @param {...KeyType[]} keys - The key path the signal is bound to.
 */
declare function markDirty(target: object, ...keys: KeyType[]): void;
````

## Decorator

`@decorator` first, then `@function`. Show the desugared equivalent in the example — for a decorator, that's the fastest way to convey what it does.

````ts
/**
 * @decorator
 * @function callOncePerInstance
 * @group Decorators
 * @category Augmentation
 *
 * @description Stage-3 method decorator that lets a method run once per instance. Later
 * calls are skipped and log a warning. Works on instance and static methods.
 *
 * @example
 * ```ts
 * class A {
 *   @callOncePerInstance init() { ... }
 * }
 *
 * const a = new A();
 * a.init(); // runs
 * a.init(); // skipped, warns
 * ```
 */
````

## Options type

Sits in the same group and category as the thing it configures.

````ts
/**
 * @type {MakeToolOptions}
 * @group Types
 * @category Tool
 *
 * @description Options for turning an element into a tool with {@link makeTool}.
 * @property {() => void} [onActivate] - Called when the tool is activated.
 * @property {() => void} [onDeactivate] - Called when the tool is deactivated.
 * @property {DefaultEventNameEntry} [activationEvent] - Event that activates the tool.
 * Defaults to the default click event name.
 * @property {ClickMode} [clickMode=ClickMode.left] - Click mode that holds this tool once active.
 * @property {string} [key] - Keyboard key mapped to this tool. Pressing it makes this the
 * current key tool.
 * @property {GradumEventManager} [manager] - Event manager to register against. Defaults to
 * {@link GradumEventManager.instance}.
 */
````

## Enum

````ts
/**
 * @enum {ClickMode}
 * @group Event Handling
 * @category Enums
 *
 * @description Which pointer button or input mode an interaction belongs to. Used to hold a
 * separate active tool per button.
 * @property {ClickMode.none} none - No button held.
 * @property {ClickMode.left} left - Primary button.
 * @property {ClickMode.right} right - Secondary button.
 * @property {ClickMode.key} key - Interaction driven by a mapped keyboard key.
 */
````

## Callback type

````ts
/**
 * @callback ToolBehaviorCallback
 * @group Types
 * @category Tool
 * @template {Node} TargetType - The type of the node the behavior runs on.
 *
 * @description Signature for a tool behavior. Return `true` to mark the event as consumed,
 * which stops its propagation.
 * @param {Event} event - The original DOM or Gradum event.
 * @param {TargetType} target - The node the behavior operates on — the object itself, or its
 * embedded target.
 * @param {ToolBehaviorOptions} [options] - Embedding context, if any.
 * @returns {Propagation | any} Whether to stop propagation.
 */
````

## Internal helper

`@internal` first, no `@group`, no `@category`, no `@example`. Still describe it.

````ts
/**
 * @internal
 * @class GradumNestedMapNode
 * @description One level of a {@link GradumNestedMap}. Holds either child nodes or leaf values.
 */
export class GradumNestedMapNode<KeyType, ValueType> extends Map<KeyType, ValueType> {}
````

---

## Before / after rewrites

### 1. Implementation narration → usage

**Before**
```
@description Iterates the callbacks array, calls each one with the spread args, and
returns the value of the last call.
```
**After**
```
@description Invoke every registered callback with the given arguments.
@param {...Parameters<CallbackType>} args - Arguments passed to each callback.
@returns {ReturnType<CallbackType>} The return value of the last callback invoked.
```

### 2. Restating the name

**Before**
```
@function removeListener
@description Removes a listener.
```
**After**
```
@function removeListener
@description Remove an event listener previously bound to this element. Silently does
nothing if the listener isn't bound.
@param {string} type - The type of the event.
@param {ListenerCallback} listener - The callback to remove.
@returns {this} Itself, allowing for method chaining.
```

### 3. Internals that *do* belong

Some implementation detail changes how you call the thing. Keep that.

```
@description Add coordinates to this point.
@param {Coordinate} p - The coordinates to add.
@returns {Point} A new Point with the result. This point is left unchanged.
```

```
@description Stage-3 decorator that augments fields, getters, setters, and accessors.
*Note: when chaining decorators, place `@auto` closest to the property so it runs first
and sets up the accessor the others rely on.*
```

### 4. Untyped params

**Before**
```
@description Fires a custom drag event at the target.
@param positions
@param eventName
```
**After**
```
@description Fire a drag event at the target, carrying the drag origin, the previous
position, and the current position.
@param {GradumMap<number, Point>} positions - Current position per pointer id.
@param {GradumEventNameEntry} eventName - The event name to fire.
```

### 5. One block covering several overloads

**Before** — a single block above three constructor signatures, listing every accepted shape.

**After** — one block per signature, each naming only its own parameters. See
[Overloaded class method](#overloaded-class-method).
