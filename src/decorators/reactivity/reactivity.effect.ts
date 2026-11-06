import {Effect} from "./reactivity.types";
import {ReactivityUtils} from "./reactivity.utils";

/**
 * @internal
 * @class EffectUtils
 * @description Builds and runs {@link Effect} objects for the `@effect` decorator. Handles dependency
 * collection, cleanup between runs, and teardown.
 */
export class EffectUtils {
    public constructor(private readonly utils: ReactivityUtils) {}

    public makeEffect(callback: () => void): Effect {
        const utils = this.utils;
        return {
            callback,
            dependencies: new Set(),
            cleanups: [],
            scheduled: false,
            disposed: false,
            run() {
                //A run queued before the effect was disposed — by the same write that led to the disposal —
                //still reaches here. It is skipped, so a disposed effect never writes again.
                if (this.disposed) return;
                for (const c of this.cleanups) c();
                this.cleanups = [];
                this.dependencies = new Set();

                utils.activeEffect = this;
                try { this.callback(); } finally { utils.activeEffect = null; }

                //Disposed by its own callback: following its signals again would bring it back.
                if (this.disposed) return;
                for (const dep of this.dependencies) {
                    const unsub = dep.sub(() => utils.schedule(this));
                    this.cleanups.push(unsub);
                }
            },
            dispose() {
                this.disposed = true;
                for (const c of this.cleanups) c();
                this.cleanups = [];
                this.dependencies.clear();
            }
        };
    }
}