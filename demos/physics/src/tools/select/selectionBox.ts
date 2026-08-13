import {define, GradumElement, Anchor, gradum, signal, effect, StatefulReifect, Shown} from "../../../../../build/gradum-kit.esm";
import {ResizeHandle} from "./resizeHandle";
import "./selectionBox.css";

export class SelectionBox extends GradumElement {
    @signal public target: Node;

    public handles: ResizeHandle[] = [];
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
        this.handles = [Anchor.TopLeft, Anchor.TopRight, Anchor.BottomLeft, Anchor.BottomRight].map(anchor => ResizeHandle.create({anchor}));
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild(this.handles);
    }

    @effect private updateTarget() {
        this.stopTracking?.();
        this.stopTracking = undefined;
        gradum(this).show(!!this.target);
        if (!this.target) return;

        this.handles.forEach(handle => handle.retarget(this.target));
        this.track();
    }

    public track() {
        //Follow the target. Position and size are signals, so this re-runs on a drag, on a resize, and on
        //the position shift a corner resize applies to keep its opposite corner pinned.
        this.stopTracking = effect(() => {
            const position = this.target["position"];
            const size = this.target["size"];
            const centerAnchor = this.target["centerAnchor"] ?? false;
            if (!position || !size) return;

            const offsetX = centerAnchor ? size.x / 2 : 0;
            const offsetY = centerAnchor ? size.y / 2 : 0;
            gradum(this).setStyles({
                transform: `translate(${position.x - offsetX}px, ${position.y - offsetY}px)`,
                width: `${size.x}px`,
                height: `${size.y}px`,
            });
        });
    }
}

define(SelectionBox, "demo-selection-box");
