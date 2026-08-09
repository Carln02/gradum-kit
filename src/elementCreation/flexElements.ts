import {element} from "./element";
import {$} from "../gradumFunctions/gradumFunctions";
import {GradumProperties} from "../gradumFunctions/element/element.types";
import {HTMLTag, ValidHTMLElement} from "../types/htmlElement.types";

/**
 * @function flexCol
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create an element that lays its children out in a vertical flex column.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `display: flex` and
 * `flex-direction: column` already applied.
 */
function flexCol<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag> {
    const el = element(properties) as ValidHTMLElement<Tag>;
    $(el).setStyles({display: "flex", flexDirection: "column"}, true);
    return el;
}

/**
 * @function flexColCenter
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create a vertical flex column that also centers its children on both axes.
 * Same as {@link flexCol}, with the centering styles applied on top.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `display: flex`,
 * `flex-direction: column`, `justify-content: center`, and `align-items: center` applied.
 */
function flexColCenter<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag> {
    const el = flexCol(properties);
    $(el).setStyles({justifyContent: "center", alignItems: "center"}, true);
    return el;
}

/**
 * @function flexRow
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create an element that lays its children out in a horizontal flex row.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `display: flex` and
 * `flex-direction: row` already applied.
 */
function flexRow<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag> {
    const el = element(properties) as ValidHTMLElement<Tag>;
    $(el).setStyles({display: "flex", flexDirection: "row"}, true);
    return el;
}

/**
 * @function flexRowCenter
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create a horizontal flex row that also centers its children on both axes.
 * Same as {@link flexRow}, with the centering styles applied on top.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `display: flex`,
 * `flex-direction: row`, `justify-content: center`, and `align-items: center` applied.
 */
function flexRowCenter<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag> {
    const el = flexRow(properties);
    $(el).setStyles({justifyContent: "center", alignItems: "center"}, true);
    return el;
}

/**
 * @function spacer
 * @group Element Creation
 * @category Flex Elements
 *
 * @template {HTMLTag} Tag - The tag of the element to create.
 * @description Create an element that absorbs the free space of its flex parent, pushing the
 * siblings on either side of it apart.
 * @param {GradumProperties<Tag>} [properties] - Object containing properties of the element. Defaults
 * to a `<div>` when no tag is given.
 * @returns {ValidHTMLElement<Tag>} The created element, with `flex-grow: 1` already applied.
 */
function spacer<Tag extends HTMLTag>(properties?: GradumProperties<Tag>): ValidHTMLElement<Tag> {
    const el = element(properties) as ValidHTMLElement<Tag>;
    $(el).setStyle("flexGrow", 1, true);
    return el;
}

export {flexCol, flexColCenter, flexRow, flexRowCenter, spacer};

