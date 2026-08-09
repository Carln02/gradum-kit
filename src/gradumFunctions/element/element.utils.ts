import {GradumSelector} from "../gradumSelector";
import {GradumElementProperties} from "../../gradumElement/gradumElement.types";

/**
 * @internal
 * @type {ElementData}
 * @description The feedforward state held against one element: the descendants it seeds with shared
 * defaults, and the defaults themselves. Distinct from the `ElementData` types in the constrainer and tool
 * utils, which track unrelated state on the same elements.
 * @property {Map<string, object>} feedforwardElements - Descendants receiving fed-forward properties, by key.
 * @property {GradumElementProperties} defaultFeedforwardProperties - The properties passed down by default.
 */
type ElementData = {
    feedforwardElements: Map<string, object>,
    defaultFeedforwardProperties: GradumElementProperties
};

/**
 * @internal
 * @class ElementFunctionsUtils
 * @description Shared helpers and per-element state behind the element functions on {@link GradumSelector}.
 */
export class ElementFunctionsUtils {
    private dataMap = new WeakMap<Node, ElementData>;

    public data(element: Node): ElementData {
        if (element instanceof GradumSelector) element = element.element;
        if (!element || !this.dataMap.has(element)) {
            const entry = {
                feedforwardElements: new Map(),
                defaultFeedforwardProperties: {}
            };
            if (element) this.dataMap.set(element, entry);
        }
        return this.dataMap.get(element);
    }
}