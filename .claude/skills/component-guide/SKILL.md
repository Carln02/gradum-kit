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
> Timeline, Renderer) and from `demos/tutorial2` (`my-*` elements: Canvas, Square, Note,
> CheckItem, SideButton, Clock, Text). Anything prefixed `Gradum` is library API; anything
> else is application code shown for illustration.
>
> **The one idea to keep in mind:** a feature is a class in its own file, attached to the
> component(s) that need it. Adding behaviour, adding UI, changing a layout, or enforcing a
> rule rarely means editing an existing class — it means writing a new operator,
> interactor, view, tool or constrainer (extending an existing one when that helps) and
> listing it on the component. See §1b.

---

## 1. Architecture Overview

Every feature is split across up to seven class types:

| Class | Base | Knows About | Purpose |
|---|---|---|---|
| `MyElement` | `GradumElement` | view, model | The custom HTML element. Public API surface. |
| `MyView` | `GradumView` | element, model | DOM construction + reactive rendering. |
| `MyModel` | `GradumYModel` or `GradumModel` | data only | State, signals, Y.js sync. |
| `MyOperator` | `GradumOperator` | element, view, model | One feature attached to one element: logic **and** the UI it needs. |
| `MyHandler` | `GradumHandler` | model only | Pure model-level logic helpers. The only UI-free role. |
| `MyInteractor` | `GradumInteractor` | element, view, model | Tool-event listeners attached to one element (may own UI too). |
| `MyConstrainer` | `GradumConstrainer` | element, view, model | Declarative constraints solved over objects. |
| `MyTool` | `GradumTool` | the element it's applied to | What happens when the user acts with a tool (move, resize, add…). |

Every role is optional. A small component can be a single `GradumElement` with its own
`@dataSignal` fields, `@effect` methods and `setupUI*` methods and no view or model class at
all (§5g); split it up when it grows or when a part should be reusable.

`GradumModel` = local in-memory state. `GradumYModel` = state synced to Y.js (used for
anything that needs multi-client or cross-session persistence).

**Inheritance worth knowing:** `GradumOperator` is the base for three of these —
`GradumTool`, `GradumInteractor`, and `GradumConstrainer` all extend it. That is why they
share `.element` / `.view` / `.model` / `.emitter`, support `@effect`, and have the same
four-phase lifecycle as a view (`setupUIElements` → `setupUILayout` → `setupUIListeners`
→ `setupChangedCallbacks`, §4a).

```
GradumOperator
  ├─ GradumTool         (@behavior, capture phase, toolName)
  ├─ GradumInteractor   (@listener, bubble phase, toolName + target)
  └─ GradumConstrainer  (@solver / @checker / @mutator)
```

---

## 1b. Composition: One Feature, One File

Before touching an existing class, ask which role the change belongs to, write it as a new
class in its own file, and attach it. Existing classes stay small and features can be
mixed per component, per instance, or at runtime.

| I want to… | Write a… | Attach it with… |
|---|---|---|
| Add behaviour + its UI to a component (a lock with a button) | `GradumOperator` subclass with UI phases (§6) | `operators:` in `defaultProperties` |
| Add a handle/affordance that drives a tool (a resize handle) | `GradumInteractor` that creates the handle (§8) | `interactors:` |
| Change a component's layout or rendering | `GradumView` subclass of the existing view | `view:` in `defaultProperties`, or per instance in `create({view})` |
| Specialise an existing feature (lock **also** while typing) | Subclass of that operator/interactor | Replace it in the subclass component's `defaultProperties` |
| Add a user action (move, resize, add-a-note) | `GradumTool` (§9) | `tools:` on a button / element |
| Enforce a rule over many objects (snap, min size) | `GradumConstrainer` on the container (§10) | `constrainers:` on the container |
| Add model-only logic | `GradumHandler` (§7) | `handlers:` |
| A reusable widget | A small `GradumElement` (SideButton, CheckItem) | `create()` it from whatever needs it |

Every plural role takes a class, an instance, or an array of either, and can also be
added and removed at runtime: `gradum(el).addOperator(...)` / `removeOperator(key | instance)`
(same for interactors, tools, constrainers, handlers). A removed operator also removes the
DOM it added (§6). The plural setters (`gradum(el).operators = [...]`) **add**; they don't
replace.

