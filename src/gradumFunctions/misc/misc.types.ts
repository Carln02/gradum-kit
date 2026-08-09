/**
 * @constant
 * @group GradumSelector
 * @category Misc
 * @description Default array-like keys to merge when applying defaults with {@link GradumSelector.applyDefaults}.
 */
const ApplyDefaultsMergeProperties = ["interactors", "tools", "constrainers", "operators", "handlers"] as const;

/**
 * @type {ApplyDefaultsOptions}
 * @group GradumSelector
 * @category Misc
 *
 * @description Options for {@link GradumSelector.applyDefaults}.
 * @property {string[]} [mergeProperties] - Array-like keys to merge. Defaults to {@link ApplyDefaultsMergeProperties}.
 * @property {boolean} [removeDuplicates] - Whether to remove duplicates when merging arrays. Defaults to `true`.
 */
type ApplyDefaultsOptions = {
    mergeProperties?: string[],
    removeDuplicates?: boolean
};

declare module "../gradumSelector" {
    interface GradumSelector {
        /**
         * @category Misc
         * @description Execute a callback on the node while still benefiting from chaining.
         * @param {(el: this) => void} callback The function to execute, with 1 parameter representing the instance
         * itself.
         * @returns {this} Itself, allowing for method chaining.
         */
        execute(callback: ((el: this) => void)): this;

        /**
         * @category Misc
         * @description Assign every given property onto the element, overwriting existing values.
         * @param {object} properties - The properties to assign.
         * @returns {this} Itself, allowing for method chaining.
         */
        apply(properties: Partial<this["element"]> & Record<string, any>): this;

        /**
         * @category Misc
         * @description Delete the given fields from the element.
         * @param {(keyof this["element"] | string)[]} keys - The field names to remove.
         * @returns {this} Itself, allowing for method chaining.
         */
        removeFields(keys: (keyof this["element"] | string)[]): this;

        /**
         * @category Misc
         * @description Read the element's current values for the given keys, to capture them before overwriting.
         * @param {(keyof this["element"] | string)[]} defaults - The field names to read.
         * @returns {object} The current value of each requested field.
         */
        getDefaults(defaults: (keyof this["element"] | string)[]): Partial<this["element"]> & Record<string, any>;

        /**
         * @category Misc
         * @description The fields the element and the given object both have, with the element's values.
         * @param {object} other - The object to compare against.
         * @returns {object} The shared fields. Neither input is modified.
         */
        getIntersection(other: Partial<this["element"]> & Record<string, any>): Partial<this["element"]> & Record<string, any>;

        /**
         * @category Misc
         * @description The fields where the element and the given object disagree, with the element's values.
         * @param {object} other - The object to compare against.
         * @returns {object} The differing fields. Neither input is modified.
         */
        getDifference(other: Partial<this["element"]> & Record<string, any>): Partial<this["element"]> & Record<string, any>;

        /**
         * @category Misc
         * @description Read the given fields off the element into a plain object, leaving the element unchanged.
         * @param {(keyof this["element"] | string)[]} keys - The field names to extract.
         * @returns {object} The requested fields and their values.
         */
        extract(keys: (keyof this["element"] | string)[]): Partial<this["element"]> & Record<string, any>;

        /**
         * @function applyDefaults
         * @category Misc
         * @description Apply default properties to the underlying object, with optional smart merging for
         * array-like keys. By default, merging will happen on all MVC properties that accept arrays (like
         * `operators`, `handlers`, `tools`, etc.) to allow for concatenation of such MVC pieces.
         * @param {Record<string, any>} defaults - Key/value map of defaults to apply on the object.
         * @param {ApplyDefaultsOptions} [options] - Optional configuration for merging keys.
         * @returns {this} The same selector instance for chaining.
         *
         * @example
         * ```ts
         * const properties = {...};
         * gradum(properties).applyDefaults({
         *   tag: "my-el",
         *   view: MyElementView,
         *   tools: [selectTool, panTool],
         *   operators: KeyboardOperator
         * });
         * ```
         */
        applyDefaults(defaults: Partial<this["element"]> & Record<string, any>, options?: ApplyDefaultsOptions): this;
    }
}

export {ApplyDefaultsOptions, ApplyDefaultsMergeProperties};