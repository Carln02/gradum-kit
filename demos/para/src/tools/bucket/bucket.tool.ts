import {GradumTool, GradumEvent, Propagation, behavior, Color, define} from "../../../../../build/gradum-kit.esm";
import {Bucket} from "./bucket";

//Bucket tool
export class BucketTool extends GradumTool<Bucket> {
    public toolName = "bucket"; //Define the tool name

    //Equivalent to gradum(tool).addToolBehavior("click", "bucket", (e, el) => {...});
    @behavior() public click(e: GradumEvent, el: Element) {
        if ("color" in el && el.color instanceof Color && !(el instanceof Bucket)) {
            el.color = this.element.color;
            return Propagation.stopPropagation;
        }
    }
}

define(BucketTool);