**Swapping the view or model at runtime** (`el.view = X` / `el.model = m`, or through
`gradum(el)`):

| Call | Effect on an initialized element |
|---|---|
| `el.view = OtherView` (class or instance) | Old view detached (its DOM, listeners, effects, observers). Operators and interactors are rebuilt against the new view, since their UI may live inside it. |
| `gradum(el).removeView()` / `el.view = undefined` | View removed; operators/interactors rebuilt without one. |
| `el.model = otherModel` | View, operators and interactors rebuilt against the new model; effects of the element, tools and constrainers restart. The old model stops driving this element. |
| `gradum(el).removeModel()` / `el.model = undefined` / `model.detach(el)` | Element left **unbound**: view, operators and interactors torn down until a model is attached again, which rebuilds everything. |
| `model.detach()` | Detached from every element it backs. |
| `model.attachedElements` | Every element currently using the model. |

A model can back several elements (`b.model = a.model`); they share the same data, and
detaching it from one leaves the others working. Styles a view's effects set on the
element itself (transform, size…) stay until the new view sets them. Before the element
initializes, these setters just replace the piece.

**Worked example (`demos/tutorial2`).** Square gets a lock and a resize handle without
`Square` or `SquareView` knowing about either:

```typescript
// square.ts
export class Square extends GradumElement<SquareView, any, SquareModel> {
    public static defaultProperties = {
        view: SquareView,                       // position, size, colour only
        model: SquareModel,
        interactors: SquareResizeInteractor,    // creates + places a ResizeHandle
        operators: SquareLockOperator           // creates a SideButton, locks on click
    };
}
```

Note extends Square and swaps in specialised pieces; the checklist variant only swaps the
view, per instance:

```typescript
// note.ts
export class Note extends Square<NoteView, NoteModel> {
    public static defaultProperties = {
        view: NoteView,                         // extends SquareView: adds title + content
        model: NoteModel,                       // extends SquareModel
        operators: NoteLockOperator             // extends SquareLockOperator: lock while typing
    };
}

// addChecklistNote.tool.ts — same component, different layout
Note.create({parent: canvas, view: NoteChecklistView, data: {...}});
```

```typescript
// note.lockOperator.ts — the whole "lock while typing" feature
export class NoteLockOperator extends SquareLockOperator {
    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this).on("input", (e: Event) => {
            if ((e.target as HTMLElement).isContentEditable) this.emitter.fire("lock");
        });
        gradum(this).on("focusout", () => {
            if (this.lockButton.matches(":hover")) return;
            this.emitter.fire("unlock");
        });
    }
}
```

**Keep pieces loosely coupled:**
- Talk through the shared `emitter` (`this.emitter.fire("lock")`) rather than calling another
  operator directly, so either side can be swapped.
- Tools ask the component to act (`target.move?.(delta)`) and only fall back to
  duck-typing its fields. Constrainers choose case by case. Neither checks `instanceof` (§1c).
- Expose events from a widget as `Delegate`s (`public readonly onDelete = new Delegate()`)
  and let the parent decide what they mean.

---

## 1c. Contracts, Not Classes

Tools, constrainers, operators and interactors should assume **as little as possible**
about the component they act on. Write them against a small contract (a method or a
field), never against a class. A component then opts in by meeting the contract, and
decides for itself what the action means.

### Tools: call the component's method first

A tool looks for a method named after its action on the target and calls
it. Only if there is none does it fall back to the plain field. The component owns the
meaning of the action:

```typescript
// move.tool.ts
@behavior() drag(e: GradumDragEvent, target: Node) {
    const delta = gradum(target).closest("my-canvas") ? e.scaledDeltaPosition : e.deltaPosition;

    if (typeof (target as any).move === "function") (target as any).move(delta);  // 1. the component decides
    else if ("position" in target && target.position instanceof Point)            // 2. fallback: plain field
        target.position = delta.add(target.position);
    else return Propagation.propagate;                                            // 3. not movable
    return Propagation.stopPropagation;
}
```

```typescript
// square.ts — the default behaviour, written once on the component
public move(delta: Coordinate) {
    this.position = this.position.add(delta);
}

// connection.ts — no `position` at all: moving shifts both endpoints
public move(delta: Coordinate) {
    this.start = this.start.add(delta);
    this.end = this.end.add(delta);
}

// pinnedNote.ts — refuses to move horizontally
public move(delta: Coordinate) {
    super.move(new Point(0, delta.y));
}
```

