import {Mark as TipTapMark} from "@tiptap/core";
import {Mark} from "../mark/mark";
import "./erasingMark.css";

/**
 * @class ErasingMark
 * @description Text on its way out, greyed and struck through.
 *
 * Nothing is removed until the gesture that marked it lets go, so the document — and every position being
 * measured against it — holds still for the length of a drag. Shared: the eraser paints it as it sweeps, and
 * a stretch paints it over the words a trim is about to take.
 *
 * The eraser draws one as an object like any other passage, and lets go of it at the end of the sweep. The
 * copies a stretch paints over its doomed tail are laid down as part of writing the text, and carry no
 * identity of their own — they say something about text that is about to change, not about a passage.
 */
export class ErasingMark extends Mark {
    public static markName: string = "erasing";

    public static definition() {
        return TipTapMark.create({
            name: this.markName,
            //Typing next to a marked run should not pick the mark up: it means "about to go", not a style.
            inclusive: false,
            addAttributes: Mark.identityAttribute,
            parseHTML: () => [{tag: "span[data-erasing]"}],
            renderHTML: ({HTMLAttributes}) => ["span", {"data-erasing": "true", ...HTMLAttributes}, 0]
        });
    }

    /**
     * @function delete
     * @override
     * @description Take the text with it. Everything the sweep greyed out goes at once, so a single undo
     * puts it all back rather than one word at a time.
     */
    public delete() {
        const range = this.range;
        super.delete();
        if (range) this.editor?.editor.commands.deleteRange(range);
    }
}
