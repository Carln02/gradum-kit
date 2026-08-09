import {GradumIcon} from "../icon/icon";
import {GradumRichElementProperties} from "./richElement.types";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {define} from "../../../decorators/define/define";
import {GradumElement} from "../../../gradumElement/gradumElement";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {auto} from "../../../decorators/auto/auto";
import {element} from "../../../elementCreation/element";
import {GradumProperties} from "../../../gradumFunctions/element/element.types";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {ValidElement, ValidTag} from "../../../types/element.types";
import {signal} from "../../../decorators/reactivity/reactivity";

/**
 * @class GradumRichElement
 * @group Components
 * @category Basics
 *
 * @extends GradumElement
 * @template {ValidTag} ElementTag - The tag of the main element to create the rich element from.
 * @description Class for creating a rich gradum element (an element that is possibly accompanied by icons (or other elements) on
 * its left and/or right).
 */
class GradumRichElement<
    ElementTag extends ValidTag = any,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
     public declare readonly properties: GradumRichElementProperties;
    /**
     * @static
     * @description Default properties assigned to a new rich element.
     */
    public static defaultProperties: GradumRichElementProperties = {
        elementTag: "h4"
    };

    /**
     * @function customCreate
     * @static
     * @protected
     * @description Build a rich element, resolving `text` and `elementTag` into the configuration of its inner
     * element before construction.
     * @param {GradumRichElementProperties} properties - The element's configuration.
     * @returns {object} The created rich element.
     */
    protected static customCreate(properties: GradumRichElementProperties): object {
        if (properties.text && !properties.element) {
            properties.element = properties.text;
            properties.text = undefined;
        }
        if (properties.elementTag && typeof properties.element === "object" && !(properties.element instanceof Element)) {
            properties.element.tag = properties.elementTag;
        }
        return super.customCreate(properties);
    }

    /**
     * @readonly
     * @description The order the rich element's parts are laid out in, from left to right. Assigning a part
     * inserts it at its place in this order rather than at the end.
     */
    public readonly childrenOrder = ["leftCustomElements", "leftIcon",
        "prefixEntry", "element", "suffixEntry", "rightIcon", "rightCustomElements"] as const;

    /**
     * @description Add one or more elements to this rich element at the given position.
     * @param {Element | Element[] | null} element - The element(s) to add.
     * @param {this["childrenOrder"][number]} type - The type of child element being added.
     */
    private addAtPosition(element?: Element | Element[], type?: this["childrenOrder"][number]) {
        if (!element || !type) return;
        let nextSiblingIndex = 0;
        for (let i = 0; i < this.childrenOrder.length; i++) {
            const key = this.childrenOrder[i];
            if (key === type) break;
            const el = this[key];
            if (el && el instanceof Element) nextSiblingIndex++;
            else if (el && Array.isArray(el)) nextSiblingIndex += el.length;
        }
        gradum(this).addChild(element, nextSiblingIndex);
    }

    /**
     * @description The tag used for this rich element's text element
     */
    public elementTag: ElementTag;

    /**
     * @description The custom element(s) on the left. Can be set to new element(s) by a simple assignment.
     */
    @auto({executeSetterBeforeStoring: true})
    public set leftCustomElements(value: Element | Element[]) {
        gradum(this).remChild(this.leftCustomElements);
        this.addAtPosition(value, "leftCustomElements");
    }

    /**
     * @description The left icon element. Can be set with a new icon by a simple assignment (the name/path of the
     * icon, or a Gradum/HTML element).
     */
    @auto({
        preprocessValue: function (value: string | GradumIcon) {
            if (typeof value == "string") {
                if (this.leftIcon) {
                    this.leftIcon.icon = value;
                    return this.leftIcon;
                }
                value = GradumIcon.create({icon: value});
            }
            gradum(this).remChild(this.leftIcon);
            this.addAtPosition(value, "leftIcon");
            return value;
        }
    })
    public set leftIcon(value: string | GradumIcon) {}

    public get leftIcon(): GradumIcon {return}

    /**
     * @description The element shown before the text. Assigning a string sets its text content; assigning
     * an element replaces it outright.
     */
    @auto({
        preprocessValue: function (value: string | HTMLElement) {
            if (typeof value == "string") {
                if (this.prefixEntry) {
                    this.prefixEntry.textContent = value;
                    return this.prefixEntry;
                }
                value = element({text: value}) as HTMLElement;
            }
            gradum(this).remChild(this.prefixEntry);
            this.addAtPosition(value as HTMLElement, "prefixEntry");
            return value;
        }
    })
    public set prefixEntry(value: string | HTMLElement) {}

    public get prefixEntry(): HTMLElement {return}

    /**
     * @description The text element. Can be set to a new element by a simple assignment. Setting the value to a new
     * string will update the text's textContent with the given string.
     */
    @signal @auto({
        preprocessValue: function (value: string | GradumProperties<ElementTag> | ValidElement<ElementTag>) {
            if (typeof value === "string") {
                if (this.element && "textContent" in this.element) {
                    this.element.textContent = value;
                    return this.element;
                }
                value = element({tag: this.elementTag, text: value} as GradumProperties<ElementTag>);
            } else if (typeof value === "object" && !(value instanceof Element)) {
                if (!value.tag) value.tag = this.elementTag;
                value = element(value);
            }
            gradum(this).remChild(this.element);
            this.addAtPosition(value, "element");
            return value;
        }
    })
    public set element(value: string | GradumProperties<ElementTag> | ValidElement<ElementTag>) {}

    public get element(): ValidElement<ElementTag> {return}

    /**
     * @description The text element. Can be set to a new element by a simple assignment. Setting the value to a new
     * string will update the text's textContent with the given string.
     */
    public get text(): string {
        const element = this.element;
        if (!element) return "";
        return element.textContent;
    }

    public set text(value: string) {
        if (!value) value = "";
        this.element = value;
    }

    /**
     * @description The element shown after the text. Assigning a string sets its text content; assigning
     * an element replaces it outright.
     */
    @auto({
        preprocessValue: function (value: string | HTMLElement) {
            if (typeof value == "string") {
                if (this.suffixEntry) {
                    this.suffixEntry.textContent = value;
                    return this.suffixEntry;
                }
                value = element({text: value}) as HTMLElement;
            }
            gradum(this).remChild(this.suffixEntry);
            this.addAtPosition(value, "suffixEntry");
            return value;
        }
    })
    public set suffixEntry(value: string | HTMLElement) {}

    public get suffixEntry(): HTMLElement {return}

    /**
     * @description The right icon element. Can be set with a new icon by a simple assignment (the name/path of the
     * icon, or a Gradum/HTML element).
     */
    @auto({
        preprocessValue: function (value: string | GradumIcon) {
            if (typeof value == "string") {
                if (this.rightIcon) {
                    this.rightIcon.icon = value;
                    return this.rightIcon;
                }
                value = GradumIcon.create({icon: value});
            }
            gradum(this).remChild(this.rightIcon);
            this.addAtPosition(value, "rightIcon");
            return value;
        }
    })
    public set rightIcon(value: string | GradumIcon) {}

    public get rightIcon(): GradumIcon {return}

    /**
     * @description The custom element(s) on the right. Can be set to new element(s) by a simple assignment.
     */
    @auto({executeSetterBeforeStoring: true})
    public set rightCustomElements(value: Element | Element[]) {
        gradum(this).remChild(this.rightCustomElements);
        this.addAtPosition(value, "rightCustomElements");
    }
}

define(GradumRichElement);
export {GradumRichElement};