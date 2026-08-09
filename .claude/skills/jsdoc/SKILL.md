---
name: jsdoc
description: Write, fix, or review JSDoc comments in this codebase, in the house format (tag order, @group/@category, usage-focused descriptions, @internal for inline exports). Use this whenever adding or changing a class, function, type, enum, decorator, accessor, or overload; whenever a doc block is missing, stale, or wrong; and whenever the user mentions JSDoc, doc comments, docstrings, TypeDoc, API docs, or says "document this". Also read it before writing any new exported symbol, so the block is right the first time instead of being rewritten later.
---

# JSDoc

Docs in this project are consumed by TypeDoc and by whoever is about to *use* the thing. Both audiences want the same information: what it is, what it does, what it's for. Neither wants a walkthrough of the implementation.

## The one rule that matters

**Describe the thing from the outside.** What it IS, what it DOES, what it's USED FOR.

Mention internals only when they change how someone calls it — a returned copy vs. a mutation, a cached value, an ordering constraint, a side effect on the DOM. If a detail wouldn't change what the caller writes, leave it out.

**Bad** (narrates the body):
```
@description Loops over the slots array, resolves each WeakRef, skips entries present
in ignoredMap, and pushes the rest into a Set before returning it.
```

**Good** (tells you what you get):
```
@description All entries in this list, without duplicates. Entries removed from the
DOM or from a nested list disappear from the result automatically.
```

**Bad**: `@description This function calls setAction() and then fires keyChanged().`
**Good**: `@description Set a value at the given key. Observers and signals are notified only if the value actually changed.`

The test: read only the doc block, then try to use the thing. If you can, the doc is done. If the doc is a summary of the code you could have read yourself, rewrite it.

## Tag order

Keep this order everywhere. It makes blocks scannable and diffs boring.

1. `@internal` (if applicable — see below)
2. `@overload` (standalone function overloads only)
3. `@decorator` (decorators only)
4. Kind + name: `@class Name` / `@function name` / `@type {Name}` / `@enum {Name}` / `@callback Name`
5. `@group`, `@category`
6. *(blank line)*
7. `@extends` / `@implements`
8. `@template`
9. `@description`
10. `@param` (functions) or `@property` (types)
11. `@returns`
12. *(blank line)* `@example`

Modifiers (`@protected`, `@private`, `@readonly`, `@static`, `@override`, `@inheritDoc`) go on their own line near the top of the block, right after the kind tag.

Not every tag applies to every symbol. Skip what doesn't fit rather than padding.

## Templates

### Function

````
/**
 * @function flattenKey
 * @group Components
 * @category GradumNestedMap
 *
 * @description Serialize a key path into a single flat key, so a nested entry can be
 * addressed with one value. Fully numeric paths produce a numeric index; anything else
 * produces a `"k0|k1|k2"` string.
 * @param {...KeyType[]} keys - The key path to serialize.
 * @returns {FlatKeyType} The flat key, or `undefined` if the path is invalid.
 */
````

- Every `@param` is typed, even in TypeScript. The braces are what TypeDoc renders.
- Optional params: `@param {AutoOptions} [options] - ...`. With a default: `@param {boolean} [deep=false] - ...`.
- Rest params: `@param {...KeyType[]} keys - ...`.
- Use `@returns`, not `@return`. Skip it when the function returns `void` or `this` for chaining — but if it returns `this`, say so: `@returns {this} Itself, allowing for method chaining.`
- Say what the return *means*, not just its type. `@returns {number}` alone is noise; `@returns {number} The index where the value was stored.` is not.

### Type

````
/**
 * @type {CacheOptions}
 * @group Decorators
 * @category Cache
 *
 * @template Type
 * @description Options for configuring the `@cache` decorator. Defines when a cached
 * value expires or is thrown away. Applies equally to cached methods, getters, and accessors.
 * @property {number} [timeout] - Time in milliseconds after which the cached value expires.
 * @property {string | string[]} [onEvent] - Event name(s) that clear the cache when fired
 * on the instance.
 * @property {boolean} [clearOnNextFrame=false] - If true, clears the cache on the next
 * animation frame. Useful when the value is only valid for the current render cycle.
 */
type CacheOptions = { ... };
````

- One `@property` per field, in the same order as the type body.
- Optional fields get brackets; document the default inline (`[x=true]`) *and* mention it in the text when the default is worth knowing.
- Function-valued properties get their full signature as the type: `@property {(value: Type) => Type} [preprocessValue] - ...`.

### Class

````
/**
 * @class GradumInteractor
 * @group MVC
 * @category Interactor
 *
 * @extends GradumOperator
 * @template {object} ElementType - The type of the main component.
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @description Holds the event listeners for a component. Attach one to set up listeners
 * on the element itself, or on a custom target.
 */
````

Members inside the class get their own short blocks — usually just `@description`, plus `@param`/`@returns` for methods. They inherit `@group`/`@category` from the class, so don't repeat those.

### Enum

````
/**
 * @enum {Propagation}
 * @group Types
 * @category Event
 *
 * @description Dictates how far an event travels after a listener handles it.
 * @property {Propagation.propagate} propagate - Continue normal propagation.
 * @property {Propagation.stopPropagation} stopPropagation - Stop propagation to parent targets.
 */
````

### Callback type

