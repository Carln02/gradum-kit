import {GradumEventManagerModel} from "../gradumEventManager.model";
import {GradumKeyEvent} from "../../events/gradumKeyEvent";
import {GradumEventManager} from "../gradumEventManager";
import {GradumOperator} from "../../../mvc/operator/operator";
import {GradumKeyEventName} from "../../../types/eventNaming.types";

/**
 * @internal
 * @class GradumEventManagerKeyOperator
 * @extends GradumOperator
 * @description Translates native keyboard input into {@link GradumKeyEvent}s. It keeps the manager's
 * list of currently-held keys up to date and activates any tool bound to the pressed key.
 */
export class GradumEventManagerKeyOperator extends GradumOperator<GradumEventManager, any, GradumEventManagerModel> {
    public keyName: string = "key";

    public keyDown = (e: KeyboardEvent) => this.keyDownFn(e);

    protected keyDownFn(e: KeyboardEvent) {
        if (!this.element.enabled) return;
        //Return if key already pressed

        if (this.model.currentKeys.includes(e.key)) return;
        //Add key to currentKeys
        this.model.currentKeys.push(e.key);
        //Fire a keyPressed event (only once)
        this.emitter.fire("dispatchEvent", document, GradumKeyEvent, {eventName: GradumKeyEventName.keyPressed, keyPressed: e.key});
    }

    public keyUp = (e: KeyboardEvent) => this.keyUpFn(e);

    protected keyUpFn(e: KeyboardEvent) {
        if (!this.element.enabled) return;
        //Return if key not pressed
        if (!this.model.currentKeys.includes(e.key)) return;
        //Remove key from currentKeys
        this.model.currentKeys.splice(this.model.currentKeys.indexOf(e.key), 1);
        //Fire a keyReleased event
        this.emitter.fire("dispatchEvent", document, GradumKeyEvent, {eventName: GradumKeyEventName.keyReleased, keyReleased: e.key});
    }
}
