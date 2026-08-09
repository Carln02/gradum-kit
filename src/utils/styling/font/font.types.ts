/**
 * @type {FontProperties}
 * @group Utilities
 * @category Font
 *
 * @description Describes a local font to load with {@link loadLocalFont} — either a single file or a whole
 * family living in one directory. Which of the two is inferred from `pathOrDirectory`: a path with a file
 * extension is treated as one font, a path without one as a directory of them.
 * @property {string} name - The font family name to register it under. For a family, each file must also be
 * named `name-subName`, matching the keys of `stylesPerWeights`.
 * @property {string} pathOrDirectory - Path to the font file, or to the directory holding the family.
 * @property {Record<string, string> | Record<number, Record<string, string>>} [stylesPerWeights] - For a single
 * font, a `{weight: style}` record, defaulting to `{"normal": "normal"}`. For a family, a
 * `{weight: {subName: style}}` record, defaulting to common sub-names and styles for weights 100 through 900.
 * @property {string} [format="woff2"] - The font format declared in the generated `@font-face` rule.
 * @property {string} [extension=".ttf"] - The file extension of the family's files. A missing leading dot is
 * added for you.
 */
type FontProperties = {
    name: string,
    pathOrDirectory: string,
    stylesPerWeights?: Record<string, string> | Record<number, Record<string, string>>,
    format?: string,
    extension?: string
};

export {FontProperties};