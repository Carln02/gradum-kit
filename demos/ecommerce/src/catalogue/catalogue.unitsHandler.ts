import {GradumHandler} from "../../../../build/gradum-kit.esm";
import {CatalogueModel} from "./catalogue.model";
import {formatPrice} from "../utils";
import {PropertyValue} from "./catalogue.types";

/**
 * @class CatalogueUnitsHandler
 *
 * @extends GradumHandler
 * @description Writes a product's numbers out the way a person reads them: with their unit, rounded, and
 * under a label rather than a key.
 *
 * Reads the units from the model as it goes, so anything showing a formatted value from inside an `@effect`
 * is shown again once the units file has been read.
 */
export class CatalogueUnitsHandler extends GradumHandler<CatalogueModel> {
    public keyName: string = "units";

    /**
     * @function format
     * @description A property's value, ready to show: a number rounded to two places and followed by its
     * unit, a range as its two ends — `"3–10 years"`, or `"14+ years"` when it is open above — and anything
     * else as it is.
     * @param {string} key - The property's key, which is what its unit is listed under.
     * @param {PropertyValue} value - The value.
     * @returns {string} The value as text.
     */
    public format(key: string, value: PropertyValue): string {
        if (value === null || value === undefined) return "";
        if (typeof value === "string") return value;

        let text: string;
        if (typeof value === "number") text = this.round(value);
        else {
            const min = typeof value.min === "number" ? this.round(value.min) : undefined;
            const max = typeof value.max === "number" ? this.round(value.max) : undefined;
            if (min !== undefined && max !== undefined) text = min === max ? min : `${min}–${max}`;
            else if (min !== undefined) text = `${min}+`;
            else if (max !== undefined) text = `up to ${max}`;
            else return "";
        }

        const unit = this.model.units?.properties?.[key];
        return unit ? `${text} ${unit}` : text;
    }

    /**
     * @function formatPrice
     * @description A price, ready to show.
     * @param {number} value - The price.
     * @returns {string} The price as text.
     */
    public formatPrice(value: number): string {
        return formatPrice(value);
    }

    /**
     * @function label
     * @description What to call a property: its key, split into words — `shippingWeight` reads
     * "Shipping weight".
     * @param {string} key - The property's key.
     * @returns {string} The label.
     */
    public label(key: string): string {
        const words = String(key ?? "").replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
        return words.charAt(0).toUpperCase() + words.slice(1);
    }

    /**
     * @function order
     * @description The keys of a product's properties in the order to show them: measurements first, then
     * everything said in words, then the catalogue's own reference numbers, which nobody shopping looks for.
     * @param {Record<string, PropertyValue>} properties - The product's properties.
     * @returns {string[]} The keys, in order.
     */
    public order(properties: Record<string, PropertyValue>): string[] {
        const rank = (key: string) => key === "asin" ? 2 : typeof properties[key] === "string" ? 1 : 0;
        return Object.keys(properties ?? {}).sort((a, b) => rank(a) - rank(b));
    }

    /**
     * @description A number to two places at most, without trailing zeros.
     * @param {number} value - The number.
     * @returns {string} It as text.
     * @protected
     */
    protected round(value: number): string {
        return String(Math.round(value * 100) / 100);
    }
}
