import {GradumEventManagerStateProperties} from "../../eventHandling/gradumEventManager/gradumEventManager.types";
import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {ListenerCallback, ListenerOptions} from "../../gradumComponents/datatypes/listener/listener.types";
import {ListenerSet} from "../../gradumComponents/datatypes/listener/listenerSet";
import {Point} from "../../gradumComponents/datatypes/point/point";

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
enum Propagation {
    propagate = "propagate",
    stopPropagation = "stopPropagation",
    stopImmediatePropagation = "stopImmediatePropagation",
}

/**
 * @callback HitResolver
 * @group GradumSelector
 * @category Events
 *
 * @description Finds the objects an element is displaying at a screen position. Assign one to an element
 * whose contents the DOM cannot see into — a canvas, a WebGL surface — and the objects it returns join the
 * event dispatch as if they were children of it. See {@link GradumSelector.hitResolver}.
 * @param {Point} position - The screen position to test.
 * @param {Event} event - The event being dispatched, for resolvers that answer differently per event.
 * @returns {object[]} The objects at that position, topmost first. Return an empty array for a miss.
 */
type HitResolver = (position: Point, event: Event) => object[];

/**
 * @type {PreventDefaultOptions}
 * @group GradumSelector
 * @category Events
 *
 * @description The long form of {@link GradumSelector.preventDefaults}, for naming which event types the
 * decision should reach and what else to do with them. The short forms — a boolean or a predicate — are
 * this with everything but `on` left at its default.
 * @property {string[]} [types] - List of event types to affect. If omitted, defaults to {@link BasicInputEvents}.
 * @property {"capture" | "bubble"} [phase] - Which phase to prevent. Defaults to `"bubble"`.
 * @property {false | "stop" | "immediate"} [stop] - Whether to stop propagation when handling the event:
 * - `false`: do not stop propagation,
 * - `"stop"`: call `stopPropagation`,
 * - `"immediate"`: call `stopImmediatePropagation`.
 * @property {boolean | ((type: string, e: Event) => boolean)} [on=true] - The decision itself: whether to
 * cancel, or a predicate deciding per event.
 * @property {boolean} [clearPreviousListeners] - If true, clears previously installed prevent-default listeners
 * before installing new ones.
 * @property {GradumEventManager} [manager] - Event manager to use. Defaults to {@link GradumEventManager.instance}.
 */
type PreventDefaultOptions = {
    types?: string[],
    phase?: "capture" | "bubble",
    stop?: false | "stop" | "immediate",
    on?: boolean | ((type: string, e: Event) => boolean),
    clearPreviousListeners?: boolean,
    manager?: GradumEventManager
};

/**
 * @type {PreventDefaultsSetting}
 * @group GradumSelector
 * @category Events
 *
 * @description What {@link GradumSelector.preventDefaults} accepts: `true` or `false` to settle it for a
 * subtree, a predicate to decide per event, or {@link PreventDefaultOptions} to also say which event types
 * the decision should reach.
 */
type PreventDefaultsSetting = boolean
    | ((type: string, e: Event) => boolean)
    | PreventDefaultOptions;

/**
 * @group GradumSelector
 * @category Events
 * @description Default set of basic input event types reached by {@link GradumSelector.preventDefaults}.
 * The pointer and wheel events are absent on purpose: the event manager already asks the same question
 * before cancelling those, so a listener for them here would only cancel what is cancelled already.
 */
const BasicInputEvents = [
    "mousedown", "mouseup", "mousemove", "click", "dblclick", "contextmenu",
    "dragstart", "selectstart",
    "touchstart", "touchmove", "touchend", "touchcancel"
] as const;

/**
 * @group GradumSelector
 * @category Events
 * @description Event types that should usually be registered as **non-passive** when you intend to call
 *  * `preventDefault()` (e.g., scroll/touch/pointer interactions).
 */
const NonPassiveEvents = [
    "wheel", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointercancel"
] as const;

declare module "../gradumSelector" {
    interface GradumSelector {
        /**
         * @category Events
         * @description Readonly set of listeners bound to this node.
         */
        readonly boundListeners: ListenerSet;

        /**
         * @category Events
         * @description When to stand the event manager down for this element, so the browser's own handling
         * of an event reaches it untouched. Assign a predicate: `true` stands the manager down entirely,
         * `false` leaves it alone, and a {@link GradumEventManagerStateProperties} names which parts to
         * stand down — `{preventDefaultMouse: true}` lets the mouse behave natively while the manager goes
         * on dispatching.
         *
         * The decision is taken per event, as it is dispatched, and holds until a press lands outside this
         * element.
         *
         * @example
         * ```ts
         * //Native text selection inside this element, Gradum everywhere else.
         * gradum(field).bypassManagerOn = () => ({preventDefaultMouse: true});
         * ```
         */
        bypassManagerOn: (e: Event) => boolean | GradumEventManagerStateProperties;

