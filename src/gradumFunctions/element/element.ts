import "./element.types";
import {GradumSelector} from "../gradumSelector";
import {CloneElementOptions, FeedforwardProperties, GradumProperties} from "./element.types";
import {stylesheet} from "../../elementCreation/miscElements";
import {ValidElement, ValidTag} from "../../types/element.types";
import {DefaultEventName} from "../../types/eventNaming.types";
import {stringify} from "../../utils/dataManipulation/string";
import {gradum} from "../gradumFunctions";
import {getPrototypeChain} from "../../utils/dataManipulation/prototype";
import {equalToAny} from "../../utils/computations/equity";
import {ElementFunctionsUtils} from "./element.utils";
import {GradumElementProperties} from "../../gradumElement/gradumElement.types";
import {MvcFields} from "../mvc/mvc";
import {GradumElement} from "../../gradumElement/gradumElement";
import {GradumBaseElement} from "../../gradumElement/gradumBaseElement/gradumBaseElement";
import {GradumProxiedElement} from "../../gradumElement/gradumProxiedElement/gradumProxiedElement";
import {GradumHeadlessElement} from "../../gradumElement/gradumHeadlessElement/gradumHeadlessElement";
import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";
import {GradumMovable} from "../../gradumComponents/wrappers/movable/movable";
import {YAbstractType, YDoc} from "../../types/yjs.types";

const utils = new ElementFunctionsUtils();

/**
 * @internal
 * @function setupElementFunctions
 * @description Install the element functions (`setProperties`, `clone`, `destroy`, `feedforward`, ...) onto the
 * {@link GradumSelector} prototype. Called once by
 * {@link gradumify}; the matching `exclude` option skips it.
 */
