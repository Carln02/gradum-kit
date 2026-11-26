import {GradumView, div, gradum, effect, css} from "../../../../build/gradum-kit.esm";
import {Canvas} from "./canvas";
import {CanvasModel} from "./canvas.model";

export class CanvasView extends GradumView<Canvas, CanvasModel> {
    protected background: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();
        this.background = div({id: "canvas-background"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild(this.background);
    }

    @effect private transformCanvas() {
        gradum(this).setStyle("transform",
            css`translate3d(${this.model.translation.x}px, ${this.model.translation.y}px, 0) 
            scale3d(${this.model.scale}, ${this.model.scale}, 1)`);
    }

    @effect protected keepBackgroundOnScreen() {
        gradum(this.background).setStyle("transform",
            `translate(${-this.model.translation.x / this.model.scale}px, 
            ${-this.model.translation.y / this.model.scale}px) scale(${1 / this.model.scale})`);
    }

    @effect protected updateColor() {
        gradum(this.background).setStyle("backgroundColor", this.model.color);
    }
}