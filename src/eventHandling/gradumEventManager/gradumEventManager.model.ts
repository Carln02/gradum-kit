import {
    ActionMode,
    ClickMode,
    InputDevice,
    GradumEventManagerLockStateProperties,
    GradumEventManagerStateProperties
} from "./gradumEventManager.types";
import {GradumEventManagerUtilsHandler} from "./handlers/gradumEventManager.utilsHandler";
import {handler} from "../../decorators/mvc";
import {GradumModel} from "../../mvc/model/model";
import {auto} from "../../decorators/auto/auto";
import {Point} from "../../gradumComponents/datatypes/point/point";
import {GradumMap} from "../../gradumComponents/datatypes/map/map";
import {GradumWeakSet} from "../../gradumComponents/datatypes/weakSet/weakSet";
import {Delegate} from "../../gradumComponents/datatypes/delegate/delegate";
import {signal} from "../../decorators/reactivity/reactivity";

export class GradumEventManagerModel extends GradumModel {
    @handler() public utils: GradumEventManagerUtilsHandler;

    public readonly state: GradumEventManagerStateProperties = GradumModel.from({
        enabled: true,
        preventDefaultMouse: false,
        preventDefaultTouch: false,
        preventDefaultWheel: false
    });

    public lockState: GradumEventManagerLockStateProperties = GradumModel.from();

    //Delegate fired when the input device changes
    public readonly onInputDeviceChange: Delegate<(device: InputDevice) => void>
        = new Delegate<(device: InputDevice) => void>();

    /**
     * @description Delegate fired when a tool is changed on a certain click button/mode
     */
    public readonly onToolChange: Delegate<(oldTool: Node, newTool: Node, type: ClickMode) => void> = new Delegate();

    //Input events states
    public readonly currentKeys: string[] = GradumModel.from([]);
    @signal public currentAction: ActionMode = ActionMode.none;
    @signal public currentClick: ClickMode = ClickMode.none;
    @signal public wasRecentlyTrackpad: boolean = false;

    //Threshold differentiating a click from a drag
    @signal public moveThreshold: number = 10;
    //Duration to reach long press
    @signal public longPressDuration: number = 500;

    @signal public authorizeEventScaling: boolean | (() => boolean);
    @signal public scaleEventPosition: (position: Point) => Point;

    public activePointers = new Set<number>();

    //Saved values (Maps to account for different touch points and their IDs)
    public readonly origins: GradumMap<number, Point> = new GradumMap();
    public readonly previousPositions: GradumMap<number, Point> = new GradumMap();
    public positions: GradumMap<number, Point>;

    public lastTargetOrigin: Node;

    //Single timer instance --> easily cancel it and set it again
    public readonly timerMap: GradumMap<string, NodeJS.Timeout> = new GradumMap();

    //All created tools
    public readonly tools: Map<string, GradumWeakSet<Node>> = new Map();
    //Tools mapped to keys
    public readonly mappedKeysToTool: Map<string, string> = new Map();

    //Tools currently held by the user (one - or none - per each click button/mode)
    public readonly currentTools: Map<ClickMode, Node> = new Map();

    @auto({
        callBefore: function (value) {
            if (value == InputDevice.trackpad) this.wasRecentlyTrackpad = true
        }
    })
    public set inputDevice(value: InputDevice) {
        this.onInputDeviceChange.fire(value);
    }
}