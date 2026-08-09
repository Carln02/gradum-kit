import {GradumModel} from "../../../mvc/model/model";
import {KeyType} from "../../../types/basic.types";
import {Point} from "../../datatypes/point/point";
// import {blockSignal} from "../../../decorators/reactivity/reactivity";

/**
 * @internal
 * @class GridModel
 * @extends GradumModel
 * @template DataType - The type of the data held by the model.
 * @template {KeyType} DataKeyType - The type of the keys indexing that data.
 * @template {KeyType} IdType - The type of the model's id.
 * @template {object} ComponentType - The instance type components are created as.
 * @template DataEntryType - The type of a single entry in the data.
 * @description Model backing {@link GradumGrid}, holding the cell positions and the column and row
 * sizes. Unimplemented — the class is currently an empty placeholder.
 */
class GridModel<
    DataType = any,
    DataKeyType extends KeyType = any,
    IdType extends KeyType = any,
    ComponentType extends object = any,
    DataEntryType = any
> extends GradumModel<DataType, DataKeyType, IdType, ComponentType, DataEntryType> {
    // @blockSignal() public positions: GradumDataBlock<Map<string, Point>, string> = new GradumDataBlock();
    // @blockSignal() public columnWidths: GradumDataBlock<Array<number>, number> = new GradumDataBlock();
    // @blockSignal() public rowHeights: GradumDataBlock<Array<number>, number> = new GradumDataBlock();
}