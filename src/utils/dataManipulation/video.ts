import {video} from "../../elementCreation/basicElements";

/**
 * @function getVideoDuration
 * @group Utilities
 * @category Misc
 *
 * @description Read how long a video is without displaying it, by loading just its metadata into a detached
 * element. Streams whose duration is not known upfront are handled by seeking to the end to force the browser
 * to resolve it. The element and any temporary object URL are cleaned up before the promise settles.
 * @param {Blob | string} input - The video to measure, as a blob or a URL. URLs are fetched anonymously, so
 * a remote server must allow cross-origin reads.
 * @returns {Promise<number>} The duration in seconds. Rejects if the metadata cannot be loaded.
 */
async function getVideoDuration(input: Blob | string): Promise<number> {
    const el = video({preload: "metadata"});

    return new Promise<number>((resolve, reject) => {
        let objectUrl: string | null = null;

        const cleanup = () => {
            el.removeAttribute("src");
            el.load();
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };

        el.onerror = () => {
            cleanup();
            reject(new Error("Failed to load video metadata"));
        };

        el.onloadedmetadata = () => {
            if (el.duration === Infinity) {
                el.currentTime = 1e101;
                el.ontimeupdate = () => {
                    el.ontimeupdate = null;
                    const d = el.duration;
                    cleanup();
                    resolve(d);
                };
            } else {
                const d = el.duration;
                cleanup();
                resolve(d);
            }
        };

        if (typeof input === "string") {
            el.crossOrigin = "anonymous";
            el.src = input;
        } else {
            objectUrl = URL.createObjectURL(input);
            el.src = objectUrl;
        }
    });
}

export {getVideoDuration};