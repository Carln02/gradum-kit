import {
    css,
    DefaultEventName,
    effect,
    Side,
    gradum,
    GradumDrawer,
    GradumRichElement,
    GradumView
} from "../../../../build/gradum-kit.esm";
import {Playlist} from "./playlist";
import {PlaylistModel} from "./playlist.model";
import {Song} from "../song/song";
import {DataHandler} from "../dataHandler";

export class PlaylistView extends GradumView<Playlist, PlaylistModel> {
    private drawer: GradumDrawer;
    private toggle: GradumRichElement;
    private emptyDrawer: HTMLElement;

    public songElements: Song[] = [];

    protected setupUIElements() {
        super.setupUIElements();
        this.drawer = GradumDrawer.create({side: Side.bottom, hideOverflow: true, offset: {open: 20}});
        this.toggle = GradumRichElement.create({leftIcon: "album-cover"});
        this.emptyDrawer = GradumRichElement.create({
            classes: "empty-playlist-placeholder",
            leftIcon: "add-song",
            text: "Drag and drop songs here to add them to the playlist."
        });
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([this.toggle, this.drawer]);
        this.drawer.thumb.style.display = "none";
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        gradum(this).on(DefaultEventName.click, () => this.drawer.open = !this.drawer.open);
    }

    @effect private updateName() {
        const newEl = !this.toggle.element;
        this.toggle.element = this.model.name;
        if (newEl) {
            (this.toggle.element as HTMLElement).contentEditable = "true";
            gradum(this.toggle.element).bypassManagerOn = () => true;
            gradum(this.toggle.element).on(DefaultEventName.click, () => this.toggle.element.focus());
        }
    }

    @effect private updatePosition() {
        gradum(this).setStyle("transform", css`translate(
            calc(${this.model.origin.x}px - 50%), 
            calc(${this.model.origin.y}px - 50%)
        )`);
    }

    @effect public updateSongs() {
        if (!this.model.songs || !this.model.songs.length) {
            gradum(this.drawer.panel).removeAllChildren().addChild(this.emptyDrawer);
            return;
        }

        gradum(this.drawer.panel).removeAllChildren();
        this.songElements.forEach(song => song.remove());
        this.songElements = [];

        this.model.songs.forEach(id =>
            DataHandler.getSong(id).then(data =>
                this.songElements.push(Song.create({data, parent: this.drawer}))
            ));
    }
}