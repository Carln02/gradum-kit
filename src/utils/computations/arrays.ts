/**
 * @internal
 * @function binaryInsert
 * @template Type - The type of the array's entries.
 * @description Insert an item into an already-sorted array, keeping it sorted. Locates the slot by binary
 * search, so it stays cheap on large arrays. *Note: the array is mutated in place; nothing is returned as a
 * copy. The array must already be sorted by the same comparator, or the insertion point is meaningless.*
 * @param {Type[]} array - The sorted array to insert into. Mutated in place.
 * @param {Type} item - The item to insert.
 * @param {(a: Type, b: Type) => number} compare - Comparator returning a negative number, zero, or a positive
 * number, matching `Array.prototype.sort`.
 * @returns {number} The index the item was inserted at.
 */
export function binaryInsert<Type = any>(array: Type[], item: Type, compare: (a: Type, b: Type) => number): number {
    let low = 0;
    let high = array.length;

    while (low < high) {
        const mid = (low + high) >>> 1;
        if (compare(array[mid], item) <= 0) low = mid + 1;
        else high = mid;
    }

    array.splice(low, 0, item);
    return low;
}