        /**
         * @category Events
         * @description Lets an element contribute targets the DOM cannot see. Assign a {@link HitResolver} to
         * an element that paints its contents — a canvas — and whatever it reports at the pointer joins the
         * dispatch as if it were a child of it: capture reaches it last, bubble reaches it first, and it can
         * carry listeners, tools, and constrainers like any element.
         *
         * *Note: the objects are looked up once per event, so keep the resolver cheap — test bounding boxes
         * before exact shapes.*
         *
         * @example
         * ```ts
         * gradum(canvas).hitResolver = position => scene.objectsAt(position); //topmost first
         * ```
         */
        hitResolver: HitResolver;

        /**
         * @category Events
         * @description The object to treat as this one's parent when it has no DOM parent, letting a virtual
         * hit target still be found by {@link GradumEvent.closest} and still trigger the constrainers of the
         * element that drew it. Held weakly, so naming a parent never keeps it alive.
         *
         * *Note: objects returned by a {@link HitResolver} get the resolving element as their parent
         * automatically. Assign this only for a scene that nests, where the real parent is another object.*
         */
        hitParent: object;

        /**
         * @function getParent
         * @category Events
         * @description One step up the tree, for a DOM node and a virtual hit target alike: the DOM parent
         * when there is one, otherwise the {@link GradumSelector.hitParent}. This is the climb
         * {@link GradumEvent.closest} and the constrainer checks follow, so an object painted inside a canvas
         * still reaches the element that drew it and everything above that.
         * @returns {object} The parent, or `undefined` at the top of the chain.
         */
        getParent(): object;

        /**
         * @function on
         * @category Events
         * @template {Node} Type - The type of the element.
         * @description Adds an event listener to the element.
         * @param {string} type - The type of the event.
         * @param {ListenerCallback<Type>} listener - The function that receives a notification.
         * @param {ListenerOptions} [options] - An options object that specifies characteristics
         * about the event listener.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        on<Type extends Node>(type: string, listener: ListenerCallback<Type>,
                              options?: ListenerOptions, manager?: GradumEventManager): this;

        /**
         * @function onTool
         * @category Events
         * @template {Node} Type - The type of the element.
         * @description Adds an event listener to the element.
         * @param {string} type - The type of the event.
         * @param {string} toolName - The name of the tool. Set to null or undefined to check for listeners not bound
         * to a tool.
         * @param {ListenerCallback<Type>} listener - The function that receives a notification.
         * @param {ListenerOptions} [options] - An options object that specifies characteristics
         * about the event listener.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        onTool<Type extends Node>(type: string, toolName: string, listener: ListenerCallback<Type>,
                                  options?: ListenerOptions, manager?: GradumEventManager): this;

        /**
         * @function executeAction
         * @category Events
         * @description Execute the listeners bound on this element for the given `type` and `toolName`. Simulates
         * firing a `type` event on the element with `toolName` active.
         * @param {string} type -  The type of the event.
         * @param {string} toolName - The name of the tool. Set to null or undefined to fire listeners not bound
         * to a tool.
         * @param {Event} event - The event to pass as parameter to the listeners.
         * @param {ListenerOptions} [options] - Options object that specifies characteristics
         * about the event listeners to fire.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         */
        executeAction(type: string, toolName: string, event: Event, options?: ListenerOptions, manager?:
        GradumEventManager): Propagation;

        /**
         * @function hasListener
         * @category Events
         * @description Checks if the given event listener is bound to the element (in its boundListeners list).
         * @param {string} type - The type of the event. Set to null or undefined to get all event types.
         * @param {ListenerCallback} listener - The function that receives a notification.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {boolean} Whether the element has the given listener.
         */
        hasListener(type: string, listener: ListenerCallback, manager?: GradumEventManager): boolean;

        /**
         * @function hasToolListener
         * @category Events
         * @description Checks if the given event listener is bound to the element (in its boundListeners list).
         * @param {string} type - The type of the event. Set to null or undefined to get all event types.
         * @param {string} toolName - The name of the tool the listener is attached to. Set to null or undefined
         * to check for listeners not bound to a tool.
         * @param {ListenerCallback} listener - The function that receives a notification.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {boolean} Whether the element has the given listener.
         */
        hasToolListener(type: string, toolName: string, listener: ListenerCallback,
                    manager?: GradumEventManager): boolean;

