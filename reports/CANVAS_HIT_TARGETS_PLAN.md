# Virtual hit targets: implementation plan

Companion to [CANVAS_HIT_TARGETS.md](./CANVAS_HIT_TARGETS.md), which covers the rationale and the
alternatives that were rejected. This is the build order.

**Status: implemented.** Items 1–7 are in; item 8's tests live in
`src/eventHandling/gradumEventManager/_tests/dispatch.hitTargets.spec.ts`. Full suite 836 passing.
The one thing the plan got wrong is recorded in item 4: `window` is not a `Node`, so splitting the parent
chain on `instanceof Node` does not by itself keep it out of the climb.

## Decisions locked in

| Question | Decision |
|---|---|
| How a container opts in | `gradum(el).hitResolver = (position, event) => object[]`, topmost first |
| Where hits enter dispatch | Path expansion before both passes; the loops themselves don't change |
| Ordering | Hits sit at lower indices than their container, so capture descends into them last and bubble reaches them first |
| Parent lookup | `parentElement` → `parentNode` → `parent` → `gradum(obj).hitParent` (WeakRef) |
| Default parent | The container whose resolver produced the hit, assigned only when the object has none |
| Containment tests | Use `getBoundingClientRect()` when the object has one, otherwise assume inside |
| Drag | Hits resolved once at drag origin and reused, parallel to `lastTargetOrigin` |
| Move | Re-resolved every event, matching the existing z-stack behaviour |
| Where `closest()` starts | `e.hitTarget` — the topmost hit, or `e.target` when there wasn't one |

The last two are the same distinction the code already draws for DOM elements: a drag goes to its origin
(`getFireOrigin`, `pointerOperator.ts:261`), a move goes to the z-stack under the cursor
(`dispatchOperator.ts:66`). Hover wants what's under the pointer now; dragging wants what you grabbed.

## Why containment needs no rect

`closest()` skips anything failing `isPositionInsideElement` and `strict` defaults to `true`, so this looked
like it would force a rect API onto every virtual object. It doesn't: a hit is by definition something a
resolver returned *for that position*, so containment is already proven. Honour a `getBoundingClientRect()`
when the object provides one — useful for `strict` being passed an explicit different element — and treat
its absence as "contained" rather than "excluded".

## Work items

Each is independently shippable and independently testable. 1–3 are the feature; the rest close gaps.

### 1. `hitResolver` and `hitParent` selector properties

**Where:** `src/gradumFunctions/event/event.ts`, next to `bypassManagerOn` (line 44), which is the existing
precedent for opt-in behaviour attached through the selector's data map rather than a class.

```
type HitResolver = (position: Point, event: Event) => object[]

hitResolver   plain function, held in utils.data(this)
hitParent     held as a WeakRef so a scene object can't keep its canvas alive
                get → utils.data(this).hitParent?.deref()
                set → utils.data(this).hitParent = v ? new WeakRef(v) : undefined
```

**Also:** widen `event.utils.ts:30` from `WeakMap<Node, ObjectListeners>` to `WeakMap<object, …>`, and
`getBoundListenersSet(element: Node)` to `object`. Runtime already tolerates non-Nodes; only the types object.

### 2. `expandPath` + relaxed Node guard in the dispatch operator

**Where:** `dispatchOperator.ts:75-93`. This is the only place a resolver is ever called.

```ts
const {path, virtual} = this.expandPath(e.composedPath?.() || [], e);
// both loops: if (!(entry instanceof Node) && !virtual.has(entry)) continue;
```

As it splices each container's hits in, it assigns `gradum(hit).hitParent = container` **when the hit has
none**, so a flat scene needs no bookkeeping and an explicit parent always wins. It also records what it
worked out on the event — `e.dispatchPath`, `e.hits`, `e.hitTarget` (item 6) — since it is the only thing
that knows them.

`expandPath` returns its input array by reference when no resolver contributed. **Test that first** — it is
the guarantee that this feature costs non-users nothing.

