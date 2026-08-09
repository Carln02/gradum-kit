import {
    ClickMode,
    InputDevice,
    SetToolOptions,
    GradumEventManagerProperties,
    GradumEventManagerStateProperties
} from "./gradumEventManager.types";
import {$, gradum} from "../../gradumFunctions/gradumFunctions";
import {auto} from "../../decorators/auto/auto";
import {GradumEventManagerModel} from "./gradumEventManager.model";
import {GradumEventManagerKeyOperator} from "./operators/gradumEventManager.keyOperator";
import {GradumEventManagerWheelOperator} from "./operators/gradumEventManager.wheelOperator";
import {GradumEventManagerPointerOperator} from "./operators/gradumEventManager.pointerOperator";
import {GradumEventManagerDispatchOperator} from "./operators/gradumEventManager.dispatchOperator";
import {GradumEventManagerUtilsHandler} from "./handlers/gradumEventManager.utilsHandler";
import {operator} from "../../decorators/mvc";
import {isUndefined} from "../../utils/dataManipulation/misc";
import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";
import {Point} from "../../gradumComponents/datatypes/point/point";
import {GradumWeakSet} from "../../gradumComponents/datatypes/weakSet/weakSet";
import {
    DefaultClickEventName,
    DefaultDragEventName,
    DefaultKeyEventName,
    DefaultMoveEventName,
    DefaultWheelEventName,
    GradumClickEventName,
    GradumDragEventName,
    GradumEventNameEntry,
    GradumKeyEventName,
    GradumMoveEventName,
    GradumWheelEventName
} from "../../types/eventNaming.types";
import {expose} from "../../decorators/expose";
import {GradumBaseElement} from "../../gradumElement/gradumBaseElement/gradumBaseElement";
import {define} from "../../decorators/define/define";

//TODO Create merged events maybe --> fire event x when "mousedown" | "touchstart" | "mousemove" etc.
//ToDO Create "interaction" event --> when element interacted with

/**
 * @class GradumEventManager
 * @group Event Handling
 * @category GradumEventManager
 *
 * @extends GradumBaseElement
 * @template {string} ToolType - The union of tool names this manager recognizes.
 * @description Listens to native mouse, trackpad, touch, and keyboard input and turns it into Gradum's
 * richer events — {@link GradumEvent}, {@link GradumDragEvent}, {@link GradumKeyEvent}, and
 * {@link GradumWheelEvent} — so a click, a long press, and a drag arrive as distinct, named events
 * rather than something each component has to derive itself. It also owns the current tool per
 * {@link ClickMode}, and can map screen coordinates into document space for every event it fires.
 *
 * Most applications need only one, reached through {@link GradumEventManager.instance}.
 */
class GradumEventManager<ToolType extends string = string> extends GradumBaseElement {
    /**
     * @protected
     * @static
     * @description Every manager that has been created, in creation order.
     */
    protected static managers: GradumEventManager[] = [];

    /**
     * @static
     * @readonly
     * @description The default manager. Creating one on first access, so reading this is always safe.
     */
    public static get instance(): GradumEventManager {
        if (GradumEventManager.managers.length == 0) this.managers.push(GradumEventManager.create());
        return GradumEventManager.managers[0];
    }

    /**
     * @static
     * @description Every manager currently registered. Reading gives a copy, so mutating the result does
     * not affect the registry; assign a new array to replace it.
     */
    public static get allManagers(): GradumEventManager[] {
        return [...this.managers];
    }

    public static set allManagers(managers: GradumEventManager[]) {
        this.managers = managers;
    }

    /**
     * @readonly
     * @description This manager's model, holding its live input state.
     */
    public get model(): GradumEventManagerModel {
        return gradum(this).model;
    }

    /**
     * @readonly
     * @description The properties this manager was created with.
     */
    public declare readonly properties: GradumEventManagerProperties;

