/**
 * @function formatMMSS
 * @group Utilities
 * @category String
 *
 * @description Format a duration in seconds as `"MM:SS"`, both parts zero-padded. Minutes are not capped at
 * 60, so a long duration reads as `"90:00"` rather than rolling into hours — use {@link formatHHMMSS} for that.
 * @param {number} seconds - The duration in seconds. Fractions are truncated.
 * @param {string} [separator=":"] - What to place between the parts.
 * @returns {string} The formatted duration.
 */
function formatMMSS(seconds: number, separator: string = ":") {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return formattedMinutes + separator + formattedSeconds;
}

/**
 * @function formatHHMMSS
 * @group Utilities
 * @category String
 *
 * @description Format a duration in seconds as `"HH:MM:SS"`, each part zero-padded.
 * @param {number} seconds - The duration in seconds. Fractions are truncated.
 * @param {string} [separator=":"] - What to place between the parts.
 * @returns {string} The formatted duration.
 */
function formatHHMMSS(seconds: number, separator: string = ":") {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return formattedHours + separator + formattedMinutes + separator + formattedSeconds;
}

/**
 * @function formatMmSs
 * @group Utilities
 * @category String
 *
 * @description Format a duration in seconds in a compact, human-readable form such as `"2m30s"` — no
 * zero-padding, and the minutes part dropped entirely when the duration is under a minute.
 * @param {number} seconds - The duration in seconds. Fractions are truncated.
 * @param {string} [separator=""] - What to place between the minutes and seconds parts.
 * @returns {string} The formatted duration.
 */
function formatMmSs(seconds: number, separator: string = "") {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return (minutes > 0 ? (minutes + "m" + separator) : "") + remainingSeconds + "s";
}

export {formatMMSS, formatMmSs, formatHHMMSS};