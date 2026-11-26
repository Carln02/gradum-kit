import {$, div, g, gr, gradum} from "../../../build/gradum-kit.esm";

//=====================================================================================================================
// 2. THE SELECTOR — gradum(x) wraps anything and gives it the toolkit's operations. Think jQuery.
//
// - Aliases: gradum(el) = g(el) = gr(el) = $(el).
// - Chainable: most calls return the wrapper.
// - Forgiving: undefined targets and bad arguments are ignored, not thrown.
// - Cached: gradum(el) always returns the same wrapper.
// - Works on non-elements too (a view → its element; any object → metadata, tools, constrainers...).
// - Type gradum(el). in your IDE to see everything.
//=====================================================================================================================

const el = div();

//== Hierarchy =========================================================================================================
gradum(el).addToParent(document.body).addChild(div()).addChild(div(), 0);
gradum(el).remChild(el.firstChild);
gradum(el).closest("my-component");   //By tag, or by class: gradum(el).closest(Component)
gradum(el).childrenArray;
gradum(el).remove();

//== Metadata — a key-value store on any object (tools read it) ========================================================
gradum(el).metadata.set(true, "modifiable");   //Value first, then key.
gradum(el).metadata.get("modifiable");

//== Selection =========================================================================================================
gradum(el).selected = true;
gradum(el).onSelected.add((selected: boolean) => {});

//== The rest, by topic (see the next files) ===========================================================================
//  3-classesAndStyles.ts   addClass, toggleClass, setStyle, show...
//  4-events.ts             on, onTool, removeListener...
//  6-toolsAndConstrainers.ts  makeTool, embedTool, activateConstrainer...
//  Also: model, view, emitter, data, add/get/removeOperator (and handlers, interactors, tools, constrainers).
