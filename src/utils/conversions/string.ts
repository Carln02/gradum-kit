/**
 * @function camelToKebabCase
 * @group Utilities
 * @category String
 *
 * @description Convert a camelCase string to kebab-case, the form HTML attributes and CSS properties use.
 * @param {string} [str] - The string to convert.
 * @returns {string} The kebab-case string, or `undefined` if the input was empty or missing.
 */
function camelToKebabCase(str?: string): string {
    if (!str || str.length == 0) return;
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * @function kebabToCamelCase
 * @group Utilities
 * @category String
 *
 * @description Convert a kebab-case string to camelCase, the form JavaScript properties use.
 * @param {string} [str] - The string to convert.
 * @returns {string} The camelCase string, or `undefined` if the input was empty or missing.
 */
function kebabToCamelCase(str?: string): string {
    if (!str || str.length == 0) return;
    return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

export {camelToKebabCase, kebabToCamelCase};