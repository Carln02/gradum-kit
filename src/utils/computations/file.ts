/**
 * @function getFileExtension
 * @group Utilities
 * @category String
 *
 * @description Read the extension off a filename or path, leading dot included. Also used to tell a file path
 * from a directory path, since a directory yields an empty string.
 * @param {string} [str] - The filename or path to read.
 * @returns {string} The extension including its dot (`".png"`), or an empty string if there is none. Only
 * extensions of one to four characters are recognized.
 */
function getFileExtension(str?: string): string {
    if (!str || str.length == 0) return "";
    const match = str.match(/\.\S{1,4}$/);
    return match ? match[0] : "";
}

export {getFileExtension};