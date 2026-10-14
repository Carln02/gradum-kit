import {GradumModel} from "../model/model";
import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";
import {FlatKeyType, KeyType} from "../../types/basic.types";
import {addRegistryCategory, define} from "../../decorators/define/define";

/**
 * @class GradumEmitter
 * @group MVC
 * @category Emitter
 *
 * @template {GradumModel} ModelType - The element's MVC model type.
 * @template {KeyType} DataKeyType - The key type of the MVC's model.
 * @description The base MVC emitter class. Its role is basically an event bus. It allows the different parts of the
 * MVC structure to fire events or listen to some, with various methods.
 */
class GradumEmitter<ModelType extends GradumModel = GradumModel, DataKeyType extends KeyType = KeyType> {
    /**
     * @description Map containing all custom callbacks.
     * @protected
     */
    protected readonly callbacks: Map<string, Delegate<(...args: any[]) => void>> = new Map();

    /**
     * @description Map containing all data callbacks.
     * @protected
     */
    protected readonly dataCallbacks: Map<FlatKeyType, Delegate<(value: any, ...keys: DataKeyType[]) => void>> = new Map();

    /**
     * @description The attached MVC model.
     */
    public model?: ModelType;

    /**
     * @description What each piece subscribed while the emitter was attributing to it, so
     * {@link GradumEmitter.removeFor} can take exactly those back. Weak, so a piece that is simply
     * dropped takes its entry with it.
     * @protected
     */
    protected readonly owned: WeakMap<object, {events: [string, (...args: any[]) => void][],
        keys: [FlatKeyType, (...args: any[]) => void][]}> = new WeakMap();

    /**
     * @description Whoever is being attributed to right now, if anyone.
     * @protected
     */
    protected owner?: object;

    /**
     * @constructor
     * @description Create an emitter, optionally bound to a model so key-path events can be fired against it.
     * @param {ModelType} [model] - The model whose key changes this emitter relays.
     */
    public constructor(model?: ModelType) {
        if (model) this.model = model;
    }

    /**
     * @function add
     * @description Register a callback for the given event name.
     * @param {string} event - The event name.
     * @param {(...args: any[]) => void} callback - The callback to invoke when the event fires.
     */
    public add(event: string, callback: (...args: any[]) => void): void {
        if (!this.callbacks.has(event)) this.callbacks.set(event, new Delegate());
        this.callbacks.get(event)?.add(callback);
        if (this.owner) this.record(this.owner).events.push([event, callback]);
    }

    /**
     * @function remove
     * @description Remove a specific callback from the given event, or all callbacks if omitted.
     * @param {string} event - The event name.
     * @param {(...args: any[]) => void} [callback] - The callback to remove. If omitted,
     * all callbacks for the event are removed.
     */
    public remove(event: string, callback?: (...args: any[]) => void): void {
        if (!callback) this.callbacks.delete(event);
        else this.callbacks.get(event)?.remove(callback);
    }

    /**
     * @function fire
     * @description Trigger all callbacks registered for the given event name.
     * @param {string} event - The event name.
     * @param {...any[]} args - Arguments passed to each callback.
     * @returns {any} What the callbacks returned — the last one to return anything wins — or `undefined`
     * when none did. Lets a caller learn the outcome of what it fired, rather than only that it fired.
     */
    public fire(event: string, ...args: any[]): any {
        return this.callbacks.get(event)?.fire(...args);
    }

    /**
     * @function addKey
     * @description Register a callback fired when the entry at the given key path changes in the model.
     * The callback receives the new value as its first argument, followed by the key path as spread arguments.
     * @param {(value: any, ...keys: DataKeyType[]) => void} callback - The callback to register.
     * @param {...DataKeyType[]} keys - Ordered path from outermost to innermost key.
     */
    public addKey(callback: (value: any, ...keys: DataKeyType[]) => void, ...keys: DataKeyType[]): void {
        const flatKey = this.resolveFlatKey(keys);
        if (!this.dataCallbacks.has(flatKey)) this.dataCallbacks.set(flatKey, new Delegate());
        this.dataCallbacks.get(flatKey)?.add(callback);
        if (this.owner) this.record(this.owner).keys.push([flatKey, callback as any]);
    }

