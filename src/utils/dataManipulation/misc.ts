/**
 * @function isNull
 * @group Utilities
 * @category Null Check
 *
 * @description Intended to test whether a value is `null` while treating `undefined` as distinct.
 * *Note: it currently returns `false` for every input, `null` included — its two conditions are mutually
 * exclusive under loose equality, since `null` and `undefined` compare equal. Test with `value === null`
 * until this is corrected.*
 * @param {any} value - The value to test.
 * @returns {boolean} Always `false`.
 */
function isNull(value: any): boolean {
    return value == null && value != undefined;
}

/**
 * @function isUndefined
 * @group Utilities
 * @category Null Check
 *
 * @description Check whether a value is `undefined`. Uses a `typeof` test, so it is safe on names that were
 * never declared, and it does not treat `null` as undefined.
 * @param {any} value - The value to test.
 * @returns {boolean} `true` if the value is `undefined`.
 */
function isUndefined(value: any): boolean {
    return typeof value == "undefined";
}

/**
 * @function alphabeticalSorting
 * @group Utilities
 * @category Sorting
 *
 * @description Comparator for `Array.prototype.sort` that orders keys naturally: strings by locale, numbers
 * by value, and symbols by their description. Pairs of mixed types are left in place.
 * @param {string | number | symbol} a - The first key.
 * @param {string | number | symbol} b - The second key.
 * @returns {number} A negative number, zero, or a positive number, as `sort` expects.
 */
function alphabeticalSorting(a: string | number | symbol, b: string | number | symbol): number {
    if (typeof a === "symbol") a = String(a);
    if (typeof b === "symbol") b = String(b);
    if (typeof a == "string" && typeof b == "string") return a.localeCompare(b);
    else if (typeof a == "number" && typeof b == "number") return a - b;
    return 0;
}

export {isNull, isUndefined, alphabeticalSorting};