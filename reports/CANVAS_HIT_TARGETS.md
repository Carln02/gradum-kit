# Virtual hit targets: letting an opaque element contribute objects to the dispatch loop

**Status:** design report — rationale and rejected alternatives. Nothing implemented.
The build order, with the open questions below now resolved, is in
[CANVAS_HIT_TARGETS_PLAN.md](./CANVAS_HIT_TARGETS_PLAN.md).

## The problem

An HTML canvas is a single DOM node. Everything drawn inside it is pixels, so `composedPath()` and
`elementsFromPoint()` both stop at the canvas. A scene object under the pointer cannot receive a
`gradum-click`, cannot carry a `@listener`, cannot be a tool target, and cannot trigger a constrainer —
even though, to the user, it is the thing they clicked.

The goal is a way for such a container to say *"the pointer is at (x, y); these are the objects it hit"*,
and have those objects take part in the normal capture/bubble dispatch as if they were real children —
without rewriting the dispatcher or making every other element pay for the feature.

## What dispatch does today

`GradumEventManagerDispatchOperator.getToolHandlingCallback` (`dispatchOperator.ts:57`) is the whole of it:

```ts
const path = e.composedPath?.() || [];

for (let i = path.length - 1; i >= 0; i--) {           // capture: window → target
    if (!(path[i] instanceof Node)) continue;
    const propagate = gradum(path[i]).executeAction(type, toolName, e, {capture: true}, this.element);
    if (propagate !== Propagation.propagate) { e.stopPropagation(); break; }
}

for (let i = 0; i < path.length; i++) {                // bubble: target → window
    if (!(path[i] instanceof Node)) continue;
    const propagate = gradum(path[i]).executeAction(type, toolName, e, undefined, this.element);
    if (propagate !== Propagation.propagate) { e.stopPropagation(); break; }
}
```

Three properties matter for what follows:

1. **`composedPath()` is target-first.** `[target, parent, …, document, window]`. The capture loop walks it
   backwards, the bubble loop forwards. Both passes read the *same array*.
2. **The loop is the only thing that knows the target list.** `executeAction` is called per node and knows
   nothing about its neighbours. Whatever is in the array gets dispatched to.
3. **Move events don't use the path at all.** `dispatchOperator.ts:64-73` special-cases them onto the
   `elementsFromPoint` z-stack, single pass, topmost first, no capture phase.

A fourth property is worth stating because the code says the opposite of the comment above it. The class
docstring at `dispatchOperator.ts:16` claims the capture pass runs tool `@behavior` methods and the bubble
pass runs listeners. It doesn't. Both passes call the same `executeAction`, and inside it:

```ts
const applyTool = (target, tool) => {
    if (options.capture || !tool) return;      // event.ts:209
```

So **`@behavior` methods only run on the bubble pass**; capture runs `runListeners` alone. That matters
here: a virtual target's tool behaviours will fire innermost-first on the way up, which is the order you
want anyway — but it means the capture pass is not where the interesting work happens, and any design that
tried to resolve hits "during capture" would be resolving them for the less important of the two passes.
(The docstring should be corrected either way.)

## The shape of the fix: expand the path, don't touch the loop

The whole feature reduces to one idea:

> Before the two passes run, replace the flat path with an expanded one in which any element that declares a
> hit resolver is preceded by the objects it reports at the pointer.

```
composedPath():   [ canvas, section, body, html, document, window ]
expanded:         [ objA, objB, canvas, section, body, html, document, window ]
                    ▲     ▲
                    │     └── second-topmost hit
                    └──────── topmost hit
```

Because hits sit at *lower* indices than their container, both existing loops get the correct order for free:

- **capture** (`i--`): `window → … → section → canvas → objB → objA` — outermost to innermost ✓
- **bubble** (`i++`): `objA → objB → canvas → section → …` — innermost to outermost ✓

And `stopPropagation` already behaves the way you would want: an object that consumes the event breaks the
loop before the canvas is reached, so the canvas does not also handle it.

No change to `executeAction`, no change to the propagation rules, no change to tool resolution. The dispatch
operator gains one line per pass and a helper.

### Non-invasiveness

`expandPath` returns its input array unchanged when no element in the path declares a resolver. That is the
property worth writing a test around: with no resolvers registered anywhere, the expanded path is
reference-identical to `composedPath()`, so dispatch is byte-for-byte what it is today. The cost for
everyone not using the feature is one `utils.data(el).hitResolver` lookup per path node.

