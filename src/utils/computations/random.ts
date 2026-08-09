/**
 * @function randomId
 * @group Utilities
 * @category Random
 *
 * @description Generate a random identifier from the platform's cryptographic random source. Prefer it over
 * {@link randomString} whenever the value has to be unpredictable, such as an element or record ID.
 * @param {number} [length=8] - How many characters the ID should be.
 * @returns {string} A random alphanumeric ID of the requested length.
 */
function randomId(length: number = 8): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => b.toString(36).padStart(2, "0"))
        .join("")
        .slice(0, length);
}

/**
 * @function randomFromRange
 * @group Utilities
 * @category Random
 *
 * @description Pick a random number between two bounds. The bounds may be given in either order, and
 * non-numeric input yields `0` rather than `NaN`.
 * @param {number} n1 - One end of the range.
 * @param {number} n2 - The other end of the range.
 * @returns {number} A number in `[min, max)`, or `0` if either bound was not a number.
 */
function randomFromRange(n1: number, n2: number) {
    if (typeof n1 != "number" || typeof n2 != "number") return 0;
    const min = Math.min(n1, n2);
    const max = Math.max(n1, n2);
    return (Math.random() * (max - min)) + min;
}

/**
 * @function randomString
 * @group Utilities
 * @category Random
 *
 * @description Generate a random alphanumeric string from `Math.random`. Suitable for filler and test data;
 * use {@link randomId} instead when the value must be unguessable.
 * @param {number} [length=12] - How many characters the string should be.
 * @returns {string} A random string of the requested length.
 */
function randomString(length: number = 12): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}

export {randomString, randomFromRange, randomId};