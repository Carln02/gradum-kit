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
    public content: HTMLElement;

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

    protected setupUIElements() {
        super.setupUIElements();
        this.content = div();
    }

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