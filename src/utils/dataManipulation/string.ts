import {isUndefined} from "./misc";

/**
 * @function stringify
 * @group Utilities
 * @category String
 *
 * @description Render any value as a string that {@link parse} can turn back into an equivalent value. Dates
 * become ISO strings, arrays are stringified entry by entry, and DOM elements collapse to the placeholder
 * `"[DOM ELEMENT]"` rather than being serialized.
 * @param {any} value - The value to render.
 * @returns {string} The string form, or `undefined` when the value is `null` or `undefined`.
 */
function stringify(value: any): string {
    if (value === null || value === undefined) return undefined;

    switch (typeof value) {
        case "string":
            return value;
        case "number":
        case "boolean":
        case "bigint":
        case "symbol":
        case "function":
            return value.toString();
        case "object":
            if (Array.isArray(value)) return JSON.stringify(value.map(entry => stringify(entry)));
            else if (value instanceof Date) return value.toISOString();
            else if (value instanceof Element) return "[DOM ELEMENT]";
            else {
                try {
                    return JSON.stringify(value);
                } catch {
                    return "[object Object]";
                }
            }
        default:
            return String(value);
    }
}

/**
 * @function parse
 * @group Utilities
 * @category String
 *
 * @description Turn a string produced by {@link stringify} back into a value, recovering booleans, `null`,
 * numbers, bigints, objects, and arrays. Anything it cannot place comes back unchanged as the original string.
 * *Note: strings that look like function source are evaluated, so only parse input you trust.*
 * @param {string} str - The string to convert back.
 * @returns {any} The recovered value, or the original string if it matched no known form.
 */
function parse(str: string): any {
    if (isUndefined(str)) return undefined;
    switch (str) {
        case "null":
            return null;
        case "true":
            return true;
        case "false":
            return false;
    }

    if (str !== "" && !isNaN(Number(str))) return Number(str);
    if (/^\d+n$/.test(str)) return BigInt(str.slice(0, -1));

    if (str.startsWith("function") || str.startsWith("(")) {
        try {
            const parsedFunction = new Function(`return (${str})`)();
            if (typeof parsedFunction === "function") return parsedFunction;
        } catch {
        }
    }

    try {
        const parsed = JSON.parse(str);
        if (typeof parsed === "object" && parsed != null) return parsed;
    } catch {
    }

    return str;
}

export {stringify, parse};