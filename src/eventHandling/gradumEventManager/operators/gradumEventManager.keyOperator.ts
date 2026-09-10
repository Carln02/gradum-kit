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
 *
 * The events are dispatched at the element under the pointer rather than at the document, so a keyboard
 * interactor binds to its own element the way a pointer one does, and a handler's `preventDefault()` is
 * carried back to the native key event so it actually stops the browser.
 */
export class GradumEventManagerKeyOperator extends GradumOperator<GradumEventManager, any, GradumEventManagerModel> {
    public keyName: string = "key";

    public keyDown = (e: KeyboardEvent) => this.keyDownFn(e);

    protected keyDownFn(e: KeyboardEvent) {
        if (!this.element.enabled) return;
        //A held key repeats. The list of keys held has no use for the repeats — it would only fill up with
        //duplicates — but handlers do: a repeat is what a held key drives a continuous action with, so they
        //are fired all the same, and named as repeats so anything wanting one press to mean one thing can
        //say so.
        const repeat = this.model.currentKeys.includes(e.key);
        if (!repeat) this.model.currentKeys.push(e.key);

        const dispatched: GradumKeyEvent = this.emitter.fire("dispatchEvent", this.hoveredTarget(), GradumKeyEvent,
            {eventName: GradumKeyEventName.keyPressed, keyPressed: e.key, repeat});
        if (dispatched?.defaultPrevented) e.preventDefault();
    }

    public keyUp = (e: KeyboardEvent) => this.keyUpFn(e);

    protected keyUpFn(e: KeyboardEvent) {
        if (!this.element.enabled) return;
        //Return if key not pressed
        if (!this.model.currentKeys.includes(e.key)) return;
        //Remove key from currentKeys
        this.model.currentKeys.splice(this.model.currentKeys.indexOf(e.key), 1);

        const dispatched: GradumKeyEvent = this.emitter.fire("dispatchEvent", this.hoveredTarget(), GradumKeyEvent,
            {eventName: GradumKeyEventName.keyReleased, keyReleased: e.key});
        if (dispatched?.defaultPrevented) e.preventDefault();
    }

    /**
     * @protected
     * @function hoveredTarget
     * @description Where a key press happens, as far as the tree is concerned: the element under the pointer.
     *
     * A keyboard has no target of its own, so key events used to be fired at the document, which left every
     * keyboard listener on the page hearing every keystroke and working out for itself whether it was meant.
     * Firing at the hovered element lets one bind to its own element the way a pointer listener does. Nothing
     * bound to the document loses out: it is still on the path of an event fired on a descendant.
     * @returns {Node} The element under the pointer, or the document when there is none.
     */
    protected hoveredTarget(): Node {
        const position = this.model.positions?.first;
        return (position && document.elementFromPoint?.(position.x, position.y)) || document;
    }
}