Why the method comes first:
- The tool never needs to know about new kinds of components. A group moves its children,
  a line moves its endpoints, a component inside a scrolled container converts the delta.
  Each does it in its own `move()`, and the tool stays the same.
- A component can constrain, redirect or refuse the action (an empty `move()` makes it
  immovable for every move tool) without touching the tool.
- The field fallback keeps simple components working without any method.

The same applies to every action. Name the method after the action and pass it the tool's
raw input, not a computed result:

| Tool | Calls if present | Fallback |
|---|---|---|
| `MoveTool` | `target.move(delta)` | `target.position += delta` |
| `ResizeTool` | `target.resize(delta)` | `target.size += delta * 2` |
| `SelectTool` | `target.select()` | `metadata.get("selectable")` |

Rules for the contract:
- **Check for the method, don't check the class.** Use `typeof target.move === "function"`
  or `"position" in target`, never `target instanceof Square`. Even `instanceof` on a base
  class shuts out components that don't inherit from it.
- **Keep the method small and named after the action** (`move`, `resize`), not after the tool
  (`onMoveToolDrag`). Any tool, operator, keyboard shortcut or script can then call it.
- **Pass raw input** (the delta), so the component decides how to apply it.
- **Returning `Propagation.propagate`** when neither method nor field exists lets the event
  continue to the next element in the path (a child that isn't movable lets its movable
  parent move).

### Constrainers: decide case by case

A constrainer enforces a rule that belongs to the container, so it is often right for it
to read and write the objects' fields directly. A sticky line aligning the squares
attached to it, or a size clamp, is the container's rule, and routing it through a method
on each object adds nothing. Calling a method on the object is worth it only when
objects should be able to apply or refuse the rule their own way (a snap that a group
applies to its bounding box, for example).

Whichever you pick, the rule about classes still holds. Check for the field or method
(`"position" in object && object.position instanceof Point`), not `object instanceof Square`,
so the constrainer works on anything that has what it needs.

### Operators and interactors: depend on the element as little as possible

Operators and interactors are attached to a component, so they can assume more, but every
assumption limits which components they can be attached to:

- **Type them loosely.** Prefer `GradumOperator<Node>` / `GradumInteractor<Node>` over
  `GradumOperator<Square, SquareView, SquareModel>`. Narrow the type only for what you
  actually use.
- **Act through `gradum(this)`** (which targets the element) for children, classes,
  styles and tool state, rather than through element-specific members.
- **Talk through the emitter** (`lock`, `unlock`, `lockChanged`), not by calling another
  piece's methods.
- **Treat the view as optional.** If you need a place to put UI, fall back to the element:
  `gradum(this.view?.panel ?? this.element).addChild(...)`.
- **Call the element's methods the same way tools do**: `this.element.move?.(delta)` rather
  than writing `position` directly, so the component keeps control.
- **Read data by key, with a default**, rather than assuming a field exists
  (`this.model?.get("color") ?? "black"`).

`SquareLockOperator` (§6a) and `SquareResizeInteractor` (§8) follow this: they only use
`gradum(this)` and the emitter, so they can be attached to any component, not just squares.

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

Name each extra piece after what it does, with the role as suffix:
`myThing.lockOperator.ts`, `myThing.resizeInteractor.ts`, `myThing.checklistView.ts`,
`canvas.snapConstrainer.ts`. Pieces reused across components (tools, generic operators)
live in a shared folder such as `tools/` or `operators/`. Operator keys are derived from
the class name, so two different operators on one element need different class names.

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
    @dataSignal() color: string;
    @dataSignal() position: Coordinate = {x: 0, y: 0};
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

**`@dataSignal(...keys)`** — reactive field backed by the model's data container. Reading
calls `this.get(...keys)`; writing calls `this.set(value, ...keys)`. On a `GradumYModel`
that resolves to the underlying Y.js structure. The key path defaults to the field name.
Use for any field that must be synced (title, color, mediaId, position, …).

```typescript
@dataSignal() public title: string;
@dataSignal() public color: string;
@dataSignal() public syncedClips: YArray<SyncedClip>;
```

Nested key path:
```typescript
// reads this.get("cardData", "title")
@dataSignal("cardData", "title") public cardTitle: string;
```

