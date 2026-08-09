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
 * @param {number} value - The value to wrap.
 * @param {number} modValue - The modulus. Must be non-zero.
 * @returns {number} The wrapped value, always in `[0, modValue)`.
 * @throws {RangeError} If `modValue` is `0`, since no value can be wrapped into an empty range. Guard the
 * call when the modulus comes from a length that may be zero.
 */
function mod(value: number, modValue: number): number {
    if (modValue === 0) throw new RangeError("mod: modValue must be non-zero.");
    return ((value % modValue) + modValue) % modValue;
}
export {trim, mod};