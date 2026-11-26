import {define, GradumElement, gradum, effect, signal, auto, Point} from "../../../../build/gradum-kit.esm";
import "./toolbar.css";

export class Toolbar extends GradumElement {
    @signal public position: Point = new Point();
    @signal public color: string = "white";

    protected originalSize: Point;
    @signal @auto({executeSetterBeforeStoring: true}) public set size(value: Point) {
        if (!this.size) return;
        const heightChange = value.y - this.size.y;
        this.position = new Point(this.position.x, this.position.y + heightChange / 2);
    }

    @auto() public set entries(value: HTMLElement[]) {
        value.forEach(entry => this.addTool(entry));
    }

    public addTool(...tools: HTMLElement[]) {
        tools.forEach(tool => gradum(this).addChild(tool));
    }

    public initialize() {
        super.initialize();
        requestAnimationFrame(() => {
            const rect = this.getBoundingClientRect();
            this.originalSize = new Point(rect.width, rect.height);
            this.size = this.originalSize;
        })
    }

    @effect protected updateColor() {
        gradum(this).setStyle("backgroundColor", this.color)
    }

    @effect protected updatePosition() {
        gradum(this).setStyle("transform",
            `translate(calc(-50% + ${this.position.x}px), ${this.position.y}px)`);
    }

    @effect protected updateSize() {
        if (!this.size) return;
        gradum(this).setStyles({width: this.size.x + "px", height: this.size.y + "px"});
    }
}

define(Toolbar, "my-toolbar");
