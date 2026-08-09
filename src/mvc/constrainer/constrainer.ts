import {GradumView} from "../view/view";
import {GradumConstrainerProperties} from "./constrainer.types";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {
    ConstrainerSolver,
    ConstrainerCallbackProperties,
    ConstrainerAddCallbackProperties, ConstrainerChecker, ConstrainerMutator, ConstrainerMutatorProperties
} from "../../gradumFunctions/constrainer/constrainer.types";
import {GradumQueue} from "../../gradumComponents/datatypes/queue/queue";
import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";
import {GradumNodeList} from "../../gradumComponents/datatypes/nodeList/nodeList";
import {GradumModel} from "../model/model";
import {GradumEmitter} from "../emitter/emitter";
import {GradumOperator} from "../operator/operator";
import {addRegistryCategory, define} from "../../decorators/define/define";

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
class GradumConstrainer<
    ElementType extends object = object,
    ViewType extends GradumView = GradumView<any, any>,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumOperator<ElementType, ViewType, ModelType, EmitterType> {
    /**
     * @description The key of the constrainer. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the constrainer's class name is MyElementSomethingConstrainer, the key would
     * default to "something".
     */
    public declare keyName: string;

    /**
     * @description The name of the constrainer.
     */
    public readonly constrainerName: string;

    /**
     * @description The property keys of the constrainer solvers defined in the instance.
     */
    public readonly solversMetadata: ConstrainerAddCallbackProperties<ConstrainerSolver>[] = [];

    /**
     * @description The property keys of the constrainer checkers defined in the instance.
     */
    public readonly checkersMetadata: ConstrainerAddCallbackProperties<ConstrainerChecker>[] = [];

    /**
     * @description The property keys of the constrainer mutators defined in the instance.
     */
    public readonly mutatorsMetadata: ConstrainerAddCallbackProperties<ConstrainerMutator>[] = [];

    /**
     * @description The priority of the constrainer. Higher priority constrainers (lower number) should
     * be resolved first. Defaults to 10.
     */
    public priority: number;

    /**
     * @description The list of objects constrained by the constrainer. To manipulate, check {@link GradumNodeList}.
     * Defaults to the children of the element the constrainer is attached to.
     */
    public objectList: GradumNodeList;

    /**
     * @description The list of objects that trigger the constrainer to resolve.
     * Interacting with any of these objects would typically lead to the solving of the given constrainer.
     * To manipulate, check {@link GradumNodeList}. Defaults to the objects in this.objectList.
     */
    public triggerList: GradumNodeList;

    /**
     * @description The default queue template for the constrainer, used when starting a new resolving pass.
     * It defaults to the constrainer's object list.
     */
    public defaultQueue: object[] | GradumQueue<object>;

    /**
     * @description The maximum number of passes allowed per object for this constrainer during resolving.
     * This helps prevent infinite cycles in constraint propagation. Defaults to 5.
     */
    public maxPasses: number;

    /**
     * @description Whether the constrainer is active. Defaults to true.
     */
    public get active(): boolean {
        return gradum(this).activeConstrainers.includes(this.constrainerName);
    }

    public set active(value: boolean) {
        gradum(this).toggleConstrainer(this.constrainerName, value);
    }

    /**
     * @description Delegate fired whenever an object is added to or removed from the constrainer's object list.
     */
    public get onObjectListChange(): Delegate<(object: object, status: "added" | "removed") => void> {
        return gradum(this).onConstrainerObjectListChange(this.constrainerName);
    }

    /**
     * @description The current queue to be processed by the constrainer while resolving.
     */
    public get queue(): GradumQueue<object> {
        return gradum(this).getConstrainerQueue(this.constrainerName);
    }

    /**
     * @constructor
     * @description Create a constrainer bound to an element. If no object list is supplied, it defaults to the
     * element's children, and the trigger list defaults to that same object list.
     * @param {GradumConstrainerProperties} properties - The element to attach to, plus the constrainer name,
     * priority, active state, and activation callbacks.
     */
    public constructor(properties: GradumConstrainerProperties<ElementType, ViewType, ModelType, EmitterType>) {
        super(properties);

        this.constrainerName = properties.constrainerName ?? this.constrainerName ?? undefined;
        if (properties.onActivate) this.onActivate = properties.onActivate;
        if (properties.onDeactivate) this.onDeactivate = properties.onDeactivate;
        if (properties.active !== undefined) this.active = properties.active;
        if (typeof properties.priority === "number") this.priority = properties.priority;

        if (!this.objectList) this.objectList = new GradumNodeList(
            this.element instanceof Element ? this.element.children
                : this.element instanceof Node ? this.element.childNodes
                    : []);
        if (!this.triggerList) this.triggerList = new GradumNodeList(this.objectList);

        this.setup();
    }

    /**
     * @function initialize
     * @override
     * @description Initialization function that calls {@link GradumSelector.makeConstrainer} on `this.element`, sets
     * it up, and attaches all the defined solvers.
     */
    public initialize(): void {
        super.initialize();
        if (!this.constrainerName) return;

        gradum(this).makeConstrainer(this.constrainerName, {
            onActivate: typeof this.onActivate === "function" ? this.onActivate.bind(this) : undefined,
            onDeactivate: typeof this.onDeactivate === "function" ? this.onDeactivate.bind(this) : undefined,
            attachedInstance: this
        });

        this.solversMetadata.forEach(metadata => {
            if (!metadata.name) return;
            gradum(this).addSolver({
                name: metadata.name,
                constrainer: this.constrainerName,
                priority: metadata.priority,
                callback: props => this[metadata.name]?.(props)
            });
        });

        this.checkersMetadata.forEach(metadata => {
            if (!metadata.name) return;
            gradum(this).addChecker({
                name: metadata.name,
                constrainer: this.constrainerName,
                priority: metadata.priority,
                callback: props => this[metadata.name]?.(props)
            });
        });

        this.mutatorsMetadata.forEach(metadata => {
            if (!metadata.name) return;
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
    public getObjectPasses(object: object): number {
        return gradum(this).getObjectPassesForConstrainer(object, this.constrainerName);
    }

    /**
     * @function getObjectData
     * @description Retrieve custom per-object data for this constrainer. It is reset on every new
     * resolving session.
     * @param {object} object - The object to query.
     * @returns {Record<string, any>} The stored data object (or an empty object if none).
     */
    public getObjectData(object: object): Record<string, any> {
        return gradum(this).getObjectDataForConstrainer(object, this.constrainerName);
    }

    /**
     * @function setObjectData
     * @description Set custom per-object data for this constrainer. It is reset on every new resolving session.
     * @param {object} object - The object to update.
     * @param {Record<string, any>} [data] - The new data object to associate with this object.
     * @returns {this} Itself, allowing for method chaining.
     */
    public setObjectData(object: object, data?: Record<string, any>): this {
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
    public addChecker(properties: ConstrainerAddCallbackProperties<ConstrainerChecker>): this {
        gradum(this).addChecker({...properties, constrainer: this.constrainerName});
        return this;
    }

    /**
     * @function removeChecker
     * @description Remove a checker from this constrainer by its name.
     * @param {string} name - The checker name.
     * @returns {this} Itself, allowing for method chaining.
     */
    public removeChecker(name: string): this {
        gradum(this).removeChecker(name, this.constrainerName);
        return this;
    }

    /**
     * @function clearCheckers
     * @description Remove all checkers attached to this constrainer.
     * @returns {this} Itself, allowing for method chaining.
     */
    public clearCheckers(): this {
        gradum(this).clearCheckers(this.constrainerName);
        return this;
    }

    /**
     * @function check
     * @description Evaluate all checkers for this constrainer and return whether the event should proceed or halt.
     * @param {ConstrainerCallbackProperties} [properties] - Context passed to each checker.
     * @returns {boolean} Whether the constrainer passes all checks.
     */
    public check(properties?: ConstrainerCallbackProperties): boolean {
        return gradum(this).checkConstrainer({...properties, constrainer: this.constrainerName});
    }

    /**
     * @function addMutator
     * @description Register a mutator in the constrainer. Mutators compute or transform a value based on the context.
     * @param {ConstrainerAddCallbackProperties<ConstrainerMutator>} properties - Configuration object, including the
     * mutator `callback` to be executed, the `name` of the mutator to access it later, and the `priority` of the mutator.
     * @returns {this} Itself, allowing for method chaining.
     */
    public addMutator(properties: ConstrainerAddCallbackProperties<ConstrainerMutator>): this {
        gradum(this).addMutator({...properties, constrainer: this.constrainerName});
        return this;
    }

    /**
     * @function removeMutator
     * @description Remove a mutator from this constrainer by its name.
     * @param {string} name - The mutator name.
     * @returns {this} Itself, allowing for method chaining.
     */
    public removeMutator(name: string): this {
        gradum(this).removeMutator(name, this.constrainerName);
        return this;
    }

    /**
     * @function clearMutators
     * @description Remove all mutators attached to this constrainer.
     * @returns {this} Itself, allowing for method chaining.
     */
    public clearMutators(): this {
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
    public mutate<Type = any>(properties?: ConstrainerMutatorProperties<Type>): Type {
        return gradum(this).mutate<Type>({...properties, constrainer: this.constrainerName});
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
    public addSolver(properties: ConstrainerAddCallbackProperties<ConstrainerSolver>): this {
        gradum(this).addSolver({...properties, constrainer: this.constrainerName});
        return this;
    }

    /**
     * @function removeSolver
     * @description Remove the given function from the constrainer's list of solvers.
     * @param {string} name - The solver's name.
     * @returns {this} Itself, allowing for method chaining.
     */
    public removeSolver(name: string): this {
        gradum(this).removeSolver(name, this.constrainerName);
        return this;
    }

    /**
     * @function clearSolvers
     * @description Remove all solvers attached to the constrainer.
     * @returns {this} Itself, allowing for method chaining.
     */
    public clearSolvers(): this {
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
    public solve(properties: ConstrainerCallbackProperties = {}): this {
        gradum(this).solveConstrainer({...properties, constrainer: this.constrainerName});
        return this;
    }
}

addRegistryCategory(GradumConstrainer);
define(GradumConstrainer);
export {GradumConstrainer};
