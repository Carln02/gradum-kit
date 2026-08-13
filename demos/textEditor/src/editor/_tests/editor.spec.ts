import {describe, it, expect} from "vitest";
import {gradum} from "../../../../../build/gradum-kit.esm";
import {TextEditor} from "../editor";

describe("the editor mounts", () => {
    it("creates a TipTap instance inside the element", () => {
        const editor = TextEditor.create({parent: document.body}) as TextEditor;
        expect(editor.editor).toBeDefined();
        //TipTap builds its editable region as a child of the host.
        expect(editor.querySelector(".tiptap")).not.toBeNull();
        expect(editor.editor.getHTML()).toContain("Type something.");
    });

    it("is reachable through gradum like any other element", () => {
        const editor = TextEditor.create({parent: document.body}) as TextEditor;
        expect(gradum(editor).element).toBe(editor);
    });

    it("runs commands and reports what is active", () => {
        const editor = TextEditor.create({parent: document.body}) as TextEditor;
        expect(editor.isActive("bold")).toBe(false);

        editor.editor.commands.selectAll();
        editor.run("toggleBold");
        expect(editor.isActive("bold")).toBe(true);
    });

    it("releases TipTap on destroy", () => {
        const editor = TextEditor.create({parent: document.body}) as TextEditor;
        editor.destroy();
        expect(editor.editor).toBeUndefined();
    });
});
