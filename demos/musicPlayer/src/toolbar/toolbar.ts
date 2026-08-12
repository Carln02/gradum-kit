import "./toolbar.css";
import {define, element, gradum, GradumElement, GradumElementProperties} from "../../../../build/gradum-kit.esm";

export class Toolbar extends GradumElement {
    public addTool(tool: HTMLElement) {
        gradum(this).addChild(tool);
    }
}

define(Toolbar, "gradum-toolbar")