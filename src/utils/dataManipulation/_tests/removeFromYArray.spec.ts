import {describe, it, expect} from "vitest";
import * as Y from "yjs";
import {removeFromYArray} from "../yjs";

describe("removeFromYArray", () => {
    function makeArray<Type>(items: Type[]) {
        const doc = new Y.Doc();
        const arr = doc.getArray<Type>("list");
        arr.push(items);
        return {doc, arr};
    }

    // The original destructured each element as [index, value], so any array of
    // objects — the normal case for a YArray — threw "is not iterable".
    it("removes an object entry without throwing", () => {
        const a = {id: "a"}, b = {id: "b"}, c = {id: "c"};
        const {arr} = makeArray([a, b, c]);

        expect(removeFromYArray(b, arr)).toBe(true);
        expect(arr.toArray()).toEqual([a, c]);
    });

    it("removes only the first occurrence", () => {
        const dup = {id: "dup"};
        const other = {id: "other"};
        const {arr} = makeArray([dup, other, dup]);

        expect(removeFromYArray(dup, arr)).toBe(true);
        expect(arr.length).toBe(2);
        expect(arr.toArray()).toEqual([other, dup]);
    });

    it("returns false and leaves the array alone when the entry is absent", () => {
        const {arr} = makeArray([{id: "a"}]);

        expect(removeFromYArray({id: "nope"}, arr)).toBe(false);
        expect(arr.length).toBe(1);
    });

    // Matching is by identity, so an equal-but-distinct copy is not a match.
    it("does not match an equal copy", () => {
        const {arr} = makeArray([{id: "a"}]);

        expect(removeFromYArray({id: "a"}, arr)).toBe(false);
        expect(arr.length).toBe(1);
    });

    it("works on primitive entries too", () => {
        const {arr} = makeArray(["x", "y", "z"]);

        expect(removeFromYArray("y", arr)).toBe(true);
        expect(arr.toArray()).toEqual(["x", "z"]);
    });

    it("handles an empty array", () => {
        const {arr} = makeArray<string>([]);
        expect(removeFromYArray("anything", arr)).toBe(false);
    });
});
