

# Feasibility report: a `render()` function for `GradumView`

> **Status:** proposal, nothing implemented.
> **Question:** can `GradumView` gain a Lit-style `render()` where the returned tree is built with the
> existing element builders, and reading a `@signal` inside it makes the DOM update automatically?
>
> **Short answer:** yes, but not with the syntax first imagined. The version that reads most naturally is
> the one with the worst runtime characteristics. A five-character change to the proposed syntax buys
> fine-grained updates with no DOM churn.

The desired shape:

```ts
class CardView extends GradumView {
    protected render() {
        return div({classes: "card", text: this.title, children: [
            div({classes: "body"}), p({text: "..."})
        ]});
    }
}
```

where `this.title` is a `@signal`, so changing it updates that `div`'s text.

---

## 1. The core obstacle

JavaScript evaluates `this.title` **before** `div` is called. The builder receives the string
`"My Title"` — not a reference, not a getter, nothing identifying it as having come from a signal. The
reactive link is gone before any library code runs.

This is not a limitation of Gradum Kit; it is how argument evaluation works. Every framework works around
it by never letting the value collapse:

| Framework | Mechanism |
|---|---|
| Lit | Tagged templates — the template is static, only interpolations re-evaluate |
| Solid | Compiles JSX so `{title()}` stays a thunk |
| React / Vue | Re-run the whole render, diff the result |

Gradum Kit has no build step, so the first two are unavailable in that form.

> **Consequence:** the literal syntax `text: this.title` can only work by re-running `render()` in full.
> Everything else in this document follows from that.

---

## 2. What already exists

More of the groundwork is in place than expected.

**`effect(fn)` is exactly the needed primitive.** It runs immediately, tracks every signal read during the
run, re-runs on change, and returns a disposer — `src/decorators/reactivity/reactivity.ts:390-394`:

```ts
const eff = effectUtils.makeEffect(value);
eff.run();
return () => eff.dispose();
```

**Dependency capture is automatic** — any signal read while an effect is running registers itself
(`src/decorators/reactivity/reactivity.utils.ts:74`):

```ts
if (this.activeEffect) this.activeEffect.dependencies.add(entry);
```

**There is precedent for storing a disposer per object.** `StatefulReifect` already does this
(`src/gradumComponents/wrappers/statefulReifect/statefulReifect.ts:773`):

```ts
data.disposeEffect = effect(() => this.resolveProperties(object));
```

**`GradumObserver` already solves keyed list reconciliation** — create on add, update in place, remove on
delete. That is the genuinely hard half of a diffing renderer, already built and tested for model-backed
collections.

**`untrack`** exists for opting out of dependency capture.

### What is missing

`destroy()` (`src/gradumFunctions/element/element.ts:298`) removes listeners and the node, but **disposes
no effects**:

```ts
GradumSelector.prototype.destroy = function _destroy(this: GradumSelector): GradumSelector {
    this.removeAllListeners();
    this.remove();
    if (this.element && "destroy" in this.element && typeof this.element.destroy === "function")
        this.element.destroy();
    return this;
}
```

`GradumView` likewise has `initialize()` (`src/mvc/view/view.ts:62`) but no matching teardown. This gap is
the single most important thing to fix, and it matters whether or not `render()` ever ships.

### How properties are applied today

`element()` delegates straight to `setProperties` (`src/elementCreation/element.ts:57`), which applies
everything eagerly, exactly once (`src/gradumFunctions/element/element.ts:88`, `:114`):

```ts
switch (property) {
    case "text":
        if (element instanceof HTMLElement) element.innerText = value;
        break;
    // ...
    case "children":
        gradum(element).addChild(value);
        break;
}
```

There is no re-application path and no place a binding could currently live.

---

## 3. Three strategies

### A — Re-render and replace the subtree

```ts
this.disposeRender = effect(() => {
    const next = this.render();
    if (this.root) gradum(this.root).destroy();
    this.root = next;
    gradum(this).addChild(next);
});
```

**Effort:** ~30 lines. Works with the originally proposed syntax, because running `render()` inside
`effect()` tracks every signal it touches.

**Why it fails as a general mechanism:** the builders create *real DOM immediately*, so each re-render
constructs an entire second tree and discards the first. On any signal change you lose focus, scroll
position, text selection, uncommitted input values, animation state, and every child component's internal
state. Acceptable for a static leaf view; unusable for anything interactive.

**Verdict:** useful as a throwaway proof of concept. Architectural dead end.

### B — Virtual DOM with diffing

