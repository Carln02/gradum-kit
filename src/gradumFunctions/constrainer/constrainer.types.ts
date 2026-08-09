import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {Propagation} from "../event/event.types";
import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";
import {GradumQueue} from "../../gradumComponents/datatypes/queue/queue";
import {ListenerOptions} from "../../gradumComponents/datatypes/listener/listener.types";
import {GradumConstrainer} from "../../mvc/constrainer/constrainer";
import {GradumNodeList} from "../../gradumComponents/datatypes/nodeList/nodeList";

/**
 * @type {MakeConstrainerOptions}
 * @group Types
 * @category Constrainer
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
type MakeConstrainerOptions = {
    onActivate?: () => void,
    onDeactivate?: () => void,
    priority?: number,
    active?: boolean,
    attachedInstance?: GradumConstrainer
};

/**
 * @type {ConstrainerCallbackProperties}
 * @group Types
 * @category Constrainer
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
type ConstrainerCallbackProperties = {
    constrainer?: string,
    constrainerHost?: object,
    target?: object,
    event?: Event,
    eventType?: string,
    eventTarget?: Node,
    toolName?: string,
    eventOptions?: ListenerOptions,
    manager?: GradumEventManager,
};

/**
 * @type {ConstrainerMutatorProperties}
 * @group Types
 * @category Constrainer
 *
 * @extends ConstrainerCallbackProperties
 * @template Type - The type of the value to mutate.
 * @description The context handed to a mutator as its first argument, naming which mutator to run and the
 * value it should transform. Passed when mutating through {@link GradumSelector.mutate}.
 * @property {string} [mutation] - The name of the mutator to execute.
 * @property {Type} [value] - The value to mutate.
 */
type ConstrainerMutatorProperties<Type = any> = ConstrainerCallbackProperties & {
    mutation?: string,
    value?: Type
};

/**
 * @callback ConstrainerChecker
 * @group Types
 * @category Constrainer
 *
 * @description Signature for a constrainer checker: decides whether the constraint currently holds for the
 * object being processed. Returning `false` stops the event that triggered the check.
 * @param {ConstrainerCallbackProperties} properties - The constrainer context for this pass.
 * @param {...any[]} args - Any extra arguments forwarded by the caller.
 * @returns {boolean} Whether the constraint is satisfied.
 */
type ConstrainerChecker = (properties: ConstrainerCallbackProperties, ...args: any[]) => boolean;

/**
 * @callback ConstrainerMutator
 * @group Types
 * @category Constrainer
 * @template Type - The type of the value being mutated.
 *
 * @description Signature for a constrainer mutator: transforms a value as part of resolving a constraint.
 * @param {ConstrainerMutatorProperties<Type>} properties - The mutation context, naming the mutator and
 * carrying the value.
 * @param {...any[]} args - Any extra arguments forwarded by the caller.
 * @returns {Type} The transformed value.
 */
type ConstrainerMutator<Type = any> = (properties: ConstrainerMutatorProperties<Type>, ...args: any[]) => Type;

/**
 * @callback ConstrainerSolver
 * @group Types
 * @category Constrainer
 *
 * @description Signature for a constrainer solver: adjusts the object so the constraint is satisfied.
 * @param {ConstrainerCallbackProperties} properties - The constrainer context for this pass.
 * @param {...any[]} args - Any extra arguments forwarded by the caller.
 * @returns {Propagation | void} An optional propagation directive for the event that triggered the solve.
 */
type ConstrainerSolver = (properties: ConstrainerCallbackProperties, ...args: any[]) => Propagation | void;

/**
 * @type {ConstrainerAddCallbackProperties}
 * @group Types
 * @category Constrainer
 * @template {ConstrainerChecker | ConstrainerMutator | ConstrainerSolver} Type - The type of callback.
 *
 * @description Options for registering a checker, mutator, or solver on an existing constrainer.
 * @property {string} [name] - The name of the callback to add.
 * @property {Type} [callback] - The callback to add.
 * @property {string} [constrainer] - The constrainer to add the callback to.
 * @property {number} [priority] - The priority of the callback.
 */
