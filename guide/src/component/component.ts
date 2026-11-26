import {constrainer, define, expose, GradumElement, gradum, interactor, operator, signal, tool} from "../../../build/gradum-kit.esm";
import {ComponentView} from "./component.view";
import {ComponentData} from "./component.types";
import {ComponentModel} from "./component.model";
import {ComponentOperator} from "./component.operator";
import {ComponentHandler} from "./component.handler";
import {ComponentInteractor} from "./component.interactor";
import {ComponentTool} from "./component.tool";
import {ComponentConstrainer} from "./component.constrainer";

//=====================================================================================================================
// THE ELEMENT — a custom HTML element, and the public API of your component.
//
// A component is split into up to 8 kinds of files. Read them in this order:
//   component.ts              Element      The HTML element itself. What other code calls.
//   component.types.ts        Types        The shape of its data, and other types.
//   component.model.ts        Model        Data + signals. Knows nothing else.
//   component.view.ts         View         Builds the DOM, re-renders with @effect.
//   component.operator.ts     Operator     Logic that isn't drawing or data.
//   component.handler.ts      Handler      Helper functions over the model's data.
//   component.interactor.ts   Interactor   Event listeners on this element (bubble phase).
//   component.tool.ts         Tool         Something the user picks up and applies to anything (capture phase).
//   component.constrainer.ts  Constrainer  Rules kept true after every interaction.
//
// Only the element is required. Add the others when the element file gets crowded.
// Generic types (<View, Data, Model>) are optional — they only give you auto-completion.
//=====================================================================================================================

export class Component extends GradumElement<ComponentView, ComponentData, ComponentModel> {
    //== Defaults ======================================================================================================
    //Applied on create() unless overridden: Component.create({view: OtherView}).
    //Merged along the inheritance chain, so a subclass only lists what it changes.
    //Every role takes a class (instantiated for you) or an instance. Plural roles take one or an array.
    public static defaultProperties = {
        model: ComponentModel,
        view: ComponentView,
        operators: ComponentOperator,
        handlers: ComponentHandler,
        interactors: ComponentInteractor,
        tools: ComponentTool,
        constrainers: ComponentConstrainer,
        data: {a: "hello", b: "world", x: 4},
    };

    //== Exposing fields ===============================================================================================
    @expose("model") public a: string;             //Get + set forward to this.model.a
    @expose("model", false) public b: string;      //Get only
    //The root can be a dot path: @expose("view.paragraphElement").

    //== Signals =======================================================================================================
    @signal public highlighted: boolean = false;   //Signals work anywhere, not just in the model (see the model).

    //== Retrieving attached instances =================================================================================
    //The key is the field name minus the role: videoOperator → "video". Or pass it: @operator("video").
    @operator() protected videoOperator: ComponentOperator;
    @interactor() protected myInteractor: ComponentInteractor;
    @tool() protected myTool: ComponentTool;
    @constrainer() protected myConstrainer: ComponentConstrainer;
    //Handlers belong to the model: retrieve them there with @handler().

    //Properties applied to feedforward clones (the preview copies created by this.feedforward()).
    public defaultFeedforwardProperties = {classes: "feedforward"};

    //== Lifecycle =====================================================================================================
    //Runs after the view, model, and every operator/handler/etc. are wired. Use all of them freely here.
    public initialize() {
        super.initialize();
        gradum(this).metadata.set(true, "modifiable");   //Tools read metadata to decide what they may act on.
    }

    //No view? These run inside initialize(), in this order, and play the same roles as the view's (see the view).
    protected setupUIElements() {super.setupUIElements();}
    protected setupUILayout() {super.setupUILayout();}
    protected setupUIListeners() {super.setupUIListeners();}

    //== Cheat sheet ===================================================================================================
    private api() {
        Component.create({parent: document.body, classes: "big", data: {a: "hi"}}); //Make one. Any element property works.

        this.model; this.view; this.emitter;        //MVC parts. The emitter is shared with the view and operators.
        this.data; this.dataSize;                   //The model's data.
        this.initialized;                           //Readonly.
        this.operators; this.handlers; this.interactors; this.tools; this.constrainers;   //All attached instances.

        this.onAttach; this.onDetach; this.onAdopt; //Delegates: added to / removed from / moved in the DOM.
        this.clone({});                             //A copy.
        this.feedforward({});                       //A preview copy (same one returned until removed).
        this.destroy();                             //Remove and tear down everything.

        gradum(this).selected;                      //Everything else is on the selector (utils/2-selector.ts).
        gradum(this).onSelected;
    }
}

//Register with the browser. The tag needs a dash. Omit it and it's derived from the class name.
define(Component, "my-component");
