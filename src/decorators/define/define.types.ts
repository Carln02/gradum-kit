/**
 * @type {DefineOptions}
 * @group Decorators
 * @category Registry
 *
 * @description Options object for the {@link define} decorator and imperative function.
 * @property {boolean} [injectAttributeBridge=true] - Whether to inject an `attributeChangedCallback`
 * into the class prototype if one is not already present. When enabled, HTML attribute changes are
 * automatically mirrored to their associated `@observe`-decorated fields, and vice versa.
 */
type DefineOptions = {
    injectAttributeBridge?: boolean;
};

/**
 * @enum {RegistryCategory}
 * @group Decorators
 * @category Registry
 *
 * @description The bucket a class is filed under in the Gradum Kit registry, and the value
 * {@link getRegisteredByCategories} groups by. {@link define} infers it by walking the class'
 * inheritance chain; within each family below the categories are listed most to least specific, and
 * the first match wins, so a class extending {@link GradumElement} is filed as `GradumElement` rather
 * than the `HTMLElement` it also inherits from.
 * @property {RegistryCategory.GradumProxiedElement} GradumProxiedElement - Gradum elements, most specific first.
 * @property {RegistryCategory.GradumElement} GradumElement - Gradum element extending `HTMLElement`.
 * @property {RegistryCategory.GradumBaseElement} GradumBaseElement - Shared element foundation.
 * @property {RegistryCategory.GradumHeadlessElement} GradumHeadlessElement - Element without a DOM node.
 * @property {RegistryCategory.SVGElement} SVGElement - Native DOM elements, most specific first.
 * @property {RegistryCategory.MathMLElement} MathMLElement - Native MathML element.
 * @property {RegistryCategory.HTMLElement} HTMLElement - Native HTML element.
 * @property {RegistryCategory.Element} Element - Any other native element.
 * @property {RegistryCategory.Node} Node - Any other DOM node.
 * @property {RegistryCategory.GradumOperator} GradumOperator - MVC pieces.
 * @property {RegistryCategory.GradumHandler} GradumHandler - Model-only helper.
 * @property {RegistryCategory.GradumInteractor} GradumInteractor - Tool-event listener holder.
 * @property {RegistryCategory.GradumTool} GradumTool - Capture-phase behavior holder.
 * @property {RegistryCategory.GradumConstrainer} GradumConstrainer - Constraint solver.
 * @property {RegistryCategory.GradumView} GradumView - View.
 * @property {RegistryCategory.GradumEmitter} GradumEmitter - Emitter.
 * @property {RegistryCategory.GradumModel} GradumModel - Model.
 * @property {RegistryCategory.Other} Other - Classes matching no recognized base type.
 */
enum RegistryCategory {
    GradumElement = "GradumElement",
    GradumBaseElement = "GradumBaseElement",
    GradumHeadlessElement = "GradumHeadlessElement",
    GradumProxiedElement = "GradumProxiedElement",

    HTMLElement = "HTMLElement",
    SVGElement = "SVGElement",
    MathMLElement = "MathMLElement",
    Element = "Element",
    Node = "Node",

    GradumModel = "GradumModel",
    GradumView = "GradumView",
    GradumEmitter = "GradumEmitter",
    GradumOperator = "GradumOperator",
    GradumHandler = "GradumHandler",
    GradumInteractor = "GradumInteractor",
    GradumTool = "GradumTool",
    GradumConstrainer = "GradumConstrainer",

    Other = "Other",
}

/**
 * @type {RegistryEntry}
 * @group Decorators
 * @category Registry
 *
 * @description Represents a single entry in the Gradum Kit class registry, as stored and returned
 * by {@link findRegistered} and related query functions.
 * @property {new (...args: any[]) => any} constructor - The registered class constructor.
 * @property {RegistryCategory | string} category - The category the class was registered under, either
 * passed explicitly to {@link define} or inferred from its inheritance chain. It is a plain string when
 * a custom category was supplied.
 * @property {string} name - The registered name of the class, used as the registry key.
 * Typically the class name as passed to {@link define}.
 * @property {string} [tag] - The custom element tag name associated with this class.
 * Only present for classes registered as custom HTML elements via {@link define}.
 */
type RegistryEntry = {
    constructor: new (...args: any[]) => any;
    category: RegistryCategory | string;
    tag?: string;
    name: string;
};

export {DefineOptions, RegistryEntry, RegistryCategory};