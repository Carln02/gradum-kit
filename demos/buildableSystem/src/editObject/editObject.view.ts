import {GradumView, GradumSelect, div, gradum, h3, untrack, effect, GradumInput, getRegisteredEntry, GradumRichElement} from "../../../../build/gradum-kit.esm";
import {EditObject} from "./editObject";

export class EditObjectView extends GradumView<EditObject> {
    private readonly tabs: Map<string, HTMLElement> = new Map();

    private tagName: HTMLElement;
    private tabSelector: GradumSelect;
    private tabsParent: HTMLElement;

    private panelSelector: GradumSelect;
    private panelsParent: HTMLElement;

    protected setupUIElements() {
        super.setupUIElements();

        this.tagName = h3();
        this.tabs.set("Properties", div({classes: "properties-panel"}));
        this.tabs.set("MVC", div({classes: "mvc-panel"}));

        this.tabsParent = div({classes: "tabs"});
        this.panelsParent = div({classes: "panels"});
        this.panelSelector = GradumSelect.create<any>({entries: Array.from(this.tabs.values()), parent: this.panelsParent});
        this.tabSelector = GradumSelect.create<any>({values: Array.from(this.tabs.keys()), parent: this.tabsParent});

        this.tabSelector.onSelect.add((b, entry) => {
            if (!b) return;
            const panel = this.tabs.get(this.tabSelector.getValue(entry));
            this.panelSelector.select(panel);
        });
        this.tabSelector.select("MVC").select("Properties");
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([div({children: this.tagName}), this.tabsParent, this.panelsParent]);
    }

    @effect updateTag() {
        this.tagName.textContent = this.element.anchor.tagName;
    }

    @effect updateProperties() {
        const anchor = this.element.anchor;
        if (!anchor) return;
        const panel = this.tabs.get("Properties");
        if (!panel) return;
        gradum(panel).removeAllChildren();

        untrack(() => {
            const properties = gradum(anchor).getFields();
            for (const [key, value] of Object.entries(properties)) {

                const input = GradumInput.create({label: key, parent: panel, value});
                let timer: number;
                input.onInput.add(() => {
                    cancelAnimationFrame(timer);
                    timer = requestAnimationFrame(() => anchor[key] = input.value);
                });
            }
        });
    }

    @effect updateMVC() {
        const panel = this.tabs.get("MVC");
        if (!panel) return;
        gradum(panel).removeAllChildren();
        const mvc = gradum(this.element.anchor).mvc;
        for (const value of Object.values(mvc)) {
            if (value === undefined) continue;
            if (Array.isArray(value)) {
                for (const entry of value) this.createEntry(entry, panel);
                continue;
            }
            this.createEntry(value, panel);
        }
    }

    private createEntry(value: any, parent: HTMLElement) {
        const registryEntry = getRegisteredEntry(value);
        if (!registryEntry) return;
        const element = GradumRichElement.create({
            leftIcon: registryEntry.category,
            text: registryEntry.name,
            rightIcon: "trash",
            parent: parent
        });
        // element.rightIcon.iconColor =
    }
}