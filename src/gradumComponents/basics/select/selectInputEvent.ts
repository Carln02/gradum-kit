import {GradumEvent} from "../../../eventHandling/events/gradumEvent";
import {GradumSelectInputEventProperties} from "./select.types";

/**
 * @group Event Handling
 * @category GradumEvents
 */
class GradumSelectInputEvent<
    ValueType = string,
    SecondaryValueType = string,
    EntryType extends object = HTMLElement,
> extends GradumEvent {
    /**
     * @readonly
     * @description The entry whose selection changed and caused this event.
     */
    public readonly toggledEntry: EntryType;

    /**
     * @readonly
     * @description The values of every entry selected after the change.
     */
    public readonly values: ValueType[];

    /**
     * @constructor
     * @description Create a selection-input event.
     * @param {GradumSelectInputEventProperties} properties - The event's configuration, including the
     * toggled entry and the resulting values.
     */
    public constructor(properties: GradumSelectInputEventProperties<ValueType, SecondaryValueType, EntryType>) {
        super(properties);
        this.toggledEntry = properties.toggledEntry;
        this.values = properties.values;
    }
}

export {GradumSelectInputEvent};