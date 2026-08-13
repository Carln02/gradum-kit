import {Editor} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {define, GradumElement, gradum} from "../../../../build/gradum-kit.esm";
import "./editor.css";

export class TextEditor extends GradumElement {
    public editor: Editor;

    protected setupUIElements() {
        super.setupUIElements();
        this.editor = new Editor({
            element: this,
            extensions: [StarterKit],
            content: "<p>Type something.</p>",
        });
    }

    /**
     * @description Whether a mark or node is active at the cursor, for a toolbar button to reflect.
     */
    public isActive(name: string, attributes?: Record<string, any>): boolean {
        return this.editor?.isActive(name, attributes) ?? false;
    }

    /**
     * @description Run a TipTap command by name, then hand focus back to the text.
     * @example
     * ```ts
     * editor.run("toggleBold");
     * editor.run("toggleHeading", {level: 2});
     * ```
     */
    public run(command: string, ...args: any[]): this {
        const chain: any = this.editor?.chain().focus();
        chain?.[command]?.(...args).run();
        return this;
    }

    /**
     * @description Tear the editor down. `destroy` is the cleanup hook `gradum(el).destroy()` calls, and
     * TipTap holds document-level listeners, so this is where they get released.
     * @returns {this} Itself, allowing for method chaining.
     */
    public destroy(): this {
        this.editor?.destroy();
        this.editor = undefined;
        return this;
    }
}

define(TextEditor, "demo-text-editor");
