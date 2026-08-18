import {GradumOperator, Point} from "../../../../build/gradum-kit.esm";
import {EditorView} from "@tiptap/pm/view";
import {EditorState} from "@tiptap/pm/state";
import {Mapping} from "@tiptap/pm/transform";
import {TextEditor} from "./textEditor";
import {TextEditorModel} from "./textEditor.model";
import {Mark} from "../mark/mark";
import {markTypes} from "../marks";
import {SequenceMark} from "../sequenceMark/sequenceMark";

/**
 * @class TextEditorMarkOperator
 * @description The editor's marked passages: how they are made, found, carried, and let go of.
 *
 * The one hand on them. A passage puts itself in the text and takes itself out again — nothing here writes to
 * the document — but which passages there are, and which one a drag has hold of, is kept in this one place
 * rather than spread between the editor, the tools and the marks themselves.
 */
export class TextEditorMarkOperator extends GradumOperator<TextEditor, any, TextEditorModel> {
    protected readonly markObjects: Map<string, Mark> = new Map();

    protected get editorView(): EditorView {
        return this.element.editor.view;
    }

    protected get editorState(): EditorState {
        return this.element.editor.view.state;
    }

    /**
     * @description Every marked passage there is an object for.
     */
    public get marks(): Mark[] {
        return [...this.markObjects.values()];
    }

    /**
     * @description Whether any passage is mid-gesture. Held off from while one is: a passage keeps its own
     * account of itself until it lets go, and a rule cutting the text from under it would be arguing with
     * something that has not finished.
     */
    public get working(): boolean {
        return this.marks.some(mark => (mark as SequenceMark).working);
    }

    /**
     * @function createMark
     * @description Start a passage of a given kind where a drag began, and take hold of it. It covers nothing
     * yet, and is given somewhere to be as the pointer moves.
     * @param {typeof Mark} type - The kind of passage to make.
     * @param {Point} position - Where on the screen the drag began.
     * @returns {Mark} The passage, or nothing when the drag began outside the text.
     */
    public createMark(type: typeof Mark, position: Point): Mark {
        const at = this.element.positionAt(position);
        if (at === undefined) this.model.currentMark = undefined;
        else {
            this.model.currentMark = type.create({editor: this.element, anchor: at, edge: at});
            this.markObjects.set(this.model.currentMark?.id, this.model.currentMark);
        }
        return this.model.currentMark;
    }

    /**
     * @function drawTo
     * @description Draw the passage in hand out to where the pointer has reached — which is a matter of
     * telling it where it now runs to, nothing more. It draws itself.
     * @param {Point} position - Where on the screen the pointer has reached.
     * @param mark
     */
    public drawTo(position: Point, mark = this.model.currentMark) {
        const at = this.element.positionAt(position);
        if (mark && at !== undefined) mark.edge = at;
    }

    /**
     * @function deleteMark
     * @description Let go of a passage: it takes itself out of the document, and is dropped from the
     * register on its way out.
     * @param {Mark} mark - The passage to let go of.
     */
    public deleteMark(mark: Mark) {
        if (!mark || !this.markObjects.delete(mark.id)) return;
        if (this.model.currentMark === mark) this.model.currentMark = undefined;
        mark.delete();
    }

    /**
     * @function deleteMarks
     * @description Let go of every passage of a kind.
     * @param {string} [markName] - The kind to let go of. All of them when omitted.
     */
    public deleteMarks(markName?: string) {
        this.findMarks(markName).forEach(mark => this.deleteMark(mark));
    }

    /**
     * @function findMarks
     * @description Every passage of a kind that is held.
     * @param {string} markName - The kind to look for. All of them when omitted.
     */
    public findMarks(markName: string): Mark[] {
        return this.marks.filter(mark => mark.markName === markName);
    }

    /**
     * @function findMark
     * @description The passage of a kind covering a position, if there is one.
     * @param {number} position - Where in the document to look.
     * @param {string} [markName] - The kind to look for. Any of them when omitted.
     */
    public findMark(position: number, markName?: string): Mark {
        return this.findMarks(markName).find(mark => mark.covers(position));
    }

    /**
     * @function marksAt
     * @description The passages under a point on the screen — what a hit on the editor really lands on,
     * since the DOM cannot see a passage.
     * @param {Point} position - The point on the screen.
     */
    public marksAt(position: Point): Mark[] {
        const at = this.element.positionAt(position);
        if (at === undefined) return [];
        return this.marks.filter(mark => mark.covers(at));
    }

    /**
     * @function remapMarks
     * @description Carry every passage along with a change to the text. They say where they go, so when the
     * text moves underneath them they have to be told, or they would draw themselves back where they were.
     * @param {Mapping} mapping - How the change moved the document's positions.
     */
    public remapMarks(mapping: Mapping) {
        for (const mark of this.marks) mark.remap(mapping);
    }

    /**
     * @function syncMarks
     * @description Bring the objects into step with the document: one for every identified mark in it, and
     * none for marks that are no longer there.
     *
     * Run after every change, because a mark can appear or vanish without a tool having anything to do with
     * it — pasted text brings its marks along, an undo brings back a passage that was erased.
     */
    public syncMarks() {
        const found: Set<string> = new Set();
        for (const type of markTypes) {
            for (const range of type.rangesOf(this.editorState)) {
                const id = range.attributes?.id;
                if (!id) continue;
                found.add(id);
                if (!this.markObjects.has(id)) this.markObjects.set(id, type.create({editor: this.element, id}));
            }
        }

        for (const [id, mark] of [...this.markObjects]) if (!found.has(id) && !mark.range) this.deleteMark(mark);
    }

    /**
     * @function release
     * @description Let go of the passages a gesture left behind — the ones a tool selects with, not the ones
     * meant to outlast it. A click anywhere but on such a passage, or a change of tool, is the end of it.
     * @param {Point} [position] - Where the click landed. Nothing survives when there was no click.
     */
    public release(position?: Point) {
        const at = position ? this.element.positionAt(position) : undefined;
        this.marks.filter(mark => mark instanceof SequenceMark && !mark.covers(at))
            .forEach(mark => this.deleteMark(mark));
    }
}