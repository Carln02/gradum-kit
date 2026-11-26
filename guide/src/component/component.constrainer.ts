import {
    checker, ConstrainerCallbackProperties, ConstrainerMutatorProperties, GradumConstrainer, mutator, solver
} from "../../../build/gradum-kit.esm";
import type {Component} from "./component";
import {ComponentView} from "./component.view";
import {ComponentModel} from "./component.model";

//=====================================================================================================================
// THE CONSTRAINER — rules kept true over a list of objects (snap to a grid, don't overlap, stay on a line).
// (Formerly "substrate".) You don't state the rule: you write functions that restore it.
//
// How solving works: the user interacts with an object in triggerList → a queue is built (defaultQueue) →
// every @solver runs on each object in the queue. Solvers can push more objects to propagate the effect.
//
//   @solver   Fixes things after the interaction.
//   @checker  Runs before it. Returns false to block the event.
//   @mutator  Transforms a value on request, so one rule (e.g. snapping) can be reused anywhere.
//=====================================================================================================================

export class ComponentConstrainer extends GradumConstrainer<Component, ComponentView, ComponentModel> {
    //== Config ========================================================================================================
    public readonly constrainerName: string = "grid";   //REQUIRED. No name, no constrainer.
    public priority: number = 10;                       //Lower runs first, across constrainers. Default 10.
    public maxPasses: number = 5;                       //Per object, per round. Stops infinite loops. Default 5.
    public gridSize = 40;

    public initialize() {
        super.initialize();
        this.defaultQueue = [];   //Start with only the touched object. Default: every object in objectList.
        //this.objectList   Objects it constrains. Default: the element's children. Reassign: new GradumNodeList(...)
        //this.triggerList  Objects whose interaction triggers it. Default: objectList.
    }

    //== Solvers =======================================================================================================
    //Snap whatever was dragged to the grid, when the drag ends. @solver({priority: 5}) orders solvers.
    @solver() protected snap(p: ConstrainerCallbackProperties) {
        if (p.eventType !== "gradum-drag-end") return;
        const target = p.target as any;
        if (!("x" in target)) return;
        target.x = this.mutate({mutation: "toGrid", value: target.x});
        //this.queue.push(neighbour) to propagate to another object.
    }

    //== Checkers ======================================================================================================
    @checker() protected notLocked(p: ConstrainerCallbackProperties): boolean {
        return !(p.target as any)?.locked;
    }

    //== Mutators ======================================================================================================
    @mutator() protected toGrid(p: ConstrainerMutatorProperties<number>): number {
        return Math.round(p.value / this.gridSize) * this.gridSize;
    }

    //== Cheat sheet ===================================================================================================
    private api(p: ConstrainerCallbackProperties) {
        p.target;            //The object being solved (from the queue).
        p.eventTarget;       //The object the user interacted with.
        p.eventType;         //"gradum-drag", "gradum-drag-end"...
        p.event; p.toolName;
        p.constrainer; p.constrainerHost;   //This constrainer's name, and the element it's on.

        this.queue;                                      //This round's queue.
        this.active = false;                             //Switch it off/on.
        this.onObjectListChange;                         //Delegate: object added/removed from objectList.
        this.getObjectData(p.target);                    //Temporary scratch data per object (e.g. how far it was pushed).
        this.getObjectPasses(p.target);
        this.removeSolver("snap");                       //Also removeChecker / removeMutator, add*, clear*.
    }
}
