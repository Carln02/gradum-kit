import {auto, GradumModel, handler, dataSignal, signal} from "../../../build/gradum-kit.esm";
import {ComponentData} from "./component.types";
import {ComponentHandler} from "./component.handler";

//=====================================================================================================================
// THE MODEL — the component's data and state. It knows nothing about the element or the view.
//
// GradumModel   Local, in-memory data.
// GradumYModel  Same API, but the data is a Yjs YMap/YArray: synced and persisted. Use it for collaboration.
//=====================================================================================================================

export class ComponentModel extends GradumModel<ComponentData> {
    //== Signals =======================================================================================================
    //When a signal changes, every @effect that read it re-runs (see the view).

    @signal counter: number = 0;           //Plain reactive field, kept in memory.

    @dataSignal() a: string;              //Reactive AND stored in this.data["a"] (the field name is the key).
    @dataSignal() b: string;
    @dataSignal() x: number;
    //Nested key path: @dataSignal("settings", "theme") reads this.data.settings.theme.

    //@auto() adds preprocessing or side effects to a signal.
    //Options: preprocessValue, callBefore, callAfter, defaultValue, initialValue, cancelIfUnchanged, setIfUndefined...
    @signal @auto({preprocessValue: (v: number) => Math.min(100, Math.max(0, v))})
    public percentage: number = 0;         //Clamped to 0–100.

    //== Handlers ======================================================================================================
    @handler() myHandler: ComponentHandler;   //Key "my", from the field name. Used as this.myHandler.reset().

    //== Lifecycle =====================================================================================================
    protected setup() {                    //Runs in the constructor.
        super.setup();
        this.onDataChanged.add(() => {});   //A good place to react when this.data is replaced.
    }

    //== Cheat sheet ===================================================================================================
    private api() {
        this.data;                         //Get or replace the whole data.
        this.get("a");                     //Read a key path.          Same as this.a
        this.set("Hello", "a");            //Write (value first).      Same as this.a = "Hello"
        this.add(5);                       //Append (arrays) and return the new key.
        this.has("tt"); this.delete("tt");
        this.keys; this.values; this.dataSize;
        this.onDataChanged; this.onKeyChanged;   //Delegates.

        //Collections: create an element per entry, remove it when the entry goes. Usually set up in the view.
        this.generateObserver({
            onAdded: (data) => undefined,                  //Return the instance you created.
            onDeleted: (data, instance) => undefined,
        });
    }
}
