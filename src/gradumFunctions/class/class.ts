import "./class.types";
import {GradumSelector} from "../gradumSelector";
import {ClassFunctionsUtils} from "./class.utils";

const utils = new ClassFunctionsUtils();

/**
 * @internal
 * @function setupClassFunctions
 * @description Install the CSS-class functions (`addClass`, `removeClass`, `toggleClass`, `hasClass`) onto the
 * {@link GradumSelector} prototype. Called once by
 * {@link gradumify}; the matching `exclude` option skips it.
 */
export function setupClassFunctions() {
    /**
     * @description Add one or more CSS classes to the element.
     * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.addClass = function _addClass(this: GradumSelector, classes?: string | string[]): GradumSelector {
        if (!(this.element instanceof Element)) return this;
        return utils.operateOnClasses(this, classes, entry => (this.element as Element).classList.add(entry));
    };

    /**
     * @description Remove one or more CSS classes from the element.
     * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.removeClass = function _removeClass(this: GradumSelector, classes?: string | string[]): GradumSelector {
        if (!(this.element instanceof Element)) return this;
        return utils.operateOnClasses(this, classes, entry => (this.element as Element).classList.remove(entry));
    };

    /**
     * @description Toggle one or more CSS classes in the element.
     * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
     * @param {boolean} force - (Optional) Boolean that turns the toggle into a one way-only operation. If set to false,
     * then the class will only be removed, but not added. If set to true, then token will only be added, but not removed.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.toggleClass = function _toggleClass
    (this: GradumSelector, classes?: string | string[], force?: boolean): GradumSelector {
        if (!(this.element instanceof Element)) return this;
        return utils.operateOnClasses(this, classes, entry => (this.element as Element).classList.toggle(entry, force));
    };

    /**
     * @description Check if the element's class list contains the provided class(es).
     * @param {string | string[]} [classes] - String of classes separated by spaces, or array of strings.
     * @returns {boolean} Whether the element carries every one of the given classes.
     */
    GradumSelector.prototype.hasClass = function _hasClass(this: GradumSelector, classes?: string | string[]): boolean {
        if (!classes || !(this.element instanceof Element)) return false;

        if (typeof classes === "string") return this.element.classList.contains(classes);
        for (let entry of classes) {
            if (!this.element.classList.contains(entry)) return false;
        }
        return true;
    }
}