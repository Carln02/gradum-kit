import {gradum} from "../../../gradumFunctions/gradumFunctions";

/**
 * @internal
 * @function defineUIPrototype
 * @template {new (...args: any[]) => any} Type - The class being set up.
 * @description Install the UI surface on a class prototype — `shadowDOM`, `defaultClasses`, and
 * `unsetDefaultClasses` — backed by private symbols so the values do not collide with user fields.
 * Called once per element class at definition time.
 * @param {Type} constructor - The class whose prototype receives the accessors.
 */
export function defineUIPrototype<Type extends new (...args: any[]) => any>(constructor: Type) {
    const prototype = constructor.prototype as any;
    const shadowDOMKey = Symbol("__shadow_dom__");
    const unsetDefaultClassesKey = Symbol("__unset_default_classes__");
    const defaultClassesKey = Symbol("__default_classes__");

    Object.defineProperty(prototype, "shadowDOM", {
        get: function (): boolean {return this[shadowDOMKey] ?? false;},
        set: function (value: boolean) {
            this[shadowDOMKey] = value;
            const el = this.element;
            if (value && !el.shadowRoot) try {el.attachShadow({ mode: "open" });} catch {}
            if (el.shadowRoot) {
                const from = value ? el : el.shadowRoot;
                const to = value ? el.shadowRoot : el;
                while (from.childNodes.length > 0) to.appendChild(from.childNodes[0]);
            }
        },
        enumerable: true,
        configurable: true,
    });

    Object.defineProperty(prototype, "unsetDefaultClasses", {
        get: function (): boolean {return this[unsetDefaultClassesKey] ?? false;},
        set: function (value: boolean) {
            this[unsetDefaultClassesKey] = value;
            gradum(this).toggleClass(this.defaultClasses, !value);
        },
        enumerable: true,
        configurable: true,
    });

    Object.defineProperty(prototype, "defaultClasses", {
        get: function (): string | string[] {return this[defaultClassesKey] ?? "";},
        set: function (value: string | string[]) {
            if (!this.unsetDefaultClasses) gradum(this).toggleClass(this[defaultClassesKey], false);
            this[defaultClassesKey] = value;
            if (!this.unsetDefaultClasses) gradum(this).toggleClass(value, true);
        },
        enumerable: true,
        configurable: true,
    });
}