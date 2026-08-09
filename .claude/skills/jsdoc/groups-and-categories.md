# Groups and categories

`@group` is the top-level bucket in the rendered docs. `@category` is the sub-bucket inside it. Every public top-level symbol gets both.

## Rules

1. **Reuse an existing pair.** Scan the tables below first. A new group or category should be a deliberate decision, not a side effect of not looking.
2. **Match the neighbours.** A new component class goes in `Components` with a category named after the class (`@category GradumTooltip`). A new decorator goes in `Decorators` under the concept it belongs to. A new options type goes in the same group/category as the thing it configures — `AutoOptions` sits with `auto`, `GradumToolProperties` sits with `GradumTool`.
3. **Types split two ways.** Generic, reusable types (`KeyType`, `Coordinate`, tag maps, enums) go in `@group Types`. A type that only exists to configure one class goes with that class.
4. **Members inherit.** Methods, fields, and accessors inside a class don't repeat `@group`/`@category`.
5. **Internal symbols get neither** — they don't render.
6. **New category, when needed:** name it after the concept a reader would search for, singular, matching the casing style already in the table (class names as-is, plain concepts in Title Case).

## Current taxonomy

### `@group Decorators`
`Augmentation` · `Cache` · `Signal` · `Effect` · `MVC` · `Listeners` · `Registry, Attributes & DOM` · `Attributes & DOM`

### `@group Types`
`Basics` · `Enums` · `Element` · `SVG Element` · `MathML Element` · `Event` · `Event Names` · `Tool` · `Constrainer` · `Style` · `Hierarchy` · `Yjs` · `Misc`

### `@group Components`
One category per component or data structure:

`Point` · `Delegate` · `Listener` · `AnchorPoint` · `GradumRect` · `GradumMap` · `GradumQueue` · `GradumWeakSet` · `GradumNodeList` · `GradumNestedMap` · `GradumNestedStore` · `GradumIcon` · `GradumIconSwitch` · `GradumIconToggle` · `GradumRichElement` · `GradumButton` · `GradumButtonPopup` · `GradumInput` · `GradumNumericalInput` · `GradumLabelElement` · `GradumSelect` · `GradumSelectElement` · `GradumSelectWheel` · `GradumDropdown` · `GradumContentSwitch` · `GradumDrawer` · `GradumPopup` · `GradumMarkingMenu` · `GradumMovable` · `GradumGrid` · `StatefulReifect` · `Reifect`

### `@group MVC`
`MVC` · `Model` · `View` · `Emitter` · `Handler` · `Operator` · `Interactor` · `Tool` · `Constrainer`

### `@group GradumElement`
`GradumElement` · `GradumBaseElement` · `GradumHeadlessElement` · `GradumProxiedElement`

### `@group Event Handling`
`GradumEventManager` · `GradumEvents` · `Enums`

### `@group Element Creation`
`Base Elements` · `Creation Functions` · `Flex Elements`

### `@group Utilities`
`Color` · `Equity` · `String` · `Hash` · `Interpolation` · `Numbers` · `Random` · `Element` · `Null Check` · `Sorting` · `Prototype` · `SVG` · `Geometry` · `Event` · `CSS` · `Font` · `Yjs` · `Misc`

### `@group GradumSelector`
Used without a category — selector functions (`gradum`, `gr`, `g`, `$`) and the augmentation interfaces that hang off `GradumSelector`.

## Known inconsistencies to fix on sight

If you're already editing a file that contains one of these, correct it:

- `Registry` vs. `Registry, Attributes & DOM` vs. `Attributes & DOM` in `Decorators` — pick `Registry, Attributes & DOM`, it's the most used.
- `GradumModel` in `@group MVC` — model symbols belong in `Model`, matching the bare-concept naming of its siblings (`View`, `Emitter`, `Handler`, ...).
- Symbols with `@group` but no `@category` (several types in `Types` and `Components`) — add the category.
- Symbols with neither — check why. If they reach the `.d.ts` only because an exported type references them (the `GradumEventManager*` operators and models, for instance), they aren't public: mark them `@internal` and leave both tags off.
