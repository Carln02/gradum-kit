import {GradumSelector} from "../gradumSelector";

/**
 * @internal
 * @class HierarchyFunctionsUtils
 * @description Shared helpers and per-element state behind the DOM hierarchy functions on {@link GradumSelector}.
 */
export class HierarchyFunctionsUtils {
    private dataMap = new WeakMap<Node, Record<string, any>>;

    public data(element: Node) {
        if (element instanceof GradumSelector) element = element.element;
        if (!element) return {};
        if (!this.dataMap.has(element)) this.dataMap.set(element, {});
        return this.dataMap.get(element);
    }
}