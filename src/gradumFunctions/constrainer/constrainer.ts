import {ConstrainerFunctionsUtils} from "./constrainer.utils";
import {GradumSelector} from "../gradumSelector";
import {
    MakeConstrainerOptions,
    ConstrainerSolver,
    ConstrainerCallbackProperties,
    ConstrainerMutator,
    ConstrainerChecker, ConstrainerMutatorProperties, ConstrainerAddCallbackProperties
} from "./constrainer.types";
import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";
import {GradumQueue} from "../../gradumComponents/datatypes/queue/queue";
import {binaryInsert} from "../../utils/computations/arrays";
import {randomString} from "../../utils/computations/random";
import {GradumNodeList} from "../../gradumComponents/datatypes/nodeList/nodeList";

const utils = new ConstrainerFunctionsUtils();

export function setupConstrainerFunctions() {
    GradumSelector.prototype.makeConstrainer = function _makeConstrainer(
        this: GradumSelector,
        constrainer: string,
        options?: MakeConstrainerOptions
    ): GradumSelector {
        if (!utils.getConstrainerData(this, constrainer)) utils.createConstrainer(this, constrainer);
        if (options?.onActivate) this.onConstrainerActivate(constrainer).add(options.onActivate);
        if (options?.onDeactivate) this.onConstrainerDeactivate(constrainer).add(options.onDeactivate);
        if (options?.priority) utils.getConstrainerData(this, constrainer).priority = options.priority;
        if (options?.attachedInstance) {
            utils.getConstrainerData(this, constrainer).attachedInstance = options.attachedInstance;
            // The instance may shadow the data's objectList — rewire the onObjectListChange bridge.
            utils.ensureObjectListBridge(this, constrainer);
        }
        if (options?.active || options?.active === undefined) utils.activate(this, constrainer, true);
        return this;
    }

    Object.defineProperty(GradumSelector.prototype, "constrainersNames", {
        get: function () {
            return utils.getConstrainers(this.element)
        },
        configurable: false,
        enumerable: true
    });

    //ACTIVATION

    Object.defineProperty(GradumSelector.prototype, "activeConstrainers", {
        get: function () {
            return utils.getActiveConstrainers(this.element)
        },
        configurable: false,
        enumerable: true
    });

    GradumSelector.prototype.activateConstrainer = function _activateConstrainers(
        this: GradumSelector,
        ...constrainers: string[]
    ): GradumSelector {
        const targets = constrainers.length ? constrainers : [utils.getDefaultConstrainer(this)];
        targets.forEach(constrainer => {
            if (constrainer) utils.activate(this, constrainer, true);
        });
        return this;
    }

    GradumSelector.prototype.deactivateConstrainer = function _deactivateConstrainers(
        this: GradumSelector,
        ...constrainers: string[]
    ): GradumSelector {
        const targets = constrainers.length ? constrainers : [utils.getDefaultConstrainer(this)];
        targets.forEach(constrainer => {
            if (constrainer) utils.activate(this, constrainer, false);
        });
        return this;
    }

    GradumSelector.prototype.toggleConstrainer = function _toggleConstrainers(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this),
        force?: boolean
    ): GradumSelector {
        if (constrainer) utils.activate(this, constrainer, force);
        return this;
    }

    GradumSelector.prototype.activateOnlyConstrainer = function _activateOnlyConstrainers(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this),
    ): GradumSelector {
        if (constrainer) utils.getConstrainers(this).forEach(enf => utils.activate(this, constrainer, constrainer === enf));
        return this;
    }

    GradumSelector.prototype.activateAllConstrainers = function _activateAllConstrainers(this: GradumSelector): GradumSelector {
        utils.getConstrainers(this).forEach(constrainer => utils.activate(this, constrainer, true));
        return this;
    }

    GradumSelector.prototype.deactivateAllConstrainers = function _deactivateAllConstrainers(this: GradumSelector): GradumSelector {
        utils.getConstrainers(this).forEach(constrainer => utils.activate(this, constrainer, false));
        return this;
    }

    GradumSelector.prototype.onConstrainerActivate = function _onConstrainerActivate(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): Delegate<() => void> {
        return utils.getConstrainerData(this, constrainer)?.onActivate ?? new Delegate();
    }

    GradumSelector.prototype.onConstrainerDeactivate = function _onConstrainerDeactivate(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): Delegate<() => void> {
        return utils.getConstrainerData(this, constrainer)?.onDeactivate ?? new Delegate();
    }

    //PRIORITY

    GradumSelector.prototype.getConstrainerPriority = function _getConstrainerPriority(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): number {
        return utils.getField(this, constrainer, "priority") ?? 0;
    }

    GradumSelector.prototype.setConstrainerPriority = function _setConstrainerPriority(
        this: GradumSelector,
        priority: number,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumSelector {
        if (typeof priority === "number") utils.setField(this, constrainer, "priority", priority);
        return this;
    }

    //OBJECT LIST

    GradumSelector.prototype.getConstrainerObjectList = function _getConstrainerObjectList(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumNodeList {
        utils.ensureObjectListBridge(this, constrainer);
        return utils.getField(this, constrainer, "objectList") ?? new GradumNodeList();
    }

    GradumSelector.prototype.onConstrainerObjectListChange = function _onConstrainerObjectListChange(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): Delegate<(object: object, status: "added" | "removed") => void> {
        utils.ensureObjectListBridge(this, constrainer);
        return utils.getConstrainerData(this, constrainer)?.objectsChangedDelegate ?? new Delegate();
    }

    //TRIGGER LIST

    GradumSelector.prototype.getConstrainerTriggerList = function _getConstrainerTriggerList(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumNodeList {
        return utils.getField(this, constrainer, "triggerList") ?? new GradumNodeList();
    }

    //QUEUE

    GradumSelector.prototype.getConstrainerQueue = function _getConstrainerQueue(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumQueue<object> {
        return utils.getConstrainerData(this, constrainer).queue;
    }

    GradumSelector.prototype.getDefaultConstrainerQueue = function _getDefaultConstrainerQueue(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumQueue<object> {
        const queue = utils.getField(this, constrainer, "defaultQueue");
        if (queue instanceof GradumQueue) return queue.clone();
        else if (queue instanceof Array || queue instanceof Set) return new GradumQueue().push(...queue);
        return new GradumQueue().push(...this.getConstrainerObjectList(constrainer));
    }

    GradumSelector.prototype.setDefaultConstrainerQueue = function _setDefaultConstrainerQueue(
        this: GradumSelector,
        queue: object[] | GradumQueue<object>,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumSelector {
        if (!queue || typeof queue !== "object") return this;
        if (Array.isArray(queue)) queue = new GradumQueue().push(...queue);
        if (queue instanceof GradumQueue) utils.setField(this, constrainer, "defaultQueue", queue.clone());
        return this;
    }

    //PASSES

    GradumSelector.prototype.getObjectPassesForConstrainer = function _getObjectPassesForConstrainer(
        this: GradumSelector,
        object: object,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): number {
        if (!object) return 0;
        const map = utils.getConstrainerData(this, constrainer).passes;
        if (!map || !(map instanceof WeakMap)) return 0;
        return map.get(object) ?? 0;
    }

    GradumSelector.prototype.getMaxPassesForConstrainer = function _getMaxPassesForConstrainer(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): number {
        return utils.getField(this, constrainer, "maxPasses");
    }

    GradumSelector.prototype.setMaxPassesForConstrainer = function _setMaxPassesForConstrainer(
        this: GradumSelector,
        passes: number,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumSelector {
        utils.setField(this, constrainer, "maxPasses", passes);
        return this;
    }

    //CUSTOM DATA

    GradumSelector.prototype.getObjectDataForConstrainer = function _getObjectDataForConstrainer(
        this: GradumSelector,
        object: object,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): Record<string, any> {
        return utils.getCustomData(this.element, constrainer, object);
    }

    GradumSelector.prototype.setObjectDataForConstrainer = function _setObjectDataForConstrainer(
        this: GradumSelector,
        object: object,
        data?: object,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumSelector {
        if (!data || typeof data !== "object") data = {};
        utils.getConstrainerData(this.element, constrainer).customData.set(object, data);
        return this;
    }

    //CHECKER

    GradumSelector.prototype.addChecker = function _addChecker(
        this: GradumSelector,
        properties: ConstrainerAddCallbackProperties<ConstrainerChecker>,
    ): GradumSelector {
        if (!properties || !properties.name || !properties.callback) return this;
        const constrainer = properties.constrainer || utils.getDefaultConstrainer(this);
        utils.getConstrainerData(this, constrainer).checkers?.set(properties.name, properties.callback);
        return this;
    }

    GradumSelector.prototype.removeChecker = function _removeChecker(
        this: GradumSelector,
        name: string,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumSelector {
        utils.getConstrainerData(this, constrainer).checkers?.delete(name);
        return this;
    }

    GradumSelector.prototype.clearCheckers = function _clearCheckers(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumSelector {
        utils.getConstrainerData(this, constrainer).checkers?.clear();
        return this;
    }

    GradumSelector.prototype.checkConstrainer = function _checkConstrainer(
        this: GradumSelector,
        properties?: ConstrainerCallbackProperties
    ): boolean {
        if (!properties) properties = {};
        utils.setupConstrainerCallbackProperties(this, properties);
        if (!properties.constrainer) return true;

        const constrainer = properties.constrainer || utils.getDefaultConstrainer(this);
        for (const checker of utils.getConstrainerData(this, constrainer).checkers.values()) {
            if (!checker(properties)) return false;
        }
        return true;
    }

    GradumSelector.prototype.checkConstrainersForEvent = function _checkConstrainersForEvent(
        this: GradumSelector,
        properties?: ConstrainerCallbackProperties
    ): boolean {
        if (!properties || !properties.event) return true;
        utils.setupConstrainerCallbackProperties(null, properties);
        if (!properties.eventTarget || typeof properties.eventTarget !== "object") {
            properties.eventTarget = this.element;
            if (!properties.eventTarget || typeof properties.eventTarget !== "object") return true;
        }

        const constrainersData = utils.getConstrainersTriggeredByObjects(properties.eventTarget);
        for (const constrainerData of constrainersData) {
            for (const checker of constrainerData.data.checkers.values()) {
                if (!checker({...properties, constrainer: constrainerData.name})) return false;
            }
        }
        return true;
    }

    //MUTATOR

    GradumSelector.prototype.addMutator = function _addMutator(
        this: GradumSelector,
        properties: ConstrainerAddCallbackProperties<ConstrainerMutator>,
    ): GradumSelector {
        if (!properties || !properties.name || !properties.callback) return this;
        const constrainer = properties.constrainer || utils.getDefaultConstrainer(this);
        utils.getConstrainerData(this, constrainer).mutators?.set(properties.name, properties.callback);
        return this;
    }

    GradumSelector.prototype.removeMutator = function _removeMutator(
        this: GradumSelector,
        name: string,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumSelector {
        utils.getConstrainerData(this, constrainer).mutators?.delete(name);
        return this;
    }

    GradumSelector.prototype.clearMutators = function _clearMutators(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumSelector {
        utils.getConstrainerData(this, constrainer).mutators?.clear();
        return this;
    }

    GradumSelector.prototype.mutate = function _mutate(
        this: GradumSelector,
        properties?: ConstrainerMutatorProperties
    ): any {
        if (!properties || !properties.mutation) return;
        utils.setupConstrainerCallbackProperties(this, properties);
        if (!properties.constrainer) return this;

        const mutation = utils.getConstrainerData(this, properties.constrainer).mutators?.get(properties.mutation);
        if (mutation) return mutation(properties);
    }

    //SOLVERS

    GradumSelector.prototype.addSolver = function _addSolver(
        this: GradumSelector,
        properties: ConstrainerAddCallbackProperties<ConstrainerSolver>,
    ): GradumSelector {
        if (!properties || !properties.callback) return this;
        if (!properties.name) properties.name = randomString(8);
        const constrainer = properties.constrainer ?? utils.getDefaultConstrainer(this);

        const data = utils.getConstrainerData(this, constrainer);
        if (!data) return this;

        const name = properties.name;
        delete properties.name;
        delete properties.constrainer;
        if (!properties.priority) properties.priority = 10;

        data.solvers?.set(name, properties as any);
        binaryInsert(data.sortedSolvers, name, (name1, name2) =>
            data.solvers.get(name1).priority - data.solvers.get(name2).priority);
        return this;
    }

    GradumSelector.prototype.removeSolver = function _removeSolver(
        this: GradumSelector,
        name: string,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumSelector {
        const data = utils.getConstrainerData(this, constrainer);
        if (!data) return this;

        data.solvers?.delete(name);
        const index = data.sortedSolvers?.indexOf(name);
        if (index !== undefined && index >= 0) data.sortedSolvers.splice(index, 1);
        return this;
    }

    GradumSelector.prototype.clearSolvers = function _clearSolvers(
        this: GradumSelector,
        constrainer: string = utils.getDefaultConstrainer(this)
    ): GradumSelector {
        const data = utils.getConstrainerData(this, constrainer);
        if (!data) return this;

        data.solvers?.clear();
        data.sortedSolvers = [];
        return this;
    }

    GradumSelector.prototype.solveConstrainer = function _solveConstrainer(
        this: GradumSelector,
        properties: ConstrainerCallbackProperties = {}
    ): GradumSelector {
        if (!properties) properties = {};
        utils.setupConstrainerCallbackProperties(this, properties);
        if (!properties.constrainer) return this;

        const data = utils.getConstrainerData(this, properties.constrainer);
        if (!data) return this;
        utils.solveConstrainerInternal({data, host: this.element, name: properties.constrainer}, properties);
        return this;
    }

    GradumSelector.prototype.solveConstrainersForEvent = function _solveConstrainersForEvent(
        this: GradumSelector,
        properties?: ConstrainerCallbackProperties
    ): GradumSelector {
        if (!properties || !properties.event) return this;
        utils.setupConstrainerCallbackProperties(null, properties);

        if (!properties.eventTarget || typeof properties.eventTarget !== "object") {
            properties.eventTarget = this.element;
            if (!properties.eventTarget || typeof properties.eventTarget !== "object") return this;
        }

        const constrainersData = utils.getConstrainersTriggeredByObjects(properties.eventTarget);
        for (const constrainerData of constrainersData) utils.solveConstrainerInternal(constrainerData, properties);
        return this;
    }
}
