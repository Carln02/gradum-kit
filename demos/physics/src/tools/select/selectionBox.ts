import {
    Anchor,
    define,
    effect,
    gradum,
    GradumElement,
    Shown,
    signal,
    StatefulReifect
} from "../../../../../build/gradum-kit.esm";
import {ResizeHandle} from "./resizeHandle";
import {RotateHandle} from "./rotateHandle";
import {getRect} from "../../utils/getRect";
import "./selectionBox.css";

//Module-level rather than a static: a private static makes TypeScript reduce `Gradum<this>` to `never`.
const corners = [Anchor.TopLeft, Anchor.TopRight, Anchor.BottomLeft, Anchor.BottomRight];

export class SelectionBox extends GradumElement {
    @signal public target: Node;

    public resizeHandles: ResizeHandle[] = [];
    public rotateHandles: RotateHandle[] = [];
    public stopTracking: () => void;

    public initialize() {
        gradum(this).showTransition = new StatefulReifect({
            states: Shown,
            styles: state => "display: " + (state === Shown.visible ? "block" : "none")
        });
        super.initialize();
    }

    public clear() {
        this.target = undefined;
    }

    protected setupUIElements() {
        super.setupUIElements();
        this.rotateHandles = corners.map(anchor => RotateHandle.create({anchor}));
        this.resizeHandles = corners.map(anchor => ResizeHandle.create({anchor}));
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([...this.rotateHandles, ...this.resizeHandles]);
    }

    @effect private updateTarget() {
        this.stopTracking?.();
        this.stopTracking = undefined;
        gradum(this).show(!!this.target);
        if (!this.target) return;
        this.resizeHandles.forEach(handle => handle.retarget(this.target));
        this.rotateHandles.forEach(handle => handle.retarget(this.target));
        this.track();
    }

    public track() {
        this.stopTracking = effect(() => {
            const rect = getRect(this.target);
            if (!rect) return;
            gradum(this).setStyles({
                transform: `translate(${rect.topLeft.x}px, ${rect.topLeft.y}px) rotate(${rect.angleRad ?? 0}rad)`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
            });
        });
    }
}

define(SelectionBox, "demo-selection-box");
