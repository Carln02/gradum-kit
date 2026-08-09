/**
 * @function linearInterpolation
 * @group Utilities
 * @category Interpolation
 *
 * @description Map a value from one range onto another, along the straight line through `(x1, y1)` and
 * `(x2, y2)`. Useful for turning a position into a ratio, a ratio into a size, and so on.
 * @param {number} x - The input value to map.
 * @param {number} x1 - Start of the input range.
 * @param {number} x2 - End of the input range.
 * @param {number} y1 - Value returned when `x` equals `x1`.
 * @param {number} y2 - Value returned when `x` equals `x2`.
 * @param {boolean} [strict=true] - Whether to clamp `x` into `[x1, x2]` first. Set it to `false` to allow
 * extrapolation beyond the given range.
 * @returns {number} The interpolated value.
 */
function linearInterpolation(x: number, x1: number, x2: number, y1: number, y2: number, strict: boolean = true) {
    if (strict) {
        const xMax = Math.max(x1, x2);
        const xMin = Math.min(x1, x2);

        if (x > xMax) x = xMax;
        if (x < xMin) x = xMin;
    }

    return y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
}

export {linearInterpolation};