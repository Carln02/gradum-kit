import {Gradum, GradumifyOptions} from "./gradumFunctions.types";
import {setupHierarchyFunctions} from "./hierarchy/hierarchy";
import {setupMiscFunctions} from "./misc/misc";
import {setupClassFunctions} from "./class/class";
import {setupElementFunctions} from "./element/element";
import {setupEventFunctions} from "./event/event";
import {setupStyleFunctions} from "./style/style";
import {setupToolFunctions} from "./tool/tool";
import {setupConstrainerFunctions} from "./constrainer/constrainer";
import {GradumSelector} from "./gradumSelector";
import {callOnce} from "../decorators/callOnce";
import {setupReifectFunctions} from "./reifect/reifect";
import {element} from "../elementCreation/element";
import {ValidElement, ValidTag} from "../types/element.types";
import {setupMvcFunctions} from "./mvc/mvc";

const cache: WeakMap<object, GradumSelector<object>> = new WeakMap();

/**
 * @overload
 * @function gradum
 * @group GradumSelector
 * @category Core
 *
 * @template {ValidTag} Tag - The HTML tag of the element to instantiate.
 * @description All-in-one selector function that instantiates an element with the given tag and returns it wrapped
 * in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use `gr()`,
 * `g()`, or `$()` for the same behavior.
 * @param {Tag} [tag="div"] - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<ValidElement<Tag>>} The instantiated, wrapped, and proxied element.
 */
function gradum<Tag extends ValidTag = "div">(tag?: Tag): Gradum<ValidElement<Tag>>;

/**
 * @overload
 * @function gradum
 * @group GradumSelector
 * @category Core
 *
 * @template {object} Type - The type of the object to wrap.
 * @description All-in-one selector function that wraps the given object in a proxied selector that augments it
 * with useful functions for manipulating it. You can alternatively use `gr()`, `g()`, or `$()` for the same behavior.
 * @param {Type} object - The object to wrap.
 * @param {boolean} [raw=false] - If set to true, the selector will operate directly on the provided object, even
 * if it contains an inner `element` field. Useful when you want to set properties on a proxied wrapper itself rather
 * than its underlying DOM element.
 * @returns {Gradum<Type>} The wrapped, proxied object.
 */
function gradum<Type extends object = Node>(object: Type, raw?: boolean): Gradum<Type>;

/**
 * @overload
 * @function gradum
 * @group GradumSelector
 * @category Core
 *
 * @description All-in-one selector function that instantiates an element with the given tag (if valid) and returns it
 * wrapped in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use
 * `gr()`, `g()`, or `$()` for the same behavior.
 * @param {string} tag - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<Element>} The instantiated, wrapped, and proxied element.
 */
function gradum(tag?: string): Gradum<Element>;
function gradum(tagOrElement?: object | string, raw: boolean = false): Gradum {
    gradumify();
    let el: object;

    if (!tagOrElement) tagOrElement = "div" as any;
    if (typeof tagOrElement === "string") el = element({tag: tagOrElement as any});
    else if (typeof tagOrElement === "object") {
        if (tagOrElement instanceof GradumSelector) return tagOrElement;
        if (raw || tagOrElement instanceof Node) el = tagOrElement;
        else if (tagOrElement["element"] && typeof tagOrElement["element"] === "object") {
            el = tagOrElement["element"];
        }
        else el = tagOrElement;
    }

    const cached = cache.get(el);
    if (cached) return cached as Gradum;
    const gradumSelector = new GradumSelector<object>();
    gradumSelector.element = el;
    cache.set(el, gradumSelector);
    return gradumSelector as Gradum;
}

/**
 * @overload
 * @function gr
 * @group GradumSelector
 * @category Core
 *
 * @template {ValidTag} Tag - The HTML tag of the element to instantiate.
 * @description All-in-one selector function that instantiates an element with the given tag and returns it wrapped
 * in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use `gradum()`,
 * `g()`, or `$()` for the same behavior.
 * @param {Tag} [tag="div"] - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<ValidElement<Tag>>} The instantiated, wrapped, and proxied element.
 */
function gr<Tag extends ValidTag = "div">(tag?: Tag): Gradum<ValidElement<Tag>>;

/**
 * @overload
 * @function gr
 * @group GradumSelector
 * @category Core
 *
 * @template {object} Type - The type of the object to wrap.
 * @description All-in-one selector function that wraps the given object in a proxied selector that augments it
 * with useful functions for manipulating it. You can alternatively use `gradum()`, `g()`, or `$()` for the same behavior.
 * @param {Type} object - The object to wrap.
 * @param {boolean} [raw=false] - If set to true, the selector will operate directly on the provided object, even
 * if it contains an inner `element` field. Useful when you want to set properties on a proxied wrapper itself rather
 * than its underlying DOM element.
 * @returns {Gradum<Type>} The wrapped, proxied object.
 */
function gr<Type extends object = Node>(object: Type, raw?: boolean): Gradum<Type>;

/**
 * @overload
 * @function gr
 * @group GradumSelector
 * @category Core
 *
 * @description All-in-one selector function that instantiates an element with the given tag (if valid) and returns it
 * wrapped in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use
 * `gradum()`, `g()`, or `$()` for the same behavior.
 * @param {string} tag - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<Element>} The instantiated, wrapped, and proxied element.
 */
function gr(tag: string): Gradum<Element>;
function gr(tagOrElement?: object | string, raw: boolean = false): Gradum {
    return gradum(tagOrElement as any, raw);
}

