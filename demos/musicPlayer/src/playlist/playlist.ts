import {Coordinate, define, element, expose, isUndefined, GradumElement, constrainer} from "../../../../build/gradum-kit.esm";
import {PlaylistView} from "./playlist.view";
import {PlaylistData, PlaylistProperties} from "./playlist.types";
import {PlaylistModel} from "./playlist.model";
import "./playlist.css";
import {Song} from "../song/song";
import {PlaylistConstrainer} from "./playlist.constrainer";

export class Playlist extends GradumElement<PlaylistView, PlaylistData, PlaylistModel> {
    public static defaultProperties = {
        view: PlaylistView,
        model: PlaylistModel,
        constrainers: PlaylistConstrainer
    };

    @expose("model") public origin: Coordinate;
    @constrainer("constrainer") private constrainer: PlaylistConstrainer;

    public addSong(song: Song, yCoordinate: number) {
        if (!this.constrainer.testAddingSong(song)) return;
        const targetIndex = this.getSongIndexFromCoordinate(yCoordinate);
        if (!isUndefined(targetIndex)) this.model.songs.splice(targetIndex, 0, song.id);
        else this.model.songs.push(song.id);
        this.view.updateSongs();
    }

    public removeSong(song: Song) {
        const id = this.model.songs.indexOf(song.id);
        if (id >= 0) this.model.songs.splice(id, 1);
        this.view.updateSongs();
    }

    private getSongIndexFromCoordinate(yCoordinate: number) {
        let smallestY = Infinity;
        let targetIndex: number;

        this.view.songElements.forEach((entry, index) => {
            const rect = entry.getBoundingClientRect();
            if (rect.top < smallestY && rect.top > yCoordinate) {
                smallestY = rect.top;
                targetIndex = index;
            }
        });

        return targetIndex;
    }

    public delete() {
        this.remove();
    }
}

define(Playlist, "gradum-playlist");