import {dataSignal, GradumModel} from "../../../../build/gradum-kit.esm";

export class CheckItemModel extends GradumModel {
    @dataSignal() text: string = "";
    @dataSignal() checked: boolean = false;
}
