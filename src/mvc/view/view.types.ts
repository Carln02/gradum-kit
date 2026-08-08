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
 * @group MVC
 * @category View
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