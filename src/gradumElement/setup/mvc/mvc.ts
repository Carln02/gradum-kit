import {MvcFields} from "../../../gradumFunctions/mvc/mvc";
import {gradum} from "../../../gradumFunctions/gradumFunctions";

/**
 * @internal
 * @function defineMvcAccessors
 * @template {new (...args: any[]) => any} Type - The class being set up.
 * @description Install the MVC surface on a class prototype, so instances expose `view`, `model`,
 * `emitter`, `operators`, `handlers`, `interactors`, `tools`, `constrainers`, `data`, `dataId`,
 * `dataIndex`, `dataSize`, and the matching add/get/remove methods. Each one forwards to the element's
 * selector, which is where the state actually lives. Called once per element class at definition time.
 * @param {Type} constructor - The class whose prototype receives the accessors.
 */
export function defineMvcAccessors<Type extends new (...args: any[]) => any>(constructor: Type) {
    const prototype = constructor.prototype;

    // Fields — proxy through gradum(this)
    [...MvcFields, "data", "dataId", "dataIndex"].forEach(fieldName => {
        Object.defineProperty(prototype, fieldName, {
            get() { return gradum(this)[fieldName]; },
            set(value) { gradum(this)[fieldName] = value; },
            configurable: true,
            enumerable: true,
        });
    });


    ["dataSize"].forEach(fieldName => {
        Object.defineProperty(prototype, fieldName, {
            get() { return gradum(this)[fieldName]; },
            configurable: true,
            enumerable: true,
        });
    });
}