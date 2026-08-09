import {ValidElement, ValidTag} from "../../../types/element.types";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumRichElement} from "../richElement/richElement";
import {define} from "../../../decorators/define/define";
import {effect, signal} from "../../../decorators/reactivity/reactivity";
import {randomId} from "../../../utils/computations/random";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {GradumProperties} from "../../../gradumFunctions/element/element.types";
import {div} from "../../../elementCreation/basicElements";
import {GradumLabelElementProperties} from "./labelElement.types";
import {element} from "../../../elementCreation/element";

/**
 * @class GradumLabelElement
 * @group Components
 * @category Basics
 *
 * @extends GradumRichElement
 * @template {ValidTag} ElementTag - The tag of the main element in the rich element.
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description A rich element with an HTML `<label>` attached to it. Setting {@link GradumLabelElement.label}
 * to a non-empty string creates the label and puts it before the content; setting it to an empty value
 * removes it again.
 */
class GradumLabelElement<
    ElementTag extends ValidTag = any,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumRichElement<ElementTag, ViewType, DataType, ModelType, EmitterType> {
    public declare readonly properties: GradumLabelElementProperties<ElementTag, ViewType, DataType, ModelType, EmitterType>;

    @signal public defaultId: string = "gradum-id-" + randomId();

    @signal protected labelElement: HTMLLabelElement;
    /**
     * @description The wrapper holding everything except the label. It becomes the element's child handler, so
     * children added later land inside it rather than beside the label.
     */
    public content: HTMLElement;

    /**
     * @description The label's text. Assigning a non-empty string creates the `<label>` and places it before
     * the content; assigning an empty value removes it. The label is linked to the inner element's `id`, so
     * clicking it focuses that element.
     */
    public set label(value: string) {
        if (!value || value.length === 0) {
            if (this.labelElement) this.labelElement.remove();
            return;
        }

        if (!this.labelElement) {
            this.labelElement = element({tag: "label"});
            gradum(this).childHandler = this;
            gradum(this).addChild(this.labelElement, 0);
            if (this.content) gradum(this).childHandler = this.content;
        }

        this.labelElement.textContent = value;
    }

    public get label(): string {
        return this.labelElement?.textContent;
    }

    @signal public get element(): ValidElement<ElementTag> {
        return super.element;
    }

    public set element(value: GradumProperties<ElementTag> | ValidElement<ElementTag>) {
        super.element = value;
        if (this.element) {
            if (!this.element.id) this.element.id = this.defaultId;
            else if (this.labelElement) this.labelElement.htmlFor = this.element.id;
        }
    }

    /**
     * @inheritDoc
     */
    protected setupUIElements() {
        super.setupUIElements();
        this.content = div();
    }

    /**
     * @inheritDoc
     */
    protected setupUILayout() {
        super.setupUILayout();
        gradum(this.content).addChild(gradum(this).childrenArray);
        gradum(this).addChild([this.labelElement, this.content]);
        gradum(this).childHandler = this.content;
    }

    @effect private updateId() {
        if (this.element && !this.element.id) this.element.id = this.defaultId;
        if (this.labelElement) this.labelElement.htmlFor = this.element?.id ?? this.defaultId;
    }
}

define(GradumLabelElement);
export {GradumLabelElement};