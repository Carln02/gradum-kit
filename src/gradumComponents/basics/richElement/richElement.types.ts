import {GradumIcon} from "../icon/icon";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumProperties} from "../../../gradumFunctions/element/element.types";
import {GradumElementProperties} from "../../../gradumElement/gradumElement.types";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumRichElement} from "./richElement";
import {ValidElement, ValidTag} from "../../../types/element.types";

/**
 * @type {GradumRichElementProperties}
 * @group Components
 * @category GradumRichElement
 *
 * @extends GradumElementProperties
 * @template {ValidTag} ElementTag - The tag of the main element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumRichElement} — a main element flanked by up to
 * four optional slots. They are laid out left to right in the order below.
 * @property {ElementTag} [elementTag] - The HTML tag used for the main element when `element` is a string
 * or a properties object.
 * @property {string} [text] - Text content of the main element.
 * @property {Element | Element[]} [leftCustomElements] - Elements placed leftmost, before `leftIcon`.
 * @property {string | GradumIcon} [leftIcon] - Icon placed left of the main element. A string is treated as
 * an icon name or path.
 * @property {string | HTMLElement} [prefixEntry] - Content placed immediately before the main element.
 * @property {string | GradumProperties<ElementTag> | ValidElement<ElementTag>} [element] - The main element:
 * its text, the properties to build it from, or an existing element to adopt.
 * @property {string | HTMLElement} [suffixEntry] - Content placed immediately after the main element.
 * @property {string | GradumIcon} [rightIcon] - Icon placed right of the main element. A string is treated as
 * an icon name or path.
 * @property {Element | Element[]} [rightCustomElements] - Elements placed rightmost, after `rightIcon`.
 */
type GradumRichElementProperties<
    ElementTag extends ValidTag = any,
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    elementTag?: ElementTag,
    text?: string;

    leftCustomElements?: Element | Element[],
    leftIcon?: string | GradumIcon,
    prefixEntry?: string | HTMLElement,
    element?: string | GradumProperties<ElementTag> | ValidElement<ElementTag>,
    suffixEntry?: string | HTMLElement,
    rightIcon?: string | GradumIcon,
    rightCustomElements?: Element | Element[],
};

declare module "../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-rich-element": GradumRichElement
    }
}

export {GradumRichElementProperties};