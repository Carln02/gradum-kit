import {define, signal, gradum, DefaultEventName, GradumButton, effect, input, element, GradumRichElementProperties} from "../../../../../build/gradum-kit.esm";
import {BucketTool} from "./bucket.tool";

//Custom element for the bucket tool
@define("demo-bucket")
export class Bucket extends GradumButton {
    @signal private _color: string = "#000000"; //Signal to fire @effect callbacks when the value changes

    private colorInput: HTMLInputElement;
    public static defaultProperties = {tools: BucketTool};

    public get color(): string {
        return this._color.toString();
    }

    //Function that sets up sub-elements. Called on creation.
    protected setupUIElements() {
        super.setupUIElements();
        this.colorInput = input({type: "color", style: "visibility: hidden; position: absolute"});
    }

    //Function that adds the sub-elements to the document. Called on creation.
    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild(this.colorInput);
    }

    //Function that sets up event listeners. Called on creation.
    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this).on(DefaultEventName.click, () => this.colorInput.click());
        gradum(this.colorInput).on(DefaultEventName.input, () => {this._color = this.colorInput.value});
    }

    @effect private updateBorderColor() {
        gradum(this).setStyle("borderColor", this._color);
    }
}