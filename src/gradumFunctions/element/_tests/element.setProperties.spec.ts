import {describe, it, expect, vi} from "vitest";
import {$} from "../../gradumFunctions";

describe("GradumSelector.setProperties (base props)", () => {
    it("sets id and classes, and wires event listeners", () => {
        const el = document.createElement("div");
        const handler = vi.fn();

        const sel = $(el).setProperties({
            id: "abc",
            classes: "foo bar",
            listeners: {click: () => handler},
        } as any);

        expect(sel.element).toBe(el);
        expect(el.id).toBe("abc");
        expect(el.classList.contains("foo")).toBe(true);
        expect(el.classList.contains("bar")).toBe(true);
        expect($(el).hasListenersByType("click")).toBe(true);
    });

    it("appends children to the element via `children`", () => {
        const parent = document.createElement("div");
        const c1 = document.createElement("span");
        const c2 = document.createElement("i");

        $(parent).setProperties({children: [c1, c2]} as any);

        expect(parent.children.length).toBe(2);
        expect(parent.children[0]).toBe(c1);
        expect(parent.children[1]).toBe(c2);
    });

    it("appends element to provided `parent`", () => {
        const parent = document.createElement("div");
        const child = document.createElement("p");

        $(child).setProperties({parent} as any);
        expect(parent.contains(child)).toBe(true);
    });

    it("applies stylesheet to closestRoot", () => {
        const el1 = document.createElement("div");
        const headBefore = document.head.querySelectorAll("style").length;

        $(el1).setProperties({stylesheet: "/* css head */"} as any);

        const headAfter = document.head.querySelectorAll("style").length;
        expect(headAfter).toBeGreaterThanOrEqual(headBefore);

        const host = document.createElement("div");
        const shadow = host.attachShadow({mode: "open"});
        document.body.appendChild(host);

        const el2 = document.createElement("div");
        shadow.appendChild(el2);

        const shadowBefore = shadow.querySelectorAll("style").length;

        $(el2).setProperties({stylesheet: "/* css shadow */"} as any);

        const shadowAfter = shadow.querySelectorAll("style").length;
        expect(shadowAfter).toBeGreaterThanOrEqual(shadowBefore);
    });

    it("supports `out` being a string (sets __outName) or object (assigns selector fields)", () => {
        const el = document.createElement("div");

        const sel = $(el).setProperties({out: "refName"} as any);
        expect((sel as any).__outName).toBe("refName");

        const outObj: any = {};
        const sel2 = $(el).setProperties({out: outObj} as any);
        // `Object.assign(outObj, this)` -> expect we received at least the element handle
        expect(outObj.element).toBe(el);
        expect(outObj).toMatchObject({element: el});
        // and chaining still returns the selector
        expect(sel2.element).toBe(el);
    });

    it("when setOnlyBaseProperties=true, ignores unknown props (no dynamic assignment)", () => {
        const el = document.createElement("div");
        const sel = $(el) as any;

        sel.setProperties(
            {dataFoo: 1, id: "ok"} as any,
            true // base-only
        );
        expect(el.id).toBe("ok");
        expect(sel.dataFoo).toBeUndefined(); // not assigned
    });
});

describe("GradumSelector.setProperties (text/style)", () => {
    it("sets innerText when `text` is provided", () => {
        const el = document.createElement("div");
        $(el).setProperties({text: "hello"} as any);
        expect(el.innerText).toBe("hello");
    });

    it("appends to style.cssText when `style` string is provided", () => {
        const el = document.createElement("div");
        $(el).setProperties({style: "width:10px;"} as any);
        expect(el.style.width).toBe("10px");
    });
});

describe("GradumSelector.setProperties (data-* attributes)", () => {
    it("sets a data-* key as the attribute it names, readable through dataset", () => {
        const el = document.createElement("button");

        $(el).setProperties({"data-cart": "cart-1"} as any);

        expect(el.getAttribute("data-cart")).toBe("cart-1");
        expect(el.dataset.cart).toBe("cart-1");
        expect(el.outerHTML).toBe(`<button data-cart="cart-1"></button>`);
        //The point of the whole thing: it is an attribute, not a property that merely looks like one.
        expect((el as any)["data-cart"]).toBeUndefined();
    });

    it("stringifies non-string values, and keeps multi-word keys camel-cased in dataset", () => {
        const el = document.createElement("div");

        $(el).setProperties({"data-count": 3, "data-open": true, "data-cart-id": "cart-2"} as any);

        expect(el.getAttribute("data-count")).toBe("3");
        expect(el.getAttribute("data-open")).toBe("true");
        expect(el.dataset.cartId).toBe("cart-2");
    });

    it("takes the attribute off for null, and leaves it alone for undefined", () => {
        const el = document.createElement("div");
        el.setAttribute("data-kept", "yes");
        el.setAttribute("data-gone", "yes");

        $(el).setProperties({"data-gone": null, "data-kept": undefined} as any);

        expect(el.hasAttribute("data-gone")).toBe(false);
        expect(el.getAttribute("data-kept")).toBe("yes");
    });

    it("leaves a bare `data-` key to the property path, since it names no attribute", () => {
        const el = document.createElement("div");

        $(el).setProperties({"data-": "x"} as any);

        expect(el.hasAttribute("data-")).toBe(false);
        expect((el as any)["data-"]).toBe("x");
    });

    it("sets data-* even when only base properties are asked for", () => {
        const el = document.createElement("div");

        $(el).setProperties({"data-cart": "cart-1", someField: "ignored"} as any, true);

        expect(el.getAttribute("data-cart")).toBe("cart-1");
        expect((el as any).someField).toBeUndefined();
    });
});
