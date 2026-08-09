import {linearInterpolation} from "../../../utils/computations/interpolation";
import {trim} from "../../../utils/computations/misc";
import {GradumSelectWheelProperties, GradumSelectWheelStylingProperties} from "./selectWheel.types";
import {Reifect} from "../../wrappers/reifect/reifect";
import {define} from "../../../decorators/define/define";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {$, gradum} from "../../../gradumFunctions/gradumFunctions";
import {auto} from "../../../decorators/auto/auto";
import {GradumDragEvent} from "../../../eventHandling/events/gradumDragEvent";
import {Direction, Range} from "../../../types/enums.types";
import {DefaultEventName} from "../../../types/eventNaming.types";
import {Point} from "../../datatypes/point/point";
import {PartialRecord} from "../../../types/basic.types";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {StatelessReifectProperties} from "../../wrappers/reifect/reifect.types";
import {Propagation} from "../../../gradumFunctions/event/event.types";
import {GradumSelectElement} from "../../basics/selectElement/selectElement";

/**
 * @class GradumSelectWheel
 * @group Components
 * @category GradumSelectWheel
 *
 * @extends GradumSelectElement
 * @description A swipeable selection wheel. Entries are always position absolute, fanned out by a
 * continuous pixel offset. Dragging moves all entries in real time; releasing snaps to the nearest.
 * The container sizes to the selected entry. Visual state is driven by `entryTransitionReifect`
 * (CSS transitions) and `computeAndApplyStyling` (per-entry opacity/scale/transform).
 */
