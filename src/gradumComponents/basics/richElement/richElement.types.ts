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
 * @description Properties object for configuring a Button. Extends GradumElementProperties.
 * @extends GradumProperties
 *
 * @property {string} [text] - The text to set to the rich element's main element.
 *
 * @property {Element | Element[]} [leftCustomElements] - Custom elements
 * to be placed on the left side of the button (before the left icon).
 * @property {string | GradumIcon} [leftIcon] - An icon to be placed on the left side of the button text. Can be a
 * string (icon name/path) or an Icon instance.
 * @property {string | GradumProperties<ElementTag> | ValidElement<ElementTag>} [buttonText] - The text content of the button.
 * @property {string | GradumIcon} [rightIcon] - An icon to be placed on the right side of the button text. Can be a
 * string (icon name/path) or an Icon instance.
 * @property {Element | Element[]} [rightCustomElements] - Custom elements
 * to be placed on the right side of the button (after the right icon).
 *
 * @property {ValidTag} [customTextTag] - The HTML tag to be used for the buttonText element (if the latter is passed as
 * a string). If not specified, the default text tag specified in the Button class will be used.
 * @property {boolean} [unsetDefaultClasses] - Set to true to not add the default classes specified in GradumConfig.Button
 * to this instance of Button.
 *
 * @template {ValidTag} ElementTag="p"
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