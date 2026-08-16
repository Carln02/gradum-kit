import {GradumSelector} from "../gradumSelector";
import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";
import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {ClickMode} from "../../eventHandling/gradumEventManager/gradumEventManager.types";
import {MakeToolOptions, ToolBehaviorCallback, ToolBehaviorOptions} from "./tool.types";
import {ToolFunctionsUtils} from "./tool.utils";
import {DefaultEventName} from "../../types/eventNaming.types";
import {Propagation} from "../event/event.types";
import {gradum} from "../gradumFunctions";

const utils = new ToolFunctionsUtils();

/**
 * @internal
 * @function setupToolFunctions
 * @description Install the tool functions (`makeTool`, `applyTool`, `embedTool`, ...) onto the
 * {@link GradumSelector} prototype. Called once by {@link gradumify}; the matching `exclude` option skips it.
 */
export function setupToolFunctions() {
    /*
     *
     * Basic tool manipulation
     *
     */

    GradumSelector.prototype.makeTool = function _makeTool(
        this: GradumSelector,
        toolName: string,
        options?: MakeToolOptions
    ): GradumSelector {
        if (!toolName) return this;
        if (!options) options = {};
        if (!options.manager) options.manager = GradumEventManager.instance;

        options.manager.addTool(toolName, this.element, options.key);
        if (options.customActivation && typeof options.customActivation === "function") {
            options.customActivation(this as any, options.manager);
        } else {
            options.activationEvent ??= DefaultEventName.click;
            options.clickMode ??= ClickMode.left;
            this.on(options.activationEvent, () => {
                options.manager.setTool(this.element, options.clickMode);
                return Propagation.stopPropagation;
            }, undefined, options.manager);
        }
        utils.saveTool(this, toolName, options.manager);

        if (options.activeClasses) {
            const target = options.activeClassesTarget ?? document.body;
            utils.getActivationDelegate(this, toolName, options.manager)
                .add(() => gradum(target).addClass(options.activeClasses));
            utils.getDeactivationDelegate(this, toolName, options.manager)
                .add(() => gradum(target).removeClass(options.activeClasses));
        }

        if (options.onActivate) utils.getActivationDelegate(this, toolName, options.manager).add(options.onActivate);
        if (options.onDeactivate) utils.getDeactivationDelegate(this, toolName, options.manager).add(options.onDeactivate);

        return this;
    }

    GradumSelector.prototype.isTool = function _isTool(
        this: GradumSelector,
        manager: GradumEventManager = GradumEventManager.instance
    ): boolean {
        return utils.getToolNames(this.element, manager).length > 0;
    }

    GradumSelector.prototype.getToolNames = function _getToolName(
        this: GradumSelector,
        manager: GradumEventManager = GradumEventManager.instance
    ): string[] {
        return utils.getToolNames(this.element, manager);
    }

    GradumSelector.prototype.getToolName = function _getToolName(
        this: GradumSelector,
        manager: GradumEventManager = GradumEventManager.instance
    ): string {
        const toolNames = utils.getToolNames(this.element, manager);
        if (toolNames.length > 0) return toolNames[0];
    }

    /*
     *
     * Tool activation manipulation
     *
     */

    GradumSelector.prototype.onToolActivate = function _onActivate(
        this: GradumSelector,
        toolName?: string,
        manager: GradumEventManager = GradumEventManager.instance
    ): Delegate<() => void> {
        if (!toolName) toolName = this.getToolName(manager);
        return utils.getActivationDelegate(this, toolName, manager);
    }

    GradumSelector.prototype.onToolDeactivate = function _onDeactivate(
        this: GradumSelector,
        toolName?: string,
        manager: GradumEventManager = GradumEventManager.instance
    ): Delegate<() => void> {
        if (!toolName) toolName = this.getToolName(manager);
        return utils.getDeactivationDelegate(this, toolName, manager);
    }

    /*
     *
     * Tool behavior manipulation
     *
     */

    GradumSelector.prototype.addToolBehavior = function _addToolBehavior(
        this: GradumSelector,
        type: string,
        callback: ToolBehaviorCallback,
        toolName: string = this.getToolName(),
        manager: GradumEventManager = GradumEventManager.instance
    ): GradumSelector {
        if (type && toolName) {
            manager.setupCustomDispatcher?.(type);
            utils.addToolBehavior(toolName, type, callback, manager);
        }
        return this;
    }

    GradumSelector.prototype.hasToolBehavior = function _hasToolBehavior(
        this: GradumSelector,
        type: string,
        toolName: string = this.getToolName(),
        manager: GradumEventManager = GradumEventManager.instance
    ): boolean {
        if (!type || !toolName) return false;
        return utils.getToolBehaviors(toolName, type, manager).length > 0;
    }

    GradumSelector.prototype.removeToolBehaviors = function _removeToolBehaviors(
        this: GradumSelector,
        type: string,
        toolName: string = this.getToolName(),
        manager: GradumEventManager = GradumEventManager.instance
    ): GradumSelector {
        if (type && toolName) utils.removeToolBehaviors(toolName, type, manager);
        return this;
    }

    GradumSelector.prototype.clearToolBehaviors = function _clearToolBehaviors(
        this: GradumSelector,
        manager: GradumEventManager = GradumEventManager.instance
    ): GradumSelector {
        utils.clearToolBehaviors(manager);
        return this;
    }

    /*
     *
     * Embedded tool manipulation
     *
     */

    GradumSelector.prototype.embedTool = function _embedTool(
        this: GradumSelector,
        target: Node,
        manager: GradumEventManager = GradumEventManager.instance
    ): GradumSelector {
        if (this.isTool(manager)) utils.setEmbeddedToolTarget(this.element, target, manager);
        return this;
    }

    GradumSelector.prototype.isEmbeddedTool = function _isEmbeddedTool(
        this: GradumSelector,
        manager: GradumEventManager = GradumEventManager.instance
    ): boolean {
        return !!utils.getEmbeddedToolTarget(this.element, manager);
    }

    GradumSelector.prototype.getEmbeddedToolTarget = function _getEmbeddedToolTarget(
        this: GradumSelector,
        manager: GradumEventManager = GradumEventManager.instance
    ): Node {
        return utils.getEmbeddedToolTarget(this.element, manager);
    }

    /*
     *
     * Apply tool
     *
     */

    GradumSelector.prototype.applyTool = function _applyTool(
        this: GradumSelector,
        toolName: string,
        type: string,
        event: Event,
        manager: GradumEventManager = GradumEventManager.instance,
    ): Propagation {
        let propagation = Propagation.propagate;
        const behaviors = utils.getToolBehaviors(toolName, type, manager);

        const options: ToolBehaviorOptions = {};
        options.embeddedTarget = utils.getEmbeddedToolTarget(this.element, manager);
        options.isEmbedded = !!options.embeddedTarget;

        for (const behavior of behaviors) {
            propagation = utils.processPropagation(behavior.executeOn(event, this.element, options), propagation, Propagation.propagate);
            if (propagation === Propagation.stopImmediatePropagation) break;
        }

        return propagation;
    }

    GradumSelector.prototype.ignoreTool = function _ignoreTool(
        this: GradumSelector,
        toolName: string,
        type?: string,
        ignore: boolean = true,
        manager: GradumEventManager = GradumEventManager.instance
    ): GradumSelector {
        utils.ignoreTool(this.element, toolName, type, ignore, manager);
        return this;
    }

    GradumSelector.prototype.ignoreAllTools = function _ignoreAllTools(
        this: GradumSelector,
        ignore: boolean = true,
        manager: GradumEventManager = GradumEventManager.instance
    ): GradumSelector {
        utils.getElementData(this.element, manager).ignoreAllTools = ignore;
        return this;
    }

    GradumSelector.prototype.isToolIgnored = function _isToolIgnored(
        this: GradumSelector,
        toolName: string,
        type?: string,
        manager: GradumEventManager = GradumEventManager.instance
    ): boolean {
        if (utils.getElementData(this.element, manager).ignoreAllTools) return true;
        return utils.isToolIgnored(this.element, toolName, type, manager);
    }
}