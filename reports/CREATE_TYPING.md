# Making `create()` infer its type arguments from the properties passed

> **Question:** can `GradumInput.create({...})`, `GradumSelect.create({...})` and `GradumModel.create({...})`
> derive their generic arguments from the properties object, so call sites never need a cast — ideally
> through one change at the base `create()`?
>
> **Status: implemented.** See §7 for what shipped and how it differed from the plan.
>
> **Answer:** one base-level change fixes both errors currently blocking the musicPlayer demo, and it also
> makes `create()` subclass-preserving. It cannot infer generics that are declared on a *subclass*
> (`GradumInput`'s `InputTag`, `GradumSelect`'s value types) — TypeScript has no way to reach those from a
> base-class static. Those need a three-line opt-in per class, using the same pattern.
>
> Every claim below was checked by compiling probes against the real source; results are in §3.

---

## 1. Both errors are one bug

```
TS2339: Property 'target' does not exist on type 'GradumModel<object, any, any, any, any>'
TS2322: Type 'GradumInput<"input" | "textarea", unknown, ...>' is not assignable to
        type 'GradumInput<"input", string, ...>'
```

Different symptoms, same cause. `create()` currently returns `InstanceType<Type>`:

```ts
public static create<
    Type extends new (...args: any[]) => GradumElement,
    PropertiesType extends InstanceType<Type>["properties"]
>(this: Type, properties?: PropertiesType): InstanceType<Type>
```

**`InstanceType<typeof C>` instantiates a generic class' type parameters with their *constraints*, not
their defaults.** So:

| Expression | Resolves to |
|---|---|
| `GradumInput.create({...})` | `GradumInput<"input" \| "textarea", unknown, ...>` ← constraints |
| `GradumInput` (bare, as a field type) | `GradumInput<"input", string, ...>` ← defaults |

`"input" | "textarea"` is the constraint on `InputTag`; `unknown` is what an unconstrained `ValueType`
collapses to. The two are not assignable, which is TS2322 verbatim.

TS2339 is the same thing one level down: `ModelType` collapses to its constraint `GradumModel`, so
`newPlaylistTool.model` is a bare `GradumModel` and `.target` is not on it — the `model: NewPlaylistModel`
in the properties never reaches the return type.

Passing `{inputTag: "textarea"}` changes nothing today: the return type does not mention the properties,
so there is nothing for TypeScript to infer from.

---

## 2. What can and cannot be inferred

The MVC generics — `ViewType`, `DataType`, `ModelType`, `EmitterType` — are declared on **`GradumElement`
itself**. A base-class `create()` can name them, so it *can* infer them.

`GradumInput`'s `InputTag`/`ValueType` and `GradumSelect`'s `ValueType`/`SecondaryValueType`/`EntryType`
are declared on the **subclass**. A static on the base cannot name a parameter it does not have, and
`this: typeof GradumInput` carries no type arguments. No formulation recovers them.

That is the hard boundary. One change covers the base generics; subclass generics are opt-in per class.

---

## 3. Formulations tested

Compiled against the real classes, and against a reduced model where the real ones were too tangled.

| # | Formulation | Result | Verdict |
|---|---|---|---|
| a | `InstanceType<Type>` (current) | `Inp<"input" \| "textarea", unknown>` | constraints — the bug |
| b | infer instance from `this`: `this: new (...a) => Inst` | `Inp<"input" \| "textarea", unknown>` | also constraints |
| c | `T extends new (...a) => infer R` | constraints | also constraints |
| d | per-class `create` with its own generics | `Inp2<"textarea", string>` | infers — but hardcodes the return, so `SubInp.create()` returned `Inp2`, losing the subclass |
| e | `static declare create: ...` (declaration only) | **TS2417** static-side mismatch | not viable as-is |
| f | **`This["prototype"]`** | `Inp<any>` | does **not** collapse to constraints |
| g | **`This["prototype"] & Base<Inferred>`** | infers *and* preserves the subclass | **recommended** |

The finding that unlocks it is (f). `["prototype"]` yields `any`-parameterized generics rather than
constraint-parameterized ones, and `X<any>` is assignable in both directions — so the assignability error
disappears, while the intersection in (g) carries the precisely-inferred parts.

### The (g) probe, in full

