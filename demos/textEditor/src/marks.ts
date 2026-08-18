import {Mark} from "./mark/mark";
import {ErasingMark} from "./erasingMark/erasingMark";
import {GrowingMark} from "./growingMark/growingMark";
import {RotateMark} from "./rotateMark/rotateMark";
import {ResizeMark} from "./resizeMark/resizeMark";
import {BudgetMark} from "./budgetMark/budgetMark";

/**
 * @description Every kind of mark the editor knows, each the class that both defines it and stands for it.
 *
 * Handed to the editor twice over: once to tell the document what marks there are, and once to find the
 * passages of each kind in it — a class knows both what its mark is and what can be done to one.
 */
export const markTypes: (typeof Mark)[] = [ErasingMark, GrowingMark, RotateMark, ResizeMark, BudgetMark];
