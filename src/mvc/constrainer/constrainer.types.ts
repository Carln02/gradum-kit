import {MakeConstrainerOptions} from "../../gradumFunctions/constrainer/constrainer.types";
import {GradumModel} from "../model/model";
import {GradumView} from "../view/view";
import {GradumEmitter} from "../emitter/emitter";
import {GradumOperatorProperties} from "../operator/operator.types";

/**
 * @type {GradumConstrainerProperties}
 * @group MVC
 * @category Constrainer
 *
 * @extends GradumOperatorProperties
 * @extends MakeConstrainerOptions
 *
 * @template {object} ElementType - The type of the element.
 * @template {GradumView} ViewType - The element's view type, if any.
 * @template {GradumModel} ModelType - The element's model type, if any.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if any.
 *
 * @description Options used to create a new {@link GradumConstrainer} attached to an element.
 * @property {string} [constrainerName] - The name of the constrainer.
 */
type GradumConstrainerProperties<
    ElementType extends object = object,
    ViewType extends GradumView = GradumView,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumOperatorProperties<ElementType, ViewType, ModelType, EmitterType> & MakeConstrainerOptions & {
    constrainerName?: string,
};

declare module "./constrainer" {
    interface GradumConstrainer {
        /**
         * @function onActivate
         * @description Function to execute when the constrainer is activated.
         */
        onActivate(): void;

        /**
         * @function onDeactivate
         * @description Function to execute when the constrainer is deactivated.
         */
        onDeactivate(): void;
    }
}

export {GradumConstrainerProperties}
