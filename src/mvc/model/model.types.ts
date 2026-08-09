import {GradumObserver} from "./observer";
import {KeyType} from "../../types/basic.types";
import {GradumModel} from "./model";

/**
 * @type {GradumModelProxy}
 * @group MVC
 * @category Model
 *
 * @template {object} DataType - The type of the wrapped data.
 * @template {KeyType} IdType - The type of the data's ID.
 * @description Plain data that reads and writes through a {@link GradumModel}, as returned by
 * {@link GradumModel.from}. Use the keys of the data directly; reach the backing model through `$model`.
 * @property {GradumModel} $model - The model backing this data.
 */
type GradumModelProxy<
    DataType extends object = any,
    IdType extends KeyType = any
> = DataType & {readonly $model: GradumModel<DataType, KeyType, IdType>};

/**
 * @type {GradumModelProperties}
 * @group MVC
 * @category Model
 *
 * @template DataType - The type of data stored in the model.
 * @template IdType - The type of the data's ID.
 * @description Configuration object used when creating a {@link GradumModel}.
 * @property {IdType} [id] - Optional ID attached to the model. Useful to reference the data in a nested structure.
 * @property {DataType} [data] - Initial data.
 * @property {boolean} [initialize] - If true, {@link GradumModel.initialize} is called immediately after
 * construction.
 */
type GradumModelProperties<
    DataType = any,
    IdType extends KeyType = any
> = {
    id?: IdType,
    data?: DataType,
    initialize?: boolean,
    enabledCallbacks?: boolean,
    bubbleChanges?: boolean,
    makeSignals?: boolean,
};

/**
 * @type {GradumObserverProperties}
 * @group MVC
 * @category Model
 *
 * @template DataType - The type of data handled by the observer.
 * @template {object} ComponentType - The instance type created and managed by the observer.
 * @template {KeyType} DataKeyType - The per-item key type.
 * @description Options and lifecycle callbacks used to create a new {@link GradumObserver}.
 * *Note: `self` is the second argument of `onAdded` but the third of `onUpdated` and `onDeleted`, which take
 * the existing instance in second place.*
 * @property {new (...args: any[]) => GradumObserver<DataType, ComponentType, DataKeyType>} [customConstructor] -
 * Observer subclass to instantiate instead of the default {@link GradumObserver}.
 * @property {number} [depth] - How many levels below the attached path to watch. Defaults to the depth
 * implied by the key path the observer is registered on.
 * @property {boolean} [initialize] - If `true`, the observer is initialized on creation, so it immediately
 * reports every entry already present.
 * @property {(data: DataType, self: GradumObserver, ...keys: KeyType[]) => ComponentType | void} [onAdded] -
 * Called when a change is reported at a key path with no instance yet. Return an instance to have it stored
 * and handed back to later callbacks.
 * @property {(data: DataType, instance: ComponentType, self: GradumObserver, ...keys: KeyType[]) => void} [onUpdated] -
 * Called when an entry that already has an instance changes.
 * @property {(data: DataType, instance: ComponentType, self: GradumObserver, ...keys: KeyType[]) => void} [onDeleted] -
 * Called when an entry is removed.
 * @property {(prevData: DataType, newData: DataType, instance: ComponentType, self: GradumObserver, ...keys: KeyType[]) => boolean} [replaceOnUpdate] -
 * Called before `onUpdated`. Return `true` to destroy the existing instance and create a fresh one through
 * `onAdded` instead of updating it in place.
 * @property {(self: GradumObserver) => void} [onInitialize] - Called when the observer is initialized.
 * @property {(self: GradumObserver) => void} [onDestroy] - Called when the observer is destroyed.
 */
type GradumObserverProperties<
    DataType = any,
    ComponentType extends object = any,
    DataKeyType extends KeyType = KeyType
> = {
    customConstructor?: new (...args: any[]) => GradumObserver<DataType, ComponentType, DataKeyType>,

    depth?: number,
    initialize?: boolean,

    onAdded?: (data: DataType, self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: KeyType[]) => ComponentType | void,
    onUpdated?: (data: DataType, instance: ComponentType,
                 self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: KeyType[]) => void,
    onDeleted?: (data: DataType, instance: ComponentType,
                 self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: KeyType[]) => void,

    replaceOnUpdate?: (prevData: DataType, newData: DataType, instance: ComponentType,
                       self: GradumObserver<DataType, ComponentType, DataKeyType>, ...keys: KeyType[]) => boolean,

    onInitialize?: (self: GradumObserver<DataType, ComponentType, DataKeyType>) => void,
    onDestroy?: (self: GradumObserver<DataType, ComponentType, DataKeyType>) => void,
};

export {GradumModelProperties, GradumObserverProperties, GradumModelProxy};