import {TextRange} from "../textEditor/textEditor.types";

/**
 * @type {StrokeProperties}
 * @description What a stroke needs to take hold of a passage: where it sits in the document, what it reads,
 * and a way to ask where a point in it falls on screen.
 */
export type StrokeProperties = {
    from: number,
    text: string,
    markName?: string,
    coordsAt: (offset: number) => {left: number, right: number, top: number, bottom: number}
};

export type TextUnit = "word" | "char";

/**
 * @type {StrokeParts}
 * @description Which stretches of a stroke's text are on their way out and which have just arrived, as
 * offsets into it. What to make of them — struck through, pending, anything at all — is the caller's.
 */
export type StrokeParts = {
    trimmed: TextRange,
    grown: TextRange
};