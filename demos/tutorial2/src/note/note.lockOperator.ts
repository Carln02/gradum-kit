import {gradum} from "../../../../build/gradum-kit.esm";
import {SquareLockOperator} from "../square/square.lockOperator";

/**
 * SquareLockOperator that also locks the note while you type in any of its text, until focus leaves it.
 */
export class NoteLockOperator extends SquareLockOperator {
    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this).on("input", (e: Event) => {
            if ((e.target as HTMLElement).isContentEditable) this.emitter.fire("lock");
        });
        gradum(this).on("focusout", () => {
            if (this.lockButton.matches(":hover")) return;
            this.emitter.fire("unlock");
        });
    }
}