/**
 * @internal
 * @callback SignalSubscriber
 * @description Signature for a signal change subscriber. Registered through {@link SignalEntry.sub}
 * and called after the signal's value changes.
 */
export type SignalSubscriber = () => void;

/**
 * @internal
 * @callback Read
 * @template Type - The type of the value read.
 * @description Signature for the read half of a signal.
 * @returns {Type} The current value.
 */
export type Read<Type> = () => Type;

/**
 * @internal
 * @callback Write
 * @template Type - The type of the value written.
 * @description Signature for the write half of a signal.
 * @param {Type} value - The value to store.
 */
export type Write<Type> = (value: Type) => void;

/**
 * @type {SignalEntry}
 * @group Decorators
 * @category Signal
 *
 * @template Type - The type of the value held by the signal.
 * @description The read/write/subscribe surface shared by every signal. {@link SignalBox} adds
 * the ergonomic wrappers on top of this.
 * @property {() => Type} get - Read the current value.
 * @property {(value: Type) => void} set - Store a new value. Subscribers run only if the value actually changed.
 * @property {(updater: (previous: Type) => Type) => void} update - Store a new value derived from the previous one.
 * @property {(fn: SignalSubscriber) => () => void} sub - Subscribe to change notifications. Returns a function that
 * unsubscribes.
 * @property {() => void} emit - Notify subscribers without changing the value. Use it after mutating structural
 * data in place, which `set` cannot detect.
 *
 * @example
 * ```ts
 * const count: SignalEntry<number> = signal(0);
 * const unsub = count.sub(() => console.log("count:", count.get()));
 * count.set(1); // logs "count: 1"
 * count.update(c => c + 1); // logs "count: 2"
 * unsub();
 * ```
 */
type SignalEntry<Type = any> = {
    get(): Type,
    set(value: Type): void,
    update(updater: (previous: Type) => Type): void,
    sub(fn: SignalSubscriber): () => void,
    emit(): void
}

/**
 * @internal
 * @type {Effect}
 * @description A reactive effect: a procedure that re-runs whenever any signal it read during its
 * last run changes.
 * @property {() => void} callback - The procedure to execute on each run.
 * @property {Set<SignalEntry>} dependencies - Signals read during the last run.
 * @property {Array<() => void>} cleanups - Handlers to run before the next execution.
 * @property {boolean} scheduled - Whether a run is already queued, used to coalesce repeated invalidations.
 * @property {() => void} run - Execute the effect: run cleanups, re-collect dependencies, and resubscribe.
 * @property {() => void} dispose - Stop the effect: drop subscriptions and run remaining cleanups.
 */
export type Effect = {
    callback: () => void,
    dependencies: Set<SignalEntry>,
    cleanups: Array<() => void>,
    scheduled: boolean,
    run(): void,
    dispose(): void
}

/**
 * @type {SignalBox}
 * @group Decorators
 * @category Signal
 *
 * @template Type - The type of the value held by the signal.
 * @description A {@link SignalEntry} that can also be used directly as its underlying value. It
 * coerces to the inner value in string, number, and JSON contexts, so it can usually be dropped in
 * wherever the raw value was expected.
 * @property {Type} value - The current value. Mirrors `get()` and `set()`.
 * @property {() => Type} toJSON - The raw value, used by `JSON.stringify`.
 * @property {() => Type} valueOf - The raw value, used in arithmetic and comparison.
 * @property {(hint: "default" | "number" | "string") => string | number} [Symbol.toPrimitive] - Coerces to a number
 * for the `"number"` hint, and to a string for `"string"` and `"default"`.
 *
 * @example
 * ```ts
 * const count: SignalBox<number> = signal(0);
 *
 * // Read
 * console.log(count.get()); // 0
 * console.log(count.value); // 0
 * console.log(+count); // 0
 *
 * // Write
 * count.set(5);
 * count.value = 6;
 * count.update(v => v + 1); // 7
 *
 * // JSON / string
 * console.log(`${count}`); // "7"
 * console.log(JSON.stringify(count)); // 7
 *
 * // Reactivity
 * const unsub = count.sub(() => console.log("changed to", count.get()));
 * count.set(8); // triggers subscriber
 * unsub();
 * ```
 */
type SignalBox<Type> = Type & SignalEntry<Type> & {
    toJSON(): Type,
    valueOf(): Type,
    value: Type,
    [Symbol.toPrimitive](hint: "default" | "number" | "string"): string | number
};

export {SignalEntry, SignalBox};