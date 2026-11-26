import {ClickMode, div, GradumButton, GradumEventManager, GradumTool, gradum} from "../../../build/gradum-kit.esm";

//=====================================================================================================================
// 6. TOOLS AND CONSTRAINERS AT RUNTIME — the usual setup is a class (component.tool.ts, component.constrainer.ts).
// These are the calls you make from outside: building a toolbar, switching modes, wiring things up.
//=====================================================================================================================

const manager = GradumEventManager.instance;   //Owns which tool is in hand, per click mode.

//== A toolbar button that is a tool ===================================================================================
const button = GradumButton.create({text: "My tool", parent: document.body});
new GradumTool({element: button, toolName: "my-tool"}).initialize();   //Clicking the button now picks it up.
//(Normally you'd use your own tool class, e.g. new ComponentTool({...}), so it comes with its behaviors.)

manager.setTool(button, ClickMode.left);             //Pick it up from code (e.g. the default tool on load).
manager.getCurrentToolName();                        //"my-tool"
manager.onToolChange.add((previous, next) => {});

//== An embedded tool: a handle that acts on another object ============================================================
const box = div({parent: document.body});
const handle = div({parent: box});
new GradumTool({element: handle, toolName: "my-tool", embeddedTarget: box, customActivation: () => {}}).initialize();
//Using the handle applies the tool to the box, without changing the tool in hand.

//== Objects opting out ================================================================================================
gradum(box).ignoreTool("my-tool");                   //The tool skips this object.

//== Constrainers ======================================================================================================
const canvas = div({parent: document.body});
gradum(canvas).activateConstrainer("grid");          //Switch modes on and off by name.
gradum(canvas).deactivateConstrainer("grid");
gradum(canvas).getConstrainerObjectList("grid").add(box);   //Constrain an object that isn't a child.
gradum(canvas).solveConstrainer({constrainer: "grid"});     //Solve now, without an interaction.
