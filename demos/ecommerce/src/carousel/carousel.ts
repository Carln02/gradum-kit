import {define, expose, GradumElement, GradumElementProperties} from "../../../../build/gradum-kit.esm";
import {CarouselView} from "./carousel.view";
import "./carousel.css";

/**
 * @description Properties to create a {@link Carousel}.
 * @property {string[]} [images] - The pictures' sources, in order.
 * @property {number} [index=0] - Which picture to start on.
 * @property {string} [alt] - What the pictures are of, for whoever cannot see them.
 */
export type CarouselProperties = GradumElementProperties<CarouselView> & {
    images?: string[],
    index?: number,
    alt?: string,
};

/**
 * @class Carousel
 *
 * @extends GradumElement
 * @description A set of pictures shown one at a time, turned through with an arrow either side.
 *
 * @example
 * ```ts
 * const carousel = Carousel.create({images: product.images, alt: product.name});
 * carousel.turn(1);
 * ```
 */
export class Carousel extends GradumElement<CarouselView> {
    public declare properties: CarouselProperties;
    public static defaultProperties: CarouselProperties = {
        view: CarouselView,
    };

    @expose("view") public images: string[];
    @expose("view") public index: number;
    @expose("view") public alt: string;

    /**
     * @readonly
     * @description The picture being shown, as an index that is always among the pictures — `index` brought
     * round into range. `0` when there are none.
     */
    public get current(): number {
        const count = this.images?.length ?? 0;
        if (!count) return 0;
        return ((Math.trunc(this.index ?? 0) % count) + count) % count;
    }

    /**
     * @function turn
     * @description Go forward or back through the pictures, coming round at either end.
     * @param {number} by - How many to go by: `1` for the next, `-1` for the one before.
     */
    public turn(by: number) {
        this.index = this.current + by;
    }
}

define(Carousel, "demo-carousel");
