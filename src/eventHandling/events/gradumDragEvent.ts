import {GradumDragEventProperties} from "./gradumEvent.types";
import {GradumEvent} from "./gradumEvent";
import {cache} from "../../decorators/cache/cache";
import {GradumMap} from "../../gradumComponents/datatypes/map/map";
import {Point} from "../../gradumComponents/datatypes/point/point";

/**
 * @class GradumDragEvent
 * @group Event Handling
 * @category GradumEvents
 *
 * @extends GradumEvent
 * @description Gradum drag event class, fired on gradum-drag, gradum-drag-start, gradum-drag-end, etc.
 */
class GradumDragEvent extends GradumEvent {
    /**
     * @description Map containing the origins of the dragging points
     */
    public readonly origins: GradumMap<number, Point>;

    /**
     * @description Map containing the previous positions of the dragging points
     */
    public readonly previousPositions: GradumMap<number, Point>;

    /**
     * @description Map containing the positions of the dragging points
     */
    public readonly positions: GradumMap<number, Point>;

    constructor(properties: GradumDragEventProperties) {
        super({...properties, position: properties.positions.first});
        this.origins = properties.origins;
        this.previousPositions = properties.previousPositions;
        this.positions = properties.positions; //TODO MOVE TO DEFAULT EVENT
    }

    /**
     * @description Map of the origins mapped to the current canvas translation and scale
     */
    @cache()
    public get scaledOrigins() {
        if (!this.scalingAuthorized) return this.origins;
        return this.scalePositionsMap(this.origins);
    }

    /**
     * @description Map of the previous positions mapped to the current canvas translation and scale
     */
    @cache()
    public get scaledPreviousPositions() {
        if (!this.scalingAuthorized) return this.previousPositions;
        return this.scalePositionsMap(this.previousPositions);
    }

    /**
     * @description Map of the positions mapped to the current canvas translation and scale
     */
    @cache()
    public get scaledPositions() {
        if (!this.scalingAuthorized) return this.positions;
        return this.scalePositionsMap(this.positions);
    }

    @cache()
    public get deltaPositions() {
        return this.positions.mapValues((key, position) => {
            const previousPosition = this.previousPositions.get(key);
            // No previous position (drag start, or a finger just joined) → zero delta,
            // so consumers reading deltas on the first event get a defined Point.
            return previousPosition ? position.sub(previousPosition) : new Point(0, 0);
        });
    }

    @cache()
    public get deltaPosition() {
        return Point.midPoint(...this.deltaPositions.valuesArray());
    }

    @cache()
    public get scaledDeltaPositions() {
        return this.scaledPositions.mapValues((key, position) => {
            const previousPosition = this.scaledPreviousPositions.get(key);
            return previousPosition ? position.sub(previousPosition) : new Point(0, 0);
        });
    }

    @cache()
    public get scaledDeltaPosition() {
        return Point.midPoint(...this.scaledDeltaPositions.valuesArray());
    }
}

export {GradumDragEvent};