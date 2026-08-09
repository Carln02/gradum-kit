# Gradum Kit Component Guide

> Reference for writing new components or diagnosing broken ones. Covers the full
> Gradum Kit MVC stack: Model, View, Element, Operator, Handler, Interactor, Tool,
> Constrainer.
>
> **Naming:** this library was previously `TurboDOMBuilder`. Every `Turbo*` identifier is
> now `Gradum*`, and the selector `turbo()` is now `gradum()`. DOM-visible strings moved
> too: custom element tags are `gradum-*`, events are `gradum-click` / `gradum-drag-start`,
> and CSS classes are `.gradum-*`.
>
> Code examples are drawn from the VideoClipper project (`vc-*` elements: Card, Clip,
> Timeline, Renderer). Anything prefixed `Gradum` is library API; anything else is
> application code shown for illustration.

---

## 1. Architecture Overview

Every feature is split across up to seven class types:

| Class | Base | Knows About | Purpose |
|---|---|---|---|
| `MyElement` | `GradumElement` | view, model | The custom HTML element. Public API surface. |
| `MyView` | `GradumView` | element, model | DOM construction + reactive rendering. |
| `MyModel` | `GradumYModel` or `GradumModel` | data only | State, signals, Y.js sync. |
| `MyOperator` | `GradumOperator` | element, view, model | Cross-cutting logic attached to one element. |
| `MyHandler` | `GradumHandler` | model only | Pure model-level logic helpers. |
| `MyInteractor` | `GradumInteractor` | element, view, model | Tool-event listeners attached to one element. |
| `MyConstrainer` | `GradumConstrainer` | element, view, model | Declarative constraints solved over objects. |

`GradumModel` = local in-memory state. `GradumYModel` = state synced to Y.js (used for
anything that needs multi-client or cross-session persistence).

**Inheritance worth knowing:** `GradumOperator` is the base for three of these —
`GradumTool`, `GradumInteractor`, and `GradumConstrainer` all extend it. That is why they
share `.element` / `.view` / `.model` / `.emitter`, support `@effect`, and have the same
`setupUIListeners()` / `setupChangedCallbacks()` lifecycle.

```
GradumOperator
  ├─ GradumTool         (@behavior, capture phase, toolName)
  ├─ GradumInteractor   (@listener, bubble phase, toolName + target)
  └─ GradumConstrainer  (@solver / @checker / @mutator)
```

---

## 2. File Layout

```
components/
  myThing/
    myThing.ts            ← GradumElement (the custom element)
    myThing.model.ts      ← GradumModel or GradumYModel
    myThing.view.ts       ← GradumView
    myThing.operator.ts   ← GradumOperator    (optional)
    myThing.handler.ts    ← GradumHandler     (optional, model-only helpers)
    myThing.interactor.ts ← GradumInteractor  (optional, tool interactions)
    myThing.constrainer.ts← GradumConstrainer (optional, constraints)
    myThing.types.ts      ← Synced types (SyncedMyThing), enums
    myThing.css           ← styles
```

---

## 3. The Model

### 3a. GradumModel vs GradumYModel

Use **`GradumModel`** when state is purely local (no sync needed):

```typescript
// playback.model.ts
export class PlaybackModel extends GradumModel {
    public readonly aspectRatio = 1.33 as const;
}
```

Use **`GradumYModel`** when state must be persisted or synced via Y.js:

```typescript
// node.model.ts
export class NodeModel extends GradumYModel {
    @modelSignal() color: string;
    @modelSignal() position: Coordinate = {x: 0, y: 0};
    @signal centerAnchor: boolean = true;
}
```

**Creating models.** `GradumModel.create()` returns a `GradumModel`. `GradumYModel`
overrides `create()` so it reports its own type — Y-specific members
(`observeChanges`, `attachNestedObservers`, …) stay visible on the result:

```typescript
const model = GradumYModel.create({data: ymap, initialize: true});  // typed GradumYModel
```

> If you add your own `GradumModel` subclass and need `create()` to report that subclass,
> override it and narrow the return type — the base cannot derive it from the callee. See
> the note on `GradumModel.create` in `../../../src/mvc/model/model.ts` for why.

`create()` accepts `{data, id, initialize, makeSignals, enabledCallbacks, bubbleChanges}`.
`initialize: true` runs `initialize()` immediately; `makeSignals: true` generates signals
for every top-level key.

### 3b. Signal Decorators

**`@signal`** — plain reactive field. In-memory only. Not backed by Y.js. Use for
derived or UI-only state (e.g., `scale`, `currentTime`, `totalDuration`).

```typescript
@signal public totalDuration: number = 0;
@signal public orientation: Direction = Direction.horizontal;
```

Changing a `@signal` field notifies all `@effect` methods that read it.

---

**`@modelSignal(...keys)`** — reactive field backed by the model's data container. Reading
calls `this.get(...keys)`; writing calls `this.set(value, ...keys)`. On a `GradumYModel`
that resolves to the underlying Y.js structure. The key path defaults to the field name.
Use for any field that must be synced (title, color, mediaId, position, …).

```typescript
@modelSignal() public title: string;
@modelSignal() public color: string;
@modelSignal() public syncedClips: YArray<SyncedClip>;
```

Nested key path:
```typescript
// reads this.get("cardData", "title")
@modelSignal("cardData", "title") public cardTitle: string;
```

