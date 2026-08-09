/**
 * @type {ScopedKey}
 * @group Components
 * @category Data Structures
 *
 * @template KeyType - The per-item key type.
 * @template BlockKeyType - The block-grouping key type.
 * @description An item key together with the block it belongs to, used to address an entry that is
 * scoped to one block rather than to the store as a whole.
 * @property {BlockKeyType} [blockKey] - The block the item belongs to. Omit it to target the default block.
 * @property {KeyType} [key] - The item's key inside that block.
 */
type ScopedKey<KeyType = any, BlockKeyType = any> = {
    blockKey?: BlockKeyType,
    key?: KeyType,
};

/**
 * @type {BlockStoreType}
 * @group Components
 * @category Data Structures
 *
 * @template {"array" | "map"} Type - How the blocks are stored. Defaults to `"map"`.
 * @template {object} BlockType - The type of one block.
 * @description The container a nested store keeps its blocks in, resolved from `Type`: a `Map` keyed by
 * block name for `"map"`, or a plain array indexed by position for `"array"`.
 */
type BlockStoreType<
    Type extends "array" | "map" = "map",
    BlockType extends object = object
> = Type extends "map" ? Map<string, BlockType> : BlockType[];

export {ScopedKey, BlockStoreType};