export function setupElementFunctions() {
    /**
     * @template Tag - The HTML tag of the element.
     * @description Apply the given properties to the element.
     * @param {GradumProperties<Tag>} [properties] - The properties object.
     * @param {boolean} [setOnlyBaseProperties=false] - If set to true, will only set the base gradum properties (classes,
     * text, style, id, children, parent, etc.) and ignore all other properties not explicitly defined in GradumProperties.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.setProperties = function _setProperties<Tag extends ValidTag>
    (this: GradumSelector<ValidElement<Tag>>, properties: GradumProperties<Tag> = {} as GradumProperties<Tag>,
     setOnlyBaseProperties: boolean = false): GradumSelector<ValidElement<Tag>> {
        if (!this.element) return this;
        const props = {...properties};
        const element = this.element instanceof Element ? this.element :
            this.element["element"] as any instanceof Element ? this.element["element"] : undefined;

        gradum(props, true).removeFields(["tag", "namespace"]);
        const {out, shadowDOM, initialize, parent, model, data, dataId} =
            gradum(props, true).extract(["out", "shadowDOM", "initialize", "parent", "model", "data", "dataId"]);
        let mvcUpdated = false;

        if (out) {
            if (typeof out == "string") this["__outName"] = out;
            else Object.assign(out, this);
        }
        if (!!shadowDOM) {
            if ("shadowDOM" in this.element) this["shadowDOM"] = shadowDOM;
            else if (element) element.attachShadow({mode: "open"});
        }

        if (!element || (element && !setOnlyBaseProperties)) {
            if (model) {
                this.model = model;
                if (data && this.model) {
                    this.model.setDataWithoutInitializing(data);
                    this.model.id = dataId;
                }
                mvcUpdated = true;
            }

            const mvc = gradum(props, true).extract(MvcFields);
            for (const [key, value] of Object.entries(mvc)) {
                try {
                    this[key] = value;
                    mvcUpdated = true;
                } catch {
                }
            }
        }

        if (element) {
            const elementProps = gradum(props, true).extract(["text", "style",
                "stylesheet", "id", "classes", "listeners", "onClick", "onDrag", "children"]);
            for (const [property, value] of Object.entries(elementProps)) {
                if (value === undefined) continue;
                switch (property) {
                    case "text":
                        if (element instanceof HTMLElement) element.innerText = value;
                        break;
                    case "style":
                        if (!(element instanceof HTMLElement || element instanceof SVGElement)) break;
                        gradum(element).setStyles(value, true);
                        break;
                    case "stylesheet":
                        stylesheet(value, gradum(element).closestRoot);
                        break;
                    case "id":
                        element.id = value;
                        break;
                    case "classes":
                        gradum(element).addClass(value);
                        break;
                    case "listeners":
                        Object.entries(value).forEach(([type, callback]) =>
                            gradum(element).on(type, callback as any));
                        break;
                    case "onClick":
                        gradum(element).on(DefaultEventName.click, value as any);
                        break;
                    case "onDrag":
                        gradum(element).on(DefaultEventName.drag, value as any);
                        break;
                    case "children":
                        gradum(element).addChild(value);
                        break;
                }
            }
        }

        if (!element || !setOnlyBaseProperties) {
            for (const [property, value] of Object.entries(props)) {
                if (value === undefined) continue;
                try {this.element[property] = value} catch {
                    if (element) try {element.setAttribute(property, stringify(value))} catch (e) {console.error(e)}
                }
            }
        }

        if (parent) gradum(element).addToParent(parent);

        if (initialize === undefined || initialize) {
            if ("initialize" in this.element && typeof this.element.initialize === "function") this.element.initialize();
            else if (mvcUpdated) this.initializeMvc();
        }

        return this;
    };

    GradumSelector.prototype.getFields = function _getFields(
        this: GradumSelector
    ): Record<string, any> {
        if (!this.element) return {};

        const chain = getPrototypeChain(this.element);
        const seen = new Set<PropertyKey>();
        const result: Record<string, any> = {};

        const builtinPrototypes = new Set([
            GradumElement.prototype, GradumBaseElement.prototype, GradumProxiedElement.prototype,
            GradumHeadlessElement.prototype, Element.prototype, HTMLElement.prototype, Node.prototype,
            SVGElement.prototype, MathMLElement.prototype, EventTarget.prototype, Object.prototype
        ]);

        for (const proto of [this.element, ...chain].reverse()) {
            if (builtinPrototypes.has(proto)) {
                for (const key of Object.getOwnPropertyNames(proto)) seen.add(key);
                continue;
            }
            for (const key of Object.getOwnPropertyNames(proto)) {
                if (seen.has(key) || key.startsWith("_")) continue;
                const desc = Object.getOwnPropertyDescriptor(proto, key);
                if (!desc || typeof desc.value === "function" || (desc.get && !desc.set)) continue;
                seen.add(key);
                result[key] = this.element[key];
            }
        }

        return result;
    };

    GradumSelector.prototype.clone = function _clone<Tag extends ValidTag>(
        this: GradumSelector<ValidElement<Tag>>,
        options: CloneElementOptions = {}
    ): ValidElement<Tag> {
        const originElement = this.element instanceof Node ? this.element : undefined;
        if (!originElement) return;

        const exclude = new Set<PropertyKey>(options.exclude ?? []);
        const force = new Set<PropertyKey>(options.forceInclude ?? []);
        const deepClone = new Set<PropertyKey>(options.deepClone ?? []);
        const copyReference = new Set<PropertyKey>(options.copyReference ?? []);

        const shouldCopy = (key: PropertyKey, value: any, prototype: any) => {
            if (force.has(key)) return true;
            if (exclude.has(key) || key === "mvc" || key === "__proto__" || key === "prototype") return false;
            if (typeof value === "function" || value instanceof Delegate) return false;
            if (key === "model" || key === "view" || key === "emitter" || key === "operators"
                || key === "handlers" || key === "interactors" || key === "tools" || key === "constrainers") return false;

            const desc = Object.getOwnPropertyDescriptor(prototype, key);
            if (!desc) return false;
            if (desc.get && !desc.set) return false;
            if (desc.writable === false) return false;

            return true;
        };

        const copyField = (key: PropertyKey, value: any): any => {
            if (value === null || value === undefined || typeof value !== "object") return value;
            if (copyReference.has(key)) return value;

            if (value instanceof Node) {
                if (deepClone.has(key) || options.deepCloneNodes) {
                    try { return gradum(value as any).clone(options); } catch { return undefined; }
                }
                return options.copyNodes ? value : undefined;
            }

            if (options.deepCloneObjects || deepClone.has(key)) {
                try { return structuredClone(value); } catch { /* fall through to reference */ }
            }
            return value;
        };

        const constructor = originElement.constructor as any;
        const prototypeChain = getPrototypeChain(originElement);

        const properties: any = {};
        if (originElement["model"] && originElement["data"] != null) {
            const rawData = originElement["data"];
            let clonedData = rawData;
            if (options.snapshotData || options.deepCloneObjects) {
                // Y.js types: deep-copy into a fresh detached Y.Doc. The clone's model machinery
                // (observers, nested models, views) then works unchanged on real Y types, and
                // nothing syncs since the doc has no provider. A plain-object (toJSON) snapshot
                // renders degraded previews — observers never populate from plain data.
                if (options.snapshotData && rawData instanceof YAbstractType
                    && typeof (rawData as any).clone === "function") {
                    try {
                        const yClone = (rawData as any).clone();
                        // Y types must be inside a document before they can be read.
                        new YDoc().getMap("__gradum_snapshot__").set("data", yClone);
                        clonedData = yClone;
                    } catch {}
                }
                // Fallbacks: toJSON (plain detached object), then structuredClone. Only under
                // snapshotData — deepCloneObjects keeps its documented fallback to reference
                // sharing for non-structured-cloneable data.
                if (clonedData === rawData && options.snapshotData && typeof rawData.toJSON === "function")
                    try { clonedData = rawData.toJSON(); } catch {}
                if (clonedData === rawData) try { clonedData = structuredClone(rawData); } catch {}
            }
            properties.data = clonedData;
        }
        try { Object.assign(properties, gradum(originElement).getMvcDifference()); } catch {}

        let clone: any;
        if (typeof constructor.create === "function") {
            try { clone = constructor.create(properties); } catch {}
        }
        if (!clone) {
            if (originElement instanceof Element) {
                clone = gradum(document.createElement(originElement.tagName)).setProperties(properties).element;
            } else {
                try { clone = (originElement as unknown as Node).cloneNode(false); } catch {}
            }
        }
        if (!clone) return;

        if (originElement instanceof Element && clone instanceof Element) {
            for (const attr of Array.from(originElement.attributes)) {
                if (exclude.has(attr.name)) continue;
                try { clone.setAttribute(attr.name, attr.value); } catch {}
            }
        }

        const keys: Map<PropertyKey, any> = new Map();
        const addKeys = (prototype: any) => {
            for (const property of Object.getOwnPropertyNames(prototype)) if (!keys.has(property)) keys.set(property, prototype);
            for (const property of Object.getOwnPropertySymbols(prototype)) if (!keys.has(property)) keys.set(property, prototype);
        };

        const mathMLProto = typeof MathMLElement !== "undefined" ? MathMLElement.prototype : null;
        addKeys(originElement);
        for (const prototype of prototypeChain) {
            if (equalToAny(prototype, GradumElement.prototype, GradumBaseElement.prototype,
                GradumProxiedElement.prototype, GradumHeadlessElement.prototype,
                Element.prototype, Node.prototype, HTMLElement.prototype,
                SVGElement.prototype, mathMLProto, EventTarget.prototype, Object.prototype)) break;
            addKeys(prototype);
        }

        for (const [key, prototype] of keys.entries()) {
            const value = originElement[key];
            if (!shouldCopy(key, value, prototype)) continue;
            const newValue = copyField(key, value);
            if (newValue !== undefined) try { clone[key] = newValue; } catch {}
        }

        return clone;
    };

    /**
     * @description Destroys the node by removing it from the document and removing all its bound listeners.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.destroy = function _destroy(this: GradumSelector): GradumSelector {
        this.removeAllListeners();
        this.remove();
        if (this.element && "destroy" in this.element && typeof this.element.destroy === "function") this.element.destroy();
        return this;
    }

    /**
     * @description Sets the value of an attribute on the underlying element.
     * @param {string} name The name of the attribute.
     * @param {string | number | boolean} [value] The value of the attribute. Can be left blank to represent a
     * true boolean.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.setAttribute = function _setAttribute
    (this: GradumSelector, name: string, value: string | number | boolean): GradumSelector {
        if (this.element instanceof Element) this.element.setAttribute(name, value?.toString() || "true");
        return this;
    };

    /**
     * @description Removes an attribute from the underlying element.
     * @param {string} name The name of the attribute to remove.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.removeAttribute = function _removeAttribute
    (this: GradumSelector, name: string): GradumSelector {
        if (this.element instanceof Element) this.element.removeAttribute(name);
        return this;
    };

    /**
     * @description Causes the element to lose focus.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.blur = function _blur(this: GradumSelector): GradumSelector {
        if (this.element instanceof HTMLElement) this.element.blur();
        return this;
    };

    /**
     * @description Sets focus on the element.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.focus = function _focus(this: GradumSelector): GradumSelector {
        if (this.element instanceof HTMLElement) this.element.focus();
        return this;
    };

    const FEEDFORWARD_STYLE_ID = "gradum-feedforward-styles";

    const wrapFeedforwardClone = (clone: any): HTMLElement => {
        // Stylesheet !important beats the inline styles the clone's view keeps writing
        // (its snapshot model still renders the original position). Injected once.
        // position: static keeps absolutely-positioned clones (cards, nodes) in the wrapper's
        // flow — otherwise they collapse the wrapper to 0x0 and break centerAnchor centering.
        if (!document.getElementById(FEEDFORWARD_STYLE_ID)) {
            const sheet = document.createElement("style");
            sheet.id = FEEDFORWARD_STYLE_ID;
            sheet.textContent = ".gradum-feedforward-wrapper > .gradum-feedforward-clone " +
                "{transform: none !important; position: static !important;}";
            document.head.appendChild(sheet);
        }

        if (clone instanceof Element) clone.classList.add("gradum-feedforward-clone");
        const wrapper = GradumMovable.create({content: clone instanceof Element ? clone : undefined});
        wrapper.classList.add("gradum-feedforward-wrapper");
        Object.defineProperty(wrapper, "feedforwardClone", {value: clone, configurable: true});
        return wrapper;
    };

    GradumSelector.prototype.feedforward = function _feedforward<Tag extends ValidTag>(
        this: GradumSelector<ValidElement<Tag>>,
        properties: FeedforwardProperties = {}
    ): ValidElement<Tag> {
        if (properties.removeOnPointerRelease === undefined) properties.removeOnPointerRelease = true;
        if (!this.element) return;
        const type = properties?.type ?? "___DEFAULT___";
        const feedforwardElements = utils.data(this.element).feedforwardElements;
        if (!feedforwardElements) return;

        let saved = feedforwardElements.get(type);
        if (!saved) {
            // Feedforwards are visual previews — snapshot the data so MVC/synced elements
            // don't produce a live twin writing through the shared (e.g. Y.js) model.
            const cloneOptions = {snapshotData: true, ...properties?.cloneOptions};
            if (typeof this.element["clone"] === "function") saved = this.element["clone"](cloneOptions);
            else saved = this.clone(cloneOptions);

            // Positioning wrapper: callers move/rotate the preview through pure CSS
            // transforms on the wrapper, never through the clone's semantic fields.
            if (properties.wrap && saved) saved = wrapFeedforwardClone(saved);

            // Register cleanup once per clone, not once per feedforward() call.
            if (properties.removeOnPointerRelease && saved) {
                const savedClone = saved;
                gradum(document.body).on(DefaultEventName.clickEnd, () => {
                    if (typeof savedClone["remove"] === "function") savedClone["remove"]();
                    if (feedforwardElements.get(type) === savedClone) feedforwardElements.delete(type);
                }, {capture: true, once: true});
            }
        }
        // feedforward() is called in hot paths (per pointer event). Re-applying an unchanged
        // parent re-appends the whole subtree each call — custom-element disconnect/reconnect
        // churn and forced reflows. Strip parent when the element is already inside it.
        const stripUnchangedParent = (props: any) => {
            if (!props?.parent || !(saved instanceof Node)) return props;
            const parentNode = props.parent instanceof GradumSelector ? props.parent.element : props.parent;
            if (saved.parentNode === parentNode) return {...props, parent: undefined};
            return props;
        };

        gradum(saved).setProperties(stripUnchangedParent(this.defaultFeedforwardProperties ?? {}))
            .setProperties(stripUnchangedParent({
                ...properties,
                cloneOptions: undefined,
                type: undefined,
                removeOnPointerRelease: undefined,
                wrap: undefined
            }));
        feedforwardElements.set(type, saved);
        return saved as any;
    }

    Object.defineProperty(GradumSelector.prototype, "defaultFeedforwardProperties", {
        get: function () {
            if ("defaultFeedforwardProperties" in this.element) return this.element.defaultFeedforwardProperties;
            return utils.data(this.element).defaultFeedforwardProperties;
        },
        set: function (value: GradumElementProperties) {
            if ("defaultFeedforwardProperties" in this.element) this.element.defaultFeedforwardProperties = value;
            utils.data(this.element).defaultFeedforwardProperties = value;
        },
        configurable: true,
        enumerable: true
    });
}