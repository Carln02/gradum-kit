import {GradumModel, handler, signal} from "../../../../build/gradum-kit.esm";
import {CatalogueSourceHandler} from "./catalogue.sourceHandler";
import {CatalogueUnitsHandler} from "./catalogue.unitsHandler";
import {CatalogueCategoriesHandler} from "./catalogue.categoriesHandler";
import {Product, Units} from "./catalogue.types";

/**
 * @class CatalogueModel
 *
 * @extends GradumModel
 * @description Everything on offer, and what it is measured in. Read once, from the files the catalogue was
 * pointed at, and shared by everything that lists or describes a product.
 */
export class CatalogueModel extends GradumModel {
    /**
     * @description Every product the catalogue knows about, as read from its source.
     */
    @signal public products: Product[] = [];

    /**
     * @description What the products' numbers are measured in. Empty until the units file has been read.
     */
    @signal public units: Units = {price: "", properties: {}};

    /**
     * @description Where the products are read from. Naming a source is all it takes; the source handler
     * watches this and goes and reads it.
     */
    @signal public source: string = "";

    /**
     * @description Where the units are read from, the same way.
     */
    @signal public unitsSource: string = "";

    /**
     * @description Reading the products and units from the files they were pointed at.
     */
    @handler() public sourceHandler: CatalogueSourceHandler;

    /**
     * @description Writing a product's numbers out with their units.
     */
    @handler() public unitsHandler: CatalogueUnitsHandler;

    /**
     * @description Reads the products' categories as a tree.
     */
    @handler() public categoriesHandler: CatalogueCategoriesHandler;
}
