# Ecommerce demo — plan: item details, collections, filters

This plan covers four requests:

1. **Item details.** An item card expands to show everything about the product: images, categories, highlights, description and properties.
2. **Two kinds of collection.** A *list* lays items out in order. A *freeform* area lets you move items anywhere inside it, like the canvas.
3. **Switching.** A collection can switch between those two layouts.
4. **Filter objects.** A filter is placed on the canvas and connected to collections. It holds keywords, categories, facet filters and a sort order. Every collection connected to it applies them.

It follows the kit's split (element / model / view / operator / handler / interactor / tool / constrainer), and the demo's existing conventions:
- **Swappable behaviour is an operator under a fixed key.** The layout (`"layout"`) and fit (`"fit"`) operators work this way.
- **Bookkeeping over a list is a handler.** `CanvasCollectionsHandler` and `CartAmountsHandler` work this way.
- **Drops go through `DropTarget.acceptDrop`.**

**Status:** phases 1, 2 and 4 are done, plus catalogue paging (§8). Phases 3, 5 and 6 are still a plan.

---

## 0. What changed, and what it turned into

| Before | Now |
|---|---|
| `Item` data = `{name, image, price}` | `Item` data = the whole `Product`; one `ItemView` that expands to show the details **(done)** |
| `Shelf` (fixed side panel with built-in search/tabs) | **Removed.** A *catalogue* is now just a `Collection` with `catalogue: true`, drawn on the canvas with **Add catalogue** **(done)** |
| `ShelfSourceHandler` | `CatalogueSourceHandler` on a headless `Catalogue`, shared by the whole canvas **(done)** |
| `ShelfFilterOperator` + Substring/Token/Fuzzy | `FilterSearchHandler` + the same three strategies **(done)** |
| `Cart` (its own area, position, size, lock, fit) | `Cart extends Collection extends Square`, adding only amounts and the "+" button **(done)** |
| `CartLockOperator`, `CartFitOperator` family | `CollectionLockOperator`, `CollectionFitOperator` family **(done)** |
| `CanvasCartsHandler` / `CanvasCartConstrainer` | `CanvasCollectionsHandler` / `CanvasCollectionConstrainer` **(done)** |
| `AddCartTool` | `AddCollectionTool`, with `AddCartTool` and `AddCatalogueTool` subclasses **(done)** |
| — | `Filter`, `AddFilterTool`, `CanvasLinksHandler` **(done)**; `Link`, `ConnectTool` (phase 5) |

---

## 1. Data layer — done

### 1.1 Types — `catalogue/catalogue.types.ts`

```ts
type Product = {
    id: string,
    name: string,
    categories: string[],                       // broadest first, may be empty
    price: number,
    description: {highlights: string[], text: string},
    properties: Record<string, PropertyValue>,  // weight, length, recommendedAge, asin, color…
    images: string[],                           // main first
};
type PropertyValue = number | string | {min?: number | null, max?: number | null};   // recommendedAge is a range
type Units = {price: string, properties: Record<string, string>};                    // data/units.json
```

`ItemData` is `Partial<Product>`.

### 1.2 `Catalogue` — headless element, one per canvas

`Catalogue extends GradumHeadlessElement`. It is created in `index.ts` and handed to the canvas (`canvas.catalogue`).

**`CatalogueModel`:** `@signal products`, `units`, `source`, `unitsSource`.

| Handler | Key | Does |
|---|---|---|
| `CatalogueSourceHandler` | `"source"` | `@effect`s on `source` / `unitsSource`: fetch, normalise each entry into a full `Product`. A failed read warns and leaves the list empty. |
| `CatalogueUnitsHandler` | `"units"` | `format(key, value)`: `0.36 kg`; ranges as `3–10 years` / `8+ years`. `label(key)`: `shippingWeight` → "Shipping weight". `order(properties)`: measurements first, text next, `asin` last. |
| `CatalogueCategoriesHandler` **(done)** | `"categories"` | Static `pathsOf(product)` (every prefix, so a parent category matches its children), `treeOf(products)` (nodes with `name`, `path`, `count`, `children`, fullest first) and `find(tree, path)`. Paths are joined with `CategorySeparator` (`" › "`). |

