import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {GradumEventManagerStateProperties} from "../../eventHandling/gradumEventManager/gradumEventManager.types";
import {BasicInputEvents, NonPassiveEvents, PreventDefaultOptions, Propagation} from "./event.types";
import {GradumSelector} from "../gradumSelector";
import {Listener} from "../../gradumComponents/datatypes/listener/listener";
import {MatchListenerProperties} from "../../gradumComponents/datatypes/listener/listener.types";
import {ListenerSet} from "../../gradumComponents/datatypes/listener/listenerSet";
import {HitResolver} from "./event.types";

/**
 * @internal
 * @type {ObjectListeners}
 * @description The listener state held against one node: everything bound through the selector, plus the
 * handlers that carry its `preventDefaults` decision to the event types the manager does not see.
 * @property {ListenerSet} boundListeners - Every listener bound to the node through the selector.
 * @property {Record<string, (e: Event) => boolean>} preventDefaultListeners - Per-event-type decisions.
 * @property {boolean | PreventDefaultDecision} [preventDefaults] - Whether defaults may be cancelled here.
 */
type ObjectListeners = {
    boundListeners: ListenerSet,
    preventDefaultListeners: Record<string, (e: Event) => boolean>,
    preventDefaults?: boolean | ((type: string, e: Event) => boolean),
    hitResolver?: HitResolver,
    hitParent?: WeakRef<object>
};

/**
 * @internal
 * @description The `<input>` types that are not text entry. Everything else an `<input>` can be — including
 * a type the browser does not recognise, which it reports as `"text"` — is somewhere you can type.
 */
const nonTextInputTypes = new Set(["button", "checkbox", "color", "file", "hidden", "image", "radio",
    "range", "reset", "submit"]);

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

    /**
     * @function isTextEntry
     * @description Whether a node is somewhere the platform lets you type: a text `<input>`, a `<textarea>`,
     * or anything editable in place. The browser answers this itself, so no element has to say so.
     * @param {any} node - The node to test.
     * @returns {boolean} Whether it is text entry.
     */
    public isTextEntry(node: any): boolean {
        if (!(node instanceof HTMLElement)) return false;
        if (node.isContentEditable) return true;
        if (node instanceof HTMLTextAreaElement) return true;
        return node instanceof HTMLInputElement && !nonTextInputTypes.has(node.type);
    }

    /**
     * @function shouldPreventDefaults
     * @description Whether the manager may cancel the browser's own handling of an interaction that started
     * on this node.
     *
     * Answered by the nearest thing up the tree with an opinion: an element that has been given
     * {@link GradumSelector.preventDefaults} decides for itself and everything inside it, and failing that
     * text entry decides for itself — cancelling the default of a press on a field is how the platform is
     * told not to move focus, place the caret, or extend a selection as the pointer drags. Nothing above
     * saying otherwise, the manager's own settings have the last word.
     * @param {any} target - What the interaction started on.
     * @param {string} [type] - The event type being decided, for a node that answers with a function.
     * @param {Event} [e] - The event being decided, likewise.
     * @returns {boolean} Whether the default may be cancelled.
     */
    public shouldPreventDefaults(target: any, type?: string, e?: Event): boolean {
        let node = target;
        while (node) {
            const set = this.peek(node)?.preventDefaults;
            if (typeof set === "function") return !!set(type, e);
            if (set !== undefined) return set;
            if (this.isTextEntry(node)) return false;
            //The same climb a dispatch makes, plus the hop a shadow root needs: its host is not its parent,
            //and without it a field inside a component would answer for nothing above itself.
            node = this.parentOf(node) ?? node.host;
        }
        return true;
    }

    /**
     * @function reachPreventDefaults
     * @description Bind a listener per event type so the node's {@link GradumSelector.preventDefaults}
     * decision reaches the events the event manager never sees — selecting, dragging, the context menu.
     * Replaces whatever the last call bound, and binds nothing when the decision is an outright no.
     * @param {GradumSelector} selector - The node to bind on.
     * @param {PreventDefaultOptions} options - Which events to reach, and what else to do with them.
     */
    public reachPreventDefaults(selector: GradumSelector, options: PreventDefaultOptions) {
        const element = selector.element as Node;
        if (!element) return;

        //Whatever the last setting bound is taken off first: the types may have changed, and a node told
        //not to prevent anything should be left with nothing bound at all.
        const listeners = this.getPreventDefaultListeners(element);
        for (const [type, listener] of Object.entries(listeners)) {
            selector.removeListener(type, listener);
            delete listeners[type];
        }
        if (this.peek(element)?.preventDefaults === false) return;

        const manager = options.manager ?? GradumEventManager.instance;
        const phase = options.phase ?? "capture";
        const stop = options.stop ?? false;
        const nonPassive = new Set<string>(NonPassiveEvents);

        for (const type of new Set<string>(options.types ?? BasicInputEvents as any)) {
            const handler = (event: Event) => {
                //Resolved from what the event landed on rather than from the node this is bound to, so a
                //blanket setting high up no longer reaches into the fields inside it.
                if (!this.shouldPreventDefaults(event.target ?? element, type, event)) return false;
                event.preventDefault?.();
                if (stop === "immediate") event.stopImmediatePropagation?.();
                else if (stop === "stop") event.stopPropagation?.();
                return true;
            };
            listeners[type] = handler;

            const listenerOptions: Record<string, boolean> = {};
            if (phase === "capture") listenerOptions.capture = true;
            if (nonPassive.has(type)) listenerOptions.passive = false;
            selector.on(type, handler, listenerOptions, manager);
        }
    }

    /**
     * @function bypassManager
     * @description Stand the manager down for an element, as far as that element asked for.
     *
     * What the predicate returns says what to *bypass*, which is what the name and the one consumer both
     * read it as — `true` stands the manager down, `false` leaves it alone. A lock is a veto over the
     * manager's own settings, so bypassing is locking the vetoed parts **off**, and not bypassing is no
     * lock at all rather than a lock of every part on: a lock also names its origin, which the manager
     * reads to decide whether a press landed outside what it locked.
     * @param {Node} element - The element asking.
     * @param {GradumEventManager} eventManager - The manager to stand down.
     * @param {boolean | GradumEventManagerStateProperties} bypassResults - What to bypass: `true` for all
     * of it, `false` for none, or a field per part.
     */
    public bypassManager(element: Node, eventManager: GradumEventManager,
                         bypassResults: boolean | GradumEventManagerStateProperties) {
        if (element instanceof GradumSelector) element = element.element;
        if (!element) return;

        const bypass = typeof bypassResults === "boolean"
            ? {enabled: bypassResults, preventDefaultWheel: bypassResults,
                preventDefaultMouse: bypassResults, preventDefaultTouch: bypassResults}
            : {enabled: bypassResults.enabled ?? false,
                preventDefaultWheel: bypassResults.preventDefaultWheel ?? false,
                preventDefaultMouse: bypassResults.preventDefaultMouse ?? false,
                preventDefaultTouch: bypassResults.preventDefaultTouch ?? false};

        if (!bypass.enabled && !bypass.preventDefaultWheel
            && !bypass.preventDefaultMouse && !bypass.preventDefaultTouch) {
            eventManager.unlock();
            return;
        }

        //Each part asked for is vetoed off; the rest are left for the manager's own settings to answer.
        eventManager.lock(element, {
            enabled: bypass.enabled ? false : undefined,
            preventDefaultWheel: bypass.preventDefaultWheel ? false : undefined,
            preventDefaultMouse: bypass.preventDefaultMouse ? false : undefined,
            preventDefaultTouch: bypass.preventDefaultTouch ? false : undefined,
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