**`@dataSignal` works on any class, not only models.** Where the value lives depends on
who declares it:
- **On a model** — in that model's own data.
- **On an element, view, operator, interactor, tool, constrainer** — in the data of the
  model attached to that component (`this.model`, or `this.element.model`). If the component
  has no model yet, a plain `GradumModel` is created and attached; a model attached later
  replaces it.

Either way it is the same key path in the same data, so every piece that declares or reads
`position` sees the same value, and `@effect`s re-run whoever wrote it.

```typescript
// circle.ts — no model class, no view class
export class Circle extends GradumElement {
    @dataSignal() position: Point = new Point();
    @dataSignal() size: Point = new Point(100, 100);
}
Circle.create({data: {position: e.scaledPosition}});   // lands in the auto-created model
```

```typescript
// an operator can declare the data it needs instead of asking the model class to have it
export class PinOperator extends GradumOperator {
    @dataSignal() pinned: boolean = false;   // stored in this.element's model data
}
```

The field initialiser is a **default**: it is written into the data only when the key is
still undefined, so data passed to `create({data})` wins.

### 3b-2. Where State Can Live

The roles describe responsibilities, not storage rules. Any class can hold any kind of
state:

| Kind of state | Decorator | Where it's stored | Can be declared on |
|---|---|---|---|
| Persisted / synced data | `@dataSignal` | The component model's data | Anything (see above) |
| Reactive in-memory state | `@signal` | On the instance | Anything: model, view, element, operator… |
| Plain fields | none | On the instance | Anything — but effects won't track it |

