import {GradumOperator} from "../../mvc/operator/operator";
import {GradumHandler} from "../../mvc/handler/handler";
import {GradumInteractor} from "../../mvc/interactor/interactor";
import {GradumTool} from "../../mvc/tool/tool";
import {GradumConstrainer} from "../../mvc/constrainer/constrainer";
import {GradumView} from "../../mvc/view/view";
import {GradumModel} from "../../mvc/model/model";
import {GradumEmitter} from "../../mvc/emitter/emitter";
import {GradumViewProperties} from "../../mvc/view/view.types";
import {GradumOperatorProperties} from "../../mvc/operator/operator.types";
import {GradumInteractorProperties} from "../../mvc/interactor/interactor.types";
import {GradumToolProperties} from "../../mvc/tool/tool.types";
import {GradumConstrainerProperties} from "../../mvc/constrainer/constrainer.types";

/**
 * @internal
 * @type {MvcInstanceOrConstructor}
 * @template Type - The MVC piece being supplied.
 * @template PropertiesType - The single argument its constructor takes.
 * @description Either a ready-made MVC piece or a constructor to build one from. Lets every role in
 * {@link MvcProperties} accept an instance you have already configured, or a class to instantiate.
 */
export type MvcInstanceOrConstructor<Type, PropertiesType = any> = Type | (new (properties: PropertiesType) => Type);

/**
 * @internal
 * @type {MvcManyInstancesOrConstructors}
 * @template Type - The MVC piece being supplied.
 * @template PropertiesType - The single argument its constructor takes.
 * @description One {@link MvcInstanceOrConstructor} or an array of them, for the roles that accept several
 * pieces — operators, handlers, interactors, tools, and constrainers.
 */
export type MvcManyInstancesOrConstructors<Type, PropertiesType = any> = MvcInstanceOrConstructor<Type, PropertiesType>
    | MvcInstanceOrConstructor<Type, PropertiesType>[];

