import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumElementProperties} from "../../../gradumElement/gradumElement.types";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumIcon} from "./icon";

/**
 * @type {GradumIconProperties}
 * @group Components
 * @category GradumIcon
 *
 * @extends GradumElementProperties
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Properties to initialize a {@link GradumIcon}. Values left out fall back to
 * {@link GradumIcon.defaultProperties}.
 * @property {string} icon - Name of the icon, file extension included to override the resolved type.
 * @property {string} [iconColor] - Color applied to the icon.
 * @property {(svg: SVGElement) => void} [onLoaded] - Called with the loaded SVG element, to modify it once
 * it is available. Ignored for icons that are not SVGs.
 * @property {string} [type] - File type of the icon, used when the name carries no extension.
 * @property {string} [directory] - Directory the icon is loaded from.
 */
type GradumIconProperties<
    ViewType extends GradumView = GradumView,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    type?: string;
    directory?: string;

    icon: string;
    iconColor?: string;
    onLoaded?: (svg: SVGElement) => void;
};

declare module "../../../types/element.types" {
    interface GradumElementTagNameMap {
        "gradum-icon": GradumIcon
    }
}

export {GradumIconProperties};