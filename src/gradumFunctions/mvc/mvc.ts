import {GradumSelector} from "../gradumSelector";
import {MvcFunctionsUtils} from "./mvc.utils";
import {GradumConstrainer} from "../../mvc/constrainer/constrainer";
import {GradumTool} from "../../mvc/tool/tool";
import {GradumInteractor} from "../../mvc/interactor/interactor";
import {GradumHandler} from "../../mvc/handler/handler";
import {GradumOperator} from "../../mvc/operator/operator";
import {GradumEmitter} from "../../mvc/emitter/emitter";
import {gradum} from "../gradumFunctions";
import {MvcGenerationProperties, MvcProperties} from "./mvc.types";

/**
 * @internal
 * @description The names of the MVC roles an element can hold, in the order they are attached. Used to
 * split MVC entries out of a properties object and to drive the generic add/get/remove paths.
 */
export const MvcFields = ["model", "view", "emitter", "operators", "handlers", "interactors", "tools", "constrainers"];
const utils = new MvcFunctionsUtils();

/**
 * @internal
 * @function setupMvcFunctions
 * @description Install the MVC functions (`model`, `view`, `emitter`, and the add/get/remove methods for each
 * role) onto the {@link GradumSelector} prototype. Called once by
 * {@link gradumify}; the matching `exclude` option skips it.
 */
