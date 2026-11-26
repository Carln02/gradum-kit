import {
    define,
    expose,
    interactor,
    GradumElement,
    Point,
    GradumEventManager,
    GradumWheelEvent,
} from "../../../../build/gradum-kit.esm";
import "./canvas.css";
import {CanvasModel} from "./canvas.model";
import {CanvasNavigationInteractor} from "./canvas.navigationInteractor";
import {CanvasWillChangeOperator} from "./canvas.willChangeOperator";
import {CanvasView} from "./canvas.view";
import {CanvasSnapConstrainer} from "./canvas.snapConstrainer";
import {CanvasSizeConstrainer} from "./canvas.sizeConstrainer";

/**
 * @description Class representing a canvas on which the user can add cards, connect them, move them around, etc.
 */
export class Canvas extends GradumElement<any, any, CanvasModel> {
    public static defaultProperties = {
        model: CanvasModel,
        view: CanvasView,
        interactors: CanvasNavigationInteractor,
        operators: CanvasWillChangeOperator,
        constrainers: [CanvasSnapConstrainer, CanvasSizeConstrainer]
    };

    @expose("model") public translation: Point;
    @expose("model") public scale: number;
    @expose("model") public color: string;

    @interactor() protected navigationInteractor: CanvasNavigationInteractor;

    public initialize() {
        super.initialize();
        //A trackpad pinch arrives as a ctrl + wheel event. Left alone, the browser zooms the whole page with it, on
        //top of the canvas zooming — which lags, and pushes fixed UI like the toolbar off-screen.
        GradumEventManager.instance.preventDefaultWheel = true;
        GradumEventManager.instance.authorizeEventScaling = () => true;
        GradumEventManager.instance.scaleEventPosition = (position: Point) => this.scalePosition(position);
    }

    /**
     * @description Offset a given screen position by the canvas's translation.
     * @param {Point} screenPosition
     */
    public scalePosition(screenPosition: Point) {
        return screenPosition?.sub(this.translation).div(this.scale);
    }

    public pan(e: GradumWheelEvent) {
        this.navigationInteractor.pan(e);
    }

    public zoom(e: GradumWheelEvent) {
        this.navigationInteractor.zoom(e);
    }
}

define(Canvas, "my-canvas");
