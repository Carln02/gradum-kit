import {GradumTool, behavior, Propagation} from "../../../../../build/gradum-kit.esm";

export class DeleteTool extends GradumTool {
    public toolName = "delete";

    @behavior() public click(e: Event, target: Node) {
        if ("delete" in target && typeof target.delete === "function") {
            target.delete();
            return Propagation.stopPropagation;
        }
    }
}