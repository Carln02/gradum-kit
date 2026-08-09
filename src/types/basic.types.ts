/**
 * @type {KeyType}
 * @group Types
 * @category Basics
 *
 * @description Any value usable as an object key. Key paths throughout the MVC layer — model data,
 * observers, {@link GradumNestedMap} — are arrays of these.
 */
type KeyType = string | number | symbol;

/**
 * @type {FlatKeyType}
 * @group Types
 * @category Basics
 *
 * @description A whole key path collapsed into one value, so a nested entry can be addressed without an
 * array. Fully numeric paths flatten to a number; anything else to a `"k0|k1|k2"` string.
 */
type FlatKeyType = string | number;

/**
 * @type {FlexRect}
 * @group Types
 * @category Basics
 *
 * @description A rectangle where every field is optional, for describing only the edges you care about.
 * Sides and dimensions may be mixed, and any that are omitted are left to the caller to infer.
 * @property {number} [top] - Distance from the top edge.
 * @property {number} [bottom] - Distance from the bottom edge.
 * @property {number} [left] - Distance from the left edge.
 * @property {number} [right] - Distance from the right edge.
 * @property {number} [x] - Horizontal origin.
 * @property {number} [y] - Vertical origin.
 * @property {number} [width] - Width of the rectangle.
 * @property {number} [height] - Height of the rectangle.
 */
type FlexRect = {
    top?: number,
    bottom?: number,
    left?: number,
    right?: number,
    x?: number,
    y?: number,
    width?: number,
    height?: number
};

/**
 * @type {Coordinate}
 * @group Types
 * @category Basics
 *
 * @template Type - The type of each component. Defaults to `number`.
 * @description A pair of values on the x and y axes. Generic so the same shape can carry something other
 * than numbers, such as a coordinate per axis expressed as a range.
 * @property {Type} x - The horizontal component.
 * @property {Type} y - The vertical component.
 */
type Coordinate<Type = number> = {
    x: Type;
    y: Type;
};

/**
 * @type {PartialRecord}
 * @group Types
 * @category Basics
 *
 * @template {keyof any} Property - The union of allowed keys.
 * @template Value - The type stored at each key.
 * @description A `Record` whose every key is optional. Use it to accept any subset of a known set of keys.
 */
type PartialRecord<Property extends keyof any, Value> = { [P in Property]?: Value };

export {KeyType, FlatKeyType, PartialRecord, FlexRect, Coordinate};