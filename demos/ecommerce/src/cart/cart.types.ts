import {CollectionProperties} from "../collection/collection.types";

/**
 * @description Properties to create a {@link Cart}. The same as a collection's: what makes a cart a cart —
 * the amounts it has been asked for — is filled in as it is used, not given up front.
 */
export type CartProperties = CollectionProperties;
