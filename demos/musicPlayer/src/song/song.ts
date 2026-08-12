import {define, element, expose, GradumElement} from "../../../../build/gradum-kit.esm";
import {SongView} from "./song.view";
import {SongData, SongProperties} from "./song.types";
import {SongModel} from "./song.model";
import "./song.css";
import {SongMoveInteractor} from "./song.moveInteractor";

export class Song extends GradumElement<SongView, SongData, SongModel> {
    public static defaultProperties = {
        view: SongView,
        model: SongModel,
        interactors: SongMoveInteractor
    };

    @expose("model") public accessor id: string;
    @expose("model") public accessor title: string;
    @expose("model") public accessor artist: string;
    @expose("model") public accessor album : string;

    public isSong(id: string): boolean {
        return id === this.model.id;
    }

    public delete() {
        this.remove();
    }
}

define(Song, "gradum-song");