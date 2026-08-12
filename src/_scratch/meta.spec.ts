import {describe, it} from "vitest";
import {gradum} from "../gradumFunctions/gradumFunctions";
import {div} from "../elementCreation/basicElements";
import {GradumModel} from "../mvc/model/model";
import {effect, signal} from "../decorators/reactivity/reactivity";

const tick = () => new Promise(r => setTimeout(r, 0));

describe("reactivity, measured after a tick", () => {
    it("i: plain signal", async () => {
        const s = signal(0);
        let runs = 0, seen: any;
        effect(() => { runs++; seen = s.value; });
        const a = runs; s.value = 5; await tick();
        console.log(`  i   plain signal        : ${a} -> ${runs}  seen=${seen}  ${runs > a ? "REACTIVE" : "NOT"}`);
    });

    it("ii: metadata.get() in the effect", async () => {
        const el = div(); gradum(el).setMvc({model: GradumModel} as any);
        const meta = gradum(el).metadata;
        let runs = 0, seen: any;
        effect(() => { runs++; seen = meta.get("isSpacer"); });
        const a = runs; meta.set(true, "isSpacer"); await tick();
        console.log(`  ii  metadata.get()      : ${a} -> ${runs}  seen=${seen}  ${runs > a ? "REACTIVE" : "NOT"}`);
    });

    it("iii: metadata.makeSignal box", async () => {
        const el = div(); gradum(el).setMvc({model: GradumModel} as any);
        const meta = gradum(el).metadata;
        const box = meta.makeSignal("isPusher");
        let runs = 0, seen: any;
        effect(() => { runs++; seen = box.value; });
        const a = runs; meta.set(true, "isPusher"); await tick();
        console.log(`  iii makeSignal box      : ${a} -> ${runs}  seen=${seen}  ${runs > a ? "REACTIVE" : "NOT"}`);
    });

    it("iv: write through the box instead", async () => {
        const el = div(); gradum(el).setMvc({model: GradumModel} as any);
        const box = gradum(el).metadata.makeSignal("isPusher");
        let runs = 0, seen: any;
        effect(() => { runs++; seen = box.value; });
        const a = runs; box.value = true; await tick();
        console.log(`  iv  write via box       : ${a} -> ${runs}  seen=${seen}  ${runs > a ? "REACTIVE" : "NOT"}`);
    });
});
