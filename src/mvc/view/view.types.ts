import {GradumModel} from "../model/model";
import {GradumEmitter} from "../emitter/emitter";

/**
 * @group MVC
 * @category Model
 */
type MvcBlocksType<
    Type extends "array" | "map" = "map",
    BlockType extends object = object
> = Type extends "map" ? Map<string, BlockType> : BlockType[];

/**
 * @group MVC
 * @category Model
 */
type MvcBlockKeyType<Type extends "array" | "map" = "map"> = Type extends "map" ? string : number;

/**
 * @group MVC
 * @category Model
 */
type MvcFlatKeyType<B extends "array" | "map"> = B extends "array" ? number : string;

/**
 * @type {GradumViewProperties}
 * @group MVC
 * @category View
 *
 * @template {object} ElementType - The type of the element the view renders.
 * @template {GradumModel} ModelType - The element's model type.
 * @template {GradumEmitter} EmitterType - The element's emitter type.
 * @description Properties used to construct a {@link GradumView}.
 * @property {ElementType} element - The element this view renders into.
 * @property {ModelType} [model] - The model the view reads from. Omit for a view with no state of its own.
 * @property {EmitterType} [emitter] - The emitter shared with the element and its operators.
 */
type GradumViewProperties<
    ElementType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter,
> = {
    element: ElementType,
    model?: ModelType,
    emitter?: EmitterType,
};

export {GradumViewProperties, MvcBlockKeyType, MvcBlocksType, MvcFlatKeyType};