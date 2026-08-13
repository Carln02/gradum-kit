import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {GradumEventManagerStateProperties} from "../../eventHandling/gradumEventManager/gradumEventManager.types";
import {Propagation} from "./event.types";
import {GradumSelector} from "../gradumSelector";
import {Listener} from "../../gradumComponents/datatypes/listener/listener";
import {MatchListenerProperties} from "../../gradumComponents/datatypes/listener/listener.types";
import {ListenerSet} from "../../gradumComponents/datatypes/listener/listenerSet";
import {HitResolver} from "./event.types";

/**
 * @internal
 * @type {ObjectListeners}
 * @description The listener state held against one node: everything bound through the selector, plus the
 * per-type `preventDefault` handlers and the optional catch-all that decides for any type.
 * @property {ListenerSet} boundListeners - Every listener bound to the node through the selector.
 * @property {Record<string, (e: Event) => boolean>} preventDefaultListeners - Per-event-type decisions.
 * @property {(type: string, e: Event) => boolean} [preventDefaultOn] - Catch-all decision for any type.
 */
type ObjectListeners = {
    boundListeners: ListenerSet,
    preventDefaultListeners: Record<string, (e: Event) => boolean>,
    preventDefaultOn?: (type: string, e: Event) => boolean,
    hitResolver?: HitResolver,
    hitParent?: WeakRef<object>
};

/**
 * @internal
 * @class EventFunctionsUtils
 * @description Shared helpers and per-element state behind the event functions on {@link GradumSelector}.
 */
export class EventFunctionsUtils {
    //Keyed by object rather than by Node: a hit resolver can contribute targets that were never in the DOM,
    //and those take part in dispatch exactly like elements do.
    private dataMap = new WeakMap<object, ObjectListeners>;

    public data(element: object): ObjectListeners {
        if (element instanceof GradumSelector) element = element.element;
        if (!element || !this.dataMap.has(element)) {
            const entry = {
                boundListeners: new ListenerSet(),
                preventDefaultListeners: {},
            };
            if (element) this.dataMap.set(element, entry);
        }
        return this.dataMap.get(element);
    }

    /**
     * @function peek
     * @description The listener state already held against an object, without creating it. Use it for reads
     * that must not allocate — walking a parent chain touches every ancestor.
     * @param {object} element - The object to look up.
     * @returns {ObjectListeners} The entry, or `undefined` when the object has none.
     */
    public peek(element: object): ObjectListeners | undefined {
        if (element instanceof GradumSelector) element = element.element;
        return element ? this.dataMap.get(element) : undefined;
    }

    /**
     * @function parentOf
     * @description One step up the tree, for a DOM node or a virtual hit target alike. Tries the DOM
     * relationships first and falls back to an explicitly assigned {@link GradumSelector.hitParent}, which is
     * how an object painted inside a canvas reaches the element that drew it.
     * @param {object} node - The node or object to climb from.
     * @returns {object} The parent, or `undefined` at the top of the chain.
     */
    public parentOf(node: any): object | undefined {
        if (!node || typeof node !== "object") return undefined;
        //Window is not a Node, and its `parent` is the parent *window* — itself, at top level. Following that
        //would never terminate, and nothing sits above it in a dispatch anyway.
        if (typeof Window !== "undefined" && node instanceof Window) return undefined;
        if (node instanceof Node) return node.parentElement ?? node.parentNode ?? this.peek(node)?.hitParent?.deref();
        return node.parent ?? this.peek(node)?.hitParent?.deref();
    }

    public getBoundListenersSet(element: object): ListenerSet {
        let set = this.data(element).boundListeners;
        if (!set) {
            set = new ListenerSet();
            this.data(element).boundListeners = set;
        }
        return set;
    }

    public getBoundListeners(properties: MatchListenerProperties): Listener[] {
        if (!properties.target) return [];
        if (!properties.manager) properties.manager = GradumEventManager.instance;
        return this.getBoundListenersSet(properties.target).getListeners({
            ...properties,
            optionsToSkip: ["checkConstrainers", "solveConstrainers"]
        });
    }

    public getPreventDefaultListeners(element: Node): Record<string, (e: Event) => boolean> {
        let map = this.data(element).preventDefaultListeners;
        if (!map) {
            map = {};
            this.data(element).preventDefaultListeners = map;
        }
        return map;
    }

    public bypassManager(element: Node, eventManager: GradumEventManager,
                         bypassResults: boolean | GradumEventManagerStateProperties) {
        if (element instanceof GradumSelector) element = element.element;
        if (!element) return;
        if (typeof bypassResults == "boolean") eventManager.lock(element, {
            enabled: bypassResults,
            preventDefaultWheel: bypassResults,
            preventDefaultMouse: bypassResults,
            preventDefaultTouch: bypassResults
        });

        else eventManager.lock(element, {
            enabled: bypassResults.enabled ?? false,
            preventDefaultWheel: bypassResults.preventDefaultWheel ?? false,
            preventDefaultMouse: bypassResults.preventDefaultMouse ?? false,
            preventDefaultTouch: bypassResults.preventDefaultTouch ?? false,
        });
    }

    //TODO FIX IDK
    public processPropagation(
        currentPropagation: Propagation | any,
        storedPropagation: Propagation = Propagation.propagate,
        defaultPropagation: Propagation = Propagation.stopPropagation
    ): Propagation {
        const orderedValues = [
            Propagation.propagate,
            Propagation.stopPropagation,
            Propagation.stopImmediatePropagation
        ];

        if (!orderedValues.includes(currentPropagation)) currentPropagation = defaultPropagation;
        return orderedValues.indexOf(currentPropagation) <= orderedValues.indexOf(storedPropagation)
            ? storedPropagation : currentPropagation;
    }
}