---

**`@nestedModelSignal(...keys)`** — the field holds a **`GradumModel`** instance wrapping a
nested structure (a `YMap` or `YArray` inside the parent data). Use when you need to
observe a nested collection.

```typescript
// project.model.ts
@nestedModelSignal() public cards: GradumYModel<YMap>;
@nestedModelSignal() public nodes: GradumYModel<YMap>;

// clipRenderer.model.ts
@nestedModelSignal() public text: GradumYModel<YArray, number>;
```

The difference in practice:
- `@modelSignal() public syncedClips: YArray<SyncedClip>` — gives you the raw YArray value
- `@nestedModelSignal() public cards: GradumYModel<YMap>` — gives you a model wrapper you
  can call `.generateObserver(...)` on

---

**`@isolatedModelSignal(...keys)`** — like `@nestedModelSignal`, but the nested model's data
is **not** stored inside the parent's data container. Use when the nested data already
lives elsewhere in the Y.js document. A Y.js type can only belong to one place in a
document, so inserting a foreign Y type into the parent would throw — this decorator
skips that insertion.

```typescript
@isolatedModelSignal() public sharedLibrary: GradumYModel<YMap>;
```

---

**Reactivity escape hatches** (all exported):

| Function | Use |
|---|---|
| `untrack(fn)` | Read signals without registering them as dependencies |
| `effect(fn)` | Create a standalone effect; returns a disposer |
| `disposeEffect(fn)` | Tear down an effect |
| `initializeEffects(obj)` | Start `@effect` methods on an object (done for you in views) |
| `signal(initial, target?, ...keys)` | Create a signal box imperatively |
| `getSignal` / `setSignal` | Read/write a signal box directly |
| `markDirty` / `markDirtyPath` | Force-invalidate a signal or key path |

### 3c. `@auto()` — Signal Preprocessing and Side Effects

`@auto()` enhances a signal or setter. Full option set:

| Option | Effect |
|---|---|
| `defaultValue` / `defaultValueCallback` | Value used when unset |
| `initialValue` / `initialValueCallback` | Value assigned at construction |
| `preprocessValue(value)` | Transform/clamp before storing |
| `callBefore(value)` | Side effect before storing |
| `callAfter(value)` | Side effect after storing |
| `override` | Replace the inherited accessor rather than wrapping it |
| `cancelIfUnchanged` | Skip the write when the value is identical |
| `setIfUndefined` | Only assign when currently undefined |
| `returnDefinedGetterValue` | Prefer an explicitly defined getter's value |
| `executeSetterBeforeStoring` | Run the setter body before the store, not after |

```typescript
// clamp scale between bounds
@signal @auto({
    defaultValue: 0.9,
    preprocessValue: function (value) {
        if (value > this.maxScale) return this.maxScale - 0.001;
        else if (value < this.minScale) return this.minScale + 0.001;
        return value;
    }
}) public scale: number;
```

```typescript
// save old value before updating
@signal @auto({callBefore: function () { this.previousMode = this.mode; }})
public set mode(v: CaptureMode) {}
```

```typescript
// override a signal setter to run side effects
@signal @auto({override: true}) public set currentIndex(value: number) {
    this.clipData = this.getClip()?.data as any;
}
```

On element setters, `@auto()` makes the setter reactive (the body runs as an effect that
re-executes if any signal it reads changes):

```typescript
// camera.ts
@auto() public set card(value: Card) {
    this.view.timeline.model.onCardAdded = () => value;
    this.view.timeline.card = value;
    this.view.metadataDrawer.card = value;
}
```

### 3d. Handlers on the Model

A `GradumHandler` contains pure model-level logic without DOM access. Declare it in the
model with `@handler()`:

```typescript
// clip.model.ts
@handler() public textHandler: ClipTextHandler;
```

```typescript
// clip.textHandler.ts
export class ClipTextHandler extends GradumHandler<ClipModel> {
    public addText(position: Coordinate) {
        addInYArray({text: "Text", ...}, this.model.content);
    }
}
```

The handler gets `this.model` automatically. Access it via `this.model.textHandler.addText(...)`.

> **Naming convention:** `@handler()` infers its key from the field name by stripping the
> role suffix — a field named `textHandler` resolves the handler registered under `"text"`.
> Pass an explicit name (`@handler("text")`) to override. The same rule applies to
> `@operator()`, `@interactor()`, `@tool()`, and `@constrainer()`.

### 3e. `setup()`, `initialize()` and `onDataChanged`

`setup()` runs in the constructor; `initialize()` runs after the model is fully wired.
Use `initialize()` to set metadata or register Y.js watchers:

```typescript
// clip.model.ts
public initialize() {
    super.initialize();
    this.meta.set("selectable", true);
    this.meta.set("modifiable", true);

    this.onDataChanged.add(() => {
        if (!this.data) return;
        deepObserveAny(this.data,
            () => this.fireCallback("reload_thumbnail"),
            "startTime", "endTime", "backgroundFill", "mediaId");
    });
}
```

`this.onDataChanged` fires whenever `this.data` is reassigned (i.e., when the model is
wired to new Y.js data). This is the right place to set up Y.js deep observers that
depend on `this.data`.

For project-level initialization of a fresh Y.js document:

