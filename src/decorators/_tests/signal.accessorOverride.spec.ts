import {describe, it, expect} from "vitest";
import {effect, initializeEffects, signal} from "../reactivity/reactivity";

const tick = () => new Promise(resolve => queueMicrotask(resolve as () => void));

//A subclass overriding a `@signal` getter/setter pair and reaching its parent's through `super` is ordinary
//JavaScript, and it is what `GradumNumericalInput` does to `GradumInput`. The signal wrapper used to be
//installed on the most-derived prototype, which put it in front of the override rather than behind it: the
//subclass's own setter became the wrapper's inner setter, so its `super` write came straight back into the
//wrapper and the pair recursed until the stack ran out.
describe("@signal on an accessor a subclass overrides", () => {
    class Base {
        protected stored: string = "";

        @signal public get value(): string {
            return this.stored;
        }

        public set value(v: string) {
            this.stored = v;
        }
    }

    class Derived extends Base {
        public get value(): string {
            return super.value;
        }

        public set value(v: string) {
            super.value = `${v}!`;
        }
    }

    it("writes through the subclass without recursing", () => {
        const derived = new Derived();
        derived.value = "a";
        expect(derived.value).toBe("a!");
    });

    it("leaves the base class working on its own", () => {
        const base = new Base();
        base.value = "a";
        expect(base.value).toBe("a");
    });

    it("keeps the two apart", () => {
        const base = new Base();
        const derived = new Derived();

        base.value = "x";
        derived.value = "y";

        expect(base.value).toBe("x");
        expect(derived.value).toBe("y!");
    });

    it("still tracks reads made through the subclass", async () => {
        const derived = new Derived();
        const seen: string[] = [];

        initializeEffects(derived);
        const dispose = effect(() => seen.push(derived.value));

        derived.value = "b";
        await tick();

        expect(seen.at(-1)).toBe("b!");
        dispose();
    });

    it("does not run the subclass's setter twice", () => {
        const writes: string[] = [];

        class Counted extends Base {
            public set value(v: string) {
                writes.push(v);
                super.value = v;
            }

            public get value(): string {
                return super.value;
            }
        }

        const counted = new Counted();
        counted.value = "once";

        expect(writes).toEqual(["once"]);
        expect(counted.value).toBe("once");
    });
});