/**
 * @type {MvcProperties}
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
type MvcProperties<
    ViewType extends GradumView = GradumView<any, any>,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = {
    view?: MvcInstanceOrConstructor<ViewType, GradumViewProperties>,
    model?: ModelType | (new (data?: any, dataBlocksType?: "map" | "array") => ModelType),
    emitter?: MvcInstanceOrConstructor<EmitterType, ModelType>,

    operators?: MvcManyInstancesOrConstructors<GradumOperator, GradumOperatorProperties>,
    handlers?: MvcManyInstancesOrConstructors<GradumHandler, ModelType>,

    interactors?: MvcManyInstancesOrConstructors<GradumInteractor, GradumInteractorProperties>,
    tools?: MvcManyInstancesOrConstructors<GradumTool, GradumToolProperties>,
    constrainers?: MvcManyInstancesOrConstructors<GradumConstrainer, GradumConstrainerProperties>,
};

/**
 * @type {MvcGenerationProperties}
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
type MvcGenerationProperties<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = MvcProperties<ViewType, ModelType, EmitterType> & {
    data?: DataType,
    initialize?: boolean,
};

declare module "../gradumSelector" {
    interface GradumSelector<Type extends object = Node> {

        /**
         * @readonly
         * @category MVC
         * @description Every MVC piece bound to the element — its view, model, emitter, and the operator, handler,
         * interactor, tool, and constrainer collections — in one object.
         */
        readonly mvc: MvcProperties;

        // -------------------------------------------------------------------------
        // Singular pieces
        // -------------------------------------------------------------------------

        /**
         * @category MVC
         * @description The model of the element's MVC structure.
         */
        model: any;

        /**
         * @category MVC
         * @description The view of the element's MVC structure.
         */
        view: any;

        /**
         * @category MVC
         * @description The emitter of the element's MVC structure.
         */
        emitter: any;

        // -------------------------------------------------------------------------
        // Data
        // -------------------------------------------------------------------------

        /**
         * @category MVC
         * @description The main data block attached to the element's model.
         */
        data: any;

        /**
         * @category MVC
         * @description A key-value store attached to the element, backed by its own {@link GradumModel} and
         * created on first read — so it is available whether or not the element has a model of its own. Use
         * it for flags that tools and behaviors read off an element: `selectable`, `dragAndDroppable`, and
         * the like. Assigning a plain object replaces the store's contents; assigning a model adopts it.
         *
         * Reads participate in effect tracking once a signal exists for the key, so
         * `metadata.makeSignal("flag")` at setup makes `metadata.get("flag")` reactive inside an `@effect`.
         */
        get metadata(): GradumModel<object>;
        set metadata(value: GradumModel<object> | object);

        /**
         * @category MVC
         * @description The ID of the main data block of the element's model.
         */
        dataId: string;

        /**
         * @category MVC
         * @description The numerical index of the main data block of the element's model.
         */
        dataIndex: number;

        /**
         * @category MVC
         * @description The size (number) of the main data block of the element's model.
         */
        readonly dataSize: number;

        // -------------------------------------------------------------------------
        // Collections
        // -------------------------------------------------------------------------

        /**
         * @category MVC
         * @description The operators of the element's MVC structure.
         */
        operators: GradumOperator[];

        /**
         * @category MVC
         * @description The handlers attached to the element's model.
         * Returns an empty array if no model is set.
         */
        handlers: GradumHandler[];

        /**
         * @category MVC
         * @description The interactors of the element's MVC structure.
         */
        interactors: GradumInteractor[];

        /**
         * @category MVC
         * @description The tools of the element's MVC structure.
         */
        tools: GradumTool[];

        /**
         * @category MVC
         * @description The constrainers of the element's MVC structure.
         */
        constrainers: GradumConstrainer[];

        // -------------------------------------------------------------------------
        // MVC setup
        // -------------------------------------------------------------------------

        /**
         * @function setMvc
         * @category MVC
         * @description Configures the MVC structure for the element. Sets the provided MVC pieces (model, view,
         * emitter, operators, handlers, interactors, tools, constrainers) on the element, initializes a default
         * emitter if none is provided, and initializes all MVC pieces unless explicitly disabled.
         * @param {MvcGenerationProperties} properties - The properties to configure the MVC structure.
         * @returns {this} Itself, allowing for method chaining.
         */
        setMvc(properties: MvcGenerationProperties): this;

        /**
         * @function initializeMvc
         * @category MVC
         * @description Initializes all MVC pieces attached to the element, in the following order: view,
         * operators, interactors, tools, constrainers, and model. The model is initialized last to allow
         * the view and operators to set up their change callbacks first.
         * @returns {this} Itself, allowing for method chaining.
         */
        initializeMvc(): this;

        /**
         * @function getMvcDifference
         * @category MVC
         * @template {GradumView} ViewType - The element's view type.
         * @template {object} DataType - The element's data type.
         * @template {GradumModel<DataType>} ModelType - The element's model type.
         * @template {GradumEmitter} EmitterType - The element's emitter type.
         * @description Computes the structural difference between the element's current MVC configuration
         * and a provided configuration description. The comparison is constructor-based (not instance-based):
         * - For singular fields (`view`, `model`, `emitter`), the constructors are compared.
         * - For collection fields (`operators`, `handlers`, `interactors`, `tools`, `constrainers`),
         *   the result contains constructors present in the current MVC but absent from the provided configuration.
         * @param {MvcGenerationProperties<ViewType, DataType, ModelType, EmitterType>} [properties={}] -
         *  The configuration to compare against.
         * @returns {MvcGenerationProperties<ViewType, DataType, ModelType, EmitterType>}
         *  A partial configuration of constructors describing pieces present in the current MVC
         *  but not in the provided configuration.
         */
        getMvcDifference<
            ViewType extends GradumView = GradumView<any, any>,
            DataType extends object = object,
            ModelType extends GradumModel = GradumModel,
            EmitterType extends GradumEmitter = GradumEmitter<any>
        >(properties?: MvcGenerationProperties<ViewType, DataType, ModelType, EmitterType>
        ): MvcGenerationProperties<ViewType, DataType, ModelType, EmitterType>;

        // -------------------------------------------------------------------------
        // Operators
        // -------------------------------------------------------------------------

        /**
         * @function getOperator
         * @category MVC
         * @description Retrieves the attached MVC operator with the given key.
         * @param {string} key - The operator's key.
         * @returns {GradumOperator} The operator.
         */
        getOperator(key: string): GradumOperator;

        /**
         * @function addOperator
         * @category MVC
         * @description Adds the given operator to the element's MVC structure.
         * @param {GradumOperator} operator - The operator to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addOperator(operator: GradumOperator): this;

        /**
         * @function removeOperator
         * @category MVC
         * @description Removes the given operator from the element's MVC structure and unlinks it.
         * @param {string | GradumOperator} keyOrInstance - The operator's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeOperator(keyOrInstance: string | GradumOperator): this;

        // -------------------------------------------------------------------------
        // Handlers
        // -------------------------------------------------------------------------

        /**
         * @function getHandler
         * @category MVC
         * @description Retrieves the attached MVC handler with the given key.
         * Returns undefined if no model is set.
         * @param {string} key - The handler's key.
         * @returns {GradumHandler} The handler.
         */
        getHandler(key: string): GradumHandler;

        /**
         * @function addHandler
         * @category MVC
         * @description Adds the given handler to the element's model.
         * If no model is set, this operation is a no-op.
         * @param {GradumHandler} handler - The handler to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addHandler(handler: GradumHandler): this;

        /**
         * @function removeHandler
         * @category MVC
         * @description Removes the given handler from the element's model and unlinks it.
         * If no model is set, this operation is a no-op.
         * @param {string | GradumHandler} keyOrInstance - The handler's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeHandler(keyOrInstance: string | GradumHandler): this;

        // -------------------------------------------------------------------------
        // Interactors
        // -------------------------------------------------------------------------

        /**
         * @function getInteractor
         * @category MVC
         * @description Retrieves the attached MVC interactor with the given key.
         * @param {string} key - The interactor's key.
         * @returns {GradumInteractor} The interactor.
         */
        getInteractor(key: string): GradumInteractor;

        /**
         * @function addInteractor
         * @category MVC
         * @description Adds the given interactor to the element's MVC structure.
         * @param {GradumInteractor} interactor - The interactor to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addInteractor(interactor: GradumInteractor): this;

        /**
         * @function removeInteractor
         * @category MVC
         * @description Removes the given interactor from the element's MVC structure and unlinks it.
         * @param {string | GradumInteractor} keyOrInstance - The interactor's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeInteractor(keyOrInstance: string | GradumInteractor): this;

        // -------------------------------------------------------------------------
        // Tools
        // -------------------------------------------------------------------------

        /**
         * @function getTool
         * @category MVC
         * @description Retrieves the attached MVC tool with the given key.
         * @param {string} key - The tool's key.
         * @returns {GradumTool} The tool.
         */
        getTool(key: string): GradumTool;

        /**
         * @function addTool
         * @category MVC
         * @description Adds the given tool to the element's MVC structure.
         * @param {GradumTool} tool - The tool to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addTool(tool: GradumTool): this;

        /**
         * @function removeTool
         * @category MVC
         * @description Removes the given tool from the element's MVC structure and unlinks it.
         * @param {string | GradumTool} keyOrInstance - The tool's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeTool(keyOrInstance: string | GradumTool): this;

        // -------------------------------------------------------------------------
        // Constrainers
        // -------------------------------------------------------------------------

        /**
         * @function getConstrainer
         * @category MVC
         * @description Retrieves the attached MVC constrainer with the given key.
         * @param {string} key - The constrainer's key.
         * @returns {GradumConstrainer} The constrainer.
         */
        getConstrainer(key: string): GradumConstrainer;

        /**
         * @function addConstrainer
         * @category MVC
         * @description Adds the given constrainer to the element's MVC structure.
         * @param {GradumConstrainer} constrainer - The constrainer to add.
         * @returns {this} Itself, allowing for method chaining.
         */
        addConstrainer(constrainer: GradumConstrainer): this;

        /**
         * @function removeConstrainer
         * @category MVC
         * @description Removes the given constrainer from the element's MVC structure and unlinks it.
         * @param {string | GradumConstrainer} keyOrInstance - The constrainer's key or instance to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeConstrainer(keyOrInstance: string | GradumConstrainer): this;
    }
}

export {MvcProperties, MvcGenerationProperties};
