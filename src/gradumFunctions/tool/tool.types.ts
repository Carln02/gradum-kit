import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";
import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {ClickMode} from "../../eventHandling/gradumEventManager/gradumEventManager.types";
import {DefaultEventNameEntry} from "../../types/eventNaming.types";
import {Propagation} from "../event/event.types";

/**
 * @type {MakeToolOptions}
 * @group GradumSelector
 * @category Tools
 *
 * @description Options used to create a new tool attached to an element via {@link GradumSelector.makeTool}.
 * @property {() => void} [onActivate] - Function to execute when the tool is activated.
 * @property {() => void} [onDeactivate] - Function to execute when the tool is deactivated.
 * @property {(target: Node, toolInstance: object) => void} [onEngage] - Function to execute when this element
 * becomes the one the tool is being used through. Handed the tool object the behaviors run against.
 * @property {(target: Node, toolInstance: object) => void} [onDisengage] - Function to execute when another
 * element takes over.
 * @property {DefaultEventNameEntry} [activationEvent] - Custom activation event to listen to. Defaults to the
 * default click event name.
 * @property {ClickMode} [clickMode] -  Click mode that will hold this tool when activated. Defaults to `ClickMode.left`.
 * @property {(element: Gradum<Element>, manager: GradumEventManager) => void} [customActivation] - Custom activation
 * function. If provided, is called with `(el, manager)` to define when the tool is activated.
 * @property {string} [key] - Optional keyboard key to map to this tool. When pressed, it will be set as the current key tool.
 * @property {string | string[]} [activeClasses] - Class or classes marking that this tool is active.
 * @property {Element} [activeClassesTarget] - What carries the active classes. Defaults to `document.body`.
 * @property {GradumEventManager} [manager] - The event manager instance this tool should register against. Defaults
 * to `GradumEventManager.instance`.
 */
type MakeToolOptions<ElementType extends object = object> = {
    clickMode?: ClickMode,
    key?: string,

    onActivate?: () => void,
    onDeactivate?: () => void,
    onEngage?: (target: Node, toolInstance: object) => void,
    onDisengage?: (target: Node, toolInstance: object) => void,
    activationEvent?: DefaultEventNameEntry,
    customActivation?: (element: ElementType, manager?: GradumEventManager) => void,

    activeClasses?: string | string[],
    activeClassesTarget?: Element

    manager?: GradumEventManager
};

/**
 * @type {ToolBehaviorCallback}
 * @group GradumSelector
 * @category Tools
 *
 * @description Function signature for a tool behavior. Returning `true` marks the behavior as handled/consumed,
 * leading to stopping the propagation of the event.
 * @param {Event} event - The original DOM/Gradum event.
 * @param {Node} target - The node the behavior should operate on (the object or its embedded target).
 * @param {ToolBehaviorOptions} [options] - Additional info (embedded context, etc.).
 * @returns {boolean} Whether to stop the propagation.
 */
type ToolBehaviorCallback<TargetType extends Node = Node> = (event: Event, target: TargetType, options?: ToolBehaviorOptions) => Propagation | any;

/**
 * @type {ToolBehaviorOptions}
 * @group GradumSelector
 * @category Tools
 *
 * @description Options object passed to tool behaviors at execution time.
 * @property {boolean} [isEmbedded] - Indicates if the tool is embedded in a target node.
 * @property {Node} [embeddedTarget] - The target of the tool, if it is embedded.
 */
type ToolBehaviorOptions = {
    isEmbedded?: boolean,
    embeddedTarget?: Node,
}

declare module "../gradumSelector" {
    interface GradumSelector {
        /*
         *
         *
         * Basic tool manipulation
         *
         *
         */

        /**
         * @function makeTool
         * @category Tools
         * @description Turns the element into a tool identified by `toolName`, optionally wiring activation and
         * key mapping. By default, this function also sets up an event listener on the element to activate the
         * tool on click. This behavior can be overridden via the `options` parameter.
         * @param {string} toolName - The unique name of the tool to register under the manager. Reusing an existing
         * `toolName` will make this element another instance of `toolName`.
         * @param {MakeToolOptions} [options] - Tool creation options (custom activation, click mode, key mapping, manager).
         * @returns {this} Itself for chaining.
         */
        makeTool(toolName: string, options?: MakeToolOptions): this;

        /**
         * @function isTool
         * @category Tools
         * @description Whether this element is registered as a tool for the provided manager.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {boolean} True if the element is a tool, false otherwise.
         */
        isTool(manager?: GradumEventManager): boolean;

        /**
         * @function getToolNames
         * @category Tools
         * @description Returns all tool names registered on this element for the provided manager.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {string[]} The list of tool names.
         */
        getToolNames(manager?: GradumEventManager): string[];

