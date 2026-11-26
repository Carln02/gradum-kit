import {DefaultEventName, div, GradumDragEvent, gradum, Propagation} from "../../../build/gradum-kit.esm";

//=====================================================================================================================
// 4. EVENTS — the toolkit turns raw pointer/touch/key input into higher-level events, all prefixed "gradum-".
//
// Click   gradum-click, gradum-click-start, gradum-click-end, gradum-long-press
// Drag    gradum-drag-start, gradum-drag, gradum-drag-end
// Move    gradum-move
// Wheel   gradum-scroll, gradum-pinch
// Keys    gradum-key-pressed, gradum-key-released
// Use the DefaultEventName constants rather than strings (DefaultEventName.dragEnd).
//
// Each interaction runs two loops over the event's path:
//   1. Capture (document → touched element): the active tool's @behaviors.
//   2. Bubble  (touched element → document): @listeners, then gradum(el).on() listeners.
// Return a Propagation value to stop a loop early (see component.interactor.ts).
//=====================================================================================================================

const el = div({parent: document.body});

//== Listening =========================================================================================================
const onDrag = (e: GradumDragEvent) => console.log(e.deltaPosition);
gradum(el).on(DefaultEventName.drag, onDrag);                   //Any tool.
gradum(el).onTool(DefaultEventName.click, "select", () => {   //Only while "select" is in hand.
    return Propagation.stopPropagation;
});
gradum(el).removeListener(DefaultEventName.drag, onDrag);

//For a group of listeners on a component, prefer an interactor (component.interactor.ts).