Worse here than in most libraries, precisely because the builders return real elements. Re-running
`render()` produces a fully constructed real DOM tree, which then has to be diffed against the live one —
paying full construction cost *before* the diff.

Doing it properly means `element()` and every builder returning descriptors instead of nodes. That is a
breaking change to the most-used API in the library, touching all of `../src` and every demo.

**Verdict:** large effort, high risk, and it changes what Gradum Kit is. Not recommended.

### C — Lazy bindings ← recommended

```ts
div({classes: "card", text: () => this.title, children: [icon(), label()]})
```

In `setProperties`, for an explicit whitelist of bindable properties, a function value becomes a binding:

```ts
if (BINDABLE.has(property) && typeof value === "function")
    register(element, effect(() => applyProperty(element, property, value())));
```

Only `innerText` updates when `title` changes. No diffing, no DOM churn, no lost state. This is Solid's
model without the compiler — you write by hand the thunk the compiler would have generated.

**Two wrinkles, both tractable:**

1. `onClick` and `listeners` already take functions, so bindability must be an explicit whitelist
   (`text`, `id`, `classes`, `style`, attributes) rather than "any function value".
2. Setting a property genuinely *to* a function needs an escape hatch — `() => fn`.

**Variant:** `setProperties` could also accept a `SignalBox` directly, detectable via its `sub`/`get`
members. But obtaining one from `@signal public title` requires `getSignal(this, "title")`, which reads
worse than `() => this.title`. Worth supporting as a secondary path, not the primary one.

---

## 4. Alternative authoring syntaxes: JSX and tagged templates

The three strategies above all keep the current builder syntax. Two other authoring styles are worth
evaluating, because they are the obvious next question — and they land in very different places. One does
not help at all; the other genuinely changes the economics.

### JSX does not solve the problem

JSX is syntax for function calls. This:

```tsx
<div text={this.title}/>
```

compiles to `h("div", {text: this.title})` — and `this.title` is still evaluated **at the call site,
before `h` runs**. Section 1 applies unchanged. Angle brackets do not introduce laziness.

Solid's fine-grained JSX works only because it ships a **custom compiler**
(`babel-plugin-jsx-dom-expressions`) that recognises dynamic expressions and rewrites them into thunks
wrapped in effects. That is not JSX doing the work — it is a bespoke transform, with every edge case owned
by whoever maintains it.

There is also a distribution problem specific to this library. Gradum Kit currently ships an IIFE build
(`../build/gradum-kit.js`) that the demos load with a plain `<script src>`. JSX requires a compile step for
**consumers**, splitting the audience into "has a bundler" and "does not".

> **Cheap win, orthogonal to reactivity:** JSX → existing builders is roughly 30 lines and needs no new
> tooling — `h(tag, props, ...children)` mapping to `element({tag, ...props, children})`, with
> `"jsx": "react"` and `"jsxFactory": "h"` in `../tsconfig.json` (neither is set today). That buys nicer
> authoring with current semantics and could ship independently of anything else here.

### Tagged templates do change the economics

```ts
html`<div class="card">${this.title}</div>`
```

The mechanism that matters is a language guarantee: **a tagged template's `strings` array is cached per
call site**. The same frozen array object is passed on every evaluation of that literal, which makes it a
free and perfectly reliable cache key.

1. **First evaluation** — parse the static parts into a `<template>` once, walk it to locate the holes,
   and record a *part* per hole (attribute / property / text / event / child-list).
2. **Every later evaluation** — same `strings` identity, so the parse is skipped entirely. Compare the new
   values against the previous ones and touch only the holes that changed.

The values are still eagerly evaluated, but that stops mattering: re-running `render()` now allocates a
values array rather than DOM. Which makes this viable:

```ts
effect(() => render(this.render(), this.container));
```

Signals read during `render()` are tracked; on change it re-runs (cheap) and the parts patch only what
moved. This is Lit's model, and it needs **no compiler and no build step for consumers**.

### HTML strings are strictly worse

Untagged HTML strings — the naive version of which already exists as
`textToElement` in `../src/utils/dataManipulation/element.ts` — lose on two counts. There is no
identity-stable cache key, so templates must be re-parsed or hashed; and values are interpolated into
markup as text, which means an injection risk and no way to bind event handlers or properties, only
attributes. Not recommended.

### Comparison

| Approach | Solves eager eval? | Consumer build step | Reuses the builders | Effort |
|---|---|---|---|---|
| Plain JSX | No | Yes | Yes | ~30 lines |
| JSX + custom compiler | Yes | Yes | No | Very high, ongoing |
| Tagged templates, hand-written | Effectively | No | No | 1500–3000 lines |
| Tagged templates via `lit-html` | Effectively | No | No | ~1 day |
| Strategy C (thunks) | Yes | No | Yes | 2–3 days |

