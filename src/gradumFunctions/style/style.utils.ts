import {GradumSelector} from "../gradumSelector";

/**
 * @internal
 * @class StyleFunctionsUtils
 * @description Shared helpers and per-element state behind the style functions on {@link GradumSelector}.
 */
export class StyleFunctionsUtils {
    private dataMap = new WeakMap<Node, Record<string, any>>;

    public data(element: Node) {
        if (element instanceof GradumSelector) element = element.element;
        if (!element) return {};
        if (!this.dataMap.has(element)) this.dataMap.set(element, {});
        return this.dataMap.get(element);
    }

    public setStyle(selector: GradumSelector<HTMLElement | SVGElement>, attribute: keyof CSSStyleDeclaration,
                      value: string | number, instant: boolean = false, apply: boolean = true): void {
        if (instant) {
            (selector.element.style as any)[attribute] = value.toString();
            return;
        }

        let pendingStyles = this.data(selector.element)["pendingStyles"];
        if (!pendingStyles || typeof pendingStyles !== "object") {
            pendingStyles = {};
            this.data(selector.element)["pendingStyles"] = pendingStyles;
        }

        pendingStyles[attribute] = value;
        if (apply) this.applyStyles(selector);
        return;
    }

    /**
     * @description Apply the pending styles to the element.
     */
    public applyStyles(selector: GradumSelector<HTMLElement | SVGElement>): void {
        const pendingStyles = this.data(selector.element)["pendingStyles"];
        if (!pendingStyles || typeof pendingStyles !== "object") return;
        requestAnimationFrame(() => {
            for (const property in pendingStyles) {
                if (property == "cssText") selector.element.style.cssText += ";" + pendingStyles["cssText"];
                else selector.element.style[property] = pendingStyles[property];
            }
            this.data(selector.element)["pendingStyles"] = {};
        });
    }
}