        /**
         * @function getToolName
         * @category Tools
         * @description Returns the first registered tool name on this element for the provided manager.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {string} The first tool name, if any.
         */
        getToolName(manager?: GradumEventManager): string;

        /*
         *
         * Tool activation manipulation
         *
         */

        /**
         * @function onToolActivate
         * @category Tools
         * @description Retrieve the delegate fired when this tool is activated in the corresponding manager.
         * @param {string} [toolName=this.getToolName()] - The name of the tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {Delegate<() => void} The delegate.
         */
        onToolActivate(toolName?: string, manager?: GradumEventManager): Delegate<() => void>;

        /**
         * @function onToolDeactivate
         * @category Tools
         * @description Retrieve the delegate fired when this tool is deactivated in the corresponding manager.
         * @param {string} [toolName=this.getToolName()] - The name of the tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {Delegate<() => void} The delegate.
         */
        onToolDeactivate(toolName?: string, manager?: GradumEventManager): Delegate<() => void>;

        /**
         * @function engageTool
         * @category Tools
         * @description Note that this element is the one a named tool is being used through, telling it so
         * and telling whichever element was being used before that it no longer is. Called for you as an
         * event reaches an element carrying an embedded tool, ahead of that tool's behaviors; call it
         * yourself only to hand a tool over without an interaction having done it.
         *
         * Saying the same element again does nothing, so this is safe to call on every event.
         * @param {string} [toolName=this.getToolName()] - The name of the tool.
         * @param {Node} [target=this.getEmbeddedToolTarget()] - What this element's tool is acting on.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself, allowing for method chaining.
         */
        engageTool(toolName?: string, target?: Node, manager?: GradumEventManager): this;

        /**
         * @function onToolEngage
         * @category Tools
         * @description Retrieve the delegate fired when this element becomes the one a tool is being used
         * through — the handle being dragged, of several carrying the same tool.
         *
         * Distinct from {@link GradumSelector.onToolActivate}, which is about which tool the user is holding
         * and fires on every element carrying that tool at once. This fires on one element only, and on
         * whichever one the interaction actually reached, so several elements can share a tool name and still
         * each set up their own.
         * @param {string} [toolName=this.getToolName()] - The name of the tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {Delegate<(target: Node, toolInstance: object) => void>} The delegate, fired with what the tool
         * is acting on and the tool object its behaviors run against.
         */
        onToolEngage(toolName?: string,
                     manager?: GradumEventManager): Delegate<(target: Node, toolInstance: object) => void>;

        /**
         * @function onToolDisengage
         * @category Tools
         * @description Retrieve the delegate fired when another element takes over a tool this one was being
         * used through. Fired with what this element's tool had been acting on.
         * @param {string} [toolName=this.getToolName()] - The name of the tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {Delegate<(target: Node, toolInstance: object) => void>} The delegate.
         */
        onToolDisengage(toolName?: string,
                        manager?: GradumEventManager): Delegate<(target: Node, toolInstance: object) => void>;

        /**
         * @function getEngagedTool
         * @category Tools
         * @description The element a named tool is currently being used through, of all the elements carrying
         * it. Answers "which handle is being dragged" where {@link GradumSelector.getToolName} only answers
         * "which tool".
         * @param {string} [toolName=this.getToolName()] - The name of the tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {Node} The engaged element, or `undefined` if the tool has not been used yet.
         */
        getEngagedTool(toolName?: string, manager?: GradumEventManager): Node;

        /**
         * @function getToolInstance
         * @category Tools
         * @description The tool object a named tool's behaviors run against. A behavior is registered once
         * per name, by whichever element carrying it got there first, so every element sharing that name
         * shares this one object — set it up rather than the element's own tool when several elements are
         * the same tool. It is what {@link GradumSelector.onToolEngage} hands you.
         * @param {string} [toolName=this.getToolName()] - The name of the tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {object} The tool object, or `undefined` if nothing has registered a behavior for that name.
         */
        getToolInstance(toolName?: string, manager?: GradumEventManager): object;

        /*
         *
         *
         * Tool behavior manipulation
         *
         *
         */

        /**
         * @function addToolBehavior
         * @category Tools
         * @description Adds a behavior callback for a given tool and a given type. This callback will attempt to be
         * executed on the target element when a `type` event is fired and `toolName` is active. It is applied to
         * all instances of the tool.
         * @param {string} type - The type of the event (e.g., "pointerdown", "click", custom gradum event).
         * @param {ToolBehaviorCallback} callback - The behavior function. Return `true` to stop propagation.
         * @param {string} [toolName=this.getToolName()] - Tool name to bind the behavior to. Defaults to this
         * element's first tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        addToolBehavior(type: string, callback: ToolBehaviorCallback, toolName?: string,
                        manager?: GradumEventManager): this;

        /**
         * @function hasToolBehavior
         * @category Tools
         * @description Checks whether there is at least one tool behavior for the pair "`type`, `toolName`."
         * @param {string} type - The type of the event (e.g., "pointerdown", "click", custom gradum event).
         * @param {string} [toolName=this.getToolName()] - The tool name to check under. Defaults to this
         * element's first tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {boolean} True if one or more behaviors are registered.
         */
        hasToolBehavior(type: string, toolName?: string, manager?: GradumEventManager): boolean;

