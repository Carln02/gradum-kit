import {ClickMode, InputDevice} from "../gradumEventManager/gradumEventManager.types";
import {ClosestOrigin, GradumEventProperties} from "./gradumEvent.types";
import {cache} from "../../decorators/cache/cache";
import {GradumEventManager} from "../gradumEventManager/gradumEventManager";
import {Point} from "../../gradumComponents/datatypes/point/point";
import {GradumMap} from "../../gradumComponents/datatypes/map/map";
import {GradumEventNameEntry} from "../../types/eventNaming.types";

/**
 * @class GradumEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends Event
 * @description The base class for every event the {@link GradumEventManager} fires. On top of a native
 * [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) it carries the pointer position, the
 * click mode, the input device, the keys held at the time, and the tool the event is attributed to. It
 * also knows how to map screen coordinates into document space, so handlers running under a panned or
 * zoomed canvas can read {@link GradumEvent.scaledPosition} instead of doing the maths themselves.
 */
class GradumEvent extends Event {
    /**
     * @description The event manager that fired this event.
     */
    public readonly eventManager: GradumEventManager;

    /**
     * @description The name of the tool this event is attributed to, or `undefined` when no tool was
     * current. Resolve it to the tool itself with {@link GradumEvent.tool}.
     */
    public readonly toolName: string;

    /**
     * @description The name this event was dispatched under, such as `gradum-click`.
     */
    public readonly eventName: GradumEventNameEntry;

    /**
     * @description The pointer button or input mode this event belongs to.
     */
    public readonly clickMode: ClickMode;

    /**
     * @description The device that produced this event.
     */
    public readonly inputDevice: InputDevice;

    /**
     * @description The keys held down when the event fired.
     */
    public readonly keys: string[];

    /**
     * @description The screen position the event was fired from.
     */
    public readonly position: Point;

    /**
     * @description Whether {@link GradumEvent.scaledPosition} and its per-pointer equivalents actually
     * scale, or hand back the raw position. Assign a callback to decide per read — useful when a canvas
     * is only sometimes transformed. Defaults to `true`.
     */
    public authorizeScaling: boolean | (() => boolean);

    /**
     * @description How a screen position is mapped into document space. Assign it to make events aware of
     * a panned or zoomed canvas. Defaults to returning the position unchanged.
     */
    public scalePosition: (position: Point) => Point;

    /**
     * @constructor
     * @description Create a Gradum event. Anything left out of `properties` falls back to the current
     * state of {@link GradumEventManager.instance}.
     * @param {GradumEventProperties} properties - The event's name, position, and input context.
     */
    public constructor(properties: GradumEventProperties) {
        super(properties.eventName, {bubbles: true, cancelable: true, ...properties.eventInitDict});

        this.eventManager = properties.eventManager ?? GradumEventManager.instance;

        this.authorizeScaling = properties.authorizeScaling ?? true;
        this.scalePosition = properties.scalePosition ?? ((position: Point) => position);

        this.clickMode = properties.clickMode ?? GradumEventManager.instance.currentClick;
        this.inputDevice = properties.inputDevice ?? InputDevice.unknown;
        this.keys = properties.keys ?? GradumEventManager.instance.currentKeys;

        this.eventName = properties.eventName;
        this.position = properties.position;
        this.toolName = properties.toolName;
    }

    /**
     * @readonly
     * @description The tool associated with this event, or `null` if the event carries no tool name.
     */
    public get tool(): Node {
        if (!this.toolName || !(this.eventManager instanceof GradumEventManager)) return null;
        return this.eventManager.getToolByName(this.toolName);
    }

    /**
     * @function closest
     * @template {Element} T - The type of element to look for.
     * @description Find the nearest element of the given class, starting from the event target or the
     * event position and walking up. Matching is by `instanceof`.
     * @param {new (...args: any[]) => T} type - The constructor to match against.
     * @param {Element | boolean} [strict=true] - When `true`, the match must also contain the event
     * position, so an ancestor the pointer has left is rejected. Pass an `Element` to test against that
     * element's bounds instead, or `false` to skip the check.
     * @param {ClosestOrigin} [from=ClosestOrigin.target] - Where to start searching from.
     * @returns {T | null} The nearest matching element, or `null` if there is none.
     */
    public closest<T extends Element>(type: new (...args: any[]) => T, strict?: Element | boolean,
                                      from?: ClosestOrigin): T | null;

