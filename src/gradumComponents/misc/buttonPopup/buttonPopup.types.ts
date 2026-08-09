import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {ValidTag} from "../../../types/element.types";
import {GradumRichElementProperties} from "../../basics/richElement/richElement.types";
import {GradumButtonPopup} from "./buttonPopup";

/**
 * @type {GradumButtonPopupProperties}
 * @group Components
 * @category Basics
 *
 * @extends GradumRichElementProperties
 * @template {ValidTag} ElementTag - The tag of the main element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumButtonPopup} — a button that shows a popup when
 * activated. Adds the popup container to everything {@link GradumRichElementProperties} accepts.
 * @property {HTMLElement} [popup] - Element used as the popup container. One is created if omitted.
 * @property {string | string[]} [popupClasses] - CSS class(es) to add to the popup container.
 */
type GradumButtonPopupProperties<
    ElementTag extends ValidTag = any,
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel<DataType>,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumRichElementProperties<ElementTag, ViewType, DataType, ModelType, EmitterType> & {
    popup?: HTMLElement;
    popupClasses?: string | string[];
};


declare module "../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-button-popup": GradumButtonPopup
    }
}

export {GradumButtonPopupProperties};