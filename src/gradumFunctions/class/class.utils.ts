import {GradumSelector} from "../gradumSelector";

/**
 * @internal
 * @class ClassFunctionsUtils
 * @description Shared helpers behind the CSS-class functions on {@link GradumSelector}.
 */
export class ClassFunctionsUtils {
    /**
     * @function operateOnClasses
     * @description Run a callback once per CSS class, accepting either a space-separated string or an array
     * so every class function can take both forms.
     * @param {GradumSelector} selector - The selector whose element the classes belong to.
     * @param {string | string[]} [classes] - Classes separated by spaces, or an array of class names.
     * @param {(classEntry: string) => void} [callback] - Called once per class name.
     * @returns {GradumSelector} The given selector, allowing for method chaining.
     */
    public operateOnClasses(selector: GradumSelector, classes?: string | string[],
                              callback: (classEntry: string) => void = (() => {})): GradumSelector {
        if (!selector || !classes || !selector.element) return selector;

        try {
            // If string provided --> split by spaces
            if (typeof classes === "string") classes = classes.split(" ");
            classes.filter(entry => entry.trim().length > 0)
                .forEach(entry => callback(entry));
        } catch (e) {
            console.error(e);
        }

        return selector;
    }
}