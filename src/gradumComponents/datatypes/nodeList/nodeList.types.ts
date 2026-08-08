import {GradumNodeList} from "./nodeList";

/**
 * @type {NodeListType}
 * @group Components
 * @category GradumNodeList
 *
 * @description Union type representing any value that can be added to or removed from a
 * {@link GradumNodeList}. Accepts a {@link GradumNodeList}, a live DOM {@link HTMLCollection},
 * a {@link NodeListOf}, a {@link Set}, or a plain array.
 *
 * @template {object} EntryType - The type of the nodes held in the collection.
 */
type NodeListType<EntryType extends object = object> = GradumNodeList<EntryType> | HTMLCollection
    | NodeListOf<EntryType & Node> | Set<EntryType> | EntryType[];

type NodeListSlot<EntryType extends object = object> = GradumNodeList<EntryType> | HTMLCollection
    | NodeListOf<EntryType & Node> | EntryType;

export {NodeListType, NodeListSlot};