    /**
     * @static
     * @description The MVC pieces and event-type switches a new manager starts with. Every event family is
     * enabled by default; pass the matching {@link EnabledGradumEventTypes} flag to `create` to turn one off.
     */
    public static defaultProperties: GradumEventManagerProperties = {
        model: GradumEventManagerModel,
        operators: [
            GradumEventManagerKeyOperator,
            GradumEventManagerWheelOperator,
            GradumEventManagerPointerOperator,
            GradumEventManagerDispatchOperator
        ],
        handlers: GradumEventManagerUtilsHandler,

        keyEventsEnabled: true,
        wheelEventsEnabled: true,
        mouseEventsEnabled: true,
        touchEventsEnabled: true,
        clickEventsEnabled: true,
        dragEventsEnabled: true,
        moveEventsEnabled: true,
    };

    @operator() protected keyOperator: GradumEventManagerKeyOperator;
    @operator() protected wheelOperator: GradumEventManagerWheelOperator;
    @operator() protected pointerOperator: GradumEventManagerPointerOperator;
    @operator() protected dispatchOperator: GradumEventManagerDispatchOperator;

    /**
     * @description The currently identified input device. It is not 100% accurate, especially when differentiating
     * between mouse and trackpad.
     */
    @expose("model", false) public inputDevice: InputDevice;

    /**
     * @readonly
     * @description Fired whenever the identified input device changes.
     */
    @expose("model", false) public onInputDeviceChange: Delegate<(device: InputDevice) => void>;

    /**
     * @readonly
     * @description The pointer button or input mode currently in use.
     */
    @expose("model", false) public currentClick: ClickMode;

    /**
     * @readonly
     * @description The keyboard keys currently held down.
     */
    @expose("model", false) public currentKeys: string[];

    /**
     * @readonly
     * @description Fired when the tool held by a click mode changes, with the previous tool, the new
     * tool, and the mode.
     */
    @expose("model", false) public onToolChange: Delegate<(oldTool: Node, newTool: Node, type: ClickMode) => void>;

    /**
     * @description Whether events fired by this manager compute scaled positions. Assign a callback to
     * decide per event.
     */
    @expose("model") public authorizeEventScaling: boolean | (() => boolean);

    /**
     * @description Converts a screen position into document space for every event this manager fires.
     * Set it so events stay correct under a panned or zoomed canvas.
     */
    @expose("model") public scaleEventPosition: (position: Point) => Point;

    /**
     * @description How far, in pixels, a pointer must travel before the interaction counts as a drag
     * rather than a click. Defaults to `10`.
     */
    @expose("model") public moveThreshold: number;

    /**
     * @description How long, in milliseconds, a pointer must be held still before a long press fires.
     * Defaults to `500`.
     */
    @expose("model") public longPressDuration: number;

    /**
     * @constructor
     * @description Create an event manager and register it in {@link GradumEventManager.allManagers}.
     * The first one created becomes {@link GradumEventManager.instance}.
     */
    public constructor() {
        super();
        GradumEventManager.managers.push(this);
    }

    /**
     * @function initialize
     * @description Start listening to pointer input on the document and clear any lock. Called
     * automatically by the element lifecycle.
     */
    public initialize() {
        super.initialize();
        this.unlock();
        document.addEventListener("pointerdown", this.pointerOperator.pointerDown, {passive: false});
        document.addEventListener("pointermove", this.pointerOperator.pointerMove, {passive: false});
        document.addEventListener("pointerup", this.pointerOperator.pointerUp, {passive: false});
        document.addEventListener("pointercancel", this.pointerOperator.pointerCancel, {passive: false});
        //TODO
        this.dispatchOperator.setupCustomDispatcher("pointerdown");
    }

    /**
     * @description Whether keyboard input is listened to and turned into {@link GradumKeyEvent}s. Setting it
     * to `false` reverts key handling to the native event names.
     */
    @auto() public set keyEventsEnabled(value: boolean) {
        if (value) {
            document.addEventListener("keydown", this.keyOperator.keyDown);
            document.addEventListener("keyup", this.keyOperator.keyUp);
        } else {
            document.removeEventListener("keydown", this.keyOperator.keyDown);
            document.removeEventListener("keyup", this.keyOperator.keyUp);
        }
        this.applyAndHookEvents(GradumKeyEventName, DefaultKeyEventName, value);
    }

