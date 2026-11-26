import {expose, define, GradumElement, Delegate} from "../../../../build/gradum-kit.esm";
import {CheckItemView} from "./checkItem.view";
import {CheckItemModel} from "./checkItem.model";
import "./checkItem.css";

export class CheckItem extends GradumElement<CheckItemView, any, CheckItemModel> {
    public static defaultProperties: any = {
        view: CheckItemView,
        model: CheckItemModel
    };

    @expose("model") public text: string;
    @expose("model") public checked: boolean;

    public readonly onDelete: Delegate<() => void> = new Delegate();

    public focusText() {
        this.view.textElement.focus();
    }
}

define(CheckItem, "my-check-item");