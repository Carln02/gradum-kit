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
 * @description The event fired for `gradum-drag`, `gradum-drag-start`, and `gradum-drag-end`. It tracks
 * every active pointer at once, so a multi-touch drag reports one entry per finger: each map below is
 * keyed by pointer id. Every position is available raw and scaled into document space, along with the
 * per-event deltas.
 */
class GradumDragEvent extends GradumEvent {
    /**
     * @description Where each pointer started its drag, keyed by pointer id.
     */
    public readonly origins: GradumMap<number, Point>;

    /**
     * @description Where each pointer was on the previous drag event, keyed by pointer id.
     */
    public readonly previousPositions: GradumMap<number, Point>;

    /**
     * @description Where each pointer is now, keyed by pointer id.
     */
    public readonly positions: GradumMap<number, Point>;

    /**
     * @constructor
     * @description Create a drag event. The event's single `position` is taken from the first entry of
     * `positions`.
     * @param {GradumDragEventProperties} properties - The per-pointer position maps and input context.
     */
    constructor(properties: GradumDragEventProperties) {
        super({...properties, position: properties.positions.first});
        this.origins = properties.origins;
        this.previousPositions = properties.previousPositions;
        this.positions = properties.positions; //TODO MOVE TO DEFAULT EVENT
    }

    /**
     * @readonly
     * @description {@link GradumDragEvent.origins} in document space. Falls back to the raw origins when
     * scaling is not authorized.
     */
    @cache()
    public get scaledOrigins() {
        if (!this.scalingAuthorized) return this.origins;
        return this.scalePositionsMap(this.origins);
    }

    /**
     * @readonly
     * @description {@link GradumDragEvent.previousPositions} in document space. Falls back to the raw
     * positions when scaling is not authorized.
     */
    @cache()
    public get scaledPreviousPositions() {
        if (!this.scalingAuthorized) return this.previousPositions;
        return this.scalePositionsMap(this.previousPositions);
    }

    /**
     * @readonly
     * @description {@link GradumDragEvent.positions} in document space. Falls back to the raw positions
     * when scaling is not authorized.
     */
    @cache()
    public get scaledPositions() {
        if (!this.scalingAuthorized) return this.positions;
        return this.scalePositionsMap(this.positions);
    }

    /**
     * @readonly
     * @description How far each pointer moved since the previous event, keyed by pointer id. A pointer
     * with no previous position — on drag start, or when a finger has just joined — reports a zero delta
     * rather than being left out, so a delta is always defined for every active pointer.
     */
    @cache()
    public get deltaPositions() {
        return this.positions.mapValues((key, position) => {
            const previousPosition = this.previousPositions.get(key);
            // No previous position (drag start, or a finger just joined) → zero delta,
            // so consumers reading deltas on the first event get a defined Point.
            return previousPosition ? position.sub(previousPosition) : new Point(0, 0);
        });
    }

    /**
     * @readonly
     * @description The average movement across all pointers since the previous event. Use it to move
     * something with the drag without caring how many fingers are down.
     */
    @cache()
    public get deltaPosition() {
        return Point.midPoint(...this.deltaPositions.valuesArray());
    }

    /**
     * @readonly
     * @description {@link GradumDragEvent.deltaPositions} in document space, so the deltas match the
     * coordinates of a panned or zoomed canvas.
     */
    @cache()
    public get scaledDeltaPositions() {
        return this.scaledPositions.mapValues((key, position) => {
            const previousPosition = this.scaledPreviousPositions.get(key);
            return previousPosition ? position.sub(previousPosition) : new Point(0, 0);
        });
    }

    /**
     * @readonly
     * @description The average movement across all pointers since the previous event, in document space.
     */
    @cache()
    public get scaledDeltaPosition() {
        return Point.midPoint(...this.scaledDeltaPositions.valuesArray());
    }
}

export {GradumDragEvent};