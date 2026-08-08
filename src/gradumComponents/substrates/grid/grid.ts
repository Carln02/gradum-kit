import {GradumElement} from "../../../gradumElement/gradumElement";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";

class GradumGrid<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter<any>
> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {

}

export {GradumGrid};