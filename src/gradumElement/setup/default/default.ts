import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {initializeEffects} from "../../../decorators/reactivity/reactivity";
import {attachListenersAndBehaviors} from "../../../decorators/listener/listener";
import {CloneElementOptions, FeedforwardProperties} from "../../../gradumFunctions/element/element.types";

/**
 * @internal
 * @function defineDefaultProperties
 * @template {new (...args: any[]) => any} Type - The class being set up.
 * @description Install the shared element behaviour on a class prototype — `destroy`, `initialize`,
 * `initialized`, `feedforward`, `clone`, and `defaultFeedforwardProperties`. This is what gives every
 * element class the same lifecycle without inheriting from a common base. Called once per element class
 * at definition time.
 * @param {Type} constructor - The class whose prototype receives the behaviour.
 */
export function defineDefaultProperties<Type extends new (...args: any[]) => any>(constructor: Type) {
    const prototype = constructor.prototype;
    const initializedKey = Symbol("__initialized__");

    Object.defineProperty(prototype, "destroy", {
        value: function () {},
        configurable: true,
        enumerable: false,
    });

    Object.defineProperty(prototype, "initialized", {
        get: function (): boolean {
            return this[initializedKey] ?? false;
        },
        configurable: true,
        enumerable: false,
    });

    Object.defineProperty(prototype, "initialize", {
        value: function (): void {
            if (this[initializedKey]) return;
            this[initializedKey] = true;
            this.setupUIElements?.();
            this.setupUILayout?.();
            this.setupUIListeners?.();
            attachListenersAndBehaviors(this);
            this.setupFields?.();
            this.setupChangedCallbacks?.();
            gradum(this).initializeMvc();
            initializeEffects(this);
        },
        configurable: true,
        enumerable: false,
    });

    Object.defineProperty(prototype, "clone", {
        value: function (properties: CloneElementOptions) {return gradum(this).clone(properties)},
        configurable: true,
        enumerable: false,
    });

    const ffKey = Symbol("__defaultFeedforwardProperties__");
    Object.defineProperty(prototype, "defaultFeedforwardProperties", {
        get(this: any) {
            if (!this[ffKey]) this[ffKey] = {};
            return this[ffKey];
        },
        set(this: any, value) {this[ffKey] = value},
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(prototype, "feedforward", {
        value: function (properties: FeedforwardProperties) {return gradum(this).feedforward(properties)},
        configurable: true,
        enumerable: false,
    });
}