type ConstrainerAddCallbackProperties<Type extends ConstrainerChecker | ConstrainerMutator | ConstrainerSolver> = {
    name?: string,
    callback?: Type,
    constrainer?: string,
    priority?: number,
};

declare module "../gradumSelector" {
    interface GradumSelector {
        /**
         * @description Array of all the constrainers attached to this element.
         */
        readonly constrainersNames: string[];

        /**
         * @function makeConstrainer
         * @description Creates a new constrainer attached to this element. Useful to maintain certain constraints or
         * ensure some behaviors persist on a list of objects (by attaching solvers to this constrainer).
         * @param {string} name - The name of the new constrainer.
         * @param {MakeConstrainerOptions} [options] - Options parameter to configure the newly-created constrainer.
         * @returns {this} Itself for chaining.
         */
        makeConstrainer(name: string, options?: MakeConstrainerOptions): this;

        //ACTIVATION

        /**
         * @description Array of active constrainers on this element.
         */
        readonly activeConstrainers: string[];

        /**
         * @function activateConstrainer
         * @description Activate the given constrainer.
         * @param {string[]} constrainers - The name of the constrainer(s) to activate. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        activateConstrainer(...constrainers: string[]): this;

        /**
         * @function deactivateConstrainer
         * @description Deactivate the given constrainer.
         * @param {string[]} constrainers - The name of the constrainer(s) to deactivate. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        deactivateConstrainer(...constrainers: string[]): this;

        /**
         * @function toggleConstrainer
         * @description Toggle the active state of the given constrainer.
         * @param {string} constrainer - The name of the constrainer to toggle. Defaults to the first active constrainer.
         * @param {boolean} [force] - If set, the constrainer's active state will be set to this value.
         * @returns {this} Itself for chaining.
         */
        toggleConstrainer(constrainer?: string, force?: boolean): this;

        /**
         * @function activateOnlyConstrainer
         * @description Activate the provided constrainer and deactivate all other constrainers attached to this element.
         * @param {string} constrainer - The constrainer name to activate as the single active constrainer. Defaults to the
         * first active constrainer.
         * @returns {this} Itself for chaining.
         */
        activateOnlyConstrainer(constrainer: string): this;

        /**
         * @function activateAllConstrainers
         * @description Activate all the constrainers attached to this element.
         * @returns {this} Itself for chaining.
         */
        activateAllConstrainers(): this;

        /**
         * @function deactivateAllConstrainers
         * @description Deactivate all the constrainers attached to this element.
         * @returns {this} Itself for chaining.
         */
        deactivateAllConstrainers(): this;

        /**
         * @function onConstrainerActivate
         * @description Get the delegate fired when the constrainer of the given name is activated.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {Delegate<() => void>} The delegate.
         */
        onConstrainerActivate(constrainer?: string): Delegate<() => void>;

        /**
         * @function onConstrainerDeactivate
         * @description Get the delegate fired when the constrainer of the given name is deactivated.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {Delegate<() => void>} The delegate.
         */
        onConstrainerDeactivate(constrainer?: string): Delegate<() => void>;

        //PRIORITY

        /**
         * @function getConstrainerPriority
         * @description Get the priority of the targeted constrainer. Higher priority constrainers (lower number) should
         * be resolved first.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {number} The constrainer priority.
         */
        getConstrainerPriority(constrainer?: string): number;

        /**
         * @function setConstrainerPriority
         * @description Set the priority of the targeted constrainer. Higher priority constrainers (lower number) should
         * be resolved first.
         * @param {number} priority - The priority value to set.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        setConstrainerPriority(priority: number, constrainer?: string): this;

        //OBJECT LIST

        /**
         * @function getConstrainerObjectList
         * @description Retrieve the list of objects that are constrained by the given constrainer.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {GradumNodeList} The list of objects. To manipulate, check {@link GradumNodeList}.
         */
        getConstrainerObjectList(constrainer?: string): GradumNodeList;

        /**
         * @function onConstrainerObjectListChange
         * @description Get the delegate fired whenever an object is added to or removed from the constrainer's object list.
         * Defaults to the children of the element the constrainer is attached to.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {Delegate<(object: object, status: "added" | "removed") => void>} The delegate.
         */
        onConstrainerObjectListChange(constrainer?: string): Delegate<(object: object, status: "added" | "removed") => void>;

