import {GradumSelector} from "../gradumSelector";
import {GradumElementProperties} from "../../gradumElement/gradumElement.types";

type ElementData = {
    feedforwardElements: Map<string, object>,
    defaultFeedforwardProperties: GradumElementProperties
};

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