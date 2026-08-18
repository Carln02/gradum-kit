import {Mark as TipTapMark} from "@tiptap/core";
import {Mark} from "../mark/mark";
import "./growingMark.css";

/**
 * @class GrowingMark
 * @description Text a stretch has just added, held apart from the rest until the drag lets go of it.
 */
export class GrowingMark extends Mark {
    public static markName: string = "growing";

    public static definition() {
        return TipTapMark.create({
            name: this.markName,
            inclusive: false,
            renderHTML: () => ["span", {"data-growing": "true"}, 0]
        });
    }
}
