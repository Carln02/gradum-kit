import {style} from "./basicElements";
import {StylesRoot} from "../gradumFunctions/style/style.types";
import {$} from "../gradumFunctions/gradumFunctions";

/**
 * @function stylesheet
 * @group Element Creation
 * @category Creation Functions
 *
 * @description Add a CSS string to the document as a new `<style>` element. Pass a shadow root to
 * scope the styles to one component instead of the whole page. Does nothing if `styles` is empty.
 * @param {string} [styles] - The CSS to add. Use the {@link css} literal function for autocompletion.
 * @param {StylesRoot} [root=document.head] - The shadow root or document head to add the element to.
 */
function stylesheet(styles?: string, root: StylesRoot = document.head) {
    if (!styles) return;
    const stylesheet = style({innerHTML: styles});
    $(root).addChild(stylesheet);
}

export {stylesheet};