import {define, signal, gradum, DefaultEventName, GradumButton, effect, input, Color} from "../../../../../build/gradum-kit.esm";
import {BucketTool} from "./bucket.tool";

//Custom element for the bucket tool
export class Bucket extends GradumButton {
    @signal private _color: Color = new Color(); //Signal to fire @effect callbacks when the value changes

    private colorInput: HTMLInputElement;

    public static defaultProperties = {
        tools: BucketTool
    };

    public get color(): Color {
        return this._color;
    }

    //Function that sets up sub-elements. Called on creation.
    protected setupUIElements() {
        super.setupUIElements();
        this.colorInput = input({type: "color", hidden: true});
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
        gradum(this.colorInput).on(DefaultEventName.input, () => {this._color = Color.from(this.colorInput.value)});
    }

    @effect private updateBorderColor() {
        gradum(this).setStyle("borderColor", this._color.toString());
    }
}
define(BucketTool, "demo-bucket");