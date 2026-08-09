/**
 * @function blobToUrl
 * @group Utilities
 * @category Misc
 *
 * @description Read a blob into a `data:` URL that embeds its content, so it can be stored or sent as text.
 * The result is self-contained and needs no cleanup, unlike `URL.createObjectURL`, but is larger than the
 * original by roughly a third.
 * @param {Blob} blob - The blob to read.
 * @returns {Promise<string>} A `data:` URL holding the blob's content.
 */
function blobToUrl(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(blob);
    });
}

/**
 * @function urlToBlob
 * @group Utilities
 * @category Misc
 *
 * @description Fetch a URL and hand back its content as a blob. Works with `data:` URLs as well as remote
 * ones, making it the inverse of {@link blobToUrl}.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<Blob>} The fetched content.
 */
function urlToBlob(url: string): Promise<Blob> {
    return new Promise((resolve) => {
        fetch(url).then(res => resolve(res.blob()));
    });
}

export {urlToBlob, blobToUrl};
