import {TextEditor} from "../textEditor/textEditor";
import {TextRange} from "../textEditor/textEditor.types";

/**
 * @type {MarkProperties}
 * @description What a mark object needs: which editor it belongs to, and the identity that finds it again in
 * the document. Which kind of mark it is comes from the class it is made from.
 */
export type MarkProperties = {
    editor: TextEditor,
    //Where it is held, and how far it has been drawn out. A drag makes one covering nothing — both at the
    //point it began — and moves the edge as the pointer goes.
    anchor?: number,
    edge?: number,
    //What finds it again in the document. Made up for it when it is not given one.
    id?: string
};

/**
 * @type {MarkParts}
 * @description Which stretches of what a mark is about to read are on their way out and which have just
 * arrived, as offsets into it. What to make of them — struck through, pending, anything at all — is the
 * caller's.
 */
export type MarkParts = {
    trimmed: TextRange,
    grown: TextRange
};
