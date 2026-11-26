import {GradumButton, define, effect, gradum, signal, Propagation} from "../../../../build/gradum-kit.esm";
import "./sideButton.css";

export class SideButton extends GradumButton {
    @signal public level: number = 1;
    public hideDelay: number = 500;

    protected host: HTMLElement;
    protected hideTimeout: ReturnType<typeof setTimeout>;

    protected readonly show = (e: Event) => {
        if (e.target !== this.host) return;
        clearTimeout(this.hideTimeout);
        gradum(this).show(true);
    };
    protected readonly hide = (e: Event) => {
        if (e.target !== this.host) return;
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => gradum(this).show(false), this.hideDelay);
    };

    public initialize() {
        gradum(this).show(false);
        this.onAttach.add(() => this.updateHost(this.parentElement));
        this.onDetach.add(() => this.updateHost(undefined));
        super.initialize();
        gradum(this).on("gradum-click", () => Propagation.stopPropagation);
    }

    protected updateHost(host: HTMLElement) {
        if (host === this.host) return;
        clearTimeout(this.hideTimeout);
        gradum(this.host).removeListener("mouseenter", this.show);
        gradum(this.host).removeListener("mouseleave", this.hide);
        this.host = host;
        gradum(this.host).on("mouseenter", this.show);
        gradum(this.host).on("mouseleave", this.hide);
        gradum(this).show(this.host?.matches(":hover") ?? false);
    }

    @effect protected updateLevel() {
        this.style.setProperty("--side-button-level", String(this.level - 1));
    }
}

define(SideButton, "my-side-button");