```typescript
// project.model.ts
public setup() {
    super.setup();
    this.onDataChanged.add(() => {
        if (!(this.data instanceof YMap)) return;
        // Only initialize if completely blank — never overwrite existing keys
        const keys = ["cards", "nodes", "flows", "media", "counters"];
        if (keys.some(key => this.get(key) !== undefined)) return;
        for (const key of ["cards", "nodes", "flows", "media"]) this.set(new YMap(), key);
        this.set(createYMap({cards: 0, flows: 0}), "counters");
    });
}
```

---

## 4. The View

### 4a. Lifecycle Methods

`GradumView`'s constructor calls `setup()`. `initialize()` then calls the four setup
methods **in this exact order** (verified in `../../../src/mvc/view/view.ts`):

```
setup()                 ← constructor-time; runs BEFORE initialize()
  ↓ initialize()
setupUIElements()       ← create DOM elements / child components (no parent attachment)
setupUILayout()         ← gradum(this).addChild(...) / set childHandler
setupUIListeners()      ← gradum(el).on(), window.addEventListener, callbacks
setupChangedCallbacks() ← create GradumObservers, emitter.add(); starts @effect methods
```

Always call `super.*()`.

> **`super.setupChangedCallbacks()` is mandatory.** The base implementation calls
> `initializeEffects(this)` — that is what starts every `@effect` method on the view.
> Skip the super call and none of your effects will ever run.

The separation matters:
- Never attach to the DOM in `setupUIElements` — parent may not exist yet.
- Never create observers before child elements in `setupChangedCallbacks` — the observer
  callbacks reference DOM elements created in `setupUIElements`.
- Never reference signals in `setupUIElements` — signals aren't tracked until `@effect`.

**Operators have a shorter lifecycle** — only `setupUIListeners()` then
`setupChangedCallbacks()`. There is no `setupUIElements` / `setupUILayout` on an operator.

### 4b. `@effect` — Reactive Rendering

`@effect` methods re-run automatically whenever a signal they read changes. The method
body is tracked: every `@signal`, `@modelSignal`, `@nestedModelSignal`,
`@isolatedModelSignal` read inside it becomes a dependency.

```typescript
// node.view.ts
@effect private updatePosition() {
    gradum(this).setStyle("transform",
        `translate(${this.model.position.x}px, ${this.model.position.y}px)`);
}

@effect protected updateColor() {
    gradum(this).setStyle("backgroundColor", this.model.color);
}
```

**Critical rule**: never call another `@effect` method directly from inside an `@effect`.
Doing so causes the inner method's signal reads to be captured under the outer method's
tracking context — creating phantom dependencies that fire the wrong effects.

```typescript
// WRONG — updateOrientation will secretly subscribe to duration changes
@effect private updateOrientation() {
    gradum(this).toggleClass("vertical-clip", this.model.orientation === Direction.vertical);
    this.reloadSize(); // ← reloadSize is also @effect; its reads bleed into updateOrientation
}

// CORRECT — let each @effect subscribe to its own signals independently
@effect private updateOrientation() {
    gradum(this).toggleClass("vertical-clip", this.model.orientation === Direction.vertical);
    // reloadSize() already reads orientation, so it fires on its own
}
```

If you genuinely need to read a signal without subscribing to it, wrap the read in
`untrack(() => ...)` rather than restructuring the effect.

### 4c. GradumObserver — Reactive Collections

A `GradumObserver` watches a model collection and creates/destroys instances as items are
added, updated, or deleted. **Observers live in the view**, created in
`setupChangedCallbacks()`.

```typescript
// project.view.ts
protected setupChangedCallbacks() {
    super.setupChangedCallbacks();

    this.cardsObserver = this.model.cards.generateObserver({
        onAdded: (data) => Card.create({data, parent: this.cardsParent}),
        onDeleted: (data, instance, self, key) => {
            if (this.model.cardsData.has(key as string)) return;
            self.remove(key);
        }
    });

    this.nodesObserver = this.model.nodes.generateObserver({
        onAdded: (data) => Node.create({data, parent: this.cardsParent}),
    });
}
```

```typescript
// timeline.view.ts
protected setupChangedCallbacks() {
    this.clipsObserver = this.model.generateObserver({
        onAdded: (data, self, ...keys) =>
            this.element.onClipAdded(data, self, keys[0] as number, keys[1] as number),
    }, GradumModel.ALL);

    this.clipsObserver.onUpdated.add(() => this.element.onClipChanged());
    this.clipsObserver.onDeleted.add(() => this.element.onClipChanged());
    super.setupChangedCallbacks();
}
```

**Callback signatures** (note `self` sits in a *different position* in `onAdded` than in
the other two):

```typescript
onAdded  (data, self, ...keys)            => ComponentType | void
onUpdated(data, instance, self, ...keys)  => void
onDeleted(data, instance, self, ...keys)  => void
```

- `data` = the raw item, `self` = the observer, `...keys` = path to the item
  (e.g. `[cardIndex, clipIndex]` for depth-2)
- `instance` = whatever `onAdded` returned

**Full `generateObserver` properties:**

| Property | Purpose |
|---|---|
| `onAdded` / `onUpdated` / `onDeleted` | Item lifecycle callbacks |
| `onInitialize(self)` | Fired when the observer initializes |
| `onDestroy(self)` | Fired when the observer is destroyed |
| `initialize` | Initialize immediately on creation |
| `customConstructor` | Use a `GradumObserver` subclass |
| `replaceOnUpdate(prev, next, instance, self, ...keys)` | Return `true` to destroy and recreate the instance instead of updating it |

