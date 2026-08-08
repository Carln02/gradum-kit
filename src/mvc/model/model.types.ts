import {GradumObserver} from "./observer";
import {KeyType} from "../../types/basic.types";
import {GradumModel} from "./model";

type GradumModelProxy<
    DataType extends object = any,
    IdType extends KeyType = any
> = DataType & {readonly $model: GradumModel<DataType, KeyType, IdType>};

/**
 * @type GradumModelProperties
 * @group MVC
 * @category GradumModel
 *
 * @description Configuration object used when creating a {@link GradumModel}.
 * @template DataType - The type of data stored in the model.
 * @template IdType - The type of the data's ID.
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
 * @type GradumObserverProperties
 * @group Components
 * @category GradumDataBlock
 *
 * @description Configuration object to create a new {@link GradumObserver}.
 *
 * @template DataType - The type of data handled by the observer.
 * @template {object} ComponentType - The instance type created/managed by the observer.
 * @template {string | number | symbol} KeyType - The per-item key type.
 * @template {string | number} BlockKeyType - The block-grouping key type.
 *
 * @property {new(...args:any[]) => GradumObserver<DataType, ComponentType, KeyType, BlockKeyType>} [customConstructor] -
 * Optional custom observer constructor to instantiate instead of the default `GradumObserver`.
 * @property {boolean} [initialize] - If true, the observer is initialized immediately.
 * @property {(data, id, self, blockKey?) => ComponentType | void} [onAdded] - Called when a new item appears.
 * @property {(data, instance, id, self, blockKey?) => void} [onUpdated] - Called when an existing item changes.
 * @property {(data, instance, id, self, blockKey?) => void} [onDeleted] - Called when an item is deleted.
 * @property {(self) => void} [onInitialize] - Called when the observer is initialized.
 * @property {(self) => void} [onDestroy] - Called when the observer is destroyed.
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