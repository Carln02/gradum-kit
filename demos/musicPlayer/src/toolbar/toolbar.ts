import "./toolbar.css";
import {define, element, gradum, GradumElement, GradumElementProperties} from "../../../../build/gradum-kit.esm";

@define("gradum-toolbar")
export class Toolbar extends GradumElement {
    public addTool(tool: HTMLElement) {
        gradum(this).addChild(tool);
    }
}

export function toolbar(properties: GradumElementProperties) {
    if (!properties.tag) properties.tag = "gradum-toolbar";
    return element({...properties}) as Toolbar;
}