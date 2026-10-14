import {describe, it, expect, beforeEach} from "vitest";
import {GradumEventManager} from "../gradumEventManager";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {div, input as inputElement, textarea} from "../../../elementCreation/basicElements";

let manager: GradumEventManager;
let pointer: any;

/**
 * jsdom has no `PointerEvent`, and an event only has a `target` once something dispatches it — so the
 * handler is called the way the other manager tests call it, with the target named outright.
 */
const press = (target: Node, pointerType: string = "mouse") => {
    const e = new MouseEvent("pointerdown", {clientX: 10, clientY: 10, bubbles: true, cancelable: true});
    Object.defineProperty(e, "target", {value: target, configurable: true});
    //A path reaching the document, as a dispatched event has: the manager reads it to decide whether the
    //press landed outside what it locked, and an empty one reads as outside everything.
    const path: any[] = [];
    for (let node: any = target; node; node = node.parentNode ?? node.host) path.push(node);
    path.push(window);
    Object.defineProperty(e, "composedPath", {value: () => path, configurable: true});
    Object.defineProperty(e, "pointerType", {value: pointerType, configurable: true});
    Object.defineProperty(e, "pointerId", {value: 1, configurable: true});
    pointer.pointerDown(e);
    return e;
};

const input = (type?: string) => {
    const el = inputElement({parent: document.body}) as HTMLInputElement;
    if (type) el.type = type;
    return el;
};

