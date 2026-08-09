/**
 * @function textToElement
 * @group Utilities
 * @category DOM
 *
 * @description Parse a string of HTML into a live element. Only the first top-level element of the string is
 * returned, so wrap multiple siblings in a container if you need all of them.
 * @param {string} text - The markup to parse.
 * @returns {Element} The parsed element, or `undefined` if the string held no element.
 */
function textToElement(text: string): Element {
    let wrapper = document.createElement("div");
    wrapper.innerHTML = text;
    return wrapper.children[0];
}

/**
 * @function createProxy
 * @group Utilities
 * @category DOM
 *
 * @template {object} SelfType - The type of the primary object.
 * @template {object} ProxiedType - The type of the fallback object.
 * @description Combine two objects into one, without copying anything. Reads and writes go to the first
 * object when it already has the property, and fall through to the second otherwise — so the first shadows
 * the second, and both stay live rather than being snapshotted.
 * @param {SelfType} self - The primary object, consulted first.
 * @param {ProxiedType} proxied - The fallback object, used for anything the primary lacks.
 * @returns {SelfType & ProxiedType} A proxy exposing both objects as one.
 */
function createProxy<SelfType extends object, ProxiedType extends object>(self: SelfType, proxied: ProxiedType)
    : SelfType & ProxiedType {
    return new Proxy(self, {
        get(target, prop, receiver) {
            if (prop in target) return Reflect.get(target, prop, receiver);
            if (prop in proxied) return Reflect.get(proxied, prop, receiver);
            return undefined;
        },
        set(target, prop, value, receiver) {
            if (prop in target) return Reflect.set(target, prop, value, receiver);
            return Reflect.set(proxied, prop, value, receiver);
        }
    }) as SelfType & ProxiedType;
}

export {textToElement, createProxy};