Each callback is also exposed as a `Delegate`, so you can subscribe after construction:
`observer.onAdded.add(fn)`, `observer.onUpdated.add(fn)`, `observer.onDeleted.add(fn)`,
`observer.onInitialize.add(fn)`, `observer.onDestroy.add(fn)`.

**Observer API.** `GradumObserver` extends `GradumNestedMap`, so instances are addressable
by key path:

| Member | Purpose |
|---|---|
| `get(...keys)` / `has(...keys)` | Lookup by key path |
| `getFlat(flatKey, depth?)` / `hasFlat(...)` / `setFlat(...)` | Lookup by flat index across nested paths |
| `values` / `keys` / `entries` / `paths` / `size` | Whole-collection accessors |
| `getValuesAt(...keys)` / `getKeysAt(...)` / `getEntriesAt(...)` / `getSizeAt(...)` | Scoped to a subtree |
| `getKey(value)` / `getKeys(value)` / `getFlatKey(value)` | Reverse lookup |
| `remove(...keys)` / `removeValue(v)` / `removeValues(v)` | Removal |
| `flattenKey(...keys)` / `scopeKey(flatKey, depth?)` | Convert between nested and flat keys |
| `detach(...keys)` | Stop tracking without destroying |
| `clear(removeFromDom?)` / `destroy(removeFromDom?)` | Teardown (defaults to removing from DOM) |
| `initialize()` / `isInitialized` | Manual initialization |

**Depth selection.** Pass `GradumModel.ALL` at any level to observe all entries there:

```typescript
// depth 2 — keys[0] = cardIndex, keys[1] = clipIndex
this.clipsObserver = this.model.generateObserver({...}, GradumModel.ALL);

// depth 3
this.clipsObserver = this.model.generateObserver({...}, GradumModel.ALL, GradumModel.ALL);

// only the children of one specific child
this.clipsObserver = this.model.generateObserver({...}, "myChildId", GradumModel.ALL);
```

For a flat YMap of objects (cards in a project), observe the nested model:
```typescript
this.cardsObserver = this.model.cards.generateObserver({...});
```

`generateDeepObserver(...)` is the variant that fires for the registered depth **and all
deeper levels**, where `generateObserver(..., GradumModel.ALL)` notifies only at that depth.

### 4d. Emitter — Internal Events

The `emitter` is a shared event bus within one component tree (element + view + operators
share the same emitter). Use it for decoupled internal signaling:

```typescript
// in view (setupUIListeners)
gradum(this.scrubberContainer).on(DefaultEventName.click, (e) =>
    this.emitter.fire("containerClicked", e));

// in operator (setupChangedCallbacks)
this.emitter.add("containerClicked", (e) => snapWhenShooting(e));
```

**View fires, operators listen** is the normal direction, but either side can do both.

| Method | Purpose |
|---|---|
| `fire(event, ...args)` / `add(event, cb)` / `remove(event, cb?)` | Named events |
| `fireKey(value, ...keys)` / `addKey(cb, ...keys)` / `removeKey(cb, ...keys)` | Key-path events, for reacting to specific model keys |

---

## 5. The Element

The element is the public API surface — the actual `HTMLElement` custom element.

### 5a. `defaultProperties`

Declares which classes fill each role. Merged with instance-level overrides at `create()`:

```typescript
export class ClipRenderer extends Renderer<ClipRendererView, ClipRendererModel> {
    public static defaultProperties: RendererProperties = {
        view: ClipRendererView,
        model: ClipRendererModel,
        operators: [ClipRendererFrameOperator, ClipRendererVisibilityOperator, ClipRendererVideoOperator]
    };
}
```

The full set of MVC roles accepted: **`view`, `model`, `emitter`, `operators`,
`handlers`, `interactors`, `tools`, `constrainers`**. Every plural role accepts either a
single class or an array, and either constructors or already-built instances.

### 5b. `@expose` — Delegating Properties to Model or View

`@expose(rootKey, exposeSetter?)` wires an element accessor to a property on an inner instance:

```typescript
// card.ts
@expose("model") public accessor duration: number;           // getter + setter (default)
@expose("model", false) public accessor title: string;       // getter only
@expose("view", false) public accessor timeline: Timeline;   // getter only
```

| `rootKey` | Resolves to |
|---|---|
| `"model"` | `this.model.propName` |
| `"view"` | `this.view.propName` |
| `"view.scrubber"` | `this.view.scrubber.propName` (dot paths supported) |
| `"renderer"` | `this.renderer.propName` |

The second argument **`exposeSetter`** controls whether a setter is generated:

- **`true` (default)** — getter *and* setter. Assignments delegate to the target.
- **`false`** — getter only. The field is read-only; no setter is wired up.

> **Diagnosing:** if an `@expose`'d field reads fine but assignments silently do nothing
> (or TypeScript says it has no setter), it was declared with `false` as the second
> argument. Remove the `false` to regenerate the setter.

There is also an **imperative form** for wiring a single property at runtime:
`expose(host, rootKey, key, exposeSetter?)`.

### 5c. `initialize()` on the Element

