import {
    DefaultEventName, div, effect, element, GradumIcon, GradumView, gradum, img, signal
} from "../../../../build/gradum-kit.esm";
import type {Carousel} from "./carousel";

/**
 * @class CarouselView
 *
 * @extends GradumView
 * @description One picture at a time, with an arrow either side to go to the one before or after, and a
 * dot per picture along the bottom saying which one this is. Going past either end comes round to the
 * other. With a single picture there is nowhere to go, so neither the arrows nor the dots are shown.
 */
export class CarouselView extends GradumView<Carousel> {
    @signal public images: string[] = [];
    @signal public index: number = 0;
    @signal public alt: string = "";

    protected picture: HTMLImageElement;
    protected previousButton: HTMLElement;
    protected nextButton: HTMLElement;
    protected dots: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();
        this.picture = img({classes: "carousel-picture"});
        this.previousButton = element({
            tag: "button", classes: ["carousel-arrow", "carousel-previous"], title: "Previous picture",
            children: GradumIcon.create({icon: "chevron-left"})
        });
        this.nextButton = element({
            tag: "button", classes: ["carousel-arrow", "carousel-next"], title: "Next picture",
            children: GradumIcon.create({icon: "chevron-right"})
        });
        this.dots = div({classes: "carousel-dots"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([this.picture, this.previousButton, this.nextButton, this.dots]);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this.previousButton).on(DefaultEventName.click, () => this.element.turn(-1));
        gradum(this.nextButton).on(DefaultEventName.click, () => this.element.turn(1));
    }

    @effect protected updatePicture() {
        const source = this.images[this.element.current];
        gradum(this).toggleClass("empty", !source);
        if (source) this.picture.src = source;
        else this.picture.removeAttribute("src");
        this.picture.alt = this.alt;
    }

    /**
     * @description Rebuild the dots when the pictures change. Which one is lit is marked by
     * {@link CarouselView.markDot}, so turning does not rebuild them.
     * @protected
     */
    @effect protected updateDots() {
        const count = this.images.length;
        this.dots.replaceChildren(...Array.from({length: count}, () => div({classes: "carousel-dot"})));
        gradum(this).toggleClass("single", count <= 1);
    }

    @effect protected markDot() {
        this.images;
        const current = this.element.current;
        Array.from(this.dots.children).forEach((dot, index) =>
            gradum(dot).toggleClass("current", index === current));
    }
}