class GradumSelectWheel<
    ValueType = string,
    SecondaryValueType = string,
    EntryType extends HTMLElement = HTMLElement,
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumSelectElement<ValueType, SecondaryValueType, EntryType, ViewType, DataType, ModelType, EmitterType> {
    /**
     * @static
     * @description Default properties assigned to a new wheel. Entries animate over 0.3 seconds.
     */
    public static defaultProperties = {transitionDuration: 0.3};

    public declare readonly properties: GradumSelectWheelProperties<ValueType, SecondaryValueType, EntryType,
        ViewType, DataType, ModelType, EmitterType>;

    private _currentPosition: number = 0;
    private _index: number = 0;

    /**
     * @protected
     * @readonly
     * @description Each entry's measured size along the wheel's axis, indexed by entry position. Refreshed
     * by {@link GradumSelectWheel.reloadEntrySizes}.
     */
    protected readonly sizePerEntry: number[] = [];
    /**
     * @protected
     * @readonly
     * @description Each entry's offset from the start of the wheel, indexed by entry position.
     */
    protected readonly positionPerEntry: number[] = [];
    /**
     * @protected
     * @description The combined size of every entry along the wheel's axis.
     */
    protected totalSize: number = 0;

    /**
     * @description How far past the first and last entries the wheel can be dragged, in pixels, before it
     * springs back.
     */
    public dragLimitOffset: number = 30;
    /**
     * @description How long the wheel stays open after the last interaction, in milliseconds, unless
     * {@link GradumSelectWheel.alwaysOpen} is set.
     */
    public openTimeout: number = 3000;
    /**
     * @description The axis the wheel scrolls along.
     */
    public direction: Direction = Direction.horizontal;
    /**
     * @description The scale applied to entries at the centre of the wheel and at its edges. Entries in
     * between are scaled proportionally, producing the wheel's depth effect.
     */
    public scale: Record<Range, number> = {max: 1, min: 0.5};

    /**
     * @description An optional hook replacing the wheel's built-in entry styling. It receives the computed
     * translation, opacity, and scale alongside the default styles, and returns the styles to apply instead.
     */
    public generateCustomStyling: (properties: GradumSelectWheelStylingProperties)
        => string | PartialRecord<keyof CSSStyleDeclaration, string | number>;

    /**
     * @protected
     * @description Whether the wheel is currently being dragged.
     */
    protected dragging: boolean = false;
    /**
     * @protected
     * @description The pending timer that will close the wheel once {@link GradumSelectWheel.openTimeout}
     * elapses.
     */
    protected openTimer: ReturnType<typeof setTimeout>;

    /**
     * @function initialize
     * @description Set the wheel up and start tracking its entries, re-measuring them whenever an entry is
     * added or removed.
     */
    public initialize(): void {
        const initEntry = (entry: EntryType) => {
            gradum(entry).setStyles({position: "absolute", whiteSpace: "nowrap"}, true);
            this.entryTransitionReifect?.attach(entry);
            this.customReifect?.attach(entry);

            gradum(entry)
                .on(DefaultEventName.dragStart, () => {
                    this.clearOpenTimer();
                    this.open = true;
                    this.dragging = true;
                    // Remove transitions instantly so the first drag frame isn't animated.
                    if (this.entryTransitionReifect) this.entryTransitionReifect.unapply(undefined, {applyStylesInstantly: true});
                    this.reloadEntrySizes();
                    return Propagation.stopImmediatePropagation;
                })
                .on(DefaultEventName.drag, (e: GradumDragEvent) => {
                    if (!this.dragging) return;
                    this.currentPosition += this.computeDragDelta(e.scaledDeltaPosition);
                    return Propagation.stopImmediatePropagation;
                })
                .on(DefaultEventName.dragEnd, () => {
                    if (!this.dragging) return;
                    this.dragging = false;
                    // recomputeProperties is required because unapplyStyles() clears resolvedValues.styles,
                    // so apply() without it finds styles["default"] === undefined and returns early,
                    // never calling reloadReifectsChainableStyles — leaving transition: "none" stuck.
                    if (this.entryTransitionReifect) this.entryTransitionReifect.apply(undefined, {recomputeProperties: true});
                    this.snapToNearest();
                    if (!this.alwaysOpen) this.setOpenTimer();
                    return Propagation.stopImmediatePropagation;
                });

            requestAnimationFrame(() => this.reloadEntrySizes());
        };

        this.select.onEntryAdded.add(initEntry);

        this.select.onEntryRemoved.add(entry => {
            this.entryTransitionReifect?.detach(entry);
            this.customReifect?.detach(entry);
            requestAnimationFrame(() => this.reloadEntrySizes());
        });

        super.initialize();

        gradum(this).setStyles({display: "inline-block", position: "relative", overflow: "hidden"});

        // Entries set via create({values: [...]}) fire onEntryAdded before initialize() has a
        // chance to add the callback above. Replay initEntry for any such pre-existing entries.
        this.entries.forEach(initEntry);
    }

    @auto({
        defaultValue: {max: 1, min: 0},
        preprocessValue: (value) => ({
            max: trim(value?.max ?? 1, 1),
            min: trim(value?.min ?? 0, 1),
        }),
    }) public opacity: Record<Range, number>;

    /**
     * @description The wheel's extent on either side of its centre, in pixels. Assign a single number to
     * use it symmetrically.
     */
    @auto({
        defaultValue: {max: 100, min: -100},
        preprocessValue: (value) =>
            typeof value === "object" ? value : {max: value ?? 100, min: -(value ?? 100)},
    }) public set size(value: Record<Range, number> | number) {
    }

    public get size(): Record<Range, number> {
        return;
    }

    /**
     * @description The reifect animating entries as they move through the wheel. Assign reifect properties
     * to build one. It is attached to every existing entry on assignment.
     */
    @auto({
        preprocessValue: function (value) {
            if (!value) return;
            if (value instanceof Reifect) return value;
            return new Reifect(value);
        }
    }) public set entryTransitionReifect(value: Reifect | StatelessReifectProperties) {
        if (!value) return;
        if (this.entries.length > 0) value.attach(...this.entries);
    }

    public get entryTransitionReifect(): Reifect {
        return;
    }

    @auto({override: true}) public set transitionDuration(value: number) {
        if (value <= 0) return;
        if (!this.entryTransitionReifect) this.entryTransitionReifect = new Reifect({});
        this.entryTransitionReifect.styles = `transition: transform ${value}s ease-in-out, opacity ${value}s ease-in-out`;
    }

    /**
     * @description An extra reifect applied to entries alongside the built-in transition, for styling beyond
     * position and scale. Assign reifect properties to build one, or `null` to remove it.
     */
    @auto({
        preprocessValue: function (value) {
            if (!value) return null;
            if (value instanceof Reifect) return value;
            return new Reifect(value as StatelessReifectProperties);
        },
    }) public set customReifect(value: Reifect | StatelessReifectProperties | null) {
        if (this.customReifect && this.entries.length > 0) this.customReifect.attach(...this.entries);
    }

    public get customReifect(): Reifect {
        return;
    }

    private readonly _closeOnClick = () => this.open = false;

    @auto({defaultValue: false}) public set alwaysOpen(value: boolean) {
        if (value) gradum(document.body).removeListener(DefaultEventName.click, this._closeOnClick);
        else gradum(document.body).on(DefaultEventName.click, this._closeOnClick);
        this.open = value;
    }

    @auto() public set open(value: boolean) {
        gradum(this).setStyle("overflow", value ? "visible" : "hidden");
        // When opening, entries may have had zero layout size if the wheel was off-screen or
        // hidden when first populated. Reload now that the wheel is visible.
        if (value) requestAnimationFrame(() => this.reloadEntrySizes());
    }

    /**
     * @readonly
     * @description Whether the wheel scrolls vertically.
     */
    public get isVertical() {
        return this.direction === Direction.vertical;
    }

    /** Fractional index — integer when snapped, fractional mid-drag. */
    public get index(): number {
        return this._index;
    }

    protected set index(value: number) {
        this._index = value;
        this.select.selectByIndex(trim(Math.round(value), this.entries.length - 1));
    }

    // -------------------------------------------------------------------------
    // Position
    // -------------------------------------------------------------------------

    /**
     * @description How far the wheel is scrolled, in pixels from its start. Assigning clamps the value to
     * the draggable range, updates the selected index, and restyles every entry.
     */
    public get currentPosition(): number {
        return this._currentPosition;
    }

    protected set currentPosition(value: number) {
        if (!this.sizePerEntry.length) return;
        const min = -this.dragLimitOffset - this.sizePerEntry[0] / 2;
        const max = this.totalSize + this.dragLimitOffset - this.sizePerEntry[this.sizePerEntry.length - 1] / 2;
        this._currentPosition = Math.min(Math.max(value, min), max);
        this._index = this.positionToIndex(this._currentPosition);
        this.applyAllEntryStyles();
    }

    /**
     * @function computeDragDelta
     * @protected
     * @description Convert a drag delta into movement along the wheel's axis, inverted so dragging one way
     * scrolls the entries the other.
     * @param {Point} delta - The pointer's movement.
     * @returns {number} The distance to scroll, in pixels.
     */
    protected computeDragDelta(delta: Point): number {
        return -delta[this.isVertical ? "y" : "x"];
    }

    // -------------------------------------------------------------------------
    // Layout
    // -------------------------------------------------------------------------

    /**
     * @function reloadEntrySizes
     * @protected
     * @description Re-measure every entry and rebuild the wheel's size and position tables. Call it after the
     * entries change, or after the wheel becomes visible — entries laid out while hidden measure as zero.
     */
    protected reloadEntrySizes() {
        this.sizePerEntry.length = 0;
        this.positionPerEntry.length = 0;
        this.totalSize = 0;

        this.entries.forEach(entry => {
            const size = entry[this.isVertical ? "offsetHeight" : "offsetWidth"];
            this.sizePerEntry.push(size);
            this.positionPerEntry.push(this.totalSize);
            this.totalSize += size;
        });

        if (!this.sizePerEntry.length) {
            this._currentPosition = 0;
            return;
        }
        // If the wheel or its ancestors weren't in layout yet (e.g. off-screen, hidden, or
        // added to the DOM after entries were created), all sizes read as 0. Retry next frame
        // so the browser has time to perform layout.
        if (this.totalSize === 0) {
            requestAnimationFrame(() => this.reloadEntrySizes());
            return;
        }
        this._currentPosition = this.indexToPosition(this._index);
        this.applyAllEntryStyles();
        if (this.selectedIndex >= 0) this.applyTransition();
    }

    /**
     * @function indexToPosition
     * @protected
     * @description Get the scroll position at which the given entry sits at the centre of the wheel.
     * @param {number} index - The entry's index.
     * @returns {number} The corresponding scroll position, in pixels.
     */
    protected indexToPosition(index: number): number {
        if (!this.sizePerEntry.length) return 0;
        if (index < 0) return -Math.abs(index) * this.sizePerEntry[0];
        if (index >= this.sizePerEntry.length)
            return this.totalSize - this.sizePerEntry[this.sizePerEntry.length - 1] / 2;
        const floor = trim(Math.floor(index), this.sizePerEntry.length - 1);
        return this.positionPerEntry[floor] + this.sizePerEntry[floor] * (index - Math.floor(index));
    }

    /**
     * @function positionToIndex
     * @protected
     * @description Get the entry index a scroll position corresponds to. The result is fractional between
     * entries, which is what drives the wheel's scaling mid-drag.
     * @param {number} position - The scroll position, in pixels.
     * @returns {number} The fractional entry index.
     */
    protected positionToIndex(position: number): number {
        if (!this.positionPerEntry.length) return 0;
        let i = 0;
        while (i < this.positionPerEntry.length - 1 && this.positionPerEntry[i + 1] <= position) i++;
        if (i >= this.sizePerEntry.length - 1) return i;
        return i + Math.min((position - this.positionPerEntry[i]) / (this.sizePerEntry[i] || 1), 1);
    }

    /**
     * @function snapToNearest
     * @protected
     * @description Settle the wheel on the entry nearest its current position and select it. Called when a
     * drag ends.
     */
    protected snapToNearest() {
        const nearest = trim(Math.round(this.positionToIndex(this._currentPosition)), this.entries.length - 1);
        this.index = nearest;
        this._currentPosition = this.indexToPosition(nearest);
        this.applyAllEntryStyles();
    }

    // -------------------------------------------------------------------------
    // Transition (overrides GradumSelectElement — wheel sizes to selected entry directly)
    // -------------------------------------------------------------------------

    /**
     * @function applyTransition
     * @protected
     * @description Scroll the wheel to the selected entry and size the wheel to match it. Overrides the base
     * selection behaviour, which sizes to the entry element instead.
     */
    protected applyTransition() {
        const i = this.selectedIndex;
        if (i < 0) return;

        this._index = i;
        this._currentPosition = this.indexToPosition(i);
        this.applyAllEntryStyles();

        // Size container to selected entry
        if (this.sizePerEntry.length) {
            const entry = this.entries[i] as HTMLElement;
            const w = this.isVertical ? entry.offsetWidth : this.sizePerEntry[i];
            const h = this.isVertical ? this.sizePerEntry[i] : entry.offsetHeight;
            $(this).setStyles({width: `${w}px`, height: `${h}px`});
        }
    }

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /**
     * @function applyAllEntryStyles
     * @protected
     * @description Restyle every entry for the current scroll position. Styles are applied instantly while
     * dragging, so transforms are not queued behind a frame and left visibly lagging the pointer.
     */
    protected applyAllEntryStyles() {
        // Apply instantly during drag so transforms aren't queued behind a rAF while a CSS
        // transition is still active on the element, which would cause visual lag.
        const instant = this.dragging;
        this.entries.forEach((el, i) => {
            const translationValue = (this.positionPerEntry[i] ?? 0) - this._currentPosition;
            if (this.customReifect) {
                this.customReifect.apply(el as any, {recomputeProperties: true});
            } else {
                this.computeAndApplyStyling(el, translationValue, undefined, instant);
            }
        });
    }

    /**
     * @function computeAndApplyStyling
     * @protected
     * @description Compute an entry's opacity, scale, and transform from how far it sits from the wheel's
     * centre, and apply them. Defers to {@link GradumSelectWheel.generateCustomStyling} when one is set.
     * @param {HTMLElement} element - The entry to style.
     * @param {number} translationValue - The entry's offset from the centre, in pixels.
     * @param {Record<Range, number>} [size=this.size] - The wheel's extent, used to scale the falloff.
     * @param {boolean} [instant=false] - Whether to set the styles directly, skipping the CSS transition.
     */
    protected computeAndApplyStyling(
        element: HTMLElement,
        translationValue: number,
        size: Record<Range, number> = this.size,
        instant: boolean = false,
    ) {
        const bound = translationValue > 0 ? size.max : size.min;
        const opacityValue = linearInterpolation(translationValue, 0, bound, this.opacity.max, this.opacity.min);
        const scaleValue = linearInterpolation(translationValue, 0, bound, this.scale.max, this.scale.min);

        // `transition` is a "chainable style field" — Reifect.unapply() clears its own
        // resolved state but reloadReifectsChainableStyles() only writes keys that still
        // have an active contribution, so the old inline transition is never explicitly
        // removed. Writing "none" here overrides it every drag frame.
        let styles: string | PartialRecord<keyof CSSStyleDeclaration, string | number> = {
            left: "50%",
            top: "50%",
            opacity: opacityValue,
            ...(instant && {transition: "none"}),
            transform: `translate3d(
                calc(${!this.isVertical ? translationValue : 0}px - 50%),
                calc(${this.isVertical ? translationValue : 0}px - 50%),
                0) scale3d(${scaleValue}, ${scaleValue}, 1)`,
        };

        if (this.generateCustomStyling) styles = this.generateCustomStyling({
            element, translationValue, opacityValue, scaleValue, size, defaultComputedStyles: styles,
        });

        $(element).setStyles(styles, instant);
    }

    // -------------------------------------------------------------------------
    // Timer helpers
    // -------------------------------------------------------------------------

    /**
     * @function clearOpenTimer
     * @protected
     * @description Cancel the pending timer that would close the wheel.
     */
    protected clearOpenTimer() {
        if (this.openTimer) clearTimeout(this.openTimer);
    }

    /**
     * @function setOpenTimer
     * @protected
     * @description Restart the timer that closes the wheel once {@link GradumSelectWheel.openTimeout} elapses.
     */
    protected setOpenTimer() {
        this.clearOpenTimer();
        if (typeof this.openTimeout !== "number" || this.openTimeout < 0) return;
        this.openTimer = setTimeout(() => this.open = false, this.openTimeout);
    }
}

define(GradumSelectWheel);
export {GradumSelectWheel};