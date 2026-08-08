import {beforeAll, beforeEach} from "vitest";
import {gradumify} from "./gradumFunctions/gradumFunctions";

beforeAll(() => gradumify());
beforeEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
});