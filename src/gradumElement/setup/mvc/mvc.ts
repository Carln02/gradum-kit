import {MvcFields} from "../../../gradumFunctions/mvc/mvc";
import {gradum} from "../../../gradumFunctions/gradumFunctions";

/**
 * Define MVC-style accessors on a class prototype via Object.defineProperty.
 * Adds: view, model, emitter, operators, handlers, interactors, tools, constrainers,
 * data, dataId, dataIndex, dataSize, and all add/get/remove methods.
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