import {Mark} from "@tiptap/core";
import {Plugin, Transaction} from "@tiptap/pm/state";

export const Budgets = "budget";

export const Budget = Mark.create<{allows: (transaction: Transaction) => boolean}>({
    name: "budget",
    group: Budgets,
    inclusive: true,
    addOptions()  {
        return {allows: () => true};
    },
    addProseMirrorPlugins() {
        const allows = this.options.allows;
        return [new Plugin({filterTransaction: transaction => allows(transaction)})];
    },
    addAttributes() {
        return {
            max: {
                default: null,
                parseHTML: element => Number(element.getAttribute("data-max")),
                renderHTML: attributes => ({"data-max": attributes.max})
            }
        };
    },
    parseHTML: () => [{tag: "span[data-budget]"}],
    renderHTML: ({HTMLAttributes}) =>
        ["span", {"data-budget": "true", ...HTMLAttributes}, 0]
});