//An app that prevents defaults used to degrade every field inside it: cancelling the default of a press is
//how the platform is told not to move focus, place a caret, or extend a selection as the pointer drags.
describe("what the manager may prevent the default of", () => {
    beforeEach(() => {
        //jsdom has neither of these, and the handler reaches for both on the way past.
        (document as any).elementFromPoint ??= () => null;
        manager = GradumEventManager.create({enabled: true, preventDefaultMouse: true, preventDefaultTouch: true});
        pointer = (manager as any).pointerOperator;
    });

    it("prevents on an ordinary element", () => {
        expect(press(div({parent: document.body})).defaultPrevented).toBe(true);
    });

    it("leaves text entry alone", () => {
        const editable = div({parent: document.body});
        Object.defineProperty(editable, "isContentEditable", {value: true, configurable: true});

        expect(press(input()).defaultPrevented).toBe(false);
        expect(press(textarea({parent: document.body})).defaultPrevented).toBe(false);
        expect(press(editable).defaultPrevented).toBe(false);
    });

    it("leaves an input of an unknown type alone, which the browser reads as text", () => {
        const odd = input();
        odd.setAttribute("type", "shoesize");
        expect(press(odd).defaultPrevented).toBe(false);
    });

    it("still prevents on an input that is not somewhere you type", () => {
        expect(press(input("checkbox")).defaultPrevented).toBe(true);
        expect(press(input("range")).defaultPrevented).toBe(true);
    });

    it("reaches a field through the node the press actually landed on", () => {
        const editable = div({parent: document.body});
        Object.defineProperty(editable, "isContentEditable", {value: true, configurable: true});
        const inner = div({parent: editable});

        expect(press(inner).defaultPrevented).toBe(false);
    });

    it("lets an element opt its subtree out", () => {
        const scroller = div({parent: document.body});
        const inside = div({parent: scroller});
        gradum(scroller).preventDefaults = false;

        expect(press(scroller).defaultPrevented).toBe(false);
        expect(press(inside).defaultPrevented).toBe(false);
    });

    it("lets an element opt a field back in, over the text-entry default", () => {
        const text = input();
        gradum(text).preventDefaults = true;
        expect(press(text).defaultPrevented).toBe(true);
    });

    it("takes the answer from the nearest ancestor with an opinion", () => {
        const outer = div({parent: document.body});
        const middle = div({parent: outer});
        const inner = div({parent: middle});
        gradum(outer).preventDefaults = false;
        gradum(middle).preventDefaults = true;

        expect(press(inner).defaultPrevented).toBe(true);
        expect(press(outer).defaultPrevented).toBe(false);
    });

    it("goes back to having no opinion when unset", () => {
        const text = input();
        gradum(text).preventDefaults = true;
        expect(gradum(text).preventDefaults).toBe(true);

        gradum(text).preventDefaults = undefined;

        expect(gradum(text).preventDefaults).toBeUndefined();
        expect(press(text).defaultPrevented).toBe(false);
    });

    it("applies to touch too, which an app could not turn off on its own before", () => {
        manager.wheelEventsEnabled = true;
        manager.preventDefaultTouch = false;

        //Prevented regardless of `preventDefaultTouch`, because the wheel is emulated from touch.
        expect(press(div({parent: document.body}), "touch").defaultPrevented).toBe(true);
        //But no longer everywhere: a field can still be typed in.
        expect(press(input(), "touch").defaultPrevented).toBe(false);
    });

    it("takes focus off a field when the press lands elsewhere", () => {
        const text = input();
        const canvas = div({parent: document.body});
        text.focus();
        expect(document.activeElement).toBe(text);

        press(canvas);

        //The browser does this on a press, and cancelling the default is what stops it — so a field used to
        //stay focused, and stay open, however far away the next press was.
        expect(document.activeElement).not.toBe(text);
    });

    it("leaves focus alone where it did not prevent anything", () => {
        const text = input();
        const other = input();
        text.focus();

        //Pressing a second field is left to the browser, which moves focus itself.
        press(other);
        expect(document.activeElement).toBe(text);

        manager.preventDefaultMouse = false;
        press(div({parent: document.body}));
        expect(document.activeElement).toBe(text);
    });

    it("leaves focus alone for a press inside whatever is focused", () => {
        const holder = div({parent: document.body});
        const inner = div({parent: holder});
        //Prevented on, so the blur would otherwise run — but the press is inside what is focused.
        gradum(holder).preventDefaults = true;
        holder.tabIndex = 0;
        holder.focus();

        press(inner);

        expect(document.activeElement).toBe(holder);
    });

    it("takes a function, and decides per event", () => {
        const board = div({parent: document.body});
        const inside = div({parent: board});
        const seen: string[] = [];
        gradum(board).preventDefaults = (type) => {
            seen.push(type);
            return type !== "pointerdown";
        };

        expect(press(inside).defaultPrevented).toBe(false);
        expect(seen).toEqual(["pointerdown"]);
    });

    it("is one setting: the bare bool covers the press and the selection alike", () => {
        const board = div({parent: document.body});

        gradum(board).preventDefaults = true;

        //Read by the manager for the press...
        expect(press(board).defaultPrevented).toBe(true);
        //...and by a listener bound here for what the manager never sees.
        for (const type of ["selectstart", "dragstart", "contextmenu"]) {
            const e = new Event(type, {bubbles: true, cancelable: true});
            board.dispatchEvent(e);
            expect(e.defaultPrevented, type).toBe(true);
        }
    });

    it("unbinds what it bound when told not to prevent after all", () => {
        const board = div({parent: document.body});
        gradum(board).preventDefaults = true;

        gradum(board).preventDefaults = false;

        expect(press(board).defaultPrevented).toBe(false);
        const e = new Event("selectstart", {bubbles: true, cancelable: true});
        board.dispatchEvent(e);
        expect(e.defaultPrevented).toBe(false);
    });

    it("reaches the events the manager never sees, under the same decision", () => {
        const board = div({parent: document.body});
        const text = inputElement({parent: board}) as HTMLInputElement;
        gradum(board).preventDefaults = {types: ["selectstart"], phase: "bubble"};

        //One setting: the manager reads it for the press, a bound listener carries it to `selectstart`.
        expect(press(board).defaultPrevented).toBe(true);

        const onBoard = new Event("selectstart", {bubbles: true, cancelable: true});
        board.dispatchEvent(onBoard);
        expect(onBoard.defaultPrevented).toBe(true);

        //And the field inside it is still a field — a blanket `selectstart` used to reach in and kill
        //selection there too, since the predicate was read off the node the listener was bound to.
        const onField = new Event("selectstart", {bubbles: true, cancelable: true});
        text.dispatchEvent(onField);
        expect(onField.defaultPrevented).toBe(false);
    });

    it("lets the long form carry a per-event decision the manager reads too", () => {
        const board = div({parent: document.body});
        gradum(board).preventDefaults = {types: ["selectstart"], on: type => type === "selectstart"};

        expect(typeof gradum(board).preventDefaults).toBe("function");
        //The manager asks the same question and is told no, for a type this one does not cover.
        expect(press(board).defaultPrevented).toBe(false);

        const e = new Event("selectstart", {bubbles: true, cancelable: true});
        board.dispatchEvent(e);
        expect(e.defaultPrevented).toBe(true);
    });

    it("prevents nothing anywhere when the manager is not set to", () => {
        manager.preventDefaultMouse = false;
        expect(press(div({parent: document.body})).defaultPrevented).toBe(false);
    });
});
