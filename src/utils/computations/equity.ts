/**
 * @function areEqual
 * @group Utilities
 * @category Equity
 *
 * @template Type - The type of the compared entries.
 * @description Check whether every entry is the same value, compared with `Object.is`. Use it for identity;
 * reach for {@link areSimilar} when two distinct objects holding the same content should count as equal.
 * @param {...Type[]} entries - The entries to compare. Fewer than two entries always counts as equal.
 * @returns {boolean} `true` if all entries are the same value.
 */
function areEqual<Type = any>(...entries: Type[]): boolean {
    if (entries.length < 2) return true;
    for (let i = 0; i < entries.length - 1; i++) {
        if (!Object.is(entries[i], entries[i + 1])) return false;
    }
    return true;
}

/**
 * @function areSimilar
 * @group Utilities
 * @category Equity
 *
 * @template Type - The type of the compared entries.
 * @description Check whether every entry holds the same content, even if they are different objects. Falls
 * back through three strategies per pair: identity, the entries' own `equals` method if they define one, then
 * matching JSON and string representations. Non-objects that are not identical are never similar.
 * @param {...Type[]} entries - The entries to compare. Fewer than two entries always counts as similar.
 * @returns {boolean} `true` if all entries are equivalent in content.
 */
function areSimilar<Type = any>(...entries: Type[]): boolean {
    if (entries.length < 2) return true;
    for (let i = 0; i < entries.length - 1; i++) {
        const e1 = entries[i];
        const e2 = entries[i + 1];
        if (e1 === e2) continue;
        if (typeof e1 !== "object" || typeof e2 !== "object") return false;
        if (Object.is(e1, e2)) continue;
        if (e1 !== null && "equals" in e1 && typeof e1.equals === "function") {
            const value = e1.equals(e2);
            if (typeof value === "boolean") return value;
        }
        if (e1 != null && e2 != null) {
            let cont = false;
            try {if (JSON.stringify(e1) === JSON.stringify(e2) && e1.toString() === e2.toString()) cont = true; } catch { }
            if (!cont) return false;
        }
    }
    return true;
}

/**
 * @function equalToAny
 * @group Utilities
 * @category Equity
 *
 * @template Type - The type of the compared entries.
 * @description Check whether one entry matches at least one of the given values, compared loosely (`==`).
 * @param {Type} entry - The entry to look for.
 * @param {...Type[]} values - The values to match against. Passing none counts as a match.
 * @returns {boolean} `true` if `entry` equals any of the values.
 */
function equalToAny<Type = any>(entry: Type, ...values: Type[]): boolean {
    if (values.length < 1) return true;
    for (const value of values) {
        if (entry == value) return true;
    }
    return false;
}

/**
 * @function eachEqualToAny
 * @group Utilities
 * @category Equity
 *
 * @template Type - The type of the compared entries.
 * @description Check whether every entry matches at least one of the allowed values, compared loosely (`==`).
 * Use it to validate that a set of inputs all fall within a known set.
 * @param {Type[]} values - The allowed values.
 * @param {...Type[]} entries - The entries to check. Passing none counts as a match.
 * @returns {boolean} `true` if every entry equals one of the allowed values.
 */
function eachEqualToAny<Type = any>(values: Type[], ...entries: Type[]): boolean {
    if (entries.length < 1) return true;
    for (const entry of entries) {
        let equals = false;
        for (const value of values) {
            if (entry == value) equals = true;
        }
        if (!equals) return false;
    }
    return true;
}

export {areEqual, equalToAny, eachEqualToAny, areSimilar};