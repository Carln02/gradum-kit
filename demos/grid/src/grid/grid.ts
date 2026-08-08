import {GradumElement, GradumView, GradumEmitter, define} from "../../../../build/gradum-kit.esm";
import "./grid.css";
import {GradumGridModel} from "./grid.model";
import {GradumGridView} from "./grid.view";

@define("gradum-grid")
class GradumGrid<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumGridModel = GradumGridModel,
    EmitterType extends GradumEmitter = GradumEmitter<any>
> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
    public static defaultProperties = {
        model: GradumGridModel,
        view: GradumGridView
    };
}

export {GradumGrid};