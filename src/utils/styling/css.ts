/**
 * @function css
 * @group Utilities
 * @category CSS
 *
 * @description Tagged template that joins a CSS template literal into one string. It exists mainly so editors
 * syntax-highlight and format the rules inside the literal; the interpolated values are inserted as-is.
 * @param {TemplateStringsArray} strings - The literal's static parts, supplied by the tagged template.
 * @param {...any[]} values - The interpolated values, supplied by the tagged template.
 * @returns {string} The assembled CSS.
 *
 * @example
 * ```ts
 * const styles = css`
 *    .my-class { color: ${color}; }
 * `;
 * ```
 */
function css(strings: TemplateStringsArray, ...values: any[]): string {
    let str = "";
    strings.forEach((string, i) => {
        str += string + (values[i] || '');
    });
    return str;
}

export {css};