import {
    behavior, ClickMode, DefaultEventName, DefaultEventNameEntry, GradumDragEvent, GradumEvent, GradumTool, gradum, Propagation
} from "../../../build/gradum-kit.esm";
import type {Component} from "./component";
import {ComponentView} from "./component.view";
import {ComponentModel} from "./component.model";

//=====================================================================================================================
// THE TOOL — something the user picks up and applies to other objects (a brush, a select arrow, an eraser).
// The element it's attached to IS the tool: clicking it picks the tool up.
//
// In-hand tool   Picked up, then applied anywhere. A brush.
// Embedded tool  Lives on an object and acts on it. A resize handle. (Beaudouin-Lafon, instrumental interaction.)
//
// Behaviors run in the CAPTURE phase (document → touched element), before any interactor listener.
// A tool is identified by its name only: two elements with the same tool are the same tool.
//=====================================================================================================================

export class ComponentTool extends GradumTool<Component, ComponentView, ComponentModel> {
    //== Config ========================================================================================================
    public toolName: string = "my-tool";                                     //REQUIRED. No name, no tool.
    public readonly activationEvent: DefaultEventNameEntry = DefaultEventName.click;   //What picks it up.
    public readonly clickMode: ClickMode = ClickMode.left;                   //With which button.
    public readonly key: string;                                             //Hold this key to use it ("Control").
    public activeClasses: string | string[] = "my-tool-active";              //Put on <body> while it's in hand.
    public readonly embeddedTarget: Node;                                    //Set it (or embedTool()) to embed.

    //Embedded tools that should never be "in hand" get an empty activation:
    //  public customActivation() {}

    //== Behaviors =====================================================================================================
    //Runs on each element of the path, outermost first, until one stops it.
    //The name gives the event (dragStart → "gradum-drag-start"), or pass {type: ...}.
    @behavior() protected click(e: GradumEvent, target: Node) {
        if (!gradum(target).metadata?.get("modifiable")) return Propagation.propagate;   //Not for us: keep going.
        //...act on target...
        return Propagation.stopPropagation;                                              //Handled.
    }

    @behavior() protected drag(e: GradumDragEvent, target: Node) {}

    //== Hooks =========================================================================================================
    public onActivate() {}                  //Picked up.
    public onDeactivate() {}                //Put down.
    public onEngage(target: Node) {}        //This element's copy of the tool started acting on target.
    public onDisengage(target: Node) {}     //Another element carrying the same tool took over (four resize handles).

    //== Cheat sheet ===================================================================================================
    private api() {
        this.element; this.view; this.model;
        this.manager.setTool(this.element as any, ClickMode.left);         //Pick it up from code.
        gradum(this).addToolBehavior(DefaultEventName.dragEnd, (e, target) => {}, this.toolName);  //Imperative @behavior.
        gradum(this).embedTool(document.body);                             //Embed it on something.
    }
}
