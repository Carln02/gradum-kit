import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {GradumView} from "../view/view";
import {ListenerOptions} from "../../gradumComponents/datatypes/listener/listener.types";
import {GradumModel} from "../model/model";
import {GradumEmitter} from "../emitter/emitter";
import {GradumOperatorProperties} from "../operator/operator.types";

/**
 * @type {GradumInteractorProperties}
 * @group MVC
 * @category Interactor
 *
 * @extends {GradumOperatorProperties}
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description  Options used to create a new {@link GradumInteractor} attached to an element.
 * @property {string} [toolName] - The name of the tool (if any) that the event listeners will listen for.
 * @property {Node} [target] - The target that will listen for the events. Defaults to `this.element`.
 * @property {PartialRecord<DefaultEventNameKey, ListenerOptions>} [listenerOptions] - Custom default options to define
 * for all listeners.
 * @property {GradumEventManager} [manager] - The event manager instance the listeners should register against. Defaults
 * to `GradumEventManager.instance`.
 */
type GradumInteractorProperties<
    ElementType extends object = object,
    ViewType extends GradumView = GradumView,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumOperatorProperties<ElementType, ViewType, ModelType, EmitterType> & {
    manager?: GradumEventManager,
    toolName?: string,
    target?: Node,
    listenerOptions?: ListenerOptions
};

export {GradumInteractorProperties};