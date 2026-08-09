import {GradumElement} from "../../../gradumElement/gradumElement";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";

/**
 * @class GradumGrid
 * @group Components
 * @category GradumGrid
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
class GradumGrid<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter<any>
> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {

}

export {GradumGrid};