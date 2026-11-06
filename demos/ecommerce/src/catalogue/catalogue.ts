import {expose, GradumHeadlessElement} from "../../../../build/gradum-kit.esm";
import {CatalogueModel} from "./catalogue.model";
import {CatalogueSourceHandler} from "./catalogue.sourceHandler";
import {CatalogueUnitsHandler} from "./catalogue.unitsHandler";
import {CatalogueCategoriesHandler} from "./catalogue.categoriesHandler";
import {CatalogueProperties, Product, PropertyValue, Units} from "./catalogue.types";

/**
 * @class Catalogue
 *
 * @extends GradumHeadlessElement
 * @description Everything on offer, loaded once and shared. A collection stocked from the catalogue lists
 * its products, and an item's details panel asks it how to write the product's numbers out.
 *
 * Headless: nothing about it is drawn. It is an element rather than a bare model only so that it is made
 * the way everything else is, with its handlers wired in from its defaults.
 */
export class Catalogue extends GradumHeadlessElement<any, any, CatalogueModel> {
    public declare properties: CatalogueProperties;
    public static defaultProperties = {
        model: CatalogueModel,
        handlers: [CatalogueSourceHandler, CatalogueUnitsHandler, CatalogueCategoriesHandler],
    };

    /**
     * @description Where the products are read from. Assigning it loads them, replacing whatever the
     * catalogue was listing.
     */
    @expose("model") source: string;

    /**
     * @description Where the units are read from. Assigning it loads them.
     */
    @expose("model") unitsSource: string;

    /**
     * @readonly
     * @description Every product on offer.
     */
    @expose("model", false) products: Product[];

    /**
     * @readonly
     * @description What the products' numbers are measured in.
     */
    @expose("model", false) units: Units;

    /**
     * @function load
     * @description Read the products again, now, rather than waiting for the source to change. Use it to
     * pick up a file that has been edited since it was last read.
     * @param {string} [source=this.source] - URL to read from.
     * @returns {Promise<Product[]>} What ended up listed.
     */
    public async load(source: string = this.source): Promise<Product[]> {
        return this.model.sourceHandler.read(source);
    }

    /**
     * @function format
     * @description A product's property, ready to show. See {@link CatalogueUnitsHandler.format}.
     * @param {string} key - The property's key.
     * @param {PropertyValue} value - Its value.
     * @returns {string} The value as text.
     */
    public format(key: string, value: PropertyValue): string {
        return this.model.unitsHandler.format(key, value);
    }

    /**
     * @function label
     * @description What to call a property. See {@link CatalogueUnitsHandler.label}.
     * @param {string} key - The property's key.
     * @returns {string} The label.
     */
    public label(key: string): string {
        return this.model.unitsHandler.label(key);
    }
}