## Declaring a resolver

The codebase already has a precedent for "opt-in behaviour attached to an element without touching its
class": `bypassManagerOn` (`event.ts:44`), a predicate stored in the selector's data `WeakMap` and read by
the dispatcher. This should look the same:

```ts
/** Topmost first. Return [] for a miss. */
type HitResolver = (position: Point, event: Event) => object[];

Object.defineProperty(GradumSelector.prototype, "hitResolver", {
    get() { return utils.data(this)["hitResolver"]; },
    set(value: HitResolver) { utils.data(this)["hitResolver"] = value; },
    configurable: true, enumerable: true,
});
```

Usage stays out of the element's own API:

```ts
gradum(canvas).hitResolver = position => scene.objectsAt(position);   // topmost first
```

I would *not* make this a duck-typed `resolveHits()` method on the element. A method is implicit — you
cannot tell from a call site whether an element participates — and it forces the feature into the class
hierarchy of anything that wants it. A selector property is greppable, removable at runtime, and works on
elements you do not own.

The **topmost-first** contract is the resolver's responsibility. The dispatcher cannot sort scene objects; it
has no idea what z-order means inside someone else's canvas.

## The three call sites

Point resolution is scattered wider than you might expect, and only the first of these is the dispatch loop:

| Site | What it does | Needs expansion? |
|---|---|---|
| `dispatchOperator.ts:75` | `composedPath()` for the two passes | **Yes** — the main one |
| `dispatchOperator.ts:66` | `elementsFromPoint` z-stack for move events | **Yes** — else drags behave unlike clicks |
| `gradumEvent.ts:137` | `closest(…, ClosestOrigin.position)` | Later; see limitations |
| `pointerOperator.ts:57,236,263` | picks the DOM node to dispatch *on*, sets pointer capture | No — the canvas is the right DOM node |
| `wheelOperator.ts:42` | picks the wheel target | Optional, same treatment as move |

The move branch is the one that is easy to forget. It has no capture pass and iterates the z-stack directly,
so it needs its own expansion — otherwise a scene object would receive clicks but never drags, which is
exactly the case the feature exists for.

Sketch:

```ts
private expandPath(path: EventTarget[], e: Event): object[] {
    let out: object[] | undefined;                 // stays undefined when nothing resolves
    for (let i = 0; i < path.length; i++) {
        const resolver = path[i] instanceof Node ? utils.data(path[i])?.hitResolver : undefined;
        const hits = resolver ? this.resolveCached(path[i], resolver, e) : undefined;
        if (!hits?.length) { out?.push(path[i]); continue; }
        out ??= path.slice(0, i);
        out.push(...hits, path[i]);                // hits first: deeper than their container
    }
    return out ?? path;                            // identity when no resolver contributed
}
```

## Virtual targets do not have to be Nodes

This is the part worth checking early, because it decides how much else has to change. Walking
`executeAction` (`event.ts:121`) with a plain object as the target:

- `utils.getBoundListenersSet(target)` → `this.data(target)` — a `WeakMap` keyed by object. **Works.**
- `gradum(target)` — the selector wraps any object. **Works.**
- `gradum(target).isToolIgnored(…)`, `applyTool(…)` — `WeakMap`-keyed. **Works.**
- `checkConstrainers(target.parentNode, tool)` — `undefined` on a plain object, so the recursion just
  stops. **Degrades quietly** (see below).
- `originIgnoresTool` — walks up from `event.target`, always a real Node. **Unaffected.**

So the only hard blocker is the `if (!(path[i] instanceof Node)) continue;` guard in both loops, which
exists to skip `Window`. It needs to become "skip things that are neither a Node nor a contributed hit" —
easiest by having `expandPath` return a parallel `Set` of contributed objects, or by tagging them.

Letting hits be arbitrary objects is worth the small extra care: it means a scene object can be a plain
class instance with no DOM cost, which is the entire reason the canvas is a canvas.

## Consequences to decide on

**Constrainers stop at the object.** `checkConstrainers` climbs `parentNode`, which a virtual object does not
have, so a constrainer on the canvas will not fire for a hit on one of its objects. Given the physics demo
puts its constrainers on the container, this probably matters. Cheapest fix: let the resolver return
`{object, parent}` pairs, or read an optional `gradum(obj).hitParent` in the climb.

