import {DefaultEventName, div, gradum, gradumInput, GradumInput, GradumSelect, GradumView} from "../../../../build/gradum-kit.esm";
import {SongsPanel} from "./songsPanel";
import {Song, song} from "../song/song";

export class SongsPanelView extends GradumView<SongsPanel> {
    private search: GradumInput;
    private panel: HTMLElement;
    private select: GradumSelect<string, string, Song>;

    protected setupUIElements() {
        super.setupUIElements();
        this.search = gradumInput({rightIcon: "search", input: {type: "search", placeholder: "Search..."}});
        this.panel = div({classes: "songs-panel-container"});

        this.select = new GradumSelect({
            parent: this.panel,
            getValue: entry => entry.title,
            getSecondaryValue: entry => entry.artist,
            onEnabled: (b, entry) => gradum(entry).setStyle("display", b ? "" : "none"),
        });

        this.model.data
            .sort((a, b) => a.title.localeCompare(b.title))
            .forEach(entry => this.select.addEntry(song({data: entry})));
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([this.search, this.panel]);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this.search).on(DefaultEventName.input, () => {
            const value = this.search.value.toLowerCase();
            this.select.entries.forEach(entry => {
                const enable = entry.title.toLowerCase().includes(value)
                    || entry.artist.toLowerCase().includes(value)
                    || entry.album.toLowerCase().includes(value);
                this.select.enable(enable, entry);
            });
        });
    }
}