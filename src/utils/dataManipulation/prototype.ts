/**
 * @function getFirstDescriptorInChain
 * @group Utilities
 * @category Prototype
 *
 * @description Find how a property is defined on an object or the closest ancestor that declares it, giving
 * you the getter, setter, or value rather than just the resolved result. The search starts at the object
 * itself and stops before `Object.prototype`, so inherited built-ins are never returned.
 * @param {object} object - The object to search from.
 * @param {PropertyKey} key - The property to look for.
 * @returns {PropertyDescriptor} The nearest descriptor, or `undefined` if nothing in the chain declares it.
 */
function getFirstDescriptorInChain(object: object, key: PropertyKey): PropertyDescriptor {
    let currentObject: any = object;
    while (currentObject && currentObject !== Object.prototype) {
        const descriptor = Object.getOwnPropertyDescriptor(currentObject, key);
        if (descriptor) return descriptor;
        currentObject = Object.getPrototypeOf(currentObject);
    }
    return undefined;
}

/**
 * @function hasPropertyInChain
 * @group Utilities
 * @category Prototype
 *
 * @description Check whether an object or any of its ancestors declares a property as its own. Unlike `in`,
 * the search stops before `Object.prototype`, so built-ins such as `toString` do not count as a match.
 * @param {object} object - The object to search from.
 * @param {PropertyKey} key - The property to look for.
 * @returns {boolean} `true` if the property is declared anywhere in the chain.
 */
function hasPropertyInChain(object: object, key: PropertyKey): boolean {
    let currentObject: any = object;
    while (currentObject && currentObject !== Object.prototype) {
        if (Object.prototype.hasOwnProperty.call(currentObject, key)) return true;
        currentObject = Object.getPrototypeOf(currentObject);
    }
    return false;
}

/**
 * @function getFirstPrototypeInChainWith
 * @group Utilities
 * @category Prototype
 *
 * @description Find the nearest ancestor prototype that declares a property, skipping the object itself. Use
 * it to locate which class in a hierarchy a member came from.
 * @param {object} object - The object to search from.
 * @param {PropertyKey} key - The property to look for.
 * @returns {any} The nearest prototype declaring it, or `undefined` if none does.
 */
function getFirstPrototypeInChainWith(object: object, key: PropertyKey): any {
    let currentObject: any = Object.getPrototypeOf(object);
    while (currentObject && currentObject !== Object.prototype) {
        const descriptor = Object.getOwnPropertyDescriptor(currentObject, key);
        if (descriptor) return currentObject;
        currentObject = Object.getPrototypeOf(currentObject);
    }
    return undefined;
}

/**
 * @internal
 * @function getLastPrototypeInChainWith
 * @description Find the furthest ancestor prototype that declares a property — the base-most definition,
 * where {@link getFirstPrototypeInChainWith} finds the nearest override.
 * @param {object} object - The object to search from.
 * @param {PropertyKey} key - The property to look for.
 * @returns {any} The furthest prototype declaring it, or `undefined` if none does.
 */
function getLastPrototypeInChainWith(object: object, key: PropertyKey): any {
    let currentObject: any = Object.getPrototypeOf(object);
    let result: PropertyDescriptor;
    while (currentObject && currentObject !== Object.prototype) {
        const descriptor = Object.getOwnPropertyDescriptor(currentObject, key);
        if (descriptor) result = currentObject;
        currentObject = Object.getPrototypeOf(currentObject);
    }
    return result;
}

/**
 * @function getSuperMethod
 * @group Utilities
 * @category Prototype
 *
 * @description Find the inherited implementation a wrapper is standing in for, so a decorator or patched
 * method can call through to it. The wrapper itself is skipped, which is what stops a patched method from
 * finding and recursing into itself.
 * @param {object} object - The object whose ancestors to search.
 * @param {PropertyKey} key - The member to look for.
 * @param {Function} wrapperFn - The wrapping function to skip over.
 * @returns {Function} The inherited implementation, or `undefined` if there is none.
 */
function getSuperMethod(object: object, key: PropertyKey, wrapperFn: Function): Function {
    let currentObject: any = Object.getPrototypeOf(object);
    while (currentObject && currentObject !== Object.prototype) {
        const descriptor = Object.getOwnPropertyDescriptor(currentObject, key);
        const fn = descriptor?.value ?? descriptor?.get ?? descriptor?.set;
        if (typeof fn === "function" && fn !== wrapperFn) return fn;
        currentObject = Object.getPrototypeOf(currentObject);
    }
    return undefined;
}

/**
 * @function getSuperDescriptor
 * @group Utilities
 * @category Prototype
 *
 * @description Find how a property is defined one level further up than {@link getFirstPrototypeInChainWith}
 * looks, skipping both the object and its immediate prototype. Use it from inside a class to reach the
 * definition its own prototype is overriding.
 * @param {object} object - The object whose ancestors to search.
 * @param {PropertyKey} key - The property to look for.
 * @returns {PropertyDescriptor} The inherited descriptor, or `undefined` if none exists.
 */
function getSuperDescriptor(object: object, key: PropertyKey): PropertyDescriptor {
    let currentObject = Object.getPrototypeOf(object);
    if (currentObject) currentObject = Object.getPrototypeOf(currentObject);

    while (currentObject && currentObject !== Object.prototype) {
        const descriptor = Object.getOwnPropertyDescriptor(currentObject, key);
        if (descriptor) return descriptor;
        currentObject = Object.getPrototypeOf(currentObject);
    }
    return undefined;
}

/**
 * @function getPrototypeChain
 * @group Utilities
 * @category Prototype
 *
 * @description List an object's prototype chain, nearest first. Passing a class lists the class and its
 * ancestors; passing an instance starts at its prototype. Used to walk a hierarchy and merge each level's
 * static defaults.
 * @param {object} object - The instance or class to walk.
 * @returns {any[]} The chain from nearest to furthest, stopping before `Function.prototype`.
 */
function getPrototypeChain(object: object) {
    const chain: any[] = [];
    let constructor = typeof object === "function" ? object : Object.getPrototypeOf(object);
    while (constructor && constructor !== Function.prototype) {
        chain.push(constructor);
        constructor = Object.getPrototypeOf(constructor);
    }
    return chain;
}

/**
 * @function getConstructorChain
 * @group Utilities
 * @category Prototype
 *
 * @description List the constructors an object inherits from, nearest first. Where {@link getPrototypeChain}
 * yields prototypes, this yields the classes themselves.
 * @param {object} object - The instance or class to walk.
 * @returns {any[]} The constructors from nearest to furthest, stopping before `Object`.
 */
function getConstructorChain(object: object): any[] {
    const chain: any[] = [];
    let constructor = typeof object === "function" ? object : object.constructor;
    while (constructor && constructor !== Object) {
        chain.push(constructor);
        constructor = Object.getPrototypeOf(constructor);
    }
    return chain;
}

export {getPrototypeChain, getConstructorChain, getFirstDescriptorInChain, getFirstPrototypeInChainWith, hasPropertyInChain, getSuperMethod, getSuperDescriptor};