/**
 * @function hashString
 * @group Utilities
 * @category Hash
 *
 * @description Hash a string with SHA-256 and render it as hexadecimal. Use it when you need a stable
 * fingerprint of some content; use {@link hashBySize} when the result has to fit a length budget.
 * @param {string} input - The string to hash.
 * @returns {Promise<string>} The 64-character hexadecimal digest.
 */
async function hashString(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

/**
 * @function hashBySize
 * @group Utilities
 * @category Hash
 *
 * @description Hash a string with SHA-256 and render it as a short, URL-safe string of the requested length.
 * The alphabet is base64 with `+` and `/` swapped for `-` and `_` and the padding dropped, so the result is
 * safe in URLs and identifiers. Shorter lengths raise the chance of collisions.
 * @param {string} input - The string to hash.
 * @param {number} [chars=12] - How many characters the result should be.
 * @returns {Promise<string>} The truncated URL-safe digest.
 */
async function hashBySize(input: string, chars = 12): Promise<string> {
    const bytes = Math.ceil((chars * 6) / 8);

    const enc = new TextEncoder();
    const digest = await crypto.subtle.digest("SHA-256", enc.encode(input));
    const slice = new Uint8Array(digest).slice(0, bytes);

    return (typeof btoa === "function"
        ? btoa(String.fromCharCode(...slice))
        : Buffer.from(slice).toString("base64"))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "")
        .slice(0, chars);
}

export {hashString, hashBySize};