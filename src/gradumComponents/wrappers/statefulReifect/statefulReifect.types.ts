import {StylesType} from "../../../gradumFunctions/style/style.types";
import {KeyType, PartialRecord} from "../../../types/basic.types";

/**
 * @callback ReifectInterpolator
 * @group Components
 * @category StatefulReifect
 *
 * @template Type - The type of the configured value.
 * @template {object} ClassType - The type of the attached object.
 * @description Computes a value per attached object, so one configuration can vary across the objects it
 * is applied to — staggering a delay by `index`, for instance.
 * @param {number} index - The object's position among the attached objects.
 * @param {number} total - How many objects are attached in total.
 * @param {ClassType} object - The object the value is being computed for.
 * @returns {Type} The value to use for that object.
 */
type ReifectInterpolator<Type, ClassType extends object = Element> =
    (index: number, total: number, object: ClassType) => Type;

/**
 * @callback StateInterpolator
 * @group Components
 * @category StatefulReifect
 *
 * @template Type - The type of the configured value.
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description Computes a value per attached object *and* per state, for configurations that vary along
 * both axes. Use {@link ReifectInterpolator} when the value does not depend on the state.
 * @param {State} state - The state the value is being computed for.
 * @param {number} index - The object's position among the attached objects.
 * @param {number} total - How many objects are attached in total.
 * @param {ClassType} object - The object the value is being computed for.
 * @returns {Type} The value to use for that object in that state.
 */
type StateInterpolator<Type, State extends KeyType, ClassType extends object = Element> =
    (state: State, index: number, total: number, object: ClassType) => Type;

/**
 * @type {StateSpecificProperty}
 * @group Components
 * @category StatefulReifect
 *
 * @template Type - The type of the configured value.
 * @template {object} ClassType - The type of the attached object.
 * @description A value for one state: either a fixed value, or a {@link ReifectInterpolator} that computes
 * it per object.
 */
type StateSpecificProperty<Type, ClassType extends object = Element> =
    Type | ReifectInterpolator<Type, ClassType>;

/**
 * @type {BasicPropertyConfig}
 * @group Components
 * @category StatefulReifect
 *
 * @template Type - The type of the configured value.
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @description A property configured either per state, or as one value shared by every state. The
 * interpolator-free counterpart of {@link PropertyConfig}.
 */
type BasicPropertyConfig<Type, State extends KeyType> = PartialRecord<State, Type> | Type;

/**
 * @type {PropertyConfig}
 * @group Components
 * @category StatefulReifect
 *
 * @template Type - The type of the configured value.
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description How a single reifect property may be configured: one value for every state, a value per
 * state (each optionally interpolated per object), or a single {@link StateInterpolator} covering both.
 */
type PropertyConfig<Type, State extends KeyType, ClassType extends object = Element> =
    | PartialRecord<State, Type | ReifectInterpolator<Type, ClassType>>
    | Type
    | StateInterpolator<Type, State, ClassType>;

/**
 * @callback ReifectOnSwitchCallback
 * @group Components
 * @category StatefulReifect
 *
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description Called on an attached object each time the reifect switches it to a new state.
 * @param {State} state - The state being switched to.
 * @param {number} index - The object's position among the reifect's attached objects.
 * @param {number} total - How many objects are attached in total, for staggering effects by index.
 * @param {ClassType} object - The object being switched.
 */
type ReifectOnSwitchCallback<State extends KeyType, ClassType extends object = Element> =
    (state: State, index: number, total: number, object: ClassType) => void;

/**
 * @type {ReifectObjectData}
 * @group Components
 * @category StatefulReifect
 *
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description The bookkeeping a {@link StatefulReifect} keeps for one attached object. The object is held
 * weakly, so attaching a reifect does not keep it alive once the rest of the application drops it.
 * @property {WeakRef<ClassType>} object - Weak reference to the attached object.
 * @property {ReifectEnabledObject} enabled - Which parts of the reifect apply to this object.
 * @property {State} [lastState] - The state the object was last switched to.
 * @property {ReifectObjectComputedProperties<State, ClassType>} [resolvedValues] - The per-state values
 * resolved for this object, so interpolated configurations are computed once rather than on every switch.
 * @property {number} [index] - The object's position among the attached objects.
 * @property {number} [total] - How many objects are attached in total.
 * @property {ReifectOnSwitchCallback<State, ClassType>} [onSwitch] - Called when this object switches state.
 * @property {() => void} [disposeEffect] - Tears down the effect tracking this object's reactive values.
 */
type ReifectObjectData<State extends KeyType, ClassType extends object = Element> = {
    object: WeakRef<ClassType>,
    enabled: ReifectEnabledObject,
    lastState?: State,
    resolvedValues?: ReifectObjectComputedProperties<State, ClassType>,
    index?: number,
    total?: number,
    onSwitch?: ReifectOnSwitchCallback<State, ClassType>,
    disposeEffect?: () => void,
}

