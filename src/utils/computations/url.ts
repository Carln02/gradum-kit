/**
 * @function replaceUrlParams
 * @group Utilities
 * @category Misc
 *
 * @description Set query parameters on the current URL without adding a history entry, so the change cannot
 * be undone with the browser's back button. Use {@link pushUrlParams} when the change should be navigable.
 * Existing parameters of the same name are overwritten; the rest are left alone.
 * @param {...{name: string, value: string}[]} params - The parameters to set.
 */
function replaceUrlParams(...params: {name: string, value: string}[]) {
    const url = new URL(window.location.href);
    params.forEach(({name, value}) => url.searchParams.set(name, value));
    history.replaceState(null, "", url);
}

/**
 * @function getUrlParam
 * @group Utilities
 * @category Misc
 *
 * @description Read one query parameter from the current URL.
 * @param {string} name - The parameter to read.
 * @returns {string} The parameter's value, or `null` if it is not present.
 */
function getUrlParam(name: string) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

/**
 * @function pushUrlParams
 * @group Utilities
 * @category Misc
 *
 * @description Set query parameters on the current URL and add a history entry, so the change can be undone
 * with the browser's back button. Use {@link replaceUrlParams} when it should not be navigable.
 * @param {...{name: string, value: string}[]} params - The parameters to set.
 */
function pushUrlParams(...params: {name: string, value: string}[]) {
    const url = new URL(window.location.href);
    params.forEach(({name, value}) => url.searchParams.set(name, value));
    history.pushState(null, "", url);
}

/**
 * @function clearUrlParams
 * @group Utilities
 * @category Misc
 *
 * @description Strip every query parameter from the current URL without adding a history entry.
 */
function clearUrlParams() {
    const url = new URL(window.location.href);
    url.search = "";
    history.replaceState(null, "", url);
}

export {replaceUrlParams, getUrlParam, pushUrlParams, clearUrlParams};