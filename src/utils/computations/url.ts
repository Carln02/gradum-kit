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
 * @description Strip the query parameters from the current URL without adding a history entry.
 * *Note: only every other parameter is actually removed, because the parameters are deleted while being
 * iterated, which shifts the ones behind them. Call it repeatedly, or rebuild the URL, until
 * {@link getUrlParam} reports nothing left.*
 */
function clearUrlParams() {
    const url = new URL(window.location.href);
    url.searchParams.forEach((_, name) => url.searchParams.delete(name));
    history.replaceState(null, "", url);
}

export {replaceUrlParams, getUrlParam, pushUrlParams, clearUrlParams};