**`e.target` is still the canvas.** Behaviours receive the virtual object as their `target` *argument*, which
is the right channel, but anything reading `e.target` directly sees the canvas. Worth stating in the docs
rather than trying to fake it — rewriting `target` on a dispatched DOM event is not possible.

**`closest()` cannot see virtual objects.** `GradumEvent.closest` matches with `instanceof` against
`elementsFromPoint` results. Virtual objects are not in that list and have no ancestor chain. Either leave it
(documented) or give `closest` an expanded-stack mode later.

**Drag stickiness is the real design question.** `pointerOperator` captures the pointer on the *DOM* element
and tracks the drag origin as a Node (`pointerOperator.ts:263`). Nothing remembers *which virtual object* was
grabbed. If the resolver is re-run on every move, dragging an object fast enough to get the pointer off it
hands the drag to whatever is underneath. Options, in increasing order of effort:

1. Resolver's problem — it receives the event and can return the grabbed object while a drag is live.
2. The manager caches the hit set from `pointerdown` and reuses it for the rest of that pointer's drag.
3. A real `gradum(obj).captureHits()` mechanism mirroring `setPointerCapture`.

(1) costs nothing and is enough for a first version, but it pushes a subtle correctness burden onto every
resolver author. I would ship (1), then move to (2) once there is a second consumer.

**Cost.** Resolution runs once per event per participating container, which is already the minimum, but a
hit test over a large scene on every `pointermove` will show up. Memoise per event in a
`WeakMap<Event, Map<object, object[]>>` so the move branch and any future `closest()` support share one
resolution. Beyond that it is the resolver's job to be fast (broad-phase bounding boxes before exact tests) —
the dispatcher should not pretend to help.

## Alternatives considered

**Invisible proxy DOM elements per scene object.** Position a zero-opacity `<div>` over each object and let
the existing machinery work unchanged. Zero dispatcher changes, and `closest()`/constrainers/`e.target` all
work properly. Rejected because it scales with object count in exactly the dimension canvas rendering exists
to avoid — thousands of objects means thousands of nodes to create, position, and keep in sync every frame.
Worth keeping in mind for scenes of a few dozen objects, where it is genuinely the better trade.

**Let the canvas re-dispatch to its objects from its own `@behavior`.** Superficially the most
"non-invasive" option — no library change at all. Rejected: the canvas would have to reimplement the capture
pass, the bubble pass, tool-name resolution, `ignoreTool` handling, constrainer checks, and propagation
merging, all of which `executeAction` already does. It would also run *after* the canvas's own handlers
rather than before them, inverting the ordering the feature needs.

**Resolve lazily, mid-capture, when the walk reaches the canvas.** Closer to "during the capture phase" as
originally framed, but it means mutating the array being iterated, and the bubble pass then has to
reconstruct the same expansion or risk an object getting a capture pass with no matching bubble pass.
Eager expansion before both passes gives the same result with one list and no ordering hazard.

## Suggested staging

1. `hitResolver` selector property + `expandPath` + relaxed Node guard, applied to the main path only.
   Test: no resolvers → path identity; one resolver → correct interleaved capture/bubble order; a hit that
   consumes stops the container from handling.
2. Same expansion in the move branch. Test: a drag over a scene object reaches it.
3. Decide constrainer parenting (`hitParent` or `{object, parent}` descriptors).
4. Drag stickiness, if a real consumer needs it.
5. Optionally teach `closest()` about expanded stacks.

Steps 1 and 2 are the feature; 3–5 are the sharp edges, and each is independently shippable.

## Open questions

- Should a resolver be able to *replace* its container in the path (object hit ⇒ canvas never sees the
  event), or only precede it? Preceding is the DOM-like default and `stopPropagation` already gives authors
  the other behaviour; replacing would be a second mode.
- Should hits participate in the capture pass at all? Behaviours don't run there (`event.ts:209`), so the
  only thing capture buys a virtual target is a chance for an *ancestor's* listener to pre-empt it. Including
  them costs one extra `executeAction` per hit and keeps the model consistent with real nodes; excluding
  them halves the per-hit cost. I lean towards including, and revisiting if profiling says otherwise.
- Per-event-type opt-in? A resolver that only wants clicks currently pays on every `pointermove`.
