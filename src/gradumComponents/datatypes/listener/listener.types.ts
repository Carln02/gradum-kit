import {Propagation} from "../../../gradumFunctions/event/event.types";
import {GradumEventManager} from "../../../eventHandling/gradumEventManager/gradumEventManager";

/**
 * @type {ListenerProperties}
 * @group Components
 * @category Listener
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
type ListenerProperties<
    TargetType extends Node = Node,
    CallbackType extends ListenerCallback<TargetType> = ListenerCallback<TargetType>
> = {
    type: string,
    callback: CallbackType,
    target?: TargetType,
    toolName?: string,
    options?: ListenerOptions,
    manager?: GradumEventManager
};

/**
 * @type {MatchListenerProperties}
 * @group Components
 * @category Listener
 *
 * @extends ListenerProperties
 * @template {Node} TargetType - The type of the event target.
 * @template {ListenerCallback<TargetType>} CallbackType - The type of the callback executed by this listener.
 * @description A partial {@link ListenerProperties} used as a search pattern by {@link Listener.match}.
 * Only the fields present are compared, so an empty pattern matches every listener.
 * @property {string[]} [optionsToSkip] - Option keys to ignore when comparing `options`.
 */
type MatchListenerProperties<
    TargetType extends Node = Node,
    CallbackType extends ListenerCallback<TargetType> = ListenerCallback<TargetType>
> = Partial<ListenerProperties<TargetType, CallbackType>> & {
    optionsToSkip?: string[]
};

/**
 * @callback ListenerCallback
 * @group Components
 * @category Listener
 * @template {Node} Type - The type of the event target.
 * @description Callback signature for listeners. Receives the native event and the resolved target.
 * @param {Event} e - The native event.
 * @param {Type} el - The target element/node the listener is bound to.
 * @returns {Propagation | any} A propagation directive (or any value).
 */
type ListenerCallback<Type extends Node = Node> = ((e: Event, el: Type) => Propagation | any);

/**
 * @type {ListenerOptions}
 * @group Components
 * @category Listener
 * @extends AddEventListenerOptions
 * @description Options used for listeners.
 * @property {boolean} [checkConstrainers] - If true, checks constrainers before execution. Defaults to true.
 * @property {boolean} [solveConstrainers] - If true, triggers constrainer solving after execution. Defaults to true.
 * @property {number} [throttleEveryFrames] - Throttle execution to at most once every N animation frames.
 * @property {number} [throttleEveryMs] - Throttle execution to at most once every N milliseconds.
 */
type ListenerOptions = AddEventListenerOptions & {
    checkConstrainers?: boolean,
    solveConstrainers?: boolean,
    throttleEveryFrames?: number,
    throttleEveryMs?: number,
};

export {ListenerProperties, ListenerOptions, ListenerCallback, MatchListenerProperties};