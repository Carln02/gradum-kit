import {effect, GradumHandler, randomId} from "../../../../build/gradum-kit.esm";
import {CatalogueModel} from "./catalogue.model";
import {Product, Units} from "./catalogue.types";

/**
 * @description Make one entry of a source file into a {@link Product}, filling in whatever it left out, so
 * nothing reading a product has to ask whether a field is there.
 * @param {Partial<Product>} read - The entry as read.
 * @returns {Product} The product.
 * @internal
 */
const toProduct = (read: Partial<Product>): Product => ({
    id: read?.id ?? randomId(),
    name: read?.name ?? "",
    categories: Array.isArray(read?.categories) ? read.categories : [],
    price: typeof read?.price === "number" ? read.price : 0,
    description: {
        highlights: Array.isArray(read?.description?.highlights) ? read.description.highlights : [],
        text: read?.description?.text ?? "",
    },
    properties: read?.properties ?? {},
    images: Array.isArray(read?.images) ? read.images : [],
});

/**
 * @class CatalogueSourceHandler
 *
 * @extends GradumHandler
 * @description Reads the catalogue's products and units from wherever it was pointed.
 *
 * Fetching and making sense of a file touches nothing but the model — a source to read, a list to fill — so
 * it is a handler. Naming a source is all the catalogue has to do: this watches the names and goes and reads
 * them.
 */
export class CatalogueSourceHandler extends GradumHandler<CatalogueModel> {
    public keyName: string = "source";

    @effect protected followSource() {
        const source = this.model.source;
        if (source) void this.read(source);
    }

    @effect protected followUnitsSource() {
        const source = this.model.unitsSource;
        if (source) void this.readUnits(source);
    }

    /**
     * @function read
     * @description Read a file of products and list them. The file may be either a bare array of products or
     * an object with them under `products`.
     *
     * A file that cannot be read leaves the catalogue empty and says so in the console rather than throwing:
     * a shop with nothing on offer is a better failure than a page that never finishes loading.
     * @param {string} source - URL to read from.
     * @returns {Promise<Product[]>} What ended up listed.
     */
    public async read(source: string): Promise<Product[]> {
        if (!source) return [];
        try {
            const read = await this.fetchJson(source);
            const products = Array.isArray(read) ? read : read?.products;
            this.model.products = Array.isArray(products) ? products.map(toProduct) : [];
        } catch (error) {
            console.warn(`Catalogue could not read its products from "${source}":`, error);
            this.model.products = [];
        }
        return this.model.products;
    }

    /**
     * @function readUnits
     * @description Read a file of units. A file that cannot be read leaves the numbers without units, and
     * says so in the console.
     * @param {string} source - URL to read from.
     * @returns {Promise<Units>} The units now in use.
     */
    public async readUnits(source: string): Promise<Units> {
        if (!source) return this.model.units;
        try {
            const read = await this.fetchJson(source);
            this.model.units = {price: read?.price ?? "", properties: read?.properties ?? {}};
        } catch (error) {
            console.warn(`Catalogue could not read its units from "${source}":`, error);
        }
        return this.model.units;
    }

    protected async fetchJson(source: string): Promise<any> {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.json();
    }
}
