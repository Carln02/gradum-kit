import {GradumSelector} from "../gradumSelector";
import {StatefulReifect} from "../../gradumComponents/wrappers/statefulReifect/statefulReifect";
import {ReifectEnabledObject} from "../../gradumComponents/wrappers/statefulReifect/statefulReifect.types";
import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";
import {GradumWeakSet} from "../../gradumComponents/datatypes/weakSet/weakSet";
import {Shown} from "../../types/enums.types";

/**
 * @internal
 * @type {ReifectDataEntry}
 * @description The reifect state held against one element: the reifects attached to it, the transition
 * backing `show`, whether reifects are enabled, and the transition lifecycle delegates.
 * @property {GradumWeakSet<StatefulReifect>} reifects - Reifects attached to the element.
 * @property {StatefulReifect<Shown>} [showTransition] - The transition used by `show`, if overridden.
 * @property {ReifectEnabledObject} enabled - Which reifect features are currently enabled.
 * @property {Delegate<() => void>} onTransitionStart - Fired when a transition begins.
 * @property {Delegate<() => void>} onTransitionEnd - Fired when a transition completes.
 */
type ReifectDataEntry = {
    reifects: GradumWeakSet<StatefulReifect>,
    showTransition?: StatefulReifect<Shown>,
    enabled: ReifectEnabledObject,
    onTransitionStart: Delegate<() => void>,
    onTransitionEnd: Delegate<() => void>,
};

/**
 * @internal
 * @class ReifectFunctionsUtils
 * @description Shared helpers and per-element state behind the reifect functions on {@link GradumSelector}.
 */
export class ReifectFunctionsUtils {
    private dataMap = new WeakMap<object, ReifectDataEntry>;

    public data(element: object): ReifectDataEntry {
        if (element instanceof GradumSelector) element = element.element;
        if (this.dataMap.has(element)) return this.dataMap.get(element);

        const newMap: ReifectDataEntry = {
            reifects: new GradumWeakSet(),
            enabled: {},
            onTransitionStart: new Delegate(),
            onTransitionEnd: new Delegate(),
        };

        if (element) this.dataMap.set(element, newMap);
        return newMap;
    }

    public attachReifect(element: object, reifect: StatefulReifect) {
        const data = this.data(element).reifects;
        if (!data.has(reifect)) data.add(reifect);
    }

    public detachReifect(element: object, reifect: StatefulReifect) {
        const data = this.data(element).reifects;
        if (data.has(reifect)) data.delete(reifect);
    }
}