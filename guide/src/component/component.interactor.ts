import {DefaultEventName, GradumDragEvent, GradumEvent, GradumInteractor, listener, Propagation} from "../../../build/gradum-kit.esm";
import type {Component} from "./component";
import {ComponentView} from "./component.view";
import {ComponentModel} from "./component.model";

//=====================================================================================================================
// THE INTERACTOR — a group of event listeners on one element (the component, by default).
//
// Listeners run in the BUBBLE phase (from the touched element up to the document), after the active tool's
// behaviors, which run in the capture phase (see the tool).
//=====================================================================================================================

export class ComponentInteractor extends GradumInteractor<Component, ComponentView, ComponentModel> {
    //Only listen while this tool is active. Omit to always listen.
    public readonly toolName: string = "select";

    //this.target is where listeners attach: the component by default. Reassign it any time and they move.
    public initialize() {
        super.initialize();
        //this.target = this.view.paragraph;
    }

    //== Listeners =====================================================================================================
    //The event name is inferred from the method name: click → "gradum-click", dragEnd → "gradum-drag-end".
    @listener() protected click(e: GradumEvent, target: Node) {
        //Return one of these. Nothing = propagate.
        //  Propagation.propagate                 Carry on to the next element.
        //  Propagation.stopPropagation           Stop this phase.
        //  Propagation.stopImmediatePropagation  Stop everything.
        return Propagation.stopPropagation;
    }

    //Or name the event explicitly.
    @listener({type: DefaultEventName.dragEnd}) protected onDrop(e: GradumDragEvent, target: Node) {}

    //== What events carry =============================================================================================
    @listener() protected drag(e: GradumDragEvent, target: Node) {
        //GradumEvent (every event)
        e.target;            //What the user actually touched. (target, the parameter, is the current element.)
        e.position;          //Screen position (a Point).
        e.scaledPosition;    //The same, mapped into a zoomed/panned canvas.
        e.clickMode;         //Which button / how many fingers.
        e.inputDevice;       //Mouse, trackpad, or touch.
        e.keys;              //Keyboard keys held.
        e.toolName; e.tool;  //The active tool's name, and the element that is it.
        e.eventName;         //"gradum-drag".
        e.closest(HTMLElement);   //Nearest element of a type, from the target.

        //GradumDragEvent (drags) — each also has a scaled version: scaledDeltaPosition, scaledOrigins...
        e.deltaPosition;     //Movement since the last event.
        e.origins;           //Where each pointer started.
        e.positions; e.previousPositions; e.deltaPositions;   //Per pointer (multi-touch).
    }
}
