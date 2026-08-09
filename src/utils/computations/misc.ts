/**
 * @function trim
 * @group Utilities
 * @category Numbers
 *
 * @description Clamp a number into a range. Anything that is not a number comes back as the fallback rather
 * than as `NaN`, so it is safe to pass unvalidated input straight in.
 * *Note: the bounds are given max-first.*
 * @param {number} value - The value to clamp.
 * @param {number} max - Upper bound, inclusive.
 * @param {number} [min=0] - Lower bound, inclusive.
 * @param {number} [fallback=0] - Returned when `value` is not a number.
 * @returns {number} The value clamped into `[min, max]`, or `fallback` if it was not a number.
 */
function trim(value: number, max: number, min: number = 0, fallback: number = 0): number {
    if (value === undefined || typeof value !== "number") return fallback;
    if (value < min) value = min;
    if (value > max) value = max;
    return value;
}

/**
 * @function mod
 * @group Utilities
 * @category Numbers
 *
 * @description Wrap a number into `[0, modValue)`, so negative inputs come back positive — unlike the `%`
 * operator, which keeps the sign of its left operand. Use it to cycle an index around a list.
 * *Note: `modValue` must be non-zero. The parameter declares a default of `0`, but relying on it loops
 * forever, so always pass one explicitly.*
 * @param {number} value - The value to wrap.
 * @param {number} modValue - The modulus. Must be non-zero.
 * @returns {number} The wrapped value, always in `[0, modValue)`.
 */
function mod(value: number, modValue: number = 0): number {
    while (value < 0) value += modValue;
    while (value >= modValue) value -= modValue;
    return value;
}
export {trim, mod};