import {GradumInteractorProperties} from "./interactor.types";
import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {GradumView} from "../view/view";
import {ListenerOptions} from "../../gradumComponents/datatypes/listener/listener.types";
import {GradumEmitter} from "../emitter/emitter";
import {GradumModel} from "../model/model";
import {GradumOperator} from "../operator/operator";
import {addRegistryCategory, define} from "../../decorators/define/define";

/**
 * @class GradumInteractor
 * @group MVC
 * @category Interactor
 *
 * @extends GradumOperator
 * @template {object} ElementType - The type of the main component.
 * @template {GradumView} ViewType - The element's MVC view type.
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @template {GradumEmitter} EmitterType - The element's MVC emitter type.
 * @description Class representing an MVC interactor. It holds event listeners to set up on the element itself, or
 * the custom defined target.
 */
class GradumInteractor<
    ElementType extends object = object,
    ViewType extends GradumView = GradumView<any, any>,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumOperator<ElementType, ViewType, ModelType, EmitterType> {
    /**
     * @description The key of the interactor. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the interactor's class name is MyElementSomethingInteractor, the key would
     * default to "something".
     */
    public declare keyName: string;

    /**
     * @description The target of the event listeners. Defaults to the element itself.
     */
    public accessor target: Node;

    /**
     * @readonly
     * @description The name of the tool (if any) to listen for.
     */
    public readonly toolName: string;

    /**
     * @readonly
     * @description The associated event manager. Defaults to `GradumEventManager.instance`.
     */
    public readonly manager: GradumEventManager;

    /**
     *
     * @readonly
     * @description Optional custom options to define per event type.
     */
    public readonly options: ListenerOptions;

    /**
     * @constructor
     * @description Create an interactor bound to an element. Anything omitted from `properties` falls back to
     * the value already declared on the instance, then to a default — the event manager to
     * {@link GradumEventManager.instance}, and the listener options to an empty object.
     * @param {GradumInteractorProperties} properties - The element to attach to, plus the tool name, target,
     * event manager, and listener options.
     */
    public constructor(properties: GradumInteractorProperties<ElementType, ViewType, ModelType, EmitterType>) {
        super(properties);
        this.manager = properties.manager ?? this.manager ?? GradumEventManager.instance;
        this.toolName = properties.toolName ?? this.toolName ?? undefined;
        this.options = properties.listenerOptions ?? {};

        const host = this.element as any;
        try {this.target = properties.target ?? this.target ?? (host instanceof Node ? host
                : host?.element instanceof Node ? host.element
                    : undefined)} catch {}
    }
}

addRegistryCategory(GradumInteractor);
define(GradumInteractor);
export {GradumInteractor};