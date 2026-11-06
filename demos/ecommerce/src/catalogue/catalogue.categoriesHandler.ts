import {GradumHandler} from "../../../../build/gradum-kit.esm";
import {CatalogueModel} from "./catalogue.model";
import {Product} from "./catalogue.types";

/**
 * @description What goes between the levels of a category path written out as one string, as in
 * `"Toys & Games › Puzzles"`.
 */
export const CategorySeparator = " › ";

/**
 * @description One category, with what is filed under it.
 * @property {string} name - The category's own name — its last level.
 * @property {string} path - Every level down to it, joined with {@link CategorySeparator}. What tells it apart
 * from a category of the same name filed elsewhere.
 * @property {number} count - How many products are filed under it, at any depth.
 * @property {CategoryNode[]} children - The categories one level down, the fullest first.
 */
export type CategoryNode = {
    name: string,
    path: string,
    count: number,
    children: CategoryNode[],
};

/**
 * @class CatalogueCategoriesHandler
 *
 * @extends GradumHandler
 * @description Reads the catalogue's categories as a tree. A product is filed under one path of categories,
 * broadest first; filed under a category means filed under it or anywhere beneath it, so a product in
 * "Toys & Games › Puzzles" is in "Toys & Games" as well.
 *
 * The working is static, since none of it depends on the catalogue: a filter asks it of whichever products
 * it is looking at.
 */
export class CatalogueCategoriesHandler extends GradumHandler<CatalogueModel> {
    public keyName: string = "categories";

    /**
     * @function pathsOf
     * @static
     * @description Every category a product is filed under: its path, and each path above it.
     * @param {Partial<Product>} product - The product.
     * @returns {string[]} The paths, broadest first.
     */
    public static pathsOf(product: Partial<Product>): string[] {
        const levels = product?.categories ?? [];
        return levels.map((_, index) => levels.slice(0, index + 1).join(CategorySeparator));
    }

    /**
     * @function treeOf
     * @static
     * @description The categories some products are filed under, as a tree.
     * @param {Partial<Product>[]} products - The products to file.
     * @returns {CategoryNode} The root — every category, with no name of its own — counting all the products.
     */
    public static treeOf(products: Partial<Product>[]): CategoryNode {
        const root: CategoryNode = {name: "", path: "", count: 0, children: []};
        for (const product of products) {
            root.count++;
            let node = root;
            for (const name of product?.categories ?? []) {
                const path = node.path ? node.path + CategorySeparator + name : name;
                let child = node.children.find(entry => entry.path === path);
                if (!child) node.children.push(child = {name, path, count: 0, children: []});
                child.count++;
                node = child;
            }
        }
        const sort = (node: CategoryNode) => {
            node.children.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
            node.children.forEach(sort);
        };
        sort(root);
        return root;
    }

    /**
     * @function find
     * @static
     * @description The category at a path in a tree.
     * @param {CategoryNode} tree - The tree to look in.
     * @param {string} path - The path. Empty for the root.
     * @returns {CategoryNode} The category, or `undefined` when nothing in the tree is filed there.
     */
    public static find(tree: CategoryNode, path: string): CategoryNode {
        if (!path) return tree;
        let node = tree;
        for (const name of path.split(CategorySeparator)) {
            node = node?.children.find(child => child.name === name);
            if (!node) return undefined;
        }
        return node;
    }

    /**
     * @function tree
     * @description The categories of everything in the catalogue, as a tree. Reads the products, so an
     * effect asking this follows the catalogue.
     * @returns {CategoryNode} The root.
     */
    public tree(): CategoryNode {
        return CatalogueCategoriesHandler.treeOf(this.model.products);
    }
}
