import {
    solver,
    ConstrainerCallbackProperties
} from "../../../../build/gradum-kit.esm";
import {CanvasSubstrate} from "./canvas.mainSubstrate";

//Pusher substrate
export class CanvasSpacerSubstrate extends CanvasSubstrate {
    //Define the substrate's name. Equivalent to gradum(canvas).makeSubstrate("pusher").
    public constrainerName = "spacer";

    public initialize() {
        super.initialize();
        //Remove the spacer solver because spacers are ignored in this substrate.
        this.removeSolver("pusherSolver");
        this.active = false;
    }

    /**
     * @description Spacer solver (with higher priority - it executes on the target before the pusher solver).
     * @param {ConstrainerCallbackProperties} properties - The solving properties passed down by the toolkit.
     * @protected
     */
    @solver({priority: 5}) protected spacerSolver(properties: ConstrainerCallbackProperties) {
        //For each object overlapping with el, and given that el has been moved by delta
        this.processTargetWithContext(properties, (el, delta, overlap) => {
            //Bounce back el so it doesn't overlap anymore, and retrieve the value.
            const movedValue = this.pushElement(el, overlap, delta, true);
            //If el wasn't bounced back --> return.
            if (!movedValue) return;
            //Store el's movement in its temporary data.
            this.getObjectData(el).movedDelta = movedValue;
        });
    }
}