        /**
         * @function removeToolBehavior
         * @category Tools
         * @description Removes one behavior — the one registered with this exact callback — for the pair
         * "`type`, `toolName`" under the given manager. Use it over {@link removeToolBehaviors} whenever the
         * callback is at hand, which leaves every other behavior on the same pair in place.
         * @param {string} type - The type of the event (e.g., "pointerdown", "click", custom gradum event).
         * @param {ToolBehaviorCallback} callback - The behavior function that was registered.
         * @param {string} [toolName=this.getToolName()] - The tool name the behavior was bound under. Defaults
         * to this element's first tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        removeToolBehavior(type: string, callback: ToolBehaviorCallback, toolName?: string,
                           manager?: GradumEventManager): this;

        /**
         * @function removeToolBehaviors
         * @category Tools
         * @description Removes all behaviors for the pair "`type`, `toolName`" under the given manager.
         * @param {string} type - The type of the event (e.g., "pointerdown", "click", custom gradum event).
         * @param {string} [toolName=this.getToolName()] - The tool name whose behaviors will be removed. Defaults to this
         * element's first tool.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        removeToolBehaviors(type: string, toolName?: string, manager?: GradumEventManager): this;

        /**
         * @function applyTool
         * @category Tools
         * @description Executes all behaviors registered for the pair "`type`, `toolName`" against this element.
         * @param {string} toolName - The name of the tool whose behaviors should run.
         * @param {string} type - The type of the event (e.g., "pointerdown", "click", custom gradum event).
         * @param {Event} event - The triggering event instance.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {boolean} True if at least one behavior returned `true` (to stop propagation of the event).
         */
        applyTool(toolName: string, type: string, event: Event, manager?: GradumEventManager): Propagation;

        /**
         * @function clearToolBehaviors
         * @category Tools
         * @description Clears all registered behaviors for the tools attached to this element.
         * @param {GradumEventManager} [manager] - The associated event manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        clearToolBehaviors(manager?: GradumEventManager): this;

        /*
         *
         *
         * Embedded tool manipulation
         *
         *
         */

        /**
         * @function embedTool
         * @category Tools
         * @description Embeds this tool into a target node, so all interactions on the tool element apply to the
         * defined target.
         * @param {Node} target - The node to manipulate when interacting with the tool element itself.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        embedTool(target: Node, manager?: GradumEventManager): this;

        /**
         * @function isEmbeddedTool
         * @category Tools
         * @description Whether this tool is embedded under the provided manager.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {boolean} True if an embedded target is present.
         */
        isEmbeddedTool(manager?: GradumEventManager): boolean;

        /**
         * @function getEmbeddedToolTarget
         * @category Tools
         * @description Returns the target node for this embedded tool under the provided manager.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {Node} The embedded tool's target node, if any.
         */
        getEmbeddedToolTarget(manager?: GradumEventManager): Node;

        /**
         * @function ignoreTool
         * @category Tools
         * @description Make the current element ignore the provided tool, so interacting with the tool on this
         * element will have no effect and propagate.
         * @param {string} toolName - The name of the tool to ignore.
         * @param {string} [type] - The type of the event. If undefined, all event types will be considered.
         * @param {boolean} [ignore] - Whether to ignore the tool. Defaults to true.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        ignoreTool(toolName: string, type?: string, ignore?: boolean, manager?: GradumEventManager): this;

        /**
         * @function ignoreTool
         * @category Tools
         * @description Make the current element ignore all tools, so interacting with any tool on this
         * element will have no effect and propagate.
         * @param {boolean} [ignore] - Whether to ignore the tools. Defaults to true.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {this} Itself for chaining.
         */
        ignoreAllTools(ignore?: boolean, manager?: GradumEventManager): this;

        /**
         * @function isToolIgnored
         * @category Tools
         * @description Whether the current element is ignoring the provided tool.
         * @param {string} toolName - The name of the tool to check for.
         * @param {string} [type] - The type of the event. If undefined, all event types will be considered.
         * @param {GradumEventManager} [manager] - The associated manager (defaults to `GradumEventManager.instance`).
         * @returns {boolean} Whether the tool is ignored for the provided event type.
         */
        isToolIgnored(toolName: string, type?: string, manager?: GradumEventManager): boolean;
    }
}

export {MakeToolOptions, ToolBehaviorCallback, ToolBehaviorOptions};