    /**
     * @description Whether wheel input is listened to and turned into {@link GradumWheelEvent}s. Setting it to
     * `false` reverts wheel handling to the native event names.
     */
    @auto() public set wheelEventsEnabled(value: boolean) {
        if (value) document.body.addEventListener("wheel", this.wheelOperator.wheel, {passive: false});
        else document.body.removeEventListener("wheel", this.wheelOperator.wheel);
        this.applyAndHookEvents(GradumWheelEventName, DefaultWheelEventName, value);
    }

    /**
     * @description Whether pointer movement produces Gradum move events. Setting it to `false` reverts move
     * handling to the native event names.
     */
    @auto() public set moveEventsEnabled(value: boolean) {
        this.applyAndHookEvents(GradumMoveEventName, DefaultMoveEventName, value);
    }

    /**
     * @description Whether mouse input is processed. Setting it to `false` reverts mouse handling to the native
     * event names.
     */
    @auto() public set mouseEventsEnabled(value: boolean) {
        //TODO

        // if (value) {
        //     doc.on("pointerdown", this.pointerOperator.pointerDown, {passive: false, propagate: true});
        //     doc.on("pointermove", this.pointerOperator.pointerMove, {passive: false, propagate: true});
        //     doc.on("pointerup", this.pointerOperator.pointerUp, {passive: false, propagate: true});
        //     doc.on("pointercancel", this.pointerOperator.pointerCancel, {passive: false, propagate: true});
        // } else {
        //     doc.removeListener("mousedown", this.pointerOperator.pointerDown);
        //     doc.removeListener("mousemove", this.pointerOperator.pointerMove);
        //     doc.removeListener("mouseup", this.pointerOperator.pointerUp);
        //     doc.removeListener("mouseleave", this.pointerOperator.pointerLeave);
        // }
    }

    /**
     * @description Whether touch input is processed. Setting it to `false` reverts touch handling to the native
     * event names.
     */
    @auto() public set touchEventsEnabled(value: boolean) {
        // if (value) {
        //     doc.on("touchstart", this.pointerOperator.pointerDown, {passive: false, propagate: true});
        //     doc.on("touchmove", this.pointerOperator.pointerMove, {passive: false, propagate: true});
        //     doc.on("touchend", this.pointerOperator.pointerUp, {passive: false, propagate: true});
        //     doc.on("touchcancel", this.pointerOperator.pointerUp, {passive: false, propagate: true});
        // } else {
        //     doc.removeListener("touchstart", this.pointerOperator.pointerDown);
        //     doc.removeListener("touchmove", this.pointerOperator.pointerMove);
        //     doc.removeListener("touchend", this.pointerOperator.pointerUp);
        //     doc.removeListener("touchcancel", this.pointerOperator.pointerUp);
        // }
    }

    /**
     * @description Whether click, click start/end, and long-press events fire. Setting it to `false` reverts
     * click handling to the native event names.
     */
    @auto() public set clickEventsEnabled(value: boolean) {
        this.applyAndHookEvents(GradumClickEventName, DefaultClickEventName, value);
    }

    /**
     * @description Whether drag and drag start/end events fire. Setting it to `false` reverts drag handling to
     * the native event names.
     */
    @auto() public set dragEventsEnabled(value: boolean) {
        this.applyAndHookEvents(GradumDragEventName, DefaultDragEventName, value);
    }

    /*
     *
     *
     * State and lock management
     *
     *
     *
     */

    /**
     * @function lock
     * @description Temporarily override the manager's state on behalf of one node, for the duration of
     * an interaction. Use it to impose settings mid-gesture — suppressing native touch scrolling while a
     * drag is in flight, say — then call {@link GradumEventManager.unlock} to hand them back. Any
     * existing lock is released first, so locks do not nest.
     * @param {Node} origin - The node establishing the lock.
     * @param {GradumEventManagerStateProperties} value - The state to impose while the lock is held.
     */
    public lock(origin: Node, value: GradumEventManagerStateProperties) {
        this.unlock();
        this.model.lockState.lockOrigin = origin;
        for (const key in value) this.model.lockState[key] = value[key];
    }