Runs after the element, view, model, and all operators are fully constructed. Use it for
callbacks needing the fully wired component, metadata, and selection wiring:

```typescript
// clip.ts
public initialize() {
    super.initialize();
    gradum(this).metadata.set(true, "dragAndDroppable");
    gradum(this).onSelected.add(value => (this.view as any)?.showHandles?.(value));
    gradum(this).on(DefaultEventName.click, () => {
        if (gradum(this).selected) ContextManager.instance.clear();
        else ContextManager.instance.set(this);
        return true;
    });
}
```

```typescript
// card.ts
public initialize() {
    super.initialize();
    const onDataChanged = () => {
        this.renderer.cardData = this.data;
        this.view.playback.card = this;
        this.view.timeline.card = this;
    };
    this.model.onDataChanged.add(() => onDataChanged());
    requestAnimationFrame(() => requestAnimationFrame(() => onDataChanged()));
}
```

The double `requestAnimationFrame` defers initial data wiring until after paint and after
Y.js data has loaded.

### 5d. `createData()` — Static Data Factory

Every component that persists to Y.js has a static `createData()` returning a
`YMap & SyncedType`:

```typescript
// clip.ts
public static createData(data: SyncedClip = {}): YMap & SyncedClip {
    gradum(data).applyDefaults({
        startTime: 0,
        endTime: 5,
        content: [],
        color: Color.random().toString(),
    });
    data.content = Text.createDataList(data.content);
    return createYMap<SyncedClip>(data);
}
```

For lists:
```typescript
public static createDataList(data: YArray<SyncedClip> | SyncedClip[] = []) {
    if (data instanceof YArray) return data;
    const array = createYArray([]);
    data?.forEach(clip => array.push([Clip.createData(clip)]));
    return array;
}
```

Always check `if (data instanceof YArray) return data` in list factories — the data may
already be a Y.js array from a loaded document.

**Y.js helpers exported by Gradum Kit:** `createYDoc`, `createYMap`, `createYArray`,
`jsonToYjs`, `addInYArray`, `addInYMap`, `removeFromYArray`, `deepObserveAll`,
`deepObserveAny`.

### 5e. Registering with the DOM

```typescript
define(Card, "vc-card");
define(ClipRenderer, "vc-clip-renderer");
```

Signature: `define(Base, elementName?, className?, options?)`. The tag name is optional —
omitted, Gradum Kit derives it from the class name. Always call at the bottom of the
element file.

`define()` also registers non-element classes (models, views, operators) in the Gradum Kit
registry, which powers `getRegisteredEntry`, `findRegistered`, `getRegisteredElements`,
`getRegisteredMvc`, `getAllRegistered`, and `getRegisteredByCategories`.

### 5f. The `onCardAdded` Pattern

The `Timeline` model has an `onCardAdded: (cardId: string, index: number) => Card`
callback that the cards observer calls to resolve a card ID to a Card element.

**Default implementation** (set in `Timeline.initialize()`):
```typescript
this.model.onCardAdded = (cardId) => gradum(this).closest("vc-project")?.getCard(cardId);
```