So a view may hold data (`@dataSignal() collapsed` on a view), a model may hold elements
or other non-serialisable objects (`@signal public anchorElement: HTMLElement` on a model,
or any JS value in a plain `GradumModel`'s data), and an operator may hold its own UI and
state (`@signal locked`). Choose by **who should own the concept** and **whether it must
persist**, not by which class "is allowed" to.

> Only data in a `GradumYModel` is synced, and Y.js can only store serialisable values —
> keep elements and class instances out of synced data; put them in a `@signal` instead.

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
- `@dataSignal() public syncedClips: YArray<SyncedClip>` — gives you the raw YArray value
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

`GradumModel`'s constructor does **not** honour `initialize: true` — only
`GradumModel.create({..., initialize: true})` does.

### 3f. Editing Collections: `add`, `push`, `delete`, `nest`

```typescript
model.set(value, ...keys)        // write at a key path
model.add(value, ...keys)        // insert at keys (last key = index / map key)
model.push(value, ...keys)       // append to the array at keys, or add to the map at keys
                                 // under a random id; returns the new index / key
model.delete(...keys)            // remove; arrays shift down
model.nest(...keys)              // a GradumModel wrapping the collection at keys
```

`add`/`delete` shift array indices for plain JS arrays as well as `YArray`, and observers
follow the shift, so instances stay mapped to the right entries.

Use `nest()` to work on one collection with **relative** keys — its observer keys are
indices into that collection, not full paths:

```typescript
// note.checklistView.ts
if (!this.model.get("items")) this.model.set([], "items");
this.items = this.model.nest("items");
this.itemsObserver = this.items.generateObserver({
    onAdded: (data, self) => {
        const item = CheckItem.create({data, parent: this.listElement});
        item.onDelete.add(() => this.items.delete(...self.getKey(item)));
        return item;
    }
});

// add button
const index = this.items.push({text: "", checked: false});
this.itemsObserver.get(index)?.focusText();   // instance exists synchronously
```

Observing from the parent instead (`this.model.generateObserver(props, "items")`) stores
full paths, so lookups become `observer.get("items", index)`.

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

**Operators, interactors, tools and constrainers have the same four phases**, and when a
component is built they run **phase by phase across all pieces** (`initializeMvc` in
`../../../src/gradumFunctions/mvc/mvc.ts`):

```
1. setupUIElements   view, then every operator / interactor / tool / constrainer
2. setupUILayout     view, then every operator / interactor / tool / constrainer
3. view.initialize()          → view listeners + changed callbacks (+ effects)
4. each piece's initialize()  → its listeners + changed callbacks (+ effects)
```

So an operator's `setupUILayout` can already use elements the view created
(`gradum(this.view.panel).addChild(...)`), and the view never needs to know the operator
exists. A piece added later at runtime (`gradum(el).addOperator(...)`) runs all four phases
on its own.

An element with no view class runs the same phases on itself — `GradumElement` has
`setupUIElements` / `setupUILayout` / `setupUIListeners` / `setupChangedCallbacks` too (§5g).

### 4b. `@effect` — Reactive Rendering

`@effect` methods re-run automatically whenever a signal they read changes. The method
body is tracked: every `@signal`, `@dataSignal`, `@nestedModelSignal`,
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

### 5d-2. Attach / Detach and Public Events

`define()` wraps `connectedCallback` on the prototype it registers, so **an override of
`connectedCallback` in a subclass does not run**. Use the element's delegates instead:

```typescript
// clock.ts
public initialize() {
    super.initialize();
    this.onAttach.add(() => this.timer = setInterval(() => this.now = new Date(), 1000));
    this.onDetach.add(() => clearInterval(this.timer));
}
```

Give a widget its own events as public `Delegate`s and fire them from its view; the parent
decides what they mean:

```typescript
// checkItem.ts
public readonly onDelete: Delegate<() => void> = new Delegate();
// checkItem.view.ts — delete button
gradum(this.deleteButton).on("click", () => { this.element.onDelete.fire(); this.element.remove(); });
```

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

### 5g. Small Components: the Element as Its Own View

For a small component, skip the view and model classes. The element itself can declare
`@dataSignal`s (a default model is created for them), `@effect`s, and the `setupUI*`
phases:

```typescript
// text.ts
export class Text extends GradumElement {
    @dataSignal() position: Point = new Point();
    @dataSignal() text: string = "";

    public initialize() {
        this.contentEditable = "plaintext-only";
        super.initialize();
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this).on("input", (e: Event) => {
            if (e.target === this) this.text = this.innerText;
        });
    }

    @effect protected updatePosition() {
        gradum(this).setStyle("transform", `translate(${this.position.x}px, ${this.position.y}px)`);
    }

    @effect protected updateText() {
        if (this.innerText !== this.text) this.innerText = this.text;
    }
}
define(Text, "my-text");
```

Subclasses can still add UI (`Clock extends Circle` adds its hands in `setupUIElements` /
`setupUILayout`) and operators/interactors attach to it like to any other component. Move
the rendering into a view class once you want layout variants (§1b).

> **Editable text pattern:** guard the `@effect` with
> `if (el.innerText !== model.text)` so writing back what the user just typed doesn't reset
> the caret.

---

## 6. Operators

Operators attach to one element and implement **one feature** of it: its logic and any UI
it needs. They get `.element`, `.view`, `.model`, `.emitter`, support `@signal`,
`@dataSignal` and `@effect`, and have the four setup phases (§4a). Only handlers are
UI-free.

### 6a. An Operator With UI

```typescript
// square.lockOperator.ts
export class SquareLockOperator extends GradumOperator {
    @signal public locked: boolean = false;
    protected lockButton: SideButton;

    protected setupUIElements() {
        super.setupUIElements();
        this.lockButton = SideButton.create({leftIcon: "unlock", classes: "lock-button"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild(this.lockButton);          // gradum(this) → this.element
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this.lockButton).on("click", () => this.emitter.fire("toggleLock"));
    }

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        this.emitter.add("lock", () => this.locked = true);
        this.emitter.add("unlock", () => this.locked = false);
        this.emitter.add("toggleLock", () => this.locked = !this.locked);
    }

    @effect protected updateLock() {
        gradum(this.element).ignoreAllTools(this.locked).toggleClass("locked", this.locked);
        this.emitter.fire("lockChanged", this.locked);
    }

    @effect protected updateLockIcon() {
        this.lockButton.leftIcon = this.locked ? "lock" : "unlock";
    }
}
```

Exposing the feature's inputs as emitter events (`lock` / `unlock` / `toggleLock`) is what
lets a subclass or another piece drive it without touching its internals (see
`NoteLockOperator` in §1b).

### 6b. Ownership: Operators Clean Up Their DOM

Every node an operator adds with `gradum(...).addChild` / `addChildBefore` **during its
`setupUIElements` / `setupUILayout`** is recorded as owned by it — wherever it was added
(on the element, inside a view element, anywhere). `detach()` / `gradum(el).removeOperator(key)`
removes those nodes; adding the operator again rebuilds them.

- Only the nodes the operator added directly are owned. A component it creates manages
  its own inner nodes.
- Nodes added outside those two phases (in a listener, later on) are not recorded. Call
  `this.own(node)` to mark one; it returns the node.

```typescript
gradum(this.view.panel).addChild(this.label);          // in setupUILayout → owned
const tip = this.own(div({parent: this.element}));     // later → owned explicitly
```

Observers created with `generateObserver` / `generateDeepObserver` while the operator sets
itself up (any phase) are recorded the same way and destroyed on `detach()`.

**Views work the same way:** a view owns the nodes it adds in its UI phases and the
observers it creates, has `own()`, and has `detach()`, which the element calls when its view
or model is replaced (§1b).

### 6c. Logic-Only Operators

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

**Interactors can own UI too.** An interactor that creates a handle and embeds a tool in it
is the clean way to add a manipulation affordance to a component:

```typescript
// square.resizeInteractor.ts
export class SquareResizeInteractor extends GradumInteractor<Node> {
    protected resizeHandle: ResizeHandle;

    protected setupUIElements() {
        super.setupUIElements();
        this.resizeHandle = ResizeHandle.create({tools: ResizeTool});
        gradum(this.resizeHandle).embedTool(this.element);   // dragging the handle resizes the square
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild(this.resizeHandle);
    }
}
```

`embedTool(target)` makes interactions on the tool element (the handle) apply its tool to
`target` instead of to the handle itself.

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

**Write tools against contracts, not classes (§1c).** Call the component's method for the
action if it has one, and fall back to its field:

```typescript
// move.tool.ts
export class MoveTool extends GradumTool {
    public toolName = "move";

    @behavior() drag(e: GradumDragEvent, target: Node) {
        const delta = gradum(target).closest("my-canvas") ? e.scaledDeltaPosition : e.deltaPosition;
        if (typeof (target as any).move === "function") (target as any).move(delta);
        else if ("position" in target && target.position instanceof Point) target.position = delta.add(target.position);
        else return Propagation.propagate;
        return Propagation.stopPropagation;
    }
}
```

Creation tools follow the same rule for the container: call `target.addSquare?.(position)`
if the container defines it, otherwise check for a capability (a container that accepts
children), not `target instanceof Canvas`.

**Activating tools.** Attach a tool to a button; clicking the button makes it the active
tool:

```typescript
Toolbar.create({entries: [
    GradumButton.create({leftIcon: "cursor", tools: MoveTool}),
    GradumButton.create({leftIcon: "add-square", tools: AddSquareTool}),
]});
```

**Blocking tools on an element.** `gradum(el).ignoreAllTools(true)` (or `ignoreTool(name)`)
makes tools skip that element — this is how locking works (§6a). Anything that reacts to a
tool's result on its own (constrainers) should check `gradum(el).isToolIgnored(toolName)`.

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

Put a constrainer on the **container** to enforce a rule over all its children. A
`@solver()` receives `ConstrainerCallbackProperties` (`target`, `eventType`, `toolName`, …),
so it can react to specific moments:

```typescript
// canvas.snapConstrainer.ts
export class CanvasSnapConstrainer extends GradumConstrainer<Canvas> {
    public constrainerName = "snap";
    public gridSize = 40;
    public defaultQueue = [];

    @solver() protected snap(properties: ConstrainerCallbackProperties) {
        if (properties.eventType !== GradumEventName.dragEnd) return;
        const object = properties.target;
        if (gradum(object).isToolIgnored(properties.toolName)) return;   // locked → leave it
        if ("position" in object && object.position instanceof Point)
            object.position = object.position.round(this.gridSize);
    }
}

// canvas.ts
public static defaultProperties = {constrainers: [CanvasSnapConstrainer, CanvasSizeConstrainer]};
```

Only write when the value actually changes (`if (!clamped.equals(object.size))`) to avoid
needless signal updates. `Point` helpers that suit constrainers: `round(step | Coordinate)`,
`bound(min, max)`, `equals`, `add` / `sub` / `mul` / `div`.

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

Inside a **view** or an **operator** (interactor, tool, constrainer), `gradum(this)` targets
the associated element (NOT the view/operator object) — `gradum(obj)` acts on `obj.element`
whenever the object has one. `this.element` is the explicit reference. Both work;
`gradum(this)` is idiomatic.

**Showing and hiding:** `gradum(el).show(bool)` and `gradum(el).isShown` go through the
element's show transition (default: toggles visibility). Prefer them to toggling
`style.display` by hand.

**Events bubble through the manager.** `gradum(host).on(type, fn)` is dispatched along the
event path, so a host also receives the events of its children — including
`mouseenter` / `mouseleave`, which natively don't bubble. When you mean the host itself,
check the target:

```typescript
// sideButton.ts — show on parent hover, hide 500ms after leaving
protected readonly show = (e: Event) => {
    if (e.target !== this.host) return;
    clearTimeout(this.hideTimeout);
    gradum(this).show(true);
};
protected readonly hide = (e: Event) => {
    if (e.target !== this.host) return;
    this.hideTimeout = setTimeout(() => gradum(this).show(false), this.hideDelay);
};
```

A `gradum(...).on` listener returning `Propagation.stopPropagation` stops it there (e.g. a
button inside a canvas object that shouldn't also trigger the object's click).

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
       │    │    ├─ "title" → string  ← CardModel.title (@dataSignal)
       │    │    └─ "syncedClips" → YArray ← CardModel.syncedClips (@dataSignal)
       │    │         ├─ 0 → YMap     ← one Clip's data (SyncedClip)
       │    │         │    ├─ "startTime" → number
       │    │         │    └─ "color" → string
       │    │         └─ 1 → YMap
```

When Y.js data changes (local or remote):
1. `GradumYModel.observeChanges` fires
2. It calls the matching `GradumObserver` callbacks (`onAdded` / `onUpdated` / `onDeleted`)
3. `onAdded` creates the DOM element via `.create({data})`
4. The element's model wires `@dataSignal` fields to the Y.js data
5. `@effect` methods in the view react to signal changes

When local code writes to a model signal:
```typescript
this.model.color = "red";  // @dataSignal → set("color", "red")
```
→ fires the Y.js observer → fires `onUpdated` if an observer is watching → fires `@effect`
methods that read `this.model.color`.

---

## 14. Common Patterns and Recipes

### Adding a feature to existing components

1. Pick the role (§1b table). Usually an operator; an interactor if it's a tool handle; a
   constrainer if it's a rule over a container's children.
2. Create `myThing.featureOperator.ts` (or a shared `operators/feature.operator.ts` if
   several components will use it). Build its UI in `setupUIElements`, place it in
   `setupUILayout`, wire it in `setupUIListeners` / `setupChangedCallbacks`, render with
   `@effect`. Declare any data it needs with `@dataSignal` right on the operator.
3. Add it to `operators:` of each component that should have it. Done — no other file
   changes. Removing it from the list removes the feature, UI included.

### Varying a feature for one component

Subclass the operator, override the phase you need (calling `super`), and list the
subclass on that component instead. `NoteLockOperator extends SquareLockOperator` adds
"lock while typing" with ~10 lines (§1b).

### Changing how a component reacts to a tool

Don't touch the tool. Define (or override) the action's method on the component:
`move(delta)`, `resize(delta)`. The tool calls it in place of writing the field (§1c). An
empty method opts the component out.

### Changing a layout

Subclass the view, override `setupUIElements` / `setupUILayout`, and either set it as the
component's default `view` or pass it per instance: `Note.create({view: NoteChecklistView})`.
A subclass can drop a parent's element in its layout (`gradum(this.contentElement).remove()`)
and add its own.

### A widget that attaches to whatever parent it's added to

Hook `onAttach` / `onDetach` and read `this.parentElement` (SideButton: shows on its
parent's hover, positioned with a `level` signal → CSS variable). The parent needs no code
for it; an operator just creates it and adds it in `setupUILayout`.

### Creating a new synced component

1. Define `SyncedMyThing` in `myThing.types.ts`
2. Write `MyThingModel extends GradumYModel` with `@dataSignal()` per synced field
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
  ├─ .view       → GradumView        (DOM, @effect, GradumObserver) — optional
  ├─ .model      → GradumYModel      (@dataSignal, @nestedModelSignal, @signal) — auto-created if omitted
  ├─ operators   → GradumOperator[]  (one feature each: logic + owned UI, @effect, emitter)
  ├─ handlers    → GradumHandler[]   (registered on model, model-only helpers, no UI)
  ├─ interactors → GradumInteractor[](@listener tool-event handlers, may own UI)
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