    /**
     * @function unlock
     * @description Release the current lock, so the manager's own state applies again.
     */
    public unlock() {
        this.model.lockState = {lockOrigin: document.body};
    }

    /**
     * @description Whether the manager is processing input. Reading combines the manager's own setting
     * with any active lock, so a lock can disable it without overwriting the underlying value; assigning
     * changes only the manager's own setting.
     */
    public get enabled() {
        return this.model.state.enabled && (this.model.lockState.enabled ?? true);
    }

    public set enabled(value: boolean) {
        this.model.state.enabled = value;
    }

    /**
     * @description Whether wheel input has its native default suppressed, blocking browser page zoom and
     * scroll. Combines the manager's setting with any active lock, as {@link GradumEventManager.enabled} does.
     */
    public get preventDefaultWheel() {
        return this.model.state.preventDefaultWheel && (this.model.lockState.preventDefaultWheel ?? true);
    }

    public set preventDefaultWheel(value: boolean) {
        this.model.state.preventDefaultWheel = value;
    }

    /**
     * @description Whether mouse input has its native default suppressed. Combines the manager's setting
     * with any active lock, as {@link GradumEventManager.enabled} does.
     */
    public get preventDefaultMouse() {
        return this.model.state.preventDefaultMouse && (this.model.lockState.preventDefaultMouse ?? true);
    }

    public set preventDefaultMouse(value: boolean) {
        this.model.state.preventDefaultMouse = value;
    }

    /**
     * @description Whether touch input has its native default suppressed, blocking native scrolling and
     * pinch-zoom. Combines the manager's setting with any active lock, as
     * {@link GradumEventManager.enabled} does.
     */
    public get preventDefaultTouch() {
        return this.model.state.preventDefaultTouch && (this.model.lockState.preventDefaultTouch ?? true);
    }

    public set preventDefaultTouch(value: boolean) {
        this.model.state.preventDefaultTouch = value;
    }

    /**
     * @description All three prevent-default settings at once. *Note: the getter and setter are not
     * symmetric — reading gives `true` when **any** of wheel, mouse, or touch is suppressed, while
     * assigning sets **all three** to the given value.*
     */
    public get preventDefaults(): boolean {
        return this.preventDefaultMouse || this.preventDefaultTouch || this.preventDefaultWheel;
    }

    public set preventDefaults(value: boolean) {
        this.model.state.preventDefaultWheel = value;
        this.model.state.preventDefaultMouse = value;
        this.model.state.preventDefaultTouch = value;
    }

    /*
     *
     *
     * Tool management
     *
     *
     *
     */

    /**
     * @readonly
     * @description Every registered tool instance, across all tool names, flattened into one array.
     */
    public get toolsArray(): Node[] {
        const array: Node[] = [];
        for (const tools of this.model.tools.values()) array.push(...tools.toArray());
        return array;
    }

    /**
     * @function getCurrentTool
     * @description Get the tool instance currently held by a click mode.
     * @param {ClickMode} [mode=this.model.currentClick] - The click mode to read. Defaults to the mode
     * currently in use.
     * @returns {Node} The tool held by that mode, or `undefined` if it holds none.
     */
    public getCurrentTool(mode: ClickMode = this.model.currentClick): Node {
        return this.model.currentTools.get(mode);
    }

    /**
     * @function getCurrentTools
     * @description Get every instance sharing the name of the tool currently held by a click mode. Use
     * it when several elements — toolbar buttons in different places, say — represent the same tool.
     * @param {ClickMode} [mode=this.model.currentClick] - The click mode to read. Defaults to the mode
     * currently in use.
     * @returns {Node[]} All instances of that tool, or an empty array if the mode holds none.
     */
    public getCurrentTools(mode: ClickMode = this.model.currentClick): Node[] {
        return this.getToolsByName(this.getCurrentToolName(mode));
    }

    /**
     * @function getCurrentToolName
     * @description Get the name of the tool currently held by a click mode.
     * @param {ClickMode} [mode=this.model.currentClick] - The click mode to read. Defaults to the mode
     * currently in use.
     * @returns {ToolType} The tool's name, or `undefined` if the mode holds none.
     */
    public getCurrentToolName(mode: ClickMode = this.model.currentClick): ToolType {
        return this.getToolName(this.getCurrentTool(mode));
    }

