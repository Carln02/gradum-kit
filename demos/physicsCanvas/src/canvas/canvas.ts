import {
    define, effect, GradumNodeList, GradumElement, gradum, Point, GradumProxiedProperties,
    canvas
} from "../../../../build/gradum-kit.esm";
import "./canvas.css";
import {CanvasConstrainer} from "./canvas.mainConstrainer";
import {CanvasPusherConstrainer} from "./canvas.pusherConstrainer";
import {CanvasSpacerConstrainer} from "./canvas.spacerConstrainer";
import {getRect} from "../utils/getRect";
import {CanvasObject, Substrate} from "../interfaces";

export class Canvas extends GradumElement implements Substrate {
    public static defaultProperties: GradumProxiedProperties<any> = {
        constrainers: [CanvasPusherConstrainer, CanvasConstrainer, CanvasSpacerConstrainer],
    };

    protected canvas: HTMLCanvasElement;
    protected context: CanvasRenderingContext2D;
    public objectsList: Set<CanvasObject> = new Set();
    private stopRendering: () => void;

    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "substrate");
        gradum(this).hitResolver = (position: Point) => this.objectsAt(position);

        // this.objectsList.onChanged.add(() => this.startRendering());
        window.addEventListener("resize", () => this.resize());
        this.resize();
    }

    protected setupUIElements(): void {
        super.setupUIElements();
        this.canvas = canvas({parent: this});
        this.context = this.canvas.getContext("2d");
    }

    /**
     * @description Every object currently on the canvas, in paint order.
     */
    public get objects(): CanvasObject[] {
        return Array.from(this.objectsList);
    }

    public addObject(obj: CanvasObject) {
        this.objectsList.add(obj);
        this.startRendering();
    }

    public removeObject(obj: CanvasObject) {
        this.objectsList.delete(obj);
        this.startRendering()
    }

    /**
     * @description The objects under a point, topmost first — the order a hit resolver has to report.
     * @param {Point} position - The screen position to test.
     */
    public objectsAt(position: Point): CanvasObject[] {
        //Reversed because later children are painted last, so they sit on top.
        return this.objects.reverse().filter(obj => this.containsPoint(obj, position));
    }

    /**
     * @description Whether a point falls inside an object, its own rotation taken into account.
     */
    private containsPoint(obj: CanvasObject, position: Point): boolean {
        const rect = getRect(obj);
        if (!rect) return false;

        const toCenter = new Point(position.x - (rect.x + rect.width / 2), position.y - (rect.y + rect.height / 2));
        const angle = -(rect.angleRad ?? 0);
        const cos = Math.cos(angle), sin = Math.sin(angle);
        const local = new Point(
            toCenter.x * cos - toCenter.y * sin,
            toCenter.x * sin + toCenter.y * cos
        );

        return Math.abs(local.x) <= rect.width / 2 && Math.abs(local.y) <= rect.height / 2;
    }

    /**
     * @description Match the backing store to the element's size and the display's pixel density, then redraw.
     */
    private resize() {
        const ratio = window.devicePixelRatio || 1;
        const rect = this.getBoundingClientRect();
        this.canvas.width = Math.round(rect.width * ratio);
        this.canvas.height = Math.round(rect.height * ratio);
        this.startRendering();
    }

    private startRendering() {
        this.stopRendering?.();
        this.stopRendering = effect(() => this.render());
    }

    private render() {
        if (!this.context) return;
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const ratio = window.devicePixelRatio || 1;
        const origin = this.canvas.getBoundingClientRect();
        this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
        this.context.translate(-origin.x, -origin.y);

        for (const obj of this.objects) obj.render(this.context);
    }
}

define(Canvas, "my-canvas");