---

## 2. Item — done

**`Item`** (extends `Square`) has one view, `ItemView`. Its ⓘ button toggles `item.expanded`:

| State | Shows |
|---|---|
| Collapsed (default) | The card: picture, name, price, amount + "Add" dropdown |
| Expanded | The name in full, then pictures with thumbnails, category breadcrumb, highlights, description (4 lines, then "More"), and a properties table formatted through the catalogue, then the cart row |

- **State.** `expanded`, `currentPicture` and `fullText` are view signals; `expanded` is exposed on the item and accepted by `Item.create`.
- **Lazy.** The detail sections are only drawn while expanded — a catalogue holds 100 cards.
- **Size.** A card is as big as its contents. In a list, the list sets the width; on the canvas the stylesheet does (15rem, 22rem expanded) and a `ResizeObserver` writes the measured box back into `size`. Cards are anchored top-left, so expanding grows downward.
- **In a list.** The fit operator also follows each card's `expanded`, so the collection re-measures. The scroll fit only jumps to the last card when one was added.
- **Card in a list** (`fixed`): `getBoundingClientRect()` returns the page box, because a list placed it, not its `position`.

---

## 3. Collections

### 3.1 `Collection` (`demo-collection`) — done

```
Square
  └─ Collection   (position, size, rotation, colour, anchor come from Square; anchor = TopLeft)
       └─ Cart    (+ amounts, + "+" button)
```

- **Items are the collection's children.** Moving the collection moves them with nothing else to do. `itemElements` reads the children, and `syncItems()` copies them into `model.items` (the signal views follow).
- **Exposed:** `name`, `locked`, `catalogue`, `items` (read-only).
- **`acceptDrop(item, point)`:**
  - A locked collection or a catalogue refuses the drop.
  - A catalogue card is cloned (the catalogue keeps its own).
  - Then `insertItem(item, layout.indexAt(point, item), point)`.
- **`insertItem(item, index?, position?)`** → `layoutOperator.place(...)`.
- **`delete()`** unregisters from the canvas and destroys, so the item popups go with it.
- `static namePrefix` ("Collection", "Cart") feeds the canvas's `nextFreeName`.

**`CollectionModel`:** `@signal name`, `locked`, `catalogue`, `items`, `page`, `pageSize`, `total`, `filters`. No position or size; those belong to the square.

**`CollectionView`:**
- **Header:** name, item count, lock button.
- **Classes:** `locked`, `catalogue`, and `collection-full` (from the fit operator's `fits` / `overflowed` events).
- **`CartView`** adds the "+" button.

| Operator | Key | Does |
|---|---|---|
| `CollectionListLayoutOperator` | `"layout"` | See §3.2 |
| `CollectionLockOperator` | `"lock"` | `modifiable = !locked` |
| `CollectionScrollFitOperator` (+ Shrink / Grow) | `"fit"` | The old cart fit family, unchanged except for reading the square's `size` |
| `CollectionCatalogueOperator` | `"catalogue"` | While `catalogue` is set: `collection.query(products)` (the linked filters), then builds cards for **one page only** (marked `catalogue` metadata = template). Rebuilds when the products, the filters or the page change; a new set of products goes back to page 1. Removes its own cards when switched off. |
| `CollectionQueryOperator` **(done)** | `"query"` | For anything but a catalogue: hides the cards the filters leave out (`filtered-out` class) and orders the rest with CSS `order` while a filter sorts. Writes `model.total`. |

**Paging (done).** A catalogue shows `pageSize` (20) cards at a time. `CollectionModel` has `page`, `pageSize` and `total` (what there is to show after filtering). The view has a sticky footer pager ("‹ Previous · 21–40 of 100 · Next ›"), shown only for a catalogue with more than one page; `collection.turnPage(±1)` moves it. The header counts `total` for a catalogue, and "3 of 4 items" for a collection whose filters hide some.

There is no positions handler and no items handler: each item knows its own position, and the children are the items.

### 3.2 Layout operators (key `"layout"`)

```ts
abstract class CollectionLayoutOperator {
    place(item: Item, index?: number, position?: Point): void;   // index undefined = push
    indexAt(position: Point, moved?: Item): number;              // where a drop at this point goes; undefined = push
}
```

| | List **(done)** | Freeform *(phase 3)* |
|---|---|---|
| `indexAt` | Before the first item whose middle is below the point | Always `undefined` (push) |
| `place` | `item.fixed = true`; insert before `items[index]`, or append | `item.fixed = false`; append; `item.position = position` converted into the collection's local space |
| Items | Laid out by the flex column; dragged and dropped | Keep their own `position`, relative to the collection; moved in place with the select tool |
| On install *(phase 3)* | Set every child `fixed = true` | Set every child `fixed = false`; a child that never had a position gets the next grid cell |

**Switching** *(phase 3)*: `collection.switchLayout()` swaps the operator under `"layout"` and toggles a header button (☰ / ⧉). A child's `position` is left alone while it is in a list (its transform just isn't applied), so switching back to freeform puts every item back where it was.

