import {effect, gradum, GradumOperator, signal} from "../../../../build/gradum-kit.esm";
import {SideButton} from "../sideButton/sideButton";

export class SquareLockOperator extends GradumOperator {
    @signal public locked: boolean = false;

    protected lockButton: SideButton;

    protected setupUIElements() {
        super.setupUIElements();
        this.lockButton = SideButton.create({leftIcon: "unlock", classes: "lock-button"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild(this.lockButton);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this.lockButton).on("click", () => this.emitter.fire("toggleLock"));
    }

    protected setupChangedCallbacks() {
        super.setupChangedCallbacks();
        this.emitter.add("lock", () => this.locked = true);
        this.emitter.add("unlock", () => this.locked = false);
        this.emitter.add("toggleLock", () => this.locked = !this.locked);
    }

    @effect protected updateLock() {
        gradum(this.element).ignoreAllTools(this.locked).toggleClass("locked", this.locked);
        this.emitter.fire("lockChanged", this.locked);
    }

    @effect protected updateLockIcon() {
        this.lockButton.leftIcon = this.locked ? "lock" : "unlock";
    }
}
