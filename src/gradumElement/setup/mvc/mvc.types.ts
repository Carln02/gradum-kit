import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumOperator} from "../../../mvc/operator/operator";
import {GradumHandler} from "../../../mvc/handler/handler";
import {GradumInteractor} from "../../../mvc/interactor/interactor";
import {GradumTool} from "../../../mvc/tool/tool";
import {GradumConstrainer} from "../../../mvc/constrainer/constrainer";

/**
 * @internal
 */
interface GradumElementMvcInterface<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter,
> {
    // -------------------------------------------------------------------------
    // Singular pieces
    // -------------------------------------------------------------------------

    /**
     * @description The view (if any) of the element.
     */
    view: ViewType;

    /**
     * @description The model (if any) of the element.
     */
    model: ModelType;

    /**
     * @description The emitter (if any) of the element.
     */
    emitter: EmitterType;

    // -------------------------------------------------------------------------
    // Data
    // -------------------------------------------------------------------------

    /**
     * @description The main data block (if any) attached to the element, taken from its model (if any).
     */
    data: DataType;

    /**
     * @description The ID of the main data block (if any) of the element, taken from its model (if any).
     */
    dataId: string;

    /**
     * @description The numerical index of the main data block (if any) of the element, taken from its model (if any).
     */
    dataIndex: number;

    /**
     * @description The size (number) of the main data block (if any) of the element, taken from its model (if any).
     */
    readonly dataSize: number;

    // -------------------------------------------------------------------------
    // Others
    // -------------------------------------------------------------------------

    /**
     * @description The operators (if any) attached to the element's MVC structure.
     */
    operators: GradumOperator[];

    /**
     * @description The handlers (if any) attached to the element's model.
     * Returns an empty array if no model is set.
     */
    handlers: GradumHandler[];

    /**
     * @description The interactors (if any) attached to the element's MVC structure.
     */
    interactors: GradumInteractor[];

    /**
     * @description The tools (if any) attached to the element's MVC structure.
     */
    tools: GradumTool[];

    /**
     * @description The constrainers (if any) attached to the element's MVC structure.
     */
    constrainers: GradumConstrainer[];
}

export {GradumElementMvcInterface};