**For contexts without a `vc-project` ancestor** (e.g. the camera's ClipTimeline), override
`onCardAdded` BEFORE calling the card setter:

```typescript
// camera.ts
@auto() public set card(value: Card) {
    this.view.timeline.model.onCardAdded = () => value;  // must come FIRST
    this.view.timeline.card = value;
}
```

Order matters: `timeline.card = value` triggers `model.cards = [value]`, which
synchronously fires `cardsObserver.onAdded(value.dataId, ...)`, which calls
`onCardAdded(value.dataId)`. If it isn't set yet, it returns null and the observer bails —
no clips ever load.

---

## 6. Operators

Operators attach to one element and handle cross-cutting logic. They get `.element`,
`.view`, `.model`, `.emitter`, and support `@effect`.

```typescript
// timeline.clipOperator.ts
export class TimelineClipOperator extends GradumOperator<Timeline, TimelineView, TimelineModel> {
    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        this.emitter.add("containerClicked", (e) => snapWhenShooting(e));
    }

    @effect public reloadCurrentClip() {
        this.model.indexInfo = this.view.getClipIndexAtTimestamp();
        if (!this.model.indexInfo || !this.view.currentClip) return;
        this.element.renderer.setFrame(this.view.currentClip, this.model.indexInfo?.offset);
        this.emitter.fire("clipReloaded");
    }
}
```

Declare on the element with `@operator()`:
```typescript
@operator() protected timeOperator: TimelineTimeOperator;
@operator() protected clipOperator: TimelineClipOperator;
```

And in `defaultProperties`:
```typescript
public static defaultProperties = {
    operators: [TimelinePlayOperator, TimelineClipOperator, TimelineTimeOperator],
};
```

Call operator methods publicly from the element:
```typescript
public play(startTime = this.model.currentTime) {
    return this.playOperator.play(true);
}
```

Operators can also be added and removed at runtime through the selector:
`gradum(el).addOperator(...)`, `gradum(el).getOperator(name)`, `gradum(el).removeOperator(...)`.
The same trio exists for handlers, interactors, tools, and constrainers.

---

## 7. Handlers

Handlers are lightweight model-level helpers — no element or view access.

```typescript
// timeline.timeHandler.ts
export class TimelineTimeHandler extends GradumHandler<TimelineModel> {
    public isCurrentTimeOutsideBounds(): boolean {
        return this.model.currentTime < 0
            || this.model.currentTime >= this.model.totalDuration - this.model.timeIncrementS * 3;
    }

    public resetTimeIfOutsideBounds() {
        if (this.isCurrentTimeOutsideBounds()) this.model.currentTime = 0;
    }
}
```

Declare on the model with `@handler()`:
```typescript
@handler() public timeHandler: TimelineTimeHandler;
```

And in `defaultProperties`:
```typescript
public static defaultProperties = {
    handlers: [TimelineTimeHandler],
};
```

---

## 8. Interactors

Interactors handle tool-based events on a specific element, via `@listener()` methods that
fire when a tool event reaches the element.

```typescript
// clip.selectInteractor.ts
export class ClipSelectInteractor extends GradumInteractor<Clip, ClipView, ClipModel> {
    public toolName = "select";

    @listener() public drag(e: GradumDragEvent) {
        const timeline = this.getClosestTimeline(e);
        if (timeline) this.timelineIndicatorIndex = timeline.getClipFromPosition(e).closestIntersection;
        return Propagation.propagate;
    }

    @listener() public dragEnd(e: GradumDragEvent) {
        return Propagation.propagate;
    }
}
```

Declare on the element:
```typescript
public static defaultProperties = {
    interactors: ClipSelectInteractor
};
```

Interactors can target a different element than the one they're attached to:
```typescript
export class CanvasNavigationInteractor extends GradumInteractor<Canvas, CanvasView, CanvasModel> {
    public accessor target = document;  // listens on document

    @listener() scroll(e: GradumWheelEvent) { this.pan(e); }
    @listener() pinch(e: GradumWheelEvent) { this.zoom(e); }
}
```

**Method-name → event-name inference.** If `@listener()` is given no explicit `type`, the
event name is derived from the method name via `DefaultEventName` — `drag` → `gradum-drag`,
`dragEnd` → `gradum-drag-end`, `click` → `gradum-click`. Pass
`@listener({type: "..."})` to override. Both `@listener()` and `@behavior()` accept the
same options (`type`, `target`, `toolName`, `options`, `manager`); anything omitted is
resolved from the enclosing instance when `attachListenersAndBehaviors` runs, which the
element lifecycle does for you.

`@listener()` fires in the bubble phase; `@behavior()` (on Tools) fires in the capture phase.

---

## 9. Tools

Tools fire `@behavior()` methods during the capture phase (document → target) for all
elements in the path. They carry a `toolName`.

```typescript
// select.tool.ts
export class SelectTool extends GradumTool {
    public toolName = "select";

    @behavior() public click(e: GradumEvent, el: Node) {
        if (gradum(el).metadata?.get("selectable")) {
            ContextManager.instance.add(el as Element, true);
            return Propagation.stopPropagation;
        }
    }

    @behavior() public dragStart(e: GradumDragEvent, el: Node) {
        if ((e.target as Element)?.closest?.(".clip-handle")) return Propagation.stopPropagation;
        if (gradum(el).metadata?.get("dragAndDroppable")) {
            this.movableClone = MovableComponent.create({...});
        }
        return Propagation.stopPropagation;
    }
}
```

The `el` parameter is the element in the event path currently being processed — not
necessarily `e.target`.

`Propagation` has exactly three values:

| Value | Effect |
|---|---|
| `Propagation.propagate` | Continue to the next element in the current loop |
| `Propagation.stopPropagation` | Stop the **current** loop only; the other loop still runs |
| `Propagation.stopImmediatePropagation` | Stop both loops |

**Tool management through the selector:** `gradum(el).makeTool(...)`, `applyTool`,
`getToolName` / `getToolNames`, `isTool`, `embedTool` / `isEmbeddedTool` /
`getEmbeddedToolTarget`, `ignoreTool` / `ignoreAllTools` / `isToolIgnored`,
`addToolBehavior` / `hasToolBehavior` / `removeToolBehaviors` / `clearToolBehaviors`,
`onToolActivate` / `onToolDeactivate`.

---

## 10. Constrainers

Constrainers (formerly "substrates"/"enforcers") express declarative constraints that are
solved over objects. `GradumConstrainer` extends `GradumOperator`, so it has the same
element/view/model access and lifecycle.

Three method decorators:

| Decorator | Role |
|---|---|
| `@solver()` | Computes/repairs values to satisfy the constraint |
| `@checker()` | Reports whether the constraint currently holds |
| `@mutator()` | Applies a mutation as part of constraint resolution |

```typescript
export class StickyLineConstrainer extends GradumConstrainer<StickyLine> {
    @checker() public isAligned(obj: Square) { ... }
    @solver()  public align(obj: Square) { ... }
}
```

Declare with `@constrainer()` on the element and via `constrainers:` in `defaultProperties`.

The selector exposes the full runtime surface: `makeConstrainer`, `solveConstrainer` /
`checkConstrainer` / `mutate`, `addSolver` / `addChecker` / `addMutator` (plus `remove*`
and `clear*`), `activateConstrainer` / `deactivateConstrainer` / `toggleConstrainer` /
`activateOnlyConstrainer` / `activateAllConstrainers`, priority and queue control
(`setConstrainerPriority`, `setDefaultConstrainerQueue`, `setMaxPassesForConstrainer`),
and the delegates `onConstrainerActivate` / `onConstrainerDeactivate` /
`onConstrainerObjectListChange`.

---

## 11. The `gradum()` Selector

`gradum(element)` wraps any HTMLElement, GradumView, or GradumElement and exposes the
Gradum Kit API. `g()`, `gr()`, and `$()` are exact aliases — pick whichever reads best.

```typescript
gradum(this).addChild(element, index?)      // add child (respects childHandler)
gradum(this).remChild(element)
gradum(this).setStyle("prop", value)
gradum(this).setStyles({...})
gradum(this).toggleClass("name", bool)
gradum(this).show(bool)
gradum(this).closest("vc-card")             // by custom element tag
gradum(this).closest(Camera)                // by constructor
gradum(this).on(DefaultEventName.click, handler)
gradum(this).metadata.set(value, key)       // key-value store on the element
gradum(this).selected                       // selection state
gradum(this).onSelected                     // Delegate fired on selection change
```

`gradum(x)` caches one selector per target, so repeated calls return the same wrapper.
Pass `gradum(obj, true)` to operate on a wrapper object itself rather than its inner
`element` field.

The selector is assembled from modules, each contributing a slice of the API:

| Module | Members |
|---|---|
| **hierarchy** | `addChild`, `addChildBefore`, `addToParent`, `remChild`, `removeChildAt`, `removeAllChildren`, `remove`, `childAt`, `childHandler`, `hasChild`, `indexInParent`, `indexOfChild`, `closest`, `findInParents`, `findInSubTree`, `bringToFront`, `sendToBack`, `childrenArray`, `childNodesArray`, `siblings`, `siblingNodes` |
| **style** | `setStyle`, `setStyles`, `appendStyle`, `selected`, `defaultSelectedClasses`, `onSelected`, `closestRoot` |
| **class** | `addClass`, `removeClass`, `toggleClass`, `hasClass` |
| **event** | `on`, `onTool`, `bypassManagerOn`, `executeAction`, `preventDefault`, `hasListener`, `hasToolListener`, `hasListenersByType`, `removeListener`, `removeToolListener`, `removeListenersByType`, `removeAllListeners`, `boundListeners` |
| **element** | `setProperties`, `setAttribute`, `removeAttribute`, `getFields`, `focus`, `blur`, `clone`, `destroy`, `feedforward`, `defaultFeedforwardProperties` |
| **mvc** | `model`, `view`, `emitter`, `mvc`, `setMvc`, `initializeMvc`, `data`, `dataId`, `dataIndex`, `dataSize`, `metadata`, plus `add*`/`get*`/`remove*` for operators, handlers, interactors, tools, constrainers |
| **misc** | `apply`, `applyDefaults`, `getDefaults`, `execute`, `extract`, `removeFields`, `getDifference`, `getIntersection` |
| **reifect** | `show`, `showTransition`, `isShown`, `applyReifect`, `attachReifect`, `detachReifect`, `enableReifect`, `toggleReifect`, `reloadReifects`, `initializeReifect`, `reifects` |
| **tool** | see §9 |
| **constrainer** | see §10 |

Inside a **view**, `gradum(this)` targets the view's associated element (NOT the view
object). `this.element` is the explicit reference. Both work; `gradum(this)` is idiomatic.

