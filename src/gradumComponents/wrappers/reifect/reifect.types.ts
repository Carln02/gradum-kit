import {ReifectInterpolator} from "../statefulReifect/statefulReifect.types";
import {StylesType} from "../../../gradumFunctions/style/style.types";

/**
 * @group Components
 * @category Reifects
 *
 * @template Type - The type of the configured value.
 * @template State - The set of states the reifect can switch between.
 * @template ClassType - The type of the attached object.
 * @description A configuration type for properties based on states or interpolated values.
 */
type StatelessPropertyConfig<Type, ClassType extends object = Element> = Type | ReifectInterpolator<Type, ClassType>;

/**
 * @group Components
 * @category Reifects
 */
type StatelessReifectCoreProperties<ClassType extends object = Element> = {
    styles?: StatelessPropertyConfig<StylesType, ClassType>,
    classes?: StatelessPropertyConfig<string | string[], ClassType>,
    replaceWith?: StatelessPropertyConfig<ClassType, ClassType>,
    [k: PropertyKey]: StatelessPropertyConfig<any, ClassType>,
};

/**
 * @group Components
 * @category Reifects
 */
type StatelessReifectProperties<ClassType extends object = Element> =
    StatelessReifectCoreProperties<ClassType> & {
    attachedObjects?: ClassType[],
};

export {StatelessReifectCoreProperties, StatelessReifectProperties, StatelessPropertyConfig};