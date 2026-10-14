import {GradumDrawerProperties} from "./drawer.types";
import "./drawer.css";
import {GradumIconSwitch} from "../../basics/icon/iconSwitch/iconSwitch";
import {Reifect} from "../../wrappers/reifect/reifect";
import {GradumIconSwitchProperties} from "../../basics/icon/iconSwitch/iconSwitch.types";
import {define} from "../../../decorators/define/define";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumElement} from "../../../gradumElement/gradumElement";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {div} from "../../../elementCreation/basicElements";
import {GradumDragEvent} from "../../../eventHandling/events/gradumDragEvent";
import {auto} from "../../../decorators/auto/auto";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {GradumProperties} from "../../../gradumFunctions/element/element.types";
import {element} from "../../../elementCreation/element";
import {Open, Side} from "../../../types/enums.types";
import {DefaultEventName, GradumEventName} from "../../../types/eventNaming.types";
import {PartialRecord} from "../../../types/basic.types";
import {Propagation} from "../../../gradumFunctions/event/event.types";

//TODO TRY TO SEE IF HIDDEN OVERFLOW ELEMENT CAN CONTAIN ELEMENT THAT OVERFLOWS PAST PARENT
/**
 * @group Components
 * @category Containers
 */
class GradumDrawer<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EMitterType extends GradumEmitter = GradumEmitter
> extends GradumElement<ViewType, DataType, ModelType, EMitterType> {
     public declare readonly properties: GradumDrawerProperties;

    private _panelContainer: HTMLElement;

    /**
     * @private
     * @description Guards {@link setupUILayout} against re-entering itself. Reading `thumb` or `panel`
     * creates them on first access, and their setters call `setupUILayout` again — so the layout would
     * otherwise run nested, and the inner run would leave `childHandler` pointing at the panel while the
     * outer run is still going.
     */
    private layingOutUI: boolean = false;

    /**
     * @readonly
     * @description The element wrapping the panel. It is the one that resizes as the drawer opens and
     * closes; the panel itself keeps its natural size.
     */
    public get panelContainer(): HTMLElement {return this._panelContainer}

    private dragging: boolean = false;

    /**
     * @protected
     * @description Watches the panel while the drawer is open, so the drawer follows its content when
     * that content changes size.
     */
    protected resizeObserver: ResizeObserver;

    /**
     * @description The handle used to open and close the drawer. Assign an element to use it directly, or
     * properties to build one. Clicking it toggles the drawer; dragging it moves the drawer with the pointer.
     */
    @auto({
        setIfUndefined: true,
        //Off whatever is holding it, not off the drawer: `remChild` goes through `childHandler`, which
        //the drawer points at its panel once the layout is up, so removing a thumb from `this` asked the
        //panel to remove a node that was never its child. The removal failed, and `setupUILayout` then
        //collected the replaced thumb as loose content and moved it *into* the panel.
        callBefore: function () {this.thumb?.remove()},
        preprocessValue: (value: GradumProperties | HTMLElement) => value instanceof HTMLElement ? value : div(value)
    }) public set thumb(value: GradumProperties | HTMLElement) {
        gradum(value).addClass("gradum-drawer-thumb");
        if (this.initialized) this.setupUILayout();
    }

    public get thumb(): HTMLElement {return}

    /**
     * @description The drawer's content panel. Assign an element to use it directly, or properties to build
     * one. Any children already on the drawer are moved into it when the layout is set up.
     */
    @auto({
        setIfUndefined: true,
        //As with the thumb: off its own parent, the panel container. Removing it through the drawer's
        //`childHandler` — the panel itself by then — failed, leaving the replaced panel in the container
        //beside the new one, two panels deep for the drawer to measure and clip around.
        callBefore: function () {this.panel?.remove()},
        preprocessValue: (value: GradumProperties | HTMLElement) =>
            value instanceof HTMLElement ? value : div(value)
    }) public set panel(value: GradumProperties | HTMLElement) {
        gradum(value).addClass("gradum-drawer-panel");
        if (this.initialized) this.setupUILayout();
    }

    public get panel(): HTMLElement {return}

    /**
     * @description The icon shown inside the thumb. Assign an icon name, an element, or icon-switch
     * properties. Given a name, a {@link GradumIconSwitch} is built that tracks the drawer's side so the
     * icon points the right way.
     */
    @auto({
        callBefore: function () {if (this.icon?.parentElement === this.thumb) this.thumb.removeChild(this.icon)},
        preprocessValue: function (value: string | Element | GradumIconSwitchProperties<Side> | GradumIconSwitch<Side>) {
            if (value instanceof Element) return value;
            if (typeof value === "string" && !this.attachSideToIconName && !this.rotateIconBasedOnSide) this.attachSideToIconName = true;
            return GradumIconSwitch.create(typeof value === "object" ? value : {
                icon: value,
                switchReifect: {states: Object.values(Side)},
                defaultState: this.open ? this.getOppositeSide() : this.side,
                appendStateToIconName: this.attachSideToIconName,
            });
        }
    }) public set icon(_value: string | Element | GradumIconSwitchProperties<Side> | GradumIconSwitch<Side>) {
        if (this.initialized) this.setupUILayout();
    }

    public get icon(): GradumIconSwitch<Side> | Element {return}

    /**
     * @description Whether content overflowing the panel is clipped rather than spilling out of the drawer.
     */
    @auto({defaultValue: false}) public set hideOverflow(value: boolean) {
        gradum(this.panelContainer).setStyle("overflow", value ? "hidden" : "");
        //The position is carried by a different style on either side of this flag, so the drawer is laid
        //out again to move it there. Instantly: this is a change of how the drawer is built, not a change
        //of where it stands, and there is nothing to animate between the two.
        if (this.initialized) this.refresh(true);
    }

    /**
     * @description Whether the drawer's side is appended to the icon's name, so a different icon file is
     * loaded per side. Turning this on turns {@link GradumDrawer.rotateIconBasedOnSide} off.
     */
    @auto({defaultValue: false}) public set attachSideToIconName(value: boolean) {
        if (this.icon instanceof GradumIconSwitch) this.icon.appendStateToIconName = value;
        if (value) this.rotateIconBasedOnSide = false;
    }

    /**
     * @description Whether one icon is rotated to suit the drawer's side instead of swapping files.
     * Turning this on turns {@link GradumDrawer.attachSideToIconName} off.
     */
    @auto({defaultValue: false}) public set rotateIconBasedOnSide(value: boolean) {
        if (value) this.attachSideToIconName = false;
        if (this.icon instanceof GradumIconSwitch) this.icon.switchReifect.styles = {
            top: "transform: rotate(180deg)",
            bottom: "transform: rotate(0deg)",
            left: "transform: rotate(90deg)",
            right: "transform: rotate(270deg)",
        };
    }

    /**
     * @description The edge the drawer is attached to. Assigning it swaps the matching CSS class and
     * refreshes the drawer's position.
     */
    @auto({defaultValue: Side.bottom, cancelIfUnchanged: false}) public set side(value: Side) {
        gradum(this).toggleClass("top-drawer", value == Side.top)
            .toggleClass("bottom-drawer", value == Side.bottom)
            .toggleClass("left-drawer", value == Side.left)
            .toggleClass("right-drawer", value == Side.right);
        //Instantly, as with `hideOverflow`: the drawer is moving to another edge, not travelling there,
        //and the axis its position is written on changes with it.
        this.refresh(true);
    }

    /**
     * @description How far the drawer sits from its edge, in pixels, given separately for its open and
     * closed states. Assign a single number to use it for both.
     */
    @auto({
        defaultValue: {open: 0, closed: 0},
        preprocessValue: (value: number | PartialRecord<Open, number>) =>
            typeof value === "number" ? {open: value, closed: value} : {
                open: value?.open || 0,
                closed: value?.closed || 0
            }
    }) public set offset(value: number | PartialRecord<Open, number>) {}

    public get offset(): PartialRecord<Open, number> {return}

    /**
     * @readonly
     * @description Whether the drawer opens along the vertical axis, i.e. it is attached to the top or
     * bottom edge.
     */
    public get isVertical() {
        return this.side == Side.top || this.side == Side.bottom;
    }

    /**
     * @description Whether the drawer is open. Assigning it animates the drawer to its new position.
     */
    @auto({defaultValue: false}) public set open(value: boolean) {
        if (value) this.resizeObserver?.observe(this.panel, {box: "border-box"});
        else this.resizeObserver?.unobserve(this.panel);
        this.refresh();
    }

    @auto({cancelIfUnchanged: false}) public set translation(value: number) {
        this.applyTranslation(value);
    }

    @auto({
        defaultValueCallback: function () {
            return new Reifect({
                transitionProperties: ["transform", this.isVertical ? "height" : "width"],
                transitionDuration: 0.2,
                transitionTimingFunction: "ease-out",
            })
        },
        callAfter: function () {this.transition.attach(this, this.panelContainer)},
    }) public transition: Reifect;

    /**
     * @description How far the drawer is currently displaced from its edge, in pixels. Set while dragging
     * to follow the pointer; otherwise driven by {@link GradumDrawer.open} and by
     * {@link GradumDrawer.refresh}.
     *
     * Assigning it writes the position whether or not the number changed. The number alone does not say
     * where the drawer stands: the same one means a container size under `hideOverflow` and a transform
     * without it, and one axis or the other depending on {@link GradumDrawer.side}. Writing a style the
     * value it already holds restarts no transition, so there is nothing to save by skipping it.
     */
    public get translation(): number {return}

    /**
     * @function initialize
     * @description Set the drawer up and settle it into the position its state calls for without
     * animating, then enable transitions on the next frame so later changes animate normally.
     */
    public initialize() {
        super.initialize();
        gradum(this).show(false);
        this.enableTransition(false);

        this.setupResizeObserver();

        //Laying the drawer out here, rather than waiting for something about it to change. Nothing has to
        //change for a drawer to need a position: a closed one is `open === false` from the moment it
        //exists, so the `open = false` that used to stand here was dropped as unchanged and `refresh`
        //never ran — and what `side` did write while properties were being applied went to a panel
        //container `setupUIElements` had not created yet. With `hideOverflow` on, that left the container
        //at the panel's natural size: a drawer standing fully open while reporting itself closed, whose
        //first click only set `open` to what it already looked like.
        if (this.open) this.resizeObserver?.observe(this.panel, {box: "border-box"});
        this.refresh(true);

        //And again whenever it arrives somewhere, because a drawer built before it is in the document has
        //nothing to measure: the panel's offset size is 0 while it is detached, so an open one would lay
        //itself out collapsed and stay that way. The observer is no help there — it is held off until the
        //drawer's first transition.
        this.onAttach.add(() => this.refresh(true));

        requestAnimationFrame(() => {
            gradum(this).show(true);
            this.enableTransition(true);
        });
    }

    /**
     * @inheritDoc
     */
    protected setupUIElements() {
        super.setupUIElements();
        this._panelContainer = div({classes: "gradum-drawer-panel-container"});
    }

    /**
     * @inheritDoc
     */
    protected setupUILayout() {
        //Reading `thumb`/`panel` below creates them on first access, and their setters call back into this
        //method. Let the outermost call do the work: it sees the finished elements either way.
        if (this.layingOutUI) return;
        this.layingOutUI = true;

        try {
            super.setupUILayout();

            gradum(this).childHandler = this;
            const panelChildren = gradum(this).childrenArray
                .filter(el => el !== this.panelContainer && el !== this.thumb);
            gradum(this).addChild([this.thumb, this.panelContainer]);
            gradum(this.panel).addChild(panelChildren);
            gradum(this.panelContainer).addChild(this.panel);
            gradum(this.thumb).addChild(this.icon);
            gradum(this).childHandler = this.panel;
        } finally {
            this.layingOutUI = false;
        }
    }

    /**
     * @inheritDoc
     */
    protected setupUIListeners() {
        gradum(this.thumb).on(DefaultEventName.click, (e) => {
            this.open = !this.open;
            return Propagation.stopPropagation;
        }).on(GradumEventName.dragStart, (e: GradumDragEvent) => {
            this.dragging = true;
            this.enableTransition(false);
            return Propagation.stopPropagation;
        }).on(GradumEventName.drag, (e: GradumDragEvent) => {
            if (!this.dragging) return;
            this.translation += this.isVertical ? e.scaledDeltaPosition.y : e.scaledDeltaPosition.x;
            return Propagation.stopPropagation;
        }).on(GradumEventName.dragEnd, (e: GradumDragEvent) => {
            if (!this.dragging) return;
            this.dragging = false;
            const delta = e.positions.first.sub(e.origins.first);

            switch (this.side) {
                case Side.top:
                    if (this.open && delta.y > 100) this.open = false;
                    else if (!this.open && delta.y < -100) this.open = true;
                    break;
                case Side.bottom:
                    if (this.open && delta.y < -100) this.open = false;
                    else if (!this.open && delta.y > 100) this.open = true;
                    break;
                case Side.left:
                    if (this.open && delta.x > 100) this.open = false;
                    else if (!this.open && delta.x < -100) this.open = true;
                    break;
                case Side.right:
                    if (this.open && delta.x < -100) this.open = false;
                    else if (!this.open && delta.x > 100) this.open = true;
                    break;
            }

            this.enableTransition(true);
            this.refresh();
            return true;
        });
    }

    /**
     * @function getOppositeSide
     * @description Get the side facing the given one — top against bottom, left against right.
     * @param {Side} [side=this.side] - The side to invert. Defaults to the drawer's own side.
     * @returns {Side} The opposite side.
     */
    public getOppositeSide(side: Side = this.side): Side {
        switch (side) {
            case Side.top:
                return Side.bottom;
            case Side.bottom:
                return Side.top;
            case Side.left:
                return Side.right;
            case Side.right:
                return Side.left;
        }
    }

    /**
     * @function getAdjacentSide
     * @description Get the side a quarter-turn from the given one, used to rotate the thumb's icon.
     * @param {Side} [side=this.side] - The side to rotate from. Defaults to the drawer's own side.
     * @returns {Side} The adjacent side.
     */
    public getAdjacentSide(side: Side = this.side): Side {
        switch (side) {
            case Side.top:
                return Side.right;
            case Side.bottom:
                return Side.left;
            case Side.left:
                return Side.top;
            case Side.right:
                return Side.bottom;
        }
    }

    /**
     * @function refresh
     * @description Re-measure the panel and move the drawer to the position its current state calls for.
     * Call it after changing the panel's contents outside the drawer's own observers.
     *
     * Settles within the call, so it is safe to call at interactive rates: a drawer whose panel resizes
     * continuously can be refreshed on every change without the calls treading on each other.
     * @param {boolean} [instant=false] - Whether the position is written straight away rather than on the
     * next animation frame. Used to lay the drawer out as it is built, where there is nothing to animate
     * from and no frame to wait for.
     */
    public refresh(instant: boolean = false) {
        if (this.icon instanceof GradumIconSwitch) this.icon.switchReifect.apply(this.open ? this.getOppositeSide() : this.side);

        const translation = (this.open ? this.offset.open : this.offset.closed)
            + (this.open ? this.measurePanel() : 0);
        this.translation = translation;
        if (instant) this.applyTranslation(translation, true);
    }

    /**
     * @function applyTranslation
     * @protected
     * @description Write a displacement to the style that carries it — the panel container's size along
     * the drawer's axis while the overflow is clipped, a transform on the drawer itself otherwise — and
     * take it off the styles that do not.
     *
     * Which style holds the position is not fixed: it moves with `hideOverflow` and with the drawer's
     * axis. Whichever one the position has left goes on displacing the drawer by the amount it was given
     * last, on top of the one now in force, until it is cleared.
     * @param {number} value - The displacement to write, in pixels.
     * @param {boolean} [instant=false] - Whether to write it straight away rather than on the next frame.
     */
    protected applyTranslation(value: number, instant: boolean = false) {
        const size = this.isVertical ? "height" : "width";
        if (this.hideOverflow) {
            gradum(this).setStyle("transform", "", instant);
            gradum(this.panelContainer).setStyle(this.isVertical ? "width" : "height", "", instant)
                .setStyle(size, value + "px", instant);
        } else {
            gradum(this.panelContainer).setStyle("width", "", instant).setStyle("height", "", instant);
            gradum(this).setStyle("transform",
                `translate${this.isVertical ? "Y" : "X"}(${-value}px)`, instant);
        }
    }

    /**
     * @function measurePanel
     * @protected
     * @description How much room the panel's contents want, along the drawer's axis.
     *
     * With `hideOverflow` on, the panel is a flex item in a container the drawer has given an explicit
     * size, so it is shrunk to fit and measures as whatever room it has rather than as what it wants.
     * Taking it out of flow for the measurement is what gets its natural size — and reading the offset
     * forces the layout, so the whole thing happens in one pass.
     *
     * *It used to span two frames: out of flow now, measured and put back on the next. Overlapping calls
     * each took it out again and booked their own restore, so a panel resizing during a gesture flickered
     * for the whole gesture — and a backgrounded tab, whose frame never comes, left it out of flow for good.*
     * @returns {number} The panel's size along the drawer's axis.
     */
    protected measurePanel(): number {
        const axis = this.isVertical ? "offsetHeight" : "offsetWidth";
        if (!this.hideOverflow) return this.panel[axis];

        gradum(this.panel).setStyle("position", "absolute", true);
        const size = this.panel[axis];
        gradum(this.panel).setStyle("position", "relative", true);
        return size;
    }

    /**
     * @function enableTransition
     * @protected
     * @description Turn the drawer's open/close animation on or off, to move it instantly while dragging.
     * @param {boolean} b - Whether the transition is enabled.
     */
    protected enableTransition(b: boolean) {
        this.transition.enabled = b;
        this.transition.apply();
    }

    /**
     * @function setupResizeObserver
     * @protected
     * @description Start following the panel's size while the drawer is open, so the drawer grows and
     * shrinks with its content. Resizes are ignored mid-transition and mid-drag, where the size is already
     * being driven deliberately.
     */
    protected setupResizeObserver() {
        let mutex = 0;
        let initializationLock = true;

        gradum(this).on("transitionstart", () => mutex++)
            .on("transitionend", () => {mutex--; initializationLock = false});
        gradum(this.panelContainer).on("transitionstart", () => mutex++)
            .on("transitionend", () => mutex--);

        this.resizeObserver = new ResizeObserver(entries => {
            if (!this.open || this.dragging || mutex > 0 || initializationLock) return;
            const entry = Array.isArray(entries[0].borderBoxSize) ? entries[0].borderBoxSize[0] : entries[0].borderBoxSize;
            const size = entry[this.isVertical ? "blockSize" : "inlineSize"];
            this.translation = (this.open ? this.offset.open : this.offset.closed) + size;
        });
    }
}

/**
 * @function drawer
 * @group Components
 * @category Containers
 *
 * @template {GradumView} ViewType - The element's view type, if initializing MVC.
 * @template {object} DataType - The element's data type, if initializing MVC.
 * @template {GradumModel<DataType>} ModelType - The element's model type, if initializing MVC.
 * @template {GradumEmitter} EmitterType - The element's emitter type, if initializing MVC.
 * @description Create a {@link GradumDrawer}. Shorthand for `GradumDrawer.create(properties)`.
 * @param {GradumDrawerProperties} properties - The drawer's configuration.
 * @returns {GradumDrawer} The created drawer.
 */
function drawer<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
>(properties: GradumDrawerProperties<ViewType, DataType, ModelType, EmitterType>):
    GradumDrawer<ViewType, DataType, ModelType, EmitterType> {
    // if (!properties.tag) properties.tag = "gradum-drawer";
    return GradumDrawer.create(properties) as any;
}

define(GradumDrawer);
export {GradumDrawer, drawer};