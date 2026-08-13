import {gradum} from "../../../build/gradum-kit.esm";

export interface CanvasObject {
    render(context: CanvasRenderingContext2D): void;
}

export interface Substrate<ObjectType extends object = object> {
    objects: ObjectType[];
    addObject(obj: ObjectType): void;
    removeObject(obj: ObjectType): void;
}

/**
 * @description Whether something can hold canvas objects. Narrows, so a tool handed a plain `Node` can call
 * `addObject` on it without a cast — and unlike a cast, this actually checks.
 */
export function isSubstrate<ObjectType extends object = object>(value: unknown): value is Substrate<ObjectType> {
    if (typeof value !== "object") return false;
    return gradum(value).metadata?.get("substrate") && typeof (value as Substrate<ObjectType>)?.addObject === "function";
}