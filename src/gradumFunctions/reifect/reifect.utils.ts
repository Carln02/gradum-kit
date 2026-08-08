import {GradumSelector} from "../gradumSelector";
import {StatefulReifect} from "../../gradumComponents/wrappers/statefulReifect/statefulReifect";
import {ReifectEnabledObject} from "../../gradumComponents/wrappers/statefulReifect/statefulReifect.types";
import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";
import {GradumWeakSet} from "../../gradumComponents/datatypes/weakSet/weakSet";
import {Shown} from "../../types/enums.types";

type ReifectDataEntry = {
    reifects: GradumWeakSet<StatefulReifect>,
    showTransition?: StatefulReifect<Shown>,
    enabled: ReifectEnabledObject,
    onTransitionStart: Delegate<() => void>,
    onTransitionEnd: Delegate<() => void>,
};

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