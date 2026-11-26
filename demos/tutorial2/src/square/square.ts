import {GradumElement, expose, Point, define} from "../../../../build/gradum-kit.esm";
import {SquareView} from "./square.view";
import {SquareModel} from "./square.model";
import {SquareResizeInteractor} from "./square.resizeInteractor";
import {SquareLockOperator} from "./square.lockOperator";

export class Square<
    View extends SquareView = SquareView<any, any>,
    Model extends SquareModel = SquareModel
> extends GradumElement<View, any, Model> {
    public static defaultProperties = {
        view: SquareView,
        model: SquareModel,
        interactors: SquareResizeInteractor,
        operators: SquareLockOperator
    };

    @expose("model") public position: Point;
    @expose("model") public size: Point;
    @expose("model") public color: string;
}

define(Square, "my-square");