    /**
     * @function getToolName
     * @description Get the name a tool instance is registered under.
     * @param {Node} tool - The tool instance to look up.
     * @returns {ToolType} The registered name, or `undefined` if the node is not a registered tool.
     */
    public getToolName(tool: Node): ToolType {
        for (const [toolName, weakSet] of this.model.tools.entries()) {
            if (weakSet.has(tool)) return toolName as ToolType;
        }
    }


    /**
     * @function getSimilarTools
     * @description Get every instance registered under the same name as the given tool, including the
     * tool itself.
     * @param {Node} tool - The tool instance to match against.
     * @returns {Node[]} All instances sharing its name, or an empty array if it is not registered.
     */
    public getSimilarTools(tool: Node): Node[] {
        for (const [toolName, weakSet] of this.model.tools.entries()) {
            if (weakSet.has(tool)) return weakSet.toArray();
        }
        return [];
    }

    /**
     * @function getToolsByName
     * @description Get every tool instance registered under a name.
     * @param {ToolType} name - The tool name to look up.
     * @returns {Node[]} All instances registered under that name, or an empty array if there are none.
     */
    public getToolsByName(name: ToolType): Node[] {
        return this.model.tools.get(name)?.toArray() || [];
    }


    /**
     * @function getToolByName
     * @description Get a single tool instance registered under a name. Pass a predicate to choose among
     * several instances.
     * @param {ToolType} name - The tool name to look up.
     * @param {(tool: Node) => boolean} [predicate] - Chooses which instance to return. Without it, the
     * first registered instance is returned.
     * @returns {Node} The matching instance, or `undefined` if there is none.
     */
    public getToolByName(name: ToolType, predicate?: (tool: Node) => boolean): Node {
        const tools = this.getToolsByName(name);
        return predicate ? tools?.find(predicate) : tools?.[0];
    }

    /**
     * @function getToolsByKey
     * @description Get every tool instance bound to a keyboard key.
     * @param {string} key - The key the tool is mapped to.
     * @returns {Node[]} All instances bound to that key, or an empty array if the key maps to nothing.
     */
    public getToolsByKey(key: string): Node[] {
        const toolName = this.model.mappedKeysToTool.get(key) as ToolType;
        if (!toolName) return [];
        return this.getToolsByName(toolName);
    }

    /**
     * @function getToolByKey
     * @description Get a single tool instance bound to a keyboard key. Pass a predicate to choose among
     * several instances.
     * @param {string} key - The key the tool is mapped to.
     * @param {(tool: Element) => boolean} [predicate] - Chooses which instance to return. Without it, the
     * first one is returned.
     * @returns {Node} The matching instance, or `undefined` if there is none.
     */
    public getToolByKey(key: string, predicate?: (tool: Element) => boolean): Node {
        const tools = this.getToolsByKey(key);
        return predicate ? tools?.find(predicate) : tools?.[0];
    }

    /**
     * @function addTool
     * @description Register a tool instance under a name, so the manager can make it current and find it
     * again. Several instances may share one name.
     * @param {ToolType} toolName - The name to register the instance under.
     * @param {Node} tool - The tool instance.
     * @param {string} [key] - A keyboard key that selects this tool when pressed.
     */
    public addTool(toolName: ToolType, tool: Node, key?: string) {
        if (!this.model.tools.has(toolName)) this.model.tools.set(toolName, new GradumWeakSet());
        const tools = this.model.tools.get(toolName);
        if (!tools.has(tool)) tools.add(tool);
        if (key) this.model.mappedKeysToTool.set(key, toolName);
    }