export function setupMvcFunctions() {
    Object.defineProperty(GradumSelector.prototype, "mvc", {
        get(this: GradumSelector): MvcProperties {
            const data = utils.peek(this.element);
            if (!data) return {};
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
        get(this: GradumSelector) {
            return utils.peek(this.element)?.model;
        },
        set(this: GradumSelector, value) {
            if (!this.element) return;
            const mvc = utils.data(this.element);
            utils.attachModel(this.element, this.model, false);
            utils.updateModel(this.element, mvc.model, false);
            if (!value) return;
            mvc.model = typeof value === "function" ? (value as any).create() : value;
            utils.attachModel(this.element, mvc.model);
            utils.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });

    Object.defineProperty(GradumSelector.prototype, "view", {
        get(this: GradumSelector) {
            return utils.peek(this.element)?.view;
        },
        set(this: GradumSelector, value) {
            if (!this.element) return;
            utils.data(this.element).view = utils.generateInstance(value, this.element);
            utils.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });

    Object.defineProperty(GradumSelector.prototype, "emitter", {
        get(this: GradumSelector) {
            return utils.peek(this.element)?.emitter;
        },
        set(this: GradumSelector, value) {
            if (!this.element) return;
            utils.data(this.element).emitter = utils.generateInstance(value);
            utils.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });

    // -------------------------------------------------------------------------
    // Data
    // -------------------------------------------------------------------------

    Object.defineProperty(GradumSelector.prototype, "data", {
        get(this: GradumSelector) {
            return utils.peek(this.element)?.model?.data;
        },
        set(this: GradumSelector, value) {
            if (!this.element) return;
            const mvc = utils.data(this.element);
            if (!mvc.model) return;
            mvc.model.data = value;
        },
        configurable: true, enumerable: true,
    });

    Object.defineProperty(GradumSelector.prototype, "metadata", {
        get(this: GradumSelector) {
            return utils.peek(this.element)?.model?.meta;
        },
        configurable: true, enumerable: true,
    });

    Object.defineProperty(GradumSelector.prototype, "dataId", {
        get(this: GradumSelector) {
            return utils.peek(this.element)?.model?.id;
        },
        set(this: GradumSelector, value) {
            if (!this.element) return;
            const mvc = utils.data(this.element);
            if (!mvc.model) return;
            mvc.model.id = value;
        },
        configurable: true, enumerable: true,
    });

    Object.defineProperty(GradumSelector.prototype, "dataIndex", {
        get(this: GradumSelector) {
            return Number.parseInt(this.dataId);
        },
        set(this: GradumSelector, value) {
            this.dataId = value;
        },
        configurable: true, enumerable: true,
    });

    Object.defineProperty(GradumSelector.prototype, "dataSize", {
        get(this: GradumSelector) {
            return utils.peek(this.element)?.model?.dataSize;
        },
        configurable: true, enumerable: true,
    });

    // -------------------------------------------------------------------------
    // Collections
    // -------------------------------------------------------------------------

    Object.defineProperty(GradumSelector.prototype, "operators", {
        get(this: GradumSelector) {
            return Array.from(utils.peek(this.element)?.operators.values() ?? []);
        },
        set(this: GradumSelector, value) {
            if (!this.element) return;
            utils.generateInstances(value, this.element).forEach(instance => this.addOperator(instance));
            utils.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });

    Object.defineProperty(GradumSelector.prototype, "handlers", {
        get(this: GradumSelector) {
            return Array.from(utils.peek(this.element)?.model?.handlers.values() ?? []);
        },
        set(this: GradumSelector, value) {
            if (!this.element) return;
            utils.generateInstances(value).forEach(instance => this.addHandler(instance));
        },
        configurable: true, enumerable: true,
    });

    Object.defineProperty(GradumSelector.prototype, "interactors", {
        get(this: GradumSelector) {
            return Array.from(utils.peek(this.element)?.interactors.values() ?? []);
        },
        set(this: GradumSelector, value) {
            if (!this.element) return;
            utils.generateInstances(value, this.element).forEach(instance => this.addInteractor(instance));
            utils.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });

    Object.defineProperty(GradumSelector.prototype, "tools", {
        get(this: GradumSelector) {
            return Array.from(utils.peek(this.element)?.tools.values() ?? []);
        },
        set(this: GradumSelector, value) {
            if (!this.element) return;
            utils.generateInstances(value, this.element).forEach(instance => this.addTool(instance));
            utils.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });

    Object.defineProperty(GradumSelector.prototype, "constrainers", {
        get(this: GradumSelector) {
            return Array.from(utils.peek(this.element)?.constrainers.values() ?? []);
        },
        set(this: GradumSelector, value) {
            if (!this.element) return;
            utils.generateInstances(value, this.element).forEach(instance => this.addConstrainer(instance));
            utils.linkPieces(this.element);
        },
        configurable: true, enumerable: true,
    });

    // -------------------------------------------------------------------------
    // Main methods
    // -------------------------------------------------------------------------

    GradumSelector.prototype.setMvc = function (this: GradumSelector, properties: MvcGenerationProperties): GradumSelector {
        const mvc = utils.data(this.element);
        for (const [key, value] of Object.entries(gradum(properties).extract(MvcFields))) {
            try {this[key] = value;} catch {}
        }
        if (!mvc.emitter) mvc.emitter = new GradumEmitter();
        if (properties.data && mvc.model) mvc.model.setDataWithoutInitializing(properties.data);
        if (properties.initialize === undefined || properties.initialize) this.initializeMvc();
        return this;
    };

    GradumSelector.prototype.initializeMvc = function (this: GradumSelector): GradumSelector {
        if (!this.element) return this;
        const mvc = utils.peek(this.element);
        if (!mvc) return this;
        mvc.view?.initialize();
        mvc.operators.forEach(operator => operator.initialize());
        mvc.interactors.forEach(interactor => interactor.initialize());
        mvc.tools.forEach(tool => tool.initialize());
        mvc.constrainers.forEach(constrainer => constrainer.initialize());
        mvc.model?.initialize();
        return this;
    }

    GradumSelector.prototype.getMvcDifference = function (
        this: GradumSelector,
        properties: MvcGenerationProperties = {}
    ): MvcGenerationProperties<any, any, any, any> {
        const difference: MvcGenerationProperties = {};

        const toConstructor = <Type>(x: any): (new (...args: any[]) => Type) => {
            if (!x) return;
            if (typeof x === "function") return x;
            if (typeof x === "object") return x.constructor;
        };

        const toConstructorList = <Type>(x: any): (new (...args: any[]) => Type)[] => {
            if (!x) return [];
            const arr = Array.isArray(x) ? x : [x];
            return arr.map(toConstructor).filter(Boolean) as any;
        };

        const processField = (field: string) => {
            if (!this[field]) return;
            const current = toConstructor(this[field]);
            const external = toConstructor(properties[field]);
            if (current === external) return;
            difference[field] = current;
        };

        const processArray = (field: string) => {
            if (!this[field] || this[field].length === 0) return;
            const current = new Set(toConstructorList(this[field]));
            const external = new Set(toConstructorList(properties[field] ?? []));
            const result = [];
            for (const entry of current) if (!external.has(entry)) result.push(entry);
            if (result.length > 0) difference[field] = result;
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
    }


    // -------------------------------------------------------------------------
    // Manipulations
    // -------------------------------------------------------------------------

    GradumSelector.prototype.getOperator = function (this: GradumSelector, key: string) {
        return utils.peek(this.element)?.operators.get(key);
    };

    GradumSelector.prototype.addOperator = function (this: GradumSelector, operator: GradumOperator) {
        if (!this.element) return this;
        if (!operator.keyName) operator.keyName =
            utils.extractClassEssenceName(this.element, operator.constructor as new (...args: any[]) => any, "Operator");
        const data = utils.data(this.element);
        if (data.operators.has(operator.keyName)) return this;
        data.operators.set(operator.keyName, operator);
        utils.updateOperator(this.element, operator);
        return this;
    };

    GradumSelector.prototype.removeOperator = function (this: GradumSelector, keyOrInstance: string | GradumOperator) {
        if (!this.element) return this;
        utils.removeInstance(this.element, "operator", keyOrInstance);
        return this;
    };

    GradumSelector.prototype.getHandler = function (this: GradumSelector, key: string) {
        return utils.peek(this.element)?.model?.handlers.get(key);
    };

    GradumSelector.prototype.addHandler = function (this: GradumSelector, handler: GradumHandler) {
        if (!this.element) return this;
        if (!handler.keyName) handler.keyName =
            utils.extractClassEssenceName(this.element, handler.constructor as new (...args: any[]) => any, "Handler");
        const data = utils.data(this.element);
        if (data.model?.handlers.has(handler.keyName)) return this;
        data.model?.handlers.set(handler.keyName, handler);
        utils.updateHandler(this.element, handler);
        return this;
    };

    GradumSelector.prototype.removeHandler = function (this: GradumSelector, keyOrInstance: string | GradumHandler) {
        if (!this.element) return this;
        utils.removeInstance(this.element, "handler", keyOrInstance);
        return this;
    };

    GradumSelector.prototype.getInteractor = function (this: GradumSelector, key: string) {
        return utils.peek(this.element)?.interactors.get(key);
    };

    GradumSelector.prototype.addInteractor = function (this: GradumSelector, interactor: GradumInteractor) {
        if (!this.element) return this;
        if (!interactor.keyName) interactor.keyName =
            utils.extractClassEssenceName(this.element, interactor.constructor as any, "Interactor");
        const data = utils.data(this.element);
        if (data.interactors.has(interactor.keyName)) return this;
        data.interactors.set(interactor.keyName, interactor);
        utils.updateInteractor(this.element, interactor);
        return this;
    };

    GradumSelector.prototype.removeInteractor = function (this: GradumSelector, keyOrInstance: string | GradumInteractor) {
        if (!this.element) return this;
        utils.removeInstance(this.element, "interactor", keyOrInstance);
        return this;
    };

    GradumSelector.prototype.getTool = function (this: GradumSelector, key: string) {
        return utils.peek(this.element)?.tools.get(key);
    };

    GradumSelector.prototype.addTool = function (this: GradumSelector, tool: GradumTool) {
        if (!this.element) return this;
        if (!tool.keyName) tool.keyName =
            utils.extractClassEssenceName(this.element, tool.constructor as any, "Tool");
        const data = utils.data(this.element);
        if (data.tools.has(tool.keyName)) return this;
        data.tools.set(tool.keyName, tool);
        utils.updateTool(this.element, tool);
        return this;
    };

    GradumSelector.prototype.removeTool = function (this: GradumSelector, keyOrInstance: string | GradumTool) {
        if (!this.element) return this;
        utils.removeInstance(this.element, "tool", keyOrInstance);
        return this;
    };

    GradumSelector.prototype.getConstrainer = function (this: GradumSelector, key: string) {
        return utils.peek(this.element)?.constrainers.get(key);
    };

    GradumSelector.prototype.addConstrainer = function (this: GradumSelector, constrainer: GradumConstrainer) {
        if (!this.element) return this;
        if (!constrainer.keyName) constrainer.keyName =
            utils.extractClassEssenceName(this.element, constrainer.constructor as any, "Constrainer");
        const data = utils.data(this.element);
        if (data.constrainers.has(constrainer.keyName)) return this;
        data.constrainers.set(constrainer.keyName, constrainer);
        utils.updateConstrainer(this.element, constrainer);
        return this;
    };

    GradumSelector.prototype.removeConstrainer = function (this: GradumSelector, keyOrInstance: string | GradumConstrainer) {
        if (!this.element) return this;
        utils.removeInstance(this.element, "constrainer", keyOrInstance);
        return this;
    };
}