    /**
     * @function closest
     * @description Find the nearest element matching the given string. A registered custom-element tag
     * such as `"my-component"` is resolved to its constructor and matched by `instanceof`; anything else
     * is treated as a CSS selector.
     * @param {string} type - A custom-element tag name, or a CSS selector.
     * @param {Element | boolean} [strict=true] - When `true`, the match must also contain the event
     * position. Pass an `Element` to test against that element's bounds instead, or `false` to skip it.
     * @param {ClosestOrigin} [from=ClosestOrigin.target] - Where to start searching from.
     * @returns {Element | null} The nearest matching element, or `null` if there is none.
     */
    public closest(type: string, strict?: Element | boolean, from?: ClosestOrigin): Element | null;
    @cache()
    public closest<T extends Element>(
        type: string | (new (...args: any[]) => T),
        strict: Element | boolean = true,
        from: ClosestOrigin = ClosestOrigin.target
    ): T | Element | null {
        const elements = from === ClosestOrigin.target ? [this.target]
            : document.elementsFromPoint(this.position.x, this.position.y);

        const strictElement = strict instanceof Element ? strict : null;
        const isStrict = strict === true || strictElement !== null;

        const ctor: (new (...args: any[]) => Element) | undefined =
            typeof type === "string" ? customElements.get(type) : type;

        for (let element of elements) {
            if (!ctor) {
                // No registered custom element for the string — CSS selector fallback.
                const match = (element as Element).closest(type as string);
                if (match && (!isStrict || this.isPositionInsideElement(this.position, strictElement ?? match)))
                    return match;
                continue;
            }
            while (element && !((element instanceof ctor)
                && (!isStrict || this.isPositionInsideElement(this.position, strictElement ?? element))
            )) element = element.parentElement;
            if (element) return element as T;
        }
        return null;
    }

    /**
     * @private
     * @function isPositionInsideElement
     * @description Check whether a position falls within an element's bounding box.
     * @param {Point} position - The position to test.
     * @param {Element} element - The element whose bounds are tested against.
     * @returns {boolean} Whether the position is inside the element.
     */
    private isPositionInsideElement(position: Point, element: Element): boolean {
        const rect = element.getBoundingClientRect();
        return position.x >= rect.left && position.x <= rect.right
            && position.y >= rect.top && position.y <= rect.bottom;
    }

    /**
     * @readonly
     * @description The element the event was fired on, or the document when there is no element target.
     */
    public get target() {
        return (super.target as Element) || document;
    }

    /**
     * @readonly
     * @description The event position in document space, obtained by running {@link GradumEvent.position}
     * through `scalePosition`. Falls back to the raw position when scaling is not authorized.
     */
    @cache()
    public get scaledPosition() {
        if (!this.scalingAuthorized) return this.position;
        return this.scalePosition(this.position);
    }

    /**
     * @readonly
     * @description Whether scaled positions are computed for this event. Resolves `authorizeScaling`,
     * calling it first if it is a callback.
     */
    public get scalingAuthorized(): boolean {
        return typeof this.authorizeScaling == "function" ? this.authorizeScaling() : this.authorizeScaling;
    }

    /**
     * @protected
     * @function scalePositionsMap
     * @description Map every point in a per-pointer map into document space. Used by
     * {@link GradumDragEvent} to expose scaled variants of its position maps.
     * @param {GradumMap<number, Point>} [positions] - Positions keyed by pointer id.
     * @returns {GradumMap<number, Point>} A new map with each position scaled. The input is unchanged.
     */
    protected scalePositionsMap(positions?: GradumMap<number, Point>) {
        return positions.mapValues((key, position) => this.scalePosition(position));
    }
}

export {GradumEvent};