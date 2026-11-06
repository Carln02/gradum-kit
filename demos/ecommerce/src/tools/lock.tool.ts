import {GradumTool, GradumEvent, Propagation, behavior, gradum} from "../../../../build/gradum-kit.esm";

//Lock tool: clicking something with a `locked` flag locks or unlocks it. A locked object is no longer
//modifiable, so the other tools leave it alone.
export class LockTool extends GradumTool {
    public toolName = "lock"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("click", "lock", (e, el) => {...});
    @behavior() public click(e: GradumEvent, el: Node) {
        if (!("locked" in el) || typeof el.locked !== "boolean") return Propagation.propagate;
        el.locked = !el.locked;
        gradum(el).metadata.set(!el.locked, "modifiable");
        return Propagation.stopPropagation;
    }
}