```ts
static create<This extends {prototype: any}, M extends Model = Model>(
    this: This,
    p?: This["prototype"]["properties"] & ElProps<M>
): This["prototype"] & Element_<M>
```

Checked, all four passing:

```ts
const a = Icon.create({model: MyModel, icon: "x"});
const t1: HTMLElement = a.model.target;   // ✓ ModelType inferred from `model:`
const t2: boolean     = a.iconOnly;       // ✓ subclass members survive
const b = SubIcon.create({icon: "y"});
const t3: number      = b.extra;          // ✓ works two levels down
Icon.create({bogus: 1});                  // ✓ still errors — typos are caught
```

The `This["prototype"]["properties"]` half of the parameter is what keeps subclass-specific properties
(`icon`) accepted and excess-property checking alive. Without it, only base properties are allowed.

---

## 4. Recommended change

### 4a. Base level — one edit, fixes both reported errors

In `src/gradumElement/gradumElement.ts`:

```ts
public static create<
    This extends {prototype: GradumElement},
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter<any>
>(
    this: This,
    properties?: This["prototype"]["properties"]
        & GradumElementProperties<ViewType, DataType, ModelType, EmitterType>
): This["prototype"] & GradumElement<ViewType, DataType, ModelType, EmitterType> {
    return (this as any).customCreate(properties ?? {});
}
```

The same shape applies to the three sibling classes that declare their own `create`:
`GradumBaseElement`, `GradumProxiedElement`, `GradumHeadlessElement`.

**What this fixes:**

- `GradumIcon.create({model: NewPlaylistModel}).model.target` — TS2339 gone, `ModelType` inferred.
- `this.search = GradumInput.create({...})` — TS2322 gone, because `GradumInput<any, ...>` is assignable
  to `GradumInput<"input", string, ...>`.
- `create()` becomes genuinely subclass-preserving, which `InstanceType` never delivered.

### 4b. Per class — opt in where the class' own generics matter

For `GradumInput`:

```ts
public static create<
    This extends {prototype: GradumInput<any, any>},
    InputTag extends "input" | "textarea" = "input",
    ValueType = string
>(
    this: This,
    properties?: This["prototype"]["properties"] & GradumInputProperties<InputTag, ValueType>
): This["prototype"] & GradumInput<InputTag, ValueType> {
    return super.create(properties as any) as any;
}
```

`GradumInput.create({inputTag: "textarea"})` then yields `InputTag = "textarea"` precisely. The identical
shape applies to `GradumSelect` with `ValueType`/`SecondaryValueType`/`EntryType`, which removes the
`as GradumSelect<string, string, Song>` cast in `songsPanel.view.ts`.

This is opt-in: components without meaningful generics of their own need nothing.

### 4c. `GradumModel` — and a correction

`GradumModel.create` is currently *not* subclass-polymorphic. It returns a hardcoded
`GradumModel<...>`, which is why `GradumYModel` carries an override whose only job is to narrow the
return type.

**I previously reported that no general fix was available here and that per-subclass overrides were the
only option. That was wrong.** I had tested `InstanceType<T>` and `T extends new (...) => infer R`, both of
which collapse to constraints (`unknown`, `KeyType`, `object`) and broke inference at 28 call sites. I did
not test `["prototype"]`, which behaves differently:

| Expression | Resolves to |
|---|---|
| `InstanceType<typeof GradumYModel>` | `GradumYModel<unknown, KeyType, KeyType, object, unknown>` |
| `(typeof GradumYModel)["prototype"]` | `GradumYModel<any, any, any, any, any>` |

The second is permissive and matches the class' own all-`any` defaults, so it does not break call sites.
That means:

```ts
public static create<This extends {prototype: GradumModel}>(
    this: This, properties: GradumModelProperties = {}
): This["prototype"] {
    const model = new (this as any)(properties);
    if (properties.initialize) model.initialize();
    if (properties.makeSignals) model.makeSignals(GradumModel.ALL);
    return model;
}
```

…is subclass-polymorphic, and **the `GradumYModel.create` override can be deleted**. The explanatory
comment on `GradumModel.create` about constraints-versus-defaults should be updated: the trap is real, but
`["prototype"]` is the way around it.

---

## 5. Costs, honestly

