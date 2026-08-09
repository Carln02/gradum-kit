import {GradumNodeList} from "./nodeList";

/**
 * @type {NodeListType}
 * @group Components
 * @category Data Structures
 *
 * @template {object} EntryType - The type of the nodes held in the collection.
 * @description Anything a {@link GradumNodeList} accepts as a source of entries: another list, a live DOM
 * `HTMLCollection` or `NodeListOf`, a `Set`, or a plain array. Live DOM collections keep reflecting the
 * document after being added, so the list stays in sync with them.
 */
type NodeListType<EntryType extends object = object> = GradumNodeList<EntryType> | HTMLCollection
    | NodeListOf<EntryType & Node> | Set<EntryType> | EntryType[];

/**
 * @type {NodeListSlot}
 * @group Components
 * @category Data Structures
 *
 * @template {object} EntryType - The type of the nodes held in the collection.
 * @description One slot of a {@link GradumNodeList}: either a single entry, or a whole sub-collection
 * counted as one position. Unlike {@link NodeListType} it excludes `Set` and array, which are flattened
 * into individual slots when added.
 */
type NodeListSlot<EntryType extends object = object> = GradumNodeList<EntryType> | HTMLCollection
    | NodeListOf<EntryType & Node> | EntryType;

export {NodeListType, NodeListSlot};