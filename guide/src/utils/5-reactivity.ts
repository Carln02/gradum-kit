import {Delegate, effect, signal, untrack} from "../../../build/gradum-kit.esm";

//=====================================================================================================================
// 5. REACTIVITY — signals hold values; effects re-run when the signals they read change.
// In classes, use the decorators (@signal, @dataSignal, @effect — see the model and view).
// Outside classes, use the functions below.
//=====================================================================================================================

//== Signals and effects ===============================================================================================
const count = signal(0);                          //A signal box. Read/write .value.

const dispose = effect(() => {                    //Runs now, then whenever count changes.
    console.log("count is", count.value);
});

count.value++;                                    //Logs "count is 1" (effects are batched to the next microtask).
untrack(() => count.value);                       //Read without subscribing.
dispose();                                        //Stop the effect.

//== Delegates — the toolkit's callback lists (onAttach, onSelected, onDataChanged...) ==================================
const onSaved = new Delegate<(name: string) => void>();
const log = (name: string) => console.log("saved", name);
onSaved.add(log);
onSaved.fire("file.txt");
onSaved.remove(log);