    /**
     * @function setTool
     * @description Make a tool the current one for a click mode, so interactions in that mode are
     * attributed to it. The previously held tool is deselected and deactivated first, and
     * {@link GradumEventManager.onToolChange} fires once the swap is done. Passing a tool that is not
     * registered with this manager does nothing.
     * @param {Node} tool - The tool instance to make current. Pass `undefined` to clear the mode.
     * @param {ClickMode} type - The click mode to bind the tool to.
     * @param {SetToolOptions} [options={}] - Whether to select and activate the tool, and whether it also
     * becomes the tool for `ClickMode.none`.
     */
    public setTool(tool: Node, type: ClickMode, options: SetToolOptions = {}) {
        if (!isUndefined(tool) && !$(tool).isTool(this)) return;
        gradum(options).applyDefaults({select: true, activate: true, setAsNoAction: type == ClickMode.left});

        //Get previous tool
        const previousTool = this.model.currentTools.get(type);
        if (previousTool) {
            //Return if it's the same
            if (previousTool === tool) return;

            //Deselect and deactivate previous tool
            this.getSimilarTools(previousTool).forEach(element => {
                if (options.select) gradum(element).selected = false;
                if (options.activate) this.model.utils.activateTool(element, this.getToolName(previousTool), false);
            });
        }

        //Select new tool (and maybe set it as the tool for no click mode)
        this.model.currentTools.set(type, tool);
        if (options.setAsNoAction) this.model.currentTools.set(ClickMode.none, tool);

        //Select and activate the tool
        this.getSimilarTools(tool).forEach(element => {
            if (options.activate) this.model.utils.activateTool(element, this.getToolName(tool), true);
            if (options.select) gradum(element).selected = true;
        });

        //Fire tool changed
        this.onToolChange.fire(previousTool, tool, type);
    }

    /**
     * @function setToolByKey
     * @description Make the tool bound to a keyboard key current for `ClickMode.key`. The tool is
     * activated but not visually selected.
     * @param {string} key - The key whose tool should become current.
     * @returns {boolean} Whether a tool was bound to that key and therefore set.
     */
    public setToolByKey(key: string): boolean {
        const toolName = this.model.mappedKeysToTool.get(key) as ToolType;
        if (!toolName) return false;
        this.setTool(this.getToolByName(toolName), ClickMode.key, {select: false});
        return true;
    }

    /*
     *
     *
     * Utils
     *
     *
     */

    /**
     * @function setupCustomDispatcher
     * @description Start dispatching an additional event type through the Gradum two-pass dispatch, so
     * tool behaviors and interactor listeners receive it like any built-in Gradum event. Registering the
     * same type twice is a no-op.
     * @param {string} type - The event type to dispatch.
     */
    public setupCustomDispatcher(type: string) {
        return this.dispatchOperator.setupCustomDispatcher(type);
    }

    /**
     * @protected
     * @function applyAndHookEvents
     * @description Switch a family of events between its Gradum names and its native names, and hook or
     * unhook the dispatcher for each. Backs the `*EventsEnabled` setters.
     * @param {Record<string, string>} gradumEventNames - The Gradum names for this family.
     * @param {Record<string, string>} defaultEventNames - The native names to fall back to.
     * @param {boolean} applyGradumEvents - Whether to use the Gradum names and hook the dispatcher, or
     * revert to the native names and unhook it.
     */
    protected applyAndHookEvents(gradumEventNames: Record<string, string>,
                                 defaultEventNames: Record<string, string>, applyGradumEvents: boolean) {
        this.model.utils.applyEventNames(applyGradumEvents ? gradumEventNames : defaultEventNames);
        for (const name of Object.values(applyGradumEvents ? gradumEventNames : defaultEventNames)) {
            if (applyGradumEvents) this.dispatchOperator.setupCustomDispatcher(name as GradumEventNameEntry);
            else this.dispatchOperator.removeCustomDispatcher(name as GradumEventNameEntry);
        }
    }

    /**
     * @function destroy
     * @description Shut the manager down: disable every event family, unhook its dispatchers, and clear
     * the tool-change subscribers. Registered tools are left in place.
     * @returns {this} Itself, allowing for method chaining.
     */
    public destroy() {
        this.keyEventsEnabled = false;
        this.wheelEventsEnabled = false;
        this.mouseEventsEnabled = false;
        this.touchEventsEnabled = false;
        this.dragEventsEnabled = false;
        this.clickEventsEnabled = false;
        this.onToolChange.clear();
        return this;
    }
}

define(GradumEventManager);
export {GradumEventManager};
