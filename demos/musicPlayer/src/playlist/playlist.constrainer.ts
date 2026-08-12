import {GradumConstrainer} from "../../../../build/gradum-kit.esm";
import {Playlist} from "./playlist";
import {PlaylistView} from "./playlist.view";
import {PlaylistModel} from "./playlist.model";
import {Song} from "../song/song";

export class PlaylistConstrainer extends GradumConstrainer<Playlist, PlaylistView, PlaylistModel> {
    public keyName = "constrainer";
    public constrainerName = "playlist";

    public testAddingSong(song: Song) {
        return !this.model.songs.find(entry => entry === song.id);
    }
}