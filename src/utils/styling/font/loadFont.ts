import {css} from "../css";
import {FontProperties} from "./font.types";
import {getFileExtension} from "../../computations/file";
import {stylesheet} from "../../../elementCreation/miscElements";

/**
 * @internal
 * @description The weight-to-sub-name mapping assumed for a font family when
 * {@link FontProperties.stylesPerWeights} is not given. Covers weights 100 through 900 in the naming
 * convention most distributed families follow, such as `Inter-SemiBoldItalic`.
 */
const defaultFamilyWeights = {
    900: {"Black": "normal", "BlackItalic": "italic"},
    800: {"ExtraBold": "normal", "ExtraBoldItalic": "italic"},
    700: {"Bold": "normal", "BoldItalic": "italic"},
    600: {"SemiBold": "normal", "SemiBoldItalic": "italic"},
    500: {"Medium": "normal", "MediumItalic": "italic"},
    400: {"Regular": "normal", "Italic": "italic"},
    300: {"Light": "normal", "LightItalic": "italic"},
    200: {"ExtraLight": "normal", "ExtraLightItalic": "italic"},
    100: {"Thin": "normal", "ThinItalic": "italic"},
};

/**
 * @internal
 * @function createFontFace
 * @description Build one `@font-face` rule for a single weight and style of a font. Each rule lists the same
 * URL under several formats so the browser can pick whichever it supports.
 * @param {string} name - The font family name to register.
 * @param {string} path - Path to the font file.
 * @param {string} format - The preferred format, listed first in the rule.
 * @param {string | number} weight - The weight the rule applies to.
 * @param {string} style - The style the rule applies to, such as `"normal"` or `"italic"`.
 * @returns {string} The `@font-face` rule as CSS text.
 */
function createFontFace(name: string, path: string, format: string, weight: string | number, style: string): string {
    return css`
        @font-face {
            font-family: "${name}";
            src: url("${path}") format("${format}"), 
            url("${path}") format("woff"),
            url("${path}") format("truetype");
            font-weight: ${typeof weight == "string" ? "\"" + weight + "\"" : weight};
            font-style: "${style}";
        }`;
}

/**
 * @function loadLocalFont
 * @group Utilities
 * @category Font
 *
 * @description Register a local font with the document, so it can be used by family name in CSS. Generates
 * the `@font-face` rules and injects them as a stylesheet. Whether one file or a whole family is loaded is
 * inferred from the path — see {@link FontProperties}.
 * *Note: the passed object is filled in with the defaults it was missing, so it is modified in place.*
 * @param {FontProperties} font - Describes the font to load. Logs an error if `name` or `pathOrDirectory`
 * is missing.
 */
function loadLocalFont(font: FontProperties) {
    if (!font.name || !font.pathOrDirectory) console.error("Please specify font name and path/directory");

    const isFamily = getFileExtension(font.pathOrDirectory).length == 0;
    if (!font.stylesPerWeights) font.stylesPerWeights = isFamily ? defaultFamilyWeights : {"normal": "normal"};
    if (!font.format) font.format = "woff2";

    if (!font.extension) font.extension = ".ttf";
    if (font.extension[0] != ".") font.extension = "." + font.extension;

    stylesheet(
        Object.entries(font.stylesPerWeights).map(([weight, value]) => {
            const weightNumber = Number.parseInt(weight);
            const typedWeight = weightNumber ? weightNumber : weight;

            if (typeof value == "string")
                return createFontFace(font.name, font.pathOrDirectory, font.format, typedWeight, value);

            return Object.entries(value).map(([weightName, style]) =>
                createFontFace(font.name, `${font.pathOrDirectory}/${font.name}-${weightName}${font.extension}`,
                    font.format, typedWeight, style as string)
            ).join("\n");
        }).join("\n")
    );
}

export {loadLocalFont};