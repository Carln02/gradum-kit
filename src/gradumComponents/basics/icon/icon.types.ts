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
 * @description Properties object that extends GradumElementProperties with properties specific to icons.
 * @extends GradumProperties
 *
 * @property {string} icon - The name of the icon.
 * @property {string} [iconColor] - The color of the icon.
 * @property {((svgManipulation: SVGElement) => {})} [onLoaded] - Custom function that takes an SVG element to execute on the
 * SVG icon (if it is one) once it is loaded. This property will be disregarded if the icon is not of type SVG.
 *
 * @property {string} [type] - Custom type of the icon, overrides the default type assigned to
 * GradumIcon.config.type (whose default value is "svgManipulation").
 * @property {string} [directory] - Custom directory to the icon, overrides the default directory assigned to
 * GradumIcon.config.directory.
 * @property {boolean} [unsetDefaultClasses] - Set to true to not add the default classes specified in
 * GradumIcon.config.defaultClasses to this instance of Icon.
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