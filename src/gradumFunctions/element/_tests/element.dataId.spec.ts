import {describe, it, expect} from "vitest";
import {gradum} from "../../gradumFunctions";
import {div} from "../../../elementCreation/basicElements";
import {GradumModel} from "../../../mvc/model/model";
import {modelSignal} from "../../../decorators/reactivity/reactivity";

/**
 * `setProperties` used to assign `model.id = dataId` unconditionally. When no `dataId` was passed that
 * wrote `undefined`, and on a model whose `id` is a @modelSignal the write lands in the data itself —
 * wiping the id that arrived with `data`.
 */
class IdModel extends GradumModel {
    // `id` deliberately shadows GradumModel's own `id` with a data-backed signal — that is the shape
    // real models use (e.g. the musicPlayer SongModel) and the one the bug depends on.
    // @ts-expect-error - intentional override of the base property with a signal-backed one.
    @modelSignal() public id: string;
    @modelSignal() public title: string;
}

describe("setProperties: dataId must not clobber the model's id", () => {
    it("keeps data.id when no dataId is supplied", () => {
        const el = div();
        gradum(el).setProperties({model: IdModel, data: {id: "song-42", title: "Bye Bye Bye"}} as any);

        const model = gradum(el).model as IdModel;
        expect(model.id).toBe("song-42");
        expect(model.title).toBe("Bye Bye Bye");
    });

    it("still honours an explicitly supplied dataId", () => {
        const el = div();
        gradum(el).setProperties({model: IdModel, data: {id: "original"}, dataId: "override"} as any);

        expect((gradum(el).model as IdModel).id).toBe("override");
    });

    it("leaves the id reachable for lookups keyed on it", () => {
        const catalogue = [{id: "a", title: "A"}, {id: "b", title: "B"}];
        const el = div();
        // pass a copy: with the bug the copy's id is wiped, and the catalogue stays intact,
        // so the lookup genuinely fails instead of accidentally matching the wiped entry.
        gradum(el).setProperties({model: IdModel, data: {...catalogue[1]}} as any);

        const id = (gradum(el).model as IdModel).id;
        expect(id).toBe("b");
        expect(catalogue.find(e => e.id === id)?.title).toBe("B");
    });
});
