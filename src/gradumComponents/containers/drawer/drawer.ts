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
 * @category GradumDrawer
 */
class GradumDrawer<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel = GradumModel,
    EMitterType extends GradumEmitter = GradumEmitter
> extends GradumElement<ViewType, DataType, ModelType, EMitterType> {
     public declare readonly properties: GradumDrawerProperties;

    private _panelContainer: HTMLElement;
    public get panelContainer(): HTMLElement {return this._panelContainer}

    private dragging: boolean = false;

    protected resizeObserver: ResizeObserver;

    @auto({
        setIfUndefined: true,
        callBefore: function () {if (this.thumb) gradum(this).remChild(this.thumb)},
        preprocessValue: (value: GradumProperties | HTMLElement) => value instanceof HTMLElement ? value : div(value)
    }) public set thumb(value: GradumProperties | HTMLElement) {
        gradum(value).addClass("gradum-drawer-thumb");
        if (this.initialized) this.setupUILayout();
    }

    public get thumb(): HTMLElement {return}

    @auto({
        setIfUndefined: true,
        callBefore: function () {if (this.panel) gradum(this).remChild(this.panel)},
        preprocessValue: (value: GradumProperties | HTMLElement) =>
            value instanceof HTMLElement ? value : div(value)
    }) public set panel(value: GradumProperties | HTMLElement) {
        gradum(value).addClass("gradum-drawer-panel");
        if (this.initialized) this.setupUILayout();
    }

    public get panel(): HTMLElement {return}

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

    @auto({defaultValue: false}) public set hideOverflow(value: boolean) {
        gradum(this.panelContainer).setStyle("overflow", value ? "hidden" : "");
    }

    @auto({defaultValue: false}) public set attachSideToIconName(value: boolean) {
        if (this.icon instanceof GradumIconSwitch) this.icon.appendStateToIconName = value;
        if (value) this.rotateIconBasedOnSide = false;
    }

    @auto({defaultValue: false}) public set rotateIconBasedOnSide(value: boolean) {
        if (value) this.attachSideToIconName = false;
        if (this.icon instanceof GradumIconSwitch) this.icon.switchReifect.styles = {
            top: "transform: rotate(180deg)",
            bottom: "transform: rotate(0deg)",
            left: "transform: rotate(90deg)",
            right: "transform: rotate(270deg)",
        };
    }

    @auto({defaultValue: Side.bottom, cancelIfUnchanged: false}) public set side(value: Side) {
        gradum(this).toggleClass("top-drawer", value == Side.top)
            .toggleClass("bottom-drawer", value == Side.bottom)
            .toggleClass("left-drawer", value == Side.left)
            .toggleClass("right-drawer", value == Side.right);
        this.refresh();
    }

    @auto({
        defaultValue: {open: 0, closed: 0},
        preprocessValue: (value: number | PartialRecord<Open, number>) =>
            typeof value === "number" ? {open: value, closed: value} : {
                open: value?.open || 0,
                closed: value?.closed || 0
            }
    }) public set offset(value: number | PartialRecord<Open, number>) {}

    public get offset(): PartialRecord<Open, number> {return}

    public get isVertical() {
        return this.side == Side.top || this.side == Side.bottom;
    }

    @auto({defaultValue: false}) public set open(value: boolean) {
        if (value) this.resizeObserver?.observe(this.panel, {box: "border-box"});
        else this.resizeObserver?.unobserve(this.panel);
        this.refresh();
    }

    @auto() private set translation(value: number) {
        switch (this.side) {
            case Side.top:
                if (this.hideOverflow) gradum(this.panelContainer).setStyle("height", value + "px");
                else gradum(this).setStyle("transform", `translateY(${-value}px)`);
                break;
            case Side.bottom:
                if (this.hideOverflow) gradum(this.panelContainer).setStyle("height", value + "px");
                else gradum(this).setStyle("transform", `translateY(${-value}px)`);
                break;
            case Side.left:
                if (this.hideOverflow) gradum(this.panelContainer).setStyle("width", value + "px");
                else gradum(this).setStyle("transform", `translateX(${-value}px)`);
                break;
            case Side.right:
                if (this.hideOverflow) gradum(this.panelContainer).setStyle("width", value + "px");
                else gradum(this).setStyle("transform", `translateX(${-value}px)`);
                break;
        }
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

    public get translation(): number {return}

    public initialize() {
        super.initialize();
        gradum(this).show(false);
        this.enableTransition(false);

        this.setupResizeObserver();
        this.open = false;
        requestAnimationFrame(() => {
            gradum(this).show(true);
            this.enableTransition(true);
        });
    }

    protected setupUIElements() {
        super.setupUIElements();
        this._panelContainer = div({classes: "gradum-drawer-panel-container"});
    }

    protected setupUILayout() {
        super.setupUILayout();

        gradum(this).childHandler = this;
        const panelChildren = gradum(this).childrenArray.filter(el => el !== this.panelContainer && el !== this.thumb);
        gradum(this).addChild([this.thumb, this.panelContainer]);
        gradum(this.panel).addChild(panelChildren);
        gradum(this.panelContainer).addChild(this.panel);
        gradum(this.thumb).addChild(this.icon);
        gradum(this).childHandler = this.panel;
    }

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

    public refresh() {
        if (this.hideOverflow) gradum(this.panel).setStyle("position", "absolute", true);
        if (this.icon instanceof GradumIconSwitch) this.icon.switchReifect.apply(this.open ? this.getOppositeSide() : this.side);

        requestAnimationFrame(() => {
            this.translation = (this.open ? this.offset.open : this.offset.closed)
                + (this.open ? (this.isVertical ? this.panel.offsetHeight : this.panel.offsetWidth) : 0);
            if (this.hideOverflow) gradum(this.panel).setStyle("position", "relative", true);
        });
    }

    protected enableTransition(b: boolean) {
        this.transition.enabled = b;
        this.transition.apply();
    }

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
 * @group Components
 * @category GradumDrawer
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