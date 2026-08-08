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
    public readonly toggledEntry: EntryType;
    public readonly values: ValueType[];

    public constructor(properties: GradumSelectInputEventProperties<ValueType, SecondaryValueType, EntryType>) {
        super(properties);
        this.toggledEntry = properties.toggledEntry;
        this.values = properties.values;
    }
}

export {GradumSelectInputEvent};