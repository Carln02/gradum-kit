import {GradumSelector} from "./gradumSelector";

/**
 * @type {Gradum}
 * @group GradumSelector
 *
 * @template {object} Type - The type of the wrapped object. Defaults to `Node`.
 * @description What {@link gradum} hands back: the wrapped object plus the whole selector API, intersected.
 * That means a wrapped element still answers to its own members — `el.textContent` works alongside
 * `el.addChild(...)` — so a `Gradum<HTMLDivElement>` can be used anywhere the raw element was.
 */
type Gradum<Type extends object = Node> = GradumSelector<Type> & Type;

/**
 * @type {GradumifyOptions}
 * @group GradumSelector
 *
 * @description Which families of selector functions {@link gradumify} should skip. Every family is installed
 * by default; set a flag to leave that family off the {@link GradumSelector} prototype. Excluding a family
 * means its functions simply do not exist, so only do it if you know nothing in your app calls them.
 * @property {boolean} [excludeHierarchyFunctions] - Skip `addChild`, `closest`, `childHandler`, and the rest of the DOM-hierarchy functions.
 * @property {boolean} [excludeMvcFunctions] - Skip `model`, `view`, `emitter`, and the MVC add/get/remove methods.
 * @property {boolean} [excludeStyleFunctions] - Skip `setStyle`, `setStyles`, `selected`, and `closestRoot`.
 * @property {boolean} [excludeClassFunctions] - Skip `addClass`, `removeClass`, `toggleClass`, and `hasClass`.
 * @property {boolean} [excludeElementFunctions] - Skip `setProperties`, `clone`, `destroy`, and `feedforward`.
 * @property {boolean} [excludeEventFunctions] - Skip `on`, `onTool`, `executeAction`, and `preventDefault`.
 * @property {boolean} [excludeToolFunctions] - Skip `makeTool`, `applyTool`, and `embedTool`.
 * @property {boolean} [excludeConstrainerFunctions] - Skip `makeConstrainer`, `solveConstrainer`, and `mutate`.
 * @property {boolean} [excludeMiscFunctions] - Skip `apply`, `applyDefaults`, `extract`, and `getDifference`.
 * @property {boolean} [excludeReifectFunctions] - Skip `show`, `applyReifect`, and `attachReifect`.
 */
type GradumifyOptions = {
    excludeHierarchyFunctions?: boolean,
    excludeMvcFunctions?: boolean,
    excludeStyleFunctions?: boolean,
    excludeClassFunctions?: boolean,
    excludeElementFunctions?: boolean,
    excludeEventFunctions?: boolean,
    excludeToolFunctions?: boolean,
    excludeConstrainerFunctions?: boolean,
    excludeMiscFunctions?: boolean,
    excludeReifectFunctions?: boolean
};

declare module "./gradumSelector" {
    interface GradumSelector extends Node {
    }
}

export {Gradum, GradumifyOptions};