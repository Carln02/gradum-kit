import {StatefulReifect} from "../../gradumComponents/wrappers/statefulReifect/statefulReifect";
import {
    ReifectAppliedOptions,
    ReifectEnabledObject
} from "../../gradumComponents/wrappers/statefulReifect/statefulReifect.types";
import {GradumSelector} from "../gradumSelector";
import {ReifectFunctionsUtils} from "./reifect.utils";
import "./reifect.types";
import {Reifect} from "../../gradumComponents/wrappers/reifect/reifect";
import {Shown} from "../../types/enums.types";
import {gradum} from "../gradumFunctions";

const utils = new ReifectFunctionsUtils();

const showTransition = new StatefulReifect({
    states: [Shown.visible, Shown.hidden],
    styles: (state) => `visibility: ${state}`
});

export function setupReifectFunctions() {
    /**
     * @description Adds a readonly "reifects" property to Node prototype.
     */
    Object.defineProperty(GradumSelector.prototype, "reifects", {
        get: function () {
            if (!this.element) return new Set();
            return new Set(utils.data(this.element).reifects?.toArray());
        },
        configurable: false,
        enumerable: true
    });

    /**
     * @description Adds a configurable "showTransition" property to Node prototype. Defaults to a global
     * transition assigned to all nodes.
     */
    Object.defineProperty(GradumSelector.prototype, "showTransition", {
        get: function () {
            if (!this.element) return;
            const data = utils.data(this.element);
            if (!data.showTransition) data.showTransition = showTransition;
            return data.showTransition;
        },
        set: function (value: StatefulReifect<Shown>) {
            if (!this.element) return;
            utils.data(this.element).showTransition = value;
        },
        configurable: true,
        enumerable: true
    });

    /**
     * @description Boolean indicating whether the node is shown or not, based on its showTransition.
     */
    Object.defineProperty(GradumSelector.prototype, "isShown", {
        get: function () {
            if (!this.element) return;
            const state = this.showTransition.stateOf(this.element);
            if (state == Shown.visible) return true;
            else if (state == Shown.hidden) return false;
            return this.element.style.display != "none"
                && this.element.style.visibility != "hidden"
                && this.element.style.opacity != "0";
        },
        configurable: false,
        enumerable: true
    });

    /**
     * @description Show or hide the element (based on CSS) by transitioning in/out of the element's showTransition.
     * @param {boolean} b - Whether to show the element or not
     * @param {ReifectAppliedOptions<Shown>} [options={executeForAll: false}] - The options to pass to the reifect
     * execution.
     * @returns {this} Itself, allowing for method chaining.
     */
    GradumSelector.prototype.show = function _show(this: GradumSelector, b: boolean, options:
    ReifectAppliedOptions<Shown> = {}): GradumSelector {
        if (!this.element) return this;
        if (!options.executeForAll) options.executeForAll = false;
        this.showTransition.apply(b ? Shown.visible : Shown.hidden, this.element, options);
        return this;
    };

    GradumSelector.prototype.attachReifect = function _attachReifect(
        this: GradumSelector, ...reifects: StatefulReifect[]
    ): GradumSelector {
        if (!this.element || typeof this.element !== "object") return this;
        reifects.forEach(entry => {
            if (this.reifects.has(entry)) return;
            utils.attachReifect(this.element, entry);
            entry.attach(this.element);
        });
        return this;
    }

    GradumSelector.prototype.detachReifect = function _detachReifect(
        this: GradumSelector, ...reifects: StatefulReifect[]
    ): GradumSelector {
        if (!this.element || typeof this.element !== "object") return this;
        reifects.forEach(entry => {
            if (!this.reifects.has(entry)) return;
            utils.detachReifect(this.element, entry);
            entry.detach(this.element);
        });
        return this;
    }

    GradumSelector.prototype.initializeReifect = function _initializeReifect(
        this: GradumSelector, reifect: StatefulReifect, state?: any, options?: ReifectAppliedOptions
    ): GradumSelector {
        if (!this.element) return this;
        if (reifect instanceof Reifect) reifect.initialize(this.element, options);
        else reifect.initialize(this.element, state, options);
        return this;
    };

    GradumSelector.prototype.applyReifect = function _applyReifect(
        this: GradumSelector, reifect: StatefulReifect, state?: any, options?: ReifectAppliedOptions
    ): GradumSelector {
        if (!this.element) return this;
        if (reifect instanceof Reifect) reifect.apply(this.element, options);
        else reifect.apply(this.element, state, options);
        return this;
    };

    GradumSelector.prototype.toggleReifect = function _toggleReifect(
        this: GradumSelector, reifect: StatefulReifect, options?: ReifectAppliedOptions
    ): GradumSelector {
        if (!this.element) return this;
        if (reifect instanceof Reifect) return this;
        else reifect.toggle(this.element, options);
        return this;
    };

    GradumSelector.prototype.reloadReifects = function _reloadReifects(this: GradumSelector): GradumSelector {
        if (!this.element) return this;
        this.reifects.forEach(reifect => reifect.reloadFor(this.element));
        return this;
    };

    GradumSelector.prototype.reloadReifectsChainableStyles = function _reloadChainableStyles(
        this: GradumSelector,
        applyInstantly: boolean = true
    ): GradumSelector {
        if (!this.element) return this;
        const contributions: Partial<Record<string, string[]>> = {};
        this.reifects.forEach((reifect: StatefulReifect) => {
            const chainable = reifect.getChainableStyles(this.element);
            for (const [key, value] of Object.entries(chainable)) {
                if (!value) continue;
                if (!contributions[key]) contributions[key] = [];
                contributions[key].push(value);
            }
        });

        for (const [key, values] of Object.entries(contributions)) {
            const separator = key === "transform" ? " " : ", ";
            gradum(this.element).setStyle(key as any, values.join(separator), applyInstantly);
        }

        return this;
    };

    GradumSelector.prototype.reifectEnabledState = function _reifectEnabledState(
        this: GradumSelector, reifect?: StatefulReifect
    ): ReifectEnabledObject {
        if (!this.element) return {};
        if (reifect) return reifect.getObjectEnabledState(this.element);
        return utils.data(this.element).enabled;
    };

    GradumSelector.prototype.enableReifect = function _enableReifect(
        this: GradumSelector, value: boolean | ReifectEnabledObject, reifect?: StatefulReifect
    ): GradumSelector {
        if (!this.element) return this;
        const enabled = reifect ? reifect.getData(this.element)?.enabled
            : utils.data(this.element).enabled;
        if (!enabled) return this;
        if (typeof value === "boolean") enabled.global = value;
        else if (typeof value === "object") Object.entries(value)
            .forEach(([key, value]) => enabled[key] = value);
        return this;
    }
}