/**
 * @internal
 * @type {ObserveConstructorType}
 * @description Per-constructor bookkeeping, recording which property keys already had their observed
 * accessor installed so a class is only patched once.
 * @property {Map<PropertyKey, boolean>} installed - Property keys already installed on the prototype.
 */
type ObserveConstructorType = {
    installed: Map<PropertyKey, boolean>
};

/**
 * @internal
 * @class ObserveUtils
 * @description Tracks which properties the `@observe` decorator has already patched, keyed by prototype.
 */
export class ObserveUtils {
    private constructorMap = new WeakMap<object, ObserveConstructorType>();

    public constructorData(target: object) {
        let obj = this.constructorMap.get(target);
        if (!obj) {
            obj = {installed: new Map()};
            this.constructorMap.set(target, obj);
        }
        return obj!;
    }
}