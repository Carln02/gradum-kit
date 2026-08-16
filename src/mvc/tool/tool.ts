import {GradumView} from "../view/view";
import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {GradumToolProperties} from "./tool.types";
import {gradum} from "../../gradumFunctions/gradumFunctions";
import {ClickMode} from "../../eventHandling/gradumEventManager/gradumEventManager.types";
import {DefaultEventName, DefaultEventNameEntry} from "../../types/eventNaming.types";
import {GradumEmitter} from "../emitter/emitter";
import {GradumModel} from "../model/model";
import {GradumOperator} from "../operator/operator";
import {addRegistryCategory, define} from "../../decorators/define/define";

/**
 * @class GradumTool
 * @group MVC
 * @category Tool
 *
 * @extends GradumOperator
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 * @description A named mode that changes what interacting with an element does. Its `@behavior` methods run
 * during the capture phase of the event loop, before any interactor sees the event, so a tool can claim an
 * interaction and stop it reaching the element underneath. Only the active tool for a given click mode
 * receives events.
 */
class GradumTool<
    ElementType extends object = object,
    ViewType extends GradumView = GradumView<any, any>,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumOperator<ElementType, ViewType, ModelType, EmitterType> {
    /**
     * @description The key of the tool. Used to retrieve it in the main component. If not set, if the element's
     * class name is MyElement and the tool's class name is MyElementSomethingTool, the key would
     * default to "something".
     */
    public declare keyName: string;

    /**
     * @description The name of the tool.
     */
    public toolName: string;

    /**
     * @readonly
     * @description The target of this tool. If defined, will embed the tool.
     */
    public readonly embeddedTarget: Node;

    /**
     * @readonly
     * @description The associated event manager. Defaults to `GradumEventManager.instance`.
     */
    public readonly manager: GradumEventManager;

    /**
     * @readonly
     * @description Custom activation event to listen to. Defaults to the default click event name.
     */
    public readonly activationEvent: DefaultEventNameEntry = DefaultEventName.click;

    /**
     * @readonly
     * @description Click mode that will hold this tool when activated. Defaults to `ClickMode.left`.
     */
    public readonly clickMode: ClickMode = ClickMode.left;

    /**
     * @readonly
     * @description Optional keyboard key to map to this tool. When pressed, it will be set as the current key tool.
     */
    public readonly key: string;

    /**
     * @description CSS class or classes marking that this tool is the active one, added when it is activated and
     * removed when it is not. A tool changes what interacting means, and the page usually has to show it —
     * a different cursor, text that no longer takes a caret — which is a matter for CSS rather than for the
     * tool itself.
     * @example
     * ```ts
     * class EraserTool extends GradumTool {
     *   public toolName = "eraser";
     *   public activeClasses = "erasing";  //body.erasing in the stylesheet
     * }
     * ```
     */
    public activeClasses: string | string[];

    /**
     * @description What carries {@link GradumTool.activeClasses}. Defaults to `document.body`, so a
     * stylesheet can reach anything on the page from it.
     */
    public activeClassesTarget: Element;

    /**
     * @constructor
     * @description Create a tool bound to an element. Anything omitted from `properties` falls back to the
     * value already declared on the instance, then to a default — the event manager to
     * {@link GradumEventManager.instance}, the activation event to the default click name, and the click mode
     * to `ClickMode.left`.
     * @param {GradumToolProperties} properties - The element to attach to, plus the tool name, embedded
     * target, activation event, click mode, mapped key, and activation callbacks.
     */
    public constructor(properties: GradumToolProperties<ElementType, ViewType, ModelType, EmitterType>) {
        super(properties);
        this.toolName = properties.toolName ?? this.toolName ?? undefined;
        if (properties.embeddedTarget) this.embeddedTarget = properties.embeddedTarget;

        if (properties.onActivate) this.onActivate = properties.onActivate;
        if (properties.onDeactivate) this.onDeactivate = properties.onDeactivate;
        if (properties.activationEvent) this.activationEvent = properties.activationEvent;
        if (properties.clickMode) this.clickMode = properties.clickMode;
        if (properties.customActivation) this.customActivation = properties.customActivation;
        if (properties.key) this.key = properties.key;
        if (properties.activeClasses) this.activeClasses = properties.activeClasses;
        if (properties.activeClassesTarget) this.activeClassesTarget = properties.activeClassesTarget;
        this.manager = properties.manager ?? this.manager ?? GradumEventManager.instance;
        this.setup();
    }

    /**
     * @function initialize
     * @override
     * @description Initialization function that calls {@link GradumSelector.makeTool} on `this.element`, sets it up,
     * and attaches all the defined tool behaviors.
     */
    public initialize(): void {
        if (this.toolName) gradum(this).makeTool(this.toolName, {
            onActivate: typeof this.onActivate === "function" ? this.onActivate.bind(this) : undefined,
            onDeactivate: typeof this.onDeactivate === "function" ? this.onDeactivate.bind(this) : undefined,
            activationEvent: this.activationEvent,
            clickMode: this.clickMode,
            customActivation: typeof this.customActivation === "function" ? this.customActivation.bind(this) : undefined,
            key: this.key,
            activeClasses: this.activeClasses,
            activeClassesTarget: this.activeClassesTarget,
            manager: this.manager,
        });

        if (this.embeddedTarget) gradum(this).embedTool(this.embeddedTarget, this.manager);
        super.initialize();
    }
}

addRegistryCategory(GradumTool);
define(GradumTool);
export {GradumTool};