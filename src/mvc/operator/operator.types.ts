import {GradumView} from "../view/view";
import {GradumModel} from "../model/model";
import {GradumEmitter} from "../emitter/emitter";
import {GradumViewProperties} from "../view/view.types";

/**
 * @type {GradumOperatorProperties}
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
type GradumOperatorProperties<
    ElementType extends object = object,
    ViewType extends GradumView = GradumView,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumViewProperties<ElementType, ModelType, EmitterType> & {
    view?: ViewType
};

export {GradumOperatorProperties};
