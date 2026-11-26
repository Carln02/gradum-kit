/**
 * @internal
 * @description The node set of the operator whose UI phases are running, if any. Kept in a module of its own,
 * with no imports, so the hierarchy functions can record into it without importing the MVC classes.
 */
let currentOwner: Set<Node> | undefined;

/**
 * @internal
 * @function recordOwnedNode
 * @description Record a node just added to the DOM as belonging to the operator whose UI phases are running.
 * Called by {@link GradumSelector.addChild} and {@link GradumSelector.addChildBefore}; does nothing outside
 * those phases.
 * @param {Node} node - The node that was added.
 */
export function recordOwnedNode(node: Node): void {
    currentOwner?.add(node);
}

/**
 * @internal
 * @function runWithOwner
 * @description Run some work with `owner` collecting every node it adds through `gradum(...).addChild`.
 * Nests: the previous owner is restored afterwards, whether the work returns or throws. Pass `undefined` to
 * run work whose additions belong to no operator, such as a view's phases.
 * @template Type - What the work returns.
 * @param {Set<Node> | undefined} owner - The set to collect into.
 * @param {() => Type} work - The work to run.
 * @returns {Type} Whatever the work returned.
 */
export function runWithOwner<Type>(owner: Set<Node> | undefined, work: () => Type): Type {
    const previous = currentOwner;
    currentOwner = owner;
    try {
        return work();
    } finally {
        currentOwner = previous;
    }
}

/**
 * @internal
 * @description Anything an MVC piece can tear down when it is detached, such as a {@link GradumObserver}.
 */
export type OwnedDisposable = { destroy(): void };

/**
 * @internal
 * @description The set of the piece whose setup is running, collecting the observers it creates, if any.
 */
let currentDisposableOwner: Set<OwnedDisposable> | undefined;

/**
 * @internal
 * @function recordOwnedDisposable
 * @description Record something just created, such as an observer from {@link GradumModel.generateObserver}, as
 * belonging to the view or operator whose setup is running. Does nothing outside a setup.
 * @param {OwnedDisposable} disposable - What was created.
 */
export function recordOwnedDisposable(disposable: OwnedDisposable): void {
    currentDisposableOwner?.add(disposable);
}

/**
 * @internal
 * @function runWithDisposableOwner
 * @description Run some work with `owner` collecting every observer it creates. Nests like {@link runWithOwner}:
 * the previous owner is restored afterwards. Pass `undefined` to run work whose observers belong to no piece.
 * @template Type - What the work returns.
 * @param {Set<OwnedDisposable> | undefined} owner - The set to collect into.
 * @param {() => Type} work - The work to run.
 * @returns {Type} Whatever the work returned.
 */
export function runWithDisposableOwner<Type>(owner: Set<OwnedDisposable> | undefined, work: () => Type): Type {
    const previous = currentDisposableOwner;
    currentDisposableOwner = owner;
    try {
        return work();
    } finally {
        currentDisposableOwner = previous;
    }
}