        //TRIGGER LIST

        /**
         * @function getConstrainerTriggerList
         * @description Retrieve the list of objects that trigger the given constrainer to resolve.
         * Interacting with any of these objects would typically lead to the solving of the given constrainer.
         * Defaults to the constrainer's object list.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {GradumNodeList} The list of trigger objects. To manipulate, check {@link GradumNodeList}.
         */
        getConstrainerTriggerList(constrainer?: string): GradumNodeList;

        //QUEUE

        /**
         * @function getConstrainerQueue
         * @description Retrieve the current queue to be processed by the constrainer while resolving.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {GradumQueue<object>} The current constrainer queue.
         */
        getConstrainerQueue(constrainer?: string): GradumQueue<object>;

        /**
         * @function getDefaultConstrainerQueue
         * @description Retrieve the default queue template for the constrainer, used when starting a new resolving pass.
         * It defaults to the constrainer's object list.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {GradumQueue<object>} The default constrainer queue.
         */
        getDefaultConstrainerQueue(constrainer?: string): GradumQueue<object>;

        /**
         * @function setDefaultConstrainerQueue
         * @description Define the default queue template for the constrainer, used when starting a new resolving pass.
         * @param {object[] | GradumQueue<object>} queue - The queue (or list to build a queue from).
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        setDefaultConstrainerQueue(queue: object[] | GradumQueue<object>, constrainer?: string): this;

        //PASSES

        /**
         * @function getObjectPassesForConstrainer
         * @description Retrieve how many times the given object has been processed for the current resolving session
         * of the constrainer.
         * @param {object} object - The object to query.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {number} Number of passes already performed on this object.
         */
        getObjectPassesForConstrainer(object: object, constrainer?: string): number;

        /**
         * @function getMaxPassesForConstrainer
         * @description Get the maximum number of passes allowed per object for this constrainer during resolving.
         * This helps prevent infinite cycles in constraint propagation.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {number} The maximum allowed passes.
         */
        getMaxPassesForConstrainer(constrainer?: string): number;

        /**
         * @function setMaxPassesForConstrainer
         * @description Set the maximum number of passes allowed per object for this constrainer during resolving. This
         * helps prevent infinite cycles in constraint propagation.
         * @param {number} passes - Maximum number of passes.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        setMaxPassesForConstrainer(passes: number, constrainer?: string): this;

        //CUSTOM DATA

        /**
         * @function getObjectDataForConstrainer
         * @description Retrieve custom per-object data for this constrainer. It is reset on every new
         * resolving session.
         * @param {object} object - The object to query.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {Record<string, any>} The stored data object (or an empty object if none).
         */
        getObjectDataForConstrainer(object: object, constrainer?: string): Record<string, any>;

        /**
         * @function setObjectDataForConstrainer
         * @description Set custom per-object data for this constrainer. It is reset on every new resolving session.
         * @param {object} object - The object to update.
         * @param {Record<string, any>} [data] - The new data object to associate with this object.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        setObjectDataForConstrainer(object: object, data?: Record<string, any>, constrainer?: string): this;

        //CHECKER

        /**
         * @function addChecker
         * @description Register a checker in the constrainer. Checkers dictate whether the event should continue
         * executing depending on the provided context (event, tool, target, etc.).
         * @param {ConstrainerAddCallbackProperties<ConstrainerChecker>} properties - Configuration object, including the
         * checker `callback` to be executed, the `name` of the checker to access it later, the name of the attached
         * `constrainer`, and the `priority` of the checker.
         * @returns {this} Itself for chaining.
         */
        addChecker(properties: ConstrainerAddCallbackProperties<ConstrainerChecker>): this;

