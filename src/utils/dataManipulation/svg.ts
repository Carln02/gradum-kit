import {textToElement} from "./element";

/**
 * @function fetchSvg
 * @group Utilities
 * @category SVG
 *
 * @description Fetch an SVG file and parse it into a live element, ready to be inserted into the document.
 * Because the markup is parsed rather than placed in an `<img>`, the result can be styled and scripted.
 * @param {string} path - The path or URL to fetch the SVG from.
 * @param {boolean} [logError=true] - Whether to also log failures to the console. The promise rejects either
 * way.
 * @returns {Promise<SVGElement>} The parsed SVG element. Rejects on an empty path, a failed request, or
 * markup that does not parse.
 */
function fetchSvg(path: string, logError: boolean = true): Promise<SVGElement> {
    return new Promise((resolve, reject) => {
        if (!path || path.length === 0) {
            reject(new Error("Invalid path"));
            return;
        }

        fetch(path)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok while loading your SVG");
                return response.text();
            })
            .then(svgText => {
                const svg = textToElement(svgText) as SVGElement;
                if (!svg) throw new Error("Error parsing SVG text");
                resolve(svg);
            })
            .catch(error => {
                if (!logError) reject(error);
                console.error("Error fetching SVG:", error);
                reject(error);
            });
    });
}

export {fetchSvg};