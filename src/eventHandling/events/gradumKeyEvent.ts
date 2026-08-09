import {GradumKeyEventProperties} from "./gradumEvent.types";
import {GradumEvent} from "./gradumEvent";

/**
 * @class GradumKeyEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description The event fired for `gradum-key-pressed` and `gradum-key-released`. Which of the two key
 * fields is set tells you which happened. Key events carry no pointer position, so
 * {@link GradumEvent.position} is `null`.
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
     * @constructor
     * @description Create a key event. Its position is always `null`.
     * @param {GradumKeyEventProperties} properties - The key involved and the input context.
     */
    constructor(properties: GradumKeyEventProperties) {
        super({...properties, position: null});
        this.keyPressed = properties.keyPressed;
        this.keyReleased = properties.keyReleased;
    }
}

export {GradumKeyEvent};