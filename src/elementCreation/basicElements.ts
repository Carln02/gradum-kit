import {element} from "./element";
import {GradumProperties} from "../gradumFunctions/element/element.types";
import {ValidElement} from "../types/element.types";

/**
 * @function a
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates an `<a>` element with the specified properties.
 * @param {GradumProperties<"a">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"a">} The created element, with the given properties already applied.
 */
function a(properties: GradumProperties<"a"> = {}): ValidElement<"a"> {
    return element({...properties, tag: "a"});
}

/**
 * @function canvas
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<canvas>` element with the specified properties.
 * @param {GradumProperties<"canvas">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"canvas">} The created element, with the given properties already applied.
 */
function canvas(properties: GradumProperties<"canvas"> = {}): ValidElement<"canvas"> {
    return element({...properties, tag: "canvas"});
}


/**
 * @function div
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<div>` element with the specified properties.
 * @param {GradumProperties<"div">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"div">} The created element, with the given properties already applied.
 */
function div(properties: GradumProperties = {}): ValidElement<"div"> {
    return element({...properties, tag: "div"});
}

/**
 * @function form
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<form>` element with the specified properties.
 * @param {GradumProperties<"form">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"form">} The created element, with the given properties already applied.
 */
function form(properties: GradumProperties<"form"> = {}): ValidElement<"form"> {
    return element({...properties, tag: "form"});
}

/**
 * @function h1
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h1>` element with the specified properties.
 * @param {GradumProperties<"h1">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h1">} The created element, with the given properties already applied.
 */
function h1(properties: GradumProperties<"h1"> = {}): ValidElement<"h1"> {
    return element({...properties, tag: "h1"});
}

/**
 * @function h2
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h2>` element with the specified properties.
 * @param {GradumProperties<"h2">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h2">} The created element, with the given properties already applied.
 */
function h2(properties: GradumProperties<"h2"> = {}): ValidElement<"h2"> {
    return element({...properties, tag: "h2"});
}

/**
 * @function h3
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h3>` element with the specified properties.
 * @param {GradumProperties<"h3">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h3">} The created element, with the given properties already applied.
 */
function h3(properties: GradumProperties<"h3"> = {}): ValidElement<"h3"> {
    return element({...properties, tag: "h3"});
}

/**
 * @function h4
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h4>` element with the specified properties.
 * @param {GradumProperties<"h4">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h4">} The created element, with the given properties already applied.
 */
function h4(properties: GradumProperties<"h4"> = {}): ValidElement<"h4"> {
    return element({...properties, tag: "h4"});
}

/**
 * @function h5
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h5>` element with the specified properties.
 * @param {GradumProperties<"h5">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h5">} The created element, with the given properties already applied.
 */
function h5(properties: GradumProperties<"h5"> = {}): ValidElement<"h5"> {
    return element({...properties, tag: "h5"});
}

/**
 * @function h6
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<h6>` element with the specified properties.
 * @param {GradumProperties<"h6">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"h6">} The created element, with the given properties already applied.
 */
function h6(properties: GradumProperties<"h6"> = {}): ValidElement<"h6"> {
    return element({...properties, tag: "h6"}) as ValidElement<"h6">;
}

/**
 * @function img
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates an `<img>` element with the specified properties.
 * @param {GradumProperties<"img">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"img">} The created element, with the given properties already applied.
 */
function img(properties: GradumProperties<"img"> = {}): ValidElement<"img"> {
    return element({...properties, tag: "img"});
}

/**
 * @function input
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates an `<input>` element with the specified properties.
 * @param {GradumProperties<"input">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"input">} The created element, with the given properties already applied.
 */
function input(properties: GradumProperties<"input"> = {}): ValidElement<"input"> {
    return element({...properties, tag: "input"});
}

/**
 * @function link
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<link>` element with the specified properties.
 * @param {GradumProperties<"link">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"link">} The created element, with the given properties already applied.
 */
function link(properties: GradumProperties<"link"> = {}): ValidElement<"link"> {
    return element({...properties, tag: "link"});
}

/**
 * @function p
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<p>` element with the specified properties.
 * @param {GradumProperties<"p">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"p">} The created element, with the given properties already applied.
 */
function p(properties: GradumProperties<"p"> = {}): ValidElement<"p"> {
    return element({...properties, tag: "p"});
}

/**
 * @function span
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<span>` element with the specified properties.
 * @param {GradumProperties<"span">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"span">} The created element, with the given properties already applied.
 */
function span(properties: GradumProperties<"span"> = {}): ValidElement<"span"> {
    return element({...properties, tag: "span"});
}

/**
 * @function style
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<style>` element with the specified properties.
 * @param {GradumProperties<"style">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"style">} The created element, with the given properties already applied.
 */
function style(properties: GradumProperties<"style"> = {}): ValidElement<"style"> {
    return element({...properties, tag: "style"});
}

/**
 * @function textarea
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<textarea>` element with the specified properties.
 * @param {GradumProperties<"textarea">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"textarea">} The created element, with the given properties already applied.
 */
function textarea(properties: GradumProperties<"textarea"> = {}): ValidElement<"textarea"> {
    return element({...properties, tag: "textarea"});
}

/**
 * @function video
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<video>` element with the specified properties.
 * @param {GradumProperties<"video">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"video">} The created element, with the given properties already applied.
 */
function video(properties: GradumProperties<"video"> = {}): ValidElement<"video"> {
    return element({...properties, tag: "video"});
}

/**
 * @function button
 * @group Element Creation
 * @category Base Elements
 *
 * @description Creates a `<button>` element with the specified properties.
 * @param {GradumProperties<"button">} [properties] - Object containing properties of the element.
 * @returns {ValidElement<"button">} The created element, with the given properties already applied.
 */
function button(properties: GradumProperties<"button"> = {}): ValidElement<"button"> {
    return element({...properties, tag: "button"});
}

export {
    a,
    canvas,
    div,
    form,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    img,
    input,
    link,
    p,
    span,
    style,
    textarea,
    video,
    button
};