### 3.3 Freeform extras — phase 3

| Piece | Type | Does |
|---|---|---|
| `CollectionPanInteractor` | Interactor, `"select"`, `drag` on the collection's empty area | In freeform, moves every child by the delta (a pan). In a list, does nothing (a list scrolls). |
| `CollectionBoundsConstrainer` | Constrainer on the collection, `dragEnd` of a child | If the child's centre has left the collection, hand it to `canvas.acceptDrop`; otherwise clamp it inside. |
| `arrange()` | Method | Lays the shown items out in a grid in their current (sorted) order |

### 3.4 Kinds of collection

| Kind | Tool | Notes |
|---|---|---|
| Cart | **Add cart** | + amounts; what an item's "Add" dropdown lists |
| Catalogue | **Add catalogue** | `catalogue: true`, white; stocked from the canvas's catalogue; refuses drops; its cards are templates |

---

## 4. Filter — done

### 4.1 `Filter` (`demo-filter`, extends `Square`)

Drawn on the canvas with **Add filter** (`AddFilterTool`, the collection tool with `kind = Filter`). White, anchored top-left.

- **Exposed:** `keywords`, `categories`, `facets`, `sort`, `enabled`, `targets` (read-only).
- **`test(product)`** and **`comparator()`** delegate to the query handler. This is what collections call.
- **`scope`** (getter): the products the filter chooses among. That means everything its targets hold (the whole catalogue for a catalogue), or the whole catalogue while it has no targets. The category tree, counts, ranges and sort keys are all offered from it. *(This replaced the planned `FilterOptionsOperator`: a getter that reads signals is enough, since the view's effects follow it.)*
- **`reset()`**, and **`delete()`**, which unlinks it first.

**`FilterModel`:**
- `@signal keywords: string`
- `@signal categories: string[]` (category paths, any of which lets a product through)
- `@signal facets: Record<key, {min?, max?}>` (`"price"` is the price, anything else a property)
- `@signal sort: {key: "none" | "relevance" | "name" | "price" | <numeric property>, direction}`
- `@signal enabled`
- `@signal targets: Collection[]` (only written by the canvas's links handler)

### 4.2 Handlers on `FilterModel`

| Handler | Key | Does |
|---|---|---|
| `FilterSearchHandler` (abstract) | `"search"` | `matches(product)` (always true while there are no keywords), `score(product)` for relevance (name > categories > highlights) |
| ↳ `FilterSubstringSearchHandler` / `FilterTokenSearchHandler` (default) / `FilterFuzzySearchHandler` | | The three old shelf strategies. Token search covers name, categories and highlights |
| `FilterCategoriesHandler` | `"categories"` | `matches()` via `CatalogueCategoriesHandler.pathsOf`; `has`, `toggle(path)`, `clear` |
| `FilterFacetsHandler` | `"facets"` | Static `valueOf(product, key)` (a number is a range of one). `matches()` is on overlap, and a missing value fails. Also `keys(products)`, `bounds(products, key)`, `set(key, range)`, `remove(key)` |
| `FilterSortHandler` | `"sort"` | `comparator()`: ties are left at 0 so collections can chain filters; missing values go last. Also `keys(products)`, `sortBy(key)`, `reverse()` |
| `FilterQueryHandler` | `"query"` | Facade: `test(product)` and `comparator()`. A paused filter lets everything through and orders nothing |

Handlers read the filter's signals, so a collection's effect that calls `filter.test()` subscribes to exactly those signals. No events are needed between the two.

### 4.3 Applying filters

- **`collection.query(products)`:** keeps the products every linked filter lets through. It then chains their comparators in link order, with the name breaking the last tie.
- **Catalogue:** the catalogue operator queries before paging (§3.1), so a page is a page of results.
- **Anything else:** `CollectionQueryOperator` hides and orders the cards (§3.1). Nothing is moved, so the manual order comes back when the sort is cleared.
- **Freeform** *(phase 3)*: hidden or dimmed per `filterDisplay`; positions untouched; "Arrange" shown while a sort is active.

### 4.4 `FilterView`

From top to bottom:
- **Header:** title, an On/Paused switch, and Reset.
- **Search field.**
- **Sort:** a dropdown ("Featured", "Relevance", "Name", "Price", then numeric properties by their catalogue labels) and a direction button ("↑ Low to high", "↑ A–Z"), hidden for Featured and Relevance.
- **Category:**
  - The picked categories as chips with ✕.
  - A breadcrumb ("All › Toys & Games").
  - The level being browsed (`browsing` signal). Each row has a checkbox to pick it, a name that goes into it, a count, and "›".
- **Ranges:** one row per facet, labelled with its unit ("Price (USD)"), with min/max fields (placeholders show the bounds) and ✕. Below them, a "+ Add a range" dropdown.
- **Applies to:** a chip per collection on the canvas, lit while linked; clicking one toggles the link. *(This is the interim way to link until phase 5's drawn links. Both go through `CanvasLinksHandler`.)*

**Not done yet:** dragging inside the panel (e.g. selecting text in the search field) moves the filter. This needs the `[data-handle]`-style guard in `SelectTool` (phase 5).

---

## 5. Links — phase 5

- **`Link` (`demo-link`):** an SVG curve from a filter's port to a collection, in an overlay layer.
  - **`LinkModel`:** `from`, `to`, `enabled`, `pending` (the free end while it is being dragged).
  - **`LinkTrackOperator`** (`"track"`): `@effect` on `getRect(from)` / `getRect(to)`. These read `position` / `size` / `rotation` signals, so the link follows either end.
  - **`LinkToggleInteractor`** (`"select"`, `click` on the midpoint badge) pauses and resumes the link.
  - The delete tool removes a link via `delete()`.
- **`CanvasLinksHandler`** (`"links"`) **(done)** is the only writer of `filter.targets` / `collection.filters`, and of `canvas.model.links` (`{filter, collection}[]`, which phase 5 draws). It provides `has`, `connect`, `disconnect`, `toggle` and `disconnectAll`. The canvas wraps these as `isLinked`, `toggleLink`, `removeFilter`, and `removeCollection` unlinks. Deleting a filter or collection disconnects its links.
- **`FilterPortInteractor`** (`"select"`, `dragStart` / `drag` / `dragEnd` on a port on the filter's right edge) draws a pending link and connects to the collection under the pointer when released.
  - **Routing caveat:** the select tool handles the drag before any interactor sees it, and would move the whole filter instead. So `SelectTool` has to skip anything marked `[data-handle]`. The same guard should cover the filter's inputs.
- **`ConnectTool`** (`"connect"`): drag from anywhere on a filter to a collection; click a link to disconnect it. It shares the drag code with the port interactor through a `LinkDraft` helper.

---

## 6. Tools

| Tool | State |
|---|---|
| `SelectTool` | Unchanged; gets the `[data-handle]` guard in phase 5 |
| `AddCartTool` / `AddCatalogueTool` (on the abstract `AddCollectionTool`) | **Done** — the plain **Add collection** button was removed |
| `AddFilterTool` | **Done** (subclass of `AddCollectionTool`, whose `drawn` is now any `Square`) |
| `ConnectTool` | Phase 5 |
| `DeleteTool` | Unchanged; works on collections, filters and links via `delete()` |

---

## 7. Flows

**Load.** `index.ts` creates the `Catalogue` (products + units) and hands it to the canvas. Drawing a catalogue stocks it from there.

**Drop on a list.**
1. Select tool ghost → `findDropTarget` → `collection.acceptDrop`.
2. A catalogue card is cloned → `layout.indexAt` → `layout.place`.
3. `canvas.syncCollections()` resyncs the collection the card came from.

**Drop on the canvas.** The card (a clone, if it came from a catalogue) becomes the canvas's child with `fixed = false` and `position` = the pointer.

**Loose card left on a collection.** `CanvasCollectionConstrainer` on `dragEnd` → `collection.insertItem(item, indexAt(centre), centre)`. A collection moved over loose cards picks them up the same way.

**Open details.** Click a card's ⓘ → `expanded` toggles; the card grows in place, in a list or on the canvas.

---

## 8. Files and phases

```
src/
  catalogue/   catalogue.ts  catalogue.model.ts  catalogue.types.ts
               catalogue.sourceHandler.ts  catalogue.unitsHandler.ts  catalogue.categoriesHandler.ts
  item/        item.ts  item.model.ts  item.view.ts  item.types.ts  item.css
  collection/  collection.ts  collection.model.ts  collection.view.ts  collection.types.ts  collection.css
               collection.layoutOperator.ts  collection.lockOperator.ts  collection.fitOperator.ts
               collection.catalogueOperator.ts  collection.queryOperator.ts
  filter/      filter.ts  filter.model.ts  filter.view.ts  filter.types.ts  filter.css
               filter.searchHandler.ts  filter.categoriesHandler.ts  filter.facetsHandler.ts
               filter.sortHandler.ts  filter.queryHandler.ts
  cart/        cart.ts  cart.model.ts  cart.view.ts  cart.types.ts  cart.amountsHandler.ts  cart.css
  canvas/      canvas.ts  canvas.model.ts  canvas.collectionsHandler.ts  canvas.linksHandler.ts
               canvas.collectionConstrainer.ts
  tools/       addCollection.tool.ts  (+ existing)
```

1. **Done — catalogue, full product data, expandable cards.**
2. **Done — `Collection` (extends `Square`) with list layout.**
   - Cart rebuilt on it; shelf removed in favour of catalogue collections.
   - Canvas handler, constrainer and add-tools generalised.
3. **Freeform layout + switching.**
   - `CollectionFreeformLayoutOperator`, `switchLayout()` + header toggle.
   - `CollectionPanInteractor`, `CollectionBoundsConstrainer`, `arrange()`.
4. **Done — Filter.**
   - `Filter` + its model, handlers and view, and `AddFilterTool`.
   - `CatalogueCategoriesHandler`, `CanvasLinksHandler`, and the "Applies to" chips.
   - `collection.query`, `CollectionQueryOperator`, and catalogue paging.
5. **Links.** `Link`, `FilterPortInteractor`, `ConnectTool`, `LinkToggleInteractor`, the `[data-handle]` guard.
6. **Polish.**
   - Breadcrumb → filter.
   - Dim vs hide.
   - Empty states.

---

## 9. Open questions

1. **Sorting in freeform:** only on "Arrange", or always (losing manual placement)?
2. **Filtered-out items in freeform:** dimmed or hidden?
3. **Several filters on one collection:** AND the matches and chain the sorts in link order? Or one filter per collection?
4. **Resizing loose cards:** they now size to their content, so the resize tool has no effect on them. Fine, or should a card keep a resizable width?
