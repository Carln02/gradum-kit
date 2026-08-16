import {Mark} from "@tiptap/core";

export const Growing = Mark.create({
    name: "growing",
    inclusive: false,
    renderHTML: () => ["span", {"data-growing": "true"}, 0]
});