**No cache.** An earlier draft proposed memoising hits per event; it solved nothing. `getToolHandlingCallback`
runs once per event, so resolvers already run once per container; the move branch `return`s before the path
loops so the two never both run; constrainer and `closest()` walks go *upward* and resolve nothing; and
`closest()` already carries `@cache()` (`gradumEvent.ts:130`) on a per-event instance. The durable artifact
is `hitParent`, not a hit list — once assigned it keeps working after dispatch ends.

### 3. Move branch expansion

**Where:** `dispatchOperator.ts:64-73`. Expand each element of the `elementsFromPoint` stack the same way.
Without this a scene object receives clicks but never drags, which is the main use case.

### 4. `gradum(el).getParent()`

One step up the tree, for anything — Node or virtual object. It exists because the two places that climb
today each hardcode a *different* single property: `checkConstrainers` uses `parentNode` (`event.ts:182`),
`closest()` uses `parentElement` (`gradumEvent.ts:153`). Both become this.

Note it is not "get the `hitParent`". `hitParent` is only the last resort, for objects with no DOM parentage.

```ts
function parentOf(node: any): object | undefined {
    if (node instanceof Window) return undefined;                       // see below
    if (node instanceof Node) return node.parentElement ?? node.parentNode ?? peek(node)?.hitParent?.deref();
    return node.parent ?? peek(node)?.hitParent?.deref();
}
```

**Trap:** `window` sits in every composed path, is **not** a `Node`, and its `.parent` is the parent
*window* — itself, at top level. So an `instanceof Node` split is not enough on its own: `window` falls into
the second branch and the climb never terminates. It needs its own guard, which costs nothing since nothing
sits above it in a dispatch anyway.

Reads go through a non-creating `peek` rather than `data`, because climbing a chain touches every ancestor
and `data` would allocate a listener set for each one.

Exposed on the selector as `gradum(el).getParent()` rather than by exporting the utils instance, so callers
outside the event module — `closest()` is the only one — reach it through the same front door as everything
else.

### 5. Containment accepts objects

**Where:** `gradumEvent.ts:169`.

```ts
if (typeof element.getBoundingClientRect !== "function") return true;
```

### 6. `closest()` over the expanded stack

**Where:** `gradumEvent.ts:136`.

Upward walking is free once `hitParent` is set, but `closest()` doesn't *start* from a virtual object: it
starts from `this.target` (the DOM container) or, for `ClosestOrigin.position`, from `elementsFromPoint`.

**Put the answer on the event.** `expandPath` already knows every hit it spliced in, so it hands them to the
event rather than making anything ask again:

```
GradumEvent:
    target        → topmost Element                      (exists today, getter over Event.target)
    dispatchPath  → what the manager actually walked:    (new; === composedPath() when nothing resolved)
                    composedPath() with hits spliced in
    hits          → every virtual object, topmost first  (new; empty when nothing resolved)
    hitTarget     → hits[0] ?? target                    (new; the most specific thing actually hit)
```

`dispatchPath` is the list the two passes ran over, deepest first, so a handler can see its own ancestry
within the dispatch — including the container it was painted in — without re-deriving anything. For move
events, where there is no composed path, it holds the expanded z-stack instead: same meaning, "what this
event was dispatched over".

Two notes on shape:

- **Don't override `composedPath()`.** It is native, typed `EventTarget[]`, and `expandPath` consumes it —
  overriding it would feed the expansion its own output on any second call, and hands non-`EventTarget`
  entries to anything else that calls it. A separate property keeps both meanings intact. Avoid the name
  `path` too; it is a legacy Chrome alias for `composedPath()`.
- **Store `hits` rather than deriving it** from `dispatchPath`. The obvious filter — "not a `Node`" — is
  wrong, because `window` sits in every composed path and is not a `Node` either. `expandPath` knows exactly
  which entries it added, so it should say so rather than have readers infer it.

`hitTarget` defaulting to `target` is what makes it worth having: one accessor that always names the thing
the user interacted with, whether that turned out to be an element or something painted inside one. Callers
that need the distinction can test `hitTarget !== target`, or `hitTarget instanceof Node`.

Both branches of `closest()` then work off it, with no resolution of any kind:

```ts
const elements = from === ClosestOrigin.target
    ? [this.hitTarget]
    : [...this.hits, ...document.elementsFromPoint(this.position.x, this.position.y)];
```

The position branch needs no second hit test: there is only one position per event, and `expandPath` already
resolved at exactly it. Prepending is enough — each hit's climb reaches its own container through `parentOf`
anyway, so the DOM entries behind it stay reachable; order only decides which of several matches wins, and
topmost-first is the right priority.

`closest(MySceneObject)` therefore matches at depth 0, and `closest(Canvas)` climbs out of the scene into the
DOM. The string branch still can't match a virtual object — `element.closest(selector)` needs a real element
— so it skips hits and falls through to the DOM element behind them.

**One divergence worth knowing.** During a drag, `hits` are the objects grabbed at the origin (item 7), while
`elementsFromPoint(this.position)` is whatever is under the cursor *now*. That is the same split the DOM
already has, where `e.target` during a drag stays the element you pressed on — so `hitTarget` means "what you
grabbed" and the position stack means "what you're over". Deliberate, not an inconsistency.

### 7. Drag stickiness

**Where:** `gradumEventManager.model.ts:70` and `pointerOperator.ts:99, 263`.

```
GradumEventManagerModel:
    lastTargetOrigin: Node         // exists today
    lastOriginHits:   object[]     // new — set beside line 263, cleared beside line 99
```

`lastTargetOrigin` must stay a `Node` — `getFireOrigin()` feeds it to the native `target.dispatchEvent(...)`
at `dispatchOperator.ts:54`. The hits ride alongside it on the same lifecycle: resolved when the origin is
resolved, cleared when the action stops being a drag. `expandPath` prefers `lastOriginHits` for that
container while a drag is live.

### 8. Tests

- **Identity:** no resolvers anywhere ⇒ expanded path is the same array reference, `e.dispatchPath` equals
  `composedPath()`, `e.hits` is empty, and `e.hitTarget === e.target`.
- **Order:** one resolver returning two hits ⇒ capture sees `container, hitB, hitA`; bubble sees
  `hitA, hitB, container`.
- **Consumption:** a hit returning `stopPropagation` ⇒ the container never handles the event.
- **Behaviours:** a tool `@behavior` fires with the virtual object as its `target` argument (bubble only —
  see `event.ts:209`).
- **Parent:** a constrainer on the container fires for a hit on one of its objects.
- **`closest`:** `closest(SceneObjectClass)` returns the hit; `closest(CanvasClass)` climbs to the canvas.
- **Drag:** grab an object, move the pointer off it, the same object keeps receiving drag events.
- **Move:** hovering across two objects reports each in turn.

## Known limitations to document, not fix

- **`e.target` stays the container.** Behaviours receive the virtual object as their `target` argument;
  anything reading `e.target` directly sees the canvas. A dispatched DOM event's `target` cannot be faked.
- **Per-event-type opt-in doesn't exist.** A resolver only interested in clicks still runs on every move.
  Add a type filter to the resolver registration if profiling justifies it.
- **Resolver cost is the author's problem.** Broad-phase before exact tests; the dispatcher can't help.
- **`gradum()` unwraps objects carrying an `element` field.** Right for an MVC piece — `gradum(view)` should
  give you the view's element — but it would bind a scene object's parentage to whatever it keeps under that
  name. Narrowing the unwrap to MVC classes was considered and rejected: it is a breaking change to the
  library's front door, gating on `instanceof GradumView | GradumOperator` puts a cycle at the bottom of the
  stack, and tightening the duck-type to `element instanceof Node` would break proxied elements, whose
  `element` is deliberately a wrapper object rather than a node. Instead the hit path passes `raw: true`,
  which `gradum` already supports, so a resolver can return objects of any shape.

## Unrelated bug found while surveying

`firedListeners` is a local set inside a single `executeAction` call, and capture and bubble are separate
calls on the same element. A listener registered with `capture: true` therefore matches in both passes and
fires twice on its own element. Pre-existing and independent of this work, but worth deciding on before
adding more passes over the path.