        /**
         * @function removeChecker
         * @description Remove a checker from the given constrainer by its name.
         * @param {string} name - The checker name.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        removeChecker(name: string, constrainer?: string): this;

        /**
         * @function clearCheckers
         * @description Remove all checkers attached to the given constrainer.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        clearCheckers(constrainer?: string): this;

        /**
         * @function checkConstrainer
         * @description Evaluate all checkers for the targeted constrainer and return whether the event should proceed or halt.
         * @param {ConstrainerCallbackProperties} [properties] - Context passed to each checker.
         * @returns {boolean} Whether the constrainer passes all checks.
         */
        checkConstrainer(properties?: ConstrainerCallbackProperties): boolean;

        /**
         * @function checkConstrainersForEvent
         * @description Evaluate checkers for all relevant constrainers for a given event context.
         * @param {ConstrainerCallbackProperties} [properties] - Event context.
         * @returns {boolean} Whether all the checkers allowed the event to proceed.
         */
        checkConstrainersForEvent(properties?: ConstrainerCallbackProperties): boolean;

        //MUTATOR

        /**
         * @function addMutator
         * @description Register a mutator in the constrainer. Mutators compute or transform a value based on the context.
         * @param {ConstrainerAddCallbackProperties<ConstrainerMutator>} properties - Configuration object, including the
         * mutator `callback` to be executed, the `name` of the mutator to access it later, the name of the attached
         * `constrainer`, and the `priority` of the mutator.
         * @returns {this} Itself for chaining.
         */
        addMutator(properties: ConstrainerAddCallbackProperties<ConstrainerMutator>): this;

        /**
         * @function removeMutator
         * @description Remove a mutator from the given constrainer by its name.
         * @param {string} name - The mutator name.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        removeMutator(name: string, constrainer?: string): this;

        /**
         * @function clearMutators
         * @description Remove all mutators attached to the given constrainer.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        clearMutators(constrainer?: string): this;

        /**
         * @function mutate
         * @template Type - The type of the value to mutate
         * @description Execute a mutator for the targeted constrainer and return the resulting value.
         * @param {ConstrainerMutatorProperties<Type>} [properties] - Context object, including the
         * `mutation` to execute, and the input `value` to mutate.
         * @returns {Type} The mutated result.
         */
        mutate<Type = any>(properties?: ConstrainerMutatorProperties<Type>): Type;

        //SOLVER

        /**
         * @function addSolver
         * @description Register a solver in the constrainer. Solvers typically execute after an event is fired to
         * ensure the constrainer's constraints are maintained. They process all objects in the constrainer's queue,
         * one after the other.
         * @param {ConstrainerAddCallbackProperties<ConstrainerSolver>} properties - Configuration object, including the
         * solver `callback` to be executed, the `name` of the solver to access it later, the name of the attached
         * `constrainer`, and the `priority` of the solver.
         * @returns {this} Itself for chaining.
         */
        addSolver(properties: ConstrainerAddCallbackProperties<ConstrainerSolver>): this;

        /**
         * @function removeSolver
         * @description Remove the given function from the constrainer's list of solvers.
         * @param {string} name - The solver's name.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        removeSolver(name: string, constrainer?: string): this;

        /**
         * @function clearSolvers
         * @description Remove all solvers attached to the constrainer.
         * @param {string} [constrainer] - The name of the targeted constrainer. Defaults to the first active constrainer.
         * @returns {this} Itself for chaining.
         */
        clearSolvers(constrainer?: string): this;

        /**
         * @function solveConstrainer
         * @description Solve the constrainer by executing all of its attached solvers. Each solver will be executed
         * on every object in the constrainer's queue, incrementing its number of passes in the process.
         * @param {ConstrainerCallbackProperties} [properties] - Options object to configure the context.
         * @returns {this} Itself for chaining.
         */
        solveConstrainer(properties?: ConstrainerCallbackProperties): this;

        /**
         * @function solveConstrainersForEvent
         * @description Solve all relevant constrainers for a given event context.
         * @param {ConstrainerCallbackProperties} [properties] - Event context to pass to solvers.
         * @returns {this} Itself for chaining.
         */
        solveConstrainersForEvent(properties?: ConstrainerCallbackProperties): this;
    }
}

export {MakeConstrainerOptions, ConstrainerSolver, ConstrainerChecker, ConstrainerMutator, ConstrainerMutatorProperties, ConstrainerCallbackProperties, ConstrainerAddCallbackProperties};
