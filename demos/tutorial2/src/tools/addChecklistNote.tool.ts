import {GradumTool, behavior, GradumEvent, Propagation, Point} from "../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas/canvas";
import {Note} from "../note/note";
import {NoteChecklistView} from "../note/note.checklistView";

export class AddChecklistNoteTool extends GradumTool {
    public toolName: string = "addChecklistNote";

    @behavior() click(e: GradumEvent, target: Node) {
        if (target instanceof Canvas) {
            Note.create({
                parent: target,
                view: NoteChecklistView,
                data: {
                    position: e.scaledPosition,
                    color: "#fff8c5",
                    size: new Point(220, 240),
                    title: "Checklist"
                }
            });
            return Propagation.stopPropagation;
        }
    }
}
