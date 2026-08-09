import {gradum} from "../gradumFunctions/gradumFunctions";
import {GradumProperties} from "../gradumFunctions/element/element.types";
import {ValidElement, ValidTag} from "../types/element.types";
import {SvgNamespace, SvgTags} from "../types/svgElement.types";
import {MathMLNamespace, MathMLTags} from "../types/mathMlElement.types";

/**
 * @function generateTagFunction
 * @group Element Creation
 * @category Creation Functions
 *
 * @template {ValidTag} Tag - The tag the generated function creates.
 * @description Build a creation function bound to one tag, so callers no longer have to pass the tag
 * themselves. Use it to add a shorthand builder for a tag this library does not already ship one for —
 * the result behaves like the built-in {@link div} and {@link span}.
 * @param {Tag} tag - The tag the returned function creates.
 * @returns {(properties?: GradumProperties<Tag>) => ValidElement<Tag>} A function that creates an
 * element of that tag from the given properties.
 *
 * @example
 * ```ts
 * const section = generateTagFunction("section");
 * const el = section({classes: "panel"});
 * ```
 */
function generateTagFunction<Tag extends ValidTag>(tag: Tag) {
    return (properties: GradumProperties<Tag> = {} as GradumProperties<Tag>): ValidElement<Tag> => {
        properties.tag = tag;
        return element({...properties, tag: tag}) as ValidElement<Tag>;
    };
}

/**
 * @function element
 * @group Element Creation
 * @category Creation Functions
 *
 * @template {ValidTag} Tag - The tag of the element to create.
 * @description Create an element from a properties object and apply those properties to it. The
 * namespace is taken from `properties.namespace`: pass `"svg"` or `"mathML"` for those documents, or a
 * namespace URI directly. Use {@link blindElement} instead to have the namespace inferred from the tag.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidElement<Tag>} The created element, with the given properties already applied.
 */
function element<Tag extends ValidTag>(properties: GradumProperties<Tag> = {} as GradumProperties<Tag>): ValidElement<Tag> {
    let element: Element;

    if (properties.namespace) {
        if (properties.namespace == "svg") element = document.createElementNS(SvgNamespace, properties.tag || "svg");
        else if (properties.namespace == "mathML") element = document.createElementNS(MathMLNamespace, properties.tag || "math");
        else element = document.createElementNS(properties.namespace, properties.tag || "div");
    } else {
        element = document.createElement(properties.tag || "div");
    }

    gradum(element, true).setProperties(properties);
    return element as ValidElement<Tag>;
}

/**
 * @function blindElement
 * @group Element Creation
 * @category Creation Functions
 *
 * @template {ValidTag} Tag - The tag of the element to create.
 * @description Create an element from a properties object, working out the namespace from the tag alone
 * — SVG tags land in the SVG namespace, MathML tags in the MathML one, everything else in HTML. Use it
 * when the tag is only known at runtime; use {@link element} when you can state the namespace yourself.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidElement<Tag>} The created element, with the given properties already applied.
 */
function blindElement<Tag extends ValidTag>(properties: GradumProperties<Tag> = {} as GradumProperties<Tag>): ValidElement<Tag> {
    let element: Element;

    if (isSvgTag(properties.tag)) element = document.createElementNS(SvgNamespace, properties.tag || "svg");
    else if (isMathMLTag(properties.tag)) element = document.createElementNS(MathMLNamespace, properties.tag || "math");
    else element = document.createElement(properties.tag || "div");
    gradum(element, true).setProperties(properties);
    return element as ValidElement<Tag>;
}

/**
 * @internal
 * @function isSvgTag
 * @description Whether a tag belongs to the SVG namespace. Recognizes the known SVG tag list, plus any
 * tag starting with `svg`.
 * @param {string} [tag] - The tag to test.
 * @returns {boolean} `true` if the tag should be created in the SVG namespace.
 */
function isSvgTag(tag?: string): boolean {
    return SvgTags.has(tag as any) || tag?.startsWith("svg");
}

/**
 * @internal
 * @function isMathMLTag
 * @description Whether a tag belongs to the MathML namespace. Recognizes the known MathML tag list, plus
 * any tag starting with `math`.
 * @param {string} [tag] - The tag to test.
 * @returns {boolean} `true` if the tag should be created in the MathML namespace.
 */
function isMathMLTag(tag?: string): boolean {
    return MathMLTags.has(tag as any) || tag?.startsWith("math");
}

export {element, blindElement, generateTagFunction};