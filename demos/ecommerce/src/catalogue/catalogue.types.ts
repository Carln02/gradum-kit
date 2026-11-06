/**
 * @description One product as the catalogue holds it — everything known about it, whatever is currently
 * shown. Read from the catalogue's source file and normalised, so every field is there even when the file
 * left it out.
 * @property {string} id - What tells this product apart from every other.
 * @property {string} name - What the product is called.
 * @property {string[]} categories - Where it is filed, broadest first. Empty for a product filed nowhere.
 * @property {number} price - What it costs.
 * @property {ProductDescription} description - What the product is, in words.
 * @property {Record<string, PropertyValue>} properties - Measurements and facts — weight, length,
 * recommended age, manufacturer, and so on. Numbers are in the units {@link Units} names for their key.
 * @property {string[]} images - Sources of its pictures, the main one first.
 */
export type Product = {
    id: string,
    name: string,
    categories: string[],
    price: number,
    description: ProductDescription,
    properties: Record<string, PropertyValue>,
    images: string[],
};

/**
 * @description One of a product's properties: a measurement, a range of them — a recommended age of 3 to 10
 * years, say — or a fact in words.
 */
export type PropertyValue = number | string | PropertyRange;

/**
 * @description A range of measurements. Either end may be missing, for a range open on that side.
 * @property {number | null} [min] - The low end.
 * @property {number | null} [max] - The high end.
 */
export type PropertyRange = {
    min?: number | null,
    max?: number | null,
};

/**
 * @description What a product is, in words.
 * @property {string[]} highlights - Its selling points, one sentence or so each.
 * @property {string} text - The longer description.
 */
export type ProductDescription = {
    highlights: string[],
    text: string,
};

/**
 * @description What the numbers in the catalogue are measured in, as read from its units file.
 * @property {string} price - The currency prices are in.
 * @property {Record<string, string>} properties - The unit of each numeric property, by key.
 */
export type Units = {
    price: string,
    properties: Record<string, string>,
};

/**
 * @description Properties to create a {@link Catalogue}.
 * @property {string} [source] - URL of the JSON listing the products. Assigning it loads them.
 * @property {string} [unitsSource] - URL of the JSON naming the units the products are measured in.
 */
export type CatalogueProperties = {
    source?: string,
    unitsSource?: string,
};
