import {GradumKeyEventProperties} from "./gradumEvent.types";
import {GradumEvent} from "./gradumEvent";
import {GradumEventManager} from "../gradumEventManager/gradumEventManager";

/**
 * @class GradumKeyEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description The event fired for `gradum-key-pressed` and `gradum-key-released`. Which of the two key
 * fields is set tells you which happened.
 */
class GradumKeyEvent extends GradumEvent {
    /**
     * @description The key that was pressed, or `undefined` on a release event.
     */
    public readonly keyPressed: string;

    /**
     * @description The key that was released, or `undefined` on a press event.
     */
    public readonly keyReleased: string;

    /**
     * @description Whether this press is the browser repeating a key that is being held, rather than a fresh
     * one. Mirrors [`KeyboardEvent.repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat).
     * Repeats are what a held key drives a continuous action with — scrubbing, nudging, stepping — so ignore
     * them when one press should mean one thing. Always `false` on a release.
     */
    public readonly repeat: boolean;

    /**
     * @constructor
     * @description Create a key event. Its position defaults to where the manager last saw the pointer, and
     * is `null` when it has not seen one.
     * @param {GradumKeyEventProperties} properties - The key involved and the input context.
     */
    constructor(properties: GradumKeyEventProperties) {
        const manager = properties.eventManager ?? GradumEventManager.instance;
        super({...properties, position: properties.position ?? manager?.model?.positions?.first ?? null});
        this.keyPressed = properties.keyPressed;
        this.keyReleased = properties.keyReleased;
        this.repeat = properties.repeat ?? false;
    }
}

export {GradumKeyEvent};