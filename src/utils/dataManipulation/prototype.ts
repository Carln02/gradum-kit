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
 * @function getDeclaringPrototype
 * @group Utilities
 * @category Prototype
 *
 * @description Find which prototype in a chain declared a particular getter, setter, or method — the one
 * whose own descriptor still holds the given function. Where {@link getFirstPrototypeInChainWith} answers
 * "who declares this name", this answers "who declares *this* function", so an override of the same name is
 * passed over rather than matched.
 *
 * Use it when a decorator needs the class a member was written on: a decorator's initializer runs for
 * instances of subclasses too, and those report their own prototype rather than the declaring one.
 *
 * The search starts at `object` itself, unlike {@link getFirstPrototypeInChainWith}, and stops before
 * `Object.prototype`.
 *
 * *Note: the answer is only available while the member is still in place. Once something has redefined the
 * property — a decorator installing a wrapper over it, say — the function is nowhere in the chain and the
 * result is `undefined`, so look it up before replacing anything.*
 * @param {object} object - The object or prototype to search from.
 * @param {PropertyKey} key - The property the function is defined under.
 * @param {Function} member - The function to look for: a getter, a setter, or a method.
 * @returns {any} The prototype declaring it, or `undefined` if the function is nowhere in the chain.
 */
function getDeclaringPrototype(object: object, key: PropertyKey, member: Function): any {
    let currentObject: any = object;
    while (currentObject && currentObject !== Object.prototype) {
        const descriptor = Object.getOwnPropertyDescriptor(currentObject, key);
        if (descriptor && (descriptor.get === member || descriptor.set === member
            || descriptor.value === member)) return currentObject;
        currentObject = Object.getPrototypeOf(currentObject);
    }
    return undefined;
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

export {getPrototypeChain, getConstructorChain, getFirstDescriptorInChain, getFirstPrototypeInChainWith, getDeclaringPrototype, hasPropertyInChain, getSuperMethod, getSuperDescriptor};