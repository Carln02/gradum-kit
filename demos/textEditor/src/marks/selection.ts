import {Mark} from "@tiptap/core";

const selection = (name: string) => Mark.create({
    name,
    group: Selection,
    inclusive: false,
    renderHTML: () => ["span", {"data-selection": name}, 0]
});

export const Selection = "selection";

export const RotateSelection = selection("rotating");
export const ResizeSelection = selection("resizing");