Inside an **operator**, use `this.element` or `this.view`.

---

## 12. Event Propagation

Gradum Kit's event system runs **two sequential loops** over `e.composedPath()`
(`gradumEventManager.dispatchOperator.ts`):

1. **Capture loop** (document → target, iterating the path in reverse): runs `@behavior`
   tool methods
2. **Bubble loop** (target → document): runs `@listener` interactor methods and
   `gradum(el).on()` listeners

Each loop breaks as soon as a handler returns anything other than `Propagation.propagate`.

`gradum(el).on()` listeners run in the bubble loop alongside `@listener()`. They are
identified by `toolName === undefined` and fire LAST (after `@listener()` methods).

`stopPropagation` from a `@listener()` or `.on()` method stops the CURRENT bubble loop but
does not prevent the capture loop from having run — use `stopImmediatePropagation` to
suppress both.

Example: a handle's `.on(drag, ...)` fires correctly even though SelectTool's
`@behavior(drag)` also runs — they are in different loops. To prevent SelectTool from
creating a `MovableComponent` when dragging a handle, guard in the behavior:

```typescript
@behavior() public dragStart(e: GradumDragEvent, el: Node) {
    if ((e.target as Element)?.closest?.(".clip-handle")) return Propagation.stopPropagation;
}
```

`e.target` is the element at the original pointer-down position, not necessarily the
element in the path at the current loop step.

**Event names.** `DefaultEventName` merges key, click, move, drag, and wheel groups with
native DOM names. Gradum-specific names all carry the `gradum-` prefix:

```
gradum-click, gradum-click-start, gradum-click-end, gradum-long-press
gradum-move, gradum-drag, gradum-drag-start, gradum-drag-end
gradum-scroll, gradum-pinch, gradum-select-input
gradum-key-pressed, gradum-key-released
```

Native passthroughs include `wheel`, `scroll`, `input`, `change`, `focus`, `focusIn`,
`focusOut`, `blur`, `resize`, `compositionStart`, `compositionEnd`.

