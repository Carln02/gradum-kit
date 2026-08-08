import {GradumKeyEventProperties} from "./gradumEvent.types";
import {GradumEvent} from "./gradumEvent";

/**
 * @class GradumKeyEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description Custom key event
 */
class GradumKeyEvent extends GradumEvent {
    /**
     * @description The key pressed (if any) when the event was fired
     */
    public readonly keyPressed: string;

    /**
     * @description The key released (if any) when the event was fired
     */
    public readonly keyReleased: string;

    constructor(properties: GradumKeyEventProperties) {
        super({...properties, position: null});
        this.keyPressed = properties.keyPressed;
        this.keyReleased = properties.keyReleased;
    }
}

export {GradumKeyEvent};