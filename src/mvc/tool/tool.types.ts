import {GradumView} from "../view/view";
import {MakeToolOptions} from "../../gradumFunctions/tool/tool.types";
import {GradumModel} from "../model/model";
import {GradumEmitter} from "../emitter/emitter";
import {GradumOperatorProperties} from "../operator/operator.types";
import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";

/**
 * @type {GradumToolProperties}
 * @group MVC
 * @category Tool
 *
 * @extends GradumOperatorProperties
 * @extends MakeToolOptions
 *
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description Options used to create a new {@link GradumTool} attached to an element.
 * @property {string} [toolName] - The name of the tool.
 * @property {Node} [embeddedTarget] - If the tool is embedded, its target.
 */
type GradumToolProperties<
    ElementType extends object = object,
    ViewType extends GradumView = GradumView,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumOperatorProperties<ElementType, ViewType, ModelType, EmitterType> & MakeToolOptions & {
    toolName?: string,
    embeddedTarget?: Node,
};

declare module "./tool" {
    interface GradumTool<ElementType extends object = object> {
        /**
         * @function customActivation
         * @description Custom activation function.
         * @param {Gradum<Element>} element - The tool element itself.
         * @param {GradumEventManager} [manager] - The event manager instance this tool should register against. Defaults
         * to `GradumEventManager.instance`.
         */
        customActivation(element: ElementType, manager?: GradumEventManager): void;

        /**
         * @function onActivate
         * @description Function to execute when the tool is activated.
         */
        onActivate(): void;

        /**
         * @function onDeactivate
         * @description Function to execute when the tool is deactivated.
         */
        onDeactivate(): void;

        /**
         * @function onEngage
         * @description Function to execute when this tool's element becomes the one the tool is being used
         * through. Where {@link GradumTool.onActivate} says the user picked up this kind of tool — and fires
         * on every element carrying it — this says the interaction reached *this* one, so several elements
         * can share a tool name and still each prepare their own.
         *
         * Nothing fires while the same element keeps being used, however many events that takes.
         * @param {Node} target - What this element's tool is acting on.
         * @param {GradumTool} toolInstance - The tool object the behaviors run against, shared by every element
         * carrying this tool name. Set it up here to have this element's settings be the ones they use.
         */
        onEngage(target: Node, toolInstance: GradumTool): void;

        /**
         * @function onDisengage
         * @description Function to execute when another element takes over a tool this one was being used
         * through.
         * @param {Node} target - What this element's tool had been acting on.
         * @param {GradumTool} toolInstance - The tool object the behaviors run against.
         */
        onDisengage(target: Node, toolInstance: GradumTool): void;
    }
}

export {GradumToolProperties};