    /**
     * @function removeKey
     * @description Remove a specific callback for the given key path, or all callbacks if omitted.
     * @param {(value: any, ...keys: DataKeyType[]) => void} [callback] - The callback to remove. If omitted,
     * all callbacks for this path are removed.
     * @param {...DataKeyType[]} keys - Ordered path from outermost to innermost key.
     */
    public removeKey(callback: (value: any, ...keys: DataKeyType[]) => void, ...keys: DataKeyType[]): void {
        const flatKey = this.resolveFlatKey(keys);
        if (!callback) this.dataCallbacks.delete(flatKey);
        else this.dataCallbacks.get(flatKey)?.remove(callback);
    }

    /**
     * @function fireKey
     * @description Trigger all callbacks registered for the given key path.
     * Called automatically when the model fires a change notification at this path.
     * @param {any} value - The new value at the key path.
     * @param {...DataKeyType[]} keys - Ordered path from outermost to innermost key.
     */
    public fireKey(value: any, ...keys: DataKeyType[]): void {
        const flatKey = this.resolveFlatKey(keys);
        this.dataCallbacks.get(flatKey)?.fire(value, ...keys);
    }

    /**
     * @function attributeTo
     * @description Run some work and remember that whatever it subscribes belongs to `owner`, so
     * {@link GradumEmitter.removeFor} can take it back later. What the MVC wiring runs a piece's setup
     * inside, so an operator writing `this.emitter.add(...)` in `setupChangedCallbacks` is on the record
     * without having to say whose it is.
     *
     * Nests safely: the previous owner is restored afterwards, whether the work returns or throws.
     * @template Type - What the work returns.
     * @param {object} owner - The piece to attribute to.
     * @param {() => Type} work - The work to run.
     * @returns {Type} Whatever the work returned.
     */
    public attributeTo<Type>(owner: object, work: () => Type): Type {
        const previous = this.owner;
        this.owner = owner;
        try {
            return work();
        } finally {
            this.owner = previous;
        }
    }

    /**
     * @function removeFor
     * @description Take back everything a piece subscribed through
     * {@link GradumEmitter.attributeTo}. What a piece being detached calls, so it stops hearing about
     * things — unbinding its listeners is not enough on its own, since this is the other way a piece
     * listens, and a detached piece is one whose model and view are about to be taken away.
     * @param {object} owner - The piece to forget.
     */
    public removeFor(owner: object): void {
        const record = this.owned.get(owner);
        if (!record) return;
        this.owned.delete(owner);

        for (const [event, callback] of record.events) this.callbacks.get(event)?.remove(callback);
        for (const [flatKey, callback] of record.keys) this.dataCallbacks.get(flatKey)?.remove(callback as any);
    }

    /**
     * @description The record kept for a piece, started if it has none yet.
     * @param {object} owner - The piece to look up.
     * @returns {object} Its record.
     * @protected
     */
    protected record(owner: object) {
        let entry = this.owned.get(owner);
        if (!entry) {
            entry = {events: [], keys: []};
            this.owned.set(owner, entry);
        }
        return entry;
    }

    /**
     * @protected
     * @function resolveFlatKey
     * @description Convert a key path to a stable flat string key for internal storage lookup. Joins with `"|"`.
     * @param {DataKeyType[]} keys - The key path to flatten.
     * @returns {FlatKeyType} The flat key, suitable for use as a map key.
     */
    protected resolveFlatKey(keys: DataKeyType[]): FlatKeyType {
        return keys.map(k => typeof k === "symbol" ? `@@${k.description ?? ""}` : String(k)).join("|");
    }
}

addRegistryCategory(GradumEmitter);
define(GradumEmitter);
export {GradumEmitter};