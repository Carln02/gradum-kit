import {GradumEventManagerModel} from "../gradumEventManager.model";
import {ClickMode} from "../gradumEventManager.types";
import {$} from "../../../gradumFunctions/gradumFunctions";
import {GradumHandler} from "../../../mvc/handler/handler";
import {DefaultEventName} from "../../../types/eventNaming.types";

export class GradumEventManagerUtilsHandler extends GradumHandler<GradumEventManagerModel> {
    public keyName: string = "utils";

    public setClickMode(button: number, isTouch: boolean = false): ClickMode {
        if (isTouch) button--;
        switch (button) {
            case -1:
                this.model.currentClick = ClickMode.none;
                return;
            case 0:
                this.model.currentClick = ClickMode.left;
                return;
            case 1:
                this.model.currentClick = ClickMode.middle;
                return;
            case 2:
                this.model.currentClick = ClickMode.right;
                return;
            default:
                this.model.currentClick = ClickMode.other;
                return;
        }
    }

    public applyEventNames(eventNames: Record<string, string>) {
        for (const eventName in eventNames) DefaultEventName[eventName] = eventNames[eventName];
    }

    //Sets a timer function associated with a certain event name, with its duration
    public setTimer(timerName: string, callback: () => void, duration: number) {
        this.clearTimer(timerName);
        this.model.timerMap.set(timerName, setTimeout(() => {
            callback();
            this.clearTimer(timerName);
        }, duration));
    }

    //Clears timer associated with the provided event name
    public clearTimer(timerName: string) {
        const timer = this.model.timerMap.get(timerName);
        if (!timer) return;
        clearTimeout(timer);
        this.model.timerMap.delete(timerName);
    }

    public activateTool(element: Node, toolName: string, value: boolean) {
        if (value) $(element).onToolActivate(toolName).fire();
        else $(element).onToolDeactivate(toolName).fire();
    }
}