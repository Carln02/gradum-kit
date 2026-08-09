/**
 * @internal
 * @type {GradumElementUiInterface}
 * @description The UI members every element class gains from `defineUIPrototype`. Declared separately so
 * the element classes can merge it in, since the members are installed on the prototype at runtime rather
 * than declared on the class.
 */
interface GradumElementUiInterface {
    /**
     * @description Whether to set the default CSS classes defined in the static config on the element or not. Setting
     * it will accordingly add/remove the CSS classes from the element.
     */
    unsetDefaultClasses: boolean;

    /**
     * @description Whether the element renders its children into a shadow root. Assigning `true` attaches
     * one if the element does not already have it.
     */
    shadowDOM: boolean;

    /**
     * @description The CSS classes applied to every instance of this element class. Assigning a new value
     * swaps the previous classes out for the new ones, unless `unsetDefaultClasses` is set.
     */
    defaultClasses: string | string[];
}

export {GradumElementUiInterface};