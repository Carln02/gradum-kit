import {GradumView, element, SvgNamespace, gradum, effect, Color} from "../../../../build/gradum-kit.esm";
import {StickyLine} from "./stickyLine";
import {StickyLineModel} from "./stickyLine.model";
import {Square} from "../square/square";

export class StickyLineView extends GradumView<StickyLine, StickyLineModel> {
    private svg: SVGSVGElement;
    public line: SVGLineElement;
    private hitLine: SVGLineElement;

    public startHandle: Square;
    public endHandle: Square;

    public initialize(): void {
        super.initialize();
        requestAnimationFrame(() => gradum(this).getConstrainerObjectList().add(this.line, this.startHandle, this.endHandle));
    }

    protected setupUIElements() {
        super.setupUIElements();
        this.svg = element({tag: "svg", namespace: SvgNamespace, width: "100%" as any, height: "100%" as any}) as SVGSVGElement;
        this.line = element({tag: "line", namespace: SvgNamespace}) as SVGLineElement;
        this.hitLine = element({tag: "line", namespace: SvgNamespace}) as SVGLineElement;
        gradum(this.hitLine).setAttribute("stroke", "transparent").setAttribute("pointer-events", "stroke");

        this.startHandle = Square.create({size: 20, color: Color.from("#FFFFFF"), classes: "handle"});
        this.endHandle = Square.create({size: 20, color: Color.from("#FFFFFF"), classes: "handle"});

        //A handle is one end of a line, not a square in its own right: deleting one deletes the line, since a
        //line with one end left is nothing anybody asked for.
        for (const handle of [this.startHandle, this.endHandle]) handle.delete = () => this.element.delete();
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this.svg).addChild([this.line, this.hitLine]);
        gradum(this).addChild([this.svg, this.startHandle, this.endHandle]);
    }

    @effect private updateLines() {
        this.updateLine(this.line);
        this.updateLine(this.hitLine);
    }

    @effect private updateThickness() {
        gradum(this.line).setAttribute("stroke-width", this.model.thickness);
        this.startHandle.style.borderWidth = this.model.thickness + "px";
        this.endHandle.style.borderWidth = this.model.thickness + "px";

    }

    @effect private updateHitThickness() {
        gradum(this.hitLine).setAttribute("stroke-width", this.model.hitThickness);
    }

    @effect private updateColor() {
        gradum(this.line).setAttribute("stroke", this.model.color);
        this.startHandle.style.borderColor = this.model.color;
        this.endHandle.style.borderColor = this.model.color;
    }

    private updateLine(line: SVGLineElement) {
        line.setAttribute("x1", String(this.startHandle.position.x));
        line.setAttribute("y1", String(this.startHandle.position.y));
        line.setAttribute("x2", String(this.endHandle.position.x));
        line.setAttribute("y2", String(this.endHandle.position.y));
    }
}