**Precision is traded for permissiveness.** `This["prototype"]` gives `GradumInput<any, any, ...>`, so
where the class' own generics are not separately inferred, members typed by them become `any`. Today they
are `unknown`/constraints — stricter, but unusable, which is why the code needs casts. Section 4b buys the
precision back for the classes that care.

**Tooltips and `.d.ts` get noisier.** Return types become intersections like
`GradumIcon<any, ...> & GradumElement<GradumView<any, any>, object, GradumModel, GradumEmitter<any>>`.
Correct, but wordy on hover and in the generated declarations.

**It is a public API surface change.** The emitted `.d.ts` changes shape for every component with a
`create`. Existing casts (`as GradumSelect<string, string, Song>`) keep compiling, so it is not breaking
for consumers, but it will show up in any diff of the declarations.

**`This extends {prototype: ...}` is loose.** Constrain it to `{prototype: GradumElement}` rather than
`{prototype: any}` so `create` cannot be called on unrelated constructors.

---

## 6. Suggested order

1. `GradumElement.create` (§4a) — fixes both musicPlayer errors on its own. Verify with
   `npm run typecheck` plus a build of the musicPlayer demo.
2. The three sibling base classes, same shape, for consistency.
3. `GradumModel.create` (§4c), then delete the `GradumYModel.create` override and update the comment.
4. `GradumInput` and `GradumSelect` (§4b) — removes the remaining cast in `songsPanel.view.ts`.
5. Re-run the full suite; the 785 existing tests are the regression net, since `create` is used
   throughout them.

Steps 1–3 are the "one general fix" as far as one exists. Step 4 is where the subclass-owned generics get
their precision, and it is inherently per class.


---

## 7. Implementation notes

Shipped. `npm run typecheck` 0, 785/785 tests, build 0 errors, docs 0 errors, and the **musicPlayer demo
typechecks and builds clean** — it was one of the failing demos before.

**What changed**

| File | Change |
|---|---|
| `gradumElement.ts` | `create` reformulated per §4a |
| `gradumBaseElement.ts` | same shape; it has no generics of its own, so just `This["prototype"]` |
| `gradumProxiedElement.ts` | same shape, plus its `ElementTag` parameter |
| `gradumHeadlessElement.ts` | same shape |
| `model.ts` | `create` made polymorphic per §4c |
| `yModel.ts` | **`create` override deleted** (17 lines) and its now-unused import removed |
| `input.ts` | per-class `create` per §4b |
| `select.ts` | per-class `create` per §4b |
| `songsPanel.view.ts` (demo) | `as GradumSelect<string, string, Song>` cast removed — no longer needed |

**Two things the plan got wrong**

1. **`This extends {prototype: GradumInput<...>}` does not compile.** Narrowing the `this` constraint below
   the base's triggers TS2417, because `this` is contravariant: the override must accept everything the base
   accepts. The constraint has to stay at the base's level (`{prototype: GradumElement}`); only the *return*
   type narrows. This did not show up in the reduced probe, because the mock subclass added no members and
   so was structurally identical to its base — the real `GradumInput` adds 36.

2. **A per-class `create` must thread the base's generics through as well.** Declaring only `InputTag` and
   `ValueType` left the return type using `GradumInput`'s defaults for `ViewType`/`ModelType`/…, which is not
   assignable to the base's return of `GradumElement<ViewType, …>`. The fix is to declare all six parameters
   and pass them to both the properties type and the return type.

The working shape for a subclass override is therefore:

```ts
public static create<
    This extends {prototype: GradumElement},          // base's constraint, not narrowed
    InputTag extends "input" | "textarea" = "input",  // this class' own generics
    ValueType = string,
    ViewType extends GradumView = GradumView<any, any>,   // the base's, threaded through
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter<any>
>(
    this: This,
    properties?: This["prototype"]["properties"]
        & GradumInputProperties<InputTag, ValueType, ViewType, DataType, ModelType, EmitterType>
): This["prototype"] & GradumInput<InputTag, ValueType, ViewType, DataType, ModelType, EmitterType>
```

**Still failing, unrelated:** the `grid`, `physics` and `tutorial` demos fail on
`GradumSubstrate` / `SubstrateCallbackProperties`, which no longer exist — leftover from the
Substrate→Constrainer rename. Same failures as before this change.