Event classes: `GradumEvent`, `GradumDragEvent`, `GradumKeyEvent`, `GradumWheelEvent`.

---

## 13. Y.js Data Flow

```
Y.js document (YDoc)
  └─ YMap "document_content"          ← ProjectModel.data
       ├─ YMap "cards"                ← ProjectModel.cards (@nestedModelSignal)
       │    ├─ "abc123" → YMap        ← one Card's data (SyncedCard)
       │    │    ├─ "title" → string  ← CardModel.title (@modelSignal)
       │    │    └─ "syncedClips" → YArray ← CardModel.syncedClips (@modelSignal)
       │    │         ├─ 0 → YMap     ← one Clip's data (SyncedClip)
       │    │         │    ├─ "startTime" → number
       │    │         │    └─ "color" → string
       │    │         └─ 1 → YMap
```

When Y.js data changes (local or remote):
1. `GradumYModel.observeChanges` fires
2. It calls the matching `GradumObserver` callbacks (`onAdded` / `onUpdated` / `onDeleted`)
3. `onAdded` creates the DOM element via `.create({data})`
4. The element's model wires `@modelSignal` fields to the Y.js data
5. `@effect` methods in the view react to signal changes

When local code writes to a model signal:
```typescript
this.model.color = "red";  // @modelSignal → set("color", "red")
```
→ fires the Y.js observer → fires `onUpdated` if an observer is watching → fires `@effect`
methods that read `this.model.color`.

---

## 14. Common Patterns and Recipes

### Creating a new synced component

1. Define `SyncedMyThing` in `myThing.types.ts`
2. Write `MyThingModel extends GradumYModel` with `@modelSignal()` per synced field
3. Write `MyThingView extends GradumView` with `setupUIElements`, `setupUILayout`, `@effect`
4. Write `MyThing extends GradumElement` with `@expose`, `createData()`, `defaultProperties`
5. Add `static createData()` ending in `createYMap(data)`
6. Call `define(MyThing, "vc-my-thing")` at the bottom

### Adding an observer for a flat YMap collection

```typescript
this.myObserver = this.model.myCollection.generateObserver({
    onAdded: (data) => MyComponent.create({data, parent: this.myParent}),
    onDeleted: (data, instance) => instance.remove()
});
```

Access instances: `this.myObserver.values`, `this.myObserver.get(id)`.

### Adding an observer for a two-level nested YArray

```typescript
this.clipsObserver = this.model.generateObserver({
    onAdded: (data, self, cardIndex, clipIndex) =>
        this.element.onClipAdded(data, self, cardIndex as number, clipIndex as number),
}, GradumModel.ALL);
```

Use `this.clipsObserver.getFlat(index, 2)` for flat access across all cards.

### Sharing a model between two views of the same data

```typescript
this.timeline = ClipTimeline.create({
    model: this.playback.timeline.model,  // ← same model instance
    renderer: this.renderer,
    card: this.element,
    hasControls: false
});
```

Both timelines share one `TimelineModel`; changes in one appear immediately in the other.

### Finding an ancestor from inside a view or operator

```typescript
const card = gradum(this).closest("vc-card");   // by tag name
const camera = gradum(this).closest(Camera);    // by constructor
```

From inside a view, `gradum(this)` targets the view's element. From inside an operator,
`gradum(this.view)` or `gradum(this.element)` both work.

### Preventing effect cross-contamination

If effect A calls effect B directly, B's signal reads are captured under A's tracking
context. Symptom: A fires when B's dependencies change. Fix: never call an `@effect` from
another `@effect`; or wrap the read in `untrack(...)`.

---

## 15. Class Relationship Summary

```
GradumElement (vc-card, vc-clip, vc-timeline, …)
  ├─ .view       → GradumView        (DOM, @effect, GradumObserver)
  ├─ .model      → GradumYModel      (@modelSignal, @nestedModelSignal, @signal)
  ├─ operators   → GradumOperator[]  (cross-cutting logic, @effect, emitter)
  ├─ handlers    → GradumHandler[]   (registered on model, model-only helpers)
  ├─ interactors → GradumInteractor[](@listener tool-event handlers)
  ├─ tools       → GradumTool[]      (@behavior capture-phase handlers)
  └─ constrainers→ GradumConstrainer[](@solver / @checker / @mutator)
```

Element base classes provided by the library:

```
GradumBaseElement       ← shared foundation
GradumElement           ← extends HTMLElement; the normal choice
GradumHeadlessElement   ← same MVC wiring, no HTMLElement (no DOM node)
GradumProxiedElement    ← wraps an existing element via proxy
```

Inheritance used in the VideoClipper project:
```
GradumElement → Node → Card
GradumElement → Clip
GradumElement → Timeline → ClipTimeline
GradumElement → Renderer → ClipRenderer
GradumElement → Playback
GradumElement → Project → Canvas
GradumElement → Camera

GradumYModel → NodeModel → CardModel
GradumYModel → ClipModel
GradumYModel → TimelineModel
GradumYModel → ProjectModel → CanvasModel
GradumYModel → RendererModel → ClipRendererModel

GradumView → NodeView → CardView
GradumView → ClipView
GradumView → TimelineView → ClipTimelineView
GradumView → PlaybackView
GradumView → ProjectView → CanvasView
GradumView → CameraView
```
