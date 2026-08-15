import {define, GradumElement, gradum, effect, signal, auto} from "../../../../build/gradum-kit.esm";
import "./toolbar.css";

@define("demo-toolbar")
export class Toolbar extends GradumElement {
    @signal public color: string = "white";

    @auto() public set entries(value: HTMLElement[]) {
        value.forEach(entry => this.addTool(entry));
    }

    public addTool(tool: HTMLElement) {
        gradum(this).addChild(tool);
    }

    @effect private updateBackground() {
        gradum(this).setStyle("backgroundColor", this.color);
    }
}