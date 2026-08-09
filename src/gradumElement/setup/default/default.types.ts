import {GradumElementProperties} from "../../gradumElement.types";
import {CloneElementOptions, FeedforwardProperties} from "../../../gradumFunctions/element/element.types";

/**
 * @internal
 * @type {GradumElementDefaultInterface}
 * @description The lifecycle members every element class gains from `defineDefaultProperties`. Declared
 * separately so the element classes can merge it in, since the members are installed on the prototype at
 * runtime rather than declared on the class.
 */
interface GradumElementDefaultInterface {
    /**
     * @readonly
     * @description The properties this element was created with.
     */
    readonly properties: object;

    /**
     * @function destroy
     * @description Destroys the node by removing it from the document and removing all its bound listeners.
     * @returns {this} Itself, allowing for method chaining.
     */
    destroy(): this;

    /**
     * @function initialize
     * @description Initializes the element. It sets up the UI by calling the methods `setupUIElements`,
     * `setupUILayout`, `setupUIListeners`, and `setupChangedCallbacks` (in this order, if they are defined).
     * This function is called automatically in `.setProperties()` and when instantiating an
     * element via `element()`. It is called only once per element (as it checks with the reflected `initialized` flag).
     */
    initialize(): void;


    /**
     * @readonly
     * @description Whether the element was initialized already or not.
     */
    readonly initialized: boolean;

    /**
     * @description The properties passed on to children created through {@link feedforward}, letting a
     * parent seed its descendants with shared defaults.
     */
    defaultFeedforwardProperties: GradumElementProperties;

    /**
     * @function feedforward
     * @description Push this element's feedforward properties down to its children, so newly added
     * descendants pick up the same defaults.
     * @param {FeedforwardProperties} [properties] - Properties to feed forward. Defaults to
     * `defaultFeedforwardProperties`.
     * @returns {this} Itself, allowing for method chaining.
     */
    feedforward(properties?: FeedforwardProperties): this;

    /**
     * @function clone
     * @description Create a copy of this element. By default the copy carries the same properties and
     * children but none of the bound listeners.
     * @param {CloneElementOptions} [options] - What to carry over to the copy.
     * @returns {this} The cloned element.
     */
    clone(options?: CloneElementOptions): this;
}

export {GradumElementDefaultInterface};