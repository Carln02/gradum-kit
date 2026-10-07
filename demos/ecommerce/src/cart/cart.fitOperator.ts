import {effect, GradumOperator, gradum} from "../../../../build/gradum-kit.esm";
import {Cart} from "./cart";
import {CartModel} from "./cart.model";
import {CartView} from "./cart.view";

/**
 * @class CartFitOperator
 *
 * @extends GradumOperator
 * @description Works out whether what a cart holds fits in the area it was drawn, and says so.
 *
 * Measuring is the same job however the answer is acted on, so it is done here once: the contents are let
 * go of, measured at their natural size, and the shortfall handed to {@link CartFitOperator.fit}. Every
 * pass then fires `fits` or `overflowed` on the cart's emitter — the outcome rather than the measurement,
 * so a cart that overflowed and was made to fit reports that it fits — and the view can show the state
 * without measuring anything itself.
 *
 * Swap the subclass to change what happens when the contents do not fit — see {@link CartScrollFitOperator},
 * {@link CartShrinkFitOperator} and {@link CartGrowFitOperator}. All three answer to the key `"fit"`, so one
 * can be taken out and another put in:
 *
 * ```ts
 * gradum(cart).removeOperator("fit").addOperator(new CartShrinkFitOperator());
 * ```
 */
export abstract class CartFitOperator extends GradumOperator<Cart, CartView, CartModel> {
    public keyName: string = "fit";

    @effect protected checkFit() {
        //What has to fit, and what it has to fit in. Read outright: these are the signals this pass follows.
        this.model.items;
        this.model.size;

        //Whatever the last pass did is undone before measuring, so what is measured is the contents at
        //their natural size rather than the last answer. Reading the page is not reading a signal, so
        //nothing measured here brings this effect round again — only the two above do.
        this.release();

        const available = this.availableHeight();
        const needed = this.neededHeight();
        const overflow = needed - available;

        const resolved = overflow <= 0 || this.fit(overflow, needed, available);
        this.emitter.fire(resolved ? "fits" : "overflowed", {needed, available, overflow});
    }

    /**
     * @description Act on the shortfall. Called only when there is one — a pass that fits has nothing to do,
     * since {@link CartFitOperator.release} has already put back whatever the last one did.
     * @param {number} overflow - How much taller the contents are than the room for them. Always above zero.
     * @param {number} needed - The height the contents come to.
     * @param {number} available - The height there is for them.
     * @returns {boolean} Whether the contents now fit. What the cart reports, so answer for what was
     * actually achieved rather than for what was attempted.
     * @protected
     */
    protected abstract fit(overflow: number, needed: number, available: number): boolean;

    /**
     * @description Undo whatever this operator last did, so the next measurement is of the contents rather
     * than of the last answer. Nothing to undo by default.
     * @protected
     */
    protected release(): void {}

    /**
     * @description Let go of the cart, putting back whatever was changed on the way.
     *
     * A fit operator writes to the page, and taking one out does not unwrite it: the one put in its place
     * only knows how to undo its own kind of change, so a cart swapped from shrinking to growing would keep
     * the shrunken cards forever. Cleaning up here is what makes the swap a swap.
     */
    public detach() {
        this.release();
        super.detach();
    }

    /**
     * @description The height there is for the contents: the area the cart was drawn, less its header and
     * the padding under the cards.
     *
     * Taken from the model rather than the page, so it does not depend on the view having already written
     * the new size out.
     * @returns {number} The available height in pixels.
     * @protected
     */
    protected availableHeight(): number {
        const style = getComputedStyle(this.element);
        const padding = Number.parseFloat(style.paddingBottom) || 0;
        const borders = (Number.parseFloat(style.borderTopWidth) || 0)
            + (Number.parseFloat(style.borderBottomWidth) || 0);
        return this.model.size.y - this.view.header.offsetHeight - padding - borders;
    }

    /**
     * @description The height the cards come to, gaps included — the one that has to be measured off the
     * page, since only the page knows how tall a card is.
     * @returns {number} The needed height in pixels.
     * @protected
     */
    protected neededHeight(): number {
        const items = this.element.itemElements;
        if (items.length === 0) return 0;

        const gap = Number.parseFloat(getComputedStyle(this.element).rowGap) || 0;
        //One gap per card: the cart's flex gap sits between the header and the first card as well as
        //between the cards.
        return items.reduce((sum, item) => sum + item.offsetHeight, 0) + gap * items.length;
    }
}

/**
 * @class CartScrollFitOperator
 *
 * @extends CartFitOperator
 * @description Lets the contents run past the area and scrolls to what was just put in.
 *
 * The cards keep their size and the cart keeps the area it was drawn; what does not fit is simply below the
 * fold. Scrolling the last card into view is what keeps a drop from disappearing. The only one of the three
 * that leaves the contents overflowing, and says so.
 */
export class CartScrollFitOperator extends CartFitOperator {
    protected fit(): boolean {
        this.element.itemElements.at(-1)?.scrollIntoView({block: "nearest"});
        return false;
    }
}

/**
 * @class CartShrinkFitOperator
 *
 * @extends CartFitOperator
 * @description Shrinks the cards until they fit.
 *
 * Works out the fraction of their natural size the cards may take and hands it to the stylesheet as
 * `--cart-fit-scale`, which the in-cart card rules measure themselves against. Down to
 * {@link CartShrinkFitOperator.minimumScale} and no further: past that the cards stop being readable, and
 * overflowing is the better failure.
 */
export class CartShrinkFitOperator extends CartFitOperator {
    /**
     * @description How small the cards may be made, as a fraction of their natural size.
     */
    public minimumScale: number = 0.6;

    protected fit(overflow: number, needed: number, available: number): boolean {
        const wanted = needed > 0 ? available / needed : 1;
        this.setScale(Math.max(this.minimumScale, wanted));
        //Bottoming out is a failure to fit, not a fit at the smallest size, and the cart should say so.
        return wanted >= this.minimumScale;
    }

    protected release() {
        this.setScale(1);
    }

    /**
     * @description Hand the stylesheet the fraction to draw the cards at. Set as a custom property rather
     * than through `setStyle`, which writes named style fields and cannot reach one of these.
     * @param {number} scale - The fraction of their natural size.
     * @protected
     */
    protected setScale(scale: number) {
        this.element.style.setProperty("--cart-fit-scale", String(scale));
    }
}

/**
 * @class CartGrowFitOperator
 *
 * @extends CartFitOperator
 * @description Grows the cart until its contents fit.
 *
 * The area drawn on the canvas becomes a minimum rather than a limit: the cards keep their size and the
 * rectangle stretches under them. Written as a floor on the element rather than back into
 * {@link CartModel.size}, so the size the cart was drawn is still the size it remembers — and so this pass
 * does not set the signal that brings it round again.
 */
export class CartGrowFitOperator extends CartFitOperator {
    protected fit(overflow: number): boolean {
        gradum(this.element).setStyle("minHeight", `${this.model.size.y + overflow}px`, true);
        return true;
    }

    protected release() {
        gradum(this.element).setStyle("minHeight", "", true);
    }
}
