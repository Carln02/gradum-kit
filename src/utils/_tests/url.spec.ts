import {describe, it, expect, beforeEach} from "vitest";
import {clearUrlParams, getUrlParam} from "../computations/url";

describe("clearUrlParams", () => {
    beforeEach(() => history.replaceState(null, "", "/base"));

    // The original deleted while iterating the URLSearchParams, which shifts the
    // remaining entries — so a=1&b=2&c=3&d=4 was left as b=2&d=4.
    it("removes every parameter in a single call", () => {
        history.replaceState(null, "", "/base?a=1&b=2&c=3&d=4");

        clearUrlParams();

        expect(new URL(window.location.href).search).toBe("");
        for (const name of ["a", "b", "c", "d"]) expect(getUrlParam(name)).toBeNull();
    });

    it("removes an odd number of parameters too", () => {
        history.replaceState(null, "", "/base?a=1&b=2&c=3");

        clearUrlParams();

        expect(new URL(window.location.href).search).toBe("");
    });

    it("keeps the path and leaves a param-less URL untouched", () => {
        history.replaceState(null, "", "/some/path?x=1");

        clearUrlParams();

        expect(new URL(window.location.href).pathname).toBe("/some/path");

        clearUrlParams();
        expect(new URL(window.location.href).search).toBe("");
    });
});
