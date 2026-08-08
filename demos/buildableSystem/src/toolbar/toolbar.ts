import {define, GradumElement, gradum, effect, signal, auto} from "../../../../build/gradum-kit.esm";
import "./toolbar.css";

export class Toolbar extends GradumElement {
    @signal public color: string = "white";

    @auto() public set entries(value: HTMLElement[]) {
        value.forEach(entry => this.addTool(entry));
    }

    public initialize() {
        super.initialize();
        effect(() => gradum(this).setStyle("backgroundColor", this.color));
    }

    public addTool(tool: HTMLElement) {
        gradum(this).addChild(tool);
    }
}
define(Toolbar, "demo-toolbar")