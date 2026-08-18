export type TextRange = {
    markName?: string,
    from: number,
    to: number,
    attributes?: Record<string, any>
};

//Words when a passage has a space in it, and the letters of a single word when it does not.
export type TextUnit = "word" | "char";

/**
 * @type {TextTokens}
 * @description A passage taken apart: the items a gesture moves about, and the spacing kept aside so that
 * reordering them leaves it where it was. `gaps[i]` separates `tokens[i]` from `tokens[i + 1]`.
 */
export type TextTokens = {
    unit: TextUnit,
    tokens: string[],
    gaps: string[]
};
