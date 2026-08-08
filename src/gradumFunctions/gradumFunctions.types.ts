import {GradumSelector} from "./gradumSelector";

/**
 * @group GradumSelector
 */
type Gradum<Type extends object = Node> = GradumSelector<Type> & Type;

/**
 * @group GradumSelector
 */
type GradumifyOptions = {
    excludeHierarchyFunctions?: boolean,
    excludeMvcFunctions?: boolean,
    excludeStyleFunctions?: boolean,
    excludeClassFunctions?: boolean,
    excludeElementFunctions?: boolean,
    excludeEventFunctions?: boolean,
    excludeToolFunctions?: boolean,
    excludeConstrainerFunctions?: boolean,
    excludeMiscFunctions?: boolean,
    excludeReifectFunctions?: boolean
};

declare module "./gradumSelector" {
    interface GradumSelector extends Node {
    }
}

export {Gradum, GradumifyOptions};