If tagged-template ergonomics are the goal, **depend on `lit-html`** rather than write one. It is ~5KB,
its parts system is exactly this, and the bridge to signals is a handful of lines. Writing one from
scratch means reimplementing Lit — including keyed list reconciliation and a directive system — for the
same result.

The real cost of that route is not code size. It introduces a **second way to build DOM**. Gradum Kit's
identity is `gradum(el).…` plus the builders; lit templates do not compose with them, and a template
cannot easily hand back a selector-wrapped node mid-tree. That is a question about what the library is,
not an engineering one.

---

## 5. What actually bites

### Disposal is the real work

Every binding creates an effect holding a reference to a DOM node. With nothing disposing them, detached
subtrees leak effects indefinitely and stale effects keep writing to orphaned nodes.

Needed: effects registered against their element, torn down in `destroy()`, plus a teardown hook on
`GradumView`. **Build this first** — it is independently valuable and it is what makes everything else
safe.

### Lists and conditionals need structural primitives

Scalar bindings do not help with `children: this.items.map(...)`, which re-collapses eagerly. Two helpers
close the gap:

- `when(() => cond, () => tree)` — swap a subtree, disposing the old one
- `each(list, item => tree)` — keyed list

`each` should delegate to `GradumObserver` rather than reimplement reconciliation.

### Effect nesting is a live hazard, already documented

The `component-guide` skill states the rule plainly — *"never call another `@effect` method directly from
inside an `@effect`"* — because the inner method's signal reads get captured under the outer method's
tracking context, creating phantom dependencies.

A `render()` creating per-property effects while itself running inside a parent effect hits exactly this:
without `untrack` around the structural walk, the parent silently subscribes to every signal in the
subtree, and any one of them re-runs the whole render. This is the failure mode most likely to be
discovered late, because it produces correct output with wrong performance.

### Two paradigms would coexist

Imperative `@effect updateColor()` patching and declarative `render()` would both be valid. That needs a
documented rule for which to reach for, or the codebase drifts into using both arbitrarily.

---

## 6. Effort

Costed for the recommended route (Strategy C, builder syntax retained):

| Piece | Estimate |
|---|---|
| Effect registration + disposal in `destroy()` / view teardown | 1–2 days |
| Strategy C scalar bindings + tests | 2–3 days |
| `when()` / `each()` structural helpers | 2–4 days |
| Guide + JSDoc updates | 1 day |
| **Total** | **1–2 weeks** |

A Strategy-A proof of concept is about half a day, if it is worth feeling the ergonomics before
committing — with the caveat that it is a dead end.

The alternatives from section 4 cost differently: JSX → builders is ~30 lines but buys no reactivity;
`lit-html` plus a signal bridge is ~1 day but introduces a second DOM-construction idiom; a hand-written
template engine is weeks and reimplements Lit.

---

## 7. Recommendation

Build **Strategy C**, and **start with disposal**, which is a real gap regardless of whether `render()`
ever ships.

The one point worth pushing back on is the syntax. `text: this.title` is achievable *only* via full
re-render — the strategy with the worst characteristics. `text: () => this.title` costs five characters
and buys fine-grained updates with no DOM churn. That is the same trade Solid makes, just explicit at the
source level instead of hidden in a compiler.

On the alternatives in section 4: **JSX is not a reactivity answer**, only an authoring one, and it costs
consumers a build step — worth adding as a 30-line convenience if wanted, but it changes nothing here.
**Tagged templates are a real alternative**, and the honest comparison is not "templates versus Strategy C"
but "one DOM-construction idiom versus two". Strategy C keeps the library coherent around `gradum()` and
the builders; `lit-html` buys Lit-like authoring at the price of a parallel system that does not compose
with the selector. That is a product decision, not a technical one.

### Suggested order

1. Effect registration and disposal (`destroy()` + `GradumView` teardown)
2. Scalar lazy bindings in `setProperties`, behind the bindable whitelist
3. `when()` / `each()`, with `each` delegating to `GradumObserver`
4. `GradumView.render()` as a thin wrapper that mounts the returned tree once
5. Documentation: when to use `render()` versus `@effect`

Steps 1 and 2 are worth doing regardless of which authoring syntax wins — a `lit-html` route still ends in
an `effect(...)` that must be disposed, so step 1 is unconditional.
