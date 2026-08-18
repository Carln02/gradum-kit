import {GradumOperator} from "../../../../build/gradum-kit.esm";
import {Node} from "@tiptap/pm/model";
import {TextEditor} from "./textEditor";
import {TextRange, TextTokens} from "./textEditor.types";

//What counts as a word: any run of non-space. One rule for the whole demo, so the number a panel shows, the
//number a ceiling is measured against and the items a turn cycles can never disagree about what a word is.
const WORD = /\S+/g;

/**
 * @class TextEditorTextOperator
 * @description What the editor knows about words: how to read a span of the text, count it, find the words
 * around a point in it, and take a passage apart into items and put it back together.
 *
 * All of it is about the text and none of it about the document, so nothing here dispatches anything or holds
 * any state. It is here rather than spread through the marks and their rules because every one of them was
 * writing the same regular expression, and two places disagreeing about where a word ends is the kind of bug
 * that only shows up at a boundary.
 */
export class TextEditorTextOperator extends GradumOperator<TextEditor> {
    /**
     * @function textIn
     * @description The text a span holds.
     * @param {TextRange} range - The span to read.
     * @param {Node} [doc] - The document to read it from. Defaults to the one on screen, which is not always
     * the one wanted: a change can be read from the document it would produce, before it becomes that one.
     */
    public textIn(range: TextRange, doc: Node = this.element.editorView.state.doc): string {
        return range ? doc.textBetween(range.from, range.to, "\n") : "";
    }

    /**
     * @function countWords
     * @description How many words a piece of text holds.
     * @param {string} text - The text to count.
     */
    public countWords(text: string): number {
        return text?.match(WORD)?.length ?? 0;
    }

    /**
     * @function wordsAfter
     * @description The next `count` words after an offset, as offsets into the same text, with the space in
     * front of them so that removing them leaves no gap.
     * @param {string} text - The text to look in.
     * @param {number} at - Where to look from.
     * @param {number} count - How many words are wanted.
     * @returns {TextRange} The span they cover, or nothing when there are not that many left after `at`.
     */
    public wordsAfter(text: string, at: number, count: number): TextRange {
        if (at === undefined || at < 0 || at > text.length) return undefined;

        const following = [...text.matchAll(WORD)].filter(word => word.index >= at);
        if (following.length < count) return undefined;

        const last = following[count - 1];
        return {from: Math.max(at, following[0].index - 1), to: last.index + last[0].length};
    }

    /**
     * @function wordsAtEnd
     * @description The last `count` words of a piece of text, as offsets into it — the whole of it when it
     * does not hold that many.
     * @param {string} text - The text to look in.
     * @param {number} count - How many words are wanted.
     */
    public wordsAtEnd(text: string, count: number): TextRange {
        const words = [...text.matchAll(WORD)];
        const first = words[words.length - count];
        if (!first) return {from: 0, to: text.length};

        return {from: Math.max(0, first.index - 1), to: text.length};
    }

    /**
     * @function split
     * @description Take a passage apart into the items a gesture moves about.
     *
     * The items are words when the passage has a space in it, and the letters of a single word when it does
     * not: a tool asked to turn one word has to have something to turn. The spacing is kept aside rather than
     * carried with the items, so that reordering them leaves it where it was.
     * @param {string} text - The passage to take apart.
     */
    public split(text: string): TextTokens {
        const unit = /\s/.test(text) ? "word" : "char";
        const parts = unit === "word" ? text.split(/(\s+)/) : [...text];

        return {
            unit,
            tokens: unit === "word" ? parts.filter((_, index) => index % 2 === 0) : parts,
            gaps: unit === "word" ? parts.filter((_, index) => index % 2 === 1) : []
        };
    }

    /**
     * @function join
     * @description Put items back together with the spacing they were taken apart with, which stays where it
     * was however the items move.
     * @param {string[]} tokens - The items, in the order they should read.
     * @param {string[]} gaps - What separates them: `gaps[i]` goes between `tokens[i]` and `tokens[i + 1]`.
     */
    public join(tokens: string[], gaps: string[] = []): string {
        return tokens.reduce((text, token, index) =>
            index ? text + (gaps[index - 1] ?? "") + token : token, "");
    }
}