/**
 * @overload
 * @function g
 * @group GradumSelector
 * @category Core
 *
 * @template {ValidTag} Tag - The HTML tag of the element to instantiate.
 * @description All-in-one selector function that instantiates an element with the given tag and returns it wrapped
 * in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use `gradum()`,
 * `gr()`, or `$()` for the same behavior.
 * @param {Tag} [tag="div"] - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<ValidElement<Tag>>} The instantiated, wrapped, and proxied element.
 */
function g<Tag extends ValidTag = "div">(tag?: Tag): Gradum<ValidElement<Tag>>;

/**
 * @overload
 * @function g
 * @group GradumSelector
 * @category Core
 *
 * @template {object} Type - The type of the object to wrap.
 * @description All-in-one selector function that wraps the given object in a proxied selector that augments it
 * with useful functions for manipulating it. You can alternatively use `gradum()`, `gr()`, or `$()` for the same behavior.
 * @param {Type} object - The object to wrap.
 * @param {boolean} [raw=false] - If set to true, the selector will operate directly on the provided object, even
 * if it contains an inner `element` field. Useful when you want to set properties on a proxied wrapper itself rather
 * than its underlying DOM element.
 * @returns {Gradum<Type>} The wrapped, proxied object.
 */
function g<Type extends object = Node>(object: Type, raw?: boolean): Gradum<Type>;

/**
 * @overload
 * @function g
 * @group GradumSelector
 * @category Core
 *
 * @description All-in-one selector function that instantiates an element with the given tag (if valid) and returns it
 * wrapped in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use
 * `gradum()`, `gr()`, or `$()` for the same behavior.
 * @param {string} tag - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<Element>} The instantiated, wrapped, and proxied element.
 */
function g(tag: string): Gradum<Element>;
function g(tagOrElement?: object | string, raw: boolean = false): Gradum {
    return gradum(tagOrElement as any, raw);
}

/**
 * @overload
 * @function $
 * @group GradumSelector
 * @category Core
 *
 * @template {ValidTag} Tag - The HTML tag of the element to instantiate.
 * @description All-in-one selector function that instantiates an element with the given tag and returns it wrapped
 * in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use `gradum()`,
 * `gr()`, or `g()` for the same behavior.
 * @param {Tag} [tag="div"] - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<ValidElement<Tag>>} The instantiated, wrapped, and proxied element.
 */
function $<Tag extends ValidTag = "div">(tag?: Tag): Gradum<ValidElement<Tag>>;

/**
 * @overload
 * @function $
 * @group GradumSelector
 * @category Core
 *
 * @template {object} Type - The type of the object to wrap.
 * @description All-in-one selector function that wraps the given object in a proxied selector that augments it
 * with useful functions for manipulating it. You can alternatively use `gradum()`, `gr()`, or `g()` for the same behavior.
 * @param {Type} object - The object to wrap.
 * @param {boolean} [raw=false] - If set to true, the selector will operate directly on the provided object, even
 * if it contains an inner `element` field. Useful when you want to set properties on a proxied wrapper itself rather
 * than its underlying DOM element.
 * @returns {Gradum<Type>} The wrapped, proxied object.
 */
function $<Type extends object = Node>(object: Type, raw?: boolean): Gradum<Type>;

/**
 * @overload
 * @function $
 * @group GradumSelector
 * @category Core
 *
 * @description All-in-one selector function that instantiates an element with the given tag (if valid) and returns it
 * wrapped in a proxied selector that augments it with useful functions for manipulating it. You can alternatively use
 * `gradum()`, `gr()`, or `g()` for the same behavior.
 * @param {string} tag - The HTML tag of the element to instantiate. If not defined, the tag will be set to "div".
 * @returns {Gradum<Element>} The instantiated, wrapped, and proxied element.
 */
function $(tag: string): Gradum<Element>;
function $(tagOrElement?: object | string, raw: boolean = false): Gradum {
    return gradum(tagOrElement as any, raw);
}

/**
 * @function gradumify
 * @group GradumSelector
 * @category Core
 *
 * @description Install every selector function onto the {@link GradumSelector} prototype. Runs once — later
 * calls are no-ops — and is invoked automatically the first time {@link gradum} is called, so you rarely
 * need it directly. Call it yourself only to opt a family of functions out before anything else runs.
 * @param {GradumifyOptions} [options={}] - Which function families to skip.
 *
 * @example
 * ```ts
 * // Install everything except the tool and constrainer functions.
 * gradumify({excludeToolFunctions: true, excludeConstrainerFunctions: true});
 * ```
 */
const gradumify = callOnce(function (options: GradumifyOptions = {}) {
    if (!options.excludeHierarchyFunctions) setupHierarchyFunctions();
    if (!options.excludeMvcFunctions) setupMvcFunctions();
    if (!options.excludeMiscFunctions) setupMiscFunctions();
    if (!options.excludeClassFunctions) setupClassFunctions();
    if (!options.excludeElementFunctions) setupElementFunctions();
    if (!options.excludeEventFunctions) setupEventFunctions();
    if (!options.excludeStyleFunctions) setupStyleFunctions();
    if (!options.excludeToolFunctions) setupToolFunctions();
    if (!options.excludeConstrainerFunctions) setupConstrainerFunctions();
    if (!options.excludeReifectFunctions) setupReifectFunctions();
});

export {$, g, gr, gradum, gradumify};