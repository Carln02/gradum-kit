import {describe, it, expect, beforeEach} from "vitest";
import {GradumTool} from "../tool/tool";
import {GradumEventManager} from "../../eventHandling/gradumEventManager/gradumEventManager";
import {ClickMode} from "../../eventHandling/gradumEventManager/gradumEventManager.types";
import {div} from "../../elementCreation/basicElements";
import {gradum} from "../../gradumFunctions/gradumFunctions";

class MarkingTool extends GradumTool {
    public toolName = "marking";
    public activeClasses = "erasing";
}

class MultiClassTool extends GradumTool {
    public toolName = "multi";
    public activeClasses = "erasing careful";
}

class OwnHooksTool extends GradumTool {
    public toolName = "hooks";
    public activeClasses = "hooked";
    public activations: string[] = [];

    public onActivate() {
        this.activations.push("on");
    }

    public onDeactivate() {
        this.activations.push("off");
    }
}

class PlainTool extends GradumTool {
    public toolName = "plain";
}

//Building a tool the way an element does: attached to a node, then initialized so it registers itself.
const build = <Type extends GradumTool>(Tool: new (properties: any) => Type, manager: GradumEventManager,
                                        properties: object = {}) => {
    const element = div({parent: document.body});
    const tool = new Tool({element, manager, ...properties});
    tool.initialize();
    return {tool, element};
};

describe("a tool marks the page while it is the active one", () => {
    let manager: GradumEventManager;

    beforeEach(() => {
        manager = GradumEventManager.create();
        document.body.className = "";
        gradum().clearToolBehaviors();
    });

    it("adds its classes on activation and takes them off again", () => {
        const {element} = build(MarkingTool, manager);
        const {element: other} = build(PlainTool, manager);

        manager.setTool(element, ClickMode.left, {select: true, activate: true});
        expect(document.body.classList.contains("erasing")).toBe(true);

        manager.setTool(other, ClickMode.left, {select: true, activate: true});
        expect(document.body.classList.contains("erasing")).toBe(false);
    });

    it("takes a list of classes as readily as one", () => {
        const {element} = build(MultiClassTool, manager);
        const {element: other} = build(PlainTool, manager);

        manager.setTool(element, ClickMode.left, {select: true, activate: true});
        expect(document.body.classList.contains("erasing")).toBe(true);
        expect(document.body.classList.contains("careful")).toBe(true);

        manager.setTool(other, ClickMode.left, {select: true, activate: true});
        expect(document.body.classList.contains("careful")).toBe(false);
    });

    it("marks whatever it is told to instead of the body", () => {
        const target = div({parent: document.body});
        const {element} = build(MarkingTool, manager, {activeClassesTarget: target});
        const {element: other} = build(PlainTool, manager);

        manager.setTool(element, ClickMode.left, {select: true, activate: true});
        expect(target.classList.contains("erasing")).toBe(true);
        expect(document.body.classList.contains("erasing")).toBe(false);

        manager.setTool(other, ClickMode.left, {select: true, activate: true});
        expect(target.classList.contains("erasing")).toBe(false);
    });

    it("takes its classes from properties as well as from the class", () => {
        const {element} = build(PlainTool, manager, {toolName: "given", activeClasses: "given-a-class"});
        const {element: other} = build(MarkingTool, manager);

        manager.setTool(element, ClickMode.left, {select: true, activate: true});
        expect(document.body.classList.contains("given-a-class")).toBe(true);

        manager.setTool(other, ClickMode.left, {select: true, activate: true});
        expect(document.body.classList.contains("given-a-class")).toBe(false);
    });

    it("still runs the tool's own activation hooks", () => {
        const {tool, element} = build(OwnHooksTool, manager);
        const {element: other} = build(PlainTool, manager);

        manager.setTool(element, ClickMode.left, {select: true, activate: true});
        expect(tool.activations).toEqual(["on"]);
        expect(document.body.classList.contains("hooked")).toBe(true);

        manager.setTool(other, ClickMode.left, {select: true, activate: true});
        expect(tool.activations).toEqual(["on", "off"]);
        expect(document.body.classList.contains("hooked")).toBe(false);
    });

    it("leaves the page alone when it names no classes", () => {
        const {element} = build(PlainTool, manager);

        manager.setTool(element, ClickMode.left, {select: true, activate: true});
        expect(document.body.className).toBe("");
    });
});
