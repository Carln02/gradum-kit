import {GradumModel} from "../../../mvc/model/model";
import {Point} from "../../datatypes/point/point";
// import {blockSignal} from "../../../decorators/reactivity/reactivity";

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