import {GradumOperator, gradum} from "../../../../build/gradum-kit.esm";

export class CanvasWillChangeOperator extends GradumOperator<Element> {
    private willChangeTimeout: NodeJS.Timeout = null;

    public target: Element = this.element;

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        this.emitter.add("willChange", () => this.fireWillChangeTimeout());
    }

    protected fireWillChangeTimeout() {
        if (this.willChangeTimeout) clearTimeout(this.willChangeTimeout);
        this.willChangeTimeout = setTimeout(() => {
            gradum(this.target).setStyle("willChange", "");
            requestAnimationFrame(() => gradum(this.target).setStyle("willChange", "transform"));
        }, 200);
    }
}