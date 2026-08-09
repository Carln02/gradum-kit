import {PopupFallbackMode, GradumPopupProperties} from "./popup.types";
import "./popup.css";
import {define} from "../../../decorators/define/define";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumElement} from "../../../gradumElement/gradumElement";
import {cache} from "../../../decorators/cache/cache";
import {auto} from "../../../decorators/auto/auto";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {div} from "../../../elementCreation/basicElements";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {Point} from "../../datatypes/point/point";
import {DefaultEventName} from "../../../types/eventNaming.types";
import {Direction} from "../../../types/enums.types";
import {Coordinate} from "../../../types/basic.types";
import {effect, signal} from "../../../decorators/reactivity/reactivity";

/**
 * @group Components
 * @category Containers
 */
class GradumPopup<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
    public declare readonly properties: GradumPopupProperties;
    /**
     * @static
     * @description Default properties assigned to a new popup: anchored below its target, kept 4px inside
     * the viewport, and falling back by offsetting horizontally or flipping vertically when it would
     * overflow.
     */
    public static defaultProperties: GradumPopupProperties = {
        popupPosition: {x: 0, y: -100},
        anchorPosition: {x: 0, y: 100},
        viewportMargin: 4,
        offsetFromAnchor: {x: 0, y: 4},
        fallbackModes: {x: PopupFallbackMode.offset, y: PopupFallbackMode.invert}
    }

    /**
     * @static
     * @protected
     * @description The shared container every popup is moved into, appended to the document body on first
     * use. Reparenting popups here keeps them clear of any ancestor that clips or transforms them.
     */
    @auto({defaultValue: div({parent: document.body, id: "gradum-popup-parent-element"})})
    protected static parentElement: HTMLElement;

    /**
     * @description The element this popup positions itself against. Defaults to the document body.
     */
    @signal public anchor: Element = document.body;

    /**
     * @description Which point of the popup is pinned to the anchor, in percentages of its own size —
     * `{x: 0, y: 0}` is its top-left, `{x: 100, y: 100}` its bottom-right. Values are clamped to `0`–`100`.
     */
    @auto({preprocessValue: (value: Coordinate) => new Point(value).bound(0, 100)})
    public set popupPosition(value: Coordinate) {}
    public get popupPosition(): Point {return}

    /**
     * @description Which point of the anchor the popup is pinned to, in percentages of the anchor's size.
     * Values are clamped to `0`–`100`.
     */
    @auto({preprocessValue: (value: Coordinate) => new Point(value).bound(0, 100)})
    public set anchorPosition(value: Coordinate) {}
    public get anchorPosition(): Point {return}

    /**
     * @description The minimum gap in pixels kept between the popup and the viewport edges. Assign a
     * single number to use it for both axes.
     */
    @auto({preprocessValue: (value: Coordinate | number) => new Point(value)})
    public set viewportMargin(value: Coordinate | number) {}
    public get viewportMargin(): Point {return}

    /**
     * @description Extra pixel offset applied after the popup is aligned to its anchor. Assign a single
     * number to use it for both axes.
     */
    @auto({preprocessValue: (value: Coordinate | number) => new Point(value)})
    public set offsetFromAnchor(value: Coordinate | number) {}
    public get offsetFromAnchor(): Point {return}

    /**
     * @description What to do per axis when the popup would overflow the viewport — shift it back into
     * view, or flip it to the anchor's other side. Assign a single mode to use it for both axes.
     */
    @auto({preprocessValue: (value) => typeof value !== "object" ? {x: value, y: value} : value})
    public set fallbackModes(value: PopupFallbackMode | Coordinate<PopupFallbackMode>) {}
    public get fallbackModes(): Coordinate<PopupFallbackMode> {return}

    @cache({clearOnNextFrame: true}) protected get rect(): DOMRect {
        return this.getBoundingClientRect();
    }

    @cache({clearOnNextFrame: true}) protected get anchorRect(): DOMRect {
        return this.anchor.getBoundingClientRect();
    }

    @cache({clearOnNextFrame: true}) protected get computedStyle(): CSSStyleDeclaration {
        return window.getComputedStyle(this);
    }

    @cache({clearOnNextFrame: true}) protected get anchorComputedStyle(): CSSStyleDeclaration {
        return window.getComputedStyle(this.anchor);
    }

    @cache({clearOnNextFrame: true}) protected get computedMargins(): Coordinate {
        return {
            x: parseFloat(this.computedStyle.marginLeft) + parseFloat(this.computedStyle.marginRight),
            y: parseFloat(this.computedStyle.marginTop) + parseFloat(this.computedStyle.marginBottom)
        };
    }

    /**
     * @function initialize
     * @description Set the popup up hidden, and move it into the shared popup container so no ancestor can
     * clip or transform it.
     */
    public initialize() {
        super.initialize();
        this.show(false);
        if (!this.parentElement) gradum(this).addToParent(GradumPopup.parentElement);
    }

    /**
     * @inheritDoc
     */
    protected setupUIListeners(): void {
        super.setupUIListeners();

        document.addEventListener(DefaultEventName.scroll, () => this.show(false), {capture: true, passive: true});
        window.addEventListener(DefaultEventName.resize, () => {if (gradum(this).isShown) this.recomputePosition()}, {passive: true});
        gradum(document.body).on(DefaultEventName.click, e => {
            if (!gradum(this).isShown) return;
            const t = e.target as Node;
            if (this.contains(t)) return;
            if (this.anchor instanceof Node && this.anchor.contains(t)) return;
            this.show(false);
        }, {capture: true});
    }

    @effect private recomputePosition() {
        if (!this.anchor) return;
        gradum(this).setStyles({maxHeight: "", maxWidth: ""}, true);

        const left = this.computeAxis(Direction.horizontal);
        const top = this.computeAxis(Direction.vertical);
        gradum(this).setStyles({left: `${left}px`, top: `${top}px`});

        const maxWidth = Math.max(0, Math.min(
            window.innerWidth - 2 * this.viewportMargin.x,
            window.innerWidth - 2 * this.viewportMargin.x - this.computedMargins.x
        ));
        const maxHeight = Math.max(0, Math.min(
            window.innerHeight - 2 * this.viewportMargin.y,
            window.innerHeight - 2 * this.viewportMargin.y - this.computedMargins.y
        ));

        gradum(this).setStyle("maxWidth", `${maxWidth}px`);
        gradum(this).setStyle("maxHeight", `${maxHeight}px`);
    }

    private computeAxis(direction: Direction): number {
        const axis = direction === Direction.horizontal ? "x" : "y";
        const sizeAxis = direction === Direction.horizontal ? "width" : "height";

        const viewportSize = direction === Direction.horizontal ? window.innerWidth : window.innerHeight;
        const parentStart = this.anchorRect[direction === Direction.horizontal ? "left" : "top"];
        const popupSize = this.rect[sizeAxis] + this.computedMargins[axis];

        const min = this.viewportMargin[axis];
        const max = viewportSize - this.viewportMargin[axis] - popupSize;

        const base = parentStart + (this.anchorRect[sizeAxis] * this.anchorPosition[axis] / 100)
            - (popupSize * this.popupPosition[axis] / 100) + this.offsetFromAnchor[axis];

        const fitsBase = base >= min && base <= max;
        if (fitsBase || this.fallbackModes[axis] === PopupFallbackMode.offset) {
            return Math.min(Math.max(base, min), max);
        }

        const flipped = parentStart + this.anchorRect[sizeAxis] * (1 - this.anchorPosition[axis] / 100)
            - popupSize * (1 - this.popupPosition[axis] / 100) - this.offsetFromAnchor[axis];
        const fitsFlip = flipped >= min && flipped <= max;

        let finalOffset: number;
        if (fitsFlip) finalOffset = flipped;
        else if (fitsBase) finalOffset = base;
        else {
            const pick = Math.abs(base - Math.min(Math.max(base, min), max)) <=
            Math.abs(flipped - Math.min(Math.max(flipped, min), max)) ? base : flipped;
            finalOffset = Math.min(Math.max(pick, min), max);
        }

        return finalOffset;
    }

    /**
     * @function show
     * @description Show or hide the popup. Showing it repositions it against its anchor first, while it is
     * still invisible, so it never appears at a stale position.
     * @param {boolean} b - Whether to show the popup.
     * @returns {this} Itself, allowing for method chaining.
     */
    public show(b: boolean): this {
        if (b) {
            this.style.visibility = "hidden";
            this.style.display = "";
            this.recomputePosition();
            this.style.visibility = "";
            gradum(this).show(true);
        } else {
            gradum(this).setStyles({maxHeight: "", maxWidth: ""}, true).show(false);
        }
        return this;
    }
}

define(GradumPopup);
export {GradumPopup};