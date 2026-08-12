/**
 * @typedef {Object} AutoOptions
 * @group Decorators
 * @category Augmentation
 *
 * @template Type - The type of the decorated property.
 * @description Options for configuring the `@auto` decorator.
 * @property {boolean} [override] - If true, will try to override the defined property in `super`.
 * @property {boolean} [cancelIfUnchanged=true] - If true, cancels the setter if the new value is the same as the
 * current value. Defaults to `true`.
 * @property {(value: Type) => Type} [preprocessValue] - Optional callback to execute on the value and preprocess it
 * just before it is set. The returned value will be stored.
 * @property {(value: Type) => void} [callBefore] - Optional function to call before preprocessing and setting the value.
 * @property {(value: Type) => void} [callAfter] - Optional function to call after setting the value.
 * @property {boolean} [setIfUndefined] - If true, will fire the setter when the underlying value is `undefined` and
 * the program is trying to access it (maybe through its getter).
 * @property {boolean} [returnDefinedGetterValue] - If true and a custom getter is defined, the return value of this
 * getter will be returned when accessing the property. Otherwise, the underlying saved value will always be returned.
 * Defaults to `false`.
 * @property {boolean} [executeSetterBeforeStoring] - If true, when setting the value, the setter will execute first,
 * and then the value will be stored. In this case, accessing the value in the setter will return the previous value.
 * Defaults to `false`.
 * @property {Type} [defaultValue] - If defined, whenever the underlying value is `undefined` and trying to be
 * accessed, it will be set to `defaultValue` through the setter before getting accessed.
 * @property {() => Type} [defaultValueCallback] - If defined, whenever the underlying value is `undefined` and
 * trying to be accessed, it will be set to the return value of `defaultValueCallback` through the setter before
 * getting accessed.
 * @property {Type} [initialValue] - If defined, on initialization, the property will be set to `initialValue`.
 * @property {() => Type} [initialValueCallback] - If defined, on initialization, the property will be set to the
 * return value of `initialValueCallback`.
 */

/**
 * @typedef {Object} CacheOptions
 * @group Decorators
 * @category Cache
 *
 * @description Options for configuring the `@cache` decorator.
 *
 * Defines when and how cached values should expire, refresh, or invalidate.
 * These options apply equally to cached **methods**, **getters**, and **accessors**.
 * @property {number} [timeout]
 *  Duration in milliseconds after which the cached value automatically expires.
 *  Useful for time-based caching where values should refresh periodically.
 * @property {string | string[]} [onEvent]
 *  One or more event names (space-separated string or array) that, when fired on the instance,
 *  immediately clear the cache.
 *  This allows integration with custom event systems or reactive models.
 * @property {() => boolean | Promise<boolean>} [onCallback]
 *  Function (sync or async) periodically called to decide whether to invalidate the cache.
 *  If it returns `true`, the cache is cleared.
 * @property {number} [onCallbackFrequency]
 *  Frequency in milliseconds at which `onCallback` should be executed.
 *  Ignored if `onCallback` is not provided.
 * @property {string | Function | (string | Function)[]} [onFieldChange]
 *  One or more property names or methods to watch for changes.
 *  Whenever any of these fields or functions change, the cache for the decorated member is cleared.
 *  Can be a string, a function reference, or an array of both.
 * @property {boolean} [clearOnNextFrame]
 *  If `true`, clears the cache automatically on the **next animation frame** (or equivalent microtask fallback).
 *  Useful when the cached value is only valid for the current render/update cycle.
 */

/**
 * @typedef {Object} KeyType
 * @group Core Types
 * @category Primitives
 *
 * @description Any value usable as an object key. Key paths throughout the MVC layer — model data,
 * observers, {@link GradumNestedMap} — are arrays of these.
 */

/**
 * @typedef {Object} FlatKeyType
 * @group Core Types
 * @category Primitives
 *
 * @description A whole key path collapsed into one value, so a nested entry can be addressed without an
 * array. Fully numeric paths flatten to a number; anything else to a `"k0|k1|k2"` string.
 */

/**
 * @typedef {Object} FlexRect
 * @group Core Types
 * @category Primitives
 *
 * @description A rectangle where every field is optional, for describing only the edges you care about.
 * Sides and dimensions may be mixed, and any that are omitted are left to the caller to infer.
 * @property {number} [top] - Distance from the top edge.
 * @property {number} [bottom] - Distance from the bottom edge.
 * @property {number} [left] - Distance from the left edge.
 * @property {number} [right] - Distance from the right edge.
 * @property {number} [x] - Horizontal origin.
 * @property {number} [y] - Vertical origin.
 * @property {number} [width] - Width of the rectangle.
 * @property {number} [height] - Height of the rectangle.
 */

/**
 * @typedef {Object} Coordinate
 * @group Core Types
 * @category Primitives
 *
 * @template Type - The type of each component. Defaults to `number`.
 * @description A pair of values on the x and y axes. Generic so the same shape can carry something other
 * than numbers, such as a coordinate per axis expressed as a range.
 * @property {Type} x - The horizontal component.
 * @property {Type} y - The vertical component.
 */

/**
 * @typedef {Object} PartialRecord
 * @group Core Types
 * @category Primitives
 *
 * @template {keyof any} Property - The union of allowed keys.
 * @template Value - The type stored at each key.
 * @description A `Record` whose every key is optional. Use it to accept any subset of a known set of keys.
 */

/**
 * @typedef {Object} GradumModelProxy
 * @group MVC
 * @category Model
 *
 * @template {object} DataType - The type of the wrapped data.
 * @template {KeyType} IdType - The type of the data's ID.
 * @description Plain data that reads and writes through a {@link GradumModel}, as returned by
 * {@link GradumModel.from}. Use the keys of the data directly; reach the backing model through `$model`.
 * @property {GradumModel} $model - The model backing this data.
 */

/**
 * @typedef {Object} GradumModelProperties
 * @group MVC
 * @category Model
 *
 * @template DataType - The type of data stored in the model.
 * @template IdType - The type of the data's ID.
 * @description Configuration object used when creating a {@link GradumModel}.
 * @property {IdType} [id] - Optional ID attached to the model. Useful to reference the data in a nested structure.
 * @property {DataType} [data] - Initial data.
 * @property {boolean} [initialize] - If true, {@link GradumModel.initialize} is called immediately after
 * construction.
 */

/**
 * @typedef {Object} GradumObserverProperties
 * @group MVC
 * @category Model
 *
 * @template DataType - The type of data handled by the observer.
 * @template {object} ComponentType - The instance type created and managed by the observer.
 * @template {KeyType} DataKeyType - The per-item key type.
 * @description Options and lifecycle callbacks used to create a new {@link GradumObserver}.
 * *Note: `self` is the second argument of `onAdded` but the third of `onUpdated` and `onDeleted`, which take
 * the existing instance in second place.*
 * @property {new (...args: any[]) => GradumObserver<DataType, ComponentType, DataKeyType>} [customConstructor] -
 * Observer subclass to instantiate instead of the default {@link GradumObserver}.
 * @property {number} [depth] - How many levels below the attached path to watch. Defaults to the depth
 * implied by the key path the observer is registered on.
 * @property {boolean} [initialize] - If `true`, the observer is initialized on creation, so it immediately
 * reports every entry already present.
 * @property {(data: DataType, self: GradumObserver, ...keys: KeyType[]) => ComponentType | void} [onAdded] -
 * Called when a change is reported at a key path with no instance yet. Return an instance to have it stored
 * and handed back to later callbacks.
 * @property {(data: DataType, instance: ComponentType, self: GradumObserver, ...keys: KeyType[]) => void} [onUpdated] -
 * Called when an entry that already has an instance changes.
 * @property {(data: DataType, instance: ComponentType, self: GradumObserver, ...keys: KeyType[]) => void} [onDeleted] -
 * Called when an entry is removed.
 * @property {(prevData: DataType, newData: DataType, instance: ComponentType, self: GradumObserver, ...keys: KeyType[]) => boolean} [replaceOnUpdate] -
 * Called before `onUpdated`. Return `true` to destroy the existing instance and create a fresh one through
 * `onAdded` instead of updating it in place.
 * @property {(self: GradumObserver) => void} [onInitialize] - Called when the observer is initialized.
 * @property {(self: GradumObserver) => void} [onDestroy] - Called when the observer is destroyed.
 */

/**
 * @typedef {Object} SignalEntry
 * @group Decorators
 * @category Signal
 *
 * @template Type - The type of the value held by the signal.
 * @description The read/write/subscribe surface shared by every signal. {@link SignalBox} adds
 * the ergonomic wrappers on top of this.
 * @property {() => Type} get - Read the current value.
 * @property {(value: Type) => void} set - Store a new value. Subscribers run only if the value actually changed.
 * @property {(updater: (previous: Type) => Type) => void} update - Store a new value derived from the previous one.
 * @property {(fn: SignalSubscriber) => () => void} sub - Subscribe to change notifications. Returns a function that
 * unsubscribes.
 * @property {() => void} emit - Notify subscribers without changing the value. Use it after mutating structural
 * data in place, which `set` cannot detect.
 *
 * @example
 * ```ts
 * const count: SignalEntry<number> = signal(0);
 * const unsub = count.sub(() => console.log("count:", count.get()));
 * count.set(1); // logs "count: 1"
 * count.update(c => c + 1); // logs "count: 2"
 * unsub();
 * ```
 */

/**
 * @typedef {Object} SignalBox
 * @group Decorators
 * @category Signal
 *
 * @template Type - The type of the value held by the signal.
 * @description A {@link SignalEntry} that can also be used directly as its underlying value. It
 * coerces to the inner value in string, number, and JSON contexts, so it can usually be dropped in
 * wherever the raw value was expected.
 * @property {Type} value - The current value. Mirrors `get()` and `set()`.
 * @property {() => Type} toJSON - The raw value, used by `JSON.stringify`.
 * @property {() => Type} valueOf - The raw value, used in arithmetic and comparison.
 * @property {(hint: "default" | "number" | "string") => string | number} [Symbol.toPrimitive] - Coerces to a number
 * for the `"number"` hint, and to a string for `"string"` and `"default"`.
 *
 * @example
 * ```ts
 * const count: SignalBox<number> = signal(0);
 *
 * // Read
 * console.log(count.get()); // 0
 * console.log(count.value); // 0
 * console.log(+count); // 0
 *
 * // Write
 * count.set(5);
 * count.value = 6;
 * count.update(v => v + 1); // 7
 *
 * // JSON / string
 * console.log(`${count}`); // "7"
 * console.log(JSON.stringify(count)); // 7
 *
 * // Reactivity
 * const unsub = count.sub(() => console.log("changed to", count.get()));
 * count.set(8); // triggers subscriber
 * unsub();
 * ```
 */

/**
 * @typedef {Object} GradumViewProperties
 * @group MVC
 * @category View
 *
 * @template {object} ElementType - The type of the element the view renders.
 * @template {GradumModel} ModelType - The element's model type.
 * @template {GradumEmitter} EmitterType - The element's emitter type.
 * @description Properties used to construct a {@link GradumView}.
 * @property {ElementType} element - The element this view renders into.
 * @property {ModelType} [model] - The model the view reads from. Omit for a view with no state of its own.
 * @property {EmitterType} [emitter] - The emitter shared with the element and its operators.
 */

/**
 * @typedef {Object} GradumOperatorProperties
 * @group MVC
 * @category Operator
 *
 * @extends {GradumViewProperties}
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description  Options used to create a new {@link GradumOperator} attached to an element.
 * @property {ViewType} [view] - The MVC view.
 */

/**
 * @typedef {Object} PreventDefaultOptions
 * @group GradumSelector
 * @category Events
 *
 * @description Options for {@link GradumSelector.preventDefault}, which prevents default browser behaviors for
 * selected event types and can optionally stop propagation.
 * @property {string[]} [types] - List of event types to affect. If omitted, defaults to {@link BasicInputEvents}.
 * @property {"capture" | "bubble"} [phase] - Which phase to prevent. Defaults to `"bubble"`.
 * @property {false | "stop" | "immediate"} [stop] - Whether to stop propagation when handling the event:
 * - `false`: do not stop propagation,
 * - `"stop"`: call `stopPropagation`,
 * - `"immediate"`: call `stopImmediatePropagation`.
 * @property {(type: string, e: Event) => boolean} [preventDefaultOn] - Predicate to decide (per event) whether to
 * call `preventDefault`. Return `true` to prevent default for that event.
 * @property {boolean} [clearPreviousListeners] - If true, clears previously installed prevent-default listeners
 * before installing new ones.
 * @property {GradumEventManager} [manager] - Event manager to use. Defaults to {@link GradumEventManager.instance}.
 */

/**
 * @typedef {Object} ListenerProperties
 * @group Components
 * @category Data Structures
 *
 * @template {Node} TargetType - The type of the event target.
 * @template {ListenerCallback<TargetType>} CallbackType - The type of the callback executed by this listener.
 * @description Configuration object used to construct a {@link Listener}.
 * @property {string} type - Event type (e.g., `"click"`, `"pointermove"`).
 * @property {CallbackType} callback - Listener callback.
 * @property {TargetType} [target] - Target node.
 * @property {string} [toolName] - Tool name to bind this listener to (if applicable).
 * @property {ListenerOptions} [options] - Options controlling registration and execution behaviors.
 * @property {GradumEventManager} [manager] - Event manager to use. Defaults to {@link GradumEventManager.instance}.
 */

/**
 * @typedef {Object} MatchListenerProperties
 * @group Components
 * @category Data Structures
 *
 * @extends ListenerProperties
 * @template {Node} TargetType - The type of the event target.
 * @template {ListenerCallback<TargetType>} CallbackType - The type of the callback executed by this listener.
 * @description A partial {@link ListenerProperties} used as a search pattern by {@link Listener.match}.
 * Only the fields present are compared, so an empty pattern matches every listener.
 * @property {string[]} [optionsToSkip] - Option keys to ignore when comparing `options`.
 */

/**
 * @typedef {Object} ListenerOptions
 * @group Components
 * @category Data Structures
 * @extends AddEventListenerOptions
 * @description Options used for listeners.
 * @property {boolean} [checkConstrainers] - If true, checks constrainers before execution. Defaults to true.
 * @property {boolean} [solveConstrainers] - If true, triggers constrainer solving after execution. Defaults to true.
 * @property {number} [throttleEveryFrames] - Throttle execution to at most once every N animation frames.
 * @property {number} [throttleEveryMs] - Throttle execution to at most once every N milliseconds.
 */

/**
 * @typedef {Object} GradumInteractorProperties
 * @group MVC
 * @category Interactor
 *
 * @extends {GradumOperatorProperties}
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description  Options used to create a new {@link GradumInteractor} attached to an element.
 * @property {string} [toolName] - The name of the tool (if any) that the event listeners will listen for.
 * @property {Node} [target] - The target that will listen for the events. Defaults to `this.element`.
 * @property {PartialRecord<DefaultEventNameKey, ListenerOptions>} [listenerOptions] - Custom default options to define
 * for all listeners.
 * @property {GradumEventManager} [manager] - The event manager instance the listeners should register against. Defaults
 * to `GradumEventManager.instance`.
 */

/**
 * @typedef {Object} MakeToolOptions
 * @group GradumSelector
 * @category Tools
 *
 * @description Options used to create a new tool attached to an element via {@link GradumSelector.makeTool}.
 * @property {() => void} [onActivate] - Function to execute when the tool is activated.
 * @property {() => void} [onDeactivate] - Function to execute when the tool is deactivated.
 * @property {DefaultEventNameEntry} [activationEvent] - Custom activation event to listen to. Defaults to the
 * default click event name.
 * @property {ClickMode} [clickMode] -  Click mode that will hold this tool when activated. Defaults to `ClickMode.left`.
 * @property {(element: Gradum<Element>, manager: GradumEventManager) => void} [customActivation] - Custom activation
 * function. If provided, is called with `(el, manager)` to define when the tool is activated.
 * @property {string} [key] - Optional keyboard key to map to this tool. When pressed, it will be set as the current key tool.
 * @property {GradumEventManager} [manager] - The event manager instance this tool should register against. Defaults
 * to `GradumEventManager.instance`.
 */

/**
 * @typedef {Object} ToolBehaviorCallback
 * @group GradumSelector
 * @category Tools
 *
 * @description Function signature for a tool behavior. Returning `true` marks the behavior as handled/consumed,
 * leading to stopping the propagation of the event.
 * @param {Event} event - The original DOM/Gradum event.
 * @param {Node} target - The node the behavior should operate on (the object or its embedded target).
 * @param {ToolBehaviorOptions} [options] - Additional info (embedded context, etc.).
 * @returns {boolean} Whether to stop the propagation.
 */

/**
 * @typedef {Object} ToolBehaviorOptions
 * @group GradumSelector
 * @category Tools
 *
 * @description Options object passed to tool behaviors at execution time.
 * @property {boolean} [isEmbedded] - Indicates if the tool is embedded in a target node.
 * @property {Node} [embeddedTarget] - The target of the tool, if it is embedded.
 */

/**
 * @typedef {Object} GradumToolProperties
 * @group MVC
 * @category Tool
 *
 * @extends GradumOperatorProperties
 * @extends MakeToolOptions
 *
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description Options used to create a new {@link GradumTool} attached to an element.
 * @property {string} [toolName] - The name of the tool.
 * @property {Node} [embeddedTarget] - If the tool is embedded, its target.
 */

/**
 * @typedef {Object} GradumConstrainerProperties
 * @group MVC
 * @category Constrainer
 *
 * @extends GradumOperatorProperties
 * @extends MakeConstrainerOptions
 *
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description Options used to create a new {@link GradumConstrainer} attached to an element.
 * @property {string} [constrainerName] - The name of the constrainer.
 */

/**
 * @typedef {Object} NodeListType
 * @group Components
 * @category Data Structures
 *
 * @template {object} EntryType - The type of the nodes held in the collection.
 * @description Anything a {@link GradumNodeList} accepts as a source of entries: another list, a live DOM
 * `HTMLCollection` or `NodeListOf`, a `Set`, or a plain array. Live DOM collections keep reflecting the
 * document after being added, so the list stays in sync with them.
 */

/**
 * @typedef {Object} NodeListSlot
 * @group Components
 * @category Data Structures
 *
 * @template {object} EntryType - The type of the nodes held in the collection.
 * @description One slot of a {@link GradumNodeList}: either a single entry, or a whole sub-collection
 * counted as one position. Unlike {@link NodeListType} it excludes `Set` and array, which are flattened
 * into individual slots when added.
 */

/**
 * @typedef {Object} SVGTagMap
 * @group Core Types
 * @category SVG Tags
 *
 * @description The SVG tag-to-element map, minus `style`. That one tag is excluded because it collides
 * with the HTML `<style>` element of the same name, which would make the combined tag maps ambiguous.
 */

/**
 * @typedef {Object} ElementTagDefinition
 * @group Core Types
 * @category Element Tags
 * @description Represents an element's definition of its tag and its namespace (both optional).
 * @property {string} [tag="div"] - The HTML tag of the element (e.g., "div", "span", "input"). Defaults to "div."
 * @property {string} [namespace] - The namespace of the element. Defaults to HTML. If "svgManipulation" or "mathML"
 * is provided, the corresponding namespace will be used to create the element. Otherwise, the custom namespace
 * provided will be used.
 */

/**
 * @typedef {Object} GradumElementTagNameMap
 * @group Core Types
 * @category Element Tags
 *
 * @description Maps custom element tag names to their classes. Empty by design — every component adds its
 * own entry by augmenting this interface, which is what folds custom tags into {@link ElementTagMap} so
 * they resolve to a concrete class. Augment it the same way to make your own elements type-aware.
 *
 * @example
 * ```ts
 * declare module "gradum-kit" {
 *    interface GradumElementTagNameMap {
 *       "my-widget": MyWidget;
 *    }
 * }
 * ```
 */

/**
 * @typedef {Object} GradumElementPropertiesMap
 * @group Core Types
 * @category Element Tags
 *
 * @description Maps custom element tag names to their properties types, the counterpart of
 * {@link GradumElementTagNameMap}. Augment it alongside that one so the properties accepted when creating
 * your element are resolved from its tag.
 */

/**
 * @typedef {Object} CloneElementOptions
 * @group GradumSelector
 * @category Element
 *
 * @description Controls what {@link GradumSelector.clone} carries over to the copy. By default a clone gets
 * the origin's own fields but shares object and node references; these options let you deepen or narrow
 * that per field.
 * @property {PropertyKey[]} [exclude] - Fields to leave off the clone entirely.
 * @property {PropertyKey[]} [forceInclude] - Fields to copy even though they would normally be skipped.
 * @property {PropertyKey[]} [deepClone] - Fields to deep-clone rather than copy by reference.
 * @property {PropertyKey[]} [copyReference] - Fields to copy by reference even under a deep-clone setting.
 * @property {boolean} [copyNodes] - Whether to copy fields holding DOM nodes.
 * @property {boolean} [deepCloneObjects] - Whether to deep-clone every object-valued field.
 * @property {boolean} [deepCloneNodes] - Whether to deep-clone every node-valued field.
 * @property {boolean} [snapshotData] - Whether the clone's model gets a detached snapshot of the data
 * instead of a live reference. See the note on the field.
 */

/**
 * @typedef {Object} FeedforwardProperties
 * @group GradumSelector
 * @category Element
 *
 * @extends GradumElementProperties
 * @description Controls the preview element {@link GradumSelector.feedforward} produces — everything
 * {@link GradumElementProperties} accepts, plus how the preview is cloned, wrapped, and torn down. Used to
 * show the user what an interaction is about to do before they commit to it.
 * @property {boolean} [removeOnPointerRelease] - Whether the preview removes itself when the pointer is released.
 * @property {string} [type] - A label identifying the kind of feedforward, for callers that show several.
 * @property {CloneElementOptions} [cloneOptions] - How to clone the origin element into the preview.
 * @property {boolean} [wrap] - Whether to wrap the clone in a positioning wrapper. See the note on the field.
 */

/**
 * @typedef {Object} GradumProperties
 * @group GradumSelector
 * @category Element
 *
 * @template {ValidTag} Tag - The HTML (or other) tag of the element, if passing it as a property. Defaults to "div".
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {object} DataType - The element's data type, if any.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description Object containing properties for configuring an Element. A tag (and
 * possibly a namespace) can be provided for element creation. Already-created elements will ignore these
 * properties if set.
 * Any HTML attribute can be passed as key to be processed by the class/function. The type has the following
 * described custom properties:
 * @property {string} [id] - The ID of the element.
 * @property {string | string[]} [classes] - The CSS class(es) to apply to the element (either a string of
 * space-separated classes or an array of class names).
 * @property {string} [style] - The inline style of the element. Use the css literal function for autocompletion.
 * @property {string} [stylesheet] - The associated stylesheet (if any) with the element. Declaring this property will
 * generate automatically a new style element in the element's corresponding root. Use the css literal function
 * for autocompletion.
 * @property {Record<string, EventListenerOrEventListenerObject | ((e: Event, el: Element) => boolean)>} [listeners]
 * - An object containing event listeners to be applied to this element.
 * @property {(e: Event, el: Element) => boolean} [onClick] - Click event listener.
 * @property {(e: Event, el: Element) => boolean} [onDrag] - Drag event listener.
 * @property {Element | Element[]} [children] - An array of child wrappers or elements to append to
 * the created element.
 * @property {Element} [parent] - The parent element to which the created element will be appended.
 * @property {string | Element} [out] - If defined, declares (or sets) the element in the parent as a field with the
 * given value as key.
 * @property {string} [text] - The text content of the element (if any).
 * @property {boolean} [shadowDOM] - If true, indicate that the element will be created under a shadow root.
 */

/**
 * @typedef {Object} GradumElementProperties
 * @group MVC
 * @category Element Classes
 *
 * @extends GradumProperties
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {object} DataType - The element's data type, if any.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description Object containing properties for configuring a custom HTML element. Is basically GradumProperties
 * without the tag.
 */

/**
 * @typedef {Object} MvcProperties
 * @group MVC
 * @category Configuration
 *
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description The set of MVC pieces attached to an element. Pass one to `defaultProperties` or to
 * {@link GradumSelector.setMvc} to declare which classes fill each role; read the assembled set back from
 * {@link GradumSelector.mvc}. Every role is optional, and each accepts either a ready-made instance or a
 * constructor to build one from.
 * @property {MvcInstanceOrConstructor<ViewType, GradumViewProperties>} [view] - The view (or view constructor) to attach.
 * @property {ModelType | (new (data?: any, dataBlocksType?: "map" | "array") => ModelType)} [model] - The model
 * (or model constructor) to attach.
 * @property {MvcInstanceOrConstructor<EmitterType, ModelType>} [emitter] - The emitter (or emitter constructor) to
 * attach. If not defined, a default GradumEmitter will be created.
 * @property {MvcManyInstancesOrConstructors<GradumOperator, GradumOperatorProperties>} [operators] - The
 * operator, constructor of operator, or array of the latter, to attach.
 * @property {MvcManyInstancesOrConstructors<GradumHandler, ModelType>} [handlers] - The
 * handler, constructor of handler, or array of the latter, to attach.
 * @property {MvcManyInstancesOrConstructors<GradumInteractor, GradumInteractorProperties>} [interactors] - The
 * interactor, constructor of interactor, or array of the latter, to attach.
 * @property {MvcManyInstancesOrConstructors<GradumTool, GradumToolProperties>} [tools] - The
 * tool, constructor of tool, or array of the latter, to attach.
 * @property {MvcManyInstancesOrConstructors<GradumConstrainer, GradumConstrainerProperties>} [constrainers] - The
 * constrainer, constructor of constrainer, or array of the latter, to attach.
 */

/**
 * @typedef {Object} MvcGenerationProperties
 * @group MVC
 * @category Configuration
 *
 * @extends MvcProperties
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {object} DataType - The element's data type, if any.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 * @description Everything {@link MvcProperties} accepts, plus the data to seed the model with and whether
 * to initialize. This is the shape {@link GradumSelector.setMvc} takes, so the pieces can be attached and
 * brought up in one call.
 * @property {DataType} [data] - The data to attach to the model.
 * @property {boolean} [initialize] - Whether to initialize the MVC pieces after setting them or not. Defaults to true.
 */

/**
 * @typedef {Object} GradumHeadlessProperties
 * @group MVC
 * @category Element Classes
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Object containing properties for configuring a headless (non-HTML) element, with possibly MVC properties.
 */

/**
 * @typedef {Object} GradumEventManagerStateProperties
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description Whether a {@link GradumEventManager} is running, and which native default actions it
 * suppresses while it does.
 * @property {boolean} [enabled=true] - Whether the manager processes input at all. Set it to `false` to
 * silence every Gradum event without tearing the manager down.
 * @property {boolean} [preventDefaultWheel=false] - Whether to call `preventDefault` on wheel input,
 * suppressing native page zoom and scroll.
 * @property {boolean} [preventDefaultMouse=false] - Whether to call `preventDefault` on mouse input.
 * @property {boolean} [preventDefaultTouch=false] - Whether to call `preventDefault` on touch input,
 * suppressing native scrolling and pinch-zoom.
 */

/**
 * @typedef {Object} EnabledGradumEventTypes
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description Which families of Gradum events a manager fires. The first four switch off input
 * *sources*; the last three switch off *interpretations* the manager derives from them, so you can keep
 * pointer input while dropping, say, drag events. All default to `true`.
 * @property {boolean} [keyEventsEnabled=true] - Whether keyboard input produces {@link GradumKeyEvent}s.
 * @property {boolean} [wheelEventsEnabled=true] - Whether wheel input produces {@link GradumWheelEvent}s.
 * @property {boolean} [mouseEventsEnabled=true] - Whether mouse input is processed.
 * @property {boolean} [touchEventsEnabled=true] - Whether touch input is processed.
 * @property {boolean} [clickEventsEnabled=true] - Whether click, long-press, and click start/end events fire.
 * @property {boolean} [dragEventsEnabled=true] - Whether drag and drag start/end events fire.
 * @property {boolean} [moveEventsEnabled=true] - Whether move events fire.
 */

/**
 * @typedef {Object} GradumEventManagerProperties
 * @group Event Handling
 * @category GradumEventManager
 *
 * @template {GradumEventManagerModel} ModelType - The manager's model type.
 * @description Properties used to construct a {@link GradumEventManager}. Combines the MVC properties of
 * a headless element with {@link GradumEventManagerStateProperties}, {@link EnabledGradumEventTypes}, and
 * the thresholds below.
 * @property {number} [moveThreshold=10] - How far, in pixels, a pointer must travel before the manager
 * treats the interaction as a drag rather than a click.
 * @property {number} [longPressDuration=500] - How long, in milliseconds, a pointer must be held still
 * before a long press fires.
 * @property {boolean | (() => boolean)} [authorizeEventScaling] - Whether fired events compute scaled
 * positions. Pass a callback to decide per event.
 * @property {(position: Point) => Point} [scaleEventPosition] - Converts a screen position into document
 * space for every event this manager fires. Set it to make events aware of a panned or zoomed canvas.
 */

/**
 * @typedef {Object} GradumEventManagerLockStateProperties
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description A {@link GradumEventManagerStateProperties} override held for the duration of one
 * interaction, together with the node that asked for it. Locking lets an element impose its own
 * prevent-default and enabled settings mid-gesture, then hand them back.
 * @property {Node} [lockOrigin] - The node that established the lock, and the only one that can lift it.
 */

/**
 * @typedef {Object} SetToolOptions
 * @group Event Handling
 * @category GradumEventManager
 *
 * @description Options for {@link GradumEventManager.setTool}, controlling the side effects of making a
 * tool current beyond the assignment itself.
 * @property {boolean} [select=true] - Whether to visually select the tool on every toolbar showing it.
 * @property {boolean} [activate=true] - Whether to fire the tool's activation callback.
 * @property {boolean} [setAsNoAction] - Whether the tool also becomes the one used for
 * `ClickMode.none`. Defaults to `true` when the click mode is `ClickMode.left`.
 */

/**
 * @typedef {Object} GradumRawEventProperties
 * @group Event Handling
 * @category GradumEvents
 *
 * @description The fields every Gradum event is built from. The concrete property types
 * ({@link GradumEventProperties}, {@link GradumDragEventProperties}, ...) extend this with whatever
 * positional data their event carries.
 * @property {ClickMode} [clickMode] - The pointer button or input mode the event belongs to. Defaults to
 * the manager's current click mode.
 * @property {InputDevice} [inputDevice] - The device that produced the event. Defaults to
 * `InputDevice.unknown`.
 * @property {string[]} [keys] - Keys held when the event fired. Defaults to the manager's current keys.
 * @property {GradumEventNameEntry} [eventName] - The name the event is dispatched under.
 * @property {GradumEventManager} [eventManager] - The manager firing the event. Defaults to
 * {@link GradumEventManager.instance}.
 * @property {string} [toolName] - The tool the event is attributed to, if any.
 * @property {boolean | (() => boolean)} [authorizeScaling=true] - Whether scaled positions are computed.
 * Pass a callback to decide per read.
 * @property {(position: Point) => Point} [scalePosition] - Converts a screen position into document
 * space. Defaults to returning the position unchanged.
 * @property {EventInit} [eventInitDict] - Native event options, merged over the defaults of `bubbles`
 * and `cancelable` set to `true`.
 */

/**
 * @typedef {Object} GradumEventProperties
 * @group Event Handling
 * @category GradumEvents
 *
 * @description Properties used to construct a {@link GradumEvent}. Extends
 * {@link GradumRawEventProperties} with the single point the event happened at.
 * @property {Point} [position] - The screen position the event was fired from.
 */

/**
 * @typedef {Object} GradumDragEventProperties
 * @group Event Handling
 * @category GradumEvents
 *
 * @description Properties used to construct a {@link GradumDragEvent}. Each map is keyed by pointer id,
 * so a multi-touch drag carries one entry per finger.
 * @property {GradumMap<number, Point>} [origins] - Where each pointer started its drag.
 * @property {GradumMap<number, Point>} [previousPositions] - Where each pointer was on the previous event.
 * @property {GradumMap<number, Point>} [positions] - Where each pointer is now. Its first entry becomes
 * the event's `position`.
 */

/**
 * @typedef {Object} GradumKeyEventProperties
 * @group Event Handling
 * @category GradumEvents
 *
 * @description Properties used to construct a {@link GradumKeyEvent}. Exactly one of the two keys is set,
 * depending on whether the event is a press or a release.
 * @property {string} [keyPressed] - The key that was pressed.
 * @property {string} [keyReleased] - The key that was released.
 */

/**
 * @typedef {Object} GradumWheelEventProperties
 * @group Event Handling
 * @category GradumEvents
 *
 * @description Properties used to construct a {@link GradumWheelEvent}.
 * @property {Point} [delta] - How far the wheel or trackpad scrolled, per axis.
 */

/**
 * @typedef {Object} MakeConstrainerOptions
 * @group GradumSelector
 * @category Constrainers
 *
 * @description Options for turning an object into a constrainer with
 * {@link GradumSelector.makeConstrainer}.
 * @property {() => void} [onActivate] - Callback function to execute when the constrainer is activated.
 * @property {() => void} [onDeactivate] - Callback function to execute when the constrainer is deactivated.
 * @property {number} [priority] - The priority of the constrainer. Higher priority constrainers (lower number) should
 * be resolved first. Defaults to 10.
 * @property {boolean} [active] - Whether the constrainer is active. Defaults to true.
 * @property {GradumConstrainer} [attachedInstance] - The optional GradumConstrainer instance to attach to the constrainer.
 */

/**
 * @typedef {Object} ConstrainerCallbackProperties
 * @group GradumSelector
 * @category Constrainers
 *
 * @description The context handed to a solver as its first argument, naming the constrainer, the object
 * being processed, and the event that triggered it. Passed when solving through
 * {@link GradumSelector.solveConstrainer}.
 * @property {string} [constrainer] - The targeted constrainer. Defaults to `currentConstrainer`.
 * @property {object} [constrainerHost] - The object to which the target constrainer is attached.
 * @property {object} [target] - The current object being processed by the solver. Property set by
 * {@link GradumSelector.solveConstrainer} when processing every object in the constrainer's list.
 * @property {Event} [event] - The event (if any) that fired the resolving of the constrainer.
 * @property {string} [eventType] - The type of the event.
 * @property {Node} [eventTarget] - The target of the event.
 * @property {string} [toolName] - The name of the active tool when the event was fired.
 * @property {ListenerOptions} [eventOptions] - The options of the event.
 * @property {GradumEventManager} [manager] - The event manager that captured the event. Defaults to the first
 * instantiated event manager.
 */

/**
 * @typedef {Object} ConstrainerMutatorProperties
 * @group GradumSelector
 * @category Constrainers
 *
 * @extends ConstrainerCallbackProperties
 * @template Type - The type of the value to mutate.
 * @description The context handed to a mutator as its first argument, naming which mutator to run and the
 * value it should transform. Passed when mutating through {@link GradumSelector.mutate}.
 * @property {string} [mutation] - The name of the mutator to execute.
 * @property {Type} [value] - The value to mutate.
 */

/**
 * @typedef {Object} ConstrainerAddCallbackProperties
 * @group GradumSelector
 * @category Constrainers
 * @template {ConstrainerChecker | ConstrainerMutator | ConstrainerSolver} Type - The type of callback.
 *
 * @description Options for registering a checker, mutator, or solver on an existing constrainer.
 * @property {string} [name] - The name of the callback to add.
 * @property {Type} [callback] - The callback to add.
 * @property {string} [constrainer] - The constrainer to add the callback to.
 * @property {number} [priority] - The priority of the callback.
 */

/**
 * @typedef {Object} DefineOptions
 * @group Decorators
 * @category Registry
 *
 * @description Options object for the {@link define} decorator and imperative function.
 * @property {boolean} [injectAttributeBridge=true] - Whether to inject an `attributeChangedCallback`
 * into the class prototype if one is not already present. When enabled, HTML attribute changes are
 * automatically mirrored to their associated `@observe`-decorated fields, and vice versa.
 */

/**
 * @typedef {Object} RegistryEntry
 * @group Decorators
 * @category Registry
 *
 * @description Represents a single entry in the Gradum Kit class registry, as stored and returned
 * by {@link findRegistered} and related query functions.
 * @property {new (...args: any[]) => any} constructor - The registered class constructor.
 * @property {RegistryCategory | string} category - The category the class was registered under, either
 * passed explicitly to {@link define} or inferred from its inheritance chain. It is a plain string when
 * a custom category was supplied.
 * @property {string} name - The registered name of the class, used as the registry key.
 * Typically the class name as passed to {@link define}.
 * @property {string} [tag] - The custom element tag name associated with this class.
 * Only present for classes registered as custom HTML elements via {@link define}.
 */

/**
 * @typedef {Object} StylesRoot
 * @group GradumSelector
 * @category Style
 *
 * @description A type that represents entities that can hold a <style> object (Shadow root or HTML head).
 */

/**
 * @typedef {Object} StylesType
 * @group GradumSelector
 * @category Style
 *
 * @description A type that represents the types that are accepted as styles entries (mainly by the
 * HTMLElement.setStyles()
 * method). It includes strings, numbers, and records of CSS attributes to strings or numbers.
 */

/**
 * @typedef {Object} GradumIconProperties
 * @group Components
 * @category Basics
 *
 * @extends GradumElementProperties
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumIcon}. Values left out fall back to
 * {@link GradumIcon.defaultProperties}.
 * @property {string} icon - Name of the icon, file extension included to override the resolved type.
 * @property {string} [iconColor] - Color applied to the icon.
 * @property {(svg: SVGElement) => void} [onLoaded] - Called with the loaded SVG element, to modify it once
 * it is available. Ignored for icons that are not SVGs.
 * @property {string} [type] - File type of the icon, used when the name carries no extension.
 * @property {string} [directory] - Directory the icon is loaded from.
 */

/**
 * @typedef {Object} GradumRichElementProperties
 * @group Components
 * @category Basics
 *
 * @extends GradumElementProperties
 * @template {ValidTag} ElementTag - The tag of the main element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumRichElement} — a main element flanked by up to
 * four optional slots. They are laid out left to right in the order below.
 * @property {ElementTag} [elementTag] - The HTML tag used for the main element when `element` is a string
 * or a properties object.
 * @property {string} [text] - Text content of the main element.
 * @property {Element | Element[]} [leftCustomElements] - Elements placed leftmost, before `leftIcon`.
 * @property {string | GradumIcon} [leftIcon] - Icon placed left of the main element. A string is treated as
 * an icon name or path.
 * @property {string | HTMLElement} [prefixEntry] - Content placed immediately before the main element.
 * @property {string | GradumProperties<ElementTag> | ValidElement<ElementTag>} [element] - The main element:
 * its text, the properties to build it from, or an existing element to adopt.
 * @property {string | HTMLElement} [suffixEntry] - Content placed immediately after the main element.
 * @property {string | GradumIcon} [rightIcon] - Icon placed right of the main element. A string is treated as
 * an icon name or path.
 * @property {Element | Element[]} [rightCustomElements] - Elements placed rightmost, after `rightIcon`.
 */

/**
 * @typedef {Object} StateSpecificProperty
 * @group Components
 * @category Reifects
 *
 * @template Type - The type of the configured value.
 * @template {object} ClassType - The type of the attached object.
 * @description A value for one state: either a fixed value, or a {@link ReifectInterpolator} that computes
 * it per object.
 */

/**
 * @typedef {Object} BasicPropertyConfig
 * @group Components
 * @category Reifects
 *
 * @template Type - The type of the configured value.
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @description A property configured either per state, or as one value shared by every state. The
 * interpolator-free counterpart of {@link PropertyConfig}.
 */

/**
 * @typedef {Object} PropertyConfig
 * @group Components
 * @category Reifects
 *
 * @template Type - The type of the configured value.
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description How a single reifect property may be configured: one value for every state, a value per
 * state (each optionally interpolated per object), or a single {@link StateInterpolator} covering both.
 */

/**
 * @typedef {Object} ReifectObjectData
 * @group Components
 * @category Reifects
 *
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description The bookkeeping a {@link StatefulReifect} keeps for one attached object. The object is held
 * weakly, so attaching a reifect does not keep it alive once the rest of the application drops it.
 * @property {WeakRef<ClassType>} object - Weak reference to the attached object.
 * @property {ReifectEnabledObject} enabled - Which parts of the reifect apply to this object.
 * @property {State} [lastState] - The state the object was last switched to.
 * @property {ReifectObjectComputedProperties<State, ClassType>} [resolvedValues] - The per-state values
 * resolved for this object, so interpolated configurations are computed once rather than on every switch.
 * @property {number} [index] - The object's position among the attached objects.
 * @property {number} [total] - How many objects are attached in total.
 * @property {ReifectOnSwitchCallback<State, ClassType>} [onSwitch] - Called when this object switches state.
 * @property {() => void} [disposeEffect] - Tears down the effect tracking this object's reactive values.
 */

/**
 * @typedef {Object} StatefulReifectCoreProperties
 * @group Components
 * @category Reifects
 *
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description What a {@link StatefulReifect} applies to its objects on each state switch. Beyond the
 * named entries, any other key is treated as a property to set on the object itself.
 * @property {PropertyConfig<StylesType, State, ClassType>} [styles] - Inline styles to apply per state.
 * @property {PropertyConfig<string | string[], State, ClassType>} [classes] - CSS classes to toggle per state.
 * @property {PropertyConfig<ClassType, State, ClassType>} [replaceWith] - An object to swap the attached one
 * out for, per state.
 */

/**
 * @typedef {Object} StatefulReifectProperties
 * @group Components
 * @category Reifects
 *
 * @extends StatefulReifectCoreProperties
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description Options for constructing a {@link StatefulReifect}: everything it applies per state, plus
 * the states themselves and the objects to attach at creation.
 * @property {State[] | object} [states] - The available states, as an array or as an enum-like object.
 * @property {State | boolean} [initialState] - The state to start in.
 * @property {ClassType[]} [attachedObjects] - Objects to attach immediately.
 */

/**
 * @typedef {Object} ReifectAppliedOptions
 * @group Components
 * @category Reifects
 *
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description Options controlling one application of a reifect — how widely it reaches, and how much of
 * its cached per-object data it recomputes first.
 * @property {boolean} [attachObjects] - Attach any object passed in that is not attached yet.
 * @property {boolean} [executeForAll] - Apply to every attached object rather than only the one given.
 * @property {boolean} [recomputeIndices] - Recompute each object's index and total before applying.
 * @property {boolean} [recomputeProperties] - Re-resolve interpolated values before applying.
 * @property {boolean} [applyStylesInstantly] - Set styles directly instead of on the next frame, skipping
 * any CSS transition.
 * @property {StatefulReifectCoreProperties<State, ClassType>} [propertiesOverride] - Values to use for this
 * application in place of the reifect's own.
 */

/**
 * @typedef {Object} ReifectEnabledObject
 * @group Components
 * @category Reifects
 *
 * @description Which parts of a reifect apply to a given object. Set `global` to `false` to disable the
 * reifect for that object entirely; the rest switch off one category each.
 * @property {boolean} [global] - Whether the reifect applies at all.
 * @property {boolean} [properties] - Whether property values are applied.
 * @property {boolean} [styles] - Whether inline styles are applied.
 * @property {boolean} [classes] - Whether CSS classes are toggled.
 * @property {boolean} [replaceWith] - Whether object replacement is performed.
 */

/**
 * @typedef {Object} GradumIconSwitchProperties
 * @group Components
 * @category Basics
 *
 * @extends GradumIconProperties
 * @template {string | number | symbol} State - The set of states the icon can switch between.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumIconSwitch} — an icon that swaps its appearance as
 * its state changes.
 * @property {StatefulReifect<State, GradumIcon> | StatefulReifectProperties<State, GradumIcon>} [switchReifect] -
 * The reifect driving the transition between states, or the properties to build one from.
 * @property {State} [defaultState] - The state the icon starts in.
 * @property {boolean} [appendStateToIconName=false] - Whether the current state is appended to the icon name,
 * so each state loads its own icon file.
 */

/**
 * @typedef {Object} GradumInputProperties
 * @group Components
 * @category Basics
 *
 * @template {"input" | "textarea"} InputTag - The tag of the inner input element.
 * @template ValueType - The type the input's string value is converted to and from.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumInput}. Extends
 * {@link GradumRichElementProperties} without `element` and `elementTag`, which the input sets itself.
 * @property {InputTag} [inputTag="input"] - Whether the field is an `input` or a `textarea`.
 * @property {GradumProperties<InputTag> | ValidElement<InputTag>} [input] - Properties for the inner input
 * element, or an existing element to use instead of creating one.
 * @property {string} [label] - Text of the label shown next to the field.
 * @property {boolean} [locked=false] - Whether the field rejects user edits.
 * @property {boolean} [dynamicVerticalResize=false] - Whether the field grows to fit its content as the
 * user types. Meant for `textarea`.
 * @property {RegExp | string} [inputRegexCheck] - Pattern the value must match while typing. Input that
 * would break the match is rejected as it is entered.
 * @property {RegExp | string} [blurRegexCheck] - Pattern the value must match when the field loses focus.
 * @property {boolean} [selectTextOnFocus=false] - Whether focusing the field selects all of its text.
 * @property {ValueType} [value] - Initial value of the field.
 * @property {string} [type] - Value of the input's `type` attribute.
 * @property {string} [placeholder] - Text shown while the field is empty.
 * @property {string} [pattern] - Value of the input's `pattern` attribute.
 * @property {string} [size] - Value of the input's `size` attribute.
 */

/**
 * @typedef {Object} GradumLabelElementProperties
 * @group Components
 * @category Basics
 *
 * @extends GradumRichElementProperties
 * @template {ValidTag} ElementTag - The tag of the main element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumLabelElement} — a rich element paired with a
 * `label` bound to it.
 * @property {string} [label] - Text of the label shown next to the element.
 * @property {boolean} [locked=false] - Whether the element rejects user edits.
 */

/**
 * @typedef {Object} GradumNumericalInputProperties
 * @group Components
 * @category Basics
 *
 * @template ValueType - The type the input's string value is converted to and from.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumNumericalInput}. Extends
 * {@link GradumInputProperties} with the numeric constraints applied to the entered value.
 * @property {number} [multiplier=1] - Factor applied between the displayed value and the stored one.
 * @property {number} [decimalPlaces] - How many decimals the value is rounded to. Left unrounded if omitted.
 * @property {number} [min] - Lowest accepted value. The value is clamped to it.
 * @property {number} [max] - Highest accepted value. The value is clamped to it.
 */

/**
 * @typedef {Object} GradumSelectProperties
 * @group Components
 * @category Basics
 *
 * @template ValueType - The type of the value each entry carries.
 * @template SecondaryValueType - The type of the secondary value each entry carries.
 * @template {object} EntryType - The type of the entries themselves.
 * @description Properties to initialize a {@link GradumSelect}. Entries can be supplied directly through
 * `entries`, or generated from `values` using `createEntry`.
 * @property {string | string[]} [entriesClasses] - CSS class(es) added to every entry.
 * @property {string | string[]} [selectedEntriesClasses] - CSS class(es) added to entries while selected.
 * @property {HTMLCollection | NodeList | EntryType[]} [entries] - The entries to populate the select with.
 * @property {(ValueType | EntryType)[]} [values] - Values to build entries from, using `createEntry`.
 * @property {ValueType[]} [selectedValues] - Values selected initially.
 * @property {(entry: EntryType) => ValueType} [getValue] - Reads the value carried by an entry.
 * @property {(entry: EntryType) => SecondaryValueType} [getSecondaryValue] - Reads an entry's secondary value.
 * @property {(value: ValueType) => EntryType} [createEntry] - Builds an entry for a value in `values`.
 * @property {(entry: EntryType, index: number) => void} [onEntryAdded] - Called when an entry is added.
 * @property {(entry: EntryType) => void} [onEntryRemoved] - Called when an entry is removed.
 * @property {(entry: EntryType, e: Event) => void} [onEntryClicked] - Called when an entry is clicked.
 * @property {boolean} [multiSelection=false] - Whether more than one entry can be selected at a time.
 * @property {boolean} [forceSelection=false] - Whether at least one entry must stay selected, preventing
 * the last selected entry from being deselected.
 * @property {string} [inputName] - Name given to the underlying form inputs, to submit the selection with a form.
 * @property {Element} [parent] - Element the entries are appended to.
 * @property {(b: boolean, entry: EntryType, index: number) => void} [onSelect] - Called when an entry's
 * selected state changes, with the new state.
 * @property {(b: boolean, entry: EntryType, index: number) => void} [onEnabled] - Called when an entry's
 * enabled state changes, with the new state.
 */

/**
 * @typedef {Object} GradumSelectInputEventProperties
 * @group Components
 * @category Basics
 *
 * @extends GradumRawEventProperties
 * @template ValueType - The type of the value each entry carries.
 * @template SecondaryValueType - The type of the secondary value each entry carries.
 * @template {object} EntryType - The type of the entries themselves.
 * @description Properties to initialize a {@link GradumSelectInputEvent}, the event a select fires when
 * its selection changes.
 * @property {EntryType} toggledEntry - The entry whose selected state just changed.
 * @property {ValueType[]} values - The values selected after the change.
 */

/**
 * @typedef {Object} GradumSelectElementProperties
 * @group Components
 * @category Basics
 *
 * @extends GradumElementProperties
 * @extends GradumSelectProperties
 * @template ValueType - The type of the value held by each entry.
 * @template SecondaryValueType - The type of each entry's secondary value.
 * @template {HTMLElement} EntryType - The type of the entry elements.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties for configuring a {@link GradumSelectElement} — everything a selection accepts,
 * plus the element-level options and the classes applied to its entries.
 * @property {string | string[]} [entriesClasses] - CSS class(es) applied to every entry.
 * @property {string | string[]} [selectedEntriesClasses] - CSS class(es) applied to selected entries.
 */

/**
 * @typedef {Object} GradumContentSwitchProperties
 * @group Components
 * @category Containers
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties accepted when creating a {@link GradumContentSwitch}.
 * @property {ContentSwitchMode} [mode=ContentSwitchMode.fadeRight] - The transition played when the
 * selected entry changes.
 * @property {number} [transitionDuration=0.3] - How long that transition lasts, in seconds.
 * @property {StatefulReifect<Shown> | StatefulReifectProperties<Shown>} [transitionReifect] - The reifect
 * driving the transition. Pass an existing {@link StatefulReifect} to share one between components, or a
 * properties object to have one built.
 */

/**
 * @typedef {Object} ScopedKey
 * @group Components
 * @category Data Structures
 *
 * @template KeyType - The per-item key type.
 * @template BlockKeyType - The block-grouping key type.
 * @description An item key together with the block it belongs to, used to address an entry that is
 * scoped to one block rather than to the store as a whole.
 * @property {BlockKeyType} [blockKey] - The block the item belongs to. Omit it to target the default block.
 * @property {KeyType} [key] - The item's key inside that block.
 */

/**
 * @typedef {Object} BlockStoreType
 * @group Components
 * @category Data Structures
 *
 * @template {"array" | "map"} Type - How the blocks are stored. Defaults to `"map"`.
 * @template {object} BlockType - The type of one block.
 * @description The container a nested store keeps its blocks in, resolved from `Type`: a `Map` keyed by
 * block name for `"map"`, or a plain array indexed by position for `"array"`.
 */

/**
 * @typedef {Object} GradumDropdownProperties
 * @group Components
 * @category Menus
 *
 * @extends GradumProperties
 * @description Properties for configuring a Dropdown.
 * @property {(string | HTMLElement)} [selector] - Element or descriptor used as the dropdown selector. If a
 * string is passed, a Button with the given string as text will be assigned as the selector.
 * @property {HTMLElement} [popup] - The element used as a container for the dropdown entries.
 * @property {boolean} [multiSelection=false] - Enables selection of multiple dropdown entries.
 * @property {ValidTag} [selectorTag] - Custom HTML tag for the selector's text. Overrides the
 * default tag set in GradumConfig.Dropdown.
 * @property {string | string[]} [selectorClasses] - Custom CSS class(es) for the selector. Overrides the default
 * classes set in GradumConfig.Dropdown.
 * @property {string | string[]} [popupClasses] - Custom CSS class(es) for the popup container. Overrides the
 * default classes set in GradumConfig.Dropdown.
 */

/**
 * @typedef {Object} GradumButtonPopupProperties
 * @group Components
 * @category Basics
 *
 * @extends GradumRichElementProperties
 * @template {ValidTag} ElementTag - The tag of the main element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumButtonPopup} — a button that shows a popup when
 * activated. Adds the popup container to everything {@link GradumRichElementProperties} accepts.
 * @property {HTMLElement} [popup] - Element used as the popup container. One is created if omitted.
 * @property {string | string[]} [popupClasses] - CSS class(es) to add to the popup container.
 */

/**
 * @typedef {Object} Gradum
 * @group GradumSelector
 * @category Core
 *
 * @template {object} Type - The type of the wrapped object. Defaults to `Node`.
 * @description What {@link gradum} hands back: the wrapped object plus the whole selector API, intersected.
 * That means a wrapped element still answers to its own members — `el.textContent` works alongside
 * `el.addChild(...)` — so a `Gradum<HTMLDivElement>` can be used anywhere the raw element was.
 */

/**
 * @typedef {Object} GradumifyOptions
 * @group GradumSelector
 * @category Core
 *
 * @description Which families of selector functions {@link gradumify} should skip. Every family is installed
 * by default; set a flag to leave that family off the {@link GradumSelector} prototype. Excluding a family
 * means its functions simply do not exist, so only do it if you know nothing in your app calls them.
 * @property {boolean} [excludeHierarchyFunctions] - Skip `addChild`, `closest`, `childHandler`, and the rest of the DOM-hierarchy functions.
 * @property {boolean} [excludeMvcFunctions] - Skip `model`, `view`, `emitter`, and the MVC add/get/remove methods.
 * @property {boolean} [excludeStyleFunctions] - Skip `setStyle`, `setStyles`, `selected`, and `closestRoot`.
 * @property {boolean} [excludeClassFunctions] - Skip `addClass`, `removeClass`, `toggleClass`, and `hasClass`.
 * @property {boolean} [excludeElementFunctions] - Skip `setProperties`, `clone`, `destroy`, and `feedforward`.
 * @property {boolean} [excludeEventFunctions] - Skip `on`, `onTool`, `executeAction`, and `preventDefault`.
 * @property {boolean} [excludeToolFunctions] - Skip `makeTool`, `applyTool`, and `embedTool`.
 * @property {boolean} [excludeConstrainerFunctions] - Skip `makeConstrainer`, `solveConstrainer`, and `mutate`.
 * @property {boolean} [excludeMiscFunctions] - Skip `apply`, `applyDefaults`, `extract`, and `getDifference`.
 * @property {boolean} [excludeReifectFunctions] - Skip `show`, `applyReifect`, and `attachReifect`.
 */

/**
 * @typedef {Object} ChildHandler
 * @group GradumSelector
 * @category Hierarchy
 *
 * @description A type that represents all entities that can hold and manage children (an element or a shadow root).
 */

/**
 * @typedef {Object} ApplyDefaultsOptions
 * @group GradumSelector
 * @category Misc
 *
 * @description Options for {@link GradumSelector.applyDefaults}.
 * @property {string[]} [mergeProperties] - Array-like keys to merge. Defaults to {@link ApplyDefaultsMergeProperties}.
 * @property {boolean} [removeDuplicates] - Whether to remove duplicates when merging arrays. Defaults to `true`.
 */

/**
 * @typedef {Object} YDocumentProperties
 * @group Utilities
 * @category Yjs
 *
 * @template {GradumView} ViewType - The element's view type.
 * @template {object} DataType - The element's data type.
 * @template {GradumModel<DataType>} ModelType - The element's model type.
 * @template {GradumEmitter} EmitterType - The element's emitter type.
 * @description Properties for an element backed by a Y.js document. Everything
 * {@link GradumElementProperties} accepts, plus the document the element's data lives in.
 * @property {YDoc} document - The Y.js document backing this element.
 */

/**
 * @typedef {Object} FontProperties
 * @group Utilities
 * @category Font
 *
 * @description Describes a local font to load with {@link loadLocalFont} — either a single file or a whole
 * family living in one directory. Which of the two is inferred from `pathOrDirectory`: a path with a file
 * extension is treated as one font, a path without one as a directory of them.
 * @property {string} name - The font family name to register it under. For a family, each file must also be
 * named `name-subName`, matching the keys of `stylesPerWeights`.
 * @property {string} pathOrDirectory - Path to the font file, or to the directory holding the family.
 * @property {Record<string, string> | Record<number, Record<string, string>>} [stylesPerWeights] - For a single
 * font, a `{weight: style}` record, defaulting to `{"normal": "normal"}`. For a family, a
 * `{weight: {subName: style}}` record, defaulting to common sub-names and styles for weights 100 through 900.
 * @property {string} [format="woff2"] - The font format declared in the generated `@font-face` rule.
 * @property {string} [extension=".ttf"] - The file extension of the family's files. A missing leading dot is
 * added for you.
 */

import { AbstractType, Doc, Map as Map$1, Array as Array$1, YMapEvent, YArrayEvent } from 'yjs';
export { AbstractType as YAbstractType, Array as YArray, YArrayEvent, Doc as YDoc, YEvent, Map as YMap, YMapEvent, Text as YText } from 'yjs';

/**
 * @internal
 */
class AutoUtils {
    constructorMap = new WeakMap();
    constructorData(target) {
        let obj = this.constructorMap.get(target);
        if (!obj) {
            obj = { installed: new Map() };
            this.constructorMap.set(target, obj);
        }
        return obj;
    }
}

/**
 * @function isNull
 * @group Utilities
 * @category Null Check
 *
 * @description Check whether a value is `null`. Treats `undefined` as distinct, so pair it with
 * {@link isUndefined} to cover both.
 * @param {any} value - The value to test.
 * @returns {boolean} `true` if the value is `null`.
 */
function isNull(value) {
    return value === null;
}
/**
 * @function isUndefined
 * @group Utilities
 * @category Null Check
 *
 * @description Check whether a value is `undefined`. Uses a `typeof` test, so it is safe on names that were
 * never declared, and it does not treat `null` as undefined.
 * @param {any} value - The value to test.
 * @returns {boolean} `true` if the value is `undefined`.
 */
function isUndefined(value) {
    return typeof value == "undefined";
}
/**
 * @function alphabeticalSorting
 * @group Utilities
 * @category Sorting
 *
 * @description Comparator for `Array.prototype.sort` that orders keys naturally: strings by locale, numbers
 * by value, and symbols by their description. Pairs of mixed types are left in place.
 * @param {string | number | symbol} a - The first key.
 * @param {string | number | symbol} b - The second key.
 * @returns {number} A negative number, zero, or a positive number, as `sort` expects.
 */
function alphabeticalSorting(a, b) {
    if (typeof a === "symbol")
        a = String(a);
    if (typeof b === "symbol")
        b = String(b);
    if (typeof a == "string" && typeof b == "string")
        return a.localeCompare(b);
    else if (typeof a == "number" && typeof b == "number")
        return a - b;
    return 0;
}

/**
 * @function getFirstDescriptorInChain
 * @group Utilities
 * @category Prototype
 *
 * @description Find how a property is defined on an object or the closest ancestor that declares it, giving
 * you the getter, setter, or value rather than just the resolved result. The search starts at the object
 * itself and stops before `Object.prototype`, so inherited built-ins are never returned.
 * @param {object} object - The object to search from.
 * @param {PropertyKey} key - The property to look for.
 * @returns {PropertyDescriptor} The nearest descriptor, or `undefined` if nothing in the chain declares it.
 */
function getFirstDescriptorInChain(object, key) {
    let currentObject = object;
    while (currentObject && currentObject !== Object.prototype) {
        const descriptor = Object.getOwnPropertyDescriptor(currentObject, key);
        if (descriptor)
            return descriptor;
        currentObject = Object.getPrototypeOf(currentObject);
    }
    return undefined;
}
/**
 * @function hasPropertyInChain
 * @group Utilities
 * @category Prototype
 *
 * @description Check whether an object or any of its ancestors declares a property as its own. Unlike `in`,
 * the search stops before `Object.prototype`, so built-ins such as `toString` do not count as a match.
 * @param {object} object - The object to search from.
 * @param {PropertyKey} key - The property to look for.
 * @returns {boolean} `true` if the property is declared anywhere in the chain.
 */
function hasPropertyInChain(object, key) {
    let currentObject = object;
    while (currentObject && currentObject !== Object.prototype) {
        if (Object.prototype.hasOwnProperty.call(currentObject, key))
            return true;
        currentObject = Object.getPrototypeOf(currentObject);
    }
    return false;
}
/**
 * @function getFirstPrototypeInChainWith
 * @group Utilities
 * @category Prototype
 *
 * @description Find the nearest ancestor prototype that declares a property, skipping the object itself. Use
 * it to locate which class in a hierarchy a member came from.
 * @param {object} object - The object to search from.
 * @param {PropertyKey} key - The property to look for.
 * @returns {any} The nearest prototype declaring it, or `undefined` if none does.
 */
function getFirstPrototypeInChainWith(object, key) {
    let currentObject = Object.getPrototypeOf(object);
    while (currentObject && currentObject !== Object.prototype) {
        const descriptor = Object.getOwnPropertyDescriptor(currentObject, key);
        if (descriptor)
            return currentObject;
        currentObject = Object.getPrototypeOf(currentObject);
    }
    return undefined;
}
/**
 * @function getSuperMethod
 * @group Utilities
 * @category Prototype
 *
 * @description Find the inherited implementation a wrapper is standing in for, so a decorator or patched
 * method can call through to it. The wrapper itself is skipped, which is what stops a patched method from
 * finding and recursing into itself.
 * @param {object} object - The object whose ancestors to search.
 * @param {PropertyKey} key - The member to look for.
 * @param {Function} wrapperFn - The wrapping function to skip over.
 * @returns {Function} The inherited implementation, or `undefined` if there is none.
 */
function getSuperMethod(object, key, wrapperFn) {
    let currentObject = Object.getPrototypeOf(object);
    while (currentObject && currentObject !== Object.prototype) {
        const descriptor = Object.getOwnPropertyDescriptor(currentObject, key);
        const fn = descriptor?.value ?? descriptor?.get ?? descriptor?.set;
        if (typeof fn === "function" && fn !== wrapperFn)
            return fn;
        currentObject = Object.getPrototypeOf(currentObject);
    }
    return undefined;
}
/**
 * @function getSuperDescriptor
 * @group Utilities
 * @category Prototype
 *
 * @description Find how a property is defined one level further up than {@link getFirstPrototypeInChainWith}
 * looks, skipping both the object and its immediate prototype. Use it from inside a class to reach the
 * definition its own prototype is overriding.
 * @param {object} object - The object whose ancestors to search.
 * @param {PropertyKey} key - The property to look for.
 * @returns {PropertyDescriptor} The inherited descriptor, or `undefined` if none exists.
 */
function getSuperDescriptor(object, key) {
    let currentObject = Object.getPrototypeOf(object);
    if (currentObject)
        currentObject = Object.getPrototypeOf(currentObject);
    while (currentObject && currentObject !== Object.prototype) {
        const descriptor = Object.getOwnPropertyDescriptor(currentObject, key);
        if (descriptor)
            return descriptor;
        currentObject = Object.getPrototypeOf(currentObject);
    }
    return undefined;
}
/**
 * @function getPrototypeChain
 * @group Utilities
 * @category Prototype
 *
 * @description List an object's prototype chain, nearest first. Passing a class lists the class and its
 * ancestors; passing an instance starts at its prototype. Used to walk a hierarchy and merge each level's
 * static defaults.
 * @param {object} object - The instance or class to walk.
 * @returns {any[]} The chain from nearest to furthest, stopping before `Function.prototype`.
 */
function getPrototypeChain(object) {
    const chain = [];
    let constructor = typeof object === "function" ? object : Object.getPrototypeOf(object);
    while (constructor && constructor !== Function.prototype) {
        chain.push(constructor);
        constructor = Object.getPrototypeOf(constructor);
    }
    return chain;
}
/**
 * @function getConstructorChain
 * @group Utilities
 * @category Prototype
 *
 * @description List the constructors an object inherits from, nearest first. Where {@link getPrototypeChain}
 * yields prototypes, this yields the classes themselves.
 * @param {object} object - The instance or class to walk.
 * @returns {any[]} The constructors from nearest to furthest, stopping before `Object`.
 */
function getConstructorChain(object) {
    const chain = [];
    let constructor = typeof object === "function" ? object : object.constructor;
    while (constructor && constructor !== Object) {
        chain.push(constructor);
        constructor = Object.getPrototypeOf(constructor);
    }
    return chain;
}

const utils$d = new AutoUtils();
/**
 * @decorator
 * @function auto
 * @group Decorators
 * @category Augmentation
 *
 * @description Stage-3 decorator that augments fields, getters, setters, and accessors. Useful to quickly create a setter
 * and only define additional functionality on set. The decorator takes an optional object as parameter to configure
 * it, allowing you to, among other things:
 * - Preprocess the value when it is set,
 * - Specify callbacks to call before/after the value is set,
 * - Define a default value to return instead of `undefined` when calling the getter, and
 * - Fire the setter when the underlying value is `undefined`.
 *
 * *Note: If you want to chain decorators, place `@auto` closest to the property to ensure it runs first and sets
 * up the accessor for other decorators.*
 * @param {AutoOptions} [options] - Options object to define custom behaviors.
 *
 * @example
 * ```ts
 * @auto() public set color(value: string) {
 *    this.style.backgroundColor = value;
 * }
 * ```
 *Is equivalent to:
 * ```ts
 * private _color: string;
 * public get color(): string {
 *    return this._color;
 * }
 *
 * public set color(value: string) {
 *    this._color = value;
 *    this.style.backgroundColor = value;
 * }
 * ```
 */
function auto(options) {
    return function (value, context) {
        if (!options)
            options = {};
        const { kind, name, static: isStatic } = context;
        const key = name;
        const backing = Symbol(`__auto_${key}`);
        context.addInitializer(function () {
            const prototype = isStatic ? this : getFirstPrototypeInChainWith(this, key);
            const superDescriptor = getSuperDescriptor(this, key);
            let customGetter;
            let customSetter;
            const baseRead = function () {
                if (customGetter && options?.returnDefinedGetterValue)
                    return customGetter.call(this);
                if (options.override && superDescriptor?.get)
                    return superDescriptor.get.call(this);
                return this[backing];
            };
            const baseWrite = function (value) {
                if (options.override && superDescriptor?.set)
                    superDescriptor.set.call(this, value);
                this[backing] = value;
            };
            let readFlag = false;
            const read = function () {
                let value = baseRead.call(this);
                if (readFlag)
                    return value;
                readFlag = true;
                if (!options.returnDefinedGetterValue && isUndefined(value)) {
                    if (options.defaultValue)
                        value = options.defaultValue;
                    else if (options.defaultValueCallback)
                        value = options.defaultValueCallback.call(this);
                    if (options.setIfUndefined || options.defaultValue || options.defaultValueCallback) {
                        write.call(this, value);
                        value = baseRead.call(this);
                    }
                }
                readFlag = false;
                return value;
            };
            let writeFlag = false;
            const write = function (value) {
                if (writeFlag)
                    return baseWrite.call(this, value);
                writeFlag = true;
                options.callBefore?.call(this, value);
                let next = options?.preprocessValue ? options.preprocessValue.call(this, value) : value;
                if ((options.cancelIfUnchanged ?? true) && Object.is(baseRead.call(this), next)) {
                    writeFlag = false;
                    return;
                }
                if (options.executeSetterBeforeStoring && customSetter)
                    customSetter.call(this, next);
                baseWrite.call(this, next);
                if (!options.executeSetterBeforeStoring && customSetter)
                    customSetter.call(this, next);
                options.callAfter?.call(this, next);
                writeFlag = false;
            };
            //The member's own accessor pair, for `accessor` and field members. Captured before the initial
            //value is resolved, but not installed as the custom getter/setter until further below, so
            //`baseRead` keeps behaving as it did while the initial value is being worked out.
            const declared = (kind === "field" || kind === "accessor")
                ? value
                : undefined;
            if (isUndefined(baseRead.call(this))) {
                let initialValue = kind === "field" ? value : undefined;
                if (isUndefined(initialValue)) {
                    if (options.initialValue)
                        initialValue = options.initialValue;
                    else if (options.initialValueCallback)
                        initialValue = options.initialValueCallback.call(this);
                }
                //Falling back to the value the member was declared with. Both an `accessor`'s slot and a
                //plain field are already populated by the time this initializer runs, and redefining the
                //property below would otherwise throw that value away, leaving the property `undefined`
                //until something writes to it. `initialValue` still wins, being the more explicit of the two.
                if (isUndefined(initialValue)) {
                    if (kind === "accessor" && declared?.get)
                        initialValue = declared.get.call(this);
                    else if (kind === "field")
                        initialValue = this[key];
                }
                if (!isUndefined(initialValue) && options.preprocessValue)
                    initialValue = options.preprocessValue.call(this, initialValue);
                this[backing] = initialValue;
            }
            if (kind === "field" || kind === "accessor") {
                if (declared?.get)
                    customGetter = declared.get;
                if (declared?.set)
                    customSetter = declared.set;
                const descriptor = getFirstDescriptorInChain(this, key) ?? { enumerable: true };
                Object.defineProperty(this, key, {
                    configurable: true,
                    enumerable: descriptor.enumerable ?? true,
                    get: () => read.call(this),
                    set: (value) => write.call(this, value),
                });
            }
            else if (kind === "getter" || kind === "setter") {
                const installed = utils$d.constructorData(prototype).installed;
                if (installed.get(key))
                    return;
                installed.set(key, true);
                const descriptor = getFirstDescriptorInChain(prototype, key) ?? { enumerable: true };
                if (typeof descriptor.get === "function")
                    customGetter = descriptor.get;
                if (typeof descriptor.set === "function")
                    customSetter = descriptor.set;
                Object.defineProperty(prototype, key, {
                    configurable: true,
                    enumerable: descriptor.enumerable ?? true,
                    get: function () { return read.call(this); },
                    set: function (value) { write.call(this, value); },
                });
            }
        });
    };
}

/**
 * @class GradumSelector
 * @group GradumSelector
 * @category Core
 *
 * @template {object} Type - The type of the object it wraps.
 * @description Selector class that wraps an object and augments it with useful functions to manipulate it. It also
 * proxies the object, so you can access properties and methods on the underlying object directly through the selector.
 */
class GradumSelector {
    /**
     * @category Core
     * @description The underlying, wrapped object. Every method on the selector reads and writes through it.
     */
    element;
    #generateProxy() {
        return new Proxy(this, {
            get(target, prop, receiver) {
                if (prop in target)
                    return Reflect.get(target, prop, receiver);
                const value = target.element?.[prop];
                return typeof value === "function" ? value.bind(target.element) : value;
            },
            set(target, prop, value, receiver) {
                if (prop in target)
                    return Reflect.set(target, prop, value, receiver);
                target.element[prop] = value;
                return true;
            },
            has(target, prop) {
                return prop in target || prop in target.element;
            },
            ownKeys(target) {
                return Array.from([...Reflect.ownKeys(target), ...Reflect.ownKeys(target.element)]);
            },
            getOwnPropertyDescriptor(target, prop) {
                return Reflect.getOwnPropertyDescriptor(target, prop)
                    || Object.getOwnPropertyDescriptor(target.element, prop)
                    || undefined;
            }
        });
    }
    /**
     * @category Core
     * @constructor
     * @description Create a bare selector. Prefer {@link gradum} (or `g`, `gr`, `$`), which caches one
     * selector per target and wires up {@link GradumSelector.element} for you. The instance returned is a
     * proxy, so properties not found on the selector fall through to the wrapped object.
     */
    constructor() {
        return this.#generateProxy();
    }
}

/**
 * @internal
 * @class HierarchyFunctionsUtils
 * @description Shared helpers and per-element state behind the DOM hierarchy functions on {@link GradumSelector}.
 */
class HierarchyFunctionsUtils {
    dataMap = new WeakMap;
    data(element) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (!element)
            return {};
        if (!this.dataMap.has(element))
            this.dataMap.set(element, {});
        return this.dataMap.get(element);
    }
}

const utils$c = new HierarchyFunctionsUtils();
/**
 * @internal
 * @function setupHierarchyFunctions
 * @description Install the DOM hierarchy functions (`addChild`, `closest`, `childHandler`, ...) onto the
 * {@link GradumSelector} prototype. Called once by {@link gradumify}; the matching `exclude` option skips it.
 */
function setupHierarchyFunctions() {
    //Readonly fields
    /**
     * @description The child handler object associated with the node. It is the node itself (if it is handling
     * its children) or its shadow root (if defined). Set it to change the node where the children are added/removed/
     * queried from when manipulating the node's children.
     */
    Object.defineProperty(GradumSelector.prototype, "childHandler", {
        set: function (value) {
            if (value instanceof GradumSelector)
                value = value.element;
            utils$c.data(this).childHandler = value;
        },
        get: function () {
            const childHandler = utils$c.data(this).childHandler;
            if (childHandler)
                return childHandler;
            if (this.element instanceof Element && this.element.shadowRoot)
                return this.element.shadowRoot;
            return this.element;
        },
        configurable: false,
        enumerable: true
    });
    /**
     * @description Static array of all the child nodes of the node.
     */
    Object.defineProperty(GradumSelector.prototype, "childNodesArray", {
        get: function () {
            if (!this.element)
                return [];
            return Array.from(this.childHandler?.childNodes) || [];
        },
        configurable: false,
        enumerable: true
    });
    /**
     * @description Static array of all the child elements of the node.
     */
    Object.defineProperty(GradumSelector.prototype, "childrenArray", {
        get: function () {
            return this.childNodesArray.filter((node) => node.nodeType === 1);
        },
        configurable: false,
        enumerable: true
    });
    /**
     * @description Static array of all the sibling nodes (including the node itself) of the node.
     */
    Object.defineProperty(GradumSelector.prototype, "siblingNodes", {
        get: function () {
            const parent = this.element?.parentNode;
            if (!parent)
                return [];
            return $(parent).childNodesArray || [];
        },
        configurable: false,
        enumerable: true
    });
    /**
     * @description Static array of all the sibling elements (including the element itself, if it is one) of the node.
     */
    Object.defineProperty(GradumSelector.prototype, "siblings", {
        get: function () {
            const parent = this.element?.parentElement;
            if (!parent)
                return [];
            return $(parent).childrenArray || [];
        },
        configurable: false,
        enumerable: true
    });
    //Self manipulation
    GradumSelector.prototype.bringToFront = function _bringToFront() {
        const parent = this.element?.parentNode;
        if (!parent)
            return this;
        $(parent).addChild(this.element);
        return this;
    };
    GradumSelector.prototype.sendToBack = function _sendToBack() {
        const parent = this.element?.parentNode;
        if (!parent)
            return this;
        $(parent).addChild(this.element, 0);
        return this;
    };
    /**
     * @description Removes the node from the document.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.remove = function _remove() {
        this.element?.parentNode?.removeChild(this.element);
        return this;
    };
    //Child manipulation
    /**
     * @description Add one or more children to the referenced parent node.
     * @param {Node | Node[]} [children] - Array of (or single) child nodes.
     * @param {number} [index] - The position at which to add the child relative to the parent's child list.
     * Leave undefined to add the child at the end.
     * @param {Node[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
     * use as computation reference for index placement. Defaults to the node's `childrenArray`.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.addChild = function _addChild(children, index, referenceList = this.childrenArray) {
        if (!this.element || !children)
            return this;
        if (index !== undefined && (index < 0 || index > referenceList.length))
            index = undefined;
        if (index != undefined)
            this.addChildBefore(children, referenceList[index]);
        else
            try {
                // Try to append every provided child (according to its type)
                if (!Array.isArray(children))
                    children = [children];
                children.forEach((child) => {
                    if (!child)
                        return;
                    if (child instanceof GradumSelector)
                        child = child.element;
                    this.childHandler.appendChild(child);
                    //TODO
                    // if (child["__outName"] && !this[child["__outName"]]) this[child["__outName"]] = child;
                });
            }
            catch (e) {
                console.error(e);
            }
        return this;
    };
    /**
     * @description Remove one or more children from the referenced parent node.
     * @param {Node | Node[]} [children] - Array of (or single) child nodes.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.remChild = function _remChild(children) {
        if (!this.element || !children)
            return this;
        // Try to remove every provided child (according to its type)
        try {
            if (!Array.isArray(children))
                children = [children];
            children.forEach(child => {
                if (!child)
                    return;
                if (child instanceof GradumSelector)
                    child = child.element;
                this.childHandler.removeChild(child);
            });
        }
        catch (e) {
            console.error(e);
        }
        return this;
    };
    /**
     * @description Add one or more children to the referenced parent node before the provided sibling. If the
     * sibling is not found in the parent's children, the nodes will be added to the end of the parent's child list.
     * @param {Node | Node[]} [children] - Array of (or single) child nodes to insert before sibling.
     * @param {Node} [sibling] - The sibling node to insert the children before.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.addChildBefore = function _addChildBefore(children, sibling) {
        if (!this.element || !children)
            return this;
        if (!sibling)
            return this.addChild(children);
        // Try to append every provided child (according to its type)
        try {
            if (!Array.isArray(children))
                children = [children];
            children.forEach((child) => {
                if (!child)
                    return;
                if (child instanceof GradumSelector)
                    child = child.element;
                this.childHandler.insertBefore(child, sibling);
            });
        }
        catch (e) {
            console.error(e);
        }
        return this;
    };
    /**
     * @description Remove one or more child nodes from the referenced parent node.
     * @param {number} [index] - The index of the child(ren) to remove.
     * @param {number} [count=1] - The number of children to remove.
     * @param {Node[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
     * use as computation reference for index placement and count. Defaults to the node's `childrenArray`.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.removeChildAt = function _removeChildAt(index, count = 1, referenceList = this.childrenArray) {
        if (!this.element || index === undefined || index < 0)
            return this;
        if (index >= referenceList.length)
            return this;
        // Try to remove every provided child (according to its type)
        try {
            for (let i = index + count - 1; i >= index; i--) {
                if (i >= referenceList.length)
                    continue;
                this.removeChild(referenceList[i]);
            }
        }
        catch (e) {
            console.error(e);
        }
        return this;
    };
    /**
     * @description Remove all children of the node.
     * @param {Node[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
     * representing all the nodes to remove. Defaults to the node's `childrenArray`.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.removeAllChildren = function _removeAllChildren(referenceList = this.childrenArray) {
        if (!this.element)
            return this;
        try {
            for (let i = 0; i < referenceList.length; i++)
                this.removeChild(referenceList[i]);
        }
        catch (e) {
            console.error(e);
        }
        return this;
    };
    //Child identification
    /**
     * @description Returns the child of the parent node at the given index. Any number inputted (including negatives)
     * will be reduced modulo length of the list size.
     * @param {number} [index] - The index of the child to retrieve.
     * @param {Node[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
     * use as computation reference for index placement. Defaults to the node's `childrenArray`.
     * @returns {Node | Element | null} The child at the given index, or `null` if the index is invalid.
     */
    GradumSelector.prototype.childAt = function _childAt(index, referenceList = this.childrenArray) {
        if (!this.element || index === undefined)
            return null;
        if (index >= referenceList.length)
            index = referenceList.length - 1;
        while (index < 0)
            index += referenceList.length;
        return referenceList[index];
    };
    /**
     * @description Returns the index of the given child.
     * @param {Node} [child] - The child element to find.
     * @param {Node[] | Element[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
     * use as computation reference for index placement. Defaults to the node's `childrenArray`.
     * @returns {number} The index of the child node in the provided list, or -1 if the child is not found.
     */
    GradumSelector.prototype.indexOfChild = function _indexOfChild(child, referenceList = this.childrenArray) {
        if (!this.element || !child)
            return -1;
        if (!(referenceList instanceof Array))
            referenceList = Array.from(referenceList);
        return referenceList.indexOf(child);
    };
    /**
     * @description Identify whether one or more children belong to this parent node.
     * @param {Node | Node[]} [children] - Array of (or single) child nodes.
     * @returns {boolean} A boolean indicating whether the provided nodes belong to the parent or not.
     */
    GradumSelector.prototype.hasChild = function _hasChild(children) {
        if (!this.element || !children)
            return false;
        const nodesArray = Array.from(this.element?.childNodes);
        if (children instanceof Node)
            return nodesArray.includes(children);
        for (const child of children) {
            if (!nodesArray.includes(child))
                return false;
        }
        return true;
    };
    /**
     * @description Finds the closest ancestor of the current element (or the current element itself) that matches the
     * provided type. Accepts either a constructor (matched via `instanceof`) or a string. When a string is
     * given it is first resolved to a constructor via `customElements` (so `"my-component"` matches any
     * element that is an `instanceof MyComponent`); if no custom element is registered for that name it
     * falls back to a native CSS-selector walk via `Element.closest()`.
     * @param {string | (new (...args: any[]) => Element)} type - Custom-element tag name, CSS selector,
     * or element constructor to match.
     * @returns {Element | null} The matching ancestor element, or null if no match is found.
     */
    GradumSelector.prototype.closest = function _closest(type) {
        if (!this.element || !type || !(this.element instanceof Element))
            return null;
        if (typeof type === "string") {
            const ctor = customElements.get(type);
            if (ctor) {
                let el = this.element;
                while (el && !(el instanceof ctor))
                    el = el.parentElement;
                return el || null;
            }
            return this.element.closest(type);
        }
        let el = this.element;
        while (el && !(el instanceof type))
            el = el.parentElement;
        return el || null;
    };
    //Parent identification
    /**
     * @description Finds whether this node is within the given parent(s).
     * @param {Node | Node[]} [parents] - The parent(s) to check.
     * @returns {boolean} True if the node is within the given parents, false otherwise.
     */
    GradumSelector.prototype.findInParents = function _findInParents(parents) {
        if (!parents || !this.element)
            return false;
        if (parents instanceof Node)
            parents = [parents];
        let element = this.element;
        let count = 0;
        while (element && count < parents.length) {
            if (parents.includes(element))
                count++;
            element = element.parentNode;
        }
        return count === parents.length;
    };
    /**
     * @description Finds whether one or more children belong to this node.
     * @param {Node | Node[]} [children] - The child or children to check.
     * @returns {boolean} True if the children belong to the node, false otherwise.
     */
    GradumSelector.prototype.findInSubTree = function _findInSubTree(children) {
        if (!children || !this.element)
            return false;
        if (children instanceof Node)
            children = [children];
        let count = 0;
        const recur = (node) => {
            if (children.includes(node))
                count++;
            if (count >= children.length)
                return;
            node.childNodes.forEach(child => recur(child));
        };
        recur(this.element);
        return count >= children.length;
    };
    /**
     * @description Finds whether one or more children belong to this node.
     * @param {Node[]} [referenceList=this.siblings] - The siblings list to use as computation
     * reference for index placement. Defaults to the node's `siblings`.
     * @returns {boolean} True if the children belong to the node, false otherwise.
     */
    GradumSelector.prototype.indexInParent = function _indexInParent(referenceList = this.siblings) {
        if (!referenceList || !this.element)
            return -1;
        return referenceList.indexOf(this.element);
    };
    //Parent manipulation
    /**
     * @description Add one or more children to the referenced parent node.
     * @param {Node} [parent] - Array of (or single) child nodes.
     * @param {number} [index] - The position at which to add the child relative to the parent's child list.
     * Leave undefined to add the child at the end.
     * @param {Node[] | NodeListOf<Node>} [referenceList=this.childrenArray] - The child list to
     * use as computation reference for index placement. Defaults to the node's `childrenArray`.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.addToParent = function _addToParent(parent, index, referenceList) {
        if (!this.element || !parent)
            return this;
        $(parent).addChild(this.element, index, referenceList);
        return this;
    };
}

/**
 * @constant
 * @group GradumSelector
 * @category Misc
 * @description Default array-like keys to merge when applying defaults with {@link GradumSelector.applyDefaults}.
 */
const ApplyDefaultsMergeProperties = ["interactors", "tools", "constrainers", "operators", "handlers"];

/**
 * @internal
 * @function setupMiscFunctions
 * @description Install the miscellaneous object helpers (`apply`, `applyDefaults`, `extract`, `getDifference`,
 * ...) onto the {@link GradumSelector} prototype. Called once by
 * {@link gradumify}; the matching `exclude` option skips it.
 */
function setupMiscFunctions() {
    /**
     * @description Execute a callback on the node while still benefiting from chaining.
     * @param {(el: this) => void} callback The function to execute, with 1 parameter representing the instance itself.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.execute = function _execute(callback) {
        callback(this);
        return this;
    };
    GradumSelector.prototype.apply = function apply(properties) {
        if (!this.element || typeof this.element !== "object")
            return this;
        if (!properties || typeof properties !== "object")
            return this;
        for (const [key, value] of Object.entries(properties)) {
            try {
                this.element[key] = value;
            }
            catch { }
        }
        return this;
    };
    GradumSelector.prototype.removeFields = function removeFields(keys) {
        if (!this.element || typeof this.element !== "object")
            return this;
        if (!keys || !Array.isArray(keys))
            return this;
        for (const key of keys) {
            try {
                delete this.element[key];
            }
            catch {
                try {
                    delete this.element[key];
                }
                catch { }
            }
        }
        return this;
    };
    GradumSelector.prototype.getDefaults = function getDefaults(defaults) {
        if (!this.element || typeof this.element !== "object")
            return {};
        if (!defaults || typeof defaults !== "object")
            return {};
        const result = {};
        for (const key of defaults) {
            if (!isUndefined(this.element[key]))
                result[key] = this.element[key];
        }
        return result;
    };
    GradumSelector.prototype.getIntersection = function getIntersection(other) {
        if (!this.element || typeof this.element !== "object")
            return {};
        if (!other || typeof other !== "object")
            return {};
        const result = {};
        for (const key of Object.keys(other)) {
            if (!isUndefined(this.element[key]))
                result[key] = this.element[key];
        }
        return result;
    };
    GradumSelector.prototype.getDifference = function getDifference(other) {
        if (!this.element || typeof this.element !== "object")
            return {};
        if (!other || typeof other !== "object")
            return {};
        const result = {};
        for (const key of Object.keys(this.element)) {
            if (isUndefined(other[key]))
                result[key] = this.element[key];
        }
        return result;
    };
    GradumSelector.prototype.extract = function extract(keys) {
        if (!this.element || typeof this.element !== "object")
            return {};
        if (!keys || !Array.isArray(keys))
            return {};
        const result = {};
        for (const key of keys) {
            if (isUndefined(this.element[key]))
                continue;
            result[key] = this.element[key];
            delete this.element[key];
        }
        return result;
    };
    GradumSelector.prototype.applyDefaults = function applyDefaults(defaults, options = {}) {
        if (!this.element || typeof this.element !== "object")
            return this;
        if (!defaults || typeof defaults !== "object")
            return this;
        const { mergeProperties = ApplyDefaultsMergeProperties, removeDuplicates = true } = options;
        for (const [key, value] of Object.entries(defaults)) {
            const isMergeKey = mergeProperties?.includes(key);
            if (isMergeKey) {
                const defaultArray = Array.isArray(value) ? value : [value];
                const currentArray = isUndefined(this.element[key]) ? []
                    : Array.isArray(this.element[key]) ? this.element[key].slice()
                        : [this.element[key]];
                let merged = currentArray.concat(defaultArray);
                if (removeDuplicates)
                    merged = Array.from(new Set(merged));
                this.element[key] = merged;
            }
            else if (isUndefined(this.element[key])) {
                this.element[key] = value;
            }
        }
        return this;
    };
}

/**
 * @internal
 * @class ClassFunctionsUtils
 * @description Shared helpers behind the CSS-class functions on {@link GradumSelector}.
 */
class ClassFunctionsUtils {
    /**
     * @function operateOnClasses
     * @description Run a callback once per CSS class, accepting either a space-separated string or an array
     * so every class function can take both forms.
     * @param {GradumSelector} selector - The selector whose element the classes belong to.
     * @param {string | string[]} [classes] - Classes separated by spaces, or an array of class names.
     * @param {(classEntry: string) => void} [callback] - Called once per class name.
     * @returns {GradumSelector} The given selector, allowing for method chaining.
     */
    operateOnClasses(selector, classes, callback = (() => { })) {
        if (!selector || !classes || !selector.element)
            return selector;
        try {
            // If string provided --> split by spaces
            if (typeof classes === "string")
                classes = classes.split(" ");
            classes.filter(entry => entry.trim().length > 0)
                .forEach(entry => callback(entry));
        }
        catch (e) {
            console.error(e);
        }
        return selector;
    }
}

const utils$b = new ClassFunctionsUtils();
/**
 * @internal
 * @function setupClassFunctions
 * @description Install the CSS-class functions (`addClass`, `removeClass`, `toggleClass`, `hasClass`) onto the
 * {@link GradumSelector} prototype. Called once by
 * {@link gradumify}; the matching `exclude` option skips it.
 */
function setupClassFunctions() {
    /**
     * @description Add one or more CSS classes to the element.
     * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.addClass = function _addClass(classes) {
        if (!(this.element instanceof Element))
            return this;
        return utils$b.operateOnClasses(this, classes, entry => this.element.classList.add(entry));
    };
    /**
     * @description Remove one or more CSS classes from the element.
     * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.removeClass = function _removeClass(classes) {
        if (!(this.element instanceof Element))
            return this;
        return utils$b.operateOnClasses(this, classes, entry => this.element.classList.remove(entry));
    };
    /**
     * @description Toggle one or more CSS classes in the element.
     * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
     * @param {boolean} force - (Optional) Boolean that turns the toggle into a one way-only operation. If set to false,
     * then the class will only be removed, but not added. If set to true, then token will only be added, but not removed.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.toggleClass = function _toggleClass(classes, force) {
        if (!(this.element instanceof Element))
            return this;
        return utils$b.operateOnClasses(this, classes, entry => this.element.classList.toggle(entry, force));
    };
    /**
     * @description Check if the element's class list contains the provided class(es).
     * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
     * @returns {boolean} Whether the element carries every one of the given classes.
     */
    GradumSelector.prototype.hasClass = function _hasClass(classes) {
        if (!classes || !(this.element instanceof Element))
            return false;
        if (typeof classes === "string")
            return this.element.classList.contains(classes);
        for (let entry of classes) {
            if (!this.element.classList.contains(entry))
                return false;
        }
        return true;
    };
}

/**
 * @group Core Types
 * @category SVG Tags
 * @description URL to the SVG namespace.
 */
const SvgNamespace = "http://www.w3.org/2000/svg";
/**
 * @group Core Types
 * @category SVG Tags
 * @description Set of Valid SVG tags.
 */
const SvgTags = new Set([
    "a", "animate", "animateMotion", "animateTransform", "circle", "clipPath", "defs", "desc", "ellipse",
    "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting",
    "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR",
    "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight",
    "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "foreignObject", "g", "image",
    "line", "linearGradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline",
    "radialGradient", "rect", "script", "set", "stop", "style", "svg", "switch", "symbol", "text", "textPath",
    "title", "tspan", "use", "view",
]);

/**
 * @group Core Types
 * @category MathML Tags
 * @description URL to the MathML namespace.
 */
const MathMLNamespace = "http://www.w3.org/1998/Math/MathML";
/**
 * @group Core Types
 * @category MathML Tags
 * @description Set of Valid MathML tags.
 */
const MathMLTags = new Set([
    "annotation", "annotation-xml", "maction", "math", "merror", "mfrac", "mi", "mmultiscripts", "mn", "mo",
    "mover", "mpadded", "mphantom", "mprescripts", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub",
    "msubsup", "msup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "semantics",
]);

/**
 * @function generateTagFunction
 * @group Element Creation
 * @category Creation Functions
 *
 * @template {ValidTag} Tag - The tag the generated function creates.
 * @description Build a creation function bound to one tag, so callers no longer have to pass the tag
 * themselves. Use it to add a shorthand builder for a tag this library does not already ship one for —
 * the result behaves like the built-in {@link div} and {@link span}.
 * @param {Tag} tag - The tag the returned function creates.
 * @returns {(properties?: GradumProperties<Tag>) => ValidElement<Tag>} A function that creates an
 * element of that tag from the given properties.
 *
 * @example
 * ```ts
 * const section = generateTagFunction("section");
 * const el = section({classes: "panel"});
 * ```
 */
function generateTagFunction(tag) {
    return (properties = {}) => {
        properties.tag = tag;
        return element({ ...properties, tag: tag });
    };
}
/**
 * @function element
 * @group Element Creation
 * @category Creation Functions
 *
 * @template {ValidTag} Tag - The tag of the element to create.
 * @description Create an element from a properties object and apply those properties to it. The
 * namespace is taken from `properties.namespace`: pass `"svg"` or `"mathML"` for those documents, or a
 * namespace URI directly. Use {@link blindElement} instead to have the namespace inferred from the tag.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidElement<Tag>} The created element, with the given properties already applied.
 */
function element(properties = {}) {
    let element;
    if (properties.namespace) {
        if (properties.namespace == "svg")
            element = document.createElementNS(SvgNamespace, properties.tag || "svg");
        else if (properties.namespace == "mathML")
            element = document.createElementNS(MathMLNamespace, properties.tag || "math");
        else
            element = document.createElementNS(properties.namespace, properties.tag || "div");
    }
    else {
        element = document.createElement(properties.tag || "div");
    }
    gradum(element, true).setProperties(properties);
    return element;
}
/**
 * @function blindElement
 * @group Element Creation
 * @category Creation Functions
 *
 * @template {ValidTag} Tag - The tag of the element to create.
 * @description Create an element from a properties object, working out the namespace from the tag alone
 * — SVG tags land in the SVG namespace, MathML tags in the MathML one, everything else in HTML. Use it
 * when the tag is only known at runtime; use {@link element} when you can state the namespace yourself.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidElement<Tag>} The created element, with the given properties already applied.
 */
function blindElement(properties = {}) {
    let element;
    if (isSvgTag(properties.tag))
        element = document.createElementNS(SvgNamespace, properties.tag || "svg");
    else if (isMathMLTag(properties.tag))
        element = document.createElementNS(MathMLNamespace, properties.tag || "math");
    else
        element = document.createElement(properties.tag || "div");
    gradum(element, true).setProperties(properties);
    return element;
}
/**
 * @internal
 * @function isSvgTag
 * @description Whether a tag belongs to the SVG namespace. Recognizes the known SVG tag list, plus any
 * tag starting with `svg`.
 * @param {string} [tag] - The tag to test.
 * @returns {boolean} `true` if the tag should be created in the SVG namespace.
 */
function isSvgTag(tag) {
    return SvgTags.has(tag) || tag?.startsWith("svg");
}
/**
 * @internal
 * @function isMathMLTag
 * @description Whether a tag belongs to the MathML namespace. Recognizes the known MathML tag list, plus
 * any tag starting with `math`.
 * @param {string} [tag] - The tag to test.
 * @returns {boolean} `true` if the tag should be created in the MathML namespace.
 */
function isMathMLTag(tag) {
    return MathMLTags.has(tag) || tag?.startsWith("math");
}

/**
 * @function a
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates an `<a>` element with the specified properties.
 * @param {GradumProperties<"a">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"a">} The created element, with the given properties already applied.
 */
function a(properties = {}) {
    return element({ ...properties, tag: "a" });
}
/**
 * @function canvas
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<canvas>` element with the specified properties.
 * @param {GradumProperties<"canvas">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"canvas">} The created element, with the given properties already applied.
 */
function canvas(properties = {}) {
    return element({ ...properties, tag: "canvas" });
}
/**
 * @function div
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<div>` element with the specified properties.
 * @param {GradumProperties<"div">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"div">} The created element, with the given properties already applied.
 */
function div(properties = {}) {
    return element({ ...properties, tag: "div" });
}
/**
 * @function form
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<form>` element with the specified properties.
 * @param {GradumProperties<"form">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"form">} The created element, with the given properties already applied.
 */
function form(properties = {}) {
    return element({ ...properties, tag: "form" });
}
/**
 * @function h1
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h1>` element with the specified properties.
 * @param {GradumProperties<"h1">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h1">} The created element, with the given properties already applied.
 */
function h1(properties = {}) {
    return element({ ...properties, tag: "h1" });
}
/**
 * @function h2
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h2>` element with the specified properties.
 * @param {GradumProperties<"h2">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h2">} The created element, with the given properties already applied.
 */
function h2(properties = {}) {
    return element({ ...properties, tag: "h2" });
}
/**
 * @function h3
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h3>` element with the specified properties.
 * @param {GradumProperties<"h3">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h3">} The created element, with the given properties already applied.
 */
function h3(properties = {}) {
    return element({ ...properties, tag: "h3" });
}
/**
 * @function h4
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h4>` element with the specified properties.
 * @param {GradumProperties<"h4">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h4">} The created element, with the given properties already applied.
 */
function h4(properties = {}) {
    return element({ ...properties, tag: "h4" });
}
/**
 * @function h5
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h5>` element with the specified properties.
 * @param {GradumProperties<"h5">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h5">} The created element, with the given properties already applied.
 */
function h5(properties = {}) {
    return element({ ...properties, tag: "h5" });
}
/**
 * @function h6
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h6>` element with the specified properties.
 * @param {GradumProperties<"h6">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h6">} The created element, with the given properties already applied.
 */
function h6(properties = {}) {
    return element({ ...properties, tag: "h6" });
}
/**
 * @function img
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates an `<img>` element with the specified properties.
 * @param {GradumProperties<"img">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"img">} The created element, with the given properties already applied.
 */
function img(properties = {}) {
    return element({ ...properties, tag: "img" });
}
/**
 * @function input
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates an `<input>` element with the specified properties.
 * @param {GradumProperties<"input">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"input">} The created element, with the given properties already applied.
 */
function input(properties = {}) {
    return element({ ...properties, tag: "input" });
}
/**
 * @function link
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<link>` element with the specified properties.
 * @param {GradumProperties<"link">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"link">} The created element, with the given properties already applied.
 */
function link(properties = {}) {
    return element({ ...properties, tag: "link" });
}
/**
 * @function p
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<p>` element with the specified properties.
 * @param {GradumProperties<"p">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"p">} The created element, with the given properties already applied.
 */
function p(properties = {}) {
    return element({ ...properties, tag: "p" });
}
/**
 * @function span
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<span>` element with the specified properties.
 * @param {GradumProperties<"span">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"span">} The created element, with the given properties already applied.
 */
function span(properties = {}) {
    return element({ ...properties, tag: "span" });
}
/**
 * @function style
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<style>` element with the specified properties.
 * @param {GradumProperties<"style">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"style">} The created element, with the given properties already applied.
 */
function style(properties = {}) {
    return element({ ...properties, tag: "style" });
}
/**
 * @function textarea
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<textarea>` element with the specified properties.
 * @param {GradumProperties<"textarea">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"textarea">} The created element, with the given properties already applied.
 */
function textarea(properties = {}) {
    return element({ ...properties, tag: "textarea" });
}
/**
 * @function video
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<video>` element with the specified properties.
 * @param {GradumProperties<"video">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"video">} The created element, with the given properties already applied.
 */
function video(properties = {}) {
    return element({ ...properties, tag: "video" });
}
/**
 * @function button
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<button>` element with the specified properties.
 * @param {GradumProperties<"button">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"button">} The created element, with the given properties already applied.
 */
function button(properties = {}) {
    return element({ ...properties, tag: "button" });
}

/**
 * @function stylesheet
 * @group Element Creation
 * @category Creation Functions
 *
 * @description Add a CSS string to the document as a new `<style>` element. Pass a shadow root to
 * scope the styles to one component instead of the whole page. Does nothing if `styles` is empty.
 * @param {string} [styles] - The CSS to add. Use the {@link css} literal function for autocompletion.
 * @param {StylesRoot} [root=document.head] - The shadow root or document head to add the element to.
 */
function stylesheet(styles, root = document.head) {
    if (!styles)
        return;
    const stylesheet = style({ innerHTML: styles });
    $(root).addChild(stylesheet);
}

/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The key event names dispatched by {@link GradumEventManager}. Listen for these to receive
 * the manager's normalized key events rather than the raw DOM ones.
 * @property {string} keyPressed - Fired while a key is held down.
 * @property {string} keyReleased - Fired when a key is let go.
 */
const GradumKeyEventName = {
    keyPressed: "gradum-key-pressed",
    keyReleased: "gradum-key-released"
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The key events components listen for out of the box. Both map to their native DOM
 * equivalents, since the platform already provides them.
 * @property {string} keyPressed - `keydown`.
 * @property {string} keyReleased - `keyup`.
 */
const DefaultKeyEventName = {
    keyPressed: "keydown",
    keyReleased: "keyup",
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The click event names dispatched by {@link GradumEventManager}. These are pointer-type
 * agnostic — a mouse, a touch, and a pen all produce the same names.
 * @property {string} click - Fired on a completed click.
 * @property {string} clickStart - Fired when the pointer goes down.
 * @property {string} clickEnd - Fired when the pointer comes back up.
 * @property {string} longPress - Fired when the pointer is held past the manager's long-press duration.
 */
const GradumClickEventName = {
    click: "gradum-click",
    clickStart: "gradum-click-start",
    clickEnd: "gradum-click-end",
    longPress: "gradum-long-press"
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The click events components listen for out of the box. `click`, `clickStart`, and `clickEnd`
 * map to their native DOM equivalents; `longPress` keeps the Gradum name, because the platform has no
 * equivalent and only {@link GradumEventManager} can produce it.
 * @property {string} click - `click`.
 * @property {string} clickStart - `mousedown`.
 * @property {string} clickEnd - `mouseup`.
 * @property {string} longPress - The Gradum long-press name.
 */
const DefaultClickEventName = {
    click: "click",
    clickStart: "mousedown",
    clickEnd: "mouseup",
    longPress: GradumClickEventName.longPress
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The pointer-move event name dispatched by {@link GradumEventManager}.
 * @property {string} move - Fired as the pointer moves.
 */
const GradumMoveEventName = {
    move: "gradum-move"
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The move event components listen for out of the box, mapped to its native DOM equivalent.
 * @property {string} move - `mousemove`.
 */
const DefaultMoveEventName = {
    move: "mousemove"
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The drag event names dispatched by {@link GradumEventManager}. A drag begins once the pointer
 * travels past the manager's move threshold while held.
 * @property {string} drag - Fired repeatedly as the pointer moves during a drag.
 * @property {string} dragStart - Fired once, when the drag begins.
 * @property {string} dragEnd - Fired once, when the pointer is released.
 */
const GradumDragEventName = {
    drag: "gradum-drag",
    dragStart: "gradum-drag-start",
    dragEnd: "gradum-drag-end"
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The drag events components listen for out of the box. All three keep their Gradum names —
 * the native HTML drag-and-drop events are a separate mechanism, so {@link GradumEventManager} is the only
 * source of these.
 * @property {string} drag - The Gradum drag name.
 * @property {string} dragStart - The Gradum drag-start name.
 * @property {string} dragEnd - The Gradum drag-end name.
 */
const DefaultDragEventName = {
    drag: GradumDragEventName.drag,
    dragStart: GradumDragEventName.dragStart,
    dragEnd: GradumDragEventName.dragEnd,
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The wheel event names dispatched by {@link GradumEventManager}, which separates a plain
 * wheel turn from a pinch gesture.
 * @property {string} scroll - Fired on a wheel turn without a modifier.
 * @property {string} pinch - Fired on a trackpad pinch, which the browser reports as a modified wheel event.
 */
const GradumWheelEventName = {
    scroll: "gradum-scroll",
    pinch: "gradum-pinch",
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description The wheel events components listen for out of the box. Both map to the native `wheel` event,
 * since the browser reports scrolling and pinching through the same one — it is the manager that tells them
 * apart and fires the distinct {@link GradumWheelEventName} names.
 * @property {string} scroll - `wheel`.
 * @property {string} pinch - `wheel`.
 */
const DefaultWheelEventName = {
    scroll: "wheel",
    pinch: "wheel",
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description Every event name {@link GradumEventManager} can dispatch, combining the key, click, move,
 * drag, and wheel families with the select-input event.
 * @property {string} selectInput - Fired when a selection component's value changes.
 */
const GradumEventName = {
    ...GradumClickEventName,
    ...GradumKeyEventName,
    ...GradumMoveEventName,
    ...GradumDragEventName,
    ...GradumWheelEventName,
    selectInput: "gradum-select-input",
};
/**
 * @group Event Handling
 * @category Event Names
 *
 * @description Object containing the names of events fired by default by the gradumComponents. Modifying it (prior to
 * setting up new gradum components) will subsequently alter the events that the instantiated components will listen for.
 */
const DefaultEventName = {
    ...DefaultKeyEventName,
    ...DefaultClickEventName,
    ...DefaultMoveEventName,
    ...DefaultDragEventName,
    ...DefaultWheelEventName,
    wheel: "wheel",
    scroll: "scroll",
    input: "input",
    change: "change",
    focus: "focus",
    focusIn: "focusin",
    focusOut: "focusout",
    blur: "blur",
    resize: "resize",
    compositionStart: "compositionstart",
    compositionEnd: "compositionend",
};

/**
 * @function stringify
 * @group Utilities
 * @category String
 *
 * @description Render any value as a string that {@link parse} can turn back into an equivalent value. Dates
 * become ISO strings, arrays are stringified entry by entry, and DOM elements collapse to the placeholder
 * `"[DOM ELEMENT]"` rather than being serialized.
 * @param {any} value - The value to render.
 * @returns {string} The string form, or `undefined` when the value is `null` or `undefined`.
 */
function stringify(value) {
    if (value === null || value === undefined)
        return undefined;
    switch (typeof value) {
        case "string":
            return value;
        case "number":
        case "boolean":
        case "bigint":
        case "symbol":
        case "function":
            return value.toString();
        case "object":
            if (Array.isArray(value))
                return JSON.stringify(value.map(entry => stringify(entry)));
            else if (value instanceof Date)
                return value.toISOString();
            else if (value instanceof Element)
                return "[DOM ELEMENT]";
            else {
                try {
                    return JSON.stringify(value);
                }
                catch {
                    return "[object Object]";
                }
            }
        default:
            return String(value);
    }
}
/**
 * @function parse
 * @group Utilities
 * @category String
 *
 * @description Turn a string produced by {@link stringify} back into a value, recovering booleans, `null`,
 * numbers, bigints, objects, and arrays. Anything it cannot place comes back unchanged as the original string.
 * *Note: strings that look like function source are evaluated, so only parse input you trust.*
 * @param {string} str - The string to convert back.
 * @returns {any} The recovered value, or the original string if it matched no known form.
 */
function parse$1(str) {
    if (isUndefined(str))
        return undefined;
    switch (str) {
        case "null":
            return null;
        case "true":
            return true;
        case "false":
            return false;
    }
    if (str !== "" && !isNaN(Number(str)))
        return Number(str);
    if (/^\d+n$/.test(str))
        return BigInt(str.slice(0, -1));
    if (str.startsWith("function") || str.startsWith("(")) {
        try {
            const parsedFunction = new Function(`return (${str})`)();
            if (typeof parsedFunction === "function")
                return parsedFunction;
        }
        catch {
        }
    }
    try {
        const parsed = JSON.parse(str);
        if (typeof parsed === "object" && parsed != null)
            return parsed;
    }
    catch {
    }
    return str;
}

/**
 * @function areEqual
 * @group Utilities
 * @category Equity
 *
 * @template Type - The type of the compared entries.
 * @description Check whether every entry is the same value, compared with `Object.is`. Use it for identity;
 * reach for {@link areSimilar} when two distinct objects holding the same content should count as equal.
 * @param {...Type[]} entries - The entries to compare. Fewer than two entries always counts as equal.
 * @returns {boolean} `true` if all entries are the same value.
 */
function areEqual(...entries) {
    if (entries.length < 2)
        return true;
    for (let i = 0; i < entries.length - 1; i++) {
        if (!Object.is(entries[i], entries[i + 1]))
            return false;
    }
    return true;
}
/**
 * @function areSimilar
 * @group Utilities
 * @category Equity
 *
 * @template Type - The type of the compared entries.
 * @description Check whether every entry holds the same content, even if they are different objects. Falls
 * back through three strategies per pair: identity, the entries' own `equals` method if they define one, then
 * matching JSON and string representations. Non-objects that are not identical are never similar.
 * @param {...Type[]} entries - The entries to compare. Fewer than two entries always counts as similar.
 * @returns {boolean} `true` if all entries are equivalent in content.
 */
function areSimilar(...entries) {
    if (entries.length < 2)
        return true;
    for (let i = 0; i < entries.length - 1; i++) {
        const e1 = entries[i];
        const e2 = entries[i + 1];
        if (e1 === e2)
            continue;
        if (typeof e1 !== "object" || typeof e2 !== "object")
            return false;
        if (Object.is(e1, e2))
            continue;
        if (e1 !== null && "equals" in e1 && typeof e1.equals === "function") {
            const value = e1.equals(e2);
            if (typeof value === "boolean")
                return value;
        }
        if (e1 != null && e2 != null) {
            let cont = false;
            try {
                if (JSON.stringify(e1) === JSON.stringify(e2) && e1.toString() === e2.toString())
                    cont = true;
            }
            catch { }
            if (!cont)
                return false;
        }
    }
    return true;
}
/**
 * @function equalToAny
 * @group Utilities
 * @category Equity
 *
 * @template Type - The type of the compared entries.
 * @description Check whether one entry matches at least one of the given values, compared loosely (`==`).
 * @param {Type} entry - The entry to look for.
 * @param {...Type[]} values - The values to match against. Passing none counts as a match.
 * @returns {boolean} `true` if `entry` equals any of the values.
 */
function equalToAny(entry, ...values) {
    if (values.length < 1)
        return true;
    for (const value of values) {
        if (entry == value)
            return true;
    }
    return false;
}
/**
 * @function eachEqualToAny
 * @group Utilities
 * @category Equity
 *
 * @template Type - The type of the compared entries.
 * @description Check whether every entry matches at least one of the allowed values, compared loosely (`==`).
 * Use it to validate that a set of inputs all fall within a known set.
 * @param {Type[]} values - The allowed values.
 * @param {...Type[]} entries - The entries to check. Passing none counts as a match.
 * @returns {boolean} `true` if every entry equals one of the allowed values.
 */
function eachEqualToAny(values, ...entries) {
    if (entries.length < 1)
        return true;
    for (const entry of entries) {
        let equals = false;
        for (const value of values) {
            if (entry == value)
                equals = true;
        }
        if (!equals)
            return false;
    }
    return true;
}

/**
 * @internal
 * @class ElementFunctionsUtils
 * @description Shared helpers and per-element state behind the element functions on {@link GradumSelector}.
 */
class ElementFunctionsUtils {
    dataMap = new WeakMap;
    data(element) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (!element || !this.dataMap.has(element)) {
            const entry = {
                feedforwardElements: new Map(),
                defaultFeedforwardProperties: {}
            };
            if (element)
                this.dataMap.set(element, entry);
        }
        return this.dataMap.get(element);
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
}
function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @internal
 * @class ReactivityUtils
 * @description Shared state store behind the reactivity decorators. Owns the per-constructor and
 * per-instance maps that {@link SignalUtils} and {@link EffectUtils} read and write, and tracks which
 * effect is currently running so signal reads can be attributed to it.
 */
class ReactivityUtils {
    constructorMap = new WeakMap();
    dataMap = new WeakMap();
    activeEffect = null;
    constructorData(target) {
        let obj = this.constructorMap.get(target);
        if (!obj) {
            obj = { installed: new Map() };
            this.constructorMap.set(target, obj);
        }
        return obj;
    }
    data(target) {
        let obj = this.dataMap.get(target);
        if (!obj) {
            obj = { propertyKeyMap: new Map(), pathMap: new Map() };
            this.dataMap.set(target, obj);
        }
        return obj;
    }
    track(entry) {
        if (this.activeEffect)
            this.activeEffect.dependencies.add(entry);
    }
    createSignalEntry(initial, target, key, read, write, options) {
        const subs = new Set();
        const self = this;
        if (!options)
            options = { diffOnWrite: true };
        if (!write)
            write = (value) => Reflect.set(target, key, value, target);
        if (!read) {
            if (target && !isUndefined(key))
                read = () => Reflect.get(target, key);
            else
                read = () => initial;
        }
        const entry = {
            get() {
                self.track(entry);
                return read();
            },
            set(value) {
                if (!target || isUndefined(key)) {
                    const prev = initial;
                    initial = value;
                    if (!Object.is(prev, value))
                        entry.emit();
                }
                else if (!options.diffOnWrite) {
                    write(value);
                    entry.emit();
                }
                else {
                    const prev = read();
                    write(value);
                    const next = read();
                    if (!Object.is(prev, next))
                        entry.emit();
                }
            },
            update(updater) {
                entry.set(updater(read()));
            },
            sub(fn) {
                subs.add(fn);
                return () => subs.delete(fn);
            },
            emit() {
                for (const fn of Array.from(subs))
                    queueMicrotask(fn);
            }
        };
        if (target && !isUndefined(key))
            this.getReactivityData(target, key).signal = entry;
        return entry;
    }
    getReactivityData(target, key) {
        const data = this.data(target).propertyKeyMap;
        if (!data.has(key))
            data.set(key, {});
        return data.get(key);
    }
    getSignal(target, key) {
        return this.getReactivityData(target, key).signal;
    }
    setSignal(target, key, next) {
        const entry = this.getSignal(target, key);
        if (entry)
            entry.set(next);
        else
            Reflect.set(target, key, next, target);
    }
    getEffect(target, key) {
        return this.getReactivityData(target, key).effect;
    }
    setEffect(target, key, effect) {
        this.getReactivityData(target, key).effect = effect;
    }
    markDirty(target, key) {
        this.getSignal(target, key)?.emit();
    }
    markDirtyPath(target, keys) {
        const changed = this.serializePath(keys);
        for (const [boundPath, propertyKey] of this.data(target).pathMap) {
            // An empty changed path means the root was replaced, which overlaps every bound path
            if (changed === ""
                || boundPath === changed
                || boundPath.startsWith(changed + "|")
                || changed.startsWith(boundPath + "|"))
                this.markDirty(target, propertyKey);
        }
    }
    bindPath(target, propertyKey, keys) {
        this.data(target).pathMap.set(this.serializePath(keys), propertyKey);
    }
    getKeyFromPath(target, keys) {
        return this.data(target).pathMap.get(this.serializePath(keys));
    }
    serializePath(keys) {
        return keys.map(k => typeof k === "symbol" ? `@@${k.description ?? ""}` : String(k)).join("|");
    }
    schedule(effect) {
        if (effect.scheduled)
            return;
        effect.scheduled = true;
        queueMicrotask(() => {
            effect.scheduled = false;
            effect.run();
        });
    }
}

/**
 * @internal
 * @class SignalUtils
 * @description Creates the signals behind `@signal`, `@modelSignal`, `@nestedModelSignal`, and
 * `@isolatedModelSignal`, and installs the accessors that route property reads and writes through them.
 */
class SignalUtils {
    utils;
    constructor(utils) {
        this.utils = utils;
    }
    createBoxFromEntry(entry) {
        return new Proxy({
            ...entry,
            toJSON: () => entry.get(),
            valueOf: () => entry.get(),
            [Symbol.toPrimitive]: (hint) => {
                const value = entry.get();
                if (hint === "string")
                    return String(value);
                if (typeof value === "number")
                    return value;
                if (value != null && typeof value.valueOf === "function")
                    return value.valueOf();
                return value;
            },
            get value() {
                return entry.get();
            },
            set value(value) {
                entry.set(value);
            }
        }, {
            get(target, key, receiver) {
                return Reflect.get(target, key, receiver);
            },
            set(target, key, value, receiver) {
                if (key === "value") {
                    target.value = value;
                    return true;
                }
                return Reflect.set(target, key, value, receiver);
            }
        });
    }
    signalDecorator(value, context, baseGetter, baseSetter, callSetterOnInitialize = false) {
        const { kind, name, static: isStatic, private: isPrivate } = context;
        if (isPrivate)
            throw new Error("@signal does not support private class elements.");
        const key = name;
        const backingKey = Symbol(`[[signal:${String(key)}]]`);
        const shadowKey = Symbol(`[[signal:${String(key)}:shadow]]`);
        const utils = this.utils;
        context.addInitializer(function () {
            const prototype = isStatic ? this : this.constructor.prototype;
            let customGetter;
            let customSetter;
            const read = function () {
                if (baseGetter && !this[shadowKey])
                    return baseGetter.call(this);
                if (customGetter && !this[shadowKey])
                    return customGetter.call(this);
                return this[backingKey];
            };
            const write = function (v) {
                if (!customSetter && !baseSetter) {
                    this[backingKey] = v;
                    this[shadowKey] = true;
                }
                else {
                    if (baseSetter)
                        baseSetter.call(this, v);
                    if (customSetter)
                        customSetter.call(this, v);
                    if (!customGetter && !baseGetter) {
                        this[backingKey] = v;
                        this[shadowKey] = true;
                    }
                }
            };
            const ensureEntry = (self, diffOnWrite = true) => {
                let entry = utils.getSignal(self, key);
                if (entry)
                    return entry;
                if (kind === "field" && !customGetter && !baseGetter)
                    self[backingKey] = self[key];
                entry = utils.createSignalEntry(undefined, self, key, () => read.call(self), (v) => write.call(self, v), { diffOnWrite });
                if (kind === "field")
                    delete self[key];
                return entry;
            };
            if (kind === "field" || kind === "accessor") {
                const descriptor = getFirstDescriptorInChain(this, key);
                const acc = value;
                //Read and write through whatever is already installed at this key, falling back to the
                //member's own accessor pair when nothing is. A decorator applied closer to the declaration
                //— `@signal @auto(...) accessor x` — has already redefined the property, and it is its
                //getter and setter that carry the default value and the preprocessing. Going straight to
                //the raw pair would step over them and strand the value in a slot nothing else reads.
                if (descriptor?.get || descriptor?.set) {
                    customGetter = descriptor.get;
                    customSetter = descriptor.set;
                }
                else {
                    if (acc?.get)
                        customGetter = acc.get;
                    if (acc?.set)
                        customSetter = acc.set;
                }
                const entry = ensureEntry(this, !customGetter && !baseGetter);
                Object.defineProperty(this, key, {
                    configurable: descriptor?.configurable ?? true,
                    enumerable: descriptor?.enumerable ?? true,
                    get: () => {
                        utils.track(entry);
                        return read.call(this);
                    },
                    set: (v) => entry.set(v),
                });
            }
            else if (kind === "getter" || kind === "setter") {
                const installed = utils.constructorData(prototype).installed;
                if (installed.get(key))
                    return;
                installed.set(key, true);
                const descriptor = getFirstDescriptorInChain(prototype, key) ?? {};
                if (typeof descriptor.get === "function")
                    customGetter = descriptor.get;
                if (typeof descriptor.set === "function")
                    customSetter = descriptor.set;
                Object.defineProperty(prototype, key, {
                    configurable: descriptor?.configurable ?? true,
                    enumerable: !!descriptor?.enumerable,
                    get: function () {
                        const e = ensureEntry(this, !customGetter && !baseGetter);
                        utils.track(e);
                        return read.call(this);
                    },
                    set: function (v) {
                        const e = ensureEntry(this, !customGetter && !baseGetter);
                        e.set(v);
                    },
                });
            }
            if (callSetterOnInitialize) {
                const current = baseGetter?.call(this) ?? customGetter?.call(this);
                if (isUndefined(current))
                    ensureEntry(this, !customGetter && !baseGetter).set(undefined);
            }
        });
    }
}

/**
 * @internal
 * @class EffectUtils
 * @description Builds and runs {@link Effect} objects for the `@effect` decorator. Handles dependency
 * collection, cleanup between runs, and teardown.
 */
class EffectUtils {
    utils;
    constructor(utils) {
        this.utils = utils;
    }
    makeEffect(callback) {
        const utils = this.utils;
        return {
            callback,
            dependencies: new Set(),
            cleanups: [],
            scheduled: false,
            run() {
                for (const c of this.cleanups)
                    c();
                this.cleanups = [];
                this.dependencies = new Set();
                utils.activeEffect = this;
                try {
                    this.callback();
                }
                finally {
                    utils.activeEffect = null;
                }
                for (const dep of this.dependencies) {
                    const unsub = dep.sub(() => utils.schedule(this));
                    this.cleanups.push(unsub);
                }
            },
            dispose() {
                for (const c of this.cleanups)
                    c();
                this.cleanups = [];
                this.dependencies.clear();
            }
        };
    }
}

const utils$a = new ReactivityUtils();
const signalUtils = new SignalUtils(utils$a);
const effectUtils = new EffectUtils(utils$a);
function signal(...args) {
    // Decorator
    if (args.length === 2 && args[1] && typeof args[1] === "object"
        && "kind" in args[1] && "name" in args[1] && "static" in args[1] && "private" in args[1]) {
        return signalUtils.signalDecorator(args[0], args[1]);
    }
    // Getter + setter: signal(get, set, target?, ...keys)
    if (typeof args[0] === "function" && typeof args[1] === "function") {
        const [get, set, target, ...keys] = args;
        const key = keys.length === 1 ? keys[0] : keys.length > 1 ? utils$a.serializePath(keys) : undefined;
        return signalUtils.createBoxFromEntry(utils$a.createSignalEntry(undefined, target, key, get, set));
    }
    // From value: signal(initial?, target?, ...keys)
    const [initial, target, ...keys] = args;
    const key = keys.length === 1 ? keys[0] : keys.length > 1 ? utils$a.serializePath(keys) : undefined;
    return signalUtils.createBoxFromEntry(utils$a.createSignalEntry(initial, target, key));
}
/**
 * @decorator
 * @function modelSignal
 * @group Decorators
 * @category Signal
 *
 * @description Stage-3 decorator that turns a field on a {@link GradumModel} into a reactive property
 * stored in the model's data, rather than on the instance. Use it for state that must be persisted or
 * synced — on a {@link GradumYModel} the value lives in the underlying Y.js structure. Use `@signal`
 * instead for state that should stay in memory.
 * @param {...KeyType[]} keys - The key path into the model's data. Defaults to the decorated member name if omitted.
 *
 * @example
 * ```ts
 * class TodoModel extends GradumModel {
 *   @modelSignal() title = "";
 *   @modelSignal("meta", "author") author = "";
 * }
 * ```
 * Is equivalent to:
 * ```ts
 * class TodoModel extends GradumModel {
 *   @signal get title() { return this.get("title"); }
 *   set title(value) { this.set(value, "title"); }
 *
 *   @signal get author() { return this.get("meta", "author"); }
 *   set author(value) { this.set(value, "meta", "author"); }
 * }
 * ```
 */
function modelSignal(...keys) {
    return function (value, context) {
        const resolvedKeys = keys.length > 0 ? keys : [String(context.name)];
        context.addInitializer(function () {
            utils$a.bindPath(this, context.name, resolvedKeys);
        });
        let defaultValue = undefined;
        let hasDefault = false;
        const decorated = signalUtils.signalDecorator(value, context, function () {
            const v = this.get?.(...resolvedKeys);
            if (v !== undefined)
                return v;
            if (hasDefault) {
                this.set?.(defaultValue, ...resolvedKeys);
                return defaultValue;
            }
            return undefined;
        }, function (v) {
            this.set?.(v, ...resolvedKeys);
        });
        if (context.kind === "field") {
            return function (initialFieldValue) {
                if (initialFieldValue !== undefined) {
                    defaultValue = initialFieldValue;
                    hasDefault = true;
                }
                return decorated?.call(this, initialFieldValue);
            };
        }
        return decorated;
    };
}
/**
 * @decorator
 * @function nestedModelSignal
 * @group Decorators
 * @category Signal
 *
 * @description Stage-3 decorator that exposes a nested collection as a {@link GradumModel} rather than as
 * raw data. Reading the property gives back the nested model, so you can attach a {@link GradumObserver}
 * to it; assigning replaces the data it wraps. Use it when you need to observe a collection — reach for
 * `@modelSignal` when the raw value is enough.
 * @param {...string[]} keys - The key path navigating to the nested model.
 *
 * @example
 * ```ts
 * class AppModel extends GradumModel {
 *   @nestedModelSignal("users", "42") user = undefined;
 * }
 * ```
 * Is equivalent to:
 * ```ts
 * class AppModel extends GradumModel {
 *   @signal get user() { return this.getNested("users", "42"); }
 *   set user(value) { this.getNested("users", "42").data = value; }
 * }
 * ```
 */
function nestedModelSignal(...keys) {
    return function (value, context) {
        const resolvedKeys = keys.length > 0 ? keys : [String(context.name)];
        context.addInitializer(function () {
            utils$a.bindPath(this, context.name, resolvedKeys);
        });
        return signalUtils.signalDecorator(value, context, function () {
            return this.nest?.(...resolvedKeys);
        }, function (value) {
            this.set?.(value, ...resolvedKeys);
        });
    };
}
/**
 * @decorator
 * @function isolatedModelSignal
 * @group Decorators
 * @category Signal
 *
 * @description Decorator that binds a reactive signal to a nested {@link GradumModel} at the given key path,
 * where the nested model's data is **not** stored inside the parent model's data container.
 *
 * Use this when the nested model holds data that lives outside the parent's data tree — for example,
 * a Y.js type that is already part of a Y.js document at a different location. Unlike
 * {@link nestedModelSignal}, this decorator does **not** write to the parent model's data when
 * the value is set, so it will not attempt to insert a foreign Y.js type into the parent's Y.js
 * structure (which would throw, since a Y.js type can only belong to one place in a document).
 *
 * - Getter returns the nested model instance via `this.nest(...keys)`.
 * - Setter assigns directly to `nestedModel.data = value`, leaving the parent's data untouched.
 *
 * **Limitation:** `@modelSignal("myField", "subKey")` will **not** work for a field backed by
 * `@isolatedModelSignal`, because `GradumModel.get()` reads through the parent's data container
 * rather than routing through registered nested models. Access sub-keys directly through the
 * nested model instead: `(this.myField as MyNestedModel).subKey`.
 * @param {...string[]} keys - The key path identifying the nested model slot. Defaults to the
 * decorated property name if omitted.
 *
 * @example
 * ```ts
 * class CardModel extends GradumYModel {
 *   // Foreign YMap managed elsewhere in the Y.js document — must not be written into this
 *   // model's data tree.
 *   @isolatedModelSignal() cardData: CardDataModel;
 * }
 * ```
 * Is equivalent to:
 * ```ts
 * class CardModel extends GradumYModel {
 *   @signal get cardData() { return this.nest("cardData"); }
 *   set cardData(value) { this.nest("cardData").data = value; }
 * }
 * ```
 */
function isolatedModelSignal(...keys) {
    return function (value, context) {
        const resolvedKeys = keys.length > 0 ? keys : [String(context.name)];
        context.addInitializer(function () {
            utils$a.bindPath(this, context.name, resolvedKeys);
        });
        return signalUtils.signalDecorator(value, context, function () {
            return this.nest?.(...resolvedKeys);
        }, function (value) {
            const model = this.nest?.(...resolvedKeys);
            if (model)
                model.data = value;
        });
    };
}
function effect(...args) {
    const value = args[0];
    const context = args[1];
    if (context && typeof context === "object" && "kind" in context
        && "name" in context && "static" in context && "private" in context) {
        const { kind, name, static: isStatic } = context;
        const key = String(name);
        if (kind !== "method" && kind !== "getter" && !(kind === "field" && typeof value === "function"))
            throw new Error("@effect can only decorate zero-arg instance methods or getters.");
        if (isStatic)
            throw new Error("@effect does not support static methods/getters.");
        context.addInitializer?.(function () {
            const self = this;
            const fn = function () {
                value?.call(this);
            };
            const eff = effectUtils.makeEffect(() => fn.call(self));
            utils$a.setEffect(self, key, eff);
        });
    }
    else if (typeof value === "function") {
        const eff = effectUtils.makeEffect(value);
        eff.run();
        return () => eff.dispose();
    }
}
/**
 * @function trackSignal
 * @group Decorators
 * @category Signal
 *
 * @description Register a signal as a dependency of the effect currently running, without reading through
 * it. Use it when a value is fetched by some other route — a lookup, a data walk — but should still make the
 * surrounding `@effect` re-run when that signal changes. Outside an effect it does nothing.
 * @param {SignalEntry} entry - The signal to depend on.
 */
function trackSignal(entry) {
    if (!entry)
        return;
    utils$a.track(entry);
}
/**
 * @function getSignal
 * @group Decorators
 * @category Signal
 *
 * @template Type - The type of the value held by the signal.
 * @description Retrieve the signal backing a reactive property, to read or subscribe to it without
 * going through the property itself.
 * @param {object} target - The object the signal is bound to.
 * @param {PropertyKey} key - The key of the signal inside `target`.
 * @returns {SignalEntry<Type>} The signal, or `undefined` if `key` is not reactive on `target`.
 */
function getSignal(target, key) {
    return utils$a.getSignal(target, key);
}
/**
 * @function setSignal
 * @group Decorators
 * @category Signal
 *
 * @template Type - The type of the value held by the signal.
 * @description Write to a reactive property through its signal, notifying subscribers and effects.
 * @param {object} target - The target to which the signal is bound.
 * @param {PropertyKey} key - The key of the signal inside `target`.
 * @param {Type} value - The new value of the signal.
 */
function setSignal(target, key, value) {
    return utils$a.setSignal(target, key, value);
}
function markDirty(target, ...keys) {
    const computedKey = keys.length > 1
        ? utils$a.getKeyFromPath(target, keys)
        : keys[0];
    return utils$a.markDirty(target, computedKey ?? keys[0]);
}
/**
 * @function markDirtyPath
 * @group Decorators
 * @category Signal
 *
 * @description Marks as dirty every signal whose bound key path (registered via {@link modelSignal} or
 * {@link nestedModelSignal}) overlaps the given changed key path, and fires their attached effects.
 * A bound path overlaps the changed path when either is a prefix of (or equal to) the other:
 * replacing a parent value invalidates signals bound deeper inside it, and changing a nested value
 * invalidates signals bound to any of its ancestors. An empty `keys` array marks every bound path dirty,
 * as it represents a change at the root.
 * @param {object} target - The target to which the signals are bound.
 * @param {KeyType[]} keys - The key path of the data that changed.
 */
function markDirtyPath(target, keys) {
    utils$a.markDirtyPath(target, keys);
}
/**
 * @function initializeEffects
 * @group Decorators
 * @category Effect
 *
 * @description Initializes and runs all the effects attached to the given `target`.
 * @param {object} target - The target to which the effects are bound.
 */
function initializeEffects(target) {
    for (const [, entry] of utils$a.data(target).propertyKeyMap)
        entry.effect?.run();
}
function disposeEffect(target, key) {
    const dispose = (data) => {
        data.effect?.dispose();
        data.effect = undefined;
    };
    if (key !== undefined)
        dispose(utils$a.getReactivityData(target, key));
    else
        for (const [, entry] of utils$a.data(target).propertyKeyMap)
            dispose(entry);
}
/**
 * @function untrack
 * @group Decorators
 * @category Effect
 *
 * @template T - The type returned by the callback.
 * @description Read signals without subscribing to them. Signals read inside the callback are not recorded
 * as dependencies of the surrounding `@effect`, so changing them later will not re-run it. Use it when an
 * effect needs a value to compute with but should not fire when that value changes — reading a current
 * index or a configuration flag, say, while only tracking the data being rendered.
 * @param {() => T} fn - The callback to run outside the tracking context.
 * @returns {T} Whatever the callback returns.
 *
 * @example
 * ```ts
 * @effect private render() {
 *    // re-runs when `items` changes, but not when `verbose` does
 *    this.draw(this.model.items, untrack(() => this.model.verbose));
 * }
 * ```
 */
function untrack(fn) {
    const prev = utils$a.activeEffect;
    utils$a.activeEffect = null;
    try {
        return fn();
    }
    finally {
        utils$a.activeEffect = prev;
    }
}

/**
 * @internal
 * @class SimpleDelegate
 * @template {(...args: any[]) => any} CallbackType - The type of callbacks accepted by the delegate.
 * @description Class representing a set of callbacks that can be maintained and executed together.
 */
class SimpleDelegate {
    callbacks = new Set();
    /**
     * @function add
     * @description Register a callback. Adding the same callback twice has no effect.
     * @param {CallbackType} callback - The callback to register.
     */
    add(callback) {
        this.callbacks.add(callback);
    }
    /**
     * @function remove
     * @description Unregister a callback.
     * @param {CallbackType} callback - The callback to unregister.
     * @returns {boolean} Whether the callback was registered and has been removed.
     */
    remove(callback) {
        return this.callbacks.delete(callback);
    }
    /**
     * @function has
     * @description Check whether a callback is registered.
     * @param {CallbackType} callback - The callback to look for.
     * @returns {boolean} Whether the callback is registered.
     */
    has(callback) {
        return this.callbacks.has(callback);
    }
    /**
     * @function fire
     * @description Invoke every registered callback with the given arguments. A callback that throws is
     * logged and skipped, so one failure does not stop the rest.
     * @param {...Parameters<CallbackType>} args - Arguments passed to each callback.
     * @returns {ReturnType<CallbackType>} The last value returned by a callback, ignoring those that
     * returned `undefined`.
     */
    fire(...args) {
        let returnValue;
        for (const callback of this.callbacks) {
            try {
                const value = callback(...args);
                if (!isUndefined(value))
                    returnValue = value;
            }
            catch (error) {
                console.error("Error invoking callback:", error);
            }
        }
        return returnValue;
    }
    /**
     * @function clear
     * @description Unregister every callback.
     */
    clear() {
        this.callbacks.clear();
    }
}
/**
 * @class Delegate
 * @group Components
 * @category Data Structures
 *
 * @template {(...args: any[]) => any} CallbackType - The type of callbacks accepted by the delegate.
 * @description A set of callbacks kept together and fired as one, used throughout the library wherever a
 * component announces something (`onChanged`, `onSelected`, ...). Subscribe with {@link Delegate.add} and
 * drop the subscription with {@link Delegate.remove}. Unlike its plain counterpart, this one announces
 * its own subscriptions through {@link Delegate.onAdded}.
 */
class Delegate extends SimpleDelegate {
    /**
     * @description Fired whenever a callback is registered on this delegate, with the new callback as its
     * argument. Use it to react to something starting to listen.
     */
    onAdded = new SimpleDelegate();
    /**
     * @function add
     * @description Register a callback, then fire {@link Delegate.onAdded} with it.
     * @param {CallbackType} callback - The callback to register.
     */
    add(callback) {
        super.add(callback);
        this.onAdded.fire(callback);
    }
}

/**
 * @internal
 * @class GradumNestedMapNode
 * @description One level of a {@link GradumNestedMap}. Holds either child nodes or leaf values.
 */
class GradumNestedMapNode extends Map {
}
/**
 * @class GradumNestedMap
 * @group Components
 * @category Data Structures
 *
 * @template ValueType - The type of stored values.
 * @template KeyType - The type of keys at each level of the path. Defaults to `string | symbol | number`.
 * @description A map of arbitrary nesting depth, addressed by a `...keys` path rather than a single key.
 * Entries can also be reached by a flat key that collapses a whole path into one value, so a nested
 * structure can be indexed as if it were flat.
 */
class GradumNestedMap {
    /**
     * @protected
     * @readonly
     * @description The root of the nested structure holding this map's entries.
     */
    nestedMap = new GradumNestedMapNode();
    /*
     *
     * GET
     *
     */
    /**
     * @function get
     * @description Retrieve the value at the given key path.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     * @returns {ValueType | undefined} The stored value, or `undefined` if not found.
     */
    get(...keys) {
        let node = this.nestedMap;
        for (const key of keys) {
            if (!(node instanceof GradumNestedMapNode))
                return;
            node = node.get(key);
        }
        return node;
    }
    /**
     * @function getFlat
     * @description Retrieve the value at the given flat key.
     * @param {number | string} flatKey - A flat key produced by {@link flattenKey}.
     * @param {number} [depth] - Optional depth of the entry for numerical flat keys.
     * @returns {ValueType | undefined} The stored value, or `undefined` if not found.
     */
    getFlat(flatKey, depth) {
        const keys = this.scopeKey(flatKey, depth);
        if (keys?.length)
            return this.get(...keys);
    }
    /**
     * @function getKey
     * @description Find the key path of the first occurrence of the given value.
     * @param {ValueType} value - The value to locate.
     * @returns {KeyType[] | undefined} The key path, or `undefined` if not found.
     */
    getKey(value) {
        return this.findPaths(this.nestedMap, value, false)[0];
    }
    /**
     * @function getKeys
     * @description Find the key paths of all occurrences of the given value.
     * @param {ValueType} value - The value to locate.
     * @returns {KeyType[][]} Array of key paths.
     */
    getKeys(value) {
        return this.findPaths(this.nestedMap, value);
    }
    /**
     * @function getFlatKey
     * @description Return the flat key of the first occurrence of the given value.
     * @param {ValueType} value - The value to query.
     * @returns {string | number | undefined} The flat key, or `undefined` if not found.
     */
    getFlatKey(value) {
        const path = this.findPaths(this.nestedMap, value, false)[0];
        if (!path)
            return undefined;
        return this.flattenKey(...path);
    }
    /*
     *
     * SET
     *
     */
    /**
     * @function set
     * @description Store a value at the given key path. Intermediate nodes are created automatically.
     * @param {ValueType} value - The value to store.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     */
    set(value, ...keys) {
        if (!keys.length)
            return;
        let node = this.nestedMap;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!node.has(key) || !(node.get(key) instanceof GradumNestedMapNode))
                node.set(key, new GradumNestedMapNode());
            node = node.get(key);
        }
        node.set(keys[keys.length - 1], value);
    }
    /**
     * @function setFlat
     * @description Store a value at the given flat key.
     * @param {ValueType} value - The value to store.
     * @param {number | string} flatKey - A flat key produced by {@link flattenKey}.
     * @param {number} [depth] - Optional depth of the entry for numerical flat keys.
     */
    setFlat(value, flatKey, depth) {
        const keys = this.scopeKey(flatKey, depth);
        if (keys?.length)
            this.set(value, ...keys);
    }
    /*
     *
     * HAS
     *
     */
    /**
     * @function has
     * @description Check whether an entry exists at the given key path.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     * @returns {boolean}
     */
    has(...keys) {
        if (!keys.length)
            return false;
        const parent = this.get(...keys.slice(0, -1));
        if (!(parent instanceof GradumNestedMapNode))
            return false;
        return parent.has(keys[keys.length - 1]);
    }
    /**
     * @function hasFlat
     * @description Check whether an entry exists at the given flat key.
     * @param {number | string} flatKey - A flat key produced by {@link flattenKey}.
     * @param {number} [depth] - Optional depth of the entry for numerical flat keys.
     * @returns {boolean}
     */
    hasFlat(flatKey, depth) {
        const keys = this.scopeKey(flatKey, depth);
        return keys?.length ? this.has(...keys) : false;
    }
    /**
     * @function hasValue
     * @description Check whether the given value exists anywhere in the map.
     * @param {ValueType} value - The value to look for.
     * @returns {boolean}
     */
    hasValue(value) {
        return !!this.getKey(value);
    }
    /*
     *
     * REMOVE
     *
     */
    /**
     * @function remove
     * @description Remove the entry at the given key path.
     * @param {...KeyType[]} keys - Ordered path from outermost to innermost key.
     */
    remove(...keys) {
        if (!keys.length)
            return;
        const parent = this.get(...keys.slice(0, -1));
        if (parent instanceof GradumNestedMapNode)
            parent.delete(keys[keys.length - 1]);
    }
    /**
     * @function removeValue
     * @description Remove the first occurrence of the given value.
     * @param {ValueType} value - The value to remove.
     */
    removeValue(value) {
        const path = this.findPaths(this.nestedMap, value, false)[0];
        if (path)
            this.remove(...path);
    }
    /**
     * @function removeValues
     * @description Remove all occurrences of the given value.
     * @param {ValueType} value - The value to remove.
     */
    removeValues(value) {
        this.findPaths(this.nestedMap, value).forEach(path => this.remove(...path));
    }
    /*
     *
     * ENTRIES
     *
     */
    /**
     * @function getEntriesAt
     * @description Return all leaf `[key, value]` pairs under the given path, sorted alphabetically by key.
     * Pass no keys to get all leaf entries in the map.
     * @param {...KeyType[]} keys - Path to the subtree root.
     * @returns {[KeyType, ValueType][]}
     */
    getEntriesAt(...keys) {
        return this.getPathsAt(...keys).map(path => [path[path.length - 1], this.get(...path)]);
    }
    /**
     * @description All leaf `[key, value]` pairs in the nested map, sorted alphabetically by key.
     */
    get entries() {
        return this.getEntriesAt();
    }
    /*
     *
     * KEYS
     *
     */
    /**
     * @function getKeysAt
     * @description Return all leaf keys under the given path, sorted alphabetically.
     * Pass no keys to get all leaf keys in the map.
     * @param {...KeyType[]} keys - Path to the parent node.
     * @returns {KeyType[]}
     */
    getKeysAt(...keys) {
        return this.getEntriesAt(...keys).map(e => e[0]);
    }
    /**
     * @description All leaf keys in the nested map, sorted alphabetically.
     */
    get keys() {
        return this.getKeysAt();
    }
    /*
     *
     * VALUES
     *
     */
    /**
     * @function getValuesAt
     * @description Return all leaf values under the given path, sorted alphabetically by key.
     * Pass no keys to get all leaf values in the map.
     * @param {...KeyType[]} keys - Path to the parent node.
     * @returns {ValueType[]}
     */
    getValuesAt(...keys) {
        return this.getEntriesAt(...keys).map(e => e[1]);
    }
    /**
     * @description All leaf values in the nested map, sorted alphabetically by key.
     */
    get values() {
        return this.getValuesAt();
    }
    /*
     *
     * PATHS
     *
     */
    /**
     * @function getPathsAt
     * @description Return all leaf key paths under the given path.
     * Pass no keys to get all leaf paths in the map.
     * @param {...KeyType[]} keys - Path to the subtree root.
     * @returns {KeyType[][]}
     */
    getPathsAt(...keys) {
        return this.findPaths(this.get(...keys));
    }
    /**
     * @description All leaf key paths in the map.
     */
    get paths() {
        return this.getPathsAt();
    }
    /*
     *
     * SIZE
     *
     */
    /**
     * @function getSizeAt
     * @description Return the number of leaf entries under the given path.
     * Pass no keys to get the number of all leaf entries.
     * @param {...KeyType[]} keys - Path to the root.
     * @returns {number}
     */
    getSizeAt(...keys) {
        return this.getPathsAt(...keys).length;
    }
    /**
     * @description Number of all leaf entries in the nested map.
     */
    get size() {
        return this.getSizeAt();
    }
    /*
     *
     * SCOPE AND FLAT UTILS
     *
     */
    /**
     * @function flattenKey
     * @description Serialize a key path into a single flat key.
     * - Fully numeric paths produce a numeric global leaf index.
     * - All other paths produce a `"k0|k1|k2|..."` string.
     * @param {...KeyType[]} keys - The key path to serialize.
     * @returns {string | number | undefined} The flat key, or `undefined` if the path is invalid.
     */
    flattenKey(...keys) {
        if (!keys.length)
            return;
        const compatible = keys.map(k => this.getFlatCompatibleKey(k));
        if (compatible.some(k => k === undefined))
            return;
        if (compatible.every(k => typeof k === "number")) {
            let index = 0;
            const allLeafPaths = this.findPaths(this.nestedMap).filter(p => p.length === keys.length);
            for (const path of allLeafPaths) {
                if (path.every((k, i) => k === keys[i]))
                    return index;
                index++;
            }
        }
        return compatible.map(k => k.toString()).join("|");
    }
    /**
     * @function scopeKey
     * @description Convert a flat key back into a key path. Reverses {@link flattenKey}.
     * - A string `"k0|k1|k2"` becomes `[k0, k1, k2]`.
     * - A numeric global leaf index becomes the corresponding numeric path.
     * @param {number | string} flatKey - The flat key to convert.
     * @param {number} [depth] - Optional depth of the entry for numerical flat keys.
     * @returns {KeyType[] | undefined} The key path, or `undefined` if conversion fails.
     */
    scopeKey(flatKey, depth) {
        if (typeof flatKey === "string") {
            const parts = flatKey.split("|");
            return parts.length >= 1 ? parts : undefined;
        }
        if (typeof flatKey === "number") {
            const allLeafPaths = depth !== undefined
                ? this.findPaths(this.nestedMap).filter(p => p.length === depth)
                : this.findPaths(this.nestedMap);
            if (flatKey < 0)
                return allLeafPaths[0];
            if (flatKey >= allLeafPaths.length)
                return allLeafPaths[allLeafPaths.length - 1];
            return allLeafPaths[flatKey];
        }
        return undefined;
    }
    /**
     * @function clear
     * @description Remove all entries from the map.
     */
    clear() {
        this.nestedMap.clear();
    }
    /*
     *
     * PROTECTED
     *
     */
    findPaths(node, target, allPaths = true, prefix = []) {
        if (!node || !(node instanceof GradumNestedMapNode))
            return [];
        const results = [];
        const entries = Array.from(node.entries())
            .sort((a, b) => alphabeticalSorting(a[0], b[0]));
        for (const [key, value] of entries) {
            const path = [...prefix, key];
            if (value instanceof GradumNestedMapNode) {
                const nested = this.findPaths(value, target, allPaths, path);
                if (!allPaths && target !== undefined && nested.length)
                    return nested;
                else
                    results.push(...nested);
            }
            else {
                if (allPaths && target === undefined)
                    results.push(path);
                else if (value === target) {
                    results.push(path);
                    if (!allPaths)
                        return results;
                }
            }
        }
        return results;
    }
    getFlatCompatibleKey(key) {
        if (typeof key === "number" || typeof key === "string")
            return key;
        const s = stringify(key);
        return s !== undefined ? s : undefined;
    }
}

/**
 * @class GradumObserver
 * @group MVC
 * @category Model
 *
 * @extends GradumNestedMap
 * @template DataType - The type of data handled by the observer.
 * @template {object} ComponentType - The instance type created/managed by the observer.
 * @template {KeyType} DataKeyType - The key type used at each level of the path.
 * @description Generic observer that keeps a set of component instances organized by key path.
 * Useful to maintain UI components or other per-entry objects synchronized with a data source
 * ({@link GradumModel}).
 *
 */
class GradumObserver extends GradumNestedMap {
    _isInitialized = false;
    prevData = new GradumNestedMap();
    replaceOnUpdate;
    /**
     * @readonly
     * @description Delegate called when a change is reported at a key path for which no component instance exists yet.
     * Handlers may return a newly-created component instance, which will be stored and passed to subsequent
     * `onUpdated` calls.
     */
    onAdded = new Delegate();
    /**
     * @readonly
     * @description Delegate called when a change is reported at a key path that already has an associated instance.
     */
    onUpdated = new Delegate();
    /**
     * @readonly
     * @description Delegate called when a key path is reported as deleted.
     */
    onDeleted = new Delegate();
    /**
     * @readonly
     * @description Delegate fired once when the observer is initialized. Useful for initial population.
     */
    onInitialize = new Delegate();
    /**
     * @readonly
     * @description Delegate fired when the observer is destroyed.
     */
    onDestroy = new Delegate();
    /**
     * @constructor
     * @description Create a GradumObserver.
     * By default, `onUpdated` updates the data of the mapped instance if it exposes a {@link GradumModel} model,
     * or `data` / `dataId` fields. `onDeleted` removes the instance from the map and the DOM.
     * @param {GradumObserverProperties<DataType, ComponentType, KeyType>} [properties] - Initialization
     * options and lifecycle callbacks.
     */
    constructor(properties = {}) {
        super();
        if (properties.onAdded)
            this.onAdded.add((data, self, ...keys) => properties.onAdded(data, self, ...keys));
        this.onUpdated.add((data, instance, self, ...keys) => {
            if (properties.onUpdated)
                properties.onUpdated(data, instance, self, ...keys);
            else {
                if (typeof instance !== "object")
                    return;
                if ("data" in instance)
                    instance.data = data;
                if ("dataId" in instance)
                    instance.dataId = keys[keys.length - 1].toString();
            }
        });
        this.onDeleted.add((data, instance, self, ...keys) => {
            if (properties.onDeleted)
                properties.onDeleted(data, instance, self, ...keys);
            else
                this.removeValue(instance);
        });
        if (properties.replaceOnUpdate)
            this.replaceOnUpdate = properties.replaceOnUpdate;
        if (properties.onInitialize)
            this.onInitialize.add((self) => properties.onInitialize(self));
        if (properties.onDestroy)
            this.onDestroy.add((self) => properties.onDestroy(self));
        if (properties.initialize)
            this.initialize();
    }
    /**
     * @function remove
     * @description Remove the instance at the given key path from the map and call `instance.remove()` if available.
     * @param {...KeyType[]} keys - Ordered path to the instance.
     */
    remove(...keys) {
        const instance = this.get(...keys);
        super.remove(...keys);
        if (!instance)
            return;
        if (instance && typeof instance === "object"
            && "remove" in instance && typeof instance.remove == "function")
            instance?.remove();
    }
    /**
     * @function detach
     * @description Remove the instance at the given key path from the map without calling `instance.remove()`,
     * detaching it from the observer.
     * @param {...KeyType[]} keys - Ordered path to the instance.
     */
    detach(...keys) {
        super.remove(...keys);
    }
    /**
     * @readonly
     * @description Whether the observer has been initialized (i.e. {@link initialize} has been called).
     */
    get isInitialized() {
        return this._isInitialized;
    }
    /**
     * @function initialize
     * @description Initialization method that fires `onInitialize`. No-op if already initialized.
     */
    initialize() {
        if (this.isInitialized)
            return;
        this.onInitialize.fire(this);
        this._isInitialized = true;
    }
    /**
     * @function clear
     * @description Remove all managed instances, reset the observer to an uninitialized state, and optionally
     * call `instance.remove()` on each instance.
     * @param {boolean} [removeFromDom=true] - Whether to call `instance.remove()` on each managed instance.
     */
    clear(removeFromDom = true) {
        if (removeFromDom)
            this.values.forEach(instance => {
                if (typeof instance === "object" && "remove" in instance && typeof instance.remove == "function")
                    instance.remove();
            });
        super.clear();
        this.prevData.clear();
        this._isInitialized = false;
    }
    /**
     * @function destroy
     * @description Remove all managed instances, reset the observer to an uninitialized state, optionally
     * call `instance.remove()` on each instance, and fire `onDestroy`.
     * @param {boolean} [removeFromDom=true] - Whether to call `instance.remove()` on each managed instance.
     */
    destroy(removeFromDom = true) {
        this.clear(removeFromDom);
        this.onDestroy.fire(this);
    }
    /**
     * @function keyChanged
     * @description Notify the observer of a change at the given key path.
     * Fires `onDeleted` if `deleted` is `true` and an instance exists, `onAdded` if no instance exists yet
     * (storing the returned instance if any), and `onUpdated` otherwise.
     * @param {KeyType[]} keys - The key path that changed.
     * @param {DataType} value - The new value at that path.
     * @param {boolean} [deleted=false] - Whether the entry was deleted.
     */
    keyChanged(keys, value, deleted = false) {
        let instance = this.get(...keys);
        if (!instance && deleted)
            return;
        if (instance && deleted) {
            // Model-side deletions pass value = undefined by convention; recover the last
            // seen value so onDeleted handlers know what was removed.
            const prev = this.prevData.get(...keys);
            this.prevData.remove(...keys);
            this.onDeleted.fire(value ?? prev, instance, this, ...keys);
            return;
        }
        if (instance && this.replaceOnUpdate) {
            const prev = this.prevData.get(...keys);
            if (this.replaceOnUpdate(prev, value, instance, this, ...keys)) {
                // Semantically a different item at this key — destroy old, create new.
                this.prevData.remove(...keys);
                this.onDeleted.fire(prev, instance, this, ...keys);
                // Force-detach if the onDeleted handler didn't remove the instance.
                if (this.get(...keys) === instance)
                    this.detach(...keys);
                instance = undefined;
            }
        }
        if (!instance) {
            instance = this.onAdded.fire(value, this, ...keys);
            if (!instance)
                return;
            this.set(instance, ...keys);
        }
        this.prevData.set(value, ...keys);
        this.onUpdated.fire(value, instance, this, ...keys);
    }
}

/**
 * @enum {RegistryCategory}
 * @group Decorators
 * @category Registry
 *
 * @description The bucket a class is filed under in the Gradum Kit registry, and the value
 * {@link getRegisteredByCategories} groups by. {@link define} infers it by walking the class'
 * inheritance chain; within each family below the categories are listed most to least specific, and
 * the first match wins, so a class extending {@link GradumElement} is filed as `GradumElement` rather
 * than the `HTMLElement` it also inherits from.
 * @property {RegistryCategory.GradumProxiedElement} GradumProxiedElement - Gradum elements, most specific first.
 * @property {RegistryCategory.GradumElement} GradumElement - Gradum element extending `HTMLElement`.
 * @property {RegistryCategory.GradumBaseElement} GradumBaseElement - Shared element foundation.
 * @property {RegistryCategory.GradumHeadlessElement} GradumHeadlessElement - Element without a DOM node.
 * @property {RegistryCategory.SVGElement} SVGElement - Native DOM elements, most specific first.
 * @property {RegistryCategory.MathMLElement} MathMLElement - Native MathML element.
 * @property {RegistryCategory.HTMLElement} HTMLElement - Native HTML element.
 * @property {RegistryCategory.Element} Element - Any other native element.
 * @property {RegistryCategory.Node} Node - Any other DOM node.
 * @property {RegistryCategory.GradumOperator} GradumOperator - MVC pieces.
 * @property {RegistryCategory.GradumHandler} GradumHandler - Model-only helper.
 * @property {RegistryCategory.GradumInteractor} GradumInteractor - Tool-event listener holder.
 * @property {RegistryCategory.GradumTool} GradumTool - Capture-phase behavior holder.
 * @property {RegistryCategory.GradumConstrainer} GradumConstrainer - Constraint solver.
 * @property {RegistryCategory.GradumView} GradumView - View.
 * @property {RegistryCategory.GradumEmitter} GradumEmitter - Emitter.
 * @property {RegistryCategory.GradumModel} GradumModel - Model.
 * @property {RegistryCategory.Other} Other - Classes matching no recognized base type.
 */
var RegistryCategory;
(function (RegistryCategory) {
    RegistryCategory["GradumElement"] = "GradumElement";
    RegistryCategory["GradumBaseElement"] = "GradumBaseElement";
    RegistryCategory["GradumHeadlessElement"] = "GradumHeadlessElement";
    RegistryCategory["GradumProxiedElement"] = "GradumProxiedElement";
    RegistryCategory["HTMLElement"] = "HTMLElement";
    RegistryCategory["SVGElement"] = "SVGElement";
    RegistryCategory["MathMLElement"] = "MathMLElement";
    RegistryCategory["Element"] = "Element";
    RegistryCategory["Node"] = "Node";
    RegistryCategory["GradumModel"] = "GradumModel";
    RegistryCategory["GradumView"] = "GradumView";
    RegistryCategory["GradumEmitter"] = "GradumEmitter";
    RegistryCategory["GradumOperator"] = "GradumOperator";
    RegistryCategory["GradumHandler"] = "GradumHandler";
    RegistryCategory["GradumInteractor"] = "GradumInteractor";
    RegistryCategory["GradumTool"] = "GradumTool";
    RegistryCategory["GradumConstrainer"] = "GradumConstrainer";
    RegistryCategory["Other"] = "Other";
})(RegistryCategory || (RegistryCategory = {}));

/**
 * @internal
 * @class DefineDecoratorUtils
 * @description Backing store for {@link define}. Holds the class registry that the lookup functions
 * ({@link findRegistered}, {@link getRegisteredEntry}, ...) read from, and tracks which prototypes have
 * already had their custom-element hooks installed.
 */
class DefineDecoratorUtils {
    registry = new Map();
    categoryMap = new WeakMap();
    prototypeMap = new WeakMap();
    dataMap = new WeakMap();
    // -------------------------------------------------------------------------
    // Category registration
    // -------------------------------------------------------------------------
    /**
     * @description Registers a constructor's associated registry category. Called by each
     * Gradum Kit base class after its definition to avoid circular import dependencies.
     */
    setCategory(constructor, category) {
        this.categoryMap.set(constructor.prototype, category);
    }
    inferCategory(constructor) {
        let proto = constructor.prototype;
        while (proto && proto !== Object.prototype) {
            const category = this.categoryMap.get(proto);
            if (category)
                return category;
            proto = Object.getPrototypeOf(proto);
        }
        const p = constructor.prototype;
        if (p instanceof SVGElement)
            return RegistryCategory.SVGElement;
        if (typeof MathMLElement !== "undefined" && p instanceof MathMLElement)
            return RegistryCategory.MathMLElement;
        if (p instanceof HTMLElement)
            return RegistryCategory.HTMLElement;
        if (p instanceof Element)
            return RegistryCategory.Element;
        if (p instanceof Node)
            return RegistryCategory.Node;
        return RegistryCategory.Other;
    }
    // -------------------------------------------------------------------------
    // Registry
    // -------------------------------------------------------------------------
    register(constructor, name, tag, category) {
        const resolvedCategory = category ?? this.inferCategory(constructor);
        const entry = { constructor, category: resolvedCategory, name, tag };
        if (!this.registry.has(resolvedCategory))
            this.registry.set(resolvedCategory, new Map());
        this.registry.get(resolvedCategory)?.set(name, entry);
    }
    // -------------------------------------------------------------------------
    // Define utils
    // -------------------------------------------------------------------------
    data(element) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (!element)
            return {};
        if (!this.dataMap.has(element))
            this.dataMap.set(element, {});
        return this.dataMap.get(element);
    }
    prototype(prototype) {
        if (!prototype)
            return {};
        if (!this.prototypeMap.has(prototype))
            this.prototypeMap.set(prototype, {});
        return this.prototypeMap.get(prototype);
    }
    fieldSetInPrototype(prototype, field) {
        while (prototype && prototype !== HTMLElement.prototype) {
            if (this.prototype(prototype)[field])
                return true;
            prototype = Object.getPrototypeOf(prototype);
        }
        return false;
    }
    skipAttributeChangedCallback(prototype) {
        return this.fieldSetInPrototype(prototype, "setupAttributeChangedCallback");
    }
    skipConnectedCallback(prototype) {
        return this.fieldSetInPrototype(prototype, "setupConnectedCallback");
    }
    getNamesOfPrototypeChain(prototype) {
        const result = [];
        while (prototype && prototype !== HTMLElement.prototype) {
            const name = this.prototype(prototype).name;
            if (name)
                result.push(name);
            prototype = Object.getPrototypeOf(prototype);
        }
        return result;
    }
}

/**
 * @function camelToKebabCase
 * @group Utilities
 * @category String
 *
 * @description Convert a camelCase string to kebab-case, the form HTML attributes and CSS properties use.
 * @param {string} [str] - The string to convert.
 * @returns {string} The kebab-case string, or `undefined` if the input was empty or missing.
 */
function camelToKebabCase(str) {
    if (!str || str.length == 0)
        return;
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
/**
 * @function kebabToCamelCase
 * @group Utilities
 * @category String
 *
 * @description Convert a kebab-case string to camelCase, the form JavaScript properties use.
 * @param {string} [str] - The string to convert.
 * @returns {string} The camelCase string, or `undefined` if the input was empty or missing.
 */
function kebabToCamelCase(str) {
    if (!str || str.length == 0)
        return;
    return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

const utils$9 = new DefineDecoratorUtils();
function define(...args) {
    if (typeof args[0] === "function") {
        let [Base, elementName, className, options] = args;
        if (!className)
            className = Base?.name;
        if (!elementName)
            elementName = camelToKebabCase(className);
        return applyDefine(Base, className, elementName, options);
    }
    let [className, elementName, options] = args;
    return function (Base, context) {
        if (!className)
            className = context.name ?? Base?.constructor.name;
        if (!elementName)
            elementName = camelToKebabCase(className);
        return applyDefine(Base, className, elementName, options);
    };
}
/**
 * @internal
 * @function applyDefine
 * @template {new (...args: any[]) => HTMLElement} T - The class being defined.
 * @description The shared body behind {@link define} in both its decorator and imperative forms. Registers
 * the class and, when it is an element, registers the custom element and installs its hooks.
 * @param {T} Base - The class to define.
 * @param {string} [className] - The name to register under. Defaults to the class' own name.
 * @param {string} [elementName] - The custom element tag. Defaults to the kebab-cased class name.
 * @param {DefineOptions} [options] - Options controlling the attribute bridge.
 * @returns {T} The class, so callers can return it straight from a decorator.
 */
function applyDefine(Base, className, elementName, options = { injectAttributeBridge: true }) {
    const prototype = Base.prototype;
    utils$9.register(Base, className, prototype instanceof Element ? elementName : undefined);
    if (!(prototype instanceof Element))
        return Base;
    if (elementName)
        utils$9.prototype(prototype).name = elementName;
    Object.defineProperty(Base, "tagName", {
        configurable: true,
        enumerable: false,
        writable: false,
        value: elementName
    });
    if (typeof Base["create"] === "function" && !utils$9.prototype(Base.prototype).wrappedCreate) {
        utils$9.prototype(Base.prototype).wrappedCreate = true;
        const originalCreate = Base["create"];
        Object.defineProperty(Base, "create", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: function (properties = {}) {
                gradum(properties).applyDefaults({ tag: elementName, ...(this.defaultProperties ?? {}) });
                return originalCreate.call(this, properties);
            }
        });
    }
    Object.defineProperty(Base, "observedAttributes", {
        configurable: true,
        enumerable: false,
        get: function () {
            const combined = new Set();
            let constructor = this;
            while (constructor && constructor !== Function.prototype) {
                const set = constructor[Symbol.metadata]?.observedAttributes;
                if (set)
                    for (const entry of set)
                        combined.add(entry);
                constructor = Object.getPrototypeOf(constructor);
            }
            return Array.from(combined);
        },
    });
    if (options.injectAttributeBridge !== false && !utils$9.skipAttributeChangedCallback(prototype)) {
        utils$9.prototype(prototype).setupAttributeChangedCallback = true;
        const wrapper = function (name, oldValue, newValue) {
            getSuperMethod(this, "attributeChangedCallback", wrapper)?.call(this, name, oldValue, newValue);
            if (newValue === oldValue)
                return;
            if (utils$9.data(this).attributeBridgePass)
                return;
            const property = kebabToCamelCase(name);
            if (!(property in this))
                return;
            try {
                utils$9.data(this).attributeBridgePass = true;
                this[property] = newValue === null ? undefined : parse$1(newValue);
            }
            finally {
                utils$9.data(this).attributeBridgePass = false;
            }
        };
        Object.defineProperty(prototype, "attributeChangedCallback", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: wrapper
        });
    }
    if (!utils$9.skipConnectedCallback(prototype)) {
        utils$9.prototype(prototype).setupConnectedCallback = true;
        const wrapper = function () {
            getSuperMethod(this, "connectedCallback", wrapper)?.call(this);
            if (!(this instanceof HTMLElement))
                return;
            for (const attribute of this.constructor.observedAttributes ?? []) {
                const value = this[kebabToCamelCase(attribute)];
                if (value === undefined)
                    continue;
                const stringValue = stringify(value);
                if (this.getAttribute(attribute) !== stringValue)
                    this.setAttribute(attribute, stringValue);
            }
            utils$9.getNamesOfPrototypeChain(Object.getPrototypeOf(this)).forEach(name => this.classList?.add(name));
        };
        Object.defineProperty(prototype, "connectedCallback", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: wrapper,
        });
    }
    if (elementName && !customElements.get(elementName))
        customElements.define(elementName, Base);
    return Base;
}
/**
 * @function findRegistered
 * @group Decorators
 * @category Registry
 *
 * @description Finds a registered entry by name, optionally scoped to a specific category.
 * If no category is provided, searches across all categories and returns the first match.
 * @param {string} name - The registered name to search for.
 * @param {RegistryCategory} [category] - The category to scope the search to. Searches all categories if omitted.
 * @returns {RegistryEntry} The matching registry entry, or `undefined` if not found.
 */
function findRegistered(name, category) {
    if (category)
        return utils$9.registry.get(category)?.get(name);
    for (const map of utils$9.registry.values()) {
        const entry = map.get(name);
        if (entry)
            return entry;
    }
    return undefined;
}
/**
 * @function getRegisteredByCategories
 * @group Decorators
 * @category Registry
 *
 * @description Returns all registered entries across one or more specified categories.
 * @param {...RegistryCategory[]} categories - The categories to retrieve entries from.
 * @returns {RegistryEntry[]} An array of all registry entries in the specified categories.
 */
function getRegisteredByCategories(...categories) {
    return categories.flatMap(category => Array.from(utils$9.registry.get(category)?.values() ?? []));
}
/**
 * @function getAllRegistered
 * @group Decorators
 * @category Registry
 *
 * @description Returns all registered entries across every category in the registry.
 * @returns {RegistryEntry[]} An array of all registry entries.
 */
function getAllRegistered() {
    return Array.from(utils$9.registry.values()).flatMap(map => Array.from(map.values()));
}
/**
 * @function getRegisteredMvc
 * @group Decorators
 * @category Registry
 *
 * @description Returns all registered entries belonging to MVC-related categories:
 * `GradumOperator`, `GradumEmitter`, `GradumHandler`, `GradumInteractor`, `GradumModel`,
 * `GradumConstrainer`, `GradumTool`, and `GradumView`.
 * @returns {RegistryEntry[]} An array of all MVC registry entries.
 */
function getRegisteredMvc() {
    return getRegisteredByCategories(RegistryCategory.GradumOperator, RegistryCategory.GradumEmitter, RegistryCategory.GradumHandler, RegistryCategory.GradumInteractor, RegistryCategory.GradumModel, RegistryCategory.GradumConstrainer, RegistryCategory.GradumTool, RegistryCategory.GradumView);
}
/**
 * @function getRegisteredElements
 * @group Decorators
 * @category Registry
 *
 * @description Returns all registered entries belonging to element-related categories:
 * `GradumElement`, `GradumProxiedElement`, `Element`, `HTMLElement`, `SVGElement`, and `MathMLElement`.
 * @returns {RegistryEntry[]} An array of all element registry entries.
 */
function getRegisteredElements() {
    return getRegisteredByCategories(RegistryCategory.GradumElement, RegistryCategory.GradumProxiedElement, RegistryCategory.Element, RegistryCategory.HTMLElement, RegistryCategory.SVGElement, RegistryCategory.MathMLElement);
}
/**
 * @function addRegistryCategory
 * @group Decorators
 * @category Registry
 *
 * @description Associates a class constructor with a {@link RegistryCategory} in the Gradum Kit registry's
 * category inference map. When {@link define} is called on a subclass, it walks the prototype chain and
 * uses this map to determine the appropriate category without requiring direct imports of the base classes
 * (which would cause circular dependencies).
 *
 * This should be called once per base class, after its definition, by the Gradum Kit internals.
 * User-defined subclasses do not need to call this — category inference propagates automatically
 * through the prototype chain.
 * @param {new (...args: any[]) => object} type - The base class constructor to associate with a category.
 * @param {RegistryCategory} [category] - The category to associate with the class. Defaults to the
 * class name if omitted, which is useful when the class name matches a {@link RegistryCategory} value.
 *
 * @example
 * ```ts
 * // At the bottom of gradumModel.ts, after class definition:
 * addRegistryCategory(GradumModel, RegistryCategory.GradumModel);
 *
 * // Later, when a subclass is defined:
 * class MyModel extends GradumModel { ... }
 * define(MyModel, "MyModel"); // infers RegistryCategory.GradumModel automatically
 * ```
 */
function addRegistryCategory(type, category) {
    utils$9.setCategory(type, category ?? type.name);
}
/**
 * @function getRegisteredEntry
 * @group Decorators
 * @category Registry
 *
 * @description Returns the registry entry for a given class instance, looked up by its constructor.
 * Walks the instance's prototype chain until it finds a registered constructor, so subclasses that
 * were not themselves passed to {@link define} will still resolve to their nearest registered ancestor.
 * @param {object} instance - The class instance to look up.
 * @returns {RegistryEntry | undefined} The matching registry entry (containing `name`, `category`,
 * `constructor`, and optionally `tag`), or `undefined` if no registered class is found in the chain.
 */
function getRegisteredEntry(instance) {
    if (!instance)
        return undefined;
    let proto = Object.getPrototypeOf(instance);
    while (proto && proto !== Object.prototype) {
        const constructor = proto.constructor;
        for (const map of utils$9.registry.values()) {
            for (const entry of map.values()) {
                if (entry.constructor === constructor)
                    return entry;
            }
        }
        proto = Object.getPrototypeOf(proto);
    }
    return undefined;
}

/**
 * @class GradumModel
 * @group MVC
 * @category Model
 *
 * @template DataType - The type of the data held in the model.
 * @template {KeyType} DataKeyType - The type of the data's keys.
 * @template {KeyType} IdType - The type of the data's ID.
 * @template ComponentType - The type of instances managed by attached observers.
 * @template DataEntryType - The type of data associated with each observer instance.
 *
 * @description Wrapper around a plain JS container (object, Array, or Map) that exposes a
 * consistent API for reads/writes, signals, and {@link GradumObserver}s.
 */
let GradumModel = (() => {
    let _enabledCallbacks_decorators;
    let _enabledCallbacks_initializers = [];
    let _enabledCallbacks_extraInitializers = [];
    let _bubbleChanges_decorators;
    let _bubbleChanges_initializers = [];
    let _bubbleChanges_extraInitializers = [];
    return class GradumModel {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(this, null, _enabledCallbacks_decorators, { kind: "accessor", name: "enabledCallbacks", static: false, private: false, access: { has: obj => "enabledCallbacks" in obj, get: obj => obj.enabledCallbacks, set: (obj, value) => { obj.enabledCallbacks = value; } }, metadata: _metadata }, _enabledCallbacks_initializers, _enabledCallbacks_extraInitializers);
            __esDecorate(this, null, _bubbleChanges_decorators, { kind: "accessor", name: "bubbleChanges", static: false, private: false, access: { has: obj => "bubbleChanges" in obj, get: obj => obj.bubbleChanges, set: (obj, value) => { obj.bubbleChanges = value; } }, metadata: _metadata }, _bubbleChanges_initializers, _bubbleChanges_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @description Symbol used in {@link nestAll}, {@link makeSignals}, and {@link generateObserver}
         * to target all entries at a certain level inside the data.
         */
        static ALL = Symbol("ALL");
        /**
         * @function from
         * @static
         * @template {object} DataType - The type of the data to wrap.
         * @template {KeyType} IdType - The type of the data's ID.
         * @description Wrap plain data in a proxy that reads and writes through a model, so the data can be used
         * directly while still producing signals. Reach the underlying model through the proxy's `$model` key.
         * Assigning an unknown key creates a signal for it.
         * @param {DataType} [data={}] - The data to wrap.
         * @param {IdType} [id] - The ID to give the backing model.
         * @returns {GradumModelProxy<DataType, IdType>} The proxied data.
         */
        static from(data = {}, id) {
            const model = GradumModel.create({ data, id, initialize: true, makeSignals: true });
            return new Proxy(data, {
                get(target, key) {
                    if (key === "$model")
                        return model;
                    return model.get(key);
                },
                set(target, key, value) {
                    if (!model.has(key))
                        model.makeSignal(key);
                    model.set(value, key);
                    return true;
                }
            });
        }
        /**
         * @function create
         * @static
         * @description Instantiate a model, then optionally initialize it and make its signals. The return type
         * follows the class it is called on, so `GradumYModel.create(...)` yields a {@link GradumYModel} with its
         * Y-specific members intact.
         *
         * *Note: the callee is read through `this["prototype"]` rather than `InstanceType<this>`. The latter
         * instantiates this class' generics with their constraints (`object`, `KeyType`, `unknown`) instead of
         * their `any` defaults, which breaks inference at every call site.*
         * @template {{prototype: GradumModel}} This - The class `create` was called on.
         * @param {GradumModelProperties} [properties={}] - Optional initialization properties.
         * @returns {GradumModel} The created model, typed as the class this was called on.
         */
        static create(properties = {}) {
            const model = new this(properties);
            if (properties.initialize)
                model.initialize();
            if (properties.makeSignals)
                model.makeSignals(GradumModel.ALL);
            return model;
        }
        /**
         * @description The default constructor used to create nested {@link GradumModel} instances.
         */
        modelConstructor = GradumModel;
        /**
         * @description The default constructor used to create {@link GradumObserver} instances via {@link generateObserver}.
         */
        observerConstructor = GradumObserver;
        /**
         * @description Map of MVC handlers bound to this model.
         */
        handlers = new Map();
        #enabledCallbacks_accessor_storage = __runInitializers(this, _enabledCallbacks_initializers, void 0);
        /**
         * @description Whether change callbacks and observer notifications are enabled.
         */
        get enabledCallbacks() { return this.#enabledCallbacks_accessor_storage; }
        set enabledCallbacks(value) { this.#enabledCallbacks_accessor_storage = value; }
        #bubbleChanges_accessor_storage = (__runInitializers(this, _enabledCallbacks_extraInitializers), __runInitializers(this, _bubbleChanges_initializers, void 0));
        /**
         * @description Whether changes bubble up from nested models to their parent.
         */
        get bubbleChanges() { return this.#bubbleChanges_accessor_storage; }
        set bubbleChanges(value) { this.#bubbleChanges_accessor_storage = value; }
        /**
         * @description Delegate fired whenever a value changes at a key path. Receives the new value followed
         * by the key path as spread arguments.
         */
        onKeyChanged = (__runInitializers(this, _bubbleChanges_extraInitializers), new Delegate());
        /**
         * @description Delegate fired when this model is pointed at different data. Receives the previous data
         * followed by the new data. Use it to set up watchers that depend on `this.data`.
         */
        onDataChanged = new Delegate();
        /**
         * @description Hook invoked by {@link GradumModel.fireCallback}. Assign it to route named callbacks from
         * the model out to whatever owns it.
         */
        fireCallbackHook;
        /**
         * @protected
         * @description Whether {@link GradumModel.initialize} has already run on this model.
         */
        isInitialized = false;
        signals = new Map();
        /**
         * @protected
         * @readonly
         * @description Every observer attached to this model, with the key path each one watches.
         */
        changeObservers = new Set();
        /**
         * @protected
         * @readonly
         * @description Child models created for nested keys, one per key that has been nested.
         */
        nestedModels = new Map();
        /**
         * @protected
         * @description Listeners relaying changes from nested models up to this one.
         */
        nestedListeners = new Set();
        /**
         * @description The ID of the data held by this model.
         */
        id;
        _data;
        /**
         * @description The data held by this model. Setting it clears the current state and re-initializes the model.
         */
        get data() {
            return this._data;
        }
        set data(data) {
            const oldData = this._data;
            if (areEqual(oldData, data))
                return;
            if (this.diffCheck(oldData, data))
                this.diffAction(oldData, data);
            else {
                this.clear(false);
                this._data = data;
                if (data)
                    this.initialize();
            }
            markDirtyPath(this, []);
            this.onDataChanged.fire(oldData, data);
        }
        /**
         * @constructor
         * @description Create a new GradumModel.
         * @param {GradumModelProperties} [properties] - Optional initialization properties.
         */
        constructor(properties = {}) {
            this.id = properties.id;
            this._data = properties.data ?? {};
            if (typeof properties.enabledCallbacks === "boolean")
                this.enabledCallbacks = properties.enabledCallbacks;
            if (typeof properties.bubbleChanges === "boolean")
                this.bubbleChanges = properties.bubbleChanges;
            this.setup();
            this.onDataChanged.fire(undefined, this._data);
        }
        /**
         * @function setup
         * @description Called in the constructor. Use for setup that should happen at instantiation,
         * before `this.initialize()` is called.
         * @protected
         */
        setup() {
            initializeEffects(this);
        }
        /*
         *
         * GET
         *
         */
        /**
         * @protected
         * @function getAction
         * @description Read a single key from a data container. Override this method to support other datatypes.
         * @param {any} data - The container to read from.
         * @param {KeyType} key - The key to read.
         * @returns {any} The value at the key, or `undefined` if not found.
         */
        getAction(data, key) {
            if (data instanceof Map)
                return data.get(key);
            return data?.[key];
        }
        get(...keys) {
            if (keys.length === 0)
                return this.data;
            let current = this.data;
            let nested = this;
            for (let i = 0; i < keys.length; i++) {
                if (!current || typeof current !== "object")
                    return undefined;
                const key = keys[i];
                if (nested && i === keys.length - 1)
                    trackSignal(nested?.signals.get(key));
                else
                    nested = nested?.nestedModels.get(key);
                current = this.getAction(current, key);
            }
            return current;
        }
        /**
         * @function getFlat
         * @description Retrieve the value at the given flat key.
         * @param {FlatKeyType} flatKey - A flat key produced by {@link flattenKey}.
         * @param {number} [depth] - Required when `flatKey` is a numeric index. The depth of the key path.
         * @returns {any} The stored value, or `undefined` if not found.
         */
        getFlat(flatKey, depth) {
            const keys = this.scopeKey(flatKey, depth);
            if (!keys?.length)
                return undefined;
            return this.get(...keys);
        }
        /**
         * @function getKey
         * @description Find the key path of the first occurrence of the given value, searching depth-first.
         * @param {any} value - The value to locate.
         * @returns {KeyType[]} The key path, or `undefined` if not found.
         */
        getKey(value) {
            const search = (data, path) => {
                if (!data || typeof data !== "object")
                    return undefined;
                const keys = data instanceof Map
                    ? Array.from(data.keys())
                    : [...Object.keys(data), ...Object.getOwnPropertySymbols(data)];
                for (const key of keys) {
                    const entry = this.getAction(data, key);
                    if (Object.is(entry, value))
                        return [...path, key];
                    const nested = search(entry, [...path, key]);
                    if (nested)
                        return nested;
                }
                return undefined;
            };
            return search(this.data, []);
        }
        /**
         * @function getFlatKey
         * @description Return the flat key of the first occurrence of the given value.
         * @param {any} value - The value to query.
         * @returns {FlatKeyType | undefined} The flat key, or `undefined` if not found.
         */
        getFlatKey(value) {
            const path = this.getKey(value);
            if (!path?.length)
                return undefined;
            return this.flattenKey(...path);
        }
        /**
         * @function getKeys
         * @description Find the key paths of all occurrences of the given value, searching depth-first.
         * @param {any} value - The value to locate.
         * @returns {KeyType[][]} Array of key paths.
         */
        getKeys(value) {
            const results = [];
            const search = (data, path) => {
                if (!data || typeof data !== "object")
                    return;
                const keys = data instanceof Map
                    ? Array.from(data.keys())
                    : [...Object.keys(data), ...Object.getOwnPropertySymbols(data)];
                for (const key of keys) {
                    const entry = this.getAction(data, key);
                    const currentPath = [...path, key];
                    if (Object.is(entry, value))
                        results.push(currentPath);
                    else
                        search(entry, currentPath);
                }
            };
            search(this.data, []);
            return results;
        }
        /**
         * @function getFlatKeys
         * @description Return the flat keys of all occurrences of the given value.
         * @param {any} value - The value to query.
         * @returns {FlatKeyType[]} Array of flat keys.
         */
        getFlatKeys(value) {
            return this.getKeys(value).map(path => this.flattenKey(...path)).filter(k => k !== undefined);
        }
        /*
         *
         * SET
         *
         */
        /**
         * @protected
         * @function setAction
         * @description Write a single key to a data container. Override this method to support other datatypes.
         * @param {any} data - The container to write to.
         * @param {KeyType} key - The key to write.
         * @param {any} value - The value to set.
         */
        setAction(data, value, key) {
            if (data instanceof Map)
                data.set(key, value);
            else
                data[key] = value;
        }
        /**
         * @protected
         * @function internalSet
         * @description Write a value at a key, propagating the change to a nested model if one exists,
         * and firing {@link keyChanged} if the value actually changed.
         * @param {GradumModel} model - The owning model (used for nested model lookup and change notification),
         * or `undefined` if operating on a non-root container.
         * @param {any} data - The container to write to.
         * @param {KeyType} key - The key to write.
         * @param {any} value - The value to set.
         */
        internalSet(model, data, value, key) {
            if (isUndefined(key)) {
                if (!model || areEqual(model.data, value))
                    return false;
                model.data = value;
                return true;
            }
            if (model) {
                const nested = model.getNested(key);
                if (nested)
                    nested.data = value;
            }
            if (!data || typeof data !== "object")
                return false;
            const prev = this.getAction(data, key);
            if (prev === value || Object.is(prev, value))
                return false;
            this.setAction(data, value, key);
            return true;
        }
        set(value, ...keys) {
            let bool;
            if (keys.length < 2)
                bool = this.internalSet(this, this.data, value, keys[0]);
            else {
                const nested = this.getNested(keys[0]);
                if (nested)
                    bool = nested.set(value, ...keys.slice(1));
                else
                    bool = this.internalSet(undefined, this.get(keys[0], ...keys.slice(1, -1)), value, keys[keys.length - 1]);
            }
            if (bool)
                this.keyChanged(keys, value);
            return bool;
        }
        /**
         * @function setFlat
         * @description Set a value at the given flat key.
         * @param {unknown} value - The value to set.
         * @param {FlatKeyType} flatKey - A flat key produced by {@link flattenKey}.
         * @param {number} [depth] - Required when `flatKey` is a numeric index. The depth of the key path.
         */
        setFlat(value, flatKey, depth) {
            const keys = this.scopeKey(flatKey, depth);
            if (keys?.length)
                return this.set(value, ...keys);
            return false;
        }
        /*
         *
         * ADD
         *
         */
        /**
         * @protected
         * @function internalAdd
         * @description Insert a value into a container via {@link addAction} and fire {@link keyChanged}.
         * @param {GradumModel} model - The owning model for change notification, or `undefined` for non-root containers.
         * @param {any} data - The container to insert into.
         * @param {any} value - The value to insert.
         * @param {KeyType} key - The target index or key.
         * @returns {KeyType} The index or key where the value was stored.
         */
        internalAdd(model, data, value, key) {
            if (!data || typeof data !== "object")
                return;
            return this.addAction(model, data, value, key);
        }
        /**
         * @protected
         * @function addAction
         * @description Perform the raw insertion. Override this method to support other datatypes.
         * @param {GradumModel} model - The owning model.
         * @param {any} data - The container to insert into.
         * @param {any} value - The value to insert.
         * @param {KeyType} key - The target index or key. Clamped to valid array bounds for array containers.
         * @returns {KeyType} The index or key where the value was stored.
         */
        addAction(model, data, value, key) {
            if (Array.isArray(data)) {
                let index = key;
                if (isUndefined(index) || typeof index !== "number" || index > data.length)
                    index = data.length;
                else if (index < 0)
                    index = 0;
                data.splice(index, 0, value);
                return index;
            }
            const bool = this.internalSet(model, data, value, key);
            return bool ? key : undefined;
        }
        add(value, ...keys) {
            let key;
            if (keys.length < 2)
                key = this.internalAdd(this, this.data, value, keys[0]);
            else {
                const nested = this.getNested(keys[0]);
                if (nested)
                    key = nested.add(value, ...keys.slice(1));
                else
                    key = this.internalAdd(undefined, this.get(keys[0], ...keys.slice(1, -1)), value, keys[keys.length - 1]);
            }
            const lastKeyWasUndefined = isUndefined(keys[keys.length - 1]);
            const changePath = lastKeyWasUndefined ? [...keys.slice(0, -1), key] : keys;
            if (!isUndefined(key))
                this.keyChanged(changePath);
            return key;
        }
        /**
         * @function addFlat
         * @description Insert a value at the position described by the given flat key.
         * @param {unknown} value - The value to insert.
         * @param {FlatKeyType} flatKey - A flat key produced by {@link flattenKey}.
         * @param {number} [depth] - Required when `flatKey` is a numeric index. The depth of the key path.
         * @returns {KeyType} The index or key where the value was stored.
         */
        addFlat(value, flatKey, depth) {
            const keys = this.scopeKey(flatKey, depth);
            if (!keys?.length)
                throw new Error(`GradumModel.addFlat: could not resolve flat key "${String(flatKey)}" to a key path.`);
            return this.add(value, ...keys);
        }
        /*
         *
         * HAS
         *
         */
        /**
         * @protected
         * @function hasAction
         * @description Check whether a key exists in a container. Override this method to support other datatypes.
         * @param {any} data - The container to check.
         * @param {KeyType} key - The key to check.
         * @returns {boolean} `true` if the key is present.
         */
        hasAction(data, key) {
            if (data instanceof Map)
                return data.has(key);
            return data?.[key] !== undefined;
        }
        has(...keys) {
            const data = this.get(...keys.slice(0, -1));
            const key = keys[keys.length - 1];
            if (!data || key === undefined)
                return false;
            return this.hasAction(data, key);
        }
        /**
         * @function hasFlat
         * @description Check whether an entry exists at the given flat key.
         * @param {FlatKeyType} flatKey - A flat key produced by {@link flattenKey}.
         * @param {number} [depth] - Required when `flatKey` is a numeric index. The depth of the key path.
         * @returns {boolean} `true` if an entry exists at that flat key.
         */
        hasFlat(flatKey, depth) {
            const keys = this.scopeKey(flatKey, depth);
            if (!keys?.length)
                return false;
            return this.has(...keys);
        }
        /*
         *
         * DELETE
         *
         */
        /**å
         * @protected
         * @function deleteAction
         * @description Remove a single key from a container. Override this method to support other datatypes.
         * @param {any} data - The container to remove from.
         * @param {KeyType} key - The key to remove.
         */
        deleteAction(data, key) {
            if (data instanceof Map)
                data.delete(key);
            else if (Array.isArray(data))
                data.splice(key, 1);
            else
                delete data[key];
        }
        /**
         * @protected
         * @function internalDelete
         * @description Remove a key from a container, clearing any associated nested model, and firing {@link keyChanged}.
         * No-op if the key does not exist.
         * @param {GradumModel} model - The owning model for nested model cleanup and change notification,
         * or `undefined` for non-root containers.
         * @param {any} data - The container to remove from.
         * @param {KeyType} key - The key to remove.
         */
        internalDelete(model, data, key) {
            if (!data || !this.hasAction(data, key))
                return;
            if (model) {
                const nested = model.getNested(key);
                if (nested) {
                    nested.clear();
                    model.nestedModels.delete(key);
                }
            }
            this.deleteAction(data, key);
        }
        delete(...keys) {
            if (keys.length === 0)
                return;
            // keyChanged must fire before internalDelete/deleteAction so that observer slots are
            // vacated before shiftIndices (triggered synchronously by the Yjs transaction inside
            // deleteAction) shifts neighbouring entries into the slot being deleted.
            this.keyChanged(keys, undefined, true);
            if (keys.length === 1)
                this.internalDelete(this, this.data, keys[0]);
            else {
                const nested = this.getNested(keys[0]);
                if (nested)
                    nested.delete(...keys.slice(1));
                else {
                    const parentData = this.get(keys[0], ...keys.slice(1, -1));
                    if (typeof parentData !== "object")
                        return;
                    this.internalDelete(undefined, parentData, keys[keys.length - 1]);
                }
            }
        }
        /**
         * @function deleteFlat
         * @description Remove the entry at the given flat key.
         * @param {FlatKeyType} flatKey - A flat key produced by {@link flattenKey}.
         * @param {number} [depth] - Required when `flatKey` is a numeric index. The depth of the key path.
         */
        deleteFlat(flatKey, depth) {
            const keys = this.scopeKey(flatKey, depth);
            if (keys?.length)
                this.delete(...keys);
        }
        /*
         *
         * KEYS
         *
         */
        getKeysAction(data) {
            if (!data || typeof data !== "object")
                return [];
            if (Array.isArray(data))
                return Array.from({ length: data.length }, (_, i) => i);
            if (data instanceof Map)
                return Array.from(data.keys());
            return [...Object.keys(data), ...Object.getOwnPropertySymbols(data)];
        }
        /**
         * @readonly
         * @description All keys currently present in the model.
         */
        get keys() {
            return this.getKeysAction(this.data);
        }
        /**
         * @readonly
         * @description All values in the model, in the order of {@link GradumModel.keys}.
         */
        get values() {
            return this.keys.map(key => this.get(key));
        }
        /**
         * @readonly
         * @description Number of entries in the model.
         */
        get dataSize() {
            return this.keys.length;
        }
        /**
         * @function flatSize
         * @description Return the total number of entries reachable from this model at the given depth.
         * @param {number} depth - How many levels deep to count.
         * @returns {number} The number of entries at that depth, counting every branch.
         */
        flatSize(depth) {
            return GradumModel.flattenSize(this.data, depth);
        }
        /*
         *
         * DIFFING
         *
         */
        /**
         * @protected
         * @function diffCheck
         * @description Whether two data containers are similar enough to be swapped in place by
         * {@link GradumModel.diffAction} rather than triggering a full clear and re-initialize. True for two plain
         * objects, two arrays, or two Maps.
         * @param {DataType} oldData - The data being replaced.
         * @param {DataType} newData - The data to adopt.
         * @returns {boolean} `true` if the swap can be done in place.
         */
        diffCheck(oldData, newData) {
            if (!oldData || !newData)
                return false;
            if (Array.isArray(oldData) && Array.isArray(newData))
                return true;
            if (oldData instanceof Map && newData instanceof Map)
                return true;
            if (Array.isArray(oldData) || Array.isArray(newData) || oldData instanceof Map || newData instanceof Map
                || oldData instanceof Set || newData instanceof Set)
                return false;
            if (typeof oldData !== "object" || typeof newData !== "object")
                return false;
            return Object.getPrototypeOf(oldData) === Object.prototype && Object.getPrototypeOf(newData) === Object.prototype;
        }
        /**
         * @protected
         * @function diffAction
         * @description Swap in new data while keeping existing nested models and signals alive, re-pointing each
         * child at its counterpart in the new data instead of tearing the tree down. Only called when
         * {@link GradumModel.diffCheck} accepts the pair.
         * @param {DataType} oldData - The data being replaced.
         * @param {DataType} newData - The data to adopt.
         */
        diffAction(oldData, newData) {
            this._data = newData;
            for (const [key, child] of this.nestedModels) {
                const newVal = this.getAction(newData, key);
                if (child.data !== newVal)
                    child.data = newVal;
            }
            const oldKeys = new Set(this.getKeysAction(oldData));
            const newKeys = new Set(this.getKeysAction(newData));
            for (const key of oldKeys) {
                // Deletions pass undefined by convention (nested-child onKeyChanged listeners
                // rely on it to clear their data). GradumObserver recovers the old value for
                // onDeleted from its own prevData tracking.
                if (!newKeys.has(key))
                    this.keyChanged([key], undefined, true);
                else {
                    const oldVal = this.getAction(oldData, key);
                    const newVal = this.getAction(newData, key);
                    if (!areEqual(oldVal, newVal))
                        this.keyChanged([key], newVal);
                }
            }
            for (const key of newKeys) {
                if (!oldKeys.has(key))
                    this.keyChanged([key], this.getAction(newData, key));
            }
        }
        /*
         *
         * Iteration
         *
         */
        /**
         * @description Iterate over `[key, value]` pairs.
         */
        *[(_enabledCallbacks_decorators = [auto({ defaultValue: true })], _bubbleChanges_decorators = [auto({ defaultValue: false })], Symbol.iterator)]() {
            for (const key of this.keys)
                yield [key, this.get(key)];
        }
        /**
         * @function entries
         * @description Return all `[key, value]` pairs in the model.
         * @returns {[KeyType, any][]} The pairs, in the order of {@link GradumModel.keys}.
         */
        entries() {
            return this.keys.map(key => [key, this.get(key)]);
        }
        /**
         * @function forEach
         * @description Execute a callback for each entry in the model.
         * @param {(value: any, key: KeyType, model: this) => void} callback - Called with the value, key, and model.
         * @param {any} [thisArg] - Value to use as `this` when calling the callback.
         */
        forEach(callback, thisArg) {
            for (const key of this.keys)
                callback.call(thisArg, this.get(key), key, this);
        }
        /*
         *
         * Utilities
         *
         */
        /**
         * @function initialize
         * @description Fire change notifications for all existing keys, marking the model as initialized.
         * No-op if already initialized or if data is empty.
         */
        initialize() {
            if (!this.data || this.isInitialized)
                return;
            this.isInitialized = true;
            for (const [key, child] of this.nestedModels) {
                const newData = this.get(key);
                if (child.data !== newData)
                    child.data = newData;
                else if (!child.isInitialized)
                    child.initialize();
            }
            for (const key of this.keys)
                this.keyChanged([key]);
            for (const observer of this.changeObservers)
                observer.observer.initialize();
        }
        /**
         * @function clear
         * @description Reset the model, clearing nested models, observers, and signals.
         * @param {boolean} [clearData=true] - Whether to also clear the stored data.
         */
        clear(clearData = true) {
            if (clearData)
                this._data = undefined;
            this.nestedModels.forEach(nested => nested.clear(clearData));
            if (clearData)
                this.nestedModels.clear();
            this.signals.clear();
            if (clearData)
                this.nestedListeners.clear();
            if (clearData)
                this.changeObservers.forEach(e => this.changeObservers.delete(e));
            else
                this.changeObservers.forEach(e => e.observer.clear());
            this.isInitialized = false;
        }
        /**
         * @function toJSON
         * @description Convert the model's data into a JSON-serializable form.
         * Maps become plain objects. For non-object data types, the raw value is returned.
         * @returns {object | DataType} A plain copy of the data, safe to pass to `JSON.stringify`.
         */
        toJSON() {
            if (typeof this.data !== "object")
                return this.data;
            if (this.data instanceof Map)
                return Object.fromEntries(this.data);
            if (this.data && typeof this.data === "object") {
                const out = {};
                for (const k of this.keys)
                    out[k] = this.get(k);
                return out;
            }
            return {};
        }
        makeSignal(...keys) {
            return this.makeSignals(...keys)[0];
        }
        /**
         * @function makeSignals
         * @template Type - The type of the signals' values.
         * @description Return reactive {@link SignalBox} instances for multiple keys at the given path.
         * Pass {@link GradumModel.ALL} at any level of the path to expand all entries at that level.
         * @param {...KeyType[]} keys - Key path to the signal targets. Use `ALL` at any level to target all entries there.
         * @returns {SignalBox<Type>[]} One signal per key at that path, in the order the keys appear.
         */
        makeSignals(...keys) {
            if (keys.length === 0)
                keys = [GradumModel.ALL];
            const maker = (key, model) => {
                if (model.signals.has(key))
                    return model.signals.get(key);
                const sig = signal(() => model.get(key), (value) => model.set(value, key), this, key);
                model.signals.set(key, sig);
                return sig;
            };
            const pathKeys = keys.slice(0, -1);
            const signalKey = keys[keys.length - 1];
            const models = this.nestAll(...pathKeys);
            if (signalKey === GradumModel.ALL)
                return models.flatMap(model => model.keys.map(k => maker(k, model)));
            return models.map(model => maker(signalKey, model));
        }
        getSignal(...keys) {
            return this.getNested(...keys.slice(0, -1)).signals.get(keys[keys.length - 1]);
        }
        nestAll(...args) {
            const lastEntry = args[args.length - 1];
            const properties = lastEntry !== null && typeof lastEntry === "object" ? lastEntry : {};
            const keys = args.slice(0, lastEntry !== null && typeof lastEntry === "object" ? -1 : undefined);
            if (keys.length === 0)
                return [this];
            gradum(properties).applyDefaults({ bubbleChanges: this.bubbleChanges, enabledCallbacks: this.enabledCallbacks });
            return this.nestRecur(keys, properties);
        }
        nestRecur(keys, properties) {
            if (keys.length === 0)
                return [this];
            if (keys[0] === GradumModel.ALL) {
                this.nestedListeners.add({
                    listener: (selfKeys) => this.createNestedChild(this, selfKeys[0], properties).nestRecur(keys.slice(1), properties),
                    keys: keys.slice(1)
                });
                return this.keys.flatMap(key => this.createNestedChild(this, key, properties).nestRecur(keys.slice(1), properties));
            }
            else
                return this.createNestedChild(this, keys[0], properties).nestRecur(keys.slice(1), properties);
        }
        nest(...keysAndProperties) {
            return this.nestAll(...keysAndProperties)[0];
        }
        getNested(...keys) {
            if (keys.length === 0)
                return this;
            const nested = this.nestedModels.get(keys[0]);
            if (keys.length > 1 && nested instanceof GradumModel)
                return nested.getNested(...keys.slice(1));
            return nested;
        }
        /*
         *
         * Change observers
         *
         */
        /**
         * @function generateObserver
         * @description Create and attach a {@link GradumObserver} to this model.
         * If a key path is provided, the observer is attached to the nested model(s) at that path instead.
         * Pass {@link GradumModel.ALL} at any level of the path to process all entries at that level,
         * allowing a single observer to track multiple subtrees simultaneously.
         * @param {GradumObserverProperties<DataEntryType, ComponentType, KeyType>} [properties={}] - Observer options and lifecycle callbacks.
         * @param {...KeyType[]} keys - Optional key path to the nested model(s) to observe. Use `ALL` at
         * any level to process all entries there.
         * @returns {GradumObserver} The attached observer. Keep the reference to read its instances or destroy it later.
         */
        generateObserver(properties = {}, ...keys) {
            const initialize = (this.isInitialized && isUndefined(properties.initialize)) || properties.initialize === true;
            const observer = new (properties.customConstructor
                ?? this.observerConstructor
                ?? (GradumObserver))({
                ...properties,
                initialize: false,
                onDestroy: (self) => {
                    Array.from(this.changeObservers)
                        .filter(e => e.observer === self)
                        .forEach(e => this.changeObservers.delete(e));
                    properties.onDestroy?.(self);
                },
                onInitialize: (self) => {
                    this.initializeObserverOnPath(this.data, self, keys, []);
                    properties.onInitialize?.(self);
                }
            });
            this.changeObservers.add({ keys, observer });
            if (initialize)
                observer.initialize();
            return observer;
        }
        /**
         * @function generateDeepObserver
         * @description Like {@link generateObserver}, but fires for the registered depth **and all deeper levels**.
         * Whereas `generateObserver(..., GradumModel.ALL)` only notifies at depth-2, `generateDeepObserver(..., GradumModel.ALL)`
         * also notifies for depth-3, depth-4, etc. — passing the full key path to `onAdded`/`onUpdated`/`onDeleted`.
         * Use when you need to react to any nested change regardless of depth.
         * @param {GradumObserverProperties<DataEntryType, ComponentType, KeyType>} [properties={}] - Observer options and lifecycle callbacks.
         * @param {...KeyType[]} keys - Optional key path to the nested model(s) to observe.
         * @returns {GradumObserver} The attached observer. Keep the reference to read its instances or destroy it later.
         */
        generateDeepObserver(properties = {}, ...keys) {
            const initialize = (this.isInitialized && isUndefined(properties.initialize)) || properties.initialize === true;
            const observer = new (properties.customConstructor
                ?? this.observerConstructor
                ?? (GradumObserver))({
                ...properties,
                initialize: false,
                onDestroy: (self) => {
                    Array.from(this.changeObservers)
                        .filter(e => e.observer === self)
                        .forEach(e => this.changeObservers.delete(e));
                    properties.onDestroy?.(self);
                },
                onInitialize: (self) => {
                    this.initializeObserverOnPath(this.data, self, keys, [], true);
                    properties.onInitialize?.(self);
                }
            });
            this.changeObservers.add({ keys, observer, deep: true });
            if (initialize)
                observer.initialize();
            return observer;
        }
        /**
         * @protected
         * @function initializeObserverOnPath
         * @description Walk the data along an observer's key path and report every existing entry to it, so an
         * observer attached to already-populated data still sees what is there. Paths containing
         * {@link GradumModel.ALL} fan out across every entry at that level.
         * @param {any} data - The data to walk.
         * @param {GradumObserver} observer - The observer to notify.
         * @param {KeyType[]} keys - The remaining key path to walk.
         * @param {KeyType[]} prefixKeys - The path already walked, passed back to the observer.
         */
        initializeObserverOnPath(data, observer, keys, prefixKeys, deep = false) {
            if (keys.length === 0) {
                if (!this.isInitialized)
                    return;
                for (const key of this.getKeysAction(data)) {
                    const value = this.getAction(data, key);
                    observer.keyChanged([...prefixKeys, key], value);
                    if (deep && value !== null && typeof value === "object")
                        this.initializeObserverOnPath(value, observer, [], [...prefixKeys, key], deep);
                }
            }
            else if (keys[0] === GradumModel.ALL)
                for (const key of this.getKeysAction(data)) {
                    this.initializeObserverOnPath(this.getAction(data, key), observer, keys.slice(1), [...prefixKeys, key], deep);
                }
            else
                this.initializeObserverOnPath(this.getAction(data, keys[0]), observer, keys.slice(1), [...prefixKeys, keys[0]], deep);
        }
        /*
         *
         * Internal utilities
         *
         */
        /**
         * @protected
         * @function keyChanged
         * @description Called internally whenever an entry is added, updated, or deleted.
         * Emits signals, fires {@link onKeyChanged}, and notifies attached observers.
         * @param {KeyType[]} keys - The key path that changed.
         * @param {unknown} [value] - The new value. Defaults to the current value at the key.
         * @param {boolean} [deleted=false] - Whether the entry was removed.
         */
        keyChanged(keys, value = this.get(...keys), deleted = false) {
            const key = keys[0];
            if (key === undefined)
                return;
            this.signals.get(key)?.emit();
            markDirtyPath(this, keys);
            if (deleted)
                this.signals.delete(key);
            if (!this.enabledCallbacks)
                return;
            if (!deleted && !this.nestedModels.has(key) && this.nestedListeners.size > 0)
                this.nestedListeners.forEach(({ listener }) => listener(keys, value));
            this.onKeyChanged.fire(value, ...keys);
            this.changeObservers.forEach(({ observer, keys: pattern, deep }) => this.matchObserverAndNotify(observer, keys, pattern, [], value, deleted, deep));
        }
        matchObserverAndNotify(observer, incomingKeys, pattern, prefixKeys, value, deleted, deep = false) {
            if (!observer.isInitialized)
                return;
            if (pattern.length === 0) {
                if (incomingKeys.length === 0) {
                    if (!deleted && value !== null && typeof value === "object") {
                        for (const key of this.getKeysAction(value)) {
                            observer.keyChanged([...prefixKeys, key], this.getAction(value, key), deleted);
                        }
                    }
                    else if (deleted) {
                        for (const path of observer.getPathsAt(...prefixKeys)) {
                            observer.keyChanged([...prefixKeys, ...path], undefined, true);
                        }
                    }
                }
                else if (deep)
                    observer.keyChanged([...prefixKeys, ...incomingKeys], this.get(...prefixKeys, ...incomingKeys), deleted);
                else
                    observer.keyChanged([...prefixKeys, incomingKeys[0]], this.get(...prefixKeys, incomingKeys[0]), deleted && incomingKeys.length === 1);
                return;
            }
            if (incomingKeys.length === 0) {
                if (!deleted && value !== null && typeof value === "object") {
                    for (const key of this.getKeysAction(value))
                        this.matchObserverAndNotify(observer, [key], pattern, prefixKeys, this.getAction(value, key), deleted, deep);
                }
                return;
            }
            const [head, ...tail] = incomingKeys;
            const [patternHead, ...patternTail] = pattern;
            if (patternHead === GradumModel.ALL || patternHead === head)
                this.matchObserverAndNotify(observer, tail, patternTail, [...prefixKeys, head], value, deleted, deep);
        }
        static flattenSize(data, depth) {
            if (!data || depth <= 0)
                return 1;
            if (Array.isArray(data)) {
                let total = 0;
                for (const item of data)
                    total += this.flattenSize(item, depth - 1);
                return total;
            }
            if (typeof data === "object" && typeof data.length === "number" && typeof data.get === "function") {
                let total = 0;
                for (let i = 0; i < data.length; i++)
                    total += this.flattenSize(data.get(i), depth - 1);
                return total;
            }
            return 1;
        }
        /**
         * @function flattenKey
         * @description Serialize a key path into a single flat key.
         * - Fully numeric paths into array-backed data produce a numeric global leaf index.
         * - All other paths produce a `"k0|k1|k2|..."` string, with symbols encoded as `"@@description"`.
         * @param {...KeyType[]} keys - The key path to serialize.
         * @returns {FlatKeyType} The flat key: a number for a fully numeric path, otherwise a `"k0|k1"` string.
         */
        flattenKey(...keys) {
            const stringFLatKey = () => keys.map(k => typeof k === "symbol" ? `@@${k.description ?? ""}` : String(k)).join("|");
            if (keys.some(k => typeof k !== "number"))
                return stringFLatKey();
            let index = 0;
            let current = this.data;
            for (let i = 0; i < keys.length; i++) {
                if (!Array.isArray(current))
                    return stringFLatKey();
                const key = keys[i];
                for (let sibling = 0; sibling < key; sibling++) {
                    const siblingData = current[sibling];
                    index += GradumModel.flattenSize(siblingData, keys.length - i - 1);
                }
                current = current[key];
            }
            return index;
        }
        scopeKey(flatKey, depth) {
            if (typeof flatKey === "string") {
                return flatKey.split("|").map(k => {
                    if (k.startsWith("@@"))
                        return Symbol(k.slice(2));
                    const n = Number(k);
                    return isNaN(n) || k === "" ? k : n;
                });
            }
            if (depth == null)
                depth = 1;
            const keys = [];
            let remaining = flatKey;
            let current = this.data;
            for (let i = 0; i < depth; i++) {
                const isIndexable = Array.isArray(current)
                    || (typeof current === "object" && current !== null
                        && typeof current.length === "number" && typeof current.get === "function");
                if (!isIndexable)
                    break;
                const remainingDepth = depth - i - 1;
                const getItem = Array.isArray(current) ? (j) => current[j] : (j) => current.get(j);
                for (let j = 0; j < current.length; j++) {
                    const size = GradumModel.flattenSize(getItem(j), remainingDepth);
                    if (remaining < size) {
                        keys.push(j);
                        current = getItem(j);
                        break;
                    }
                    remaining -= size;
                }
            }
            return keys;
        }
        /*
         *
         * HANDLER
         *
         */
        /**
         * @function getHandler
         * @description Retrieves the attached MVC handler with the given key.
         * By default, unless manually defined in the handler, if the element's class name is MyElement
         * and the handler's class name is MyElementSomethingHandler, the key would be "something".
         * @param {string} key - The handler's key.
         * @returns {GradumHandler} The handler registered under that key, or `undefined` if there is none.
         */
        getHandler(key) {
            return this.handlers?.get(key);
        }
        /**
         * @function addHandler
         * @description Registers a GradumHandler for the given key.
         * @param {GradumHandler} handler - The handler instance to register.
         */
        addHandler(handler) {
            if (!handler.keyName)
                return;
            this.handlers?.set(handler.keyName, handler);
        }
        /**
         * @function setDataWithoutInitializing
         * @description Point the model at new data without running {@link GradumModel.initialize} on it, so
         * observers and signals are not re-created. Use it when the caller will initialize at a moment of its
         * own choosing; prefer assigning `data` otherwise.
         * @param {DataType} data - The data to adopt.
         */
        setDataWithoutInitializing(data) {
            this.clear(false);
            this._data = data;
        }
        /**
         * @function fireCallback
         * @description Fire a named callback through {@link GradumModel.fireCallbackHook}. Does nothing if no
         * hook has been assigned.
         * @param {string} key - The name of the callback to fire.
         * @param {...any[]} values - Arguments forwarded to the hook.
         */
        fireCallback(key, ...values) {
            this.fireCallbackHook?.(key, ...values);
        }
        createNestedChild(model, key, properties) {
            if (model.nestedModels.has(key))
                return model.nestedModels.get(key);
            const child = this.modelConstructor.create({ ...properties, data: model.get(key), initialize: this.isInitialized });
            model.onKeyChanged.add((value, changedKey) => {
                if (changedKey !== key)
                    return;
                if (child.data !== value)
                    child.data = value;
            });
            child.onKeyChanged.add((_value, ...keys) => {
                if (!model.enabledCallbacks || !model.bubbleChanges)
                    return;
                model.keyChanged(keys, model.get(key));
            });
            model.nestedModels.set(key, child);
            return child;
        }
        ;
    };
})();
addRegistryCategory(GradumModel);
define(GradumModel);

/**
 * @class GradumEmitter
 * @group MVC
 * @category Emitter
 *
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @template {KeyType} DataKeyType - The key type of the MVC's model.
 * @description The base MVC emitter class. Its role is basically an event bus. It allows the different parts of the
 * MVC structure to fire events or listen to some, with various methods.
 */
class GradumEmitter {
    /**
     * @description Map containing all custom callbacks.
     * @protected
     */
    callbacks = new Map();
    /**
     * @description Map containing all data callbacks.
     * @protected
     */
    dataCallbacks = new Map();
    /**
     * @description The attached MVC model.
     */
    model;
    /**
     * @constructor
     * @description Create an emitter, optionally bound to a model so key-path events can be fired against it.
     * @param {ModelType} [model] - The model whose key changes this emitter relays.
     */
    constructor(model) {
        if (model)
            this.model = model;
    }
    /**
     * @function add
     * @description Register a callback for the given event name.
     * @param {string} event - The event name.
     * @param {(...args: any[]) => void} callback - The callback to invoke when the event fires.
     */
    add(event, callback) {
        if (!this.callbacks.has(event))
            this.callbacks.set(event, new Delegate());
        this.callbacks.get(event)?.add(callback);
    }
    /**
     * @function remove
     * @description Remove a specific callback from the given event, or all callbacks if omitted.
     * @param {string} event - The event name.
     * @param {(...args: any[]) => void} [callback] - The callback to remove. If omitted,
     * all callbacks for the event are removed.
     */
    remove(event, callback) {
        if (!callback)
            this.callbacks.delete(event);
        else
            this.callbacks.get(event)?.remove(callback);
    }
    /**
     * @function fire
     * @description Trigger all callbacks registered for the given event name.
     * @param {string} event - The event name.
     * @param {...any[]} args - Arguments passed to each callback.
     */
    fire(event, ...args) {
        this.callbacks.get(event)?.fire(...args);
    }
    /**
     * @function addKey
     * @description Register a callback fired when the entry at the given key path changes in the model.
     * The callback receives the new value as its first argument, followed by the key path as spread arguments.
     * @param {(value: any, ...keys: DataKeyType[]) => void} callback - The callback to register.
     * @param {...DataKeyType[]} keys - Ordered path from outermost to innermost key.
     */
    addKey(callback, ...keys) {
        const flatKey = this.resolveFlatKey(keys);
        if (!this.dataCallbacks.has(flatKey))
            this.dataCallbacks.set(flatKey, new Delegate());
        this.dataCallbacks.get(flatKey)?.add(callback);
    }
    /**
     * @function removeKey
     * @description Remove a specific callback for the given key path, or all callbacks if omitted.
     * @param {(value: any, ...keys: DataKeyType[]) => void} [callback] - The callback to remove. If omitted,
     * all callbacks for this path are removed.
     * @param {...DataKeyType[]} keys - Ordered path from outermost to innermost key.
     */
    removeKey(callback, ...keys) {
        const flatKey = this.resolveFlatKey(keys);
        if (!callback)
            this.dataCallbacks.delete(flatKey);
        else
            this.dataCallbacks.get(flatKey)?.remove(callback);
    }
    /**
     * @function fireKey
     * @description Trigger all callbacks registered for the given key path.
     * Called automatically when the model fires a change notification at this path.
     * @param {any} value - The new value at the key path.
     * @param {...DataKeyType[]} keys - Ordered path from outermost to innermost key.
     */
    fireKey(value, ...keys) {
        const flatKey = this.resolveFlatKey(keys);
        this.dataCallbacks.get(flatKey)?.fire(value, ...keys);
    }
    /**
     * @protected
     * @function resolveFlatKey
     * @description Convert a key path to a stable flat string key for internal storage lookup. Joins with `"|"`.
     * @param {DataKeyType[]} keys - The key path to flatten.
     * @returns {FlatKeyType} The flat key, suitable for use as a map key.
     */
    resolveFlatKey(keys) {
        return keys.map(k => typeof k === "symbol" ? `@@${k.description ?? ""}` : String(k)).join("|");
    }
}
addRegistryCategory(GradumEmitter);
define(GradumEmitter);

/**
 * @internal
 * @description Key under which a raw DOM node stores the {@link GradumProxiedElement} wrapping it, so MVC
 * pieces are constructed against the public wrapper rather than the underlying node.
 */
const proxyWrapperSymbol = Symbol("__proxyWrapper__");
/**
 * @internal
 * @class MvcFunctionsUtils
 * @description Shared helpers and per-element state behind the MVC functions on {@link GradumSelector}.
 */
class MvcFunctionsUtils {
    dataMap = new WeakMap;
    modelLookupMap = new WeakMap;
    peek(element) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (element instanceof GradumModel)
            element = this.modelLookupMap.get(element)?.values().next().value;
        return element ? this.dataMap.get(element) : undefined;
    }
    data(element) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (element instanceof GradumModel)
            element = this.modelLookupMap.get(element)?.values().next().value;
        if (!element)
            return;
        let entry = this.dataMap.get(element);
        if (!entry) {
            entry = {
                emitter: new GradumEmitter(),
                operators: new Map(), constrainers: new Map(), interactors: new Map(), tools: new Map(),
                emitterCallback: (key, ...values) => entry.emitter?.fire(key, ...values),
                emitterKeyCallback: (value, ...keys) => entry.emitter?.fireKey(value, ...keys)
            };
            this.dataMap.set(element, entry);
        }
        return entry;
    }
    attachModel(element, model, attach = true) {
        if (!element || !model)
            return;
        if (attach && !this.modelLookupMap.has(model))
            this.modelLookupMap.set(model, new Set());
        if (attach)
            this.modelLookupMap.get(model).add(element);
        else
            this.modelLookupMap.get(model).delete(element);
    }
    updateModel(element, model, attach = true) {
        if (!element || !model)
            return;
        const mvc = this.peek(element);
        if (!mvc)
            return;
        if (attach) {
            if (!model.onKeyChanged.has(mvc.emitterKeyCallback))
                model.onKeyChanged.add(mvc.emitterKeyCallback);
            model.fireCallbackHook = mvc.emitterCallback;
        }
        else {
            model.onKeyChanged.remove(mvc.emitterKeyCallback);
            model.fireCallbackHook = undefined;
        }
    }
    updateView(element, view, attach = true) {
        if (!view || !element)
            return;
        const mvc = this.peek(element);
        if (!mvc)
            return;
        view.emitter = attach ? mvc.emitter : undefined;
        view.model = attach ? mvc.model : undefined;
    }
    updateEmitter(element, emitter, attach = true) {
        if (!emitter || !element)
            return;
        const mvc = this.peek(element);
        if (!mvc)
            return;
        emitter.model = attach ? mvc.model : undefined;
    }
    updateOperator(element, operator, attach = true) {
        if (!operator || !element)
            return;
        const mvc = this.peek(element);
        if (!mvc)
            return;
        operator.emitter = attach ? mvc.emitter : undefined;
        operator.model = attach ? mvc.model : undefined;
        operator.view = attach ? mvc.view : undefined;
    }
    updateHandler(element, handler, attach = true) {
        if (!element || !handler)
            return;
        const mvc = this.peek(element);
        if (!mvc)
            return;
        handler.model = attach ? mvc.model : undefined;
    }
    updateInteractor(element, interactor, attach = true) {
        if (!element || !interactor)
            return;
        const mvc = this.peek(element);
        if (!mvc)
            return;
        interactor.model = attach ? mvc.model : undefined;
        interactor.view = attach ? mvc.view : undefined;
        interactor.emitter = attach ? mvc.emitter : undefined;
    }
    updateTool(element, tool, attach = true) {
        if (!element || !tool)
            return;
        const mvc = this.peek(element);
        if (!mvc)
            return;
        tool.model = attach ? mvc.model : undefined;
        tool.view = attach ? mvc.view : undefined;
        tool.emitter = attach ? mvc.emitter : undefined;
    }
    updateConstrainer(element, constrainer, attach = true) {
        if (!element || !constrainer)
            return;
        const mvc = this.peek(element);
        if (!mvc)
            return;
        constrainer.model = attach ? mvc.model : undefined;
        constrainer.view = attach ? mvc.view : undefined;
        constrainer.emitter = attach ? mvc.emitter : undefined;
    }
    linkPieces(element) {
        if (!element)
            return;
        const mvc = this.peek(element);
        if (!mvc)
            return;
        this.updateModel(element, mvc.model);
        this.updateEmitter(element, mvc.emitter);
        this.updateView(element, mvc.view);
        mvc.operators.forEach(operator => this.updateOperator(element, operator));
        mvc.model?.handlers.forEach(handler => this.updateHandler(element, handler));
        mvc.interactors.forEach(interactor => this.updateInteractor(element, interactor));
        mvc.tools.forEach(tool => this.updateTool(element, tool));
        mvc.constrainers.forEach(constrainer => this.updateConstrainer(element, constrainer));
    }
    removeInstance(element, kind, keyOrInstance) {
        if (!element)
            return;
        const map = kind === "handler" ? this.peek(element)?.model?.handlers : this.peek(element)?.[kind + "s"];
        if (!map)
            return;
        const key = typeof keyOrInstance === "string" ? keyOrInstance
            : Array.from(map.entries()).find(([, v]) => v === keyOrInstance)?.[0];
        if (!key)
            return;
        const methodName = "update" + kind.charAt(0).toUpperCase() + kind.slice(1);
        this[methodName]?.(element, map.get(key), false);
        map.delete(key);
    }
    generateInstance(data, element) {
        if (!data)
            return undefined;
        // If element is a raw DOM node backing a GradumProxiedElement, pass the wrapper instead so
        // that view/operator/etc. constructors receive the public class instance (e.g. FlowEntry)
        // rather than the internal <g> element.
        const effectiveElement = element?.[proxyWrapperSymbol] ?? element;
        if (typeof data === "function")
            return new data(effectiveElement ? { element: effectiveElement } : undefined);
        return data;
    }
    generateInstances(data, element) {
        if (!data)
            return [];
        if (typeof data !== "object" || !Array.isArray(data))
            data = [data];
        const result = [];
        data.forEach(constructor => {
            const instance = this.generateInstance(constructor, element);
            if (instance)
                result.push(instance);
        });
        return result;
    }
    /**
     * @protected
     * @function extractClassEssenceName
     * @description Utility that derives a shorter "essence" key name for an MVC piece from its constructor name.
     * It strips the element/class name prefix (if any) and the type suffix (e.g., "Operator", "Tool") to
     * produce a key that reads well in camelCase (e.g., `MyElementSnapOperator` -> `snap`).
     * @param {object} element - The element the piece is attached to, whose name is stripped from the prefix.
     * @param {new (...args: any[]) => any} constructor - The constructor to derive the name from.
     * @param {string} type - The type suffix to strip (e.g., "Operator", "Handler", "Tool", "Constrainer").
     * @returns {string} A lower-cased, camel-style key name derived from the constructor.
     */
    extractClassEssenceName(element, constructor, type) {
        let className = constructor.name;
        const target = element[proxyWrapperSymbol] ?? element;
        let prototype = Object.getPrototypeOf(target);
        while (prototype && prototype.constructor !== Object) {
            const name = prototype.constructor.name.replaceAll("_", "");
            if (className.startsWith(name)) {
                className = className.slice(name.length);
                break;
            }
            prototype = Object.getPrototypeOf(prototype);
        }
        if (className.endsWith(type))
            className = className.slice(0, -(type.length));
        return className.charAt(0).toLowerCase() + className.slice(1);
    }
}

/**
 * @internal
 * @description The names of the MVC roles an element can hold, in the order they are attached. Used to
 * split MVC entries out of a properties object and to drive the generic add/get/remove paths.
 */
const MvcFields = ["metadata", "model", "view", "emitter", "operators", "handlers", "interactors", "tools", "constrainers"];
const utils$8 = new MvcFunctionsUtils();
/**
 * @internal
 * @function setupMvcFunctions
 * @description Install the MVC functions (`model`, `view`, `emitter`, and the add/get/remove methods for each
 * role) onto the {@link GradumSelector} prototype. Called once by
 * {@link gradumify}; the matching `exclude` option skips it.
 */
function setupMvcFunctions() {
    Object.defineProperty(GradumSelector.prototype, "mvc", {
        get() {
            const data = utils$8.peek(this.element);
            if (!data)
                return {};
            return {
                model: data.model,
                view: data.view,
                operators: Array.from(data.operators?.values() ?? []),
                handlers: Array.from(data.model?.handlers?.values() ?? []),
                interactors: Array.from(data.interactors?.values() ?? []),
                tools: Array.from(data.tools?.values() ?? []),
                constrainers: Array.from(data.constrainers?.values() ?? []),
            };
        }, configurable: true, enumerable: true,
    });
    // -------------------------------------------------------------------------
    // Singular pieces
    // -------------------------------------------------------------------------
    Object.defineProperty(GradumSelector.prototype, "model", {
        get() {
            return utils$8.peek(this.element)?.model;
        },
        set(value) {
            if (!this.element)
                return;
            const mvc = utils$8.data(this.element);
            utils$8.attachModel(this.element, this.model, false);
            utils$8.updateModel(this.element, mvc.model, false);
            if (!value)
                return;
            mvc.model = typeof value === "function" ? value.create() : value;
            utils$8.attachModel(this.element, mvc.model);
            utils$8.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(GradumSelector.prototype, "view", {
        get() {
            return utils$8.peek(this.element)?.view;
        },
        set(value) {
            if (!this.element)
                return;
            utils$8.data(this.element).view = utils$8.generateInstance(value, this.element);
            utils$8.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(GradumSelector.prototype, "emitter", {
        get() {
            return utils$8.peek(this.element)?.emitter;
        },
        set(value) {
            if (!this.element)
                return;
            utils$8.data(this.element).emitter = utils$8.generateInstance(value);
            utils$8.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });
    // -------------------------------------------------------------------------
    // Data
    // -------------------------------------------------------------------------
    Object.defineProperty(GradumSelector.prototype, "data", {
        get() {
            return utils$8.peek(this.element)?.model?.data;
        },
        set(value) {
            if (!this.element)
                return;
            const mvc = utils$8.data(this.element);
            if (!mvc.model)
                return;
            mvc.model.data = value;
        },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(GradumSelector.prototype, "metadata", {
        get() {
            if (!this.element)
                return undefined;
            const mvc = utils$8.data(this.element);
            if (!mvc)
                return undefined;
            //Created on first read, so metadata is usable on any element — with or without a model.
            mvc.metadata ??= GradumModel.create({ initialize: true });
            return mvc.metadata;
        },
        set(value) {
            if (!this.element)
                return;
            const mvc = utils$8.data(this.element);
            if (!mvc)
                return;
            if (value instanceof GradumModel)
                mvc.metadata = value;
            else
                mvc.metadata = GradumModel.create({ data: value ?? {}, initialize: true });
        },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(GradumSelector.prototype, "dataId", {
        get() {
            return utils$8.peek(this.element)?.model?.id;
        },
        set(value) {
            if (!this.element)
                return;
            const mvc = utils$8.data(this.element);
            if (!mvc.model)
                return;
            mvc.model.id = value;
        },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(GradumSelector.prototype, "dataIndex", {
        get() {
            return Number.parseInt(this.dataId);
        },
        set(value) {
            this.dataId = value;
        },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(GradumSelector.prototype, "dataSize", {
        get() {
            return utils$8.peek(this.element)?.model?.dataSize;
        },
        configurable: true, enumerable: true,
    });
    // -------------------------------------------------------------------------
    // Collections
    // -------------------------------------------------------------------------
    Object.defineProperty(GradumSelector.prototype, "operators", {
        get() {
            return Array.from(utils$8.peek(this.element)?.operators.values() ?? []);
        },
        set(value) {
            if (!this.element)
                return;
            utils$8.generateInstances(value, this.element).forEach(instance => this.addOperator(instance));
            utils$8.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(GradumSelector.prototype, "handlers", {
        get() {
            return Array.from(utils$8.peek(this.element)?.model?.handlers.values() ?? []);
        },
        set(value) {
            if (!this.element)
                return;
            utils$8.generateInstances(value).forEach(instance => this.addHandler(instance));
        },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(GradumSelector.prototype, "interactors", {
        get() {
            return Array.from(utils$8.peek(this.element)?.interactors.values() ?? []);
        },
        set(value) {
            if (!this.element)
                return;
            utils$8.generateInstances(value, this.element).forEach(instance => this.addInteractor(instance));
            utils$8.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(GradumSelector.prototype, "tools", {
        get() {
            return Array.from(utils$8.peek(this.element)?.tools.values() ?? []);
        },
        set(value) {
            if (!this.element)
                return;
            utils$8.generateInstances(value, this.element).forEach(instance => this.addTool(instance));
            utils$8.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });
    Object.defineProperty(GradumSelector.prototype, "constrainers", {
        get() {
            return Array.from(utils$8.peek(this.element)?.constrainers.values() ?? []);
        },
        set(value) {
            if (!this.element)
                return;
            utils$8.generateInstances(value, this.element).forEach(instance => this.addConstrainer(instance));
            utils$8.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });
    // -------------------------------------------------------------------------
    // Main methods
    // -------------------------------------------------------------------------
    GradumSelector.prototype.setMvc = function (properties) {
        const mvc = utils$8.data(this.element);
        for (const [key, value] of Object.entries(gradum(properties).extract(MvcFields))) {
            try {
                this[key] = value;
            }
            catch { }
        }
        if (!mvc.emitter)
            mvc.emitter = new GradumEmitter();
        if (properties.data && mvc.model)
            mvc.model.setDataWithoutInitializing(properties.data);
        if (properties.initialize === undefined || properties.initialize)
            this.initializeMvc();
        return this;
    };
    GradumSelector.prototype.initializeMvc = function () {
        if (!this.element)
            return this;
        const mvc = utils$8.peek(this.element);
        if (!mvc)
            return this;
        mvc.view?.initialize();
        mvc.operators.forEach(operator => operator.initialize());
        mvc.interactors.forEach(interactor => interactor.initialize());
        mvc.tools.forEach(tool => tool.initialize());
        mvc.constrainers.forEach(constrainer => constrainer.initialize());
        mvc.model?.initialize();
        return this;
    };
    GradumSelector.prototype.getMvcDifference = function (properties = {}) {
        const difference = {};
        const toConstructor = (x) => {
            if (!x)
                return;
            if (typeof x === "function")
                return x;
            if (typeof x === "object")
                return x.constructor;
        };
        const toConstructorList = (x) => {
            if (!x)
                return [];
            const arr = Array.isArray(x) ? x : [x];
            return arr.map(toConstructor).filter(Boolean);
        };
        const processField = (field) => {
            if (!this[field])
                return;
            const current = toConstructor(this[field]);
            const external = toConstructor(properties[field]);
            if (current === external)
                return;
            difference[field] = current;
        };
        const processArray = (field) => {
            if (!this[field] || this[field].length === 0)
                return;
            const current = new Set(toConstructorList(this[field]));
            const external = new Set(toConstructorList(properties[field] ?? []));
            const result = [];
            for (const entry of current)
                if (!external.has(entry))
                    result.push(entry);
            if (result.length > 0)
                difference[field] = result;
        };
        processField("view");
        processField("model");
        processField("emitter");
        processArray("operators");
        processArray("handlers");
        processArray("interactors");
        processArray("tools");
        processArray("constrainers");
        return difference;
    };
    // -------------------------------------------------------------------------
    // Manipulations
    // -------------------------------------------------------------------------
    GradumSelector.prototype.getOperator = function (key) {
        return utils$8.peek(this.element)?.operators.get(key);
    };
    GradumSelector.prototype.addOperator = function (operator) {
        if (!this.element)
            return this;
        if (!operator.keyName)
            operator.keyName =
                utils$8.extractClassEssenceName(this.element, operator.constructor, "Operator");
        const data = utils$8.data(this.element);
        if (data.operators.has(operator.keyName))
            return this;
        data.operators.set(operator.keyName, operator);
        utils$8.updateOperator(this.element, operator);
        return this;
    };
    GradumSelector.prototype.removeOperator = function (keyOrInstance) {
        if (!this.element)
            return this;
        utils$8.removeInstance(this.element, "operator", keyOrInstance);
        return this;
    };
    GradumSelector.prototype.getHandler = function (key) {
        return utils$8.peek(this.element)?.model?.handlers.get(key);
    };
    GradumSelector.prototype.addHandler = function (handler) {
        if (!this.element)
            return this;
        if (!handler.keyName)
            handler.keyName =
                utils$8.extractClassEssenceName(this.element, handler.constructor, "Handler");
        const data = utils$8.data(this.element);
        if (data.model?.handlers.has(handler.keyName))
            return this;
        data.model?.handlers.set(handler.keyName, handler);
        utils$8.updateHandler(this.element, handler);
        return this;
    };
    GradumSelector.prototype.removeHandler = function (keyOrInstance) {
        if (!this.element)
            return this;
        utils$8.removeInstance(this.element, "handler", keyOrInstance);
        return this;
    };
    GradumSelector.prototype.getInteractor = function (key) {
        return utils$8.peek(this.element)?.interactors.get(key);
    };
    GradumSelector.prototype.addInteractor = function (interactor) {
        if (!this.element)
            return this;
        if (!interactor.keyName)
            interactor.keyName =
                utils$8.extractClassEssenceName(this.element, interactor.constructor, "Interactor");
        const data = utils$8.data(this.element);
        if (data.interactors.has(interactor.keyName))
            return this;
        data.interactors.set(interactor.keyName, interactor);
        utils$8.updateInteractor(this.element, interactor);
        return this;
    };
    GradumSelector.prototype.removeInteractor = function (keyOrInstance) {
        if (!this.element)
            return this;
        utils$8.removeInstance(this.element, "interactor", keyOrInstance);
        return this;
    };
    GradumSelector.prototype.getTool = function (key) {
        return utils$8.peek(this.element)?.tools.get(key);
    };
    GradumSelector.prototype.addTool = function (tool) {
        if (!this.element)
            return this;
        if (!tool.keyName)
            tool.keyName =
                utils$8.extractClassEssenceName(this.element, tool.constructor, "Tool");
        const data = utils$8.data(this.element);
        if (data.tools.has(tool.keyName))
            return this;
        data.tools.set(tool.keyName, tool);
        utils$8.updateTool(this.element, tool);
        return this;
    };
    GradumSelector.prototype.removeTool = function (keyOrInstance) {
        if (!this.element)
            return this;
        utils$8.removeInstance(this.element, "tool", keyOrInstance);
        return this;
    };
    GradumSelector.prototype.getConstrainer = function (key) {
        return utils$8.peek(this.element)?.constrainers.get(key);
    };
    GradumSelector.prototype.addConstrainer = function (constrainer) {
        if (!this.element)
            return this;
        if (!constrainer.keyName)
            constrainer.keyName =
                utils$8.extractClassEssenceName(this.element, constrainer.constructor, "Constrainer");
        const data = utils$8.data(this.element);
        if (data.constrainers.has(constrainer.keyName))
            return this;
        data.constrainers.set(constrainer.keyName, constrainer);
        utils$8.updateConstrainer(this.element, constrainer);
        return this;
    };
    GradumSelector.prototype.removeConstrainer = function (keyOrInstance) {
        if (!this.element)
            return this;
        utils$8.removeInstance(this.element, "constrainer", keyOrInstance);
        return this;
    };
}

/**
 * @internal
 * @function defineDefaultProperties
 * @template {new (...args: any[]) => any} Type - The class being set up.
 * @description Install the shared element behaviour on a class prototype — `destroy`, `initialize`,
 * `initialized`, `feedforward`, `clone`, and `defaultFeedforwardProperties`. This is what gives every
 * element class the same lifecycle without inheriting from a common base. Called once per element class
 * at definition time.
 * @param {Type} constructor - The class whose prototype receives the behaviour.
 */
function defineDefaultProperties(constructor) {
    const prototype = constructor.prototype;
    const initializedKey = Symbol("__initialized__");
    Object.defineProperty(prototype, "destroy", {
        value: function () { },
        configurable: true,
        enumerable: false,
    });
    Object.defineProperty(prototype, "initialized", {
        get: function () {
            return this[initializedKey] ?? false;
        },
        configurable: true,
        enumerable: false,
    });
    Object.defineProperty(prototype, "initialize", {
        value: function () {
            if (this[initializedKey])
                return;
            this[initializedKey] = true;
            this.setupUIElements?.();
            this.setupUILayout?.();
            this.setupUIListeners?.();
            this.setupFields?.();
            this.setupChangedCallbacks?.();
            gradum(this).initializeMvc();
            initializeEffects(this);
        },
        configurable: true,
        enumerable: false,
    });
    Object.defineProperty(prototype, "clone", {
        value: function (properties) { return gradum(this).clone(properties); },
        configurable: true,
        enumerable: false,
    });
    const ffKey = Symbol("__defaultFeedforwardProperties__");
    Object.defineProperty(prototype, "defaultFeedforwardProperties", {
        get() {
            if (!this[ffKey])
                this[ffKey] = {};
            return this[ffKey];
        },
        set(value) { this[ffKey] = value; },
        configurable: true,
        enumerable: true
    });
    Object.defineProperty(prototype, "feedforward", {
        value: function (properties) { return gradum(this).feedforward(properties); },
        configurable: true,
        enumerable: false,
    });
}

/**
 * @internal
 * @function defineMvcAccessors
 * @template {new (...args: any[]) => any} Type - The class being set up.
 * @description Install the MVC surface on a class prototype, so instances expose `view`, `model`,
 * `emitter`, `operators`, `handlers`, `interactors`, `tools`, `constrainers`, `data`, `dataId`,
 * `dataIndex`, `dataSize`, and the matching add/get/remove methods. Each one forwards to the element's
 * selector, which is where the state actually lives. Called once per element class at definition time.
 * @param {Type} constructor - The class whose prototype receives the accessors.
 */
function defineMvcAccessors(constructor) {
    const prototype = constructor.prototype;
    // Fields — proxy through gradum(this)
    [...MvcFields, "data", "dataId", "dataIndex"].forEach(fieldName => {
        Object.defineProperty(prototype, fieldName, {
            get() { return gradum(this)[fieldName]; },
            set(value) { gradum(this)[fieldName] = value; },
            configurable: true,
            enumerable: true,
        });
    });
    ["dataSize"].forEach(fieldName => {
        Object.defineProperty(prototype, fieldName, {
            get() { return gradum(this)[fieldName]; },
            configurable: true,
            enumerable: true,
        });
    });
}

/**
 * @internal
 * @function defineUIPrototype
 * @template {new (...args: any[]) => any} Type - The class being set up.
 * @description Install the UI surface on a class prototype — `shadowDOM`, `defaultClasses`, and
 * `unsetDefaultClasses` — backed by private symbols so the values do not collide with user fields.
 * Called once per element class at definition time.
 * @param {Type} constructor - The class whose prototype receives the accessors.
 */
function defineUIPrototype(constructor) {
    const prototype = constructor.prototype;
    const shadowDOMKey = Symbol("__shadow_dom__");
    const unsetDefaultClassesKey = Symbol("__unset_default_classes__");
    const defaultClassesKey = Symbol("__default_classes__");
    Object.defineProperty(prototype, "shadowDOM", {
        get: function () { return this[shadowDOMKey] ?? false; },
        set: function (value) {
            this[shadowDOMKey] = value;
            const el = this.element;
            if (value && !el.shadowRoot)
                try {
                    el.attachShadow({ mode: "open" });
                }
                catch { }
            if (el.shadowRoot) {
                const from = value ? el : el.shadowRoot;
                const to = value ? el.shadowRoot : el;
                while (from.childNodes.length > 0)
                    to.appendChild(from.childNodes[0]);
            }
        },
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(prototype, "unsetDefaultClasses", {
        get: function () { return this[unsetDefaultClassesKey] ?? false; },
        set: function (value) {
            this[unsetDefaultClassesKey] = value;
            gradum(this).toggleClass(this.defaultClasses, !value);
        },
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(prototype, "defaultClasses", {
        get: function () { return this[defaultClassesKey] ?? ""; },
        set: function (value) {
            if (!this.unsetDefaultClasses)
                gradum(this).toggleClass(this[defaultClassesKey], false);
            this[defaultClassesKey] = value;
            if (!this.unsetDefaultClasses)
                gradum(this).toggleClass(value, true);
        },
        enumerable: true,
        configurable: true,
    });
}

const VOID       = -1;
const PRIMITIVE  = 0;
const ARRAY      = 1;
const OBJECT     = 2;
const DATE       = 3;
const REGEXP     = 4;
const MAP        = 5;
const SET        = 6;
const ERROR      = 7;
const BIGINT     = 8;
// export const SYMBOL = 9;

const env = typeof self === 'object' ? self : globalThis;

const guard = (name, init) => {
  switch (name) {
    case 'Function':
    case 'SharedWorker':
    case 'Worker':
    case 'eval':
    case 'setInterval':
    case 'setTimeout':
      throw new TypeError('unable to deserialize ' + name);
  }
  return new env[name](init);
};

const deserializer = ($, _) => {
  const as = (out, index) => {
    $.set(index, out);
    return out;
  };

  const unpair = index => {
    if ($.has(index))
      return $.get(index);

    const [type, value] = _[index];
    switch (type) {
      case PRIMITIVE:
      case VOID:
        return as(value, index);
      case ARRAY: {
        const arr = as([], index);
        for (const index of value)
          arr.push(unpair(index));
        return arr;
      }
      case OBJECT: {
        const object = as({}, index);
        for (const [key, index] of value)
          object[unpair(key)] = unpair(index);
        return object;
      }
      case DATE:
        return as(new Date(value), index);
      case REGEXP: {
        const {source, flags} = value;
        return as(new RegExp(source, flags), index);
      }
      case MAP: {
        const map = as(new Map, index);
        for (const [key, index] of value)
          map.set(unpair(key), unpair(index));
        return map;
      }
      case SET: {
        const set = as(new Set, index);
        for (const index of value)
          set.add(unpair(index));
        return set;
      }
      case ERROR: {
        const {name, message} = value;
        return as(
          typeof env[name] === 'function' ?
            guard(name, message) :
            new Error(message),
          index
        );
      }
      case BIGINT:
        return as(BigInt(value), index);
      case 'BigInt':
        return as(Object(BigInt(value)), index);
      case 'ArrayBuffer':
        return as(new Uint8Array(value).buffer, value);
      case 'DataView': {
        const { buffer } = new Uint8Array(value);
        return as(new DataView(buffer), value);
      }
    }
    return as(guard(type, value), index);
  };

  return unpair;
};

/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns a deserialized value from a serialized array of Records.
 * @param {Record[]} serialized a previously serialized value.
 * @returns {any}
 */
const deserialize = serialized => deserializer(new Map, serialized)(0);

/*! (c) Andrea Giammarchi - ISC */


const {parse: $parse} = JSON;

/**
 * Revive a previously stringified structured clone.
 * @param {string} str previously stringified data as string.
 * @returns {any} whatever was previously stringified as clone.
 */
const parse = str => deserialize($parse(str));

/**
 * @class GradumElement
 * @group MVC
 * @category Element Classes
 *
 * @extends HTMLElement
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Base GradumElement class, extending the base HTML element with a few useful tools and functions.
 * */
class GradumElement extends HTMLElement {
    /**
     * @description Default properties assigned to a new instance.
     */
    static defaultProperties = {
        defaultSelectedClasses: "selected"
    };
    // public static create<Type extends new (...args: any[]) => GradumElement>
    // (this: Type, properties: InstanceType<Type>["properties"] = {}): InstanceType<Type> {
    //     return (this as any).customCreate.call(this, properties);
    // }
    /**
     * @function create
     * @static
     * @description Instantiate this class with the given properties. Defaults declared by every class in the
     * inheritance chain are applied first, nearest ancestor last, so a subclass' `defaultProperties` win over
     * its parent's. The return type follows the class it is called on, and the MVC type parameters are read
     * back off the properties — passing `model: MyModel` types `.model` as `MyModel` without a cast.
     *
     * *Note: the callee is read through `this["prototype"]` rather than `InstanceType<this>`, because the
     * latter instantiates a generic class' parameters with their constraints instead of their defaults,
     * which is what forced casts at call sites.*
     * @template {{prototype: GradumElement}} This - The class `create` was called on.
     * @template {GradumView} ViewType - Inferred from `properties.view`.
     * @template {object} DataType - Inferred from `properties.data`.
     * @template {GradumModel} ModelType - Inferred from `properties.model`.
     * @template {GradumEmitter} EmitterType - Inferred from `properties.emitter`.
     * @param {GradumElementProperties} [properties] - Properties to set on the new instance.
     * @returns {GradumElement} The created instance, typed as the class this was called on.
     */
    static create(properties) {
        return this.customCreate(properties ?? {});
    }
    /**
     * @protected
     * @static
     * @function customCreate
     * @description The construction step behind {@link create}. Override it to change how instances of a class
     * are built — to route through a factory, or to wrap the instance — while keeping the default-merging that
     * `create` performs.
     * @param {object} properties - Properties to set on the new instance, defaults already merged in.
     * @returns {object} The created instance.
     */
    static customCreate(properties) {
        const prototypeChain = getPrototypeChain(this);
        for (const prototype of prototypeChain)
            gradum(properties).applyDefaults(prototype["defaultProperties"] ?? {});
        return element({ ...properties });
    }
    /**
     * @description Delegate fired when the element is attached to DOM.
     */
    onAttach = new Delegate();
    /**
     * @description Delegate fired when the element is detached from the DOM.
     */
    onDetach = new Delegate();
    /**
     * @description Delegate fired when the element is adopted by a new parent in the DOM.
     */
    onAdopt = new Delegate();
    /**
     * @function setupChangedCallbacks
     * @description Setup method intended to initialize change listeners and callbacks. Called on `initialize()`.
     * @protected
     */
    setupChangedCallbacks() {
    }
    /**
     * @function setupUIElements
     * @description Setup method intended to initialize all direct sub-elements attached to this element, and store
     * them in fields. Called on `initialize()`.
     * @protected
     */
    setupUIElements() {
    }
    /**
     * @function setupUILayout
     * @description Setup method to create the layout structure of the element by adding all created sub-elements to
     * this element's child tree. Called on `initialize()`.
     * @protected
     */
    setupUILayout() {
    }
    /**
     * @function setupUIListeners
     * @description Setup method to initialize and define all input/DOM event listeners of the element. Called on
     * `initialize()`.
     * @protected
     */
    setupUIListeners() {
    }
    /**
     * @function connectedCallback
     * @description function called when the element is attached to the DOM.
     */
    connectedCallback() {
        if (!this.initialized) {
            const prototypeChain = getPrototypeChain(this);
            const defaults = {};
            for (const proto of prototypeChain)
                gradum(defaults).applyDefaults(proto.constructor?.["defaultProperties"]);
            const toApply = {};
            for (const [key, value] of Object.entries(defaults))
                if (isUndefined(this[key]))
                    toApply[key] = value;
            gradum(this).setProperties(toApply);
            for (const attribute of this.constructor["observedAttributes"] ?? []) {
                if (!this.hasAttribute(attribute))
                    continue;
                const property = kebabToCamelCase(attribute);
                const current = this.getAttribute(attribute);
                this[property] = parse(current);
            }
        }
        this.onAttach.fire();
    }
    /**
     * @function disconnectedCallback
     * @description function called when the element is detached from the DOM.
     */
    disconnectedCallback() {
        this.onDetach.fire();
    }
    /**
     * @function adoptedCallback
     * @description function called when the element is adopted by a new parent in the DOM.
     */
    adoptedCallback() {
        this.onAdopt.fire();
    }
}
(() => {
    defineDefaultProperties(GradumElement);
    defineMvcAccessors(GradumElement);
    defineUIPrototype(GradumElement);
})();
addRegistryCategory(GradumElement);

/**
 * @class GradumBaseElement
 * @group MVC
 * @category Element Classes
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description GradumHeadlessElement class, similar to GradumElement but without extending HTMLElement.
 */
class GradumBaseElement {
    /**
     * @description Default properties assigned to a new instance.
     */
    static defaultProperties = {};
    /**
     * @function create
     * @static
     * @description Instantiate this class with the given properties. Defaults declared by every class in the
     * inheritance chain are applied first, nearest ancestor last, so a subclass' `defaultProperties` win over
     * its parent's. The return type follows the class it is called on, so a subclass gets its own type back.
     * @param {PropertiesType} [properties] - Properties to set on the new instance.
     * @returns {InstanceType<Type>} The created instance.
     */
    static create(properties = {}) {
        return this.customCreate.call(this, properties);
    }
    /**
     * @protected
     * @static
     * @function customCreate
     * @description The construction step behind {@link create}. Override it to change how instances of a class
     * are built — to route through a factory, or to wrap the instance — while keeping the default-merging that
     * `create` performs.
     * @param {object} properties - Properties to set on the new instance, defaults already merged in.
     * @returns {object} The created instance.
     */
    static customCreate(properties) {
        const prototypeChain = getPrototypeChain(this);
        for (const prototype of prototypeChain)
            gradum(properties).applyDefaults(prototype["defaultProperties"] ?? {});
        const obj = new this();
        gradum(obj).setProperties(properties);
        return obj;
    }
}
(() => {
    defineDefaultProperties(GradumBaseElement);
})();
addRegistryCategory(GradumBaseElement);

const elementSymbol = Symbol("___element___");
/**
 * @class GradumProxiedElement
 * @group MVC
 * @category Element Classes
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description GradumProxiedElement class, similar to GradumElement but containing an HTML element instead of being one.
 */
class GradumProxiedElement {
    /**
     * @description Default properties assigned to a new instance.
     */
    static defaultProperties = {
        defaultSelectedClasses: "selected"
    };
    /**
     * @function create
     * @static
     * @description Instantiate this class with the given properties. Defaults declared by every class in the
     * inheritance chain are applied first, nearest ancestor last, so a subclass' `defaultProperties` win over
     * its parent's. The return type follows the class it is called on, so a subclass gets its own type back.
     * @param {PropertiesType} [properties] - Properties to set on the new instance.
     * @returns {InstanceType<Type>} The created instance.
     */
    static create(properties) {
        const props = properties ?? {};
        const prototypeChain = getPrototypeChain(this);
        for (const prototype of prototypeChain)
            gradum(props).applyDefaults(prototype["defaultProperties"] ?? {});
        return this.customCreate.call(this, props);
    }
    /**
     * @protected
     * @static
     * @function customCreate
     * @description The construction step behind {@link create}. Override it to change how instances of a class
     * are built — to route through a factory, or to wrap the instance — while keeping the default-merging that
     * `create` performs.
     * @param {object} properties - Properties to set on the new instance, defaults already merged in.
     * @returns {object} The created instance.
     */
    static customCreate(properties) {
        const obj = new this();
        obj[elementSymbol] = blindElement({ tag: properties["tag"] });
        // gradum(obj) without raw unwraps to obj.element, which is the same key the model getter
        // resolves to later. Using raw=true here would key MVC data under obj instead, making
        // gradum(obj).model return undefined during initialize().
        // The back-reference lets extractClassEssenceName walk obj's prototype chain (FlowEntry,
        // etc.) instead of the raw SVGGElement chain, so handler/operator key derivation works.
        obj[elementSymbol][proxyWrapperSymbol] = obj;
        const shouldInitialize = properties["initialize"] !== false;
        gradum(obj).setProperties(Object.assign({}, properties, { initialize: false }));
        // Dispatch custom wrapper setters that setProperties couldn't reach.
        // gradum(obj) routes through obj.element (the raw DOM node), so properties that have no
        // meaning on the raw element (e.g. FlowEntry.flow) are silently dropped. We replay them
        // onto obj directly — but only when: (1) not an MVC field already handled by GradumSelector,
        // (2) the raw element has no descriptor for the key (setProperties already handled it), and
        // (3) obj's prototype chain has a real setter for the key.
        const rawEl = obj[elementSymbol];
        for (const [key, value] of Object.entries(properties)) {
            if (MvcFields.includes(key))
                continue;
            if (getFirstDescriptorInChain(rawEl, key))
                continue;
            const desc = getFirstDescriptorInChain(obj, key);
            if (desc?.set)
                obj[key] = value;
        }
        if (shouldInitialize && typeof obj["initialize"] === "function")
            obj["initialize"]();
        return obj;
    }
    /**
     * @description The HTML (or other) element wrapped inside this instance.
     */
    get element() {
        return this[elementSymbol];
    }
    /**
     * @function setupChangedCallbacks
     * @description Setup method intended to initialize change listeners and callbacks. Called on `initialize()`.
     * @protected
     */
    setupChangedCallbacks() {
    }
    /**
     * @function setupUIElements
     * @description Setup method intended to initialize all direct sub-elements attached to this element, and store
     * them in fields. Called on `initialize()`.
     * @protected
     */
    setupUIElements() {
    }
    /**
     * @function setupUILayout
     * @description Setup method to create the layout structure of the element by adding all created sub-elements to
     * this element's child tree. Called on `initialize()`.
     * @protected
     */
    setupUILayout() {
    }
    /**
     * @function setupUIListeners
     * @description Setup method to initialize and define all input/DOM event listeners of the element. Called on
     * `initialize()`.
     * @protected
     */
    setupUIListeners() {
    }
}
(() => {
    defineDefaultProperties(GradumProxiedElement);
    defineMvcAccessors(GradumProxiedElement);
    defineUIPrototype(GradumProxiedElement);
})();
addRegistryCategory(GradumProxiedElement);

/**
 * @class GradumHeadlessElement
 * @group MVC
 * @category Element Classes
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description GradumHeadlessElement class, similar to GradumElement but without extending HTMLElement.
 */
class GradumHeadlessElement {
    /**
     * @description Default properties assigned to a new instance.
     */
    static defaultProperties = {};
    /**
     * @function create
     * @static
     * @description Instantiate this class with the given properties. Defaults declared by every class in the
     * inheritance chain are applied first, nearest ancestor last, so a subclass' `defaultProperties` win over
     * its parent's. The return type follows the class it is called on, so a subclass gets its own type back.
     * @param {PropertiesType} [properties] - Properties to set on the new instance.
     * @returns {InstanceType<Type>} The created instance.
     */
    static create(properties = {}) {
        return this.customCreate.call(this, properties);
    }
    /**
     * @protected
     * @static
     * @function customCreate
     * @description The construction step behind {@link create}. Override it to change how instances of a class
     * are built — to route through a factory, or to wrap the instance — while keeping the default-merging that
     * `create` performs.
     * @param {object} properties - Properties to set on the new instance, defaults already merged in.
     * @returns {object} The created instance.
     */
    static customCreate(properties) {
        const prototypeChain = getPrototypeChain(this);
        for (const prototype of prototypeChain)
            gradum(properties).applyDefaults(prototype["defaultProperties"] ?? {});
        const obj = new this();
        gradum(obj).setProperties(properties);
        return obj;
    }
}
(() => {
    defineDefaultProperties(GradumHeadlessElement);
    defineMvcAccessors(GradumHeadlessElement);
})();
addRegistryCategory(GradumHeadlessElement);

/**
 * @function trim
 * @group Utilities
 * @category Numbers
 *
 * @description Clamp a number into a range. Anything that is not a number comes back as the fallback rather
 * than as `NaN`, so it is safe to pass unvalidated input straight in.
 * *Note: the bounds are given max-first.*
 * @param {number} value - The value to clamp.
 * @param {number} max - Upper bound, inclusive.
 * @param {number} [min=0] - Lower bound, inclusive.
 * @param {number} [fallback=0] - Returned when `value` is not a number.
 * @returns {number} The value clamped into `[min, max]`, or `fallback` if it was not a number.
 */
function trim(value, max, min = 0, fallback = 0) {
    if (value === undefined || typeof value !== "number")
        return fallback;
    if (value < min)
        value = min;
    if (value > max)
        value = max;
    return value;
}
/**
 * @function mod
 * @group Utilities
 * @category Numbers
 *
 * @description Wrap a number into `[0, modValue)`, so negative inputs come back positive — unlike the `%`
 * operator, which keeps the sign of its left operand. Use it to cycle an index around a list.
 * @param {number} value - The value to wrap.
 * @param {number} modValue - The modulus. Must be non-zero.
 * @returns {number} The wrapped value, always in `[0, modValue)`.
 * @throws {RangeError} If `modValue` is `0`, since no value can be wrapped into an empty range. Guard the
 * call when the modulus comes from a length that may be zero.
 */
function mod(value, modValue) {
    if (modValue === 0)
        throw new RangeError("mod: modValue must be non-zero.");
    return ((value % modValue) + modValue) % modValue;
}

/**
 * @group Components
 * @category Data Structures
 */
class Point {
    /**
     * @readonly
     * @description The point's x coordinate. Points are immutable — the arithmetic methods return new
     * points rather than changing this one.
     */
    x;
    /**
     * @readonly
     * @description The point's y coordinate.
     */
    y;
    constructor(x = 0, y = typeof x == "number" ? x : 0) {
        if (typeof x == "number") {
            this.x = x;
            this.y = y;
        }
        else if ("clientX" in x) {
            this.x = x.clientX;
            this.y = x.clientY;
        }
        else if ("x" in x) {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x[0];
            this.y = x[1];
        }
    }
    // Static methods
    /**
     * @description Calculate the distance between two Position2D points.
     * @param {Point} p1 - First point
     * @param {Point} p2 - Second point
     */
    static dist(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
    /**
     * @description Calculate the mid-point from the provided points
     * @param {Point[]} arr - Undetermined number of point parameters
     */
    static midPoint(...arr) {
        const points = arr.filter(p => p != null);
        if (points.length == 0)
            return null;
        const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
        return new Point(x, y);
    }
    /**
     * @description Calculate the max on both x and y from the provided points
     * @param {Point[]} arr - Undetermined number of point parameters
     */
    static max(...arr) {
        const points = arr.filter(p => p != null);
        if (points.length == 0)
            return null;
        const x = points.reduce((max, p) => Math.max(max, p.x), -Infinity);
        const y = points.reduce((max, p) => Math.max(max, p.y), -Infinity);
        return new Point(x, y);
    }
    /**
     * @description Calculate the min on both x and y from the provided points
     * @param {Point[]} arr - Undetermined number of point parameters
     */
    static min(...arr) {
        const points = arr.filter(p => p != null);
        if (points.length == 0)
            return null;
        const x = points.reduce((min, p) => Math.min(min, p.x), Infinity);
        const y = points.reduce((min, p) => Math.min(min, p.y), Infinity);
        return new Point(x, y);
    }
    // Instance methods
    /**
     * @readonly
     * @description This point as a plain `{x, y}` object, detached from this instance.
     */
    get object() {
        return { x: this.x, y: this.y };
    }
    equals(x, y = 0) {
        if (typeof x == "number")
            return this.x == x && this.y == y;
        return this.x == x.x && this.y == x.y;
    }
    /**
     * @function boundX
     * @description Clamp this point's x coordinate to a range.
     * @param {number} x1 - The lower bound.
     * @param {number} x2 - The upper bound.
     * @returns {number} The clamped x coordinate. This point is left unchanged.
     */
    boundX(x1, x2) {
        return this.x < x1 ? x1
            : this.x > x2 ? x2
                : this.x;
    }
    /**
     * @function boundY
     * @description Clamp this point's y coordinate to a range.
     * @param {number} y1 - The lower bound.
     * @param {number} y2 - The upper bound.
     * @returns {number} The clamped y coordinate. This point is left unchanged.
     */
    boundY(y1, y2) {
        return this.y < y1 ? y1
            : this.y > y2 ? y2
                : this.y;
    }
    bound(x1, x2, y1 = x1, y2 = x2) {
        return new Point(this.boundX(x1, x2), this.boundY(y1, y2));
    }
    add(x, y) {
        if (typeof x == "number")
            return new Point(this.x + x, this.y + (y || y == 0 ? y : x));
        return new Point(this.x + x.x, this.y + x.y);
    }
    sub(x, y) {
        if (typeof x == "number")
            return new Point(this.x - x, this.y - (y || y == 0 ? y : x));
        return new Point(this.x - x.x, this.y - x.y);
    }
    mul(x, y) {
        if (typeof x == "number")
            return new Point(this.x * x, this.y * (y || y == 0 ? y : x));
        return new Point(this.x * x.x, this.y * x.y);
    }
    div(x, y) {
        if (typeof x == "number")
            return new Point(this.x / x, this.y / (y || y == 0 ? y : x));
        return new Point(this.x / x.x, this.y / x.y);
    }
    mod(x, y) {
        const modDiv = typeof x == "number" ?
            { x: x, y: (y || y == 0 ? y : x) } : { x: x.x, y: x.y };
        const temp = this.object;
        while (temp.x < 0)
            temp.x += modDiv.x;
        while (temp.x >= modDiv.x)
            temp.x -= modDiv.x;
        while (temp.y < 0)
            temp.y += modDiv.y;
        while (temp.y >= modDiv.y)
            temp.y -= modDiv.y;
        return new Point(temp);
    }
    /**
     * @description Calculate the absolute value of the coordinates
     * @returns {Point} A new point with both coordinates made positive. This point is left unchanged.
     */
    get abs() {
        return new Point(Math.abs(this.x), Math.abs(this.y));
    }
    /**
     * @description Get the maximum value between x and y coordinates
     * @returns {number} The larger of the two coordinates.
     */
    get max() {
        return Math.max(this.x, this.y);
    }
    /**
     * @description Get the minimum value between x and y coordinates
     * @returns {number} The smaller of the two coordinates.
     */
    get min() {
        return Math.min(this.x, this.y);
    }
    /**
     * @readonly
     * @description The squared distance from the origin to this point. Cheaper than {@link Point.length}
     * since it skips the square root — use it when comparing magnitudes.
     */
    get length2() {
        return this.x * this.x + this.y * this.y;
    }
    /**
     * @readonly
     * @description The distance from the origin to this point.
     */
    get length() {
        return Math.sqrt(this.length2);
    }
    /**
     * @function dot
     * @description Compute the dot product of this point and another, treating both as vectors.
     * @param {Point} p - The other vector.
     * @returns {number} The dot product. Zero means the two are perpendicular.
     */
    dot(p) {
        return this.x * p.x + this.y * p.y;
    }
    /**
     * @description Create a copy of the current point
     * @returns {Point} A new point with the same coordinates.
     */
    copy() {
        return new Point(this.x, this.y);
    }
    /**
     * @description Get the coordinates as an array
     * @returns {number[]} A two-element array, `[x, y]`.
     */
    arr() {
        return [this.x, this.y];
    }
    /**
     * @function positionOnSegment
     * @description Find how far along a segment this point projects, as a fraction from its start to its
     * end. Useful for snapping a position onto a line.
     * @param {Point} start - The segment's start.
     * @param {Point} end - The segment's end.
     * @returns {number} A value from `0` (at the start) to `1` (at the end), clamped to that range.
     * Returns `0` for a zero-length segment.
     */
    positionOnSegment(start, end) {
        const shiftedEnd = end.sub(start);
        const shiftedLength2 = shiftedEnd.length2;
        if (shiftedLength2 < 1e-9)
            return 0;
        return trim((this.sub(start).dot(shiftedEnd)) / shiftedLength2, 1);
    }
    /**
     * @function linearInterpolation
     * @static
     * @description Interpolate between two points.
     * @param {Point} start - The point at `t = 0`.
     * @param {Point} end - The point at `t = 1`.
     * @param {number} t - The interpolation fraction. Values outside `0`–`1` extrapolate past the ends.
     * @returns {Point} The interpolated point.
     */
    static linearInterpolation(start, end, t) {
        return start.add(end.sub(start).mul(t));
    }
    /**
     * @function toString
     * @description Serialize this point to a JSON string, in the form {@link Point.fromString} reads.
     * @returns {string} The serialized point, e.g. `'{"x":1,"y":2}'`.
     */
    toString() {
        return JSON.stringify({ x: this.x, y: this.y });
    }
    /**
     * @function from
     * @static
     * @description Parse a point from a JSON string produced by {@link Point.toString}.
     * @param {string} value - The string to parse.
     * @returns {Point} The parsed point, or `undefined` if the string is not valid JSON holding numeric
     * `x` and `y` fields.
     */
    static from(value) {
        try {
            const parsed = JSON.parse(value);
            if (typeof parsed.x === "number" && typeof parsed.y === "number")
                return new Point(parsed.x, parsed.y);
        }
        catch { /* fall through to undefined */ }
        return undefined;
    }
    /**
     * @function fromString
     * @description Parse a point from a JSON string produced by {@link Point.toString}. Delegates to
     * {@link Point.from}; it exists as an instance method because {@link GradumInput} discovers a value's
     * parser by looking for `fromString` on the value itself, which a static member would not satisfy.
     * @param {string} value - The string to parse.
     * @returns {Point} The parsed point, or `undefined` if the string is not valid JSON holding numeric
     * `x` and `y` fields.
     */
    fromString(value) {
        return Point.from(value);
    }
}

/**
 * @class GradumMovable
 * @group Components
 * @category Wrappers
 *
 * @extends GradumElement
 * @description Positioning wrapper that places arbitrary content via pure CSS transforms.
 * Set {@link translation} (alias {@link position}) and {@link rotation} to move/rotate the
 * wrapper without touching the content's own fields — useful for previews (feedforwards),
 * ghosts, overlays, or any element that must be positioned independently of how its content
 * renders itself.
 *
 * @example
 * ```ts
 * const movable = GradumMovable.create({content: myElement});
 * movable.translation = new Point(120, 40);
 * movable.rotation = Math.PI / 6;
 * movable.translateBy(new Point(5, 0));
 * ```
 */
let GradumMovable = (() => {
    let _classSuper = GradumElement;
    let _instanceExtraInitializers = [];
    let _translation_decorators;
    let _translation_initializers = [];
    let _translation_extraInitializers = [];
    let _rotation_decorators;
    let _rotation_initializers = [];
    let _rotation_extraInitializers = [];
    let _centerAnchor_decorators;
    let _centerAnchor_initializers = [];
    let _centerAnchor_extraInitializers = [];
    let _set_content_decorators;
    let _updateTransform_decorators;
    return class GradumMovable extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _translation_decorators = [signal];
            _rotation_decorators = [signal];
            _centerAnchor_decorators = [signal];
            _set_content_decorators = [auto()];
            _updateTransform_decorators = [effect];
            __esDecorate(this, null, _set_content_decorators, { kind: "setter", name: "content", static: false, private: false, access: { has: obj => "content" in obj, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateTransform_decorators, { kind: "method", name: "updateTransform", static: false, private: false, access: { has: obj => "updateTransform" in obj, get: obj => obj.updateTransform }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _translation_decorators, { kind: "field", name: "translation", static: false, private: false, access: { has: obj => "translation" in obj, get: obj => obj.translation, set: (obj, value) => { obj.translation = value; } }, metadata: _metadata }, _translation_initializers, _translation_extraInitializers);
            __esDecorate(null, null, _rotation_decorators, { kind: "field", name: "rotation", static: false, private: false, access: { has: obj => "rotation" in obj, get: obj => obj.rotation, set: (obj, value) => { obj.rotation = value; } }, metadata: _metadata }, _rotation_initializers, _rotation_extraInitializers);
            __esDecorate(null, null, _centerAnchor_decorators, { kind: "field", name: "centerAnchor", static: false, private: false, access: { has: obj => "centerAnchor" in obj, get: obj => obj.centerAnchor, set: (obj, value) => { obj.centerAnchor = value; } }, metadata: _metadata }, _centerAnchor_initializers, _centerAnchor_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /** @description The translation applied to the wrapper, in pixels. */
        translation = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _translation_initializers, new Point()));
        /** @description The rotation applied to the wrapper, in radians. */
        rotation = (__runInitializers(this, _translation_extraInitializers), __runInitializers(this, _rotation_initializers, 0));
        /** @description When true, the wrapper is offset by -50% so translation refers to its center. */
        centerAnchor = (__runInitializers(this, _rotation_extraInitializers), __runInitializers(this, _centerAnchor_initializers, false));
        /** @description The content element wrapped by this movable. Assigning it appends it as a child. */
        set content(value) {
            if (value)
                gradum(this).addChild(value);
        }
        setupUILayout() {
            super.setupUILayout();
            gradum(this).setStyles({ display: "inline-block", position: "absolute", left: "0", top: "0" });
        }
        updateTransform() {
            const offset = this.centerAnchor ? " - 50%" : "";
            // Instant so per-pointer-event positioning isn't deferred a frame behind by the
            // rAF-batched style queue.
            gradum(this).setStyle("transform", `translate3d(
            calc(${this.translation.x}px${offset}),
            calc(${this.translation.y}px${offset}),
            0) rotate(${this.rotation}rad)`, true);
        }
        /** @description Add the given delta to the current translation. */
        translateBy(delta) {
            this.translation = this.translation.add(delta);
        }
        /** @description Add the given angle (radians) to the current rotation. */
        rotateBy(angle) {
            this.rotation += angle;
        }
        /**
         * @description Alias of {@link translation}, so code that positions elements through a
         * `position` field (e.g. constrainer solvers) works on the wrapper as-is.
         */
        get position() {
            return this.translation;
        }
        set position(value) {
            if (!value)
                return;
            this.translation = value instanceof Point ? value : new Point(value);
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _centerAnchor_extraInitializers);
        }
    };
})();
define(GradumMovable, "gradum-movable");

const utils$7 = new ElementFunctionsUtils();
/**
 * @internal
 * @function setupElementFunctions
 * @description Install the element functions (`setProperties`, `clone`, `destroy`, `feedforward`, ...) onto the
 * {@link GradumSelector} prototype. Called once by
 * {@link gradumify}; the matching `exclude` option skips it.
 */
function setupElementFunctions() {
    /**
     * @template Tag - The HTML tag of the element.
     * @description Apply the given properties to the element.
     * @param {GradumProperties<Tag>} [properties] - The properties object.
     * @param {boolean} [setOnlyBaseProperties=false] - If set to true, will only set the base gradum properties (classes,
     * text, style, id, children, parent, etc.) and ignore all other properties not explicitly defined in GradumProperties.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.setProperties = function _setProperties(properties = {}, setOnlyBaseProperties = false) {
        if (!this.element)
            return this;
        const props = { ...properties };
        const element = this.element instanceof Element ? this.element :
            this.element["element"] instanceof Element ? this.element["element"] : undefined;
        gradum(props, true).removeFields(["tag", "namespace"]);
        const { out, shadowDOM, initialize, parent, model, data, dataId } = gradum(props, true).extract(["out", "shadowDOM", "initialize", "parent", "model", "data", "dataId"]);
        let mvcUpdated = false;
        if (out) {
            if (typeof out == "string")
                this["__outName"] = out;
            else
                Object.assign(out, this);
        }
        if (!!shadowDOM) {
            if ("shadowDOM" in this.element)
                this["shadowDOM"] = shadowDOM;
            else if (element)
                element.attachShadow({ mode: "open" });
        }
        if (!element || (element && !setOnlyBaseProperties)) {
            if (model) {
                this.model = model;
                if (data && this.model) {
                    this.model.setDataWithoutInitializing(data);
                    //Only assign when an id was actually supplied. Assigning unconditionally writes
                    //`undefined` into the model's id, which on a model whose `id` is a @modelSignal lands
                    //in the data itself and wipes the id that came in with `data`.
                    if (!isUndefined(dataId))
                        this.model.id = dataId;
                }
                mvcUpdated = true;
            }
            const mvc = gradum(props, true).extract(MvcFields);
            for (const [key, value] of Object.entries(mvc)) {
                try {
                    this[key] = value;
                    mvcUpdated = true;
                }
                catch {
                }
            }
        }
        if (element) {
            const elementProps = gradum(props, true).extract(["text", "style",
                "stylesheet", "id", "classes", "listeners", "onClick", "onDrag", "children"]);
            for (const [property, value] of Object.entries(elementProps)) {
                if (value === undefined)
                    continue;
                switch (property) {
                    case "text":
                        if (element instanceof HTMLElement)
                            element.innerText = value;
                        break;
                    case "style":
                        if (!(element instanceof HTMLElement || element instanceof SVGElement))
                            break;
                        gradum(element).setStyles(value, true);
                        break;
                    case "stylesheet":
                        stylesheet(value, gradum(element).closestRoot);
                        break;
                    case "id":
                        element.id = value;
                        break;
                    case "classes":
                        gradum(element).addClass(value);
                        break;
                    case "listeners":
                        Object.entries(value).forEach(([type, callback]) => gradum(element).on(type, callback));
                        break;
                    case "onClick":
                        gradum(element).on(DefaultEventName.click, value);
                        break;
                    case "onDrag":
                        gradum(element).on(DefaultEventName.drag, value);
                        break;
                    case "children":
                        gradum(element).addChild(value);
                        break;
                }
            }
        }
        if (!element || !setOnlyBaseProperties) {
            for (const [property, value] of Object.entries(props)) {
                if (value === undefined)
                    continue;
                try {
                    this.element[property] = value;
                }
                catch {
                    if (element)
                        try {
                            element.setAttribute(property, stringify(value));
                        }
                        catch (e) {
                            console.error(e);
                        }
                }
            }
        }
        if (parent)
            gradum(element).addToParent(parent);
        if (initialize === undefined || initialize) {
            if ("initialize" in this.element && typeof this.element.initialize === "function")
                this.element.initialize();
            else if (mvcUpdated)
                this.initializeMvc();
        }
        return this;
    };
    GradumSelector.prototype.getFields = function _getFields() {
        if (!this.element)
            return {};
        const chain = getPrototypeChain(this.element);
        const seen = new Set();
        const result = {};
        const builtinPrototypes = new Set([
            GradumElement.prototype, GradumBaseElement.prototype, GradumProxiedElement.prototype,
            GradumHeadlessElement.prototype, Element.prototype, HTMLElement.prototype, Node.prototype,
            SVGElement.prototype, MathMLElement.prototype, EventTarget.prototype, Object.prototype
        ]);
        for (const proto of [this.element, ...chain].reverse()) {
            if (builtinPrototypes.has(proto)) {
                for (const key of Object.getOwnPropertyNames(proto))
                    seen.add(key);
                continue;
            }
            for (const key of Object.getOwnPropertyNames(proto)) {
                if (seen.has(key) || key.startsWith("_"))
                    continue;
                const desc = Object.getOwnPropertyDescriptor(proto, key);
                if (!desc || typeof desc.value === "function" || (desc.get && !desc.set))
                    continue;
                seen.add(key);
                result[key] = this.element[key];
            }
        }
        return result;
    };
    GradumSelector.prototype.clone = function _clone(options = {}) {
        const originElement = this.element instanceof Node ? this.element : undefined;
        if (!originElement)
            return;
        const exclude = new Set(options.exclude ?? []);
        const force = new Set(options.forceInclude ?? []);
        const deepClone = new Set(options.deepClone ?? []);
        const copyReference = new Set(options.copyReference ?? []);
        const shouldCopy = (key, value, prototype) => {
            if (force.has(key))
                return true;
            if (exclude.has(key) || key === "mvc" || key === "__proto__" || key === "prototype")
                return false;
            if (typeof value === "function" || value instanceof Delegate)
                return false;
            if (key === "model" || key === "view" || key === "emitter" || key === "operators"
                || key === "handlers" || key === "interactors" || key === "tools" || key === "constrainers")
                return false;
            const desc = Object.getOwnPropertyDescriptor(prototype, key);
            if (!desc)
                return false;
            if (desc.get && !desc.set)
                return false;
            if (desc.writable === false)
                return false;
            return true;
        };
        const copyField = (key, value) => {
            if (value === null || value === undefined || typeof value !== "object")
                return value;
            if (copyReference.has(key))
                return value;
            if (value instanceof Node) {
                if (deepClone.has(key) || options.deepCloneNodes) {
                    try {
                        return gradum(value).clone(options);
                    }
                    catch {
                        return undefined;
                    }
                }
                return options.copyNodes ? value : undefined;
            }
            if (options.deepCloneObjects || deepClone.has(key)) {
                try {
                    return structuredClone(value);
                }
                catch { /* fall through to reference */ }
            }
            return value;
        };
        const constructor = originElement.constructor;
        const prototypeChain = getPrototypeChain(originElement);
        const properties = {};
        if (originElement["model"] && originElement["data"] != null) {
            const rawData = originElement["data"];
            let clonedData = rawData;
            if (options.snapshotData || options.deepCloneObjects) {
                // Y.js types: deep-copy into a fresh detached Y.Doc. The clone's model machinery
                // (observers, nested models, views) then works unchanged on real Y types, and
                // nothing syncs since the doc has no provider. A plain-object (toJSON) snapshot
                // renders degraded previews — observers never populate from plain data.
                if (options.snapshotData && rawData instanceof AbstractType
                    && typeof rawData.clone === "function") {
                    try {
                        const yClone = rawData.clone();
                        // Y types must be inside a document before they can be read.
                        new Doc().getMap("__gradum_snapshot__").set("data", yClone);
                        clonedData = yClone;
                    }
                    catch { }
                }
                // Fallbacks: toJSON (plain detached object), then structuredClone. Only under
                // snapshotData — deepCloneObjects keeps its documented fallback to reference
                // sharing for non-structured-cloneable data.
                if (clonedData === rawData && options.snapshotData && typeof rawData.toJSON === "function")
                    try {
                        clonedData = rawData.toJSON();
                    }
                    catch { }
                if (clonedData === rawData)
                    try {
                        clonedData = structuredClone(rawData);
                    }
                    catch { }
            }
            properties.data = clonedData;
        }
        try {
            Object.assign(properties, gradum(originElement).getMvcDifference());
        }
        catch { }
        let clone;
        if (typeof constructor.create === "function") {
            try {
                clone = constructor.create(properties);
            }
            catch { }
        }
        if (!clone) {
            if (originElement instanceof Element) {
                clone = gradum(document.createElement(originElement.tagName)).setProperties(properties).element;
            }
            else {
                try {
                    clone = originElement.cloneNode(false);
                }
                catch { }
            }
        }
        if (!clone)
            return;
        if (originElement instanceof Element && clone instanceof Element) {
            for (const attr of Array.from(originElement.attributes)) {
                if (exclude.has(attr.name))
                    continue;
                try {
                    clone.setAttribute(attr.name, attr.value);
                }
                catch { }
            }
        }
        const keys = new Map();
        const addKeys = (prototype) => {
            for (const property of Object.getOwnPropertyNames(prototype))
                if (!keys.has(property))
                    keys.set(property, prototype);
            for (const property of Object.getOwnPropertySymbols(prototype))
                if (!keys.has(property))
                    keys.set(property, prototype);
        };
        const mathMLProto = typeof MathMLElement !== "undefined" ? MathMLElement.prototype : null;
        addKeys(originElement);
        for (const prototype of prototypeChain) {
            if (equalToAny(prototype, GradumElement.prototype, GradumBaseElement.prototype, GradumProxiedElement.prototype, GradumHeadlessElement.prototype, Element.prototype, Node.prototype, HTMLElement.prototype, SVGElement.prototype, mathMLProto, EventTarget.prototype, Object.prototype))
                break;
            addKeys(prototype);
        }
        for (const [key, prototype] of keys.entries()) {
            const value = originElement[key];
            if (!shouldCopy(key, value, prototype))
                continue;
            const newValue = copyField(key, value);
            if (newValue !== undefined)
                try {
                    clone[key] = newValue;
                }
                catch { }
        }
        return clone;
    };
    /**
     * @description Destroys the node by removing it from the document and removing all its bound listeners.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.destroy = function _destroy() {
        this.removeAllListeners();
        this.remove();
        if (this.element && "destroy" in this.element && typeof this.element.destroy === "function")
            this.element.destroy();
        return this;
    };
    /**
     * @description Sets the value of an attribute on the underlying element.
     * @param {string} name The name of the attribute.
     * @param {string | number | boolean} [value] The value of the attribute. Can be left blank to represent a
     * true boolean.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.setAttribute = function _setAttribute(name, value) {
        if (this.element instanceof Element)
            this.element.setAttribute(name, value?.toString() || "true");
        return this;
    };
    /**
     * @description Removes an attribute from the underlying element.
     * @param {string} name The name of the attribute to remove.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.removeAttribute = function _removeAttribute(name) {
        if (this.element instanceof Element)
            this.element.removeAttribute(name);
        return this;
    };
    /**
     * @description Causes the element to lose focus.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.blur = function _blur() {
        if (this.element instanceof HTMLElement)
            this.element.blur();
        return this;
    };
    /**
     * @description Sets focus on the element.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.focus = function _focus() {
        if (this.element instanceof HTMLElement)
            this.element.focus();
        return this;
    };
    const FEEDFORWARD_STYLE_ID = "gradum-feedforward-styles";
    const wrapFeedforwardClone = (clone) => {
        // Stylesheet !important beats the inline styles the clone's view keeps writing
        // (its snapshot model still renders the original position). Injected once.
        // position: static keeps absolutely-positioned clones (cards, nodes) in the wrapper's
        // flow — otherwise they collapse the wrapper to 0x0 and break centerAnchor centering.
        if (!document.getElementById(FEEDFORWARD_STYLE_ID)) {
            const sheet = document.createElement("style");
            sheet.id = FEEDFORWARD_STYLE_ID;
            sheet.textContent = ".gradum-feedforward-wrapper > .gradum-feedforward-clone " +
                "{transform: none !important; position: static !important;}";
            document.head.appendChild(sheet);
        }
        if (clone instanceof Element)
            clone.classList.add("gradum-feedforward-clone");
        const wrapper = GradumMovable.create({ content: clone instanceof Element ? clone : undefined });
        wrapper.classList.add("gradum-feedforward-wrapper");
        Object.defineProperty(wrapper, "feedforwardClone", { value: clone, configurable: true });
        return wrapper;
    };
    GradumSelector.prototype.feedforward = function _feedforward(properties = {}) {
        if (properties.removeOnPointerRelease === undefined)
            properties.removeOnPointerRelease = true;
        if (!this.element)
            return;
        const type = properties?.type ?? "___DEFAULT___";
        const feedforwardElements = utils$7.data(this.element).feedforwardElements;
        if (!feedforwardElements)
            return;
        let saved = feedforwardElements.get(type);
        if (!saved) {
            // Feedforwards are visual previews — snapshot the data so MVC/synced elements
            // don't produce a live twin writing through the shared (e.g. Y.js) model.
            const cloneOptions = { snapshotData: true, ...properties?.cloneOptions };
            if (typeof this.element["clone"] === "function")
                saved = this.element["clone"](cloneOptions);
            else
                saved = this.clone(cloneOptions);
            // Positioning wrapper: callers move/rotate the preview through pure CSS
            // transforms on the wrapper, never through the clone's semantic fields.
            if (properties.wrap && saved)
                saved = wrapFeedforwardClone(saved);
            // Register cleanup once per clone, not once per feedforward() call.
            if (properties.removeOnPointerRelease && saved) {
                const savedClone = saved;
                gradum(document.body).on(DefaultEventName.clickEnd, () => {
                    if (typeof savedClone["remove"] === "function")
                        savedClone["remove"]();
                    if (feedforwardElements.get(type) === savedClone)
                        feedforwardElements.delete(type);
                }, { capture: true, once: true });
            }
        }
        // feedforward() is called in hot paths (per pointer event). Re-applying an unchanged
        // parent re-appends the whole subtree each call — custom-element disconnect/reconnect
        // churn and forced reflows. Strip parent when the element is already inside it.
        const stripUnchangedParent = (props) => {
            if (!props?.parent || !(saved instanceof Node))
                return props;
            const parentNode = props.parent instanceof GradumSelector ? props.parent.element : props.parent;
            if (saved.parentNode === parentNode)
                return { ...props, parent: undefined };
            return props;
        };
        gradum(saved).setProperties(stripUnchangedParent(this.defaultFeedforwardProperties ?? {}))
            .setProperties(stripUnchangedParent({
            ...properties,
            cloneOptions: undefined,
            type: undefined,
            removeOnPointerRelease: undefined,
            wrap: undefined
        }));
        feedforwardElements.set(type, saved);
        return saved;
    };
    Object.defineProperty(GradumSelector.prototype, "defaultFeedforwardProperties", {
        get: function () {
            if ("defaultFeedforwardProperties" in this.element)
                return this.element.defaultFeedforwardProperties;
            return utils$7.data(this.element).defaultFeedforwardProperties;
        },
        set: function (value) {
            if ("defaultFeedforwardProperties" in this.element)
                this.element.defaultFeedforwardProperties = value;
            utils$7.data(this.element).defaultFeedforwardProperties = value;
        },
        configurable: true,
        enumerable: true
    });
}

/**
 * @enum {Propagation}
 * @group GradumSelector
 * @category Events
 *
 * @description Enum dictating the propagation of an event.
 * @property {Propagation.propagate} propagate - Continue normal propagation.
 * @property {Propagation.stopPropagation} stopPropagation - Stop propagation to parent targets.
 * @property {Propagation.stopImmediatePropagation} stopImmediatePropagation - Stop propagation and prevent any
 * additional listeners on the same target from executing.
 */
var Propagation;
(function (Propagation) {
    Propagation["propagate"] = "propagate";
    Propagation["stopPropagation"] = "stopPropagation";
    Propagation["stopImmediatePropagation"] = "stopImmediatePropagation";
})(Propagation || (Propagation = {}));
/**
 * @group GradumSelector
 * @category Events
 * @description Default set of basic input event types typically handled by {@link GradumSelector.preventDefault}.
 */
const BasicInputEvents = [
    "mousedown", "mouseup", "mousemove", "click", "dblclick", "contextmenu",
    "dragstart", "selectstart",
    "touchstart", "touchmove", "touchend", "touchcancel",
    "pointerdown", "pointermove", "pointerup",
    "wheel"
];
/**
 * @group GradumSelector
 * @category Events
 * @description Event types that should usually be registered as **non-passive** when you intend to call
 *  * `preventDefault()` (e.g., scroll/touch/pointer interactions).
 */
const NonPassiveEvents = [
    "wheel", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointercancel"
];

/**
 * @enum {ActionMode}
 * @group Event Handling
 * @category Event Modes
 *
 * @description What the manager has decided the current interaction is. A press starts as `click` and
 * becomes `longPress` or `drag` once it outlasts `longPressDuration` or travels past `moveThreshold`.
 * @property {ActionMode.none} none - No interaction in progress.
 * @property {ActionMode.click} click - A press that has neither moved far nor been held long.
 * @property {ActionMode.longPress} longPress - A press held in place past the long-press duration.
 * @property {ActionMode.drag} drag - A press that has moved past the move threshold.
 */
var ActionMode;
(function (ActionMode) {
    ActionMode[ActionMode["none"] = 0] = "none";
    ActionMode[ActionMode["click"] = 1] = "click";
    ActionMode[ActionMode["longPress"] = 2] = "longPress";
    ActionMode[ActionMode["drag"] = 3] = "drag";
})(ActionMode || (ActionMode = {}));
/**
 * @enum {ClickMode}
 * @group Event Handling
 * @category Event Modes
 *
 * @description Which pointer button or input mode an interaction belongs to. The manager holds one
 * current tool per mode, so a different tool can be bound to each button.
 * @property {ClickMode.none} none - No button held.
 * @property {ClickMode.left} left - Primary button.
 * @property {ClickMode.right} right - Secondary button.
 * @property {ClickMode.middle} middle - Middle button.
 * @property {ClickMode.other} other - Any further button.
 * @property {ClickMode.key} key - Interaction driven by a mapped keyboard key rather than a button.
 */
var ClickMode;
(function (ClickMode) {
    ClickMode[ClickMode["none"] = 0] = "none";
    ClickMode[ClickMode["left"] = 1] = "left";
    ClickMode[ClickMode["right"] = 2] = "right";
    ClickMode[ClickMode["middle"] = 3] = "middle";
    ClickMode[ClickMode["other"] = 4] = "other";
    ClickMode[ClickMode["key"] = 5] = "key";
})(ClickMode || (ClickMode = {}));
/**
 * @enum {InputDevice}
 * @group Event Handling
 * @category Event Modes
 *
 * @description The device the manager believes is driving input. *Note: this is inferred from event
 * shape and is not fully reliable, particularly between `mouse` and `trackpad`.*
 * @property {InputDevice.unknown} unknown - Not yet identified.
 * @property {InputDevice.mouse} mouse - A mouse.
 * @property {InputDevice.trackpad} trackpad - A trackpad.
 * @property {InputDevice.touch} touch - A touchscreen.
 */
var InputDevice;
(function (InputDevice) {
    InputDevice[InputDevice["unknown"] = 0] = "unknown";
    InputDevice[InputDevice["mouse"] = 1] = "mouse";
    InputDevice[InputDevice["trackpad"] = 2] = "trackpad";
    InputDevice[InputDevice["touch"] = 3] = "touch";
})(InputDevice || (InputDevice = {}));

/**
 * @internal
 */
function inferKey(name, type, context) {
    return name ?? (String(context.name).endsWith(type)
        ? String(context.name).slice(0, -type.length)
        : String(context.name));
}
/**
 * @internal
 */
function generateField(context, type, name) {
    const cacheKey = Symbol(`__${type.toLowerCase()}_${String(context.name)}`);
    const keyName = inferKey(name, type, context);
    context.addInitializer(function () {
        Object.defineProperty(this, context.name, {
            configurable: true,
            enumerable: false,
            get: function () {
                if (this[cacheKey])
                    return this[cacheKey];
                let value;
                let functionName;
                switch (type) {
                    case "Operator":
                        functionName = "getOperator";
                        break;
                    case "Handler":
                        functionName = "getHandler";
                        break;
                    case "Interactor":
                        functionName = "getInteractor";
                        break;
                    case "Tool":
                        functionName = "getTool";
                        break;
                    case "Constrainer":
                        functionName = "getConstrainer";
                        break;
                }
                if (!functionName)
                    return;
                value = gradum(this)[functionName]?.(keyName);
                if (!value)
                    throw new Error(`${type} "${keyName}" not found on ${this?.constructor?.name}.`);
                this[cacheKey] = value;
                return value;
            },
            set: function (value) { this[cacheKey] = value; }
        });
    });
}
/**
 * @decorator
 * @function operator
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched operator.
 * @param {string} [name] - The key name of the operator in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingOperator`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @operator() protected textOperator: GradumOperator;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textOperator(): GradumOperator {
 *    if (this.mvc instanceof Mvc) return this.mvc.getOperator("text");
 *    if (typeof this.getOperator === "function") return this.getOperator("text");
 * }
 * ```
 */
function operator(name) {
    return function (_unused, context) {
        generateField(context, "Operator", name);
    };
}
/**
 * @decorator
 * @function handler
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched handler.
 * @param {string} [name] - The key name of the handler in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingHandler`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @handler() protected textHandler: GradumHandler;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textHandler(): GradumHandler {
 *    if (this.mvc instanceof Mvc) return this.mvc.getHandler("text");
 *    if (typeof this.getHandler === "function") return this.getHandler("text");
 * }
 * ```
 */
function handler(name) {
    return function (_unused, context) {
        generateField(context, "Handler", name);
    };
}
/**
 * @decorator
 * @function interactor
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched interactor.
 * @param {string} [name] - The key name of the interactor in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingInteractor`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @interactor() protected textInteractor: GradumInteractor;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textInteractor(): GradumInteractor {
 *    if (this.mvc instanceof Mvc) return this.mvc.getInteractor("text");
 *    if (typeof this.getInteractor === "function") return this.getInteractor("text");
 * }
 * ```
 */
function interactor(name) {
    return function (_unused, context) {
        generateField(context, "Interactor", name);
    };
}
/**
 * @decorator
 * @function tool
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched tool.
 * @param {string} [name] - The key name of the tool in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingTool`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @tool() protected textTool: GradumTool;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textTool(): GradumTool {
 *    if (this.mvc instanceof Mvc) return this.mvc.getTool("text");
 *    if (typeof this.getTool === "function") return this.getTool("text");
 * }
 * ```
 */
function tool(name) {
    return function (_unused, context) {
        generateField(context, "Tool", name);
    };
}
/**
 * @decorator
 * @function constrainer
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 field decorator for MVC structure. It reduces code by turning the decorated field into a
 * fetched constrainer.
 * @param {string} [name] - The key name of the constrainer in the MVC instance (if any). By default, it is inferred
 * from the name of the field. If the field is named `somethingConstrainer`, the key name will be `something`.
 *
 * @example
 * ```ts
 * @tool() protected textConstrainer: GradumConstrainer;
 * ```
 * Is equivalent to:
 * ```ts
 * protected get textConstrainer(): GradumConstrainer {
 *    if (this.mvc instanceof Mvc) return this.mvc.getConstrainer("text");
 *    if (typeof this.getConstrainer === "function") return this.getConstrainer("text");
 * }
 * ```
 */
function constrainer(name) {
    return function (_unused, context) {
        generateField(context, "Constrainer", name);
    };
}

/**
 * @class GradumMap
 * @group Components
 * @category Data Structures
 *
 * @extends Map
 * @template KeyType - The type of the keys.
 * @template ValueType - The type of the stored values.
 * @description A [Map](https://developer.mozilla.org/en-US/docs/Web/API/Map) that hands out copies
 * instead of references, so callers cannot mutate stored values by accident. It also adds array
 * accessors and the usual `map`/`filter`/`merge` helpers, which return new maps rather than mutating
 * this one. Set {@link enforceImmutability} to `false` to get plain reference semantics back.
 */
class GradumMap extends Map {
    /**
     * @description Whether values are copied on the way in and out. While `true` (the default), stored
     * objects are cloned, so mutating a value you read back does not affect the map. Set it to `false`
     * to store and return the original references.
     */
    enforceImmutability = true;
    /**
     * @description Store a value at the given key. The value is copied first unless
     * {@link enforceImmutability} is `false`.
     * @param {KeyType} key - The key to store under.
     * @param {ValueType} value - The value to store.
     * @returns {this} Itself, allowing for method chaining.
     */
    set(key, value) {
        return super.set(key, this.enforceImmutability ? this.copy(value) : value);
    }
    /**
     * @description Read the value at the given key.
     * @param {KeyType} key - The key to read.
     * @returns {ValueType} A copy of the stored value, or the value itself when
     * {@link enforceImmutability} is `false`. `undefined` if the key is not set.
     */
    get(key) {
        const result = super.get(key);
        return this.enforceImmutability ? this.copy(result) : result;
    }
    /**
     * @description The first value in insertion order, or `null` when the map is empty. Copied unless
     * {@link enforceImmutability} is `false`.
     * @readonly
     */
    get first() {
        if (this.size == 0)
            return null;
        const result = this.values().next().value;
        return this.enforceImmutability ? this.copy(result) : result;
    }
    /**
     * @description The last value in insertion order, or `null` when the map is empty. Copied unless
     * {@link enforceImmutability} is `false`.
     * @readonly
     */
    get last() {
        if (this.size == 0)
            return null;
        const result = this.valuesArray()[this.size - 1];
        return this.enforceImmutability ? this.copy(result) : result;
    }
    /**
     * @description All keys as an array, in insertion order.
     * @returns {KeyType[]} A new array of the map's keys.
     */
    keysArray() {
        return Array.from(this.keys());
    }
    /**
     * @description All values as an array, in insertion order.
     * @returns {ValueType[]} A new array of the map's values. The values themselves are not copied.
     */
    valuesArray() {
        return Array.from(this.values());
    }
    copy(value) {
        if (value && typeof value == "object") {
            if (value instanceof Array)
                return value.map(item => this.copy(item));
            if (value.constructor && value.constructor != Object) {
                if (typeof value.clone == "function")
                    return value.clone();
                if (typeof value.copy == "function")
                    return value.copy();
            }
            return { ...value };
        }
        return value;
    }
    /**
     * @template C - The type of the new keys.
     * @description Derive a new map with the same values under recomputed keys.
     * @param {(key: KeyType, value: ValueType) => C} callback - Returns the new key for each entry.
     * @returns {GradumMap<C, ValueType>} A new map. This map is left unchanged. Entries whose callback
     * returns the same key collapse into one.
     */
    mapKeys(callback) {
        const newMap = new GradumMap();
        for (let [key, value] of this) {
            newMap.set(callback(key, value), value);
        }
        return newMap;
    }
    /**
     * @template C - The type of the new values.
     * @description Derive a new map with the same keys and recomputed values.
     * @param {(key: KeyType, value: ValueType) => C} callback - Returns the new value for each entry.
     * @returns {GradumMap<KeyType, C>} A new map. This map is left unchanged.
     */
    mapValues(callback) {
        const newMap = new GradumMap();
        for (let [key, value] of this) {
            newMap.set(key, callback(key, value));
        }
        return newMap;
    }
    /**
     * @description Select the entries matching a predicate.
     * @param {(key: KeyType, value: ValueType) => boolean} callback - Returns `true` to keep an entry.
     * @returns {GradumMap<KeyType, ValueType>} A new map holding the kept entries. This map is left unchanged.
     */
    filter(callback) {
        const newMap = new GradumMap();
        for (let [key, value] of this) {
            if (callback(key, value))
                newMap.set(key, value);
        }
        return newMap;
    }
    /**
     * @description Copy every entry of another map into this one, overwriting on key collisions.
     * Unlike {@link mapKeys}, {@link mapValues}, and {@link filter}, this mutates the map it is called on.
     * @param {Map<KeyType, ValueType>} map - The map to read entries from. It is left unchanged.
     * @returns {this} Itself, allowing for method chaining.
     */
    merge(map) {
        for (let [key, value] of map) {
            this.set(key, value);
        }
        return this;
    }
}

/**
 * @internal
 * @class GradumEventManagerModel
 * @extends GradumModel
 * @description Holds a {@link GradumEventManager}'s live input state: which pointers are down and where
 * they started, the current click mode and action mode, the keys held, the registered tools and their
 * key bindings, and the thresholds separating a click from a drag or a long press. The manager's
 * operators read and update this as raw input arrives.
 */
let GradumEventManagerModel = (() => {
    let _classSuper = GradumModel;
    let _instanceExtraInitializers = [];
    let _utils_decorators;
    let _utils_initializers = [];
    let _utils_extraInitializers = [];
    let _currentAction_decorators;
    let _currentAction_initializers = [];
    let _currentAction_extraInitializers = [];
    let _currentClick_decorators;
    let _currentClick_initializers = [];
    let _currentClick_extraInitializers = [];
    let _wasRecentlyTrackpad_decorators;
    let _wasRecentlyTrackpad_initializers = [];
    let _wasRecentlyTrackpad_extraInitializers = [];
    let _moveThreshold_decorators;
    let _moveThreshold_initializers = [];
    let _moveThreshold_extraInitializers = [];
    let _longPressDuration_decorators;
    let _longPressDuration_initializers = [];
    let _longPressDuration_extraInitializers = [];
    let _authorizeEventScaling_decorators;
    let _authorizeEventScaling_initializers = [];
    let _authorizeEventScaling_extraInitializers = [];
    let _scaleEventPosition_decorators;
    let _scaleEventPosition_initializers = [];
    let _scaleEventPosition_extraInitializers = [];
    let _set_inputDevice_decorators;
    return class GradumEventManagerModel extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _utils_decorators = [handler()];
            _currentAction_decorators = [signal];
            _currentClick_decorators = [signal];
            _wasRecentlyTrackpad_decorators = [signal];
            _moveThreshold_decorators = [signal];
            _longPressDuration_decorators = [signal];
            _authorizeEventScaling_decorators = [signal];
            _scaleEventPosition_decorators = [signal];
            _set_inputDevice_decorators = [auto({
                    callBefore: function (value) {
                        if (value == InputDevice.trackpad)
                            this.wasRecentlyTrackpad = true;
                    }
                })];
            __esDecorate(this, null, _set_inputDevice_decorators, { kind: "setter", name: "inputDevice", static: false, private: false, access: { has: obj => "inputDevice" in obj, set: (obj, value) => { obj.inputDevice = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _utils_decorators, { kind: "field", name: "utils", static: false, private: false, access: { has: obj => "utils" in obj, get: obj => obj.utils, set: (obj, value) => { obj.utils = value; } }, metadata: _metadata }, _utils_initializers, _utils_extraInitializers);
            __esDecorate(null, null, _currentAction_decorators, { kind: "field", name: "currentAction", static: false, private: false, access: { has: obj => "currentAction" in obj, get: obj => obj.currentAction, set: (obj, value) => { obj.currentAction = value; } }, metadata: _metadata }, _currentAction_initializers, _currentAction_extraInitializers);
            __esDecorate(null, null, _currentClick_decorators, { kind: "field", name: "currentClick", static: false, private: false, access: { has: obj => "currentClick" in obj, get: obj => obj.currentClick, set: (obj, value) => { obj.currentClick = value; } }, metadata: _metadata }, _currentClick_initializers, _currentClick_extraInitializers);
            __esDecorate(null, null, _wasRecentlyTrackpad_decorators, { kind: "field", name: "wasRecentlyTrackpad", static: false, private: false, access: { has: obj => "wasRecentlyTrackpad" in obj, get: obj => obj.wasRecentlyTrackpad, set: (obj, value) => { obj.wasRecentlyTrackpad = value; } }, metadata: _metadata }, _wasRecentlyTrackpad_initializers, _wasRecentlyTrackpad_extraInitializers);
            __esDecorate(null, null, _moveThreshold_decorators, { kind: "field", name: "moveThreshold", static: false, private: false, access: { has: obj => "moveThreshold" in obj, get: obj => obj.moveThreshold, set: (obj, value) => { obj.moveThreshold = value; } }, metadata: _metadata }, _moveThreshold_initializers, _moveThreshold_extraInitializers);
            __esDecorate(null, null, _longPressDuration_decorators, { kind: "field", name: "longPressDuration", static: false, private: false, access: { has: obj => "longPressDuration" in obj, get: obj => obj.longPressDuration, set: (obj, value) => { obj.longPressDuration = value; } }, metadata: _metadata }, _longPressDuration_initializers, _longPressDuration_extraInitializers);
            __esDecorate(null, null, _authorizeEventScaling_decorators, { kind: "field", name: "authorizeEventScaling", static: false, private: false, access: { has: obj => "authorizeEventScaling" in obj, get: obj => obj.authorizeEventScaling, set: (obj, value) => { obj.authorizeEventScaling = value; } }, metadata: _metadata }, _authorizeEventScaling_initializers, _authorizeEventScaling_extraInitializers);
            __esDecorate(null, null, _scaleEventPosition_decorators, { kind: "field", name: "scaleEventPosition", static: false, private: false, access: { has: obj => "scaleEventPosition" in obj, get: obj => obj.scaleEventPosition, set: (obj, value) => { obj.scaleEventPosition = value; } }, metadata: _metadata }, _scaleEventPosition_initializers, _scaleEventPosition_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        utils = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _utils_initializers, void 0));
        state = (__runInitializers(this, _utils_extraInitializers), GradumModel.from({
            enabled: true,
            preventDefaultMouse: false,
            preventDefaultTouch: false,
            preventDefaultWheel: false
        }));
        lockState = GradumModel.from();
        //Delegate fired when the input device changes
        onInputDeviceChange = new Delegate();
        /**
         * @description Delegate fired when the tool bound to a click mode changes, receiving the old tool, the
         * new tool, and the mode it changed on.
         */
        onToolChange = new Delegate();
        //Input events states
        currentKeys = GradumModel.from([]);
        currentAction = __runInitializers(this, _currentAction_initializers, ActionMode.none);
        currentClick = (__runInitializers(this, _currentAction_extraInitializers), __runInitializers(this, _currentClick_initializers, ClickMode.none));
        wasRecentlyTrackpad = (__runInitializers(this, _currentClick_extraInitializers), __runInitializers(this, _wasRecentlyTrackpad_initializers, false));
        //Threshold differentiating a click from a drag
        moveThreshold = (__runInitializers(this, _wasRecentlyTrackpad_extraInitializers), __runInitializers(this, _moveThreshold_initializers, 10));
        //Duration to reach long press
        longPressDuration = (__runInitializers(this, _moveThreshold_extraInitializers), __runInitializers(this, _longPressDuration_initializers, 500));
        authorizeEventScaling = (__runInitializers(this, _longPressDuration_extraInitializers), __runInitializers(this, _authorizeEventScaling_initializers, void 0));
        scaleEventPosition = (__runInitializers(this, _authorizeEventScaling_extraInitializers), __runInitializers(this, _scaleEventPosition_initializers, void 0));
        activePointers = (__runInitializers(this, _scaleEventPosition_extraInitializers), new Set());
        //Saved values (Maps to account for different touch points and their IDs)
        origins = new GradumMap();
        previousPositions = new GradumMap();
        positions;
        lastTargetOrigin;
        //Single timer instance --> easily cancel it and set it again
        timerMap = new GradumMap();
        //All created tools
        tools = new Map();
        //Tools mapped to keys
        mappedKeysToTool = new Map();
        //Tools currently held by the user (one - or none - per each click button/mode)
        currentTools = new Map();
        set inputDevice(value) {
            this.onInputDeviceChange.fire(value);
        }
    };
})();

/**
 * @enum {ClosestOrigin}
 * @group Event Handling
 * @category Event Modes
 *
 * @description Where {@link GradumEvent.closest} starts searching from when looking for a matching
 * ancestor.
 * @property {ClosestOrigin.target} target - Start from the event's target and walk up its ancestors.
 * @property {ClosestOrigin.position} position - Start from the elements under the event position, which
 * also reaches elements the target overlaps but does not descend from.
 */
var ClosestOrigin;
(function (ClosestOrigin) {
    ClosestOrigin["target"] = "target";
    ClosestOrigin["position"] = "position";
})(ClosestOrigin || (ClosestOrigin = {}));

/**
 * @class GradumEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends Event
 * @description The base class for every event the {@link GradumEventManager} fires. On top of a native
 * [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) it carries the pointer position, the
 * click mode, the input device, the keys held at the time, and the tool the event is attributed to. It
 * also knows how to map screen coordinates into document space, so handlers running under a panned or
 * zoomed canvas can read {@link GradumEvent.scaledPosition} instead of doing the maths themselves.
 */
let GradumEvent = (() => {
    let _classSuper = Event;
    let _instanceExtraInitializers = [];
    let _closest_decorators;
    let _get_scaledPosition_decorators;
    return class GradumEvent extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _closest_decorators = [cache()];
            _get_scaledPosition_decorators = [cache()];
            __esDecorate(this, null, _closest_decorators, { kind: "method", name: "closest", static: false, private: false, access: { has: obj => "closest" in obj, get: obj => obj.closest }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_scaledPosition_decorators, { kind: "getter", name: "scaledPosition", static: false, private: false, access: { has: obj => "scaledPosition" in obj, get: obj => obj.scaledPosition }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @description The event manager that fired this event.
         */
        eventManager = __runInitializers(this, _instanceExtraInitializers);
        /**
         * @description The name of the tool this event is attributed to, or `undefined` when no tool was
         * current. Resolve it to the tool itself with {@link GradumEvent.tool}.
         */
        toolName;
        /**
         * @description The name this event was dispatched under, such as `gradum-click`.
         */
        eventName;
        /**
         * @description The pointer button or input mode this event belongs to.
         */
        clickMode;
        /**
         * @description The device that produced this event.
         */
        inputDevice;
        /**
         * @description The keys held down when the event fired.
         */
        keys;
        /**
         * @description The screen position the event was fired from.
         */
        position;
        /**
         * @description Whether {@link GradumEvent.scaledPosition} and its per-pointer equivalents actually
         * scale, or hand back the raw position. Assign a callback to decide per read — useful when a canvas
         * is only sometimes transformed. Defaults to `true`.
         */
        authorizeScaling;
        /**
         * @description How a screen position is mapped into document space. Assign it to make events aware of
         * a panned or zoomed canvas. Defaults to returning the position unchanged.
         */
        scalePosition;
        /**
         * @constructor
         * @description Create a Gradum event. Anything left out of `properties` falls back to the current
         * state of {@link GradumEventManager.instance}.
         * @param {GradumEventProperties} properties - The event's name, position, and input context.
         */
        constructor(properties) {
            super(properties.eventName, { bubbles: true, cancelable: true, ...properties.eventInitDict });
            this.eventManager = properties.eventManager ?? GradumEventManager.instance;
            this.authorizeScaling = properties.authorizeScaling ?? true;
            this.scalePosition = properties.scalePosition ?? ((position) => position);
            this.clickMode = properties.clickMode ?? GradumEventManager.instance.currentClick;
            this.inputDevice = properties.inputDevice ?? InputDevice.unknown;
            this.keys = properties.keys ?? GradumEventManager.instance.currentKeys;
            this.eventName = properties.eventName;
            this.position = properties.position;
            this.toolName = properties.toolName;
        }
        /**
         * @readonly
         * @description The tool associated with this event, or `null` if the event carries no tool name.
         */
        get tool() {
            if (!this.toolName || !(this.eventManager instanceof GradumEventManager))
                return null;
            return this.eventManager.getToolByName(this.toolName);
        }
        closest(type, strict = true, from = ClosestOrigin.target) {
            const elements = from === ClosestOrigin.target ? [this.target]
                : document.elementsFromPoint(this.position.x, this.position.y);
            const strictElement = strict instanceof Element ? strict : null;
            const isStrict = strict === true || strictElement !== null;
            const ctor = typeof type === "string" ? customElements.get(type) : type;
            for (let element of elements) {
                if (!ctor) {
                    // No registered custom element for the string — CSS selector fallback.
                    const match = element.closest(type);
                    if (match && (!isStrict || this.isPositionInsideElement(this.position, strictElement ?? match)))
                        return match;
                    continue;
                }
                while (element && !((element instanceof ctor)
                    && (!isStrict || this.isPositionInsideElement(this.position, strictElement ?? element))))
                    element = element.parentElement;
                if (element)
                    return element;
            }
            return null;
        }
        /**
         * @private
         * @function isPositionInsideElement
         * @description Check whether a position falls within an element's bounding box.
         * @param {Point} position - The position to test.
         * @param {Element} element - The element whose bounds are tested against.
         * @returns {boolean} Whether the position is inside the element.
         */
        isPositionInsideElement(position, element) {
            const rect = element.getBoundingClientRect();
            return position.x >= rect.left && position.x <= rect.right
                && position.y >= rect.top && position.y <= rect.bottom;
        }
        /**
         * @readonly
         * @description The element the event was fired on, or the document when there is no element target.
         */
        get target() {
            return super.target || document;
        }
        /**
         * @readonly
         * @description The event position in document space, obtained by running {@link GradumEvent.position}
         * through `scalePosition`. Falls back to the raw position when scaling is not authorized.
         */
        get scaledPosition() {
            if (!this.scalingAuthorized)
                return this.position;
            return this.scalePosition(this.position);
        }
        /**
         * @readonly
         * @description Whether scaled positions are computed for this event. Resolves `authorizeScaling`,
         * calling it first if it is a callback.
         */
        get scalingAuthorized() {
            return typeof this.authorizeScaling == "function" ? this.authorizeScaling() : this.authorizeScaling;
        }
        /**
         * @protected
         * @function scalePositionsMap
         * @description Map every point in a per-pointer map into document space. Used by
         * {@link GradumDragEvent} to expose scaled variants of its position maps.
         * @param {GradumMap<number, Point>} [positions] - Positions keyed by pointer id.
         * @returns {GradumMap<number, Point>} A new map with each position scaled. The input is unchanged.
         */
        scalePositionsMap(positions) {
            return positions.mapValues((key, position) => this.scalePosition(position));
        }
    };
})();

/**
 * @class GradumKeyEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description The event fired for `gradum-key-pressed` and `gradum-key-released`. Which of the two key
 * fields is set tells you which happened. Key events carry no pointer position, so
 * {@link GradumEvent.position} is `null`.
 */
class GradumKeyEvent extends GradumEvent {
    /**
     * @description The key that was pressed, or `undefined` on a release event.
     */
    keyPressed;
    /**
     * @description The key that was released, or `undefined` on a press event.
     */
    keyReleased;
    /**
     * @constructor
     * @description Create a key event. Its position is always `null`.
     * @param {GradumKeyEventProperties} properties - The key involved and the input context.
     */
    constructor(properties) {
        super({ ...properties, position: null });
        this.keyPressed = properties.keyPressed;
        this.keyReleased = properties.keyReleased;
    }
}

/**
 * @internal
 * @class ListenerUtils
 * @description Stores the listener and behavior declarations gathered from `@listener` and `@behavior`,
 * keyed by prototype, so they can be attached once the instance exists.
 */
class ListenerUtils {
    constructorMap = new WeakMap();
    constructorData(prototype) {
        let obj = this.constructorMap.get(prototype);
        if (!obj) {
            obj = { listeners: new Map() };
            this.constructorMap.set(prototype, obj);
        }
        return obj;
    }
    addListener(prototype, listener) {
        if (!listener.methodName)
            return;
        const data = this.constructorData(prototype)?.listeners;
        if (!data || data.has(listener.methodName))
            return;
        data.set(listener.methodName, listener);
    }
    getAllListeners(instance) {
        let prototype = Object.getPrototypeOf(instance);
        const results = new Map();
        while (prototype && prototype !== Object.prototype) {
            const map = this.constructorData(prototype).listeners;
            if (map?.size)
                for (const [key, value] of map.entries()) {
                    if (!results.has(key))
                        results.set(key, value);
                }
            prototype = Object.getPrototypeOf(prototype);
        }
        return results;
    }
}

const utils$6 = new ListenerUtils();
/**
 * @decorator
 * @function listener
 * @group Decorators
 * @category Listeners
 *
 * @description Method decorator that registers the decorated method as an event listener, to be attached later
 * via {@link attachListenersAndBehaviors}.
 * @param {Partial<Omit<ListenerProperties, "callback">>} [properties={}] - Listener configuration. Values
 * will be merged with the detected defaults. If `properties.type` is omitted, the name of the method will be used
 * to derive the event name from {@link DefaultEventName}.
 *
 * @example ```ts
 * class MyElement {
 *   @listener() click(e: Event) { ... }
 *   //Equivalent to: gradum(this).on(DefaultEventName.click, (e: Event) => { ... });
 * }
 * ```
 */
function listener(properties = {}) {
    return function (value, context) {
        //TODO FIX
        GradumEventManager.instance;
        let type = properties.type;
        if (!type) {
            const kebab = camelToKebabCase(String(context.name));
            type = Object.values(DefaultEventName).includes("gradum-" + kebab) ? "gradum-" + kebab : kebab;
        }
        context.addInitializer(function () {
            utils$6.addListener(Object.getPrototypeOf(this), { ...properties, type, methodName: context.name, kind: "listener" });
        });
        return value;
    };
}
/**
 * @decorator
 * @function behavior
 * @group Decorators
 * @category Listeners
 *
 * @description Method decorator that registers the decorated method as a tool behavior, to be attached later
 * via {@link attachListenersAndBehaviors}.
 * @param {Partial<Omit<ListenerProperties, "callback">>} [properties={}] - Listener configuration. Values
 * will be merged with the detected defaults. If `properties.type` is omitted, the name of the method will be used
 * to derive the event name from {@link DefaultEventName}.
 *
 * @example ```ts
 * class MyElement {
 *   @behavior() click(e: Event) { ... }
 *   //Equivalent to: gradum(this).addToolBehavior(DefaultEventName.click, (e: Event) => { ... });
 * }
 * ```
 */
function behavior(properties = {}) {
    return function (value, context) {
        //TODO FIX
        GradumEventManager.instance;
        let type = properties.type;
        if (!type) {
            const kebab = camelToKebabCase(String(context.name));
            type = Object.values(DefaultEventName).includes("gradum-" + kebab) ? "gradum-" + kebab : kebab;
        }
        context.addInitializer(function () {
            utils$6.addListener(Object.getPrototypeOf(this), { ...properties, type, methodName: context.name, kind: "behavior" });
        });
        return value;
    };
}
/**
 * @decorator
 * @function attachListenersAndBehaviors
 * @group Decorators
 * @category Listeners
 *
 * @description Attach all previously-decorated listeners and behaviors recorded on the given `context`. It attempts to
 * resolve defaults from the latter, such as the `target`, `toolName`, `options`, and `manager`. This method is called
 * automatically in the GradumElement lifecycle.
 * @param {any} context - The object/instance/prototype to attach the listeners and behaviors defined for it.
 */
function attachListenersAndBehaviors(context) {
    if (!context || typeof context !== "object")
        return;
    const listeners = utils$6.getAllListeners(context);
    if (!listeners || listeners.size === 0)
        return;
    const defaultTarget = context.target instanceof Node
        ? context.target : context instanceof Node
        ? context : context.element instanceof Node
        ? context.element : undefined;
    const defaultTool = typeof context.toolName === "string" ? context.toolName : undefined;
    const defaultOptions = typeof context.options === "object" ? context.options : undefined;
    const defaultManager = context.manager instanceof GradumEventManager ? context.manager : undefined;
    for (const [, listener] of listeners) {
        const method = context[listener.methodName];
        if (typeof method !== "function")
            continue;
        const target = listener.target ?? defaultTarget;
        const tool = listener.toolName ?? defaultTool;
        const manager = listener.manager ?? defaultManager;
        if (listener.kind === "behavior") {
            if (!tool)
                continue;
            gradum(context).addToolBehavior(listener.type, (e, el) => method.call(context, e, el), tool, manager);
        }
        else if (listener.kind === "listener") {
            if (!(target instanceof Node))
                continue;
            gradum(target).onTool(listener.type, tool, (e, el) => method.call(context, e, el), listener.options ?? defaultOptions, manager);
        }
    }
}

/**
 * @class GradumOperator
 * @group MVC
 * @category Operator
 *
 * @template {object} ElementType - The type of the main component.
 * @template {GradumView} ViewType - The element's MVC view type.
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @template {GradumEmitter} EmitterType - The element's MVC emitter type.
 * @description The MVC base operator class. Its main job is to handle some part of (or all of) the logic of the
 * component. It has access to the element, the model to read and write data, the view to update the UI, and the
 * emitter to listen for changes in the model or any other internal events. It can only communicate with other
 * operators via the emitter (by firing or listening for changes on a certain key).
 */
class GradumOperator {
    /**
     * @description The key of the operator. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the operator's class name is MyElementSomethingOperator, the key would
     * default to "something".
     */
    keyName;
    /**
     * @description The element it is bound to.
     */
    element;
    /**
     * @description The MVC view.
     */
    view;
    /**
     * @description The MVC model.
     */
    model;
    /**
     * @description The MVC emitter.
     */
    emitter;
    /**
     * @constructor
     * @description Create an operator bound to an element. The view, model, and emitter default to the
     * element's own, so an operator shares them rather than owning any state itself.
     * @param {GradumOperatorProperties} properties - The element to attach to, plus optional view, model, and
     * emitter overrides.
     */
    constructor(properties) {
        this.element = properties.element;
        if (properties.model)
            this.model = properties.model;
        if (properties.emitter)
            this.emitter = properties.emitter;
        if (properties.view)
            this.view = properties.view;
        this.setup();
    }
    /**
     * @function setup
     * @description Called in the constructor. Use for setup that should happen at instantiation,
     * before `this.initialize()` is called.
     * @protected
     */
    setup() { }
    /**
     * @function initialize
     * @description Initializes the operator. Specifically, it will set up the change callbacks.
     */
    initialize() {
        this.setupUIListeners();
        this.setupChangedCallbacks();
    }
    /**
     * @function setupUIListeners
     * @description Setup method for defining DOM and input event listeners.
     * @protected
     */
    setupUIListeners() {
        attachListenersAndBehaviors(this);
    }
    /**
     * @function setupChangedCallbacks
     * @description Setup method intended to initialize change listeners and callbacks.
     * @protected
     */
    setupChangedCallbacks() {
        initializeEffects(this);
    }
}
addRegistryCategory(GradumOperator);
define(GradumOperator);

/**
 * @internal
 * @class GradumEventManagerKeyOperator
 * @extends GradumOperator
 * @description Translates native keyboard input into {@link GradumKeyEvent}s. It keeps the manager's
 * list of currently-held keys up to date and activates any tool bound to the pressed key.
 */
class GradumEventManagerKeyOperator extends GradumOperator {
    keyName = "key";
    keyDown = (e) => this.keyDownFn(e);
    keyDownFn(e) {
        if (!this.element.enabled)
            return;
        //Return if key already pressed
        if (this.model.currentKeys.includes(e.key))
            return;
        //Add key to currentKeys
        this.model.currentKeys.push(e.key);
        //Fire a keyPressed event (only once)
        this.emitter.fire("dispatchEvent", document, GradumKeyEvent, { eventName: GradumKeyEventName.keyPressed, keyPressed: e.key });
    }
    keyUp = (e) => this.keyUpFn(e);
    keyUpFn(e) {
        if (!this.element.enabled)
            return;
        //Return if key not pressed
        if (!this.model.currentKeys.includes(e.key))
            return;
        //Remove key from currentKeys
        this.model.currentKeys.splice(this.model.currentKeys.indexOf(e.key), 1);
        //Fire a keyReleased event
        this.emitter.fire("dispatchEvent", document, GradumKeyEvent, { eventName: GradumKeyEventName.keyReleased, keyReleased: e.key });
    }
}

/**
 * @class GradumWheelEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description The event fired for `gradum-scroll` and `gradum-pinch`. Wheel events carry no pointer
 * position, so {@link GradumEvent.position} is `null` — read {@link GradumWheelEvent.delta} instead.
 */
class GradumWheelEvent extends GradumEvent {
    /**
     * @description How far the wheel or trackpad moved on each axis since the last event.
     */
    delta;
    /**
     * @constructor
     * @description Create a wheel event. Its position is always `null`.
     * @param {GradumWheelEventProperties} properties - The scroll delta and the input context.
     */
    constructor(properties) {
        super({ ...properties, position: null });
        this.delta = properties.delta;
    }
}

/**
 * @internal
 * @class GradumEventManagerWheelOperator
 * @extends GradumOperator
 * @description Translates native wheel input into {@link GradumWheelEvent}s, choosing between a scroll
 * and a pinch and inferring whether the input came from a mouse or a trackpad.
 */
class GradumEventManagerWheelOperator extends GradumOperator {
    keyName = "wheel";
    wheel = (e) => {
        if (!this.element.enabled)
            return;
        //Prevent default scroll behavior
        if (this.element.preventDefaultWheel)
            e.preventDefault();
        //Most likely trackpad
        if (Math.abs(e.deltaY) <= 40 || e.deltaX != 0)
            this.model.inputDevice = InputDevice.trackpad;
        //Set input device to mouse if it wasn't trackpad recently
        if (!this.model.wasRecentlyTrackpad)
            this.model.inputDevice = InputDevice.mouse;
        //Reset trackpad timer
        this.model.utils.clearTimer("recentlyTrackpadTimer");
        //Set timer to clear recently trackpad boolean after a delay
        this.model.utils.setTimer("recentlyTrackpadTimer", () => {
            if (this.model.inputDevice == InputDevice.trackpad)
                this.model.wasRecentlyTrackpad = false;
        }, 800);
        //Get name of event according to input type
        //Pinching (for trackpad, Ctrl key is marked as pressed in the WheelEvent)
        const eventName = (this.model.inputDevice == InputDevice.trackpad && e.ctrlKey)
            ? GradumEventName.pinch
            : GradumEventName.scroll;
        const target = document.elementFromPoint?.(e.clientX, e.clientY) || document;
        this.emitter.fire("dispatchEvent", target, GradumWheelEvent, { delta: new Point(e.deltaX, e.deltaY), eventName: eventName });
    };
}

/**
 * @class GradumDragEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description The event fired for `gradum-drag`, `gradum-drag-start`, and `gradum-drag-end`. It tracks
 * every active pointer at once, so a multi-touch drag reports one entry per finger: each map below is
 * keyed by pointer id. Every position is available raw and scaled into document space, along with the
 * per-event deltas.
 */
let GradumDragEvent = (() => {
    let _classSuper = GradumEvent;
    let _instanceExtraInitializers = [];
    let _get_scaledOrigins_decorators;
    let _get_scaledPreviousPositions_decorators;
    let _get_scaledPositions_decorators;
    let _get_deltaPositions_decorators;
    let _get_deltaPosition_decorators;
    let _get_scaledDeltaPositions_decorators;
    let _get_scaledDeltaPosition_decorators;
    return class GradumDragEvent extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_scaledOrigins_decorators = [cache()];
            _get_scaledPreviousPositions_decorators = [cache()];
            _get_scaledPositions_decorators = [cache()];
            _get_deltaPositions_decorators = [cache()];
            _get_deltaPosition_decorators = [cache()];
            _get_scaledDeltaPositions_decorators = [cache()];
            _get_scaledDeltaPosition_decorators = [cache()];
            __esDecorate(this, null, _get_scaledOrigins_decorators, { kind: "getter", name: "scaledOrigins", static: false, private: false, access: { has: obj => "scaledOrigins" in obj, get: obj => obj.scaledOrigins }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_scaledPreviousPositions_decorators, { kind: "getter", name: "scaledPreviousPositions", static: false, private: false, access: { has: obj => "scaledPreviousPositions" in obj, get: obj => obj.scaledPreviousPositions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_scaledPositions_decorators, { kind: "getter", name: "scaledPositions", static: false, private: false, access: { has: obj => "scaledPositions" in obj, get: obj => obj.scaledPositions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_deltaPositions_decorators, { kind: "getter", name: "deltaPositions", static: false, private: false, access: { has: obj => "deltaPositions" in obj, get: obj => obj.deltaPositions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_deltaPosition_decorators, { kind: "getter", name: "deltaPosition", static: false, private: false, access: { has: obj => "deltaPosition" in obj, get: obj => obj.deltaPosition }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_scaledDeltaPositions_decorators, { kind: "getter", name: "scaledDeltaPositions", static: false, private: false, access: { has: obj => "scaledDeltaPositions" in obj, get: obj => obj.scaledDeltaPositions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_scaledDeltaPosition_decorators, { kind: "getter", name: "scaledDeltaPosition", static: false, private: false, access: { has: obj => "scaledDeltaPosition" in obj, get: obj => obj.scaledDeltaPosition }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @description Where each pointer started its drag, keyed by pointer id.
         */
        origins = __runInitializers(this, _instanceExtraInitializers);
        /**
         * @description Where each pointer was on the previous drag event, keyed by pointer id.
         */
        previousPositions;
        /**
         * @description Where each pointer is now, keyed by pointer id.
         */
        positions;
        /**
         * @constructor
         * @description Create a drag event. The event's single `position` is taken from the first entry of
         * `positions`.
         * @param {GradumDragEventProperties} properties - The per-pointer position maps and input context.
         */
        constructor(properties) {
            super({ ...properties, position: properties.positions.first });
            this.origins = properties.origins;
            this.previousPositions = properties.previousPositions;
            this.positions = properties.positions; //TODO MOVE TO DEFAULT EVENT
        }
        /**
         * @readonly
         * @description {@link GradumDragEvent.origins} in document space. Falls back to the raw origins when
         * scaling is not authorized.
         */
        get scaledOrigins() {
            if (!this.scalingAuthorized)
                return this.origins;
            return this.scalePositionsMap(this.origins);
        }
        /**
         * @readonly
         * @description {@link GradumDragEvent.previousPositions} in document space. Falls back to the raw
         * positions when scaling is not authorized.
         */
        get scaledPreviousPositions() {
            if (!this.scalingAuthorized)
                return this.previousPositions;
            return this.scalePositionsMap(this.previousPositions);
        }
        /**
         * @readonly
         * @description {@link GradumDragEvent.positions} in document space. Falls back to the raw positions
         * when scaling is not authorized.
         */
        get scaledPositions() {
            if (!this.scalingAuthorized)
                return this.positions;
            return this.scalePositionsMap(this.positions);
        }
        /**
         * @readonly
         * @description How far each pointer moved since the previous event, keyed by pointer id. A pointer
         * with no previous position — on drag start, or when a finger has just joined — reports a zero delta
         * rather than being left out, so a delta is always defined for every active pointer.
         */
        get deltaPositions() {
            return this.positions.mapValues((key, position) => {
                const previousPosition = this.previousPositions.get(key);
                // No previous position (drag start, or a finger just joined) → zero delta,
                // so consumers reading deltas on the first event get a defined Point.
                return previousPosition ? position.sub(previousPosition) : new Point(0, 0);
            });
        }
        /**
         * @readonly
         * @description The average movement across all pointers since the previous event. Use it to move
         * something with the drag without caring how many fingers are down.
         */
        get deltaPosition() {
            return Point.midPoint(...this.deltaPositions.valuesArray());
        }
        /**
         * @readonly
         * @description {@link GradumDragEvent.deltaPositions} in document space, so the deltas match the
         * coordinates of a panned or zoomed canvas.
         */
        get scaledDeltaPositions() {
            return this.scaledPositions.mapValues((key, position) => {
                const previousPosition = this.scaledPreviousPositions.get(key);
                return previousPosition ? position.sub(previousPosition) : new Point(0, 0);
            });
        }
        /**
         * @readonly
         * @description The average movement across all pointers since the previous event, in document space.
         */
        get scaledDeltaPosition() {
            return Point.midPoint(...this.scaledDeltaPositions.valuesArray());
        }
    };
})();

/**
 * @internal
 * @class GradumEventManagerPointerOperator
 * @extends GradumOperator
 * @description Turns raw pointer input into Gradum's click, long-press, move, and drag events. It tracks
 * every active pointer so multi-touch gestures stay coherent, and decides what an interaction is by
 * watching it: a press becomes a long press once it outlives `longPressDuration`, or a drag once it
 * travels past `moveThreshold`.
 */
class GradumEventManagerPointerOperator extends GradumOperator {
    keyName = "pointer";
    pointerDown = (e) => this.pointerDownFn(e);
    pointerMove = (e) => this.pointerMoveFn(e);
    pointerUp = (e) => this.pointerUpFn(e);
    pointerCancel = (e) => this.pointerCancelFn(e);
    lostPointerCapture = (e) => this.lostPointerCaptureFn(e);
    pointerDownFn(e) {
        if (!e.composedPath().includes(this.model.lockState.lockOrigin)) {
            document.activeElement?.blur?.();
            this.element.unlock();
        }
        if (!this.element.enabled)
            return;
        //Check if it's touch
        const isTouch = e.pointerType === "touch";
        //Prevent default actions (especially useful for touch events on iOS and iPadOS)
        if (this.element.preventDefaultMouse && !isTouch)
            e.preventDefault();
        if (isTouch && (this.element.preventDefaultTouch || this.element.wheelEventsEnabled))
            e.preventDefault();
        //Update input device
        if (isTouch)
            this.model.inputDevice = InputDevice.touch;
        else if (this.model.inputDevice === InputDevice.unknown || this.model.inputDevice === InputDevice.touch)
            this.model.inputDevice = InputDevice.mouse;
        //Initialize origin & previous position using pointerId
        const id = e.pointerId;
        const position = new Point(e.clientX, e.clientY);
        this.model.origins.set(id, position);
        this.model.previousPositions.set(id, position);
        //Capture this pointer so we keep receiving move/up even if the pointer leaves the element
        const target = document.elementFromPoint(position.x, position.y);
        if (target)
            target.setPointerCapture?.(e.pointerId);
        //Update click mode
        this.model.activePointers.add(id);
        this.model.utils.setClickMode(isTouch ? this.model.activePointers.size : e.button, isTouch);
        //Return if click events are disabled
        if (!this.element.clickEventsEnabled)
            return;
        // Fire click start
        this.fireClick(this.model.origins.first, GradumEventName.clickStart);
        this.model.currentAction = ActionMode.click;
        // Long-press timer
        this.model.utils.setTimer(GradumEventName.longPress, () => {
            if (this.model.currentAction !== ActionMode.click)
                return;
            this.model.currentAction = ActionMode.longPress;
            this.fireClick(this.model.origins.first, GradumEventName.longPress);
        }, this.model.longPressDuration);
    }
    pointerMoveFn(e) {
        if (!this.element.enabled)
            return;
        //Check if is touch
        const isTouch = e.pointerType === "touch";
        if (!this.element.moveEventsEnabled && !this.element.dragEventsEnabled
            && !(isTouch && this.element.wheelEventsEnabled))
            return;
        //Prevent default actions
        if (this.element.preventDefaultMouse && !isTouch)
            e.preventDefault();
        if (isTouch && (this.element.preventDefaultTouch || this.element.wheelEventsEnabled))
            e.preventDefault();
        //New positions map
        this.model.positions = new GradumMap();
        // Only update the current pointer's position (others remain tracked from prior moves)
        this.model.positions.set(e.pointerId, new Point(e.clientX, e.clientY));
        // Clear cached target origin if not dragging
        if (this.model.currentAction !== ActionMode.drag)
            this.model.lastTargetOrigin = null;
        //Fire touch scroll/pinch events (2-finger only)
        if (isTouch && this.element.wheelEventsEnabled) {
            const currentPos = new Point(e.clientX, e.clientY);
            const prevPos = this.model.previousPositions.get(e.pointerId);
            if (this.model.activePointers.size === 2 && prevPos) {
                const otherId = [...this.model.activePointers].find(id => id !== e.pointerId);
                const otherPos = this.model.previousPositions.get(otherId);
                if (otherPos) {
                    const prevCenter = Point.midPoint(prevPos, otherPos);
                    const currentCenter = Point.midPoint(currentPos, otherPos);
                    const scrollDelta = currentCenter.sub(prevCenter);
                    const pinchDelta = Point.dist(currentPos, otherPos) - Point.dist(prevPos, otherPos);
                    const centerTarget = document.elementFromPoint(currentCenter.x, currentCenter.y) || document;
                    if (scrollDelta.x !== 0 || scrollDelta.y !== 0)
                        this.emitter.fire("dispatchEvent", centerTarget, GradumWheelEvent, { delta: scrollDelta, eventName: GradumEventName.scroll });
                    if (pinchDelta !== 0)
                        this.emitter.fire("dispatchEvent", centerTarget, GradumWheelEvent, { delta: new Point(0, pinchDelta), eventName: GradumEventName.pinch });
                }
            }
        }
        //Fire move event if enabled
        if (this.element.moveEventsEnabled)
            this.fireDrag(this.model.positions, GradumEventName.move);
        //If drag events are enabled and user is interacting
        if (this.model.currentAction !== ActionMode.none && this.element.dragEventsEnabled) {
            //Initialize drag
            if (this.model.currentAction !== ActionMode.drag) {
                //Check if any tracked origin moved beyond threshold
                if (!Array.from(this.model.origins.entries()).some(([key, origin]) => {
                    const p = (key === e.pointerId)
                        ? this.model.positions.get(key)
                        : this.model.previousPositions.get(key);
                    return p && Point.dist(p, origin) > this.model.moveThreshold;
                })) {
                    this.model.previousPositions.set(e.pointerId, this.model.positions.get(e.pointerId));
                    return;
                }
                //If didn't return --> fire drag start and set action to drag
                clearCache(this);
                this.fireDrag(this.model.origins, GradumEventName.dragStart);
                this.model.currentAction = ActionMode.drag;
            }
            //Fire drag step
            this.fireDrag(this.model.positions);
        }
        //Update previous positions for the moved pointer
        this.model.previousPositions.set(e.pointerId, this.model.positions.get(e.pointerId));
    }
    pointerUpFn(e) {
        if (!this.element.enabled)
            return;
        //Check if is touch
        const isTouch = e.pointerType === "touch";
        //Prevent default actions
        if (this.element.preventDefaultMouse && !isTouch)
            e.preventDefault();
        if (isTouch && (this.element.preventDefaultTouch || this.element.wheelEventsEnabled))
            e.preventDefault();
        //Clear any timer set
        this.model.utils.clearTimer(GradumEventName.longPress);
        //Initialize a new positions map
        this.model.positions = new GradumMap();
        this.model.positions.set(e.pointerId, new Point(e.clientX, e.clientY));
        //If action was drag --> fire drag end
        if (this.model.currentAction === ActionMode.drag && this.element.dragEventsEnabled) {
            this.fireDrag(this.model.positions, GradumEventName.dragEnd);
        }
        //If click events are enabled
        if (this.element.clickEventsEnabled) {
            //If action is click --> fire click
            if (this.model.currentAction === ActionMode.click) {
                this.fireClick(this.model.positions.first, GradumEventName.click);
            }
            //Fire click end
            this.fireClick(this.model.origins.first, GradumEventName.clickEnd);
        }
        //Cleanup for this pointerId only
        this.model.origins.delete(e.pointerId);
        this.model.previousPositions.delete(e.pointerId);
        this.model.activePointers.delete(e.pointerId);
        //If no more active pointers, reset modes
        if (this.model.activePointers.size === 0) {
            this.model.currentAction = ActionMode.none;
            this.model.currentClick = ClickMode.none;
        }
    }
    pointerCancelFn(e) {
        if (!this.model.activePointers.has(e.pointerId))
            return;
        this.model.utils.clearTimer(GradumEventName.longPress);
        this.model.positions = new GradumMap();
        this.model.positions.set(e.pointerId, new Point(e.clientX, e.clientY));
        if (this.model.currentAction === ActionMode.drag && this.element.dragEventsEnabled)
            this.fireDrag(this.model.positions, GradumEventName.dragEnd);
        if (this.element.clickEventsEnabled)
            this.fireClick(this.model.origins.first, GradumEventName.clickEnd);
        this.model.origins.delete(e.pointerId);
        this.model.previousPositions.delete(e.pointerId);
        this.model.activePointers.delete(e.pointerId);
        if (this.model.activePointers.size === 0) {
            this.model.currentAction = ActionMode.none;
            this.model.currentClick = ClickMode.none;
        }
    }
    lostPointerCaptureFn(e) {
        // lostpointercapture fires after pointercancel too; guard avoids double-cleanup
        if (this.model.activePointers.has(e.pointerId))
            this.pointerCancelFn(e);
    }
    /**
     * @private
     * @function fireClick
     * @description Fire a click-family event at whichever element sits under the given position.
     * @param {Point} p - The screen position the click happened at. Nothing fires when it is undefined.
     * @param {GradumEventNameEntry} [eventName=GradumEventName.click] - The event name to fire, letting the
     * same path emit click start, click end, and long press.
     */
    fireClick(p, eventName = GradumEventName.click) {
        if (!p)
            return;
        const target = document.elementFromPoint(p.x, p.y) || document;
        this.emitter.fire("dispatchEvent", target, GradumEvent, { position: p, eventName: eventName });
    }
    /**
     * @private
     * @function fireDrag
     * @description Fire a drag-family event at the drag's origin element, carrying the origin, the previous
     * position, and the current position of every active pointer.
     * @param {GradumMap<number, Point>} positions - Current position per pointer id. Nothing fires when it
     * is undefined.
     * @param {GradumEventNameEntry} [eventName=GradumEventName.drag] - The event name to fire, letting the
     * same path emit drag start, drag, and drag end.
     */
    fireDrag(positions, eventName = GradumEventName.drag) {
        if (!positions)
            return;
        this.emitter.fire("dispatchEvent", this.getFireOrigin(positions), GradumDragEvent, {
            positions: positions,
            previousPositions: this.model.previousPositions,
            origins: this.model.origins,
            eventName: eventName
        });
    }
    getFireOrigin(positions, reload = false) {
        if (!this.model.lastTargetOrigin || reload) {
            const origin = this.model.origins.first ? this.model.origins.first : positions.first;
            this.model.lastTargetOrigin = document.elementFromPoint(origin.x, origin.y);
        }
        return this.model.lastTargetOrigin;
    }
}

/**
 * @internal
 * @class GradumEventManagerDispatchOperator
 * @extends GradumOperator
 * @description Dispatches Gradum events along the composed path. It runs two sequential passes: a
 * capture pass from the document down to the target, which invokes tool `@behavior` methods, then a
 * bubble pass back up, which invokes interactor `@listener` methods and `gradum(el).on()` listeners.
 * Each pass stops early when a handler returns anything other than `Propagation.propagate`.
 *
 * *Note: move events are the exception. Their composed path is the drag origin's ancestor chain, which
 * omits elements merely sitting under the cursor, so they are dispatched in a single pass over the
 * z-stack at the pointer instead — topmost first, stopping at the first handler that does not
 * propagate. A move handler therefore sees neither a capture pass nor a bubble pass.*
 */
class GradumEventManagerDispatchOperator extends GradumOperator {
    keyName = "dispatch";
    boundHooks = new Map();
    setupChangedCallbacks() {
        super.setupChangedCallbacks();
        this.emitter.add("dispatchEvent", this.dispatchEvent);
    }
    dispatchEvent = (target, eventType, properties) => {
        if (!target)
            return;
        properties.keys = this.model.currentKeys;
        properties.toolName = this.element.getCurrentToolName(this.model.currentClick);
        properties.clickMode = this.model.currentClick;
        properties.inputDevice = this.model.inputDevice;
        properties.eventManager = this.element;
        properties.eventInitDict = { bubbles: true, cancelable: true, composed: true };
        properties.authorizeScaling = this.element.authorizeEventScaling;
        properties.scalePosition = this.element.scaleEventPosition;
        if (properties.eventName === GradumKeyEventName.keyPressed)
            this.element.setToolByKey(properties["keyPressed"]);
        else if (properties.eventName === GradumKeyEventName.keyReleased)
            this.element.setTool(undefined, ClickMode.key, { select: false });
        target.dispatchEvent(new eventType(properties));
    };
    getToolHandlingCallback(type, e) {
        const toolName = this.element.getCurrentToolName(this.model.currentClick);
        // For move events, composedPath() is the drag-origin's ancestor chain and never
        // includes non-topmost components at the current cursor (e.g. Playback behind
        // ClipRenderer). Use the full z-stack at the cursor instead, dispatching topmost-first
        // and stopping at the first handler that returns non-propagate.
        if (type === GradumMoveEventName.move && e instanceof GradumDragEvent && e.position) {
            const { x, y } = e.position;
            const stack = document.elementsFromPoint?.(x, y) ?? [];
            for (const el of stack) {
                if (!(el instanceof Node))
                    continue;
                const propagate = gradum(el).executeAction(type, toolName, e, undefined, this.element);
                if (propagate !== Propagation.propagate)
                    break;
            }
            return;
        }
        const path = e.composedPath?.() || [];
        for (let i = path.length - 1; i >= 0; i--) {
            if (!(path[i] instanceof Node))
                continue;
            const propagate = gradum(path[i]).executeAction(type, toolName, e, { capture: true }, this.element);
            if (propagate !== Propagation.propagate) {
                e.stopPropagation();
                break;
            }
        }
        for (let i = 0; i < path.length; i++) {
            if (!(path[i] instanceof Node))
                continue;
            const propagate = gradum(path[i]).executeAction(type, toolName, e, undefined, this.element);
            if (propagate !== Propagation.propagate) {
                e.stopPropagation();
                break;
            }
        }
    }
    setupCustomDispatcher(type) {
        if (this.boundHooks.has(type))
            return;
        const hook = (e) => this.getToolHandlingCallback(type, e);
        this.boundHooks.set(type, hook);
        document.addEventListener(type, hook, { capture: true });
    }
    removeCustomDispatcher(type) {
        const hook = this.boundHooks.get(type);
        if (!hook)
            return;
        document.removeEventListener(type, hook, { capture: true });
        this.boundHooks.delete(type);
    }
}

/**
 * @class GradumHandler
 * @group MVC
 * @category Handler
 *
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @description Holds model-level logic that would otherwise crowd the model itself. A handler sees only
 * `this.model` — no element and no view — so use it for computations and edits over the model's data, and
 * reach for a {@link GradumOperator} when the DOM is involved. Register one with the `@handler` decorator.
 */
class GradumHandler {
    /**
     * @description The key of the handler. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the handler's class name is MyElementSomethingHandler, the key would
     * default to "something".
     */
    keyName;
    /**
     * @description The model this handler operates on. Assigned by the MVC wiring when the handler is
     * registered, so it is set by the time `initialize` runs.
     */
    model;
    /**
     * @constructor
     * @description Create a handler. Handlers are normally constructed without arguments — the MVC wiring
     * binds {@link GradumHandler.model} when the handler is registered on its model.
     * @param {ModelType} [model] - The model to bind. Omit it to let the MVC wiring bind one on registration.
     */
    constructor(model) {
        if (model)
            this.model = model;
        this.setup();
    }
    /**
     * @function setup
     * @description Called in the constructor. Use for setup that should happen at instantiation,
     * before `this.initialize()` is called.
     * @protected
     */
    setup() {
        initializeEffects(this);
    }
}
addRegistryCategory(GradumHandler);
define(GradumHandler);

/**
 * @internal
 * @class GradumEventManagerUtilsHandler
 * @extends GradumHandler
 * @description Shared helpers for the event manager's operators: mapping a native button number to a
 * {@link ClickMode}, resolving which Gradum event names are enabled, running the named timers behind
 * long-press detection, and activating a tool.
 */
class GradumEventManagerUtilsHandler extends GradumHandler {
    keyName = "utils";
    setClickMode(button, isTouch = false) {
        if (isTouch)
            button--;
        switch (button) {
            case -1:
                this.model.currentClick = ClickMode.none;
                return;
            case 0:
                this.model.currentClick = ClickMode.left;
                return;
            case 1:
                this.model.currentClick = ClickMode.middle;
                return;
            case 2:
                this.model.currentClick = ClickMode.right;
                return;
            default:
                this.model.currentClick = ClickMode.other;
                return;
        }
    }
    applyEventNames(eventNames) {
        for (const eventName in eventNames)
            DefaultEventName[eventName] = eventNames[eventName];
    }
    //Sets a timer function associated with a certain event name, with its duration
    setTimer(timerName, callback, duration) {
        this.clearTimer(timerName);
        this.model.timerMap.set(timerName, setTimeout(() => {
            callback();
            this.clearTimer(timerName);
        }, duration));
    }
    //Clears timer associated with the provided event name
    clearTimer(timerName) {
        const timer = this.model.timerMap.get(timerName);
        if (!timer)
            return;
        clearTimeout(timer);
        this.model.timerMap.delete(timerName);
    }
    activateTool(element, toolName, value) {
        if (value)
            $(element).onToolActivate(toolName).fire();
        else
            $(element).onToolDeactivate(toolName).fire();
    }
}

/**
 * @class GradumWeakSet
 * @group Components
 * @category Data Structures
 *
 * @template {object} Type - The type of the held objects.
 * @description A set that holds its members weakly, so membership never keeps an object alive. Unlike
 * a native [WeakSet](https://developer.mozilla.org/en-US/docs/Web/API/WeakSet), it is iterable and
 * reports its size — collected objects simply disappear from both. Useful for tracking DOM nodes
 * without leaking them once they are removed.
 */
class GradumWeakSet {
    _weakRefs;
    /**
     * @constructor
     * @description Create an empty set.
     */
    constructor() {
        this._weakRefs = new Set();
    }
    /**
     * @description Add an object to the set, if not already present. The set does not keep it alive.
     * @param {Type} obj - The object to add.
     * @returns {this} Itself, allowing for method chaining.
     */
    add(obj) {
        if (!this.has(obj))
            this._weakRefs.add(new WeakRef(obj));
        return this;
    }
    /**
     * @description Check whether an object is in the set.
     * @param {Type} obj - The object to look for, compared by identity.
     * @returns {boolean} Whether the object is present and has not been garbage-collected.
     */
    has(obj) {
        for (const weakRef of this._weakRefs) {
            if (weakRef.deref() === obj)
                return true;
        }
        return false;
    }
    /**
     * @description Remove an object from the set.
     * @param {Type} obj - The object to remove, compared by identity.
     * @returns {boolean} Whether a matching object was found and removed.
     */
    delete(obj) {
        for (const weakRef of this._weakRefs) {
            if (weakRef.deref() === obj) {
                this._weakRefs.delete(weakRef);
                return true;
            }
        }
        return false;
    }
    /**
     * @description Drop the bookkeeping left behind by objects that have been garbage-collected. Only
     * frees the set's own references — collected objects are already absent from iteration and
     * {@link size} without it.
     */
    cleanup() {
        for (const weakRef of this._weakRefs) {
            if (weakRef.deref() === undefined)
                this._weakRefs.delete(weakRef);
        }
    }
    /**
     * @description Snapshot the objects that are still alive.
     * @returns {Type[]} A new array of the live objects, in insertion order.
     */
    toArray() {
        const result = [];
        for (const weakRef of this._weakRefs) {
            const obj = weakRef.deref();
            if (obj !== undefined)
                result.push(obj);
            else
                this._weakRefs.delete(weakRef);
        }
        return result;
    }
    /**
     * @description The number of objects still alive. Counted on each read rather than stored, so it
     * costs a full pass over the set.
     * @readonly
     */
    get size() {
        return this.toArray().length;
    }
    /**
     * @description Remove every object from the set.
     */
    clear() {
        this._weakRefs.clear();
    }
    /**
     * @description Run a callback for each live object, in insertion order. Objects collected since
     * the last pass are skipped.
     * @param {(value: Type, set: this) => void} callback - Called once per live object.
     * @param {any} [thisArg] - Value to bind as `this` inside the callback.
     */
    forEach(callback, thisArg) {
        for (const weakRef of this._weakRefs) {
            const obj = weakRef.deref();
            if (obj !== undefined)
                callback.call(thisArg, obj, obj, this);
            else
                this._weakRefs.delete(weakRef);
        }
    }
    /**
     * @description Iterate the live objects in insertion order, skipping any that have been collected.
     */
    *[Symbol.iterator]() {
        for (const weakRef of this._weakRefs) {
            const obj = weakRef.deref();
            if (obj !== undefined)
                yield obj;
            else
                this._weakRefs.delete(weakRef);
        }
    }
}

function expose(...args) {
    if (typeof args[0] === "object") {
        if (args.length < 3)
            return;
        return applyExpose(args[0], args[2], args[1], args[3] ?? true);
    }
    else {
        return function (value, context) {
            return exposeDecorator(args[0], args[1] ?? true, value, context);
        };
    }
}
/**
 * @internal
 * @function applyExpose
 * @description Install a single forwarding accessor on a host, reading and writing the same key on the
 * instance found at `rootKey`. Backs both the `@expose` decorator and its imperative form.
 * @param {any} host - The object to define the property on.
 * @param {string} key - The property key to forward.
 * @param {string} rootKey - Dot path to the inner instance to forward to, e.g. `"view.scrubber"`.
 * @param {boolean} exposeSetter - Whether writes are forwarded. When `false` the property is read-only.
 */
function applyExpose(host, key, rootKey, exposeSetter) {
    const nestedRoots = rootKey.split(".").filter(Boolean);
    const getLowestRoot = (h) => nestedRoots.reduce((p, r) => p?.[r], h);
    const descriptor = getFirstDescriptorInChain(host, key);
    Object.defineProperty(host, key, {
        configurable: true,
        enumerable: descriptor?.enumerable ?? true,
        get() { return getLowestRoot(this)?.[key]; },
        set(value) { if (exposeSetter) {
            const r = getLowestRoot(this);
            if (r)
                r[key] = value;
        } },
    });
}
/**
 * @internal
 * @function exposeDecorator
 * @template {object} Type - The class carrying the decorated member.
 * @template Value - The type of the exposed value.
 * @description The decorator half of {@link expose}, deferring the actual wiring to `applyExpose` until the
 * instance exists.
 * @param {string} rootKey - Dot path to the inner instance to forward to.
 * @param {boolean} exposeSetter - Whether writes are forwarded.
 * @param {any} value - The decorated member, as handed over by the decorator protocol.
 * @param {ClassFieldDecoratorContext | ClassAccessorDecoratorContext} context - The decorator context.
 */
function exposeDecorator(rootKey, exposeSetter, value, context) {
    if (!rootKey)
        return value;
    const { kind, name } = context;
    const key = String(name);
    const nestedRoots = rootKey.split(".").filter(Boolean);
    const getLowestRoot = (host) => nestedRoots.reduce((p, r) => p?.[r], host);
    if (kind === "method") {
        return function (...args) {
            const root = getLowestRoot(this);
            const fn = root?.[key];
            if (typeof fn === "function")
                return fn.apply(root, args);
        };
    }
    context.addInitializer(function () {
        applyExpose(this, key, rootKey, exposeSetter);
    });
}

//TODO Create merged events maybe --> fire event x when "mousedown" | "touchstart" | "mousemove" etc.
//ToDO Create "interaction" event --> when element interacted with
/**
 * @class GradumEventManager
 * @group Event Handling
 * @category GradumEventManager
 *
 * @extends GradumBaseElement
 * @template {string} ToolType - The union of tool names this manager recognizes.
 * @description Listens to native mouse, trackpad, touch, and keyboard input and turns it into Gradum's
 * richer events — {@link GradumEvent}, {@link GradumDragEvent}, {@link GradumKeyEvent}, and
 * {@link GradumWheelEvent} — so a click, a long press, and a drag arrive as distinct, named events
 * rather than something each component has to derive itself. It also owns the current tool per
 * {@link ClickMode}, and can map screen coordinates into document space for every event it fires.
 *
 * Most applications need only one, reached through {@link GradumEventManager.instance}.
 */
let GradumEventManager = (() => {
    let _classSuper = GradumBaseElement;
    let _instanceExtraInitializers = [];
    let _keyOperator_decorators;
    let _keyOperator_initializers = [];
    let _keyOperator_extraInitializers = [];
    let _wheelOperator_decorators;
    let _wheelOperator_initializers = [];
    let _wheelOperator_extraInitializers = [];
    let _pointerOperator_decorators;
    let _pointerOperator_initializers = [];
    let _pointerOperator_extraInitializers = [];
    let _dispatchOperator_decorators;
    let _dispatchOperator_initializers = [];
    let _dispatchOperator_extraInitializers = [];
    let _inputDevice_decorators;
    let _inputDevice_initializers = [];
    let _inputDevice_extraInitializers = [];
    let _onInputDeviceChange_decorators;
    let _onInputDeviceChange_initializers = [];
    let _onInputDeviceChange_extraInitializers = [];
    let _currentClick_decorators;
    let _currentClick_initializers = [];
    let _currentClick_extraInitializers = [];
    let _currentKeys_decorators;
    let _currentKeys_initializers = [];
    let _currentKeys_extraInitializers = [];
    let _onToolChange_decorators;
    let _onToolChange_initializers = [];
    let _onToolChange_extraInitializers = [];
    let _authorizeEventScaling_decorators;
    let _authorizeEventScaling_initializers = [];
    let _authorizeEventScaling_extraInitializers = [];
    let _scaleEventPosition_decorators;
    let _scaleEventPosition_initializers = [];
    let _scaleEventPosition_extraInitializers = [];
    let _moveThreshold_decorators;
    let _moveThreshold_initializers = [];
    let _moveThreshold_extraInitializers = [];
    let _longPressDuration_decorators;
    let _longPressDuration_initializers = [];
    let _longPressDuration_extraInitializers = [];
    let _set_keyEventsEnabled_decorators;
    let _set_wheelEventsEnabled_decorators;
    let _set_moveEventsEnabled_decorators;
    let _set_mouseEventsEnabled_decorators;
    let _set_touchEventsEnabled_decorators;
    let _set_clickEventsEnabled_decorators;
    let _set_dragEventsEnabled_decorators;
    return class GradumEventManager extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _keyOperator_decorators = [operator()];
            _wheelOperator_decorators = [operator()];
            _pointerOperator_decorators = [operator()];
            _dispatchOperator_decorators = [operator()];
            _inputDevice_decorators = [expose("model", false)];
            _onInputDeviceChange_decorators = [expose("model", false)];
            _currentClick_decorators = [expose("model", false)];
            _currentKeys_decorators = [expose("model", false)];
            _onToolChange_decorators = [expose("model", false)];
            _authorizeEventScaling_decorators = [expose("model")];
            _scaleEventPosition_decorators = [expose("model")];
            _moveThreshold_decorators = [expose("model")];
            _longPressDuration_decorators = [expose("model")];
            _set_keyEventsEnabled_decorators = [auto()];
            _set_wheelEventsEnabled_decorators = [auto()];
            _set_moveEventsEnabled_decorators = [auto()];
            _set_mouseEventsEnabled_decorators = [auto()];
            _set_touchEventsEnabled_decorators = [auto()];
            _set_clickEventsEnabled_decorators = [auto()];
            _set_dragEventsEnabled_decorators = [auto()];
            __esDecorate(this, null, _set_keyEventsEnabled_decorators, { kind: "setter", name: "keyEventsEnabled", static: false, private: false, access: { has: obj => "keyEventsEnabled" in obj, set: (obj, value) => { obj.keyEventsEnabled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_wheelEventsEnabled_decorators, { kind: "setter", name: "wheelEventsEnabled", static: false, private: false, access: { has: obj => "wheelEventsEnabled" in obj, set: (obj, value) => { obj.wheelEventsEnabled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_moveEventsEnabled_decorators, { kind: "setter", name: "moveEventsEnabled", static: false, private: false, access: { has: obj => "moveEventsEnabled" in obj, set: (obj, value) => { obj.moveEventsEnabled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_mouseEventsEnabled_decorators, { kind: "setter", name: "mouseEventsEnabled", static: false, private: false, access: { has: obj => "mouseEventsEnabled" in obj, set: (obj, value) => { obj.mouseEventsEnabled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_touchEventsEnabled_decorators, { kind: "setter", name: "touchEventsEnabled", static: false, private: false, access: { has: obj => "touchEventsEnabled" in obj, set: (obj, value) => { obj.touchEventsEnabled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_clickEventsEnabled_decorators, { kind: "setter", name: "clickEventsEnabled", static: false, private: false, access: { has: obj => "clickEventsEnabled" in obj, set: (obj, value) => { obj.clickEventsEnabled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_dragEventsEnabled_decorators, { kind: "setter", name: "dragEventsEnabled", static: false, private: false, access: { has: obj => "dragEventsEnabled" in obj, set: (obj, value) => { obj.dragEventsEnabled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _keyOperator_decorators, { kind: "field", name: "keyOperator", static: false, private: false, access: { has: obj => "keyOperator" in obj, get: obj => obj.keyOperator, set: (obj, value) => { obj.keyOperator = value; } }, metadata: _metadata }, _keyOperator_initializers, _keyOperator_extraInitializers);
            __esDecorate(null, null, _wheelOperator_decorators, { kind: "field", name: "wheelOperator", static: false, private: false, access: { has: obj => "wheelOperator" in obj, get: obj => obj.wheelOperator, set: (obj, value) => { obj.wheelOperator = value; } }, metadata: _metadata }, _wheelOperator_initializers, _wheelOperator_extraInitializers);
            __esDecorate(null, null, _pointerOperator_decorators, { kind: "field", name: "pointerOperator", static: false, private: false, access: { has: obj => "pointerOperator" in obj, get: obj => obj.pointerOperator, set: (obj, value) => { obj.pointerOperator = value; } }, metadata: _metadata }, _pointerOperator_initializers, _pointerOperator_extraInitializers);
            __esDecorate(null, null, _dispatchOperator_decorators, { kind: "field", name: "dispatchOperator", static: false, private: false, access: { has: obj => "dispatchOperator" in obj, get: obj => obj.dispatchOperator, set: (obj, value) => { obj.dispatchOperator = value; } }, metadata: _metadata }, _dispatchOperator_initializers, _dispatchOperator_extraInitializers);
            __esDecorate(null, null, _inputDevice_decorators, { kind: "field", name: "inputDevice", static: false, private: false, access: { has: obj => "inputDevice" in obj, get: obj => obj.inputDevice, set: (obj, value) => { obj.inputDevice = value; } }, metadata: _metadata }, _inputDevice_initializers, _inputDevice_extraInitializers);
            __esDecorate(null, null, _onInputDeviceChange_decorators, { kind: "field", name: "onInputDeviceChange", static: false, private: false, access: { has: obj => "onInputDeviceChange" in obj, get: obj => obj.onInputDeviceChange, set: (obj, value) => { obj.onInputDeviceChange = value; } }, metadata: _metadata }, _onInputDeviceChange_initializers, _onInputDeviceChange_extraInitializers);
            __esDecorate(null, null, _currentClick_decorators, { kind: "field", name: "currentClick", static: false, private: false, access: { has: obj => "currentClick" in obj, get: obj => obj.currentClick, set: (obj, value) => { obj.currentClick = value; } }, metadata: _metadata }, _currentClick_initializers, _currentClick_extraInitializers);
            __esDecorate(null, null, _currentKeys_decorators, { kind: "field", name: "currentKeys", static: false, private: false, access: { has: obj => "currentKeys" in obj, get: obj => obj.currentKeys, set: (obj, value) => { obj.currentKeys = value; } }, metadata: _metadata }, _currentKeys_initializers, _currentKeys_extraInitializers);
            __esDecorate(null, null, _onToolChange_decorators, { kind: "field", name: "onToolChange", static: false, private: false, access: { has: obj => "onToolChange" in obj, get: obj => obj.onToolChange, set: (obj, value) => { obj.onToolChange = value; } }, metadata: _metadata }, _onToolChange_initializers, _onToolChange_extraInitializers);
            __esDecorate(null, null, _authorizeEventScaling_decorators, { kind: "field", name: "authorizeEventScaling", static: false, private: false, access: { has: obj => "authorizeEventScaling" in obj, get: obj => obj.authorizeEventScaling, set: (obj, value) => { obj.authorizeEventScaling = value; } }, metadata: _metadata }, _authorizeEventScaling_initializers, _authorizeEventScaling_extraInitializers);
            __esDecorate(null, null, _scaleEventPosition_decorators, { kind: "field", name: "scaleEventPosition", static: false, private: false, access: { has: obj => "scaleEventPosition" in obj, get: obj => obj.scaleEventPosition, set: (obj, value) => { obj.scaleEventPosition = value; } }, metadata: _metadata }, _scaleEventPosition_initializers, _scaleEventPosition_extraInitializers);
            __esDecorate(null, null, _moveThreshold_decorators, { kind: "field", name: "moveThreshold", static: false, private: false, access: { has: obj => "moveThreshold" in obj, get: obj => obj.moveThreshold, set: (obj, value) => { obj.moveThreshold = value; } }, metadata: _metadata }, _moveThreshold_initializers, _moveThreshold_extraInitializers);
            __esDecorate(null, null, _longPressDuration_decorators, { kind: "field", name: "longPressDuration", static: false, private: false, access: { has: obj => "longPressDuration" in obj, get: obj => obj.longPressDuration, set: (obj, value) => { obj.longPressDuration = value; } }, metadata: _metadata }, _longPressDuration_initializers, _longPressDuration_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @protected
         * @static
         * @description Every manager that has been created, in creation order.
         */
        static managers = [];
        /**
         * @static
         * @readonly
         * @description The default manager. Creating one on first access, so reading this is always safe.
         */
        static get instance() {
            if (GradumEventManager.managers.length == 0)
                this.managers.push(GradumEventManager.create());
            return GradumEventManager.managers[0];
        }
        /**
         * @static
         * @description Every manager currently registered. Reading gives a copy, so mutating the result does
         * not affect the registry; assign a new array to replace it.
         */
        static get allManagers() {
            return [...this.managers];
        }
        static set allManagers(managers) {
            this.managers = managers;
        }
        /**
         * @readonly
         * @description This manager's model, holding its live input state.
         */
        get model() {
            return gradum(this).model;
        }
        /**
         * @static
         * @description The MVC pieces and event-type switches a new manager starts with. Every event family is
         * enabled by default; pass the matching {@link EnabledGradumEventTypes} flag to `create` to turn one off.
         */
        static defaultProperties = {
            model: GradumEventManagerModel,
            operators: [
                GradumEventManagerKeyOperator,
                GradumEventManagerWheelOperator,
                GradumEventManagerPointerOperator,
                GradumEventManagerDispatchOperator
            ],
            handlers: GradumEventManagerUtilsHandler,
            keyEventsEnabled: true,
            wheelEventsEnabled: true,
            mouseEventsEnabled: true,
            touchEventsEnabled: true,
            clickEventsEnabled: true,
            dragEventsEnabled: true,
            moveEventsEnabled: true,
        };
        keyOperator = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _keyOperator_initializers, void 0));
        wheelOperator = (__runInitializers(this, _keyOperator_extraInitializers), __runInitializers(this, _wheelOperator_initializers, void 0));
        pointerOperator = (__runInitializers(this, _wheelOperator_extraInitializers), __runInitializers(this, _pointerOperator_initializers, void 0));
        dispatchOperator = (__runInitializers(this, _pointerOperator_extraInitializers), __runInitializers(this, _dispatchOperator_initializers, void 0));
        /**
         * @description The currently identified input device. It is not 100% accurate, especially when differentiating
         * between mouse and trackpad.
         */
        inputDevice = (__runInitializers(this, _dispatchOperator_extraInitializers), __runInitializers(this, _inputDevice_initializers, void 0));
        /**
         * @readonly
         * @description Fired whenever the identified input device changes.
         */
        onInputDeviceChange = (__runInitializers(this, _inputDevice_extraInitializers), __runInitializers(this, _onInputDeviceChange_initializers, void 0));
        /**
         * @readonly
         * @description The pointer button or input mode currently in use.
         */
        currentClick = (__runInitializers(this, _onInputDeviceChange_extraInitializers), __runInitializers(this, _currentClick_initializers, void 0));
        /**
         * @readonly
         * @description The keyboard keys currently held down.
         */
        currentKeys = (__runInitializers(this, _currentClick_extraInitializers), __runInitializers(this, _currentKeys_initializers, void 0));
        /**
         * @readonly
         * @description Fired when the tool held by a click mode changes, with the previous tool, the new
         * tool, and the mode.
         */
        onToolChange = (__runInitializers(this, _currentKeys_extraInitializers), __runInitializers(this, _onToolChange_initializers, void 0));
        /**
         * @description Whether events fired by this manager compute scaled positions. Assign a callback to
         * decide per event.
         */
        authorizeEventScaling = (__runInitializers(this, _onToolChange_extraInitializers), __runInitializers(this, _authorizeEventScaling_initializers, void 0));
        /**
         * @description Converts a screen position into document space for every event this manager fires.
         * Set it so events stay correct under a panned or zoomed canvas.
         */
        scaleEventPosition = (__runInitializers(this, _authorizeEventScaling_extraInitializers), __runInitializers(this, _scaleEventPosition_initializers, void 0));
        /**
         * @description How far, in pixels, a pointer must travel before the interaction counts as a drag
         * rather than a click. Defaults to `10`.
         */
        moveThreshold = (__runInitializers(this, _scaleEventPosition_extraInitializers), __runInitializers(this, _moveThreshold_initializers, void 0));
        /**
         * @description How long, in milliseconds, a pointer must be held still before a long press fires.
         * Defaults to `500`.
         */
        longPressDuration = (__runInitializers(this, _moveThreshold_extraInitializers), __runInitializers(this, _longPressDuration_initializers, void 0));
        /**
         * @constructor
         * @description Create an event manager and register it in {@link GradumEventManager.allManagers}.
         * The first one created becomes {@link GradumEventManager.instance}.
         */
        constructor() {
            super();
            __runInitializers(this, _longPressDuration_extraInitializers);
            GradumEventManager.managers.push(this);
        }
        /**
         * @function initialize
         * @description Start listening to pointer input on the document and clear any lock. Called
         * automatically by the element lifecycle.
         */
        initialize() {
            super.initialize();
            this.unlock();
            document.addEventListener("pointerdown", this.pointerOperator.pointerDown, { passive: false });
            document.addEventListener("pointermove", this.pointerOperator.pointerMove, { passive: false });
            document.addEventListener("pointerup", this.pointerOperator.pointerUp, { passive: false });
            document.addEventListener("pointercancel", this.pointerOperator.pointerCancel, { passive: false });
            //TODO
            this.dispatchOperator.setupCustomDispatcher("pointerdown");
        }
        /**
         * @description Whether keyboard input is listened to and turned into {@link GradumKeyEvent}s. Setting it
         * to `false` reverts key handling to the native event names.
         */
        set keyEventsEnabled(value) {
            if (value) {
                document.addEventListener("keydown", this.keyOperator.keyDown);
                document.addEventListener("keyup", this.keyOperator.keyUp);
            }
            else {
                document.removeEventListener("keydown", this.keyOperator.keyDown);
                document.removeEventListener("keyup", this.keyOperator.keyUp);
            }
            this.applyAndHookEvents(GradumKeyEventName, DefaultKeyEventName, value);
        }
        /**
         * @description Whether wheel input is listened to and turned into {@link GradumWheelEvent}s. Setting it to
         * `false` reverts wheel handling to the native event names.
         */
        set wheelEventsEnabled(value) {
            if (value)
                document.body.addEventListener("wheel", this.wheelOperator.wheel, { passive: false });
            else
                document.body.removeEventListener("wheel", this.wheelOperator.wheel);
            this.applyAndHookEvents(GradumWheelEventName, DefaultWheelEventName, value);
        }
        /**
         * @description Whether pointer movement produces Gradum move events. Setting it to `false` reverts move
         * handling to the native event names.
         */
        set moveEventsEnabled(value) {
            this.applyAndHookEvents(GradumMoveEventName, DefaultMoveEventName, value);
        }
        /**
         * @description Whether mouse input is processed. Setting it to `false` reverts mouse handling to the native
         * event names.
         */
        set mouseEventsEnabled(value) {
            //TODO
            // if (value) {
            //     doc.on("pointerdown", this.pointerOperator.pointerDown, {passive: false, propagate: true});
            //     doc.on("pointermove", this.pointerOperator.pointerMove, {passive: false, propagate: true});
            //     doc.on("pointerup", this.pointerOperator.pointerUp, {passive: false, propagate: true});
            //     doc.on("pointercancel", this.pointerOperator.pointerCancel, {passive: false, propagate: true});
            // } else {
            //     doc.removeListener("mousedown", this.pointerOperator.pointerDown);
            //     doc.removeListener("mousemove", this.pointerOperator.pointerMove);
            //     doc.removeListener("mouseup", this.pointerOperator.pointerUp);
            //     doc.removeListener("mouseleave", this.pointerOperator.pointerLeave);
            // }
        }
        /**
         * @description Whether touch input is processed. Setting it to `false` reverts touch handling to the native
         * event names.
         */
        set touchEventsEnabled(value) {
            // if (value) {
            //     doc.on("touchstart", this.pointerOperator.pointerDown, {passive: false, propagate: true});
            //     doc.on("touchmove", this.pointerOperator.pointerMove, {passive: false, propagate: true});
            //     doc.on("touchend", this.pointerOperator.pointerUp, {passive: false, propagate: true});
            //     doc.on("touchcancel", this.pointerOperator.pointerUp, {passive: false, propagate: true});
            // } else {
            //     doc.removeListener("touchstart", this.pointerOperator.pointerDown);
            //     doc.removeListener("touchmove", this.pointerOperator.pointerMove);
            //     doc.removeListener("touchend", this.pointerOperator.pointerUp);
            //     doc.removeListener("touchcancel", this.pointerOperator.pointerUp);
            // }
        }
        /**
         * @description Whether click, click start/end, and long-press events fire. Setting it to `false` reverts
         * click handling to the native event names.
         */
        set clickEventsEnabled(value) {
            this.applyAndHookEvents(GradumClickEventName, DefaultClickEventName, value);
        }
        /**
         * @description Whether drag and drag start/end events fire. Setting it to `false` reverts drag handling to
         * the native event names.
         */
        set dragEventsEnabled(value) {
            this.applyAndHookEvents(GradumDragEventName, DefaultDragEventName, value);
        }
        /*
         *
         *
         * State and lock management
         *
         *
         *
         */
        /**
         * @function lock
         * @description Temporarily override the manager's state on behalf of one node, for the duration of
         * an interaction. Use it to impose settings mid-gesture — suppressing native touch scrolling while a
         * drag is in flight, say — then call {@link GradumEventManager.unlock} to hand them back. Any
         * existing lock is released first, so locks do not nest.
         * @param {Node} origin - The node establishing the lock.
         * @param {GradumEventManagerStateProperties} value - The state to impose while the lock is held.
         */
        lock(origin, value) {
            this.unlock();
            this.model.lockState.lockOrigin = origin;
            for (const key in value)
                this.model.lockState[key] = value[key];
        }
        /**
         * @function unlock
         * @description Release the current lock, so the manager's own state applies again.
         */
        unlock() {
            this.model.lockState = { lockOrigin: document.body };
        }
        /**
         * @description Whether the manager is processing input. Reading combines the manager's own setting
         * with any active lock, so a lock can disable it without overwriting the underlying value; assigning
         * changes only the manager's own setting.
         */
        get enabled() {
            return this.model.state.enabled && (this.model.lockState.enabled ?? true);
        }
        set enabled(value) {
            this.model.state.enabled = value;
        }
        /**
         * @description Whether wheel input has its native default suppressed, blocking browser page zoom and
         * scroll. Combines the manager's setting with any active lock, as {@link GradumEventManager.enabled} does.
         */
        get preventDefaultWheel() {
            return this.model.state.preventDefaultWheel && (this.model.lockState.preventDefaultWheel ?? true);
        }
        set preventDefaultWheel(value) {
            this.model.state.preventDefaultWheel = value;
        }
        /**
         * @description Whether mouse input has its native default suppressed. Combines the manager's setting
         * with any active lock, as {@link GradumEventManager.enabled} does.
         */
        get preventDefaultMouse() {
            return this.model.state.preventDefaultMouse && (this.model.lockState.preventDefaultMouse ?? true);
        }
        set preventDefaultMouse(value) {
            this.model.state.preventDefaultMouse = value;
        }
        /**
         * @description Whether touch input has its native default suppressed, blocking native scrolling and
         * pinch-zoom. Combines the manager's setting with any active lock, as
         * {@link GradumEventManager.enabled} does.
         */
        get preventDefaultTouch() {
            return this.model.state.preventDefaultTouch && (this.model.lockState.preventDefaultTouch ?? true);
        }
        set preventDefaultTouch(value) {
            this.model.state.preventDefaultTouch = value;
        }
        /**
         * @description All three prevent-default settings at once. *Note: the getter and setter are not
         * symmetric — reading gives `true` when **any** of wheel, mouse, or touch is suppressed, while
         * assigning sets **all three** to the given value.*
         */
        get preventDefaults() {
            return this.preventDefaultMouse || this.preventDefaultTouch || this.preventDefaultWheel;
        }
        set preventDefaults(value) {
            this.model.state.preventDefaultWheel = value;
            this.model.state.preventDefaultMouse = value;
            this.model.state.preventDefaultTouch = value;
        }
        /*
         *
         *
         * Tool management
         *
         *
         *
         */
        /**
         * @readonly
         * @description Every registered tool instance, across all tool names, flattened into one array.
         */
        get toolsArray() {
            const array = [];
            for (const tools of this.model.tools.values())
                array.push(...tools.toArray());
            return array;
        }
        /**
         * @function getCurrentTool
         * @description Get the tool instance currently held by a click mode.
         * @param {ClickMode} [mode=this.model.currentClick] - The click mode to read. Defaults to the mode
         * currently in use.
         * @returns {Node} The tool held by that mode, or `undefined` if it holds none.
         */
        getCurrentTool(mode = this.model.currentClick) {
            return this.model.currentTools.get(mode);
        }
        /**
         * @function getCurrentTools
         * @description Get every instance sharing the name of the tool currently held by a click mode. Use
         * it when several elements — toolbar buttons in different places, say — represent the same tool.
         * @param {ClickMode} [mode=this.model.currentClick] - The click mode to read. Defaults to the mode
         * currently in use.
         * @returns {Node[]} All instances of that tool, or an empty array if the mode holds none.
         */
        getCurrentTools(mode = this.model.currentClick) {
            return this.getToolsByName(this.getCurrentToolName(mode));
        }
        /**
         * @function getCurrentToolName
         * @description Get the name of the tool currently held by a click mode.
         * @param {ClickMode} [mode=this.model.currentClick] - The click mode to read. Defaults to the mode
         * currently in use.
         * @returns {ToolType} The tool's name, or `undefined` if the mode holds none.
         */
        getCurrentToolName(mode = this.model.currentClick) {
            return this.getToolName(this.getCurrentTool(mode));
        }
        /**
         * @function getToolName
         * @description Get the name a tool instance is registered under.
         * @param {Node} tool - The tool instance to look up.
         * @returns {ToolType} The registered name, or `undefined` if the node is not a registered tool.
         */
        getToolName(tool) {
            for (const [toolName, weakSet] of this.model.tools.entries()) {
                if (weakSet.has(tool))
                    return toolName;
            }
        }
        /**
         * @function getSimilarTools
         * @description Get every instance registered under the same name as the given tool, including the
         * tool itself.
         * @param {Node} tool - The tool instance to match against.
         * @returns {Node[]} All instances sharing its name, or an empty array if it is not registered.
         */
        getSimilarTools(tool) {
            for (const [toolName, weakSet] of this.model.tools.entries()) {
                if (weakSet.has(tool))
                    return weakSet.toArray();
            }
            return [];
        }
        /**
         * @function getToolsByName
         * @description Get every tool instance registered under a name.
         * @param {ToolType} name - The tool name to look up.
         * @returns {Node[]} All instances registered under that name, or an empty array if there are none.
         */
        getToolsByName(name) {
            return this.model.tools.get(name)?.toArray() || [];
        }
        /**
         * @function getToolByName
         * @description Get a single tool instance registered under a name. Pass a predicate to choose among
         * several instances.
         * @param {ToolType} name - The tool name to look up.
         * @param {(tool: Node) => boolean} [predicate] - Chooses which instance to return. Without it, the
         * first registered instance is returned.
         * @returns {Node} The matching instance, or `undefined` if there is none.
         */
        getToolByName(name, predicate) {
            const tools = this.getToolsByName(name);
            return predicate ? tools?.find(predicate) : tools?.[0];
        }
        /**
         * @function getToolsByKey
         * @description Get every tool instance bound to a keyboard key.
         * @param {string} key - The key the tool is mapped to.
         * @returns {Node[]} All instances bound to that key, or an empty array if the key maps to nothing.
         */
        getToolsByKey(key) {
            const toolName = this.model.mappedKeysToTool.get(key);
            if (!toolName)
                return [];
            return this.getToolsByName(toolName);
        }
        /**
         * @function getToolByKey
         * @description Get a single tool instance bound to a keyboard key. Pass a predicate to choose among
         * several instances.
         * @param {string} key - The key the tool is mapped to.
         * @param {(tool: Element) => boolean} [predicate] - Chooses which instance to return. Without it, the
         * first one is returned.
         * @returns {Node} The matching instance, or `undefined` if there is none.
         */
        getToolByKey(key, predicate) {
            const tools = this.getToolsByKey(key);
            return predicate ? tools?.find(predicate) : tools?.[0];
        }
        /**
         * @function addTool
         * @description Register a tool instance under a name, so the manager can make it current and find it
         * again. Several instances may share one name.
         * @param {ToolType} toolName - The name to register the instance under.
         * @param {Node} tool - The tool instance.
         * @param {string} [key] - A keyboard key that selects this tool when pressed.
         */
        addTool(toolName, tool, key) {
            if (!this.model.tools.has(toolName))
                this.model.tools.set(toolName, new GradumWeakSet());
            const tools = this.model.tools.get(toolName);
            if (!tools.has(tool))
                tools.add(tool);
            if (key)
                this.model.mappedKeysToTool.set(key, toolName);
        }
        /**
         * @function setTool
         * @description Make a tool the current one for a click mode, so interactions in that mode are
         * attributed to it. The previously held tool is deselected and deactivated first, and
         * {@link GradumEventManager.onToolChange} fires once the swap is done. Passing a tool that is not
         * registered with this manager does nothing.
         * @param {Node} tool - The tool instance to make current. Pass `undefined` to clear the mode.
         * @param {ClickMode} type - The click mode to bind the tool to.
         * @param {SetToolOptions} [options={}] - Whether to select and activate the tool, and whether it also
         * becomes the tool for `ClickMode.none`.
         */
        setTool(tool, type, options = {}) {
            if (!isUndefined(tool) && !$(tool).isTool(this))
                return;
            gradum(options).applyDefaults({ select: true, activate: true, setAsNoAction: type == ClickMode.left });
            //Get previous tool
            const previousTool = this.model.currentTools.get(type);
            if (previousTool) {
                //Return if it's the same
                if (previousTool === tool)
                    return;
                //Deselect and deactivate previous tool
                this.getSimilarTools(previousTool).forEach(element => {
                    if (options.select)
                        gradum(element).selected = false;
                    if (options.activate)
                        this.model.utils.activateTool(element, this.getToolName(previousTool), false);
                });
            }
            //Select new tool (and maybe set it as the tool for no click mode)
            this.model.currentTools.set(type, tool);
            if (options.setAsNoAction)
                this.model.currentTools.set(ClickMode.none, tool);
            //Select and activate the tool
            this.getSimilarTools(tool).forEach(element => {
                if (options.activate)
                    this.model.utils.activateTool(element, this.getToolName(tool), true);
                if (options.select)
                    gradum(element).selected = true;
            });
            //Fire tool changed
            this.onToolChange.fire(previousTool, tool, type);
        }
        /**
         * @function setToolByKey
         * @description Make the tool bound to a keyboard key current for `ClickMode.key`. The tool is
         * activated but not visually selected.
         * @param {string} key - The key whose tool should become current.
         * @returns {boolean} Whether a tool was bound to that key and therefore set.
         */
        setToolByKey(key) {
            const toolName = this.model.mappedKeysToTool.get(key);
            if (!toolName)
                return false;
            this.setTool(this.getToolByName(toolName), ClickMode.key, { select: false });
            return true;
        }
        /*
         *
         *
         * Utils
         *
         *
         */
        /**
         * @function setupCustomDispatcher
         * @description Start dispatching an additional event type through the Gradum two-pass dispatch, so
         * tool behaviors and interactor listeners receive it like any built-in Gradum event. Registering the
         * same type twice is a no-op.
         * @param {string} type - The event type to dispatch.
         */
        setupCustomDispatcher(type) {
            return this.dispatchOperator.setupCustomDispatcher(type);
        }
        /**
         * @protected
         * @function applyAndHookEvents
         * @description Switch a family of events between its Gradum names and its native names, and hook or
         * unhook the dispatcher for each. Backs the `*EventsEnabled` setters.
         * @param {Record<string, string>} gradumEventNames - The Gradum names for this family.
         * @param {Record<string, string>} defaultEventNames - The native names to fall back to.
         * @param {boolean} applyGradumEvents - Whether to use the Gradum names and hook the dispatcher, or
         * revert to the native names and unhook it.
         */
        applyAndHookEvents(gradumEventNames, defaultEventNames, applyGradumEvents) {
            this.model.utils.applyEventNames(applyGradumEvents ? gradumEventNames : defaultEventNames);
            for (const name of Object.values(applyGradumEvents ? gradumEventNames : defaultEventNames)) {
                if (applyGradumEvents)
                    this.dispatchOperator.setupCustomDispatcher(name);
                else
                    this.dispatchOperator.removeCustomDispatcher(name);
            }
        }
        /**
         * @function destroy
         * @description Shut the manager down: disable every event family, unhook its dispatchers, and clear
         * the tool-change subscribers. Registered tools are left in place.
         * @returns {this} Itself, allowing for method chaining.
         */
        destroy() {
            this.keyEventsEnabled = false;
            this.wheelEventsEnabled = false;
            this.mouseEventsEnabled = false;
            this.touchEventsEnabled = false;
            this.dragEventsEnabled = false;
            this.clickEventsEnabled = false;
            this.onToolChange.clear();
            return this;
        }
    };
})();
define(GradumEventManager);

/**
 * @class Listener
 * @group Components
 * @category Data Structures
 *
 * @template {Node} TargetType - The type of the event target.
 * @template {ListenerCallback<TargetType>} CallbackType - The type of the callback executed by this listener.
 * @description Object representing an event listener, storing its metadata (type, target, toolName, options,
 * manager) and providing utilities to execute and match it.
 */
class Listener {
    /** @description Event type (e.g., `"click"`, `"pointermove"`). */
    type;
    /** @description Target node this listener is associated with. */
    target;
    /** @description Name of the tool this listener is bound to (if any). */
    toolName;
    /** @description Callback provided by the user. */
    callback;
    /**
     * @description Bundled listener that adapts native events to the {@link ListenerCallback} signature.
     */
    bundledListener;
    /** @description Listener options used for registration and additional behaviors.*/
    options;
    /** @description Associated event manager used to coordinate listener execution. */
    manager;
    /** @description Last animation frame index during which this listener executed. */
    lastExecutionFrame;
    /** @description Last timestamp (ms) at which this listener executed. */
    lastExecutionTime;
    /**
     * @constructor
     * @description Create a listener from its configuration. A {@link GradumSelector} passed as `target`
     * is unwrapped to the element it wraps.
     * @param {ListenerProperties<TargetType, CallbackType>} properties - Listener configuration.
     */
    constructor(properties) {
        if (properties.target instanceof GradumSelector)
            properties.target = properties.target.element;
        this.type = properties.type;
        this.target = properties.target;
        this.toolName = properties.toolName;
        this.callback = properties.callback;
        this.bundledListener = (e) => this.callback(e, this.target);
        this.options = properties.options ?? {};
        this.manager = properties.manager ?? GradumEventManager.instance;
    }
    /**
     * @function execute
     * @description Executes the listener using its bundled signature.
     * @param {Event} e - Event passed to the callback.
     * @returns {Propagation} Propagation returned by the callback.
     */
    execute(e) {
        return this.bundledListener(e);
    }
    /**
     * @function executeOn
     * @description Executes the underlying callback on an explicit target.
     * @param {Event} e - Event passed to the callback.
     * @param {TargetType} target - Target node.
     * @param {...any[]} args - Additional arguments forwarded to the callback.
     * @returns {any} Whatever the callback returns (typically {@link Propagation}).
     */
    executeOn(e, target, ...args) {
        return this.callback(e, target, ...args);
    }
    /**
     * @function match
     * @description Checks whether this listener matches a subset of properties.
     * @param {MatchListenerProperties<TargetType, CallbackType>} [properties={}] - Properties to match against.
     * @returns {boolean} Whether this listener matches.
     */
    match(properties = {}) {
        for (let [key, value] of Object.entries(properties)) {
            if (key === "target" && value instanceof GradumSelector)
                value = value.element;
            if (key === "optionsToSkip")
                continue;
            if (value === undefined) {
                if (key === "toolName" && this.toolName !== undefined)
                    return false;
                continue;
            }
            if (typeof value === "object") {
                if (typeof this[key] !== "object")
                    return false;
                for (const [subKey, subValue] of Object.entries(value)) {
                    if (key === "options" && properties.optionsToSkip?.includes(subKey))
                        continue;
                    if (subValue === undefined)
                        continue;
                    if (this[key][subKey] !== subValue)
                        return false;
                }
                continue;
            }
            if (this[key] !== value)
                return false;
        }
        return true;
    }
}

/**
 * @class ListenerSet
 * @group Components
 * @category Data Structures
 *
 * @template {Node} TargetType - The type of the event target.
 * @template {ListenerCallback<TargetType>} CallbackType - The type of the callback executed by this listener.
 * @description Collection of {@link Listener} instances indexed by event type.
 * Provides helpers to add/remove/query listeners and to remove listeners matching criteria.
 */
class ListenerSet {
    /**
     * @description Map from event type to a set of listeners registered for that type.
     */
    listeners = new Map();
    /**
     * @description Flattened array of all listeners in the set.
     * @readonly
     */
    get listenersArray() {
        const listeners = [];
        for (const set of this.listeners.values()) {
            for (const entry of set.values()) {
                listeners.push(entry);
            }
        }
        return listeners;
    }
    addListener(value) {
        if (typeof value === "object" && !(value instanceof Listener))
            value = new Listener(value);
        if (!value.type)
            return;
        if (!this.listeners.has(value.type))
            this.listeners.set(value.type, new Set());
        this.listeners.get(value.type).add(value);
    }
    removeListener(value) {
        if (!value)
            return;
        if (value instanceof Listener)
            this.listeners.get(value.type)?.delete(value);
        else {
            const listener = this.listenersArray.find(listener => listener.callback === value);
            if (!listener)
                return;
            this.listeners.get(listener.type)?.delete(listener);
        }
    }
    /**
     * @function removeMatchingListeners
     * @description Removes all listeners that match the provided properties (see {@link Listener.match}).
     * @param {MatchListenerProperties<TargetType, CallbackType>} [matchingProperties={}] - Properties to match.
     */
    removeMatchingListeners(matchingProperties = {}) {
        this.getListeners(matchingProperties).forEach((listener) => {
            // listener.target?.removeEventListener(listener.type, listener.bundledListener, listener.options);
            this.removeListener(listener);
        });
    }
    /**
     * @function getListeners
     * @description Returns all listeners matching the provided properties (see {@link Listener.match}).
     * @param {MatchListenerProperties<TargetType, CallbackType>} [matchingProperties={}] - Properties to match.
     * @returns {Listener[]} Matching listeners.
     */
    getListeners(matchingProperties = {}) {
        return this.listenersArray.filter(listener => listener.match(matchingProperties));
    }
    /**
     * @function getListenersByType
     * @description Returns the set of listeners registered for the given event type.
     * @param {string} type - Event type.
     * @returns {Set<Listener<TargetType, CallbackType>>} Set of listeners for that type.
     */
    getListenersByType(type) {
        if (!type || !this.listeners.has(type))
            return new Set();
        return this.listeners.get(type);
    }
}

/**
 * @internal
 * @class EventFunctionsUtils
 * @description Shared helpers and per-element state behind the event functions on {@link GradumSelector}.
 */
class EventFunctionsUtils {
    dataMap = new WeakMap;
    data(element) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (!element || !this.dataMap.has(element)) {
            const entry = {
                boundListeners: new ListenerSet(),
                preventDefaultListeners: {},
            };
            if (element)
                this.dataMap.set(element, entry);
        }
        return this.dataMap.get(element);
    }
    getBoundListenersSet(element) {
        let set = this.data(element).boundListeners;
        if (!set) {
            set = new ListenerSet();
            this.data(element).boundListeners = set;
        }
        return set;
    }
    getBoundListeners(properties) {
        if (!properties.target)
            return [];
        if (!properties.manager)
            properties.manager = GradumEventManager.instance;
        return this.getBoundListenersSet(properties.target).getListeners({
            ...properties,
            optionsToSkip: ["checkConstrainers", "solveConstrainers"]
        });
    }
    getPreventDefaultListeners(element) {
        let map = this.data(element).preventDefaultListeners;
        if (!map) {
            map = {};
            this.data(element).preventDefaultListeners = map;
        }
        return map;
    }
    bypassManager(element, eventManager, bypassResults) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (!element)
            return;
        if (typeof bypassResults == "boolean")
            eventManager.lock(element, {
                enabled: bypassResults,
                preventDefaultWheel: bypassResults,
                preventDefaultMouse: bypassResults,
                preventDefaultTouch: bypassResults
            });
        else
            eventManager.lock(element, {
                enabled: bypassResults.enabled ?? false,
                preventDefaultWheel: bypassResults.preventDefaultWheel ?? false,
                preventDefaultMouse: bypassResults.preventDefaultMouse ?? false,
                preventDefaultTouch: bypassResults.preventDefaultTouch ?? false,
            });
    }
    //TODO FIX IDK
    processPropagation(currentPropagation, storedPropagation = Propagation.propagate, defaultPropagation = Propagation.stopPropagation) {
        const orderedValues = [
            Propagation.propagate,
            Propagation.stopPropagation,
            Propagation.stopImmediatePropagation
        ];
        if (!orderedValues.includes(currentPropagation))
            currentPropagation = defaultPropagation;
        return orderedValues.indexOf(currentPropagation) <= orderedValues.indexOf(storedPropagation)
            ? storedPropagation : currentPropagation;
    }
}

const utils$5 = new EventFunctionsUtils();
/**
 * @internal
 * @function setupEventFunctions
 * @description Install the event functions (`on`, `onTool`, `executeAction`, `preventDefault`, ...) onto the
 * {@link GradumSelector} prototype. Called once by
 * {@link gradumify}; the matching `exclude` option skips it.
 */
function setupEventFunctions() {
    /**
     * @description Initializes a `boundListeners` set in the Node prototype, that will hold all the element's bound
     * listeners.
     */
    Object.defineProperty(GradumSelector.prototype, "boundListeners", {
        get: function () {
            return utils$5.getBoundListenersSet(this);
        },
        configurable: true,
        enumerable: true
    });
    /**
     * @description If you want the element to bypass the event manager and allow native events to seep through,
     * you can set this field to a predicate that defines when to bypass the manager.
     * @param {Event} e The event.
     */
    Object.defineProperty(GradumSelector.prototype, "bypassManagerOn", {
        get: function () {
            return utils$5.data(this)["bypassCallback"];
        },
        set: function (value) {
            utils$5.data(this)["bypassCallback"] = value;
        },
        configurable: true,
        enumerable: true
    });
    /**
     * @description Adds an event listener to the element.
     * @param {string} type - The type of the event.
     * @param {string} toolName - The name of the tool. Set to null or undefined to bind a listener not tied to a tool.
     * @param {ListenerCallback} listener - The function that receives a notification.
     * @param {ListenerOptions} [options] - An options object that specifies characteristics
     * about the event listener.
     * @param {GradumEventManager} manager - The associated event manager. Defaults to the first created manager,
     * or a new instantiated one if none already exist.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.onTool = function _onTool(type, toolName, listener, options, manager = GradumEventManager.instance) {
        if (this.hasToolListener(type, toolName, listener, manager))
            return this;
        manager.setupCustomDispatcher?.(type);
        utils$5.getBoundListenersSet(this).addListener({
            target: this,
            type,
            toolName,
            callback: listener,
            options,
            manager
        });
        return this;
    };
    /**
     * @description Adds an event listener to the element.
     * @param {string} type - The type of the event.
     * @param {ListenerCallback} listener - The function that receives a notification.
     * @param {ListenerOptions} [options] - An options object that specifies characteristics
     * about the event listener.
     * @param {GradumEventManager} manager - The associated event manager. Defaults to the first created manager,
     * or a new instantiated one if none already exist.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.on = function _on(type, listener, options, manager = GradumEventManager.instance) {
        return this.onTool(type, undefined, listener, options, manager);
    };
    /**
     * @description Execute the listeners bound on this element for the given `type` and `toolName`. Simulates
     * firing a `type` event on the element with `toolName` active.
     * @param {string} type - The type of the event.
     * @param {string} toolName - The name of the tool. Set to null or undefined to fire listeners not bound
     * to a tool.
     * @param {Event} event - The event to pass as parameter to the listeners.
     * @param {ListenerOptions} [options] - Options object that specifies characteristics about the event
     * listeners to fire.
     * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created
     * manager, or a new instantiated one if none already exist.
     * @returns {Propagation} Whether the caller should keep walking the event path, stop the current loop,
     * or stop both loops.
     */
    GradumSelector.prototype.executeAction = function _executeAction(type, toolName, event, options, manager = GradumEventManager.instance) {
        if (!type)
            return Propagation.propagate;
        if (!options)
            options = {};
        gradum(options).applyDefaults({ checkConstrainers: true, solveConstrainers: true });
        const activeTool = toolName ?? manager.getCurrentToolName();
        const checkedConstrainersFor = new Set();
        const checkedObjectsToolMap = new Map();
        const firedListeners = new Set();
        let propagation = Propagation.propagate;
        if (this.bypassManagerOn)
            utils$5.bypassManager(this, manager, this.bypassManagerOn(event));
        //Whether the event started inside a subtree that opted out of the given tool. Walks up from the
        //event's target, crossing shadow boundaries, so ignoring a tool on a component also covers the inner
        //nodes a click actually lands on. Memoized: executeAction is called once per element of the path.
        const originIgnoresCache = new Map();
        const originIgnoresTool = (tool) => {
            if (!tool)
                return false;
            if (originIgnoresCache.has(tool))
                return originIgnoresCache.get(tool);
            let ignored = false;
            let node = (event?.target ?? undefined);
            while (node) {
                if (gradum(node).isToolIgnored(tool, type, manager)) {
                    ignored = true;
                    break;
                }
                node = node.parentNode ?? node.host;
            }
            originIgnoresCache.set(tool, ignored);
            return ignored;
        };
        const checkConstrainers = (target, tool) => {
            if (!target)
                return;
            if (propagation === Propagation.stopImmediatePropagation)
                return;
            if (!checkedConstrainersFor.has(target)) {
                checkedConstrainersFor.add(target);
                if (tool)
                    checkedObjectsToolMap.set(target, tool);
                if (options.checkConstrainers) {
                    const check = this.checkConstrainersForEvent({
                        event, manager,
                        toolName: tool,
                        eventType: type,
                        eventTarget: target,
                        eventOptions: options,
                    });
                    if (!check)
                        propagation = Propagation.stopImmediatePropagation;
                }
            }
            checkConstrainers(target.parentNode, tool);
        };
        const runListeners = (target, tool) => {
            if (tool && (gradum(target).isToolIgnored(tool, type, manager) || originIgnoresTool(tool)))
                return;
            const ts = target instanceof GradumSelector ? target : gradum(target);
            const boundSet = utils$5.getBoundListenersSet(target);
            const entries = utils$5.getBoundListeners({ target, type, toolName: tool, options, manager });
            checkConstrainers(target, tool);
            if (entries.length === 0)
                return;
            if (propagation === Propagation.stopImmediatePropagation)
                return;
            for (const entry of entries) {
                if (firedListeners.has(entry))
                    continue;
                try {
                    propagation = utils$5.processPropagation(entry.executeOn(event, ts), propagation);
                }
                finally {
                    firedListeners.add(entry);
                    if (entry.options?.once)
                        boundSet.removeListener(entry);
                }
                if (propagation === Propagation.stopImmediatePropagation)
                    return;
            }
        };
        const applyTool = (target, tool) => {
            if (options.capture || !tool)
                return;
            if (gradum(target).isToolIgnored(tool, type, manager) || originIgnoresTool(tool))
                return;
            checkConstrainers(target, tool);
            if (!this.hasToolBehavior(type, tool, manager))
                return;
            if (propagation === Propagation.stopImmediatePropagation)
                return;
            propagation = gradum(target).applyTool(tool, type, event, manager);
        };
        const main = () => {
            if (activeTool) {
                runListeners(this, activeTool);
                if (propagation !== Propagation.propagate)
                    return;
            }
            applyTool(this.element, activeTool);
            if (propagation !== Propagation.propagate)
                return;
            const embeddedTarget = this.getEmbeddedToolTarget(manager);
            const objectTools = this.getToolNames(manager);
            if (embeddedTarget && objectTools.length > 0) {
                for (const toolName of objectTools) {
                    runListeners(embeddedTarget, toolName);
                    if (propagation === Propagation.stopImmediatePropagation)
                        return;
                }
                if (propagation !== Propagation.propagate)
                    return;
                if (!options.capture)
                    for (const toolName of objectTools) {
                        applyTool(embeddedTarget, toolName);
                        if (propagation === Propagation.stopImmediatePropagation)
                            return;
                    }
                if (propagation !== Propagation.propagate)
                    return;
            }
            runListeners(this, undefined);
        };
        main();
        if (options.solveConstrainers)
            checkedConstrainersFor.forEach(entry => gradum(this).solveConstrainersForEvent({
                event,
                toolName: checkedObjectsToolMap.get(entry),
                eventType: type,
                eventTarget: entry,
                eventOptions: options,
                manager: manager
            }));
        return propagation;
    };
    /**
     * @description Checks if the given event listener is bound to the element (in its boundListeners list).
     * @param {string} type - The type of the event. Set to null or undefined to get all event types.
     * @param {(e: Event, el: this) => void} listener - The function that receives a notification.
     * @param {GradumEventManager} manager - The associated event manager. Defaults to the first created manager,
     * or a new instantiated one if none already exist.
     * @returns {boolean} Whether the element has the given listener.
     */
    GradumSelector.prototype.hasListener = function _hasListener(type, listener, manager = GradumEventManager.instance) {
        return this.hasToolListener(type, undefined, listener, manager);
    };
    /**
     * @description Checks if the given event listener is bound to the element (in its boundListeners list).
     * @param {string} type - The type of the event. Set to null or undefined to get all event types.
     * @param {string} toolName - The name of the tool the listener is attached to. Set to null or undefined
     * to check for listeners not bound to a tool.
     * @param {(e: Event, el: this) => void} listener - The function that receives a notification.
     * @param {GradumEventManager} manager - The associated event manager. Defaults to the first created manager,
     * or a new instantiated one if none already exist.
     * @returns {boolean} Whether the element has the given listener.
     */
    GradumSelector.prototype.hasToolListener = function _hasToolListener(type, toolName, listener, manager = GradumEventManager.instance) {
        return utils$5.getBoundListeners({ target: this, callback: listener, type, toolName, manager }).length > 0;
    };
    /**
     * @description Checks if the element has bound listeners of the given type (in its boundListeners list).
     * @param {string} type - The type of the event. Set to null or undefined to get all event types.
     * @param {string} toolName - The name of the tool to consider (if any). Set to null or undefined
     * to check for listeners not bound to a tool.
     * @param {GradumEventManager} manager - The associated event manager. Defaults to the first created manager,
     * or a new instantiated one if none already exist.
     * @returns {boolean} Whether the element has the given listener.
     */
    GradumSelector.prototype.hasListenersByType = function _hasListenersByType(type, toolName, manager = GradumEventManager.instance) {
        return utils$5.getBoundListeners({ target: this, type, toolName, manager }).length > 0;
    };
    /**
     * @description Removes an event listener that is bound to the element (in its boundListeners list).
     * @param {string} type - The type of the event.
     * @param {(e: Event, el: this) => void} listener - The function that receives a notification.
     * @param {GradumEventManager} manager - The associated event manager. Defaults to the first created manager,
     * or a new instantiated one if none already exist.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.removeListener = function _removeListener(type, listener, manager = GradumEventManager.instance) {
        return this.removeToolListener(type, undefined, listener, manager);
    };
    /**
     * @description Removes an event listener that is bound to the element (in its boundListeners list).
     * @param {string} type - The type of the event.
     * @param {string} toolName - The name of the tool the listener is attached to. Set to null or undefined
     * to check for listeners not bound to a tool.
     * @param {(e: Event, el: this) => void} listener - The function that receives a notification.
     * @param {GradumEventManager} manager - The associated event manager. Defaults to the first created manager,
     * or a new instantiated one if none already exist.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.removeToolListener = function _removeToolListener(type, toolName, listener, manager = GradumEventManager.instance) {
        utils$5.getBoundListenersSet(this).removeMatchingListeners({ target: this, type, toolName, callback: listener, manager });
        return this;
    };
    /**
     * @description Removes all event listeners bound to the element (in its boundListeners list) assigned to the
     * specified type.
     * @param {string} type - The type of the event. Set to null or undefined to consider all types.
     * @param {string} toolName - The name of the tool associated (if any). Set to null or undefined
     * to check for listeners not bound to a tool.
     * @param {GradumEventManager} manager - The associated event manager. Defaults to the first created manager,
     * or a new instantiated one if none already exist.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.removeListenersByType = function _removeListenersByType(type, toolName, manager = GradumEventManager.instance) {
        utils$5.getBoundListenersSet(this).removeMatchingListeners({ target: this, type, toolName, manager });
        return this;
    };
    /**
     * @description Removes all event listeners bound to the element (in its boundListeners list).
     * @param {GradumEventManager} manager - The associated event manager. Defaults to the first created manager,
     * or a new instantiated one if none already exist.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.removeAllListeners = function _removeListeners(manager = GradumEventManager.instance) {
        utils$5.getBoundListenersSet(this).removeMatchingListeners({ manager });
        return this;
    };
    /**
     * @description Prevent default browser behavior on the provided event types. By default, all basic input events
     * will be processed.
     * @param {PreventDefaultOptions} options - An options object to customize the behavior of the function.
     */
    GradumSelector.prototype.preventDefault = function _preventDefault(options) {
        if (!options)
            options = {};
        const manager = options.manager ?? GradumEventManager.instance;
        const types = options.types ?? BasicInputEvents;
        const phase = options.phase ?? "capture";
        const stop = options.stop ?? false;
        utils$5.data(this.element).preventDefaultOn = options.preventDefaultOn
            ?? utils$5.data(this.element).preventDefaultOn ?? (() => true);
        const preventDefaultListeners = utils$5.getPreventDefaultListeners(this);
        if (options.clearPreviousListeners)
            for (const [type, listener] of Object.entries(preventDefaultListeners)) {
                this.removeListener(type, listener);
                delete preventDefaultListeners[type];
            }
        const shouldNotBePassive = new Set(NonPassiveEvents);
        for (const type of new Set(types)) {
            const handler = (event) => {
                if (!utils$5.data(this.element).preventDefaultOn(type, event))
                    return false;
                event.preventDefault?.();
                if (stop === "immediate")
                    event.stopImmediatePropagation?.();
                else if (stop === "stop")
                    event.stopPropagation?.();
                return true;
            };
            preventDefaultListeners[type] = handler;
            const options = {};
            if (phase === "capture")
                options.capture = true;
            if (shouldNotBePassive.has(type))
                options.passive = false;
            this.on(type, handler, options, manager);
        }
        return this;
    };
}

/**
 * @internal
 * @class StyleFunctionsUtils
 * @description Shared helpers and per-element state behind the style functions on {@link GradumSelector}.
 */
class StyleFunctionsUtils {
    dataMap = new WeakMap;
    data(element) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (!element)
            return {};
        if (!this.dataMap.has(element))
            this.dataMap.set(element, {});
        return this.dataMap.get(element);
    }
    setStyle(selector, attribute, value, instant = false, apply = true) {
        if (instant) {
            selector.element.style[attribute] = value.toString();
            return;
        }
        let pendingStyles = this.data(selector.element)["pendingStyles"];
        if (!pendingStyles || typeof pendingStyles !== "object") {
            pendingStyles = {};
            this.data(selector.element)["pendingStyles"] = pendingStyles;
        }
        pendingStyles[attribute] = value;
        if (apply)
            this.applyStyles(selector);
        return;
    }
    /**
     * @description Apply the pending styles to the element.
     */
    applyStyles(selector) {
        const pendingStyles = this.data(selector.element)["pendingStyles"];
        if (!pendingStyles || typeof pendingStyles !== "object")
            return;
        requestAnimationFrame(() => {
            for (const property in pendingStyles) {
                if (property == "cssText")
                    selector.element.style.cssText += ";" + pendingStyles["cssText"];
                else
                    selector.element.style[property] = pendingStyles[property];
            }
            this.data(selector.element)["pendingStyles"] = {};
        });
    }
}

const utils$4 = new StyleFunctionsUtils();
const selectedKey = Symbol("__selected__");
const selectedClass = Symbol("__selectedClass__");
const defaultSelectedClassesKey = Symbol("__default_selected_classes__");
/**
 * @internal
 * @function setupStyleFunctions
 * @description Install the style functions (`setStyle`, `setStyles`, `selected`, `closestRoot`, ...) onto the
 * {@link GradumSelector} prototype. Called once by
 * {@link gradumify}; the matching `exclude` option skips it.
 */
function setupStyleFunctions() {
    /**
     * @description The closest root to the element in the document (the closest ShadowRoot, or the document's head).
     */
    Object.defineProperty(GradumSelector.prototype, "closestRoot", {
        get: function () {
            let node = this.element;
            while (node) {
                if (node instanceof Element && node.shadowRoot)
                    return node.shadowRoot;
                node = node.parentElement;
            }
            return document.head;
        },
        configurable: false,
        enumerable: true
    });
    Object.defineProperty(GradumSelector.prototype, "selected", {
        get() {
            return !!this[selectedKey];
        },
        set(value) {
            const element = this.element;
            if (!element)
                return;
            if (element instanceof Element) {
                const prevClass = element[selectedClass];
                const nextClass = this["defaultSelectedClasses"] || "selected";
                element[selectedClass] = nextClass;
                if (prevClass && prevClass !== nextClass)
                    gradum(element).toggleClass(prevClass, false);
                gradum(element).toggleClass(nextClass, !!value);
            }
            element[selectedKey] = value;
            this.onSelected.fire(value);
        },
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(GradumSelector.prototype, "defaultSelectedClasses", {
        get: function () {
            return this[defaultSelectedClassesKey] ?? "";
        },
        set: function (value) {
            if (this.selected)
                gradum(this).toggleClass(this[defaultSelectedClassesKey], false);
            this[defaultSelectedClassesKey] = value;
            if (this.selected)
                gradum(this).toggleClass(value, true);
        },
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(GradumSelector.prototype, "onSelected", {
        get: function () {
            const data = utils$4.data(this);
            if (!data["onSelected"])
                data["onSelected"] = new Delegate();
            return data["onSelected"];
        },
        enumerable: true,
        configurable: true,
    });
    /**
     * @description Set a certain style attribute of the element to the provided value.
     * @param {keyof CSSStyleDeclaration} attribute - A string representing the style attribute to set.
     * @param {string | number} value - A string representing the value to set the attribute to.
     * @param {boolean} [instant=false] - If true, will set the fields directly. Otherwise, will set them on next
     * animation frame.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.setStyle = function _setStyle(attribute, value, instant = false) {
        if (!attribute || value == undefined)
            return this;
        if (!(this.element instanceof HTMLElement) && !(this.element instanceof SVGElement))
            return this;
        utils$4.setStyle(this, attribute, value, instant);
        return this;
    };
    /**
     * @description Set a certain style attribute of the element to the provided value.
     * @param {keyof CSSStyleDeclaration} attribute - A string representing the style attribute to set.
     * @param {string} value - A string representing the value to set the attribute to.
     * @param {string} [separator=", "] - The separator to use between the existing and new value.
     * @param {boolean} [instant=false] - If true, will set the fields directly. Otherwise, will set them on next
     * animation frame.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.appendStyle = function _appendStyle(attribute, value, separator = ", ", instant = false) {
        if (!attribute || value == undefined)
            return this;
        if (!(this.element instanceof HTMLElement) && !(this.element instanceof SVGElement))
            return this;
        const currentStyle = (this.element.style[attribute] || "");
        separator = currentStyle.length > 0 ? separator : "";
        utils$4.setStyle(this, attribute, currentStyle + separator + value, instant);
        return this;
    };
    /**
     * @description Parses and applies the given CSS to the element's inline styles.
     * @param {StylesType} styles - A CSS string of style attributes and their values, seperated by semicolons,
     * or an object of CSS properties. Use the css literal function for autocompletion.
     * @param {boolean} [instant=false] - If true, will set the fields directly. Otherwise, will set them on next
     * animation frame.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.setStyles = function _setStyles(styles, instant = false) {
        if (!styles || typeof styles == "number")
            return this;
        if (!(this.element instanceof HTMLElement) && !(this.element instanceof SVGElement))
            return this;
        let stylesObject = {};
        if (typeof styles === "object")
            stylesObject = styles;
        else if (typeof styles == "string") {
            styles.split(";").forEach(entry => {
                const [property, value] = entry.split(":").map(part => part.trim());
                if (!property || !value)
                    return;
                stylesObject[property] = value;
            });
        }
        Object.entries(stylesObject).forEach(([key, value]) => utils$4.setStyle(this, key, value, instant, false));
        if (!instant)
            utils$4.applyStyles(this);
        return this;
    };
}

/**
 * @internal
 * @class ToolFunctionsUtils
 * @description Shared helpers and per-element state behind the tool functions on {@link GradumSelector}.
 */
class ToolFunctionsUtils {
    elements = new WeakMap();
    tools = new WeakMap();
    getOrCreate(map, key, factory) {
        let value = map.get(key);
        if (!value) {
            value = factory();
            map.set(key, value);
        }
        return value;
    }
    getElementData(element, manager) {
        if (element instanceof GradumSelector)
            element = element.element;
        const es = this.getOrCreate(this.elements, element, () => new WeakMap());
        return this.getOrCreate(es, manager, () => ({
            tools: new Set(),
            ignoreAllTools: false,
            ignoredTools: new Map(),
            activationDelegates: new Map(),
            deactivationDelegates: new Map(),
        }));
    }
    getToolsData(manager, toolName) {
        const byTool = this.getOrCreate(this.tools, manager, () => new Map());
        return this.getOrCreate(byTool, toolName, () => ({
            behaviors: new ListenerSet()
        }));
    }
    getActivationDelegate(element, toolName, manager) {
        const map = this.getElementData(element, manager).activationDelegates;
        if (!map.get(toolName))
            map.set(toolName, new Delegate());
        return map.get(toolName);
    }
    getDeactivationDelegate(element, toolName, manager) {
        const map = this.getElementData(element, manager).deactivationDelegates;
        if (!map.get(toolName))
            map.set(toolName, new Delegate());
        return map.get(toolName);
    }
    saveTool(element, toolName, manager) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (!element)
            return;
        this.getElementData(element, manager).tools.add(toolName);
    }
    getToolNames(element, manager) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (!element)
            return [];
        return [...this.getElementData(element, manager).tools];
    }
    setEmbeddedToolTarget(element, target, manager) {
        if (target instanceof GradumSelector)
            target = target.element;
        if (!target)
            return;
        if (element instanceof GradumSelector)
            element = element.element;
        if (!element)
            return;
        this.getElementData(element, manager).embeddedTarget = target;
    }
    getEmbeddedToolTarget(element, manager) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (!element)
            return;
        return this.getElementData(element, manager).embeddedTarget;
    }
    addToolBehavior(toolName, type, callback, manager) {
        this.getToolsData(manager, toolName).behaviors?.addListener({ callback, type, toolName, manager });
    }
    getToolBehaviors(toolName, type, manager) {
        return this.getToolsData(manager, toolName).behaviors?.getListeners({ toolName, manager, type });
    }
    removeToolBehaviors(toolName, type, manager) {
        this.getToolsData(manager, toolName).behaviors?.removeMatchingListeners({ toolName, manager, type });
    }
    clearToolBehaviors(manager) {
        this.getOrCreate(this.tools, manager, () => new Map()).clear();
    }
    ignoreTool(element, toolName, type, ignore, manager) {
        const ignoredTools = this.getElementData(element, manager).ignoredTools;
        if (!type) {
            if (ignore)
                ignoredTools.set(toolName, "all");
            else
                ignoredTools.delete(toolName);
        }
        else {
            const ignoredTool = ignoredTools.get(toolName);
            if (!ignore) {
                if (ignoredTool instanceof Set)
                    ignoredTool.delete(type);
                return;
            }
            if (!(ignoredTool instanceof Set))
                ignoredTools.set(toolName, new Set());
            ignoredTools.get(toolName).add(type);
        }
    }
    isToolIgnored(element, toolName, type, manager) {
        const ignoredTool = this.getElementData(element, manager).ignoredTools?.get(toolName);
        if (!ignoredTool)
            return false;
        if (ignoredTool === "all" || !type)
            return true;
        return ignoredTool.has(type);
    }
    processPropagation(currentPropagation, storedPropagation = Propagation.propagate, defaultPropagation = Propagation.stopPropagation) {
        const orderedValues = [
            Propagation.propagate,
            Propagation.stopPropagation,
            Propagation.stopImmediatePropagation
        ];
        if (!orderedValues.includes(currentPropagation))
            currentPropagation = defaultPropagation;
        return orderedValues.indexOf(currentPropagation) <= orderedValues.indexOf(storedPropagation)
            ? storedPropagation : currentPropagation;
    }
}

const utils$3 = new ToolFunctionsUtils();
/**
 * @internal
 * @function setupToolFunctions
 * @description Install the tool functions (`makeTool`, `applyTool`, `embedTool`, ...) onto the
 * {@link GradumSelector} prototype. Called once by {@link gradumify}; the matching `exclude` option skips it.
 */
function setupToolFunctions() {
    /*
     *
     * Basic tool manipulation
     *
     */
    GradumSelector.prototype.makeTool = function _makeTool(toolName, options) {
        if (!toolName)
            return this;
        if (!options)
            options = {};
        if (!options.manager)
            options.manager = GradumEventManager.instance;
        options.manager.addTool(toolName, this.element, options.key);
        if (options.customActivation && typeof options.customActivation === "function") {
            options.customActivation(this, options.manager);
        }
        else {
            options.activationEvent ??= DefaultEventName.click;
            options.clickMode ??= ClickMode.left;
            this.on(options.activationEvent, () => {
                options.manager.setTool(this.element, options.clickMode);
                return Propagation.stopPropagation;
            }, undefined, options.manager);
        }
        utils$3.saveTool(this, toolName, options.manager);
        if (options.onActivate)
            utils$3.getActivationDelegate(this, toolName, options.manager).add(options.onActivate);
        if (options.onDeactivate)
            utils$3.getDeactivationDelegate(this, toolName, options.manager).add(options.onDeactivate);
        return this;
    };
    GradumSelector.prototype.isTool = function _isTool(manager = GradumEventManager.instance) {
        return utils$3.getToolNames(this.element, manager).length > 0;
    };
    GradumSelector.prototype.getToolNames = function _getToolName(manager = GradumEventManager.instance) {
        return utils$3.getToolNames(this.element, manager);
    };
    GradumSelector.prototype.getToolName = function _getToolName(manager = GradumEventManager.instance) {
        const toolNames = utils$3.getToolNames(this.element, manager);
        if (toolNames.length > 0)
            return toolNames[0];
    };
    /*
     *
     * Tool activation manipulation
     *
     */
    GradumSelector.prototype.onToolActivate = function _onActivate(toolName, manager = GradumEventManager.instance) {
        if (!toolName)
            toolName = this.getToolName(manager);
        return utils$3.getActivationDelegate(this, toolName, manager);
    };
    GradumSelector.prototype.onToolDeactivate = function _onDeactivate(toolName, manager = GradumEventManager.instance) {
        if (!toolName)
            toolName = this.getToolName(manager);
        return utils$3.getDeactivationDelegate(this, toolName, manager);
    };
    /*
     *
     * Tool behavior manipulation
     *
     */
    GradumSelector.prototype.addToolBehavior = function _addToolBehavior(type, callback, toolName = this.getToolName(), manager = GradumEventManager.instance) {
        if (type && toolName) {
            manager.setupCustomDispatcher?.(type);
            utils$3.addToolBehavior(toolName, type, callback, manager);
        }
        return this;
    };
    GradumSelector.prototype.hasToolBehavior = function _hasToolBehavior(type, toolName = this.getToolName(), manager = GradumEventManager.instance) {
        if (!type || !toolName)
            return false;
        return utils$3.getToolBehaviors(toolName, type, manager).length > 0;
    };
    GradumSelector.prototype.removeToolBehaviors = function _removeToolBehaviors(type, toolName = this.getToolName(), manager = GradumEventManager.instance) {
        if (type && toolName)
            utils$3.removeToolBehaviors(toolName, type, manager);
        return this;
    };
    GradumSelector.prototype.clearToolBehaviors = function _clearToolBehaviors(manager = GradumEventManager.instance) {
        utils$3.clearToolBehaviors(manager);
        return this;
    };
    /*
     *
     * Embedded tool manipulation
     *
     */
    GradumSelector.prototype.embedTool = function _embedTool(target, manager = GradumEventManager.instance) {
        if (this.isTool(manager))
            utils$3.setEmbeddedToolTarget(this.element, target, manager);
        return this;
    };
    GradumSelector.prototype.isEmbeddedTool = function _isEmbeddedTool(manager = GradumEventManager.instance) {
        return !!utils$3.getEmbeddedToolTarget(this.element, manager);
    };
    GradumSelector.prototype.getEmbeddedToolTarget = function _getEmbeddedToolTarget(manager = GradumEventManager.instance) {
        return utils$3.getEmbeddedToolTarget(this.element, manager);
    };
    /*
     *
     * Apply tool
     *
     */
    GradumSelector.prototype.applyTool = function _applyTool(toolName, type, event, manager = GradumEventManager.instance) {
        let propagation = Propagation.propagate;
        const behaviors = utils$3.getToolBehaviors(toolName, type, manager);
        const options = {};
        options.embeddedTarget = utils$3.getEmbeddedToolTarget(this.element, manager);
        options.isEmbedded = !!options.embeddedTarget;
        for (const behavior of behaviors) {
            propagation = utils$3.processPropagation(behavior.executeOn(event, this.element, options), propagation, Propagation.propagate);
            if (propagation === Propagation.stopImmediatePropagation)
                break;
        }
        return propagation;
    };
    GradumSelector.prototype.ignoreTool = function _ignoreTool(toolName, type, ignore = true, manager = GradumEventManager.instance) {
        utils$3.ignoreTool(this.element, toolName, type, ignore, manager);
        return this;
    };
    GradumSelector.prototype.ignoreAllTools = function _ignoreAllTools(ignore = true, manager = GradumEventManager.instance) {
        utils$3.getElementData(this.element, manager).ignoreAllTools = ignore;
        return this;
    };
    GradumSelector.prototype.isToolIgnored = function _isToolIgnored(toolName, type, manager = GradumEventManager.instance) {
        if (utils$3.getElementData(this.element, manager).ignoreAllTools)
            return true;
        return utils$3.isToolIgnored(this.element, toolName, type, manager);
    };
}

/**
 * @class GradumQueue
 * @group Components
 * @category Data Structures
 *
 * @template Type - The type of the queued values.
 * @description A first-in, first-out queue. {@link push} adds to the back, {@link pop} takes from the
 * front, and {@link addOnTop} jumps the line. Popping does not shift the backing array, so draining a
 * long queue stays cheap.
 */
class GradumQueue {
    items = [];
    head = 0;
    /**
     * @description Add one or more values to the back of the queue.
     * @param {...Type[]} values - The values to enqueue, in order.
     * @returns {this} Itself, allowing for method chaining.
     */
    push(...values) {
        values.forEach(value => this.items.push(value));
        return this;
    }
    /**
     * @description Add one or more values to the front of the queue, so they are popped before
     * everything already queued.
     * @param {...Type[]} values - The values to enqueue, in order.
     * @returns {this} Itself, allowing for method chaining.
     */
    addOnTop(...values) {
        this.items = [...values, ...this.items];
        return this;
    }
    /**
     * @description Take the value at the front of the queue and remove it.
     * @returns {Type | undefined} The removed value, or `undefined` if the queue is empty.
     */
    pop() {
        if (this.head >= this.items.length)
            return undefined;
        const value = this.items[this.head];
        this.items[this.head] = undefined;
        this.head++;
        if (this.head > 1024 && this.head * 2 > this.items.length) {
            this.items = this.items.slice(this.head);
            this.head = 0;
        }
        return value;
    }
    /**
     * @description Read the value at the front of the queue without removing it.
     * @returns {Type} The next value to be popped, or `undefined` if the queue is empty.
     */
    peek() {
        return this.head < this.items.length ? this.items[this.head] : undefined;
    }
    /**
     * @description Check whether a value is queued.
     * @param {Type} value - The value to look for, compared by identity.
     * @returns {boolean} Whether the value is present.
     */
    has(value) {
        return this.items.includes(value);
    }
    /**
     * @description The number of values still waiting to be popped.
     * @readonly
     */
    get size() {
        return this.items.length - this.head;
    }
    /**
     * @description Whether the queue has nothing left to pop.
     * @readonly
     */
    get isEmpty() {
        return this.size === 0;
    }
    /**
     * @description Drop repeated values, keeping the earliest occurrence of each so queue order is
     * preserved. Mutates the queue.
     * @param {Type} [entry] - Restrict deduplication to this value, leaving every other duplicate in
     * place. Omit it to deduplicate the whole queue.
     * @returns {this} Itself, allowing for method chaining.
     */
    removeDuplicates(entry) {
        const uniques = new Set();
        const toDelete = [];
        for (let i = 0; i < this.items.length; i++) {
            if (entry && this.items[i] !== entry)
                continue;
            if (!uniques.has(this.items[i]))
                uniques.add(this.items[i]);
            else
                toDelete.push(i);
        }
        for (let i = toDelete.length - 1; i >= 0; i--)
            this.items.splice(i, 1);
        return this;
    }
    /**
     * @description Discard every queued value.
     * @returns {this} Itself, allowing for method chaining.
     */
    clear() {
        this.items = [];
        this.head = 0;
        return this;
    }
    /**
     * @description Snapshot the pending values.
     * @returns {Type[]} A new array of the values still waiting to be popped, front first. Already
     * popped values are excluded.
     */
    toArray() {
        const arr = [];
        for (let i = this.head; i < this.items.length; i += 1)
            arr.push(this.items[i]);
        return arr;
    }
    /**
     * @description Copy the queue.
     * @returns {GradumQueue<Type>} A new queue holding the same pending values in the same order. The
     * values themselves are shared, not copied.
     */
    clone() {
        const queue = new GradumQueue();
        for (let i = this.head; i < this.items.length; i += 1)
            queue.push(this.items[i]);
        return queue;
    }
    /**
     * @description Remove the first pending occurrence of a value, wherever it sits in the queue.
     * @param {Type} value - The value to remove, compared by identity.
     * @returns {boolean} Whether a matching value was found and removed.
     */
    remove(value) {
        for (let i = this.head; i < this.items.length; i += 1) {
            if (this.items[i] !== value)
                continue;
            this.items.splice(i, 1);
            return true;
        }
        return false;
    }
}

/**
 * @class GradumNodeList
 * @group Components
 * @category Data Structures
 *
 * @template {object} Type - The type of the nodes held in the list.
 * @description A composable, Set-like collection of nodes. A single list can mix individual nodes, live
 * DOM collections ([HTMLCollection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection) or
 * [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)), and nested
 * {@link GradumNodeList}s. Iteration resolves all of them in order and de-duplicates, so entries added
 * to a sub-list or to the DOM show up without re-registering anything. Entries are held weakly, so a
 * node removed from the document drops out of the list on its own.
 */
let GradumNodeList = (() => {
    let _instanceExtraInitializers = [];
    let _set_observeDomLists_decorators;
    return class GradumNodeList {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(this, null, _set_observeDomLists_decorators, { kind: "setter", name: "observeDomLists", static: false, private: false, access: { has: obj => "observeDomLists" in obj, set: (obj, value) => { obj.observeDomLists = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        slots = (__runInitializers(this, _instanceExtraInitializers), []);
        ignoredMap = new WeakMap();
        domListObservers = new Map();
        subNodeListHandlers = new Map();
        /**
         * @description Delegate fired whenever an entry is added to or removed from the list, including entries
         * from nested {@link GradumNodeList}s, `HTMLCollection`s, and `NodeListOf` instances.
         */
        onChanged = new Delegate();
        /**
         * @constructor
         * @param {...(Type | NodeListType<Type>)[]} [values] - Optional initial value(s) to populate the list with.
         */
        constructor(...values) {
            this.add(...values);
        }
        /**
         * @description Whether to observe added `HTMLCollection`s and `NodeListOf` instances for DOM
         * mutations, automatically firing {@link onChanged} when nodes are added or removed from the DOM.
         */
        set observeDomLists(value) {
            if (value) {
                for (const entry of this.slots) {
                    const obj = entry.deref();
                    if (this.isDomList(obj))
                        this.attachObserver(obj);
                }
            }
            else {
                for (const [, observer] of this.domListObservers)
                    observer.disconnect();
                this.domListObservers.clear();
            }
        }
        /**
         * @description A `Set` snapshot of all entries in this list, without duplicates.
         */
        get list() {
            return new Set(this);
        }
        set list(value) {
            if (!value)
                return;
            this.clear();
            this.addEntry(value);
        }
        /**
         * @description An array snapshot of all entries in this list, without duplicates.
         */
        get array() {
            return Array.from(this);
        }
        /**
         * @description The number of resolved unique entries in this list. For the number of slots, see
         * {@link slotCount}.
         */
        get size() {
            let count = 0;
            for (const _ of this)
                count++;
            return count;
        }
        /**
         * @description The number of slots in this list. Individual entries, `HTMLCollection`s,
         * `NodeListOf` instances, and nested {@link GradumNodeList}s each count as one slot, regardless
         * of how many entries they contain. For the number of resolved entries, see {@link size}.
         */
        get slotCount() {
            return this.slots.length;
        }
        /**
         * @function isGradumNodeList
         * @description Type guard — returns true if the given value is a {@link GradumNodeList}.
         * @param {any} entry - The value to check.
         * @returns {boolean} Whether the value is a {@link GradumNodeList}.
         * @protected
         */
        isGradumNodeList(entry) {
            return entry instanceof GradumNodeList;
        }
        /**
         * @function isDomList
         * @description Type guard — returns true if the given value is an `HTMLCollection` or
         * `NodeListOf`.
         * @param {any} entry - The value to check.
         * @returns {boolean} Whether the value is a DOM list.
         * @protected
         */
        isDomList(entry) {
            return entry instanceof NodeList || entry instanceof HTMLCollection;
        }
        /**
         * @function isSet
         * @description Type guard — returns true if the given value is a `Set` or an array.
         * @param {any} entry - The value to check.
         * @returns {boolean} Whether the value is a Set or array.
         * @protected
         */
        isSet(entry) {
            return entry instanceof Set || Array.isArray(entry);
        }
        /**
         * @function isEntry
         * @description Type guard — returns true if the given value is an individual node entry (i.e. not a
         * {@link GradumNodeList}, DOM list, Set, array, or `WeakRef`).
         * @param {any} entry - The value to check.
         * @returns {boolean} Whether the value is an individual entry.
         * @protected
         */
        isEntry(entry) {
            return typeof entry === "object" && entry !== null
                && !this.isGradumNodeList(entry)
                && !this.isDomList(entry)
                && !this.isSet(entry)
                && !(entry instanceof WeakRef);
        }
        /**
         * @description Iterates over all resolved unique entries in slot order, skipping ignored and duplicate
         * entries.
         */
        *[(_set_observeDomLists_decorators = [auto({ cancelIfUnchanged: true })], Symbol.iterator)]() {
            const seen = new Set();
            for (const slot of this.slots) {
                for (const entry of this.resolveSlot(slot)) {
                    if (!this.ignoredMap.get(entry) && !seen.has(entry)) {
                        seen.add(entry);
                        yield entry;
                    }
                }
            }
        }
        /**
         * @function resolveSlot
         * @description Expand a single slot into the entries it currently stands for — every entry of a
         * sub-list or DOM list, or the one node of an individual slot. Yields nothing once the slot's
         * referent has been garbage-collected, which is how dead entries leave the list.
         * @param {WeakRef<NodeListSlot<Type>>} slot - The slot to resolve.
         * @returns {IterableIterator<Type>} The entries this slot resolves to, in order.
         * @protected
         */
        *resolveSlot(slot) {
            const obj = slot.deref();
            if (!obj)
                return;
            if (this.isGradumNodeList(obj))
                yield* obj;
            else if (this.isDomList(obj))
                yield* Array.from(obj);
            else
                yield obj;
        }
        /**
         * @description Run a callback for each resolved unique entry, in slot order. Ignored and duplicate
         * entries are skipped.
         * @param {(value: Type, set: this) => void} callback - Called once per entry.
         * @param {any} [thisArg] - Value to bind as `this` inside the callback.
         * @returns {this} Itself, allowing for method chaining.
         */
        forEach(callback, thisArg) {
            for (const entry of this) {
                callback.call(thisArg, entry, entry, this);
            }
            return this;
        }
        /**
         * @function add
         * @description Adds one or more entries to the end of the list. Entries may be individual nodes,
         * arrays, `Set`s, `HTMLCollection`s, `NodeListOf` instances, or nested
         * {@link GradumNodeList}s.
         * @param {...(NodeListType<Type> | Type)[]} entries - The entries to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        add(...entries) {
            entries.forEach(entry => this.addEntry(entry));
            return this;
        }
        /**
         * @function addAt
         * @description Adds one or more entries at the given resolved size index. The index refers to the position
         * among resolved unique entries, not slots. Arrays and `Set`s are expanded inline.
         * @param {number} index - The resolved entry index to insert at.
         * @param {...(NodeListType<Type> | Type)[]} entries - The entries to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addAt(index, ...entries) {
            return this.addAtSlot(this.sizeIndexToSlotIndex(index), ...entries);
        }
        /**
         * @function addAtSlot
         * @description Adds one or more entries at the given slot index. Subsequent entries are inserted
         * consecutively after the previous one. Arrays and `Set`s are expanded inline, each item
         * occupying the next slot index.
         * @param {number} index - The slot index to insert at.
         * @param {...(NodeListType<Type> | Type)[]} entries - The entries to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addAtSlot(index, ...entries) {
            entries.forEach(entry => index = this.addEntry(entry, index));
            return this;
        }
        /**
         * @function remove
         * @description Removes one or more entries from the list. Entries may be individual nodes, arrays,
         * `Set`s, `HTMLCollection`s, `NodeListOf` instances, or nested
         * {@link GradumNodeList}s.
         * @param {...(NodeListType<Type> | Type)[]} entries - The entries to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        remove(...entries) {
            entries.forEach(entry => this.removeEntry(entry));
            return this;
        }
        /**
         * @function removeAtSlot
         * @description Removes one or more slots starting at the given slot index. Each slot removed may
         * correspond to an individual entry, a DOM list, or a nested {@link GradumNodeList}.
         * @param {number} index - The slot index to start removing from.
         * @param {number} [count=1] - The number of consecutive slots to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeAtSlot(index, count = 1) {
            const toRemove = this.slots.slice(index, index + count)
                .map(s => s.deref()).filter(Boolean);
            for (const slot of toRemove)
                this.removeEntry(slot);
            return this;
        }
        /**
         * @function move
         * @description Moves an existing entry to the given resolved size index. If the entry is a member of a
         * nested {@link GradumNodeList}, it is moved within that sub-list. If it belongs to a DOM list, it is
         * repositioned in the DOM accordingly.
         * @param {Type} entry - The entry to move.
         * @param {number} index - The resolved entry index to move the entry to.
         * @returns {this} Itself, allowing for method chaining.
         */
        move(entry, index) {
            const currentSlotIndex = this.slots.findIndex(s => s.deref() === entry);
            if (currentSlotIndex > -1)
                return this.moveToSlot(entry, this.sizeIndexToSlotIndex(index));
            const container = this.findContainingSlot(entry);
            if (!container)
                return this;
            if (this.isGradumNodeList(container)) {
                container.move(entry, index);
                return this;
            }
            if (this.isDomList(container)) {
                if (!(entry instanceof Node))
                    return this;
                const parent = entry.parentNode;
                if (!parent)
                    return this;
                const siblings = Array.from(container).filter(n => n !== entry);
                const ref = siblings[Math.max(0, Math.min(index, siblings.length))] ?? null;
                parent.insertBefore(entry, ref);
                return this;
            }
        }
        /**
         * @function moveToSlot
         * @description Moves an existing entry to the given slot index.
         * @param {Type} entry - The entry to move.
         * @param {number} index - The slot index to move the entry to.
         * @returns {this} Itself, allowing for method chaining.
         */
        moveToSlot(entry, index) {
            if (!entry || !this.has(entry))
                return this;
            const currentSlotIndex = this.slots.findIndex(s => s.deref() === entry);
            if (currentSlotIndex === -1)
                return this;
            index = trim(index, this.slots.length, 0, this.slots.length);
            if (currentSlotIndex === index)
                return this;
            this.slots.splice(currentSlotIndex, 1);
            this.slots.splice(index > currentSlotIndex ? index - 1 : index, 0, new WeakRef(entry));
            return this;
        }
        /**
         * @function has
         * @description Checks whether the given entry or entries are present in the list.
         * - For {@link GradumNodeList}s and DOM lists, checks if they belong to this list.
         * - For arrays and `Set`s, returns true only if every item is present.
         * @param {Type | NodeListType<Type>} entry - The entry or entries to check.
         * @returns {boolean} Whether the entry or entries are present in the list.
         */
        has(entry) {
            if (!entry)
                return false;
            if (this.isGradumNodeList(entry) || this.isDomList(entry))
                return this.slots.some(s => s.deref() === entry);
            if (this.isSet(entry)) {
                const arr = Array.from(entry);
                return arr.length > 0 && arr.every(item => this.has(item));
            }
            if (this.ignoredMap.get(entry))
                return false;
            for (const resolved of this)
                if (resolved === entry)
                    return true;
            return false;
        }
        /**
         * @function clear
         * @description Clears all entries from the list, firing {@link onChanged} for every resolved entry.
         * @returns {this} Itself, allowing for method chaining.
         */
        clear() {
            for (const entry of this)
                this.onChanged.fire(entry, "removed");
            for (const [_, observer] of this.domListObservers)
                observer.disconnect();
            this.domListObservers.clear();
            for (const [subNodeList, handler] of this.subNodeListHandlers)
                subNodeList.onChanged.remove(handler);
            this.subNodeListHandlers.clear();
            this.slots = [];
            this.ignoredMap = new WeakMap();
            return this;
        }
        /**
         * @function addEntry
         * @description Add one value of any accepted shape. Arrays and sets are expanded so each item takes
         * its own slot; everything else occupies a single slot. Values already present are ignored, and
         * sub-lists and DOM lists start being watched from here.
         * @param {Type | NodeListType<Type>} entry - The entry to add.
         * @param {number} [index] - The slot index to insert at. Defaults to the end of the slot array.
         * @returns {number} The next available slot index after this insertion, for consecutive chaining.
         * @protected
         */
        addEntry(entry, index) {
            if (index === undefined)
                index = this.slots.length;
            if (!entry)
                return index;
            if (this.isSet(entry)) {
                for (const item of entry)
                    index = this.addEntry(item, index);
                return index;
            }
            if (this.isEntry(entry) && !this.has(entry)) {
                this.ignoredMap.delete(entry);
                return this.insertOrRemoveSlot(entry, "added", index);
            }
            if (this.slots.some(s => s.deref() === entry))
                return index;
            index = this.insertOrRemoveSlot(entry, "added", index);
            if (this.isGradumNodeList(entry)) {
                const handler = (subEntry, state) => {
                    if (state === "added" && this.ignoredMap.get(subEntry))
                        return;
                    this.onChanged.fire(subEntry, state);
                };
                this.subNodeListHandlers.set(entry, handler);
                entry.onChanged.add(handler);
            }
            else if (this.isDomList(entry) && this.observeDomLists)
                this.attachObserver(entry);
            return index;
        }
        /**
         * @function removeEntry
         * @description Remove one value of any accepted shape. Arrays and sets are expanded and removed
         * item by item. An individual entry stays suppressed even if a sub-list or DOM list it belongs to
         * still resolves to it, and sub-lists and DOM lists stop being watched from here.
         * @param {Type | NodeListType<Type>} entry - The entry to remove.
         * @protected
         */
        removeEntry(entry) {
            if (!entry)
                return;
            if (this.isSet(entry)) {
                for (const item of entry)
                    this.removeEntry(item);
                return;
            }
            if (this.isEntry(entry)) {
                if (this.has(entry)) {
                    this.ignoredMap.set(entry, true);
                    this.insertOrRemoveSlot(entry, "removed");
                }
                return;
            }
            if (this.isGradumNodeList(entry)) {
                const handler = this.subNodeListHandlers.get(entry);
                if (handler) {
                    entry.onChanged.remove(handler);
                    this.subNodeListHandlers.delete(entry);
                }
            }
            else if (this.isDomList(entry)) {
                const observer = this.domListObservers.get(entry);
                if (observer) {
                    observer.disconnect();
                    this.domListObservers.delete(entry);
                }
            }
            this.insertOrRemoveSlot(entry, "removed");
        }
        /**
         * @function insertOrRemoveSlot
         * @description Insert or drop a single slot and announce it, firing {@link onChanged} once per
         * entry the slot resolves to. An out-of-range insertion index is clamped to the ends.
         * @param {NodeListSlot<Type>} slot - The slot value to insert or remove.
         * @param {"added" | "removed"} state - Whether to insert or remove the slot.
         * @param {number} [index] - Slot index for insertion. Ignored on removal.
         * @returns {number} The next available slot index after the operation, for consecutive chaining.
         * @protected
         */
        insertOrRemoveSlot(slot, state, index) {
            if (state === "added") {
                index = trim(index, this.slots.length, 0, this.slots.length);
                this.slots.splice(index, 0, new WeakRef(slot));
            }
            else {
                index = this.slots.findIndex(s => s.deref() === slot);
                if (index !== -1)
                    this.slots.splice(index, 1);
            }
            if (this.isEntry(slot))
                this.onChanged.fire(slot, state);
            else
                for (const entry of this.isDomList(slot) ? Array.from(slot) : slot) {
                    if (!this.ignoredMap.get(entry))
                        this.onChanged.fire(entry, state);
                }
            return index + 1;
        }
        /**
         * @function attachObserver
         * @description Attaches a `MutationObserver` to the parent of the first node in the given DOM
         * list, firing {@link onChanged} when nodes matching the list are added to or removed from the DOM.
         * Does nothing if an observer is already attached for this list, or if no parent node is found.
         * @param {HTMLCollection | NodeListOf<Type & Node>} domList - The DOM list to observe.
         */
        attachObserver(domList) {
            if (this.domListObservers.has(domList))
                return;
            const firstNode = domList[0];
            const parent = firstNode?.parentElement ?? firstNode?.parentNode;
            if (!parent)
                return;
            const snapshot = new Set(Array.from(domList));
            const observer = new MutationObserver(mutations => mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    const obj = node;
                    if (snapshot.has(obj) || this.ignoredMap.get(obj) || node.parentNode !== parent)
                        return;
                    snapshot.add(obj);
                    this.onChanged.fire(obj, "added");
                });
                mutation.removedNodes.forEach(node => {
                    const obj = node;
                    if (!snapshot.has(obj) || this.ignoredMap.get(obj))
                        return;
                    snapshot.delete(obj);
                    this.onChanged.fire(obj, "removed");
                });
            }));
            observer.observe(parent, { childList: true, subtree: true });
            this.domListObservers.set(domList, observer);
        }
        /**
         * @function sizeIndexToSlotIndex
         * @description Translate a position among resolved entries into the slot index that holds it. The
         * two differ whenever a slot resolves to more than one entry, as DOM lists and sub-lists do.
         * @param {number} sizeIndex - The resolved entry index, clamped to the current size.
         * @returns {number} The matching slot index.
         * @protected
         */
        sizeIndexToSlotIndex(sizeIndex) {
            const size = this.size;
            sizeIndex = trim(sizeIndex, size, 0, size);
            let count = 0;
            for (let i = 0; i < this.slots.length; i++) {
                if (count === sizeIndex)
                    return i;
                for (const _ of this.resolveSlot(this.slots[i])) {
                    count++;
                    if (count === sizeIndex)
                        return i + 1;
                }
            }
            return this.slots.length;
        }
        /**
         * @function findContainingSlot
         * @description Finds the slot that directly contains or resolves to the given entry.
         * Returns the slot itself if the entry is a direct slot, the nested {@link GradumNodeList}
         * that contains it, or the DOM list that contains it.
         * @param {Type} entry - The entry to locate.
         * @returns {NodeListSlot<Type> | undefined} The containing slot, or undefined if not found.
         * @protected
         */
        findContainingSlot(entry) {
            for (const slot of this.slots) {
                const obj = slot.deref();
                if (!obj)
                    continue;
                if (obj === entry)
                    return obj;
                if (this.isGradumNodeList(obj) && obj.has(entry))
                    return obj;
                else if (this.isDomList(obj) && Array.from(obj).includes(entry))
                    return obj;
            }
        }
    };
})();

/**
 * @class GradumConstrainer
 * @group MVC
 * @category Constrainer
 *
 * @extends GradumOperator
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 * @description Keeps a set of objects satisfying a constraint. Attach one to an element and it watches a
 * list of objects, and whenever a trigger object is interacted with it runs the solvers declared with
 * `@solver` until the constraint holds again — capped by `maxPasses` so propagation cannot cycle forever.
 * Checkers (`@checker`) report whether the constraint already holds; mutators (`@mutator`) adjust values
 * as part of resolving.
 */
class GradumConstrainer extends GradumOperator {
    /**
     * @description The name of the constrainer.
     */
    constrainerName;
    /**
     * @description The property keys of the constrainer solvers defined in the instance.
     */
    solversMetadata = [];
    /**
     * @description The property keys of the constrainer checkers defined in the instance.
     */
    checkersMetadata = [];
    /**
     * @description The property keys of the constrainer mutators defined in the instance.
     */
    mutatorsMetadata = [];
    /**
     * @description The priority of the constrainer. Higher priority constrainers (lower number) should
     * be resolved first. Defaults to 10.
     */
    priority;
    /**
     * @description The list of objects constrained by the constrainer. To manipulate, check {@link GradumNodeList}.
     * Defaults to the children of the element the constrainer is attached to.
     */
    objectList;
    /**
     * @description The list of objects that trigger the constrainer to resolve.
     * Interacting with any of these objects would typically lead to the solving of the given constrainer.
     * To manipulate, check {@link GradumNodeList}. Defaults to the objects in this.objectList.
     */
    triggerList;
    /**
     * @description The default queue template for the constrainer, used when starting a new resolving pass.
     * It defaults to the constrainer's object list.
     */
    defaultQueue;
    /**
     * @description The maximum number of passes allowed per object for this constrainer during resolving.
     * This helps prevent infinite cycles in constraint propagation. Defaults to 5.
     */
    maxPasses;
    /**
     * @description Whether the constrainer is active. Defaults to true.
     */
    get active() {
        return gradum(this).activeConstrainers.includes(this.constrainerName);
    }
    set active(value) {
        gradum(this).toggleConstrainer(this.constrainerName, value);
    }
    /**
     * @description Delegate fired whenever an object is added to or removed from the constrainer's object list.
     */
    get onObjectListChange() {
        return gradum(this).onConstrainerObjectListChange(this.constrainerName);
    }
    /**
     * @description The current queue to be processed by the constrainer while resolving.
     */
    get queue() {
        return gradum(this).getConstrainerQueue(this.constrainerName);
    }
    /**
     * @constructor
     * @description Create a constrainer bound to an element. If no object list is supplied, it defaults to the
     * element's children, and the trigger list defaults to that same object list.
     * @param {GradumConstrainerProperties} properties - The element to attach to, plus the constrainer name,
     * priority, active state, and activation callbacks.
     */
    constructor(properties) {
        super(properties);
        this.constrainerName = properties.constrainerName ?? this.constrainerName ?? undefined;
        if (properties.onActivate)
            this.onActivate = properties.onActivate;
        if (properties.onDeactivate)
            this.onDeactivate = properties.onDeactivate;
        if (properties.active !== undefined)
            this.active = properties.active;
        if (typeof properties.priority === "number")
            this.priority = properties.priority;
        if (!this.objectList)
            this.objectList = new GradumNodeList(this.element instanceof Element ? this.element.children
                : this.element instanceof Node ? this.element.childNodes
                    : []);
        if (!this.triggerList)
            this.triggerList = new GradumNodeList(this.objectList);
        this.setup();
    }
    /**
     * @function initialize
     * @override
     * @description Initialization function that calls {@link GradumSelector.makeConstrainer} on `this.element`, sets
     * it up, and attaches all the defined solvers.
     */
    initialize() {
        super.initialize();
        if (!this.constrainerName)
            return;
        gradum(this).makeConstrainer(this.constrainerName, {
            onActivate: typeof this.onActivate === "function" ? this.onActivate.bind(this) : undefined,
            onDeactivate: typeof this.onDeactivate === "function" ? this.onDeactivate.bind(this) : undefined,
            attachedInstance: this
        });
        this.solversMetadata.forEach(metadata => {
            if (!metadata.name)
                return;
            gradum(this).addSolver({
                name: metadata.name,
                constrainer: this.constrainerName,
                priority: metadata.priority,
                callback: props => this[metadata.name]?.(props)
            });
        });
        this.checkersMetadata.forEach(metadata => {
            if (!metadata.name)
                return;
            gradum(this).addChecker({
                name: metadata.name,
                constrainer: this.constrainerName,
                priority: metadata.priority,
                callback: props => this[metadata.name]?.(props)
            });
        });
        this.mutatorsMetadata.forEach(metadata => {
            if (!metadata.name)
                return;
            gradum(this).addMutator({
                name: metadata.name,
                constrainer: this.constrainerName,
                priority: metadata.priority,
                callback: props => this[metadata.name]?.(props)
            });
        });
    }
    /**
     * @function getObjectPasses
     * @description Retrieve how many times the given object has been processed for the current resolving session
     * of the constrainer.
     * @param {object} object - The object to query.
     * @returns {number} Number of passes already performed on this object.
     */
    getObjectPasses(object) {
        return gradum(this).getObjectPassesForConstrainer(object, this.constrainerName);
    }
    /**
     * @function getObjectData
     * @description Retrieve custom per-object data for this constrainer. It is reset on every new
     * resolving session.
     * @param {object} object - The object to query.
     * @returns {Record<string, any>} The stored data object (or an empty object if none).
     */
    getObjectData(object) {
        return gradum(this).getObjectDataForConstrainer(object, this.constrainerName);
    }
    /**
     * @function setObjectData
     * @description Set custom per-object data for this constrainer. It is reset on every new resolving session.
     * @param {object} object - The object to update.
     * @param {Record<string, any>} [data] - The new data object to associate with this object.
     * @returns {this} Itself, allowing for method chaining.
     */
    setObjectData(object, data) {
        return gradum(this).setObjectDataForConstrainer(object, data, this.constrainerName);
    }
    /**
     * @function addChecker
     * @description Register a checker in the constrainer. Checkers dictate whether the event should continue
     * executing depending on the provided context (event, tool, target, etc.).
     * @param {ConstrainerAddCallbackProperties<ConstrainerChecker>} properties - Configuration object, including the
     * checker `callback` to be executed, the `name` of the checker to access it later, the name of the attached
     * `constrainer`, and the `priority` of the checker.
     * @returns {this} Itself, allowing for method chaining.
     */
    addChecker(properties) {
        gradum(this).addChecker({ ...properties, constrainer: this.constrainerName });
        return this;
    }
    /**
     * @function removeChecker
     * @description Remove a checker from this constrainer by its name.
     * @param {string} name - The checker name.
     * @returns {this} Itself, allowing for method chaining.
     */
    removeChecker(name) {
        gradum(this).removeChecker(name, this.constrainerName);
        return this;
    }
    /**
     * @function clearCheckers
     * @description Remove all checkers attached to this constrainer.
     * @returns {this} Itself, allowing for method chaining.
     */
    clearCheckers() {
        gradum(this).clearCheckers(this.constrainerName);
        return this;
    }
    /**
     * @function check
     * @description Evaluate all checkers for this constrainer and return whether the event should proceed or halt.
     * @param {ConstrainerCallbackProperties} [properties] - Context passed to each checker.
     * @returns {boolean} Whether the constrainer passes all checks.
     */
    check(properties) {
        return gradum(this).checkConstrainer({ ...properties, constrainer: this.constrainerName });
    }
    /**
     * @function addMutator
     * @description Register a mutator in the constrainer. Mutators compute or transform a value based on the context.
     * @param {ConstrainerAddCallbackProperties<ConstrainerMutator>} properties - Configuration object, including the
     * mutator `callback` to be executed, the `name` of the mutator to access it later, and the `priority` of the mutator.
     * @returns {this} Itself, allowing for method chaining.
     */
    addMutator(properties) {
        gradum(this).addMutator({ ...properties, constrainer: this.constrainerName });
        return this;
    }
    /**
     * @function removeMutator
     * @description Remove a mutator from this constrainer by its name.
     * @param {string} name - The mutator name.
     * @returns {this} Itself, allowing for method chaining.
     */
    removeMutator(name) {
        gradum(this).removeMutator(name, this.constrainerName);
        return this;
    }
    /**
     * @function clearMutators
     * @description Remove all mutators attached to this constrainer.
     * @returns {this} Itself, allowing for method chaining.
     */
    clearMutators() {
        gradum(this).clearMutators(this.constrainerName);
        return this;
    }
    /**
     * @function mutate
     * @template Type - The type of the value to mutate
     * @description Execute a mutator for this constrainer and return the resulting value.
     * @param {ConstrainerMutatorProperties<Type>} [properties] - Context object, including the
     * `mutation` to execute, and the input `value` to mutate.
     * @returns {Type} The mutated result.
     */
    mutate(properties) {
        return gradum(this).mutate({ ...properties, constrainer: this.constrainerName });
    }
    /**
     * @function addSolver
     * @description Register a solver in the constrainer. Solvers typically execute after an event is fired to
     * ensure the constrainer's constraints are maintained. They process all objects in the constrainer's queue,
     * one after the other.
     * @param {ConstrainerAddCallbackProperties<ConstrainerSolver>} properties - Configuration object, including the
     * solver `callback` to be executed, the `name` of the solver to access it later, and the `priority` of the solver.
     * @returns {this} Itself, allowing for method chaining.
     */
    addSolver(properties) {
        gradum(this).addSolver({ ...properties, constrainer: this.constrainerName });
        return this;
    }
    /**
     * @function removeSolver
     * @description Remove the given function from the constrainer's list of solvers.
     * @param {string} name - The solver's name.
     * @returns {this} Itself, allowing for method chaining.
     */
    removeSolver(name) {
        gradum(this).removeSolver(name, this.constrainerName);
        return this;
    }
    /**
     * @function clearSolvers
     * @description Remove all solvers attached to the constrainer.
     * @returns {this} Itself, allowing for method chaining.
     */
    clearSolvers() {
        gradum(this).clearSolvers(this.constrainerName);
        return this;
    }
    /**
     * @function solve
     * @description Solve the constrainer by executing all of its attached solvers. Each solver will be executed
     * on every object in the constrainer's queue, incrementing its number of passes in the process.
     * @param {ConstrainerCallbackProperties} [properties] - Options object to configure the context.
     * @returns {this} Itself, allowing for method chaining.
     */
    solve(properties = {}) {
        gradum(this).solveConstrainer({ ...properties, constrainer: this.constrainerName });
        return this;
    }
}
addRegistryCategory(GradumConstrainer);
define(GradumConstrainer);

/**
 * @internal
 * @class ConstrainerFunctionsUtils
 * @description Shared helpers and per-element state behind the constrainer functions on {@link GradumSelector}.
 */
class ConstrainerFunctionsUtils {
    objectsSet = new GradumWeakSet();
    dataMap = new WeakMap;
    data(element) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (!element)
            return {};
        if (!this.dataMap.has(element))
            this.dataMap.set(element, { constrainers: new Map() });
        return this.dataMap.get(element);
    }
    createConstrainer(element, constrainer) {
        if (element instanceof GradumSelector)
            element = element.element;
        const objectList = new GradumNodeList(element instanceof Element ? element.children
            : element instanceof Node ? element.childNodes
                : []);
        const data = {
            active: false,
            objectList: objectList,
            triggerList: new GradumNodeList(objectList),
            customData: new WeakMap(),
            objectsChangedDelegate: new Delegate(),
            priority: 10,
            maxPasses: 5,
            queue: new GradumQueue(),
            passes: new WeakMap(),
            onActivate: new Delegate(),
            onDeactivate: new Delegate(),
            checkers: new Map(),
            mutators: new Map(),
            solvers: new Map(),
            sortedSolvers: []
        };
        if (element) {
            this.objectsSet.add(element);
            this.data(element).constrainers.set(constrainer, data);
            this.ensureObjectListBridge(element, constrainer);
        }
        return data;
    }
    /**
     * @description Forward the effective object list's onChanged into objectsChangedDelegate, so the public
     * onObjectListChange API actually fires. The effective list may be the data's own objectList
     * or one shadowed by an attached GradumConstrainer instance, and either can be replaced later —
     * call this again after any change to rewire (the previous bridge is removed).
     */
    ensureObjectListBridge(element, constrainer) {
        const data = this.getConstrainerData(element, constrainer);
        if (!data)
            return;
        const list = this.getField(element, constrainer, "objectList");
        if (!(list instanceof GradumNodeList) || data.bridgedObjectList === list)
            return;
        if (data.bridgedObjectList && data.bridgeHandler)
            data.bridgedObjectList.onChanged.remove(data.bridgeHandler);
        data.bridgeHandler = (entry, state) => data.objectsChangedDelegate.fire(entry, state);
        data.bridgedObjectList = list;
        list.onChanged.add(data.bridgeHandler);
    }
    activate(element, constrainer, activate) {
        const data = this.getConstrainerData(element, constrainer);
        if (!data)
            return;
        if (typeof activate === "boolean")
            data.active = activate;
        else
            data.active = !data.active;
    }
    getConstrainerData(element, constrainer) {
        return this.data(element)?.constrainers?.get(constrainer);
    }
    getConstrainers(element) {
        return [...this.data(element)?.constrainers?.keys()];
    }
    getActiveConstrainers(element) {
        const data = this.data(element)?.constrainers;
        if (!data)
            return [];
        const entries = [];
        for (const [key, value] of data.entries()) {
            if (value.active)
                entries.push(key);
        }
        return entries;
    }
    getDefaultConstrainer(element, allowInactive = true) {
        const data = this.data(element).constrainers;
        if (!data)
            return;
        for (const [key, value] of data.entries()) {
            if (value.active)
                return key;
        }
        if (allowInactive)
            return data.keys()[0];
    }
    getCustomData(element, constrainer, object) {
        const constrainerData = this.getConstrainerData(element, constrainer);
        if (!constrainerData || !constrainerData.customData)
            return {};
        let customData = constrainerData.customData.get(object);
        if (!customData) {
            customData = {};
            constrainerData.customData.set(object, customData);
        }
        return customData;
    }
    getConstrainersTriggeredByObjects(...elements) {
        if (!elements || elements.length === 0)
            return [];
        const nodeTargets = elements.filter(el => el instanceof Node);
        const data = [];
        const checkTargets = (constrainerName, object) => {
            const hits = new Set();
            const list = this.getField(object, constrainerName, "triggerList") ?? new GradumNodeList();
            for (const el of nodeTargets)
                if (list.has(el))
                    hits.add(el);
            return Array.from(hits.values());
        };
        this.objectsSet.toArray().forEach(object => this.data(object).constrainers.forEach((constrainerData, name) => {
            if (!constrainerData.active)
                return;
            const hits = checkTargets(name, object);
            if (hits.length > 0)
                data.push({ name, data: constrainerData, host: object, targets: hits });
        }));
        data.sort((a, b) => this.getField(a.host, a.name, "priority") - this.getField(b.host, b.name, "priority"));
        return data;
    }
    getField(element, constrainer, field) {
        const data = this.getConstrainerData(element, constrainer);
        if (!data)
            return;
        if (data.attachedInstance && data.attachedInstance instanceof GradumConstrainer
            && data.attachedInstance[field] !== undefined)
            return data.attachedInstance[field];
        return data[field];
    }
    setField(element, constrainer, field, value) {
        const data = this.getConstrainerData(element, constrainer);
        if (data.attachedInstance && data.attachedInstance instanceof GradumConstrainer)
            data.attachedInstance[field] = value;
        else
            data[field] = value;
        if (field === "objectList")
            this.ensureObjectListBridge(element, constrainer);
    }
    setupConstrainerCallbackProperties(element, properties) {
        if (element instanceof GradumSelector)
            element = element.element;
        gradum(properties).applyDefaults({
            constrainerHost: element,
            constrainer: element ? this.getDefaultConstrainer(element, false) : undefined,
            manager: GradumEventManager.instance,
            eventOptions: {},
            toolName: properties.event?.toolName,
            eventType: properties.event?.type,
            eventTarget: properties.event?.target
        });
    }
    solveConstrainerInternal(data, properties) {
        const constrainerData = data.data;
        constrainerData.passes = new WeakMap();
        constrainerData.customData = new WeakMap();
        constrainerData.queue = gradum(data.host).getDefaultConstrainerQueue(data.name);
        if (!constrainerData.queue)
            constrainerData.queue = new GradumQueue();
        if (!constrainerData.solvers)
            return;
        let object = properties.eventTarget;
        if (properties.eventTarget)
            constrainerData.queue.remove(properties.eventTarget);
        else
            object = constrainerData.queue.pop();
        const onObjectAdded = (entry, state) => {
            if (state === "added")
                constrainerData.queue.push(entry);
        };
        constrainerData.objectList.onChanged.add(onObjectAdded);
        while (object) {
            const passes = constrainerData.passes.get(object) ?? 0;
            if (passes < constrainerData.maxPasses) {
                constrainerData.passes.set(object, passes + 1);
                for (const solverName of constrainerData.sortedSolvers) {
                    const propagation = constrainerData.solvers.get(solverName)?.callback({ ...properties, target: object, constrainer: data.name });
                    if (propagation === Propagation.stopImmediatePropagation || propagation === Propagation.stopPropagation)
                        break;
                }
            }
            object = constrainerData.queue.pop();
        }
        constrainerData.objectList.onChanged.remove(onObjectAdded);
    }
}

/**
 * @internal
 * @function binaryInsert
 * @template Type - The type of the array's entries.
 * @description Insert an item into an already-sorted array, keeping it sorted. Locates the slot by binary
 * search, so it stays cheap on large arrays. *Note: the array is mutated in place; nothing is returned as a
 * copy. The array must already be sorted by the same comparator, or the insertion point is meaningless.*
 * @param {Type[]} array - The sorted array to insert into. Mutated in place.
 * @param {Type} item - The item to insert.
 * @param {(a: Type, b: Type) => number} compare - Comparator returning a negative number, zero, or a positive
 * number, matching `Array.prototype.sort`.
 * @returns {number} The index the item was inserted at.
 */
function binaryInsert(array, item, compare) {
    let low = 0;
    let high = array.length;
    while (low < high) {
        const mid = (low + high) >>> 1;
        if (compare(array[mid], item) <= 0)
            low = mid + 1;
        else
            high = mid;
    }
    array.splice(low, 0, item);
    return low;
}

/**
 * @function randomId
 * @group Utilities
 * @category Random
 *
 * @description Generate a random identifier from the platform's cryptographic random source. Prefer it over
 * {@link randomString} whenever the value has to be unpredictable, such as an element or record ID.
 * @param {number} [length=8] - How many characters the ID should be.
 * @returns {string} A random alphanumeric ID of the requested length.
 */
function randomId(length = 8) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => b.toString(36).padStart(2, "0"))
        .join("")
        .slice(0, length);
}
/**
 * @function randomFromRange
 * @group Utilities
 * @category Random
 *
 * @description Pick a random number between two bounds. The bounds may be given in either order, and
 * non-numeric input yields `0` rather than `NaN`.
 * @param {number} n1 - One end of the range.
 * @param {number} n2 - The other end of the range.
 * @returns {number} A number in `[min, max)`, or `0` if either bound was not a number.
 */
function randomFromRange(n1, n2) {
    if (typeof n1 != "number" || typeof n2 != "number")
        return 0;
    const min = Math.min(n1, n2);
    const max = Math.max(n1, n2);
    return (Math.random() * (max - min)) + min;
}
/**
 * @function randomString
 * @group Utilities
 * @category Random
 *
 * @description Generate a random alphanumeric string from `Math.random`. Suitable for filler and test data;
 * use {@link randomId} instead when the value must be unguessable.
 * @param {number} [length=12] - How many characters the string should be.
 * @returns {string} A random string of the requested length.
 */
function randomString(length = 12) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++)
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}

const utils$2 = new ConstrainerFunctionsUtils();
/**
 * @internal
 * @function setupConstrainerFunctions
 * @description Install the constrainer functions (`makeConstrainer`, `solveConstrainer`, `mutate`, ...) onto the
 * {@link GradumSelector} prototype. Called once by
 * {@link gradumify}; the matching `exclude` option skips it.
 */
function setupConstrainerFunctions() {
    GradumSelector.prototype.makeConstrainer = function _makeConstrainer(constrainer, options) {
        if (!utils$2.getConstrainerData(this, constrainer))
            utils$2.createConstrainer(this, constrainer);
        if (options?.onActivate)
            this.onConstrainerActivate(constrainer).add(options.onActivate);
        if (options?.onDeactivate)
            this.onConstrainerDeactivate(constrainer).add(options.onDeactivate);
        if (options?.priority)
            utils$2.getConstrainerData(this, constrainer).priority = options.priority;
        if (options?.attachedInstance) {
            utils$2.getConstrainerData(this, constrainer).attachedInstance = options.attachedInstance;
            // The instance may shadow the data's objectList — rewire the onObjectListChange bridge.
            utils$2.ensureObjectListBridge(this, constrainer);
        }
        if (options?.active || options?.active === undefined)
            utils$2.activate(this, constrainer, true);
        return this;
    };
    Object.defineProperty(GradumSelector.prototype, "constrainersNames", {
        get: function () {
            return utils$2.getConstrainers(this.element);
        },
        configurable: false,
        enumerable: true
    });
    //ACTIVATION
    Object.defineProperty(GradumSelector.prototype, "activeConstrainers", {
        get: function () {
            return utils$2.getActiveConstrainers(this.element);
        },
        configurable: false,
        enumerable: true
    });
    GradumSelector.prototype.activateConstrainer = function _activateConstrainers(...constrainers) {
        const targets = constrainers.length ? constrainers : [utils$2.getDefaultConstrainer(this)];
        targets.forEach(constrainer => {
            if (constrainer)
                utils$2.activate(this, constrainer, true);
        });
        return this;
    };
    GradumSelector.prototype.deactivateConstrainer = function _deactivateConstrainers(...constrainers) {
        const targets = constrainers.length ? constrainers : [utils$2.getDefaultConstrainer(this)];
        targets.forEach(constrainer => {
            if (constrainer)
                utils$2.activate(this, constrainer, false);
        });
        return this;
    };
    GradumSelector.prototype.toggleConstrainer = function _toggleConstrainers(constrainer = utils$2.getDefaultConstrainer(this), force) {
        if (constrainer)
            utils$2.activate(this, constrainer, force);
        return this;
    };
    GradumSelector.prototype.activateOnlyConstrainer = function _activateOnlyConstrainers(constrainer = utils$2.getDefaultConstrainer(this)) {
        if (constrainer)
            utils$2.getConstrainers(this).forEach(enf => utils$2.activate(this, constrainer, constrainer === enf));
        return this;
    };
    GradumSelector.prototype.activateAllConstrainers = function _activateAllConstrainers() {
        utils$2.getConstrainers(this).forEach(constrainer => utils$2.activate(this, constrainer, true));
        return this;
    };
    GradumSelector.prototype.deactivateAllConstrainers = function _deactivateAllConstrainers() {
        utils$2.getConstrainers(this).forEach(constrainer => utils$2.activate(this, constrainer, false));
        return this;
    };
    GradumSelector.prototype.onConstrainerActivate = function _onConstrainerActivate(constrainer = utils$2.getDefaultConstrainer(this)) {
        return utils$2.getConstrainerData(this, constrainer)?.onActivate ?? new Delegate();
    };
    GradumSelector.prototype.onConstrainerDeactivate = function _onConstrainerDeactivate(constrainer = utils$2.getDefaultConstrainer(this)) {
        return utils$2.getConstrainerData(this, constrainer)?.onDeactivate ?? new Delegate();
    };
    //PRIORITY
    GradumSelector.prototype.getConstrainerPriority = function _getConstrainerPriority(constrainer = utils$2.getDefaultConstrainer(this)) {
        return utils$2.getField(this, constrainer, "priority") ?? 0;
    };
    GradumSelector.prototype.setConstrainerPriority = function _setConstrainerPriority(priority, constrainer = utils$2.getDefaultConstrainer(this)) {
        if (typeof priority === "number")
            utils$2.setField(this, constrainer, "priority", priority);
        return this;
    };
    //OBJECT LIST
    GradumSelector.prototype.getConstrainerObjectList = function _getConstrainerObjectList(constrainer = utils$2.getDefaultConstrainer(this)) {
        utils$2.ensureObjectListBridge(this, constrainer);
        return utils$2.getField(this, constrainer, "objectList") ?? new GradumNodeList();
    };
    GradumSelector.prototype.onConstrainerObjectListChange = function _onConstrainerObjectListChange(constrainer = utils$2.getDefaultConstrainer(this)) {
        utils$2.ensureObjectListBridge(this, constrainer);
        return utils$2.getConstrainerData(this, constrainer)?.objectsChangedDelegate ?? new Delegate();
    };
    //TRIGGER LIST
    GradumSelector.prototype.getConstrainerTriggerList = function _getConstrainerTriggerList(constrainer = utils$2.getDefaultConstrainer(this)) {
        return utils$2.getField(this, constrainer, "triggerList") ?? new GradumNodeList();
    };
    //QUEUE
    GradumSelector.prototype.getConstrainerQueue = function _getConstrainerQueue(constrainer = utils$2.getDefaultConstrainer(this)) {
        return utils$2.getConstrainerData(this, constrainer).queue;
    };
    GradumSelector.prototype.getDefaultConstrainerQueue = function _getDefaultConstrainerQueue(constrainer = utils$2.getDefaultConstrainer(this)) {
        const queue = utils$2.getField(this, constrainer, "defaultQueue");
        if (queue instanceof GradumQueue)
            return queue.clone();
        else if (queue instanceof Array || queue instanceof Set)
            return new GradumQueue().push(...queue);
        return new GradumQueue().push(...this.getConstrainerObjectList(constrainer));
    };
    GradumSelector.prototype.setDefaultConstrainerQueue = function _setDefaultConstrainerQueue(queue, constrainer = utils$2.getDefaultConstrainer(this)) {
        if (!queue || typeof queue !== "object")
            return this;
        if (Array.isArray(queue))
            queue = new GradumQueue().push(...queue);
        if (queue instanceof GradumQueue)
            utils$2.setField(this, constrainer, "defaultQueue", queue.clone());
        return this;
    };
    //PASSES
    GradumSelector.prototype.getObjectPassesForConstrainer = function _getObjectPassesForConstrainer(object, constrainer = utils$2.getDefaultConstrainer(this)) {
        if (!object)
            return 0;
        const map = utils$2.getConstrainerData(this, constrainer).passes;
        if (!map || !(map instanceof WeakMap))
            return 0;
        return map.get(object) ?? 0;
    };
    GradumSelector.prototype.getMaxPassesForConstrainer = function _getMaxPassesForConstrainer(constrainer = utils$2.getDefaultConstrainer(this)) {
        return utils$2.getField(this, constrainer, "maxPasses");
    };
    GradumSelector.prototype.setMaxPassesForConstrainer = function _setMaxPassesForConstrainer(passes, constrainer = utils$2.getDefaultConstrainer(this)) {
        utils$2.setField(this, constrainer, "maxPasses", passes);
        return this;
    };
    //CUSTOM DATA
    GradumSelector.prototype.getObjectDataForConstrainer = function _getObjectDataForConstrainer(object, constrainer = utils$2.getDefaultConstrainer(this)) {
        return utils$2.getCustomData(this.element, constrainer, object);
    };
    GradumSelector.prototype.setObjectDataForConstrainer = function _setObjectDataForConstrainer(object, data, constrainer = utils$2.getDefaultConstrainer(this)) {
        if (!data || typeof data !== "object")
            data = {};
        utils$2.getConstrainerData(this.element, constrainer).customData.set(object, data);
        return this;
    };
    //CHECKER
    GradumSelector.prototype.addChecker = function _addChecker(properties) {
        if (!properties || !properties.name || !properties.callback)
            return this;
        const constrainer = properties.constrainer || utils$2.getDefaultConstrainer(this);
        utils$2.getConstrainerData(this, constrainer).checkers?.set(properties.name, properties.callback);
        return this;
    };
    GradumSelector.prototype.removeChecker = function _removeChecker(name, constrainer = utils$2.getDefaultConstrainer(this)) {
        utils$2.getConstrainerData(this, constrainer).checkers?.delete(name);
        return this;
    };
    GradumSelector.prototype.clearCheckers = function _clearCheckers(constrainer = utils$2.getDefaultConstrainer(this)) {
        utils$2.getConstrainerData(this, constrainer).checkers?.clear();
        return this;
    };
    GradumSelector.prototype.checkConstrainer = function _checkConstrainer(properties) {
        if (!properties)
            properties = {};
        utils$2.setupConstrainerCallbackProperties(this, properties);
        if (!properties.constrainer)
            return true;
        const constrainer = properties.constrainer || utils$2.getDefaultConstrainer(this);
        for (const checker of utils$2.getConstrainerData(this, constrainer).checkers.values()) {
            if (!checker(properties))
                return false;
        }
        return true;
    };
    GradumSelector.prototype.checkConstrainersForEvent = function _checkConstrainersForEvent(properties) {
        if (!properties || !properties.event)
            return true;
        utils$2.setupConstrainerCallbackProperties(null, properties);
        if (!properties.eventTarget || typeof properties.eventTarget !== "object") {
            properties.eventTarget = this.element;
            if (!properties.eventTarget || typeof properties.eventTarget !== "object")
                return true;
        }
        const constrainersData = utils$2.getConstrainersTriggeredByObjects(properties.eventTarget);
        for (const constrainerData of constrainersData) {
            for (const checker of constrainerData.data.checkers.values()) {
                if (!checker({ ...properties, constrainer: constrainerData.name }))
                    return false;
            }
        }
        return true;
    };
    //MUTATOR
    GradumSelector.prototype.addMutator = function _addMutator(properties) {
        if (!properties || !properties.name || !properties.callback)
            return this;
        const constrainer = properties.constrainer || utils$2.getDefaultConstrainer(this);
        utils$2.getConstrainerData(this, constrainer).mutators?.set(properties.name, properties.callback);
        return this;
    };
    GradumSelector.prototype.removeMutator = function _removeMutator(name, constrainer = utils$2.getDefaultConstrainer(this)) {
        utils$2.getConstrainerData(this, constrainer).mutators?.delete(name);
        return this;
    };
    GradumSelector.prototype.clearMutators = function _clearMutators(constrainer = utils$2.getDefaultConstrainer(this)) {
        utils$2.getConstrainerData(this, constrainer).mutators?.clear();
        return this;
    };
    GradumSelector.prototype.mutate = function _mutate(properties) {
        if (!properties || !properties.mutation)
            return;
        utils$2.setupConstrainerCallbackProperties(this, properties);
        if (!properties.constrainer)
            return this;
        const mutation = utils$2.getConstrainerData(this, properties.constrainer).mutators?.get(properties.mutation);
        if (mutation)
            return mutation(properties);
    };
    //SOLVERS
    GradumSelector.prototype.addSolver = function _addSolver(properties) {
        if (!properties || !properties.callback)
            return this;
        if (!properties.name)
            properties.name = randomString(8);
        const constrainer = properties.constrainer ?? utils$2.getDefaultConstrainer(this);
        const data = utils$2.getConstrainerData(this, constrainer);
        if (!data)
            return this;
        const name = properties.name;
        delete properties.name;
        delete properties.constrainer;
        if (!properties.priority)
            properties.priority = 10;
        data.solvers?.set(name, properties);
        binaryInsert(data.sortedSolvers, name, (name1, name2) => data.solvers.get(name1).priority - data.solvers.get(name2).priority);
        return this;
    };
    GradumSelector.prototype.removeSolver = function _removeSolver(name, constrainer = utils$2.getDefaultConstrainer(this)) {
        const data = utils$2.getConstrainerData(this, constrainer);
        if (!data)
            return this;
        data.solvers?.delete(name);
        const index = data.sortedSolvers?.indexOf(name);
        if (index !== undefined && index >= 0)
            data.sortedSolvers.splice(index, 1);
        return this;
    };
    GradumSelector.prototype.clearSolvers = function _clearSolvers(constrainer = utils$2.getDefaultConstrainer(this)) {
        const data = utils$2.getConstrainerData(this, constrainer);
        if (!data)
            return this;
        data.solvers?.clear();
        data.sortedSolvers = [];
        return this;
    };
    GradumSelector.prototype.solveConstrainer = function _solveConstrainer(properties = {}) {
        if (!properties)
            properties = {};
        utils$2.setupConstrainerCallbackProperties(this, properties);
        if (!properties.constrainer)
            return this;
        const data = utils$2.getConstrainerData(this, properties.constrainer);
        if (!data)
            return this;
        utils$2.solveConstrainerInternal({ data, host: this.element, name: properties.constrainer }, properties);
        return this;
    };
    GradumSelector.prototype.solveConstrainersForEvent = function _solveConstrainersForEvent(properties) {
        if (!properties || !properties.event)
            return this;
        utils$2.setupConstrainerCallbackProperties(null, properties);
        if (!properties.eventTarget || typeof properties.eventTarget !== "object") {
            properties.eventTarget = this.element;
            if (!properties.eventTarget || typeof properties.eventTarget !== "object")
                return this;
        }
        const constrainersData = utils$2.getConstrainersTriggeredByObjects(properties.eventTarget);
        for (const constrainerData of constrainersData)
            utils$2.solveConstrainerInternal(constrainerData, properties);
        return this;
    };
}

const onceRegistry = new WeakMap();
/**
 * @function callOnce
 * @group Decorators
 * @category Augmentation
 *
 * @template {(...args: any[]) => any} Type - The type of the wrapped function.
 * @description Wrap a function so its body runs only on the first call. Later calls skip the body and
 * return the first call's result.
 * @param {Type} fn - The function to wrap.
 * @returns {Type} A function with the same signature as `fn`, whose body runs at most once.
 *
 * @example
 * ```ts
 * const init = callOnce(function () { ... });
 * const out = init();
 * ```
 */
function callOnce(fn) {
    if (onceRegistry.has(fn))
        return onceRegistry.get(fn);
    let called = false;
    let result;
    let promise;
    const wrapper = function (...args) {
        if (called)
            return result;
        if (promise)
            return promise;
        try {
            const out = fn.apply(this, args);
            if (out instanceof Promise) {
                promise = out.then((val) => {
                    result = val;
                    called = true;
                    promise = null;
                    return val;
                }).catch((err) => {
                    promise = null;
                    throw err;
                });
                return promise;
            }
            else {
                result = out;
                called = true;
                return out;
            }
        }
        catch (err) {
            throw err;
        }
    };
    onceRegistry.set(fn, wrapper);
    return wrapper;
}
/**
 * @decorator
 * @function callOncePerInstance
 * @group Decorators
 * @category Augmentation
 *
 * @description Stage-3 method decorator. It ensures a method in a class is called only once per instance.
 * Subsequent calls will be canceled and log a warning. Works for instance or static methods.
 *
 * @example
 * ```ts
 *   class A {
 *     @callOnce init() { ... }
 *   }
 * ```
 */
function callOncePerInstance(value, context) {
    if (context.kind !== "method")
        throw new Error(`@callOnce can only be used on methods (got: ${context.kind}).`);
    const name = String(context.name);
    const flag = Symbol(`__callOnce__${name}`);
    return function (...args) {
        if (this[flag]) {
            console.warn(`Function ${name} has already been called once on this instance and will not be called again.`);
            return;
        }
        this[flag] = true;
        return value.apply(this, args);
    };
}

/**
 * @class StatefulReifect
 * @group Components
 * @category Reifects
 *
 * @template {string | number | symbol} State - The type of the reifier's states.
 * @template {object} ClassType - The object type this reifier will be applied to.
 * @description A class to manage and apply dynamic state-based properties, styles, classes, and transitions to a
 * set of objects.
 */
let StatefulReifect = (() => {
    let _instanceExtraInitializers = [];
    let _get_states_decorators;
    let _set_propertiesEnabled_decorators;
    let _set_classesEnabled_decorators;
    let _set_stylesEnabled_decorators;
    let _set_replacedWithEnabled_decorators;
    let _set_enabled_decorators;
    let _set_properties_decorators;
    let _set_styles_decorators;
    let _set_classes_decorators;
    let _set_replaceWith_decorators;
    return class StatefulReifect {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _get_states_decorators = [auto({ preprocessValue: function (value) { return this.normalizeStates(value); } })];
            _set_propertiesEnabled_decorators = [auto({ defaultValue: true })];
            _set_classesEnabled_decorators = [auto({ defaultValue: true })];
            _set_stylesEnabled_decorators = [auto({ defaultValue: true })];
            _set_replacedWithEnabled_decorators = [auto({ defaultValue: true })];
            _set_enabled_decorators = [auto({ defaultValue: true })];
            _set_properties_decorators = [auto({ setIfUndefined: true, preprocessValue: function (value) { return this.normalizePropertyConfig(this.properties, value); } })];
            _set_styles_decorators = [auto({ setIfUndefined: true, preprocessValue: function (value) { return this.normalizePropertyConfig(this.styles, value); } })];
            _set_classes_decorators = [auto({ setIfUndefined: true, preprocessValue: function (value) { return this.normalizePropertyConfig(this.classes, value); } })];
            _set_replaceWith_decorators = [auto({ setIfUndefined: true, preprocessValue: function (value) { return this.normalizePropertyConfig(this.replaceWith, value); } })];
            __esDecorate(this, null, _get_states_decorators, { kind: "getter", name: "states", static: false, private: false, access: { has: obj => "states" in obj, get: obj => obj.states }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_propertiesEnabled_decorators, { kind: "setter", name: "propertiesEnabled", static: false, private: false, access: { has: obj => "propertiesEnabled" in obj, set: (obj, value) => { obj.propertiesEnabled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_classesEnabled_decorators, { kind: "setter", name: "classesEnabled", static: false, private: false, access: { has: obj => "classesEnabled" in obj, set: (obj, value) => { obj.classesEnabled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_stylesEnabled_decorators, { kind: "setter", name: "stylesEnabled", static: false, private: false, access: { has: obj => "stylesEnabled" in obj, set: (obj, value) => { obj.stylesEnabled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_replacedWithEnabled_decorators, { kind: "setter", name: "replacedWithEnabled", static: false, private: false, access: { has: obj => "replacedWithEnabled" in obj, set: (obj, value) => { obj.replacedWithEnabled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_enabled_decorators, { kind: "setter", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_properties_decorators, { kind: "setter", name: "properties", static: false, private: false, access: { has: obj => "properties" in obj, set: (obj, value) => { obj.properties = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_styles_decorators, { kind: "setter", name: "styles", static: false, private: false, access: { has: obj => "styles" in obj, set: (obj, value) => { obj.styles = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_classes_decorators, { kind: "setter", name: "classes", static: false, private: false, access: { has: obj => "classes" in obj, set: (obj, value) => { obj.classes = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_replaceWith_decorators, { kind: "setter", name: "replaceWith", static: false, private: false, access: { has: obj => "replaceWith" in obj, set: (obj, value) => { obj.replaceWith = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @static
         * @readonly
         * @protected
         * @description The categories of value a reifect can apply to an object.
         */
        static fields = ["properties", "classes", "styles", "replaceWith"];
        /**
         * @static
         * @readonly
         * @protected
         * @description Property names the reifect handles itself. Anything else given in its configuration is
         * treated as a property to set on the attached objects.
         */
        static knownFields = new Set(["states", "attachedObjects", "initialState", ...this.fields]);
        /**
         * @static
         * @readonly
         * @protected
         * @description Style properties that several reifects may contribute to at once, and so are recombined
         * rather than overwritten when more than one reifect is attached to the same object.
         */
        static chainableStyleFields = new Set(["transition", "transitionDelay",
            "transitionTimingFunction", "transitionDuration", "transform"]);
        /**
         * @protected
         * @readonly
         * @description Matches a CSS duration, capturing the number and its unit, so durations given as strings
         * can be read back as seconds.
         */
        timeRegex = (__runInitializers(this, _instanceExtraInitializers), /^(\d+(?:\.\d+)?)(ms|s)?$/i);
        /**
         * @protected
         * @readonly
         * @description Per-object state, keyed weakly so attaching a reifect does not keep an object alive.
         */
        attachedObjectsData = new WeakMap();
        /**
         * @protected
         * @readonly
         * @description Every object this reifect is attached to, in attachment order. Objects dropped elsewhere
         * disappear from the list on their own.
         */
        attachedObjects = new GradumNodeList();
        /**
         * @description All possible states.
         */
        get states() { return; }
        set states(states) { }
        set propertiesEnabled(value) { this.refreshProperties(); }
        set classesEnabled(value) { this.refreshClasses(); }
        set stylesEnabled(value) { this.refreshStyles(); }
        set replacedWithEnabled(value) { this.refreshReplaceWith(); }
        set enabled(value) { this.refreshAll(); }
        /**
         * @description The properties to be assigned to the objects. It could take:
         * - A record of `{key: value}` pairs.
         * - A record of `{state: {key: value} pairs or an interpolation function that would return a record of
         * {key: value} pairs}`.
         * - An interpolation function that would return a record of `{key: value}` pairs based on the state value.
         * The interpolation function would take as arguments:
         * - `state: State`: the state being applied to the object(s). Only passed to the callback function if it is
         * defined for the whole field (and not for a specific state).
         * - `index: number`: the index of the object in the applied list.
         * - `total: number`: the total number of objects in the applied list.
         * - `object: ClassType`: the object itself.
         */
        set properties(value) { }
        get properties() { return; }
        /**
         * @description The styles to be assigned to the objects (only if they are eligible elements). It could take:
         * - A record of `{CSS property: value}` pairs.
         * - A record of `{state: {CSS property: value} pairs or an interpolation function that would return a record of
         * {key: value} pairs}`.
         * - An interpolation function that would return a record of `{key: value}` pairs based on the state value.
         * The interpolation function would take as arguments:
         * - `state: State`: the state being applied to the object(s). Only passed to the callback function if it is
         * defined for the whole field (and not for a specific state).
         * - `index: number`: the index of the object in the applied list.
         * - `total: number`: the total number of objects in the applied list.
         * - `object: ClassType`: the object itself.
         */
        set styles(value) { }
        get styles() { return; }
        /**
         * @description The classes to be assigned to the objects (only if they are eligible elements). It could take:
         * - A string of space-separated classes.
         * - An array of classes.
         * - A record of `{state: space-separated class string, array of classes, or an interpolation function that would
         * return any of the latter}`.
         * - An interpolation function that would return a string of space-separated classes or an array of classes based
         * on the state value.
         * The interpolation function would take as arguments:
         * - `state: State`: the state being applied to the object(s). Only passed to the callback function if it is
         * defined for the whole field (and not for a specific state).
         * - `index: number`: the index of the object in the applied list.
         * - `total: number`: the total number of objects in the applied list.
         * - `object: ClassType`: the object itself.
         */
        set classes(value) { }
        get classes() { return; }
        /**
         * @description The object that should replace (in the DOM as well if eligible) the attached objects. It could take:
         * - The object to be replaced with.
         * - A record of `{state: object to be replaced with, or an interpolation function that would return an object
         * to be replaced with}`.
         * - An interpolation function that would return the object to be replaced with based on the state value.
         * The interpolation function would take as arguments:
         * - `state: State`: the state being applied to the object(s). Only passed to the callback function if it is
         * defined for the whole field (and not for a specific state).
         * - `index: number`: the index of the object in the applied list.
         * - `total: number`: the total number of objects in the applied list.
         * - `object: ClassType`: the object itself.
         */
        set replaceWith(value) { }
        get replaceWith() { return; }
        /**
         * @description Creates an instance of StatefulReifier.
         * @param {StatefulReifectProperties<State, ClassType>} properties - The configuration properties.
         */
        constructor(properties) {
            if (properties.states)
                this.states = properties.states;
            const unknownEntries = [];
            Object.entries(properties).forEach(([key, value]) => {
                if (key === "attachedObjects" || key === "states" || key === "initialState")
                    return;
                if (StatefulReifect.knownFields.has(key))
                    this[key] = value;
                else
                    unknownEntries.push([key, value]);
            });
            if (unknownEntries.length > 0)
                this.properties = Object.fromEntries(unknownEntries);
            if (properties.attachedObjects)
                this.attach(...properties.attachedObjects);
            if (properties.initialState !== undefined)
                this.apply(properties.initialState);
        }
        attach(...args) {
            const lastArg = args[args.length - 1];
            const secondLastArg = args[args.length - 2];
            const trailingIndex = typeof lastArg === "number" ? lastArg : undefined;
            const onSwitchArg = trailingIndex !== undefined ? secondLastArg : lastArg;
            const trailingOnSwitch = typeof onSwitchArg === "function" ? onSwitchArg : undefined;
            const objects = args.slice(0, args.length
                - (trailingIndex !== undefined ? 1 : 0)
                - (trailingOnSwitch !== undefined ? 1 : 0));
            objects.forEach((object, i) => {
                const index = trailingIndex !== undefined ? trailingIndex + i : undefined;
                this.attachObject(object, trailingOnSwitch, index);
            });
            return this;
        }
        detach(...objects) {
            objects.forEach(object => this.detachObject(object));
            return this;
        }
        /**
         * @function attachObject
         * @description Function used to generate a data entry for the given object, and add it to the attached list at
         * the provided index (if any).
         * @param {ClassType} object - The object to attach
         * @param {number} [index] - Optional index to specify the position at which to insert the object in the reifier's
         * attached list.
         * @param {ReifectOnSwitchCallback<State, ClassType>} [onSwitch] - Optional
         * callback fired when the reifier is applied to the object. The callback takes as parameters:
         * - `state: State`: The state being applied to the object.
         * - `index: number`: the index of the object in the applied list.
         * - `total: number`: the total number of objects in the applied list.
         * - `object: ClassType`: the object itself.
         * @returns {ReifectObjectData<State, ClassType>} - The created data entry.
         * @protected
         */
        attachObject(object, onSwitch, index) {
            let data = this.getData(object);
            if (data) {
                if (onSwitch)
                    data.onSwitch = onSwitch;
                if (index !== undefined) {
                    data.index = index;
                    this.attachedObjects.move(object, index);
                }
                return data;
            }
            index = trim(index, this.attachedObjects.size, 0, this.attachedObjects.size);
            this.attachedObjects.addAt(index, object);
            data = this.generateNewData(object, onSwitch, index);
            this.attachedObjectsData.set(object, data);
            gradum(object).attachReifect(this);
            data.lastState = this.stateOf(object);
            this.applyAll(object);
            return data;
        }
        /**
         * @function detachObject
         * @protected
         * @description Stop tracking an object, so the reifect no longer applies to it. Does nothing if the
         * object was never attached.
         * @param {ClassType} object - The object to detach.
         */
        detachObject(object) {
            if (!object || !this.attachedObjects.has(object))
                return;
            const data = this.getData(object);
            if (data) {
                data.disposeEffect?.();
                data.disposeEffect = undefined;
            }
            this.attachedObjectsData.delete(object);
            gradum(object).detachReifect(this);
        }
        /**
         * @function getData
         * @description Retrieve the data entry of a given object.
         * @param {ClassType} object - The object to find the data of.
         * @returns {ReifectObjectData<State, ClassType>} - The corresponding data, or `null` if was not found.
         */
        getData(object) {
            if (!object)
                return;
            return this.attachedObjectsData.get(object);
        }
        /**
         * @function getObject
         * @description Retrieves the object attached to the given data entry.
         * @param {ReifectObjectData<State, ClassType>} data - The data entry to get the corresponding object of.
         * @returns {ClassType} The corresponding object, or `null` if was garbage collected.
         */
        getObject(data) {
            if (!data)
                return;
            return data.object.deref();
        }
        /*
         *
         * *********************************
         *
         * States stuff
         *
         * *********************************
         *
         */
        /**
         * @function stateOf
         * @description Determine the current state of the reifect on the provided object.
         * @param {ClassType} object - The object to determine the state for.
         * @returns {State | undefined} - The current state of the reifect or undefined if not determinable.
         */
        stateOf(object) {
            if (!object)
                return;
            const data = this.getData(object);
            if (!data)
                return;
            if (data.lastState)
                return data.lastState;
            if (!(object instanceof HTMLElement))
                return this.states[0];
            if (!data.resolvedValues)
                this.processRawProperties(object);
            for (const state of this.states) {
                if (!data.resolvedValues?.styles?.[state])
                    continue;
                let matches = true;
                for (const [property, value] of Object.entries(data.resolvedValues.styles[state])) {
                    if (object.style[property] != value) {
                        matches = false;
                        break;
                    }
                }
                if (!matches)
                    continue;
                data.lastState = state;
                return state;
            }
            return this.states[0];
        }
        /**
         * @function parseState
         * @description Parses a boolean into the corresponding state value.
         * @param {State | boolean} value - The value to parse.
         * @returns {State} The parsed value, or `null` if the boolean could not be parsed.
         * @protected
         */
        parseState(value) {
            if (typeof value != "boolean")
                return this.states.includes(value) ? value : this.states[0];
            else
                for (const str of value ? ["true", "on", "in", "enabled", "shown"]
                    : ["false", "off", "out", "disabled", "hidden"]) {
                    if (this.states.includes(str))
                        return str;
                }
            return this.states[0];
        }
        /*
         *
         * *********************************
         *
         * Enabled stuff
         *
         * *********************************
         *
         */
        /**
         * @function getObjectEnabledState
         * @description Returns the `enabled` value corresponding to the provided object for this reifier.
         * @param {ClassType} object - The object to get the state of.
         * @returns {ReifectEnabledObject} - The corresponding enabled state.
         */
        getObjectEnabledState(object) {
            return this.getData(object)?.enabled;
        }
        /*
         *
         * *********************************
         *
         * Usage methods
         *
         * *********************************
         *
         */
        initialize(state, objects, options) {
            if (!this.enabled)
                return this;
            state = this.parseState(state);
            options = this.initializeOptions(options, objects);
            this.getEnabledObjects(objects, options).forEach(object => {
                const data = this.getData(object);
                if (!data)
                    return;
                if (options.recomputeProperties || !data.resolvedValues)
                    this.processRawProperties(object, options.propertiesOverride);
                data.lastState = state;
                this.applyAll(object, options?.applyStylesInstantly);
                if (data.onSwitch)
                    data.onSwitch(state, data.index, data.total, this.getObject(data));
            });
            return this;
        }
        apply(state, objects, options) {
            if (!this.enabled)
                return this;
            state = this.parseState(state);
            options = this.initializeOptions(options, objects);
            this.getEnabledObjects(objects, options).forEach(object => {
                const data = this.getData(object);
                if (!data)
                    return;
                if (options.recomputeProperties || !data.resolvedValues)
                    this.processRawProperties(object, options.propertiesOverride);
                data.lastState = state;
                this.applyAll(object, options?.applyStylesInstantly);
                if (data.onSwitch)
                    data.onSwitch(state, data.index, data.total, this.getObject(data));
            });
            return this;
        }
        toggle(objects, options) {
            if (!this.enabled)
                return this;
            if (!objects)
                objects = [];
            else if (objects instanceof HTMLCollection)
                objects = [...objects];
            else if (!Array.isArray(objects))
                objects = [objects];
            const referenceObject = objects[0] ?? this.attachedObjects.array[0];
            const previousState = this.getData(referenceObject)?.lastState;
            const nextStateIndex = mod(!previousState ? 0 : this.states.indexOf(previousState) + 1, this.states.length);
            return this.apply(this.states[nextStateIndex], objects, options);
        }
        //TODO FIXXXX
        /**
         * @function unapply
         * @description Remove everything this reifect applied, returning the objects to how they were before.
         * @param {ClassType | ClassType[]} [objects] - The objects to clear. Defaults to every attached object.
         * @param {ReifectAppliedOptions} [options] - Options controlling reach and recomputation.
         * @returns {this} Itself, allowing for method chaining.
         */
        unapply(objects, options) {
            if (!this.enabled)
                return this;
            options = this.initializeOptions(options, objects);
            this.getEnabledObjects(objects, options).forEach(object => {
                const data = this.getData(object);
                if (!data || !data.resolvedValues)
                    return;
                this.unapplyAll(object, options?.applyStylesInstantly);
                // if (data.onSwitch) data.onSwitch(undefined, data.index, data.total, this.getObject(data));
            });
            return this;
        }
        /**
         * @function reloadFor
         * @description Generates the transition CSS string for the provided transition with the correct interpolation
         * information.
         * @param {ClassType} object - The element to apply the string to.
         * @returns {this} Itself for method chaining.
         */
        reloadFor(object) {
            if (!this.enabled)
                return this;
            const data = this.getData(object);
            if (!data || !data.enabled || !data.enabled.global)
                return this;
            this.applyAll(object);
            return this;
        }
        getEnabledObjects(objects, options) {
            if (!this.enabled) {
                console.warn("The reifier object you are trying to access is disabled.");
                return [];
            }
            if (!objects)
                objects = [];
            else if (objects instanceof HTMLCollection)
                objects = [...objects];
            else if (!Array.isArray(objects))
                objects = [objects];
            options = this.initializeOptions(options, objects);
            if (options.attachObjects)
                objects.forEach(element => this.attach(element));
            if (options.executeForAll) {
                objects = [];
                this.attachedObjects.forEach(entry => objects.push(entry));
            }
            const enabledObjectsData = [];
            objects.forEach((object) => {
                const data = this.getData(object) || this.generateNewData(object);
                if (!this.filterEnabledObjects(data))
                    return;
                if (options.recomputeIndices || data.index == undefined)
                    data.index = enabledObjectsData.length;
                enabledObjectsData.push(data);
            });
            enabledObjectsData.forEach(data => {
                if (options.recomputeIndices || data.total == undefined)
                    data.total = enabledObjectsData.length;
            });
            return objects;
        }
        /*
         *
         * *********************************
         *
         * Property setting stuff
         *
         * *********************************
         *
         */
        applyAll(object, applyStylesInstantly = false) {
            this.applyReplaceWith(object);
            this.applyStyles(object, undefined, applyStylesInstantly);
            this.applyProperties(object);
            this.applyClasses(object);
        }
        unapplyAll(object, applyStylesInstantly = false) {
            this.unapplyReplaceWith(object);
            this.unapplyStyles(object, applyStylesInstantly);
            this.unapplyProperties(object);
            this.unapplyClasses(object);
        }
        refreshAll() {
            this.refreshReplaceWith();
            this.refreshProperties();
            this.refreshStyles();
            this.refreshClasses();
        }
        applyProperties(object, state) {
            this.applyField(object, "properties", (object, data, state) => {
                const properties = data.resolvedValues?.properties?.[state];
                if (!properties)
                    return;
                for (const [field, value] of Object.entries(properties)) {
                    if (!field || value === undefined)
                        continue;
                    try {
                        if (areSimilar(object[field], value))
                            continue;
                        object[field] = value;
                    }
                    catch (e) {
                        console.error(`Unable to set property ${field} to ${value}: ${e.message}`);
                    }
                }
            }, state);
        }
        unapplyProperties(object) {
            this.applyField(object, "properties", (object, data, state) => {
                const properties = data.resolvedValues?.properties?.[state];
                if (!properties)
                    return;
                for (const field of Object.keys(properties)) {
                    if (!field)
                        continue;
                    try {
                        object[field] = undefined;
                    }
                    catch (e) {
                        console.error(`Unable to unset property ${field}: ${e.message}`);
                    }
                }
            });
        }
        refreshProperties() {
            if (!this.enabled || !this.propertiesEnabled)
                return;
            this.attachedObjects.forEach(object => this.applyProperties(object));
        }
        applyReplaceWith(object, state) {
            this.applyField(object, "replaceWith", (object, data, state) => {
                const newObject = data.resolvedValues?.replaceWith?.[state];
                if (!newObject)
                    return;
                try {
                    if (object instanceof Node && newObject instanceof Node)
                        object.parentNode?.replaceChild(newObject, object);
                    data.object = new WeakRef(newObject);
                }
                catch (e) {
                    console.error(`Unable to replace object: ${e.message}`);
                }
            }, state);
        }
        unapplyReplaceWith(object) {
            return;
        }
        refreshReplaceWith() {
            if (!this.enabled || !this.replacedWithEnabled)
                return;
            this.attachedObjects.forEach(object => this.applyReplaceWith(object));
        }
        applyClasses(object, state) {
            this.applyField(object, "classes", (object, data, state) => {
                if (!(object instanceof Element) || !data.resolvedValues?.classes)
                    return;
                for (const [key, value] of Object.entries(data.resolvedValues.classes)) {
                    gradum(object).toggleClass(value, state === key);
                }
            }, state);
        }
        unapplyClasses(object) {
            this.applyField(object, "classes", (object, data, state) => {
                if (!(object instanceof Element) || !data.resolvedValues?.classes)
                    return;
                for (const value of Object.values(data.resolvedValues.classes)) {
                    gradum(object).toggleClass(value, false);
                }
            });
        }
        refreshClasses() {
            if (!this.enabled || !this.classesEnabled)
                return;
            this.attachedObjects.forEach(object => this.applyClasses(object));
        }
        applyStyles(object, state, applyStylesInstantly = false) {
            this.applyField(object, "styles", (object, data, state) => {
                if (!(object instanceof Element) || !data.resolvedValues?.styles)
                    return;
                const styles = data.resolvedValues.styles[state];
                if (!styles)
                    return;
                const normal = {};
                let hasChainable = false;
                for (const [key, value] of Object.entries(styles)) {
                    if (StatefulReifect.chainableStyleFields.has(key))
                        hasChainable = true;
                    else
                        normal[key] = value;
                }
                if (Object.keys(normal).length > 0)
                    gradum(object).setStyles(normal, applyStylesInstantly);
                if (hasChainable)
                    gradum(object).reloadReifectsChainableStyles();
            }, state);
        }
        unapplyStyles(object, applyStylesInstantly = false) {
            this.applyField(object, "styles", (object, data, state) => {
                if (!(object instanceof Element) || !data.resolvedValues?.styles)
                    return;
                let hasChainable = false;
                for (const state of this.states) {
                    const styles = data.resolvedValues.styles?.[state];
                    if (!styles)
                        return;
                    for (const key of Object.keys(styles)) {
                        if (StatefulReifect.chainableStyleFields.has(key))
                            hasChainable = true;
                        else
                            gradum(object).setStyle(key, "", applyStylesInstantly);
                    }
                }
                data.resolvedValues.styles = {};
                if (hasChainable)
                    gradum(object).reloadReifectsChainableStyles();
            });
        }
        refreshStyles() {
            if (!this.enabled || !this.stylesEnabled)
                return;
            this.attachedObjects.forEach(object => this.applyStyles(object));
        }
        getChainableStyles(object) {
            if (!this.enabled || !this.stylesEnabled)
                return {};
            const data = this.getData(object);
            if (!data?.resolvedValues?.styles || !data.lastState || !data.enabled.global || !data.enabled.styles)
                return {};
            const styles = data.resolvedValues.styles[data.lastState];
            if (!styles)
                return {};
            const result = {};
            for (const [key, value] of Object.entries(styles)) {
                if (StatefulReifect.chainableStyleFields.has(key) && value != null)
                    result[key] = value.toString().trim();
            }
            return result;
        }
        applyField(object, field, callback, state) {
            if (!object || !field)
                return;
            if (!this.enabled || !this[field + "Enabled"])
                return;
            const data = this.getData(object);
            if (!data.enabled || !data.enabled.global || !data.enabled[field])
                return;
            if (!state)
                state = data.lastState;
            if (!data.resolvedValues)
                return;
            callback(object, data, state);
        }
        parseStylesValue(styles) {
            if (!styles || typeof styles === "number")
                return {};
            if (typeof styles === "object")
                return styles;
            const result = {};
            styles.split(";").forEach(entry => {
                const colonIndex = entry.indexOf(":");
                if (colonIndex === -1)
                    return;
                const property = entry.slice(0, colonIndex).trim();
                const value = entry.slice(colonIndex + 1).trim();
                if (property && value)
                    result[property] = value;
            });
            return result;
        }
        //General methods (to be overridden for custom functionalities)
        /**
         * @function filterEnabledObjects
         * @protected
         * @description Decide whether an object should be acted on, warning when one is skipped because the
         * reifect was disabled for it. Override to change which objects a reifect reaches.
         * @param {ReifectObjectData} data - The object's tracked state.
         * @returns {boolean} Whether the reifect applies to this object.
         */
        filterEnabledObjects(data) {
            if (!data.enabled || !data.enabled.global) {
                console.warn("The reified properties instance you are trying to set on an object is " +
                    "disabled for this particular object.");
                return false;
            }
            return true;
        }
        //Utilities
        /**
         * @function processRawProperties
         * @protected
         * @description Resolve an object's per-state values from the reifect's configuration and cache them, so
         * interpolated values are computed once instead of on every state switch. The resolution runs inside an
         * effect, so the cache refreshes by itself when a value it read changes.
         * @param {ClassType} object - The object to resolve values for.
         * @param {StatefulReifectCoreProperties} [override] - Values to resolve instead of the reifect's own.
         */
        processRawProperties(object, override) {
            if (!object)
                return;
            const data = this.getData(object);
            data.disposeEffect?.();
            let firstRun = true;
            data.disposeEffect = effect(() => {
                if (!data.resolvedValues)
                    data.resolvedValues = {};
                if (isNull(override))
                    return;
                const index = data.index ?? 0;
                const total = data.total ?? 1;
                for (const field of StatefulReifect.fields) {
                    const rawValue = this.normalizePropertyConfig(this[field], override?.[field]);
                    if (!data.resolvedValues[field])
                        data.resolvedValues[field] = {};
                    for (const state of this.states) {
                        const resolved = rawValue[state]?.(index, total, object);
                        data.resolvedValues[field][state] = field === "styles"
                            ? this.parseStylesValue(resolved)
                            : resolved;
                    }
                }
                if (!firstRun && data.lastState !== undefined)
                    this.applyAll(object, false);
                firstRun = false;
            });
        }
        generateNewData(object, onSwitch, index) {
            return {
                object: new WeakRef(object),
                enabled: { global: true, properties: true, classes: true, styles: true, replaceWith: true },
                lastState: this.stateOf(object),
                onSwitch: onSwitch,
                index: index,
            };
        }
        initializeOptions(options, objects) {
            if (!objects)
                objects = [];
            else if (objects instanceof HTMLCollection)
                objects = [...objects];
            else if (!Array.isArray(objects))
                objects = [objects];
            options = options || {};
            options.attachObjects = options.attachObjects ?? true;
            options.executeForAll = options.executeForAll ?? (objects.length === 0);
            options.recomputeIndices = options.recomputeIndices ?? (objects.length !== 0);
            options.recomputeProperties = options.recomputeProperties ?? (objects.length !== 0);
            return options;
        }
        /**
         * @description Clone the reifect to create a new copy with the same properties but no attached objects.
         * @returns {StatefulReifect<State, ClassType>} - The new reifect.
         */
        clone() {
            return new StatefulReifect({
                states: this.states,
                properties: this.properties,
                classes: this.classes,
                styles: this.styles,
                replaceWith: this.replaceWith,
            });
        }
        normalizeStates(states) {
            if (Array.isArray(states))
                return states;
            const values = Object.values(states);
            const isNumericEnum = values.some(v => typeof v === "number");
            return (isNumericEnum ? values.filter(v => typeof v === "number") : values);
        }
        normalizePropertyConfig(currentConfig, newConfig) {
            const out = currentConfig ? { ...currentConfig } : {};
            if (isUndefined(newConfig) || !this.states?.length)
                return out;
            const isObject = typeof newConfig === "object" && newConfig !== null && !Array.isArray(newConfig);
            const keys = isObject ? Reflect.ownKeys(newConfig) : [];
            const isStateRecord = isObject && keys.length > 0 &&
                keys.every(key => this.states.includes(key));
            if (isObject && keys.length === 0)
                return out;
            if (typeof newConfig === "function")
                this.states.forEach(state => {
                    out[state] = (index, total, object) => newConfig(state, index, total, object);
                });
            else if (isStateRecord)
                this.states.forEach(state => {
                    const entry = newConfig[state];
                    if (!isUndefined(entry))
                        out[state] = typeof entry === "function"
                            ? entry
                            : () => entry;
                });
            else {
                const entries = Object.entries(newConfig);
                const hasPerPropertyInterpolators = entries.some(([, v]) => typeof v === "function");
                if (hasPerPropertyInterpolators) {
                    this.states.forEach(state => {
                        out[state] = (index, total, object) => {
                            const result = {};
                            for (const [key, val] of entries)
                                result[key] = typeof val === "function"
                                    ? val(index, total, object)
                                    : val;
                            return result;
                        };
                    });
                }
                else {
                    const value = () => newConfig;
                    this.states.forEach(state => out[state] = value);
                }
            }
            return out;
        }
    };
})();

/**
 * @internal
 * @class ReifectFunctionsUtils
 * @description Shared helpers and per-element state behind the reifect functions on {@link GradumSelector}.
 */
class ReifectFunctionsUtils {
    dataMap = new WeakMap;
    data(element) {
        if (element instanceof GradumSelector)
            element = element.element;
        if (this.dataMap.has(element))
            return this.dataMap.get(element);
        const newMap = {
            reifects: new GradumWeakSet(),
            enabled: {},
            onTransitionStart: new Delegate(),
            onTransitionEnd: new Delegate(),
        };
        if (element)
            this.dataMap.set(element, newMap);
        return newMap;
    }
    attachReifect(element, reifect) {
        const data = this.data(element).reifects;
        if (!data.has(reifect))
            data.add(reifect);
    }
    detachReifect(element, reifect) {
        const data = this.data(element).reifects;
        if (data.has(reifect))
            data.delete(reifect);
    }
}

//@ts-nocheck
/**
 * @class Reifect
 * @group Components
 * @category Reifects
 *
 * @template {object} ClassType - The object type this reifier will be applied to.
 * @description A class to manage and apply dynamic properties, styles, classes, and transitions to a
 * set of objects.
 */
class Reifect extends StatefulReifect {
    /**
     * @description Creates an instance of StatefulReifier.
     * @param {StatelessReifectProperties<ClassType>} properties - The configuration properties.
     */
    constructor(properties) {
        properties.states = ["default"];
        super(properties);
    }
    /**
     * @description The properties to be assigned to the objects. It could take:
     * - A record of `{key: value}` pairs.
     * - An interpolation function that would return a record of `{key: value}` pairs.
     * The interpolation function would take as arguments:
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     */
    get properties() {
        return super.properties?.["default"];
    }
    set properties(value) {
        super.properties = value;
    }
    /**
     * @description The styles to be assigned to the objects (only if they are eligible elements). It could take:
     * - A record of `{CSS property: value}` pairs.
     * - An interpolation function that would return a record of `{key: value}` pairs.
     * The interpolation function would take as arguments:
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     */
    get styles() {
        return super.styles?.["default"];
    }
    set styles(value) {
        super.styles = value;
    }
    /**
     * @description The classes to be assigned to the objects (only if they are eligible elements). It could take:
     * - A string of space-separated classes.
     * - An array of classes.
     * - An interpolation function that would return a string of space-separated classes or an array of classes.
     * The interpolation function would take as arguments:
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     */
    get classes() {
        return super.classes?.["default"];
    }
    set classes(value) {
        super.classes = value;
    }
    /**
     * @description The object that should replace (in the DOM as well if eligible) the attached objects. It could take:
     * - The object to be replaced with.
     * - An interpolation function that would return the object to be replaced with.
     * The interpolation function would take as arguments:
     * - `index: number`: the index of the object in the applied list.
     * - `total: number`: the total number of objects in the applied list.
     * - `object: ClassType`: the object itself.
     */
    get replaceWith() {
        return super.replaceWith?.["default"];
    }
    set replaceWith(value) {
        super.replaceWith = value;
    }
    initialize(objects, options) {
        super.initialize("default", objects, options);
    }
    apply(objects, options) {
        super.apply("default", objects, options);
    }
    normalizePropertyConfig(currentConfig, newConfig) {
        if (typeof newConfig === "function" && newConfig.length <= 3) {
            const wrapped = (_state, index, total, object) => newConfig(index, total, object);
            return super.normalizePropertyConfig(currentConfig, wrapped);
        }
        return super.normalizePropertyConfig(currentConfig, newConfig);
    }
}

/**
 * @enum {Direction}
 * @group Core Types
 * @category Enums
 *
 * @description The axis a component lays out, scrolls, or moves along.
 * @property {Direction.vertical} vertical - Along the y axis.
 * @property {Direction.horizontal} horizontal - Along the x axis.
 */
var Direction;
(function (Direction) {
    Direction["vertical"] = "vertical";
    Direction["horizontal"] = "horizontal";
})(Direction || (Direction = {}));
/**
 * @enum {SideH}
 * @group Core Types
 * @category Enums
 *
 * @description One of the two horizontal sides. Use {@link Side} when vertical sides are also valid.
 * @property {SideH.left} left - The left side.
 * @property {SideH.right} right - The right side.
 */
var SideH;
(function (SideH) {
    SideH["left"] = "left";
    SideH["right"] = "right";
})(SideH || (SideH = {}));
/**
 * @enum {SideV}
 * @group Core Types
 * @category Enums
 *
 * @description One of the two vertical sides. Use {@link Side} when horizontal sides are also valid.
 * @property {SideV.top} top - The top side.
 * @property {SideV.bottom} bottom - The bottom side.
 */
var SideV;
(function (SideV) {
    SideV["top"] = "top";
    SideV["bottom"] = "bottom";
})(SideV || (SideV = {}));
/**
 * @enum {Side}
 * @group Core Types
 * @category Enums
 *
 * @description Any one of the four sides of a rectangle or element — which edge a
 * {@link GradumDrawer} slides from, for instance.
 * @property {Side.top} top - The top side.
 * @property {Side.bottom} bottom - The bottom side.
 * @property {Side.left} left - The left side.
 * @property {Side.right} right - The right side.
 */
var Side;
(function (Side) {
    Side["top"] = "top";
    Side["bottom"] = "bottom";
    Side["left"] = "left";
    Side["right"] = "right";
})(Side || (Side = {}));
/**
 * @enum {InOut}
 * @group Core Types
 * @category Enums
 *
 * @description Whether a motion travels toward a centre or away from it, such as the direction of a
 * {@link GradumMarkingMenu} gesture.
 * @property {InOut.in} in - Inward, toward the centre.
 * @property {InOut.out} out - Outward, away from the centre.
 */
var InOut;
(function (InOut) {
    InOut["in"] = "in";
    InOut["out"] = "out";
})(InOut || (InOut = {}));
/**
 * @enum {OnOff}
 * @group Core Types
 * @category Enums
 *
 * @description A two-state toggle, for states better named on/off than `true`/`false`.
 * @property {OnOff.on} on - Enabled.
 * @property {OnOff.off} off - Disabled.
 */
var OnOff;
(function (OnOff) {
    OnOff["on"] = "on";
    OnOff["off"] = "off";
})(OnOff || (OnOff = {}));
/**
 * @enum {Open}
 * @group Core Types
 * @category Enums
 *
 * @description Whether a container currently exposes its content.
 * @property {Open.open} open - Content is exposed.
 * @property {Open.closed} closed - Content is collapsed away.
 */
var Open;
(function (Open) {
    Open["open"] = "open";
    Open["closed"] = "closed";
})(Open || (Open = {}));
/**
 * @enum {Shown}
 * @group Core Types
 * @category Enums
 *
 * @description Whether an element is displayed. Used as the pair of states a reifect transitions
 * between, and by {@link GradumContentSwitch} to pick the active child.
 * @property {Shown.visible} visible - Displayed.
 * @property {Shown.hidden} hidden - Not displayed.
 */
var Shown;
(function (Shown) {
    Shown["visible"] = "visible";
    Shown["hidden"] = "hidden";
})(Shown || (Shown = {}));
/**
 * @enum {AccessLevel}
 * @group Core Types
 * @category Enums
 *
 * @description How widely a member is exposed, mirroring the TypeScript access modifiers.
 * @property {AccessLevel.public} public - Reachable from anywhere.
 * @property {AccessLevel.protected} protected - Reachable from the declaring class and its subclasses.
 * @property {AccessLevel.private} private - Reachable only from the declaring class.
 */
var AccessLevel;
(function (AccessLevel) {
    AccessLevel["public"] = "public";
    AccessLevel["protected"] = "protected";
    AccessLevel["private"] = "private";
})(AccessLevel || (AccessLevel = {}));
/**
 * @enum {Range}
 * @group Core Types
 * @category Enums
 *
 * @description Which end of a bounded range a value refers to.
 * @property {Range.min} min - The lower bound.
 * @property {Range.max} max - The upper bound.
 */
var Range;
(function (Range) {
    Range["min"] = "min";
    Range["max"] = "max";
})(Range || (Range = {}));
/**
 * @enum {Anchor}
 * @group Core Types
 * @category Enums
 *
 * @description A reference point on a rectangle — the nine combinations of a vertical and a horizontal
 * position. Used to anchor a {@link GradumRect} or an {@link AnchorPoint}.
 * @property {Anchor.TopLeft} TopLeft - Top-left corner.
 * @property {Anchor.TopMiddle} TopMiddle - Centre of the top edge.
 * @property {Anchor.TopRight} TopRight - Top-right corner.
 * @property {Anchor.CenterLeft} CenterLeft - Centre of the left edge.
 * @property {Anchor.Center} Center - Centre of the rectangle.
 * @property {Anchor.CenterRight} CenterRight - Centre of the right edge.
 * @property {Anchor.BottomLeft} BottomLeft - Bottom-left corner.
 * @property {Anchor.BottomMiddle} BottomMiddle - Centre of the bottom edge.
 * @property {Anchor.BottomRight} BottomRight - Bottom-right corner.
 */
var Anchor;
(function (Anchor) {
    Anchor["TopLeft"] = "topLeft";
    Anchor["TopRight"] = "topRight";
    Anchor["TopMiddle"] = "topMiddle";
    Anchor["BottomLeft"] = "bottomLeft";
    Anchor["BottomMiddle"] = "bottomMiddle";
    Anchor["BottomRight"] = "bottomRight";
    Anchor["Center"] = "center";
    Anchor["CenterLeft"] = "centerLeft";
    Anchor["CenterRight"] = "centerRight";
})(Anchor || (Anchor = {}));

const utils$1 = new ReifectFunctionsUtils();
const showTransition = new StatefulReifect({
    states: [Shown.visible, Shown.hidden],
    styles: (state) => `visibility: ${state}`
});
/**
 * @internal
 * @function setupReifectFunctions
 * @description Install the reifect functions (`show`, `applyReifect`, `attachReifect`, ...) onto the
 * {@link GradumSelector} prototype. Called once by {@link gradumify}; the matching `exclude` option skips it.
 */
function setupReifectFunctions() {
    /**
     * @description Adds a readonly "reifects" property to Node prototype.
     */
    Object.defineProperty(GradumSelector.prototype, "reifects", {
        get: function () {
            if (!this.element)
                return new Set();
            return new Set(utils$1.data(this.element).reifects?.toArray());
        },
        configurable: false,
        enumerable: true
    });
    /**
     * @description Adds a configurable "showTransition" property to Node prototype. Defaults to a global
     * transition assigned to all nodes.
     */
    Object.defineProperty(GradumSelector.prototype, "showTransition", {
        get: function () {
            if (!this.element)
                return;
            const data = utils$1.data(this.element);
            if (!data.showTransition)
                data.showTransition = showTransition;
            return data.showTransition;
        },
        set: function (value) {
            if (!this.element)
                return;
            utils$1.data(this.element).showTransition = value;
        },
        configurable: true,
        enumerable: true
    });
    /**
     * @description Boolean indicating whether the node is shown or not, based on its showTransition.
     */
    Object.defineProperty(GradumSelector.prototype, "isShown", {
        get: function () {
            if (!this.element)
                return;
            const state = this.showTransition.stateOf(this.element);
            if (state == Shown.visible)
                return true;
            else if (state == Shown.hidden)
                return false;
            return this.element.style.display != "none"
                && this.element.style.visibility != "hidden"
                && this.element.style.opacity != "0";
        },
        configurable: false,
        enumerable: true
    });
    /**
     * @description Show or hide the element (based on CSS) by transitioning in/out of the element's showTransition.
     * @param {boolean} b - Whether to show the element or not
     * @param {ReifectAppliedOptions<Shown>} [options={executeForAll: false}] - The options to pass to the reifect
     * execution.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.show = function _show(b, options = {}) {
        if (!this.element)
            return this;
        if (!options.executeForAll)
            options.executeForAll = false;
        this.showTransition.apply(b ? Shown.visible : Shown.hidden, this.element, options);
        return this;
    };
    GradumSelector.prototype.attachReifect = function _attachReifect(...reifects) {
        if (!this.element || typeof this.element !== "object")
            return this;
        reifects.forEach(entry => {
            if (this.reifects.has(entry))
                return;
            utils$1.attachReifect(this.element, entry);
            entry.attach(this.element);
        });
        return this;
    };
    GradumSelector.prototype.detachReifect = function _detachReifect(...reifects) {
        if (!this.element || typeof this.element !== "object")
            return this;
        reifects.forEach(entry => {
            if (!this.reifects.has(entry))
                return;
            utils$1.detachReifect(this.element, entry);
            entry.detach(this.element);
        });
        return this;
    };
    GradumSelector.prototype.initializeReifect = function _initializeReifect(reifect, state, options) {
        if (!this.element)
            return this;
        if (reifect instanceof Reifect)
            reifect.initialize(this.element, options);
        else
            reifect.initialize(this.element, state, options);
        return this;
    };
    GradumSelector.prototype.applyReifect = function _applyReifect(reifect, state, options) {
        if (!this.element)
            return this;
        if (reifect instanceof Reifect)
            reifect.apply(this.element, options);
        else
            reifect.apply(this.element, state, options);
        return this;
    };
    GradumSelector.prototype.toggleReifect = function _toggleReifect(reifect, options) {
        if (!this.element)
            return this;
        if (reifect instanceof Reifect)
            return this;
        else
            reifect.toggle(this.element, options);
        return this;
    };
    GradumSelector.prototype.reloadReifects = function _reloadReifects() {
        if (!this.element)
            return this;
        this.reifects.forEach(reifect => reifect.reloadFor(this.element));
        return this;
    };
    GradumSelector.prototype.reloadReifectsChainableStyles = function _reloadChainableStyles(applyInstantly = true) {
        if (!this.element)
            return this;
        const contributions = {};
        this.reifects.forEach((reifect) => {
            const chainable = reifect.getChainableStyles(this.element);
            for (const [key, value] of Object.entries(chainable)) {
                if (!value)
                    continue;
                if (!contributions[key])
                    contributions[key] = [];
                contributions[key].push(value);
            }
        });
        for (const [key, values] of Object.entries(contributions)) {
            const separator = key === "transform" ? " " : ", ";
            gradum(this.element).setStyle(key, values.join(separator), applyInstantly);
        }
        return this;
    };
    GradumSelector.prototype.reifectEnabledState = function _reifectEnabledState(reifect) {
        if (!this.element)
            return {};
        if (reifect)
            return reifect.getObjectEnabledState(this.element);
        return utils$1.data(this.element).enabled;
    };
    GradumSelector.prototype.enableReifect = function _enableReifect(value, reifect) {
        if (!this.element)
            return this;
        const enabled = reifect ? reifect.getData(this.element)?.enabled
            : utils$1.data(this.element).enabled;
        if (!enabled)
            return this;
        if (typeof value === "boolean")
            enabled.global = value;
        else if (typeof value === "object")
            Object.entries(value)
                .forEach(([key, value]) => enabled[key] = value);
        return this;
    };
}

const cache$1 = new WeakMap();
function gradum(tagOrElement, raw = false) {
    gradumify();
    let el;
    if (!tagOrElement)
        tagOrElement = "div";
    if (typeof tagOrElement === "string")
        el = element({ tag: tagOrElement });
    else if (typeof tagOrElement === "object") {
        if (tagOrElement instanceof GradumSelector)
            return tagOrElement;
        if (raw || tagOrElement instanceof Node)
            el = tagOrElement;
        else if (tagOrElement["element"] && typeof tagOrElement["element"] === "object") {
            el = tagOrElement["element"];
        }
        else
            el = tagOrElement;
    }
    const cached = cache$1.get(el);
    if (cached)
        return cached;
    const gradumSelector = new GradumSelector();
    gradumSelector.element = el;
    cache$1.set(el, gradumSelector);
    return gradumSelector;
}
function gr(tagOrElement, raw = false) {
    return gradum(tagOrElement, raw);
}
function g(tagOrElement, raw = false) {
    return gradum(tagOrElement, raw);
}
function $(tagOrElement, raw = false) {
    return gradum(tagOrElement, raw);
}
/**
 * @function gradumify
 * @group GradumSelector
 * @category Core
 *
 * @description Install every selector function onto the {@link GradumSelector} prototype. Runs once — later
 * calls are no-ops — and is invoked automatically the first time {@link gradum} is called, so you rarely
 * need it directly. Call it yourself only to opt a family of functions out before anything else runs.
 * @param {GradumifyOptions} [options={}] - Which function families to skip.
 *
 * @example
 * ```ts
 * // Install everything except the tool and constrainer functions.
 * gradumify({excludeToolFunctions: true, excludeConstrainerFunctions: true});
 * ```
 */
const gradumify = callOnce(function (options = {}) {
    if (!options.excludeHierarchyFunctions)
        setupHierarchyFunctions();
    if (!options.excludeMvcFunctions)
        setupMvcFunctions();
    if (!options.excludeMiscFunctions)
        setupMiscFunctions();
    if (!options.excludeClassFunctions)
        setupClassFunctions();
    if (!options.excludeElementFunctions)
        setupElementFunctions();
    if (!options.excludeEventFunctions)
        setupEventFunctions();
    if (!options.excludeStyleFunctions)
        setupStyleFunctions();
    if (!options.excludeToolFunctions)
        setupToolFunctions();
    if (!options.excludeConstrainerFunctions)
        setupConstrainerFunctions();
    if (!options.excludeReifectFunctions)
        setupReifectFunctions();
});

/**
 * @internal
 */
function keyFromArgs(args) {
    if (!args || args.length === 0)
        return "__no_args__";
    return JSON.stringify(args.map((v) => {
        if (typeof v === "function")
            return `function:${v.name}`;
        if (v && typeof v === "object") {
            try {
                return JSON.stringify(Object.entries(v).sort());
            }
            catch {
                return "[[unserializable-object]]";
            }
        }
        return v === undefined ? "undefined" : v;
    }));
}
/**
 * @internal
 */
function cacheKeySymbolFor(name) {
    return Symbol(`__cache__${name}`);
}
/**
 * @internal
 */
function initInvalidation(instance, name, isGetterCache, cacheKey, timeouts, options, deleteFn) {
    // onEvent: attach to instance if it’s an EventTarget, else to document
    if (options.onEvent) {
        const target = typeof instance?.addEventListener === "function" ? instance : document;
        const names = Array.isArray(options.onEvent)
            ? options.onEvent
            : String(options.onEvent).split(/\s+/).filter(Boolean);
        for (const evt of names)
            $(target).on(evt, () => deleteFn());
    }
    // onFieldChange: wrap methods / define property setters to invalidate
    if (options.onFieldChange) {
        const list = Array.isArray(options.onFieldChange)
            ? options.onFieldChange
            : [options.onFieldChange];
        for (const fieldOrFn of list) {
            const fieldName = typeof fieldOrFn === "string" ? fieldOrFn : fieldOrFn.name;
            if (!fieldName)
                continue;
            const desc = getFirstDescriptorInChain(instance, fieldName);
            // If it's a method, wrap it (on the instance) to invalidate before/after
            const existing = instance[fieldName];
            if (typeof existing === "function") {
                const originalFn = existing;
                Object.defineProperty(instance, fieldName, {
                    configurable: true,
                    enumerable: desc?.enumerable ?? true,
                    writable: true,
                    value: function (...args) {
                        deleteFn(); // invalidate first
                        return originalFn.apply(this, args);
                    },
                });
            }
            else {
                // Data / accessor property — define an instance-level accessor that invalidates on set
                const getFallback = () => desc?.get ? desc.get.call(instance) : existing;
                const setFallback = (nv) => {
                    if (desc?.set)
                        desc.set.call(instance, nv);
                    else {
                        // define on instance to shadow proto
                        Object.defineProperty(instance, fieldName, {
                            configurable: true,
                            enumerable: true,
                            writable: true,
                            value: nv,
                        });
                    }
                };
                Object.defineProperty(instance, fieldName, {
                    configurable: true,
                    enumerable: desc?.enumerable ?? true,
                    get() {
                        return getFallback();
                    },
                    set(nv) {
                        deleteFn();
                        setFallback(nv);
                    },
                });
            }
        }
    }
    // onCallback (polling) — clears on a "destroy" event if the instance supports it
    if (options.onCallback) {
        const id = setInterval(() => {
            const res = options.onCallback.call(instance);
            if (res instanceof Promise) {
                res.then((v) => deleteFn(Boolean(v)));
            }
            else {
                deleteFn(Boolean(res));
            }
        }, options.onCallbackFrequency ?? 50);
        if (typeof instance?.addEventListener === "function") {
            instance.addEventListener("destroy", () => clearInterval(id), { once: true });
        }
    }
    // convenience time-based deletion helpers are scheduled where we write cache
}

/**
 * @decorator
 * @function cache
 * @group Decorators
 * @category Cache
 *
 * @description Stage-3 decorator that memorizes expensive reads.
 *
 * **What it does**
 * - **Method**: caches the return value **per unique arguments** (using a stable key from args).
 * - **Getter**: caches the value **once per instance** until invalidated.
 * - **Accessor**: wraps the `get` path like a cached getter; the `set` path invalidates cached value.
 * @param {CacheOptions} [options] - Optional caching configuration to define when to clear it (on event, after
 * timeout, on next frame, on callback, etc.).
 *
 * @example
 * ```ts
 * class IconRenderer {
 *   #value = 0;
 *
 *   // Accessor: cached read; any write invalidates immediately
 *   @cache({clearOnNextFrame: true}) accessor data = {
 *     get: () => this.#value,
 *     set: (v: number) => { this.#value = v; }
 *   };
 *
 *   // Caches per argument list (e.g., same path ⇒ same result until invalidation)
 *   @cache({timeout: 5_000}) async loadSvg(path: string): Promise<string> {
 *     // ...expensive IO
 *     return fetch(path).then(r => r.text());
 *   }
 * }
 * ```
 */
//TODO FIX THEN TEST ON ICON loadSvg
function cache(options = {}) {
    return function (value, context) {
        const { kind, name, static: isStatic } = context;
        const key = name;
        const cacheKey = cacheKeySymbolFor(key);
        const setupKey = Symbol(`__cache__setup__${key}`);
        const timeouts = [];
        const deleteCallback = function (hard = true) {
            if (!hard)
                return;
            const slot = this[cacheKey];
            if (!slot)
                return;
            if (slot instanceof Map)
                slot.clear();
            else
                delete this[cacheKey];
            for (const t of timeouts)
                clearTimeout(t);
            timeouts.length = 0;
        };
        // one-time per-instance setup
        const ensureSetup = function () {
            if (this[setupKey])
                return;
            this[setupKey] = true;
            initInvalidation(this, key, kind === "getter" || kind === "accessor", cacheKey, timeouts, options, deleteCallback.bind(this));
        };
        if (kind === "method") {
            const original = value;
            context.addInitializer(function () {
                if (!this[cacheKey])
                    this[cacheKey] = new Map();
            });
            return function (...args) {
                ensureSetup.call(this);
                const map = this[cacheKey] ?? (this[cacheKey] = new Map());
                const k = keyFromArgs(args);
                if (map.has(k))
                    return map.get(k);
                const result = original.apply(this, args);
                map.set(k, result);
                // timeouts/RAF per-entry:
                if (options.timeout) {
                    const tid = setTimeout(() => map.delete(k), options.timeout);
                    timeouts.push(tid);
                }
                if (options.clearOnNextFrame) {
                    const raf = (typeof requestAnimationFrame === "function"
                        ? requestAnimationFrame
                        : (fn) => setTimeout(fn, 0));
                    raf(() => deleteCallback.call(this));
                }
                return result;
            };
        }
        // ---- GETTER -----------------------------------------------------------
        if (kind === "getter") {
            const originalGet = value;
            return function () {
                ensureSetup.call(this);
                if (this[cacheKey] === undefined) {
                    this[cacheKey] = originalGet.call(this);
                    if (options.timeout) {
                        const tid = setTimeout(() => deleteCallback.call(this), options.timeout);
                        timeouts.push(tid);
                    }
                    if (options.clearOnNextFrame) {
                        const raf = (typeof requestAnimationFrame === "function"
                            ? requestAnimationFrame
                            : (fn) => setTimeout(fn, 0));
                        raf(() => deleteCallback.call(this));
                    }
                }
                return this[cacheKey];
            };
        }
        // ---- ACCESSOR (wrap read path; keep set untouched) --------------------
        if (kind === "accessor") {
            const orig = value;
            return {
                get() {
                    ensureSetup.call(this);
                    if (this[cacheKey] === undefined) {
                        const out = orig.get ? orig.get.call(this) : undefined;
                        this[cacheKey] = out;
                        if (options.timeout) {
                            const tid = setTimeout(() => deleteCallback.call(this), options.timeout);
                            timeouts.push(tid);
                        }
                        if (options.clearOnNextFrame) {
                            const raf = (typeof requestAnimationFrame === "function"
                                ? requestAnimationFrame
                                : (fn) => setTimeout(fn, 0));
                            raf(() => deleteCallback.call(this));
                        }
                    }
                    return this[cacheKey];
                },
                set(v) {
                    // when the underlying value changes, invalidate cache immediately
                    deleteCallback.call(this);
                    if (orig.set)
                        orig.set.call(this, v);
                },
                init(initial) {
                    // keep normal accessor init behavior
                    return initial;
                },
            };
        }
    };
}
/**
 * @function clearCache
 * @group Decorators
 * @category Cache
 *
 * @description Clear *all* cache entries created by `@cache` on an instance.
 * @param {any} instance - The instance for which the cache should be cleared.
 */
function clearCache(instance) {
    for (const sym of Object.getOwnPropertySymbols(instance)) {
        if (String(sym).startsWith("Symbol(__cache__")) {
            delete instance[sym];
        }
    }
}
/**
 * @function clearCacheEntry
 * @group Decorators
 * @category Cache
 *
 * @description Clear a specific cache entry for a given method, function, or getter.
 * @param {any} instance - The instance for which the cache should be cleared.
 * @param {string | Function} field - The name (or the function itself) of the field to clear.
 */
function clearCacheEntry(instance, field) {
    const name = typeof field === "function" ? field.name : field;
    const sym = Object.getOwnPropertySymbols(instance).find((s) => String(s) === `Symbol(__cache__${name})`);
    if (sym)
        delete instance[sym];
}

/**
 * @decorator
 * @function solver
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 decorator that turns methods into constrainer solvers.
 * @example
 * ```ts
 * @solver private constrainPosition(properties: ConstrainerSolverProperties) {...}
 * ```
 * Is equivalent to:
 * ```ts
 * private constrainPosition(properties: ConstrainerSolverProperties) {...}
 *
 * public initialize() {
 *   ...
 *   $(this).addSolver(this.constrainPosition);
 * }
 * ```
 */
function solver(properties) {
    return function (value, context) {
        if (!properties || typeof properties !== "object")
            properties = {};
        if (!properties.name)
            properties.name = context?.name;
        context.addInitializer(function () {
            if (!this["solversMetadata"])
                return;
            for (let i = this["solversMetadata"].length - 1; i >= 0; i--) {
                if (this["solversMetadata"][i]?.name === properties.name)
                    this["solversMetadata"].splice(i, 1);
            }
            this["solversMetadata"]?.push(properties);
        });
        return value;
    };
}
/**
 * @decorator
 * @function checker
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 decorator that turns methods into constrainer checkers.
 * @example
 * ```ts
 * @checker private constrainPosition(properties: ConstrainerSolverProperties) {...}
 * ```
 * Is equivalent to:
 * ```ts
 * private constrainPosition(properties: ConstrainerSolverProperties) {...}
 *
 * public initialize() {
 *   ...
 *   $(this).addChecker(this.constrainPosition);
 * }
 * ```
 */
function checker(properties) {
    return function (value, context) {
        if (!properties || typeof properties !== "object")
            properties = {};
        if (!properties.name)
            properties.name = context?.name;
        context.addInitializer(function () {
            if (!this["checkersMetadata"])
                return;
            for (let i = this["checkersMetadata"].length - 1; i >= 0; i--) {
                if (this["checkersMetadata"][i]?.name === properties.name)
                    this["checkersMetadata"].splice(i, 1);
            }
            this["checkersMetadata"]?.push(properties);
        });
        return value;
    };
}
/**
 * @decorator
 * @function mutator
 * @group Decorators
 * @category MVC
 *
 * @description Stage-3 decorator that turns methods into constrainer mutators.
 * @example
 * ```ts
 * @mutator private constrainPosition(properties: ConstrainerSolverProperties) {...}
 * ```
 * Is equivalent to:
 * ```ts
 * private constrainPosition(properties: ConstrainerSolverProperties) {...}
 *
 * public initialize() {
 *   ...
 *   $(this).addMutator(this.constrainPosition);
 * }
 * ```
 */
function mutator(properties) {
    return function (value, context) {
        if (!properties || typeof properties !== "object")
            properties = {};
        if (!properties.name)
            properties.name = context?.name;
        context.addInitializer(function () {
            if (!this["mutatorsMetadata"])
                return;
            for (let i = this["mutatorsMetadata"].length - 1; i >= 0; i--) {
                if (this["mutatorsMetadata"][i]?.name === properties.name)
                    this["mutatorsMetadata"].splice(i, 1);
            }
            this["mutatorsMetadata"]?.push(properties);
        });
        return value;
    };
}

/**
 * @internal
 * @class ObserveUtils
 * @description Tracks which properties the `@observe` decorator has already patched, keyed by prototype.
 */
class ObserveUtils {
    constructorMap = new WeakMap();
    constructorData(target) {
        let obj = this.constructorMap.get(target);
        if (!obj) {
            obj = { installed: new Map() };
            this.constructorMap.set(target, obj);
        }
        return obj;
    }
}

if (!("metadata" in Symbol)) {
    Object.defineProperty(Symbol, "metadata", {
        value: Symbol.for("Symbol.metadata"),
        writable: false, enumerable: false, configurable: true,
    });
}
const utils = new ObserveUtils();
/**
 * @decorator
 * @function observe
 * @group Decorators
 * @category Attributes
 *
 * @description Stage-3 decorator for fields, getters, setters, and accessors that reflects a property to an HTML
 * attribute. So when the value of the property changes, it is reflected in the element's HTML attributes.
 * It also records the attribute name into the class's `observedAttributed` to listen for changes on the HTML.
 *
 * @example
 * ```ts
 * @define()
 * class MyClass extends HTMLElement {
 *    @observe fieldName: string = "hello";
 * }
 * ```
 *
 * Leads to:
 * ```html
 * <my-class field-name="hello"></my-class>
 * ```
 *
 */
function observe(value, context) {
    const { kind, name, static: isStatic } = context;
    const key = String(name);
    const attribute = camelToKebabCase(key);
    const backing = Symbol(`__observed_${key}`);
    if (context.metadata) {
        const observedAttributes = context.metadata.observedAttributes;
        if (!Object.prototype.hasOwnProperty.call(context.metadata, "observedAttributes"))
            context.metadata.observedAttributes = new Set(observedAttributes);
        else if (!observedAttributes)
            context.metadata.observedAttributes = new Set();
        context.metadata.observedAttributes.add(attribute);
    }
    context.addInitializer(function () {
        const prototype = isStatic ? this : getFirstPrototypeInChainWith(this, key);
        let customGetter;
        let customSetter;
        if (kind === "field" || kind === "accessor")
            try {
                this[backing] = this[name];
            }
            catch { }
        const read = function () {
            return customGetter ? customGetter.call(this) : this[backing];
        };
        const write = function (value) {
            const previous = this[key];
            if (previous === value)
                return;
            if (customSetter)
                customSetter.call(this, value);
            else
                this[backing] = value;
            this.setAttribute?.(attribute, stringify(this[key]));
        };
        if (kind === "field" || kind === "accessor") {
            const accessor = value;
            if (accessor?.get)
                customGetter = accessor.get;
            if (accessor?.set)
                customSetter = accessor.set;
            const descriptor = getFirstDescriptorInChain(this, key);
            if (descriptor?.get)
                customGetter = descriptor.get;
            if (descriptor?.set)
                customSetter = descriptor.set;
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: descriptor?.enumerable ?? true,
                get: () => read.call(this),
                set: (value) => write.call(this, value),
            });
        }
        else if (kind === "getter" || kind === "setter") {
            const installed = utils.constructorData(prototype).installed;
            if (installed.get(key))
                return;
            installed.set(key, true);
            const descriptor = getFirstDescriptorInChain(prototype, key) ?? {};
            if (typeof descriptor.get === "function")
                customGetter = descriptor.get;
            if (typeof descriptor.set === "function")
                customSetter = descriptor.set;
            Object.defineProperty(prototype, key, {
                configurable: true,
                enumerable: !!descriptor?.enumerable,
                get: function () { return read.call(this); },
                set: function (value) { write.call(this, value); },
            });
        }
    });
}

/**
 * @function flexCol
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create an element that lays its children out in a vertical flex column.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `display: flex` and
 * `flex-direction: column` already applied.
 */
function flexCol(properties) {
    const el = element(properties);
    $(el).setStyles({ display: "flex", flexDirection: "column" }, true);
    return el;
}
/**
 * @function flexColCenter
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create a vertical flex column that also centers its children on both axes.
 * Same as {@link flexCol}, with the centering styles applied on top.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `display: flex`,
 * `flex-direction: column`, `justify-content: center`, and `align-items: center` applied.
 */
function flexColCenter(properties) {
    const el = flexCol(properties);
    $(el).setStyles({ justifyContent: "center", alignItems: "center" }, true);
    return el;
}
/**
 * @function flexRow
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create an element that lays its children out in a horizontal flex row.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `display: flex` and
 * `flex-direction: row` already applied.
 */
function flexRow(properties) {
    const el = element(properties);
    $(el).setStyles({ display: "flex", flexDirection: "row" }, true);
    return el;
}
/**
 * @function flexRowCenter
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create a horizontal flex row that also centers its children on both axes.
 * Same as {@link flexRow}, with the centering styles applied on top.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `display: flex`,
 * `flex-direction: row`, `justify-content: center`, and `align-items: center` applied.
 */
function flexRowCenter(properties) {
    const el = flexRow(properties);
    $(el).setStyles({ justifyContent: "center", alignItems: "center" }, true);
    return el;
}
/**
 * @function spacer
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create an element that absorbs the free space of its flex parent, pushing the
 * siblings on either side of it apart.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `flex-grow: 1` already applied.
 */
function spacer(properties) {
    const el = element(properties);
    $(el).setStyle("flexGrow", 1, true);
    return el;
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$4 = "gradum-button{align-items:center;background-color:#dadada;border:1px solid #000;border-radius:.4em;color:#000;display:inline-flex;flex-direction:row;gap:.4em;padding:.5em .7em;text-decoration:none}gradum-button>h4{flex-grow:1}";
styleInject(css_248z$4);

/**
 * @function getFileExtension
 * @group Utilities
 * @category String
 *
 * @description Read the extension off a filename or path, leading dot included. Also used to tell a file path
 * from a directory path, since a directory yields an empty string.
 * @param {string} [str] - The filename or path to read.
 * @returns {string} The extension including its dot (`".png"`), or an empty string if there is none. Only
 * extensions of one to four characters are recognized.
 */
function getFileExtension(str) {
    if (!str || str.length == 0)
        return "";
    const match = str.match(/\.\S{1,4}$/);
    return match ? match[0] : "";
}

/**
 * @function textToElement
 * @group Utilities
 * @category DOM
 *
 * @description Parse a string of HTML into a live element. Only the first top-level element of the string is
 * returned, so wrap multiple siblings in a container if you need all of them.
 * @param {string} text - The markup to parse.
 * @returns {Element} The parsed element, or `undefined` if the string held no element.
 */
function textToElement(text) {
    let wrapper = document.createElement("div");
    wrapper.innerHTML = text;
    return wrapper.children[0];
}
/**
 * @function createProxy
 * @group Utilities
 * @category DOM
 *
 * @template {object} SelfType - The type of the primary object.
 * @template {object} ProxiedType - The type of the fallback object.
 * @description Combine two objects into one, without copying anything. Reads and writes go to the first
 * object when it already has the property, and fall through to the second otherwise — so the first shadows
 * the second, and both stay live rather than being snapshotted.
 * @param {SelfType} self - The primary object, consulted first.
 * @param {ProxiedType} proxied - The fallback object, used for anything the primary lacks.
 * @returns {SelfType & ProxiedType} A proxy exposing both objects as one.
 */
function createProxy(self, proxied) {
    return new Proxy(self, {
        get(target, prop, receiver) {
            if (prop in target)
                return Reflect.get(target, prop, receiver);
            if (prop in proxied)
                return Reflect.get(proxied, prop, receiver);
            return undefined;
        },
        set(target, prop, value, receiver) {
            if (prop in target)
                return Reflect.set(target, prop, value, receiver);
            return Reflect.set(proxied, prop, value, receiver);
        }
    });
}

/**
 * @function fetchSvg
 * @group Utilities
 * @category SVG
 *
 * @description Fetch an SVG file and parse it into a live element, ready to be inserted into the document.
 * Because the markup is parsed rather than placed in an `<img>`, the result can be styled and scripted.
 * @param {string} path - The path or URL to fetch the SVG from.
 * @param {boolean} [logError=true] - Whether to also log failures to the console. The promise rejects either
 * way.
 * @returns {Promise<SVGElement>} The parsed SVG element. Rejects on an empty path, a failed request, or
 * markup that does not parse.
 */
function fetchSvg(path, logError = true) {
    return new Promise((resolve, reject) => {
        if (!path || path.length === 0) {
            reject(new Error("Invalid path"));
            return;
        }
        fetch(path)
            .then(response => {
            if (!response.ok)
                throw new Error("Network response was not ok while loading your SVG");
            return response.text();
        })
            .then(svgText => {
            const svg = textToElement(svgText);
            if (!svg)
                throw new Error("Error parsing SVG text");
            resolve(svg);
        })
            .catch(error => {
            if (!logError)
                reject(error);
            console.error("Error fetching SVG:", error);
            reject(error);
        });
    });
}

/**
 * @class Color
 * @group Utilities
 * @category Color
 *
 * @description Unified color class. Parses any CSS color string (hex, rgb/rgba, hsl/hsla), stores the color
 * internally as RGBA, and provides conversions, interpolation, luminance, and contrast utilities.
 * All channels are kept in sync: setting any of r/g/b/a/h/s/l/hex updates the rest automatically.
 */
let Color = (() => {
    let _instanceExtraInitializers = [];
    let _set_r_decorators;
    let _set_g_decorators;
    let _set_b_decorators;
    let _set_a_decorators;
    let _set_h_decorators;
    let _set_s_decorators;
    let _set_l_decorators;
    let _set_hex_decorators;
    return class Color {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _set_r_decorators = [auto({ preprocessValue: (value) => trim(value, 255) })];
            _set_g_decorators = [auto({ preprocessValue: (value) => trim(value, 255) })];
            _set_b_decorators = [auto({ preprocessValue: (value) => trim(value, 255) })];
            _set_a_decorators = [auto({ preprocessValue: (value) => trim(value, 1) })];
            _set_h_decorators = [auto({ preprocessValue: (value) => ((value % 360) + 360) % 360 })];
            _set_s_decorators = [auto({ preprocessValue: (value) => trim(value, 100) })];
            _set_l_decorators = [auto({ preprocessValue: (value) => trim(value, 100) })];
            _set_hex_decorators = [auto()];
            __esDecorate(this, null, _set_r_decorators, { kind: "setter", name: "r", static: false, private: false, access: { has: obj => "r" in obj, set: (obj, value) => { obj.r = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_g_decorators, { kind: "setter", name: "g", static: false, private: false, access: { has: obj => "g" in obj, set: (obj, value) => { obj.g = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_b_decorators, { kind: "setter", name: "b", static: false, private: false, access: { has: obj => "b" in obj, set: (obj, value) => { obj.b = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_a_decorators, { kind: "setter", name: "a", static: false, private: false, access: { has: obj => "a" in obj, set: (obj, value) => { obj.a = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_h_decorators, { kind: "setter", name: "h", static: false, private: false, access: { has: obj => "h" in obj, set: (obj, value) => { obj.h = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_s_decorators, { kind: "setter", name: "s", static: false, private: false, access: { has: obj => "s" in obj, set: (obj, value) => { obj.s = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_l_decorators, { kind: "setter", name: "l", static: false, private: false, access: { has: obj => "l" in obj, set: (obj, value) => { obj.l = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_hex_decorators, { kind: "setter", name: "hex", static: false, private: false, access: { has: obj => "hex" in obj, set: (obj, value) => { obj.hex = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        syncing = (__runInitializers(this, _instanceExtraInitializers), false);
        set r(value) {
            this.syncFromRgb();
        }
        set g(value) {
            this.syncFromRgb();
        }
        set b(value) {
            this.syncFromRgb();
        }
        set a(value) {
            this.syncHex();
        }
        set h(value) {
            this.syncFromHsl();
        }
        set s(value) {
            this.syncFromHsl();
        }
        set l(value) {
            this.syncFromHsl();
        }
        set hex(value) {
            this.syncFromHex();
        }
        /**
         * @constructor
         * @param {number} r - Red channel (0–255).
         * @param {number} g - Green channel (0–255).
         * @param {number} b - Blue channel (0–255).
         * @param {number} [a=1] - Alpha channel (0–1).
         */
        constructor(r = 0, g = 0, b = 0, a = 1) {
            this.syncing = true;
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
            this.syncing = false;
            this.syncFromRgb();
        }
        /**
         * @description Returns the color as a CSS `rgb()` string (alpha ignored).
         * @returns {string} - e.g. `"rgb(255 136 0)"`.
         */
        get rgb() {
            return `rgb(${this.r} ${this.g} ${this.b})`;
        }
        /**
         * @description Returns the color as a CSS `rgb()` string with alpha.
         * @returns {string} - e.g. `"rgb(255 136 0 / 0.5)"`.
         */
        get rgba() {
            return `rgb(${this.r} ${this.g} ${this.b} / ${+this.a.toFixed(4)})`;
        }
        /**
         * @description Returns the color as a CSS `hsl()` string (alpha ignored).
         * @returns {string} - e.g. `"hsl(32 100% 50%)"`.
         */
        get hsl() {
            return `hsl(${this.h} ${this.s}% ${this.l}%)`;
        }
        /**
         * @description Returns the color as a CSS `hsl()` string with alpha.
         * @returns {string} - e.g. `"hsl(32 100% 50% / 0.5)"`.
         */
        get hsla() {
            return `hsl(${this.h} ${this.s}% ${this.l}% / ${+this.a.toFixed(4)})`;
        }
        /**
         * @description Returns `rgb()` for opaque colors and `rgb()` with alpha for semi-transparent ones.
         */
        toString() {
            return this.a < 1 ? this.rgba : this.rgb;
        }
        fromString(value) {
            return Color.from(value);
        }
        syncFromRgb() {
            if (this.syncing)
                return;
            this.syncing = true;
            const { h, s, l } = Color.rgbToHsl(this.r, this.g, this.b);
            this.h = h;
            this.s = s;
            this.l = l;
            this.hex = Color.toHexStr(this.r, this.g, this.b, this.a);
            this.syncing = false;
        }
        syncFromHsl() {
            if (this.syncing)
                return;
            this.syncing = true;
            const { r, g, b } = Color.hslToRgb(this.h, this.s, this.l);
            this.r = r;
            this.g = g;
            this.b = b;
            this.hex = Color.toHexStr(this.r, this.g, this.b, this.a);
            this.syncing = false;
        }
        syncFromHex() {
            if (this.syncing)
                return;
            const parsed = Color.fromHexString(this.hex);
            if (!parsed)
                return;
            this.syncing = true;
            this.r = parsed.r;
            this.g = parsed.g;
            this.b = parsed.b;
            this.a = parsed.a;
            const { h, s, l } = Color.rgbToHsl(this.r, this.g, this.b);
            this.h = h;
            this.s = s;
            this.l = l;
            this.syncing = false;
        }
        syncHex() {
            this.syncing = true;
            this.hex = Color.toHexStr(this.r, this.g, this.b, this.a);
            this.syncing = false;
        }
        /**
         * @description Creates a Color from a CSS color string or an existing Color instance.
         * Supports hex (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`), `rgb()`/`rgba()`, and `hsl()`/`hsla()`.
         * Returns `Color(0, 0, 0)` if the string cannot be parsed.
         * @param {string | Color} color - The CSS color string or Color instance to parse.
         * @returns {Color}
         */
        static from(color) {
            if (!color)
                return new Color();
            if (color instanceof Color)
                return color;
            color = color.trim();
            if (color.startsWith("#"))
                return Color.fromHexString(color) ?? new Color();
            if (/^hsla?\s*\(/i.test(color))
                return Color.fromHslString(color) ?? new Color();
            if (/^rgba?\s*\(/i.test(color))
                return Color.fromRgbString(color) ?? new Color();
            return new Color(0, 0, 0);
        }
        /**
         * @description Creates a Color from a hex string (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`).
         * @param {string} hex - The hex color string.
         * @returns {Color | null} - Null if the string is not a valid hex color.
         */
        static fromHexString(hex) {
            if (!hex)
                return new Color();
            const raw = hex.replace(/^#/, "");
            const color = new Color();
            if (raw.length === 3 || raw.length === 4) {
                color.r = parseInt(raw[0] + raw[0], 16);
                color.g = parseInt(raw[1] + raw[1], 16);
                color.b = parseInt(raw[2] + raw[2], 16);
                if (raw.length === 4)
                    color.a = parseInt(raw[3] + raw[3], 16) / 255;
            }
            else if (raw.length === 6 || raw.length === 8) {
                color.r = parseInt(raw.slice(0, 2), 16);
                color.g = parseInt(raw.slice(2, 4), 16);
                color.b = parseInt(raw.slice(4, 6), 16);
                if (raw.length === 8)
                    color.a = parseInt(raw.slice(6, 8), 16) / 255;
            }
            else
                return new Color();
            if (isNaN(color.r) || isNaN(color.g) || isNaN(color.b))
                return new Color();
            return color;
        }
        /**
         * @description Creates a Color from HSL components.
         * @param {number} h - Hue, 0–360.
         * @param {number} s - Saturation, 0–100.
         * @param {number} l - Lightness, 0–100.
         * @param {number} [a=1] - Alpha, 0–1.
         * @returns {Color}
         */
        static fromHsl(h, s, l, a = 1) {
            const { r, g, b } = Color.hslToRgb(h, s, l);
            return new Color(r, g, b, a);
        }
        /**
         * @description Creates a Color from a CSS `hsl()`/`hsla()` string.
         * Handles both comma-separated (CSS Level 3) and space-separated (CSS Level 4) syntax,
         * with or without `%` signs and `deg` units, and optional alpha via `/` or as a fourth argument.
         * @param {string} color - The HSL color string.
         * @returns {Color | null} - Null if parsing fails.
         */
        static fromHslString(color) {
            const inner = color.match(/hsla?\s*\(([^)]+)\)/i)?.[1];
            if (!inner)
                return new Color();
            const parts = Color.extractNumbers(inner);
            if (parts.length < 3)
                return new Color();
            return Color.fromHsl(parts[0], parts[1], parts[2], parts[3] ?? 1);
        }
        /**
         * @description Creates a Color from a CSS `rgb()`/`rgba()` string.
         * Handles both comma-separated (CSS Level 3) and space-separated (CSS Level 4) syntax,
         * and optional alpha via `/` or as a fourth argument.
         * @param {string} color - The RGB color string.
         * @returns {Color | null} - Null if parsing fails.
         */
        static fromRgbString(color) {
            const inner = color.match(/rgba?\s*\(([^)]+)\)/i)?.[1];
            if (!inner)
                return new Color();
            const parts = Color.extractNumbers(inner);
            if (parts.length < 3)
                return new Color();
            return new Color(parts[0], parts[1], parts[2], parts[3] ?? 1);
        }
        /**
         * @description The WCAG 2.1 relative luminance of the color (0 = black, 1 = white).
         * @returns {number}
         */
        get luminance() {
            const lin = (c) => {
                c /= 255;
                return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            };
            return 0.2126 * lin(this.r) + 0.7152 * lin(this.g) + 0.0722 * lin(this.b);
        }
        /**
         * @description Computes the WCAG 2.1 contrast ratio between this color and another.
         * @param {Color | string} other - The color to compare against.
         * @returns {number} - Contrast ratio, 1–21.
         */
        contrast(other) {
            const l1 = this.luminance, l2 = Color.from(other).luminance;
            return (Math.max(l1, l2) + 0.1) / (Math.min(l1, l2) + 0.1);
        }
        /**
         * @description Returns whichever of the two candidate colors has better contrast against this color.
         * Defaults to black and white if candidates are not provided.
         * @param {Color | string} [dark="#000000"] - The dark candidate.
         * @param {Color | string} [light="#ffffff"] - The light candidate.
         * @returns {Color}
         */
        bestOverlay(dark = "#000000", light = "#ffffff") {
            const d = Color.from(dark), l = Color.from(light);
            return this.contrast(l) >= this.contrast(d) ? l : d;
        }
        /**
         * @description Linearly interpolates between this color and another in RGB space.
         * Works regardless of the original format of the input color.
         * @param {Color | string} other - The target color.
         * @param {number} t - Interpolation factor (0 = this, 1 = other).
         * @returns {Color}
         */
        interpolate(other, t) {
            const c = Color.from(other);
            return new Color(this.r + (c.r - this.r) * t, this.g + (c.g - this.g) * t, this.b + (c.b - this.b) * t, this.a + (c.a - this.a) * t);
        }
        /**
         * @description Checks whether this color is equal to another color or CSS color string,
         * comparing all four channels within an optional tolerance.
         * @param {Color | string} other - The color to compare against.
         * @param {number} [tolerance=0] - Maximum allowed difference per channel.
         * @returns {boolean}
         */
        equals(other, tolerance = 0) {
            const c = Color.from(other);
            return Math.abs(this.r - c.r) <= tolerance
                && Math.abs(this.g - c.g) <= tolerance
                && Math.abs(this.b - c.b) <= tolerance
                && Math.abs(this.a - c.a) <= tolerance;
        }
        /**
         * @description Linearly interpolates between two colors in RGB space.
         * Accepts any mix of `Color` instances and CSS color strings of any supported format.
         * @param {Color | string} color1 - The start color.
         * @param {Color | string} color2 - The end color.
         * @param {number} t - Interpolation factor (0 = color1, 1 = color2).
         * @returns {Color}
         */
        static interpolate(color1, color2, t) {
            return Color.from(color1).interpolate(color2, t);
        }
        /**
         * @description Interpolates along a multi-stop gradient.
         * `t = 0` returns the first color, `t = 1` returns the last color.
         * @param {(Color | string)[]} colors - Two or more color stops.
         * @param {number} t - Gradient position (0–1).
         * @returns {Color}
         */
        static gradient(colors, t) {
            if (colors.length === 0)
                return new Color(0, 0, 0);
            if (colors.length === 1)
                return Color.from(colors[0]);
            t = Math.max(0, Math.min(1, t));
            const segments = colors.length - 1;
            const index = Math.min(Math.floor(t * segments), segments - 1);
            const localT = t * segments - index;
            return Color.from(colors[index]).interpolate(colors[index + 1], localT);
        }
        /**
         * @description Computes the WCAG 2.1 contrast ratio between two colors.
         * @param {Color | string} color1
         * @param {Color | string} color2
         * @returns {number}
         */
        static contrast(color1, color2) {
            return Color.from(color1).contrast(color2);
        }
        /**
         * @description Computes the WCAG 2.1 relative luminance of a color.
         * @param {Color | string} color
         * @returns {number}
         */
        static luminance(color) {
            return Color.from(color).luminance;
        }
        /**
         * @description Returns whichever of the two candidates has better contrast against the base color.
         * @param {Color | string} base
         * @param {Color | string} [dark="#000000"]
         * @param {Color | string} [light="#ffffff"]
         * @returns {Color}
         */
        static bestOverlay(base, dark = "#000000", light = "#ffffff") {
            return Color.from(base).bestOverlay(dark, light);
        }
        /**
         * @function random
         * @description Generate a random color with a random hue, constrained to the given saturation and
         * lightness. The defaults produce muted pastel tones rather than fully saturated ones.
         * @param {number | [number, number]} [saturation=[50, 70]] - Saturation percentage, or a `[min, max]`
         * range to pick one from.
         * @param {number | [number, number]} [lightness=[70, 85]] - Lightness percentage, or a `[min, max]`
         * range to pick one from.
         * @returns {Color} The generated color.
         * @static
         */
        static random(saturation = [50, 70], lightness = [70, 85]) {
            if (typeof saturation != "number" && saturation.length >= 2)
                saturation = randomFromRange(saturation[0], saturation[1]);
            if (typeof lightness != "number" && lightness.length >= 2)
                lightness = randomFromRange(lightness[0], lightness[1]);
            return Color.fromHsl(Math.random() * 360, saturation, lightness);
        }
        static rgbToHsl(r, g, b) {
            r /= 255;
            g /= 255;
            b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            const d = max - min;
            const l = (max + min) / 2;
            if (d === 0)
                return { h: 0, s: 0, l: Math.round(l * 100) };
            const s = d / (1 - Math.abs(2 * l - 1));
            let h = 0;
            if (max === r)
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            else if (max === g)
                h = ((b - r) / d + 2) / 6;
            else
                h = ((r - g) / d + 4) / 6;
            return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
        }
        static hslToRgb(h, s, l) {
            s /= 100;
            l /= 100;
            h = ((h % 360) + 360) % 360;
            const C = (1 - Math.abs(2 * l - 1)) * s;
            const X = C * (1 - Math.abs((h / 60) % 2 - 1));
            const m = l - C / 2;
            let r1 = 0, g1 = 0, b1 = 0;
            if (h < 60) {
                r1 = C;
                g1 = X;
                b1 = 0;
            }
            else if (h < 120) {
                r1 = X;
                g1 = C;
                b1 = 0;
            }
            else if (h < 180) {
                r1 = 0;
                g1 = C;
                b1 = X;
            }
            else if (h < 240) {
                r1 = 0;
                g1 = X;
                b1 = C;
            }
            else if (h < 300) {
                r1 = X;
                g1 = 0;
                b1 = C;
            }
            else {
                r1 = C;
                g1 = 0;
                b1 = X;
            }
            return {
                r: Math.round((r1 + m) * 255),
                g: Math.round((g1 + m) * 255),
                b: Math.round((b1 + m) * 255),
            };
        }
        static toHexStr(r, g, b, a) {
            const h = (n) => Math.round(n).toString(16).padStart(2, "0");
            const base = `#${h(r)}${h(g)}${h(b)}`;
            return a < 1 ? base + h(a * 255) : base;
        }
        static extractNumbers(str) {
            return (str.match(/-?[\d.]+(?:e[+-]?\d+)?/gi) ?? []).map(Number);
        }
    };
})();

/**
 * @class GradumIcon
 * @group Components
 * @category Basics
 *
 * @extends GradumElement
 * @description Icon class for creating icon elements.
 */
let GradumIcon = (() => {
    let _classSuper = GradumElement;
    let _instanceExtraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _directory_decorators;
    let _directory_initializers = [];
    let _directory_extraInitializers = [];
    let _set_icon_decorators;
    let _get_iconColor_decorators;
    let _set_iconColor_decorators;
    let _loadSvg_decorators;
    return class GradumIcon extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _type_decorators = [observe, auto({
                    preprocessValue: function (value) {
                        if (!value || value.length == 0)
                            return this.type;
                        if (value[0] == ".")
                            value = value.substring(1);
                        return value;
                    },
                    callAfter: function () { this.generateIcon(); },
                })];
            _directory_decorators = [observe, auto({
                    preprocessValue: function (value) {
                        if (isUndefined(value))
                            return this.directory;
                        if (value.length > 0 && !value.endsWith("/"))
                            value += "/";
                        return value;
                    },
                    callAfter: function () { this.generateIcon(); }
                })];
            _set_icon_decorators = [observe, auto()];
            _get_iconColor_decorators = [observe, auto()];
            _set_iconColor_decorators = [observe, auto()];
            _loadSvg_decorators = [cache()];
            __esDecorate(this, null, _set_icon_decorators, { kind: "setter", name: "icon", static: false, private: false, access: { has: obj => "icon" in obj, set: (obj, value) => { obj.icon = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_iconColor_decorators, { kind: "getter", name: "iconColor", static: false, private: false, access: { has: obj => "iconColor" in obj, get: obj => obj.iconColor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_iconColor_decorators, { kind: "setter", name: "iconColor", static: false, private: false, access: { has: obj => "iconColor" in obj, set: (obj, value) => { obj.iconColor = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _loadSvg_decorators, { kind: "method", name: "loadSvg", static: false, private: false, access: { has: obj => "loadSvg" in obj, get: obj => obj.loadSvg }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _directory_decorators, { kind: "field", name: "directory", static: false, private: false, access: { has: obj => "directory" in obj, get: obj => obj.directory, set: (obj, value) => { obj.directory = value; } }, metadata: _metadata }, _directory_initializers, _directory_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @static
         * @readonly
         * @description Extra icon loaders, keyed by file extension. Register one to teach every icon how to
         * load a format the built-in SVG and image loaders do not cover.
         */
        static customLoaders = {};
        /**
         * @static
         * @description Default properties assigned to a new icon. Icons are treated as SVG unless told otherwise.
         */
        static defaultProperties = {
            type: "svg"
        };
        static imageTypes = ["png", "jpg", "jpeg", "gif", "webp", "PNG", "JPG", "JPEG", "GIF", "WEBP"];
        _element = __runInitializers(this, _instanceExtraInitializers);
        _loadToken = 0;
        /**
         * @description Called with the loaded element once the icon finishes loading. Loading is asynchronous
         * for SVGs, so use this rather than reading the element straight after assigning an icon name.
         */
        onLoaded;
        /**
         * @description The type of the icon.
         */
        type = __runInitializers(this, _type_initializers, void 0);
        /**
         * @description The user-provided (or statically configured) directory to the icon's file.
         */
        directory = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _directory_initializers, void 0));
        /**
         * @description The path to the icon's source file.
         */
        get path() {
            let extension = getFileExtension(this.icon);
            const icon = this.icon?.replace(extension, "");
            if (extension.length === 0 && this.type?.length > 0)
                extension = "." + this.type;
            return (this.directory ?? "") + icon + extension;
        }
        /**
         * @description The name (or path) of the icon. Might include the file extension (to override the icon's type).
         * Setting it will update the icon accordingly.
         */
        set icon(value) {
            const ext = getFileExtension(value).substring(1);
            if (ext)
                this.type = ext;
            this.generateIcon();
        }
        /**
         * @description The assigned color to the icon (if any)
         */
        get iconColor() { return; }
        set iconColor(value) {
            this.updateColor(Color.from(value));
        }
        /**
         * @description The child element of the icon element (an HTML image or an SVG element).
         */
        set element(value) {
            this._element = value;
        }
        get element() {
            return this._element;
        }
        //Utilities
        /**
         * @function loadSvg
         * @protected
         * @description Fetch an SVG file and return its root element. Results are cached, so the same path is
         * only fetched once.
         * @param {string} path - The path to the SVG file.
         * @returns {Promise<SVGElement>} The loaded SVG element.
         */
        loadSvg(path) {
            return fetchSvg(path);
        }
        /**
         * @function loadImg
         * @protected
         * @description Build an `<img>` element for a raster icon, using the icon's name as its alt text.
         * @param {string} path - The path to the image file.
         * @returns {HTMLImageElement} The created image element.
         */
        loadImg(path) {
            return img({ src: path, alt: this.icon });
        }
        /**
         * @function updateColor
         * @protected
         * @description Recolor the icon by setting its fill. Only applies to SVG icons; raster images are left
         * as they are.
         * @param {Color} [value=this.iconColor] - The color to apply. Defaults to the icon's own color.
         */
        updateColor(value = this.iconColor) {
            if (value && this.element instanceof SVGElement)
                this.element.style.fill = value.toString();
        }
        /**
         * @function generateIcon
         * @protected
         * @description Load the icon for the current name and type, and swap it in as this element's content.
         * Reuses the existing element when only the source changed.
         */
        generateIcon() {
            const path = this.path;
            const type = getFileExtension(path)?.substring(1);
            if (this.element instanceof HTMLImageElement
                && equalToAny(type, ...this.constructor.imageTypes)) {
                this.element.src = this.path;
                this.element.alt = this.icon;
                return;
            }
            this.clear();
            if (!this.icon || this.icon.length === 0)
                return;
            if (!type)
                return;
            const token = ++this._loadToken;
            const element = this.getLoader(type)(path);
            if (element instanceof Element)
                this.setupLoadedElement(element);
            else
                element.then(element => {
                    if (token !== this._loadToken)
                        return;
                    this.setupLoadedElement(element);
                }).catch(error => console.error(`Failed to load icon: ${error}`));
        }
        getLoader(type) {
            if (!type)
                return;
            const customLoader = this.constructor.customLoaders?.[type];
            if (customLoader)
                return customLoader;
            if (equalToAny(type, "svg", "SVG"))
                return this.loadSvg.bind(this);
            if (equalToAny(type, ...this.constructor.imageTypes))
                return this.loadImg.bind(this);
            throw new Error(`Unsupported icon type: ${type}`);
        }
        setupLoadedElement(element) {
            if (this.element || !element)
                return;
            if (element.parentElement)
                element = element.cloneNode(true);
            gradum(this).addChild(element);
            this.updateColor();
            this.onLoaded?.(element);
            this.element = element;
        }
        clear() {
            gradum(this.element).destroy();
            this.element = null;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _directory_extraInitializers);
        }
    };
})();
define(GradumIcon);

/**
 * @class GradumRichElement
 * @group Components
 * @category Basics
 *
 * @extends GradumElement
 * @template {ValidTag} ElementTag - The tag of the main element to create the rich element from.
 * @description Class for creating a rich gradum element (an element that is possibly accompanied by icons (or other elements) on
 * its left and/or right).
 */
let GradumRichElement = (() => {
    let _classSuper = GradumElement;
    let _instanceExtraInitializers = [];
    let _set_leftCustomElements_decorators;
    let _set_leftIcon_decorators;
    let _set_prefixEntry_decorators;
    let _set_element_decorators;
    let _set_suffixEntry_decorators;
    let _set_rightIcon_decorators;
    let _set_rightCustomElements_decorators;
    return class GradumRichElement extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _set_leftCustomElements_decorators = [auto({ executeSetterBeforeStoring: true })];
            _set_leftIcon_decorators = [auto({
                    preprocessValue: function (value) {
                        if (typeof value == "string") {
                            if (this.leftIcon) {
                                this.leftIcon.icon = value;
                                return this.leftIcon;
                            }
                            value = GradumIcon.create({ icon: value });
                        }
                        gradum(this).remChild(this.leftIcon);
                        this.addAtPosition(value, "leftIcon");
                        return value;
                    }
                })];
            _set_prefixEntry_decorators = [auto({
                    preprocessValue: function (value) {
                        if (typeof value == "string") {
                            if (this.prefixEntry) {
                                this.prefixEntry.textContent = value;
                                return this.prefixEntry;
                            }
                            value = element({ text: value });
                        }
                        gradum(this).remChild(this.prefixEntry);
                        this.addAtPosition(value, "prefixEntry");
                        return value;
                    }
                })];
            _set_element_decorators = [signal, auto({
                    preprocessValue: function (value) {
                        if (typeof value === "string") {
                            if (this.element && "textContent" in this.element) {
                                this.element.textContent = value;
                                return this.element;
                            }
                            value = element({ tag: this.elementTag, text: value });
                        }
                        else if (typeof value === "object" && !(value instanceof Element)) {
                            if (!value.tag)
                                value.tag = this.elementTag;
                            value = element(value);
                        }
                        gradum(this).remChild(this.element);
                        this.addAtPosition(value, "element");
                        return value;
                    }
                })];
            _set_suffixEntry_decorators = [auto({
                    preprocessValue: function (value) {
                        if (typeof value == "string") {
                            if (this.suffixEntry) {
                                this.suffixEntry.textContent = value;
                                return this.suffixEntry;
                            }
                            value = element({ text: value });
                        }
                        gradum(this).remChild(this.suffixEntry);
                        this.addAtPosition(value, "suffixEntry");
                        return value;
                    }
                })];
            _set_rightIcon_decorators = [auto({
                    preprocessValue: function (value) {
                        if (typeof value == "string") {
                            if (this.rightIcon) {
                                this.rightIcon.icon = value;
                                return this.rightIcon;
                            }
                            value = GradumIcon.create({ icon: value });
                        }
                        gradum(this).remChild(this.rightIcon);
                        this.addAtPosition(value, "rightIcon");
                        return value;
                    }
                })];
            _set_rightCustomElements_decorators = [auto({ executeSetterBeforeStoring: true })];
            __esDecorate(this, null, _set_leftCustomElements_decorators, { kind: "setter", name: "leftCustomElements", static: false, private: false, access: { has: obj => "leftCustomElements" in obj, set: (obj, value) => { obj.leftCustomElements = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_leftIcon_decorators, { kind: "setter", name: "leftIcon", static: false, private: false, access: { has: obj => "leftIcon" in obj, set: (obj, value) => { obj.leftIcon = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_prefixEntry_decorators, { kind: "setter", name: "prefixEntry", static: false, private: false, access: { has: obj => "prefixEntry" in obj, set: (obj, value) => { obj.prefixEntry = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_element_decorators, { kind: "setter", name: "element", static: false, private: false, access: { has: obj => "element" in obj, set: (obj, value) => { obj.element = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_suffixEntry_decorators, { kind: "setter", name: "suffixEntry", static: false, private: false, access: { has: obj => "suffixEntry" in obj, set: (obj, value) => { obj.suffixEntry = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_rightIcon_decorators, { kind: "setter", name: "rightIcon", static: false, private: false, access: { has: obj => "rightIcon" in obj, set: (obj, value) => { obj.rightIcon = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_rightCustomElements_decorators, { kind: "setter", name: "rightCustomElements", static: false, private: false, access: { has: obj => "rightCustomElements" in obj, set: (obj, value) => { obj.rightCustomElements = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @static
         * @description Default properties assigned to a new rich element.
         */
        static defaultProperties = {
            elementTag: "h4"
        };
        /**
         * @function customCreate
         * @static
         * @protected
         * @description Build a rich element, resolving `text` and `elementTag` into the configuration of its inner
         * element before construction.
         * @param {GradumRichElementProperties} properties - The element's configuration.
         * @returns {object} The created rich element.
         */
        static customCreate(properties) {
            if (properties.text && !properties.element) {
                properties.element = properties.text;
                properties.text = undefined;
            }
            if (properties.elementTag && typeof properties.element === "object" && !(properties.element instanceof Element)) {
                properties.element.tag = properties.elementTag;
            }
            return super.customCreate(properties);
        }
        /**
         * @readonly
         * @description The order the rich element's parts are laid out in, from left to right. Assigning a part
         * inserts it at its place in this order rather than at the end.
         */
        childrenOrder = (__runInitializers(this, _instanceExtraInitializers), ["leftCustomElements", "leftIcon",
            "prefixEntry", "element", "suffixEntry", "rightIcon", "rightCustomElements"]);
        /**
         * @description Add one or more elements to this rich element at the given position.
         * @param {Element | Element[] | null} element - The element(s) to add.
         * @param {this["childrenOrder"][number]} type - The type of child element being added.
         */
        addAtPosition(element, type) {
            if (!element || !type)
                return;
            let nextSiblingIndex = 0;
            for (let i = 0; i < this.childrenOrder.length; i++) {
                const key = this.childrenOrder[i];
                if (key === type)
                    break;
                const el = this[key];
                if (el && el instanceof Element)
                    nextSiblingIndex++;
                else if (el && Array.isArray(el))
                    nextSiblingIndex += el.length;
            }
            gradum(this).addChild(element, nextSiblingIndex);
        }
        /**
         * @description The tag used for this rich element's text element
         */
        elementTag;
        /**
         * @description The custom element(s) on the left. Can be set to new element(s) by a simple assignment.
         */
        set leftCustomElements(value) {
            gradum(this).remChild(this.leftCustomElements);
            this.addAtPosition(value, "leftCustomElements");
        }
        /**
         * @description The left icon element. Can be set with a new icon by a simple assignment (the name/path of the
         * icon, or a Gradum/HTML element).
         */
        set leftIcon(value) { }
        get leftIcon() { return; }
        /**
         * @description The element shown before the text. Assigning a string sets its text content; assigning
         * an element replaces it outright.
         */
        set prefixEntry(value) { }
        get prefixEntry() { return; }
        /**
         * @description The text element. Can be set to a new element by a simple assignment. Setting the value to a new
         * string will update the text's textContent with the given string.
         */
        set element(value) { }
        get element() { return; }
        /**
         * @description The text element. Can be set to a new element by a simple assignment. Setting the value to a new
         * string will update the text's textContent with the given string.
         */
        get text() {
            const element = this.element;
            if (!element)
                return "";
            return element.textContent;
        }
        set text(value) {
            if (!value)
                value = "";
            this.element = value;
        }
        /**
         * @description The element shown after the text. Assigning a string sets its text content; assigning
         * an element replaces it outright.
         */
        set suffixEntry(value) { }
        get suffixEntry() { return; }
        /**
         * @description The right icon element. Can be set with a new icon by a simple assignment (the name/path of the
         * icon, or a Gradum/HTML element).
         */
        set rightIcon(value) { }
        get rightIcon() { return; }
        /**
         * @description The custom element(s) on the right. Can be set to new element(s) by a simple assignment.
         */
        set rightCustomElements(value) {
            gradum(this).remChild(this.rightCustomElements);
            this.addAtPosition(value, "rightCustomElements");
        }
    };
})();
define(GradumRichElement);

/**
 * @class GradumButton
 * @group Components
 * @category Basics
 *
 * @extends GradumElement
 * @description Button class for creating Gradum button elements.
 */
class GradumButton extends GradumRichElement {
}
define(GradumButton);

/**
 * @group Components
 * @category Basics
 */
let GradumIconSwitch = (() => {
    let _classSuper = GradumIcon;
    let _instanceExtraInitializers = [];
    let _set_switchReifect_decorators;
    let _set_defaultState_decorators;
    let _set_appendStateToIconName_decorators;
    return class GradumIconSwitch extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _set_switchReifect_decorators = [auto({
                    preprocessValue: function (value) {
                        if (value instanceof StatefulReifect)
                            return value;
                        else
                            return new StatefulReifect(value || {});
                    }
                })];
            _set_defaultState_decorators = [auto()];
            _set_appendStateToIconName_decorators = [auto()];
            __esDecorate(this, null, _set_switchReifect_decorators, { kind: "setter", name: "switchReifect", static: false, private: false, access: { has: obj => "switchReifect" in obj, set: (obj, value) => { obj.switchReifect = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_defaultState_decorators, { kind: "setter", name: "defaultState", static: false, private: false, access: { has: obj => "defaultState" in obj, set: (obj, value) => { obj.defaultState = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_appendStateToIconName_decorators, { kind: "setter", name: "appendStateToIconName", static: false, private: false, access: { has: obj => "appendStateToIconName" in obj, set: (obj, value) => { obj.appendStateToIconName = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @description The reifect that swaps the icon between its states. Assign reifect properties to build one.
         */
        get switchReifect() { return; }
        set switchReifect(value) {
            this.switchReifect.attach(this);
            if (this.defaultState)
                this.switchReifect.apply(this.defaultState, this);
        }
        set defaultState(value) {
            this.switchReifect?.apply(value, this);
        }
        set appendStateToIconName(value) {
            if (value) {
                const properties = this.switchReifect.properties;
                this.switchReifect.states.forEach(state => {
                    properties[state] = { ...properties[state], icon: this.icon + "-" + state.toString() };
                });
                this.switchReifect.properties = properties;
            }
        }
        /**
         * @function initialize
         * @description Set the icon up and apply its default state.
         */
        initialize() {
            super.initialize();
            if (this.defaultState)
                this.switchReifect?.apply(this.defaultState, this);
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
})();
define(GradumIconSwitch);

/**
 * @group Components
 * @category Basics
 */
let GradumIconToggle = (() => {
    let _classSuper = GradumIcon;
    let _instanceExtraInitializers = [];
    let _set_toggled_decorators;
    let _set_toggleOnClick_decorators;
    return class GradumIconToggle extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _set_toggled_decorators = [auto({ initialValue: false })];
            _set_toggleOnClick_decorators = [auto({ initialValue: false })];
            __esDecorate(this, null, _set_toggled_decorators, { kind: "setter", name: "toggled", static: false, private: false, access: { has: obj => "toggled" in obj, set: (obj, value) => { obj.toggled = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_toggleOnClick_decorators, { kind: "setter", name: "toggleOnClick", static: false, private: false, access: { has: obj => "toggleOnClick" in obj, set: (obj, value) => { obj.toggleOnClick = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @description Whether a click that toggles this icon stops propagating, keeping ancestors from also
         * reacting to it.
         */
        stopPropagationOnClick = (__runInitializers(this, _instanceExtraInitializers), true);
        /**
         * @description Called with the new state whenever the icon is toggled.
         */
        onToggle;
        clickListener = () => {
            this.toggle();
            return this.stopPropagationOnClick;
        };
        /**
         * @description Whether the icon is currently toggled on. Assigning fires
         * {@link GradumIconToggle.onToggle}.
         */
        set toggled(value) {
            if (this.onToggle)
                this.onToggle(value, this);
        }
        /**
         * @description Whether clicking the icon toggles it. Assigning attaches or removes the click listener.
         */
        set toggleOnClick(value) {
            if (value)
                gradum(this).on(DefaultEventName.click, this.clickListener);
            else
                gradum(this).removeListener(DefaultEventName.click, this.clickListener);
        }
        /**
         * @function toggle
         * @description Flip the icon's state, firing {@link GradumIconToggle.onToggle}.
         */
        toggle() {
            this.toggled = !this.toggled;
        }
    };
})();
define(GradumIconToggle);

/**
 * @class GradumInteractor
 * @group MVC
 * @category Interactor
 *
 * @extends GradumOperator
 * @template {object} ElementType - The type of the main component.
 * @template {GradumView} ViewType - The element's MVC view type.
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @template {GradumEmitter} EmitterType - The element's MVC emitter type.
 * @description Class representing an MVC interactor. It holds event listeners to set up on the element itself, or
 * the custom defined target.
 */
class GradumInteractor extends GradumOperator {
    #target_accessor_storage;
    /**
     * @description The target of the event listeners. Defaults to the element itself.
     */
    get target() { return this.#target_accessor_storage; }
    set target(value) { this.#target_accessor_storage = value; }
    /**
     * @readonly
     * @description The name of the tool (if any) to listen for.
     */
    toolName;
    /**
     * @readonly
     * @description The associated event manager. Defaults to `GradumEventManager.instance`.
     */
    manager;
    /**
     *
     * @readonly
     * @description Optional custom options to define per event type.
     */
    options;
    /**
     * @constructor
     * @description Create an interactor bound to an element. Anything omitted from `properties` falls back to
     * the value already declared on the instance, then to a default — the event manager to
     * {@link GradumEventManager.instance}, and the listener options to an empty object.
     * @param {GradumInteractorProperties} properties - The element to attach to, plus the tool name, target,
     * event manager, and listener options.
     */
    constructor(properties) {
        super(properties);
        this.manager = properties.manager ?? this.manager ?? GradumEventManager.instance;
        this.toolName = properties.toolName ?? this.toolName ?? undefined;
        this.options = properties.listenerOptions ?? {};
        const host = this.element;
        try {
            this.target = properties.target ?? this.target ?? (host instanceof Node ? host
                : host?.element instanceof Node ? host.element
                    : undefined);
        }
        catch { }
    }
}
addRegistryCategory(GradumInteractor);
define(GradumInteractor);

/**
 * @internal
 * @class GradumInputInputInteractor
 * @description The interactor {@link GradumInput} attaches to itself to keep its value and size in step
 * with what the user types. It also holds back updates during IME composition, so mid-composition text
 * is not read as a committed value.
 */
let GradumInputInputInteractor = (() => {
    let _classSuper = GradumInteractor;
    let _instanceExtraInitializers = [];
    let _focusIn_decorators;
    let _focusOut_decorators;
    let _compositionStart_decorators;
    let _compositionEnd_decorators;
    let _input_decorators;
    return class GradumInputInputInteractor extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _focusIn_decorators = [listener()];
            _focusOut_decorators = [listener()];
            _compositionStart_decorators = [listener({ options: { capture: true } })];
            _compositionEnd_decorators = [listener({ options: { capture: true } })];
            _input_decorators = [listener({ options: { capture: true } })];
            __esDecorate(this, null, _focusIn_decorators, { kind: "method", name: "focusIn", static: false, private: false, access: { has: obj => "focusIn" in obj, get: obj => obj.focusIn }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _focusOut_decorators, { kind: "method", name: "focusOut", static: false, private: false, access: { has: obj => "focusOut" in obj, get: obj => obj.focusOut }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _compositionStart_decorators, { kind: "method", name: "compositionStart", static: false, private: false, access: { has: obj => "compositionStart" in obj, get: obj => obj.compositionStart }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _compositionEnd_decorators, { kind: "method", name: "compositionEnd", static: false, private: false, access: { has: obj => "compositionEnd" in obj, get: obj => obj.compositionEnd }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _input_decorators, { kind: "method", name: "input", static: false, private: false, access: { has: obj => "input" in obj, get: obj => obj.input }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @description The key this interactor is registered under on its input.
         */
        keyName = (__runInitializers(this, _instanceExtraInitializers), "__input__interactor__");
        _composing = false;
        _resizeQueued = false;
        /**
         * @readonly
         * @description The element the listeners are bound to — the input's inner `<input>` or `<textarea>`
         * rather than the component itself.
         */
        get target() {
            return this.element.element;
        }
        /**
         * @function initialize
         * @description Bind the listeners that keep the input's value and size in step with what is typed.
         */
        initialize() {
            super.initialize();
            gradum(this.target).bypassManagerOn = () => true;
        }
        /**
         * @inheritDoc
         */
        setupChangedCallbacks() {
            super.setupChangedCallbacks();
            this.emitter.add("valueSet", () => this.handleInput());
        }
        focusIn(e) {
            if (this.element.locked) {
                this.target.blur();
                return Propagation.propagate;
            }
            if (this.element.selectTextOnFocus)
                requestAnimationFrame(() => {
                    try {
                        this.target.select?.();
                    }
                    catch { }
                });
            this.element.onFocus.fire();
        }
        focusOut(e) {
            this.element.rawValue = this.element.element?.value ?? "";
            this.element.onBlur.fire();
        }
        compositionStart(e) {
            this._composing = true;
        }
        compositionEnd(e) {
            this._composing = false;
            this.handleInput();
            this.emitter.fire("processValue");
        }
        input(e) {
            this.handleInput();
            this.emitter.fire("processValue");
        }
        handleInput() {
            if (this._composing)
                return;
            if (this.element.dynamicVerticalResize && this.target instanceof HTMLTextAreaElement) {
                if (!this._resizeQueued) {
                    this._resizeQueued = true;
                    queueMicrotask(() => {
                        this._resizeQueued = false;
                        gradum(this.target)
                            .setStyle("height", "auto", true)
                            .setStyle("height", this.target.scrollHeight + "px", true);
                    });
                }
            }
        }
    };
})();

/**
 * @class GradumLabelElement
 * @group Components
 * @category Basics
 *
 * @extends GradumRichElement
 * @template {ValidTag} ElementTag - The tag of the main element in the rich element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description A rich element with an HTML `<label>` attached to it. Setting {@link GradumLabelElement.label}
 * to a non-empty string creates the label and puts it before the content; setting it to an empty value
 * removes it again.
 */
let GradumLabelElement = (() => {
    let _classSuper = GradumRichElement;
    let _instanceExtraInitializers = [];
    let _defaultId_decorators;
    let _defaultId_initializers = [];
    let _defaultId_extraInitializers = [];
    let _labelElement_decorators;
    let _labelElement_initializers = [];
    let _labelElement_extraInitializers = [];
    let _get_element_decorators;
    let _updateId_decorators;
    return class GradumLabelElement extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _defaultId_decorators = [signal];
            _labelElement_decorators = [signal];
            _get_element_decorators = [signal];
            _updateId_decorators = [effect];
            __esDecorate(this, null, _get_element_decorators, { kind: "getter", name: "element", static: false, private: false, access: { has: obj => "element" in obj, get: obj => obj.element }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateId_decorators, { kind: "method", name: "updateId", static: false, private: false, access: { has: obj => "updateId" in obj, get: obj => obj.updateId }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _defaultId_decorators, { kind: "field", name: "defaultId", static: false, private: false, access: { has: obj => "defaultId" in obj, get: obj => obj.defaultId, set: (obj, value) => { obj.defaultId = value; } }, metadata: _metadata }, _defaultId_initializers, _defaultId_extraInitializers);
            __esDecorate(null, null, _labelElement_decorators, { kind: "field", name: "labelElement", static: false, private: false, access: { has: obj => "labelElement" in obj, get: obj => obj.labelElement, set: (obj, value) => { obj.labelElement = value; } }, metadata: _metadata }, _labelElement_initializers, _labelElement_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        defaultId = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _defaultId_initializers, "gradum-id-" + randomId()));
        labelElement = (__runInitializers(this, _defaultId_extraInitializers), __runInitializers(this, _labelElement_initializers, void 0));
        /**
         * @description The wrapper holding everything except the label. It becomes the element's child handler, so
         * children added later land inside it rather than beside the label.
         */
        content = __runInitializers(this, _labelElement_extraInitializers);
        /**
         * @description The label's text. Assigning a non-empty string creates the `<label>` and places it before
         * the content; assigning an empty value removes it. The label is linked to the inner element's `id`, so
         * clicking it focuses that element.
         */
        set label(value) {
            if (!value || value.length === 0) {
                if (this.labelElement)
                    this.labelElement.remove();
                return;
            }
            if (!this.labelElement) {
                this.labelElement = element({ tag: "label" });
                gradum(this).childHandler = this;
                gradum(this).addChild(this.labelElement, 0);
                if (this.content)
                    gradum(this).childHandler = this.content;
            }
            this.labelElement.textContent = value;
        }
        get label() {
            return this.labelElement?.textContent;
        }
        get element() {
            return super.element;
        }
        set element(value) {
            super.element = value;
            if (this.element) {
                if (!this.element.id)
                    this.element.id = this.defaultId;
                else if (this.labelElement)
                    this.labelElement.htmlFor = this.element.id;
            }
        }
        /**
         * @inheritDoc
         */
        setupUIElements() {
            super.setupUIElements();
            this.content = div();
        }
        /**
         * @inheritDoc
         */
        setupUILayout() {
            super.setupUILayout();
            gradum(this.content).addChild(gradum(this).childrenArray);
            gradum(this).addChild([this.labelElement, this.content]);
            gradum(this).childHandler = this.content;
        }
        updateId() {
            if (this.element && !this.element.id)
                this.element.id = this.defaultId;
            if (this.labelElement)
                this.labelElement.htmlFor = this.element?.id ?? this.defaultId;
        }
    };
})();
define(GradumLabelElement);

/**
 * @group Components
 * @category Basics
 */
let GradumInput = (() => {
    let _classSuper = GradumLabelElement;
    let _instanceExtraInitializers = [];
    let _locked_decorators;
    let _locked_initializers = [];
    let _locked_extraInitializers = [];
    let _selectTextOnFocus_decorators;
    let _selectTextOnFocus_initializers = [];
    let _selectTextOnFocus_extraInitializers = [];
    let _dynamicVerticalResize_decorators;
    let _dynamicVerticalResize_initializers = [];
    let _dynamicVerticalResize_extraInitializers = [];
    let _get_element_decorators;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _placeholder_decorators;
    let _placeholder_initializers = [];
    let _placeholder_extraInitializers = [];
    let _pattern_decorators;
    let _pattern_initializers = [];
    let _pattern_extraInitializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _size_extraInitializers = [];
    let _get_value_decorators;
    let _get_rawValue_decorators;
    return class GradumInput extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _locked_decorators = [signal];
            _selectTextOnFocus_decorators = [signal];
            _dynamicVerticalResize_decorators = [signal];
            _get_element_decorators = [signal];
            _type_decorators = [expose("element")];
            _placeholder_decorators = [expose("element")];
            _pattern_decorators = [expose("element")];
            _size_decorators = [expose("element")];
            _get_value_decorators = [signal];
            _get_rawValue_decorators = [signal];
            __esDecorate(this, null, _get_element_decorators, { kind: "getter", name: "element", static: false, private: false, access: { has: obj => "element" in obj, get: obj => obj.element }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _type_decorators, { kind: "accessor", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } }, metadata: _metadata }, _placeholder_initializers, _placeholder_extraInitializers);
            __esDecorate(this, null, _pattern_decorators, { kind: "accessor", name: "pattern", static: false, private: false, access: { has: obj => "pattern" in obj, get: obj => obj.pattern, set: (obj, value) => { obj.pattern = value; } }, metadata: _metadata }, _pattern_initializers, _pattern_extraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
            __esDecorate(this, null, _get_value_decorators, { kind: "getter", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_rawValue_decorators, { kind: "getter", name: "rawValue", static: false, private: false, access: { has: obj => "rawValue" in obj, get: obj => obj.rawValue }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _locked_decorators, { kind: "field", name: "locked", static: false, private: false, access: { has: obj => "locked" in obj, get: obj => obj.locked, set: (obj, value) => { obj.locked = value; } }, metadata: _metadata }, _locked_initializers, _locked_extraInitializers);
            __esDecorate(null, null, _selectTextOnFocus_decorators, { kind: "field", name: "selectTextOnFocus", static: false, private: false, access: { has: obj => "selectTextOnFocus" in obj, get: obj => obj.selectTextOnFocus, set: (obj, value) => { obj.selectTextOnFocus = value; } }, metadata: _metadata }, _selectTextOnFocus_initializers, _selectTextOnFocus_extraInitializers);
            __esDecorate(null, null, _dynamicVerticalResize_decorators, { kind: "field", name: "dynamicVerticalResize", static: false, private: false, access: { has: obj => "dynamicVerticalResize" in obj, get: obj => obj.dynamicVerticalResize, set: (obj, value) => { obj.dynamicVerticalResize = value; } }, metadata: _metadata }, _dynamicVerticalResize_initializers, _dynamicVerticalResize_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @function create
         * @static
         * @description Instantiate an input, reading `InputTag` and `ValueType` back off the properties — so
         * `GradumInput.create({inputTag: "textarea"})` is typed as a textarea input without a cast. Narrows
         * {@link GradumElement.create}, which cannot see generics declared on a subclass.
         * @template {{prototype: GradumElement}} This - The class `create` was called on. The constraint
         * matches the base signature; the return type still narrows to this class.
         * @template {"input" | "textarea"} InputTag - Inferred from `properties.inputTag`.
         * @template ValueType - Inferred from the properties' value type.
         * @param {GradumInputProperties} [properties] - Properties to set on the new input.
         * @returns {GradumInput} The created input, typed as the class this was called on.
         */
        static create(properties) {
            return super.create.call(this, properties);
        }
        /**
         * @static
         * @description Default properties assigned to a new input: an `<input>` element, wired to the
         * interactor that keeps its value and size in step with what the user types.
         */
        static defaultProperties = {
            inputTag: "input",
            interactors: GradumInputInputInteractor
        };
        /**
         * @function customCreate
         * @static
         * @protected
         * @description Build an input, deferring the initial `value` until the underlying element exists so it
         * is not lost during construction.
         * @param {GradumInputProperties} properties - The input's configuration.
         * @returns {object} The created input.
         */
        static customCreate(properties) {
            const element = properties.input ?? {};
            const elementTag = properties.inputTag ?? "input";
            const value = properties.value;
            const input = super.customCreate({ ...properties, elementTag, element,
                value: undefined, input: undefined, inputTag: undefined });
            if (value !== undefined && value !== null)
                input.value = value;
            return input;
        }
        /**
         * @description Whether the input rejects focus, so clicking it does nothing.
         */
        locked = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _locked_initializers, false));
        /**
         * @description Whether the input's whole text is selected when it gains focus.
         */
        selectTextOnFocus = (__runInitializers(this, _locked_extraInitializers), __runInitializers(this, _selectTextOnFocus_initializers, false));
        /**
         * @description Whether the input grows and shrinks vertically to fit its content, for `<textarea>`
         * elements that should not scroll.
         */
        dynamicVerticalResize = (__runInitializers(this, _selectTextOnFocus_extraInitializers), __runInitializers(this, _dynamicVerticalResize_initializers, false));
        /**
         * @description A pattern the value must match while typing. Input that fails it is sanitized if
         * possible, and otherwise reverted to the last value that passed.
         */
        inputRegexCheck = __runInitializers(this, _dynamicVerticalResize_extraInitializers);
        /**
         * @description A pattern the value must match once editing ends. Stricter than
         * {@link GradumInput.inputRegexCheck}, so partial input is allowed mid-typing but not left behind.
         */
        blurRegexCheck;
        lastValidForInput = "";
        lastValidForBlur = "";
        /**
         * @readonly
         * @description Fired when the input gains focus.
         */
        onFocus = new Delegate();
        /**
         * @readonly
         * @description Fired when the input loses focus.
         */
        onBlur = new Delegate();
        /**
         * @readonly
         * @description Fired on every accepted change to the input's value.
         */
        onInput = new Delegate();
        /**
         * @description The underlying `<input>` or `<textarea>` element. An alias of `element`, kept for
         * readability where the distinction matters.
         */
        get input() {
            return this.element;
        }
        set input(value) {
            this.element = value;
        }
        get element() {
            return super.element;
        }
        set element(value) {
            if (!(value instanceof Node) && typeof value === "object") {
                if (!value.name)
                    value.name = randomId();
                if (this.elementTag === "input" && !value.type)
                    value.type = "text";
            }
            super.element = value;
        }
        #type_accessor_storage = __runInitializers(this, _type_initializers, void 0);
        get type() { return this.#type_accessor_storage; }
        set type(value) { this.#type_accessor_storage = value; }
        #placeholder_accessor_storage = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _placeholder_initializers, void 0));
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        #pattern_accessor_storage = (__runInitializers(this, _placeholder_extraInitializers), __runInitializers(this, _pattern_initializers, void 0));
        get pattern() { return this.#pattern_accessor_storage; }
        set pattern(value) { this.#pattern_accessor_storage = value; }
        #size_accessor_storage = (__runInitializers(this, _pattern_extraInitializers), __runInitializers(this, _size_initializers, void 0));
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        /**
         * @inheritDoc
         */
        setupChangedCallbacks() {
            super.setupChangedCallbacks();
            this.emitter?.add("processValue", () => this.processInputValue());
        }
        /**
         * @inheritDoc
         */
        setupUIListeners() {
            super.setupUIListeners();
            gradum(this).on(DefaultEventName.click, () => {
                if (!this.locked)
                    this.element?.focus();
                return Propagation.propagate;
            });
        }
        /**
         * @description The input's value, parsed from its text. Numbers and JSON are converted automatically,
         * and a current value exposing `fromString` is used to parse the text into its own type. Assigning
         * writes the value's string form back to the element.
         */
        get value() {
            const value = this.rawValue;
            if (!value)
                return undefined;
            try {
                const num = parseFloat(value);
                if (!isNaN(num))
                    return num;
            }
            catch { }
            try {
                const current = this.value;
                if (current && typeof current === "object" && "fromString" in current
                    && typeof current.fromString === "function")
                    return current.fromString(value);
            }
            catch { }
            try {
                return JSON.parse(value);
            }
            catch { }
            return value;
        }
        set value(value) {
            this.rawValue = value.toString();
        }
        /**
         * @description The input's text exactly as it appears in the element, with no parsing. Assigning
         * checks it against {@link GradumInput.blurRegexCheck} and reverts to the last valid text if it fails.
         */
        get rawValue() {
            return this.element?.value ?? "";
        }
        set rawValue(value) {
            if (!(this.element instanceof HTMLInputElement) && !(this.element instanceof HTMLTextAreaElement))
                return;
            let strValue = value.toString();
            if (this.blurRegexCheck) {
                const re = new RegExp(this.blurRegexCheck);
                if (!re.test(strValue))
                    strValue = this.lastValidForBlur;
            }
            this.element.value = strValue;
            this.emitter.fire("valueSet");
        }
        /**
         * @function setValueSilently
         * @description Write a value into the element without running the regex checks or announcing the
         * change. Use it to sync the input from an external source without echoing an update back out.
         * @param {ValueType} value - The value to write.
         */
        setValueSilently(value) {
            if (!(this.element instanceof HTMLInputElement) && !(this.element instanceof HTMLTextAreaElement))
                return;
            this.element.value = typeof value?.toString === "function" ? value.toString() : String(value);
        }
        /**
         * @function processInputValue
         * @protected
         * @description Validate the element's current text against the configured patterns, sanitizing or
         * reverting it as needed, and record it as the last known-good value.
         * @param {string} [value=this.element.value] - The text to validate. Defaults to the element's.
         */
        processInputValue(value = this.element.value) {
            if (this.inputRegexCheck) {
                const re = new RegExp(this.inputRegexCheck);
                if (!re.test(value)) {
                    const attemptSanitize = this.sanitizeByRegex(value, this.inputRegexCheck);
                    if (re.test(attemptSanitize))
                        value = attemptSanitize;
                    else
                        value = this.lastValidForInput;
                }
            }
            this.lastValidForInput = value.toString();
            if (this.blurRegexCheck) {
                const re = new RegExp(this.blurRegexCheck);
                if (re.test(value.toString()))
                    this.lastValidForBlur = value;
            }
            else {
                this.lastValidForBlur = value;
            }
            if (this.element instanceof HTMLInputElement || this.element instanceof HTMLTextAreaElement)
                this.element.value = value;
            markDirty(this, "rawValue");
            this.onInput.fire();
        }
        sanitizeByRegex(value, rule) {
            const src = typeof rule === "string" ? rule : rule.source;
            const flags = typeof rule === "string" ? "" : rule.flags.replace("g", "");
            const re = new RegExp(src, flags);
            let out = "";
            for (const ch of value) {
                const candidate = out + ch;
                re.lastIndex = 0;
                if (re.test(candidate))
                    out = candidate;
            }
            return out;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _size_extraInitializers);
        }
    };
})();
define(GradumInput);

/**
 * @group Components
 * @category Basics
 */
class GradumNumericalInput extends GradumInput {
    /**
     * @static
     * @description Default properties assigned to a new numerical input: patterns that allow a number to be
     * typed one character at a time, but require a complete number once editing ends.
     */
    static defaultProperties = {
        inputRegexCheck: /^(?!-0?(\.0+)?$)-?(0|[1-9]\d*)?(\.\d+)?\.?$|^-$|^$/,
        blurRegexCheck: /^(?!-0?(\.0+)?$)-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/,
    };
    /**
     * @description A factor between the displayed text and the value read back, for showing a value in one
     * unit while storing it in another. The text is divided by it on read and multiplied on write.
     */
    multiplier = 1;
    /**
     * @description How many decimal places values are rounded to. Leave unset to keep full precision.
     */
    decimalPlaces;
    /**
     * @description The lowest accepted value. Anything lower is clamped up to it.
     */
    min;
    /**
     * @description The highest accepted value. Anything higher is clamped down to it.
     */
    max;
    /**
     * @description The input's numeric value. Assigning clamps it to the configured range, rounds it to the
     * configured precision, and writes the scaled result back to the element.
     */
    get value() {
        return this.element ? Number.parseFloat(this.element.value) / this.multiplier : undefined;
    }
    set value(value) {
        if (!value || value == "")
            value = 0;
        if (typeof value == "string")
            value = Number.parseFloat(value);
        value *= this.multiplier;
        if (this.min != undefined && value < this.min)
            value = this.min;
        if (this.max != undefined && value > this.max)
            value = this.max;
        if (this.decimalPlaces != undefined) {
            value = Math.round(value * Math.pow(10, this.decimalPlaces)) / Math.pow(10, this.decimalPlaces);
        }
        super.value = value;
    }
}
define(GradumNumericalInput);

/**
 * @group Event Handling
 * @category GradumEvents
 */
class GradumSelectInputEvent extends GradumEvent {
    /**
     * @readonly
     * @description The entry whose selection changed and caused this event.
     */
    toggledEntry;
    /**
     * @readonly
     * @description The values of every entry selected after the change.
     */
    values;
    /**
     * @constructor
     * @description Create a selection-input event.
     * @param {GradumSelectInputEventProperties} properties - The event's configuration, including the
     * toggled entry and the resulting values.
     */
    constructor(properties) {
        super(properties);
        this.toggledEntry = properties.toggledEntry;
        this.values = properties.values;
    }
}

/**
 * @class GradumSelect
 * @group Components
 * @category Basics
 *
 * @extends GradumElement
 * @description Base class for creating a selection menu

 */
let GradumSelect = (() => {
    let _classSuper = GradumBaseElement;
    let _instanceExtraInitializers = [];
    let _set_parent_decorators;
    let _getValue_decorators;
    let _getValue_initializers = [];
    let _getValue_extraInitializers = [];
    let _getSecondaryValue_decorators;
    let _getSecondaryValue_initializers = [];
    let _getSecondaryValue_extraInitializers = [];
    let _createEntry_decorators;
    let _createEntry_initializers = [];
    let _createEntry_extraInitializers = [];
    let _set_multiSelection_decorators;
    let _forceSelection_decorators;
    let _forceSelection_initializers = [];
    let _forceSelection_extraInitializers = [];
    let _selectedEntriesClasses_decorators;
    let _selectedEntriesClasses_initializers = [];
    let _selectedEntriesClasses_extraInitializers = [];
    let _entriesClasses_decorators;
    let _entriesClasses_initializers = [];
    let _entriesClasses_extraInitializers = [];
    return class GradumSelect extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _set_parent_decorators = [auto()];
            _getValue_decorators = [auto({
                    defaultValue: (entry) => entry instanceof GradumRichElement ? entry.text
                        : entry instanceof HTMLElement ? entry.textContent
                            : entry instanceof Element ? entry.innerHTML
                                : undefined
                })];
            _getSecondaryValue_decorators = [auto({ defaultValue: () => "" })];
            _createEntry_decorators = [auto({
                    defaultValue: (value) => GradumRichElement.create({ text: stringify(value) })
                })];
            _set_multiSelection_decorators = [auto({ defaultValue: false })];
            _forceSelection_decorators = [auto({
                    defaultValueCallback: function () {
                        return !this.multiSelection;
                    }
                })];
            _selectedEntriesClasses_decorators = [auto({
                    callBefore: function () {
                        this.selectedEntries?.forEach(entry => gradum(entry).removeClass(this.selectedEntryClasses));
                    },
                    callAfter: function () {
                        this.selectedEntries?.forEach(entry => gradum(entry).addClass(this.selectedEntryClasses));
                    },
                })];
            _entriesClasses_decorators = [auto({
                    callBefore: function (value) {
                        this.entries.forEach(entry => gradum(entry).removeClass(value));
                    },
                    callAfter: function (value) {
                        this.entries.forEach(entry => gradum(entry).addClass(value));
                    }
                })];
            __esDecorate(this, null, _set_parent_decorators, { kind: "setter", name: "parent", static: false, private: false, access: { has: obj => "parent" in obj, set: (obj, value) => { obj.parent = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_multiSelection_decorators, { kind: "setter", name: "multiSelection", static: false, private: false, access: { has: obj => "multiSelection" in obj, set: (obj, value) => { obj.multiSelection = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _getValue_decorators, { kind: "field", name: "getValue", static: false, private: false, access: { has: obj => "getValue" in obj, get: obj => obj.getValue, set: (obj, value) => { obj.getValue = value; } }, metadata: _metadata }, _getValue_initializers, _getValue_extraInitializers);
            __esDecorate(null, null, _getSecondaryValue_decorators, { kind: "field", name: "getSecondaryValue", static: false, private: false, access: { has: obj => "getSecondaryValue" in obj, get: obj => obj.getSecondaryValue, set: (obj, value) => { obj.getSecondaryValue = value; } }, metadata: _metadata }, _getSecondaryValue_initializers, _getSecondaryValue_extraInitializers);
            __esDecorate(null, null, _createEntry_decorators, { kind: "field", name: "createEntry", static: false, private: false, access: { has: obj => "createEntry" in obj, get: obj => obj.createEntry, set: (obj, value) => { obj.createEntry = value; } }, metadata: _metadata }, _createEntry_initializers, _createEntry_extraInitializers);
            __esDecorate(null, null, _forceSelection_decorators, { kind: "field", name: "forceSelection", static: false, private: false, access: { has: obj => "forceSelection" in obj, get: obj => obj.forceSelection, set: (obj, value) => { obj.forceSelection = value; } }, metadata: _metadata }, _forceSelection_initializers, _forceSelection_extraInitializers);
            __esDecorate(null, null, _selectedEntriesClasses_decorators, { kind: "field", name: "selectedEntriesClasses", static: false, private: false, access: { has: obj => "selectedEntriesClasses" in obj, get: obj => obj.selectedEntriesClasses, set: (obj, value) => { obj.selectedEntriesClasses = value; } }, metadata: _metadata }, _selectedEntriesClasses_initializers, _selectedEntriesClasses_extraInitializers);
            __esDecorate(null, null, _entriesClasses_decorators, { kind: "field", name: "entriesClasses", static: false, private: false, access: { has: obj => "entriesClasses" in obj, get: obj => obj.entriesClasses, set: (obj, value) => { obj.entriesClasses = value; } }, metadata: _metadata }, _entriesClasses_initializers, _entriesClasses_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @function create
         * @static
         * @description Instantiate a selection, reading its value and entry types back off the properties — so
         * the types come from `getValue`/`getSecondaryValue` rather than needing a cast. Narrows
         * {@link GradumBaseElement.create}, which cannot see generics declared on a subclass.
         * @template {{prototype: GradumBaseElement}} This - The class `create` was called on. The constraint
         * matches the base signature; the return type still narrows to this class.
         * @template ValueType - Inferred from `properties.getValue`.
         * @template SecondaryValueType - Inferred from `properties.getSecondaryValue`.
         * @template {object} EntryType - Inferred from the entries the accessors receive.
         * @param {GradumSelectProperties} [properties] - Properties to set on the new selection.
         * @returns {GradumSelect} The created selection, typed as the class this was called on.
         */
        static create(properties) {
            return super.create.call(this, properties);
        }
        /**
         * @static
         * @description Default properties assigned to a new selection: selected entries get the `selected` class,
         * and disabled entries are hidden.
         */
        static defaultProperties = {
            selectedEntriesClasses: "selected",
            onEnabled: (b, entry) => {
                if (!(entry instanceof HTMLElement))
                    return;
                gradum(entry).setStyle("visibility", b ? "" : "hidden");
            }
        };
        _inputField = __runInitializers(this, _instanceExtraInitializers);
        _entries = [];
        _entriesData = new WeakMap();
        parentObserver;
        _onSelect = new Delegate();
        /**
         * @description Fired whenever an entry is selected or deselected, with the new state, the entry, and its
         * index. Assigning a function subscribes it rather than replacing the existing subscribers.
         */
        get onSelect() {
            return this._onSelect;
        }
        set onSelect(value) {
            if (value)
                this._onSelect.add(value);
        }
        _onEnabled = new Delegate();
        /**
         * @description Fired whenever an entry is enabled or disabled. Assigning a function subscribes it rather
         * than replacing the existing subscribers.
         */
        get onEnabled() {
            return this._onEnabled;
        }
        set onEnabled(value) {
            if (value)
                this._onEnabled.add(value);
        }
        _onEntryAdded = new Delegate();
        /**
         * @description Fired whenever an entry is added. Assigning a function subscribes it rather than replacing
         * the existing subscribers.
         */
        get onEntryAdded() {
            return this._onEntryAdded;
        }
        set onEntryAdded(value) {
            if (value)
                this.onEntryAdded.add(value);
        }
        _onEntryRemoved = new Delegate();
        /**
         * @description Fired whenever an entry is removed. Assigning a function subscribes it rather than
         * replacing the existing subscribers.
         */
        get onEntryRemoved() {
            return this._onEntryRemoved;
        }
        set onEntryRemoved(value) {
            if (value)
                this.onEntryRemoved.add(value);
        }
        _onEntryClicked = new Delegate();
        /**
         * @description Fired whenever an entry is clicked, whether or not the click changes the selection.
         * Assigning a function subscribes it rather than replacing the existing subscribers.
         */
        get onEntryClicked() {
            return this._onEntryClicked;
        }
        set onEntryClicked(value) {
            if (value)
                this.onEntryClicked.add(value);
        }
        /**
         * @description This selection's entries, in order. Assigning a new list replaces them all.
         */
        get entries() {
            return this._entries;
        }
        set entries(value) {
            this.enableObserver(false);
            const previouslySelectedValues = this.selectedValues;
            this.clear(false);
            this._entries = (Array.isArray(value) ? value : Array.from(value))
                .filter(entry => entry !== this.inputField);
            if (value instanceof HTMLCollection && value.item(0))
                this.parent = value.item(0).parentElement;
            const array = this.entries;
            for (let i = 0; i < array.length; i++) {
                this.onEntryAdded.fire(array[i], i);
                gradum(array[i]).addClass(this.entriesClasses);
            }
            this.deselectAll();
            for (let i = 0; i < array.length; i++) {
                if (previouslySelectedValues.includes(this.getValue(array[i])))
                    this.select(array[i]);
            }
            if (this.selectedEntries.length === 0)
                this.initializeSelection();
            this.refreshInputField();
            this.enableObserver(true);
        }
        /**
         * @description The values of this selection's entries. Assigning a new list rebuilds the entries to match.
         */
        get values() {
            return this.entries.map(entry => this.getValue(entry));
        }
        set values(values) {
            const entries = [];
            values.forEach(value => {
                const entry = this.createEntry(value);
                if (entry instanceof Node && this.parent)
                    gradum(this.parent).addChild(entry);
                entries.push(entry);
            });
            this.entries = entries;
        }
        get selectedEntries() {
            return this.entries.filter(entry => this.getEntryData(entry).selected);
        }
        set selectedEntries(value) {
            this.deselectAll();
            if (!value)
                return;
            value.forEach(entry => this.select(entry));
        }
        set parent(value) {
            if (!(value instanceof Element))
                return;
            gradum(value).addChild(this.entries.filter(entry => entry instanceof Node));
            if (this.inputField)
                value.appendChild(this.inputField);
            this.setupParentObserver();
        }
        getValue = __runInitializers(this, _getValue_initializers, void 0);
        getSecondaryValue = (__runInitializers(this, _getValue_extraInitializers), __runInitializers(this, _getSecondaryValue_initializers, void 0));
        createEntry = (__runInitializers(this, _getSecondaryValue_extraInitializers), __runInitializers(this, _createEntry_initializers, void 0));
        /**
         * The dropdown's underlying hidden input. Might be undefined.
         */
        get inputName() {
            return this.inputField?.name;
        }
        set inputName(value) {
            if (!this._inputField)
                this._inputField = input({
                    value: this.stringSelectedValue,
                    type: "hidden",
                    parent: this.parent ?? document.body
                });
            this.inputField.name = value;
        }
        get inputField() {
            return this._inputField;
        }
        set multiSelection(value) {
            this.forceSelection = !value;
        }
        forceSelection = (__runInitializers(this, _createEntry_extraInitializers), __runInitializers(this, _forceSelection_initializers, void 0));
        //TODO FIX
        selectedEntriesClasses = (__runInitializers(this, _forceSelection_extraInitializers), __runInitializers(this, _selectedEntriesClasses_initializers, void 0));
        entriesClasses = (__runInitializers(this, _selectedEntriesClasses_extraInitializers), __runInitializers(this, _entriesClasses_initializers, void 0));
        /**
         * @function customCreate
         * @static
         * @protected
         * @description Build a selection, deferring the initial entries and selected values until the element
         * exists so they are not lost during construction.
         * @param {GradumSelectProperties} properties - The selection's configuration.
         * @returns {object} The created selection.
         */
        static customCreate(properties) {
            const { selectedValues, parent } = properties;
            const obj = super.customCreate({ ...properties, selectedValues: undefined, parent: undefined });
            obj.parent = parent;
            obj.selectedValues = selectedValues || [];
            return obj;
        }
        /**
         * @description Create a selection.
         */
        constructor() {
            super();
            __runInitializers(this, _entriesClasses_extraInitializers);
            this.onEntryClicked.add((entry) => this.select(entry, !this.isSelected(entry)));
            this.onEntryAdded.add((entry) => {
                this.initializeSelection();
                gradum(entry).on(DefaultEventName.click, (e) => {
                    this.onEntryClicked.fire(entry, e);
                    return Propagation.stopPropagation;
                });
            });
        }
        getEntryData(entry) {
            if (!entry)
                return {};
            let data = this._entriesData.get(entry);
            if (!data) {
                data = { selected: false, enabled: true };
                this._entriesData.set(entry, data);
            }
            return data;
        }
        clearEntryData(entry) {
            this._entriesData.delete(entry);
            const index = this.entries.indexOf(entry);
            if (index >= 0)
                this.entries.splice(index, 1);
        }
        addEntry(entry, index = this.entries.length) {
            if (index === undefined || typeof index !== "number" || index > this.entries.length)
                index = this.entries.length;
            if (index < 0)
                index = 0;
            this.enableObserver(false);
            this.onEntryAdded.fire(entry, index);
            gradum(entry).addClass(this.entriesClasses);
            if (Array.isArray(this.entries) && !this.entries.includes(entry))
                this.entries.splice(index, 0, entry);
            if (entry instanceof Node && !entry.parentElement && this.parent)
                gradum(this.parent).addChild(entry, index);
            this.enableObserver(true);
            requestAnimationFrame(() => this.select(this.selectedEntry));
        }
        removeEntry(value) {
            const entry = this.getEntry(value);
            if (!entry)
                return this;
            this.enableObserver(false);
            if (this.getEntryData(entry).selected && this.forceSelection) {
                const fallback = this.enabledEntries.find(e => e !== entry);
                if (fallback)
                    this.select(fallback);
            }
            this.onEntryRemoved.fire(entry);
            if (entry instanceof Node && entry.parentElement)
                entry.parentElement.removeChild(entry);
            this.clearEntryData(entry);
            this.refreshInputField();
            this.enableObserver(true);
            return this;
        }
        getEntryFromSecondaryValue(value) {
            return this.entries.find((entry) => this.getSecondaryValue(entry) === value);
        }
        isSelected(entry) {
            return this.selectedEntries.includes(entry);
        }
        getEntry(value) {
            let entry;
            try {
                const fromValue = this.find(value);
                if (fromValue)
                    entry = fromValue;
                else {
                    const isEntry = this.entries.find(entry => entry === value);
                    if (isEntry)
                        entry = isEntry;
                }
            }
            catch {
            }
            return entry;
        }
        /**
         * @function select
         * @description Select or deselect an entry. In single-selection mode selecting one entry deselects
         * whichever was selected before.
         * @param {ValueType | EntryType} value - The entry to select, or the value identifying it.
         * @param {boolean} [selected=true] - Whether to select the entry, or deselect it.
         * @returns {this} Itself, allowing for method chaining.
         */
        select(value, selected = true) {
            if (isNull(value) || isUndefined(value))
                return this;
            let entry;
            try {
                const fromValue = this.getEntry(value);
                if (fromValue)
                    entry = fromValue;
                else {
                    const isEntry = this.entries.find(entry => entry === value);
                    if (isEntry)
                        entry = isEntry;
                }
            }
            catch {
            }
            if (!entry)
                return this;
            const wasSelected = this.isSelected(entry);
            if (selected === wasSelected)
                return this;
            if (!selected && wasSelected && this.selectedEntries.length <= 1 && this.forceSelection)
                return this;
            if (!this.multiSelection)
                this.deselectAll();
            this.getEntryData(entry).selected = selected;
            if (entry instanceof HTMLElement)
                gradum(entry).toggleClass(this.selectedEntriesClasses, selected);
            this.initializeSelection();
            this.refreshInputField();
            this.onSelect.fire(selected, entry, this.getIndex(entry));
            (this.parent ?? document).dispatchEvent(new GradumSelectInputEvent({
                toggledEntry: entry,
                values: this.selectedValues
            }));
            return this;
        }
        /**
         * @function selectByIndex
         * @description Select the entry at the given index.
         * @param {number} index - The index of the entry to select.
         * @param {(index: number, entriesCount: number, zero?: number) => number} [preprocess=trim] - Applied to the
         * index before use. Defaults to `trim`, which clamps it into range; pass `mod` to wrap around instead.
         * @returns {this} Itself, allowing for method chaining.
         */
        selectByIndex(index, preprocess = trim) {
            index = preprocess(index, this.entries.length - 1, 0);
            return this.select(this.entries[index]);
        }
        getIndex(entry) {
            return this.entries.indexOf(entry);
        }
        deselectAll() {
            this.selectedEntries.forEach(entry => {
                if (entry instanceof HTMLElement)
                    gradum(entry).toggleClass(this.selectedEntriesClasses, false);
                this.getEntryData(entry).selected = false;
            });
            this.refreshInputField();
        }
        reset() {
            this.deselectAll();
            // todo this.onEntryClick(this.enabledEntries[0]);
        }
        get enabledEntries() {
            return this.entries.filter(entry => this.getEntryData(entry).enabled);
        }
        get enabledValues() {
            return this.enabledEntries.map(entry => this.getValue(entry));
        }
        get enabledSecondaryValues() {
            return this.enabledEntries.map(entry => this.getSecondaryValue(entry));
        }
        find(value) {
            return this.entries.find((entry) => this.getValue(entry) === value);
        }
        findBySecondaryValue(value) {
            return this.entries.find((entry) => this.getSecondaryValue(entry) === value);
        }
        findAll(...values) {
            return this.entries.filter(entry => values.includes(this.getValue(entry)));
        }
        findAllBySecondaryValue(...values) {
            return this.entries.filter((entry) => values.includes(this.getSecondaryValue(entry)));
        }
        enable(b, ...entries) {
            if (!entries || entries.length === 0)
                entries = this.entries;
            entries.forEach(value => {
                const entry = this.getEntry(value);
                if (!entry)
                    return;
                this.getEntryData(entry).enabled = b;
                this.onEnabled.fire(b, entry, this.getIndex(entry));
            });
        }
        /**
         * @description The dropdown's currently selected entries
         */
        get selectedEntry() {
            return this.selectedEntries[0];
        }
        get selectedIndex() {
            return this.getIndex(this.selectedEntry);
        }
        set selectedIndex(value) {
            this.selectByIndex(value);
        }
        get selectedIndices() {
            return this.selectedEntries.map(entry => this.getIndex(entry));
        }
        set selectedValues(values) {
            if (!this.forceSelection)
                this.deselectAll();
            this.entries.forEach(entry => {
                if (values.includes(this.getValue(entry)))
                    this.select(entry);
            });
        }
        /**
         * @description The dropdown's currently selected values
         */
        get selectedValues() {
            return this.selectedEntries.map(entry => this.getValue(entry));
        }
        get selectedValue() {
            const selectedEntry = this.selectedEntry;
            if (!selectedEntry)
                return;
            return this.getValue(selectedEntry);
        }
        get selectedSecondaryValues() {
            return this.selectedEntries.map(entry => this.getSecondaryValue(entry));
        }
        get selectedSecondaryValue() {
            const selectedEntry = this.selectedEntry;
            if (!selectedEntry)
                return;
            return this.getSecondaryValue(selectedEntry);
        }
        get stringSelectedValue() {
            return this.selectedEntries.map(entry => stringify(this.getValue(entry))).join(", ");
        }
        clear(disableObserver = true) {
            if (disableObserver)
                this.enableObserver(false);
            for (let index = this.entries.length - 1; index >= 0; index--) {
                const entry = this.entries[index];
                this.onEntryRemoved.fire(entry);
                if (this.parent && entry instanceof HTMLElement)
                    entry.remove();
            }
            this._entries = [];
            this.refreshInputField();
            if (disableObserver)
                this.enableObserver(true);
        }
        refreshInputField() {
            if (this.inputField)
                this.inputField.value = this.stringSelectedValue;
        }
        destroy() {
            this.enableObserver(false);
            this.parentObserver = null;
            return this;
        }
        enableObserver(value) {
            if (!value)
                return this.parentObserver?.disconnect();
            if (this.parent instanceof Element && this.parentObserver)
                this.parentObserver.observe(this.parent, { childList: true });
        }
        initializeSelection() {
            if (this.forceSelection && this.enabledEntries.length && this.selectedEntries.length === 0) {
                const fallback = this.enabledEntries[0];
                if (fallback)
                    this.select(fallback);
            }
        }
        setupParentObserver() {
            this.enableObserver(false);
            this.parentObserver = new MutationObserver(records => {
                for (const record of records) {
                    for (const node of record.addedNodes) {
                        if (!(node instanceof Element) || node.parentElement !== this.parent)
                            continue;
                        if (node === this.inputField)
                            continue;
                        const entry = node;
                        const children = Array.from(this.parent.children)
                            .filter(el => el !== this.inputField)
                            .filter(el => this.entries.includes(el) || el === entry);
                        const targetIndex = children.indexOf(entry);
                        if (targetIndex < 0)
                            continue;
                        if (targetIndex === 0)
                            this.entries.splice(targetIndex, 0, entry);
                        else {
                            const previousIndex = this.entries.indexOf(children[targetIndex - 1]);
                            this.entries.splice(previousIndex + 1, 0, entry);
                        }
                        this.getEntryData(entry);
                        this.onEntryAdded.fire(entry, this.getIndex(entry));
                        gradum(entry).addClass(this.entriesClasses);
                    }
                    for (const node of record.removedNodes) {
                        if (!(node instanceof Element))
                            continue;
                        if (node === this.inputField)
                            continue;
                        queueMicrotask(() => {
                            if (node.isConnected)
                                return;
                            const data = this.getEntryData(node);
                            if (data.selected && this.forceSelection && this.enabledEntries.length) {
                                const fallback = this.enabledEntries[0];
                                if (fallback)
                                    this.select(fallback);
                            }
                            data.selected = false;
                            this.onEntryRemoved.fire(node);
                            this.clearEntryData(node);
                        });
                    }
                }
            });
            this.enableObserver(true);
        }
    };
})();
define(GradumSelect);

/**
 * @class GradumSelectElement
 * @group Components
 * @category Basics
 *
 * @extends GradumElement
 * @description Select element class for creating Gradum button elements.
 */
let GradumSelectElement = (() => {
    let _classSuper = GradumElement;
    let _instanceExtraInitializers = [];
    let _values_decorators;
    let _values_initializers = [];
    let _values_extraInitializers = [];
    let _selectedEntries_decorators;
    let _selectedEntries_initializers = [];
    let _selectedEntries_extraInitializers = [];
    let _selectedEntry_decorators;
    let _selectedEntry_initializers = [];
    let _selectedEntry_extraInitializers = [];
    let _selectedIndex_decorators;
    let _selectedIndex_initializers = [];
    let _selectedIndex_extraInitializers = [];
    let _selectedIndices_decorators;
    let _selectedIndices_initializers = [];
    let _selectedIndices_extraInitializers = [];
    let _entriesClasses_decorators;
    let _entriesClasses_initializers = [];
    let _entriesClasses_extraInitializers = [];
    let _selectedEntriesClasses_decorators;
    let _selectedEntriesClasses_initializers = [];
    let _selectedEntriesClasses_extraInitializers = [];
    let _inputName_decorators;
    let _inputName_initializers = [];
    let _inputName_extraInitializers = [];
    let _inputField_decorators;
    let _inputField_initializers = [];
    let _inputField_extraInitializers = [];
    let _multiSelection_decorators;
    let _multiSelection_initializers = [];
    let _multiSelection_extraInitializers = [];
    let _forceSelection_decorators;
    let _forceSelection_initializers = [];
    let _forceSelection_extraInitializers = [];
    let _enabledEntries_decorators;
    let _enabledEntries_initializers = [];
    let _enabledEntries_extraInitializers = [];
    let _enabledValues_decorators;
    let _enabledValues_initializers = [];
    let _enabledValues_extraInitializers = [];
    let _enabledSecondaryValues_decorators;
    let _enabledSecondaryValues_initializers = [];
    let _enabledSecondaryValues_extraInitializers = [];
    let _selectedValue_decorators;
    let _selectedValue_initializers = [];
    let _selectedValue_extraInitializers = [];
    let _selectedValues_decorators;
    let _selectedValues_initializers = [];
    let _selectedValues_extraInitializers = [];
    let _selectedSecondaryValues_decorators;
    let _selectedSecondaryValues_initializers = [];
    let _selectedSecondaryValues_extraInitializers = [];
    let _selectedSecondaryValue_decorators;
    let _selectedSecondaryValue_initializers = [];
    let _selectedSecondaryValue_extraInitializers = [];
    let _stringSelectedValue_decorators;
    let _stringSelectedValue_initializers = [];
    let _stringSelectedValue_extraInitializers = [];
    let _set_transitionReifect_decorators;
    return class GradumSelectElement extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _values_decorators = [expose("select")];
            _selectedEntries_decorators = [expose("select")];
            _selectedEntry_decorators = [expose("select", false)];
            _selectedIndex_decorators = [expose("select")];
            _selectedIndices_decorators = [expose("select", false)];
            _entriesClasses_decorators = [expose("select")];
            _selectedEntriesClasses_decorators = [expose("select")];
            _inputName_decorators = [expose("select")];
            _inputField_decorators = [expose("select", false)];
            _multiSelection_decorators = [expose("select")];
            _forceSelection_decorators = [expose("select")];
            _enabledEntries_decorators = [expose("select", false)];
            _enabledValues_decorators = [expose("select", false)];
            _enabledSecondaryValues_decorators = [expose("select", false)];
            _selectedValue_decorators = [expose("select", false)];
            _selectedValues_decorators = [expose("select", false)];
            _selectedSecondaryValues_decorators = [expose("select", false)];
            _selectedSecondaryValue_decorators = [expose("select", false)];
            _stringSelectedValue_decorators = [expose("select", false)];
            _set_transitionReifect_decorators = [auto({
                    preprocessValue: function (value) {
                        if (!value)
                            return;
                        if (value instanceof Reifect)
                            return value;
                        return new Reifect(value);
                    }
                })];
            __esDecorate(this, null, _selectedEntries_decorators, { kind: "accessor", name: "selectedEntries", static: false, private: false, access: { has: obj => "selectedEntries" in obj, get: obj => obj.selectedEntries, set: (obj, value) => { obj.selectedEntries = value; } }, metadata: _metadata }, _selectedEntries_initializers, _selectedEntries_extraInitializers);
            __esDecorate(this, null, _selectedEntry_decorators, { kind: "accessor", name: "selectedEntry", static: false, private: false, access: { has: obj => "selectedEntry" in obj, get: obj => obj.selectedEntry, set: (obj, value) => { obj.selectedEntry = value; } }, metadata: _metadata }, _selectedEntry_initializers, _selectedEntry_extraInitializers);
            __esDecorate(this, null, _selectedIndex_decorators, { kind: "accessor", name: "selectedIndex", static: false, private: false, access: { has: obj => "selectedIndex" in obj, get: obj => obj.selectedIndex, set: (obj, value) => { obj.selectedIndex = value; } }, metadata: _metadata }, _selectedIndex_initializers, _selectedIndex_extraInitializers);
            __esDecorate(this, null, _selectedIndices_decorators, { kind: "accessor", name: "selectedIndices", static: false, private: false, access: { has: obj => "selectedIndices" in obj, get: obj => obj.selectedIndices, set: (obj, value) => { obj.selectedIndices = value; } }, metadata: _metadata }, _selectedIndices_initializers, _selectedIndices_extraInitializers);
            __esDecorate(this, null, _inputName_decorators, { kind: "accessor", name: "inputName", static: false, private: false, access: { has: obj => "inputName" in obj, get: obj => obj.inputName, set: (obj, value) => { obj.inputName = value; } }, metadata: _metadata }, _inputName_initializers, _inputName_extraInitializers);
            __esDecorate(this, null, _inputField_decorators, { kind: "accessor", name: "inputField", static: false, private: false, access: { has: obj => "inputField" in obj, get: obj => obj.inputField, set: (obj, value) => { obj.inputField = value; } }, metadata: _metadata }, _inputField_initializers, _inputField_extraInitializers);
            __esDecorate(this, null, _multiSelection_decorators, { kind: "accessor", name: "multiSelection", static: false, private: false, access: { has: obj => "multiSelection" in obj, get: obj => obj.multiSelection, set: (obj, value) => { obj.multiSelection = value; } }, metadata: _metadata }, _multiSelection_initializers, _multiSelection_extraInitializers);
            __esDecorate(this, null, _forceSelection_decorators, { kind: "accessor", name: "forceSelection", static: false, private: false, access: { has: obj => "forceSelection" in obj, get: obj => obj.forceSelection, set: (obj, value) => { obj.forceSelection = value; } }, metadata: _metadata }, _forceSelection_initializers, _forceSelection_extraInitializers);
            __esDecorate(this, null, _enabledEntries_decorators, { kind: "accessor", name: "enabledEntries", static: false, private: false, access: { has: obj => "enabledEntries" in obj, get: obj => obj.enabledEntries, set: (obj, value) => { obj.enabledEntries = value; } }, metadata: _metadata }, _enabledEntries_initializers, _enabledEntries_extraInitializers);
            __esDecorate(this, null, _enabledValues_decorators, { kind: "accessor", name: "enabledValues", static: false, private: false, access: { has: obj => "enabledValues" in obj, get: obj => obj.enabledValues, set: (obj, value) => { obj.enabledValues = value; } }, metadata: _metadata }, _enabledValues_initializers, _enabledValues_extraInitializers);
            __esDecorate(this, null, _enabledSecondaryValues_decorators, { kind: "accessor", name: "enabledSecondaryValues", static: false, private: false, access: { has: obj => "enabledSecondaryValues" in obj, get: obj => obj.enabledSecondaryValues, set: (obj, value) => { obj.enabledSecondaryValues = value; } }, metadata: _metadata }, _enabledSecondaryValues_initializers, _enabledSecondaryValues_extraInitializers);
            __esDecorate(this, null, _selectedValue_decorators, { kind: "accessor", name: "selectedValue", static: false, private: false, access: { has: obj => "selectedValue" in obj, get: obj => obj.selectedValue, set: (obj, value) => { obj.selectedValue = value; } }, metadata: _metadata }, _selectedValue_initializers, _selectedValue_extraInitializers);
            __esDecorate(this, null, _selectedValues_decorators, { kind: "accessor", name: "selectedValues", static: false, private: false, access: { has: obj => "selectedValues" in obj, get: obj => obj.selectedValues, set: (obj, value) => { obj.selectedValues = value; } }, metadata: _metadata }, _selectedValues_initializers, _selectedValues_extraInitializers);
            __esDecorate(this, null, _selectedSecondaryValues_decorators, { kind: "accessor", name: "selectedSecondaryValues", static: false, private: false, access: { has: obj => "selectedSecondaryValues" in obj, get: obj => obj.selectedSecondaryValues, set: (obj, value) => { obj.selectedSecondaryValues = value; } }, metadata: _metadata }, _selectedSecondaryValues_initializers, _selectedSecondaryValues_extraInitializers);
            __esDecorate(this, null, _selectedSecondaryValue_decorators, { kind: "accessor", name: "selectedSecondaryValue", static: false, private: false, access: { has: obj => "selectedSecondaryValue" in obj, get: obj => obj.selectedSecondaryValue, set: (obj, value) => { obj.selectedSecondaryValue = value; } }, metadata: _metadata }, _selectedSecondaryValue_initializers, _selectedSecondaryValue_extraInitializers);
            __esDecorate(this, null, _stringSelectedValue_decorators, { kind: "accessor", name: "stringSelectedValue", static: false, private: false, access: { has: obj => "stringSelectedValue" in obj, get: obj => obj.stringSelectedValue, set: (obj, value) => { obj.stringSelectedValue = value; } }, metadata: _metadata }, _stringSelectedValue_initializers, _stringSelectedValue_extraInitializers);
            __esDecorate(this, null, _set_transitionReifect_decorators, { kind: "setter", name: "transitionReifect", static: false, private: false, access: { has: obj => "transitionReifect" in obj, set: (obj, value) => { obj.transitionReifect = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _values_decorators, { kind: "field", name: "values", static: false, private: false, access: { has: obj => "values" in obj, get: obj => obj.values, set: (obj, value) => { obj.values = value; } }, metadata: _metadata }, _values_initializers, _values_extraInitializers);
            __esDecorate(null, null, _entriesClasses_decorators, { kind: "field", name: "entriesClasses", static: false, private: false, access: { has: obj => "entriesClasses" in obj, get: obj => obj.entriesClasses, set: (obj, value) => { obj.entriesClasses = value; } }, metadata: _metadata }, _entriesClasses_initializers, _entriesClasses_extraInitializers);
            __esDecorate(null, null, _selectedEntriesClasses_decorators, { kind: "field", name: "selectedEntriesClasses", static: false, private: false, access: { has: obj => "selectedEntriesClasses" in obj, get: obj => obj.selectedEntriesClasses, set: (obj, value) => { obj.selectedEntriesClasses = value; } }, metadata: _metadata }, _selectedEntriesClasses_initializers, _selectedEntriesClasses_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @static
         * @description Default properties assigned to a new select element. Entries are built as
         * {@link GradumRichElement}s unless another tag is given.
         */
        static defaultProperties = {
            entriesTag: "gradum-rich-element"
        };
        /**
         * @protected
         * @description The pending timer that clears the container's fixed size once the resize animation ends.
         */
        _sizeTransitionTimeout = __runInitializers(this, _instanceExtraInitializers);
        /**
         * @readonly
         * @description The selection logic backing this element. It owns the entries and their selected state;
         * this element renders them.
         */
        select = GradumSelect.create();
        /**
         * @description The tag used to build entries from plain values.
         */
        entriesTag;
        /**
         * @description The element's entries, in order. Assigning a new list replaces them all.
         */
        get entries() {
            return this.select.entries;
        }
        set entries(value) {
            this.select.entries = value;
        }
        values = __runInitializers(this, _values_initializers, void 0);
        #selectedEntries_accessor_storage = (__runInitializers(this, _values_extraInitializers), __runInitializers(this, _selectedEntries_initializers, void 0));
        get selectedEntries() { return this.#selectedEntries_accessor_storage; }
        set selectedEntries(value) { this.#selectedEntries_accessor_storage = value; }
        #selectedEntry_accessor_storage = (__runInitializers(this, _selectedEntries_extraInitializers), __runInitializers(this, _selectedEntry_initializers, void 0));
        get selectedEntry() { return this.#selectedEntry_accessor_storage; }
        set selectedEntry(value) { this.#selectedEntry_accessor_storage = value; }
        #selectedIndex_accessor_storage = (__runInitializers(this, _selectedEntry_extraInitializers), __runInitializers(this, _selectedIndex_initializers, void 0));
        get selectedIndex() { return this.#selectedIndex_accessor_storage; }
        set selectedIndex(value) { this.#selectedIndex_accessor_storage = value; }
        #selectedIndices_accessor_storage = (__runInitializers(this, _selectedIndex_extraInitializers), __runInitializers(this, _selectedIndices_initializers, void 0));
        get selectedIndices() { return this.#selectedIndices_accessor_storage; }
        set selectedIndices(value) { this.#selectedIndices_accessor_storage = value; }
        entriesClasses = (__runInitializers(this, _selectedIndices_extraInitializers), __runInitializers(this, _entriesClasses_initializers, void 0));
        selectedEntriesClasses = (__runInitializers(this, _entriesClasses_extraInitializers), __runInitializers(this, _selectedEntriesClasses_initializers, void 0));
        #inputName_accessor_storage = (__runInitializers(this, _selectedEntriesClasses_extraInitializers), __runInitializers(this, _inputName_initializers, void 0));
        get inputName() { return this.#inputName_accessor_storage; }
        set inputName(value) { this.#inputName_accessor_storage = value; }
        #inputField_accessor_storage = (__runInitializers(this, _inputName_extraInitializers), __runInitializers(this, _inputField_initializers, void 0));
        get inputField() { return this.#inputField_accessor_storage; }
        set inputField(value) { this.#inputField_accessor_storage = value; }
        #multiSelection_accessor_storage = (__runInitializers(this, _inputField_extraInitializers), __runInitializers(this, _multiSelection_initializers, void 0));
        get multiSelection() { return this.#multiSelection_accessor_storage; }
        set multiSelection(value) { this.#multiSelection_accessor_storage = value; }
        #forceSelection_accessor_storage = (__runInitializers(this, _multiSelection_extraInitializers), __runInitializers(this, _forceSelection_initializers, void 0));
        get forceSelection() { return this.#forceSelection_accessor_storage; }
        set forceSelection(value) { this.#forceSelection_accessor_storage = value; }
        #enabledEntries_accessor_storage = (__runInitializers(this, _forceSelection_extraInitializers), __runInitializers(this, _enabledEntries_initializers, void 0));
        get enabledEntries() { return this.#enabledEntries_accessor_storage; }
        set enabledEntries(value) { this.#enabledEntries_accessor_storage = value; }
        #enabledValues_accessor_storage = (__runInitializers(this, _enabledEntries_extraInitializers), __runInitializers(this, _enabledValues_initializers, void 0));
        get enabledValues() { return this.#enabledValues_accessor_storage; }
        set enabledValues(value) { this.#enabledValues_accessor_storage = value; }
        #enabledSecondaryValues_accessor_storage = (__runInitializers(this, _enabledValues_extraInitializers), __runInitializers(this, _enabledSecondaryValues_initializers, void 0));
        get enabledSecondaryValues() { return this.#enabledSecondaryValues_accessor_storage; }
        set enabledSecondaryValues(value) { this.#enabledSecondaryValues_accessor_storage = value; }
        #selectedValue_accessor_storage = (__runInitializers(this, _enabledSecondaryValues_extraInitializers), __runInitializers(this, _selectedValue_initializers, void 0));
        get selectedValue() { return this.#selectedValue_accessor_storage; }
        set selectedValue(value) { this.#selectedValue_accessor_storage = value; }
        #selectedValues_accessor_storage = (__runInitializers(this, _selectedValue_extraInitializers), __runInitializers(this, _selectedValues_initializers, void 0));
        get selectedValues() { return this.#selectedValues_accessor_storage; }
        set selectedValues(value) { this.#selectedValues_accessor_storage = value; }
        #selectedSecondaryValues_accessor_storage = (__runInitializers(this, _selectedValues_extraInitializers), __runInitializers(this, _selectedSecondaryValues_initializers, void 0));
        get selectedSecondaryValues() { return this.#selectedSecondaryValues_accessor_storage; }
        set selectedSecondaryValues(value) { this.#selectedSecondaryValues_accessor_storage = value; }
        #selectedSecondaryValue_accessor_storage = (__runInitializers(this, _selectedSecondaryValues_extraInitializers), __runInitializers(this, _selectedSecondaryValue_initializers, void 0));
        get selectedSecondaryValue() { return this.#selectedSecondaryValue_accessor_storage; }
        set selectedSecondaryValue(value) { this.#selectedSecondaryValue_accessor_storage = value; }
        #stringSelectedValue_accessor_storage = (__runInitializers(this, _selectedSecondaryValue_extraInitializers), __runInitializers(this, _stringSelectedValue_initializers, void 0));
        get stringSelectedValue() { return this.#stringSelectedValue_accessor_storage; }
        set stringSelectedValue(value) { this.#stringSelectedValue_accessor_storage = value; }
        /**
         * @function initialize
         * @description Set the element up and select its initial entry.
         */
        initialize() {
            this.select.onSelect.add(() => this.applyTransition());
            super.initialize();
            if (!this.select.parent)
                this.select.parent = this;
        }
        _transitionDuration = (__runInitializers(this, _stringSelectedValue_extraInitializers), 0);
        get transitionDuration() {
            return this._transitionDuration;
        }
        /**
         * @description Duration of the container size transition in seconds. Kept in sync with
         * `switchTransitionReifect` — set this to change both at once.
         */
        set transitionDuration(value) {
            this._transitionDuration = value;
            if (value <= 0)
                return;
            if (!this.transitionReifect)
                this.transitionReifect = new Reifect({});
            this.transitionReifect.styles = `transition: width ${value}s ease-in-out, height ${value}s ease-in-out`;
        }
        set transitionReifect(value) {
            if (!value)
                return;
            value.attach(this);
        }
        get transitionReifect() { return; }
        /**
         * @description Animates the container from its current size to the selected entry's natural
         * size. Subclasses should call `super.applyTransition()` then add their own entry-level logic.
         * The sequence:
         * 1. Freeze container at current px size (gives CSS transition a `from` value)
         * 2. Call `beforeResize()` — subclass hook to prepare entries before the frame
         * 3. Next frame: read selected entry's natural size, animate container to it
         * 4. After `transitionDuration`ms: release explicit container size
         */
        applyTransition() {
            if (this.transitionDuration <= 0 || !this.transitionReifect)
                return;
            const selectedEntry = this.selectedEntry;
            if (!selectedEntry)
                return;
            this.transitionReifect.unapply(this);
            gradum(this).setStyles({ width: `${this.offsetWidth}px`, height: `${this.offsetHeight}px` }, true);
            this.transitionReifect.apply(this);
            this.beforeResize(selectedEntry);
            requestAnimationFrame(() => gradum(this).setStyles({
                width: `${selectedEntry.offsetWidth}px`,
                height: `${selectedEntry.offsetHeight}px`
            }));
            clearTimeout(this._sizeTransitionTimeout);
            this._sizeTransitionTimeout = setTimeout(() => {
                gradum(this).setStyles({ width: "", height: "" });
                this.afterResize(selectedEntry);
            }, this.transitionDuration * 1000);
        }
        /**
         * @description Called synchronously inside `applyTransition`, before the rAF that reads the
         * selected entry's new size. Use this to reposition/reflow entries so the size read is correct.
         * @param {EntryType} selectedEntry - The newly selected entry.
         */
        beforeResize(selectedEntry) { }
        /**
         * @description Called after the container size transition completes.
         * @param {EntryType} selectedEntry - The entry that is now selected.
         */
        afterResize(selectedEntry) { }
    };
})();
define(GradumSelectElement);

var css_248z$3 = "gradum-content-switch{align-items:flex-start;display:flex;flex-direction:column;overflow:hidden;position:relative}gradum-content-switch>*{box-sizing:border-box;left:0;position:absolute;top:0}";
styleInject(css_248z$3);

/**
 * @enum {ContentSwitchMode}
 * @group Components
 * @category Containers
 *
 * @description How a {@link GradumContentSwitch} animates from the outgoing entry to the incoming one.
 * @property {ContentSwitchMode.fadeLeft} fadeLeft - The new entry fades in while sliding leftwards.
 * @property {ContentSwitchMode.fadeRight} fadeRight - The new entry fades in while sliding rightwards.
 * @property {ContentSwitchMode.carousel} carousel - Entries slide as one strip, in the direction of travel.
 */
var ContentSwitchMode;
(function (ContentSwitchMode) {
    ContentSwitchMode["fadeLeft"] = "fadeLeft";
    ContentSwitchMode["fadeRight"] = "fadeRight";
    ContentSwitchMode["carousel"] = "carousel";
})(ContentSwitchMode || (ContentSwitchMode = {}));

/**
 * @class GradumContentSwitch
 * @group Components
 * @category Containers
 *
 * @extends GradumSelectElement
 * @template ValueType - The type of the value held by each entry.
 * @template SecondaryValueType - The type of each entry's secondary value.
 * @template {HTMLElement} EntryType - The type of the entry elements.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Shows one entry at a time and animates the swap when the selection changes. Registered
 * as `<gradum-content-switch>`. Selection works as on any {@link GradumSelectElement}; this adds the
 * transition between the outgoing and incoming entry, configured through {@link GradumContentSwitch.mode}.
 */
let GradumContentSwitch = (() => {
    let _classSuper = GradumSelectElement;
    let _instanceExtraInitializers = [];
    let _set_mode_decorators;
    let _set_entryTransitionReifect_decorators;
    let _set_movementReifect_decorators;
    let _set_transitionDuration_decorators;
    return class GradumContentSwitch extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _set_mode_decorators = [auto({ defaultValue: ContentSwitchMode.fadeRight })];
            _set_entryTransitionReifect_decorators = [auto({
                    preprocessValue: function (value) {
                        if (!value)
                            return;
                        if (value instanceof Reifect)
                            return value;
                        return new Reifect(value);
                    }
                })];
            _set_movementReifect_decorators = [auto({
                    preprocessValue: function (value) {
                        if (!value)
                            return;
                        if (value instanceof Reifect)
                            return value;
                        return new Reifect(value);
                    }
                })];
            _set_transitionDuration_decorators = [auto({ override: true })];
            __esDecorate(this, null, _set_mode_decorators, { kind: "setter", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_entryTransitionReifect_decorators, { kind: "setter", name: "entryTransitionReifect", static: false, private: false, access: { has: obj => "entryTransitionReifect" in obj, set: (obj, value) => { obj.entryTransitionReifect = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_movementReifect_decorators, { kind: "setter", name: "movementReifect", static: false, private: false, access: { has: obj => "movementReifect" in obj, set: (obj, value) => { obj.movementReifect = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_transitionDuration_decorators, { kind: "setter", name: "transitionDuration", static: false, private: false, access: { has: obj => "transitionDuration" in obj, set: (obj, value) => { obj.transitionDuration = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @static
         * @description Default properties assigned to a new content switch. Entries cross over 0.3 seconds.
         */
        static defaultProperties = { transitionDuration: 0.3 };
        /**
         * @description The transition played when the selected entry changes. Assigning a new mode rebuilds
         * the movement reifect, so the next switch uses it. Defaults to `ContentSwitchMode.fadeRight`.
         */
        set mode(value) {
            this.reloadMovementReifect();
        }
        /**
         * @description The reifect controlling how each entry itself fades. Assigning a properties object
         * builds a {@link Reifect} from it, and the result is attached to every current entry.
         */
        set entryTransitionReifect(value) {
            if (!value)
                return;
            if (this.entries.length > 0)
                value.attach(...this.entries);
        }
        get entryTransitionReifect() { return; }
        /**
         * @description The reifect controlling how entries slide, which {@link GradumContentSwitch.mode}
         * regenerates. Assigning a properties object builds a {@link Reifect} from it, and the result is
         * attached to every current entry.
         */
        set movementReifect(value) {
            if (value && this.entries.length > 0)
                value.attach(...this.entries);
        }
        get movementReifect() { return; }
        /**
         * @description How long the entry transition lasts, in seconds. Assigning a value rewrites the entry
         * reifect's CSS transition, creating that reifect if it does not exist yet. Values of `0` or less are
         * ignored. Defaults to `0.3`.
         * @override
         */
        set transitionDuration(value) {
            if (value <= 0)
                return;
            if (!this.entryTransitionReifect)
                this.entryTransitionReifect = new Reifect({});
            this.entryTransitionReifect.styles = `transition: transform ${value}s ease-in-out, opacity ${value}s ease-in-out`;
        }
        initialize() {
            this.select.onEntryAdded.add(entry => this.setupEntry(entry));
            this.select.onEntryRemoved.add(entry => {
                this.entryTransitionReifect?.detach(entry);
                this.movementReifect?.detach(entry);
            });
            super.initialize();
            this.reloadMovementReifect();
        }
        setupEntry(entry) {
            gradum(entry).setStyles({ position: "relative", width: "", height: "", top: "0", left: "0" }, true);
            this.entryTransitionReifect?.attach(entry);
            this.movementReifect?.attach(entry);
            requestAnimationFrame(() => {
                if (entry !== this.selectedEntry)
                    this.freezeAndHide(entry);
            });
        }
        freezeAndHide(entry, isRelative = false) {
            gradum(entry).setStyles({
                width: isRelative ? "" : `${entry.offsetWidth}px`,
                height: isRelative ? "" : `${entry.offsetHeight}px`,
                position: isRelative ? "relative" : "absolute",
                top: "0",
                left: "0",
            }, true);
        }
        reloadMovementReifect() {
            if (!this.movementReifect)
                this.movementReifect = new Reifect({});
            this.movementReifect.styles = (index) => {
                const offset = index - this.selectedIndex;
                if (offset === 0)
                    return "transform: translateX(0); opacity: 1; pointer-events: all;";
                if (this.mode === ContentSwitchMode.carousel)
                    return `transform: translateX(${offset > 0 ? "100%" : "-100%"}); opacity: 0; pointer-events: none;`;
                const dx = this.mode === ContentSwitchMode.fadeLeft ? "-100%" : "100%";
                return `transform: translateX(${dx}); opacity: 0; pointer-events: none;`;
            };
        }
        beforeResize(selectedEntry) {
            this.select.entries.forEach(entry => this.freezeAndHide(entry, entry === selectedEntry));
            this.movementReifect?.apply(this.select.entries, { recomputeProperties: true });
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
})();
define(GradumContentSwitch, "gradum-content-switch");

var css_248z$2 = ".gradum-drawer{align-items:center;direction:ltr;display:inline-flex}.gradum-drawer-panel-container{align-items:center;display:flex;overflow:hidden;position:relative}.gradum-drawer-thumb{display:inline-block;position:relative}.gradum-drawer.top-drawer,.top-drawer .gradum-drawer-panel-container{flex-direction:column}.bottom-drawer .gradum-drawer-panel-container,.gradum-drawer.bottom-drawer{flex-direction:column-reverse}.gradum-drawer.left-drawer,.left-drawer .gradum-drawer-panel-container{flex-direction:row}.gradum-drawer.right-drawer,.right-drawer .gradum-drawer-panel-container{flex-direction:row-reverse}";
styleInject(css_248z$2);

//TODO TRY TO SEE IF HIDDEN OVERFLOW ELEMENT CAN CONTAIN ELEMENT THAT OVERFLOWS PAST PARENT
/**
 * @group Components
 * @category Containers
 */
let GradumDrawer = (() => {
    let _classSuper = GradumElement;
    let _instanceExtraInitializers = [];
    let _set_thumb_decorators;
    let _set_panel_decorators;
    let _set_icon_decorators;
    let _set_hideOverflow_decorators;
    let _set_attachSideToIconName_decorators;
    let _set_rotateIconBasedOnSide_decorators;
    let _set_side_decorators;
    let _set_offset_decorators;
    let _set_open_decorators;
    let _set_translation_decorators;
    let _transition_decorators;
    let _transition_initializers = [];
    let _transition_extraInitializers = [];
    return class GradumDrawer extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _set_thumb_decorators = [auto({
                    setIfUndefined: true,
                    callBefore: function () { if (this.thumb)
                        gradum(this).remChild(this.thumb); },
                    preprocessValue: (value) => value instanceof HTMLElement ? value : div(value)
                })];
            _set_panel_decorators = [auto({
                    setIfUndefined: true,
                    callBefore: function () { if (this.panel)
                        gradum(this).remChild(this.panel); },
                    preprocessValue: (value) => value instanceof HTMLElement ? value : div(value)
                })];
            _set_icon_decorators = [auto({
                    callBefore: function () { if (this.icon?.parentElement === this.thumb)
                        this.thumb.removeChild(this.icon); },
                    preprocessValue: function (value) {
                        if (value instanceof Element)
                            return value;
                        if (typeof value === "string" && !this.attachSideToIconName && !this.rotateIconBasedOnSide)
                            this.attachSideToIconName = true;
                        return GradumIconSwitch.create(typeof value === "object" ? value : {
                            icon: value,
                            switchReifect: { states: Object.values(Side) },
                            defaultState: this.open ? this.getOppositeSide() : this.side,
                            appendStateToIconName: this.attachSideToIconName,
                        });
                    }
                })];
            _set_hideOverflow_decorators = [auto({ defaultValue: false })];
            _set_attachSideToIconName_decorators = [auto({ defaultValue: false })];
            _set_rotateIconBasedOnSide_decorators = [auto({ defaultValue: false })];
            _set_side_decorators = [auto({ defaultValue: Side.bottom, cancelIfUnchanged: false })];
            _set_offset_decorators = [auto({
                    defaultValue: { open: 0, closed: 0 },
                    preprocessValue: (value) => typeof value === "number" ? { open: value, closed: value } : {
                        open: value?.open || 0,
                        closed: value?.closed || 0
                    }
                })];
            _set_open_decorators = [auto({ defaultValue: false })];
            _set_translation_decorators = [auto()];
            _transition_decorators = [auto({
                    defaultValueCallback: function () {
                        return new Reifect({
                            transitionProperties: ["transform", this.isVertical ? "height" : "width"],
                            transitionDuration: 0.2,
                            transitionTimingFunction: "ease-out",
                        });
                    },
                    callAfter: function () { this.transition.attach(this, this.panelContainer); },
                })];
            __esDecorate(this, null, _set_thumb_decorators, { kind: "setter", name: "thumb", static: false, private: false, access: { has: obj => "thumb" in obj, set: (obj, value) => { obj.thumb = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_panel_decorators, { kind: "setter", name: "panel", static: false, private: false, access: { has: obj => "panel" in obj, set: (obj, value) => { obj.panel = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_icon_decorators, { kind: "setter", name: "icon", static: false, private: false, access: { has: obj => "icon" in obj, set: (obj, value) => { obj.icon = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_hideOverflow_decorators, { kind: "setter", name: "hideOverflow", static: false, private: false, access: { has: obj => "hideOverflow" in obj, set: (obj, value) => { obj.hideOverflow = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_attachSideToIconName_decorators, { kind: "setter", name: "attachSideToIconName", static: false, private: false, access: { has: obj => "attachSideToIconName" in obj, set: (obj, value) => { obj.attachSideToIconName = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_rotateIconBasedOnSide_decorators, { kind: "setter", name: "rotateIconBasedOnSide", static: false, private: false, access: { has: obj => "rotateIconBasedOnSide" in obj, set: (obj, value) => { obj.rotateIconBasedOnSide = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_side_decorators, { kind: "setter", name: "side", static: false, private: false, access: { has: obj => "side" in obj, set: (obj, value) => { obj.side = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_offset_decorators, { kind: "setter", name: "offset", static: false, private: false, access: { has: obj => "offset" in obj, set: (obj, value) => { obj.offset = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_open_decorators, { kind: "setter", name: "open", static: false, private: false, access: { has: obj => "open" in obj, set: (obj, value) => { obj.open = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_translation_decorators, { kind: "setter", name: "translation", static: false, private: false, access: { has: obj => "translation" in obj, set: (obj, value) => { obj.translation = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _transition_decorators, { kind: "field", name: "transition", static: false, private: false, access: { has: obj => "transition" in obj, get: obj => obj.transition, set: (obj, value) => { obj.transition = value; } }, metadata: _metadata }, _transition_initializers, _transition_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        _panelContainer = __runInitializers(this, _instanceExtraInitializers);
        /**
         * @private
         * @description Guards {@link setupUILayout} against re-entering itself. Reading `thumb` or `panel`
         * creates them on first access, and their setters call `setupUILayout` again — so the layout would
         * otherwise run nested, and the inner run would leave `childHandler` pointing at the panel while the
         * outer run is still going.
         */
        layingOutUI = false;
        /**
         * @readonly
         * @description The element wrapping the panel. It is the one that resizes as the drawer opens and
         * closes; the panel itself keeps its natural size.
         */
        get panelContainer() { return this._panelContainer; }
        dragging = false;
        /**
         * @protected
         * @description Watches the panel while the drawer is open, so the drawer follows its content when
         * that content changes size.
         */
        resizeObserver;
        /**
         * @description The handle used to open and close the drawer. Assign an element to use it directly, or
         * properties to build one. Clicking it toggles the drawer; dragging it moves the drawer with the pointer.
         */
        set thumb(value) {
            gradum(value).addClass("gradum-drawer-thumb");
            if (this.initialized)
                this.setupUILayout();
        }
        get thumb() { return; }
        /**
         * @description The drawer's content panel. Assign an element to use it directly, or properties to build
         * one. Any children already on the drawer are moved into it when the layout is set up.
         */
        set panel(value) {
            gradum(value).addClass("gradum-drawer-panel");
            if (this.initialized)
                this.setupUILayout();
        }
        get panel() { return; }
        /**
         * @description The icon shown inside the thumb. Assign an icon name, an element, or icon-switch
         * properties. Given a name, a {@link GradumIconSwitch} is built that tracks the drawer's side so the
         * icon points the right way.
         */
        set icon(_value) {
            if (this.initialized)
                this.setupUILayout();
        }
        get icon() { return; }
        /**
         * @description Whether content overflowing the panel is clipped rather than spilling out of the drawer.
         */
        set hideOverflow(value) {
            gradum(this.panelContainer).setStyle("overflow", value ? "hidden" : "");
        }
        /**
         * @description Whether the drawer's side is appended to the icon's name, so a different icon file is
         * loaded per side. Turning this on turns {@link GradumDrawer.rotateIconBasedOnSide} off.
         */
        set attachSideToIconName(value) {
            if (this.icon instanceof GradumIconSwitch)
                this.icon.appendStateToIconName = value;
            if (value)
                this.rotateIconBasedOnSide = false;
        }
        /**
         * @description Whether one icon is rotated to suit the drawer's side instead of swapping files.
         * Turning this on turns {@link GradumDrawer.attachSideToIconName} off.
         */
        set rotateIconBasedOnSide(value) {
            if (value)
                this.attachSideToIconName = false;
            if (this.icon instanceof GradumIconSwitch)
                this.icon.switchReifect.styles = {
                    top: "transform: rotate(180deg)",
                    bottom: "transform: rotate(0deg)",
                    left: "transform: rotate(90deg)",
                    right: "transform: rotate(270deg)",
                };
        }
        /**
         * @description The edge the drawer is attached to. Assigning it swaps the matching CSS class and
         * refreshes the drawer's position.
         */
        set side(value) {
            gradum(this).toggleClass("top-drawer", value == Side.top)
                .toggleClass("bottom-drawer", value == Side.bottom)
                .toggleClass("left-drawer", value == Side.left)
                .toggleClass("right-drawer", value == Side.right);
            this.refresh();
        }
        /**
         * @description How far the drawer sits from its edge, in pixels, given separately for its open and
         * closed states. Assign a single number to use it for both.
         */
        set offset(value) { }
        get offset() { return; }
        /**
         * @readonly
         * @description Whether the drawer opens along the vertical axis, i.e. it is attached to the top or
         * bottom edge.
         */
        get isVertical() {
            return this.side == Side.top || this.side == Side.bottom;
        }
        /**
         * @description Whether the drawer is open. Assigning it animates the drawer to its new position.
         */
        set open(value) {
            if (value)
                this.resizeObserver?.observe(this.panel, { box: "border-box" });
            else
                this.resizeObserver?.unobserve(this.panel);
            this.refresh();
        }
        set translation(value) {
            switch (this.side) {
                case Side.top:
                    if (this.hideOverflow)
                        gradum(this.panelContainer).setStyle("height", value + "px");
                    else
                        gradum(this).setStyle("transform", `translateY(${-value}px)`);
                    break;
                case Side.bottom:
                    if (this.hideOverflow)
                        gradum(this.panelContainer).setStyle("height", value + "px");
                    else
                        gradum(this).setStyle("transform", `translateY(${-value}px)`);
                    break;
                case Side.left:
                    if (this.hideOverflow)
                        gradum(this.panelContainer).setStyle("width", value + "px");
                    else
                        gradum(this).setStyle("transform", `translateX(${-value}px)`);
                    break;
                case Side.right:
                    if (this.hideOverflow)
                        gradum(this.panelContainer).setStyle("width", value + "px");
                    else
                        gradum(this).setStyle("transform", `translateX(${-value}px)`);
                    break;
            }
        }
        transition = __runInitializers(this, _transition_initializers, void 0);
        /**
         * @description How far the drawer is currently displaced from its edge, in pixels. Set while dragging
         * to follow the pointer; otherwise driven by {@link GradumDrawer.open}.
         */
        get translation() { return; }
        /**
         * @function initialize
         * @description Set the drawer up and settle it into its closed position without animating, then enable
         * transitions on the next frame so later changes animate normally.
         */
        initialize() {
            super.initialize();
            gradum(this).show(false);
            this.enableTransition(false);
            this.setupResizeObserver();
            this.open = false;
            requestAnimationFrame(() => {
                gradum(this).show(true);
                this.enableTransition(true);
            });
        }
        /**
         * @inheritDoc
         */
        setupUIElements() {
            super.setupUIElements();
            this._panelContainer = div({ classes: "gradum-drawer-panel-container" });
        }
        /**
         * @inheritDoc
         */
        setupUILayout() {
            //Reading `thumb`/`panel` below creates them on first access, and their setters call back into this
            //method. Let the outermost call do the work: it sees the finished elements either way.
            if (this.layingOutUI)
                return;
            this.layingOutUI = true;
            try {
                super.setupUILayout();
                gradum(this).childHandler = this;
                const panelChildren = gradum(this).childrenArray
                    .filter(el => el !== this.panelContainer && el !== this.thumb);
                gradum(this).addChild([this.thumb, this.panelContainer]);
                gradum(this.panel).addChild(panelChildren);
                gradum(this.panelContainer).addChild(this.panel);
                gradum(this.thumb).addChild(this.icon);
                gradum(this).childHandler = this.panel;
            }
            finally {
                this.layingOutUI = false;
            }
        }
        /**
         * @inheritDoc
         */
        setupUIListeners() {
            gradum(this.thumb).on(DefaultEventName.click, (e) => {
                this.open = !this.open;
                return Propagation.stopPropagation;
            }).on(GradumEventName.dragStart, (e) => {
                this.dragging = true;
                this.enableTransition(false);
                return Propagation.stopPropagation;
            }).on(GradumEventName.drag, (e) => {
                if (!this.dragging)
                    return;
                this.translation += this.isVertical ? e.scaledDeltaPosition.y : e.scaledDeltaPosition.x;
                return Propagation.stopPropagation;
            }).on(GradumEventName.dragEnd, (e) => {
                if (!this.dragging)
                    return;
                this.dragging = false;
                const delta = e.positions.first.sub(e.origins.first);
                switch (this.side) {
                    case Side.top:
                        if (this.open && delta.y > 100)
                            this.open = false;
                        else if (!this.open && delta.y < -100)
                            this.open = true;
                        break;
                    case Side.bottom:
                        if (this.open && delta.y < -100)
                            this.open = false;
                        else if (!this.open && delta.y > 100)
                            this.open = true;
                        break;
                    case Side.left:
                        if (this.open && delta.x > 100)
                            this.open = false;
                        else if (!this.open && delta.x < -100)
                            this.open = true;
                        break;
                    case Side.right:
                        if (this.open && delta.x < -100)
                            this.open = false;
                        else if (!this.open && delta.x > 100)
                            this.open = true;
                        break;
                }
                this.enableTransition(true);
                this.refresh();
                return true;
            });
        }
        /**
         * @function getOppositeSide
         * @description Get the side facing the given one — top against bottom, left against right.
         * @param {Side} [side=this.side] - The side to invert. Defaults to the drawer's own side.
         * @returns {Side} The opposite side.
         */
        getOppositeSide(side = this.side) {
            switch (side) {
                case Side.top:
                    return Side.bottom;
                case Side.bottom:
                    return Side.top;
                case Side.left:
                    return Side.right;
                case Side.right:
                    return Side.left;
            }
        }
        /**
         * @function getAdjacentSide
         * @description Get the side a quarter-turn from the given one, used to rotate the thumb's icon.
         * @param {Side} [side=this.side] - The side to rotate from. Defaults to the drawer's own side.
         * @returns {Side} The adjacent side.
         */
        getAdjacentSide(side = this.side) {
            switch (side) {
                case Side.top:
                    return Side.right;
                case Side.bottom:
                    return Side.left;
                case Side.left:
                    return Side.top;
                case Side.right:
                    return Side.bottom;
            }
        }
        /**
         * @function refresh
         * @description Re-measure the panel and move the drawer to the position its current state calls for.
         * Call it after changing the panel's contents outside the drawer's own observers.
         */
        refresh() {
            if (this.hideOverflow)
                gradum(this.panel).setStyle("position", "absolute", true);
            if (this.icon instanceof GradumIconSwitch)
                this.icon.switchReifect.apply(this.open ? this.getOppositeSide() : this.side);
            requestAnimationFrame(() => {
                this.translation = (this.open ? this.offset.open : this.offset.closed)
                    + (this.open ? (this.isVertical ? this.panel.offsetHeight : this.panel.offsetWidth) : 0);
                if (this.hideOverflow)
                    gradum(this.panel).setStyle("position", "relative", true);
            });
        }
        /**
         * @function enableTransition
         * @protected
         * @description Turn the drawer's open/close animation on or off, to move it instantly while dragging.
         * @param {boolean} b - Whether the transition is enabled.
         */
        enableTransition(b) {
            this.transition.enabled = b;
            this.transition.apply();
        }
        /**
         * @function setupResizeObserver
         * @protected
         * @description Start following the panel's size while the drawer is open, so the drawer grows and
         * shrinks with its content. Resizes are ignored mid-transition and mid-drag, where the size is already
         * being driven deliberately.
         */
        setupResizeObserver() {
            let mutex = 0;
            let initializationLock = true;
            gradum(this).on("transitionstart", () => mutex++)
                .on("transitionend", () => { mutex--; initializationLock = false; });
            gradum(this.panelContainer).on("transitionstart", () => mutex++)
                .on("transitionend", () => mutex--);
            this.resizeObserver = new ResizeObserver(entries => {
                if (!this.open || this.dragging || mutex > 0 || initializationLock)
                    return;
                const entry = Array.isArray(entries[0].borderBoxSize) ? entries[0].borderBoxSize[0] : entries[0].borderBoxSize;
                const size = entry[this.isVertical ? "blockSize" : "inlineSize"];
                this.translation = (this.open ? this.offset.open : this.offset.closed) + size;
            });
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _transition_extraInitializers);
        }
    };
})();
/**
 * @function drawer
 * @group Components
 * @category Containers
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Create a {@link GradumDrawer}. Shorthand for `GradumDrawer.create(properties)`.
 * @param {GradumDrawerProperties} properties - The drawer's configuration.
 * @returns {GradumDrawer} The created drawer.
 */
function drawer(properties) {
    // if (!properties.tag) properties.tag = "gradum-drawer";
    return GradumDrawer.create(properties);
}
define(GradumDrawer);

/**
 * @group Components
 * @category Containers
 */
var PopupFallbackMode;
(function (PopupFallbackMode) {
    PopupFallbackMode["invert"] = "invert";
    PopupFallbackMode["offset"] = "offset";
    PopupFallbackMode["none"] = "none";
})(PopupFallbackMode || (PopupFallbackMode = {}));

var css_248z$1 = "#gradum-popup-parent-element{display:block;left:0;position:fixed;top:0;z-index:1000}.gradum-popup{display:block;inset:auto;overflow:auto;position:fixed}";
styleInject(css_248z$1);

/**
 * @group Components
 * @category Containers
 */
let GradumPopup = (() => {
    let _classSuper = GradumElement;
    let _instanceExtraInitializers = [];
    let _static_parentElement_decorators;
    let _static_parentElement_initializers = [];
    let _static_parentElement_extraInitializers = [];
    let _anchor_decorators;
    let _anchor_initializers = [];
    let _anchor_extraInitializers = [];
    let _set_popupPosition_decorators;
    let _set_anchorPosition_decorators;
    let _set_viewportMargin_decorators;
    let _set_offsetFromAnchor_decorators;
    let _set_fallbackModes_decorators;
    let _get_rect_decorators;
    let _get_anchorRect_decorators;
    let _get_computedStyle_decorators;
    let _get_anchorComputedStyle_decorators;
    let _get_computedMargins_decorators;
    let _recomputePosition_decorators;
    return class GradumPopup extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _static_parentElement_decorators = [auto({ defaultValue: div({ parent: document.body, id: "gradum-popup-parent-element" }) })];
            _anchor_decorators = [signal];
            _set_popupPosition_decorators = [auto({ preprocessValue: (value) => new Point(value).bound(0, 100) })];
            _set_anchorPosition_decorators = [auto({ preprocessValue: (value) => new Point(value).bound(0, 100) })];
            _set_viewportMargin_decorators = [auto({ preprocessValue: (value) => new Point(value) })];
            _set_offsetFromAnchor_decorators = [auto({ preprocessValue: (value) => new Point(value) })];
            _set_fallbackModes_decorators = [auto({ preprocessValue: (value) => typeof value !== "object" ? { x: value, y: value } : value })];
            _get_rect_decorators = [cache({ clearOnNextFrame: true })];
            _get_anchorRect_decorators = [cache({ clearOnNextFrame: true })];
            _get_computedStyle_decorators = [cache({ clearOnNextFrame: true })];
            _get_anchorComputedStyle_decorators = [cache({ clearOnNextFrame: true })];
            _get_computedMargins_decorators = [cache({ clearOnNextFrame: true })];
            _recomputePosition_decorators = [effect];
            __esDecorate(this, null, _set_popupPosition_decorators, { kind: "setter", name: "popupPosition", static: false, private: false, access: { has: obj => "popupPosition" in obj, set: (obj, value) => { obj.popupPosition = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_anchorPosition_decorators, { kind: "setter", name: "anchorPosition", static: false, private: false, access: { has: obj => "anchorPosition" in obj, set: (obj, value) => { obj.anchorPosition = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_viewportMargin_decorators, { kind: "setter", name: "viewportMargin", static: false, private: false, access: { has: obj => "viewportMargin" in obj, set: (obj, value) => { obj.viewportMargin = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_offsetFromAnchor_decorators, { kind: "setter", name: "offsetFromAnchor", static: false, private: false, access: { has: obj => "offsetFromAnchor" in obj, set: (obj, value) => { obj.offsetFromAnchor = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_fallbackModes_decorators, { kind: "setter", name: "fallbackModes", static: false, private: false, access: { has: obj => "fallbackModes" in obj, set: (obj, value) => { obj.fallbackModes = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_rect_decorators, { kind: "getter", name: "rect", static: false, private: false, access: { has: obj => "rect" in obj, get: obj => obj.rect }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_anchorRect_decorators, { kind: "getter", name: "anchorRect", static: false, private: false, access: { has: obj => "anchorRect" in obj, get: obj => obj.anchorRect }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_computedStyle_decorators, { kind: "getter", name: "computedStyle", static: false, private: false, access: { has: obj => "computedStyle" in obj, get: obj => obj.computedStyle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_anchorComputedStyle_decorators, { kind: "getter", name: "anchorComputedStyle", static: false, private: false, access: { has: obj => "anchorComputedStyle" in obj, get: obj => obj.anchorComputedStyle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_computedMargins_decorators, { kind: "getter", name: "computedMargins", static: false, private: false, access: { has: obj => "computedMargins" in obj, get: obj => obj.computedMargins }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _recomputePosition_decorators, { kind: "method", name: "recomputePosition", static: false, private: false, access: { has: obj => "recomputePosition" in obj, get: obj => obj.recomputePosition }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _static_parentElement_decorators, { kind: "field", name: "parentElement", static: true, private: false, access: { has: obj => "parentElement" in obj, get: obj => obj.parentElement, set: (obj, value) => { obj.parentElement = value; } }, metadata: _metadata }, _static_parentElement_initializers, _static_parentElement_extraInitializers);
            __esDecorate(null, null, _anchor_decorators, { kind: "field", name: "anchor", static: false, private: false, access: { has: obj => "anchor" in obj, get: obj => obj.anchor, set: (obj, value) => { obj.anchor = value; } }, metadata: _metadata }, _anchor_initializers, _anchor_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @static
         * @description Default properties assigned to a new popup: anchored below its target, kept 4px inside
         * the viewport, and falling back by offsetting horizontally or flipping vertically when it would
         * overflow.
         */
        static defaultProperties = {
            popupPosition: { x: 0, y: -100 },
            anchorPosition: { x: 0, y: 100 },
            viewportMargin: 4,
            offsetFromAnchor: { x: 0, y: 4 },
            fallbackModes: { x: PopupFallbackMode.offset, y: PopupFallbackMode.invert }
        };
        /**
         * @static
         * @protected
         * @description The shared container every popup is moved into, appended to the document body on first
         * use. Reparenting popups here keeps them clear of any ancestor that clips or transforms them.
         */
        static parentElement = __runInitializers(this, _static_parentElement_initializers, void 0);
        /**
         * @description The element this popup positions itself against. Defaults to the document body.
         */
        anchor = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _anchor_initializers, document.body));
        /**
         * @description Which point of the popup is pinned to the anchor, in percentages of its own size —
         * `{x: 0, y: 0}` is its top-left, `{x: 100, y: 100}` its bottom-right. Values are clamped to `0`–`100`.
         */
        set popupPosition(value) { }
        get popupPosition() { return; }
        /**
         * @description Which point of the anchor the popup is pinned to, in percentages of the anchor's size.
         * Values are clamped to `0`–`100`.
         */
        set anchorPosition(value) { }
        get anchorPosition() { return; }
        /**
         * @description The minimum gap in pixels kept between the popup and the viewport edges. Assign a
         * single number to use it for both axes.
         */
        set viewportMargin(value) { }
        get viewportMargin() { return; }
        /**
         * @description Extra pixel offset applied after the popup is aligned to its anchor. Assign a single
         * number to use it for both axes.
         */
        set offsetFromAnchor(value) { }
        get offsetFromAnchor() { return; }
        /**
         * @description What to do per axis when the popup would overflow the viewport — shift it back into
         * view, or flip it to the anchor's other side. Assign a single mode to use it for both axes.
         */
        set fallbackModes(value) { }
        get fallbackModes() { return; }
        get rect() {
            return this.getBoundingClientRect();
        }
        get anchorRect() {
            return this.anchor.getBoundingClientRect();
        }
        get computedStyle() {
            return window.getComputedStyle(this);
        }
        get anchorComputedStyle() {
            return window.getComputedStyle(this.anchor);
        }
        get computedMargins() {
            return {
                x: parseFloat(this.computedStyle.marginLeft) + parseFloat(this.computedStyle.marginRight),
                y: parseFloat(this.computedStyle.marginTop) + parseFloat(this.computedStyle.marginBottom)
            };
        }
        /**
         * @function initialize
         * @description Set the popup up hidden, and move it into the shared popup container so no ancestor can
         * clip or transform it.
         */
        initialize() {
            super.initialize();
            this.show(false);
            if (!this.parentElement)
                gradum(this).addToParent(GradumPopup.parentElement);
        }
        /**
         * @inheritDoc
         */
        setupUIListeners() {
            super.setupUIListeners();
            document.addEventListener(DefaultEventName.scroll, () => this.show(false), { capture: true, passive: true });
            window.addEventListener(DefaultEventName.resize, () => { if (gradum(this).isShown)
                this.recomputePosition(); }, { passive: true });
            gradum(document.body).on(DefaultEventName.click, e => {
                if (!gradum(this).isShown)
                    return;
                const t = e.target;
                if (this.contains(t))
                    return;
                if (this.anchor instanceof Node && this.anchor.contains(t))
                    return;
                this.show(false);
            }, { capture: true });
        }
        recomputePosition() {
            if (!this.anchor)
                return;
            gradum(this).setStyles({ maxHeight: "", maxWidth: "" }, true);
            const left = this.computeAxis(Direction.horizontal);
            const top = this.computeAxis(Direction.vertical);
            gradum(this).setStyles({ left: `${left}px`, top: `${top}px` });
            const maxWidth = Math.max(0, Math.min(window.innerWidth - 2 * this.viewportMargin.x, window.innerWidth - 2 * this.viewportMargin.x - this.computedMargins.x));
            const maxHeight = Math.max(0, Math.min(window.innerHeight - 2 * this.viewportMargin.y, window.innerHeight - 2 * this.viewportMargin.y - this.computedMargins.y));
            gradum(this).setStyle("maxWidth", `${maxWidth}px`);
            gradum(this).setStyle("maxHeight", `${maxHeight}px`);
        }
        computeAxis(direction) {
            const axis = direction === Direction.horizontal ? "x" : "y";
            const sizeAxis = direction === Direction.horizontal ? "width" : "height";
            const viewportSize = direction === Direction.horizontal ? window.innerWidth : window.innerHeight;
            const parentStart = this.anchorRect[direction === Direction.horizontal ? "left" : "top"];
            const popupSize = this.rect[sizeAxis] + this.computedMargins[axis];
            const min = this.viewportMargin[axis];
            const max = viewportSize - this.viewportMargin[axis] - popupSize;
            const base = parentStart + (this.anchorRect[sizeAxis] * this.anchorPosition[axis] / 100)
                - (popupSize * this.popupPosition[axis] / 100) + this.offsetFromAnchor[axis];
            const fitsBase = base >= min && base <= max;
            if (fitsBase || this.fallbackModes[axis] === PopupFallbackMode.offset) {
                return Math.min(Math.max(base, min), max);
            }
            const flipped = parentStart + this.anchorRect[sizeAxis] * (1 - this.anchorPosition[axis] / 100)
                - popupSize * (1 - this.popupPosition[axis] / 100) - this.offsetFromAnchor[axis];
            const fitsFlip = flipped >= min && flipped <= max;
            let finalOffset;
            if (fitsFlip)
                finalOffset = flipped;
            else if (fitsBase)
                finalOffset = base;
            else {
                const pick = Math.abs(base - Math.min(Math.max(base, min), max)) <=
                    Math.abs(flipped - Math.min(Math.max(flipped, min), max)) ? base : flipped;
                finalOffset = Math.min(Math.max(pick, min), max);
            }
            return finalOffset;
        }
        /**
         * @function show
         * @description Show or hide the popup. Showing it repositions it against its anchor first, while it is
         * still invisible, so it never appears at a stale position.
         * @param {boolean} b - Whether to show the popup.
         * @returns {this} Itself, allowing for method chaining.
         */
        show(b) {
            if (b) {
                this.style.visibility = "hidden";
                this.style.display = "";
                this.recomputePosition();
                this.style.visibility = "";
                gradum(this).show(true);
            }
            else {
                gradum(this).setStyles({ maxHeight: "", maxWidth: "" }, true).show(false);
            }
            return this;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _anchor_extraInitializers);
        }
        static {
            __runInitializers(this, _static_parentElement_extraInitializers);
        }
    };
})();
define(GradumPopup);

/**
 * @class AnchorPoint
 * @group Components
 * @category Data Structures
 *
 * @description A position within a box, expressed either as one of the nine named {@link Anchor} values
 * or as a free {@link Point} in percentages from `-100` to `100`. The two forms are interchangeable —
 * assign whichever is convenient and read back whichever you need.
 */
let AnchorPoint = (() => {
    let _instanceExtraInitializers = [];
    let _set_value_decorators;
    return class AnchorPoint {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _set_value_decorators = [auto({
                    preprocessValue: function (value) {
                        if (typeof value === "object" && value instanceof Point)
                            return value;
                        if (Object.values(Anchor).includes(value))
                            return AnchorPoint.enumToPoint(value);
                        return this._value;
                    }
                })];
            __esDecorate(this, null, _set_value_decorators, { kind: "setter", name: "value", static: false, private: false, access: { has: obj => "value" in obj, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @constructor
         * @description Create an anchor point.
         * @param {Point | Anchor} [anchor] - The starting position, as a named anchor or a point.
         */
        constructor(anchor) {
            __runInitializers(this, _instanceExtraInitializers);
            this.value = anchor;
        }
        /**
         * @description The anchor's position as a point. Assigning a named {@link Anchor} converts it; assigning
         * anything unrecognized leaves the current value untouched.
         */
        set value(value) { }
        get value() { return; }
        /**
         * @readonly
         * @description The named {@link Anchor} nearest this position, snapping each axis to its closest edge
         * or centre.
         */
        get enum() {
            return AnchorPoint.pointToEnum(this.value);
        }
        /**
         * @function pointToEnum
         * @static
         * @description Snap a point to the nearest named anchor. Each axis rounds to the closest of its two
         * edges or its centre.
         * @param {Point} value - The point to convert.
         * @returns {Anchor} The nearest named anchor. Defaults to `Anchor.Center` for a missing point.
         */
        static pointToEnum(value) {
            if (!value)
                return Anchor.Center;
            const snapAxis = (n) => n < -50 ? -100 : n > 50 ? 100 : 0;
            const x = snapAxis(value.x);
            const y = snapAxis(value.y);
            if (y === -100) {
                if (x === -100)
                    return Anchor.TopLeft;
                if (x === 0)
                    return Anchor.TopMiddle;
                return Anchor.TopRight;
            }
            if (y === 0) {
                if (x === -100)
                    return Anchor.CenterLeft;
                if (x === 0)
                    return Anchor.Center;
                return Anchor.CenterRight;
            }
            if (x === -100)
                return Anchor.BottomLeft;
            if (x === 0)
                return Anchor.BottomMiddle;
            return Anchor.BottomRight;
        }
        /**
         * @function enumToPoint
         * @static
         * @description Convert a named anchor to its point, in percentages from `-100` to `100`.
         * @param {Anchor} value - The anchor to convert.
         * @returns {Point} The corresponding point. Returns the origin for a missing anchor.
         */
        static enumToPoint(value) {
            if (!value)
                return new Point();
            switch (value) {
                case Anchor.TopLeft:
                    return new Point(-100, -100);
                case Anchor.TopMiddle:
                    return new Point(0, -100);
                case Anchor.TopRight:
                    return new Point(100, -100);
                case Anchor.CenterLeft:
                    return new Point(-100, 0);
                case Anchor.Center:
                    return new Point(0, 0);
                case Anchor.CenterRight:
                    return new Point(100, 0);
                case Anchor.BottomLeft:
                    return new Point(-100, 100);
                case Anchor.BottomMiddle:
                    return new Point(0, 100);
                case Anchor.BottomRight:
                    return new Point(100, 100);
            }
        }
    };
})();

/**
 * @function closestPointOnSegment
 * @group Utilities
 * @category Geometry
 *
 * @description Find the point of a line segment nearest to a given point. The result is clamped to the
 * segment, so it never lands on the infinite line beyond the endpoints.
 * @param {Point} p - The point to measure from.
 * @param {Point} a - Start of the segment.
 * @param {Point} b - End of the segment.
 * @returns {Point} A new point on the segment; the arguments are left unchanged. A zero-length segment
 * returns `a` itself.
 */
function closestPointOnSegment(p, a, b) {
    const ab = b.sub(a);
    const ap = p.sub(a);
    const abLen2 = ab.x * ab.x + ab.y * ab.y;
    if (abLen2 <= 1e-12)
        return a;
    let t = (ap.x * ab.x + ap.y * ab.y) / abLen2;
    t = Math.max(0, Math.min(1, t));
    return new Point(a.x + ab.x * t, a.y + ab.y * t);
}
/**
 * @function intersectSegments
 * @group Utilities
 * @category Geometry
 *
 * @description Find where two line segments cross, if they do. Only a crossing within both segments counts;
 * an intersection that would fall beyond either one is not reported.
 * @param {Point} a - Start of the first segment.
 * @param {Point} b - End of the first segment.
 * @param {Point} c - Start of the second segment.
 * @param {Point} d - End of the second segment.
 * @returns {Point} A new point at the crossing, or `null` if the segments do not cross. Parallel segments
 * always return `null`, including collinear ones that overlap.
 */
function intersectSegments(a, b, c, d) {
    const r = b.sub(a);
    const s = d.sub(c);
    const rxs = r.x * s.y - r.y * s.x;
    if (Math.abs(rxs) < 1e-12)
        return null; // parallel (ignore collinear)
    const q_p = c.sub(a);
    const t = (q_p.x * s.y - q_p.y * s.x) / rxs;
    const u = (q_p.x * r.y - q_p.y * r.x) / rxs;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1)
        return new Point(a.x + t * r.x, a.y + t * r.y);
    return null;
}

/**
 * @function isPointInConvexPolygon
 * @group Utilities
 * @category Geometry
 *
 * @description Check whether a point lies inside a convex polygon, borders included.
 * *Note: the polygon must be convex; a concave one gives wrong answers.*
 * @param {Point} p - The point to test.
 * @param {Point[]} poly - The polygon's vertices, in order around its outline.
 * @returns {boolean} `true` if the point is inside or on the border.
 */
function isPointInConvexPolygon(p, poly) {
    let sign = 0;
    for (let i = 0; i < poly.length; i++) {
        const a = poly[i];
        const b = poly[(i + 1) % poly.length];
        const ab = b.sub(a);
        const ap = p.sub(a);
        const z = ab.x * ap.y - ab.y * ap.x;
        if (Math.abs(z) < 1e-12)
            continue;
        const s = z > 0 ? 1 : -1;
        if (sign === 0)
            sign = s;
        else if (sign !== s)
            return false;
    }
    return true;
}
/**
 * @function segmentIntersectsPolygon
 * @group Utilities
 * @category Geometry
 *
 * @description Find where a line segment first meets a polygon. A segment lying wholly inside the polygon
 * crosses no edge, so one of its endpoints is returned instead — meaning a non-null result means "touches",
 * not strictly "crosses an edge".
 * @param {Point} a - Start of the segment.
 * @param {Point} b - End of the segment.
 * @param {Point[]} poly - The polygon's vertices, in order around its outline.
 * @returns {Point | null} The meeting point, or `null` if the segment misses the polygon entirely.
 */
function segmentIntersectsPolygon(a, b, poly) {
    for (let i = 0; i < poly.length; i++) {
        const c = poly[i];
        const d = poly[(i + 1) % poly.length];
        const hit = intersectSegments(a, b, c, d);
        if (hit)
            return hit;
    }
    if (isPointInConvexPolygon(a, poly))
        return a;
    if (isPointInConvexPolygon(b, poly))
        return b;
    return null;
}
/**
 * @function projectPolygonOntoAxis
 * @group Utilities
 * @category Geometry
 *
 * @description Flatten a polygon onto an axis and return the span it covers there. This is the building block
 * of the separating-axis test in {@link hasSeparatingAxisForPolygons}.
 * @param {Point[]} points - The polygon's vertices.
 * @param {Point} axis - The axis to project onto. Need not be normalized.
 * @returns {[number, number]} The minimum and maximum positions along the axis.
 */
function projectPolygonOntoAxis(points, axis) {
    const len = Math.hypot(axis.x, axis.y) || 1;
    const ux = axis.x / len, uy = axis.y / len;
    let min = Infinity, max = -Infinity;
    for (const p of points) {
        const v = p.x * ux + p.y * uy;
        if (v < min)
            min = v;
        if (v > max)
            max = v;
    }
    return [min, max];
}
/**
 * @function hasSeparatingAxisForPolygons
 * @group Utilities
 * @category Geometry
 *
 * @description Check whether any edge of the first polygon yields an axis that separates the two, proving
 * they cannot overlap. This is one half of the test — it must be run both ways round, which is what
 * {@link polygonsIntersect} does.
 * @param {Point[]} polyA - The polygon whose edges supply the candidate axes.
 * @param {Point[]} polyB - The polygon to test against.
 * @returns {boolean} `true` if a separating axis exists, meaning the polygons are apart.
 */
function hasSeparatingAxisForPolygons(polyA, polyB) {
    for (let i = 0; i < polyA.length; i++) {
        const p1 = polyA[i];
        const p2 = polyA[(i + 1) % polyA.length];
        const edge = p2.sub(p1);
        const axis = new Point(-edge.y, edge.x);
        const [aMin, aMax] = projectPolygonOntoAxis(polyA, axis);
        const [bMin, bMax] = projectPolygonOntoAxis(polyB, axis);
        if (aMax < bMin || bMax < aMin)
            return true;
    }
    return false;
}
/**
 * @function polygonsIntersect
 * @group Utilities
 * @category Geometry
 *
 * @description Check whether two convex polygons overlap, using the separating-axis test in both directions.
 * *Note: both polygons must be convex.*
 * @param {Point[]} a - The first polygon's vertices.
 * @param {Point[]} b - The second polygon's vertices.
 * @returns {boolean} `true` if the polygons overlap.
 */
function polygonsIntersect(a, b) {
    return !hasSeparatingAxisForPolygons(a, b) && !hasSeparatingAxisForPolygons(b, a);
}

/**
 * @function aabbCorners
 * @group Utilities
 * @category Geometry
 *
 * @description List the four corners of an axis-aligned rectangle, in clockwise order starting top-left.
 * Use it to feed a `DOMRect` into the polygon helpers, which expect point lists.
 * @param {DOMRect} r - The rectangle to read.
 * @returns {[Point, Point, Point, Point]} The corners: top-left, top-right, bottom-right, bottom-left.
 */
function aabbCorners(r) {
    const x0 = r.x, y0 = r.y;
    const x1 = r.x + r.width, y1 = r.y + r.height;
    return [new Point(x0, y0), new Point(x1, y0), new Point(x1, y1), new Point(x0, y1)];
}
/**
 * @function closestPointOnAabb
 * @group Utilities
 * @category Geometry
 *
 * @description Find the point of an axis-aligned rectangle nearest to a given point. A point already inside
 * the rectangle is returned unchanged, so the result is the point itself rather than a point on the border —
 * use {@link closestPointOnEdge} when you always want a point on the outline.
 * @param {Point} p - The point to measure from.
 * @param {DOMRect} r - The rectangle to measure against.
 * @returns {Point} A new point; neither argument is modified.
 */
function closestPointOnAabb(p, r) {
    const x0 = r.x, y0 = r.y;
    const x1 = r.x + r.width, y1 = r.y + r.height;
    const x = Math.max(x0, Math.min(x1, p.x));
    const y = Math.max(y0, Math.min(y1, p.y));
    return new Point(x, y);
}

/**
 * @function css
 * @group Utilities
 * @category CSS
 *
 * @description Tagged template that joins a CSS template literal into one string. It exists mainly so editors
 * syntax-highlight and format the rules inside the literal; the interpolated values are inserted as-is.
 * @param {TemplateStringsArray} strings - The literal's static parts, supplied by the tagged template.
 * @param {...any[]} values - The interpolated values, supplied by the tagged template.
 * @returns {string} The assembled CSS.
 *
 * @example
 * ```ts
 * const styles = css`
 *    .my-class { color: ${color}; }
 * `;
 * ```
 */
function css(strings, ...values) {
    let str = "";
    strings.forEach((string, i) => {
        str += string + (values[i] || '');
    });
    return str;
}

/**
 * @class GradumRect
 * @group Components
 * @category Data Structures
 *
 * @extends DOMRect
 * @description A rectangle that can be rotated, unlike the axis-aligned
 * [DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) it extends. Its geometry helpers
 * ({@link GradumRect.closestPoint}, {@link GradumRect.distanceTo}, {@link GradumRect.overlaps}) all
 * account for the rotation, and accept a point, a segment, or another rect.
 */
class GradumRect extends DOMRect {
    /**
     * @description The rectangle's rotation in radians, about its centre.
     */
    angleRad = 0;
    /**
     * @description The anchor the rectangle is positioned from.
     */
    anchor;
    /**
     * @constructor
     * @description Create a rectangle. Give either `angleRad` or `angleDeg` to rotate it; omitting both
     * leaves it axis-aligned.
     * @param {GradumRectProperties} [properties={}] - The rectangle's position, size, rotation, and anchor.
     */
    constructor(properties = {}) {
        super(properties.x ?? 0, properties.y ?? 0, properties.width ?? 0, properties.height ?? 0);
        if (properties.angleRad !== undefined)
            this.angleRad = properties.angleRad;
        else if (properties.angleDeg !== undefined)
            this.angleDeg = properties.angleDeg;
        this.anchor = properties.anchor instanceof AnchorPoint ? properties.anchor : new AnchorPoint(properties.anchor);
    }
    /**
     * @function fromSegment
     * @static
     * @description Build a rectangle covering the segment between two points: centred on the segment,
     * as long as it, and rotated to match its direction.
     * @param {Point} a - The segment's start.
     * @param {Point} b - The segment's end.
     * @param {number} [thickness=1] - The rectangle's height, across the segment.
     * @param {GradumRectProperties} [properties={}] - Extra properties. The computed rotation wins over
     * any angle given here.
     * @returns {GradumRect} The rectangle covering the segment.
     */
    static fromSegment(a, b, thickness = 1, properties = {}) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const length = Math.hypot(dx, dy);
        const angleRad = Math.atan2(dy, dx);
        const mid = new Point((a.x + b.x) / 2, (a.y + b.y) / 2);
        const x = mid.x - length / 2;
        const y = mid.y - thickness / 2;
        return new GradumRect({ x, y, width: length, height: thickness, ...properties, angleRad });
    }
    /**
     * @function fromDOMRect
     * @static
     * @description Build a rectangle from a plain `DOMRect`, such as one returned by
     * `getBoundingClientRect()`.
     * @param {DOMRect} rect - The rect to copy position and size from.
     * @param {GradumRectProperties} [properties={}] - Extra properties, such as a rotation to apply.
     * @returns {GradumRect} The converted rectangle.
     */
    static fromDOMRect(rect, properties = {}) {
        return new GradumRect({ x: rect.x, y: rect.y, width: rect.width, height: rect.height, ...properties });
    }
    /**
     * @function render
     * @description Create a translucent red `div` matching this rectangle's position, size, and rotation.
     * Meant for debugging geometry — append the result to the document to see where the rect actually is.
     * @returns {HTMLElement} The generated element. It is not attached to the document.
     */
    render() {
        return element({ tag: "div", style: css `position: absolute; 
                width: ${this.width}px; height: ${this.height}px; 
                top: ${this.y}px; left: ${this.x}px; background-color: red; pointer-events: none; opacity: 0.4;
                transform: rotate(${this.angleRad}rad)` });
    }
    /**
     * @description The rectangle's rotation in degrees. Reads and writes the same rotation as
     * {@link GradumRect.angleRad}, converted.
     */
    get angleDeg() {
        return (this.angleRad * 180) / Math.PI;
    }
    set angleDeg(value) {
        this.angleRad = (value * Math.PI) / 180;
    }
    /**
     * @readonly
     * @description The rectangle's centre point.
     */
    get center() {
        return new Point(this.x + this.width / 2, this.y + this.height / 2);
    }
    /**
     * @readonly
     * @description The unit vector along the rectangle's own x axis, pointing along its width once rotated.
     */
    get xAxis() {
        return new Point(Math.cos(this.angleRad), Math.sin(this.angleRad));
    }
    /**
     * @readonly
     * @description The unit vector along the rectangle's own y axis, pointing along its height once rotated.
     */
    get yAxis() {
        return new Point(-Math.sin(this.angleRad), Math.cos(this.angleRad));
    }
    /**
     * @readonly
     * @description Half the rectangle's width and height, as a point.
     */
    get half() {
        return new Point(this.width / 2, this.height / 2);
    }
    /**
     * @readonly
     * @description The rectangle's four corners in screen coordinates, clockwise from the top-left,
     * with the rotation applied.
     */
    get points() {
        const c = this.center;
        const ux = this.xAxis;
        const uy = this.yAxis;
        const half = this.half;
        const ex = new Point(ux.x * half.x, ux.y * half.x);
        const ey = new Point(uy.x * half.y, uy.y * half.y);
        return [c.sub(ex).sub(ey), c.add(ex).sub(ey), c.add(ex).add(ey), c.sub(ex).add(ey)];
    }
    closestPoint(...args) {
        // (1) Point -> Closest point ON THIS rect to that point
        if (args.length === 1 && args[0] instanceof Point) {
            const point = args[0];
            const c = this.center;
            const ux = this.xAxis;
            const uy = this.yAxis;
            const d = point.sub(c);
            const lx = d.x * ux.x + d.y * ux.y;
            const ly = d.x * uy.x + d.y * uy.y;
            const cx = trim(lx, this.width / 2, -this.width / 2);
            const cy = trim(ly, this.height / 2, -this.height / 2);
            return c.add(new Point(ux.x * cx, ux.y * cx)).add(new Point(uy.x * cy, uy.y * cy));
        }
        // (2) Segment AB -> Closest point ON THIS rect to segment AB
        if (args.length === 2 && args[0] instanceof Point && args[1] instanceof Point) {
            const a = args[0];
            const b = args[1];
            const thisPoly = this.points;
            // If segment intersects this rect, distance is 0.
            const hit = segmentIntersectsPolygon(a, b, thisPoly);
            if (hit)
                return hit;
            // Candidates on THIS rect:
            // - closest points to endpoints
            // - corners of this rect
            let best = this.closestPoint(a);
            let bestDist = Point.dist(best, a);
            const pb = this.closestPoint(b);
            const db = Point.dist(pb, b);
            if (db < bestDist) {
                bestDist = db;
                best = pb;
            }
            for (const corner of thisPoly) {
                const q = closestPointOnSegment(corner, a, b);
                const d = Point.dist(corner, q);
                if (d < bestDist) {
                    bestDist = d;
                    best = corner;
                }
            }
            return best;
        }
        // (3) Rect (AABB DOMRect or GradumRect)
        if (args.length === 1 && (args[0] instanceof DOMRect || args[0] instanceof GradumRect)) {
            const other = args[0];
            const thisPoly = this.points;
            const otherPoly = other instanceof GradumRect ? other.points : aabbCorners(other);
            // If intersects, any point with distance 0 is fine
            if (polygonsIntersect(thisPoly, otherPoly)) {
                const oc = other instanceof GradumRect ? other.center
                    : new Point(other.x + other.width / 2, other.y + other.height / 2);
                return this.closestPoint(oc);
            }
            // Otherwise pick the point ON THIS rect that minimizes distance to the other shape
            let best = thisPoly[0];
            let bestDist = Infinity;
            // distance from a point p to the other rect
            const distToOther = (p) => {
                const q = other instanceof GradumRect ? other.closestPoint(p) : closestPointOnAabb(p, other);
                return Point.dist(p, q);
            };
            // 1) corners of THIS rect
            for (const p of thisPoly) {
                const d = distToOther(p);
                if (d < bestDist) {
                    bestDist = d;
                    best = p;
                }
            }
            // 2) closest points on THIS rect to corners of OTHER rect
            for (const p of otherPoly) {
                const q = this.closestPoint(p); // ON THIS rect
                const d = distToOther(q);
                if (d < bestDist) {
                    bestDist = d;
                    best = q;
                }
            }
            return best;
        }
        return;
    }
    distanceTo(...args) {
        // Point
        if (args.length === 1 && args[0] instanceof Point) {
            const p = args[0];
            const q = this.closestPoint(p);
            return Point.dist(p, q);
        }
        // Segment AB
        if (args.length === 2 && args[0] instanceof Point && args[1] instanceof Point) {
            const a = args[0];
            const b = args[1];
            const pr = this.closestPoint(a, b);
            const ps = closestPointOnSegment(pr, a, b);
            return Point.dist(pr, ps);
        }
        // Rect
        if (args.length === 1 && (args[0] instanceof DOMRect || args[0] instanceof GradumRect)) {
            const other = args[0];
            const pr = this.closestPoint(other);
            const po = other instanceof GradumRect ? other.closestPoint(pr) : closestPointOnAabb(pr, other);
            return Point.dist(pr, po);
        }
        return NaN;
    }
    overlaps(...args) {
        // (1) Point
        if (args.length === 1 && args[0] instanceof Point) {
            const p = args[0];
            const q = this.closestPoint(p);
            return Point.dist(p, q) <= 1e-6;
        }
        // (2) Segment AB
        if (args.length === 2 && args[0] instanceof Point && args[1] instanceof Point) {
            const a = args[0];
            const b = args[1];
            return segmentIntersectsPolygon(a, b, this.points) !== null;
        }
        // (3) Rect (DOMRect or GradumRect)
        if (args.length === 1 && (args[0] instanceof GradumRect || args[0] instanceof DOMRect)) {
            const other = args[0];
            const polyA = this.points;
            const polyB = other instanceof GradumRect ? other.points : aabbCorners(other);
            return polygonsIntersect(polyA, polyB);
        }
        return false;
    }
}

var css_248z = "gradum-dropdown{display:inline-block;position:relative}gradum-dropdown>.gradum-popup{background-color:#fff;border:.1em solid #5e5e5e;border-radius:.4em;display:flex;flex-direction:column;overflow:hidden}gradum-dropdown>.gradum-popup>gradum-select-entry{padding:.5em}gradum-dropdown>.gradum-popup>gradum-select-entry:not(:last-child){border-bottom:.1em solid #bdbdbd}gradum-dropdown>gradum-select-entry{padding:.5em .7em;width:100%}gradum-dropdown>gradum-select-entry:hover{background-color:#d7d7d7}gradum-dropdown>gradum-select-entry:not(:last-child){border-bottom:.1em solid #bdbdbd}";
styleInject(css_248z);

/**
 * @class GradumDropdown
 * @group Components
 * @category Menus
 *
 * @extends GradumElement
 * @description Dropdown class for creating Gradum button elements.
 */
let GradumDropdown = (() => {
    let _classSuper = GradumSelectElement;
    let _instanceExtraInitializers = [];
    let _selectorClasses_decorators;
    let _selectorClasses_initializers = [];
    let _selectorClasses_extraInitializers = [];
    let _popupClasses_decorators;
    let _popupClasses_initializers = [];
    let _popupClasses_extraInitializers = [];
    let _set_selector_decorators;
    let _set_popup_decorators;
    return class GradumDropdown extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _selectorClasses_decorators = [auto({
                    callBefore: function () { gradum(this.selector).removeClass(this.selectorClasses); },
                    callAfter: function () { gradum(this.selector).addClass(this.selectorClasses); }
                })];
            _popupClasses_decorators = [auto({
                    callBefore: function () { gradum(this.popup).removeClass(this.popupClasses); },
                    callAfter: function () { gradum(this.popup).addClass(this.popupClasses); }
                })];
            _set_selector_decorators = [auto({
                    setIfUndefined: true,
                    preprocessValue: function (value) {
                        if (value instanceof HTMLElement)
                            return value;
                        const text = typeof value === "string" ? value : stringify(this.select.getValue(this.entries[0]));
                        if (this.selector instanceof GradumButton)
                            this.selector.text = text;
                        else
                            return GradumButton.create({ text, elementTag: this.selectorTag });
                    }
                })];
            _set_popup_decorators = [auto({ defaultValueCallback: () => GradumPopup.create() })];
            __esDecorate(this, null, _set_selector_decorators, { kind: "setter", name: "selector", static: false, private: false, access: { has: obj => "selector" in obj, set: (obj, value) => { obj.selector = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_popup_decorators, { kind: "setter", name: "popup", static: false, private: false, access: { has: obj => "popup" in obj, set: (obj, value) => { obj.popup = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _selectorClasses_decorators, { kind: "field", name: "selectorClasses", static: false, private: false, access: { has: obj => "selectorClasses" in obj, get: obj => obj.selectorClasses, set: (obj, value) => { obj.selectorClasses = value; } }, metadata: _metadata }, _selectorClasses_initializers, _selectorClasses_extraInitializers);
            __esDecorate(null, null, _popupClasses_decorators, { kind: "field", name: "popupClasses", static: false, private: false, access: { has: obj => "popupClasses" in obj, get: obj => obj.popupClasses, set: (obj, value) => { obj.popupClasses = value; } }, metadata: _metadata }, _popupClasses_initializers, _popupClasses_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @static
         * @description Default properties assigned to a new dropdown. Its selector is rendered as an `<h4>`.
         */
        static defaultProperties = {
            selectorTag: "h4",
        };
        /**
         * @readonly
         * @description The selection logic backing this dropdown. Clicking an entry closes the popup.
         */
        select = (__runInitializers(this, _instanceExtraInitializers), GradumSelect.create({
            onEntryClicked: () => this.openPopup(false)
        }));
        popupOpen = false;
        /**
         * @description The tag used to build the selector element that shows the current selection.
         */
        selectorTag;
        selectorClasses = __runInitializers(this, _selectorClasses_initializers, void 0);
        popupClasses = (__runInitializers(this, _selectorClasses_extraInitializers), __runInitializers(this, _popupClasses_initializers, void 0));
        /**
         * The dropdown's selector element.
         */
        set selector(value) {
            if (!(value instanceof HTMLElement))
                return;
            gradum(value)
                .addClass(this.selectorClasses)
                .on(DefaultEventName.click, (e) => {
                this.openPopup(!this.popupOpen);
                return Propagation.stopPropagation;
            });
            if (this.popup instanceof GradumPopup)
                this.popup.anchor = value;
            gradum(this).addChild(value);
            if (value instanceof GradumButton)
                this.select.onSelect = () => value.text = this.stringSelectedValue;
        }
        get selector() { return; }
        /**
         * The dropdown's popup element.
         */
        set popup(value) {
            if (value instanceof GradumPopup)
                value.anchor = this.selector;
            gradum(value).addClass(this.popupClasses);
            this.select.parent = value;
        }
        initialize() {
            super.initialize();
            this.selector;
            gradum(document.body).on(DefaultEventName.click, () => e => {
                if (this.popupOpen && !this.contains(e.target))
                    this.openPopup(false);
            }, { capture: true });
        }
        openPopup(b) {
            if (this.popupOpen == b)
                return;
            this.popupOpen = b;
            if ("show" in this.popup && typeof this.popup.show === "function")
                this.popup.show(b);
            else
                gradum(this.popup).show(b);
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _popupClasses_extraInitializers);
        }
    };
})();
define(GradumDropdown);

/**
 * @group Components
 * @category Menus
 */
let GradumMarkingMenu = (() => {
    let _classSuper = GradumElement;
    let _startAngle_decorators;
    let _startAngle_initializers = [];
    let _startAngle_extraInitializers = [];
    let _endAngle_decorators;
    let _endAngle_initializers = [];
    let _endAngle_extraInitializers = [];
    return class GradumMarkingMenu extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _startAngle_decorators = [auto({
                    initialValue: 0,
                    preprocessValue: (value) => value - Math.PI / 2
                })];
            _endAngle_decorators = [auto({
                    initialValue: Math.PI * 2,
                    preprocessValue: (value) => value - Math.PI / 2
                })];
            __esDecorate(null, null, _startAngle_decorators, { kind: "field", name: "startAngle", static: false, private: false, access: { has: obj => "startAngle" in obj, get: obj => obj.startAngle, set: (obj, value) => { obj.startAngle = value; } }, metadata: _metadata }, _startAngle_initializers, _startAngle_extraInitializers);
            __esDecorate(null, null, _endAngle_decorators, { kind: "field", name: "endAngle", static: false, private: false, access: { has: obj => "endAngle" in obj, get: obj => obj.endAngle, set: (obj, value) => { obj.endAngle = value; } }, metadata: _metadata }, _endAngle_initializers, _endAngle_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        transition;
        currentOrigin;
        /**
         * @description How far the pointer must travel, in pixels, before a drag counts as choosing an entry
         * rather than a stray movement.
         */
        minDragDistance = 20;
        /**
         * @description The radius of the ring the entries are arranged on, along its wider axis, in pixels.
         */
        semiMajor = 50;
        /**
         * @description The radius of the ring the entries are arranged on, along its narrower axis, in pixels.
         * Set it differently from the wider radius to lay the entries out on an ellipse.
         */
        semiMinor = 45;
        startAngle = __runInitializers(this, _startAngle_initializers, void 0);
        endAngle = (__runInitializers(this, _startAngle_extraInitializers), __runInitializers(this, _endAngle_initializers, void 0));
        constructor() {
            super(...arguments);
            __runInitializers(this, _endAngle_extraInitializers);
        }
    };
})();
define(GradumMarkingMenu);

/**
 * @function linearInterpolation
 * @group Utilities
 * @category Interpolation
 *
 * @description Map a value from one range onto another, along the straight line through `(x1, y1)` and
 * `(x2, y2)`. Useful for turning a position into a ratio, a ratio into a size, and so on.
 * @param {number} x - The input value to map.
 * @param {number} x1 - Start of the input range.
 * @param {number} x2 - End of the input range.
 * @param {number} y1 - Value returned when `x` equals `x1`.
 * @param {number} y2 - Value returned when `x` equals `x2`.
 * @param {boolean} [strict=true] - Whether to clamp `x` into `[x1, x2]` first. Set it to `false` to allow
 * extrapolation beyond the given range.
 * @returns {number} The interpolated value.
 */
function linearInterpolation(x, x1, x2, y1, y2, strict = true) {
    if (strict) {
        const xMax = Math.max(x1, x2);
        const xMin = Math.min(x1, x2);
        if (x > xMax)
            x = xMax;
        if (x < xMin)
            x = xMin;
    }
    return y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
}

/**
 * @class GradumSelectWheel
 * @group Components
 * @category Menus
 *
 * @extends GradumSelectElement
 * @description A swipeable selection wheel. Entries are always position absolute, fanned out by a
 * continuous pixel offset. Dragging moves all entries in real time; releasing snaps to the nearest.
 * The container sizes to the selected entry. Visual state is driven by `entryTransitionReifect`
 * (CSS transitions) and `computeAndApplyStyling` (per-entry opacity/scale/transform).
 */
let GradumSelectWheel = (() => {
    let _classSuper = GradumSelectElement;
    let _instanceExtraInitializers = [];
    let _opacity_decorators;
    let _opacity_initializers = [];
    let _opacity_extraInitializers = [];
    let _set_size_decorators;
    let _set_entryTransitionReifect_decorators;
    let _set_transitionDuration_decorators;
    let _set_customReifect_decorators;
    let _set_alwaysOpen_decorators;
    let _set_open_decorators;
    return class GradumSelectWheel extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _opacity_decorators = [auto({
                    defaultValue: { max: 1, min: 0 },
                    preprocessValue: (value) => ({
                        max: trim(value?.max ?? 1, 1),
                        min: trim(value?.min ?? 0, 1),
                    }),
                })];
            _set_size_decorators = [auto({
                    defaultValue: { max: 100, min: -100 },
                    preprocessValue: (value) => typeof value === "object" ? value : { max: value ?? 100, min: -(value ?? 100) },
                })];
            _set_entryTransitionReifect_decorators = [auto({
                    preprocessValue: function (value) {
                        if (!value)
                            return;
                        if (value instanceof Reifect)
                            return value;
                        return new Reifect(value);
                    }
                })];
            _set_transitionDuration_decorators = [auto({ override: true })];
            _set_customReifect_decorators = [auto({
                    preprocessValue: function (value) {
                        if (!value)
                            return null;
                        if (value instanceof Reifect)
                            return value;
                        return new Reifect(value);
                    },
                })];
            _set_alwaysOpen_decorators = [auto({ defaultValue: false })];
            _set_open_decorators = [auto()];
            __esDecorate(this, null, _set_size_decorators, { kind: "setter", name: "size", static: false, private: false, access: { has: obj => "size" in obj, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_entryTransitionReifect_decorators, { kind: "setter", name: "entryTransitionReifect", static: false, private: false, access: { has: obj => "entryTransitionReifect" in obj, set: (obj, value) => { obj.entryTransitionReifect = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_transitionDuration_decorators, { kind: "setter", name: "transitionDuration", static: false, private: false, access: { has: obj => "transitionDuration" in obj, set: (obj, value) => { obj.transitionDuration = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_customReifect_decorators, { kind: "setter", name: "customReifect", static: false, private: false, access: { has: obj => "customReifect" in obj, set: (obj, value) => { obj.customReifect = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_alwaysOpen_decorators, { kind: "setter", name: "alwaysOpen", static: false, private: false, access: { has: obj => "alwaysOpen" in obj, set: (obj, value) => { obj.alwaysOpen = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_open_decorators, { kind: "setter", name: "open", static: false, private: false, access: { has: obj => "open" in obj, set: (obj, value) => { obj.open = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _opacity_decorators, { kind: "field", name: "opacity", static: false, private: false, access: { has: obj => "opacity" in obj, get: obj => obj.opacity, set: (obj, value) => { obj.opacity = value; } }, metadata: _metadata }, _opacity_initializers, _opacity_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @static
         * @description Default properties assigned to a new wheel. Entries animate over 0.3 seconds.
         */
        static defaultProperties = { transitionDuration: 0.3 };
        _currentPosition = (__runInitializers(this, _instanceExtraInitializers), 0);
        _index = 0;
        /**
         * @protected
         * @readonly
         * @description Each entry's measured size along the wheel's axis, indexed by entry position. Refreshed
         * by {@link GradumSelectWheel.reloadEntrySizes}.
         */
        sizePerEntry = [];
        /**
         * @protected
         * @readonly
         * @description Each entry's offset from the start of the wheel, indexed by entry position.
         */
        positionPerEntry = [];
        /**
         * @protected
         * @description The combined size of every entry along the wheel's axis.
         */
        totalSize = 0;
        /**
         * @description How far past the first and last entries the wheel can be dragged, in pixels, before it
         * springs back.
         */
        dragLimitOffset = 30;
        /**
         * @description How long the wheel stays open after the last interaction, in milliseconds, unless
         * {@link GradumSelectWheel.alwaysOpen} is set.
         */
        openTimeout = 3000;
        /**
         * @description The axis the wheel scrolls along.
         */
        direction = Direction.horizontal;
        /**
         * @description The scale applied to entries at the centre of the wheel and at its edges. Entries in
         * between are scaled proportionally, producing the wheel's depth effect.
         */
        scale = { max: 1, min: 0.5 };
        /**
         * @description An optional hook replacing the wheel's built-in entry styling. It receives the computed
         * translation, opacity, and scale alongside the default styles, and returns the styles to apply instead.
         */
        generateCustomStyling;
        /**
         * @protected
         * @description Whether the wheel is currently being dragged.
         */
        dragging = false;
        /**
         * @protected
         * @description The pending timer that will close the wheel once {@link GradumSelectWheel.openTimeout}
         * elapses.
         */
        openTimer;
        /**
         * @function initialize
         * @description Set the wheel up and start tracking its entries, re-measuring them whenever an entry is
         * added or removed.
         */
        initialize() {
            const initEntry = (entry) => {
                gradum(entry).setStyles({ position: "absolute", whiteSpace: "nowrap" }, true);
                this.entryTransitionReifect?.attach(entry);
                this.customReifect?.attach(entry);
                gradum(entry)
                    .on(DefaultEventName.dragStart, () => {
                    this.clearOpenTimer();
                    this.open = true;
                    this.dragging = true;
                    // Remove transitions instantly so the first drag frame isn't animated.
                    if (this.entryTransitionReifect)
                        this.entryTransitionReifect.unapply(undefined, { applyStylesInstantly: true });
                    this.reloadEntrySizes();
                    return Propagation.stopImmediatePropagation;
                })
                    .on(DefaultEventName.drag, (e) => {
                    if (!this.dragging)
                        return;
                    this.currentPosition += this.computeDragDelta(e.scaledDeltaPosition);
                    return Propagation.stopImmediatePropagation;
                })
                    .on(DefaultEventName.dragEnd, () => {
                    if (!this.dragging)
                        return;
                    this.dragging = false;
                    // recomputeProperties is required because unapplyStyles() clears resolvedValues.styles,
                    // so apply() without it finds styles["default"] === undefined and returns early,
                    // never calling reloadReifectsChainableStyles — leaving transition: "none" stuck.
                    if (this.entryTransitionReifect)
                        this.entryTransitionReifect.apply(undefined, { recomputeProperties: true });
                    this.snapToNearest();
                    if (!this.alwaysOpen)
                        this.setOpenTimer();
                    return Propagation.stopImmediatePropagation;
                });
                requestAnimationFrame(() => this.reloadEntrySizes());
            };
            this.select.onEntryAdded.add(initEntry);
            this.select.onEntryRemoved.add(entry => {
                this.entryTransitionReifect?.detach(entry);
                this.customReifect?.detach(entry);
                requestAnimationFrame(() => this.reloadEntrySizes());
            });
            super.initialize();
            gradum(this).setStyles({ display: "inline-block", position: "relative", overflow: "hidden" });
            // Entries set via create({values: [...]}) fire onEntryAdded before initialize() has a
            // chance to add the callback above. Replay initEntry for any such pre-existing entries.
            this.entries.forEach(initEntry);
        }
        opacity = __runInitializers(this, _opacity_initializers, void 0);
        /**
         * @description The wheel's extent on either side of its centre, in pixels. Assign a single number to
         * use it symmetrically.
         */
        set size(value) {
        }
        get size() {
            return;
        }
        /**
         * @description The reifect animating entries as they move through the wheel. Assign reifect properties
         * to build one. It is attached to every existing entry on assignment.
         */
        set entryTransitionReifect(value) {
            if (!value)
                return;
            if (this.entries.length > 0)
                value.attach(...this.entries);
        }
        get entryTransitionReifect() {
            return;
        }
        set transitionDuration(value) {
            if (value <= 0)
                return;
            if (!this.entryTransitionReifect)
                this.entryTransitionReifect = new Reifect({});
            this.entryTransitionReifect.styles = `transition: transform ${value}s ease-in-out, opacity ${value}s ease-in-out`;
        }
        /**
         * @description An extra reifect applied to entries alongside the built-in transition, for styling beyond
         * position and scale. Assign reifect properties to build one, or `null` to remove it.
         */
        set customReifect(value) {
            if (this.customReifect && this.entries.length > 0)
                this.customReifect.attach(...this.entries);
        }
        get customReifect() {
            return;
        }
        _closeOnClick = (__runInitializers(this, _opacity_extraInitializers), () => this.open = false);
        set alwaysOpen(value) {
            if (value)
                gradum(document.body).removeListener(DefaultEventName.click, this._closeOnClick);
            else
                gradum(document.body).on(DefaultEventName.click, this._closeOnClick);
            this.open = value;
        }
        set open(value) {
            gradum(this).setStyle("overflow", value ? "visible" : "hidden");
            // When opening, entries may have had zero layout size if the wheel was off-screen or
            // hidden when first populated. Reload now that the wheel is visible.
            if (value)
                requestAnimationFrame(() => this.reloadEntrySizes());
        }
        /**
         * @readonly
         * @description Whether the wheel scrolls vertically.
         */
        get isVertical() {
            return this.direction === Direction.vertical;
        }
        /** Fractional index — integer when snapped, fractional mid-drag. */
        get index() {
            return this._index;
        }
        set index(value) {
            this._index = value;
            this.select.selectByIndex(trim(Math.round(value), this.entries.length - 1));
        }
        // -------------------------------------------------------------------------
        // Position
        // -------------------------------------------------------------------------
        /**
         * @description How far the wheel is scrolled, in pixels from its start. Assigning clamps the value to
         * the draggable range, updates the selected index, and restyles every entry.
         */
        get currentPosition() {
            return this._currentPosition;
        }
        set currentPosition(value) {
            if (!this.sizePerEntry.length)
                return;
            const min = -this.dragLimitOffset - this.sizePerEntry[0] / 2;
            const max = this.totalSize + this.dragLimitOffset - this.sizePerEntry[this.sizePerEntry.length - 1] / 2;
            this._currentPosition = Math.min(Math.max(value, min), max);
            this._index = this.positionToIndex(this._currentPosition);
            this.applyAllEntryStyles();
        }
        /**
         * @function computeDragDelta
         * @protected
         * @description Convert a drag delta into movement along the wheel's axis, inverted so dragging one way
         * scrolls the entries the other.
         * @param {Point} delta - The pointer's movement.
         * @returns {number} The distance to scroll, in pixels.
         */
        computeDragDelta(delta) {
            return -delta[this.isVertical ? "y" : "x"];
        }
        // -------------------------------------------------------------------------
        // Layout
        // -------------------------------------------------------------------------
        /**
         * @function reloadEntrySizes
         * @protected
         * @description Re-measure every entry and rebuild the wheel's size and position tables. Call it after the
         * entries change, or after the wheel becomes visible — entries laid out while hidden measure as zero.
         */
        reloadEntrySizes() {
            this.sizePerEntry.length = 0;
            this.positionPerEntry.length = 0;
            this.totalSize = 0;
            this.entries.forEach(entry => {
                const size = entry[this.isVertical ? "offsetHeight" : "offsetWidth"];
                this.sizePerEntry.push(size);
                this.positionPerEntry.push(this.totalSize);
                this.totalSize += size;
            });
            if (!this.sizePerEntry.length) {
                this._currentPosition = 0;
                return;
            }
            // If the wheel or its ancestors weren't in layout yet (e.g. off-screen, hidden, or
            // added to the DOM after entries were created), all sizes read as 0. Retry next frame
            // so the browser has time to perform layout.
            if (this.totalSize === 0) {
                requestAnimationFrame(() => this.reloadEntrySizes());
                return;
            }
            this._currentPosition = this.indexToPosition(this._index);
            this.applyAllEntryStyles();
            if (this.selectedIndex >= 0)
                this.applyTransition();
        }
        /**
         * @function indexToPosition
         * @protected
         * @description Get the scroll position at which the given entry sits at the centre of the wheel.
         * @param {number} index - The entry's index.
         * @returns {number} The corresponding scroll position, in pixels.
         */
        indexToPosition(index) {
            if (!this.sizePerEntry.length)
                return 0;
            if (index < 0)
                return -Math.abs(index) * this.sizePerEntry[0];
            if (index >= this.sizePerEntry.length)
                return this.totalSize - this.sizePerEntry[this.sizePerEntry.length - 1] / 2;
            const floor = trim(Math.floor(index), this.sizePerEntry.length - 1);
            return this.positionPerEntry[floor] + this.sizePerEntry[floor] * (index - Math.floor(index));
        }
        /**
         * @function positionToIndex
         * @protected
         * @description Get the entry index a scroll position corresponds to. The result is fractional between
         * entries, which is what drives the wheel's scaling mid-drag.
         * @param {number} position - The scroll position, in pixels.
         * @returns {number} The fractional entry index.
         */
        positionToIndex(position) {
            if (!this.positionPerEntry.length)
                return 0;
            let i = 0;
            while (i < this.positionPerEntry.length - 1 && this.positionPerEntry[i + 1] <= position)
                i++;
            if (i >= this.sizePerEntry.length - 1)
                return i;
            return i + Math.min((position - this.positionPerEntry[i]) / (this.sizePerEntry[i] || 1), 1);
        }
        /**
         * @function snapToNearest
         * @protected
         * @description Settle the wheel on the entry nearest its current position and select it. Called when a
         * drag ends.
         */
        snapToNearest() {
            const nearest = trim(Math.round(this.positionToIndex(this._currentPosition)), this.entries.length - 1);
            this.index = nearest;
            this._currentPosition = this.indexToPosition(nearest);
            this.applyAllEntryStyles();
        }
        // -------------------------------------------------------------------------
        // Transition (overrides GradumSelectElement — wheel sizes to selected entry directly)
        // -------------------------------------------------------------------------
        /**
         * @function applyTransition
         * @protected
         * @description Scroll the wheel to the selected entry and size the wheel to match it. Overrides the base
         * selection behaviour, which sizes to the entry element instead.
         */
        applyTransition() {
            const i = this.selectedIndex;
            if (i < 0)
                return;
            this._index = i;
            this._currentPosition = this.indexToPosition(i);
            this.applyAllEntryStyles();
            // Size container to selected entry
            if (this.sizePerEntry.length) {
                const entry = this.entries[i];
                const w = this.isVertical ? entry.offsetWidth : this.sizePerEntry[i];
                const h = this.isVertical ? this.sizePerEntry[i] : entry.offsetHeight;
                $(this).setStyles({ width: `${w}px`, height: `${h}px` });
            }
        }
        // -------------------------------------------------------------------------
        // Styling
        // -------------------------------------------------------------------------
        /**
         * @function applyAllEntryStyles
         * @protected
         * @description Restyle every entry for the current scroll position. Styles are applied instantly while
         * dragging, so transforms are not queued behind a frame and left visibly lagging the pointer.
         */
        applyAllEntryStyles() {
            // Apply instantly during drag so transforms aren't queued behind a rAF while a CSS
            // transition is still active on the element, which would cause visual lag.
            const instant = this.dragging;
            this.entries.forEach((el, i) => {
                const translationValue = (this.positionPerEntry[i] ?? 0) - this._currentPosition;
                if (this.customReifect) {
                    this.customReifect.apply(el, { recomputeProperties: true });
                }
                else {
                    this.computeAndApplyStyling(el, translationValue, undefined, instant);
                }
            });
        }
        /**
         * @function computeAndApplyStyling
         * @protected
         * @description Compute an entry's opacity, scale, and transform from how far it sits from the wheel's
         * centre, and apply them. Defers to {@link GradumSelectWheel.generateCustomStyling} when one is set.
         * @param {HTMLElement} element - The entry to style.
         * @param {number} translationValue - The entry's offset from the centre, in pixels.
         * @param {Record<Range, number>} [size=this.size] - The wheel's extent, used to scale the falloff.
         * @param {boolean} [instant=false] - Whether to set the styles directly, skipping the CSS transition.
         */
        computeAndApplyStyling(element, translationValue, size = this.size, instant = false) {
            const bound = translationValue > 0 ? size.max : size.min;
            const opacityValue = linearInterpolation(translationValue, 0, bound, this.opacity.max, this.opacity.min);
            const scaleValue = linearInterpolation(translationValue, 0, bound, this.scale.max, this.scale.min);
            // `transition` is a "chainable style field" — Reifect.unapply() clears its own
            // resolved state but reloadReifectsChainableStyles() only writes keys that still
            // have an active contribution, so the old inline transition is never explicitly
            // removed. Writing "none" here overrides it every drag frame.
            let styles = {
                left: "50%",
                top: "50%",
                opacity: opacityValue,
                ...(instant && { transition: "none" }),
                transform: `translate3d(
                calc(${!this.isVertical ? translationValue : 0}px - 50%),
                calc(${this.isVertical ? translationValue : 0}px - 50%),
                0) scale3d(${scaleValue}, ${scaleValue}, 1)`,
            };
            if (this.generateCustomStyling)
                styles = this.generateCustomStyling({
                    element, translationValue, opacityValue, scaleValue, size, defaultComputedStyles: styles,
                });
            $(element).setStyles(styles, instant);
        }
        // -------------------------------------------------------------------------
        // Timer helpers
        // -------------------------------------------------------------------------
        /**
         * @function clearOpenTimer
         * @protected
         * @description Cancel the pending timer that would close the wheel.
         */
        clearOpenTimer() {
            if (this.openTimer)
                clearTimeout(this.openTimer);
        }
        /**
         * @function setOpenTimer
         * @protected
         * @description Restart the timer that closes the wheel once {@link GradumSelectWheel.openTimeout} elapses.
         */
        setOpenTimer() {
            this.clearOpenTimer();
            if (typeof this.openTimeout !== "number" || this.openTimeout < 0)
                return;
            this.openTimer = setTimeout(() => this.open = false, this.openTimeout);
        }
    };
})();
define(GradumSelectWheel);

/**
 * @class GradumButtonPopup
 * @group Components
 * @category Basics
 *
 * @extends GradumButton
 * @template {ValidTag} ElementTag - The tag of the button's main element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description A button that toggles a {@link GradumPopup} anchored to itself. A popup is created on
 * first use if none is assigned, so the button works without any extra setup.
 */
let GradumButtonPopup = (() => {
    let _classSuper = GradumButton;
    let _instanceExtraInitializers = [];
    let _popupClasses_decorators;
    let _popupClasses_initializers = [];
    let _popupClasses_extraInitializers = [];
    let _set_popup_decorators;
    return class GradumButtonPopup extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _popupClasses_decorators = [auto({
                    callBefore: function () { gradum(this.popup).removeClass(this.popupClasses); },
                    callAfter: function () { gradum(this.popup).addClass(this.popupClasses); }
                })];
            _set_popup_decorators = [auto({ defaultValueCallback: () => GradumPopup.create() })];
            __esDecorate(this, null, _set_popup_decorators, { kind: "setter", name: "popup", static: false, private: false, access: { has: obj => "popup" in obj, set: (obj, value) => { obj.popup = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _popupClasses_decorators, { kind: "field", name: "popupClasses", static: false, private: false, access: { has: obj => "popupClasses" in obj, get: obj => obj.popupClasses, set: (obj, value) => { obj.popupClasses = value; } }, metadata: _metadata }, _popupClasses_initializers, _popupClasses_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        popupOpen = (__runInitializers(this, _instanceExtraInitializers), false);
        popupClasses = __runInitializers(this, _popupClasses_initializers, void 0);
        /**
         * The dropdown's popup element.
         */
        set popup(value) {
            if (value instanceof GradumPopup)
                value.anchor = this;
            gradum(value).addClass(this.popupClasses);
        }
        setupUIListeners() {
            super.setupUIListeners();
            gradum(document.body).on(DefaultEventName.click, () => e => {
                if (this.popupOpen && !this.contains(e.target))
                    this.openPopup(false);
            }, { capture: true });
            gradum(this).on(DefaultEventName.click, (e) => {
                this.openPopup(!this.popupOpen);
                return Propagation.stopPropagation;
            });
        }
        openPopup(b) {
            if (this.popupOpen == b)
                return;
            this.popupOpen = b;
            if ("show" in this.popup && typeof this.popup.show === "function")
                this.popup.show(b);
            else
                gradum(this.popup).show(b);
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _popupClasses_extraInitializers);
        }
    };
})();
define(GradumButtonPopup);

/**
 * @class GradumGrid
 * @group Components
 * @category Wrappers
 *
 * @extends GradumElement
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description An element laying its children out on a grid, positioning them by cell rather than by
 * coordinates.
 * *Note: unimplemented. The class is currently an empty placeholder that behaves exactly like a plain
 * {@link GradumElement}, and it is not registered as a custom element.*
 */
class GradumGrid extends GradumElement {
}

/**
 * @class GradumYModel
 * @group MVC
 * @category Model
 *
 * @extends GradumModel
 * @template DataType - The type of the data held in the model.
 * @template {KeyType} DataKeyType - The type of the data's keys.
 * @template {KeyType} IdType - The type of the data's ID.
 * @template {object} ComponentType - The type of instances managed by attached observers.
 * @template DataEntryType - The type of data associated with each observer instance.
 * @description A {@link GradumModel} whose data lives in a Y.js structure, so edits propagate to every other
 * client sharing the document. Reads and writes go through the same API as a plain model; changes arriving
 * from Y.js — local or remote — are turned into the usual signal and observer notifications.
 */
let GradumYModel = (() => {
    let _classSuper = GradumModel;
    let _instanceExtraInitializers = [];
    let _set_enabledCallbacks_decorators;
    return class GradumYModel extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _set_enabledCallbacks_decorators = [auto({ override: true })];
            __esDecorate(this, null, _set_enabledCallbacks_decorators, { kind: "setter", name: "enabledCallbacks", static: false, private: false, access: { has: obj => "enabledCallbacks" in obj, set: (obj, value) => { obj.enabledCallbacks = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        observer = (__runInitializers(this, _instanceExtraInitializers), (event, transaction) => this.observeChanges(event, transaction));
        observedYTypes = new WeakSet();
        /**
         * @inheritDoc
         */
        modelConstructor = GradumYModel;
        /**
         * @inheritDoc
         */
        set enabledCallbacks(value) {
            if (!this.data)
                return;
            if (this.data instanceof AbstractType) {
                if (value)
                    this.attachNestedObservers(this.data);
                else
                    this.detachNestedObservers(this.data);
            }
            else if (Array.isArray(this.data)) {
                for (const item of this.data) {
                    if (value)
                        this.attachNestedObservers(item);
                    else
                        this.detachNestedObservers(item);
                }
            }
        }
        /*
         *
         * Basics
         *
         */
        /**
         * @inheritDoc
         */
        getAction(data, key) {
            if (data instanceof Map$1)
                return data.get(key.toString());
            if (data instanceof Array$1)
                return data.get(trim(Number(key), data.length));
            return super.getAction(data, key);
        }
        /**
         * @inheritDoc
         */
        setAction(data, value, key) {
            if (data instanceof Map$1)
                data.doc.transact(() => data.set(key.toString(), value), this);
            else if (data instanceof Array$1) {
                const index = trim(Number(key), data.length + 1);
                if (index < data.length)
                    data.delete(index, 1);
                data.doc.transact(() => data.insert(index, [value]), this);
            }
            else {
                const oldValue = this.getAction(data, key);
                if (oldValue !== value && oldValue != null && typeof oldValue === "object")
                    this.detachNestedObservers(oldValue);
                super.setAction(data, value, key);
                if (oldValue !== value && value != null && typeof value === "object")
                    this.attachNestedObservers(value);
            }
        }
        /**
         * @inheritDoc
         */
        addAction(model, data, value, key) {
            if (data instanceof Array$1) {
                let index = key;
                if (isUndefined(index) || typeof index !== "number" || index > data.length) {
                    index = data.length;
                    data.doc.transact(() => data.push([value]), this);
                }
                else {
                    if (index < 0)
                        index = 0;
                    data.doc.transact(() => data.insert(index, [value]), this);
                }
                return index;
            }
            if (Array.isArray(data)) {
                const index = super.addAction(model, data, value, key);
                if (index !== undefined && value != null && typeof value === "object")
                    this.attachNestedObservers(value);
                return index;
            }
            return super.addAction(model, data, value, key);
        }
        /**
         * @inheritDoc
         */
        hasAction(data, key) {
            if (data instanceof Map$1)
                return data.has(key.toString());
            if (data instanceof Array$1)
                return typeof key === "number" && key >= 0 && key < data.length;
            return super.hasAction(data, key);
        }
        /**
         * @inheritDoc
         */
        deleteAction(data, key) {
            if (data instanceof Map$1)
                data.doc.transact(() => data.delete(key.toString()), this);
            else if (data instanceof Array$1 && typeof key === "number" && key >= 0 && key < data.length)
                data.doc.transact(() => data.delete(key, 1), this);
            else
                super.deleteAction(data, key);
        }
        /**
         * @inheritDoc
         */
        getKeysAction(data) {
            if (data instanceof Map$1)
                return Array.from(data.keys());
            if (data instanceof Array$1) {
                const output = [];
                for (let i = 0; i < data.length; i++)
                    output.push(i);
                return output;
            }
            return super.getKeysAction(data);
        }
        /**
         * @inheritDoc
         */
        initialize() {
            super.initialize();
            if (!this.enabledCallbacks)
                return;
            if (this.data instanceof AbstractType)
                this.attachNestedObservers(this.data);
            else if (Array.isArray(this.data)) {
                for (const item of this.data)
                    this.attachNestedObservers(item);
            }
        }
        /**
         * @inheritDoc
         */
        clear(clearData = true) {
            if (clearData) {
                if (this.data instanceof AbstractType)
                    this.detachNestedObservers(this.data);
                else if (Array.isArray(this.data)) {
                    for (const item of this.data)
                        this.detachNestedObservers(item);
                }
            }
            super.clear(clearData);
        }
        /**
         * @inheritDoc
         */
        diffCheck(oldData, newData) {
            if (oldData instanceof AbstractType || newData instanceof AbstractType)
                return false;
            return super.diffCheck(oldData, newData);
        }
        /*
         *
         * Utilities
         *
         */
        observeChanges(event, transaction) {
            const selfOriginated = transaction?.origin === this;
            const basePath = this.getPathToTarget(event.target);
            if (event instanceof YMapEvent) {
                if (selfOriginated)
                    return;
                event.keysChanged.forEach(key => {
                    const change = event.changes.keys.get(key);
                    if (!change)
                        return;
                    if (change.action === "delete")
                        this.keyChanged([...basePath, key], undefined, true);
                    else {
                        this.attachNestedObservers(this.getAction(event.target, key));
                        this.keyChanged([...basePath, key]);
                    }
                });
            }
            else if (event instanceof YArrayEvent) {
                let currentIndex = 0;
                for (const delta of event.delta) {
                    if (delta.retain !== undefined) {
                        currentIndex += delta.retain;
                    }
                    else if (delta.insert) {
                        const insertedItems = Array.isArray(delta.insert) ? delta.insert : [delta.insert];
                        const count = insertedItems.length;
                        this.shiftIndices(basePath, currentIndex, count);
                        if (!selfOriginated) {
                            for (let i = 0; i < count; i++) {
                                this.attachNestedObservers(this.getAction(event.target, currentIndex + i));
                                this.keyChanged([...basePath, currentIndex + i]);
                            }
                        }
                        currentIndex += count;
                    }
                    else if (delta.delete) {
                        const count = delta.delete;
                        if (!selfOriginated) {
                            for (let i = 0; i < count; i++)
                                this.keyChanged([...basePath, currentIndex + i], undefined, true);
                        }
                        this.shiftIndices(basePath, currentIndex + count, -count);
                    }
                }
            }
        }
        /**
         * @protected
         * @function attachNestedObservers
         * @description Start observing a Y.js type and everything nested inside it, so changes anywhere in the
         * subtree reach this model. Types already being observed are skipped, so repeated calls are cheap.
         * @param {any} value - The Y.js type to observe. Non-Y values are ignored.
         */
        attachNestedObservers(value) {
            if (value instanceof AbstractType) {
                if (!this.observedYTypes.has(value)) {
                    value.observe(this.observer);
                    this.observedYTypes.add(value);
                }
                // Skip key iteration when the type has no document yet — Y.js throws
                // "Invalid access: Add Yjs type to a document before reading data."
                // when keys() / get() are called before the type is inserted into a doc.
                if (!value.doc)
                    return;
                for (const key of this.getKeysAction(value)) {
                    if (!this.nestedModels.has(key))
                        this.attachNestedObservers(this.getAction(value, key));
                }
            }
            else if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++)
                    this.attachNestedObservers(value[i]);
            }
        }
        /**
         * @protected
         * @function detachNestedObservers
         * @description Stop observing a Y.js type and everything nested inside it, releasing the observers
         * attached by {@link GradumYModel.attachNestedObservers}.
         * @param {any} value - The Y.js type to stop observing. Non-Y values are ignored.
         */
        detachNestedObservers(value) {
            if (value instanceof AbstractType) {
                if (this.observedYTypes.has(value)) {
                    // Guard: Y.js GC can clear event handlers on deleted types, leaving
                    // observedYTypes stale. Check the internal handler array before calling
                    // unobserve to avoid "[yjs] Tried to remove event handler that doesn't exist."
                    if (value._eH?.l?.includes(this.observer))
                        value.unobserve(this.observer);
                    this.observedYTypes.delete(value);
                }
                for (const key of this.getKeysAction(value))
                    this.detachNestedObservers(this.getAction(value, key));
            }
            else if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++)
                    this.detachNestedObservers(value[i]);
            }
        }
        shiftIndices(basePath, fromIndex, offset) {
            const depth = basePath.length;
            Array.from(this.changeObservers).forEach(entry => {
                const observer = entry.observer;
                const pathsToShift = observer.paths.filter(path => path.length > depth &&
                    basePath.every((k, i) => path[i] == k) &&
                    Number(path[depth]) >= fromIndex);
                const itemsToShift = pathsToShift
                    .map(path => [Number(path[depth]), path, observer.get(...path)]);
                itemsToShift.sort((a, b) => offset < 0 ? a[0] - b[0] : b[0] - a[0]);
                pathsToShift.forEach(path => observer.detach(...path));
                for (const [oldIndex, path, instance] of itemsToShift) {
                    const newIndex = oldIndex + offset;
                    if (typeof instance === "object" && "dataId" in instance)
                        instance.dataId = String(newIndex);
                    const newPath = [...basePath, newIndex, ...path.slice(depth + 1)];
                    observer.set(instance, ...newPath);
                }
            });
        }
        getPathToTarget(target) {
            const search = (current, path) => {
                if (current === target)
                    return path;
                for (const key of this.getKeysAction(current)) {
                    const child = this.getAction(current, key);
                    const result = search(child, [...path, key]);
                    if (result)
                        return result;
                }
                return null;
            };
            return search(this.data, []) ?? [];
        }
    };
})();

/**
 * @class GradumTool
 * @group MVC
 * @category Tool
 *
 * @extends GradumOperator
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 * @description A named mode that changes what interacting with an element does. Its `@behavior` methods run
 * during the capture phase of the event loop, before any interactor sees the event, so a tool can claim an
 * interaction and stop it reaching the element underneath. Only the active tool for a given click mode
 * receives events.
 */
class GradumTool extends GradumOperator {
    /**
     * @description The name of the tool.
     */
    toolName;
    /**
     * @readonly
     * @description The target of this tool. If defined, will embed the tool.
     */
    embeddedTarget;
    /**
     * @readonly
     * @description The associated event manager. Defaults to `GradumEventManager.instance`.
     */
    manager;
    /**
     * @readonly
     * @description Custom activation event to listen to. Defaults to the default click event name.
     */
    activationEvent = DefaultEventName.click;
    /**
     * @readonly
     * @description Click mode that will hold this tool when activated. Defaults to `ClickMode.left`.
     */
    clickMode = ClickMode.left;
    /**
     * @readonly
     * @description Optional keyboard key to map to this tool. When pressed, it will be set as the current key tool.
     */
    key;
    /**
     * @constructor
     * @description Create a tool bound to an element. Anything omitted from `properties` falls back to the
     * value already declared on the instance, then to a default — the event manager to
     * {@link GradumEventManager.instance}, the activation event to the default click name, and the click mode
     * to `ClickMode.left`.
     * @param {GradumToolProperties} properties - The element to attach to, plus the tool name, embedded
     * target, activation event, click mode, mapped key, and activation callbacks.
     */
    constructor(properties) {
        super(properties);
        this.toolName = properties.toolName ?? this.toolName ?? undefined;
        if (properties.embeddedTarget)
            this.embeddedTarget = properties.embeddedTarget;
        if (properties.onActivate)
            this.onActivate = properties.onActivate;
        if (properties.onDeactivate)
            this.onDeactivate = properties.onDeactivate;
        if (properties.activationEvent)
            this.activationEvent = properties.activationEvent;
        if (properties.clickMode)
            this.clickMode = properties.clickMode;
        if (properties.customActivation)
            this.customActivation = properties.customActivation;
        if (properties.key)
            this.key = properties.key;
        this.manager = properties.manager ?? this.manager ?? GradumEventManager.instance;
        this.setup();
    }
    /**
     * @function initialize
     * @override
     * @description Initialization function that calls {@link GradumSelector.makeTool} on `this.element`, sets it up,
     * and attaches all the defined tool behaviors.
     */
    initialize() {
        if (this.toolName)
            gradum(this).makeTool(this.toolName, {
                onActivate: typeof this.onActivate === "function" ? this.onActivate.bind(this) : undefined,
                onDeactivate: typeof this.onDeactivate === "function" ? this.onDeactivate.bind(this) : undefined,
                activationEvent: this.activationEvent,
                clickMode: this.clickMode,
                customActivation: typeof this.customActivation === "function" ? this.customActivation.bind(this) : undefined,
                key: this.key,
                manager: this.manager,
            });
        if (this.embeddedTarget)
            gradum(this).embedTool(this.embeddedTarget, this.manager);
        super.initialize();
    }
}
addRegistryCategory(GradumTool);
define(GradumTool);

/**
 * @class GradumView
 * @group MVC
 * @category View
 *
 * @template {object} ElementType - The type of the element attached to the view.
 * @template {GradumModel} ModelType - The model type used in this view.
 * @template {GradumEmitter} EmitterType - The emitter type used in this view.
 * @description A base view class for MVC elements, providing structure for initializing and managing UI setup and
 * event listeners. Designed to be devoid of logic and only handle direct UI changes.
 */
class GradumView {
    /**
     * @description The main component this view is attached to.
     */
    element;
    /**
     * @description The model instance this view is bound to.
     */
    model;
    /**
     * @description The emitter instance used for event communication.
     */
    emitter;
    /**
     * @constructor
     * @param {GradumViewProperties<ElementType, ModelType, EmitterType>} properties - Properties to initialize the view with.
     */
    constructor(properties) {
        this.element = properties.element;
        if (properties.model)
            this.model = properties.model;
        if (properties.emitter)
            this.emitter = properties.emitter;
        this.setup();
    }
    /**
     * @function setup
     * @description Called in the constructor. Use for setup that should happen at instantiation,
     * before `this.initialize()` is called.
     * @protected
     */
    setup() { }
    /**
     * @function initialize
     * @description Initializes the view by setting up change callbacks, UI elements, layout, and event listeners.
     */
    initialize() {
        this.setupUIElements();
        this.setupUILayout();
        this.setupUIListeners();
        this.setupChangedCallbacks();
    }
    /**
     * @function setupChangedCallbacks
     * @description Setup method for initializing data/model change listeners and associated UI logic.
     * @protected
     */
    setupChangedCallbacks() {
        initializeEffects(this);
    }
    /**
     * @function setupUIElements
     * @description Setup method for initializing and storing sub-elements of the UI.
     * @protected
     */
    setupUIElements() {
    }
    /**
     * @function setupUILayout
     * @description Setup method for creating the layout structure and injecting sub-elements into the DOM tree.
     * @protected
     */
    setupUILayout() {
    }
    /**
     * @function setupUIListeners
     * @description Setup method for defining DOM and input event listeners.
     * @protected
     */
    setupUIListeners() {
        attachListenersAndBehaviors(this);
    }
}
addRegistryCategory(GradumView);
define(GradumView);

/**
 * @function hashString
 * @group Utilities
 * @category Hash
 *
 * @description Hash a string with SHA-256 and render it as hexadecimal. Use it when you need a stable
 * fingerprint of some content; use {@link hashBySize} when the result has to fit a length budget.
 * @param {string} input - The string to hash.
 * @returns {Promise<string>} The 64-character hexadecimal digest.
 */
async function hashString(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}
/**
 * @function hashBySize
 * @group Utilities
 * @category Hash
 *
 * @description Hash a string with SHA-256 and render it as a short, URL-safe string of the requested length.
 * The alphabet is base64 with `+` and `/` swapped for `-` and `_` and the padding dropped, so the result is
 * safe in URLs and identifiers. Shorter lengths raise the chance of collisions.
 * @param {string} input - The string to hash.
 * @param {number} [chars=12] - How many characters the result should be.
 * @returns {Promise<string>} The truncated URL-safe digest.
 */
async function hashBySize(input, chars = 12) {
    const bytes = Math.ceil((chars * 6) / 8);
    const enc = new TextEncoder();
    const digest = await crypto.subtle.digest("SHA-256", enc.encode(input));
    const slice = new Uint8Array(digest).slice(0, bytes);
    return (typeof btoa === "function"
        ? btoa(String.fromCharCode(...slice))
        : Buffer.from(slice).toString("base64"))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "")
        .slice(0, chars);
}

/**
 * @function replaceUrlParams
 * @group Utilities
 * @category URL
 *
 * @description Set query parameters on the current URL without adding a history entry, so the change cannot
 * be undone with the browser's back button. Use {@link pushUrlParams} when the change should be navigable.
 * Existing parameters of the same name are overwritten; the rest are left alone.
 * @param {...{name: string, value: string}[]} params - The parameters to set.
 */
function replaceUrlParams(...params) {
    const url = new URL(window.location.href);
    params.forEach(({ name, value }) => url.searchParams.set(name, value));
    history.replaceState(null, "", url);
}
/**
 * @function getUrlParam
 * @group Utilities
 * @category URL
 *
 * @description Read one query parameter from the current URL.
 * @param {string} name - The parameter to read.
 * @returns {string} The parameter's value, or `null` if it is not present.
 */
function getUrlParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}
/**
 * @function pushUrlParams
 * @group Utilities
 * @category URL
 *
 * @description Set query parameters on the current URL and add a history entry, so the change can be undone
 * with the browser's back button. Use {@link replaceUrlParams} when it should not be navigable.
 * @param {...{name: string, value: string}[]} params - The parameters to set.
 */
function pushUrlParams(...params) {
    const url = new URL(window.location.href);
    params.forEach(({ name, value }) => url.searchParams.set(name, value));
    history.pushState(null, "", url);
}
/**
 * @function clearUrlParams
 * @group Utilities
 * @category URL
 *
 * @description Strip every query parameter from the current URL without adding a history entry.
 */
function clearUrlParams() {
    const url = new URL(window.location.href);
    url.search = "";
    history.replaceState(null, "", url);
}

/**
 * @function formatMMSS
 * @group Utilities
 * @category String
 *
 * @description Format a duration in seconds as `"MM:SS"`, both parts zero-padded. Minutes are not capped at
 * 60, so a long duration reads as `"90:00"` rather than rolling into hours — use {@link formatHHMMSS} for that.
 * @param {number} seconds - The duration in seconds. Fractions are truncated.
 * @param {string} [separator=":"] - What to place between the parts.
 * @returns {string} The formatted duration.
 */
function formatMMSS(seconds, separator = ":") {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return formattedMinutes + separator + formattedSeconds;
}
/**
 * @function formatHHMMSS
 * @group Utilities
 * @category String
 *
 * @description Format a duration in seconds as `"HH:MM:SS"`, each part zero-padded.
 * @param {number} seconds - The duration in seconds. Fractions are truncated.
 * @param {string} [separator=":"] - What to place between the parts.
 * @returns {string} The formatted duration.
 */
function formatHHMMSS(seconds, separator = ":") {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return formattedHours + separator + formattedMinutes + separator + formattedSeconds;
}
/**
 * @function formatMmSs
 * @group Utilities
 * @category String
 *
 * @description Format a duration in seconds in a compact, human-readable form such as `"2m30s"` — no
 * zero-padding, and the minutes part dropped entirely when the duration is under a minute.
 * @param {number} seconds - The duration in seconds. Fractions are truncated.
 * @param {string} [separator=""] - What to place between the minutes and seconds parts.
 * @returns {string} The formatted duration.
 */
function formatMmSs(seconds, separator = "") {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return (minutes > 0 ? (minutes + "m" + separator) : "") + remainingSeconds + "s";
}

/**
 * @function blobToUrl
 * @group Utilities
 * @category URL
 *
 * @description Read a blob into a `data:` URL that embeds its content, so it can be stored or sent as text.
 * The result is self-contained and needs no cleanup, unlike `URL.createObjectURL`, but is larger than the
 * original by roughly a third.
 * @param {Blob} blob - The blob to read.
 * @returns {Promise<string>} A `data:` URL holding the blob's content.
 */
function blobToUrl(blob) {
    return new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.readAsDataURL(blob);
    });
}
/**
 * @function urlToBlob
 * @group Utilities
 * @category URL
 *
 * @description Fetch a URL and hand back its content as a blob. Works with `data:` URLs as well as remote
 * ones, making it the inverse of {@link blobToUrl}.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<Blob>} The fetched content.
 */
function urlToBlob(url) {
    return new Promise((resolve) => {
        fetch(url).then(res => resolve(res.blob()));
    });
}

/**
 * @function getVideoDuration
 * @group Utilities
 * @category Media
 *
 * @description Read how long a video is without displaying it, by loading just its metadata into a detached
 * element. Streams whose duration is not known upfront are handled by seeking to the end to force the browser
 * to resolve it. The element and any temporary object URL are cleaned up before the promise settles.
 * @param {Blob | string} input - The video to measure, as a blob or a URL. URLs are fetched anonymously, so
 * a remote server must allow cross-origin reads.
 * @returns {Promise<number>} The duration in seconds. Rejects if the metadata cannot be loaded.
 */
async function getVideoDuration(input) {
    const el = video({ preload: "metadata" });
    return new Promise((resolve, reject) => {
        let objectUrl = null;
        const cleanup = () => {
            el.removeAttribute("src");
            el.load();
            if (objectUrl)
                URL.revokeObjectURL(objectUrl);
        };
        el.onerror = () => {
            cleanup();
            reject(new Error("Failed to load video metadata"));
        };
        el.onloadedmetadata = () => {
            if (el.duration === Infinity) {
                el.currentTime = 1e101;
                el.ontimeupdate = () => {
                    el.ontimeupdate = null;
                    const d = el.duration;
                    cleanup();
                    resolve(d);
                };
            }
            else {
                const d = el.duration;
                cleanup();
                resolve(d);
            }
        };
        if (typeof input === "string") {
            el.crossOrigin = "anonymous";
            el.src = input;
        }
        else {
            objectUrl = URL.createObjectURL(input);
            el.src = objectUrl;
        }
    });
}

/**
 * @function createYDoc
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @description Creates a new YDoc with a default map and populates it with optional data.
 * @param {string} [mapKey="content"] - The key of the default map to setup. Defaults to "content".
 * @param {object} [data] - Optional data to set inside the default map.
 * @returns {{doc: YDoc, map: YMap}} - An object containing the YDoc and the default YMap.
 */
function createYDoc(mapKey = "content", data) {
    const doc = new Doc();
    const map = doc.getMap(mapKey);
    if (data)
        for (const [key, value] of Object.entries(data))
            map.set(key, value);
    return { doc, map };
}
/**
 * @function createYMap
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @description Creates a YMap and populates it with key-value pairs from a plain object.
 * @param {object} data - The initial data to populate the YMap with.
 * @returns {YMap} A new YMap instance.
 */
function createYMap(data) {
    const map = new Map$1();
    for (const [key, value] of Object.entries(data))
        map.set(key, value);
    return map;
}
/**
 * @function createYArray
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @template DataType - The type of the array's content.
 * @description Creates a YArray and populates it with elements from a plain array.
 * @param {DataType[]} data - The array of data to populate the YArray with.
 * @returns {YArray} A new YArray instance.
 */
function createYArray(data) {
    const array = new Array$1();
    array.push(data);
    return array;
}
/**
 * @function jsonToYjs
 * @group Utilities
 * @category Yjs
 *
 * @description Attempts to deep-convert a JSON structure into Yjs data.
 * @param {object} data - The JSON data to convert.
 * @returns {YAbstractType} The converted Yjs structure: a YMap for an object, a YArray for an array, and the
 * value itself for a primitive.
 */
function jsonToYjs(data) {
    if (Array.isArray(data)) {
        const arr = new Array$1();
        arr.push(data.map(jsonToYjs));
        return arr;
    }
    if (data && typeof data === "object") {
        const map = new Map$1();
        for (const [key, value] of Object.entries(data))
            map.set(key, jsonToYjs(value));
        return map;
    }
    return data;
}
/**
 * @function addInYMap
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @async
 * @description Adds the provided data in the provided parent in the Yjs document, with a unique ID as its field name.
 * @param {object} data - The data to append to the Yjs document.
 * @param {YMap} parentYMap - The YMap to add the data to.
 * @param {string} [id] - Optional ID to use. If not provided, a unique ID is generated.
 * @returns {Promise<string>} The ID of the inserted data.
 */
async function addInYMap(data, parentYMap, id) {
    const generateId = async () => await hashBySize(parentYMap?.doc?.clientID?.toString(32) + randomId());
    if (!id) {
        id = await generateId();
        while (parentYMap?.get(id) !== undefined)
            id = await generateId();
    }
    parentYMap.set(id, data);
    return id;
}
/**
 * @function addInYArray
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @description Adds the provided data in the provided parent array in the Yjs document.
 * @param {object} data - The data to append to the Yjs document.
 * @param {YArray} parentYArray - The YArray to which the data should be appended.
 * @param {number} [index] - The index to insert the data at. If omitted or invalid, it is appended at the end.
 * @returns {number} The index where the data was inserted.
 */
function addInYArray(data, parentYArray, index) {
    if (index == undefined || index > parentYArray.length) {
        index = parentYArray.length;
        parentYArray.push([data]);
    }
    else {
        if (index < 0)
            index = 0;
        parentYArray.insert(index, [data]);
    }
    return index;
}
/**
 * @function removeFromYArray
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @description Remove the first occurrence of an entry from a YArray. Entries are matched by identity, so
 * pass the same object the array holds rather than an equal copy.
 * @param {unknown} entry - The entry to remove.
 * @param {YArray} parentYArray - The array to remove it from.
 * @returns {boolean} `true` if an entry was removed, `false` if it was not in the array.
 */
function removeFromYArray(entry, parentYArray) {
    const index = parentYArray.toArray().indexOf(entry);
    if (index < 0)
        return false;
    parentYArray.delete(index, 1);
    return true;
}
/**
 * @function deepObserveAny
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @description Observes deeply for changes to any of the specified fields and invokes callback when any field
 * changes.
 * @param {YAbstractType} data - The Yjs type to observe.
 * @param {(fieldChanged: string | null, event: YEvent, target: YAbstractType) => void} callback - The function to
 * call when a matching field changes. `fieldChanged` is `null` for direct insertions/deletions on `data` itself.
 * @param {...string} fieldNames - List of field names to observe.
 */
function deepObserveAny(data, callback, ...fieldNames) {
    if (!data)
        return;
    const fields = new Set(fieldNames);
    data.observeDeep((events) => {
        for (const event of events) {
            const target = event.target;
            if (event.target === data && event instanceof YArrayEvent) {
                callback(null, event, target);
                return;
            }
            const parentMap = target._item?.parent;
            const key = target._item?.parentSub;
            for (const field of fields) {
                if ((event instanceof YMapEvent && event.changes.keys.has(field)) ||
                    (event instanceof YArrayEvent && parentMap instanceof Map$1 && key === field) ||
                    (event.path?.some(segment => segment === field))) {
                    callback(field, event, target);
                    return;
                }
            }
        }
    });
}
/**
 * @function deepObserveAll
 * @group Utilities
 * @category Yjs
 *
 * @static
 * @description Observes deeply for changes to all specified fields and invokes callback only when all fields
 * have changed.
 * @param {YAbstractType} data - The Yjs type to observe.
 * @param {(event: YEvent, target: YAbstractType) => void} callback - The function to call when all fields change.
 * @param {...string} fieldNames - List of field names to observe.
 */
function deepObserveAll(data, callback, ...fieldNames) {
    if (!data)
        return;
    const fields = new Set(fieldNames);
    data.observeDeep(events => {
        const changedFields = new Set();
        for (const event of events) {
            const target = event.target;
            const parentMap = target._item?.parent;
            const key = target._item?.parentSub;
            for (const field of fields) {
                if ((event instanceof YMapEvent && event.changes.keys.has(field)) ||
                    (event instanceof YArrayEvent && parentMap instanceof Map$1 && key === field) ||
                    (event.path?.some(segment => segment === field)))
                    changedFields.add(field);
            }
            if (changedFields.size === fields.size) {
                callback(event, target);
                return;
            }
        }
    });
}

/**
 * @function getEventPosition
 * @group Utilities
 * @category Geometry
 *
 * @description Read the pointer position out of an event, whichever kind it is. A {@link GradumEvent} yields
 * its scaled position, so the result already accounts for a panned or zoomed canvas; a native pointer event
 * yields raw client coordinates.
 * @param {Event} e - The event to read.
 * @returns {Point} The pointer position, or `undefined` for an event that carries none.
 */
function getEventPosition(e) {
    if (e instanceof GradumEvent)
        return e.scaledPosition;
    if (e instanceof PointerEvent)
        return new Point(e.clientX, e.clientY);
    return;
}

/**
 * @function closestPointOnEdge
 * @group Utilities
 * @category Geometry
 *
 * @description Find the point on a rectangle's outline nearest to a given point. Unlike
 * {@link closestPointOnAabb}, a point inside the rectangle is pushed out to the nearest edge rather than
 * returned as-is, so the result always sits on the border.
 * @param {Coordinate} pointer - The point to measure from.
 * @param {DOMRect} rect - The rectangle to measure against.
 * @returns {Point} A new point on the rectangle's outline; neither argument is modified.
 */
function closestPointOnEdge(pointer, rect) {
    const closestPoint = {
        x: trim(pointer.x, rect.right, rect.left),
        y: trim(pointer.y, rect.bottom, rect.top)
    };
    const axisFromSide = (side) => {
        if (side === Side.top || side === Side.bottom)
            return "y";
        if (side === Side.left || side === Side.right)
            return "x";
    };
    let closestSide = Side.top;
    Object.values(Side).forEach(side => {
        if (Math.abs(closestPoint[axisFromSide(side)] - rect[side])
            < Math.abs(closestPoint[axisFromSide(closestSide)] - rect[closestSide]))
            closestSide = side;
    });
    closestPoint[axisFromSide(closestSide)] = rect[closestSide];
    return new Point(closestPoint);
}
/**
 * @function pointInsideRect
 * @group Utilities
 * @category Geometry
 *
 * @description Check whether a point falls within a rectangle, with a tolerance band so a near miss still
 * counts — useful for hit-testing against a pointer, which rarely lands exactly on target.
 * @param {Coordinate} point - The point to test.
 * @param {DOMRect} rect - The rectangle to test against.
 * @param {number} [margin=5] - How far outside the rectangle still counts as inside, in pixels.
 * @returns {boolean} `true` if the point is inside the rectangle grown by `margin`.
 */
function pointInsideRect(point, rect, margin = 5) {
    return (point.x < rect.right + margin && point.x > rect.left - margin)
        && (point.y < rect.bottom + margin && point.y > rect.top - margin);
}

/**
 * @internal
 * @description The weight-to-sub-name mapping assumed for a font family when
 * {@link FontProperties.stylesPerWeights} is not given. Covers weights 100 through 900 in the naming
 * convention most distributed families follow, such as `Inter-SemiBoldItalic`.
 */
const defaultFamilyWeights = {
    900: { "Black": "normal", "BlackItalic": "italic" },
    800: { "ExtraBold": "normal", "ExtraBoldItalic": "italic" },
    700: { "Bold": "normal", "BoldItalic": "italic" },
    600: { "SemiBold": "normal", "SemiBoldItalic": "italic" },
    500: { "Medium": "normal", "MediumItalic": "italic" },
    400: { "Regular": "normal", "Italic": "italic" },
    300: { "Light": "normal", "LightItalic": "italic" },
    200: { "ExtraLight": "normal", "ExtraLightItalic": "italic" },
    100: { "Thin": "normal", "ThinItalic": "italic" },
};
/**
 * @internal
 * @function createFontFace
 * @description Build one `@font-face` rule for a single weight and style of a font. Each rule lists the same
 * URL under several formats so the browser can pick whichever it supports.
 * @param {string} name - The font family name to register.
 * @param {string} path - Path to the font file.
 * @param {string} format - The preferred format, listed first in the rule.
 * @param {string | number} weight - The weight the rule applies to.
 * @param {string} style - The style the rule applies to, such as `"normal"` or `"italic"`.
 * @returns {string} The `@font-face` rule as CSS text.
 */
function createFontFace(name, path, format, weight, style) {
    return css `
        @font-face {
            font-family: "${name}";
            src: url("${path}") format("${format}"), 
            url("${path}") format("woff"),
            url("${path}") format("truetype");
            font-weight: ${typeof weight == "string" ? "\"" + weight + "\"" : weight};
            font-style: "${style}";
        }`;
}
/**
 * @function loadLocalFont
 * @group Utilities
 * @category Font
 *
 * @description Register a local font with the document, so it can be used by family name in CSS. Generates
 * the `@font-face` rules and injects them as a stylesheet. Whether one file or a whole family is loaded is
 * inferred from the path — see {@link FontProperties}.
 * *Note: the passed object is filled in with the defaults it was missing, so it is modified in place.*
 * @param {FontProperties} font - Describes the font to load. Logs an error if `name` or `pathOrDirectory`
 * is missing.
 */
function loadLocalFont(font) {
    if (!font.name || !font.pathOrDirectory)
        console.error("Please specify font name and path/directory");
    const isFamily = getFileExtension(font.pathOrDirectory).length == 0;
    if (!font.stylesPerWeights)
        font.stylesPerWeights = isFamily ? defaultFamilyWeights : { "normal": "normal" };
    if (!font.format)
        font.format = "woff2";
    if (!font.extension)
        font.extension = ".ttf";
    if (font.extension[0] != ".")
        font.extension = "." + font.extension;
    stylesheet(Object.entries(font.stylesPerWeights).map(([weight, value]) => {
        const weightNumber = Number.parseInt(weight);
        const typedWeight = weightNumber ? weightNumber : weight;
        if (typeof value == "string")
            return createFontFace(font.name, font.pathOrDirectory, font.format, typedWeight, value);
        return Object.entries(value).map(([weightName, style]) => createFontFace(font.name, `${font.pathOrDirectory}/${font.name}-${weightName}${font.extension}`, font.format, typedWeight, style)).join("\n");
    }).join("\n"));
}

export { $, AccessLevel, ActionMode, Anchor, AnchorPoint, ApplyDefaultsMergeProperties, BasicInputEvents, ClickMode, ClosestOrigin, Color, ContentSwitchMode, DefaultClickEventName, DefaultDragEventName, DefaultEventName, DefaultKeyEventName, DefaultMoveEventName, DefaultWheelEventName, Delegate, Direction, GradumBaseElement, GradumButton, GradumButtonPopup, GradumClickEventName, GradumConstrainer, GradumContentSwitch, GradumDragEvent, GradumDragEventName, GradumDrawer, GradumDropdown, GradumElement, GradumEmitter, GradumEvent, GradumEventManager, GradumEventName, GradumGrid, GradumHandler, GradumHeadlessElement, GradumIcon, GradumIconSwitch, GradumIconToggle, GradumInput, GradumInteractor, GradumKeyEvent, GradumKeyEventName, GradumLabelElement, GradumMap, GradumMarkingMenu, GradumModel, GradumMovable, GradumMoveEventName, GradumNestedMap, GradumNodeList, GradumNumericalInput, GradumObserver, GradumOperator, GradumPopup, GradumProxiedElement, GradumQueue, GradumRect, GradumRichElement, GradumSelect, GradumSelectElement, GradumSelectInputEvent, GradumSelectWheel, GradumSelector, GradumTool, GradumView, GradumWeakSet, GradumWheelEvent, GradumWheelEventName, GradumYModel, InOut, InputDevice, Listener, ListenerSet, MathMLNamespace, MathMLTags, NonPassiveEvents, OnOff, Open, Point, PopupFallbackMode, Propagation, Range, RegistryCategory, Reifect, Shown, Side, SideH, SideV, StatefulReifect, SvgNamespace, SvgTags, a, aabbCorners, addInYArray, addInYMap, addRegistryCategory, alphabeticalSorting, areEqual, areSimilar, attachListenersAndBehaviors, auto, behavior, blindElement, blobToUrl, button, cache, callOnce, callOncePerInstance, camelToKebabCase, canvas, checker, clearCache, clearCacheEntry, clearUrlParams, closestPointOnAabb, closestPointOnEdge, closestPointOnSegment, constrainer, createProxy, createYArray, createYDoc, createYMap, css, deepObserveAll, deepObserveAny, define, disposeEffect, div, drawer, eachEqualToAny, effect, element, equalToAny, expose, fetchSvg, findRegistered, flexCol, flexColCenter, flexRow, flexRowCenter, form, formatHHMMSS, formatMMSS, formatMmSs, g, generateTagFunction, getAllRegistered, getConstructorChain, getEventPosition, getFileExtension, getFirstDescriptorInChain, getFirstPrototypeInChainWith, getPrototypeChain, getRegisteredByCategories, getRegisteredElements, getRegisteredEntry, getRegisteredMvc, getSignal, getSuperDescriptor, getSuperMethod, getUrlParam, getVideoDuration, gr, gradum, gradumify, h1, h2, h3, h4, h5, h6, handler, hasPropertyInChain, hasSeparatingAxisForPolygons, hashBySize, hashString, img, initializeEffects, input, interactor, intersectSegments, isNull, isPointInConvexPolygon, isUndefined, isolatedModelSignal, jsonToYjs, kebabToCamelCase, linearInterpolation, link, listener, loadLocalFont, markDirty, markDirtyPath, mod, modelSignal, mutator, nestedModelSignal, observe, operator, p, parse$1 as parse, pointInsideRect, polygonsIntersect, projectPolygonOntoAxis, pushUrlParams, randomFromRange, randomId, randomString, removeFromYArray, replaceUrlParams, segmentIntersectsPolygon, setSignal, signal, solver, spacer, span, stringify, style, stylesheet, textToElement, textarea, tool, trackSignal, trim, untrack, urlToBlob, video };
