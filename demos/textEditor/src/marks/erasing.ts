import {Mark} from "@tiptap/core";

export const Erasing = Mark.create({
    name: "erasing",
    inclusive: false,
    parseHTML: () => [{tag: "span[data-erasing]"}],
    renderHTML: () =>  ["span", {"data-erasing": "true"}, 0]
});