/**
 * @internal
 * @type {ReifectObjectComputedProperties}
 * @description The per-state values a {@link StatefulReifect} has resolved for one attached object, so a
 * configuration given as an interpolator is evaluated once rather than on every state switch.
 * @property {PartialRecord<State, PartialRecord<keyof ClassType, any>>} properties - Resolved property
 * values, per state.
 * @property {PartialRecord<State, StylesType>} styles - Resolved inline styles, per state.
 * @property {PartialRecord<State, string | string[]>} classes - Resolved CSS classes, per state.
 * @property {PartialRecord<State, ClassType>} replaceWith - Resolved replacement objects, per state.
 */
type ReifectObjectComputedProperties<State extends KeyType, ClassType extends object = Element> = {
    properties: PartialRecord<State, PartialRecord<keyof ClassType, any>>,
    styles: PartialRecord<State, StylesType>,
    classes:PartialRecord<State, string | string[]>,
    replaceWith: PartialRecord<State, ClassType>
};

/**
 * @type {StatefulReifectCoreProperties}
 * @group Components
 * @category StatefulReifect
 *
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description What a {@link StatefulReifect} applies to its objects on each state switch. Beyond the
 * named entries, any other key is treated as a property to set on the object itself.
 * @property {PropertyConfig<StylesType, State, ClassType>} [styles] - Inline styles to apply per state.
 * @property {PropertyConfig<string | string[], State, ClassType>} [classes] - CSS classes to toggle per state.
 * @property {PropertyConfig<ClassType, State, ClassType>} [replaceWith] - An object to swap the attached one
 * out for, per state.
 */
type StatefulReifectCoreProperties<State extends KeyType, ClassType extends object = Element> = {
    styles?: PropertyConfig<StylesType, State, ClassType>,
    classes?: PropertyConfig<string | string[], State, ClassType>,
    replaceWith?: PropertyConfig<ClassType, State, ClassType>,
    [k: PropertyKey]: PropertyConfig<any, State, ClassType>,
};

/**
 * @type {StatefulReifectProperties}
 * @group Components
 * @category StatefulReifect
 *
 * @extends StatefulReifectCoreProperties
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description Options for constructing a {@link StatefulReifect}: everything it applies per state, plus
 * the states themselves and the objects to attach at creation.
 * @property {State[] | object} [states] - The available states, as an array or as an enum-like object.
 * @property {State | boolean} [initialState] - The state to start in.
 * @property {ClassType[]} [attachedObjects] - Objects to attach immediately.
 */
type StatefulReifectProperties<State extends KeyType, ClassType extends object = Element> =
    StatefulReifectCoreProperties<State, ClassType> & {
    states?: State[] | object,
    initialState?: State | boolean,
    attachedObjects?: ClassType[]
};

/**
 * @type {ReifectAppliedOptions}
 * @group Components
 * @category StatefulReifect
 *
 * @template {KeyType} State - The set of states the reifect can switch between.
 * @template {object} ClassType - The type of the attached object.
 * @description Options controlling one application of a reifect — how widely it reaches, and how much of
 * its cached per-object data it recomputes first.
 * @property {boolean} [attachObjects] - Attach any object passed in that is not attached yet.
 * @property {boolean} [executeForAll] - Apply to every attached object rather than only the one given.
 * @property {boolean} [recomputeIndices] - Recompute each object's index and total before applying.
 * @property {boolean} [recomputeProperties] - Re-resolve interpolated values before applying.
 * @property {boolean} [applyStylesInstantly] - Set styles directly instead of on the next frame, skipping
 * any CSS transition.
 * @property {StatefulReifectCoreProperties<State, ClassType>} [propertiesOverride] - Values to use for this
 * application in place of the reifect's own.
 */
type ReifectAppliedOptions<State extends KeyType = any, ClassType extends object = Element> = {
    attachObjects?: boolean,
    executeForAll?: boolean
    recomputeIndices?: boolean,
    recomputeProperties?: boolean,
    applyStylesInstantly?: boolean,
    propertiesOverride?: StatefulReifectCoreProperties<State, ClassType>
}

/**
 * @type {ReifectEnabledObject}
 * @group Components
 * @category StatefulReifect
 *
 * @description Which parts of a reifect apply to a given object. Set `global` to `false` to disable the
 * reifect for that object entirely; the rest switch off one category each.
 * @property {boolean} [global] - Whether the reifect applies at all.
 * @property {boolean} [properties] - Whether property values are applied.
 * @property {boolean} [styles] - Whether inline styles are applied.
 * @property {boolean} [classes] - Whether CSS classes are toggled.
 * @property {boolean} [replaceWith] - Whether object replacement is performed.
 */
type ReifectEnabledObject = {
    global?: boolean,
    properties?: boolean,
    styles?: boolean,
    classes?: boolean,
    replaceWith?: boolean
}

export {ReifectObjectData, ReifectInterpolator, StateInterpolator, StateSpecificProperty, BasicPropertyConfig,
    PropertyConfig, StatefulReifectProperties, StatefulReifectCoreProperties, ReifectAppliedOptions,
    ReifectEnabledObject, ReifectOnSwitchCallback};