        /**
         * @function hasListenersByType
         * @category Events
         * @description Checks if the element has bound listeners of the given type (in its boundListeners list).
         * @param {string} type - The type of the event. Set to null or undefined to get all event types.
         * @param {string} toolName - The name of the tool to consider (if any). Set to null or undefined
         * to check for listeners not bound to a tool.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {boolean} Whether the element has a listener of this type.
         */
        hasListenersByType(type: string, toolName?: string, manager?: GradumEventManager): boolean;

        /**
         * @function removeListener
         * @category Events
         * @description Removes an event listener that is bound to the element (in its boundListeners list).
         * @param {string} type - The type of the event.
         * @param {ListenerCallback} listener - The function that receives a notification.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeListener(type: string, listener: ListenerCallback, manager?: GradumEventManager): this;

        /**
         * @function removeToolListener
         * @category Events
         * @description Removes an event listener that is bound to the element (in its boundListeners list).
         * @param {string} type - The type of the event.
         * @param {string} toolName - The name of the tool the listener is attached to. Set to null or undefined
         * to check for listeners not bound to a tool.
         * @param {ListenerCallback} listener - The function that receives a notification.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeToolListener(type: string, toolName: string, listener: ListenerCallback, manager?: GradumEventManager): this;

        /**
         * @function removeListenersByType
         * @category Events
         * @description Removes all event listeners bound to the element (in its boundListeners list) assigned to the
         * specified type.
         * @param {string} type - The type of the event. Set to null or undefined to consider all types.
         * @param {string} [toolName] - The name of the tool associated (if any). Set to null or undefined
         * to check for listeners not bound to a tool.
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeListenersByType(type: string, toolName?: string, manager?: GradumEventManager): this;

        /**
         * @function removeAllListeners
         * @category Events
         * @description Removes all event listeners bound to the element (in its boundListeners list).
         * @param {GradumEventManager} [manager] - The associated event manager. Defaults to the first created manager,
         * or a new instantiated one if none already exist.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeAllListeners(manager?: GradumEventManager): this;

        /**
         * @category Events
         * @description Prevent default browser behavior on the provided event types. By default, all basic input events
         * will be processed.
         * @param {PreventDefaultOptions} [options] - An options object to customize the behavior of the function.
         */

        /**
         * @category Events
         * @description Whether the browser's own handling may be cancelled on this node and everything
         * inside it — moving focus, placing a caret, extending a selection, scrolling, pinching. The one
         * decision behind every cancellation: the event manager reads it before preventing a pointer or
         * wheel event, and so do the listeners {@link GradumSelector.preventDefault} installs.
         *
         * Assign a boolean to settle it for a subtree, a `(type, e) => boolean` to decide per event, or a
         * {@link PreventDefaultOptions} to say which event types it should reach. Unset by default, and
         * then the nearest ancestor that was set decides — failing which, text entry is left alone and
         * everything else may be cancelled. Reading gives what was set on this node alone, not what it
         * inherits; {@link GradumSelector.shouldPreventDefaults} gives the resolved answer.
         *
         * Setting it is all it takes: the event manager reads it before cancelling a pointer or wheel
         * event, and anything else worth cancelling — selecting, dragging, the context menu — gets a
         * listener bound here that reads the same answer.
         *
         * @example
         * ```ts
         * gradum(canvas).preventDefaults = true;            //nothing the browser would do by itself
         * gradum(scrollContainer).preventDefaults = false;  //this part is the browser's
         * gradum(board).preventDefaults = (type) => type !== "contextmenu";
         * gradum(board).preventDefaults = {types: ["selectstart"], stop: "stop"};
         * ```
         */
        preventDefaults: PreventDefaultsSetting;

        /**
         * @function shouldPreventDefaults
         * @category Events
         * @description Whether the browser's own handling may be cancelled for an interaction on this node:
         * the answer {@link GradumSelector.preventDefaults} resolves to, read from the nearest ancestor
         * with an opinion. Asked before anything is cancelled; ask it yourself to decide the same way
         * somewhere else.
         * @param {string} [type] - The event type being decided, for a node that answers with a function.
         * @param {Event} [e] - The event being decided, likewise.
         * @returns {boolean} Whether the default may be cancelled.
         */
        shouldPreventDefaults(type?: string, e?: Event): boolean;
    }
}

export {Propagation, PreventDefaultOptions, PreventDefaultsSetting, BasicInputEvents, NonPassiveEvents, HitResolver};
