import {StylesType} from "./style.types";
import {GradumSelector} from "../gradumSelector";
import {StyleFunctionsUtils} from "./style.utils";
import {PartialRecord} from "../../types/basic.types";
import {gradum} from "../gradumFunctions";
import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";

const utils = new StyleFunctionsUtils();

const selectedKey = Symbol("__selected__");
const selectedClass = Symbol("__selectedClass__");
const defaultSelectedClassesKey = Symbol("__default_selected_classes__");

/**
 * @internal
 * @function setupStyleFunctions
 * @description Install the style functions (`setStyle`, `setStyles`, `selected`, `closestRoot`, ...) onto the
 * {@link GradumSelector} prototype. Called once by
 * {@link gradumify}; the matching `exclude` option skips it.
 */
export function setupStyleFunctions() {
    /**
     * @description The closest root to the element in the document (the closest ShadowRoot, or the document's head).
     */
    Object.defineProperty(GradumSelector.prototype, "closestRoot", {
        get: function () {
            let node = this.element;
            while (node) {
                if (node instanceof Element && node.shadowRoot) return node.shadowRoot;
                node = node.parentElement;
            }

            return document.head;
        },
        configurable: false,
        enumerable: true
    });

    Object.defineProperty(GradumSelector.prototype, "selected", {
        get(this: any) {
            return !!this[selectedKey]
        },
        set(this: GradumSelector<object>, value: boolean) {
            const element = this.element;
            if (!element) return;

            if (element instanceof Element) {
                const prevClass = element[selectedClass];
                const nextClass = this["defaultSelectedClasses"] || "selected";
                element[selectedClass] = nextClass;
                if (prevClass && prevClass !== nextClass) gradum(element).toggleClass(prevClass, false);
                gradum(element).toggleClass(nextClass, !!value);
            }

            element[selectedKey] = value;
            this.onSelected.fire(value);
        },
        enumerable: true,
        configurable: true,
    });

    Object.defineProperty(GradumSelector.prototype, "defaultSelectedClasses", {
        get: function (): string | string[] {
            return this[defaultSelectedClassesKey] ?? "";
        },
        set: function (value: string | string[]) {
            if (this.selected) gradum(this).toggleClass(this[defaultSelectedClassesKey], false);
            this[defaultSelectedClassesKey] = value;
            if (this.selected) gradum(this).toggleClass(value, true);
        },
        enumerable: true,
        configurable: true,
    });

    Object.defineProperty(GradumSelector.prototype, "onSelected", {
        get: function (): Delegate<(value: boolean) => void> {
            const data = utils.data(this);
            if (!data["onSelected"]) data["onSelected"] = new Delegate();
            return data["onSelected"];
        },
        enumerable: true,
        configurable: true,
    });

    /**
     * @description Set a certain style attribute of the element to the provided value.
     * @param {keyof CSSStyleDeclaration} attribute - A string representing the style attribute to set.
     * @param {string | number} value - A string representing the value to set the attribute to.
     * @param {boolean} [instant=false] - If true, will set the fields directly. Otherwise, will set them on next
     * animation frame.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.setStyle = function _setStyle(this: GradumSelector, attribute: keyof CSSStyleDeclaration,
                                                          value: string | number, instant: boolean = false): GradumSelector {
        if (!attribute || value == undefined) return this;
        if (!(this.element instanceof HTMLElement) && !(this.element instanceof SVGElement)) return this;
        utils.setStyle(this as GradumSelector<HTMLElement | SVGElement>, attribute, value, instant);
        return this;
    };

    /**
     * @description Set a certain style attribute of the element to the provided value.
     * @param {keyof CSSStyleDeclaration} attribute - A string representing the style attribute to set.
     * @param {string} value - A string representing the value to set the attribute to.
     * @param {string} [separator=", "] - The separator to use between the existing and new value.
     * @param {boolean} [instant=false] - If true, will set the fields directly. Otherwise, will set them on next
     * animation frame.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.appendStyle = function _appendStyle(this: GradumSelector, attribute: keyof CSSStyleDeclaration,
                                                                value: string, separator: string = ", ", instant: boolean = false): GradumSelector {
        if (!attribute || value == undefined) return this;
        if (!(this.element instanceof HTMLElement) && !(this.element instanceof SVGElement)) return this;
        const currentStyle = (this.element.style[attribute] || "") as string;
        separator = currentStyle.length > 0 ? separator : "";
        utils.setStyle(this as GradumSelector<HTMLElement | SVGElement>, attribute, currentStyle + separator + value, instant);
        return this;
    };

    /**
     * @description Parses and applies the given CSS to the element's inline styles.
     * @param {StylesType} styles - A CSS string of style attributes and their values, seperated by semicolons,
     * or an object of CSS properties. Use the css literal function for autocompletion.
     * @param {boolean} [instant=false] - If true, will set the fields directly. Otherwise, will set them on next
     * animation frame.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.setStyles = function _setStyles(this: GradumSelector, styles: StylesType, instant: boolean = false): GradumSelector {
        if (!styles || typeof styles == "number") return this;
        if (!(this.element instanceof HTMLElement) && !(this.element instanceof SVGElement)) return this;

        let stylesObject: PartialRecord<keyof CSSStyleDeclaration, string | number> = {};
        if (typeof styles === "object") stylesObject = styles;
        else if (typeof styles == "string") {
            styles.split(";").forEach(entry => {
                const [property, value] = entry.split(":").map(part => part.trim());
                if (!property || !value) return;
                stylesObject[property] = value;
            });
        }

        Object.entries(stylesObject).forEach(([key, value]) =>
            utils.setStyle(this as GradumSelector<HTMLElement | SVGElement>, key as keyof CSSStyleDeclaration, value, instant, false));
        if (!instant) utils.applyStyles(this as GradumSelector<HTMLElement | SVGElement>);
        return this;
    };
}