````
/**
 * @callback ListenerCallback
 * @group Components
 * @category Listener
 * @template {Node} Type - The type of the event target.
 *
 * @description Signature for listener callbacks. Receives the native event and the
 * resolved target.
 * @param {Event} e - The native event.
 * @param {Type} el - The node the listener is bound to.
 * @returns {Propagation | any} A propagation directive, or any value.
 */
````

### Fields, getters, setters

A field gets a one-line `@description`. A getter/setter pair gets **one** block, on the getter (or on the field for `accessor`), describing the value and what assigning to it does:

````
/**
 * @description The name (or path) of the icon, file extension included if you want to
 * override the icon's type. Assigning a new value reloads the icon.
 */
````

Read-only accessors take `@readonly`. Protected/private members that stay in the public `.d.ts` take `@protected` / `@private`.

## Overloads

**Each overload gets its own doc block.** Never one block covering several signatures — TypeDoc renders each signature separately, and callers pick a signature, not a function.

The implementation signature (the untyped catch-all in TS) gets no doc block at all.

For **standalone functions**, tag each block `@overload` and repeat `@group`/`@category`, since each is its own doc entry:

````
/**
 * @overload
 * @function signal
 * @group Decorators
 * @category Signal
 *
 * @template Value
 * @description Create a standalone reactive signal box.
 * @param {Value} [initial] - Initial value stored by the signal.
 * @returns {SignalBox<Value>} A reactive box for reading and updating the value.
 */
````

For **class members**, skip `@overload` and skip `@group`/`@category` (the class carries them). Just describe what each signature does differently:

````
/**
 * @description Create a point with coordinates (x, y).
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 */
constructor(x: number, y: number);
````

Each block must say what makes *that* signature different. If two blocks would read identically, the overloads probably shouldn't be separate.

## `@internal` for inline exports

The public API of this library is the curated barrel export at the bottom of a file (`export { Foo, Bar }`). Anything exported inline — `export class X`, `export function y`, `export type Z` — is not part of that curated surface, so it is **internal**.

Flag every inline export with `@internal` as the first tag. Internal symbols still get a `@description` (future-you needs it), but skip `@group`, `@category`, and `@example` — they never appear in the rendered docs, so those tags are dead weight.

````
/**
 * @internal
 * @class SimpleDelegate
 * @template {(...args: any[]) => any} CallbackType - The type of callbacks accepted.
 * @description A set of callbacks that can be maintained and fired together.
 */
export class SimpleDelegate<CallbackType> { ... }
````

If a symbol is genuinely public, move it out of the inline export into the barrel — then document it fully. Don't leave a public symbol inline and document it as if it were public.

## Links

Use `{@link Name}` to point at anything else documented in this project — types, classes, functions, methods. Do it whenever a description names another symbol:

```
@param {GradumObserverProperties} [properties] - Options and lifecycle callbacks. See
{@link GradumObserver} for what gets created.
```

`{@link Class.member}` works for members. For web standards, link to MDN with a normal markdown link:

```
@description Wraps a [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
so DOM insertions and removals fire {@link onChanged}.
```

Don't link the same symbol repeatedly in one block — first mention is enough.

## Examples

Add `@example` when the shape of a correct call isn't obvious from the signature: decorators, options-heavy functions, anything with a non-obvious call order or a "this is equivalent to" story. Skip it for `add(a, b)`.

Keep examples runnable and short. Fence them with ` ```ts `. Showing the desugared equivalent is a strong pattern for decorators:

````
 * @example
 * ```ts
 * @auto() public set color(value: string) {
 *    this.style.backgroundColor = value;
 * }
 * ```
 * Is equivalent to:
 * ```ts
 * private _color: string;
 * public get color(): string { return this._color; }
 * public set color(value: string) {
 *    this._color = value;
 *    this.style.backgroundColor = value;
 * }
 * ```
````

## Language

Write plainly. Short sentences, everyday words, one idea per sentence.

- "Removes the entry at the given key." — not "Facilitates the removal of the entry residing at the specified key."
- Use present tense, third person: "Returns", "Creates", "Holds".
- Don't restate the name. `@function clearCache` followed by "Clears the cache" is a wasted line — say *which* cache and *whose*: "Clear every cache entry created by `@cache` on an instance."
- Backtick code, values, and identifiers: `undefined`, `true`, `"click"`.
- No marketing ("powerful", "elegant", "seamlessly"). No filler ("simply", "just", "basically").
- Bullet lists are fine when a thing does several distinct things; keep each bullet to one line.
- Notes about gotchas go last, in italics: `*Note: place `@auto` closest to the property so it runs first.*`

## Before you finish

- [ ] Every description says what the thing is/does/is for — not what its body does.
- [ ] Tag order matches the list above.
- [ ] `@group` and `@category` present on every public top-level symbol, reusing an existing pair (see `references/groups-and-categories.md`).
- [ ] Every `@param` and `@property` is typed, optional ones bracketed, defaults noted.
- [ ] `@returns` says what the value means, not just its type.
- [ ] Every overload has its own block; the implementation signature has none.
- [ ] Every inline `export` is marked `@internal`.
- [ ] Other symbols named in the text are `{@link}`ed; web standards link to MDN.
- [ ] Examples only where they earn their place, and they compile.

## Reference files

- `groups-and-categories.md` — the `@group`/`@category` taxonomy already in use. Read it before picking either tag, so new docs land next to their neighbours instead of creating a one-entry group.
- `examples.md` — full worked blocks (class with members, enum, overloaded method, accessor pair, internal helper) and before/after rewrites. Read it when a template above doesn't cover the case in front of you.

