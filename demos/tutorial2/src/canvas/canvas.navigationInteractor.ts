import {
    ClickMode,
    InputDevice,
    listener,
    Point,
    GradumInteractor,
    GradumWheelEvent
} from "../../../../build/gradum-kit.esm";
import {Canvas} from "./canvas";
import {CanvasModel} from "./canvas.model";

export class CanvasNavigationInteractor extends GradumInteractor<Canvas, any, CanvasModel> {
    public accessor target = document;

    @listener() scroll(e: GradumWheelEvent) {
        if (this.scrollInside(e)) return;
        this.pan(e);
    }
    @listener() pinch(e: GradumWheelEvent) {
        if (e.inputDevice === InputDevice.touch && e.clickMode === ClickMode.left) return;
        this.zoom(e);
    }

    protected scrollInside(e: GradumWheelEvent): boolean {
        let el = e.target as HTMLElement;
        while (el && el !== this.element && el instanceof HTMLElement) {
            if (this.isScrollable(el)) {
                const delta = (e.inputDevice === InputDevice.touch ? e.delta.mul(-1) : e.delta).div(this.model.scale);
                el.scrollTop += delta.y;
                el.scrollLeft += delta.x;
                return true;
            }
            el = el.parentElement;
        }
        return false;
    }

    protected isScrollable(el: HTMLElement): boolean {
        const style = getComputedStyle(el);
        const scrollsY = /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight;
        const scrollsX = /(auto|scroll)/.test(style.overflowX) && el.scrollWidth > el.clientWidth;
        return scrollsY || scrollsX;
    }

    public pan(e: GradumWheelEvent) {
        this.emitter.fire("willChange");
        this.model.translate(e.inputDevice === InputDevice.touch
            ? e.delta
            : new Point(-e.delta?.x, -e.delta?.y));
    }

    public zoom(e: GradumWheelEvent) {
        this.emitter.fire("willChange");
        const oldScale: number = this.model.scale;
        const zoomOrigin = new Point(window.innerWidth / 2, window.innerHeight / 2).sub(this.model.translation);

        if (e.inputDevice === InputDevice.touch)
            this.model.scale += this.model.scale * e.delta.y * this.model.zoomTouchIntensity;
        else
            this.model.scale -= this.model.scale * e.delta.y * this.model.zoomTrackpadIntensity;

        this.model.translate(zoomOrigin.mul(1 - this.model.scale / oldScale));
    }
}